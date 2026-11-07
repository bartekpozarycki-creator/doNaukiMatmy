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

const PF_PLACEHOLDER = /p\s*lub\s*f/i;
const PF_LETTERS = ["P", "F"];

function isPfPart(part) {
  return PF_PLACEHOLDER.test(String(part?.placeholder ?? ""));
}

function normalizePfChoice(value) {
  const v = String(value ?? "").trim().toLowerCase();
  if (v === "p" || v === "prawda" || v === "true") return "P";
  if (v === "f" || v === "fałsz" || v === "falsz" || v === "false") return "F";
  return "";
}

function PfChoiceTable({ question, parts, answersMap, onPartChange, disabled, showFeedback }) {
  return (
    <div className="overflow-hidden border border-slate-800 dark:border-slate-400">
      {parts.map((part, index) => {
        const value = getOpenPartValue(answersMap, question.id, part.id);
        const selected = normalizePfChoice(value);
        const expected = normalizePfChoice(part.expected);

        return (
          <div
            key={part.id}
            className={`grid grid-cols-[minmax(0,1fr)_3rem_3rem] ${
              index > 0 ? "border-t border-slate-800 dark:border-slate-400" : ""
            }`}
          >
            <div className="flex items-center px-3 py-2.5 text-base leading-relaxed text-slate-950 dark:text-slate-100">
              <MathText text={part.label} className="math-text-ui--flow" />
            </div>
            {PF_LETTERS.map((letter) => {
              const isSelected = selected === letter;
              const isCorrectCell = showFeedback && expected === letter;
              const isWrongCell =
                showFeedback && isSelected && Boolean(expected) && expected !== letter;
              let cellClass =
                "bg-white text-slate-950 dark:bg-slate-900 dark:text-white";
              if (!disabled) {
                cellClass += " hover:bg-slate-50 dark:hover:bg-slate-800";
              }
              if (isCorrectCell) {
                cellClass = "bg-emerald-600 text-white";
              } else if (isWrongCell) {
                cellClass = "bg-rose-600 text-white";
              } else if (isSelected) {
                cellClass = "bg-slate-900 text-white dark:bg-white dark:text-slate-950";
              }

              return (
                <button
                  key={letter}
                  type="button"
                  disabled={disabled}
                  aria-pressed={isSelected}
                  aria-label={`${letter}. ${part.label}`}
                  onClick={() => {
                    if (disabled) return;
                    onPartChange(
                      question.id,
                      part.id,
                      isSelected ? "" : letter,
                    );
                  }}
                  className={`flex min-h-12 items-center justify-center border-l border-slate-800 text-base font-semibold transition-colors disabled:cursor-default dark:border-slate-400 ${cellClass}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function WorksheetOpenParts({
  question,
  answersMap,
  onPartChange,
  disabled = false,
  showFeedback = false,
}) {
  if (!hasOpenParts(question)) return null;

  const parts = getOpenPartsList(question);

  if (parts.every(isPfPart)) {
    return (
      <PfChoiceTable
        question={question}
        parts={parts}
        answersMap={answersMap}
        onPartChange={onPartChange}
        disabled={disabled}
        showFeedback={showFeedback}
      />
    );
  }

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
