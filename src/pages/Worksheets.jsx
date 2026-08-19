import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Calendar,
  Play,
  CheckCircle,
  KeyRound,
  Clock,
  X,
  ArrowLeft,
  History,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CycleFilter,
  FilterBar,
  FilterSearchField,
  PrettySelectFilter,
} from "@/components/ListFilters";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  useWorksheetProgress,
  isWorksheetCompleted,
  isWorksheetStarted,
} from "@/hooks/use-worksheet-progress";
import { publicSupabase } from "@/supabase-config.js";
import { useAuth } from "@/contexts/AuthContext";
import { answerKeyFilename } from "@/utils/worksheet-answer-key";
import {
  normalizeArkuszWorksheetId,
  parseArkuszWorksheetFilters,
} from "@/utils/worksheet-arkusz";
import {
  mapDbTaskRow,
  mapDbTaskToWorksheetQuestion,
  sortTasksByNr,
} from "@/utils/map-db-task";
import WorksheetHistoryTaskPreview, {
  WorksheetHistoryTaskPreviewReveal,
} from "@/components/WorksheetHistoryTaskPreview";

// Konfiguracja trzech źródeł arkuszy
const SOURCES = [
  {
    bucket: "podstawa",
    prefix: "egzaminy",
    answerKeyPrefix: "odpCke",
    level: "podstawowy",
  },
  {
    bucket: "rozszerzenie",
    prefix: "egzaminy",
    answerKeyPrefix: "odpCke",
    level: "rozszerzony",
  },
  {
    bucket: "osmaKlasa",
    prefix: "egzaminy",
    answerKeyPrefix: "odpCke",
    level: "ósmoklasisty",
  },
];

// Rekurencyjna funkcja pobierająca pdf-y z dowolnego bucketa
const listRecursive = async (bucket, prefix) => {
  const { data, error } = await publicSupabase.storage
    .from(bucket)
    .list(prefix, { limit: 100 });
  if (error) {
    console.error("List error", prefix, error);
    return [];
  }
  let pdfs = [];
  for (const obj of data) {
    if (!obj.name.includes(".")) {
      // katalog - schodzimy głębiej
      const deeper = await listRecursive(bucket, `${prefix}/${obj.name}`);
      pdfs = pdfs.concat(deeper);
    } else if (obj.name.toLowerCase().endsWith(".pdf")) {
      pdfs.push({ ...obj, fullPath: `${prefix}/${obj.name}` });
    }
  }
  return pdfs;
};

const levelTheme = {
  podstawowy: {
    label: "Matura podstawowa",
    gradient: "from-blue-400 to-blue-600",
    badge: "border-blue-500 text-blue-700 dark:text-blue-400",
    btn: "bg-blue-600 hover:bg-blue-700",
    outline:
      "text-blue-700 dark:text-blue-200 border-blue-300 dark:border-blue-500",
    soft: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-300",
  },
  rozszerzony: {
    label: "Matura rozszerzona",
    gradient: "from-purple-400 to-purple-600",
    badge: "border-purple-500 text-purple-700 dark:text-purple-400",
    btn: "bg-purple-600 hover:bg-purple-700",
    outline:
      "text-purple-700 dark:text-purple-200 border-purple-300 dark:border-purple-500",
    soft: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-700 dark:text-purple-300",
  },
  ósmoklasisty: {
    label: "Egzamin ósmoklasisty",
    gradient: "from-green-400 to-green-600",
    badge: "border-green-500 text-green-700 dark:text-green-400",
    btn: "bg-green-600 hover:bg-green-700",
    outline:
      "text-green-700 dark:text-green-200 border-green-300 dark:border-green-500",
    soft: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-300",
  },
};

const monthOrder = {
  styczen: 1,
  styczeń: 1,
  luty: 2,
  marzec: 3,
  kwiecien: 4,
  kwiecień: 4,
  maj: 5,
  czerwiec: 6,
  lipiec: 7,
  sierpien: 8,
  sierpień: 8,
  wrzesien: 9,
  wrzesień: 9,
  pazdziernik: 10,
  październik: 10,
  listopad: 11,
  grudzien: 12,
  grudzień: 12,
};

