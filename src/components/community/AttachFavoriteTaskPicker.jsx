import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Pin, PinOff, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { createPageUrl } from "@/utils";
import { useFavorites } from "@/contexts/FavoritesContext";
import { publicSupabase } from "@/supabase-config.js";
import { mapDbTaskRow } from "@/utils/map-db-task";
import TaskQuestionBody from "@/components/TaskQuestionBody";

export function taskToAttachedPayload(task) {
  if (!task) return null;
  return {
    id: task.id,
    question: task.question,
    level: task.level,
    source: task.source,
    topic: task.topic,
  };
}

const topicMap = {
  algebra: "wyrazenia_algebraiczne",
  analiza: "optymalizacja_i_rozniczkowy",
  geometria: "planimetria",
  "geometria analityczna": "geometria_analityczna",
  "teoria liczb": "liczby_rzeczywiste",
  arytmetyka: "liczby_rzeczywiste",
  potęgi: "liczby_rzeczywiste",
};

export function communityTopicFromTaskTopic(taskTopic) {
  if (!taskTopic || taskTopic === "—") return "ogólne";
  const key = String(taskTopic).toLowerCase();
  return topicMap[key] || "ogólne";
}

export default function AttachFavoriteTaskPicker({
  attachedTask,
  onAttach,
  onDetach,
}) {
  const { favorites } = useFavorites();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listOpen, setListOpen] = useState(true);

  useEffect(() => {
    if (attachedTask?.id) {
      setListOpen(false);
    }
  }, [attachedTask?.id]);

  useEffect(() => {
    if (!favorites.length) {
      setTasks([]);
      setLoading(false);
      setError(null);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      const { data, error: fetchError } = await publicSupabase
        .from("tasks")
        .select("*")
        .in("id", favorites);

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
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

  const handlePick = (task) => {
    if (attachedTask?.id === task.id) {
      onDetach?.();
      setListOpen(true);
      return;
    }
    onAttach?.(task);
    setListOpen(false);
  };

  const handleDetach = () => {
    onDetach?.();
    setListOpen(true);
  };

  const showTaskList = !loading && !error && tasks.length > 0;

  return (
    <div className="space-y-4">
      {attachedTask && (
        <div className="rounded-lg border border-blue-200 bg-blue-50/80 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Pin className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" />
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Podpięte zadanie
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDetach}
              className="h-8 shrink-0 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <PinOff className="mr-1.5 h-3.5 w-3.5" />
              Odepnij
            </Button>
          </div>
          <TaskQuestionBody task={attachedTask} compact />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-blue-500 text-blue-700 text-[10px] dark:text-blue-400"
            >
              {attachedTask.level}
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-300 text-slate-600 text-[10px] dark:border-slate-600 dark:text-slate-300"
            >
              {attachedTask.topic}
            </Badge>
            <Link
              to={`${createPageUrl("TaskDetails")}?id=${attachedTask.id}`}
              className="text-xs text-blue-600 hover:underline dark:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Otwórz zadanie
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <Collapsible open={listOpen} onOpenChange={setListOpen}>
          <div className="flex items-center justify-between gap-2">
            {showTaskList ? (
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-md py-1 text-left text-sm font-medium text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-300"
                >
                  <Heart className="h-4 w-4 shrink-0 text-rose-500 fill-rose-500" />
                  <span className="truncate">Ulubione zadania</span>
                  <Badge
                    variant="secondary"
                    className="shrink-0 bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  >
                    {tasks.length}
                  </Badge>
                  <ChevronDown
                    className={`ml-auto h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-400 ${
                      listOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </CollapsibleTrigger>
            ) : (
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                Ulubione zadania
              </div>
            )}
          </div>

          {loading ? (
            <div className="mt-3 flex items-center justify-center gap-2 py-6 text-sm text-slate-500 dark:text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Ładowanie ulubionych…
            </div>
          ) : error ? (
            <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>
          ) : tasks.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Brak ulubionych zadań.{" "}
              <Link
                to={createPageUrl("TaskSets")}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Przejdź do zbiorów
              </Link>{" "}
              lub{" "}
              <Link
                to={createPageUrl("Favorites")}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                ulubionych
              </Link>
              .
            </p>
          ) : (
            <CollapsibleContent forceMount className="overflow-hidden">
              <AnimatePresence initial={false}>
                {listOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="max-h-52 space-y-2 overflow-y-auto pr-1 pt-3">
                      {tasks.map((task) => {
                        const isAttached = attachedTask?.id === task.id;
                        return (
                          <button
                            key={task.id}
                            type="button"
                            onClick={() => handlePick(task)}
                            className={`w-full rounded-lg border p-3 text-left transition-colors ${
                              isAttached
                                ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400/30 dark:border-blue-500 dark:bg-blue-950/40"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500 dark:hover:bg-slate-700/80"
                            }`}
                          >
                            <div className="mb-2 flex flex-wrap gap-1.5">
                              <Badge
                                variant="outline"
                                className="border-blue-500 text-blue-700 text-[10px] dark:text-blue-400"
                              >
                                {task.level}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-slate-300 text-slate-600 text-[10px] dark:border-slate-600 dark:text-slate-300"
                              >
                                {task.topic}
                              </Badge>
                            </div>
                            <TaskQuestionBody task={task} compact />
                            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                              {isAttached
                                ? "Kliknij, aby odpiąć"
                                : "Kliknij, aby podpiąć"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CollapsibleContent>
          )}

          {showTaskList && !listOpen && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Lista zwinięta. Kliknij nagłówek, aby wybrać inne zadanie.
            </p>
          )}
        </Collapsible>
      </div>
    </div>
  );
}
