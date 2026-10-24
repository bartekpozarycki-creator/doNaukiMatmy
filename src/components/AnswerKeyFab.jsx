import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { usePageActionsContext } from "@/contexts/PageActionsContext";
import { cn } from "@/lib/utils";

export default function AnswerKeyFab({ isDark = false }) {
  const { actions } = usePageActionsContext();
  const [labelOpen, setLabelOpen] = useState(false);

  const answerKeyAction = actions.find(
    (item) => item.id === "answer-key" && !item.hidden,
  );

  if (!answerKeyAction) return null;

  const disabled = Boolean(answerKeyAction.disabled);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setLabelOpen(true)}
      onMouseLeave={() => setLabelOpen(false)}
    >
      <AnimatePresence>
        {labelOpen ? (
          <motion.div
            key="answer-key-label"
            initial={{ opacity: 0, x: 16, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold shadow-md",
              isDark
                ? "bg-slate-800 text-slate-100 ring-1 ring-slate-600"
                : "bg-white text-slate-800 ring-1 ring-slate-200",
            )}
          >
            klucz odpowiedzi CKE
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label="Klucz odpowiedzi CKE"
        title="Klucz odpowiedzi CKE"
        disabled={disabled}
        whileTap={disabled ? undefined : { scale: 0.94 }}
        onFocus={() => setLabelOpen(true)}
        onBlur={() => setLabelOpen(false)}
        onClick={() => {
          if (disabled) return;
          answerKeyAction.onClick?.();
        }}
        className={cn(
          "grid h-11 w-11 place-items-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
          isDark
            ? "bg-slate-700 text-white hover:bg-slate-600"
            : "bg-white text-slate-700 hover:bg-slate-50",
        )}
      >
        <KeyRound className="h-5 w-5 shrink-0" aria-hidden="true" />
      </motion.button>
    </div>
  );
}
