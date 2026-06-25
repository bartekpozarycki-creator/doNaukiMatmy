import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RotateCw,
  Shuffle,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import sampleQuestions from "@/data/sample-questions.json";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function FlashcardsPage() {
  // same logic as previously in Review
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [createdCards, setCreatedCards] = useState([]);
  const [newCard, setNewCard] = useState({ front: "", back: "", topic: "algebra" });
  const [isSaving, setIsSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(null);
  }, []);

  const { data: flashcards = [] } = useQuery({
    queryKey: ["flashcards"],
    queryFn: async () => [],
  });

  const allFlashcards = [...createdCards, ...flashcards];
  const topics = [...new Set(allFlashcards.map((f) => f.topic))];
  const titleOptions = [...new Set(sampleQuestions.map((q) => q.title))];

  const filteredCards = allFlashcards.filter((f) => {
    const matchesTopic = selectedTopics.length === 0 || selectedTopics.includes(f.topic);
    const frontText = (f.front || f.title || "").toLowerCase();
    const matchesTitle =
      selectedTitles.length === 0 || selectedTitles.some((t) => frontText.includes(t.toLowerCase()));
    return matchesTopic && matchesTitle;
  });

  const currentCard = filteredCards[currentCardIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    setCurrentCardIndex(randomIndex);
  };

  const topicNames = {
    algebra: "Algebra",
    geometria: "Geometria",
    analiza: "Analiza",
    funkcje: "Funkcje",
    trygonometria: "Trygonometria",
    statystyka: "Statystyka",
    kombinatoryka: "Kombinatoryka",
    rachunek_prawdopodobienstwa: "Rachunek prawdopodobieństwa",
  };

  const handleAddFlashcard = (e) => {
    e.preventDefault();
    if (!newCard.front.trim() || !newCard.back.trim()) return;
    setIsSaving(true);
    setCreatedCards((prev) => [
      { id: `local-${Date.now()}`, ...newCard },
      ...prev,
    ]);
    setNewCard({ front: "", back: "", topic: "algebra" });
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsSaving(false);
  };

  const isDark = user?.theme === "dark";

  return (
    <motion.div
      className="py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.h1
          className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Fiszki
        </motion.h1>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white text-center">Filtry</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {topics.map((topic) => {
              const active = selectedTopics.includes(topic);
              return (
                <motion.button
                  key={topic}
                  onClick={() => {
                    setSelectedTopics((prev) =>
                      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
                    );
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600"
                  }`}
                >
                  {topicNames[topic] || topic}
                </motion.button>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {titleOptions.map((title) => {
              const active = selectedTitles.includes(title);
              return (
                <motion.button
                  key={title}
                  onClick={() => {
                    setSelectedTitles((prev) =>
                      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
                    );
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
                    active
                      ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white"
                      : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600"
                  }`}
                >
                  {title}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Flashcard */}
        {filteredCards.length > 0 && (
          <>
            <div className="text-center mb-4 text-gray-600 dark:text-slate-400">
              Fiszka {currentCardIndex + 1} z {filteredCards.length}
            </div>

            <div className="mb-8 flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCardIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                    <motion.div
                      className="relative"
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, type: "spring" }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Card
                        className={`min-h-[350px] w-[320px] sm:w-[420px] dark:bg-slate-800 bg-white border-0 shadow-xl flex items-center justify-center p-8 text-center ${
                          isFlipped ? "invisible" : ""
                        }`}
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        {currentCard.front}
                      </Card>
                      <Card
                        className={`min-h-[350px] w-[320px] sm:w-[420px] dark:bg-slate-800 bg-white border-0 shadow-xl flex items-center justify-center p-8 text-center absolute inset-0 ${
                          !isFlipped ? "invisible" : ""
                        }`}
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                      >
                        {currentCard.back}
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-4">
              <Button variant="outline" onClick={handlePrevious} className="hover:-translate-y-0.5 transition">
                <ArrowLeft className="w-5 h-5 mr-2" /> Poprzednia
              </Button>
              <Button variant="outline" onClick={handleShuffle} className="hover:-translate-y-0.5 transition">
                <Shuffle className="w-5 h-5" />
              </Button>
              <Button onClick={handleNext} className="hover:-translate-y-0.5 transition">
                Następna <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </>
        )}

        {/* Add flashcard */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="mt-12 dark:bg-slate-800 bg-white border-0 shadow-lg">

            <button
              type="button"
              onClick={() => setFormOpen((p) => !p)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4" /> Dodaj fiszkę
              </h3>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                {formOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {formOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <CardContent className="p-6 space-y-4">
                    <form className="space-y-4" onSubmit={handleAddFlashcard}>
                      <Input
                        placeholder="Pytanie"
                        value={newCard.front}
                        onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                        required
                      />
                      <Textarea
                        placeholder="Odpowiedź"
                        value={newCard.back}
                        onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                        rows={4}
                        required
                      />
                      <Input
                        placeholder="Temat (np. algebra)"
                        value={newCard.topic}
                        onChange={(e) => setNewCard({ ...newCard, topic: e.target.value })}
                      />
                      <Button type="submit" disabled={isSaving} className="w-full">
                        {isSaving ? "Zapisywanie..." : "Dodaj fiszkę"}
                      </Button>
                    </form>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

