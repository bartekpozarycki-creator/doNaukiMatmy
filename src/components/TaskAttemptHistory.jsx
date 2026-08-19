import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_ATTEMPTS = 20;
const COMPACT_MAX_VISIBLE = 5;

function formatAttemptDate(dateStr) {
  if (!dateStr) return "Brak daty";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Brak daty";
  return date.toLocaleString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAttemptDateShort(dateStr) {
  if (!dateStr) return "Brak daty";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Brak daty";
  return date.toLocaleString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatLastAttemptSummary(lastAttempt) {
  if (!lastAttempt) return null;

  const date = new Date(lastAttempt.date);
  const dateLabel = date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  let relativeLabel = null;
  if (diffDays === 0) relativeLabel = "dzisiaj";
  else if (diffDays === 1) relativeLabel = "wczoraj";
  else if (diffDays < 7) relativeLabel = `${diffDays} dni temu`;
  else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    relativeLabel = weeks === 1 ? "tydzień temu" : `${weeks} tyg. temu`;
  }

  return {
    dateLabel,
    relativeLabel,
    isCorrect: lastAttempt.isCorrect,
  };
}

function AttemptListItem({
  attempt,
  originalIndex,
  attemptNumber,
  isLatest = false,
  onDeleteAttempt,
}) {
  const label = attempt.isCorrect ? "Poprawna odpowiedź" : "Błędna odpowiedź";
  const dateLabel = formatAttemptDateShort(attempt.date);

  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 dark:border-slate-700/80 dark:bg-slate-800/80">
      <span
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          attempt.isCorrect
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
            : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
        )}
        aria-hidden
      >
        {attempt.isCorrect ? (
          <Check className="h-4 w-4" strokeWidth={2.5} />
        ) : (
          <X className="h-4 w-4" strokeWidth={2.5} />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {label}
          {isLatest ? (
            <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">
              ostatnia próba
            </span>
          ) : null}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Próba {attemptNumber} · {dateLabel}
        </p>
      </div>

      {onDeleteAttempt ? (
        <button
          type="button"
          onClick={() => onDeleteAttempt(originalIndex)}
          className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
          title={`Usuń próbę ${attemptNumber}`}
          aria-label={`Usuń próbę ${attemptNumber}, ${label}, ${dateLabel}`}
        >
          Usuń
        </button>
      ) : null}
    </li>
  );
}

export default function TaskAttemptHistory({
  attempts = [],
  compact = false,
  variant = "chips",
  maxVisible = MAX_VISIBLE_ATTEMPTS,
  className = "",
  onDeleteAttempt,
}) {
  if (!attempts.length) return null;

  const limit = onDeleteAttempt ? maxVisible : compact ? COMPACT_MAX_VISIBLE : maxVisible;
  const visible = attempts
    .map((attempt, originalIndex) => ({ attempt, originalIndex }))
    .slice(-limit)
    .reverse();
  const hasMore = attempts.length > limit;

  if (variant === "list") {
    return (
      <div className={cn("space-y-2", className)} aria-label="Historia prób">
        <ul className="max-h-56 space-y-2 overflow-y-auto pr-0.5">
          {visible.map(({ attempt, originalIndex }, index) => (
            <AttemptListItem
              key={`${attempt.date}-${originalIndex}`}
              attempt={attempt}
              originalIndex={originalIndex}
              attemptNumber={attempts.length - index}
              isLatest={index === 0}
              onDeleteAttempt={onDeleteAttempt}
            />
          ))}
        </ul>
        {hasMore ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pokazano ostatnie {limit} z {attempts.length} prób.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5",
        compact ? "gap-1" : "gap-1.5",
        className,
      )}
      aria-label="Historia prób"
    >
      {visible.map(({ attempt, originalIndex }, index) => {
        const label = attempt.isCorrect ? "Poprawna odpowiedź" : "Błędna odpowiedź";
        const dateLabel = formatAttemptDate(attempt.date);
        const content = attempt.isCorrect ? "✓" : "✕";
        const classNameValue = cn(
          "inline-flex items-center justify-center rounded-full font-bold leading-none transition",
          compact ? "h-6 w-6 text-xs" : "h-8 w-8 text-sm",
          attempt.isCorrect
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
            : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
          onDeleteAttempt &&
            "cursor-pointer hover:scale-105 hover:ring-2 hover:ring-rose-300 dark:hover:ring-rose-700",
        );

        if (onDeleteAttempt) {
          return (
            <button
              key={`${attempt.date}-${index}`}
              type="button"
              className={classNameValue}
              title={`${label} · ${dateLabel}. Kliknij, aby usunąć tę próbę.`}
              aria-label={`${label}, ${dateLabel}. Usuń próbę ${originalIndex + 1}.`}
              onClick={() => onDeleteAttempt(originalIndex)}
            >
              {content}
            </button>
          );
        }

        return (
          <span
            key={`${attempt.date}-${index}`}
            className={classNameValue}
            title={`${label} · ${dateLabel}`}
          >
            {content}
          </span>
        );
      })}
      {hasMore ? (
        <span
          className={cn(
            "inline-flex items-center justify-center font-medium text-slate-500 dark:text-slate-400",
            compact ? "h-6 min-w-6 px-1 text-xs" : "h-7 min-w-7 px-1 text-sm",
          )}
          title={`${attempts.length - limit} wcześniejszych prób`}
        >
          ...
        </span>
      ) : null}
    </div>
  );
}
