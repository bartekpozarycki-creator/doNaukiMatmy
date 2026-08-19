import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Layers,
  Play,
  RotateCw,
  Shuffle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskQuestionBody from "@/components/TaskQuestionBody";
import MathText from "@/components/MathText";
import {
  CycleFilter,
  FilterBar,
  PrettySelectFilter,
} from "@/components/ListFilters";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import {
  filterReviewSessionItems,
  REVIEW_SCOPE_OPTIONS,
} from "@/utils/review-random";
import { statusToPriority } from "@/utils/review-schedule";
import { cn } from "@/lib/utils";

function shuffleItems(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function orderDeck(items, scope) {
  if (scope === "hardest") {
    return [...items].sort(
      (a, b) =>
        statusToPriority(b.reviewStatus) - statusToPriority(a.reviewStatus),
    );
  }
  if (scope === "random") {
    return shuffleItems(
      [...items].sort(
        (a, b) =>
          statusToPriority(b.reviewStatus) - statusToPriority(a.reviewStatus),
      ),
    );
  }
  return shuffleItems(items);
}

function formatFlashcardAnswer(raw) {
  const text = String(raw ?? "").trim();
  if (!text) return "";

  const withoutLabel = text.replace(
    /^\(?[A-Da-d]\)?[.)]\s+/,
    "",
  ).trim();

  return withoutLabel || text;
}

