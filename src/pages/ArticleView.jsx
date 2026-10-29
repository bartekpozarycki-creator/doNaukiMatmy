import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
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
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MathText from "@/components/MathText";
import TaskListCard from "@/components/TaskListCard";
import { createPageUrl } from "@/utils";
import {
  articleContentModeLabel,
  articleExampleLevelLabel,
  filterArticleByContentModes,
  getArticleContentModes,
  getSampleArticleById,
  isArticleUnavailable,
  parseArticleContentModesParam,
} from "@/utils/sample-articles";
import { fetchNoteById } from "@/utils/notes";
import { publicSupabase } from "@/supabase-config.js";
import { isMaturalneTask, isStemTask, mapDbTaskRow, normalizeVideoEmbedUrl } from "@/utils/map-db-task";
import { shouldNavigateTaskTile } from "@/utils/task-tile-nav";
import { buildTaskDetailsNavState } from "@/utils/task-details-nav";
import { cn } from "@/lib/utils";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const accentPalettes = {
  blue: {
    border: "border-blue-200 dark:border-blue-800",
    borderStrong: "border-l-blue-500 dark:border-l-blue-400",
    bg: "bg-blue-50/70 dark:bg-blue-950/30",
    bgSoft: "bg-blue-50/50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-300",
    textStrong: "text-blue-900 dark:text-blue-100",
    chip: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    solid: "bg-blue-600 text-white dark:bg-blue-500",
    hoverBg: "hover:bg-blue-50/40 dark:hover:bg-blue-950/20",
    chipInteractive:
      "border-blue-200 bg-blue-50 text-blue-700 hover:shadow-sm dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
    hintOn:
      "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    hintOff:
      "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-300",
    hoverText: "hover:text-blue-700 dark:hover:text-blue-300",
    divider: "border-blue-200/80 dark:border-blue-800",
    badge: "border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300",
    topic: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    ring: "focus-visible:ring-blue-500",
    plot: "#2563eb",
  },
  green: {
    border: "border-green-200 dark:border-green-800",
    borderStrong: "border-l-green-500 dark:border-l-green-400",
    bg: "bg-green-50/70 dark:bg-green-950/30",
    bgSoft: "bg-green-50/50 dark:bg-green-950/20",
    text: "text-green-700 dark:text-green-300",
    textStrong: "text-green-900 dark:text-green-100",
    chip: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
    solid: "bg-green-600 text-white dark:bg-green-500",
    hoverBg: "hover:bg-green-50/40 dark:hover:bg-green-950/20",
    chipInteractive:
      "border-green-200 bg-green-50 text-green-700 hover:shadow-sm dark:border-green-800 dark:bg-green-950/40 dark:text-green-300",
    hintOn:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950/50 dark:text-green-300",
    hintOff:
      "border-slate-200 bg-slate-50 text-slate-500 hover:border-green-300 hover:bg-green-50 hover:text-green-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-green-700 dark:hover:bg-green-950/40 dark:hover:text-green-300",
    hoverText: "hover:text-green-700 dark:hover:text-green-300",
    divider: "border-green-200/80 dark:border-green-800",
    badge: "border-green-300 text-green-700 dark:border-green-700 dark:text-green-300",
    topic: "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300",
    ring: "focus-visible:ring-green-500",
    plot: "#16a34a",
  },
  violet: {
    border: "border-violet-200 dark:border-violet-800",
    borderStrong: "border-l-violet-500 dark:border-l-violet-400",
    bg: "bg-violet-50/70 dark:bg-violet-950/30",
    bgSoft: "bg-violet-50/50 dark:bg-violet-950/20",
    text: "text-violet-700 dark:text-violet-300",
    textStrong: "text-violet-900 dark:text-violet-100",
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
    solid: "bg-violet-600 text-white dark:bg-violet-500",
    hoverBg: "hover:bg-violet-50/40 dark:hover:bg-violet-950/20",
    chipInteractive:
      "border-violet-200 bg-violet-50 text-violet-700 hover:shadow-sm dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
    hintOn:
      "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
    hintOff:
      "border-slate-200 bg-slate-50 text-slate-500 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-violet-700 dark:hover:bg-violet-950/40 dark:hover:text-violet-300",
    hoverText: "hover:text-violet-700 dark:hover:text-violet-300",
    divider: "border-violet-200/80 dark:border-violet-800",
    badge: "border-violet-300 text-violet-700 dark:border-violet-700 dark:text-violet-300",
    topic: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
    ring: "focus-visible:ring-violet-500",
    plot: "#7c3aed",
  },
};

