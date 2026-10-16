import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Brain,
  ChevronDown,
  Clock,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MathText from "@/components/MathText";
import TaskListCard from "@/components/TaskListCard";
import { createPageUrl } from "@/utils";
import {
  filterArticleByContentModes,
  getArticleContentModes,
  getSampleArticleById,
  parseArticleContentModesParam,
} from "@/utils/sample-articles";
import { publicSupabase } from "@/supabase-config.js";
import { isMaturalneTask, isStemTask, mapDbTaskRow } from "@/utils/map-db-task";
import { shouldNavigateTaskTile } from "@/utils/task-tile-nav";
import { buildTaskDetailsNavState } from "@/utils/task-details-nav";
import { cn } from "@/lib/utils";

const noteColors = {
  accent: {
    border: "border-blue-200 dark:border-blue-800",
    borderStrong: "border-l-blue-500 dark:border-l-blue-400",
    bg: "bg-blue-50/70 dark:bg-blue-950/30",
    bgSoft: "bg-blue-50/50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-300",
    textStrong: "text-blue-900 dark:text-blue-100",
    chip: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    solid: "bg-blue-600 text-white dark:bg-blue-500",
  },
  warn: {
    wrap: "border-rose-200 bg-rose-50/80 dark:border-rose-900 dark:bg-rose-950/40",
    title: "text-rose-800 dark:text-rose-200",
    body: "text-rose-900/90 dark:text-rose-100/90",
  },
  frame:
    "rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/40",
};

const calloutStyles = {
  insight: {
    wrap: cn("border px-4 py-3", noteColors.accent.border, noteColors.accent.bg),
    title: noteColors.accent.text,
    body: "text-slate-700 dark:text-slate-200",
    icon: Lightbulb,
  },
  definition: {
    wrap: cn("border px-4 py-3", noteColors.accent.border, noteColors.accent.bg),
    title: noteColors.accent.text,
    body: "text-slate-700 dark:text-slate-200",
    icon: BookOpen,
  },
  why: {
    wrap: cn("border px-4 py-3", noteColors.accent.border, noteColors.accent.bg),
    title: noteColors.accent.text,
    body: "text-slate-700 dark:text-slate-200",
    icon: Brain,
  },
  pitfall: {
    wrap: cn("border px-4 py-3", noteColors.warn.wrap),
    title: noteColors.warn.title,
    body: noteColors.warn.body,
    icon: AlertTriangle,
  },
};

const formulaAccents = {
  blue: {
    shell: cn("border-l-4", noteColors.accent.borderStrong, noteColors.accent.bg),
    chip: noteColors.accent.text,
  },
};

const FormulaPreviewContext = createContext(null);

function collectArticleFormulas(article) {
  const map = new Map();
  for (const section of article?.sections || []) {
    for (const block of section.blocks || []) {
      if (block.type !== "formula-list") continue;
      for (const item of block.items || []) {
        if (item?.label) {
          map.set(item.label, item);
        }
      }
    }
  }
  return map;
}

function formulaDomId(label) {
  return `formula-ref-${String(label || "").replace(/[^\w-]+/g, "")}`;
}

function FormulaRefChip({ label }) {
  const preview = useContext(FormulaPreviewContext);

  return (
    <span
      role="button"
      tabIndex={0}
      className={cn(
        "mx-0.5 inline-flex -translate-y-[0.12em] cursor-pointer items-center rounded-md border px-1.5 py-0.5 align-middle font-mono text-[0.85em] font-semibold leading-none transition",
        "border-blue-200 bg-blue-50 text-blue-700 hover:shadow-sm dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
      )}
      onMouseEnter={() => preview?.showFormula(label)}
      onMouseLeave={() => preview?.hideFormula()}
      onFocus={() => preview?.showFormula(label)}
      onBlur={() => preview?.hideFormula()}
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        preview?.focusFormula?.(label);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          preview?.focusFormula?.(label);
        }
      }}
    >
      {label}
    </span>
  );
}

