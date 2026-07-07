import { useEffect } from "react";
import "mathlive";
import "mathlive/static.css";
import "mathlive/fonts.css";
import MathInsertToolbar from "@/components/MathInsertToolbar";
import { cn } from "@/lib/utils";

const propType = () => null;

export default function MathNoteEditor({
  value,
  onChange,
  textareaRef,
  className = "",
}) {
  useEffect(() => {
    const mathfield = textareaRef.current;
    if (!mathfield) return undefined;

    mathfield.setOptions?.({
      contentPlaceholder: "Wpisz notatkę matematyczną...",
      defaultMode: "math",
      popoverPolicy: "off",
      smartFence: true,
      smartMode: true,
      smartSuperscript: true,
      virtualKeyboardMode: "manual",
    });
    mathfield.mathVirtualKeyboardPolicy = "manual";

    const handleInput = () => {
      onChange(mathfield.getValue());
    };

    mathfield.addEventListener("input", handleInput);
    return () => {
      mathfield.removeEventListener("input", handleInput);
    };
  }, [onChange, textareaRef]);

  useEffect(() => {
    const mathfield = textareaRef.current;
    if (!mathfield) return;
    if (mathfield.getValue() !== value) {
      mathfield.setValue(value || "", { silenceNotifications: true });
    }
  }, [textareaRef, value]);

  return (
    <div className={cn("space-y-3", className)}>
      <MathInsertToolbar
        targetRef={textareaRef}
        value={value}
        onChange={onChange}
      />
      <div className="max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-950/60">
        <math-field
          ref={textareaRef}
          class="math-note-field block min-h-40 w-full rounded-xl bg-transparent text-lg text-slate-900 outline-none dark:text-white"
        />
      </div>
      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        To pole działa jak kalkulator matematyczny: wpisz wyrażenie, zaznacz
        fragment albo ustaw kursor i użyj paska symboli.
      </p>
    </div>
  );
}

MathNoteEditor.propTypes = {
  value: propType,
  onChange: propType,
  textareaRef: propType,
  className: propType,
};
