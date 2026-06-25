import MathText from "@/components/MathText";
import { cn } from "@/lib/utils";

export default function TaskQuestionBody({
  task,
  compact = false,
  tile = false,
  className = "",
}) {
  const textClass = compact
    ? tile
      ? "text-sm font-medium leading-normal text-slate-900 dark:text-white"
      : "text-sm font-medium leading-normal text-slate-900 dark:text-white"
    : "text-xl leading-normal text-slate-950 dark:text-slate-100";

  return (
    <div
      className={cn(
        compact
          ? cn(
              "task-question-body--card py-0",
              tile ? "task-question-body--tile space-y-2.5" : "space-y-4 py-0.5",
            )
          : "space-y-4",
        className,
      )}
    >
      {task?.question?.trim() ? (
        <div
          className={cn(
            textClass,
            "overflow-visible",
            compact ? (tile ? "pt-0.5 pb-0.5" : "pt-1 pb-0.5") : "py-1",
          )}
        >
          <MathText text={task.question} className="math-text-ui--flow" />
        </div>
      ) : null}

      {task?.imageUrl ? (
        <img
          src={task.imageUrl}
          alt="Ilustracja do zadania"
          className={cn(
            "mx-auto w-full rounded-lg border border-slate-200 dark:border-slate-700",
            compact
              ? tile
                ? "max-h-32 object-contain"
                : "max-h-36 object-contain"
              : "max-w-md",
          )}
        />
      ) : null}

      {task?.questionTextPoObrazku?.trim() ? (
        <div
          className={cn(
            textClass,
            "overflow-visible",
            compact ? (tile ? "pt-0.5 pb-0.5" : "pt-1 pb-0.5") : "py-1",
          )}
        >
          <MathText text={task.questionTextPoObrazku} className="math-text-ui--flow" />
        </div>
      ) : null}
    </div>
  );
}
