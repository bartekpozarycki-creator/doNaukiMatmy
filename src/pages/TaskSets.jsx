import { useState, useEffect, useRef, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers, ChevronLeft, ChevronRight, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import TaskQuestionBody from "@/components/TaskQuestionBody";
import MaturaArkuszLink from "@/components/MaturaArkuszLink";
import FavoriteTaskActions from "@/components/FavoriteTaskActions";
import {
  CycleFilter,
  FilterBar,
  FilterSearchField,
  PrettySelectFilter,
} from "@/components/ListFilters";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import { getNotebookPageStyle } from "@/utils/notebook-page-style";
import { cn } from "@/lib/utils";
import { publicSupabase } from "@/supabase-config.js";
import { mapDbTaskRow, TASK_LEVEL_BAR_GRADIENT } from "@/utils/map-db-task";

const TASKS_PER_PAGE = 8;
const INITIAL_SKELETON_COUNT = TASKS_PER_PAGE;

function buildPaginationItems(currentPage, totalPages) {
  if (totalPages <= 1) return [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({
      type: "page",
      value: i + 1,
    }));
  }

  const items = [];
  const seen = new Set();

  const addPage = (page) => {
    if (page < 1 || page > totalPages || seen.has(page)) return;
    seen.add(page);
    items.push({ type: "page", value: page });
  };

  addPage(1);

  if (currentPage > 3) {
    items.push({ type: "ellipsis", key: "start" });
  }

  for (
    let page = Math.max(2, currentPage - 1);
    page <= Math.min(totalPages - 1, currentPage + 1);
    page += 1
  ) {
    addPage(page);
  }

  if (currentPage < totalPages - 2) {
    items.push({ type: "ellipsis", key: "end" });
  }

  addPage(totalPages);
  return items;
}

function TaskSetsPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const items = buildPaginationItems(currentPage, totalPages);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1.5 pt-2"
      aria-label="Paginacja zadań"
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 dark:border-slate-600 dark:bg-slate-800"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Poprzednia strona"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {items.map((item) =>
        item.type === "ellipsis" ? (
          <span
            key={item.key}
            className="px-1 text-sm text-slate-400 dark:text-slate-500"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Button
            key={item.value}
            type="button"
            variant={item.value === currentPage ? "default" : "outline"}
            size="sm"
            className={`min-w-9 h-9 px-2 ${
              item.value === currentPage
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            }`}
            onClick={() => onPageChange(item.value)}
            aria-label={`Strona ${item.value}`}
            aria-current={item.value === currentPage ? "page" : undefined}
          >
            {item.value}
          </Button>
        ),
      )}

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 dark:border-slate-600 dark:bg-slate-800"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Następna strona"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

const skeletonClass = "bg-slate-200 dark:bg-slate-700";

const taskCardLayoutClass =
  "flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-[box-shadow,border-color] duration-200 ease-out group-hover/tile:border-slate-300 group-hover/tile:shadow-md dark:border-slate-700/80 dark:bg-slate-800 dark:group-hover/tile:border-slate-600 dark:group-hover/tile:shadow-lg";

const taskTileMotionTransition = {
  type: "tween",
  duration: 0.2,
  ease: [0.25, 0.1, 0.25, 1],
};

const taskCardHeaderClass =
  "flex flex-col space-y-0 overflow-visible !px-3.5 !pt-3.5 !pb-1.5";
const taskCardBadgeRowClass = "mb-2.5 flex flex-wrap items-center gap-1.5";
const taskCardTitleBlockClass = "min-w-0 overflow-visible py-1 leading-normal";
const taskCardFooterClass = "shrink-0 !px-3.5 !pb-3.5 !pt-2.5";

const taskMasonryTileClass = "mb-5 w-full break-inside-avoid";

const badgeClass = "px-2.5 py-0.5 text-xs font-medium leading-tight";

function getExamCollectionCta(userLevel) {
  if (userLevel === "osma_klasa") {
    return {
      title: "Zadania do e8 poukładane tematycznie",
      text: "Przejdź do listy tematów pod egzamin ósmoklasisty i wybierz dział, który chcesz przećwiczyć.",
    };
  }

  if (userLevel === "matura_podstawowa" || userLevel === "matura_rozszerzona") {
    return {
      title: "Zadania do matury poukładane tematycznie",
      text: "Otwórz tematyczny zbiór zadań dopasowany do wybranego poziomu matury.",
    };
  }

  return {
    title: "Zadania do egzaminu poukładane tematycznie",
    text: "Wybierz maturę podstawową, maturę rozszerzoną albo e8, a potem przejdź do listy tematów.",
  };
}

