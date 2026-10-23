import { useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  RemoveFormatting,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NOTE_TEXT_COLORS,
  looksLikeRichNoteHtml,
  sanitizeNoteHtml,
} from "@/utils/rich-note";

const propType = () => null;

function ToolbarButton({ active, onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border text-slate-700 transition-colors dark:text-slate-200",
        active
          ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-950/40 dark:text-amber-300"
          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700",
      )}
    >
      {children}
    </button>
  );
}

ToolbarButton.propTypes = {
  active: propType,
  onClick: propType,
  title: propType,
  children: propType,
};

export default function RichTextNoteEditor({
  value,
  onChange,
  className = "",
}) {
  const editorRef = useRef(null);
  const lastHtmlRef = useRef("");

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const next = String(value ?? "");
    const html = looksLikeRichNoteHtml(next)
      ? sanitizeNoteHtml(next)
      : next
        ? next
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>")
        : "";
    if (html === lastHtmlRef.current) return;
    if (editor.innerHTML === html) {
      lastHtmlRef.current = html;
      return;
    }
    editor.innerHTML = html;
    lastHtmlRef.current = html;
  }, [value]);

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const html = sanitizeNoteHtml(editor.innerHTML);
    lastHtmlRef.current = html;
    onChange?.(html);
  };

  const runCommand = (command, commandValue = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    emitChange();
  };

  const applyColor = (color) => {
    editorRef.current?.focus();
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("foreColor", false, color);
    emitChange();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900/60">
        <ToolbarButton title="Pogrubienie" onClick={() => runCommand("bold")}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Kursywa" onClick={() => runCommand("italic")}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Podkreślenie" onClick={() => runCommand("underline")}>
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Przekreślenie"
          onClick={() => runCommand("strikeThrough")}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Wyczyść formatowanie"
          onClick={() => runCommand("removeFormat")}
        >
          <RemoveFormatting className="h-4 w-4" />
        </ToolbarButton>
        <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-600" />
        <div className="flex flex-wrap items-center gap-1.5">
          {NOTE_TEXT_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.label}
              onMouseDown={(event) => {
                event.preventDefault();
                applyColor(color.value);
              }}
              className="h-6 w-6 rounded-full border border-slate-300 shadow-sm transition-transform hover:scale-110 dark:border-slate-500"
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </div>

      <div
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        aria-label="Treść notatki"
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
        className="min-h-[12rem] max-h-[18rem] overflow-y-auto rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-relaxed text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-amber-400 dark:focus:ring-amber-400/20"
      />
    </div>
  );
}

RichTextNoteEditor.propTypes = {
  value: propType,
  onChange: propType,
  className: propType,
};
