import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import TaskQuestionBody from "@/components/TaskQuestionBody";
import MaturaArkuszLink from "@/components/MaturaArkuszLink";
import FavoriteTaskActions from "@/components/FavoriteTaskActions";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import { cn } from "@/lib/utils";
import {
  TASK_LEVEL_BAR_SOLID,
  TASK_LEVEL_DISPLAY_LABEL,
  TASK_MASTERED_DIFFICULTY_BADGE_CLASS,
  formatTaskDifficultyLabel,
  taskDifficultyBadgeClassName,
} from "@/utils/map-db-task";
import { resolveUserTaskDifficulty } from "@/utils/user-task-difficulty";
import { suppressTaskTileScrollbarActivation } from "@/utils/task-tile-nav";

export const taskListCardLayoutClass =
  "group/card relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/50 transition-all duration-300 group-hover/tile:border-slate-300 group-hover/tile:shadow-xl group-hover/tile:shadow-slate-300/30 dark:border-slate-700/80 dark:bg-slate-800 dark:shadow-none dark:group-hover/tile:border-slate-600 dark:group-hover/tile:shadow-lg dark:group-hover/tile:shadow-black/25";

export const taskMasonryTileClass = "mb-5 w-full break-inside-avoid";

const skeletonClass = "bg-slate-200 dark:bg-slate-700";
const badgeClass = "px-2.5 py-0.5 text-xs font-medium leading-tight";
const unattemptedDimClass = "opacity-55";
const masteredDimClass = "opacity-100";

function taskContentDimClass({ isUnattempted, isMastered }) {
  if (isUnattempted) return unattemptedDimClass;
  if (isMastered) return masteredDimClass;
  return null;
}

export function TaskListCardSkeleton() {
  return (
    <Card className={taskListCardLayoutClass} aria-hidden>
      <div className="flex min-h-[10rem]">
        <Skeleton className={`w-8 shrink-0 rounded-none ${skeletonClass}`} />
        <div className="min-w-0 flex-1">
          <CardHeader className="space-y-0 overflow-visible px-4 pb-2 pt-4">
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <Skeleton className={`h-6 w-20 shrink-0 rounded-full ${skeletonClass}`} />
              <Skeleton className={`h-6 w-24 shrink-0 rounded-full ${skeletonClass}`} />
              <Skeleton className={`ml-auto h-6 w-8 shrink-0 rounded-full ${skeletonClass}`} />
            </div>
            <Skeleton className={`h-20 w-full rounded-xl ${skeletonClass}`} />
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4 pt-1">
            <div className="flex gap-2">
              <Skeleton className={`h-6 w-24 rounded-full ${skeletonClass}`} />
              <Skeleton className={`h-6 w-28 rounded-full ${skeletonClass}`} />
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

export default function TaskListCard({
  task,
  footerExtra = null,
  maturaLinkTarget,
  className = "",
}) {
  const { getProgress } = useTaskProgress();
  const userDifficulty = resolveUserTaskDifficulty(task, getProgress(task.id));
  const isMastered = userDifficulty.isMastered;
  const isUnattempted = !getProgress(task.id)?.attempts?.length;
  const contentDimClass = taskContentDimClass({ isUnattempted, isMastered });
  const barSolid = TASK_LEVEL_BAR_SOLID[task.level] ?? "bg-slate-600";
  const levelLabel =
    TASK_LEVEL_DISPLAY_LABEL[task.level] ?? task.level ?? "poziom";
  const subtopicLabel = task.subtopic?.trim() || null;
  const difficultyLabel =
    !isMastered ? formatTaskDifficultyLabel(userDifficulty.raw) : null;
  const topicDisplay = task.topic
    ? `${task.topic.charAt(0).toUpperCase()}${task.topic.slice(1)}`
    : task.topic;

  return (
    <Card className={cn(taskListCardLayoutClass, className)}>
      <div className="flex min-h-0 flex-1">
        <div
          className={cn(
            "relative flex w-8 shrink-0 items-center justify-center py-4",
            barSolid,
            contentDimClass,
          )}
          aria-hidden
        >
          <span
            className={cn(
              "select-none text-[10px] font-semibold uppercase leading-tight tracking-wide text-white [writing-mode:vertical-rl] rotate-180 transition-opacity duration-200",
              isUnattempted && "group-hover/tile:opacity-0",
            )}
          >
            {levelLabel}
          </span>
          {isUnattempted ? (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100">
              <span className="select-none text-[10px] font-semibold uppercase leading-tight tracking-wide text-white [writing-mode:vertical-rl] rotate-180">
                nigdy nie robione
              </span>
            </span>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <CardHeader
            className={cn(
              "space-y-0 overflow-visible px-4 pb-2 pt-4",
              contentDimClass,
            )}
          >
            <div
              className="mb-3 flex flex-wrap items-center gap-1.5"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <Badge
                variant="outline"
                className={cn(
                  badgeClass,
                  "max-w-[9rem] shrink-0 truncate border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400",
                )}
                title={task.source}
              >
                {task.source}
              </Badge>
              <MaturaArkuszLink
                task={task}
                className={cn(badgeClass, "shrink-0")}
                linkTarget={maturaLinkTarget}
                monthYearOnly
              />
              <div className="ml-auto flex shrink-0 items-center gap-1.5">
                <FavoriteTaskActions taskId={task.id} size="sm" stopPropagation />
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/90 px-2.5 pb-2.5 pt-2 dark:border-slate-700/60 dark:bg-slate-900/50">
              <TaskQuestionBody task={task} compact tile />
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-1">
            <div className="relative w-full">
              <div
                data-task-tile-scroll
                className="task-tile-meta-scroll w-full overflow-x-auto"
                onMouseDown={suppressTaskTileScrollbarActivation}
                onClick={suppressTaskTileScrollbarActivation}
              >
                <div className="flex items-center gap-2 pr-5">
                  {isMastered ? (
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
                        TASK_MASTERED_DIFFICULTY_BADGE_CLASS,
                      )}
                      title="Opanowane"
                    >
                      Opanowane
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      contentDimClass,
                    )}
                  >
                    {difficultyLabel ? (
                      <span
                        className={cn(
                          "shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
                          taskDifficultyBadgeClassName(userDifficulty.raw),
                        )}
                        title={
                          userDifficulty.isPersonalized
                            ? `Twoja trudność: ${difficultyLabel} (baza: ${formatTaskDifficultyLabel(userDifficulty.baseRaw) ?? "—"})`
                            : `Trudność: ${difficultyLabel}`
                        }
                      >
                        {difficultyLabel}
                      </span>
                    ) : null}
                    <span
                      className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700/80 dark:text-slate-200"
                      title={
                        subtopicLabel ? `${task.topic}: ${subtopicLabel}` : task.topic
                      }
                    >
                      {topicDisplay}
                      {subtopicLabel ? (
                        <>
                          :{" "}
                          <span className="font-semibold">{subtopicLabel}</span>
                        </>
                      ) : null}
                    </span>
                  </div>
                </div>
              </div>

              <ArrowRight
                className="pointer-events-none absolute right-0 top-1 h-5 w-5 shrink-0 text-blue-500 opacity-0 transition-all duration-300 group-hover/tile:translate-x-0.5 group-hover/tile:text-blue-600 group-hover/tile:opacity-100 dark:text-blue-400 dark:group-hover/tile:text-blue-300"
                strokeWidth={2.25}
                aria-hidden
              />
            </div>

            {footerExtra}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
