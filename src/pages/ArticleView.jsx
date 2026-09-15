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
  Clock,
  Lightbulb,
  Loader2,
  Sigma,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { isMaturalneTask, mapDbTaskRow } from "@/utils/map-db-task";
import { shouldNavigateTaskTile } from "@/utils/task-tile-nav";
import { buildTaskDetailsNavState } from "@/utils/task-details-nav";
import { cn } from "@/lib/utils";

const calloutStyles = {
  insight: {
    wrap: "border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/40",
    title: "text-emerald-800 dark:text-emerald-200",
    body: "text-emerald-900/85 dark:text-emerald-100/85",
    icon: Lightbulb,
  },
  pitfall: {
    wrap: "border-rose-200 bg-rose-50/80 dark:border-rose-900 dark:bg-rose-950/40",
    title: "text-rose-800 dark:text-rose-200",
    body: "text-rose-900/85 dark:text-rose-100/85",
    icon: AlertTriangle,
  },
  example: {
    wrap: "border-sky-200 bg-sky-50/80 dark:border-sky-800 dark:bg-sky-950/40",
    title: "text-sky-800 dark:text-sky-200",
    body: "text-sky-900/85 dark:text-sky-100/85",
    icon: BookOpen,
  },
  why: {
    wrap: "border-indigo-200 bg-indigo-50/80 dark:border-indigo-800 dark:bg-indigo-950/40",
    title: "text-indigo-800 dark:text-indigo-200",
    body: "text-indigo-900/85 dark:text-indigo-100/85",
    icon: Brain,
  },
};

const formulaAccents = {
  blue: {
    shell: "border-blue-400 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/35",
    panel: "border-blue-200/80 bg-white/70 dark:border-blue-800/60 dark:bg-slate-900/40",
    chip: "text-blue-700 dark:text-blue-300",
  },
  teal: {
    shell: "border-teal-400 bg-teal-50/70 dark:border-teal-500 dark:bg-teal-950/35",
    panel: "border-teal-200/80 bg-white/70 dark:border-teal-800/60 dark:bg-slate-900/40",
    chip: "text-teal-700 dark:text-teal-300",
  },
  violet: {
    shell: "border-violet-400 bg-violet-50/70 dark:border-violet-500 dark:bg-violet-950/35",
    panel: "border-violet-200/80 bg-white/70 dark:border-violet-800/60 dark:bg-slate-900/40",
    chip: "text-violet-700 dark:text-violet-300",
  },
  rose: {
    shell: "border-rose-400 bg-rose-50/70 dark:border-rose-500 dark:bg-rose-950/35",
    panel: "border-rose-200/80 bg-white/70 dark:border-rose-800/60 dark:bg-slate-900/40",
    chip: "text-rose-700 dark:text-rose-300",
  },
};

const FormulaPreviewContext = createContext(null);

