import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  Layers,
  RotateCw,
  Info,
  Shuffle,
  ChevronDown,
  ChevronUp,
  History,
  TrendingDown,
  CalendarClock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import TaskQuestionBody from "@/components/TaskQuestionBody";
import TaskAttemptHistory from "@/components/TaskAttemptHistory";
import MaturaArkuszLink from "@/components/MaturaArkuszLink";
import {
  CycleFilter,
  FilterBar,
  PrettySelectFilter,
} from "@/components/ListFilters";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import { createPageUrl } from "@/utils";
import { publicSupabase } from "@/supabase-config.js";
import { mapDbTaskRow, TASK_LEVEL_BAR_GRADIENT } from "@/utils/map-db-task";
import {
  pickRandomReviewTaskIds,
  startRandomReviewSession,
} from "@/utils/review-random";
import {
  getFrequencyBadgeStyle,
  getFrequencySliderStyle,
} from "@/utils/review-frequency-colors";
import {
  formatReviewScheduleDetail,
  getScheduleBadgeClass,
  isReviewDue,
  resolveTaskSchedule,
} from "@/utils/review-schedule";
import { cn } from "@/lib/utils";

const FREQ_THRESHOLD = 40;
const RANDOM_COUNT_OPTIONS = [1, 3, 5, 10];
const REVIEW_SORT_OPTIONS = [
  { id: "schedule", label: "Harmonogram" },
  { id: "frequency", label: "Częstość" },
  { id: "recent", label: "Ostatnio ćwiczone" },
  { id: "added", label: "Ostatnio dodane" },
  { id: "attempts", label: "Najwięcej prób" },
];

const cardClass =
  "overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/80 dark:bg-slate-800";
const taskCardHeaderClass =
  "flex flex-col space-y-0 overflow-visible !px-5 !pt-5 !pb-0";
const taskCardBadgeRowClass = "mb-3 flex flex-wrap items-center gap-2";
const taskCardTitleBlockClass = "min-w-0 overflow-visible py-1 leading-normal";
const taskCardFooterClass = "shrink-0 !px-5 !pb-5 !pt-1";
const taskBadgeClass = "px-2.5 py-0.5 text-xs font-medium leading-tight";
const levelTheme = {
  podstawowy: "border-blue-500 text-blue-700 dark:text-blue-400",
  rozszerzony: "border-purple-500 text-purple-700 dark:text-purple-400",
  ósmoklasisty: "border-green-500 text-green-700 dark:text-green-400",
};
const mutedText = "text-slate-500 dark:text-slate-400";
const bodyText = "text-slate-700 dark:text-slate-300";
const headingText = "text-slate-900 dark:text-white";
const accentBtn =
  "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500";
const countBtnActive =
  "bg-blue-600 text-white shadow-sm dark:bg-blue-600 dark:text-white";
const countBtnIdle =
  "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300";
const accentLink =
  "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300";
const SESSION_MODE_OPTIONS = [
  { id: "all", label: "Wszystkie" },
  { id: "due", label: "Termin w 24h" },
  { id: "wrong", label: "Ostatnio błędne" },
  { id: "needsWork", label: "Do poprawy" },
];

function getMasteryStatusClass(statusId) {
  switch (statusId) {
    case "needsWork":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300";
    case "inProgress":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300";
    case "almostMastered":
      return "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300";
    case "mastered":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "new":
    default:
      return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300";
  }
}

function getReviewSortValue(item, criterion) {
  switch (criterion) {
    case "schedule":
      return new Date(item.nextReviewAt || 0).getTime();
    case "recent":
      return new Date(item.lastAttempt.date).getTime();
    case "added":
      return new Date(item.attempts[0].date).getTime();
    case "attempts":
      return item.attempts.length;
    case "frequency":
    default:
      return item.frequency;
  }
}

const SORT_CYCLE_OFF = 0;
const SORT_CYCLE_DESC = 1;
const SORT_CYCLE_ASC = 2;

const DEFAULT_FILTER_STEPS = {
  schedule: SORT_CYCLE_ASC,
  frequency: SORT_CYCLE_OFF,
  recent: SORT_CYCLE_OFF,
  added: SORT_CYCLE_OFF,
  attempts: SORT_CYCLE_OFF,
};

