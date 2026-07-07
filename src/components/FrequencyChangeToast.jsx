import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { getFrequencyColors } from "@/utils/review-frequency-colors";

export default function FrequencyChangeToast({ change, onDismiss, duration = 3200 }) {
  useEffect(() => {
    if (!change) return undefined;
    const timeout = setTimeout(() => onDismiss?.(), duration);
    return () => clearTimeout(timeout);
  }, [change, duration, onDismiss]);

  const isCorrect = change?.isCorrect;
  const from = Math.min(100, Math.max(0, change?.from ?? 0));
  const to = Math.min(100, Math.max(0, change?.to ?? 0));
  const barColor = getFrequencyColors(to).main;
  const trackColor = getFrequencyColors(to).track;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4">
      <AnimatePresence>
        {change ? (
          <motion.div
            key={change.id}
            initial={{ opacity: 0, y: -28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -28, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Częstość powtórek
              </p>
              <span
                className="inline-flex items-center gap-1 text-sm font-bold tabular-nums"
                style={{ color: barColor }}
              >
                {isCorrect ? (
                  <ArrowDownRight className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
                {to}/100
              </span>
            </div>

            <div
              className="h-3 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: trackColor }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: barColor }}
                initial={{ width: `${from}%` }}
                animate={{ width: `${to}%` }}
                transition={{ duration: 0.9, ease: "easeInOut", delay: 0.15 }}
              />
            </div>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {isCorrect
                ? "Dobra odpowiedź — zadanie będzie pojawiać się rzadziej."
                : "Błędna odpowiedź — zadanie wróci do powtórek częściej."}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
