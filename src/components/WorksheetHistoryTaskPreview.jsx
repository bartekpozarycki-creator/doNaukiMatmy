import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import TaskQuestionBody from "@/components/TaskQuestionBody";
import MathText from "@/components/MathText";
import { cn } from "@/lib/utils";
import {
  TASK_LEVEL_BAR_SOLID,
  TASK_LEVEL_DISPLAY_LABEL,
} from "@/utils/map-db-task";
import { getStoredAnswerValue } from "@/utils/worksheet-scores";
import { taskListCardLayoutClass } from "@/components/TaskListCard";

const ANSWER_LETTERS = ["A", "B", "C", "D", "E", "F"];

function splitOptionLabel(option, index) {
  const match = String(option).match(/^([A-Z])\.\s*(.*)$/);
  return {
    letter: match?.[1] || ANSWER_LETTERS[index] || `${index + 1}`,
    text: match?.[2] || option,
  };
}

function toQuestionBodyTask(question) {
  return {
    question: question?.question_text ?? question?.question ?? "",
    imageUrl: question?.image_url ?? question?.imageUrl ?? null,
    questionTextPoObrazku:
      question?.question_text_po_obrazku ?? question?.questionTextPoObrazku ?? null,
  };
}

export default function WorksheetHistoryTaskPreview({
  question,
  answersMap = {},
  level = "podstawowy",
  loading = false,
  className = "",
}) {
  const barSolid = TASK_LEVEL_BAR_SOLID[level] ?? "bg-slate-600";
  const levelLabel =
    TASK_LEVEL_DISPLAY_LABEL[level] ?? level ?? "poziom";

  if (loading) {
    return (
      <Card
        className={cn(
          taskListCardLayoutClass,
          "w-full border-slate-200 shadow-xl dark:border-slate-700",
          className,
        )}
      >
        <div className="flex min-h-[4.5rem]">
          <div className={cn("w-6 shrink-0", barSolid)} aria-hidden />
          <div className="flex flex-1 items-center px-3 text-sm text-slate-500 dark:text-slate-400">
            Ładowanie zadania…
          </div>
        </div>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card
        className={cn(
          taskListCardLayoutClass,
          "w-full border-slate-200 shadow-xl dark:border-slate-700",
          className,
        )}
      >
        <div className="flex min-h-[4.5rem]">
          <div className={cn("w-6 shrink-0", barSolid)} aria-hidden />
          <div className="flex flex-1 items-center px-3 text-sm text-slate-500 dark:text-slate-400">
            Brak treści tego zadania.
          </div>
        </div>
      </Card>
    );
  }

  const isClosed =
    question.question_type === "single_choice" ||
    question.question_type === "true_false";
  const options =
    question.question_type === "true_false"
      ? ["Prawda", "Fałsz"]
      : Array.isArray(question.options)
        ? question.options
        : [];
  const userValue = getStoredAnswerValue(question, answersMap);
  const correctValue = getStoredAnswerValue(question, {
    [question.id]: question.correct_answer,
  });

  return (
    <Card
      className={cn(
        taskListCardLayoutClass,
        "w-full border-slate-200 shadow-xl dark:border-slate-700",
        className,
      )}
    >
      <div className="flex max-h-[13.5rem] min-h-0 overflow-hidden">
        <div
          className={cn(
            "flex w-6 shrink-0 items-center justify-center py-2",
            barSolid,
          )}
          aria-hidden
        >
          <span className="select-none text-[9px] font-semibold uppercase leading-tight tracking-wide text-white [writing-mode:vertical-rl] rotate-180">
            {levelLabel}
          </span>
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-2.5 py-2">
          <div className="rounded-lg border border-slate-100 bg-slate-50/90 px-2 py-1.5 dark:border-slate-700/60 dark:bg-slate-900/50">
            <TaskQuestionBody
              task={toQuestionBodyTask(question)}
              compact
              tile
              className="[&_.task-question-body--tile]:space-y-1.5 [&_img]:!max-h-20"
            />
          </div>

          {isClosed && options.length > 0 ? (
            <div className="mt-2 space-y-1.5">
              {options.map((option, index) => {
                const value =
                  question.question_type === "true_false" ? option : option;
                const optionLabel = splitOptionLabel(option, index);
                const isCorrect =
                  Boolean(correctValue) && value === correctValue;
                const isUserPick =
                  Boolean(userValue) && value === userValue;
                const isWrongPick = isUserPick && !isCorrect;

                let optionClass =
                  "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-900/70";
                if (isCorrect) {
                  optionClass =
                    "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200 dark:border-emerald-400 dark:bg-emerald-950/40 dark:ring-emerald-900/50";
                } else if (isWrongPick) {
                  optionClass =
                    "border-rose-400 bg-rose-50 ring-1 ring-rose-200 dark:border-rose-500 dark:bg-rose-950/40 dark:ring-rose-900/50";
                } else if (isUserPick) {
                  optionClass =
                    "border-slate-400 bg-slate-100 dark:border-slate-500 dark:bg-slate-800";
                }

                return (
                  <div
                    key={`${question.id}-${value}-${index}`}
                    className={cn(
                      "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-xs",
                      optionClass,
                    )}
                  >
                    <span className="shrink-0 font-bold text-slate-700 dark:text-slate-200">
                      {question.question_type === "true_false"
                        ? option
                        : `${optionLabel.letter}.`}
                    </span>
                    <span className="min-w-0 flex-1 leading-snug text-slate-900 dark:text-white">
                      {question.question_type === "true_false" ? null : (
                        <MathText
                          text={optionLabel.text}
                          className="math-text-ui--flow"
                        />
                      )}
                    </span>
                    {isCorrect && isUserPick ? (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        Twój wybór
                      </span>
                    ) : isCorrect ? (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        OK
                      </span>
                    ) : isWrongPick ? (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">
                        Twój wybór
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function WorksheetHistoryTaskPreviewReveal({ children, open }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="history-task-preview"
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 right-0 top-[calc(100%-2px)] z-40 pt-1"
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
