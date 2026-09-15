import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createPageUrl } from "@/utils";
import { useFavorites } from "@/contexts/FavoritesContext";
import { publicSupabase } from "@/supabase-config.js";
import { mapDbTaskRow } from "@/utils/map-db-task";
import { shouldNavigateTaskTile } from "@/utils/task-tile-nav";
import { buildTaskDetailsNavState } from "@/utils/task-details-nav";
import TaskListCard, {
  TaskListCardSkeleton,
  taskMasonryTileClass,
} from "@/components/TaskListCard";
import {
  CycleFilter,
  FilterBar,
  FilterSearchField,
  PrettySelectFilter,
} from "@/components/ListFilters";

const taskTileMotionTransition = {
  type: "tween",
  duration: 0.2,
  ease: [0.25, 0.1, 0.25, 1],
};

function FavoriteTaskCard({ task }) {
  const navigate = useNavigate();

  const goToTask = (event) => {
    if (event && !shouldNavigateTaskTile(event)) return;
    navigate(`${createPageUrl("TaskDetails")}?id=${task.id}`, {
      state: buildTaskDetailsNavState({ from: "favorites" }),
    });
  };

  return (
    <motion.div
      role="link"
      tabIndex={0}
      onClick={goToTask}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToTask(e);
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
  );
}

export default function FavoritesPage() {
  const { favorites, hasNote } = useFavorites();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [source, setSource] = useState("all");
  const [topic, setTopic] = useState("all");
  const [taskType, setTaskType] = useState("all");
  const [noteFilter, setNoteFilter] = useState("all");

  useEffect(() => {
    if (!favorites.length) {
      setTasks([]);
      setLoading(false);
      setFetchError(null);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setFetchError(null);

    (async () => {
      const { data, error } = await publicSupabase
        .from("tasks")
        .select("*")
        .in("id", favorites);

      if (cancelled) return;

      if (error) {
        setFetchError(error.message);
        setTasks([]);
        setLoading(false);
        return;
      }

      const byId = new Map(
        (data ?? [])
          .map(mapDbTaskRow)
          .filter((t) => t && t.question)
          .map((t) => [t.id, t]),
      );

      setTasks(favorites.map((id) => byId.get(id)).filter(Boolean));
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  const unique = (key) =>
    [...new Set(tasks.map((t) => t[key]).filter(Boolean))].sort();

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
  const noteOptions = [
    { value: "all", label: "Wszystkie" },
    { value: "with", label: "Z notatką" },
    { value: "without", label: "Bez notatki" },
  ];

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          task.question?.toLowerCase().includes(q) ||
          task.topic?.toLowerCase().includes(q);
        const matchesLevel = level === "all" || task.level === level;
        const matchesSource = source === "all" || task.source === source;
        const matchesTopic = topic === "all" || task.topic === topic;
        const matchesType =
          taskType === "all" ||
          (taskType === "closed" && task.type === "closed") ||
          (taskType === "open" && task.type === "open");
        const taskHasNote = hasNote(task.id);
        const matchesNote =
          noteFilter === "all" ||
          (noteFilter === "with" && taskHasNote) ||
          (noteFilter === "without" && !taskHasNote);

        return (
          matchesQuery &&
          matchesLevel &&
          matchesSource &&
          matchesTopic &&
          matchesType &&
          matchesNote
        );
      }),
    [tasks, query, level, source, topic, taskType, noteFilter, hasNote],
  );

  return (
    <div className="py-8">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            <Heart className="h-7 w-7 shrink-0 fill-rose-500 text-rose-500 sm:h-8 sm:w-8" />
            Ulubione zadania
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 sm:text-base">
            Zadania zapisane do szybkiego powrotu. Lista jest przechowywana na
            tym urządzeniu.
          </p>
        </div>

        {fetchError && (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            Nie udało się wczytać zadań: {fetchError}
          </p>
        )}

        {!loading && tasks.length > 0 ? (
          <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
            <CardContent className="space-y-4 p-6">
              <FilterBar
                search={
                  <FilterSearchField
                    placeholder="Szukaj pytania lub tematu..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                }
              >
                <CycleFilter
                  label="Poziom"
                  value={level}
                  options={levelOptions}
                  onChange={setLevel}
                />
                <PrettySelectFilter
                  label="Źródło"
                  value={source}
                  options={sourceOptions}
                  onChange={setSource}
                />
                <PrettySelectFilter
                  label="Temat"
                  value={topic}
                  options={topicOptions}
                  onChange={setTopic}
                />
                <CycleFilter
                  label="Typ"
                  value={taskType}
                  options={typeOptions}
                  onChange={setTaskType}
                />
                <CycleFilter
                  label="Notatka"
                  value={noteFilter}
                  options={noteOptions}
                  onChange={setNoteFilter}
                />
              </FilterBar>
            </CardContent>
          </Card>
        ) : null}

        {loading ? (
          <div className="columns-1 gap-5 md:columns-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`fav-skel-${i}`} className={taskMasonryTileClass}>
                <TaskListCardSkeleton />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
            <CardContent className="p-8 text-center sm:p-12">
              <Heart className="mx-auto mb-4 h-14 w-14 text-gray-300 dark:text-slate-600 sm:h-16 sm:w-16" />
              <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                Brak ulubionych zadań
              </h2>
              <p className="mx-auto mb-6 max-w-md text-sm text-gray-600 dark:text-slate-400 sm:text-base">
                Kliknij serduszko przy zadaniu w zbiorach lub na stronie
                szczegółów, aby dodać je tutaj.
              </p>
              <Link
                to={createPageUrl("TaskSets")}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2 text-white transition hover:from-rose-600 hover:to-pink-700"
              >
                Przejdź do zbiorów zadań
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Znaleziono{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {filteredTasks.length}
              </span>{" "}
              z {tasks.length} zapisanych zadań
            </p>
            {filteredTasks.length > 0 ? (
              <div className="columns-1 gap-5 md:columns-2">
                {filteredTasks.map((task) => (
                  <div key={task.id} className={taskMasonryTileClass}>
                    <FavoriteTaskCard task={task} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
                <CardContent className="p-8 text-center text-sm text-gray-600 dark:text-slate-300">
                  Brak wyników dla wybranych filtrów.
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
