import MathText from "@/components/MathText";
import { cn } from "@/lib/utils";
import {
  CLOSED_WORKSHEET_QUESTION_INSTRUCTION,
  stripLeadingWorksheetInstruction,
} from "@/utils/map-db-task";

function splitQuestionParts(text) {
  const raw = String(text ?? "").trim();
  if (!raw) return { instruction: null, body: "" };

  const breakIndex = raw.search(/\n\s*\n/);
  if (breakIndex === -1) {
    return { instruction: null, body: raw };
  }

  const instruction = raw.slice(0, breakIndex).trim();
  const body = raw.slice(breakIndex).trim();
  if (!instruction || !body) {
    return { instruction: null, body: raw };
  }

  return { instruction, body };
}

function getQuestionPartsForDisplay(question, { hideClosedInstruction = false } = {}) {
  let text = String(question ?? "").trim();
  if (!text) return { instruction: null, body: "" };

  if (hideClosedInstruction) {
    text = stripLeadingWorksheetInstruction(
      text,
      CLOSED_WORKSHEET_QUESTION_INSTRUCTION,
    );
  }

  const parts = splitQuestionParts(text);
  if (
    hideClosedInstruction &&
    parts.instruction === CLOSED_WORKSHEET_QUESTION_INSTRUCTION
  ) {
    return { instruction: null, body: parts.body || text };
  }

  return parts;
}

function QuestionTextBlock({ text, bold = false, className = "" }) {
  if (!text?.trim()) return null;

  return (
    <div className={cn(bold ? "font-bold leading-snug" : "font-normal leading-normal", className)}>
      <MathText text={text} className="math-text-ui--flow" />
    </div>
  );
}

export default function TaskQuestionBody({
  task,
  compact = false,
  tile = false,
  className = "",
}) {
  const textClass = compact
    ? tile
      ? "text-base text-slate-900 dark:text-white"
      : "text-sm text-slate-900 dark:text-white"
    : "text-xl text-slate-950 dark:text-slate-100";

  const questionParts = getQuestionPartsForDisplay(task?.question, {
    hideClosedInstruction: tile,
  });

  return (
    <div
      className={cn(
        compact
          ? cn(
              "task-question-body--card py-0",
              tile ? "task-question-body--tile space-y-2.5" : "space-y-4 py-0.5",
            )
          : "space-y-4",
        className,
      )}
    >
      {task?.question?.trim() ? (
        <div
          className={cn(
            textClass,
            "overflow-visible space-y-1",
            compact ? (tile ? "p-0" : "pt-1 pb-0.5") : "py-1",
          )}
        >
          {questionParts.instruction ? (
            <QuestionTextBlock text={questionParts.instruction} bold />
          ) : null}
          <QuestionTextBlock
            text={questionParts.body}
            bold={!questionParts.instruction}
          />
        </div>
      ) : null}

      {task?.imageUrl ? (
        <img
          src={task.imageUrl}
          alt="Ilustracja do zadania"
          className={cn(
            "mx-auto w-full rounded-lg border border-slate-200 dark:border-slate-700",
            compact
              ? tile
                ? "max-h-32 object-contain"
                : "max-h-36 object-contain"
              : "max-w-md",
          )}
        />
      ) : null}

      {task?.questionTextPoObrazku?.trim() ? (
        <div
          className={cn(
            textClass,
            "overflow-visible",
            compact ? (tile ? "p-0" : "pt-1 pb-0.5") : "py-1",
          )}
        >
          <MathText text={task.questionTextPoObrazku} className="math-text-ui--flow" />
        </div>
      ) : null}
    </div>
  );
}
