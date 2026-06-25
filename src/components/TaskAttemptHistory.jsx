import { cn } from "@/lib/utils";

const MAX_VISIBLE_ATTEMPTS = 20;
const COMPACT_MAX_VISIBLE = 5;

export default function TaskAttemptHistory({
  attempts = [],
  compact = false,
  maxVisible = MAX_VISIBLE_ATTEMPTS,
  className = "",
}) {
  if (!attempts.length) return null;

  const limit = compact ? COMPACT_MAX_VISIBLE : maxVisible;
  const visible = attempts.slice(-limit).reverse();
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
      {visible.map((attempt, index) => (
        <span
          key={`${attempt.date}-${index}`}
          className={cn(
            "inline-flex items-center justify-center rounded-full font-bold leading-none",
            compact ? "h-6 w-6 text-xs" : "h-7 w-7 text-sm",
            attempt.isCorrect
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
          )}
          title={attempt.isCorrect ? "Poprawna odpowiedź" : "Błędna odpowiedź"}
        >
          {attempt.isCorrect ? "✓" : "✕"}
        </span>
      ))}
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
