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
  ArrowRight,
  BookOpen,
  Brain,
  ChevronDown,
  Clock,
  Lightbulb,
  List,
  Loader2,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MathText from "@/components/MathText";
import TaskListCard from "@/components/TaskListCard";
import TaskListPagination from "@/components/TaskListPagination";
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
  const figureLines = Array.isArray(figure?.lines) ? figure.lines : [];
  const rivers = Array.isArray(figure?.rivers) ? figure.rivers : [];
  const rightAngles = Array.isArray(figure?.rightAngles) ? figure.rightAngles : [];
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

  const extraLeft = labels.some((label) => Number(label.x) < 0) ? 72 : 0;
  const extraRight = labels.some((label) => Number(label.x) > maxX) ? 36 : 0;
  const extraTop =
    (rivers.some((river) => (river.side || "top") === "top") ? 44 : 0) +
    (labels.some((label) => Number(label.y) < 0) ? 18 : 0);
  const extraBottom =
    (rivers.some((river) => river.side === "bottom") ? 44 : 0) +
    (labels.some((label) => Number(label.y) > maxY) ? 18 : 0);
  const vbW = maxX * scale + pad * 2 + extraLeft + extraRight;
  const vbH = maxY * scale + pad * 2 + extraTop + extraBottom;
  const toX = (value) => extraLeft + pad + Number(value) * scale;
  const toY = (value) => extraTop + pad + Number(value) * scale;
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
            {rivers.map((river, index) => {
              const side = river.side || "top";
              const x0 = toX(0);
              const x1 = toX(maxX);
              const y0 = toY(0);
              const y1 = toY(maxY);
              const amp = 4.2;
              const band = 16;
              const count = 36;
              const wave = (baseY, phase) => {
                const pts = [];
                for (let i = 0; i <= count; i += 1) {
                  const t = i / count;
                  const x = x0 + t * (x1 - x0);
                  const y = baseY + Math.sin(t * Math.PI * 8 + phase) * amp;
                  pts.push(`${x},${y}`);
                }
                return pts.join(" ");
              };
              if (side === "bottom") {
                return (
                  <g key={`river-${index}`} className="stroke-current fill-current" opacity="0.55">
                    <rect x={x0} y={y1} width={x1 - x0} height={band} fillOpacity="0.12" stroke="none" />
                    <polyline points={wave(y1 + 5, 0)} fill="none" strokeWidth="1.6" strokeLinecap="round" />
                    <polyline points={wave(y1 + 11, 1.1)} fill="none" strokeWidth="1.6" strokeLinecap="round" />
                  </g>
                );
              }
              if (side !== "top") return null;
              return (
                <g key={`river-${index}`} className="stroke-current fill-current" opacity="0.55">
                  <rect x={x0} y={y0 - band} width={x1 - x0} height={band} fillOpacity="0.12" stroke="none" />
                  <polyline points={wave(y0 - 12, 0)} fill="none" strokeWidth="1.6" strokeLinecap="round" />
                  <polyline points={wave(y0 - 6, 1.1)} fill="none" strokeWidth="1.6" strokeLinecap="round" />
                </g>
              );
            })}
            {figureLines.map((line, index) => (
              <line
                key={`fig-line-${index}`}
                x1={toX(line.x1)}
                y1={toY(line.y1)}
                x2={toX(line.x2)}
                y2={toY(line.y2)}
                className="stroke-current"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={line.dashed ? "7 5" : undefined}
              />
            ))}
            {rightAngles.map((mark, index) => {
              const size = Number(mark.size) > 0 ? Number(mark.size) : 0.52;
              const dir = String(mark.dir || "ne");
              const sx = dir.includes("w") ? -1 : 1;
              const sy = dir.includes("n") ? -1 : 1;
              const r = size * scale;
              const x0 = toX(mark.x);
              const y0 = toY(mark.y);
              const sweep = sx === sy ? 1 : 0;
              const dotR = r * 0.48;
              return (
                <g key={`right-angle-${index}`} className="stroke-current fill-current">
                  <path
                    d={`M ${x0 + sx * r} ${y0} A ${r} ${r} 0 0 ${sweep} ${x0} ${y0 + sy * r}`}
                    fill="none"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={x0 + (sx * dotR) / Math.SQRT2}
                    cy={y0 + (sy * dotR) / Math.SQRT2}
                    r={Math.max(2.2, scale * 0.08)}
                    stroke="none"
                  />
                </g>
              );
            })}
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
  const lineGraph = step && typeof step === "object" ? step.lineGraph : null;
  return (
    <div className="min-w-0 space-y-2">
      {text ? <ArticleRichText text={text} /> : null}
      {figure ? <RectFigureDrawing figure={figure} compact /> : null}
      {lineGraph ? <LineGraphSvg graph={lineGraph} /> : null}
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

function LineGraphSvg({ graph }) {
  const noteColors = useNoteColors();
  const plotColor = graph.color || noteColors.accent.plot || "#2563eb";
  const a = Number(graph.a);
  const b = Number(graph.b) || 0;
  const xMin = Number.isFinite(Number(graph.xMin)) ? Number(graph.xMin) : -4;
  const xMax = Number.isFinite(Number(graph.xMax)) ? Number(graph.xMax) : 4;
  const yMin = Number.isFinite(Number(graph.yMin)) ? Number(graph.yMin) : -3;
  const yMax = Number.isFinite(Number(graph.yMax)) ? Number(graph.yMax) : 5;
  const width = Number(graph.width) > 0 ? Number(graph.width) : 320;
  const height = Number(graph.height) > 0 ? Number(graph.height) : 280;
  const padL = Number(graph.padL) > 0 ? Number(graph.padL) : 36;
  const padR = 18;
  const padT = 14;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const toX = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const toY = (y) => padT + ((yMax - y) / (yMax - yMin)) * plotH;
  const clipId = `line-clip-${useId().replace(/:/g, "")}`;
  const xTickStep = Number(graph.xTickStep) > 0 ? Number(graph.xTickStep) : 1;
  const yTickStep = Number(graph.yTickStep) > 0 ? Number(graph.yTickStep) : 1;
  const rangeTicks = (min, max, step) => {
    const ticks = [];
    const start = Math.ceil(min / step - 1e-9);
    const end = Math.floor(max / step + 1e-9);
    for (let i = start; i <= end; i += 1) {
      ticks.push(Number((i * step).toFixed(8)));
    }
    return ticks;
  };
  const xTicks = rangeTicks(xMin, xMax, xTickStep);
  const yTicks = rangeTicks(yMin, yMax, yTickStep);
  const xAxisY = yMin <= 0 && yMax >= 0 ? toY(0) : padT + plotH;
  const yAxisX = xMin <= 0 && xMax >= 0 ? toX(0) : padL;
  const xAxisLabel = graph.xLabel || "x";
  const yAxisLabel = graph.yLabel || "y";

  const isParabola = Boolean(graph.parabola);
  const qa = Number(graph.a);
  const qb = Number(graph.b) || 0;
  const qc = Number(graph.c) || 0;
  const lines = isParabola
    ? []
    : Array.isArray(graph.lines) && graph.lines.length > 0
      ? graph.lines
      : Number.isFinite(a)
        ? [{ a, b, color: plotColor }]
        : [];

  const points = Array.isArray(graph.points) ? graph.points : [];
  const vertexP = isParabola && qa !== 0 ? -qb / (2 * qa) : null;
  const parabolaPoints = [];
  if (isParabola && Number.isFinite(qa)) {
    const steps = 96;
    for (let i = 0; i <= steps; i += 1) {
      const x = xMin + (i / steps) * (xMax - xMin);
      parabolaPoints.push(`${toX(x)},${toY(qa * x * x + qb * x + qc)}`);
    }
  }

  return (
    <div className="flex justify-center overflow-x-auto px-2 py-2">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} overflow="visible" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <rect x={padL} y={padT} width={plotW} height={plotH} />
          </clipPath>
        </defs>
        {xTicks.map((tick) => (
          <line
            key={`vg-${tick}`}
            x1={toX(tick)}
            y1={padT}
            x2={toX(tick)}
            y2={padT + plotH}
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth={tick === 0 ? 0 : 1}
          />
        ))}
        {yTicks.map((tick) => (
          <line
            key={`hg-${tick}`}
            x1={padL}
            y1={toY(tick)}
            x2={padL + plotW}
            y2={toY(tick)}
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth={tick === 0 ? 0 : 1}
          />
        ))}
        {xMin <= 0 && xMax >= 0 ? (
          <line
            x1={toX(0)}
            y1={padT}
            x2={toX(0)}
            y2={padT + plotH}
            className="stroke-slate-500 dark:stroke-slate-400"
            strokeWidth="1.5"
          />
        ) : null}
        {yMin <= 0 && yMax >= 0 ? (
          <line
            x1={padL}
            y1={toY(0)}
            x2={padL + plotW}
            y2={toY(0)}
            className="stroke-slate-500 dark:stroke-slate-400"
            strokeWidth="1.5"
          />
        ) : null}
        <text x={padL + plotW - 2} y={xAxisY - 6} className="fill-slate-500 text-[11px]" textAnchor="end">
          {xAxisLabel}
        </text>
        <text x={yAxisX + 8} y={padT + 12} className="fill-slate-500 text-[11px]">
          {yAxisLabel}
        </text>
        {xTicks.filter((tick) => tick !== 0).map((tick) => (
          <text
            key={`xt-${tick}`}
            x={toX(tick)}
            y={xAxisY + 14}
            className="fill-slate-500 text-[10px]"
            textAnchor="middle"
          >
            {tick}
          </text>
        ))}
        {yTicks.filter((tick) => tick !== 0).map((tick) => (
          <text
            key={`yt-${tick}`}
            x={yAxisX - 6}
            y={toY(tick) + 3}
            className="fill-slate-500 text-[10px]"
            textAnchor="end"
          >
            {tick}
          </text>
        ))}
        <g clipPath={`url(#${clipId})`}>
          {graph.showAxis && Number.isFinite(vertexP) ? (
            <line
              x1={toX(vertexP)}
              y1={padT}
              x2={toX(vertexP)}
              y2={padT + plotH}
              stroke={plotColor}
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          ) : null}
          {isParabola && parabolaPoints.length > 1 ? (
            <polyline
              points={parabolaPoints.join(" ")}
              fill="none"
              stroke={plotColor}
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          {lines.map((line, index) => {
            const la = Number(line.a);
            const lb = Number(line.b) || 0;
            if (!Number.isFinite(la)) return null;
            return (
              <line
                key={`ln-${index}`}
                x1={toX(xMin)}
                y1={toY(la * xMin + lb)}
                x2={toX(xMax)}
                y2={toY(la * xMax + lb)}
                stroke={line.color || plotColor}
                strokeWidth="2.25"
                strokeLinecap="round"
              />
            );
          })}
        </g>
        {graph.showAngle && Number.isFinite(a) && a !== 0 ? (() => {
          const vx = b === 0 ? 0 : -b / a;
          const unitX = plotW / (xMax - xMin);
          const unitY = plotH / (yMax - yMin);
          const rPx = 28;
          const dirX = unitX;
          const dirY = -unitY * a;
          const dirLen = Math.hypot(dirX, dirY) || 1;
          const x0 = toX(vx);
          const y0 = toY(0);
          const endX = x0 + (dirX / dirLen) * rPx;
          const endY = y0 + (dirY / dirLen) * rPx;
          const startX = x0 + rPx;
          const startY = y0;
          const sweep = a >= 0 ? 0 : 1;
          const alpha = Math.atan(a);
          const labelAng = a >= 0 ? alpha * 0.5 : Math.PI + alpha * 0.5;
          const labelR = rPx * 0.58;
          const labelX = x0 + labelR * Math.cos(labelAng);
          const labelY = y0 - labelR * Math.sin(labelAng);
          return (
            <g>
              <path
                d={`M ${startX} ${startY} A ${rPx} ${rPx} 0 0 ${sweep} ${endX} ${endY}`}
                fill="none"
                stroke={plotColor}
                strokeWidth="1.5"
              />
              <text
                x={labelX}
                y={labelY}
                className="fill-current text-[11px] font-semibold"
                style={{ fill: plotColor }}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                α
              </text>
            </g>
          );
        })() : null}
        {graph.showTriangle && Number.isFinite(a) ? (() => {
          const tx = Number.isFinite(Number(graph.triangleX)) ? Number(graph.triangleX) : 0;
          const run = Number(graph.triangleRun) > 0 ? Number(graph.triangleRun) : 1;
          const x1 = tx;
          const y1 = a * tx + b;
          const x2 = tx + run;
          const y2 = y1;
          const x3 = x2;
          const y3 = a * x2 + b;
          return (
            <g>
              <polyline
                points={`${toX(x1)},${toY(y1)} ${toX(x2)},${toY(y2)} ${toX(x3)},${toY(y3)}`}
                fill="none"
                stroke={plotColor}
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text
                x={(toX(x1) + toX(x2)) / 2}
                y={toY(y1) + 14}
                className="fill-slate-600 text-[11px] font-semibold dark:fill-slate-300"
                textAnchor="middle"
              >
                {run}
              </text>
              <text
                x={toX(x2) + 10}
                y={(toY(y2) + toY(y3)) / 2 + 4}
                className="fill-slate-600 text-[11px] font-semibold dark:fill-slate-300"
              >
                {String(a).replace(".", ",")}
              </text>
            </g>
          );
        })() : null}
        {graph.showRightAngle && lines.length >= 2 ? (() => {
          const a1 = Number(lines[0].a);
          const b1 = Number(lines[0].b) || 0;
          const a2 = Number(lines[1].a);
          const b2 = Number(lines[1].b) || 0;
          if (!Number.isFinite(a1) || !Number.isFinite(a2) || a1 === a2) return null;
          const ix = (b2 - b1) / (a1 - a2);
          const iy = a1 * ix + b1;
          const x0 = toX(ix);
          const y0 = toY(iy);
          const unitX = plotW / (xMax - xMin);
          const unitY = plotH / (yMax - yMin);
          let d1x = unitX;
          let d1y = -unitY * a1;
          let d2x = unitX;
          let d2y = -unitY * a2;
          const len1 = Math.hypot(d1x, d1y) || 1;
          const len2 = Math.hypot(d2x, d2y) || 1;
          d1x /= len1;
          d1y /= len1;
          d2x /= len2;
          d2y /= len2;
          const rPx = 32;
          const sweep = d1x * d2y - d1y * d2x > 0 ? 1 : 0;
          let bx = d1x + d2x;
          let by = d1y + d2y;
          const bLen = Math.hypot(bx, by) || 1;
          bx /= bLen;
          by /= bLen;
          return (
            <g>
              <path
                d={`M ${x0 + d1x * rPx} ${y0 + d1y * rPx} A ${rPx} ${rPx} 0 0 ${sweep} ${x0 + d2x * rPx} ${y0 + d2y * rPx}`}
                fill="none"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <circle
                cx={x0 + bx * rPx * 0.5}
                cy={y0 + by * rPx * 0.5}
                r="3.1"
                fill="#0f172a"
              />
            </g>
          );
        })() : null}
        {points.map((point, index) => {
          const px = Number(point.x);
          const py = Number.isFinite(Number(point.y))
            ? Number(point.y)
            : isParabola && Number.isFinite(qa)
              ? qa * px * px + qb * px + qc
              : Number.isFinite(a)
                ? a * px + b
                : 0;
          if (!Number.isFinite(px) || !Number.isFinite(py)) return null;
          const cx = toX(px);
          const cy = toY(py);
          return (
            <g key={`pt-${index}`}>
              <circle cx={cx} cy={cy} r="6.5" fill="white" />
              <circle cx={cx} cy={cy} r="4.5" fill="#0f172a" />
              {point.label ? (
                <foreignObject
                  x={cx + (point.dx || 8)}
                  y={cy + (point.dy || -22)}
                  width="150"
                  height="30"
                >
                  <div className="inline-block rounded-md bg-white/95 px-1.5 py-0.5 text-[12px] font-semibold leading-none text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/90 dark:text-slate-100 dark:ring-slate-600">
                    <ArticleRichText text={point.label} />
                  </div>
                </foreignObject>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function LineGraphBlock({ block }) {
  const noteColors = useNoteColors();
  const items = Array.isArray(block.items) && block.items.length > 0 ? block.items : [block];
  const cols =
    items.length >= 3 ? "lg:grid-cols-3" : items.length === 2 ? "sm:grid-cols-2" : "";

  return (
    <div className={cn("grid gap-4", cols)}>
      {items.map((item, index) => (
        <motion.div
          key={`${item.title || item.caption || "graph"}-${index}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: index * 0.05, ease: "easeOut" }}
          className={cn("overflow-hidden", noteColors.frame)}
        >
          {item.title ? (
            <p className={cn("border-b border-slate-200 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide dark:border-slate-700", noteColors.accent.text)}>
              {item.title}
            </p>
          ) : null}
          {item.formula ? (
            <p className="px-4 pt-3 text-center text-sm font-semibold text-slate-900 dark:text-white">
              <ArticleRichText text={item.formula} />
            </p>
          ) : null}
          <LineGraphSvg graph={item} />
          {item.caption ? (
            <p className="border-t border-slate-200 px-4 py-2.5 text-sm leading-[1.55] text-slate-700 dark:border-slate-700 dark:text-slate-200">
              <ArticleRichText text={item.caption} />
            </p>
          ) : null}
        </motion.div>
      ))}
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

  if (block.type === "subheading") {
    return null;
  }

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

  if (block.type === "line-graph") {
    return <LineGraphBlock block={block} />;
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
        article={{ id: articleId, relatedTasks }}
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
          {block.lineGraph ? (
            <div className="pt-1">
              <LineGraphSvg graph={block.lineGraph} />
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
                    className="flex items-center gap-x-3"
                  >
                    <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", noteColors.accent.solid)}>
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1 rounded-lg bg-slate-50 px-3.5 py-2.5 text-[15px] leading-7 text-slate-700 dark:bg-slate-900/45 dark:text-slate-200 sm:px-4 sm:py-3 sm:text-base [&_.math-text-ui__math-display]:my-3">
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

function taskMatchesArticleFilter(task, filter, article) {
  const topic = normalizeSearchText(task.topic);
  const subtopic = normalizeSearchText(task.subtopic);
  const question = normalizeSearchText(task.question);
  const includesAny = (haystack, needles = []) =>
    (needles || []).some((needle) => haystack.includes(normalizeSearchText(needle)));

  if (filter && (filter.topicIncludes || filter.subtopicIncludes || filter.questionIncludes)) {
    const topicHit = includesAny(topic, filter.topicIncludes);
    const subtopicHit = includesAny(subtopic, filter.subtopicIncludes);
    const questionHit = includesAny(question, filter.questionIncludes);
    return topicHit || subtopicHit || questionHit;
  }

  if (!article) return false;
  const needles = [article.title, article.topic, article.subtopic].filter(Boolean);
  return includesAny(topic, needles) || includesAny(subtopic, needles) || includesAny(question, needles);
}

function isInjectedTasksSection(section) {
  const heading = String(section?.heading || "").trim().toLowerCase();
  return heading === "zadania maturalne" || heading === "zadania mieszane";
}

function MiniFilterChips({ label, value, options, onChange }) {
  const noteColors = useNoteColors();

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-semibold transition",
                active
                  ? noteColors.accent.solid
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const MIXED_TASKS_PER_PAGE = 5;

function RelatedMaturaTasks({ filter, article }) {
  const noteColors = useNoteColors();
  const navigate = useNavigate();
  const listRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [levelFilter, setLevelFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const articleId = article?.id;

  useEffect(() => {
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
        .filter((task) => taskMatchesArticleFilter(task, filter, article));

      setTasks(matched);
      setLoading(false);
    };

    loadTasks();
    return () => {
      cancelled = true;
    };
  }, [filter, article]);

  const filteredTasks = useMemo(
    () =>
      tasks
        .filter((task) => levelFilter === "all" || task.level === levelFilter)
        .filter((task) => {
          if (typeFilter === "all") return true;
          if (typeFilter === "closed") return task.type === "closed";
          return task.type === "open";
        }),
    [tasks, levelFilter, typeFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / MIXED_TASKS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTasks = useMemo(() => {
    const start = (safePage - 1) * MIXED_TASKS_PER_PAGE;
    return filteredTasks.slice(start, start + MIXED_TASKS_PER_PAGE);
  }, [filteredTasks, safePage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [levelFilter, typeFilter]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const tasksUrl = createPageUrl("TaskSets");
  const tasksState = {
    filterTopic: article?.topic || undefined,
    filterSubtopic: article?.subtopic || undefined,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <MiniFilterChips
            label="Poziom"
            value={levelFilter}
            onChange={setLevelFilter}
            options={[
              { value: "all", label: "Wszystkie" },
              { value: "ósmoklasisty", label: "E8" },
              { value: "podstawowy", label: "PP" },
              { value: "rozszerzony", label: "PR" },
            ]}
          />
          <MiniFilterChips
            label="Typ"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: "all", label: "Wszystkie" },
              { value: "closed", label: "Zamknięte" },
              { value: "open", label: "Otwarte" },
            ]}
          />
        </div>
        <Link
          to={tasksUrl}
          state={tasksState}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold transition",
            noteColors.accent.text,
            noteColors.accent.hoverText,
          )}
        >
          Więcej w zbiorach zadań
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Ładowanie zadań z bazy...
        </div>
      ) : null}

      {loadError ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          Nie udało się wczytać zadań.
        </p>
      ) : null}

      {!loading && !loadError && filteredTasks.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
          Brak zadań pasujących do wybranych filtrów. Zmień filtr albo otwórz zbiory zadań.
        </p>
      ) : null}

      <div ref={listRef} className="space-y-4 scroll-mt-24">
        {paginatedTasks.map((task, index) => (
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

      {!loading && filteredTasks.length > MIXED_TASKS_PER_PAGE ? (
        <TaskListPagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          ariaLabel="Paginacja zadań mieszanych"
        />
      ) : null}
    </div>
  );
}

function MixedTasksSection({ article, sectionNumber, collapsed, onToggle }) {
  const expanded = !collapsed;

  return (
    <section
      id={`sekcja-${sectionNumber}`}
      className="mt-12 scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-700 dark:bg-slate-900/40 sm:p-8"
    >
      <SectionHeading
        number={sectionNumber}
        title="Zadania mieszane"
        expanded={expanded}
        onToggle={onToggle}
      />
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="mixed-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="mb-5 text-base leading-[1.6] text-slate-700 dark:text-slate-200 sm:text-[17px]">
              Zadania z arkuszy powiązane z tą notatką. Filtruj po poziomie i typie albo otwórz pełne zbiory.
            </p>
            <RelatedMaturaTasks filter={article?.relatedTasks} article={article} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function NotePager() {
  return (
    <nav
      aria-label="Nawigacja między notatkami"
      className="mt-14 grid grid-cols-2 gap-3 border-t border-slate-200 pt-8 dark:border-slate-700"
    >
      <div
        aria-disabled="true"
        className="flex min-w-0 cursor-not-allowed select-none items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 text-slate-400 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-500"
      >
        <ArrowLeft className="h-5 w-5 shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide">Poprzednia</p>
          <p className="truncate text-sm font-semibold">Wkrótce</p>
        </div>
      </div>
      <div
        aria-disabled="true"
        className="flex min-w-0 cursor-not-allowed select-none items-center justify-end gap-3 rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 text-right text-slate-400 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-500"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide">Następna</p>
          <p className="truncate text-sm font-semibold">Wkrótce</p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0" />
      </div>
    </nav>
  );
}

function groupSectionBlocks(blocks) {
  const groups = [];
  let current = { title: null, blocks: [] };

  (blocks || []).forEach((block) => {
    if (block?.type === "subheading") {
      if (current.title || current.blocks.length > 0) groups.push(current);
      current = { title: block.title || block.content || "", blocks: [] };
      return;
    }
    current.blocks.push(block);
  });

  if (current.title || current.blocks.length > 0) groups.push(current);
  return groups;
}

function getSectionTocEntry(section, index) {
  const sectionNumber = section.number || String(index + 1);
  const groups = groupSectionBlocks(section.blocks);
  const children = [];
  let subIndex = 0;

  groups.forEach((group) => {
    if (!group.title) return;
    subIndex += 1;
    const subNumber = `${sectionNumber}.${subIndex}`;
    children.push({
      number: subNumber,
      title: group.title,
      id: `sekcja-${subNumber.replaceAll(".", "-")}`,
    });
  });

  return {
    number: sectionNumber,
    title: section.heading,
    id: `sekcja-${sectionNumber}`,
    children,
  };
}

function NoteTableOfContents({ entries, onNavigate }) {
  const noteColors = useNoteColors();
  const [expanded, setExpanded] = useState(false);

  if (!entries?.length) return null;

  return (
    <nav
      aria-label="Spis treści"
      className="mb-12 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-700 dark:bg-slate-900/40 sm:p-8"
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
        className={cn("flex w-full items-center gap-2.5 text-left", expanded ? "mb-5" : "mb-0")}
      >
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            noteColors.accent.solid,
          )}
        >
          <List className="h-5 w-5" />
        </span>
        <h2 className="min-w-0 flex-1 text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
          Spis treści
        </h2>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-200",
            noteColors.accent.text,
            expanded ? "rotate-0" : "-rotate-90",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="toc-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ol className="space-y-1">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(entry.id, entry.id)}
                    className={cn(
                      "flex w-full items-baseline gap-2.5 rounded-lg px-2 py-1.5 text-left transition",
                      noteColors.accent.hoverBg,
                    )}
                  >
                    <span className={cn("w-8 shrink-0 font-mono text-xs font-bold", noteColors.accent.text)}>
                      {entry.number}
                    </span>
                    <span className="min-w-0 text-sm font-semibold text-slate-800 dark:text-slate-100 sm:text-[15px]">
                      <ArticleRichText text={entry.title} />
                    </span>
                  </button>
                  {entry.children?.length ? (
                    <ol className={cn("ml-4 space-y-0.5 border-l-2 py-1 pl-4 sm:ml-6", noteColors.accent.divider)}>
                      {entry.children.map((child) => (
                        <li key={child.id}>
                          <button
                            type="button"
                            onClick={() => onNavigate(child.id, entry.id)}
                            className={cn(
                              "flex w-full items-baseline gap-2 rounded-lg px-2 py-1 text-left transition",
                              noteColors.accent.hoverBg,
                            )}
                          >
                            <span className={cn("w-9 shrink-0 font-mono text-[11px] font-semibold", noteColors.accent.text)}>
                              {child.number}
                            </span>
                            <span className="min-w-0 text-sm text-slate-600 dark:text-slate-300">
                              <ArticleRichText text={child.title} />
                            </span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </li>
              ))}
            </ol>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}

function SectionHeading({ number, title, expanded = true, onToggle }) {
  const noteColors = useNoteColors();

  const inner = (
    <>
      {number ? (
        <span
          className={cn(
            "flex h-11 min-w-11 shrink-0 items-center justify-center rounded-xl px-2.5 font-mono text-base font-bold shadow-sm",
            noteColors.accent.solid,
          )}
        >
          {number}
        </span>
      ) : null}
      <h2
        className={cn(
          "min-w-0 flex-1 border-b-2 pb-2.5 text-left text-xl font-bold tracking-tight text-slate-900 dark:border-slate-600 dark:text-white sm:text-2xl",
          noteColors.accent.divider,
        )}
      >
        {typeof title === "string" ? <ArticleRichText text={title} /> : title}
      </h2>
      {onToggle ? (
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-200",
            noteColors.accent.text,
            expanded ? "rotate-0" : "-rotate-90",
          )}
        />
      ) : null}
    </>
  );

  if (onToggle) {
    return (
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-3.5 text-left",
          expanded ? "mb-7" : "mb-0",
        )}
      >
        {inner}
      </button>
    );
  }

  return <div className="mb-7 flex items-center gap-3.5">{inner}</div>;
}

function ArticleSection({ section, index, articleId, relatedTasks, collapsed, onToggle }) {
  const noteColors = useNoteColors();
  const sectionNumber = section.number || String(index + 1);
  const groups = groupSectionBlocks(section.blocks);
  const expanded = !collapsed;
  let subIndex = 0;

  return (
    <section
      id={`sekcja-${sectionNumber}`}
      className={cn(
        "scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-700 dark:bg-slate-900/40 sm:p-8",
        index > 0 ? "mt-12" : "",
      )}
    >
      <SectionHeading
        number={sectionNumber}
        title={section.heading}
        expanded={expanded}
        onToggle={onToggle}
      />
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key={`${sectionNumber}-body`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-0">
              {groups.map((group, groupIndex) => {
                const numbered = Boolean(group.title);
                if (numbered) subIndex += 1;
                const subNumber = numbered ? `${sectionNumber}.${subIndex}` : null;
                return (
                  <div
                    key={`${sectionNumber}-${groupIndex}`}
                    className={cn("space-y-4", groupIndex > 0 ? "mt-8 border-t-2 border-slate-200 pt-8 dark:border-slate-700" : "")}
                  >
                    {numbered ? (
                      <h3
                        id={`sekcja-${String(subNumber).replaceAll(".", "-")}`}
                        className="flex scroll-mt-24 items-center gap-2.5"
                      >
                        <span
                          className={cn(
                            "inline-flex h-7 min-w-[2.35rem] shrink-0 items-center justify-center rounded-lg px-1.5 font-mono text-xs font-bold",
                            noteColors.accent.solid,
                          )}
                        >
                          {subNumber}
                        </span>
                        <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                          <ArticleRichText text={group.title} />
                        </span>
                      </h3>
                    ) : null}
                    <div className="space-y-5">
                      {group.blocks.map((block, blockIndex) => (
                        <ArticleBlock
                          key={`${section.heading}-${groupIndex}-${blockIndex}`}
                          block={block}
                          articleId={articleId}
                          relatedTasks={relatedTasks}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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

  useEffect(() => {
    window.scrollTo(0, 0);
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
  const contentSections = useMemo(
    () => (article?.sections || []).filter((section) => !isInjectedTasksSection(section)),
    [article],
  );
  const mixedSectionNumber = useMemo(() => {
    const lastNumber = Number(contentSections[contentSections.length - 1]?.number);
    if (Number.isFinite(lastNumber) && lastNumber > 0) return String(lastNumber + 1);
    return String(contentSections.length + 1);
  }, [contentSections]);
  const tocEntries = useMemo(() => {
    const entries = contentSections.map((section, index) => getSectionTocEntry(section, index));
    entries.push({
      number: mixedSectionNumber,
      title: "Zadania mieszane",
      id: `sekcja-${mixedSectionNumber}`,
      children: [],
    });
    return entries;
  }, [contentSections, mixedSectionNumber]);
  const [collapsedIds, setCollapsedIds] = useState(() => new Set());

  useEffect(() => {
    setCollapsedIds(new Set());
  }, [article?.id]);

  const toggleSection = useCallback((sectionId) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }, []);

  const expandAndScroll = useCallback((targetId, sectionId) => {
    setCollapsedIds((prev) => {
      if (!prev.has(sectionId)) return prev;
      const next = new Set(prev);
      next.delete(sectionId);
      return next;
    });
    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 320);
  }, []);
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

          <div className="space-y-0">
            <NoteTableOfContents entries={tocEntries} onNavigate={expandAndScroll} />
            {contentSections.map((section, index) => {
              const sectionId = `sekcja-${section.number || String(index + 1)}`;
              return (
                <ArticleSection
                  key={`${article.id}-${section.heading}`}
                  section={section}
                  index={index}
                  articleId={article.id}
                  relatedTasks={article.relatedTasks}
                  collapsed={collapsedIds.has(sectionId)}
                  onToggle={() => toggleSection(sectionId)}
                />
              );
            })}
            <MixedTasksSection
              article={rawArticle}
              sectionNumber={mixedSectionNumber}
              collapsed={collapsedIds.has(`sekcja-${mixedSectionNumber}`)}
              onToggle={() => toggleSection(`sekcja-${mixedSectionNumber}`)}
            />
            <NotePager />
          </div>
        </motion.article>
      </div>
    </FormulaPreviewContext.Provider>
    </NoteColorsContext.Provider>
  );
}
