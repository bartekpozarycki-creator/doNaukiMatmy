import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

function generatePairs() {
  // create 8 pairs (16 cards)
  const pairs = [];
  const bases = Array.from({ length: 8 }, () => Math.floor(Math.random() * 9) + 2); // 2..10
  bases.forEach((base, idx) => {
    const power = 2; // square
    const expression = `${base}^${power}`;
    const result = Math.pow(base, power).toString();
    pairs.push({ id: `${idx}-exp`, value: expression, matchKey: idx });
    pairs.push({ id: `${idx}-res`, value: result, matchKey: idx });
  });
  // shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

export default function PotegiMemory() {
  const [cards, setCards] = useState(generatePairs());
  const [flipped, setFlipped] = useState([]); // store ids
  const [matchedKeys, setMatchedKeys] = useState([]); // store matchKey
  const [moves, setMoves] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // handle card click
  const onCardClick = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matchedKeys.includes(card.matchKey)) return;
    setFlipped([...flipped, card.id]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);
      if (firstCard.matchKey === secondCard.matchKey) {
        setMatchedKeys((prev) => [...prev, firstCard.matchKey]);
      }
      setTimeout(() => setFlipped([]), 800);
      setMoves((m) => m + 1);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matchedKeys.length === 8) {
      setIsFinished(true);
    }
  }, [matchedKeys]);

  const resetGame = () => {
    setCards(generatePairs());
    setFlipped([]);
    setMatchedKeys([]);
    setMoves(0);
    setIsFinished(false);
  };

  const cardVariants = {
    hidden: { rotateY: 180 },
    visible: { rotateY: 0 },
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 py-16">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white">Potęgi Memory</h2>
        <p className="text-center text-slate-600 dark:text-slate-300">Ruchy: {moves}</p>

        {isFinished ? (
          <div className="text-center space-y-4">
            <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">Ukończone w {moves} ruchach!</p>
            <Button onClick={resetGame}>Zagraj ponownie</Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card) => {
              const isRevealed = flipped.includes(card.id) || matchedKeys.includes(card.matchKey);
              return (
                <motion.div
                  key={card.id}
                  className="relative w-full pt-[100%] cursor-pointer"
                  onClick={() => onCardClick(card)}
                >
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={isRevealed ? "front" : "back"}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.3 }}
                      className={`absolute inset-0 flex items-center justify-center rounded-md border text-lg font-semibold select-none ${isRevealed ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-slate-700"}`}
                    >
                      {isRevealed ? card.value : "?"}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

