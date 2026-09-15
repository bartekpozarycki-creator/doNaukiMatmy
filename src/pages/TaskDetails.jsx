import { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import WorksheetOpenParts from "@/components/WorksheetOpenParts";
import {
  areAllOpenPartsFilled,
  hasOpenParts,
  isMultiOpenQuestionCorrect,
  openPartAnswerKey,
} from "@/utils/open-parts";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircleQuestion,
  PinOff,
  Shuffle,
} from "lucide-react";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import MathText from "@/components/MathText";
import MathInsertToolbar from "@/components/MathInsertToolbar";
import TaskQuestionBody from "@/components/TaskQuestionBody";
import MaturaArkuszLink from "@/components/MaturaArkuszLink";
import FavoriteTaskActions from "@/components/FavoriteTaskActions";
import FavoriteTaskNoteSection from "@/components/FavoriteTaskNoteSection";
import TaskRepetitionPanel from "@/components/TaskRepetitionPanel";
import CommunityQuestionImagesField, {
  clearCommunityImageItems,
} from "@/components/community/CommunityQuestionImagesField";
import AttachFavoriteTaskPicker, {
  communityTopicFromTaskTopic,
  taskToAttachedPayload,
} from "@/components/community/AttachFavoriteTaskPicker";
import { createPageUrl } from "@/utils";
import { publicSupabase, supabase } from "@/supabase-config.js";
import {
  mapDbTaskRow,
  TASK_LEVEL_BAR_GRADIENT,
  TASK_MASTERED_DIFFICULTY_BADGE_CLASS,
  formatTaskDifficultyLabel,
  taskDifficultyBadgeClassName,
} from "@/utils/map-db-task";
import { resolveUserTaskDifficulty } from "@/utils/user-task-difficulty";
import {
  clearRandomReviewQueue,
  getRandomReviewQueue,
  getRandomReviewSessionMeta,
} from "@/utils/review-random";
import { recordContinueLearning } from "@/utils/continue-learning";
import {
  resolveQuestionTitle,
  trimField,
  buildCommunityQuestionPayload,
  formatCommunityPublishError,
  getValidSession,
  countAuthorQuestionsToday,
  publishCommunityQuestion,
} from "@/utils/community-publish";
import { uploadCommunityQuestionImages } from "@/utils/community-images";
import { clearCommunityPrefillTask } from "@/utils/community-prefill";
import { resolveTaskDetailsBackLink } from "@/utils/task-details-nav";
import {
  bannedContentMessage,
  containsBannedContent,
} from "@/utils/content-moderation/moderate-content";

const TASK_PROBLEM_REPORTS_KEY = "mathmaster_task_problem_reports";

const COMMUNITY_TOPIC_NAMES = {
  liczby_rzeczywiste: "Liczby rzeczywiste",
  wyrazenia_algebraiczne: "Wyrażenia algebraiczne",
  funkcje: "Funkcje",
  ciagi: "Ciągi",
  trygonometria: "Trygonometria",
  planimetria: "Planimetria",
  geometria_analityczna: "Geometria analityczna",
  stereometria: "Stereometria",
  kombinatoryka_i_statystyka: "Kombinatoryka i statystyka",
  optymalizacja_i_rozniczkowy: "Optymalizacja",
  ogólne: "Ogólne",
};

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


function isReviewSessionPath(pathname = "") {
  return pathname.toLowerCase().includes("reviewsession");
}