const DEFAULT_SORT_RULE_ORDER = ["schedule"];

function isSortStepActive(step) {
  return step === SORT_CYCLE_ASC || step === SORT_CYCLE_DESC;
}

function buildSortRules(steps, order) {
  return order
    .filter((id) => isSortStepActive(steps[id] ?? SORT_CYCLE_OFF))
    .map((id) => ({
      id,
      direction: steps[id] === SORT_CYCLE_ASC ? "asc" : "desc",
    }));
}

function sortReviewItems(items, rules) {
  const activeRules =
    rules?.length > 0
      ? rules
      : buildSortRules(DEFAULT_FILTER_STEPS, DEFAULT_SORT_RULE_ORDER);
  const sorted = [...items];

  sorted.sort((a, b) => {
    for (const rule of activeRules) {
      const diff =
        getReviewSortValue(a, rule.id) - getReviewSortValue(b, rule.id);
      if (diff !== 0) {
        return rule.direction === "asc" ? diff : -diff;
      }
    }
    return 0;
  });

  return sorted;
}

function formatLastAttemptInfo(lastAttempt) {
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

function getWeeklyImprovedTaskCount(items) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return items.filter((item) =>
    item.attempts.some((attempt, index) => {
      const attemptTime = new Date(attempt.date).getTime();
      if (!Number.isFinite(attemptTime) || attemptTime < weekAgo || !attempt.isCorrect) {
        return false;
      }

      const previousFrequency = item.attempts[index - 1]?.frequencyAfter ?? 50;
      return (attempt.frequencyAfter ?? 100) < previousFrequency;
    }),
  ).length;
}

