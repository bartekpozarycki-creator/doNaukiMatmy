import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, ChevronRight, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import TaskListCard, {
  TaskListCardSkeleton,
  taskMasonryTileClass,
} from "@/components/TaskListCard";
import TaskListPagination from "@/components/TaskListPagination";
import {
  CycleFilter,
  FilterBar,
  FilterSearchField,
  PrettySelectFilter,
} from "@/components/ListFilters";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getNotebookPageStyle } from "@/utils/notebook-page-style";
import { publicSupabase } from "@/supabase-config.js";
import { mapDbTaskRow } from "@/utils/map-db-task";
import { shouldNavigateTaskTile } from "@/utils/task-tile-nav";
import { buildTaskDetailsNavState } from "@/utils/task-details-nav";

const TASKS_PER_PAGE = 8;
const INITIAL_SKELETON_COUNT = TASKS_PER_PAGE;

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

const taskTileMotionTransition = {
  type: "tween",
  duration: 0.2,
  ease: [0.25, 0.1, 0.25, 1],
};

function TaskSetGridTile({ task, showMask }) {
  const navigate = useNavigate();

  if (!task) {
    return (
      <div className={taskMasonryTileClass}>
        <TaskListCardSkeleton />
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
          onClick={(event) => {
            if (!shouldNavigateTaskTile(event)) return;
            navigate(`${createPageUrl("TaskDetails")}?id=${task.id}`, {
              state: buildTaskDetailsNavState({ from: "task-sets" }),
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!shouldNavigateTaskTile(e)) return;
              navigate(`${createPageUrl("TaskDetails")}?id=${task.id}`, {
                state: buildTaskDetailsNavState({ from: "task-sets" }),
              });
            }
          }}
          className="group/tile block cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          initial={false}
          whileHover={{ scale: 1.012 }}
          whileTap={{ scale: 0.988 }}
          transition={taskTileMotionTransition}
        >
          <TaskListCard task={task} maturaLinkTarget="worksheets-list" />
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
            <TaskListCardSkeleton />
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
  const [subtopic, setSubtopic] = useState("all");
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
    const filterSubtopic = location.state?.filterSubtopic;
    if (
      typeof filterSubtopic === "string" &&
      filterSubtopic.trim() !== ""
    ) {
      setSubtopic(filterSubtopic.trim());
    }
  }, [location.state?.filterSubtopic]);

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
        const matchesSubtopic =
          subtopic === "all" || t.subtopic === subtopic;
        return (
          matchesQuery &&
          matchesLevel &&
          matchesSource &&
          matchesTopic &&
          matchesSubtopic
        );
      }),
    [tasks, query, level, source, topic, subtopic, enforcedLevel],
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
  }, [query, level, source, topic, subtopic, enforcedLevel]);

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
  const subtopicOptions = [
    { value: "all", label: "Wszystkie podtematy" },
    ...unique("subtopic").map((value) => ({ value, label: value })),
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
              <PrettySelectFilter
                label="Podtemat"
                value={subtopic}
                options={subtopicOptions}
                onChange={setSubtopic}
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
                  />
                ))}
          </div>

          {!loading && filtered.length > TASKS_PER_PAGE && (
            <TaskListPagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              ariaLabel="Paginacja zadań"
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
