import { History } from "lucide-react";
import TaskAttemptHistory from "@/components/TaskAttemptHistory";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import { cn } from "@/lib/utils";
import {
  formatReviewScheduleLabel,
  getReviewStatusBadgeClass,
  getReviewStatusMeta,
  getScheduleBadgeClass,
  resolveTaskSchedule,
} from "@/utils/review-schedule";

export default function TaskRepetitionPanel({
  taskId,
  layout = "spread",
  className = "",
}) {
  const { getProgress, deleteAttempt } = useTaskProgress();
  const entry = getProgress(taskId);
  const attempts = entry?.attempts ?? [];
  const hasAttempts = attempts.length > 0;

  const schedule = resolveTaskSchedule(entry);
  const nextReviewLabel = schedule?.nextReviewAt
    ? formatReviewScheduleLabel(schedule.nextReviewAt)
    : null;
  const statusMeta = getReviewStatusMeta(
    schedule?.reviewStatus ?? entry?.reviewStatus,
  );
  const showStatus = hasAttempts && statusMeta?.id;

  const handleDeleteAttempt = (attemptIndex) => {
    if (!window.confirm("Usunąć wybraną zapisaną próbę tego zadania?")) return;
    deleteAttempt(taskId, attemptIndex);
  };

  if (layout !== "spread") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {hasAttempts ? (
            <TaskAttemptHistory
              attempts={attempts}
              compact
              maxVisible={attempts.length}
              onDeleteAttempt={handleDeleteAttempt}
            />
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Brak zapisanych prób.
            </p>
          )}
          {showStatus ? (
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                getReviewStatusBadgeClass(statusMeta.id),
              )}
            >
              {statusMeta.label}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <History className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
              Historia prób
            </h3>
            <div className="flex flex-wrap items-center justify-end gap-2.5">
              {hasAttempts && nextReviewLabel ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Następna powtórka
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums",
                      getScheduleBadgeClass(schedule?.nextReviewAt),
                    )}
                  >
                    {nextReviewLabel}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-4">
          {hasAttempts ? (
            <TaskAttemptHistory
              attempts={attempts}
              variant="list"
              maxVisible={attempts.length}
              onDeleteAttempt={handleDeleteAttempt}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
              <History className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Brak zapisanych prób
              </p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Rozwiąż zadanie powyżej — poprawne i błędne odpowiedzi pojawią
                się tutaj wraz z datą.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

