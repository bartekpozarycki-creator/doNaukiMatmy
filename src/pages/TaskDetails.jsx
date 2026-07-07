import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import WorksheetOpenParts from "@/components/WorksheetOpenParts";
import {
  areAllOpenPartsFilled,
  hasOpenParts,
  isMultiOpenQuestionCorrect,
  openPartAnswerKey,
} from "@/utils/open-parts";
import { ArrowLeft, ArrowRight, PinOff, Shuffle } from "lucide-react";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import MathText from "@/components/MathText";
import TaskQuestionBody from "@/components/TaskQuestionBody";
import MaturaArkuszLink from "@/components/MaturaArkuszLink";
import FavoriteTaskActions from "@/components/FavoriteTaskActions";
import FavoriteTaskNoteSection from "@/components/FavoriteTaskNoteSection";
import TaskRepetitionPanel from "@/components/TaskRepetitionPanel";
import FrequencyChangeToast from "@/components/FrequencyChangeToast";
import { createPageUrl } from "@/utils";
import { publicSupabase } from "@/supabase-config.js";
import {
  mapDbTaskRow,
  TASK_LEVEL_BAR_GRADIENT,
} from "@/utils/map-db-task";
import {
  clearRandomReviewQueue,
  getRandomReviewSessionMeta,
} from "@/utils/review-random";
import { recordContinueLearning } from "@/utils/continue-learning";

const TASK_PROBLEM_REPORTS_KEY = "mathmaster_task_problem_reports";

function taskToReportAttachment(task) {
  if (!task) return null;
  return {
    id: task.id,
    question: task.question,
    topic: task.topic,
    level: task.level,
    source: task.source,
  };
}

const skeletonClass = "bg-slate-200 dark:bg-slate-700";

function TaskDetailsSkeleton() {
  return (
    <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
      <CardHeader className="space-y-3">
        <Skeleton className={`h-8 w-full max-w-xl ${skeletonClass}`} />
        <Skeleton className={`h-4 w-48 ${skeletonClass}`} />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className={`h-12 w-full rounded-lg ${skeletonClass}`} />
        <Skeleton className={`h-12 w-full rounded-lg ${skeletonClass}`} />
        <Skeleton className={`h-12 w-full rounded-lg ${skeletonClass}`} />
      </CardContent>
    </Card>
  );
}

function taskDetailsBackLink(location) {
  const from = location.state?.from;
  if (from === "favorites") {
    return {
      to: createPageUrl("Favorites"),
      label: "Powrót do ulubionych",
    };
  }
  if (from === "review-random") {
    return {
      to: createPageUrl("Review"),
      label: "Powrót do powtórek",
    };
  }
  if (from === "exam-topic-tasks" && location.state?.backTo) {
    return {
      to: location.state.backTo,
      label: "Powrót do listy zadań",
    };
  }
  return {
    to: createPageUrl("TaskSets"),
    label: "Powrót do zbiorów",
  };
}