function ReviewTaskCard({
  task,
  frequency,
  attempts,
  lastAttempt,
  nextReviewAt,
  intervalDays,
  masteryStatus,
  difficultyScore,
  reviewReason,
  onFrequencyCommit,
  onDeleteAttempt,
}) {
  const lastAttemptInfo = formatLastAttemptInfo(lastAttempt);
  const scheduleInfo = formatReviewScheduleDetail(nextReviewAt, intervalDays);
  const scheduleBadgeClass = getScheduleBadgeClass(nextReviewAt);
  const barGradient =
    TASK_LEVEL_BAR_GRADIENT[task.level] ?? "from-slate-400 to-slate-600";
  const [sliderValue, setSliderValue] = useState(frequency);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!isDraggingRef.current) {
      setSliderValue(frequency);
    }
  }, [frequency]);

  const handleSliderChange = ([value]) => {
    isDraggingRef.current = true;
    setSliderValue(value);
  };

  const handleSliderCommit = ([value]) => {
    isDraggingRef.current = false;
    setSliderValue(value);
    onFrequencyCommit(task.id, value);
  };

  return (
    <Card className={cardClass}>
      <CardContent className="flex flex-col gap-0 p-0">
        <div className="flex flex-col xl:flex-row xl:items-stretch">
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <div
              className={`h-1.5 w-full shrink-0 rounded-none bg-gradient-to-r ${barGradient}`}
            />

            <CardHeader className={taskCardHeaderClass}>
              <div className={taskCardBadgeRowClass}>
                <Badge
                  variant="outline"
                  className={cn(
                    taskBadgeClass,
                    levelTheme[task.level] ||
                      "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300",
                  )}
                >
                  {task.level}
                </Badge>
                <MaturaArkuszLink
                  task={task}
                  className={cn(taskBadgeClass, "shrink-0")}
                  linkTarget="worksheets-list"
                />
                {task.source ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      taskBadgeClass,
                      "ml-auto border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400",
                    )}
                  >
                    {task.source}
                  </Badge>
                ) : null}
                <Badge
                  variant="outline"
                  className={cn(taskBadgeClass, scheduleBadgeClass)}
                >
                  <CalendarClock className="mr-1 h-3 w-3" />
                  {scheduleInfo.label}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    taskBadgeClass,
                    getMasteryStatusClass(masteryStatus?.id),
                  )}
                >
                  {masteryStatus?.label || "W trakcie"}
                </Badge>
              </div>

              <CardTitle className={taskCardTitleBlockClass}>
                <TaskQuestionBody
                  task={task}
                  compact
                  tile
                  className="[&_.math-text-ui]:text-base [&_.math-text-ui]:leading-relaxed sm:[&_.math-text-ui]:text-lg"
                />
              </CardTitle>
            </CardHeader>

            <CardContent className={cn(taskCardFooterClass, "space-y-2.5")}>
              <p className={cn("text-sm", bodyText)}>
                Temat: {task.topic} • Typ:{" "}
                {task.type === "closed" ? "zamknięte" : "otwarte"}
                <span className={cn("ml-1", mutedText)}>
                  • Interwał: {scheduleInfo.intervalLabel}
                </span>
              </p>
              <p className="rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-2 text-sm text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
                {reviewReason || "W trakcie nauki"}
              </p>

              <div className="grid gap-3 border-t border-slate-100 pt-3 dark:border-slate-700 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className={cn("text-xs font-medium", mutedText)}>
                      Historia prób
                    </span>
                    <span className={cn("text-[11px]", mutedText)}>
                      Kliknij próbę, aby ją usunąć
                    </span>
                  </div>
                  <TaskAttemptHistory
                    attempts={attempts}
                    maxVisible={attempts.length}
                    onDeleteAttempt={(attemptIndex) =>
                      onDeleteAttempt(task.id, attemptIndex)
                    }
                  />
                </div>
                <p className={cn("text-xs", mutedText)}>
                  <span
                    className={
                      lastAttemptInfo.isCorrect
                        ? "font-medium text-emerald-700 dark:text-emerald-400"
                        : "font-medium text-rose-700 dark:text-rose-400"
                    }
                  >
                    {lastAttemptInfo.isCorrect ? "Ostatnio: poprawnie" : "Ostatnio: błędnie"}
                  </span>
                  <span> · </span>
                  <span className="tabular-nums">{lastAttemptInfo.dateLabel}</span>
                  {lastAttemptInfo.relativeLabel ? (
                    <span> · {lastAttemptInfo.relativeLabel}</span>
                  ) : null}
                  <span> · {attempts.length} {attempts.length === 1 ? "próba" : "prób"}</span>
                </p>
              </div>
            </CardContent>
          </div>

          <div
            className="flex shrink-0 flex-col justify-center gap-4 border-t border-slate-100 p-5 xl:w-64 xl:self-stretch xl:border-l xl:border-t-0 xl:pl-6 dark:border-slate-700"
            style={getFrequencySliderStyle(sliderValue)}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={cn("text-xs font-medium", mutedText)}>Częstość</span>
              <Badge
                className="border-0 px-2.5 py-0.5 text-sm tabular-nums"
                style={getFrequencyBadgeStyle(sliderValue)}
              >
                {sliderValue}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className={mutedText}>Trudność</span>
              <span className={cn("font-semibold tabular-nums", headingText)}>
                {difficultyScore ?? 0}/100
              </span>
            </div>

            <Slider
              value={[sliderValue]}
              min={1}
              max={100}
              step={1}
              onValueChange={handleSliderChange}
              onValueCommit={handleSliderCommit}
              className={cn(
                "review-freq-slider w-full",
                "[&_[role=slider]]:border-[var(--freq-slider-thumb)]",
                "[&_[role=slider]]:bg-white",
                "[&>span:first-child]:bg-[var(--freq-slider-track)]",
                "[&>span:first-child>span]:bg-[var(--freq-slider-range)]",
              )}
            />

            <Link
              to={`${createPageUrl("TaskDetails")}?id=${task.id}`}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/80 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/60",
              )}
            >
              Powtórz
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewTaskSkeleton() {
  return (
    <Card className={cardClass}>
      <CardContent className="flex flex-col gap-0 p-0 xl:flex-row xl:items-stretch">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-1.5 w-full rounded-none bg-slate-200 dark:bg-slate-700" />
          <div className={taskCardHeaderClass}>
            <div className={taskCardBadgeRowClass}>
              <Skeleton className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="ml-auto h-6 w-14 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="mt-1 space-y-2">
              <Skeleton className="h-3.5 w-full bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="h-3.5 w-[94%] bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
          <div className={cn(taskCardFooterClass, "space-y-2.5")}>
            <Skeleton className="h-3.5 w-[90%] bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="h-6 w-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
        <div className="flex shrink-0 flex-col justify-center gap-4 border-t border-slate-100 p-5 xl:w-64 xl:self-stretch xl:border-l xl:border-t-0 xl:pl-6 dark:border-slate-700">
          <Skeleton className="h-5 w-full bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-6 w-full bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-9 w-full bg-slate-200 dark:bg-slate-700" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const { getAllProgress, setFrequency, deleteAttempt } = useTaskProgress();
  const progress = getAllProgress();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlyDueBySchedule, setOnlyDueBySchedule] = useState(true);
  const [randomCount, setRandomCount] = useState(3);
  const [sessionTopic, setSessionTopic] = useState("all");
  const [sessionLevel, setSessionLevel] = useState("all");
  const [sessionMode, setSessionMode] = useState("all");
  const [filterSteps, setFilterSteps] = useState(DEFAULT_FILTER_STEPS);
  const [sortRuleOrder, setSortRuleOrder] = useState(DEFAULT_SORT_RULE_ORDER);

  const sortRules = useMemo(
    () => buildSortRules(filterSteps, sortRuleOrder),
    [filterSteps, sortRuleOrder],
  );
  const [frequencyInfoOpen, setFrequencyInfoOpen] = useState(false);
  const [layoutTaskId, setLayoutTaskId] = useState(null);
  const [highlightTaskId, setHighlightTaskId] = useState(null);
  const scrollToTaskIdRef = useRef(null);
  const highlightTimeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const { data, error } = await publicSupabase.from("tasks").select("*");

      if (cancelled) return;

      if (error) {
        console.error("[Review]", error);
        setTasks([]);
      } else {
        setTasks(
          (data ?? [])
            .map(mapDbTaskRow)
            .filter((t) => t && t.question),
        );
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const allPracticedItems = useMemo(() => {
    return tasks
      .map((task) => {
        const entry = progress[task.id];
        if (!entry?.attempts?.length) return null;
        const schedule = resolveTaskSchedule(entry);
        return {
          task,
          frequency: entry.frequency ?? 50,
          attempts: entry.attempts,
          lastAttempt: entry.attempts[entry.attempts.length - 1],
          nextReviewAt: schedule?.nextReviewAt,
          intervalDays: schedule?.intervalDays,
          correctStreak: schedule?.correctStreak ?? 0,
          masteryStatus: schedule?.masteryStatus,
          difficultyScore: schedule?.difficultyScore ?? 0,
          reviewReason: schedule?.reviewReason,
        };
      })
      .filter(Boolean);
  }, [tasks, progress]);

  const sessionTopics = useMemo(() => {
    return [
      "all",
      ...[...new Set(allPracticedItems.map((item) => item.task.topic).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "pl")),
    ];
  }, [allPracticedItems]);

  const sessionLevels = useMemo(() => {
    return [
      "all",
      ...[...new Set(allPracticedItems.map((item) => item.task.level).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "pl")),
    ];
  }, [allPracticedItems]);

  const sessionTopicOptions = useMemo(
    () =>
      sessionTopics.map((topic) => ({
        value: topic,
        label: topic === "all" ? "Wszystkie tematy" : topic,
      })),
    [sessionTopics],
  );

  const sessionLevelOptions = useMemo(
    () =>
      sessionLevels.map((level) => ({
        value: level,
        label: level === "all" ? "Wszystkie poziomy" : level,
      })),
    [sessionLevels],
  );

  const sessionModeOptions = useMemo(
    () =>
      SESSION_MODE_OPTIONS.map((mode) => ({
        value: mode.id,
        label: mode.label,
      })),
    [],
  );

  const sessionItems = useMemo(() => {
    return allPracticedItems.filter((item) => {
      if (sessionTopic !== "all" && item.task.topic !== sessionTopic) return false;
      if (sessionLevel !== "all" && item.task.level !== sessionLevel) return false;
      if (sessionMode === "due" && !isReviewDue(item.nextReviewAt)) return false;
      if (sessionMode === "wrong" && item.lastAttempt?.isCorrect) return false;
      if (sessionMode === "needsWork" && item.masteryStatus?.id !== "needsWork") return false;
      return true;
    });
  }, [allPracticedItems, sessionTopic, sessionLevel, sessionMode]);

  const reviewItems = useMemo(() => {
    const filtered = onlyDueBySchedule
      ? allPracticedItems.filter((item) => isReviewDue(item.nextReviewAt))
      : allPracticedItems;

    return sortReviewItems(filtered, sortRules);
  }, [allPracticedItems, onlyDueBySchedule, sortRules]);

  const recentItems = useMemo(() => {
    return [...allPracticedItems]
      .sort(
        (a, b) =>
          new Date(b.lastAttempt.date).getTime() -
          new Date(a.lastAttempt.date).getTime(),
      )
      .slice(0, 5);
  }, [allPracticedItems]);

  const handleFrequencyCommit = useCallback(
    (taskId, value) => {
      setFrequency(taskId, value);
      scrollToTaskIdRef.current = taskId;
      setLayoutTaskId(taskId);
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      setHighlightTaskId(null);
      requestAnimationFrame(() => setHighlightTaskId(taskId));
      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightTaskId(null);
        highlightTimeoutRef.current = null;
      }, 1750);
    },
    [setFrequency],
  );

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const handleDeleteAttempt = useCallback(
    (taskId, attemptIndex) => {
      if (!window.confirm("Usunąć wybraną zapisaną próbę tego zadania?")) return;
      deleteAttempt(taskId, attemptIndex);
    },
    [deleteAttempt],
  );

  const handleSortFilterClick = (id) => {
    setFilterSteps((prev) => {
      const current = prev[id] ?? SORT_CYCLE_OFF;
      const next = (current + 1) % 3;

      setSortRuleOrder((order) => {
        const wasActive = isSortStepActive(current);
        const willBeActive = isSortStepActive(next);

        if (willBeActive && !wasActive) {
          return order.includes(id) ? order : [...order, id];
        }
        if (!willBeActive && wasActive) {
          return order.filter((item) => item !== id);
        }
        return order;
      });

      return { ...prev, [id]: next };
    });
  };

  useLayoutEffect(() => {
    const taskId = scrollToTaskIdRef.current;
    if (!taskId) return;

    scrollToTaskIdRef.current = null;

    requestAnimationFrame(() => {
      const root = document.querySelector(`[data-review-task-id="${taskId}"]`);
      if (!root) return;

      root.scrollIntoView({ block: "center", behavior: "smooth" });

      const slider = root.querySelector('[role="slider"]');
      if (slider instanceof HTMLElement) {
        slider.focus({ preventScroll: true });
      }

      setLayoutTaskId(null);
    });
  }, [reviewItems]);

  const stats = useMemo(() => {
    const withAttempts = Object.values(progress).filter(
      (p) => p?.attempts?.length,
    );
    const needsReview = withAttempts.filter(
      (p) => (p.frequency ?? 0) >= FREQ_THRESHOLD,
    ).length;
    const dueToday = allPracticedItems.filter((item) =>
      isReviewDue(item.nextReviewAt),
    ).length;
    const totalAttempts = withAttempts.reduce(
      (sum, p) => sum + p.attempts.length,
      0,
    );
    return {
      practiced: withAttempts.length,
      needsReview,
      dueToday,
      totalAttempts,
      improvedThisWeek: getWeeklyImprovedTaskCount(allPracticedItems),
    };
  }, [allPracticedItems, progress]);

  const handleRandomReviewStart = () => {
    if (!sessionItems.length) return;

    const ids = pickRandomReviewTaskIds(sessionItems, randomCount, {
      reviewThreshold: FREQ_THRESHOLD,
      filters: {
        topic: sessionTopic,
        level: sessionLevel,
        mode: sessionMode,
      },
    });
    if (!ids.length) return;

    startRandomReviewSession(ids);
    navigate(`${createPageUrl("TaskDetails")}?id=${ids[0]}`, {
      state: { from: "review-random" },
    });
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <h1 className={cn("flex items-center gap-3 text-3xl font-bold sm:text-4xl", headingText)}>
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Powtórki
          </h1>
          {/* <p className={cn("max-w-2xl text-base", bodyText)}>
            Zadania, które rozwiązałeś w zbiorach, trafiają tutaj według częstości
            powtórek. Im wyższa wartość, tym pilniej warto do nich wrócić.
          </p> */}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Ćwiczone zadania", value: stats.practiced },
            { label: "Do powtórki w 24h", value: stats.dueToday, icon: CalendarClock },
            { label: `Wysoka częstość (≥${FREQ_THRESHOLD})`, value: stats.needsReview },
            { label: "Wszystkie próby", value: stats.totalAttempts },
            {
              label: "Poprawione w tyg.",
              value: stats.improvedThisWeek,
              icon: TrendingDown,
            },
          ].map((stat) => (
            <Card key={stat.label} className={cardClass}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn("text-xs font-medium uppercase tracking-wide", mutedText)}>
                    {stat.label}
                  </p>
                  {stat.icon ? (
                    <stat.icon className={cn("h-4 w-4", mutedText)} />
                  ) : null}
                </div>
                <p className={cn("mt-1 text-2xl font-semibold tabular-nums", headingText)}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative z-30">
          <Card className={cn(cardClass, "bg-slate-50/80 dark:bg-slate-800/80")}>
            <button
              type="button"
              id="frequency-info-trigger"
              aria-expanded={frequencyInfoOpen}
              aria-controls="frequency-info-panel"
              onClick={() => setFrequencyInfoOpen((open) => !open)}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-blue-50/80 dark:hover:bg-blue-950/30"
            >
              <Info className={cn("h-4 w-4 shrink-0", mutedText)} />
              <span className={cn("text-sm font-medium", headingText)}>
                Częstość i harmonogram
              </span>
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ease-out",
                  mutedText,
                  frequencyInfoOpen && "rotate-180",
                )}
              />
            </button>
          </Card>

          <AnimatePresence>
            {frequencyInfoOpen ? (
              <>
                <motion.div
                  key="frequency-info-backdrop"
                  role="presentation"
                  className="fixed inset-0 z-40 bg-black/15 dark:bg-black/35"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setFrequencyInfoOpen(false)}
                />
                <motion.div
                  key="frequency-info-panel"
                  id="frequency-info-panel"
                  role="region"
                  aria-labelledby="frequency-info-trigger"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-slate-200/80 bg-white p-4 shadow-lg dark:border-slate-700/80 dark:bg-slate-800"
                >
                  <div className="flex gap-3">
                    <Info className={cn("mt-0.5 h-4 w-4 shrink-0", mutedText)} />
                    <p className={cn("text-sm leading-relaxed", bodyText)}>
                      <strong className={headingText}>Harmonogram:</strong> po każdej
                      próbie ustalana jest data następnej powtórki. Poprawna odpowiedź
                      wydłuża odstęp (3 → 7 → 14 → 21 → 30 → 45 → 60 → 90 dni), błędna
                      skraca go do 1 dnia. Zadania „do powtórki w 24h” to te, których
                      termin już nadszedł albo nadejdzie w ciągu najbliższych 24 godzin.
                      <br />
                      <br />
                      <strong className={headingText}>Częstość (1–100):</strong> im
                      wyższa wartość, tym pilniej warto wrócić do zadania. Rośnie po
                      błędach, maleje po sukcesach. Możesz ją też ustawić ręcznie —
                      harmonogram dostosuje się do suwaka.
                    </p>
                  </div>
                </motion.div>
              </>
            ) : null}
          </AnimatePresence>
        </div>

        <Card className={cardClass}>
          <CardContent className="space-y-4 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Shuffle className={cn("h-5 w-5 shrink-0", mutedText)} />
                <div>
                  <h2 className={cn("text-sm font-semibold sm:text-base", headingText)}>
                    Sesja powtórek
                  </h2>
                  <p className={cn("text-xs", mutedText)}>
                    Pasuje {sessionItems.length} z {allPracticedItems.length} ćwiczonych zadań
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-center">
                <span className={cn("text-sm", mutedText)}>Ile zadań:</span>
                {RANDOM_COUNT_OPTIONS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setRandomCount(count)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-sm font-medium tabular-nums transition",
                      randomCount === count ? countBtnActive : countBtnIdle,
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <FilterBar columnsClassName="grid-cols-1 sm:grid-cols-3">
              <PrettySelectFilter
                label="Temat"
                value={sessionTopic}
                options={sessionTopicOptions}
                onChange={setSessionTopic}
              />
              <PrettySelectFilter
                label="Poziom"
                value={sessionLevel}
                options={sessionLevelOptions}
                onChange={setSessionLevel}
              />
              <CycleFilter
                label="Tryb"
                value={sessionMode}
                options={sessionModeOptions}
                onChange={setSessionMode}
              />
            </FilterBar>

            <Button
              type="button"
              onClick={handleRandomReviewStart}
              disabled={loading || sessionItems.length === 0}
              className={cn("w-full", accentBtn)}
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Losuj i rozpocznij
            </Button>
          </CardContent>
        </Card>

        {recentItems.length > 0 ? (
          <Card className={cardClass}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <History className={cn("h-5 w-5 shrink-0", mutedText)} />
                  <h2 className={cn("text-sm font-semibold sm:text-base", headingText)}>
                    Ostatnio ćwiczone
                  </h2>
                </div>
                <span className={cn("text-xs", mutedText)}>Szybki powrót</span>
              </div>

              <div className="grid gap-2">
                {recentItems.map((item) => {
                  const info = formatLastAttemptInfo(item.lastAttempt);
                  return (
                    <Link
                      key={item.task.id}
                      to={`${createPageUrl("TaskDetails")}?id=${item.task.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 transition-colors hover:border-blue-200 hover:bg-blue-50/80 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
                    >
                      <div className="min-w-0">
                        <p className={cn("truncate text-sm font-medium", headingText)}>
                          {item.task.topic || "Zadanie"}
                        </p>
                        <p className={cn("truncate text-xs", mutedText)}>
                          {item.task.level} · {info.dateLabel}
                          {info.relativeLabel ? ` · ${info.relativeLabel}` : ""}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                          info.isCorrect
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
                        )}
                      >
                        {info.isCorrect ? "poprawnie" : "błędnie"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-3">
              <Switch
                checked={onlyDueBySchedule}
                onCheckedChange={setOnlyDueBySchedule}
                className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-600"
              />
              <span className={cn("text-sm font-medium", bodyText)}>
                Tylko zadania do powtórki wg harmonogramu (zaległe lub w ciągu 24h)
              </span>
            </label>
            <Link
              to={createPageUrl("TaskSets")}
              className={cn(
                "inline-flex items-center gap-2 text-sm font-medium hover:underline",
                accentLink,
              )}
            >
              <Layers className="h-4 w-4" />
              Zbiory zadań
            </Link>
          </div>

          <div className="space-y-2 [overflow-anchor:none]">
            <span className={cn("text-sm font-medium", mutedText)}>Sortuj:</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {REVIEW_SORT_OPTIONS.map((option) => {
              const step = filterSteps[option.id] ?? SORT_CYCLE_OFF;
              const isActive = isSortStepActive(step);
              const ruleIndex = sortRules.findIndex((rule) => rule.id === option.id);
              const showPriority = isActive && sortRules.length > 1;
              const arrowKey =
                step === SORT_CYCLE_ASC
                  ? "down"
                  : step === SORT_CYCLE_DESC
                    ? "up"
                    : "idle";

              return (
                <motion.button
                  key={option.id}
                  type="button"
                  layout={false}
                  onClick={() => handleSortFilterClick(option.id)}
                  aria-pressed={isActive}
                  aria-label={
                    step === SORT_CYCLE_ASC
                      ? `${option.label}, sortowanie rosnąco`
                      : step === SORT_CYCLE_DESC
                        ? `${option.label}, sortowanie malejąco`
                        : `${option.label}, sortowanie wyłączone`
                  }
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className={cn(
                    "grid w-full grid-cols-[1.25rem_minmax(0,1fr)_0.875rem] items-center gap-1 rounded-md px-2 py-2 text-sm font-medium transition-colors duration-200",
                    isActive ? countBtnActive : countBtnIdle,
                  )}
                >
                  <span
                    className={cn(
                      "shrink-0 text-right text-xs tabular-nums leading-none",
                      showPriority ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden={!showPriority}
                  >
                    {showPriority ? `${ruleIndex + 1}.` : "4."}
                  </span>
                  <span className="truncate text-center">{option.label}</span>
                  <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center justify-self-end">
                    <AnimatePresence mode="wait" initial={false}>
                      {arrowKey === "down" ? (
                        <motion.span
                          key="sort-down"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                        </motion.span>
                      ) : arrowKey === "up" ? (
                        <motion.span
                          key="sort-up"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <ChevronUp className="h-3.5 w-3.5" aria-hidden />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="sort-idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.12 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <ChevronDown
                            className="h-3.5 w-3.5 opacity-40"
                            aria-hidden
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.button>
              );
            })}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <ReviewTaskSkeleton key={`review-skel-${i}`} />
            ))}
          </div>
        ) : reviewItems.length === 0 ? (
          <Card className={cardClass}>
            <CardContent className="p-10 text-center">
              <RotateCw className={cn("mx-auto mb-3 h-12 w-12", mutedText)} />
              <h3 className={cn("mb-2 text-lg font-semibold", headingText)}>
                {onlyDueBySchedule
                  ? "Brak zaplanowanych powtórek w ciągu 24h"
                  : "Brak rozwiązanych zadań"}
              </h3>
              <p className={cn("mb-5 text-sm", mutedText)}>
                {onlyDueBySchedule
                  ? "Żadne zadanie nie ma terminu powtórki w ciągu najbliższych 24 godzin. Wyłącz filtr harmonogramu, żeby zobaczyć wszystkie ćwiczone zadania."
                  : "Rozwiąż zadania w zbiorach — po sprawdzeniu odpowiedzi pojawią się tutaj z harmonogramem powtórek."}
              </p>
              <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                {onlyDueBySchedule ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOnlyDueBySchedule(false)}
                    className="dark:border-slate-600"
                  >
                    Pokaż wszystkie ćwiczone
                  </Button>
                ) : null}
                <Button asChild className={accentBtn}>
                  <Link to={createPageUrl("TaskSets")}>
                    Przejdź do zbiorów zadań
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 [overflow-anchor:none]">
            {reviewItems.map((item) => {
              const {
                task,
                frequency,
                attempts,
                lastAttempt,
                nextReviewAt,
                intervalDays,
                masteryStatus,
                difficultyScore,
                reviewReason,
              } = item;
              return (
                <motion.div
                  key={task.id}
                  layout={layoutTaskId === task.id ? "position" : false}
                  data-review-task-id={task.id}
                  className="rounded-xl"
                  animate={
                    highlightTaskId === task.id
                      ? {
                          scale: [1, 1.012, 1, 1.012, 1, 1.012, 1],
                          boxShadow: [
                            "0 0 0 0 rgba(37,99,235,0)",
                            "0 0 0 4px rgba(37,99,235,0.28), 0 18px 35px rgba(37,99,235,0.16)",
                            "0 0 0 0 rgba(37,99,235,0)",
                            "0 0 0 4px rgba(37,99,235,0.28), 0 18px 35px rgba(37,99,235,0.16)",
                            "0 0 0 0 rgba(37,99,235,0)",
                            "0 0 0 4px rgba(37,99,235,0.28), 0 18px 35px rgba(37,99,235,0.16)",
                            "0 0 0 0 rgba(37,99,235,0)",
                          ],
                        }
                      : {
                          scale: 1,
                          boxShadow: "0 0 0 0 rgba(37,99,235,0)",
                        }
                  }
                  transition={{
                    layout: { duration: 0.25, ease: "easeInOut" },
                    duration: highlightTaskId === task.id ? 1.6 : 0.2,
                    times: [0, 0.16, 0.32, 0.48, 0.64, 0.8, 1],
                    ease: "easeInOut",
                  }}
                >
                  <ReviewTaskCard
                    task={task}
                    frequency={frequency}
                    attempts={attempts}
                    lastAttempt={lastAttempt}
                    nextReviewAt={nextReviewAt}
                    intervalDays={intervalDays}
                    masteryStatus={masteryStatus}
                    difficultyScore={difficultyScore}
                    reviewReason={reviewReason}
                    onFrequencyCommit={handleFrequencyCommit}
                    onDeleteAttempt={handleDeleteAttempt}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