function collectArticleFormulas(article) {
  const map = new Map();
  for (const section of article?.sections || []) {
    const blocks =
      section.blocks ||
      (section.paragraphs || []).map((content) => ({ type: "text", content }));
    for (const block of blocks) {
      const items =
        block.type === "formula-list"
          ? block.items || []
          : block.type === "formula"
            ? [block]
            : [];
      for (const item of items) {
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

function ArticleRichText({ text, className = "" }) {
  const preview = useContext(FormulaPreviewContext);
  const formulas = preview?.formulas;
  const parts = String(text ?? "").split(/(\(\d+\))/g);

  if (!formulas?.size) {
    return <MathText text={text} className={className} />;
  }

  return (
    <span className={cn("math-text-ui", className)}>
      {parts.map((part, index) => {
        if (!part) return null;
        const formula = formulas.get(part);
        if (formula) {
          const accent = formulaAccents[formula.accent] || formulaAccents.blue;
          return (
            <span
              key={`ref-${index}-${part}`}
              role="button"
              tabIndex={0}
              className={cn(
                "mx-0.5 inline-flex -translate-y-[0.12em] cursor-pointer items-center rounded-md border px-1.5 py-0.5 align-middle font-mono text-[0.85em] font-semibold leading-none transition",
                accent.shell,
                accent.chip,
                "hover:shadow-sm",
              )}
              onMouseEnter={() => preview.showFormula(part)}
              onMouseLeave={() => preview.hideFormula()}
              onFocus={() => preview.showFormula(part)}
              onBlur={() => preview.hideFormula()}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                preview.focusFormula?.(part);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  preview.focusFormula?.(part);
                }
              }}
            >
              {part}
            </span>
          );
        }
        return <MathText key={`txt-${index}`} text={part} />;
      })}
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
  const [derivationOpen, setDerivationOpen] = useState(false);
  const accent = formulaAccents[block.accent] || formulaAccents.blue;
  const hasDerivation = Boolean(block.derivation?.length);
  const hasExample = Boolean(block.example);
  const expandable = hasDerivation || hasExample;
  const domId = formulaDomId(block.label);

  useEffect(() => {
    if (!expandable || !block.label) return;
    if (preview?.focusedLabel !== block.label) return;
    setOpen(true);
  }, [preview?.focusedLabel, preview?.focusNonce, block.label, expandable]);

  return (
    <div
      id={domId}
      className={cn(
        "overflow-hidden rounded-lg border-l-4 transition-shadow scroll-mt-24",
        accent.shell,
      )}
    >
      <div
        role={expandable ? "button" : undefined}
        tabIndex={expandable ? 0 : undefined}
        aria-expanded={expandable ? open : undefined}
        onClick={() => {
          if (!expandable) return;
          setOpen((value) => {
            if (value) setDerivationOpen(false);
            return !value;
          });
        }}
        onKeyDown={(event) => {
          if (!expandable) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((value) => {
              if (value) setDerivationOpen(false);
              return !value;
            });
          }
        }}
        className={cn(
          "space-y-2 px-4 py-3 sm:px-5",
          expandable ? "cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02]" : "cursor-default",
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

        {expandable ? (
          <p className={cn("text-center text-[11px] font-semibold uppercase tracking-wide", accent.chip)}>
            {open ? "Kliknij, aby zwinąć" : "Kliknij, aby rozwinąć"}
          </p>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {open && expandable ? (
          <motion.div
            key="formula-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-black/5 px-4 pb-4 pt-3 dark:border-white/10 sm:px-5">
              {hasExample ? (
                <div className="rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-3 dark:border-sky-800 dark:bg-sky-950/35">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
                      Przykład
                    </p>
                    {block.example.level ? (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          block.example.level === "rozszerzony"
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
                        )}
                      >
                        {block.example.level === "rozszerzony" ? "Rozszerzenie" : "Podstawa"}
                      </span>
                    ) : null}
                  </div>
                  {block.example.prompt ? (
                    <p className="mb-2 text-sm font-medium text-sky-900 dark:text-sky-100">
                      <ArticleRichText text={block.example.prompt} />
                    </p>
                  ) : null}
                  {block.example.steps?.length ? (
                    <ol className="space-y-1.5">
                      {block.example.steps.map((step, index) => (
                        <li
                          key={`${block.label}-e-${index}`}
                          className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-2 text-sm leading-6 text-sky-900/90 dark:text-sky-100/90"
                        >
                          <span className="font-semibold text-sky-700 dark:text-sky-300">
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
                    <p className="mt-2 border-t border-sky-200/80 pt-2 text-sm font-semibold text-sky-900 dark:border-sky-800 dark:text-sky-100">
                      <ArticleRichText text={block.example.result} />
                    </p>
                  ) : null}
                </div>
              ) : null}

              {hasDerivation ? (
                <div className={cn("overflow-hidden rounded-lg border", accent.panel)}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDerivationOpen((value) => !value);
                    }}
                  >
                    <span className={cn("text-xs font-semibold uppercase tracking-wide", accent.chip)}>
                      Wyprowadzenie
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {derivationOpen ? "Zwiń" : "Rozwiń"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {derivationOpen ? (
                      <motion.div
                        key="derivation"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 border-t border-black/5 px-3 pb-3 pt-2 dark:border-white/10">
                          <p className="text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                            Na maturze nie trzeba znać tych wyprowadzeń - to jest tu tylko w formie ciekawostki.
                          </p>
                          <ol className="space-y-2">
                            {block.derivation.map((step, index) => (
                              <li
                                key={`${block.label}-d-${index}`}
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
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ArticleBlock({ block, articleId, relatedTasks }) {
  if (block.type === "text") {
    return (
      <p className="text-base font-semibold leading-7 text-slate-900 dark:text-white sm:text-[17px] sm:leading-8">
        <ArticleRichText text={block.content} />
      </p>
    );
  }

  if (block.type === "formula") {
    return <FormulaBlock block={block} />;
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
    const style = calloutStyles[block.variant] || calloutStyles.insight;
    const Icon = style.icon;
    return (
      <aside className={cn("rounded-lg border px-4 py-3", style.wrap)}>
        <div className={cn("mb-1.5 flex items-center gap-2 text-sm font-semibold", style.title)}>
          <Icon className="h-4 w-4 shrink-0" />
          {block.title}
        </div>
        <div className={cn("text-sm leading-6", style.body)}>
          <ArticleRichText text={block.content} />
        </div>
      </aside>
    );
  }

  if (block.type === "steps") {
    const isNotebook = block.variant === "notebook";
    const list = (
      <ol className="space-y-3">
        {(block.items || []).map((item, index) => (
          <li
            key={`${index}-${item}`}
            className={cn(
              "grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-x-3 text-[15px] leading-7",
              isNotebook
                ? "text-slate-700"
                : "text-slate-700 dark:text-slate-200",
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isNotebook
                  ? "bg-slate-900 text-white"
                  : "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900",
              )}
            >
              {index + 1}
            </span>
            <span className="min-w-0">
              <ArticleRichText text={item} />
            </span>
          </li>
        ))}
      </ol>
    );

    if (!isNotebook) return list;

    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-700 dark:bg-white sm:px-5 sm:py-5">
        {list}
      </div>
    );
  }

  if (block.type === "guided-example") {
    return <GuidedExampleBlock block={block} />;
  }

  if (block.type === "exercise") {
    return <ExerciseBlock block={block} />;
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
        filter={block.filter || relatedTasks}
        articleId={articleId}
        embedded
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

function GuidedExampleBlock({ block }) {
  const isNotebook = block.variant === "notebook";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border shadow-sm",
        isNotebook
          ? "border-slate-200 bg-white dark:border-slate-700 dark:bg-white"
          : "border-sky-200/80 bg-sky-50/80 dark:border-sky-800/50 dark:bg-sky-950/30",
      )}
    >
      <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-600">
            {block.title || "Przykład prowadzony"}
          </p>
          {block.prompt ? (
            <p className="text-base font-semibold leading-7 text-slate-900 sm:text-[17px]">
              <ArticleRichText text={block.prompt} />
            </p>
          ) : null}
        </div>

        <ol className="space-y-3">
          {(block.steps || []).map((step, index) => (
            <li
              key={`${block.title}-${index}`}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-x-3 text-[15px] leading-7 text-slate-700"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="min-w-0">
                <ArticleRichText text={step} />
              </span>
            </li>
          ))}
        </ol>

        {block.result ? (
          <div className="rounded-lg border border-emerald-200/90 bg-emerald-50/95 px-3 py-2.5 text-sm font-semibold text-emerald-900">
            <span className="mr-1 font-semibold text-emerald-700">
              Wynik:
            </span>
            <ArticleRichText text={block.result} />
          </div>
        ) : null}

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
    <div className="overflow-hidden rounded-xl border border-sky-200/80 bg-gradient-to-br from-sky-50/90 via-white to-blue-50/50 shadow-sm shadow-sky-100/40 dark:border-sky-800/50 dark:from-sky-950/30 dark:via-slate-900/60 dark:to-slate-900/40 dark:shadow-none">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-sky-50/60 dark:hover:bg-sky-950/20 sm:px-5"
      >
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
              {block.title || "Przykład"}
            </span>
            {block.level ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  isRozszerzony
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
                )}
              >
                {isRozszerzony ? "Rozszerzenie" : "Podstawa"}
              </span>
            ) : null}
          </div>
          {block.prompt ? (
            <p className="text-base font-semibold leading-7 text-slate-900 dark:text-white sm:text-[17px]">
              <ArticleRichText text={block.prompt} />
            </p>
          ) : null}
          <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-600/80 dark:text-sky-400/80">
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
            <div className="space-y-3 border-t border-sky-200/70 px-4 pb-4 pt-3 dark:border-sky-800/40 sm:px-5">
              {block.steps?.length ? (
                <ol className="space-y-2">
                  {block.steps.map((step, index) => (
                    <li
                      key={`${block.title}-${index}`}
                      className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-x-2.5 text-sm leading-6 text-slate-700 dark:text-slate-300"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white dark:bg-sky-500">
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <ArticleRichText text={step} />
                      </span>
                    </li>
                  ))}
                </ol>
              ) : null}
              {block.result ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/90 px-3 py-2.5 text-sm font-semibold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100">
                  <span className="mr-1 font-semibold text-emerald-700 dark:text-emerald-300">
                    Wynik:
                  </span>
                  <ArticleRichText text={block.result} />
                </div>
              ) : null}
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
  const exercises = block.exercises || [];
  const value = block.id || block.formulaLabel || block.title || "group";

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value={value}
        className="overflow-hidden rounded-lg border border-blue-200/70 bg-white/80 dark:border-blue-800/50 dark:bg-slate-900/50"
      >
        <AccordionTrigger className="px-4 py-3 text-left text-base font-semibold text-slate-900 hover:no-underline dark:text-white sm:px-5">
          <span className="flex min-w-0 flex-wrap items-center gap-2">
            <span>
              <ArticleRichText text={block.title} />
            </span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              {exercises.length}{" "}
              {exercises.length === 1 ? "zadanie" : exercises.length < 5 ? "zadania" : "zadań"}
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-0 sm:px-5">
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <ExerciseBlock
                key={exercise.number || exercise.prompt}
                block={exercise}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
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
                <span
                  className={cn(
                    "font-mono text-xs font-semibold",
                    isRozszerzony
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-blue-600 dark:text-blue-400",
                  )}
                >
                  {block.number}
                </span>
              ) : null}
              {block.level ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    isRozszerzony
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
                  )}
                >
                  {isRozszerzony ? "Rozszerzenie" : "Podstawa"}
                </span>
              ) : null}
            </div>

            <div className="rounded-lg border border-slate-200/90 bg-slate-50/90 px-3 py-3 dark:border-slate-600 dark:bg-slate-900/45">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Polecenie
              </p>
              <p className="text-base font-semibold leading-7 text-slate-900 dark:text-white sm:text-[17px] sm:leading-8">
                <ArticleRichText text={block.prompt} />
              </p>
            </div>

            {block.options?.length ? (
              <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                {block.options.map((option) => (
                  <div
                    key={`${block.number}-${option.key}`}
                    className="flex min-w-0 items-baseline gap-2 overflow-x-auto rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200"
                  >
                    <span className="shrink-0 font-semibold text-slate-500 dark:text-slate-400">
                      {option.key}.
                    </span>
                    <span className="min-w-0">
                      <ArticleRichText text={option.text} />
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
                  ? "border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-300",
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
              <div className="rounded-md border border-teal-200 bg-teal-50/80 px-3 py-2 text-sm text-teal-900 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-100">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                    <FillingLightbulb fill={fill} className="h-3.5 w-3.5" />
                    {hintCount > 1
                      ? `Wskazówka ${hintLevel}/${hintCount}`
                      : "Wskazówka"}
                  </div>
                  {hintCount > 1 && hintLevel < hintCount ? (
                    <span className="text-[10px] font-medium text-teal-600/80 dark:text-teal-400/80">
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
            className={cn(
              "block w-full text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 transition dark:text-slate-500",
              isRozszerzony
                ? "hover:text-violet-700 dark:hover:text-violet-300"
                : "hover:text-blue-700 dark:hover:text-blue-300",
            )}
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
                <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
                  <span className="mr-1 font-semibold text-emerald-700 dark:text-emerald-300">
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

function RelatedMaturaTasks({ filter, articleId, embedded = false }) {
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
        .filter((task) => task && task.question && isMaturalneTask(task))
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

  const body = (
    <>
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
    </>
  );

  if (embedded) {
    return <div className="space-y-4">{body}</div>;
  }

  return (
    <section className="mt-10 space-y-4">
      <div className="flex items-baseline gap-3 border-b border-slate-200 pb-2 dark:border-slate-700">
        <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">6</span>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Zadania maturalne
        </h2>
      </div>
      <p className="text-[15px] leading-7 text-slate-700 dark:text-slate-300">
        Zadania z arkuszy powiązane z tematem artykułu. Kliknij kafelek, aby otworzyć pełne zadanie.
      </p>
      {body}
    </section>
  );
}

function ArticleSection({ section, index, articleId, relatedTasks }) {
  const blocks =
    section.blocks ||
    (section.paragraphs || []).map((content) => ({ type: "text", content }));

  return (
    <section className="scroll-mt-24">
      <div className="mb-4 flex items-baseline gap-3 border-b border-slate-200 pb-2 dark:border-slate-700">
        <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
          {section.number || String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {section.heading}
        </h2>
      </div>
      <div className="space-y-4">
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
  const formulas = useMemo(() => collectArticleFormulas(article), [article]);
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
    setPreviewLabel(null);
    setFocusedLabel(label);
    setFocusNonce((value) => value + 1);
    const node = document.getElementById(formulaDomId(label));
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    }
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
        <p className="text-slate-500 dark:text-slate-400">Nie znaleziono artykułu.</p>
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

          <header className="mb-8 space-y-5 border-b border-slate-200 pb-8 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-sky-400 text-sky-700 dark:border-sky-600 dark:text-sky-300"
              >
                Artykuł
              </Badge>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                {article.topic}
              </span>
              {article.subtopic ? (
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                  {article.subtopic}
                </span>
              ) : null}
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
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
              {article.description ? (
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                  {article.description}
                </p>
              ) : null}
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
                relatedTasks={rawArticle?.relatedTasks || article.relatedTasks}
              />
            ))}
          </div>

          {article.closing ? (
            <footer className="mt-10 rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-4 dark:border-violet-800 dark:bg-violet-950/30">
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-violet-800 dark:text-violet-200">
                <Sigma className="h-4 w-4" />
                Podsumowanie
              </div>
              <p className="text-sm leading-6 text-violet-900/90 dark:text-violet-100/90">
                <ArticleRichText text={article.closing} />
              </p>
            </footer>
          ) : null}
        </motion.article>
      </div>
    </FormulaPreviewContext.Provider>
  );
}
