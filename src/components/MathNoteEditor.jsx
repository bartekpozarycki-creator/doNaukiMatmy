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
      contentPlaceholder: "",
      defaultMode: "text",
      popoverPolicy: "off",
      smartFence: true,
      smartMode: false,
      smartSuperscript: true,
      virtualKeyboardMode: "manual",
    });
    mathfield.smartMode = false;
    mathfield.mathVirtualKeyboardPolicy = "manual";
    mathfield.menuItems = [];

    const ensureFieldStyles = () => {
      const root = mathfield.shadowRoot;
      if (!root) return;
      const styleId = "math-note-field-styles";
      let style = root.getElementById(styleId);
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        root.appendChild(style);
      }
      style.textContent = `
        .ML__container {
          align-items: flex-start !important;
          height: 100% !important;
          max-height: 100% !important;
          overflow-x: clip !important;
          overflow-y: auto !important;
          scrollbar-width: none;
        }
        .ML__container::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        .ML__content {
          align-items: flex-start !important;
          align-self: flex-start !important;
          max-width: 100% !important;
          overflow-x: clip !important;
        }
        .ML__latex {
          width: auto !important;
          max-width: 100% !important;
          display: inline-flex !important;
          flex-wrap: wrap !important;
          align-items: baseline;
          white-space: normal !important;
          overflow-x: clip !important;
        }
        .ML__base {
          flex: 1 1 auto;
          display: inline-flex !important;
          flex-wrap: wrap !important;
          align-items: baseline;
          min-width: 0;
          max-width: 100%;
          width: auto !important;
        }
        .ML__text {
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
      `;
    };

    ensureFieldStyles();
    if (!mathfield.shadowRoot) {
      requestAnimationFrame(ensureFieldStyles);
    }

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
    <div className={cn("min-w-0 w-full space-y-3", className)}>
      <MathInsertToolbar
        targetRef={textareaRef}
        value={value}
        onChange={onChange}
      />
      <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-950/60">
        <math-field
          ref={textareaRef}
          default-mode="text"
          smart-mode="off"
          class="math-note-field block h-40 max-h-40 min-h-40 w-full rounded-xl bg-transparent text-lg text-slate-900 outline-none dark:text-white"
        />
      </div>
    </div>
  );
}

MathNoteEditor.propTypes = {
  value: propType,
  onChange: propType,
  textareaRef: propType,
  className: propType,
};
