import { useLayoutEffect, useRef, useState } from "react";
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

function splitAroundClosedInstruction(text) {
  const raw = String(text ?? "").trim();
  if (!raw) return null;
  const instr = CLOSED_WORKSHEET_QUESTION_INSTRUCTION;
  const idx = raw.indexOf(instr);
  if (idx === -1) return null;
  return {
    before: raw.slice(0, idx).trim(),
    instruction: instr,
    after: raw.slice(idx + instr.length).trim(),
  };
}

function getQuestionPartsForDisplay(question, { hideClosedInstruction = false } = {}) {
  let text = String(question ?? "").trim();
  if (!text) return { before: "", instruction: null, after: "", body: "" };

  if (hideClosedInstruction) {
    text = stripLeadingWorksheetInstruction(
      text,
      CLOSED_WORKSHEET_QUESTION_INSTRUCTION,
    );
    const closedSplit = splitAroundClosedInstruction(text);
    if (closedSplit) {
      const merged = [closedSplit.before, closedSplit.after]
        .filter(Boolean)
        .join("\n\n");
      return { before: "", instruction: null, after: "", body: merged || text };
    }
  }

  const closedSplit = splitAroundClosedInstruction(text);
  if (closedSplit) {
    return {
      before: closedSplit.before,
      instruction: closedSplit.instruction,
      after: closedSplit.after,
      body: "",
    };
  }

  const parts = splitQuestionParts(text);
  return {
    before: "",
    instruction: parts.instruction,
    after: "",
    body: parts.body,
  };
}

function QuestionTextBlock({ text, bold = false, className = "" }) {
  if (!text?.trim()) return null;

  return (
    <div className={cn(bold ? "font-bold leading-snug" : "font-normal leading-normal", className)}>
      <MathText text={text} className="math-text-ui--flow" />
    </div>
  );
}

function AfterImageText({ text }) {
  const parts = splitQuestionParts(text);
  if (parts.instruction) {
    return (
      <div className="space-y-1">
        <QuestionTextBlock text={parts.instruction} bold />
        <QuestionTextBlock text={parts.body} bold={false} />
      </div>
    );
  }
  return <QuestionTextBlock text={parts.body} bold />;
}

function TileAfterImageFade({ children, className = "" }) {
  const ref = useRef(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const update = () => {
      setTruncated(el.scrollHeight > el.clientHeight + 1);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div className={cn("relative", className)}>
      <div ref={ref} className="max-h-[4.5em] overflow-hidden">
        {children}
      </div>
      {truncated ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent dark:from-slate-900 dark:via-slate-900/70"
        />
      ) : null}
    </div>
  );
}

export default function TaskQuestionBody({
  task,
  compact = false,
  tile = false,
  className = "",
  imageClassName = "",
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
          {questionParts.before ? (
            <QuestionTextBlock text={questionParts.before} bold={false} />
          ) : null}
          {questionParts.instruction ? (
            <QuestionTextBlock
              text={questionParts.instruction}
              bold={
                questionParts.instruction ===
                CLOSED_WORKSHEET_QUESTION_INSTRUCTION
              }
            />
          ) : null}
          {questionParts.after ? (
            <QuestionTextBlock text={questionParts.after} bold={false} />
          ) : null}
          {questionParts.body ? (
            <QuestionTextBlock
              text={questionParts.body}
              bold={Boolean(
                questionParts.instruction &&
                  questionParts.instruction !==
                    CLOSED_WORKSHEET_QUESTION_INSTRUCTION,
              )}
            />
          ) : null}
        </div>
      ) : null}

      {task?.imageUrl ? (
        <img
          src={task.imageUrl}
          alt="Ilustracja do zadania"
          className={cn(
            "mx-auto rounded-lg border border-slate-200 object-contain dark:border-slate-700",
            imageClassName ||
              (compact
                ? tile
                  ? "max-h-32 w-full"
                  : "max-h-36 w-full"
                : "w-full max-w-md"),
          )}
        />
      ) : null}

      {task?.questionTextPoObrazku?.trim() ? (
        tile && task?.imageUrl ? (
          <TileAfterImageFade className={cn(textClass, "p-0")}>
            <AfterImageText text={task.questionTextPoObrazku} />
          </TileAfterImageFade>
        ) : (
          <div
            className={cn(
              textClass,
              "overflow-visible",
              compact ? "pt-1 pb-0.5" : "py-1",
            )}
          >
            <AfterImageText text={task.questionTextPoObrazku} />
          </div>
        )
      ) : null}
    </div>
  );
}
