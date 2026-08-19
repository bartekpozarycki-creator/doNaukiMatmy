import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Layers,
  RotateCw,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MathText from "@/components/MathText";
import {
  CycleFilter,
  FilterBar,
  PrettySelectFilter,
} from "@/components/ListFilters";
import sampleFlashcards from "@/data/sample-flashcards.json";
import { cn } from "@/lib/utils";

const TOPIC_LABELS = {
  algebra: "Algebra",
  analiza: "Analiza",
  geometria: "Geometria",
  funkcje: "Funkcje",
  trygonometria: "Trygonometria",
};

const LEVEL_LABELS = {
  podstawówka: "Podstawówka",
  podstawa: "Matura podstawowa",
  rozszerzenie: "Matura rozszerzona",
  studia: "Studia",
};

function shuffleItems(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function DidacticFlashcards() {
  const [topic, setTopic] = useState("all");
  const [level, setLevel] = useState("all");
  const [deck, setDeck] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const topics = useMemo(
    () => [
      "all",
      ...[...new Set(sampleFlashcards.map((card) => card.topic).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b, "pl"),
      ),
    ],
    [],
  );

  const levels = useMemo(
    () => [
      "all",
      ...[...new Set(sampleFlashcards.map((card) => card.level).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b, "pl"),
      ),
    ],
    [],
  );

  const topicOptions = useMemo(
    () =>
      topics.map((value) => ({
        value,
        label: value === "all" ? "Wszystkie tematy" : TOPIC_LABELS[value] || value,
      })),
    [topics],
  );

  const levelOptions = useMemo(
    () =>
      levels.map((value) => ({
        value,
        label: value === "all" ? "Wszystkie poziomy" : LEVEL_LABELS[value] || value,
      })),
    [levels],
  );

  const filteredCards = useMemo(() => {
    return sampleFlashcards.filter((card) => {
      if (topic !== "all" && card.topic !== topic) return false;
      if (level !== "all" && card.level !== level) return false;
      return true;
    });
  }, [topic, level]);

  useEffect(() => {
    setDeck(shuffleItems(filteredCards));
    setCardIndex(0);
    setIsFlipped(false);
  }, [filteredCards]);

  const currentCard = deck[cardIndex] ?? null;

  const handlePrevious = () => {
    if (!deck.length) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleNext = () => {
    if (!deck.length) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % deck.length);
  };

  const handleShuffle = () => {
    if (!filteredCards.length) return;
    setDeck(shuffleItems(filteredCards));
    setCardIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="space-y-4">
      <FilterBar columnsClassName="grid-cols-1 sm:grid-cols-2">
        <PrettySelectFilter
          label="Temat"
          value={topic}
          options={topicOptions}
          onChange={setTopic}
        />
        <PrettySelectFilter
          label="Poziom"
          value={level}
          options={levelOptions}
          onChange={setLevel}
        />
      </FilterBar>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {filteredCards.length} fiszek w puli
        {deck.length ? ` · fiszka ${cardIndex + 1} z ${deck.length}` : ""}
      </p>

      {!deck.length ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 px-6 text-center dark:border-slate-700">
          <Layers className="h-8 w-8 text-slate-400 dark:text-slate-500" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Brak fiszek dla wybranych filtrów
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Zmień temat lub poziom, aby zobaczyć inne karty.
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsFlipped((flipped) => !flipped)}
              className="perspective-1000 w-full max-w-lg cursor-pointer text-left"
              aria-label={isFlipped ? "Pokaż pytanie" : "Pokaż odpowiedź"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentCard?.id}-${isFlipped ? "back" : "front"}`}
                  initial={{ opacity: 0, rotateY: isFlipped ? -12 : 12, y: 6 }}
                  animate={{ opacity: 1, rotateY: 0, y: 0 }}
                  exit={{ opacity: 0, rotateY: isFlipped ? 12 : -12, y: -6 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className={cn(
                    "min-h-[220px] rounded-xl border p-5 sm:min-h-[260px] sm:p-6",
                    isFlipped
                      ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                      : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/90",
                  )}
                >
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {isFlipped ? "Odpowiedź" : "Pytanie"}
                    {currentCard?.topic
                      ? ` · ${TOPIC_LABELS[currentCard.topic] || currentCard.topic}`
                      : ""}
                  </p>
                  {isFlipped ? (
                    <div className="text-base leading-relaxed text-slate-900 dark:text-slate-100">
                      <MathText text={currentCard.back} />
                    </div>
                  ) : (
                    <div className="text-base leading-relaxed text-slate-900 dark:text-slate-100">
                      <MathText text={currentCard.front} />
                    </div>
                  )}
                  <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    Kliknij kartę, aby {isFlipped ? "wrócić do pytania" : "odwrócić"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </button>
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
            <Button type="button" variant="outline" size="sm" onClick={() => setIsFlipped((v) => !v)}>
              <RotateCw className="mr-1.5 h-4 w-4" />
              Odwróć
            </Button>
            <Button type="button" size="sm" onClick={handleNext}>
              Następna
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
