import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  RotateCw,
  Shuffle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ReviewFlashcards from "@/components/ReviewFlashcards";
import SectionInfoButton from "@/components/SectionInfoButton";
import TaskListPagination from "@/components/TaskListPagination";
import ReviewTaskCard from "@/components/ReviewTaskCard";
import { TaskListCardSkeleton } from "@/components/TaskListCard";
import {
  CycleFilter,
  FilterBar,
  PrettySelectFilter,
} from "@/components/ListFilters";
import { useAuth } from "@/contexts/AuthContext";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import { createPageUrl } from "@/utils";
import { buildTaskDetailsNavState } from "@/utils/task-details-nav";
import { publicSupabase } from "@/supabase-config.js";
import { mapDbTaskRow } from "@/utils/map-db-task";
import {
  filterReviewSessionItems,
  pickRandomReviewTaskIds,
  REVIEW_SCOPE_OPTIONS,
  startRandomReviewSession,
} from "@/utils/review-random";
import {
  isReviewDue,
  resolveTaskSchedule,
  statusToPriority,
} from "@/utils/review-schedule";
import { cn } from "@/lib/utils";

const RANDOM_COUNT_OPTIONS = [1, 3, 5, 10];
const TASKS_PER_SECTION = 5;
const REVIEW_SORT_OPTIONS = [
  { id: "schedule", label: "Harmonogram" },
  { id: "status", label: "Status" },
  { id: "recent", label: "Ostatnio" },
  { id: "added", label: "Dodane" },
  { id: "attempts", label: "Próby" },
];

const LEVEL_MAP = {
  osma_klasa: "ósmoklasisty",
  matura_podstawowa: "podstawowy",
  matura_rozszerzona: "rozszerzony",
};

const surfaceClass =
  "rounded-xl border border-slate-200/70 bg-white dark:border-slate-700/70 dark:bg-slate-800/90";
const mutedText = "text-slate-500 dark:text-slate-400";
const bodyText = "text-slate-700 dark:text-slate-300";
const headingText = "text-slate-900 dark:text-white";
const accentBtn =
  "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500";
const chipBase =
  "inline-flex h-8 min-w-[5.5rem] items-center justify-center gap-1 rounded-md border px-2.5 text-xs font-medium transition";
const chipActive =
  "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900";
const chipIdle =
  "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800/80";

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
    case "status":
      return statusToPriority(item.reviewStatus);
    default:
      return statusToPriority(item.reviewStatus);
  }
}

const SORT_CYCLE_OFF = 0;
const SORT_CYCLE_DESC = 1;
const SORT_CYCLE_ASC = 2;

