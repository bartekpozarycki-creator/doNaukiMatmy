import { Link } from "react-router-dom";
import { CalendarClock, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  formatReviewScheduleDetail,
  getScheduleBadgeClass,
  resolveTaskSchedule,
} from "@/utils/review-schedule";
export default function TaskRepetitionPanel({
  taskId,
  compact = false,
  className = "",
}) {
  const { getProgress, setFrequency } = useTaskProgress();
  const entry = getProgress(taskId);

  if (!entry?.attempts?.length) {
    return null;
  }

  const frequency = entry.frequency ?? 50;
  const schedule = resolveTaskSchedule(entry);
  const scheduleInfo = schedule
    ? formatReviewScheduleDetail(schedule.nextReviewAt, schedule.intervalDays)
    : null;

  return (
    <div
      className={cn("space-y-2", className)}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="presentation"
    >
      <TaskAttemptHistory attempts={entry.attempts} compact={compact} />

      {scheduleInfo ? (
        <div
          className={cn(
            "flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-sm",
            getScheduleBadgeClass(schedule.nextReviewAt),
          )}
        >
          <CalendarClock className="h-4 w-4 shrink-0" />
          <span className="font-medium">
            Następna powtórka: {scheduleInfo.label}
          </span>
          <span className="text-xs opacity-80">({scheduleInfo.intervalLabel})</span>
        </div>
      ) : null}

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="repetition-frequency"
          className="rounded-lg border border-slate-200 dark:border-slate-600"
        >
          <AccordionTrigger
            className={cn(
              "px-3 py-2 text-left font-semibold text-slate-800 hover:no-underline dark:text-slate-200",
              compact ? "text-xs" : "text-sm",
            )}
          >
            Częstość powtórek:{" "}
            <span className="tabular-nums" style={getFrequencyTextStyle(frequency)}>
              {frequency}
            </span>
            /100
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-3 pb-3 pt-0">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Częstość powtórek (skala 1–100) mówi, jak pilnie warto wrócić do zadania.
              Harmonogram ustala konkretną datę następnej powtórki — po błędzie zwykle
              jutro, po sukcesach odstępy rosną (3, 7, 14… dni). Suwak częstości
              przesuwa też termin w harmonogramie.
            </p>

            <div className="space-y-2" style={getFrequencySliderStyle(frequency)}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">Twoja częstość</span>
                <span
                  className="font-bold tabular-nums"
                  style={getFrequencyTextStyle(frequency)}
                >
                  {frequency}
                </span>
              </div>
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
              className="inline-flex w-full items-center justify-between gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-950/60"
            >
              Przejdź do strony Powtórki
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
