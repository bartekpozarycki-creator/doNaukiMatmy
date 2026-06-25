import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TaskQuestionBody from "@/components/TaskQuestionBody";
import MaturaArkuszLink from "@/components/MaturaArkuszLink";
import FavoriteTaskActions from "@/components/FavoriteTaskActions";
import { createPageUrl } from "@/utils";
import { publicSupabase } from "@/supabase-config.js";
import {
  isMaturalneTask,
  mapDbTaskRow,
  TASK_LEVEL_BAR_GRADIENT,
  taskLevelBadgeClassName,
} from "@/utils/map-db-task";
import { useTheme } from "@/contexts/ThemeContext";
import { useTaskProgress } from "@/contexts/TaskProgressContext";

const monthOrder = {
  styczen: 1,
  luty: 2,
  marzec: 3,
  kwiecien: 4,
  maj: 5,
  czerwiec: 6,
  lipiec: 7,
  sierpien: 8,
  wrzesien: 9,
  pazdziernik: 10,
  listopad: 11,
  grudzien: 12,
};

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function parseArkuszSortMeta(arkusz) {
  const clean = String(arkusz || "").replace(/\.[^/.]+$/, "");
  const parts = clean.split("-");
  const year = Number(parts[0]) || 0;
  const month = monthOrder[normalizeText(parts[1])] || 0;
  return { year, month };
}

function levelLabel(level) {
  if (level === "podstawowy") return "matura podstawowa";
  if (level === "rozszerzony") return "matura rozszerzona";
  if (level === "ósmoklasisty") return "egzamin ósmoklasisty";
  return "egzamin";
}

const taskCardLayoutClass =
  "flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-[box-shadow,border-color] duration-200 ease-out group-hover/tile:border-slate-300 group-hover/tile:shadow-md dark:border-slate-700/80 dark:bg-slate-800 dark:group-hover/tile:border-slate-600 dark:group-hover/tile:shadow-lg";

const taskCardHeaderClass =
  "flex flex-col space-y-0 overflow-visible !px-3.5 !pt-3.5 !pb-1.5";
const taskCardBadgeRowClass = "mb-2.5 flex flex-wrap items-center gap-1.5";
const taskCardTitleBlockClass = "min-w-0 overflow-visible py-1 leading-normal";
const taskCardFooterClass = "shrink-0 !px-3.5 !pb-3.5 !pt-2.5";
const badgeClass = "px-2.5 py-0.5 text-xs font-medium leading-tight";

export default function ExamTopicTasksPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();
  const { getProgress } = useTaskProgress();
  const topicParam = searchParams.get("topic") || "";
  const levelParam = searchParams.get("level") || "";
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await publicSupabase.from("tasks").select("*");

      if (cancelled) return;

      if (error) {
        console.error("[ExamTopicTasks]", error.code, error.message, error.details);
        setLoadError(error.message);
        setTasks([]);
        setLoading(false);
        return;
      }

      setTasks((data ?? []).map(mapDbTaskRow).filter((task) => task && task.question));
      setLoading(false);
    };

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const selectedTopic = topicParam.trim();

    return tasks
      .filter((task) => {
        const matchesLevel = !levelParam || task.level === levelParam;
        const matchesTopic = !selectedTopic || task.topic === selectedTopic;
        return matchesLevel && matchesTopic && isMaturalneTask(task);
      })
      .sort((a, b) => {
        const aMeta = parseArkuszSortMeta(a.arkusz);
        const bMeta = parseArkuszSortMeta(b.arkusz);
        if (aMeta.year !== bMeta.year) return bMeta.year - aMeta.year;
        if (aMeta.month !== bMeta.month) return bMeta.month - aMeta.month;
        const aNr = a.nr ?? Number.POSITIVE_INFINITY;
        const bNr = b.nr ?? Number.POSITIVE_INFINITY;
        if (aNr !== bNr) return aNr - bNr;
        return String(a.id).localeCompare(String(b.id));
      });
  }, [tasks, topicParam, levelParam]);

  const openTask = (task) => {
    navigate(`${createPageUrl("TaskDetails")}?id=${task.id}`, {
      state: {
        from: "exam-topic-tasks",
        backTo: `${createPageUrl("ExamTopicTasks")}?topic=${encodeURIComponent(topicParam)}&level=${encodeURIComponent(levelParam)}`,
      },
    });
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to={createPageUrl("ExamCollection")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Powrót do tematów
            </Link>
            <h1 className="mt-4 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
              {topicParam || "Zadania z arkuszy"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Lista zadań z arkuszy dla: {levelLabel(levelParam)}, od najnowszych do najstarszych.
            </p>
          </div>
          <Badge variant="outline" className={taskLevelBadgeClassName(levelParam)}>
            {filteredTasks.length} zadań
          </Badge>
        </div>

        {loadError ? (
          <Card className="border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/30">
            <CardContent className="p-5 text-sm text-rose-700 dark:text-rose-300">
              Nie udało się wczytać zadań: {loadError}
            </CardContent>
          </Card>
        ) : null}

        {loading ? (
          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="flex items-center gap-3 p-6 text-slate-600 dark:text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin" />
              Ładowanie zadań...
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-5">
            {filteredTasks.map((task, index) => {
              const barGradient = TASK_LEVEL_BAR_GRADIENT[task.level] ?? "from-slate-400 to-slate-600";
              const isUnattempted = !getProgress(task.id)?.attempts?.length;

              return (
                <div key={task.id} className="relative w-full">
                  <motion.div
                    role="link"
                    tabIndex={0}
                    onClick={() => openTask(task)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openTask(task);
                      }
                    }}
                    className="group/tile block cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.012 }}
                    whileTap={{ scale: 0.988 }}
                    transition={{
                      type: "tween",
                      duration: 0.2,
                      delay: Math.min(index * 0.02, 0.2),
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <Card className={`${taskCardLayoutClass} relative`}>
                      <div className={isUnattempted ? "opacity-60" : ""}>
                        <div className={`h-1.5 w-full shrink-0 bg-gradient-to-r ${barGradient} rounded-none`} />
                        <CardHeader className={taskCardHeaderClass}>
                          <div
                            className={taskCardBadgeRowClass}
                            onClick={(event) => event.stopPropagation()}
                            onKeyDown={(event) => event.stopPropagation()}
                          >
                            <Badge
                              variant="outline"
                              className={`${badgeClass} ${taskLevelBadgeClassName(task.level)}`}
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
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !loadError && filteredTasks.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Brak zadań z arkuszy dla tego tematu.
          </p>
        ) : null}
      </div>
    </div>
  );
}
