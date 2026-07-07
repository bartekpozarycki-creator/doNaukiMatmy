import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

const MATH_PART_RE =
  /(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g;

function isInlineFriendlyLatex(latex) {
  const trimmed = latex.trim();
  if (!trimmed) return true;
  if (trimmed.includes("\n")) return false;
  if (/\\begin\{/.test(trimmed)) return false;
  return true;
}

function renderLatexPart(latex, displayDelimiter, key) {
  const inline = !displayDelimiter || isInlineFriendlyLatex(latex);
  try {
    const html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: !inline,
    });
    return (
      <span
        key={key}
        className={inline ? "math-text-ui__math-inline" : "math-text-ui__math-display"}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <span key={key}>{latex}</span>;
  }
}

function normalizePlainPart(part) {
  return part.replace(/−/g, "-").replace(/\s+/g, " ");
}

export default function MathText({ text, className = "" }) {
  const parts = String(text ?? "").replace(/−/g, "-").split(MATH_PART_RE);

  return (
    <span className={cn("math-text-ui", className)}>
      {parts.map((part, i) => {
        if (!part) return null;

        if (
          (part.startsWith("$$") && part.endsWith("$$")) ||
          (part.startsWith("\\[") && part.endsWith("\\]"))
        ) {
          const latex = part.startsWith("$$") ? part.slice(2, -2) : part.slice(2, -2);
          return renderLatexPart(latex, true, i);
        }

        if (
          (part.startsWith("$") && part.endsWith("$")) ||
          (part.startsWith("\\(") && part.endsWith("\\)"))
        ) {
          const latex = part.startsWith("$") ? part.slice(1, -1) : part.slice(2, -2);
          return renderLatexPart(latex, false, i);
        }

        return <span key={i}>{normalizePlainPart(part)}</span>;
      })}
    </span>
  );
}