const cleanFilePart = (value) => {
  if (!value) return "";
  return value
    .replace(/\.[^/.]+$/, "")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const formatFilePart = (value) => {
  const cleaned = cleanFilePart(value);
  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const getFormulaYear = (value) => {
  const match = cleanFilePart(value).match(/\d{4}/);
  return match ? Number(match[0]) : 0;
};

const normalizeLevel = (value, fallbackLevel) => {
  const cleaned = cleanFilePart(value).toLowerCase();
  if (["pp", "podstawa", "podstawowy", "matura podstawowa"].includes(cleaned))
    return "podstawowy";
  if (
    ["pr", "rozszerzenie", "rozszerzony", "matura rozszerzona"].includes(
      cleaned,
    )
  )
    return "rozszerzony";
  if (
    [
      "null",
      "brak",
      "osma klasa",
      "ósma klasa",
      "osmaklasa",
      "ósmoklasisty",
      "egzamin ósmoklasisty",
    ].includes(cleaned)
  )
    return "ósmoklasisty";
  return cleaned || fallbackLevel;
};

const parseWorksheetFilename = (filename, fallbackLevel) => {
  const name = filename.replace(/\.[^/.]+$/, "");
  const [
    year = "",
    month = "",
    formula = "",
    level = fallbackLevel,
    ...typeParts
  ] = name.split("-");
  const type = typeParts.join("-");
  const parsedLevel = normalizeLevel(level, fallbackLevel);
  return {
    displayTitle: `Arkusz ${formatFilePart(month)} ${cleanFilePart(year)}`
      .replace(/\s+/g, " ")
      .trim(),
    year: cleanFilePart(year),
    month: formatFilePart(month),
    formula: formatFilePart(formula),
    formulaYear: getFormulaYear(formula),
    level: parsedLevel,
    type: formatFilePart(type),
    monthIndex: monthOrder[cleanFilePart(month).toLowerCase()] || 0,
  };
};

const INITIAL_SKELETON_COUNT = 6;

const getResultColor = (percent) => {
  if (percent >= 80) return "text-blue-600";
  if (percent >= 60) return "text-blue-500";
  if (percent >= 40) return "text-sky-600 dark:text-sky-400";
  return "text-rose-600 dark:text-rose-400";
};

const formatPointValue = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return number.toLocaleString("pl-PL", { maximumFractionDigits: 1 });
};

const getAttemptPercent = (attempt) =>
  Number.isFinite(Number(attempt?.score)) && Number(attempt?.total) > 0
    ? Math.round((Number(attempt.score) / Number(attempt.total)) * 100)
    : 0;

const compareQuestionNumbers = (a, b) =>
  String(a ?? "").localeCompare(String(b ?? ""), "pl", { numeric: true });

const getAttemptScoreRows = (attempt) => {
  const rows = Array.isArray(attempt?.questionScoreRows)
    ? attempt.questionScoreRows.map((row, index) => ({
        questionId: row.questionId,
        number: row.number ?? index + 1,
        earned: row.graded ? row.earned : null,
        max: row.max ?? 0,
        graded: Boolean(row.graded),
        correct: row.correct ?? null,
      }))
    : Object.entries(attempt?.questionScores ?? {}).map(
        ([questionId, entry], index) => ({
          questionId,
          number: entry?.number ?? index + 1,
          earned: entry?.graded ? entry.earned : null,
          max: entry?.max ?? 0,
          graded: Boolean(entry?.graded),
          correct: entry?.correct ?? null,
        }),
      );

  return [...rows].sort((a, b) => compareQuestionNumbers(a.number, b.number));
};

const formatHistoryTaskScore = (row) => {
  if (!row?.graded) return "nie ocenione";
  return `${formatPointValue(row.earned)}/${formatPointValue(row.max)} pkt`;
};

const getWorksheetAttemptHistory = (attempt) => {
  if (!attempt) return [];
  const history = Array.isArray(attempt.attemptHistory)
    ? attempt.attemptHistory.filter(Boolean)
    : [];
  if (history.length) return history;
  if (attempt.previousCompleted) return [attempt.previousCompleted];
  return isWorksheetCompleted(attempt) ? [attempt] : [];
};

const skeletonClass = "bg-slate-200 dark:bg-slate-700";

function WorksheetCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border-0 bg-white shadow-none dark:bg-slate-800">
      <Skeleton className={`h-1.5 w-full rounded-none ${skeletonClass}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className={`h-6 w-[78%] ${skeletonClass}`} />
            <div className="mt-0 flex items-center gap-2">
              <Skeleton
                className={`h-4 w-4 shrink-0 rounded-full ${skeletonClass}`}
              />
              <Skeleton className={`h-4 w-32 ${skeletonClass}`} />
            </div>
          </div>
          <Skeleton
            className={`h-7 w-[7.5rem] shrink-0 rounded-full ${skeletonClass}`}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Skeleton className={`h-7 w-28 rounded-full ${skeletonClass}`} />
          <Skeleton className={`h-7 w-20 rounded-full ${skeletonClass}`} />
        </div>
        <div className="min-h-6">
          <Skeleton className={`h-4 w-[11rem] ${skeletonClass}`} />
        </div>
        <div className="flex gap-2">
          <Skeleton className={`h-10 flex-1 rounded-md ${skeletonClass}`} />
          <Skeleton
            className={`h-10 w-10 shrink-0 rounded-md ${skeletonClass}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function WorksheetCard({
  worksheet,
  theme,
  formulaClass,
  resultColor,
  percent,
  attempt,
  started,
  navigate,
  onEndStarted,
}) {
  const [abandonDialogOpen, setAbandonDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyTasksById, setHistoryTasksById] = useState({});
  const [historyTasksLoading, setHistoryTasksLoading] = useState(false);
  const [hoveredHistoryRowKey, setHoveredHistoryRowKey] = useState(null);
  const worksheetUrl = `${createPageUrl("WorksheetDetails")}?id=${worksheet.id}`;
  const attemptHistory = getWorksheetAttemptHistory(attempt);

  useEffect(() => {
    if (!historyDialogOpen || !worksheet?.id) {
      return undefined;
    }

    let cancelled = false;
    setHistoryTasksLoading(true);

    (async () => {
      const { data, error } = await publicSupabase
        .from("tasks")
        .select("*")
        .eq("arkusz", worksheet.id)
        .order("nr", { ascending: true, nullsFirst: false });

      if (cancelled) return;

      if (error) {
        console.error("[Worksheets] history tasks", error);
        setHistoryTasksById({});
        setHistoryTasksLoading(false);
        return;
      }

      const mapped = {};
      sortTasksByNr((data || []).map(mapDbTaskRow)).forEach((task, index) => {
        const question = mapDbTaskToWorksheetQuestion(
          task,
          worksheet.id,
          index + 1,
        );
        if (question?.id) {
          mapped[String(question.id)] = question;
        }
      });

      setHistoryTasksById(mapped);
      setHistoryTasksLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [historyDialogOpen, worksheet?.id]);

  const openWorksheet = () => {
    navigate(worksheetUrl, { state: { from: "worksheets" } });
  };

  const handleConfirmAbandon = () => {
    onEndStarted(worksheet.id);
    setAbandonDialogOpen(false);
  };

  return (
    <Card className="group relative h-full overflow-hidden border-0 bg-white transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
      <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg leading-tight text-slate-900 dark:text-white">
              {worksheet.displayTitle || worksheet.title}
            </CardTitle>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
              <Calendar className={`w-4 h-4 ${theme.text}`} />
              <span>{worksheet.month || "Brak miesiąca"}</span>
              <span>•</span>
              <span>{worksheet.year || "Brak roku"}</span>
            </div>
          </div>
          <Badge variant="outline" className={`${theme.badge} shrink-0`}>
            {theme.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${formulaClass}`}
          >
            Formuła {worksheet.formula || "brak"}
          </span>
          <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
            {worksheet.type || "Arkusz"}
          </span>
        </div>
        <div className="min-h-6">
          {started ? (
            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="font-medium">
                Rozpoczęty
                {attempt?.questionCount
                  ? ` • ${attempt.answeredCount ?? 0}/${attempt.questionCount} odpowiedzi`
                  : ""}
                {attempt?.updatedAt
                  ? ` • ${new Date(attempt.updatedAt).toLocaleDateString("pl-PL")}`
                  : ""}
              </span>
            </div>
          ) : attempt ? (
            <div className={`flex items-center gap-2 text-sm ${resultColor}`}>
              <CheckCircle className={`h-4 w-4 ${resultColor}`} />
              <span className="font-medium">
                Ostatni wynik: {percent}% •{" "}
                {new Date(attempt.date).toLocaleDateString("pl-PL")}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex flex-nowrap items-stretch gap-2">
          {started ? (
            <div className="flex min-w-0 flex-1 gap-2">
              <Button
                className={`h-10 min-h-10 flex-1 gap-1 px-2 text-sm ${theme.btn}`}
                disabled={!worksheet.taskCount}
                onClick={openWorksheet}
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                Wróć
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-10 min-h-10 flex-1 gap-1 px-2 text-sm bg-white hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 ${theme.outline}`}
                onClick={() => setAbandonDialogOpen(true)}
              >
                <X className="h-4 w-4 shrink-0" />
                Porzuć
              </Button>
            </div>
          ) : (
            <Button
              className={`h-10 min-h-10 flex-1 ${theme.btn}`}
              disabled={!worksheet.taskCount}
              onClick={openWorksheet}
            >
              <Play className="h-4 w-4" />
              Rozpocznij
            </Button>
          )}
          {attemptHistory.length > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              title="Pokaż historię arkusza"
              aria-label="Pokaż historię arkusza"
              onClick={() => setHistoryDialogOpen(true)}
              className={`h-10 w-10 shrink-0 bg-white hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 ${theme.outline}`}
            >
              <History className="w-4 h-4" />
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!worksheet.file_url}
            title={
              worksheet.file_url
                ? "Pobierz arkusz egzaminacyjny (PDF)"
                : "Brak pliku PDF tego arkusza w magazynie Supabase"
            }
            aria-label="Pobierz arkusz egzaminacyjny"
            onClick={() =>
              worksheet.file_url && window.open(worksheet.file_url, "_blank")
            }
            className={`h-10 w-10 shrink-0 bg-white hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 ${theme.outline}`}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!worksheet.answer_key_url}
            title={
              worksheet.answer_key_url
                ? "Pobierz klucz odpowiedzi – zasady oceniania (PDF)"
                : "Brak klucza odpowiedzi (PDF) w magazynie Supabase"
            }
            aria-label="Pobierz klucz odpowiedzi"
            onClick={() =>
              worksheet.answer_key_url &&
              window.open(worksheet.answer_key_url, "_blank")
            }
            className={`h-10 w-10 shrink-0 bg-white hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 ${theme.outline}`}
          >
            <KeyRound className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={abandonDialogOpen} onOpenChange={setAbandonDialogOpen}>
        <AlertDialogContent className="overflow-hidden border-slate-200 p-0 dark:border-slate-700">
          <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />
          <div className="space-y-5 p-6">
            <AlertDialogHeader className="space-y-2 text-left sm:text-left">
              <AlertDialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                Porzucić arkusz?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Bieżąca sesja zostanie odrzucona — niesprawdzone odpowiedzi z tego podejścia
                przepadną.
                {attempt?.previousCompleted
                  ? " Przywrócimy poprzedni ukończony wynik tego arkusza."
                  : " Tej operacji nie można cofnąć."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
              <AlertDialogCancel className="mt-0 w-full sm:w-full">
                Anuluj
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmAbandon}
                className={`w-full border-0 text-white sm:w-full ${theme.btn}`}
              >
                Porzuć arkusz
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={historyDialogOpen}
        onOpenChange={(open) => {
          setHistoryDialogOpen(open);
          if (!open) setHoveredHistoryRowKey(null);
        }}
      >
        <DialogContent className="max-w-3xl overflow-hidden border-slate-200 bg-white p-0 dark:border-slate-700 dark:bg-slate-900 [&>button]:right-5 [&>button]:top-5">
          <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />
          <div className="space-y-5 p-6 pt-5">
            <DialogHeader className="space-y-2 pr-8 text-left sm:text-left">
              <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                Historia arkusza
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {worksheet.displayTitle || worksheet.title}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
              {[...attemptHistory].reverse().map((historyAttempt, historyIndex) => {
                const rows = getAttemptScoreRows(historyAttempt);
                const gradedCount = rows.filter((row) => row.graded).length;
                const attemptPercent = getAttemptPercent(historyAttempt);
                const worksheetTaskCount = Number(worksheet.taskCount) || 0;
                const taskCountLabel =
                  worksheetTaskCount > 0 && worksheetTaskCount !== rows.length
                    ? `${rows.length} z ${worksheetTaskCount} zadań arkusza`
                    : `${rows.length} ${rows.length === 1 ? "zadanie" : "zadań"}`;
                return (
                  <div
                    key={`${historyAttempt.date || historyAttempt.updatedAt || historyIndex}-${historyIndex}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Podejście {attemptHistory.length - historyIndex}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {historyAttempt.date
                            ? new Date(historyAttempt.date).toLocaleString("pl-PL")
                            : "Brak daty"}
                        </p>
                        {rows.length > 0 ? (
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {taskCountLabel}
                            {gradedCount !== rows.length
                              ? ` • oceniono ${gradedCount}`
                              : ""}
                          </p>
                        ) : null}
                      </div>
                      <div className="text-left sm:text-right">
                        <p className={`text-lg font-bold ${getResultColor(attemptPercent)}`}>
                          {attemptPercent}%
                        </p>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          {formatPointValue(historyAttempt.score)}/
                          {formatPointValue(historyAttempt.total)} pkt
                        </p>
                      </div>
                    </div>
                    {rows.length > 0 ? (
                      <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:items-start">
                        {rows.map((row, rowIndex) => {
                          const rowKey = `${historyIndex}-${row.questionId || row.number || rowIndex}-${rowIndex}`;
                          const question =
                            historyTasksById[String(row.questionId)] || null;
                          const isOpen = hoveredHistoryRowKey === rowKey;
                          return (
                            <div
                              key={rowKey}
                              className={`relative min-w-0 ${isOpen ? "z-40" : "z-0"}`}
                              onMouseEnter={() => setHoveredHistoryRowKey(rowKey)}
                              onMouseLeave={() =>
                                setHoveredHistoryRowKey((current) =>
                                  current === rowKey ? null : current,
                                )
                              }
                            >
                              <div
                                className={`flex w-full cursor-default items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                                  isOpen
                                    ? "border-slate-300 bg-white dark:border-slate-500 dark:bg-slate-900"
                                    : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-slate-500 dark:hover:bg-slate-900"
                                }`}
                              >
                                <span className="min-w-0 truncate font-medium text-slate-700 dark:text-slate-200">
                                  Zadanie {row.number ?? rowIndex + 1}
                                </span>
                                <span
                                  className={`shrink-0 font-semibold ${
                                    row.graded
                                      ? "text-slate-900 dark:text-white"
                                      : "text-slate-500 dark:text-slate-400"
                                  }`}
                                >
                                  {formatHistoryTaskScore(row)}
                                </span>
                              </div>
                              <WorksheetHistoryTaskPreviewReveal open={isOpen}>
                                <WorksheetHistoryTaskPreview
                                  question={question}
                                  answersMap={historyAttempt.answers || {}}
                                  level={worksheet.level}
                                  loading={historyTasksLoading}
                                />
                              </WorksheetHistoryTaskPreviewReveal>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                        Brak szczegółowej punktacji zadań dla tego podejścia.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => setHistoryDialogOpen(false)}
                className={`border-0 text-white ${theme.btn}`}
              >
                Zamknij
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function WorksheetGridTile({
  worksheet,
  theme,
  formulaClass,
  resultColor,
  percent,
  attempt,
  started,
  navigate,
  onEndStarted,
}) {
  if (!worksheet) {
    return <WorksheetCardSkeleton />;
  }

  return (
    <WorksheetCard
      worksheet={worksheet}
      theme={theme}
      formulaClass={formulaClass}
      resultColor={resultColor}
      percent={percent}
      attempt={attempt}
      started={started}
      navigate={navigate}
      onEndStarted={onEndStarted}
    />
  );
}

const sortWorksheets = (items) =>
  [...items].sort((a, b) => {
    const formulaDiff = (b.formulaYear || 0) - (a.formulaYear || 0);
    if (formulaDiff) return formulaDiff;
    const yearDiff = Number(b.year || 0) - Number(a.year || 0);
    if (yearDiff) return yearDiff;
    const monthDiff = (b.monthIndex || 0) - (a.monthIndex || 0);
    if (monthDiff) return monthDiff;
    return a.title.localeCompare(b.title);
  });

async function loadWorksheetsFromSupabase() {
  const { data: taskRows, error: tasksError } = await publicSupabase
    .from("tasks")
    .select("arkusz")
    .not("arkusz", "is", null);

  if (tasksError) {
    throw new Error(tasksError.message);
  }

  const taskCountByArkusz = {};
  for (const row of taskRows ?? []) {
    const key = String(row.arkusz ?? "").trim();
    if (key) {
      taskCountByArkusz[key] = (taskCountByArkusz[key] || 0) + 1;
    }
  }

  const all = [];

  await Promise.all(
    SOURCES.map(async (src) => {
      const answerKeyPathByFilename = new Map();
      if (src.answerKeyPrefix) {
        const keyObjects = await listRecursive(
          src.bucket,
          src.answerKeyPrefix,
        );
        for (const keyObj of keyObjects) {
          answerKeyPathByFilename.set(keyObj.name, keyObj.fullPath);
        }
      }

      const pdfObjects = await listRecursive(src.bucket, src.prefix);
      for (const obj of pdfObjects) {
        const filename = obj.name;
        const arkuszId = filename.replace(/\.[^/.]+$/, "");
        const parsed = parseWorksheetFilename(filename, src.level);
        const { data: urlData } = publicSupabase.storage
          .from(src.bucket)
          .getPublicUrl(obj.fullPath);

        const keyFilename = answerKeyFilename(filename);
        const keyPath = answerKeyPathByFilename.get(keyFilename);
        const answer_key_url = keyPath
          ? publicSupabase.storage.from(src.bucket).getPublicUrl(keyPath).data
              .publicUrl
          : null;

        all.push({
          id: arkuszId,
          arkuszId,
          title: filename,
          displayTitle: parsed.displayTitle,
          year: parsed.year,
          month: parsed.month,
          formula: parsed.formula,
          formulaYear: parsed.formulaYear,
          level: parsed.level,
          type: parsed.type,
          monthIndex: parsed.monthIndex,
          file_url: urlData.publicUrl,
          answer_key_url,
          taskCount: taskCountByArkusz[arkuszId] ?? 0,
        });
      }
    }),
  );

  return sortWorksheets(all);
}

export default function WorksheetsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userLevel } = useAuth();
  const { getAttempt, restorePreviousCompleted } = useWorksheetProgress();

  const arkuszFilterId = normalizeArkuszWorksheetId(searchParams.get("arkusz"));

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [worksheets, setWorksheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [progressTick, setProgressTick] = useState(0);

  const levelMap = {
    osma_klasa: "ósmoklasisty",
    matura_podstawowa: "podstawowy",
    matura_rozszerzona: "rozszerzony",
  };

  const goalNames = {
    osma_klasa: "Ósma klasa",
    matura_podstawowa: "Matura podstawowa",
    matura_rozszerzona: "Matura rozszerzona",
  };

  const profileLevel =
    userLevel && userLevel !== "brak" ? levelMap[userLevel] : null;

  useEffect(() => {
    if (arkuszFilterId) {
      const meta = parseArkuszWorksheetFilters(arkuszFilterId);
      if (meta?.year) {
        setSelectedYear(meta.year);
      }
      if (meta?.level) {
        setSelectedLevel(meta.level);
      }
      if (meta?.searchLabel) {
        setSearchQuery(meta.searchLabel);
      }
      return;
    }
    setSelectedYear("all");
    setSearchQuery("");
    setSelectedLevel(profileLevel || "all");
  }, [profileLevel, arkuszFilterId]);

  const reloadWorksheets = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    const rawUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();
    if (!rawUrl || rawUrl.startsWith("{")) {
      setFetchError(
        "Brak poprawnego VITE_SUPABASE_URL w .env (np. https://twoj-ref.supabase.co). Zrestartuj npm run dev po zapisaniu .env.",
      );
      setWorksheets([]);
      setLoading(false);
      return;
    }

    try {
      const all = await loadWorksheetsFromSupabase();
      setWorksheets(all);
    } catch (err) {
      console.error("[Worksheets] fetch", err);
      setFetchError(err?.message ?? "Nie udało się załadować arkuszy");
      setWorksheets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadWorksheets();
  }, [reloadWorksheets]);

  const filteredWorksheets = useMemo(() => {
    if (arkuszFilterId) {
      const match = worksheets.filter(
        (worksheet) =>
          normalizeArkuszWorksheetId(worksheet.id) === arkuszFilterId ||
          normalizeArkuszWorksheetId(worksheet.arkuszId) === arkuszFilterId,
      );
      if (match.length > 0) return match;
    }

    const q = searchQuery.trim().toLowerCase();
    return worksheets.filter((worksheet) => {
      if (q) {
        const searchable = [
          worksheet.title,
          worksheet.displayTitle,
          worksheet.year,
          worksheet.month,
          worksheet.formula,
          worksheet.formulaYear,
          worksheet.level,
          levelTheme[worksheet.level]?.label,
          worksheet.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      if (
        selectedYear !== "all" &&
        String(worksheet.year ?? "") !== selectedYear
      ) {
        return false;
      }
      if (
        selectedLevel !== "all" &&
        worksheet.level !== selectedLevel
      ) {
        return false;
      }
      return true;
    });
  }, [worksheets, searchQuery, selectedYear, selectedLevel, arkuszFilterId]);

  const years = useMemo(
    () => [
      "all",
      ...[...new Set(worksheets.map((w) => w.year).filter(Boolean))].sort(
        (a, b) => Number(b) - Number(a),
      ),
    ],
    [worksheets],
  );

  const yearOptions = useMemo(
    () => [
      { value: "all", label: "Wszystkie lata" },
      ...years
        .filter((year) => year !== "all")
        .map((year) => ({ value: year.toString(), label: year.toString() })),
    ],
    [years],
  );

  const levelOptions = [
    { value: "all", label: "Wszystkie poziomy" },
    { value: "podstawowy", label: "Matura podstawowa" },
    { value: "rozszerzony", label: "Matura rozszerzona" },
    { value: "ósmoklasisty", label: "Egzamin ósmoklasisty" },
  ];

  const isDark = document.documentElement.classList.contains("dark");

  const handleEndStartedWorksheet = (worksheetId) => {
    restorePreviousCompleted(worksheetId);
    setProgressTick((t) => t + 1);
  };

  const showSkeletons = loading && worksheets.length === 0;
  const showEmpty =
    !loading && filteredWorksheets.length === 0;

  return (
    <div
      className="py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Arkusze egzaminacyjne
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-300">
            {profileLevel ? (
              <>
                Domyślny filtr:{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {goalNames[userLevel]}
                </span>
                {" · "}
              </>
            ) : null}
            {loading ? (
              <>Ładowanie arkuszy…</>
            ) : (
              <>
                W bazie: {worksheets.length} arkuszy
                {filteredWorksheets.length !== worksheets.length
                  ? ` · widocznych: ${filteredWorksheets.length}`
                  : ""}
              </>
            )}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 dark:bg-slate-800 border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <FilterBar
              columnsClassName="grid-cols-2"
              search={
                <FilterSearchField
                  placeholder="Szukaj arkuszy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                />
              }
            >
              <PrettySelectFilter
                label="Rok"
                value={selectedYear}
                options={yearOptions}
                onChange={setSelectedYear}
                disabled={loading}
              />
              <CycleFilter
                label="Poziom"
                value={selectedLevel}
                options={levelOptions}
                onChange={setSelectedLevel}
                disabled={loading}
              />
            </FilterBar>
          </CardContent>
        </Card>

        {fetchError && (
          <Card className="mb-6 border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-rose-800 dark:text-rose-200">
                {fetchError}
              </p>
              <Button
                type="button"
                variant="outline"
                className="shrink-0 border-rose-300 dark:border-rose-800"
                onClick={reloadWorksheets}
              >
                Spróbuj ponownie
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results Count */}
        <div className="mb-6 text-gray-600 dark:text-slate-300">
          {loading ? (
            <>Pobieram arkusze...</>
          ) : (
            <>
              Znaleziono{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {filteredWorksheets.length}
              </span>{" "}
              arkuszy
            </>
          )}
        </div>

        {/* Worksheets Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {showSkeletons
            ? Array.from({ length: INITIAL_SKELETON_COUNT }).map((_, idx) => (
                <WorksheetGridTile key={`worksheet-skeleton-${idx}`} />
              ))
            : filteredWorksheets.map((worksheet) => {
                const theme =
                  levelTheme[worksheet.level] || levelTheme.podstawowy;
                const isMaturaFormula2015 =
                  worksheet.level !== "ósmoklasisty" &&
                  worksheet.formulaYear === 2015;
                const formulaClass = isMaturaFormula2015
                  ? "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-600 dark:bg-blue-950/40 dark:text-blue-200"
                  : "border-gray-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
                const attempt = getAttempt(worksheet.id);
                const started = isWorksheetStarted(attempt);
                const completed = isWorksheetCompleted(attempt);
                const percent =
                  completed && attempt?.total
                    ? Math.round((attempt.score / attempt.total) * 100)
                    : 0;
                const resultColor = getResultColor(percent);

                return (
                  <WorksheetGridTile
                    key={`${worksheet.id}-${progressTick}`}
                    worksheet={worksheet}
                    theme={theme}
                    formulaClass={formulaClass}
                    resultColor={resultColor}
                    percent={percent}
                    attempt={completed || started ? attempt : null}
                    started={started}
                    navigate={navigate}
                    onEndStarted={handleEndStartedWorksheet}
                  />
                );
              })}
        </div>

        {showEmpty && (
          <Card className="dark:bg-slate-800 bg-white">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Brak wyników
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                {fetchError
                  ? fetchError
                  : worksheets.length === 0
                    ? "Nie udało się pobrać arkuszy z bazy. Sprawdź połączenie z Supabase."
                    : "Spróbuj zmienić kryteria wyszukiwania lub wybierz „Wszystkie poziomy”."}
              </p>
              {!fetchError && worksheets.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedYear("all");
                    setSelectedLevel("all");
                  }}
                >
                  Wyczyść filtry
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