function TaskSetCardSkeleton() {
  return (
    <Card className={taskCardLayoutClass} aria-hidden>
      <Skeleton
        className={`h-1.5 w-full shrink-0 rounded-none ${skeletonClass}`}
      />
      <CardHeader className={taskCardHeaderClass}>
        <div className={taskCardBadgeRowClass}>
          <Skeleton
            className={`h-6 w-24 shrink-0 rounded-full ${skeletonClass}`}
          />
          <Skeleton
            className={`h-6 w-20 shrink-0 rounded-full ${skeletonClass}`}
          />
          <Skeleton
            className={`ml-auto h-6 w-14 shrink-0 rounded-full ${skeletonClass}`}
          />
        </div>
        <div className="mt-1 space-y-2">
          <Skeleton className={`h-3.5 w-full ${skeletonClass}`} />
          <Skeleton className={`h-3.5 w-[94%] ${skeletonClass}`} />
        </div>
      </CardHeader>
      <CardContent className={taskCardFooterClass}>
        <Skeleton className={`h-3.5 w-[90%] ${skeletonClass}`} />
      </CardContent>
    </Card>
  );
}

function TaskSetCard({ task, levelTheme }) {
  const { getProgress } = useTaskProgress();
  const isUnattempted = !getProgress(task.id)?.attempts?.length;
  const barGradient =
    TASK_LEVEL_BAR_GRADIENT[task.level] ?? "from-slate-400 to-slate-600";

  return (
    <Card className={cn(taskCardLayoutClass, "relative")}>
      <div className={cn(isUnattempted && "opacity-60")}>
        <div
          className={`h-1.5 w-full shrink-0 bg-gradient-to-r ${barGradient} rounded-none`}
        />
        <CardHeader className={taskCardHeaderClass}>
          <div
            className={taskCardBadgeRowClass}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <Badge
              variant="outline"
              className={`${badgeClass} ${
                levelTheme[task.level] ||
                "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {task.level}
            </Badge>
            <MaturaArkuszLink
              task={task}
              className={`${badgeClass} shrink-0`}
              linkTarget="worksheets-list"
            />
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <FavoriteTaskActions taskId={task.id} size="sm" stopPropagation />
              <Badge
                variant="outline"
                className={`${badgeClass} border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400`}
              >
                {task.source}
              </Badge>
            </div>
          </div>
          <CardTitle className={taskCardTitleBlockClass}>
            <TaskQuestionBody task={task} compact tile />
          </CardTitle>
        </CardHeader>
        <CardContent className={taskCardFooterClass}>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            Temat: {task.topic} • Typ:{" "}
            {task.type === "closed" ? "zamknięte" : "otwarte"}
          </p>
        </CardContent>
      </div>
      {isUnattempted && (
        <span className="pointer-events-none absolute bottom-3 right-3.5 text-xs font-medium text-slate-400 dark:text-slate-500">
          nigdy nie robione
        </span>
      )}
    </Card>
  );
}

function TaskSetGridTile({ task, showMask, levelTheme }) {
  const navigate = useNavigate();

  if (!task) {
    return (
      <div className={taskMasonryTileClass}>
        <TaskSetCardSkeleton />
      </div>
    );
  }

  return (
    <div className={`relative ${taskMasonryTileClass}`}>
      <div
        className={showMask ? "pointer-events-none invisible" : ""}
        aria-hidden={showMask}
      >
        <motion.div
          role="link"
          tabIndex={0}
          onClick={() =>
            navigate(`${createPageUrl("TaskDetails")}?id=${task.id}`)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`${createPageUrl("TaskDetails")}?id=${task.id}`);
            }
          }}
          className="group/tile block cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          initial={false}
          whileHover={{ scale: 1.012 }}
          whileTap={{ scale: 0.988 }}
          transition={taskTileMotionTransition}
        >
          <TaskSetCard task={task} levelTheme={levelTheme} />
        </motion.div>
      </div>
      <AnimatePresence>
        {showMask && (
          <motion.div
            key="tile-mask"
            className="absolute inset-0 z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <TaskSetCardSkeleton />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TaskSetsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [source, setSource] = useState("all");
  const [topic, setTopic] = useState("all");
  const [taskType, setTaskType] = useState("all");
  const { userLevel } = useAuth();
  const { isDark } = useTheme();
  const examCollectionCta = getExamCollectionCta(userLevel);

  useEffect(() => {
    const filterTopic = location.state?.filterTopic;
    if (
      typeof filterTopic === "string" &&
      filterTopic.trim() !== "" &&
      filterTopic !== "—"
    ) {
      setTopic(filterTopic.trim());
    }
  }, [location.state?.filterTopic]);

  useEffect(() => {
    const filterLevel = location.state?.filterLevel;
    if (
      typeof filterLevel === "string" &&
      ["podstawowy", "rozszerzony", "ósmoklasisty"].includes(filterLevel)
    ) {
      setLevel(filterLevel);
    }
  }, [location.state?.filterLevel]);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentRevealed, setContentRevealed] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef(null);
  const skipScrollRef = useRef(true);

  const levelMap = {
    osma_klasa: "ósmoklasisty",
    matura_podstawowa: "podstawowy",
    matura_rozszerzona: "rozszerzony",
  };
  const levelTheme = {
    podstawowy: "border-blue-500 text-blue-700 dark:text-blue-400",
    rozszerzony: "border-purple-500 text-purple-700 dark:text-purple-400",
    ósmoklasisty: "border-green-500 text-green-700 dark:text-green-400",
  };
  const enforcedLevel =
    userLevel && userLevel !== "brak" ? levelMap[userLevel] : null;

  useEffect(() => {
    if (loading) {
      setContentRevealed(false);
      return undefined;
    }
    if (tasks.length === 0) {
      setContentRevealed(true);
      return undefined;
    }
    const frameId = requestAnimationFrame(() => setContentRevealed(true));
    return () => cancelAnimationFrame(frameId);
  }, [loading, tasks.length]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setContentRevealed(false);
      setFetchError(null);

      const { data, error } = await publicSupabase.from("tasks").select("*");

      if (cancelled) return;

      if (error) {
        console.error("[TaskSets]", error.code, error.message, error.details);
        setFetchError(error.message);
        setTasks([]);
        setLoading(false);
        return;
      }

      const mapped = (data ?? [])
        .map(mapDbTaskRow)
        .filter((t) => t && t.question);

      if (!cancelled && mapped.length === 0 && (data?.length ?? 0) === 0) {
        console.warn(
          "[TaskSets] Zapytanie OK, ale 0 wierszy — sprawdź czy tabela tasks ma dane oraz polityki RLS (SELECT dla anon).",
        );
      }

      setTasks(mapped);
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        const matchesQuery = t.question
          .toLowerCase()
          .includes(query.toLowerCase());
        const levelToCheck = enforcedLevel || level;
        const matchesLevel =
          levelToCheck === "all" || t.level === levelToCheck;
        const matchesSource = source === "all" || t.source === source;
        const matchesTopic = topic === "all" || t.topic === topic;
        const matchesType =
          taskType === "all" ||
          (taskType === "closed" && t.type === "closed") ||
          (taskType === "open" && t.type === "open");
        return (
          matchesQuery &&
          matchesLevel &&
          matchesSource &&
          matchesTopic &&
          matchesType
        );
      }),
    [tasks, query, level, source, topic, taskType, enforcedLevel],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / TASKS_PER_PAGE),
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedTasks = useMemo(() => {
    const start = (safePage - 1) * TASKS_PER_PAGE;
    return filtered.slice(start, start + TASKS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => {
    setCurrentPage(1);
    skipScrollRef.current = true;
  }, [query, level, source, topic, taskType, enforcedLevel]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (loading) return;
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [safePage, loading]);

  const unique = (key) =>
    [...new Set(tasks.map((t) => t[key]).filter(Boolean))].sort();

  const filtersDisabled = loading && tasks.length === 0;

  const levelOptions = [
    { value: "all", label: "Wszystkie poziomy" },
    ...unique("level").map((value) => ({ value, label: value })),
  ];
  const sourceOptions = [
    { value: "all", label: "Wszystkie źródła" },
    ...unique("source").map((value) => ({ value, label: value })),
  ];
  const topicOptions = [
    { value: "all", label: "Wszystkie tematy" },
    ...unique("topic").map((value) => ({ value, label: value })),
  ];
  const typeOptions = [
    { value: "all", label: "Wszystkie typy" },
    { value: "closed", label: "Zamknięte" },
    { value: "open", label: "Otwarte" },
  ];

  const pageStyle = getNotebookPageStyle(isDark);

  return (
    <div className="min-h-full py-8" style={pageStyle}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center gap-3">
          <Layers className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Zbiory zadań
          </h1>
        </div>

        <button
          type="button"
          onClick={() => navigate(createPageUrl("ExamCollection"))}
          className="group flex w-full flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50/80 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md dark:border-blue-900/60 dark:bg-blue-950/30 dark:hover:border-blue-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <BookOpenCheck className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-lg font-bold text-slate-900 dark:text-white">
                {examCollectionCta.title}
              </span>
              <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-300">
                {examCollectionCta.text}
              </span>
            </span>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition group-hover:translate-x-1 dark:text-blue-300">
            Otwórz
            <ChevronRight className="h-4 w-4" />
          </span>
        </button>

        {fetchError && (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            Nie udało się wczytać zadań: {fetchError}
          </p>
        )}

        {!loading && !fetchError && tasks.length === 0 && (
          <Card className="border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/40">
            <CardContent className="p-4 text-sm text-slate-800 dark:text-slate-100 space-y-2">
              <p className="font-medium">Brak zadań z bazy (0 rekordów).</p>
              <p className="text-slate-700 dark:text-slate-200">
                Najczęstsze przyczyny: (1) tabela <code className="text-xs bg-white/60 dark:bg-black/20 px-1 rounded">tasks</code> jest pusta — zaimportuj dane; (2) w Supabase włączone jest RLS bez polityki na{" "}
                <code className="text-xs bg-white/60 dark:bg-black/20 px-1 rounded">SELECT</code> dla roli{" "}
                <code className="text-xs bg-white/60 dark:bg-black/20 px-1 rounded">anon</code> — wtedy API zwraca pustą listę bez błędu; (3) w{" "}
                <code className="text-xs bg-white/60 dark:bg-black/20 px-1 rounded">.env</code> jest{" "}
                <code className="text-xs bg-white/60 dark:bg-black/20 px-1 rounded">VITE_SUPABASE_URL</code> oraz klucz{" "}
                <strong>anon</strong> (publiczny z ustawień projektu), nie klucz service_role.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
          <CardContent className="p-6 space-y-4">
            <FilterBar
              columnsClassName="grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
              search={
                <FilterSearchField
                  placeholder="Szukaj pytania..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={filtersDisabled}
                />
              }
            >
              <CycleFilter
                label="Poziom"
                value={enforcedLevel || level}
                options={levelOptions}
                onChange={setLevel}
                disabled={!!enforcedLevel || filtersDisabled}
              />
              <PrettySelectFilter
                label="Źródło"
                value={source}
                options={sourceOptions}
                onChange={setSource}
                disabled={filtersDisabled}
              />
              <PrettySelectFilter
                label="Temat"
                value={topic}
                options={topicOptions}
                onChange={setTopic}
                disabled={filtersDisabled}
              />
              <CycleFilter
                label="Typ"
                value={taskType}
                options={typeOptions}
                onChange={setTaskType}
                disabled={filtersDisabled}
              />
            </FilterBar>
          </CardContent>
        </Card>

        <div className="mb-6 text-gray-600 dark:text-slate-300">
          {loading && tasks.length === 0 ? (
            <>Ładowanie zadań...</>
          ) : (
            <>
              Znaleziono{" "}
              <span className="font-bold text-blue-700 dark:text-blue-300">
                {filtered.length}
              </span>{" "}
              zadań
              {!loading && filtered.length > 0 && totalPages > 1 && (
                <>
                  {" "}
                  · strona{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {safePage}
                  </span>{" "}
                  z {totalPages}
                </>
              )}
            </>
          )}
        </div>

        <div ref={gridRef} className="scroll-mt-24 space-y-6">
          <div className="columns-1 gap-5 md:columns-2">
            {loading && tasks.length === 0
              ? Array.from({ length: INITIAL_SKELETON_COUNT }).map((_, idx) => (
                  <TaskSetGridTile key={`task-skeleton-${idx}`} />
                ))
              : paginatedTasks.map((t) => (
                  <TaskSetGridTile
                    key={t.id}
                    task={t}
                    showMask={!contentRevealed}
                    levelTheme={levelTheme}
                  />
                ))}
          </div>

          {!loading && filtered.length > TASKS_PER_PAGE && (
            <TaskSetsPagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-600 dark:text-slate-300">
            Brak wyników
          </p>
        )}
      </div>
    </div>
  );
}
