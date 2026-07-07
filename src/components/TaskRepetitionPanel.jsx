import { Link } from "react-router-dom";
import { ChevronRight, History, SlidersHorizontal } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import TaskAttemptHistory from "@/components/TaskAttemptHistory";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import {
  getFrequencyColors,
  getFrequencySliderStyle,
  getFrequencyTextStyle,
} from "@/utils/review-frequency-colors";
import {
  formatReviewScheduleLabel,
  getScheduleBadgeClass,
  resolveTaskSchedule,
} from "@/utils/review-schedule";

function getMasteryStatusClass(statusId) {
  switch (statusId) {
    case "needsWork":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300";
    case "almostMastered":
      return "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300";
    case "mastered":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "inProgress":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300";
    case "new":
    default:
      return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300";
  }
}

export default function TaskRepetitionPanel({
  taskId,
  layout = "spread",
  className = "",
}) {
  const { getProgress, setFrequency, deleteAttempt } = useTaskProgress();
  const entry = getProgress(taskId);

  if (!entry?.attempts?.length) {
    return null;
  }

  const frequency = entry.frequency ?? 50;
  const schedule = resolveTaskSchedule(entry);
  const nextReviewLabel = schedule?.nextReviewAt
    ? formatReviewScheduleLabel(schedule.nextReviewAt)
    : null;
  const masteryStatus = schedule?.masteryStatus;

  const handleDeleteAttempt = (attemptIndex) => {
    if (!window.confirm("Usunąć wybraną zapisaną próbę tego zadania?")) return;
    deleteAttempt(taskId, attemptIndex);
  };

  if (layout !== "spread") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TaskAttemptHistory
            attempts={entry.attempts}
            compact
            maxVisible={entry.attempts.length}
            onDeleteAttempt={handleDeleteAttempt}
          />
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
              getMasteryStatusClass(masteryStatus?.id),
            )}
          >
            {masteryStatus?.label || "W trakcie"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-slate-900 dark:text-white">
            <History className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
            Historia prób
          </CardTitle>
          {nextReviewLabel ? (
            <span
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold",
                getScheduleBadgeClass(schedule.nextReviewAt),
              )}
            >
              {nextReviewLabel}
            </span>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 pt-0">
          <TaskAttemptHistory
            attempts={entry.attempts}
            compact
            maxVisible={entry.attempts.length}
            onDeleteAttempt={handleDeleteAttempt}
          />
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
              getMasteryStatusClass(masteryStatus?.id),
            )}
          >
            {masteryStatus?.label || "W trakcie"}
          </span>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="repetition-frequency" className="border-0">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold text-slate-900 hover:no-underline dark:text-white">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                Częstość powtórek
                <span
                  className="tabular-nums text-sm font-bold"
                  style={getFrequencyTextStyle(frequency)}
                >
                  · {frequency}/100
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-6 pb-6 pt-0">
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Im wyższa wartość, tym pilniej warto wrócić do zadania. Suwak
                przesuwa też termin w harmonogramie.
              </p>

              <div className="space-y-2" style={getFrequencySliderStyle(frequency)}>
                <Slider
                  value={[frequency]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={([value]) => setFrequency(taskId, value)}
                  className={cn(
                    "py-1",
                    "[&_[role=slider]]:border-[var(--freq-slider-thumb)]",
                    "[&_[role=slider]]:bg-white",
                    "[&>span:first-child]:bg-[var(--freq-slider-track)]",
                    "[&>span:first-child>span]:bg-[var(--freq-slider-range)]",
                  )}
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span style={{ color: getFrequencyColors(15).main }}>1–30</span>
                  <span style={{ color: getFrequencyColors(50).main }}>31–70</span>
                  <span style={{ color: getFrequencyColors(85).main }}>71–100</span>
                </div>
              </div>

              <Link
                to={createPageUrl("Review")}
                className="inline-flex w-full items-center justify-between gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-950/60"
              >
                Przejdź do strony Powtórki
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
