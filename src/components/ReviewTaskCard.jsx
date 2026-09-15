import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TaskListCard from "@/components/TaskListCard";
import { createPageUrl } from "@/utils";
import { buildTaskDetailsNavState } from "@/utils/task-details-nav";
import {
  formatReviewScheduleDetail,
  getScheduleBadgeClass,
} from "@/utils/review-schedule";
import { shouldNavigateTaskTile } from "@/utils/task-tile-nav";
import { cn } from "@/lib/utils";

const mutedText = "text-slate-500 dark:text-slate-400";

export default function ReviewTaskCard({
  task,
  nextReviewAt,
  intervalDays,
  reviewLinkState = buildTaskDetailsNavState({ from: "review" }),
}) {
  const navigate = useNavigate();
  const scheduleInfo = formatReviewScheduleDetail(nextReviewAt, intervalDays);

  const goToTask = (event) => {
    if (!shouldNavigateTaskTile(event)) return;
    navigate(`${createPageUrl("TaskDetails")}?id=${task.id}`, {
      state: reviewLinkState,
    });
  };

  return (
    <motion.div
      role="link"
      tabIndex={0}
      data-review-task-id={task.id}
      className="group/tile block cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
      onClick={goToTask}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToTask(event);
        }
      }}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.988 }}
      transition={{ duration: 0.2 }}
    >
      <TaskListCard
        task={task}
        maturaLinkTarget="worksheets-list"
        footerExtra={
          <div
            className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-700"
            data-task-tile-ignore
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <span className={cn("text-[11px] font-semibold uppercase tracking-wide", mutedText)}>
              Harmonogram
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums",
                getScheduleBadgeClass(nextReviewAt),
              )}
            >
              {scheduleInfo.label}
            </span>
            {scheduleInfo.intervalLabel ? (
              <span className={cn("text-xs", mutedText)}>
                {scheduleInfo.intervalLabel}
              </span>
            ) : null}
          </div>
        }
      />
    </motion.div>
  );
}
