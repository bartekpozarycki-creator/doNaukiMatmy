import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MathText from "@/components/MathText";
import {
  getOpenPartValue,
  getOpenPartsList,
  hasOpenParts,
  isOpenPartAnswerCorrect,
  openPartAnswerKey,
} from "@/utils/open-parts";

export default function WorksheetOpenParts({
  question,
  answersMap,
  onPartChange,
  disabled = false,
  showFeedback = false,
}) {
  if (!hasOpenParts(question)) return null;

  const parts = getOpenPartsList(question);

  return (
    <ol className="list-none space-y-5">
      {parts.map((part, index) => {
        const value = getOpenPartValue(answersMap, question.id, part.id);
        const inputId = openPartAnswerKey(question.id, part.id);
        const correct =
          showFeedback && isOpenPartAnswerCorrect(part, value);
        const wrong = showFeedback && value.trim() !== "" && !correct;

        return (
          <li key={part.id} className="space-y-2">
            <Label
              htmlFor={inputId}
              className="flex gap-2 text-lg font-medium leading-relaxed text-slate-950 dark:text-slate-100"
            >
              <span className="shrink-0 tabular-nums text-slate-600 dark:text-slate-400">
                {index + 1}.
              </span>
              <span className="min-w-0 flex-1">
                <MathText text={part.label} className="math-text-ui--flow" />
              </span>
            </Label>
            <Input
              id={inputId}
              value={value}
              onChange={(e) => onPartChange(question.id, part.id, e.target.value)}
              placeholder={part.placeholder}
              disabled={disabled}
              className={`text-lg ${
                correct
                  ? "border-emerald-500 ring-1 ring-emerald-500/40 dark:border-emerald-500"
                  : wrong
                    ? "border-rose-500 ring-1 ring-rose-500/40 dark:border-rose-500"
                    : ""
              }`}
              autoComplete="off"
              spellCheck={false}
            />
            {wrong && part.expected ? (
              <p className="text-sm text-rose-600 dark:text-rose-400">
                Poprawnie: <MathText text={part.expected} className="math-text-ui--flow" />
              </p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
