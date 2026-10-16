import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MathText from "@/components/MathText";
import TaskQuestionBody from "@/components/TaskQuestionBody";
import {
  formatTaskNr,
  formatTaskSolutionText,
} from "@/utils/map-db-task";

function isMappedTask(item) {
  return item != null && typeof item.question === "string" && item.type != null;
}

function SubtaskQuestionBody({ item }) {
  if (isMappedTask(item)) {
    return <TaskQuestionBody task={item} className="text-base" />;
  }

  return (
    <div className="space-y-3">
      {item.question_text?.trim() ? (
        <MathText
          text={item.question_text}
          className="math-text-ui--flow text-base"
        />
      ) : null}
      {item.image_url ? (
        <img
          src={item.image_url}
          alt=""
          className="mx-auto max-h-48 w-auto rounded-lg border border-slate-200 dark:border-slate-700"
        />
      ) : null}
      {item.question_text_po_obrazku?.trim() ? (
        <MathText
          text={item.question_text_po_obrazku}
          className="math-text-ui--flow text-base"
        />
      ) : null}
    </div>
  );
}

export default function PreviousStemSubtasks({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <Accordion
      type="single"
      collapsible
      className={`w-full overflow-hidden rounded-xl border border-amber-200/80 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/20 ${className}`}
    >
      <AccordionItem value="previous-subtasks" className="border-0">
        <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-amber-950 hover:no-underline dark:text-amber-100 sm:px-5">
          Poprzednie podpunkty ({items.length})
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-0 sm:px-5">
          <p className="mb-3 text-sm text-amber-900/80 dark:text-amber-100/70">
            Czasem wynik wcześniejszego podpunktu jest potrzebny do rozwiązania
            kolejnego. Odpowiedzi rozwiń dopiero gdy ich potrzebujesz.
          </p>
          <div className="space-y-3">
            {items.map((item) => {
              const nr = formatTaskNr(item.nr ?? item.question_number);
              const solution = formatTaskSolutionText(item);
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-amber-200/70 bg-white/90 p-4 dark:border-amber-900/40 dark:bg-slate-900/60"
                >
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                    Zadanie {nr}
                  </p>
                  <SubtaskQuestionBody item={item} />
                  {solution ? (
                    <Accordion type="single" collapsible className="mt-3 w-full">
                      <AccordionItem
                        value={`answer-${item.id}`}
                        className="overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                      >
                        <AccordionTrigger className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-800 hover:no-underline dark:text-emerald-300">
                          Pokaż odpowiedź
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3 pt-0">
                          <div className="whitespace-pre-wrap text-sm text-slate-900 dark:text-white">
                            <MathText
                              text={solution}
                              className="math-text-ui--flow"
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : null}
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
