import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MathText from "@/components/MathText";

function splitPreservingDisplayMath(text) {
  const raw = String(text ?? "");
  const chunks = [];
  const re = /\$\$[\s\S]+?\$\$/g;
  let last = 0;
  let match;
  while ((match = re.exec(raw)) !== null) {
    if (match.index > last) {
      chunks.push({ type: "text", value: raw.slice(last, match.index) });
    }
    chunks.push({ type: "math", value: match[0] });
    last = match.index + match[0].length;
  }
  if (last < raw.length) {
    chunks.push({ type: "text", value: raw.slice(last) });
  }
  return chunks;
}

function flattenToItems(text) {
  const items = [];
  splitPreservingDisplayMath(text).forEach((chunk) => {
    if (chunk.type === "math") {
      items.push({ kind: "math", value: chunk.value });
      return;
    }
    chunk.value.split("\n").forEach((line) => {
      items.push({ kind: "line", value: line });
    });
  });
  return items;
}

function stripBoldMarkers(line) {
  const m = String(line)
    .trim()
    .match(/^\*\*(.+)\*\*$/);
  return m ? m[1].trim() : null;
}

function classifyHeader(title) {
  const t = String(title ?? "").toLowerCase();
  if (/zasady\s+oceniania/.test(t)) {
    return {
      box: "border-amber-200 bg-amber-50/90 dark:border-amber-800/60 dark:bg-amber-950/30",
      title: "text-amber-900 dark:text-amber-100",
      bar: "bg-amber-500",
      trigger: "hover:bg-amber-100/70 dark:hover:bg-amber-900/40",
    };
  }
  if (/sposob|rozwi.zan|klucza\s+cke/.test(t)) {
    return {
      box: "border-sky-200 bg-sky-50/90 dark:border-sky-800/60 dark:bg-sky-950/30",
      title: "text-sky-900 dark:text-sky-100",
      bar: "bg-sky-500",
      trigger: "hover:bg-sky-100/70 dark:hover:bg-sky-900/40",
    };
  }
  if (/nasza\s+odpowied/.test(t)) {
    return {
      box: "border-emerald-200 bg-emerald-50/90 dark:border-emerald-800/60 dark:bg-emerald-950/30",
      title: "text-emerald-900 dark:text-emerald-100",
      bar: "bg-emerald-500",
      trigger: "hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40",
    };
  }
  return {
    box: "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/50",
    title: "text-slate-900 dark:text-slate-100",
    bar: "bg-slate-400",
    trigger: "hover:bg-slate-100 dark:hover:bg-slate-800/60",
  };
}

function classifySubhead(title) {
  const t = String(title ?? "").toLowerCase();
  if (/^2\s*pkt/.test(t)) {
    return "border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200";
  }
  if (/^1\s*pkt/.test(t)) {
    return "border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200";
  }
  if (/^0\s*pkt/.test(t)) {
    return "border-rose-300 bg-rose-100 text-rose-900 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200";
  }
  if (/^uwagi/.test(t)) {
    return "border-violet-300 bg-violet-100 text-violet-900 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-200";
  }
  if (/^spos[oó]b\b/i.test(title)) {
    return "border-sky-300 bg-sky-100 text-sky-900 dark:border-sky-700 dark:bg-sky-950/50 dark:text-sky-200";
  }
  return "border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200";
}

function isMajorSectionTitle(title) {
  const t = String(title ?? "").toLowerCase();
  return (
    /zasady\s+oceniania/.test(t) ||
    /sposoby\s+z\s+klucza/.test(t) ||
    /przyk.adowe\s+rozwi.zanie/.test(t) ||
    /nasza\s+odpowied/.test(t)
  );
}

function isSubSectionTitle(title) {
  const t = String(title ?? "").toLowerCase();
  return (
    /^\d\s*pkt/.test(t) ||
    /^uwagi/.test(t) ||
    /^spos[oó]b\b/.test(t)
  );
}

function renderInlineMarkdown(text, keyPrefix) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold">
          <MathText text={part.slice(2, -2)} className="math-text-ui--flow" />
        </strong>
      );
    }
    return (
      <MathText
        key={`${keyPrefix}-t-${i}`}
        text={part}
        className="math-text-ui--flow"
      />
    );
  });
}

function groupIntoSections(items) {
  const sections = [];
  let current = { title: null, blocks: [] };

  const pushSection = () => {
    if (current.title || current.blocks.length) sections.push(current);
  };

  items.forEach((item) => {
    if (item.kind === "line") {
      const bold = stripBoldMarkers(item.value);
      if (bold && isMajorSectionTitle(bold)) {
        pushSection();
        current = { title: bold, blocks: [] };
        return;
      }
    }
    current.blocks.push(item);
  });
  pushSection();
  return sections;
}