export default function TaskDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { search } = location;
  const params = new URLSearchParams(search);
  const idParam = params.get("id");
  const isReviewSession = isReviewSessionPath(location.pathname);
  const backLink = resolveTaskDetailsBackLink(location);

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
  const [communityFormOpen, setCommunityFormOpen] = useState(false);
  const [communityLoginOpen, setCommunityLoginOpen] = useState(false);
  const [communityAttachedTask, setCommunityAttachedTask] = useState(null);
  const [communityTitle, setCommunityTitle] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [communityTopic, setCommunityTopic] = useState("ogólne");
  const [communityImages, setCommunityImages] = useState([]);
  const [communityPublishing, setCommunityPublishing] = useState(false);
  const [communityUploadingImages, setCommunityUploadingImages] = useState(false);
  const { recordAttempt, getProgress } = useTaskProgress();
  const { user } = useAuth();
  const communityTitleRef = useRef(null);
  const communityDescriptionRef = useRef(null);

  const recordUserAttempt = (isCorrect) => {
    recordAttempt(task.id, isCorrect, {
      baseDifficulty: task?.szacowanaTrudnosc ?? null,
    });
  };

  useEffect(() => {
    if (!isReviewSession) return;

    const queue = getRandomReviewQueue();
    if (!queue.length) {
      navigate(createPageUrl("Review"), { replace: true });
      return;
    }

    if (!idParam) {
      navigate(`${createPageUrl("ReviewSession")}?id=${queue[0]}`, {
        replace: true,
      });
      return;
    }

    if (!queue.includes(idParam)) {
      navigate(`${createPageUrl("ReviewSession")}?id=${queue[0]}`, {
        replace: true,
      });
    }
  }, [isReviewSession, idParam, navigate]);

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
    setCommunityFormOpen(false);
    setCommunityAttachedTask(null);
    setCommunityTitle("");
    setCommunityDescription("");
    setCommunityTopic("ogólne");
    setCommunityImages((prev) => {
      clearCommunityImageItems(prev);
      return [];
    });

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
      href: `${createPageUrl(isReviewSession ? "ReviewSession" : "TaskDetails")}?id=${task.id}`,
      actionLabel: isReviewSession ? "Kontynuuj sesję powtórek" : "Kontynuuj zadanie",
    });
  }, [task, user?.id, isReviewSession]);

  if (!idParam) {
    if (isReviewSession) {
      return (
        <div className="py-8">
          <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
            <TaskDetailsSkeleton />
          </div>
        </div>
      );
    }
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
  const userDifficulty = resolveUserTaskDifficulty(task, taskProgress);
  const difficultyLabel = userDifficulty.isMastered
    ? null
    : formatTaskDifficultyLabel(userDifficulty.raw);
  const taskVideoUrl = task.videoUrl;
  const similarMaterialsTopic =
    task.topic && task.topic !== "—" ? task.topic : null;
  const similarMaterialsSubtopic = task.subtopic?.trim() || null;
  const randomSession = isReviewSession
    ? getRandomReviewSessionMeta(task.id)
    : null;
  const effectiveBackLink = isReviewSession
    ? { to: createPageUrl("Review"), label: "Zakończ sesję" }
    : backLink;
  const resolvedCommunityTitle = resolveQuestionTitle(communityTitle);
  const resolvedCommunityDescription = trimField(communityDescription);
  const canPublishCommunity =
    !!user &&
    resolvedCommunityTitle.length > 0 &&
    resolvedCommunityDescription.length > 0 &&
    !communityPublishing &&
    !communityUploadingImages;

  const resetCommunityForm = () => {
    setCommunityFormOpen(false);
    setCommunityAttachedTask(null);
    setCommunityTitle("");
    setCommunityDescription("");
    setCommunityTopic("ogólne");
    setCommunityImages((prev) => {
      clearCommunityImageItems(prev);
      return [];
    });
  };

  const openCommunityForm = () => {
    if (!user) {
      setCommunityLoginOpen(true);
      return;
    }
    const payload = taskToAttachedPayload(task);
    setCommunityAttachedTask(payload);
    setCommunityTitle("");
    setCommunityDescription("");
    setCommunityTopic(communityTopicFromTaskTopic(task.topic));
    setCommunityFormOpen(true);
  };

  const handleCommunityDialogOpenChange = (open) => {
    if (!open) {
      resetCommunityForm();
      return;
    }
    setCommunityFormOpen(true);
  };

  const handleCommunityAttachTask = (favoriteTask) => {
    const payload = taskToAttachedPayload(favoriteTask);
    setCommunityAttachedTask(payload);
    setCommunityTopic(communityTopicFromTaskTopic(favoriteTask.topic));
  };

  const handleCommunityDetachTask = () => {
    setCommunityAttachedTask(null);
    setCommunityTopic("ogólne");
  };

  const handleCommunityPublish = async (event) => {
    event.preventDefault();

    if (!user) {
      setCommunityLoginOpen(true);
      return;
    }

    const { session, error: sessionError } = await getValidSession(supabase);
    if (sessionError || !session?.user) {
      toast.error("Sesja wygasła. Zaloguj się ponownie.");
      setCommunityLoginOpen(true);
      return;
    }

    const title = resolveQuestionTitle(communityTitle);
    const description = trimField(communityDescription);

    if (!title) {
      toast.error("Podaj tytuł pytania.");
      return;
    }
    if (!description) {
      toast.error("Opisz, z czym masz problem.");
      return;
    }
    if (containsBannedContent(`${title} ${description}`)) {
      toast.error(bannedContentMessage);
      return;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { data: todayQuestions, error: todayCountError } = await supabase
      .from("community_questions")
      .select("created_at, author_id")
      .eq("author_id", session.user.id)
      .gte("created_at", todayStart.toISOString());
    if (todayCountError) {
      toast.error("Nie udało się sprawdzić limitu pytań.");
      return;
    }
    if (countAuthorQuestionsToday(todayQuestions, session.user.id) >= 3) {
      toast.error("Limit 3 pytań dziennie został osiągnięty.");
      return;
    }

    setCommunityPublishing(true);
    try {
      let uploadedUrls = [];
      if (communityImages.length) {
        setCommunityUploadingImages(true);
        try {
          uploadedUrls = await uploadCommunityQuestionImages(
            session.user.id,
            communityImages.map((item) => item.file),
          );
        } catch (error) {
          toast.error(error.message || "Nie udało się przesłać zdjęć.");
          return;
        } finally {
          setCommunityUploadingImages(false);
        }
      }

      const payload = buildCommunityQuestionPayload({
        newQuestion: {
          title: communityTitle,
          description,
          topic: communityTopic || "ogólne",
          difficulty: 3,
        },
        attachedTask: communityAttachedTask,
        user: session.user,
        imageUrls: uploadedUrls,
      });

      await publishCommunityQuestion(supabase, payload);
      clearCommunityImageItems(communityImages);
      setCommunityImages([]);
      resetCommunityForm();
      clearCommunityPrefillTask();
      toast.success("Pytanie trafiło do weryfikacji.");
      navigate(createPageUrl("Community"), {
        replace: true,
        state: { fromPublish: true },
      });
    } catch (error) {
      toast.error(formatCommunityPublishError(error));
    } finally {
      setCommunityPublishing(false);
      setCommunityUploadingImages(false);
    }
  };

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
              ? "Zaliczone — zadanie trafi do powtórek z dłuższym odstępem."
              : "Nie zaliczone — zadanie wróci do powtórek szybciej."}
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {isReviewSession && randomSession ? (
          <div className="sticky top-16 z-20 -mx-4 border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/95 sm:mx-0 sm:rounded-xl sm:border">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-0.5">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <Shuffle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Losowa sesja powtórek
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Zadanie {randomSession.index + 1} z {randomSession.total}
                  {randomSession.remaining > 0
                    ? ` · pozostało ${randomSession.remaining}`
                    : " · ostatnie zadanie"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {randomSession.nextId ? (
                  <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
                    <Link
                      to={`${createPageUrl("ReviewSession")}?id=${randomSession.nextId}`}
                    >
                      Następne
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
                    <Link
                      to={createPageUrl("Review")}
                      onClick={() => clearRandomReviewQueue()}
                    >
                      Zakończ sesję
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="dark:border-slate-600">
                  <Link
                    to={createPageUrl("Review")}
                    onClick={() => clearRandomReviewQueue()}
                  >
                    Wyjdź
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <Link
              to={effectiveBackLink.to}
              className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> {effectiveBackLink.label}
            </Link>
            {task && (
              <div className="flex shrink-0 items-center gap-3">
                <MaturaArkuszLink task={task} plain />
                <FavoriteTaskActions taskId={task.id} />
              </div>
            )}
          </div>
        )}

        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg overflow-hidden">
          <div
            className={`h-1.5 w-full bg-gradient-to-r ${
              TASK_LEVEL_BAR_GRADIENT[task.level] ??
              "from-slate-400 to-slate-600"
            }`}
          />
          <CardHeader className="space-y-3 pb-4">
            {isReviewSession && task ? (
              <div className="mb-1 flex flex-wrap items-center justify-end gap-3">
                <MaturaArkuszLink task={task} plain />
                <FavoriteTaskActions taskId={task.id} />
              </div>
            ) : null}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/20">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Treść zadania
              </p>
              <CardTitle className="font-normal text-slate-950 dark:text-white">
                <TaskQuestionBody
                  task={task}
                  className="[&>div]:text-2xl sm:[&>div]:text-[1.65rem]"
                />
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-600 opacity-75 dark:text-slate-300 dark:opacity-80">
              <span>
                {task.topic.charAt(0).toUpperCase() + task.topic.slice(1)}
                {task.subtopic ? `: ${task.subtopic}` : ""} • Źródło: {task.source} •
              </span>
              {difficultyLabel ? (
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${taskDifficultyBadgeClassName(userDifficulty.raw)}`}
                  title={
                    userDifficulty.isPersonalized
                      ? `Twoja trudność: ${difficultyLabel} (baza: ${formatTaskDifficultyLabel(userDifficulty.baseRaw) ?? "—"})`
                      : `Trudność: ${difficultyLabel}`
                  }
                >
                  {difficultyLabel}
                </span>
              ) : null}
              {userDifficulty.isMastered ? (
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${TASK_MASTERED_DIFFICULTY_BADGE_CLASS}`}
                >
                  Opanowane
                </span>
              ) : null}
            </div>

            <section className="space-y-4">
              {task.type === "closed" ? renderClosed() : renderOpen()}
            </section>

            {taskVideoUrl ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="video-explanation"
                  className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <AccordionTrigger className="px-4 py-3 text-base font-semibold text-slate-900 hover:no-underline dark:text-white sm:px-5">
                    Wytłumaczenie wideo
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0 sm:px-5">
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
            ) : null}

            {!isReviewSession ? (
              <div>
                <button
                  type="button"
                  onClick={openCommunityForm}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:border-blue-500 dark:hover:bg-slate-600"
                >
                  <MessageCircleQuestion className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  Zapytaj społeczności
                </button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {task ? <TaskRepetitionPanel taskId={task.id} layout="spread" /> : null}

        {isReviewSession && randomSession ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {randomSession.nextId
                ? "Gdy skończysz to zadanie, przejdź do kolejnego w sesji."
                : "To ostatnie zadanie w tej sesji."}
            </p>
            {randomSession.nextId ? (
              <Button asChild variant="outline" className="dark:border-slate-600">
                <Link
                  to={`${createPageUrl("ReviewSession")}?id=${randomSession.nextId}`}
                >
                  Następne zadanie
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="dark:border-slate-600">
                <Link
                  to={createPageUrl("Review")}
                  onClick={() => clearRandomReviewQueue()}
                >
                  Wróć do powtórek
                </Link>
              </Button>
            )}
          </div>
        ) : null}

        {task && !isReviewSession ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Notatka
            </p>
            <FavoriteTaskNoteSection
              taskId={task.id}
              className="mt-0 border-t-0 pt-0"
            />
          </section>
        ) : null}

        <Dialog
          open={communityFormOpen}
          onOpenChange={handleCommunityDialogOpenChange}
        >
          <DialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl flex-col gap-0 overflow-hidden bg-white p-0 dark:bg-slate-800 sm:w-full">
            <DialogHeader className="shrink-0 px-6 pb-2 pt-6 pr-12">
              <DialogTitle className="dark:text-white">Zadaj pytanie</DialogTitle>
            </DialogHeader>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4">
              <form className="space-y-4" onSubmit={handleCommunityPublish}>
                <AttachFavoriteTaskPicker
                  attachedTask={communityAttachedTask}
                  onAttach={handleCommunityAttachTask}
                  onDetach={handleCommunityDetachTask}
                />

                <div className="space-y-2">
                  <Label
                    htmlFor="task-community-title"
                    className="text-slate-900 dark:text-white"
                  >
                    Tytuł pytania
                  </Label>
                  <Input
                    ref={communityTitleRef}
                    id="task-community-title"
                    value={communityTitle}
                    onChange={(e) => setCommunityTitle(e.target.value)}
                    disabled={communityPublishing}
                    placeholder="Krótki tytuł pytania"
                    className="bg-white dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                  <MathInsertToolbar
                    targetRef={communityTitleRef}
                    value={communityTitle}
                    onChange={setCommunityTitle}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="task-community-topic"
                    className="text-slate-900 dark:text-white"
                  >
                    Dział / temat
                    {communityAttachedTask ? (
                      <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                        (z podpiętego zadania)
                      </span>
                    ) : null}
                  </Label>
                  <Select
                    value={communityTopic || undefined}
                    onValueChange={setCommunityTopic}
                    disabled={!!communityAttachedTask || communityPublishing}
                  >
                    <SelectTrigger
                      id="task-community-topic"
                      disabled={!!communityAttachedTask || communityPublishing}
                      className="bg-white disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800/80"
                    >
                      <SelectValue placeholder="Wybierz dział" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-slate-600 dark:bg-slate-800">
                      {Object.entries(COMMUNITY_TOPIC_NAMES).map(
                        ([key, label]) => (
                          <SelectItem
                            key={key}
                            value={key}
                            className="dark:text-slate-300"
                          >
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="task-community-description"
                    className="text-slate-900 dark:text-white"
                  >
                    Opis problemu
                    <span className="ml-1 text-rose-500">*</span>
                  </Label>
                  <Textarea
                    ref={communityDescriptionRef}
                    id="task-community-description"
                    value={communityDescription}
                    onChange={(e) => setCommunityDescription(e.target.value)}
                    placeholder={
                      communityAttachedTask
                        ? "Napisz, co sprawia trudność w tym zadaniu: który krok, jakie podejście, gdzie wynik się rozjeżdża..."
                        : "Opisz swój problem: kontekst, próby rozwiązania, miejsce, w którym utknąłeś..."
                    }
                    rows={communityAttachedTask ? 8 : 6}
                    disabled={communityPublishing}
                    className="min-h-[140px] resize-y bg-white dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:min-h-[160px]"
                  />
                  <MathInsertToolbar
                    targetRef={communityDescriptionRef}
                    value={communityDescription}
                    onChange={setCommunityDescription}
                  />
                </div>

                <CommunityQuestionImagesField
                  items={communityImages}
                  onChange={setCommunityImages}
                  disabled={communityPublishing}
                  uploading={communityUploadingImages}
                  variant="question"
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                  disabled={!canPublishCommunity}
                >
                  {communityPublishing || communityUploadingImages
                    ? communityUploadingImages
                      ? "Przesyłanie zdjęć…"
                      : "Publikowanie…"
                    : "Opublikuj pytanie"}
                </Button>
                {!canPublishCommunity && !communityPublishing ? (
                  <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                    {!user
                      ? "Zaloguj się, aby opublikować pytanie"
                      : !resolvedCommunityDescription
                        ? "Uzupełnij opis problemu"
                        : !resolvedCommunityTitle
                          ? "Podaj tytuł pytania"
                          : null}
                  </p>
                ) : null}
              </form>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={communityLoginOpen} onOpenChange={setCommunityLoginOpen}>
          <DialogContent className="max-w-md bg-white dark:bg-slate-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Zaloguj się</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Musisz się zalogować, aby zadać pytanie społeczności.
              </p>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setCommunityLoginOpen(false)}
                >
                  Anuluj
                </Button>
                <Link to={createPageUrl("Login")}>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    Przejdź do logowania
                  </Button>
                </Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {!isReviewSession ? (
          <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white text-lg">
                Dodatkowe materiały
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Link
                to={createPageUrl("TaskSets")}
                state={{
                  ...(similarMaterialsTopic
                    ? { filterTopic: similarMaterialsTopic }
                    : {}),
                  ...(similarMaterialsSubtopic
                    ? { filterSubtopic: similarMaterialsSubtopic }
                    : {}),
                }}
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
        ) : null}

        <Dialog
          open={reportDialogOpen}
          onOpenChange={handleReportDialogOpenChange}
        >
          <DialogContent className="flex max-h-[min(90vh,760px)] flex-col gap-0 overflow-hidden border-slate-200 bg-white p-0 dark:border-slate-700 dark:bg-slate-900 sm:max-w-xl">
            <form onSubmit={handleReportSubmit} className="flex min-h-0 flex-1 flex-col">
              <DialogHeader className="shrink-0 space-y-2 border-b border-slate-100 bg-slate-50/80 px-6 py-5 dark:border-slate-800 dark:bg-slate-950/40">
                <DialogTitle className="text-xl text-slate-900 dark:text-white">
                  Zgłoś problem
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Opisz błąd w treści, odpowiedzi lub materiałach. Zadanie z tej
                  strony jest domyślnie podpięte — możesz je odpiąć przed
                  wysłaniem.
                </DialogDescription>
              </DialogHeader>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
                <section className="space-y-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <Label className="text-sm font-semibold text-slate-900 dark:text-white">
                      1. Podpięte zadanie
                    </Label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      opcjonalne
                    </span>
                  </div>

                  {reportAttachedTask ? (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-900/50">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Podgląd zadania
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
                      <div className="space-y-2 px-3.5 py-3">
                        <TaskQuestionBody task={reportAttachedTask} compact />
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {[
                            reportAttachedTask.topic,
                            reportAttachedTask.level,
                            reportAttachedTask.source,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center dark:border-slate-600 dark:bg-slate-800/40">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Brak podpiętego zadania.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3 dark:border-slate-600"
                        disabled={reportSubmitting}
                        onClick={() =>
                          setReportAttachedTask(taskToReportAttachment(task))
                        }
                      >
                        Przypnij bieżące zadanie
                      </Button>
                    </div>
                  )}
                </section>

                <section className="space-y-2.5">
                  <Label
                    htmlFor="task-problem-description"
                    className="text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    2. Opis problemu
                    <span className="ml-1 text-rose-500">*</span>
                  </Label>
                  <Textarea
                    id="task-problem-description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Np. błędna odpowiedź, literówka w treści, nieczytelny wzór, brakujący obrazek..."
                    rows={6}
                    className="min-h-[140px] resize-y border-slate-200 bg-white text-sm leading-relaxed dark:border-slate-600 dark:bg-slate-800"
                    disabled={reportSubmitting}
                  />
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Im dokładniej opiszesz problem, tym szybciej go poprawimy.
                  </p>
                </section>
              </div>

              <DialogFooter className="shrink-0 gap-2 border-t border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/40 sm:justify-between">
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