export default function ReviewFlashcards({
  items,
  loading,
  enforcedLevel = null,
}) {
  const { recordAttempt } = useTaskProgress();
  const [scope, setScope] = useState("random");
  const [topic, setTopic] = useState("all");
  const [subtopic, setSubtopic] = useState("all");
  const [level, setLevel] = useState(enforcedLevel || "all");
  const [deck, setDeck] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    if (enforcedLevel) setLevel(enforcedLevel);
  }, [enforcedLevel]);

  useEffect(() => {
    setSubtopic("all");
  }, [topic]);

  const topics = useMemo(
    () => [
      "all",
      ...[...new Set(items.map((item) => item.task.topic).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b, "pl"),
      ),
    ],
    [items],
  );

  const subtopics = useMemo(() => {
    const values = items
      .filter((item) => topic === "all" || item.task.topic === topic)
      .map((item) => item.task.subtopic)
      .filter(Boolean);
    return ["all", ...[...new Set(values)].sort((a, b) => a.localeCompare(b, "pl"))];
  }, [items, topic]);

  const levels = useMemo(
    () => [
      "all",
      ...[...new Set(items.map((item) => item.task.level).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b, "pl"),
      ),
    ],
    [items],
  );

  const topicOptions = useMemo(
    () =>
      topics.map((value) => ({
        value,
        label: value === "all" ? "Wszystkie tematy" : value,
      })),
    [topics],
  );

  const subtopicOptions = useMemo(
    () =>
      subtopics.map((value) => ({
        value,
        label: value === "all" ? "Wszystkie podtematy" : value,
      })),
    [subtopics],
  );

  const levelOptions = useMemo(
    () =>
      levels.map((value) => ({
        value,
        label: value === "all" ? "Wszystkie poziomy" : value,
      })),
    [levels],
  );

  const scopeOptions = useMemo(
    () =>
      REVIEW_SCOPE_OPTIONS.map((option) => ({
        value: option.id,
        label: option.label,
      })),
    [],
  );

  const effectiveLevel = enforcedLevel || level;

  const filteredItems = useMemo(
    () =>
      filterReviewSessionItems(items, {
        scope,
        topic,
        subtopic,
        level: effectiveLevel,
      }),
    [items, scope, topic, subtopic, effectiveLevel],
  );

  useEffect(() => {
    setDeck(orderDeck(filteredItems, scope));
    setCardIndex(0);
    setIsFlipped(false);
    setVideoOpen(false);
  }, [filteredItems, scope]);

  const currentItem = deck[cardIndex] ?? null;
  const currentTask = currentItem?.task ?? null;
  const videoUrl = currentTask?.videoUrl?.trim() || null;

  const handlePrevious = () => {
    if (!deck.length) return;
    setIsFlipped(false);
    setVideoOpen(false);
    setCardIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleNext = () => {
    if (!deck.length) return;
    setIsFlipped(false);
    setVideoOpen(false);
    setCardIndex((prev) => (prev + 1) % deck.length);
  };

  const handleShuffle = () => {
    if (!filteredItems.length) return;
    setDeck(orderDeck(filteredItems, "random"));
    setCardIndex(0);
    setIsFlipped(false);
    setVideoOpen(false);
  };

  const handleGrade = (isCorrect) => {
    if (!currentTask?.id) return;
    recordAttempt(currentTask.id, isCorrect, {
      baseDifficulty: currentTask.szacowanaTrudnosc ?? null,
    });
    handleNext();
  };

  return (
    <div className="space-y-4">
      <FilterBar columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <CycleFilter
          label="Zakres"
          value={scope}
          options={scopeOptions}
          onChange={setScope}
        />
        <PrettySelectFilter
          label="Temat"
          value={topic}
          options={topicOptions}
          onChange={setTopic}
        />
        <PrettySelectFilter
          label="Podtemat"
          value={subtopic}
          options={subtopicOptions}
          onChange={setSubtopic}
        />
        <PrettySelectFilter
          label="Poziom"
          value={effectiveLevel}
          options={levelOptions}
          onChange={setLevel}
          disabled={Boolean(enforcedLevel)}
        />
      </FilterBar>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {filteredItems.length} zadań w puli
        {deck.length ? ` · fiszka ${cardIndex + 1} z ${deck.length}` : ""}
      </p>

      {loading ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">Ładowanie fiszek…</p>
        </div>
      ) : !deck.length ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 px-6 text-center dark:border-slate-700">
          <Layers className="h-8 w-8 text-slate-400 dark:text-slate-500" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Brak zadań dla wybranych filtrów
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Zmień zakres lub rozwiąż więcej zadań w zbiorach.
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentTask?.id}-${isFlipped ? "back" : "front"}`}
                  role="button"
                  tabIndex={0}
                  initial={{ opacity: 0, rotateY: isFlipped ? -12 : 12, y: 6 }}
                  animate={{ opacity: 1, rotateY: 0, y: 0 }}
                  exit={{ opacity: 0, rotateY: isFlipped ? 12 : -12, y: -6 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  onClick={() => setIsFlipped((flipped) => !flipped)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setIsFlipped((flipped) => !flipped);
                    }
                  }}
                  aria-label={isFlipped ? "Pokaż pytanie" : "Pokaż odpowiedź"}
                  className={cn(
                    "flex min-h-[220px] cursor-pointer flex-col rounded-xl border p-5 text-left sm:min-h-[260px] sm:p-6",
                    isFlipped
                      ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                      : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/90",
                  )}
                >
                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <p className="min-w-0 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {isFlipped ? "Odpowiedź" : "Pytanie"}
                        {currentTask?.topic ? ` · ${currentTask.topic}` : ""}
                      </p>
                      {isFlipped ? (
                        <p className="shrink-0 text-right text-[11px] text-slate-500 dark:text-slate-400">
                          Kliknij, aby odwrócić
                        </p>
                      ) : null}
                    </div>
                    {isFlipped ? (
                      currentTask?.answer ? (
                        <div className="flex flex-1 items-center justify-center px-2 py-4 text-center text-xl font-semibold leading-snug text-slate-900 dark:text-slate-100 sm:text-2xl">
                          <MathText text={formatFlashcardAnswer(currentTask.answer)} />
                        </div>
                      ) : (
                        <p className="flex flex-1 items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
                          Brak zapisanej odpowiedzi w bazie.
                        </p>
                      )
                    ) : (
                      <TaskQuestionBody
                        task={currentTask}
                        compact
                        tile
                        className="[&_.math-text-ui]:text-base [&_.math-text-ui]:leading-relaxed"
                      />
                    )}
                  </div>

                  <div
                    className="mt-auto pt-4"
                    onClick={
                      isFlipped
                        ? (event) => event.stopPropagation()
                        : undefined
                    }
                    onKeyDown={
                      isFlipped
                        ? (event) => event.stopPropagation()
                        : undefined
                    }
                  >
                    {isFlipped ? (
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleGrade(true)}
                          className="h-9 bg-emerald-600 px-1.5 text-xs text-white hover:bg-emerald-700 sm:px-2 sm:text-sm"
                        >
                          <Check className="mr-1 h-3.5 w-3.5 shrink-0" />
                          Umiem
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleGrade(false)}
                          className="h-9 border-rose-200 px-1.5 text-xs text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40 sm:px-2 sm:text-sm"
                        >
                          <X className="mr-1 h-3.5 w-3.5 shrink-0" />
                          Nie umiem
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={!videoUrl}
                          onClick={() => setVideoOpen(true)}
                          className="h-9 px-1.5 text-xs dark:border-slate-600 sm:px-2 sm:text-sm"
                          title={
                            videoUrl
                              ? "Otwórz wytłumaczenie wideo"
                              : "Brak wideo dla tego zadania"
                          }
                        >
                          <Play className="mr-1 h-3.5 w-3.5 shrink-0" />
                          Wideo
                        </Button>
                      </div>
                    ) : (
                      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                        Kliknij kartę, aby odwrócić
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handlePrevious}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Poprzednia
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleShuffle}>
              <Shuffle className="mr-1.5 h-4 w-4" />
              Potasuj
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFlipped((v) => !v)}
            >
              <RotateCw className="mr-1.5 h-4 w-4" />
              Odwróć
            </Button>
            <Button type="button" size="sm" onClick={handleNext}>
              Następna
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>

          <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
            <DialogContent className="max-w-3xl border-slate-200 bg-white p-0 dark:border-slate-700 dark:bg-slate-900">
              <DialogHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <DialogTitle className="text-base text-slate-900 dark:text-white">
                  Wytłumaczenie wideo
                </DialogTitle>
              </DialogHeader>
              {videoUrl ? (
                <div className="space-y-3 p-5">
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    <iframe
                      src={videoUrl}
                      title={`Wytłumaczenie zadania ${currentTask?.id ?? ""}`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Materiał wideo krok po kroku do tego zadania.
                  </p>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