function renderRichSegment(text, keyPrefix, formulas) {
  const parts = String(text ?? "").split(/(\*\*[^*]+\*\*|\(\d+\))/g);

  return parts.map((part, index) => {
    if (!part) return null;
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      return (
        <strong key={key} className="font-semibold text-slate-900 dark:text-white">
          {renderRichSegment(inner, `${key}-b`, formulas)}
        </strong>
      );
    }

    const formula = formulas?.get?.(part);
    if (formula) {
      return <FormulaRefChip key={key} label={part} />;
    }

    return <MathText key={key} text={part} />;
  });
}

function ArticleRichText({ text, className = "" }) {
  const preview = useContext(FormulaPreviewContext);
  const formulas = preview?.formulas;

  return (
    <span className={cn("math-text-ui", className)}>
      {renderRichSegment(text, "rt", formulas)}
    </span>
  );
}

function FormulaPreviewToast({ formula }) {
  if (typeof document === "undefined") return null;
  const accent = formula
    ? formulaAccents[formula.accent] || formulaAccents.blue
    : null;

  return createPortal(
    <AnimatePresence>
      {formula && accent ? (
        <motion.div
          key={formula.label}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="pointer-events-none fixed inset-x-0 top-4 z-[90] flex justify-center px-4"
        >
          <div className="w-full max-w-xl">
            <div
              className={cn(
                "overflow-hidden rounded-xl border-l-4 shadow-2xl shadow-slate-900/15 ring-1 ring-black/5 dark:shadow-black/40 dark:ring-white/10",
                accent.shell,
              )}
            >
              <div className="bg-white/90 px-4 py-3 backdrop-blur-sm dark:bg-slate-900/90 sm:px-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className={cn("text-[11px] font-semibold uppercase tracking-wide", accent.chip)}>
                    Wzór {formula.label}
                  </span>
                  {formula.caption ? (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {formula.caption}
                    </span>
                  ) : null}
                </div>
                <div className="overflow-x-auto py-1 text-center text-base sm:text-lg">
                  <MathText text={`$$${formula.latex}$$`} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function FormulaBlock({ block }) {
  const preview = useContext(FormulaPreviewContext);
  const [open, setOpen] = useState(false);
  const accent = formulaAccents[block.accent] || formulaAccents.blue;
  const hasExample = Boolean(block.example);
  const domId = formulaDomId(block.label);

  useEffect(() => {
    if (!hasExample || !block.label) return;
    if (preview?.focusedLabel !== block.label) return;
    setOpen(true);
  }, [preview?.focusedLabel, preview?.focusNonce, block.label, hasExample]);

  return (
    <div
      id={domId}
      className={cn(
        "overflow-hidden rounded-lg border-l-4 transition-shadow scroll-mt-24",
        accent.shell,
      )}
    >
      <div
        role={hasExample ? "button" : undefined}
        tabIndex={hasExample ? 0 : undefined}
        aria-expanded={hasExample ? open : undefined}
        onClick={() => {
          if (!hasExample) return;
          setOpen((value) => !value);
        }}
        onKeyDown={(event) => {
          if (!hasExample) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
        className={cn(
          "space-y-2 px-4 py-3 sm:px-5",
          hasExample ? "cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02]" : "cursor-default",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 overflow-x-auto py-1 text-center text-base sm:text-lg">
            <MathText text={`$$${block.latex}$$`} />
          </div>
          {block.label ? (
            <span className="shrink-0 pt-1 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
              {block.label}
            </span>
          ) : null}
        </div>

        {block.caption ? (
          <p className="text-center text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
            {block.caption}
          </p>
        ) : null}

        {hasExample ? (
          <p className={cn("text-center text-[11px] font-semibold uppercase tracking-wide", accent.chip)}>
            {open ? "Kliknij, aby zwinąć" : "Kliknij, aby rozwinąć"}
          </p>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {open && hasExample ? (
          <motion.div
            key="formula-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-slate-200/80 px-4 pb-4 pt-3 dark:border-slate-700 sm:px-5">
              {hasExample ? (
                <div className={cn("px-3 py-3", noteColors.frame, noteColors.accent.bgSoft)}>
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <p className={cn("text-xs font-semibold uppercase tracking-wide", noteColors.accent.text)}>
                      Przykład
                    </p>
                    {block.example.level ? (
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          noteColors.accent.chip,
                        )}
                      >
                        {block.example.level === "rozszerzony" ? "Rozszerzenie" : "Podstawa"}
                      </span>
                    ) : null}
                  </div>
                  {block.example.prompt ? (
                    <p className="mb-2 text-sm font-medium leading-[1.6] text-slate-800 dark:text-slate-100">
                      <ArticleRichText text={block.example.prompt} />
                    </p>
                  ) : null}
                  {block.example.steps?.length ? (
                    <ol className="space-y-1.5">
                      {block.example.steps.map((step, index) => (
                        <li
                          key={`${block.label}-e-${index}`}
                          className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-2 text-sm leading-[1.6] text-slate-700 dark:text-slate-200"
                        >
                          <span className={cn("font-semibold", noteColors.accent.text)}>
                            {index + 1}.
                          </span>
                          <span className="min-w-0">
                            <ArticleRichText text={step} />
                          </span>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                  {block.example.result ? (
                    <p className="mt-2 border-t border-blue-200/80 pt-2 text-sm font-semibold text-slate-900 dark:border-blue-800 dark:text-slate-100">
                      <ArticleRichText text={block.example.result} />
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function CalloutBlock({ block }) {
  const [exampleOpen, setExampleOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const style = calloutStyles[block.variant] || calloutStyles.insight;
  const Icon = style.icon;
  const collapsible = Boolean(block.collapsible);
  const example = block.example;
  const hasExample = Boolean(
    example && (example.wrong || example.right || example.note || example.prompt),
  );
  const showBody = !collapsible || contentOpen;

  return (
    <aside className={cn("rounded-lg", style.wrap)}>
      {collapsible ? (
        <button
          type="button"
          onClick={() => setContentOpen((value) => !value)}
          aria-expanded={contentOpen}
          className={cn(
            "flex w-full items-center gap-2 text-left text-sm font-semibold",
            style.title,
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="min-w-0 flex-1">
            <ArticleRichText text={block.title} />
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              contentOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </button>
      ) : (
        <div className={cn("mb-1.5 flex items-center gap-2 text-sm font-semibold", style.title)}>
          <Icon className="h-4 w-4 shrink-0" />
          <ArticleRichText text={block.title} />
        </div>
      )}

      <AnimatePresence initial={false}>
        {showBody ? (
          <motion.div
            key="callout-body"
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: "auto", opacity: 1 }}
            exit={collapsible ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={cn("text-sm leading-[1.6]", style.body, collapsible ? "mt-1.5" : null)}>
              <ArticleRichText text={block.content} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {hasExample ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setExampleOpen((value) => !value)}
            aria-expanded={exampleOpen}
            className={cn(
              "text-[11px] font-semibold uppercase tracking-wide transition",
              style.title,
              "opacity-80 hover:opacity-100",
            )}
          >
            {exampleOpen ? "Zwiń przykład" : "Pokaż przykład"}
          </button>

          <AnimatePresence initial={false}>
            {exampleOpen ? (
              <motion.div
                key="callout-example"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className={cn("mt-2 space-y-2 px-3 py-3", noteColors.frame)}>
                  {example.prompt ? (
                    <p className={cn("text-sm font-medium leading-[1.6]", style.body)}>
                      <span className="mr-1 font-semibold">Przykład:</span>
                      <ArticleRichText text={example.prompt} />
                    </p>
                  ) : null}

                  {example.wrong ? (
                    <div className="rounded-md border border-rose-200 bg-rose-50/90 px-3 py-2 text-sm leading-[1.6] text-rose-900 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-100">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">
                        Błędnie
                      </p>
                      <ArticleRichText text={example.wrong} />
                    </div>
                  ) : null}

                  {example.right ? (
                    <div className={cn("rounded-md border px-3 py-2 text-sm leading-[1.6]", noteColors.accent.border, noteColors.accent.bg, "text-slate-800 dark:text-slate-100")}>
                      <p className={cn("mb-1 text-[11px] font-semibold uppercase tracking-wide", noteColors.accent.text)}>
                        Poprawnie
                      </p>
                      <ArticleRichText text={example.right} />
                    </div>
                  ) : null}

                  {example.note ? (
                    <p className={cn("text-sm leading-[1.6]", style.body)}>
                      <ArticleRichText text={example.note} />
                    </p>
                  ) : null}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}
    </aside>
  );
}

function ArticleBlock({ block, articleId, relatedTasks }) {
  if (block.type === "text") {
    return (
      <p className="text-base leading-[1.6] text-slate-700 dark:text-slate-200 sm:text-[17px]">
        <ArticleRichText text={block.content} />
      </p>
    );
  }

  if (block.type === "list") {
    const ordered = block.ordered === true;
    const ListTag = ordered ? "ol" : "ul";
    return (
      <ListTag
        className={cn(
          "space-y-2 pl-5 text-base leading-[1.6] text-slate-700 dark:text-slate-200 sm:text-[17px]",
          ordered ? "list-decimal" : "list-disc",
        )}
      >
        {(block.items || []).map((item, index) => (
          <li key={`${index}-${typeof item === "string" ? item.slice(0, 24) : index}`} className="pl-1">
            <ArticleRichText text={item} />
          </li>
        ))}
      </ListTag>
    );
  }

  if (block.type === "formula-list") {
    return (
      <div className="space-y-3">
        {(block.items || []).map((item) => (
          <FormulaBlock key={item.label || item.latex} block={item} />
        ))}
      </div>
    );
  }

  if (block.type === "callout") {
    return <CalloutBlock block={block} />;
  }

  if (block.type === "steps") {
    return (
      <div className={cn("px-4 py-4 sm:px-5 sm:py-5", noteColors.frame)}>
        <ol className="space-y-3">
          {(block.items || []).map((item, index) => (
            <li
              key={`${index}-${item}`}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-x-3 text-[15px] leading-[1.6] text-slate-700 dark:text-slate-200"
            >
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", noteColors.accent.solid)}>
                {index + 1}
              </span>
              <span className="min-w-0 pt-0.5">
                <ArticleRichText text={item} />
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (block.type === "guided-example") {
    return <GuidedExampleBlock block={block} />;
  }

  if (block.type === "exercise-group") {
    return <ExerciseGroupBlock block={block} />;
  }

  if (block.type === "worked-example") {
    return <WorkedExampleBlock block={block} />;
  }

  if (block.type === "related-matura-tasks") {
    return (
      <RelatedMaturaTasks
        filter={relatedTasks}
        articleId={articleId}
      />
    );
  }

  return null;
}

function CleanSolutionPanel({ lines, idKey = "clean" }) {
  const [open, setOpen] = useState(false);
  if (!lines?.length) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
      >
        <span>Rozwiązanie na czysto</span>
        <span className="text-[10px] font-medium normal-case tracking-normal text-slate-400">
          {open ? "Zwiń" : "Rozwiń"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key={`${idKey}-clean-panel`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-2 border-t border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/40">
              {lines.map((line, index) => (
                <div
                  key={`${idKey}-clean-${index}`}
                  className="overflow-x-auto text-center text-[15px] leading-8 text-slate-900 dark:text-slate-100"
                >
                  <ArticleRichText text={line} />
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ExampleResult({ text }) {
  if (!text) return null;
  return (
    <div className={cn("rounded-lg border px-3 py-2.5 text-sm font-semibold leading-[1.6] text-slate-900 dark:text-slate-100", noteColors.accent.border, noteColors.accent.bg)}>
      <span className={cn("mr-1 font-semibold", noteColors.accent.text)}>
        Wynik:
      </span>
      <ArticleRichText text={text} />
    </div>
  );
}

function GuidedExampleBlock({ block }) {
  return (
    <div className={cn("overflow-hidden", noteColors.frame)}>
      <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
        <div className="space-y-1.5">
          <p className={cn("text-xs font-semibold uppercase tracking-wide", noteColors.accent.text)}>
            {block.title || "Przykład"}
          </p>
          {block.prompt ? (
            <p className="text-base font-semibold leading-[1.6] text-slate-900 dark:text-white sm:text-[17px]">
              <ArticleRichText text={block.prompt} />
            </p>
          ) : null}
        </div>

        <ol className="space-y-3">
          {(block.steps || []).map((step, index) => (
            <li
              key={`${block.title}-${index}`}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-x-3 text-[15px] leading-[1.6] text-slate-700 dark:text-slate-200"
            >
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", noteColors.accent.solid)}>
                {index + 1}
              </span>
              <span className="min-w-0 pt-0.5">
                <ArticleRichText text={step} />
              </span>
            </li>
          ))}
        </ol>

        <ExampleResult text={block.result} />

        <CleanSolutionPanel
          lines={block.cleanSolution}
          idKey={block.title || "guided"}
        />
      </div>
    </div>
  );
}

function WorkedExampleBlock({ block }) {
  const [open, setOpen] = useState(false);
  const isRozszerzony = block.level === "rozszerzony";

  return (
    <div className={cn("overflow-hidden", noteColors.frame)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition sm:px-5",
          "hover:bg-blue-50/40 dark:hover:bg-blue-950/20",
        )}
      >
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("text-xs font-semibold uppercase tracking-wide", noteColors.accent.text)}>
              {block.title || "Przykład"}
            </span>
            {block.level ? (
              <span
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  noteColors.accent.chip,
                )}
              >
                {isRozszerzony ? "Rozszerzenie" : "Podstawa"}
              </span>
            ) : null}
          </div>
          {block.prompt ? (
            <p className="text-base font-semibold leading-[1.6] text-slate-900 dark:text-white sm:text-[17px]">
              <ArticleRichText text={block.prompt} />
            </p>
          ) : null}
          <p className={cn("text-[11px] font-semibold uppercase tracking-wide opacity-80", noteColors.accent.text)}>
            {open ? "Kliknij, aby zwinąć rozwiązanie" : "Kliknij, aby zobaczyć rozwiązanie"}
          </p>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="worked-example"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-slate-200 px-4 pb-4 pt-3 dark:border-slate-700 sm:px-5">
              {block.steps?.length ? (
                <ol className="space-y-2">
                  {block.steps.map((step, index) => (
                    <li
                      key={`${block.title}-${index}`}
                      className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-sm leading-[1.6] text-slate-700 dark:text-slate-200"
                    >
                      <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold", noteColors.accent.solid)}>
                        {index + 1}
                      </span>
                      <span className="min-w-0 pt-0.5">
                        <ArticleRichText text={step} />
                      </span>
                    </li>
                  ))}
                </ol>
              ) : null}
              <ExampleResult text={block.result} />
              <CleanSolutionPanel
                lines={block.cleanSolution}
                idKey={block.title || "worked"}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ExerciseGroupBlock({ block }) {
  const [open, setOpen] = useState(false);
  const exercises = block.exercises || [];
  const value = block.formulaLabel || block.title || "group";

  return (
    <div className={cn("overflow-hidden", noteColors.frame)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`exercise-group-${value}`}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-base font-semibold text-slate-900 transition hover:bg-blue-50/40 dark:text-white dark:hover:bg-blue-950/20 sm:px-5"
      >
        <span className="flex min-w-0 flex-wrap items-center gap-2">
          <span>
            <ArticleRichText text={block.title} />
          </span>
          <span className={cn("rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", noteColors.accent.chip)}>
            {exercises.length}{" "}
            {exercises.length === 1 ? "zadanie" : exercises.length < 5 ? "zadania" : "zadań"}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="inline-flex shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`exercise-group-${value}`}
            key={`exercise-group-panel-${value}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: { staggerChildren: 0.045, delayChildren: 0.04 },
                },
                closed: {
                  transition: { staggerChildren: 0.02, staggerDirection: -1 },
                },
              }}
              className="space-y-3 border-t border-slate-200 px-4 pb-4 pt-3 dark:border-slate-700 sm:px-5"
            >
              {exercises.map((exercise) => (
                <motion.div
                  key={exercise.number || exercise.prompt}
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: 8 },
                  }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <ExerciseBlock block={exercise} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function FillingLightbulb({ fill = 0, className = "h-4 w-4" }) {
  const clamped = Math.max(0, Math.min(1, fill));
  const clipBottom = `${(1 - clamped) * 100}%`;

  return (
    <span className={cn("relative inline-flex", className)} aria-hidden>
      <Lightbulb className="h-full w-full" />
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(${clipBottom} 0 0 0)` }}
      >
        <Lightbulb className="h-full w-full fill-current" />
      </span>
    </span>
  );
}

function ExerciseBlock({ block }) {
  const hintStages = Array.isArray(block.hints)
    ? block.hints.filter(Boolean)
    : block.hint
      ? [block.hint]
      : [];
  const hintCount = hintStages.length;
  const [hintLevel, setHintLevel] = useState(0);
  const [answerOpen, setAnswerOpen] = useState(false);
  const hasHint = hintCount > 0;
  const hintOpen = hintLevel > 0;
  const expandable = Boolean(block.answer || block.explanation?.length);
  const isRozszerzony = block.level === "rozszerzony";
  const fill = hintCount > 0 ? hintLevel / hintCount : 0;

  const advanceHint = () => {
    setHintLevel((level) => {
      if (level >= hintCount) return 0;
      return level + 1;
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60">
      <div className="space-y-3 px-4 py-3.5">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {block.number ? (
                <span className={cn("font-mono text-xs font-semibold", noteColors.accent.text)}>
                  {block.number}
                </span>
              ) : null}
              {block.level ? (
                <span
                  className={cn(
                    "rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    noteColors.accent.chip,
                  )}
                >
                  {isRozszerzony ? "Rozszerzenie" : "Podstawa"}
                </span>
              ) : null}
            </div>

            <div className={cn("px-3 py-3", noteColors.frame, "bg-slate-50/90 dark:bg-slate-900/45")}>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Polecenie
              </p>
              <p className="text-base font-semibold leading-[1.6] text-slate-900 dark:text-white sm:text-[17px]">
                <ArticleRichText text={block.prompt} />
              </p>
            </div>

            {block.options?.length ? (
              <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                {block.options.map((option) => (
                  <div
                    key={`${block.number}-${option.key}`}
                    className="mcq-option flex h-full min-h-[2.75rem] min-w-0 items-center gap-2 overflow-x-auto rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200"
                  >
                    <span className="flex h-7 w-5 shrink-0 items-center justify-start font-semibold leading-none text-slate-500 dark:text-slate-400">
                      {option.key}.
                    </span>
                    <span className="flex min-h-7 min-w-0 flex-1 items-center">
                      <ArticleRichText text={option.text} className="math-text-ui--mcq" />
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          {hasHint ? (
            <button
              type="button"
              onClick={advanceHint}
              aria-expanded={hintOpen}
              aria-label={
                hintLevel >= hintCount
                  ? "Zwiń wskazówki"
                  : hintLevel === 0
                    ? "Pokaż wskazówkę"
                    : `Pokaż kolejną wskazówkę (${hintLevel}/${hintCount})`
              }
              title={
                hintLevel >= hintCount
                  ? "Zwiń wskazówki"
                  : hintCount > 1
                    ? `Wskazówka ${Math.min(hintLevel + 1, hintCount)}/${hintCount}`
                    : "Pokaż wskazówkę"
              }
              className={cn(
                "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
                hintOpen
                  ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-300",
              )}
            >
              <FillingLightbulb fill={fill} className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <AnimatePresence initial={false}>
          {hasHint && hintOpen ? (
            <motion.div
              key={`exercise-hint-${hintLevel}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className={cn("rounded-md border px-3 py-2 text-sm leading-[1.6]", noteColors.accent.border, noteColors.accent.bg, "text-slate-800 dark:text-slate-100")}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className={cn("flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide", noteColors.accent.text)}>
                    <FillingLightbulb fill={fill} className="h-3.5 w-3.5" />
                    {hintCount > 1
                      ? `Wskazówka ${hintLevel}/${hintCount}`
                      : "Wskazówka"}
                  </div>
                  {hintCount > 1 && hintLevel < hintCount ? (
                    <span className={cn("text-[10px] font-medium opacity-80", noteColors.accent.text)}>
                      Kliknij żarówkę po więcej
                    </span>
                  ) : null}
                </div>
                <ArticleRichText text={hintStages[hintLevel - 1]} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {expandable ? (
          <button
            type="button"
            onClick={() => setAnswerOpen((value) => !value)}
            aria-expanded={answerOpen}
            className="block w-full text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 transition hover:text-blue-700 dark:text-slate-500 dark:hover:text-blue-300"
          >
            {answerOpen ? "Kliknij, aby zwinąć odpowiedź" : "Kliknij, aby rozwinąć odpowiedź"}
          </button>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {answerOpen && expandable ? (
          <motion.div
            key="exercise-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-slate-200 px-4 pb-4 pt-3 dark:border-slate-700">
              {block.answer ? (
                <div className={cn("rounded-md border px-3 py-2 text-sm leading-[1.6] text-slate-800 dark:text-slate-100", noteColors.accent.border, noteColors.accent.bg)}>
                  <span className={cn("mr-1 font-semibold", noteColors.accent.text)}>
                    Odpowiedź:
                  </span>
                  <ArticleRichText text={block.answer} />
                </div>
              ) : null}
              {block.explanation?.length ? (
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Tłumaczenie krok po kroku
                  </p>
                  <ol className="space-y-2">
                    {block.explanation.map((step, index) => (
                      <li
                        key={`${block.number}-x-${index}`}
                        className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-2.5 text-sm leading-6 text-slate-700 dark:text-slate-300"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                          {index + 1}
                        </span>
                        <span className="min-w-0">
                          <ArticleRichText text={step} />
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
              <CleanSolutionPanel
                lines={block.cleanSolution}
                idKey={block.number || block.prompt || "exercise"}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function taskMatchesArticleFilter(task, filter) {
  if (!filter) return false;
  const topic = normalizeSearchText(task.topic);
  const subtopic = normalizeSearchText(task.subtopic);
  const question = normalizeSearchText(task.question);
  const includesAny = (haystack, needles = []) =>
    needles.some((needle) => haystack.includes(normalizeSearchText(needle)));

  const topicHit = includesAny(topic, filter.topicIncludes);
  const subtopicHit = includesAny(subtopic, filter.subtopicIncludes);
  const questionHit = includesAny(question, filter.questionIncludes);
  return topicHit || subtopicHit || questionHit;
}

function RelatedMaturaTasks({ filter, articleId }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const limit = filter?.limit ?? 6;

  useEffect(() => {
    if (!filter) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const loadTasks = async () => {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await publicSupabase
        .from("tasks")
        .select("*")
        .not("arkusz", "is", null);

      if (cancelled) return;

      if (error) {
        setLoadError(error.message);
        setTasks([]);
        setLoading(false);
        return;
      }

      const matched = (data ?? [])
        .map(mapDbTaskRow)
        .filter(
          (task) =>
            task && task.question && !isStemTask(task) && isMaturalneTask(task),
        )
        .filter((task) => taskMatchesArticleFilter(task, filter))
        .slice(0, limit);

      setTasks(matched);
      setLoading(false);
    };

    loadTasks();
    return () => {
      cancelled = true;
    };
  }, [filter, limit]);

  if (!filter) return null;

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Ładowanie zadań z bazy...
        </div>
      ) : null}

      {loadError ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          Nie udało się wczytać zadań maturalnych.
        </p>
      ) : null}

      {!loading && !loadError && tasks.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
          W bazie nie znaleziono zadań maturalnych pasujących do tego tematu.
        </p>
      ) : null}

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            role="link"
            tabIndex={0}
            onClick={(event) => {
              if (!shouldNavigateTaskTile(event)) return;
              navigate(`${createPageUrl("TaskDetails")}?id=${task.id}`, {
                state: buildTaskDetailsNavState({
                  from: "article",
                  backTo: `${createPageUrl("ArticleView")}?id=${encodeURIComponent(articleId)}`,
                }),
              });
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(`${createPageUrl("TaskDetails")}?id=${task.id}`, {
                  state: buildTaskDetailsNavState({
                    from: "article",
                    backTo: `${createPageUrl("ArticleView")}?id=${encodeURIComponent(articleId)}`,
                  }),
                });
              }
            }}
            className="group/tile cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: Math.min(index * 0.03, 0.18) }}
          >
            <TaskListCard task={task} maturaLinkTarget="worksheets-list" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ArticleSection({ section, index, articleId, relatedTasks }) {
  const blocks = section.blocks || [];

  return (
    <section className="scroll-mt-24">
      <div className="mb-5 flex items-baseline gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
        <span className={cn("font-mono text-sm font-semibold", noteColors.accent.text)}>
          {section.number || String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {section.heading}
        </h2>
      </div>
      <div className="space-y-5">
        {blocks.map((block, blockIndex) => (
          <ArticleBlock
            key={`${section.heading}-${blockIndex}`}
            block={block}
            articleId={articleId}
            relatedTasks={relatedTasks}
          />
        ))}
      </div>
    </section>
  );
}

export default function ArticleView() {
  const { state, search } = useLocation();
  const params = new URLSearchParams(search);
  const idParam = params.get("id");
  const rawArticle = getSampleArticleById(idParam) ?? state?.article ?? null;
  const contentModes = useMemo(() => {
    const available = getArticleContentModes(rawArticle);
    if (Array.isArray(state?.contentModes) && state.contentModes.length > 0) {
      return parseArticleContentModesParam(state.contentModes.join(","), available);
    }
    return parseArticleContentModesParam(params.get("content"), available);
  }, [rawArticle, state?.contentModes, search]);

  const article = useMemo(
    () => filterArticleByContentModes(rawArticle, contentModes),
    [rawArticle, contentModes],
  );
  const formulas = useMemo(() => collectArticleFormulas(rawArticle), [rawArticle]);
  const [previewLabel, setPreviewLabel] = useState(null);
  const [focusedLabel, setFocusedLabel] = useState(null);
  const [focusNonce, setFocusNonce] = useState(0);
  const hideTimerRef = useRef(null);

  const showFormula = useCallback((label) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setPreviewLabel(label);
  }, []);

  const hideFormula = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setPreviewLabel(null);
      hideTimerRef.current = null;
    }, 80);
  }, []);

  const focusFormula = useCallback((label) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setFocusedLabel(label);
    setFocusNonce((value) => value + 1);
    const node = document.getElementById(formulaDomId(label));
    if (node) {
      setPreviewLabel(null);
      node.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setPreviewLabel(label);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const previewFormula = previewLabel ? formulas.get(previewLabel) ?? null : null;
  const previewApi = useMemo(
    () => ({
      formulas,
      showFormula,
      hideFormula,
      focusFormula,
      focusedLabel,
      focusNonce,
    }),
    [formulas, showFormula, hideFormula, focusFormula, focusedLabel, focusNonce],
  );

  const modeLabels = contentModes
    .map((mode) => (mode === "rozszerzenie" ? "Rozszerzenie" : "Podstawa"))
    .join(" · ");

  if (!rawArticle || !article) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-24">
        <p className="text-slate-500 dark:text-slate-400">Nie znaleziono notatki.</p>
        <Link
          to={createPageUrl("Course")}
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Wróć do Kursy i dydaktyka
        </Link>
      </div>
    );
  }

  return (
    <FormulaPreviewContext.Provider value={previewApi}>
      <FormulaPreviewToast formula={previewFormula} />
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto max-w-3xl"
        >
          <Link to={createPageUrl("Course")}>
            <span className="mb-6 inline-flex items-center text-sm text-gray-600 hover:underline dark:text-slate-400">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Powrót do Kursy i dydaktyka
            </span>
          </Link>

          <header className="mb-10 space-y-5 border-b border-slate-200 pb-8 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300"
              >
                Notatka
              </Badge>
              <span className="rounded px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                {article.topic}
              </span>
              {article.subtopic ? (
                <span className="rounded px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  {article.subtopic}
                </span>
              ) : null}
              <span className="rounded px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {modeLabels}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                {article.readMinutes} min
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {article.title}
              </h1>
            </div>

            {article.legend?.length ? (
              <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400">
                {article.legend.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-1.5">
                    <span className={cn("h-2.5 w-2.5 rounded-full", item.dot)} />
                    {item.label}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          <div className="space-y-10">
            {(article.sections || []).map((section, index) => (
              <ArticleSection
                key={`${article.id}-${section.heading}`}
                section={section}
                index={index}
                articleId={article.id}
                relatedTasks={article.relatedTasks}
              />
            ))}
          </div>
        </motion.article>
      </div>
    </FormulaPreviewContext.Provider>
  );
}
