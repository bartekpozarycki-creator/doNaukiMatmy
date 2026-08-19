import { MATH_SNIPPETS, insertMathIntoField } from "@/utils/insert-math";
import { cn } from "@/lib/utils";

const propType = () => null;

export default function MathInsertToolbar({ targetRef, value, onChange, className = "" }) {
  const handleInsert = (snippet) => {
    const el = targetRef?.current;
    insertMathIntoField(el, value, onChange, snippet);
  };

  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-700 dark:bg-slate-800/70",
        className,
      )}
      role="toolbar"
      aria-label="Wstaw symbol matematyczny"
    >
      {MATH_SNIPPETS.map((snippet) => (
        <button
          key={snippet.id}
          type="button"
          title={snippet.title}
          aria-label={snippet.title}
          onClick={() => handleInsert(snippet)}
          className="min-h-9 min-w-10 shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 hover:shadow-md active:translate-y-0 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-200"
        >
          {snippet.label}
        </button>
      ))}
    </div>
  );
}

MathInsertToolbar.propTypes = {
  targetRef: propType,
  value: propType,
  onChange: propType,
  className: propType,
};
