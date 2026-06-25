import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// helpers to get bounds from digit count
const DIGIT_BOUNDS = {
  1: [1, 9],
  2: [10, 99],
  3: [100, 999],
};

function boundsForDigits(d) {
  return DIGIT_BOUNDS[d] || [1, 9];
}

function getRandomNumberWithDigits(digits) {
  const [min, max] = boundsForDigits(digits);
  return getRandomInt(min, max);
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProblem(settings) {
  const operation = getRandomItem(settings.operations);
  const digits = getRandomItem(settings.digitsSets); // array like [1,2] etc.
  const [d1, d2] = digits;
  const a = getRandomNumberWithDigits(d1);
  const b = getRandomNumberWithDigits(d2);

  let text = "";
  let result = 0;
  switch (operation) {
    case "add":
      text = `${a} + ${b}`;
      result = a + b;
      break;
    case "sub":
      text = `${a} - ${b}`;
      result = a - b;
      break;
    case "mul":
      text = `${a} × ${b}`;
      result = a * b;
      break;
    case "div":
      result = a;
      const prod = a * b;
      text = `${prod} ÷ ${b}`;
      break;
    default:
      text = `${a} + ${b}`;
      result = a + b;
  }
  return { text, result };
}

const OPERATIONS = [
  { id: "add", label: "Dodawanie" },
  { id: "sub", label: "Odejmowanie" },
  { id: "mul", label: "Mnożenie" },
  { id: "div", label: "Dzielenie" },
];

const DIGIT_OPTIONS = [
  { id: "1-2", label: "1 i 2 cyfrowe", value: [1, 2] },
  { id: "2-2", label: "2 i 2 cyfrowe", value: [2, 2] },
  { id: "3-2", label: "3 i 2 cyfrowe", value: [3, 2] },
  { id: "3-3", label: "3 i 3 cyfrowe", value: [3, 3] },
];

const TIME_OPTIONS = [
  { id: 60, label: "1 minuta" },
  { id: 120, label: "2 minuty" },
  { id: 180, label: "3 minuty" },
  { id: 0, label: "Bez limitu" },
];

export default function QuickMath() {
  const [settings, setSettings] = useState({ operations: [], digitsSets: [], time: null });
  const [isStarted, setIsStarted] = useState(false);

  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  // initialize game when started
  useEffect(() => {
    if (!isStarted) return;
    setProblem(generateProblem(settings));
    setScore(0);
    setAnswer("");
    setIsFinished(false);
    if (settings.time && settings.time > 0) {
      setTimeLeft(settings.time);
    } else {
      setTimeLeft(null);
    }
  }, [isStarted, settings]);

  // timer effect
  useEffect(() => {
    if (!isStarted || timeLeft === null || isFinished) return;
    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => (t !== null ? t - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isStarted, isFinished]);

  const resetGame = useCallback(() => {
    setIsStarted(false);
    setSettings({ operations: [], digitsSets: [], time: null });
  }, []);

  const submitAnswer = (e) => {
    e.preventDefault();
    if (isFinished) return;
    const numeric = parseInt(answer, 10);
    if (!isNaN(numeric) && numeric === problem.result) {
      setScore((s) => s + 1);
    }
    setProblem(generateProblem(settings));
    setAnswer("");
  };

  // selection helpers
  const allSelected = settings.operations.length > 0 && settings.digitsSets.length > 0 && settings.time !== null;

  const toggleOperation = (id) => {
    setSettings((s) => {
      const exists = s.operations.includes(id);
      return { ...s, operations: exists ? s.operations.filter((o) => o !== id) : [...s.operations, id] };
    });
  };

  const toggleDigits = (value) => {
    setSettings((s) => {
      const exists = s.digitsSets.some((v) => v[0] === value[0] && v[1] === value[1]);
      return { ...s, digitsSets: exists ? s.digitsSets.filter((v) => !(v[0] === value[0] && v[1] === value[1])) : [...s.digitsSets, value] };
    });
  };

  const handleStart = () => {
    if (!allSelected) return;
    setIsStarted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 py-16">
      {!isStarted ? (
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-4">Ustawienia gry</h2>

          {/* OPERATIONS */}
          <div>
            <p className="font-semibold mb-2 text-slate-700 dark:text-slate-200">Działania (wybierz min. jedno):</p>
            <div className="grid grid-cols-2 gap-2">
              {OPERATIONS.map((op) => (
                <label key={op.id} className={`border rounded-md p-2 cursor-pointer text-center select-none ${settings.operations.includes(op.id) ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={settings.operations.includes(op.id)}
                    onChange={() => toggleOperation(op.id)}
                  />
                  {op.label}
                </label>
              ))}
            </div>
          </div>

          {/* DIGITS */}
          <div>
            <p className="font-semibold mb-2 text-slate-700 dark:text-slate-200">Ilość cyfr (wybierz min. jedno):</p>
            <div className="grid grid-cols-2 gap-2">
              {DIGIT_OPTIONS.map((opt) => (
                <label key={opt.id} className={`border rounded-md p-2 cursor-pointer text-center text-sm select-none ${settings.digitsSets.some((v) => v[0] === opt.value[0] && v[1] === opt.value[1]) ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={settings.digitsSets.some((v) => v[0] === opt.value[0] && v[1] === opt.value[1])}
                    onChange={() => toggleDigits(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* TIME */}
          <div>
            <p className="font-semibold mb-2 text-slate-700 dark:text-slate-200">Czas gry (wybierz jedno):</p>
            <div className="grid grid-cols-2 gap-2">
              {TIME_OPTIONS.map((t) => (
                <label key={t.id} className={`border rounded-md p-2 cursor-pointer text-center select-none ${settings.time === t.id ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"}`}>
                  <input
                    type="radio"
                    name="time"
                    value={t.id}
                    className="hidden"
                    onChange={() => setSettings((s) => ({ ...s, time: t.id }))}
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </div>

          <Button onClick={handleStart} disabled={!allSelected} className="w-full disabled:opacity-50">Start</Button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-6">
          <div className="flex justify-between text-lg font-semibold text-slate-700 dark:text-slate-200">
            {timeLeft !== null && <span>Czas: {timeLeft}s</span>}
            <span>Wynik: {score}</span>
          </div>

          {isFinished ? (
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Koniec gry!</h2>
              <p className="text-xl text-slate-700 dark:text-slate-300">Twój wynik: {score}</p>
              <Button onClick={resetGame} className="mx-auto">Zagraj ponownie</Button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={problem?.text}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{problem?.text}</p>
                </motion.div>
              </AnimatePresence>

              <form onSubmit={submitAnswer} className="flex items-center justify-center space-x-2">
                <input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  autoFocus
                />
                <Button type="submit">OK</Button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
