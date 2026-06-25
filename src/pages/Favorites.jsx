import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPageUrl } from "@/utils";
import { useFavorites } from "@/contexts/FavoritesContext";
import { publicSupabase } from "@/supabase-config.js";
import {
  mapDbTaskRow,
  taskLevelBadgeClassName,
  TASK_LEVEL_BAR_GRADIENT,
} from "@/utils/map-db-task";
import TaskQuestionBody from "@/components/TaskQuestionBody";
import MaturaArkuszLink from "@/components/MaturaArkuszLink";
import FavoriteTaskActions from "@/components/FavoriteTaskActions";
import FavoriteTaskNoteSection from "@/components/FavoriteTaskNoteSection";

const skeletonClass = "bg-slate-200 dark:bg-slate-700";

const taskCardLayoutClass =
  "flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 ease-out group-hover/tile:shadow-md dark:border-slate-700/80 dark:bg-slate-800 dark:group-hover/tile:shadow-lg";

const taskTileMotionTransition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.85,
};

const badgeClass =
  "pointer-events-none px-2.5 py-0.5 text-xs font-medium leading-tight";

function FavoriteTaskCardSkeleton() {
  return (
    <Card className={taskCardLayoutClass} aria-hidden>
      <Skeleton className={`h-1.5 w-full shrink-0 rounded-none ${skeletonClass}`} />
      <CardContent className="flex flex-col space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          <Skeleton className={`h-6 w-24 rounded-full ${skeletonClass}`} />
          <Skeleton className={`h-6 w-28 rounded-full ${skeletonClass}`} />
        </div>
        <Skeleton className={`h-4 w-full ${skeletonClass}`} />
        <Skeleton className={`h-4 w-[90%] ${skeletonClass}`} />
        <Skeleton className={`h-3.5 w-2/3 ${skeletonClass}`} />
      </CardContent>
    </Card>
  );
}

function FavoriteTaskCard({ task }) {
  const navigate = useNavigate();
  const levelBadgeClass = taskLevelBadgeClassName(task.level);
  const barGradient =
    TASK_LEVEL_BAR_GRADIENT[task.level] ?? "from-slate-400 to-slate-600";

  const goToTask = () => {
    navigate(`${createPageUrl("TaskDetails")}?id=${task.id}`, {
      state: { from: "favorites" },
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
          goToTask();
        }
      }}
      className="group/tile block w-full cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
      initial={false}
      whileHover={{ y: -6 }}
      whileTap={{ y: -2, scale: 0.992 }}
      transition={taskTileMotionTransition}
    >
      <Card className={taskCardLayoutClass}>
        <div
          className={`h-1.5 w-full shrink-0 rounded-none bg-gradient-to-r ${barGradient}`}
        />
        <CardContent className="flex flex-col p-4 sm:p-5">
          <div
            className="mb-3 flex flex-wrap items-start justify-between gap-2"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className={`${badgeClass} ${levelBadgeClass}`}
              >
                {task.level}
              </Badge>
              <MaturaArkuszLink
                task={task}
                className={`${badgeClass} pointer-events-auto shrink-0`}
              />
              <Badge
                variant="outline"
                className={`${badgeClass} border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400`}
              >
                {task.source}
              </Badge>
            </div>
            <FavoriteTaskActions
              taskId={task.id}
              size="sm"
              stopPropagation
              className="shrink-0"
            />
          </div>

          <div className="min-w-0 overflow-visible">
            <TaskQuestionBody task={task} compact />
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-slate-400">
            Temat: {task.topic} • Typ:{" "}
            {task.type === "closed" ? "zamknięte" : "otwarte"}
          </p>

          <FavoriteTaskNoteSection taskId={task.id} />
        </CardContent>
      </Card>
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
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:items-end">
                <div className="relative lg:col-span-4">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Szukaj pytania lub tematu..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-white pl-10 dark:border-slate-600 dark:bg-slate-700"
                  />
                </div>
                <div className="lg:col-span-2">
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger className="bg-white dark:border-slate-600 dark:bg-slate-700">
                      <SelectValue placeholder="Poziom" />
                    </SelectTrigger>
                    <SelectContent side="bottom" align="start">
                      <SelectItem value="all">Wszystkie poziomy</SelectItem>
                      {unique("level").map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="lg:col-span-2">
                  <Select value={source} onValueChange={setSource}>
                    <SelectTrigger className="bg-white dark:border-slate-600 dark:bg-slate-700">
                      <SelectValue placeholder="Źródło" />
                    </SelectTrigger>
                    <SelectContent side="bottom" align="start">
                      <SelectItem value="all">Wszystkie źródła</SelectItem>
                      {unique("source").map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="lg:col-span-2">
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger className="bg-white dark:border-slate-600 dark:bg-slate-700">
                      <SelectValue placeholder="Temat" />
                    </SelectTrigger>
                    <SelectContent side="bottom" align="start">
                      <SelectItem value="all">Wszystkie tematy</SelectItem>
                      {unique("topic").map((tp) => (
                        <SelectItem key={tp} value={tp}>
                          {tp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="lg:col-span-1">
                  <Select value={taskType} onValueChange={setTaskType}>
                    <SelectTrigger className="bg-white dark:border-slate-600 dark:bg-slate-700">
                      <SelectValue placeholder="Typ" />
                    </SelectTrigger>
                    <SelectContent side="bottom" align="start">
                      <SelectItem value="all">Wszystkie typy</SelectItem>
                      <SelectItem value="closed">Zamknięte</SelectItem>
                      <SelectItem value="open">Otwarte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="lg:col-span-1">
                  <Select value={noteFilter} onValueChange={setNoteFilter}>
                    <SelectTrigger className="bg-white dark:border-slate-600 dark:bg-slate-700">
                      <SelectValue placeholder="Notatka" />
                    </SelectTrigger>
                    <SelectContent side="bottom" align="start">
                      <SelectItem value="all">Wszystkie</SelectItem>
                      <SelectItem value="with">Z notatką</SelectItem>
                      <SelectItem value="without">Bez notatki</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {loading ? (
          <div className="flex flex-col gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <FavoriteTaskCardSkeleton key={`fav-skel-${i}`} />
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
              <div className="flex flex-col gap-5">
                {filteredTasks.map((task) => (
                  <FavoriteTaskCard key={task.id} task={task} />
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