function createNoteColors(accentKey = "blue") {
  return {
    accent: accentPalettes[accentKey] || accentPalettes.blue,
    warn: {
      wrap: "border-rose-200 bg-rose-50/80 dark:border-rose-900 dark:bg-rose-950/40",
      title: "text-rose-800 dark:text-rose-200",
      body: "text-rose-900/90 dark:text-rose-100/90",
    },
    frame:
      "rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/40",
  };
}

const NoteColorsContext = createContext(createNoteColors("blue"));

function useNoteColors() {
  return useContext(NoteColorsContext);
}

function articleAccentKey(article, selectedModes) {
  const modes = Array.isArray(selectedModes) ? selectedModes : [];
  if (modes.length > 0 && modes.every((mode) => mode === "rozszerzenie")) {
    return "violet";
  }
  if (modes.length > 0 && modes.every((mode) => mode === "podstawowka")) {
    return "green";
  }
  const levels = article?.levels || [];
  if (levels.length > 0 && levels.every((level) => level === "rozszerzony")) {
    return "violet";
  }
  if (levels.length > 0 && levels.every((level) => level === "podstawówka")) {
    return "green";
  }
  return "blue";
}

function getCalloutStyles(noteColors) {
  return {
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
}

function getFormulaAccent(noteColors) {
  return {
    shell: cn("border-l-4", noteColors.accent.borderStrong, noteColors.accent.bg),
    chip: noteColors.accent.text,
  };
}

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
  const noteColors = useNoteColors();

  return (
    <span
      role="button"
      tabIndex={0}
      className={cn(
        "mx-0.5 inline-flex -translate-y-[0.12em] cursor-pointer items-center rounded-md border px-1.5 py-0.5 align-middle font-mono text-[0.85em] font-semibold leading-none transition",
        noteColors.accent.chipInteractive,
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
  const parts = String(text ?? "").split(
    /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[\s\S]+?\$|\*\*[^*]+\*\*|\(\d+\))/g,
  );

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
  const paragraphs = String(text ?? "")
    .split(/\n\n+/)
    .filter((part) => part.trim());

  if (paragraphs.length <= 1) {
    return (
      <span className={cn("math-text-ui", className)}>
        {renderRichSegment(text, "rt", formulas)}
      </span>
    );
  }

  return (
    <span className={cn("math-text-ui block space-y-3", className)}>
      {paragraphs.map((paragraph, index) => (
        <span key={`p-${index}`} className="block">
          {renderRichSegment(paragraph, `rt-${index}`, formulas)}
        </span>
      ))}
    </span>
  );
}

function FormulaPreviewToast({ formula }) {
  const noteColors = useNoteColors();
  if (typeof document === "undefined") return null;
  const accent = formula ? getFormulaAccent(noteColors) : null;

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
                      <ArticleRichText text={formula.caption} />
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

function getStepText(step) {
  if (typeof step === "string") return step;
  if (step && typeof step === "object") return step.text || step.content || "";
  return "";
}

function getStepFigure(step) {
  if (!step || typeof step !== "object") return null;
  if (step.figure) return step.figure;
  if (step.type === "rect-figure") return step;
  return null;
}

function RectFigureDrawing({ figure, compact = false, showCaption = true }) {
  const noteColors = useNoteColors();
  const hatchId = `cut-hatch-${useId().replace(/:/g, "")}`;
  const scale = Number(figure?.scale) > 0 ? Number(figure.scale) : compact ? 22 : 28;
  const pad = Number(figure?.pad) > 0 ? Number(figure.pad) : compact ? 30 : 36;
  const parts = Array.isArray(figure?.parts) ? figure.parts : [];
  const labels = Array.isArray(figure?.labels) ? figure.labels : [];
  const outline = Array.isArray(figure?.outline) ? figure.outline : [];
  const cutParts = parts.filter((part) => part.cut);
  const drawParts = parts.filter((part) => !part.cut);

  let maxX = 0;
  let maxY = 0;
  for (const part of parts) {
    const right = Number(part.x) + Number(part.w);
    const bottom = Number(part.y) + Number(part.h);
    if (right > maxX) maxX = right;
    if (bottom > maxY) maxY = bottom;
  }
  for (const point of outline) {
    if (Number(point.x) > maxX) maxX = Number(point.x);
    if (Number(point.y) > maxY) maxY = Number(point.y);
  }

  const extraLeft = labels.some((label) => Number(label.x) < 0) ? 56 : 0;
  const extraRight = labels.some((label) => Number(label.x) > maxX) ? 28 : 0;
  const vbW = maxX * scale + pad * 2 + extraLeft + extraRight;
  const vbH = maxY * scale + pad * 2;
  const toX = (value) => extraLeft + pad + Number(value) * scale;
  const toY = (value) => pad + Number(value) * scale;
  const outlinePoints = outline
    .map((point) => `${toX(point.x)},${toY(point.y)}`)
    .join(" ");

  return (
    <div className="min-w-0">
      <div className="flex justify-center overflow-x-auto px-1 py-2">
        <div className="relative shrink-0" style={{ width: vbW, height: vbH }}>
          <svg
            width={vbW}
            height={vbH}
            viewBox={`0 0 ${vbW} ${vbH}`}
            className={noteColors.accent.text}
            aria-hidden="true"
          >
            <defs>
              <pattern
                id={hatchId}
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="8" className="stroke-current" strokeWidth="1.5" opacity="0.55" />
              </pattern>
            </defs>
            {outline.length >= 3 ? (
              <polygon
                points={outlinePoints}
                className="fill-current stroke-current"
                fillOpacity="0.14"
                strokeWidth="2.25"
                strokeLinejoin="round"
              />
            ) : (
              drawParts.map((part, index) => (
                <rect
                  key={`${part.x}-${part.y}-${index}`}
                  x={toX(part.x)}
                  y={toY(part.y)}
                  width={Number(part.w) * scale}
                  height={Number(part.h) * scale}
                  className="fill-current stroke-current"
                  fillOpacity={part.dim ? 0.06 : 0.14}
                  strokeWidth="2.25"
                  strokeDasharray={part.dashed ? "6 4" : undefined}
                />
              ))
            )}
            {cutParts.map((part, index) => (
              <g key={`cut-${part.x}-${part.y}-${index}`}>
                <rect
                  x={toX(part.x)}
                  y={toY(part.y)}
                  width={Number(part.w) * scale}
                  height={Number(part.h) * scale}
                  className="fill-white dark:fill-slate-900"
                />
                <rect
                  x={toX(part.x)}
                  y={toY(part.y)}
                  width={Number(part.w) * scale}
                  height={Number(part.h) * scale}
                  fill={`url(#${hatchId})`}
                  className="stroke-current"
                  strokeWidth="2.25"
                  strokeDasharray="6 4"
                />
              </g>
            ))}
          </svg>
          {labels.map((label, index) => {
            const labelX = Number(label.x);
            const side =
              labelX < 0 ? "left" : labelX > maxX ? "right" : "center";
            const leftPx =
              side === "left" ? toX(0) - 10 : side === "right" ? toX(maxX) + 10 : toX(labelX);
            return (
              <div
                key={`${label.text}-${index}`}
                className={cn(
                  "absolute -translate-y-1/2 text-sm font-semibold leading-none text-slate-800 dark:text-slate-100",
                  side === "left" && "-translate-x-full",
                  side === "center" && "-translate-x-1/2",
                )}
                style={{ left: leftPx, top: toY(label.y) }}
              >
                <ArticleRichText text={label.text} />
              </div>
            );
          })}
        </div>
      </div>
      {showCaption && figure?.caption ? (
        <p className="px-1 pb-1 text-center text-xs leading-[1.5] text-slate-600 dark:text-slate-300">
          <ArticleRichText text={figure.caption} />
        </p>
      ) : null}
    </div>
  );
}

function ExampleStepContent({ step }) {
  const text = getStepText(step);
  const figure = getStepFigure(step);
  return (
    <div className="min-w-0 space-y-2">
      {text ? <ArticleRichText text={text} /> : null}
      {figure ? <RectFigureDrawing figure={figure} compact /> : null}
    </div>
  );
}

function FormulaBlock({ block }) {
  const preview = useContext(FormulaPreviewContext);
  const noteColors = useNoteColors();
  const [open, setOpen] = useState(() => Boolean(block.exampleOpen));
  const accent = getFormulaAccent(noteColors);
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
        "overflow-hidden rounded-lg border-l-4 transition-shadow scroll-mt-24 [&_.katex-display]:my-0 [&_.math-text-ui__math-display]:my-0",
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
          "space-y-1 px-3 py-2 sm:px-4 sm:py-2.5",
          hasExample ? "cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02]" : "cursor-default",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 overflow-x-auto py-0.5 text-center text-[15px] sm:text-base">
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
            <ArticleRichText text={block.caption} />
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
                        {articleExampleLevelLabel(block.example.level)}
                      </span>
                    ) : null}
                  </div>
                  {block.example.prompt ? (
                    <p className="mb-2 text-sm font-medium leading-[1.6] text-slate-800 dark:text-slate-100">
                      <ArticleRichText text={block.example.prompt} />
                    </p>
                  ) : null}
                  {block.example.figure ? (
                    <div className="mb-2">
                      <RectFigureDrawing figure={block.example.figure} compact />
                    </div>
                  ) : null}
                  {block.example.steps?.length ? (
                    <ol className="space-y-2">
                      {block.example.steps.map((step, index) => (
                        <li
                          key={`${block.label}-e-${index}`}
                          className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-2 text-sm leading-[1.6] text-slate-700 dark:text-slate-200"
                        >
                          <span className={cn("font-semibold", noteColors.accent.text)}>
                            {index + 1}.
                          </span>
                          <ExampleStepContent step={step} />
                        </li>
                      ))}
                    </ol>
                  ) : null}
                  {block.example.result ? (
                    <p className={cn("mt-2 border-t pt-2 text-sm font-semibold text-slate-900 dark:text-slate-100", noteColors.accent.divider)}>
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

function ArticleVideo({ url, title }) {
  const embedUrl = normalizeVideoEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="mt-3 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
      <div className="aspect-video w-full">
        <iframe
          src={embedUrl}
          title={title || "Wytłumaczenie wideo"}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function CalloutBlock({ block }) {
  const noteColors = useNoteColors();
  const [exampleOpen, setExampleOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const calloutStyles = getCalloutStyles(noteColors);
  const style = calloutStyles[block.variant] || calloutStyles.insight;
  const Icon = style.icon;
  const collapsible = Boolean(block.collapsible);
  const example = block.example;
  const videoUrl = block.video;
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
          {videoUrl ? (
            <Play className="h-3.5 w-3.5 shrink-0 fill-current opacity-80" />
          ) : null}
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
              {videoUrl ? (
                <ArticleVideo url={videoUrl} title={block.title} />
              ) : null}
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

function formatPlotTick(value) {
  if (!Number.isFinite(value)) return "";
  if (Number.isInteger(value)) return String(value);
  return String(Math.round(value * 1000) / 1000).replace(".", ",");
}

function SequencePlotsBlock({ block }) {
  const noteColors = useNoteColors();
  const items = block.items || [];
  const plotColor = noteColors.accent.plot || "#7c3aed";

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item, index) => {
        const points = (item.points || []).map((point) => ({
          n: Number(point.n),
          a: Number(point.a),
        }));
        const hasLimit = typeof item.limit === "number";

        return (
          <motion.div
            key={`${item.title || "plot"}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.06, ease: "easeOut" }}
            className={cn("overflow-hidden", noteColors.frame)}
          >
            <div className="space-y-1 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <p className={cn("text-xs font-semibold uppercase tracking-wide", noteColors.accent.text)}>
                {item.title || `Przykład ${index + 1}`}
              </p>
              {item.formula ? (
                <p className="text-sm font-semibold leading-[1.6] text-slate-900 dark:text-white">
                  <ArticleRichText text={item.formula} />
                </p>
              ) : null}
              {item.terms ? (
                <p className="text-sm leading-[1.6] text-slate-600 dark:text-slate-300">
                  <ArticleRichText text={item.terms} />
                </p>
              ) : null}
            </div>
            <div className="h-52 px-2 py-2 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 18, right: 12, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis
                    dataKey="n"
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={formatPlotTick}
                    ticks={points.map((point) => point.n).filter((n) => n === 1 || n % 2 === 0)}
                    domain={[0, Math.max(...points.map((point) => point.n), 1) + 1]}
                    label={{ value: "n", position: "insideBottomRight", offset: -2, fontSize: 11 }}
                  />
                  <YAxis
                    dataKey="a"
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={formatPlotTick}
                    width={36}
                    domain={item.yMin != null && item.yMax != null ? [item.yMin, item.yMax] : ["auto", "auto"]}
                    label={{ value: "aₙ", angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value) => [formatPlotTick(Number(value)), "aₙ"]}
                    labelFormatter={(value) => `n = ${formatPlotTick(Number(value))}`}
                  />
                  {hasLimit ? (
                    <ReferenceLine
                      y={item.limit}
                      stroke={plotColor}
                      strokeDasharray="6 4"
                      strokeWidth={1.5}
                    />
                  ) : null}
                  <Scatter data={points} fill={plotColor} line={false} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            {item.caption ? (
              <p className="border-t border-slate-200 px-4 py-2.5 text-sm leading-[1.55] text-slate-700 dark:border-slate-700 dark:text-slate-200">
                <ArticleRichText text={item.caption} />
              </p>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}

function RectFigureBlock({ block }) {
  const noteColors = useNoteColors();
  const accent = getFormulaAccent(noteColors);
  const [open, setOpen] = useState(false);
  const hasExample = Boolean(block.example);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn("overflow-hidden", noteColors.frame)}
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
          hasExample ? "cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02]" : "cursor-default",
        )}
      >
        <RectFigureDrawing figure={block} showCaption={false} />
        {block.caption ? (
          <p className="border-t border-slate-200 px-4 py-2.5 text-sm leading-[1.55] text-slate-700 dark:border-slate-700 dark:text-slate-200">
            <ArticleRichText text={block.caption} />
          </p>
        ) : null}
        {hasExample ? (
          <p className={cn("px-4 pb-3 text-center text-[11px] font-semibold uppercase tracking-wide", accent.chip)}>
            {open ? "Kliknij, aby zwinąć" : "Kliknij, aby zobaczyć pole i obwód"}
          </p>
        ) : null}
      </div>
      <AnimatePresence initial={false}>
        {open && hasExample ? (
          <motion.div
            key="figure-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-slate-200/80 px-4 pb-4 pt-3 dark:border-slate-700 sm:px-5">
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
                      {articleExampleLevelLabel(block.example.level)}
                    </span>
                  ) : null}
                </div>
                {block.example.prompt ? (
                  <p className="mb-2 text-sm font-medium leading-[1.6] text-slate-800 dark:text-slate-100">
                    <ArticleRichText text={block.example.prompt} />
                  </p>
                ) : null}
                {block.example.steps?.length ? (
                  <ol className="space-y-2">
                    {block.example.steps.map((step, index) => (
                      <li
                        key={`fig-e-${index}`}
                        className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-2 text-sm leading-[1.6] text-slate-700 dark:text-slate-200"
                      >
                        <span className={cn("font-semibold", noteColors.accent.text)}>
                          {index + 1}.
                        </span>
                        <ExampleStepContent step={step} />
                      </li>
                    ))}
                  </ol>
                ) : null}
                {block.example.result ? (
                  <p className={cn("mt-2 border-t pt-2 text-sm font-semibold text-slate-900 dark:text-slate-100", noteColors.accent.divider)}>
                    <ArticleRichText text={block.example.result} />
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function ArticleBlock({ block, articleId, relatedTasks }) {
  const noteColors = useNoteColors();

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
      <div className="space-y-2">
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

  if (block.type === "sequence-plots") {
    return <SequencePlotsBlock block={block} />;
  }

  if (block.type === "rect-figure") {
    return <RectFigureBlock block={block} />;
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
  const noteColors = useNoteColors();
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
  const noteColors = useNoteColors();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("overflow-hidden", noteColors.frame)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex w-full items-start justify-between gap-3 px-4 py-4 text-left transition sm:px-5 sm:py-5",
          noteColors.accent.hoverBg,
        )}
      >
        <div className="min-w-0 space-y-2">
          <p className={cn("text-xs font-semibold uppercase tracking-wide", noteColors.accent.text)}>
            {block.title || "Przykład"}
          </p>
          {block.prompt ? (
            <p className="text-base font-semibold leading-[1.65] text-slate-900 dark:text-white sm:text-[17px]">
              <ArticleRichText text={block.prompt} />
            </p>
          ) : null}
          {block.figure ? (
            <div className="pt-1">
              <RectFigureDrawing figure={block.figure} compact />
            </div>
          ) : null}
          <p className={cn("text-[11px] font-semibold uppercase tracking-wide opacity-80", noteColors.accent.text)}>
            {open ? "Kliknij, aby zwinąć rozwiązanie" : "Kliknij, aby zobaczyć rozwiązanie"}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 h-4 w-4 shrink-0 transition-transform duration-200",
            noteColors.accent.text,
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="guided-example"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-t border-slate-200 px-4 pb-4 pt-4 dark:border-slate-700 sm:px-5 sm:pb-5">
              <ol className="space-y-3">
                {(block.steps || []).map((step, index) => (
                  <li
                    key={`${block.title}-${index}`}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-3"
                  >
                    <span className={cn("mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", noteColors.accent.solid)}>
                      {index + 1}
                    </span>
                    <div className="min-w-0 rounded-lg bg-slate-50 px-3.5 py-2.5 text-[15px] leading-7 text-slate-700 dark:bg-slate-900/45 dark:text-slate-200 sm:px-4 sm:py-3 sm:text-base [&_.math-text-ui__math-display]:my-3">
                      <ExampleStepContent step={step} />
                    </div>
                  </li>
                ))}
              </ol>

              <ExampleResult text={block.result} />

              <CleanSolutionPanel
                lines={block.cleanSolution}
                idKey={block.title || "guided"}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function WorkedExampleBlock({ block }) {
  const noteColors = useNoteColors();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("overflow-hidden", noteColors.frame)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition sm:px-5",
          noteColors.accent.hoverBg,
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
                {articleExampleLevelLabel(block.level)}
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
                        <ExampleStepContent step={step} />
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
  const noteColors = useNoteColors();
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
        className={cn(
          "flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-base font-semibold text-slate-900 transition dark:text-white sm:px-5",
          noteColors.accent.hoverBg,
        )}
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
  const noteColors = useNoteColors();
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
                  {articleExampleLevelLabel(block.level)}
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
                hintOpen ? noteColors.accent.hintOn : noteColors.accent.hintOff,
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
            className={cn(
              "block w-full text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 transition dark:text-slate-500",
              noteColors.accent.hoverText,
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
  const noteColors = useNoteColors();
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
            className={cn(
              "group/tile cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2",
              noteColors.accent.ring,
            )}
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
  const noteColors = useNoteColors();
  const blocks = section.blocks || [];

  return (
    <section className="scroll-mt-24">
      <div className="mb-5 flex items-baseline gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
        <span className={cn("font-mono text-sm font-semibold", noteColors.accent.text)}>
          {section.number || String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          <ArticleRichText text={section.heading} />
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
  const [rawArticle, setRawArticle] = useState(
    () => state?.article ?? getSampleArticleById(idParam) ?? null,
  );
  const [articleLoading, setArticleLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadNote = async () => {
      const { data } = await fetchNoteById(idParam);
      if (cancelled) return;
      if (data) setRawArticle(data);
      setArticleLoading(false);
    };
    loadNote();
    return () => {
      cancelled = true;
    };
  }, [idParam]);
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
    .map((mode) => articleContentModeLabel(mode))
    .join(" · ");
  const noteTheme = useMemo(
    () => createNoteColors(articleAccentKey(rawArticle, contentModes)),
    [rawArticle, contentModes],
  );

  if (articleLoading && !rawArticle) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-4 py-24 text-slate-500 dark:text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        Ładowanie notatki...
      </div>
    );
  }

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

  if (isArticleUnavailable(rawArticle)) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <Badge
          variant="outline"
          className="border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
        >
          Chwilowo niedostępne
        </Badge>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {rawArticle.title}
        </h1>
        <p className="max-w-md text-slate-500 dark:text-slate-400">
          Ta notatka jest na razie wyłączona. Wróć tu wkrótce.
        </p>
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
    <NoteColorsContext.Provider value={noteTheme}>
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
                className={noteTheme.accent.badge}
              >
                Notatka
              </Badge>
              <span className={cn("rounded px-2.5 py-1 text-xs font-medium", noteTheme.accent.topic)}>
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
    </NoteColorsContext.Provider>
  );
}
