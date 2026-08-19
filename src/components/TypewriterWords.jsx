import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DEFAULT_WORDS = [
  "prosta",
  "zrozumiała",
  "przyjemna",
  "przydatna",
  "logiczna",
  "ciekawa",
];

export default function TypewriterWords({
  words = DEFAULT_WORDS,
  className = "",
  typeSpeed = 175,
  deleteSpeed = 100,
  pauseAfterType = 3200,
  pauseAfterDelete = 800,
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentWord = words[wordIndex];
  const longestWord = words.reduce(
    (longest, word) => (word.length > longest.length ? word : longest),
    "",
  );

  useEffect(() => {
    let timeoutId;

    if (!isDeleting && displayText === currentWord) {
      timeoutId = setTimeout(() => setIsDeleting(true), pauseAfterType);
    } else if (isDeleting && displayText === "") {
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, pauseAfterDelete);
    } else {
      timeoutId = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? currentWord.substring(0, prev.length - 1)
            : currentWord.substring(0, prev.length + 1),
        );
      }, isDeleting ? deleteSpeed : typeSpeed);
    }

    return () => clearTimeout(timeoutId);
  }, [
    currentWord,
    deleteSpeed,
    displayText,
    isDeleting,
    pauseAfterDelete,
    pauseAfterType,
    typeSpeed,
    wordIndex,
    words.length,
  ]);

  return (
    <span
      className={`relative inline-block align-baseline whitespace-nowrap ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="invisible select-none" aria-hidden="true">
        {longestWord}
        <span className="ml-0.5 inline-block w-[3px]" aria-hidden="true" />
      </span>
      <span className="absolute left-0 top-0 whitespace-nowrap bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
        {displayText}
        <motion.span
          className="ml-0.5 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-violet-600 align-middle dark:bg-violet-400"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.49, 0.5, 1],
          }}
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