const DEFAULT_FILTER_STEPS = {
  schedule: SORT_CYCLE_ASC,
  status: SORT_CYCLE_OFF,
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

function ReviewTaskSkeleton() {
  return <TaskListCardSkeleton />;
}

function CollapsibleReviewSection({
  title,
  subtitle = null,
  info = null,
  headerExtra = null,
  open,
  onOpenChange,
  children,
}) {
  return (
    <section className={cn(surfaceClass, "overflow-hidden")}>
      <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
          className="min-w-0 flex-1 text-left transition-colors"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={cn("text-lg font-semibold sm:text-xl", headingText)}>
              {title}
            </h2>
            {headerExtra}
          </div>
          {subtitle ? (
            <div className={cn("mt-1 text-sm", mutedText)}>{subtitle}</div>
          ) : null}
        </button>
        {info ? <div className="mt-0.5 shrink-0">{info}</div> : null}
        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
          aria-label={open ? `Zwiń sekcję ${title}` : `Rozwiń sekcję ${title}`}
          className="mt-0.5 shrink-0 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="section-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-4 pb-5 pt-4 sm:px-5 sm:pb-6 dark:border-slate-700">
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const { userLevel } = useAuth();
  const { getAllProgress } = useTaskProgress();
  const progress = getAllProgress();

  const enforcedLevel =
    userLevel && userLevel !== "brak" ? LEVEL_MAP[userLevel] : null;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlyDueToday, setOnlyDueToday] = useState(true);
  const [randomCount, setRandomCount] = useState(3);
  const [sessionScope, setSessionScope] = useState("random");
  const [sessionTopic, setSessionTopic] = useState("all");
  const [sessionSubtopic, setSessionSubtopic] = useState("all");
  const [sessionLevel, setSessionLevel] = useState(enforcedLevel || "all");
  const [filterSteps, setFilterSteps] = useState(DEFAULT_FILTER_STEPS);
  const [sortRuleOrder, setSortRuleOrder] = useState(DEFAULT_SORT_RULE_ORDER);

  const sortRules = useMemo(
    () => buildSortRules(filterSteps, sortRuleOrder),
    [filterSteps, sortRuleOrder],
  );
  const [scheduleInfoOpen, setScheduleInfoOpen] = useState(false);
  const [randomSectionOpen, setRandomSectionOpen] = useState(false);
  const [flashcardsSectionOpen, setFlashcardsSectionOpen] = useState(false);
  const [listSectionOpen, setListSectionOpen] = useState(false);
  const [listPage, setListPage] = useState(1);
  const listRef = useRef(null);
  const skipListScrollRef = useRef(true);

  useEffect(() => {
    if (enforcedLevel) setSessionLevel(enforcedLevel);
  }, [enforcedLevel]);

  useEffect(() => {
    setSessionSubtopic("all");
  }, [sessionTopic]);

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
          attempts: entry.attempts,
          lastAttempt: entry.attempts[entry.attempts.length - 1],
          nextReviewAt: schedule?.nextReviewAt,
          intervalDays: schedule?.intervalDays,
          correctStreak: schedule?.correctStreak ?? 0,
          reviewStatus: schedule?.reviewStatus ?? entry.reviewStatus,
          masteryStatus: schedule?.masteryStatus,
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

  const sessionSubtopics = useMemo(() => {
    const values = allPracticedItems
      .filter((item) => sessionTopic === "all" || item.task.topic === sessionTopic)
      .map((item) => item.task.subtopic)
      .filter(Boolean);
    return ["all", ...[...new Set(values)].sort((a, b) => a.localeCompare(b, "pl"))];
  }, [allPracticedItems, sessionTopic]);

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

  const sessionSubtopicOptions = useMemo(
    () =>
      sessionSubtopics.map((value) => ({
        value,
        label: value === "all" ? "Wszystkie podtematy" : value,
      })),
    [sessionSubtopics],
  );

  const sessionLevelOptions = useMemo(
    () =>
      sessionLevels.map((level) => ({
        value: level,
        label: level === "all" ? "Wszystkie poziomy" : level,
      })),
    [sessionLevels],
  );

  const sessionScopeOptions = useMemo(
    () =>
      REVIEW_SCOPE_OPTIONS.map((option) => ({
        value: option.id,
        label: option.label,
      })),
    [],
  );

  const effectiveSessionLevel = enforcedLevel || sessionLevel;

  const sessionItems = useMemo(
    () =>
      filterReviewSessionItems(allPracticedItems, {
        scope: sessionScope,
        topic: sessionTopic,
        subtopic: sessionSubtopic,
        level: effectiveSessionLevel,
      }),
    [
      allPracticedItems,
      sessionScope,
      sessionTopic,
      sessionSubtopic,
      effectiveSessionLevel,
    ],
  );

  const reviewItems = useMemo(() => {
    const filtered = onlyDueToday
      ? allPracticedItems.filter((item) => isReviewDue(item.nextReviewAt))
      : allPracticedItems;

    return sortReviewItems(filtered, sortRules);
  }, [allPracticedItems, onlyDueToday, sortRules]);

  const totalListPages = Math.max(
    1,
    Math.ceil(reviewItems.length / TASKS_PER_SECTION),
  );

  const safeListPage = Math.min(listPage, totalListPages);

  const paginatedReviewItems = useMemo(() => {
    const start = (safeListPage - 1) * TASKS_PER_SECTION;
    return reviewItems.slice(start, start + TASKS_PER_SECTION);
  }, [reviewItems, safeListPage]);

  const listSectionRange = useMemo(() => {
    if (!reviewItems.length) return null;
    const start = (safeListPage - 1) * TASKS_PER_SECTION + 1;
    const end = Math.min(safeListPage * TASKS_PER_SECTION, reviewItems.length);
    return { start, end };
  }, [reviewItems.length, safeListPage]);

  useEffect(() => {
    setListPage(1);
    skipListScrollRef.current = true;
  }, [onlyDueToday, sortRules]);

  useEffect(() => {
    if (listPage > totalListPages) {
      setListPage(totalListPages);
    }
  }, [listPage, totalListPages]);

  useEffect(() => {
    if (loading) return;
    if (skipListScrollRef.current) {
      skipListScrollRef.current = false;
      return;
    }
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [safeListPage, loading]);

  const recentItems = useMemo(() => {
    return [...allPracticedItems]
      .sort(
        (a, b) =>
          new Date(b.lastAttempt.date).getTime() -
          new Date(a.lastAttempt.date).getTime(),
      )
      .slice(0, 4);
  }, [allPracticedItems]);

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

  const stats = useMemo(() => {
    const withAttempts = Object.values(progress).filter(
      (p) => p?.attempts?.length,
    );
    const needsReview = withAttempts.filter((p) => {
      const schedule = resolveTaskSchedule(p);
      return statusToPriority(schedule?.reviewStatus) >= statusToPriority("trudne");
    }).length;
    const dueToday = allPracticedItems.filter((item) =>
      isReviewDue(item.nextReviewAt),
    ).length;
    return {
      practiced: withAttempts.length,
      needsReview,
      dueToday,
    };
  }, [allPracticedItems, progress]);

  const handleRandomReviewStart = () => {
    if (!sessionItems.length) return;

    const ids = pickRandomReviewTaskIds(sessionItems, randomCount, {
      filters: {
        scope: sessionScope,
        topic: sessionTopic,
        subtopic: sessionSubtopic,
        level: effectiveSessionLevel,
      },
    });
    if (!ids.length) return;

    startRandomReviewSession(ids);
    navigate(`${createPageUrl("ReviewSession")}?id=${ids[0]}`);
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <h1
                className={cn(
                  "text-3xl font-bold tracking-tight sm:text-4xl",
                  headingText,
                )}
              >
                Powtórki
              </h1>
              <p
                className={cn(
                  "text-sm font-medium sm:text-base",
                  "text-slate-700 dark:text-slate-200",
                )}
              >
                <span className="tabular-nums">{stats.dueToday}</span> do powtórki w 24h
                <span className="mx-1.5 text-slate-400 dark:text-slate-500">·</span>
                <span className="tabular-nums">{stats.practiced}</span> ćwiczone
                <span className="mx-1.5 text-slate-400 dark:text-slate-500">·</span>
                <span className="tabular-nums">{stats.needsReview}</span> trudne / bardzo trudne
              </p>
            </div>
            <Link
              to={createPageUrl("TaskSets")}
              className={cn("text-sm font-medium hover:underline", mutedText)}
            >
              Zbiory zadań
            </Link>
          </div>

          <div className={cn(surfaceClass, "overflow-hidden")}>
            <button
              type="button"
              onClick={() => setScheduleInfoOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80"
            >
              <span className={bodyText}>Jak działa harmonogram powtórek?</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  mutedText,
                  scheduleInfoOpen && "rotate-180",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {scheduleInfoOpen ? (
                <motion.div
                  key="schedule-info"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed dark:border-slate-700">
                    <p className={bodyText}>
                      Po każdej próbie ustalana jest data następnej powtórki na
                      podstawie statusu zadania (od „opanowane” / „bardzo łatwe”
                      do „bardzo trudne”). Łatwiejsze statusy dają dłuższe odstępy,
                      trudniejsze — krótsze (nawet kilka godzin po błędzie).
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </header>

        <CollapsibleReviewSection
          title="Losowa sesja powtórek"
          subtitle={`${sessionItems.length} zadań w puli`}
          open={randomSectionOpen}
          onOpenChange={setRandomSectionOpen}
          info={
            <SectionInfoButton label="Jak działa losowa sesja">
              Losujesz zestaw zadań z wybranej puli i rozwiązujesz je po kolei.
              Zakres „Najtrudniejsze” skupia się na trudniejszych statusach,
              „Dziś powtórka” — na zadaniach z terminem, a „Losowe” tasuje całą
              pulę z preferencją trudniejszych zadań.
            </SectionInfoButton>
          }
        >
          <div className="mb-5 flex flex-wrap items-center justify-end gap-1.5">
            <span className={cn("mr-1 text-xs", mutedText)}>Ile:</span>
            {RANDOM_COUNT_OPTIONS.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setRandomCount(count)}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium tabular-nums transition",
                  randomCount === count ? chipActive : chipIdle,
                )}
              >
                {count}
              </button>
            ))}
          </div>

          <FilterBar columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <CycleFilter
              label="Zakres"
              value={sessionScope}
              options={sessionScopeOptions}
              onChange={setSessionScope}
            />
            <PrettySelectFilter
              label="Temat"
              value={sessionTopic}
              options={sessionTopicOptions}
              onChange={setSessionTopic}
            />
            <PrettySelectFilter
              label="Podtemat"
              value={sessionSubtopic}
              options={sessionSubtopicOptions}
              onChange={setSessionSubtopic}
            />
            <PrettySelectFilter
              label="Poziom"
              value={effectiveSessionLevel}
              options={sessionLevelOptions}
              onChange={setSessionLevel}
              disabled={Boolean(enforcedLevel)}
            />
          </FilterBar>

          <Button
            type="button"
            onClick={handleRandomReviewStart}
            disabled={loading || sessionItems.length === 0}
            className={cn("mt-5 w-full py-5 text-base", accentBtn)}
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Losuj i rozpocznij
          </Button>
        </CollapsibleReviewSection>

        <CollapsibleReviewSection
          title="Fiszki"
          subtitle="Spróbuj zrobić w głowie — potem odwróć kartę"
          open={flashcardsSectionOpen}
          onOpenChange={setFlashcardsSectionOpen}
          info={
            <SectionInfoButton label="Jak działają fiszki">
              Szybka powtórka bez wpisywania odpowiedzi: najpierw widzisz pytanie,
              potem odwracasz kartę i sprawdzasz rozwiązanie. Spróbuj najpierw
              rozwiązać zadanie w głowie, a dopiero potem sprawdź odpowiedź.
            </SectionInfoButton>
          }
        >
          <ReviewFlashcards
            items={allPracticedItems}
            loading={loading}
            enforcedLevel={enforcedLevel}
          />
        </CollapsibleReviewSection>

        <CollapsibleReviewSection
          title="Lista zadań"
          subtitle={
            !loading ? `${reviewItems.length} ${reviewItems.length === 1 ? "zadanie" : "zadań"}` : null
          }
          open={listSectionOpen}
          onOpenChange={setListSectionOpen}
          headerExtra={
            !loading ? (
              <span className="inline-flex min-w-[1.75rem] items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {reviewItems.length}
              </span>
            ) : null
          }
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 dark:border-slate-600 dark:bg-slate-800/60">
                <Switch
                  checked={onlyDueToday}
                  onCheckedChange={setOnlyDueToday}
                  className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-600"
                />
                <span className={cn("text-xs sm:text-sm", bodyText)}>
                  Tylko zaplanowane na dziś
                </span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("text-xs font-medium", mutedText)}>Sortuj</span>
              {REVIEW_SORT_OPTIONS.map((option) => {
                const step = filterSteps[option.id] ?? SORT_CYCLE_OFF;
                const isActive = isSortStepActive(step);
                const direction =
                  step === SORT_CYCLE_ASC ? "↑" : step === SORT_CYCLE_DESC ? "↓" : "";

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSortFilterClick(option.id)}
                    aria-pressed={isActive}
                    className={cn(chipBase, isActive ? chipActive : chipIdle)}
                  >
                    <span>{option.label}</span>
                    <span className="inline-flex w-2.5 justify-center text-[10px] opacity-80" aria-hidden>
                      {direction || "\u00A0"}
                    </span>
                  </button>
                );
              })}
            </div>

            {recentItems.length > 0 ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-slate-100 pt-3 text-xs dark:border-slate-700">
                <span className={mutedText}>Ostatnio:</span>
                {recentItems.map((item, index) => (
                  <span key={item.task.id} className="inline-flex items-center gap-2">
                    {index > 0 ? <span className={mutedText}>·</span> : null}
                    <Link
                      to={`${createPageUrl("TaskDetails")}?id=${item.task.id}`}
                      state={buildTaskDetailsNavState({ from: "review" })}
                      className="font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                    >
                      {item.task.topic || "Zadanie"}
                    </Link>
                  </span>
                ))}
              </div>
            ) : null}

            {!loading && reviewItems.length > 0 ? (
              <p className={cn("border-t border-slate-100 pt-3 text-xs dark:border-slate-700", mutedText)}>
                {reviewItems.length}{" "}
                {reviewItems.length === 1 ? "zadanie" : "zadań"}
                {totalListPages > 1 ? (
                  <>
                    {" · sekcja "}
                    <span className={cn("font-medium", bodyText)}>{safeListPage}</span>
                    {" z "}
                    {totalListPages}
                    {listSectionRange ? (
                      <>
                        {" · zadania "}
                        <span className={cn("font-medium tabular-nums", bodyText)}>
                          {listSectionRange.start}–{listSectionRange.end}
                        </span>
                      </>
                    ) : null}
                  </>
                ) : null}
              </p>
            ) : null}

            <div ref={listRef} className="scroll-mt-24 space-y-3">
              {loading ? (
                <>
                  {Array.from({ length: 3 }, (_, i) => (
                    <ReviewTaskSkeleton key={`review-skel-${i}`} />
                  ))}
                </>
              ) : reviewItems.length === 0 ? (
                <div className="px-2 py-10 text-center">
                  <RotateCw className={cn("mx-auto mb-3 h-8 w-8", mutedText)} />
                  <h3 className={cn("mb-1 text-base font-medium", headingText)}>
                    {onlyDueToday
                      ? "Brak powtórek zaplanowanych na dziś"
                      : "Brak rozwiązanych zadań"}
                  </h3>
                  <p className={cn("mx-auto mb-5 max-w-sm text-sm", mutedText)}>
                    {onlyDueToday
                      ? "Wyłącz filtr, aby zobaczyć wszystkie ćwiczone zadania."
                      : "Rozwiąż zadania w zbiorach — pojawią się tutaj po sprawdzeniu odpowiedzi."}
                  </p>
                  <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                    {onlyDueToday ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOnlyDueToday(false)}
                        className="dark:border-slate-600"
                      >
                        Pokaż wszystkie
                      </Button>
                    ) : null}
                    <Button asChild className={accentBtn}>
                      <Link to={createPageUrl("TaskSets")}>
                        Przejdź do zbiorów
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3 [overflow-anchor:none]">
                    {paginatedReviewItems.map((item) => (
                      <ReviewTaskCard
                        key={item.task.id}
                        task={item.task}
                        nextReviewAt={item.nextReviewAt}
                        intervalDays={item.intervalDays}
                      />
                    ))}
                  </div>

                  {reviewItems.length > TASKS_PER_SECTION ? (
                    <TaskListPagination
                      currentPage={safeListPage}
                      totalPages={totalListPages}
                      onPageChange={setListPage}
                      ariaLabel="Paginacja listy powtórek"
                    />
                  ) : null}
                </>
              )}
            </div>
          </div>
        </CollapsibleReviewSection>
      </div>
    </div>
  );
}
