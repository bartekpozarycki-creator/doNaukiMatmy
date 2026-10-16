import {
  writeFileSync,
  mkdirSync,
  unlinkSync,
  existsSync,
  copyFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import katex from "katex";
import { chromium } from "playwright";
import { sampleArticles } from "../src/utils/sample-articles.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "exports");
const fileBase = "zadania-logarytm-zamiana-podstaw";
const outPdf = join(outDir, `${fileBase}.pdf`);
const outHtml = join(outDir, `${fileBase}.html`);
const desktopPdf = join(
  process.env.USERPROFILE || process.env.HOME || "",
  "Desktop",
  `${fileBase}.pdf`,
);

const MATH_PART_RE =
  /(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g;

function normalizeDashes(text) {
  return String(text ?? "")
    .replace(/\u2014|\u2013/g, "-")
    .replace(/−/g, "-");
}

function stripSiteRefs(text) {
  return normalizeDashes(text)
    .replace(/\s*wzór\s*\(\d+\)/gi, "")
    .replace(/\s*\(\d+\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function renderMath(text) {
  return normalizeDashes(text)
    .split(MATH_PART_RE)
    .map((part, index) => {
      if (!part) return "";
      const isDisplay =
        (part.startsWith("$$") && part.endsWith("$$")) ||
        (part.startsWith("\\[") && part.endsWith("\\]"));
      const isInline =
        (part.startsWith("$") && part.endsWith("$")) ||
        (part.startsWith("\\(") && part.endsWith("\\)"));
      if (!isDisplay && !isInline) return part;

      let latex = part;
      if (part.startsWith("$$")) latex = part.slice(2, -2);
      else if (part.startsWith("\\[")) latex = part.slice(2, -2);
      else if (part.startsWith("$")) latex = part.slice(1, -1);
      else latex = part.slice(2, -2);

      try {
        return katex.renderToString(latex, {
          throwOnError: false,
          displayMode: isDisplay,
        });
      } catch {
        return part;
      }
    })
    .join("");
}

function findExercises() {
  for (const article of sampleArticles) {
    for (const section of article.sections || []) {
      for (const block of section.blocks || []) {
        if (
          block.type === "exercise-group" &&
          (block.formulaLabel === "(7)" ||
            String(block.title || "").includes("(7)") ||
            String(block.title || "").includes("(8)"))
        ) {
          return block.exercises || [];
        }
      }
    }
  }
  return [];
}

function optionsHtml(options) {
  if (!options?.length) return "";
  return `<div class="options">${options
    .map(
      (option) =>
        `<div class="option"><span class="opt-key">${option.key}.</span><span>${renderMath(option.text)}</span></div>`,
    )
    .join("")}</div>`;
}

function listHtml(items, className = "") {
  if (!items?.length) return "";
  return `<ol class="${className}">${items
    .map((item) => `<li>${renderMath(item)}</li>`)
    .join("")}</ol>`;
}

function buildHtml(exercises) {
  const katexCss = pathToFileURL(
    join(__dirname, "..", "node_modules", "katex", "dist", "katex.min.css"),
  ).href;

  const tasks = exercises
    .map((exercise, index) => {
      const n = index + 1;
      return `<article class="exercise">
      <header><span class="num">Zadanie ${n}</span></header>
      <div class="prompt">${renderMath(exercise.prompt)}</div>
      ${optionsHtml(exercise.options)}
    </article>`;
    })
    .join("\n");

  const solutions = exercises
    .map((exercise, index) => {
      const n = index + 1;
      const isProof = /wyka[zż]/i.test(String(exercise.prompt || ""));
      const explanation = Array.isArray(exercise.explanation)
        ? exercise.explanation
        : [];
      const clean = Array.isArray(exercise.cleanSolution)
        ? exercise.cleanSolution
        : [];
      return `<article class="solution">
      <header>
        <span class="num">Zadanie ${n}</span>
        ${
          isProof
            ? ""
            : `<span class="answer-chip">Odpowiedź: ${renderMath(stripSiteRefs(exercise.answer || ""))}</span>`
        }
      </header>
      ${
        explanation.length
          ? `<div class="block"><h3>${isProof ? "Dowód" : "Rozwiązanie"}</h3>${listHtml(explanation)}</div>`
          : ""
      }
      ${
        clean.length
          ? `<div class="block clean"><h3>Rozwiązanie na czysto</h3>${listHtml(clean, "clean-list")}</div>`
          : ""
      }
    </article>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <title>Zadania - logarytm, zamiana podstaw</title>
  <link rel="stylesheet" href="${katexCss}" />
  <style>
    @page { size: A4; margin: 16mm 14mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", "Calibri", Arial, sans-serif;
      color: #0f172a;
      font-size: 12.5pt;
      line-height: 1.45;
    }
    h1 { font-size: 18pt; margin: 0 0 4px; }
    .subtitle { color: #475569; margin: 0 0 18px; font-size: 11pt; }
    .exercise, .solution {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 12px 14px;
      margin: 0 0 12px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    header {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
      align-items: baseline;
      flex-wrap: wrap;
    }
    .num { font-weight: 700; }
    .prompt { margin-bottom: 8px; }
    .options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 12px;
      margin-top: 8px;
    }
    .option {
      display: flex;
      gap: 8px;
      align-items: center;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 6px 8px;
      min-height: 34px;
    }
    .opt-key {
      font-weight: 700;
      color: #475569;
      width: 1.2em;
      flex-shrink: 0;
    }
    .katex-display { margin: 0.55em 0; }
    .solutions {
      break-before: page;
      page-break-before: always;
    }
    .answer-chip {
      font-size: 11pt;
      font-weight: 600;
      color: #065f46;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 999px;
      padding: 3px 10px;
    }
    .block { margin-top: 8px; }
    .block h3 {
      margin: 0 0 6px;
      font-size: 11pt;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #334155;
    }
    ol { margin: 0; padding-left: 1.25rem; }
    ol li { margin: 0.25rem 0; }
    .clean {
      margin-top: 10px;
      border-top: 1px dashed #cbd5e1;
      padding-top: 8px;
    }
    .clean-list { list-style: none; padding-left: 0; }
    .clean-list li { padding: 2px 0; }
  </style>
</head>
<body>
  <h1>Zadania - logarytm, zamiana podstaw</h1>
  <p class="subtitle">Poziom rozszerzony - ${exercises.length} zadań</p>
  ${tasks}
  <section class="solutions">
    <h1>Odpowiedzi i rozwiązania</h1>
    <p class="subtitle">Klucz + pełne rozwiązania</p>
    ${solutions}
  </section>
</body>
</html>`;
}

const exercises = findExercises();
if (!exercises.length) {
  console.error("Nie znaleziono zadań z grupy (7)/(8).");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const html = buildHtml(exercises);
writeFileSync(outHtml, html, "utf8");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(outHtml).href, { waitUntil: "networkidle" });
await page.pdf({
  path: outPdf,
  format: "A4",
  printBackground: true,
  margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
});
await browser.close();

copyFileSync(outPdf, desktopPdf);
console.log(`OK: ${exercises.length} zadań`);
console.log(outPdf);
console.log(desktopPdf);
