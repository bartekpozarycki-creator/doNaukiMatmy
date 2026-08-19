import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { animate, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, ArrowRight, CheckCircle, Clock, Eye, FileText,
  Calendar, CalendarDays, List, Layers, Timer, BookOpen,
  KeyRound, Sparkles, Trophy, XCircle, CircleDot, RotateCcw,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PdfFloatingPanel from "@/components/PdfFloatingPanel";
import {
  useWorksheetProgress,
  WORKSHEET_STATUS,
  isWorksheetCompleted,
  isWorksheetStarted,
  snapshotCompletedAttempt,
} from "@/hooks/use-worksheet-progress";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MathText from "@/components/MathText";
import WorksheetOpenParts from "@/components/WorksheetOpenParts";
import { useWorksheetScores } from "@/hooks/use-worksheet-scores";
import { publicSupabase } from "@/supabase-config.js";
import {
  mapDbTaskRow,
  mapDbTaskToWorksheetQuestion,
  sortTasksByNr,
} from "@/utils/map-db-task";
import {
  areAllOpenPartsFilled,
  countWorksheetAnswered,
  getOpenPartValue,
  getOpenPartsList,
  hasOpenParts,
  openPartAnswerKey,
} from "@/utils/open-parts";
import {
  buildWorksheetQuestionScores,
  getQuestionMaxPoints,
  getStoredAnswerValue,
  getWorksheetScoreRows,
  getWorksheetScoreSummary,
  getWorksheetTotalPoints,
  isSimpleOpenQuestion,
} from "@/utils/worksheet-scores";
import { usePageActions } from "@/contexts/PageActionsContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  resolveWorksheetAnswerKeyUrl,
  answerKeyPdfUrlWithPage,
  resolveAnswerKeyPage,
} from "@/utils/worksheet-answer-key";
import { recordContinueLearning } from "@/utils/continue-learning";

const sampleWorksheet = {
  id: "w-001",
  title: "Matura 2024 maj - poziom podstawowy",
  level: "podstawowy",
  year: 2024,
  duration_minutes: 45,
  total_points: 50,
};

const worksheetLevelTheme = {
  podstawowy: {
    label: "Matura podstawowa",
    paperBand: "bg-gradient-to-r from-blue-500 to-blue-600",
    paperBandDark: "dark:from-blue-600 dark:to-blue-700",
    headerText: "text-white",
    accentText: "text-blue-700 dark:text-blue-300",
    accentBorder: "border-blue-500",
    selectedChoice: "border-blue-600 bg-blue-50 ring-blue-200 dark:border-blue-400 dark:bg-blue-950/40 dark:ring-blue-900/60",
    hoverChoice: "hover:border-blue-400 hover:bg-blue-50/60 dark:hover:border-blue-500 dark:hover:bg-blue-950/30",
    button: "bg-blue-600 hover:bg-blue-700",
    switch: "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600",
    dialogStrip: "bg-gradient-to-r from-blue-500 to-blue-600",
    gradient: "from-blue-600 to-blue-500",
  },
  rozszerzony: {
    label: "Matura rozszerzona",
    paperBand: "bg-gradient-to-r from-purple-500 to-purple-600",
    paperBandDark: "dark:from-purple-600 dark:to-purple-700",
    headerText: "text-white",
    accentText: "text-purple-700 dark:text-purple-300",
    accentBorder: "border-purple-500",
    selectedChoice: "border-purple-600 bg-purple-50 ring-purple-200 dark:border-purple-400 dark:bg-purple-950/40 dark:ring-purple-900/60",
    hoverChoice: "hover:border-purple-400 hover:bg-purple-50/60 dark:hover:border-purple-500 dark:hover:bg-purple-950/30",
    button: "bg-purple-600 hover:bg-purple-700",
    switch: "data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600",
    dialogStrip: "bg-gradient-to-r from-purple-500 to-purple-600",
    gradient: "from-purple-600 to-purple-500",
  },
  ósmoklasisty: {
    label: "Egzamin ósmoklasisty",
    paperBand: "bg-gradient-to-r from-emerald-500 to-green-600",
    paperBandDark: "dark:from-emerald-600 dark:to-green-700",
    headerText: "text-white",
    accentText: "text-green-700 dark:text-green-300",
    accentBorder: "border-green-500",
    selectedChoice: "border-green-600 bg-green-50 ring-green-200 dark:border-green-400 dark:bg-green-950/40 dark:ring-green-900/60",
    hoverChoice: "hover:border-green-400 hover:bg-green-50/60 dark:hover:border-green-500 dark:hover:bg-green-950/30",
    button: "bg-green-600 hover:bg-green-700",
    switch: "data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600",
    dialogStrip: "bg-gradient-to-r from-emerald-500 to-green-600",
    gradient: "from-green-600 to-green-500",
  },
};

const confirmDialogContentClass =
  "max-w-md gap-0 overflow-hidden border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:rounded-2xl";

const confirmDialogCancelClass =
  "mt-0 flex-1 border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400 focus-visible:ring-offset-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-900";

const answerLetters = ["A", "B", "C", "D", "E", "F"];

const skeletonClass = "bg-slate-200 dark:bg-slate-700";
const skeletonOnBandClass = "bg-white/25 dark:bg-white/20";
const propType = () => null;

const CONFETTI_COLORS = [
  "#60a5fa",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#fb7185",
  "#38bdf8",
  "#c084fc",
];

function ResultsConfetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        left: `${((i * 17) % 97) + 1.5}%`,
        delay: (i % 10) * 0.07,
        duration: 2.1 + (i % 6) * 0.22,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotate: (i * 53) % 360,
        size: 5 + (i % 5) * 2,
        drift: i % 2 === 0 ? 36 : -36,
        round: i % 3 === 0,
      })),
    [],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className={`absolute top-0 ${piece.round ? "rounded-full" : "rounded-sm"}`}
          style={{
            left: piece.left,
            width: piece.size,
            height: piece.round ? piece.size : piece.size * 1.55,
            backgroundColor: piece.color,
          }}
          initial={{ y: -24, opacity: 0, rotate: 0, x: 0 }}
          animate={{
            y: [0, 460],
            opacity: [0, 1, 1, 0],
            rotate: piece.rotate + 220,
            x: [0, piece.drift],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function AnimatedCount({ value, suffix = "" }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, Number(value) || 0, {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

function getResultsHeadline(percentage) {
  if (percentage >= 90) return "Fenomenalnie!";
  if (percentage >= 75) return "Świetnie!";
  if (percentage >= 50) return "Gratulacje!";
  if (percentage >= 30) return "Arkusz ukończony";
  return "Próba za Tobą";
}

function getResultsSubline(percentage) {
  if (percentage >= 90) return "Prawie perfekcyjny wynik — tak trzymaj.";
  if (percentage >= 75) return "Mocny wynik. Warto zajrzeć w słabsze zadania.";
  if (percentage >= 50) return "Solidna baza — powtórz trudniejsze fragmenty.";
  if (percentage >= 30) return "Każda próba buduje nawyk. Przejrzyj odpowiedzi.";
  return "Spokojnie — obejrzyj arkusz i wróć do słabszych miejsc.";
}

const REVIEW_FILTER_ALL = "all";
const REVIEW_FILTER_CORRECT = "correct";
const REVIEW_FILTER_PARTIAL = "partial";
const REVIEW_FILTER_WRONG = "wrong";

function getQuestionReviewOutcome(scoreEntry) {
  if (!scoreEntry?.graded) return REVIEW_FILTER_WRONG;
  const earned = Number(scoreEntry.earned) || 0;
  const max = Number(scoreEntry.max) || 0;
  if (scoreEntry.correct === true || (max > 0 && earned >= max)) {
    return REVIEW_FILTER_CORRECT;
  }
  if (earned > 0 && earned < max) return REVIEW_FILTER_PARTIAL;
  return REVIEW_FILTER_WRONG;
}

function collectFailedQuestionIds(questionsList, scoresMap) {
  return questionsList
    .filter((question) => {
      const outcome = getQuestionReviewOutcome(scoresMap?.[question.id]);
      return (
        outcome === REVIEW_FILTER_WRONG || outcome === REVIEW_FILTER_PARTIAL
      );
    })
    .map((question) => String(question.id));
}

function pickScoreMap(...candidates) {
  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && Object.keys(candidate).length > 0) {
      return candidate;
    }
  }
  return {};
}

function WorksheetDetailsSkeleton({ examTheme }) {
  return (
    <>
      <Skeleton className={`mb-4 h-9 w-44 rounded-md ${skeletonClass}`} />

      <Card className="mb-6 overflow-hidden border border-slate-200/90 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <div className={`${examTheme.paperBand} ${examTheme.paperBandDark} px-5 py-5 sm:px-6`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className={`h-5 w-36 rounded-full ${skeletonOnBandClass}`} />
              <Skeleton className={`h-8 w-full max-w-sm rounded-md ${skeletonOnBandClass}`} />
              <Skeleton className={`h-4 w-48 rounded-md ${skeletonOnBandClass}`} />
            </div>
            <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[16rem] sm:gap-3">
              <Skeleton className={`h-[4.25rem] rounded-2xl ${skeletonOnBandClass}`} />
              <Skeleton className={`h-[4.25rem] rounded-2xl ${skeletonOnBandClass}`} />
            </div>
          </div>
        </div>
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton
                key={`meta-skel-${i}`}
                className={`h-10 w-28 rounded-full ${skeletonClass}`}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className={`h-11 w-full max-w-sm rounded-xl ${skeletonClass}`} />
            <Skeleton className={`h-11 w-full max-w-xs rounded-xl sm:w-56 ${skeletonClass}`} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 overflow-hidden border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className={`${examTheme.paperBand} ${examTheme.paperBandDark} px-5 py-3`}>
          <Skeleton className={`h-6 w-56 rounded-md ${skeletonOnBandClass}`} />
        </div>
        <CardContent className="space-y-7 p-6 sm:p-8">
          <Skeleton className={`h-6 w-full max-w-lg ${skeletonClass}`} />
          <div className="space-y-3">
            <Skeleton className={`h-5 w-full ${skeletonClass}`} />
            <Skeleton className={`h-5 w-[94%] ${skeletonClass}`} />
            <Skeleton className={`h-5 w-[80%] ${skeletonClass}`} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton
                key={`choice-skel-${i}`}
                className={`h-14 rounded-xl ${skeletonClass}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Skeleton className={`h-10 w-36 rounded-md ${skeletonClass}`} />
        <Skeleton className={`h-10 w-36 rounded-md ${skeletonClass}`} />
      </div>
    </>
  );
}

WorksheetDetailsSkeleton.propTypes = {
  examTheme: propType,
};

const getQuestionInstruction = (question) => {
  if (question?.question_type === "single_choice") {
    return "Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.";
  }
  if (question?.question_type === "true_false") {
    return "Oceń prawdziwość zdania. Wybierz Prawda albo Fałsz.";
  }
  if (hasOpenParts(question)) {
    return "Uzupełnij zdania. Wpisz odpowiednie przedziały w polach poniżej.";
  }
  if (isSimpleOpenQuestion(question)) {
    return "Rozwiąż zadanie samodzielnie, a następnie oceń swoją pracę według klucza CKE.";
  }
  return "Rozwiąż zadanie.";
};

const formatDisplayPart = (value) => {
  if (!value) return "";
  const cleaned = String(value).trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const splitOptionLabel = (option, index) => {
  const match = String(option).match(/^([A-Z])\.\s*(.*)$/);
  return {
    letter: match?.[1] || answerLetters[index] || `${index + 1}`,
    text: match?.[2] || option,
  };
};

const cleanWorksheetPart = (value) => {
  if (!value) return "";
  return value
    .replace(/\.[^/.]+$/, "")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
};

const normalizeWorksheetLevel = (value) => {
  const cleaned = cleanWorksheetPart(value);
  if (["pp", "podstawa", "podstawowy", "matura podstawowa"].includes(cleaned)) return "podstawowy";
  if (["pr", "rozszerzenie", "rozszerzony", "matura rozszerzona"].includes(cleaned)) return "rozszerzony";
  if (["null", "brak", "osma klasa", "ósma klasa", "osmaklasa", "ósmoklasisty", "egzamin ósmoklasisty"].includes(cleaned)) return "ósmoklasisty";
  return cleaned;
};

const parseWorksheetId = (id) => {
  const [year = "", month = "", formula = "", level = ""] = (id || "").split("-");
  return {
    year: cleanWorksheetPart(year),
    month: cleanWorksheetPart(month),
    formula: cleanWorksheetPart(formula),
    level: normalizeWorksheetLevel(level),
  };
};

function isWorksheetDetailsPath(pathname) {
  return /\/(egzamin|arkusz|worksheetdetails)$/i.test(pathname.replace(/\/$/, ""));
}

export default function WorksheetDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState(null);
  const completedSnapshotRef = useRef(null);
  const [answerKeyUrl, setAnswerKeyUrl] = useState(null);
  const [answerKeyLoading, setAnswerKeyLoading] = useState(false);
  const [answerKeyDialogOpen, setAnswerKeyDialogOpen] = useState(false);
  const [answerKeyPdfPage, setAnswerKeyPdfPage] = useState(1);
  const [questionScores, setQuestionScores] = useState({});
  const [checkedQuestionIds, setCheckedQuestionIds] = useState({});
  const [selfAwardedPoints, setSelfAwardedPoints] = useState({});
  const { user } = useAuth();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const [viewMode, setViewMode] = useState("single");
  const [reviewFilter, setReviewFilter] = useState(REVIEW_FILTER_ALL);
  const [retryQuestionIds, setRetryQuestionIds] = useState(null);
  const [retryPoolIds, setRetryPoolIds] = useState([]);
  const [saveAttemptDialogOpen, setSaveAttemptDialogOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(null);

  const worksheetId = searchParams.get("id");

  useEffect(() => {
    if (!timerEnabled || reviewMode || showResults) return undefined;

    const tick = () => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    };
    tick();
    timerRef.current = setInterval(tick, 1000);

    return () => clearInterval(timerRef.current);
  }, [timerEnabled, reviewMode, showResults]);

  useEffect(() => {
    if (!worksheetId) {
      setQuestions([]);
      setTasksLoading(false);
      setTasksError(null);
      return undefined;
    }

    let cancelled = false;
    let rawRowCount = 0;
    setTasksLoading(true);
    setTasksError(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setReviewMode(false);
    setReviewAnswers(null);
    setReviewFilter(REVIEW_FILTER_ALL);
    setRetryQuestionIds(null);
    setRetryPoolIds([]);
    setAnswerKeyUrl(null);
    setAnswerKeyDialogOpen(false);
    setAnswerKeyPdfPage(1);
    setQuestionScores({});
    setCheckedQuestionIds({});
    setSelfAwardedPoints({});
    setElapsedTime(0);
    setTimerEnabled(false);
    startTimeRef.current = Date.now();
    completedSnapshotRef.current = null;

    (async () => {
      const { data, error } = await publicSupabase
        .from("tasks")
        .select("*")
        .eq("arkusz", worksheetId)
        .order("nr", { ascending: true, nullsFirst: false });

      if (cancelled) return;

      if (error) {
        console.error("[WorksheetDetails]", error);
        setTasksError(error.message);
        setQuestions([]);
        setTasksLoading(false);
        return;
      }

      rawRowCount = data?.length ?? 0;
      const sorted = sortTasksByNr(
        (data ?? []).map(mapDbTaskRow).filter((t) => t && t.question),
      );
      const mapped = sorted
        .map((task, index) =>
          mapDbTaskToWorksheetQuestion(task, worksheetId, index + 1),
        )
        .filter(Boolean);

      if (rawRowCount === 0) {
        console.warn(
          `[WorksheetDetails] 0 wierszy dla arkusz="${worksheetId}" — import SQL lub polityki RLS (SELECT dla anon).`,
        );
      } else if (mapped.length === 0) {
        console.warn(
          `[WorksheetDetails] ${rawRowCount} wierszy w bazie, 0 po mapowaniu — sprawdź question_text.`,
        );
      }

      setQuestions(mapped);
      setTasksLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [worksheetId]);

  const activeWorksheetId = worksheetId || sampleWorksheet.id;
  const parsedMeta = parseWorksheetId(activeWorksheetId);
  const worksheet = {
    ...sampleWorksheet,
    id: activeWorksheetId,
    title: worksheetId || sampleWorksheet.title,
    month: parsedMeta.month,
    formula: parsedMeta.formula,
    year: parsedMeta.year || sampleWorksheet.year,
    level: parsedMeta.level || sampleWorksheet.level,
    total_points: getWorksheetTotalPoints(questions),
    duration_minutes: 0,
  };
  const { saveProgress, getAttempt, restorePreviousCompleted } =
    useWorksheetProgress();
  const displayMonth = formatDisplayPart(worksheet.month);
  const displayYear = worksheet.year || parsedMeta.year;
  const displayFormula = formatDisplayPart(worksheet.formula);
  const sheetTitle = displayMonth && displayYear
    ? `Arkusz ${displayMonth} ${displayYear}`
    : worksheet.title;

  const sessionStateRef = useRef({});
  const restoredRef = useRef(false);

  useEffect(() => {
    if (!activeWorksheetId) return;
    recordContinueLearning(user?.id, {
      type: "worksheet",
      id: activeWorksheetId,
      title: sheetTitle || worksheet.title,
      subtitle: [worksheet.level, worksheet.year].filter(Boolean).join(" · "),
      href: `${createPageUrl("WorksheetDetails")}?id=${activeWorksheetId}`,
      actionLabel: "Kontynuuj arkusz",
    });
  }, [
    activeWorksheetId,
    sheetTitle,
    user?.id,
    worksheet.level,
    worksheet.title,
    worksheet.year,
  ]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const syncElapsedTime = useCallback(() => {
    if (!timerEnabled) return elapsedTime;
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setElapsedTime(elapsed);
    return elapsed;
  }, [timerEnabled, elapsedTime]);

  const answeredQuestionCount = useMemo(() => {
    const list =
      retryQuestionIds?.length > 0
        ? questions.filter((q) => retryQuestionIds.includes(q.id))
        : questions;
    if (!list.length) return 0;
    return list.filter((q) => {
      if (hasOpenParts(q)) {
        return getOpenPartsList(q).some(
          (part) => String(getOpenPartValue(answers, q.id, part.id)).trim() !== "",
        );
      }
      const value = answers[q.id];
      return value != null && String(value).trim() !== "";
    }).length;
  }, [questions, answers, retryQuestionIds]);

  const canPauseOrFinish = answeredQuestionCount > 1;

  const isRetrySession = Boolean(retryQuestionIds?.length);

  sessionStateRef.current = {
    answers,
    currentQuestionIndex,
    viewMode,
    elapsedTime,
    timerEnabled,
    checkedQuestionIds,
    selfAwardedPoints,
    questions,
    showResults,
    reviewMode,
    isRetrySession,
    sheetTitle,
    worksheetTitle: worksheet.title,
  };

  const persistInProgressSession = useCallback(
    (patch = {}) => {
      if (!worksheetId) return;
      const state = sessionStateRef.current;
      if (!state.questions?.length || state.showResults || state.reviewMode || state.isRetrySession) return;

      const existing = getAttempt(worksheetId);
      if (isWorksheetCompleted(existing) && !patch.force) return;

      const answeredCount = countWorksheetAnswered(
        state.questions,
        state.answers || {},
      );

      if (answeredCount === 0) {
        if (existing?.status === WORKSHEET_STATUS.STARTED) {
          restorePreviousCompleted(worksheetId, { silent: patch.silent });
        }
        return;
      }

      const { beginSession, silent, ...sessionPatch } = patch;
      delete sessionPatch.force;

      const previousCompleted =
        patch.previousCompleted ??
        existing?.previousCompleted ??
        (beginSession ? snapshotCompletedAttempt(existing) : null);

      saveProgress({
        id: worksheetId,
        title: state.sheetTitle || state.worksheetTitle,
        status: WORKSHEET_STATUS.STARTED,
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        viewMode: state.viewMode,
        elapsedTime: state.elapsedTime,
        timerEnabled: state.timerEnabled,
        checkedQuestionIds: state.checkedQuestionIds,
        selfAwardedPoints: state.selfAwardedPoints,
        questionCount: state.questions.length,
        answeredCount,
        score: getWorksheetScoreSummary({
          questions: state.questions,
          questionScores: buildWorksheetQuestionScores({
            questions: state.questions,
            answersMap: state.answers,
            checkedIds: state.checkedQuestionIds,
            selfPoints: state.selfAwardedPoints,
          }),
          totalMax: getWorksheetTotalPoints(state.questions),
          onlyGraded: true,
        }).earned,
        total: getWorksheetTotalPoints(state.questions),
        ...(previousCompleted ? { previousCompleted } : {}),
        ...(existing?.attemptHistory ? { attemptHistory: existing.attemptHistory } : {}),
        startedAt: existing?.startedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...sessionPatch,
      }, { silent });
    },
    [worksheetId, getAttempt, saveProgress, restorePreviousCompleted],
  );

  const flushSessionOnLeave = useCallback(({ silent = false } = {}) => {
    if (!worksheetId) return;
    const state = sessionStateRef.current;
    if (!state.questions?.length || state.showResults || state.reviewMode || state.isRetrySession) return;

    if (state.timerEnabled) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      sessionStateRef.current = { ...state, elapsedTime: elapsed };
    }

    persistInProgressSession({ force: true, silent });
  }, [worksheetId, persistInProgressSession]);

  useLayoutEffect(() => {
    if (worksheetId || !isWorksheetDetailsPath(location.pathname)) return;
    navigate(createPageUrl("Worksheets"));
  }, [worksheetId, location.pathname, navigate]);

  const goToWorksheets = useCallback(({ skipFlush = false } = {}) => {
    if (!skipFlush) flushSessionOnLeave();
    navigate(createPageUrl("Worksheets"));
  }, [flushSessionOnLeave, navigate]);

  useEffect(() => {
    restoredRef.current = false;
  }, [worksheetId]);

  useEffect(() => {
    if (tasksLoading || questions.length === 0 || showResults || reviewMode || isRetrySession) return;

    const session = getAttempt(worksheetId);
    if (session?.status === WORKSHEET_STATUS.STARTED && !isWorksheetStarted(session)) {
      restorePreviousCompleted(worksheetId);
      return;
    }
    if (!isWorksheetStarted(session) || restoredRef.current) return;

    restoredRef.current = true;
    setAnswers(session.answers || {});
    const maxIndex = questions.length - 1;
    const idx = Math.min(Math.max(0, session.currentQuestionIndex ?? 0), maxIndex);
    setCurrentQuestionIndex(idx);
    if (session.viewMode === "single" || session.viewMode === "list") {
      setViewMode(session.viewMode);
    }
    const elapsed = session.elapsedTime ?? 0;
    setElapsedTime(elapsed);
    startTimeRef.current = Date.now() - elapsed * 1000;
    if (typeof session.timerEnabled === "boolean") {
      setTimerEnabled(session.timerEnabled);
    }
    if (session.checkedQuestionIds && typeof session.checkedQuestionIds === "object") {
      setCheckedQuestionIds(session.checkedQuestionIds);
    }
    if (session.selfAwardedPoints && typeof session.selfAwardedPoints === "object") {
      setSelfAwardedPoints(session.selfAwardedPoints);
    }
  }, [tasksLoading, questions.length, worksheetId, getAttempt, showResults, reviewMode, isRetrySession, restorePreviousCompleted]);

  useEffect(() => {
    if (tasksLoading || questions.length === 0 || showResults || reviewMode || isRetrySession) return;
    const timeoutId = setTimeout(() => persistInProgressSession(), 500);
    return () => clearTimeout(timeoutId);
  }, [
    answers,
    currentQuestionIndex,
    viewMode,
    elapsedTime,
    timerEnabled,
    checkedQuestionIds,
    selfAwardedPoints,
    tasksLoading,
    questions.length,
    showResults,
    reviewMode,
    isRetrySession,
    persistInProgressSession,
  ]);

  useEffect(() => {
    if (tasksLoading || questions.length === 0 || showResults || reviewMode || isRetrySession) return;
    if (Object.keys(answers).length === 0) return;
    const existing = getAttempt(worksheetId);
    if (!isWorksheetCompleted(existing)) return;
    persistInProgressSession({
      force: true,
      beginSession: true,
      previousCompleted: snapshotCompletedAttempt(existing),
    });
  }, [
    answers,
    tasksLoading,
    questions.length,
    showResults,
    reviewMode,
    isRetrySession,
    worksheetId,
    getAttempt,
    persistInProgressSession,
  ]);

  useEffect(() => {
    const flush = () => flushSessionOnLeave();
    window.addEventListener("beforeunload", flush);
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      window.removeEventListener("pagehide", flush);
      flushSessionOnLeave({ silent: true });
    };
  }, [flushSessionOnLeave]);

  const handleSelectAnswer = (questionId, answer) => {
    if (
      reviewMode ||
      showResults ||
      checkedQuestionIds[questionId] ||
      !answer
    ) {
      return;
    }
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleOpenPartChange = (questionId, partId, value) => {
    if (reviewMode || showResults || checkedQuestionIds[questionId]) {
      return;
    }
    const key = openPartAnswerKey(questionId, partId);
    setAnswers((prev) => {
      const next = { ...prev };
      if (value == null || String(value).trim() === "") {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const retryQuestions = useMemo(() => {
    if (!retryQuestionIds?.length) return null;
    const idSet = new Set(retryQuestionIds.map(String));
    return questions.filter((question) => idSet.has(String(question.id)));
  }, [questions, retryQuestionIds]);

  const scoringSourceQuestions = retryQuestions ?? questions;

  const scoring = useWorksheetScores({
    questions: scoringSourceQuestions,
    answers,
    checkedQuestionIds,
    selfAwardedPoints,
    overrideScores:
      reviewMode && Object.keys(questionScores).length > 0 ? questionScores : null,
  });

  const reviewFilterCounts = useMemo(() => {
    const counts = {
      [REVIEW_FILTER_ALL]: questions.length,
      [REVIEW_FILTER_CORRECT]: 0,
      [REVIEW_FILTER_PARTIAL]: 0,
      [REVIEW_FILTER_WRONG]: 0,
    };
    questions.forEach((question) => {
      const outcome = getQuestionReviewOutcome(scoring.questionScores[question.id]);
      counts[outcome] += 1;
    });
    return counts;
  }, [questions, scoring.questionScores]);

  const visibleQuestions = useMemo(() => {
    if (retryQuestions) return retryQuestions;
    if (!reviewMode || reviewFilter === REVIEW_FILTER_ALL) return questions;
    return questions.filter(
      (question) =>
        getQuestionReviewOutcome(scoring.questionScores[question.id]) ===
        reviewFilter,
    );
  }, [retryQuestions, reviewMode, reviewFilter, questions, scoring.questionScores]);

  const clampedQuestionIndex = Math.min(
    currentQuestionIndex,
    Math.max(0, visibleQuestions.length - 1),
  );
  const currentQuestion =
    visibleQuestions[clampedQuestionIndex] || visibleQuestions[0];

  useEffect(() => {
    if (currentQuestionIndex === clampedQuestionIndex) return;
    setCurrentQuestionIndex(clampedQuestionIndex);
  }, [currentQuestionIndex, clampedQuestionIndex]);

  const handleReviewFilterChange = (nextFilter) => {
    if (nextFilter === reviewFilter) return;
    setReviewFilter(nextFilter);
    setCurrentQuestionIndex(0);
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) =>
      Math.min(prev + 1, Math.max(0, visibleQuestions.length - 1)),
    );
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const canCheckQuestion = (question, answersMap) => {
    if (hasOpenParts(question)) {
      return areAllOpenPartsFilled(question, answersMap);
    }
    if (isSimpleOpenQuestion(question)) {
      return Boolean(answerKeyUrl) && !answerKeyLoading;
    }
    return Boolean(getStoredAnswerValue(question, answersMap));
  };

  const handleCheckQuestion = (questionId) => {
    setCheckedQuestionIds((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleSetSelfPoints = (questionId, points) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;
    const max = getQuestionMaxPoints(question);
    const clamped = Math.min(Math.max(0, Math.floor(Number(points) || 0)), max);
    setSelfAwardedPoints((prev) => ({ ...prev, [questionId]: clamped }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimerToggle = useCallback((enabled) => {
    if (enabled) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      setTimerEnabled(true);
      return;
    }
    setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    stopTimer();
    setTimerEnabled(false);
  }, [elapsedTime, stopTimer]);

  const handleSubmitClick = () => {
    if (reviewMode) return;
    syncElapsedTime();
    setSaveAttemptDialogOpen(true);
  };

  const finishWorksheet = () => {
    const finalElapsed = syncElapsedTime();
    stopTimer();
    const { questionScores: qScores, score, total } = scoring.buildFinalSnapshot();
    const scoredQuestions = scoringSourceQuestions;
    const nextRetryPool = collectFailedQuestionIds(scoredQuestions, qScores);

    if (isRetrySession) {
      setQuestionScores(qScores);
      setRetryPoolIds(nextRetryPool);
      setSaveAttemptDialogOpen(false);
      setShowResults(true);
      return;
    }

    const existing = getAttempt(worksheet.id);
    const previousHistory = Array.isArray(existing?.attemptHistory)
      ? existing.attemptHistory
      : existing?.previousCompleted
        ? [existing.previousCompleted]
        : [];
    const completedAttempt = {
      id: worksheet.id,
      title: sheetTitle || worksheet.title,
      status: WORKSHEET_STATUS.COMPLETED,
      score,
      total: total || worksheet.total_points,
      ...(timerEnabled ? { timeSpent: finalElapsed * 1000, elapsedTime: finalElapsed } : {}),
      answers,
      selfAwardedPoints,
      checkedQuestionIds,
      questionScores: qScores,
      questionScoreRows: getWorksheetScoreRows(questions, qScores),
      currentQuestionIndex,
      viewMode,
      timerEnabled,
      date: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const completedSnapshot = snapshotCompletedAttempt(completedAttempt);
    saveProgress({
      ...completedAttempt,
      attemptHistory: [...previousHistory, completedSnapshot],
    });
    completedSnapshotRef.current = {
      answers: { ...answers },
      questionScores: qScores,
      selfAwardedPoints: { ...selfAwardedPoints },
      checkedQuestionIds: { ...checkedQuestionIds },
      currentQuestionIndex,
      viewMode,
      elapsedTime: finalElapsed,
      timerEnabled,
      failedQuestionIds: nextRetryPool,
    };
    setQuestionScores(qScores);
    setRetryPoolIds(nextRetryPool);
    setSaveAttemptDialogOpen(false);
    setShowResults(true);
  };

  const startRetrySession = useCallback(
    (failedIds) => {
      const uniqueIds = [...new Set((failedIds || []).map(String).filter(Boolean))];
      if (!uniqueIds.length) return false;

      const idSet = new Set(uniqueIds);
      const failedQuestions = questions.filter((q) => idSet.has(String(q.id)));
      if (!failedQuestions.length) return false;

      setRetryQuestionIds(uniqueIds);
      setRetryPoolIds(uniqueIds);
      setAnswers({});
      setCheckedQuestionIds({});
      setSelfAwardedPoints({});
      setQuestionScores({});
      setReviewMode(false);
      setReviewAnswers(null);
      setReviewFilter(REVIEW_FILTER_ALL);
      setShowResults(false);
      setCurrentQuestionIndex(0);
      setViewMode("single");
      setElapsedTime(0);
      setTimerEnabled(false);
      startTimeRef.current = Date.now();
      setSaveAttemptDialogOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    },
    [questions],
  );

  const handleRetryFailedQuestions = () => {
    const savedAttempt = worksheet?.id ? getAttempt(worksheet.id) : null;
    const scoresMap = pickScoreMap(
      completedSnapshotRef.current?.questionScores,
      savedAttempt?.questionScores,
      questionScores,
      scoring.finalScores,
    );
    const sourceQuestions = retryQuestions?.length ? retryQuestions : questions;
    const fromPool = (retryPoolIds || [])
      .map(String)
      .filter((id) => sourceQuestions.some((q) => String(q.id) === id));
    const fromScores = collectFailedQuestionIds(sourceQuestions, scoresMap);
    const failedIds = fromPool.length ? fromPool : fromScores;

    if (!startRetrySession(failedIds) && fromScores.length) {
      startRetrySession(fromScores);
    }
  };

  const handleViewCompletedWorksheet = () => {
    const savedAttempt = getAttempt(worksheet.id);
    const snapshot =
      completedSnapshotRef.current?.answers ??
      savedAttempt?.answers ??
      reviewAnswers ??
      answers;
    const frozen = { ...snapshot };
    const restoredSelf =
      completedSnapshotRef.current?.selfAwardedPoints ??
      savedAttempt?.selfAwardedPoints;
    const restoredChecked =
      completedSnapshotRef.current?.checkedQuestionIds ??
      savedAttempt?.checkedQuestionIds;
    const scores =
      completedSnapshotRef.current?.questionScores ??
      savedAttempt?.questionScores ??
      buildWorksheetQuestionScores({
        questions,
        answersMap: frozen,
        checkedIds: restoredChecked ?? {},
        selfPoints: restoredSelf ?? {},
        countUngradedAsZero: true,
      });
    setRetryQuestionIds(null);
    setReviewAnswers(frozen);
    setAnswers(frozen);
    setQuestionScores(scores);
    if (completedSnapshotRef.current?.viewMode) {
      setViewMode(completedSnapshotRef.current.viewMode);
    }
    if (completedSnapshotRef.current?.currentQuestionIndex != null) {
      setCurrentQuestionIndex(completedSnapshotRef.current.currentQuestionIndex);
    }
    if (restoredSelf && typeof restoredSelf === "object") {
      setSelfAwardedPoints(restoredSelf);
    }
    if (restoredChecked && typeof restoredChecked === "object") {
      setCheckedQuestionIds(restoredChecked);
    }
    setShowResults(false);
    setReviewMode(true);
    setReviewFilter(REVIEW_FILTER_ALL);
  };

  const handleExitReviewMode = () => {
    setReviewMode(false);
    setReviewAnswers(null);
    setReviewFilter(REVIEW_FILTER_ALL);
    setRetryQuestionIds(null);
    setRetryPoolIds([]);
    setAnswerKeyUrl(null);
    setAnswerKeyDialogOpen(false);
    goToWorksheets();
  };

  useEffect(() => {
    if (!worksheetId || showResults) {
      setAnswerKeyUrl(null);
      setAnswerKeyLoading(false);
      return undefined;
    }

    let cancelled = false;
    setAnswerKeyLoading(true);

    (async () => {
      try {
        const url = await resolveWorksheetAnswerKeyUrl(
          worksheetId,
          worksheet.level,
        );
        if (!cancelled) setAnswerKeyUrl(url);
      } finally {
        if (!cancelled) setAnswerKeyLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [worksheetId, worksheet.level, showResults]);

  const openAnswerKeyDialog = useCallback((page = 1) => {
    setAnswerKeyPdfPage(Math.max(1, Math.floor(Number(page) || 1)));
    setAnswerKeyDialogOpen(true);
  }, []);

  const openAnswerKeyAtQuestion = useCallback(
    (question) => {
      openAnswerKeyDialog(resolveAnswerKeyPage(question));
    },
    [openAnswerKeyDialog],
  );

  const answerKeyIframeSrc = answerKeyPdfUrlWithPage(answerKeyUrl, answerKeyPdfPage);

  const handleLeaveWithSave = (event) => {
    event?.preventDefault?.();
    syncElapsedTime();
    stopTimer();
    const existing = getAttempt(worksheetId);
    const patch = { force: true };
    if (isWorksheetCompleted(existing)) {
      patch.beginSession = true;
      patch.previousCompleted = snapshotCompletedAttempt(existing);
    }
    persistInProgressSession(patch);
    goToWorksheets({ skipFlush: true });
  };

  const handleBackToWorksheets = () => {
    if (reviewMode) {
      handleExitReviewMode();
      return;
    }
    if (isRetrySession) {
      setRetryQuestionIds(null);
      goToWorksheets({ skipFlush: true });
      return;
    }
    if (showResults) {
      goToWorksheets();
      return;
    }
    if (answeredQuestionCount === 0) {
      goToWorksheets({ skipFlush: true });
      return;
    }
    handleLeaveWithSave();
  };

  const handleCloseFinishDialog = () => {
    setSaveAttemptDialogOpen(false);
  };

  const calculateScore = () => {
    const { earned, totalMax, percentage } = scoring.finalSummary;
    return {
      correct: earned,
      total: totalMax,
      percentage,
    };
  };

  const isDark = user?.theme === "dark";
  const examTheme = worksheetLevelTheme[worksheet.level] || worksheetLevelTheme.podstawowy;
  const finishButtonClass = `bg-gradient-to-r ${examTheme.gradient} hover:opacity-90`;

  const displayAnswers = reviewMode && reviewAnswers ? reviewAnswers : answers;
  const practiceMode = !reviewMode && !showResults;

  const worksheetFabActions = useMemo(() => {
    if (!worksheetId || showResults || tasksLoading || questions.length === 0) {
      return [];
    }

    const items = [
      {
        id: "answer-key",
        label: answerKeyLoading
          ? "Ładowanie klucza…"
          : answerKeyUrl
            ? "Karta z odpowiedziami (CKE)"
            : "Klucz niedostępny",
        icon: BookOpen,
        disabled: answerKeyLoading,
        onClick: () => openAnswerKeyDialog(1),
      },
    ];

    if (viewMode === "single" && currentQuestion) {
      const question = currentQuestion;
      items.push({
        id: "answer-key-page",
        label: `Klucz — zadanie ${question.question_number}`,
        icon: KeyRound,
        disabled: answerKeyLoading,
        onClick: () => openAnswerKeyAtQuestion(question),
      });
    }

    if (!reviewMode) {
      if (viewMode !== "single") {
        items.push({
          id: "view-single",
          label: "Widok po kolei",
          icon: FileText,
          onClick: () => setViewMode("single"),
        });
      }
      if (viewMode !== "list") {
        items.push({
          id: "view-list",
          label: "Widok lista",
          icon: List,
          onClick: () => setViewMode("list"),
        });
      }
      items.push({
        id: "timer-toggle",
        label: timerEnabled ? "Wyłącz pomiar czasu" : "Włącz pomiar czasu",
        icon: Timer,
        onClick: () => handleTimerToggle(!timerEnabled),
      });
    }

    return items;
  }, [
    worksheetId,
    showResults,
    tasksLoading,
    questions.length,
    answerKeyLoading,
    answerKeyUrl,
    viewMode,
    reviewMode,
    timerEnabled,
    currentQuestionIndex,
    currentQuestion,
    openAnswerKeyDialog,
    openAnswerKeyAtQuestion,
    handleTimerToggle,
  ]);

  usePageActions(worksheetFabActions, [
    worksheetId,
    showResults,
    tasksLoading,
    questions.length,
    answerKeyLoading,
    answerKeyUrl,
    viewMode,
    reviewMode,
    timerEnabled,
    currentQuestionIndex,
    currentQuestion?.id,
  ]);

  const reviewCorrectChoiceClass =
    "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200 dark:border-emerald-400 dark:bg-emerald-950/50 dark:ring-emerald-900/60";
  const reviewWrongPickChoiceClass =
    "border-rose-400 bg-rose-50 ring-2 ring-rose-200 dark:border-rose-500 dark:bg-rose-950/40 dark:ring-rose-900/50";

  const renderChoice = (question, option, index, type = "single_choice") => {
    const value = type === "true_false" ? option : option;
    const selectedValue = getStoredAnswerValue(question, displayAnswers);
    const correctValue = getStoredAnswerValue(question, {
      [question.id]: question.correct_answer,
    });
    const isSelected = selectedValue === value;
    const isCorrectOption = Boolean(correctValue) && value === correctValue;
    const answerRevealed =
      reviewMode || (practiceMode && checkedQuestionIds[question.id]);
    const isUserWrongPick = answerRevealed && isSelected && !isCorrectOption;
    const optionLabel = splitOptionLabel(option, index);
    const justChecked = Boolean(practiceMode && checkedQuestionIds[question.id]);

    let choiceClassName =
      "border-slate-300 dark:border-slate-600 " + examTheme.hoverChoice;
    if (answerRevealed) {
      if (isCorrectOption) choiceClassName = reviewCorrectChoiceClass;
      else if (isUserWrongPick) choiceClassName = reviewWrongPickChoiceClass;
    } else if (isSelected) {
      choiceClassName = `${examTheme.selectedChoice} ring-2`;
    }

    let choiceAnimate = { scale: 1, x: 0, boxShadow: "0 0 0 0 rgba(0,0,0,0)" };
    if (justChecked && isCorrectOption) {
      choiceAnimate = {
        scale: [1, 1.04, 1],
        boxShadow: [
          "0 0 0 0 rgba(16,185,129,0)",
          "0 0 0 10px rgba(16,185,129,0.28)",
          "0 0 0 0 rgba(16,185,129,0)",
        ],
        transition: { duration: 0.55, ease: "easeOut" },
      };
    } else if (justChecked && isUserWrongPick) {
      choiceAnimate = {
        x: [0, -8, 8, -6, 6, -3, 0],
        boxShadow: [
          "0 0 0 0 rgba(244,63,94,0)",
          "0 0 0 8px rgba(244,63,94,0.22)",
          "0 0 0 0 rgba(244,63,94,0)",
        ],
        transition: { duration: 0.5, ease: "easeInOut" },
      };
    }

    return (
      <motion.div
        key={`${value}-${justChecked ? "checked" : "open"}`}
        role="radio"
        aria-checked={isSelected}
        tabIndex={reviewMode || answerRevealed ? -1 : 0}
        onClick={() => {
          if (reviewMode || answerRevealed) return;
          handleSelectAnswer(question.id, value);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          if (reviewMode || answerRevealed) return;
          handleSelectAnswer(question.id, value);
        }}
        initial={justChecked ? { scale: 1, x: 0 } : false}
        animate={choiceAnimate}
        className={`flex min-h-14 items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-colors dark:bg-slate-900/70 ${
          reviewMode || answerRevealed ? "cursor-default" : "cursor-pointer"
        } ${choiceClassName}`}
      >
        <span className={`text-lg font-bold ${examTheme.accentText}`}>
          {type === "true_false" ? option : `${optionLabel.letter}.`}
        </span>
        <span className="flex-1 leading-relaxed text-base text-slate-950 dark:text-white">
          <MathText
            text={type === "true_false" ? option : optionLabel.text}
            className="math-text-ui--flow"
          />
        </span>
      </motion.div>
    );
  };

  const renderExamQuestion = (question) => {
    const scoreEntry = scoring.questionScores[question.id];
    const maxPts = getQuestionMaxPoints(question);
    const isGraded = scoreEntry?.graded && scoreEntry.earned != null;
    const pointsLabel = isGraded
      ? `${scoreEntry.earned}/${maxPts} pkt`
      : `0–${maxPts} pkt`;

    return (
      <Card key={question.id} className="mb-6 overflow-hidden border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className={`${examTheme.paperBand} ${examTheme.paperBandDark} px-5 py-3 shadow-sm`}>
          <h2
            className={`flex flex-wrap items-center gap-2 text-xl font-extrabold ${examTheme.headerText}`}
          >
            <span className="tabular-nums">
              Zadanie {question.question_number}. ({pointsLabel})
            </span>
            {answerKeyUrl && !showResults ? (
              <button
                type="button"
                onClick={() => openAnswerKeyAtQuestion(question)}
                disabled={answerKeyLoading}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                title={`Klucz CKE — zadanie ${question.question_number}`}
                aria-label={`Pokaż klucz CKE dla zadania ${question.question_number}`}
              >
                <KeyRound className="h-4 w-4" />
              </button>
            ) : null}
          </h2>
        </div>
        <CardContent className="space-y-7 p-6 sm:p-8">
          <p className="worksheet-question-prompt text-xl leading-relaxed text-slate-950 dark:text-slate-100">
            <span className="font-bold">{getQuestionInstruction(question)}</span>
            {question.question_text?.trim() ? (
              <>
                {" "}
                <MathText
                  text={question.question_text}
                  className="math-text-ui--flow font-normal"
                />
              </>
            ) : null}
          </p>

        {question.image_url ? (
          <img
            src={question.image_url}
            alt="Ilustracja do zadania"
            className="mx-auto w-full max-w-md rounded-lg border border-slate-200 dark:border-slate-700"
          />
        ) : null}

        {question.question_text_po_obrazku?.trim() ? (
          <p className="worksheet-question-prompt text-xl leading-relaxed text-slate-950 dark:text-slate-100">
            <MathText
              text={question.question_text_po_obrazku}
              className="math-text-ui--flow"
            />
          </p>
        ) : null}

        {hasOpenParts(question) ? (
          <WorksheetOpenParts
            question={question}
            answersMap={displayAnswers}
            onPartChange={handleOpenPartChange}
            disabled={reviewMode || (practiceMode && checkedQuestionIds[question.id])}
            showFeedback={practiceMode && checkedQuestionIds[question.id]}
          />
        ) : null}

        {question.question_type === "single_choice" && (
          <div
            role="radiogroup"
            aria-label={`Odpowiedzi do zadania ${question.question_number}`}
            className={`grid gap-4 sm:grid-cols-2 ${
              reviewMode || (practiceMode && checkedQuestionIds[question.id])
                ? "pointer-events-none"
                : ""
            }`}
          >
            {question.options?.map((option, index) => renderChoice(question, option, index))}
          </div>
        )}

        {question.question_type === "true_false" && (
          <div
            role="radiogroup"
            aria-label={`Odpowiedź prawda lub fałsz — zadanie ${question.question_number}`}
            className={`grid gap-4 sm:grid-cols-2 ${
              reviewMode || (practiceMode && checkedQuestionIds[question.id])
                ? "pointer-events-none"
                : ""
            }`}
          >
            {["Prawda", "Fałsz"].map((option, index) => renderChoice(question, option, index, "true_false"))}
          </div>
        )}

        {practiceMode && (
          <div className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700">
            {isSimpleOpenQuestion(question) ? (
              <div className="space-y-4">
                <Button
                  type="button"
                  onClick={() => openAnswerKeyAtQuestion(question)}
                  disabled={!canCheckQuestion(question, answers)}
                  className={finishButtonClass}
                >
                  Sprawdź odpowiedź
                </Button>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                  <p className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Przyznij sobie punkty:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      { length: getQuestionMaxPoints(question) + 1 },
                      (_, pts) => (
                        <Button
                          key={pts}
                          type="button"
                          size="sm"
                          variant={
                            (selfAwardedPoints[question.id] ?? 0) === pts
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleSetSelfPoints(question.id, pts)}
                          className={
                            (selfAwardedPoints[question.id] ?? 0) === pts
                              ? `${examTheme.button} text-white`
                              : "border-slate-300 dark:border-slate-600"
                          }
                        >
                          {pts}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ) : !checkedQuestionIds[question.id] ? (
              <Button
                type="button"
                onClick={() => handleCheckQuestion(question.id)}
                disabled={!canCheckQuestion(question, answers)}
                className={finishButtonClass}
              >
                Sprawdź odpowiedź
              </Button>
            ) : (
              (() => {
                const entry = scoring.questionScores[question.id];
                const maxPts = getQuestionMaxPoints(question);
                const earnedPts = entry?.graded ? entry.earned : 0;
                const fullCredit = entry?.graded && entry.correct;
                const partialOpen =
                  hasOpenParts(question) &&
                  entry?.graded &&
                  earnedPts > 0 &&
                  earnedPts < maxPts;

                return (
                  <motion.div
                    key={`feedback-${question.id}`}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                    className={`rounded-xl px-4 py-3.5 text-center text-sm font-semibold text-white shadow-md ${
                      fullCredit
                        ? "bg-emerald-600 shadow-emerald-600/25"
                        : partialOpen
                          ? "bg-amber-600 shadow-amber-600/25"
                          : "bg-rose-600 shadow-rose-600/25"
                    }`}
                  >
                    {fullCredit ? (
                      "Dobrze!"
                    ) : partialOpen ? (
                      "Częściowo poprawnie — sprawdź pola powyżej."
                    ) : hasOpenParts(question) ? (
                      "Sprawdź poprawki przy polach powyżej."
                    ) : (
                      <span>
                        Błąd. Poprawna odpowiedź:{" "}
                        <MathText text={question.correct_answer} />
                      </span>
                    )}
                  </motion.div>
                );
              })()
            )}
          </div>
        )}

        {question.video_url ? (
          <div
            className={`${
              practiceMode || reviewMode
                ? "border-t border-slate-200 pt-6 dark:border-slate-700"
                : ""
            }`}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value={`video-${question.id}`}
                className="rounded-xl border border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <AccordionTrigger className="px-4 text-base font-semibold text-slate-900 hover:no-underline dark:text-white">
                  Wytłumaczenie wideo
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    <iframe
                      src={question.video_url}
                      title={`Wytłumaczenie zadania ${question.question_number}`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : null}

        </CardContent>
      </Card>
    );
  };

  const pageIsDark = document.documentElement.classList.contains("dark");

  if (!isWorksheetDetailsPath(location.pathname)) {
    return null;
  }

  if (tasksLoading && worksheetId) {
    const loadingMeta = parseWorksheetId(worksheetId);
    const loadingTheme =
      worksheetLevelTheme[loadingMeta.level] || worksheetLevelTheme.podstawowy;

    return (
      <div
        className={`py-8`}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <WorksheetDetailsSkeleton examTheme={loadingTheme} />
        </div>
      </div>
    );
  }

  if (
    !worksheetId &&
    isWorksheetDetailsPath(location.pathname)
  ) {
    const loadingMeta = worksheetLevelTheme.podstawowy;
    return (
      <div
        className={`py-8`}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <WorksheetDetailsSkeleton examTheme={loadingMeta} />
        </div>
      </div>
    );
  }

  if (!worksheetId || tasksError || questions.length === 0) {
    const emptyTitle = !worksheetId
      ? "Brak arkusza"
      : tasksError
        ? "Błąd ładowania"
        : "Brak zadań w bazie";
    const emptyMessage = !worksheetId
      ? "Nie podano identyfikatora arkusza."
      : tasksError
        ? tasksError
        : `Nie znaleziono zadań z polem arkusz równym "${worksheetId}". W Supabase uruchom kolejno: data/setup-tasks-schema.sql, data/setup-tasks-read-access.sql, data/insert-matura-2025-maj-2023-pp-zadania.sql. Jeśli import był OK, sprawdź RLS (SELECT dla roli anon) w Table Editor → tasks.`;
    return (
      <div
        className={`py-8`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="dark:bg-slate-800 bg-white">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {emptyTitle}
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                {emptyMessage}
              </p>
              <Button
                type="button"
                variant="outline"
                className="dark:border-slate-600"
                onClick={goToWorksheets}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót do arkuszy
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    const { correct, total, percentage } = calculateScore();
    const resultsTimerEnabled =
      completedSnapshotRef.current?.timerEnabled ?? timerEnabled;
    const resultsElapsed =
      completedSnapshotRef.current?.elapsedTime ?? elapsedTime;
    const headline = getResultsHeadline(percentage);
    const subline = isRetrySession
      ? "To tylko powtórka — wynik nie zmienia oceny arkusza."
      : getResultsSubline(percentage);
    const resultsQuestionCount = isRetrySession
      ? retryQuestions?.length || 0
      : questions.length;
    const scoresForRetryButton = pickScoreMap(
      completedSnapshotRef.current?.questionScores,
      questionScores,
      scoring.finalScores,
    );
    const failedRetryCount = Math.max(
      retryPoolIds.length,
      collectFailedQuestionIds(
        isRetrySession ? retryQuestions || [] : questions,
        scoresForRetryButton,
      ).length,
    );
    const resultStats = [
      {
        key: "score",
        label: "Punkty",
        value: (
          <>
            <AnimatedCount value={correct} />
            <span className="text-2xl font-semibold text-emerald-500/80 dark:text-emerald-300/80">
              /{total}
            </span>
          </>
        ),
        className:
          "border-emerald-200/80 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/35",
        valueClass: "text-emerald-600 dark:text-emerald-300",
      },
      {
        key: "questions",
        label: isRetrySession ? "W powtórce" : "Zadań",
        value: <AnimatedCount value={resultsQuestionCount} />,
        className:
          "border-violet-200/80 bg-violet-50 dark:border-violet-800/60 dark:bg-violet-950/35",
        valueClass: "text-violet-600 dark:text-violet-300",
      },
      ...((isRetrySession ? timerEnabled || elapsedTime > 0 : resultsTimerEnabled)
        ? [
            {
              key: "time",
              label: isRetrySession ? "Czas powtórki" : "Czas",
              value: formatTime(isRetrySession ? elapsedTime : resultsElapsed),
              className:
                "border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/80",
              valueClass: "text-slate-700 dark:text-slate-100",
            },
          ]
        : []),
    ];

    return (
      <div className="relative overflow-hidden py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/70 via-transparent to-transparent dark:from-blue-950/40" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <Card className="relative overflow-hidden border border-slate-200/90 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
              <ResultsConfetti />
              <div
                className={`relative ${examTheme.paperBand} ${examTheme.paperBandDark} px-6 pb-10 pt-9 text-center sm:px-10`}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 360, damping: 16, delay: 0.08 }}
                  className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/35 bg-white/20 shadow-lg backdrop-blur-sm"
                >
                  <Trophy className="h-10 w-10 text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/95 backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    {isRetrySession ? "Powtórka niezaliczonych" : "Arkusz ukończony"}
                  </div>
                  <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${examTheme.headerText}`}>
                    {headline}
                  </h2>
                  <p className="mx-auto mt-2 max-w-lg text-sm text-white/80 sm:text-base">
                    {worksheet.title}
                  </p>
                  <p className="mx-auto mt-1.5 max-w-md text-sm text-white/70">
                    {subline}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.28, type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto mt-7 inline-flex min-w-[9.5rem] flex-col items-center rounded-3xl border border-white/30 bg-white/15 px-8 py-4 backdrop-blur-md"
                >
                  <span className={`text-5xl font-black tabular-nums leading-none sm:text-6xl ${examTheme.headerText}`}>
                    <AnimatedCount value={percentage} suffix="%" />
                  </span>
                  <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/75">
                    Wynik końcowy
                  </span>
                </motion.div>
              </div>

              <CardContent className="relative space-y-7 p-6 sm:p-8">
                <div
                  className={`grid gap-3 ${
                    resultsTimerEnabled ? "sm:grid-cols-3" : "sm:grid-cols-2"
                  }`}
                >
                  {resultStats.map((stat, index) => (
                    <motion.div
                      key={stat.key}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + index * 0.08, duration: 0.35 }}
                      className={`rounded-2xl border px-4 py-5 text-center ${stat.className}`}
                    >
                      <div className={`text-3xl font-bold leading-none ${stat.valueClass}`}>
                        {stat.value}
                      </div>
                      <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.35 }}
                  className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap"
                >
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="h-11 border-slate-300 dark:border-slate-600"
                    onClick={goToWorksheets}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Powrót do arkuszy
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleViewCompletedWorksheet}
                    className={`h-11 text-white shadow-md ${examTheme.button}`}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Obejrzyj arkusz
                  </Button>
                  {!isRetrySession && failedRetryCount > 0 && (
                    <Button
                      type="button"
                      size="lg"
                      onClick={handleRetryFailedQuestions}
                      className={`h-11 text-white shadow-md ${finishButtonClass}`}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Spróbuj jeszcze raz niezaliczone
                    </Button>
                  )}
                  {!isRetrySession && (
                    <Button
                      size="lg"
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="h-11 border-slate-300 dark:border-slate-600"
                    >
                      Spróbuj ponownie
                    </Button>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4 dark:text-slate-300"
            onClick={handleBackToWorksheets}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do arkuszy
          </Button>
          <Card className="overflow-hidden border border-slate-200/90 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className={`${examTheme.paperBand} ${examTheme.paperBandDark} px-5 py-5 sm:px-6`}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2.5 flex flex-wrap gap-2">
                    <Badge className="border-white/35 bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                      {examTheme.label}
                    </Badge>
                    {reviewMode && (
                      <Badge className="border-white/35 bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                        Podgląd ukończonego arkusza
                      </Badge>
                    )}
                    {isRetrySession && !reviewMode && (
                      <Badge className="border-white/35 bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                        Powtórka niezaliczonych · bez wpływu na wynik
                      </Badge>
                    )}
                  </div>
                  <h1 className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${examTheme.headerText}`}>
                    {sheetTitle}
                  </h1>
                  {worksheet.title && worksheet.title !== sheetTitle && (
                    <p className="mt-1.5 max-w-xl truncate text-sm text-white/70">
                      {worksheet.title}
                    </p>
                  )}
                </div>
                <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[16rem] sm:gap-3">
                  <div
                    className={`rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-center backdrop-blur-sm ${examTheme.headerText}`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                      Punkty
                    </p>
                    <div className="mt-0.5 text-2xl font-bold tabular-nums leading-none">
                      {scoring.summary.earned}
                      <span className="text-base font-medium text-white/65">
                        /{scoring.summary.totalMax}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-center backdrop-blur-sm ${examTheme.headerText}`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                      {viewMode === "single" ? "Zadanie" : "Zadań"}
                    </p>
                    <div className="mt-0.5 text-2xl font-bold tabular-nums leading-none">
                      {viewMode === "single"
                        ? visibleQuestions.length === 0
                          ? 0
                          : clampedQuestionIndex + 1
                        : visibleQuestions.length}
                      {viewMode === "single" && (
                        <span className="text-base font-medium text-white/65">
                          /{visibleQuestions.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="space-y-4 p-5 sm:p-6">
              <div className="flex flex-wrap gap-2">
                {displayYear && (
                  <div className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 dark:border-slate-700 dark:bg-slate-900/55">
                    <Calendar className={`h-3.5 w-3.5 shrink-0 ${examTheme.accentText}`} />
                    <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Rok
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {displayYear}
                    </span>
                  </div>
                )}
                {displayMonth && (
                  <div className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 dark:border-slate-700 dark:bg-slate-900/55">
                    <CalendarDays className={`h-3.5 w-3.5 shrink-0 ${examTheme.accentText}`} />
                    <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Termin
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {displayMonth}
                    </span>
                  </div>
                )}
                {displayFormula && (
                  <div className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 dark:border-slate-700 dark:bg-slate-900/55">
                    <Layers className={`h-3.5 w-3.5 shrink-0 ${examTheme.accentText}`} />
                    <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Formuła
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {displayFormula}
                    </span>
                  </div>
                )}
                <div className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 dark:border-slate-700 dark:bg-slate-900/55">
                  <FileText className={`h-3.5 w-3.5 shrink-0 ${examTheme.accentText}`} />
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Zadania
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {questions.length}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {!reviewMode && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-900/60">
                      <div className="flex w-[6.75rem] shrink-0 items-center gap-2">
                        <Clock
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            timerEnabled
                              ? examTheme.accentText
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        />
                        <span
                          className={`w-[4.5rem] tabular-nums text-base font-semibold transition-colors ${
                            timerEnabled
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {timerEnabled ? formatTime(elapsedTime) : "00:00"}
                        </span>
                      </div>
                      <div className="h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-600" />
                      <label className="flex shrink-0 cursor-pointer items-center gap-2.5">
                        <Switch
                          checked={timerEnabled}
                          onCheckedChange={handleTimerToggle}
                          className={examTheme.switch}
                        />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Mierz czas
                        </span>
                      </label>
                    </div>
                    <Button
                      type="button"
                      onClick={handleSubmitClick}
                      className={`${finishButtonClass} h-11 shrink-0 px-5 text-white`}
                    >
                      Zakończ
                    </Button>
                  </div>
                )}

                {reviewMode && (
                  <div
                    className="inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-900"
                    role="group"
                    aria-label="Filtr zadań w podglądzie"
                  >
                    {[
                      {
                        id: REVIEW_FILTER_ALL,
                        label: "Wszystkie",
                        count: reviewFilterCounts[REVIEW_FILTER_ALL],
                      },
                      {
                        id: REVIEW_FILTER_CORRECT,
                        label: "Dobrze",
                        count: reviewFilterCounts[REVIEW_FILTER_CORRECT],
                        icon: CheckCircle,
                      },
                      {
                        id: REVIEW_FILTER_PARTIAL,
                        label: "Częściowo",
                        count: reviewFilterCounts[REVIEW_FILTER_PARTIAL],
                        icon: CircleDot,
                      },
                      {
                        id: REVIEW_FILTER_WRONG,
                        label: "Źle",
                        count: reviewFilterCounts[REVIEW_FILTER_WRONG],
                        icon: XCircle,
                      },
                    ].map((option) => {
                      const Icon = option.icon;
                      const active = reviewFilter === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleReviewFilterChange(option.id)}
                          className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors ${
                            active
                              ? `${examTheme.button} text-white shadow-sm`
                              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                          }`}
                        >
                          {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
                          <span>{option.label}</span>
                          <span
                            className={`tabular-nums text-xs ${
                              active ? "text-white/80" : "text-slate-400 dark:text-slate-500"
                            }`}
                          >
                            {option.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div
                  className={`inline-flex h-11 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-900 ${
                    reviewMode ? "sm:ml-auto" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("single")}
                    className={`inline-flex h-full items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
                      viewMode === "single"
                        ? `${examTheme.button} text-white shadow-sm`
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    Po kolei
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`inline-flex h-full items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
                      viewMode === "list"
                        ? `${examTheme.button} text-white shadow-sm`
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    Lista
                  </button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {viewMode === "single" ? (
          <>
            {visibleQuestions.length === 0 ? (
              <Card className="mb-6 border border-dashed border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900">
                <CardContent className="px-6 py-12 text-center">
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    Brak zadań w tym filtrze
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Wybierz inny filtr albo wróć do „Wszystkie”.
                  </p>
                </CardContent>
              </Card>
            ) : (
              renderExamQuestion(currentQuestion)
            )}
            <div className="flex items-center justify-between gap-3">
              <Button
                onClick={handlePrevious}
                disabled={clampedQuestionIndex <= 0 || visibleQuestions.length === 0}
                className="bg-gray-200 hover:bg-gray-300 text-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Poprzednie
              </Button>

              {reviewMode ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    visibleQuestions.length === 0 ||
                    clampedQuestionIndex >= visibleQuestions.length - 1
                  }
                  className={`${examTheme.button} text-white disabled:opacity-50`}
                >
                  Następne
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  {canPauseOrFinish &&
                    clampedQuestionIndex < visibleQuestions.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSubmitClick}
                        className="border-slate-300 dark:border-slate-600"
                      >
                        Zakończ i sprawdź
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  {clampedQuestionIndex === visibleQuestions.length - 1 ? (
                    <Button
                      onClick={handleSubmitClick}
                      className={finishButtonClass}
                    >
                      Zakończ i sprawdź
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className={examTheme.button}
                    >
                      Następne
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {visibleQuestions.length === 0 ? (
              <Card className="mb-6 border border-dashed border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900">
                <CardContent className="px-6 py-12 text-center">
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    Brak zadań w tym filtrze
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Wybierz inny filtr albo wróć do „Wszystkie”.
                  </p>
                </CardContent>
              </Card>
            ) : (
              visibleQuestions.map((q) => renderExamQuestion(q))
            )}
            {!reviewMode && canPauseOrFinish && (
              <div className="flex justify-end">
                <Button onClick={handleSubmitClick} className={finishButtonClass}>
                  Zakończ i sprawdź
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}

        <AlertDialog open={saveAttemptDialogOpen} onOpenChange={setSaveAttemptDialogOpen}>
          <AlertDialogContent className={`${confirmDialogContentClass} max-w-md`}>
            <div className={`h-2 ${examTheme.dialogStrip}`} />
            <div className="space-y-5 p-6 sm:p-7">
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${examTheme.gradient} shadow-lg`}
                >
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <AlertDialogHeader className="space-y-2 text-center sm:text-center">
                  <AlertDialogTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {isRetrySession ? "Zakończyć powtórkę?" : "Zakończyć arkusz?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {isRetrySession
                      ? "Zobaczysz wynik samej powtórki. Nie zmienia on oceny ukończonego arkusza."
                      : "Zobaczysz podsumowanie z oceną odpowiedzi. Możesz też wrócić i dokończyć rozwiązywanie."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </motion.div>
              <AlertDialogFooter className="flex flex-col items-stretch gap-2.5 sm:flex-col sm:justify-center sm:space-x-0">
                <AlertDialogAction
                  onClick={finishWorksheet}
                  className={`mt-0 h-11 w-full border-0 text-base font-semibold text-white shadow-md hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${examTheme.button}`}
                >
                  {isRetrySession ? "Zakończ powtórkę" : "Zakończ i zobacz wynik"}
                </AlertDialogAction>
                <AlertDialogCancel
                  className={`${confirmDialogCancelClass} mt-0 h-11 w-full`}
                  onClick={handleCloseFinishDialog}
                >
                  {isRetrySession ? "Zostań w powtórce" : "Zostań w arkuszu"}
                </AlertDialogCancel>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        <PdfFloatingPanel
          open={answerKeyDialogOpen}
          onClose={() => setAnswerKeyDialogOpen(false)}
          title="Klucz CKE"
          titleSuffix={answerKeyPdfPage > 1 ? ` — str. ${answerKeyPdfPage}` : ""}
          iframeSrc={answerKeyIframeSrc}
          iframeKey={`answer-key-page-${answerKeyPdfPage}`}
          iframeTitle="Klucz odpowiedzi CKE"
          loading={answerKeyLoading}
          loadingLabel="Ładowanie klucza…"
          emptyMessage="Nie znaleziono klucza odpowiedzi dla tego arkusza."
          emptyHint="Plik powinien być w folderze odpCke w storage (jak przy pobieraniu z listy arkuszy)."
          headerClassName={examTheme.dialogStrip}
        />
      </div>
    </div>
  );
}
