import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  FileText,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";
import { publicSupabase } from "@/supabase-config.js";
import { isMaturalneTask, mapDbTaskRow } from "@/utils/map-db-task";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import dowodzenieCover from "@/okladki/dowodzenie.png";
import geometriaCover from "@/okladki/geometria.png";

const examOptions = [
  {
    userLevel: "matura_podstawowa",
    level: "podstawowy",
    label: "Matura PP",
    title: "Zbiór do matury podstawowej",
    description: "Wszystkie zadania z poprzednich lat matur.",
    icon: FileText,
    gradient: "from-blue-500 to-indigo-600",
    soft: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300",
  },
  {
    userLevel: "matura_rozszerzona",
    level: "rozszerzony",
    label: "Matura PR",
    title: "Zbiór do matury rozszerzonej",
    description: "Tematy, które pomagają ćwiczyć zadania rozszerzone.",
    icon: GraduationCap,
    gradient: "from-violet-500 to-fuchsia-600",
    soft: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300",
  },
  {
    userLevel: "osma_klasa",
    level: "ósmoklasisty",
    label: "E8",
    title: "Zbiór do e8",
    description: "Tematy zadań do egzaminu ósmoklasisty.",
    icon: BookOpenCheck,
    gradient: "from-emerald-500 to-teal-600",
    soft: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
];

const fallbackExam = {
  title: "Zbiór do egzaminu",
  label: "Wybierz egzamin",
  description: "Najpierw wybierz poziom materiałów, a potem przejdź do listy tematów.",
  gradient: "from-slate-700 to-slate-950",
  soft: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
};

const topicCoverImages = {
  dowodzenie: dowodzenieCover,
  geometria: geometriaCover,
};

function getTopicCoverImage(topicName) {
  const key = String(topicName || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return topicCoverImages[key] || null;
}

export default function ExamCollectionPage() {
  const navigate = useNavigate();
  const { userLevel } = useAuth();
  const { getProgress, progress } = useTaskProgress();
  const enforcedExam = examOptions.find((option) => option.userLevel === userLevel) || null;
  const [selectedExam, setSelectedExam] = useState(enforcedExam);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (enforcedExam) {
      setSelectedExam(enforcedExam);
    }
  }, [enforcedExam]);

  useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      setLoading(true);
      setFetchError(null);

      const { data, error } = await publicSupabase
        .from("tasks")
        .select("*")
        .not("arkusz", "is", null);

      if (cancelled) return;

      if (error) {
        console.error("[ExamCollection]", error.code, error.message, error.details);
        setFetchError(error.message);
        setTasks([]);
        setLoading(false);
        return;
      }

      setTasks(
        (data ?? [])
          .map(mapDbTaskRow)
          .filter((task) => task && task.question && isMaturalneTask(task)),
      );
      setLoading(false);
    };

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentExam = selectedExam || fallbackExam;
  const topics = useMemo(() => {
    if (!selectedExam) return [];

    const grouped = new Map();
    tasks
      .filter(
        (task) =>
          isMaturalneTask(task) &&
          task.level === selectedExam.level &&
          task.topic &&
          task.topic !== "—",
      )
      .forEach((task) => {
        const current = grouped.get(task.topic) || {
          name: task.topic,
          count: 0,
          taskIds: [],
        };
        current.count += 1;
        current.taskIds.push(task.id);
        grouped.set(task.topic, current);
      });

    return [...grouped.values()]
      .map((topic) => {
        const done = topic.taskIds.filter((id) => getProgress(id)?.attempts?.length).length;
        const notDone = topic.count - done;
        const progressPercent = topic.count > 0 ? Math.round((done / topic.count) * 100) : 0;
        return { ...topic, done, notDone, progressPercent };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "pl"));
  }, [selectedExam, tasks, progress, getProgress]);

  const openTopic = (topic) => {
    const params = new URLSearchParams({
      topic: topic.name,
      level: selectedExam.level,
    });
    navigate(`${createPageUrl("ExamTopicTasks")}?${params.toString()}`);
  };

  const totalTasks = topics.reduce((sum, topic) => sum + topic.count, 0);
  const totalDone = topics.reduce((sum, topic) => sum + topic.done, 0);
  const overallProgress = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;
  return (
    <div>
      <section className="relative overflow-hidden border-b border-sky-100/80 dark:border-slate-700/80">
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl"
          >
            <Badge className={`mb-4 w-fit border-0 ${currentExam.soft}`}>
              {currentExam.label}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl lg:leading-tight">
              {currentExam.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              {currentExam.description}
            </p>
            {selectedExam ? (
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/85">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Tematy</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{topics.length}</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/85">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Zadania</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{totalTasks}</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/85">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Postęp</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{overallProgress}%</p>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {!selectedExam ? (
          <div className="grid gap-4 md:grid-cols-3">
            {examOptions.map((option, index) => (
              <motion.button
                key={option.userLevel}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                onClick={() => setSelectedExam(option)}
                className="group rounded-3xl border border-sky-100/90 bg-white p-6 text-left shadow-md transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-800/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${option.gradient} text-white`}>
                    <option.icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </div>
                <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">{option.label}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{option.description}</p>
              </motion.button>
            ))}
          </div>
        ) : (
          <section className="space-y-6">
            {!enforcedExam ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedExam(null)}
                className="dark:border-slate-700 dark:bg-slate-900"
              >
                Zmień egzamin
              </Button>
            ) : null}

            {fetchError ? (
              <Card className="border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/30">
                <CardContent className="p-5 text-sm text-rose-700 dark:text-rose-300">
                  Nie udało się wczytać tematów: {fetchError}
                </CardContent>
              </Card>
            ) : null}

            {loading ? (
              <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 p-6 text-slate-600 dark:text-slate-300">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Ładowanie tematów...
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic, index) => {
                  const coverImage = getTopicCoverImage(topic.name);
                  const hasCoverImage = Boolean(coverImage);

                  return (
                  <motion.article
                    key={topic.name}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.3, delay: index * 0.025 }}
                  >
                    <Card
                      role="button"
                      tabIndex={0}
                      onClick={() => openTopic(topic)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openTopic(topic);
                        }
                      }}
                      className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-sky-100/90 bg-white shadow-md transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-800/60"
                    >
                      {hasCoverImage ? (
                        <div className="relative h-36 overflow-hidden">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url(${coverImage})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent dark:from-slate-800 dark:via-slate-800/40" />
                        </div>
                      ) : (
                        <div className={`h-1.5 bg-gradient-to-r ${selectedExam.gradient}`} />
                      )}
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h2 className="min-w-0 flex-1 text-lg font-bold leading-snug tracking-tight text-slate-900 dark:text-white">
                            {topic.name}
                          </h2>
                          <Badge
                            variant="outline"
                            className={`shrink-0 font-semibold ${selectedExam.soft}`}
                          >
                            {topic.count} zadań
                          </Badge>
                        </div>
                        <div className="mt-4 flex items-center gap-5 text-sm">
                          <div>
                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                              {topic.done}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">zrobione</p>
                          </div>
                          <div className="h-10 w-px bg-slate-200 dark:bg-slate-600" />
                          <div>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                              {topic.notDone}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">niezrobione</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Postęp</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                              {topic.progressPercent}%
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-sky-100 dark:bg-slate-700">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${selectedExam.gradient} transition-all duration-300`}
                              style={{ width: `${topic.progressPercent}%` }}
                            />
                          </div>
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Otwórz zadania
                          </span>
                          <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.article>
                  );
                })}
              </div>
            )}

            {!loading && !fetchError && topics.length === 0 ? (
              <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                Brak tematów dla tego egzaminu.
              </p>
            ) : null}
          </section>
        )}
      </main>
    </div>
  );
}