export default function TaskDetailsPage() {
  const location = useLocation();
  const { search } = location;
  const params = new URLSearchParams(search);
  const idParam = params.get("id");
  const backLink = taskDetailsBackLink(location);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(!!idParam);
  const [loadError, setLoadError] = useState(null);

  const [chosen, setChosen] = useState(null);
  const [openAnswers, setOpenAnswers] = useState({});
  const [openChecked, setOpenChecked] = useState(false);
  const [openAnswerAccordion, setOpenAnswerAccordion] = useState("");
  const [openGradeJustSubmitted, setOpenGradeJustSubmitted] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportAttachedTask, setReportAttachedTask] = useState(null);
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [freqChange, setFreqChange] = useState(null);
  const { recordAttempt, getProgress, progress } = useTaskProgress();
  const { user } = useAuth();

  const prevAttemptsLenRef = useRef(0);
  const prevFrequencyRef = useRef(null);
  const pendingAttemptRef = useRef(false);

  useEffect(() => {
    prevAttemptsLenRef.current = progress[idParam]?.attempts?.length ?? 0;
    prevFrequencyRef.current = progress[idParam]?.frequency ?? null;
    pendingAttemptRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam]);

  useEffect(() => {
    const entry = progress[idParam];
    const attempts = entry?.attempts;
    if (!attempts?.length) {
      prevAttemptsLenRef.current = 0;
      prevFrequencyRef.current = null;
      return;
    }
    if (
      pendingAttemptRef.current &&
      attempts.length > prevAttemptsLenRef.current
    ) {
      const last = attempts.at(-1);
      const to = last?.frequencyAfter ?? entry.frequency;
      const from =
        prevFrequencyRef.current ??
        (attempts.length >= 2 ? attempts.at(-2)?.frequencyAfter ?? 50 : 50);
      setFreqChange({
        id: Date.now(),
        from,
        to,
        isCorrect: !!last?.isCorrect,
      });
    }
    pendingAttemptRef.current = false;
    prevAttemptsLenRef.current = attempts.length;
    prevFrequencyRef.current = entry.frequency;
  }, [idParam, progress]);

  const recordUserAttempt = (isCorrect) => {
    pendingAttemptRef.current = true;
    recordAttempt(task.id, isCorrect);
  };

  useEffect(() => {
    if (!idParam) {
      setTask(null);
      setLoading(false);
      setLoadError(null);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setChosen(null);
    setOpenAnswers({});
    setOpenChecked(false);
    setOpenAnswerAccordion("");
    setOpenGradeJustSubmitted(false);

    (async () => {
      const { data, error } = await publicSupabase
        .from("tasks")
        .select("*")
        .eq("id", idParam)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("[TaskDetails]", error);
        setLoadError(error.message);
        setTask(null);
        setLoading(false);
        return;
      }

      setTask(mapDbTaskRow(data));
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [idParam]);

  useEffect(() => {
    if (!task?.id) return;
    recordContinueLearning(user?.id, {
      type: "task",
      id: task.id,
      title: task.question || `Zadanie ${task.id}`,
      subtitle: [task.level, task.topic].filter(Boolean).join(" · "),
      href: `${createPageUrl("TaskDetails")}?id=${task.id}`,
      actionLabel: "Kontynuuj zadanie",
    });
  }, [task, user?.id]);

  if (!idParam) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-600 dark:text-slate-300">Brak identyfikatora zadania.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            to={backLink.to}
            className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> {backLink.label}
          </Link>
          <TaskDetailsSkeleton />
        </div>
      </div>
    );
  }

  if (loadError || !task) {
    return (
      <div className="flex items-center justify-center px-4 py-24">
        <p className="text-gray-600 dark:text-slate-300 text-center">
          {loadError
            ? `Nie udało się wczytać zadania: ${loadError}`
            : "Nie znaleziono zadania."}
        </p>
      </div>
    );
  }

  const taskProgress = getProgress(task.id);
  const taskVideoUrl = task.videoUrl;
  const similarMaterialsTopic =
    task.topic && task.topic !== "—" ? task.topic : null;
  const randomSession = getRandomReviewSessionMeta(task.id);
  const effectiveBackLink = randomSession
    ? { to: createPageUrl("Review"), label: "Powrót do powtórek" }
    : backLink;

  const handleReportSubmit = async (event) => {
    event.preventDefault();
    const description = reportDescription.trim();
    if (!description) {
      toast.error("Opisz problem, zanim wyślesz zgłoszenie.");
      return;
    }

    setReportSubmitting(true);
    try {
      const entry = {
        id: crypto.randomUUID(),
        taskId: reportAttachedTask?.id ?? null,
        attachedTask: reportAttachedTask,
        topic: reportAttachedTask?.topic ?? task.topic,
        level: reportAttachedTask?.level ?? task.level,
        description,
        createdAt: new Date().toISOString(),
      };
      const existing = JSON.parse(
        localStorage.getItem(TASK_PROBLEM_REPORTS_KEY) || "[]",
      );
      localStorage.setItem(
        TASK_PROBLEM_REPORTS_KEY,
        JSON.stringify([entry, ...existing]),
      );
      toast.success("Zgłoszenie zostało zapisane. Dziękujemy!");
      setReportDescription("");
      setReportAttachedTask(null);
      setReportDialogOpen(false);
    } catch {
      toast.error("Nie udało się zapisać zgłoszenia. Spróbuj ponownie.");
    } finally {
      setReportSubmitting(false);
    }
  };

  const openReportDialog = () => {
    setReportAttachedTask(taskToReportAttachment(task));
    setReportDialogOpen(true);
  };

  const handleReportDialogOpenChange = (open) => {
    setReportDialogOpen(open);
    if (open) {
      setReportAttachedTask(taskToReportAttachment(task));
      return;
    }
    setReportDescription("");
    setReportAttachedTask(null);
  };

  const handleChoose = (opt) => {
    if (chosen) return;
    setChosen(opt);
    if (task.type === "closed") {
      recordUserAttempt(opt === task.answer);
    }
  };

  const openQuestionShape = task
    ? { id: task.id, open_parts: task.openParts }
    : null;

  const handleOpenPartChange = (questionId, partId, value) => {
    if (openChecked) return;
    setOpenAnswers((prev) => ({
      ...prev,
      [openPartAnswerKey(questionId, partId)]: value,
    }));
  };

  const renderOpen = () => {
    if (openQuestionShape && hasOpenParts(openQuestionShape)) {
      return (
        <div className="space-y-6">
          <p className="text-lg font-medium leading-snug text-slate-950 dark:text-white">
            Uzupełnij zdania. Wpisz odpowiednie przedziały w polach poniżej.
          </p>
          <WorksheetOpenParts
            question={openQuestionShape}
            answersMap={openAnswers}
            onPartChange={handleOpenPartChange}
            disabled={openChecked}
            showFeedback={openChecked}
          />
          {!openChecked ? (
            <Button
              type="button"
              onClick={() => {
                setOpenChecked(true);
                recordUserAttempt(
                  isMultiOpenQuestionCorrect(openQuestionShape, openAnswers),
                );
              }}
              disabled={
                !areAllOpenPartsFilled(openQuestionShape, openAnswers)
              }
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Sprawdź odpowiedzi
            </Button>
          ) : (
            <div
              className={`rounded-md py-2 text-center font-semibold text-white ${
                isMultiOpenQuestionCorrect(openQuestionShape, openAnswers)
                  ? "bg-blue-500"
                  : "bg-rose-500"
              }`}
            >
              {isMultiOpenQuestionCorrect(openQuestionShape, openAnswers)
                ? "Dobrze!"
                : "Sprawdź poprawki przy polach powyżej."}
            </div>
          )}
        </div>
      );
    }

    const openAnswerRevealed = openAnswerAccordion === "ans";
    const canSelfGrade = !taskProgress?.attempts?.length;
    const lastAttempt = taskProgress?.attempts?.at(-1);

    return (
      <div className="space-y-4">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={openAnswerAccordion}
          onValueChange={setOpenAnswerAccordion}
        >
          <AccordionItem value="ans">
            <AccordionTrigger>Odpowiedź</AccordionTrigger>
            <AccordionContent className="text-slate-900 dark:text-white">
              <MathText text={task.answer} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {openAnswerRevealed && canSelfGrade ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Jak oceniasz swoją odpowiedź?
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => {
                  recordUserAttempt(true);
                  setOpenGradeJustSubmitted(true);
                }}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Zalicz
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  recordUserAttempt(false);
                  setOpenGradeJustSubmitted(true);
                }}
                className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
              >
                Nie zaliczaj
              </Button>
            </div>
          </div>
        ) : null}

        {openGradeJustSubmitted && lastAttempt ? (
          <div
            className={`rounded-md py-2 text-center text-sm font-semibold text-white ${
              lastAttempt.isCorrect ? "bg-emerald-600" : "bg-rose-600"
            }`}
          >
            {lastAttempt.isCorrect
              ? "Zaliczone — zadanie trafi do powtórek z niższą częstością."
              : "Nie zaliczone — zadanie wróci do powtórek częściej."}
          </div>
        ) : null}
      </div>
    );
  };

  const renderClosed = () => {
    const opts = task.options ?? [];
    if (!opts.length) {
      return (
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Brak zdefiniowanych odpowiedzi dla tego zadania zamkniętego.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {opts.map((opt) => {
          const isCorrect = opt === task.answer;
          const isChosen = opt === chosen;
          const base =
            "w-full px-4 py-3 rounded-lg border text-left transition-colors duration-200";
          let extra =
            "bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 hover:border-blue-300 dark:hover:border-blue-500 border-gray-300 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm hover:shadow-md";
          if (chosen) {
            if (isCorrect) {
              extra = "bg-blue-500 text-white border-blue-500 shadow-md";
            } else if (isChosen) {
              extra = "bg-rose-500 text-white border-rose-500 shadow-md";
            } else {
              extra =
                "bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-slate-900 dark:text-white opacity-70";
            }
          }
          return (
            <motion.button
              key={opt}
              type="button"
              onClick={() => handleChoose(opt)}
              disabled={!!chosen}
              className={`${base} ${extra}`}
              whileHover={chosen ? undefined : { scale: 1.03 }}
              whileTap={chosen ? undefined : { scale: 0.99 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <MathText text={opt} className="math-text-ui--flow" />
            </motion.button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-8">
      <FrequencyChangeToast
        change={freqChange}
        onDismiss={() => setFreqChange(null)}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to={effectiveBackLink.to}
            className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> {effectiveBackLink.label}
          </Link>
          {task && <FavoriteTaskActions taskId={task.id} />}
        </div>

        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg overflow-hidden">
          <div
            className={`h-1.5 w-full bg-gradient-to-r ${
              TASK_LEVEL_BAR_GRADIENT[task.level] ??
              "from-slate-400 to-slate-600"
            }`}
          />
          <CardHeader className="space-y-3 pb-4">
            <MaturaArkuszLink task={task} plain />
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/20">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Treść zadania
              </p>
              <CardTitle className="font-semibold text-slate-950 dark:text-white">
                <TaskQuestionBody
                  task={task}
                  className="[&>div]:text-2xl [&>div]:font-semibold sm:[&>div]:text-[1.65rem]"
                />
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-slate-300 mb-4">
              <span>
                Temat: {task.topic} • Poziom: {task.level} • Źródło:{" "}
                {task.source}
              </span>
            </div>

            <section className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Poprawka
              </p>
              {task.type === "closed" ? renderClosed() : renderOpen()}
            </section>

            {task && (
              <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  Notatka
                </p>
                <FavoriteTaskNoteSection
                  taskId={task.id}
                  className="mt-0 border-t-0 pt-0"
                />
              </section>
            )}
          </CardContent>
        </Card>

        {taskProgress?.attempts?.length > 0 ? (
          <TaskRepetitionPanel taskId={task.id} layout="spread" />
        ) : null}

        {randomSession ? (
          <Card className="border border-purple-200 bg-purple-50/80 dark:border-purple-900/50 dark:bg-purple-950/30">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <Shuffle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Losowa sesja powtórek
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Zadanie {randomSession.index + 1} z {randomSession.total}
                  {randomSession.remaining > 0
                    ? ` • pozostało ${randomSession.remaining}`
                    : " • ostatnie zadanie w sesji"}
                </p>
              </div>
              {randomSession.nextId ? (
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white hover:from-purple-600 hover:to-fuchsia-700"
                >
                  <Link
                    to={`${createPageUrl("TaskDetails")}?id=${randomSession.nextId}`}
                    state={{ from: "review-random" }}
                  >
                    Następne losowe zadanie
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white hover:from-purple-600 hover:to-fuchsia-700"
                >
                  <Link
                    to={createPageUrl("Review")}
                    onClick={() => clearRandomReviewQueue()}
                  >
                    Zakończ sesję
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : null}

        {taskVideoUrl ? (
          <Card className="border-0 bg-white shadow-lg dark:bg-slate-800 overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="video-explanation" className="border-0">
                <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-slate-900 dark:text-white hover:no-underline">
                  Wytłumaczenie wideo
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-slate-700">
                    <iframe
                      src={taskVideoUrl}
                      title={`Wytłumaczenie zadania ${task.id}`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
                    Materiał wideo krok po kroku do tego zadania.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        ) : null}

        <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-white">
              Zapytaj społeczności
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Jeśli utknąłeś, zadaj pytanie innym użytkownikom.
              </p>
              <Link
                to={createPageUrl("Community")}
                state={{
                  prefillTask: {
                    id: task.id,
                    question: task.question,
                    topic: task.topic,
                    level: task.level,
                    source: task.source,
                  },
                }}
                className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition"
              >
                Zapytaj społeczności
              </Link>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-lg">
              Dodatkowe materiały
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link
              to={createPageUrl("TaskSets")}
              state={
                similarMaterialsTopic
                  ? { filterTopic: similarMaterialsTopic }
                  : undefined
              }
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            >
              <span className="text-sm text-slate-900 dark:text-white">
                Podobne materiały
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-400">
                Zbiory
              </span>
            </Link>
            <button
              type="button"
              onClick={openReportDialog}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition text-left"
            >
              <span className="text-sm text-slate-900 dark:text-white">
                Zgłoś problem
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-400">
                Feedback
              </span>
            </button>
          </CardContent>
        </Card>

        <Dialog
          open={reportDialogOpen}
          onOpenChange={handleReportDialogOpenChange}
        >
          <DialogContent className="flex max-h-[min(90vh,720px)] flex-col gap-0 overflow-hidden border-slate-200 bg-white p-0 dark:border-slate-700 dark:bg-slate-900 sm:max-w-lg">
            <form onSubmit={handleReportSubmit} className="flex min-h-0 flex-1 flex-col">
              <DialogHeader className="shrink-0 space-y-1.5 px-6 pt-6 pb-2">
                <DialogTitle className="text-slate-900 dark:text-white">
                  Zgłoś problem
                </DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400">
                  Opisz błąd w treści zadania, odpowiedzi lub materiałach. Zadanie
                  z tej strony jest domyślnie podpięte — możesz je odpiąć przed
                  wysłaniem.
                </DialogDescription>
              </DialogHeader>
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2">
                <div className="space-y-3 pb-4">
                  <Label className="text-slate-800 dark:text-slate-200">
                    Podpięte zadanie
                  </Label>
                {reportAttachedTask ? (
                  <div className="rounded-lg border border-blue-200 bg-blue-50/80 p-3 dark:border-blue-900/50 dark:bg-blue-950/30">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-300">
                        Podpięte
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setReportAttachedTask(null)}
                        disabled={reportSubmitting}
                        className="h-8 shrink-0 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      >
                        <PinOff className="mr-1.5 h-3.5 w-3.5" />
                        Odepnij
                      </Button>
                    </div>
                    <TaskQuestionBody task={reportAttachedTask} compact />
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                      {reportAttachedTask.topic} • {reportAttachedTask.level}
                      {reportAttachedTask.source
                        ? ` • ${reportAttachedTask.source}`
                        : ""}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/50">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Brak podpiętego zadania.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 dark:border-slate-600"
                      disabled={reportSubmitting}
                      onClick={() =>
                        setReportAttachedTask(taskToReportAttachment(task))
                      }
                    >
                      Przypnij bieżące zadanie
                    </Button>
                  </div>
                )}
                </div>
                <div className="space-y-2 pb-2">
                  <Label
                    htmlFor="task-problem-description"
                    className="text-slate-800 dark:text-slate-200"
                  >
                    Opis problemu
                  </Label>
                  <Textarea
                    id="task-problem-description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Np. błędna odpowiedź, literówka w treści, nieczytelny wzór..."
                    rows={5}
                    className="resize-y dark:border-slate-600 dark:bg-slate-800"
                    disabled={reportSubmitting}
                  />
                </div>
              </div>
              <DialogFooter className="shrink-0 gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-700 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleReportDialogOpenChange(false)}
                  disabled={reportSubmitting}
                  className="dark:border-slate-600"
                >
                  Anuluj
                </Button>
                <Button
                  type="submit"
                  disabled={reportSubmitting}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {reportSubmitting ? "Wysyłanie…" : "Wyślij zgłoszenie"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