function groupIntoSubsections(blocks) {
  const groups = [];
  let current = { title: null, blocks: [] };

  const push = () => {
    if (current.title || current.blocks.some((b) => String(b.value ?? "").trim())) {
      groups.push(current);
    }
  };

  blocks.forEach((item) => {
    if (item.kind === "line") {
      const bold = stripBoldMarkers(item.value);
      if (bold && isSubSectionTitle(bold)) {
        push();
        current = { title: bold, blocks: [] };
        return;
      }
    }
    current.blocks.push(item);
  });
  push();
  return groups;
}

function renderBodyBlocks(blocks, keyPrefix) {
  const nodes = [];

  blocks.forEach((item, idx) => {
    const key = `${keyPrefix}-${idx}`;

    if (item.kind === "math") {
      nodes.push(
        <div
          key={key}
          className="my-2 overflow-x-auto rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-950/40"
        >
          <MathText text={item.value} className="math-text-ui--flow" />
        </div>,
      );
      return;
    }

    const trimmed = String(item.value ?? "").trim();
    if (!trimmed) {
      nodes.push(<div key={key} className="h-2" />);
      return;
    }

    if (/^ALBO\b/i.test(trimmed)) {
      nodes.push(
        <div key={key} className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            albo
          </span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>,
      );
      return;
    }

    nodes.push(
      <p
        key={key}
        className={`leading-relaxed text-slate-800 dark:text-slate-200 ${
          trimmed.startsWith("–") || trimmed.startsWith("-")
            ? "border-l-2 border-slate-200 pl-3 dark:border-slate-600"
            : ""
        }`}
      >
        {renderInlineMarkdown(item.value, key)}
      </p>,
    );
  });

  return nodes;
}

function SectionAccordion({ sections, prefix }) {
  if (!sections.length) return null;

  return (
    <Accordion type="multiple" className="space-y-3">
      {sections.map((section, i) => {
        const title = section.title || `Sekcja ${i + 1}`;
        const style = classifyHeader(title);
        const value = `${prefix}-${i}`;
        const subsections = groupIntoSubsections(section.blocks);
        const hasNamedSubs = subsections.some((s) => s.title);

        return (
          <AccordionItem
            key={value}
            value={value}
            className={`overflow-hidden rounded-xl border shadow-sm !border-b ${style.box}`}
          >
            <div className="flex items-stretch">
              <div className={`w-1.5 shrink-0 ${style.bar}`} />
              <AccordionTrigger
                className={`flex-1 px-3 py-2.5 text-left text-xs font-extrabold uppercase tracking-wide hover:no-underline ${style.title} ${style.trigger}`}
              >
                {title}
              </AccordionTrigger>
            </div>
            <AccordionContent className="border-t border-black/5 px-3 pb-3 pt-2 dark:border-white/10">
              {hasNamedSubs ? (
                <Accordion type="multiple" className="space-y-2">
                  {subsections.map((sub, j) => {
                    if (!sub.title) {
                      return (
                        <div key={`${value}-plain-${j}`} className="space-y-1.5">
                          {renderBodyBlocks(sub.blocks, `${value}-p-${j}`)}
                        </div>
                      );
                    }
                    const chip = classifySubhead(sub.title);
                    const subValue = `${value}-sub-${j}`;
                    return (
                      <AccordionItem
                        key={subValue}
                        value={subValue}
                        className="overflow-hidden rounded-lg border !border-b border-slate-200/80 bg-white/70 dark:border-slate-700 dark:bg-slate-950/30"
                      >
                        <AccordionTrigger className="px-3 py-2 hover:no-underline">
                          <span
                            className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold tracking-wide ${chip}`}
                          >
                            <MathText
                              text={sub.title}
                              className="math-text-ui--flow"
                            />
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-1.5 px-3 pb-3">
                          {renderBodyBlocks(sub.blocks, subValue)}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <div className="space-y-1.5">
                  {renderBodyBlocks(section.blocks, value)}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default function CkeSolutionText({
  text,
  naszaOdpowiedz = null,
  className = "",
}) {
  const raw = String(text ?? "").trim();
  const nasza = String(naszaOdpowiedz ?? "").trim();

  const sections = raw ? groupIntoSections(flattenToItems(raw)) : [];
  if (nasza) {
    sections.push({
      title: "Nasza odpowiedź",
      blocks: flattenToItems(nasza),
    });
  } else if (sections.length) {
    sections.push({
      title: "Nasza odpowiedź",
      blocks: [
        {
          kind: "line",
          value: "Wkrótce dodamy tu nasze opracowanie tego zadania.",
        },
      ],
    });
  }

  if (!sections.length) return null;

  return (
    <div className={className}>
      <SectionAccordion sections={sections} prefix="cke-sec" />
    </div>
  );
}
