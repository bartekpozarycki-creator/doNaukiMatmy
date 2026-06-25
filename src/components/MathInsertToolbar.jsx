import { MATH_SNIPPETS, insertMathIntoField } from "@/utils/insert-math";

export default function MathInsertToolbar({ targetRef, value, onChange }) {
  const handleInsert = (snippet) => {
    const el = targetRef?.current;
    insertMathIntoField(el, value, onChange, snippet.latex, snippet.caret);
  };

  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="toolbar"
      aria-label="Wstaw symbol matematyczny"
    >
      {MATH_SNIPPETS.map((snippet) => (
        <button
          key={snippet.label}
          type="button"
          onClick={() => handleInsert(snippet)}
          className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-200"
        >
          {snippet.label}
        </button>
      ))}
    </div>
  );
}
