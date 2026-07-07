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

export default function TaskAttemptHistory({
  attempts = [],
  compact = false,
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
