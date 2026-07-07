export const MATH_SNIPPETS = [
  { id: "power", label: "x²", title: "Potęga", action: "power", mathlive: "^{2}" },
  { id: "sqrt", label: "√", title: "Pierwiastek", action: "sqrt", mathlive: "\\sqrt{#@}" },
  { id: "fraction", label: "a/b", title: "Ułamek", action: "fraction", mathlive: "\\frac{#@}{}" },
  { id: "subscript", label: "xₙ", title: "Indeks dolny", action: "subscript", mathlive: "_{n}" },
  { id: "parentheses", label: "( )", title: "Nawiasy", action: "parentheses", mathlive: "\\left(#@\\right)" },
  { id: "pi", label: "π", title: "Pi", latex: "\\pi" },
  { id: "theta", label: "θ", title: "Theta", latex: "\\theta" },
  { id: "infinity", label: "∞", title: "Nieskończoność", latex: "\\infty" },
  { id: "leq", label: "≤", title: "Mniejsze lub równe", latex: "\\leq" },
  { id: "geq", label: "≥", title: "Większe lub równe", latex: "\\geq" },
  { id: "neq", label: "≠", title: "Różne", latex: "\\neq" },
  { id: "pm", label: "±", title: "Plus minus", latex: "\\pm" },
];

const TOKEN_STOP_RE = /[\s+\-*/=<>()[\]{},;:|]/;

function setFieldSelection(element, start, end = start) {
  if (!element) return;
  requestAnimationFrame(() => {
    element.focus();
    element.setSelectionRange(start, end);
  });
}

function isInsideInlineMath(value, position) {
  const before = value.slice(0, position);
  const dollarCount = (before.match(/\$/g) || []).length;
  return dollarCount % 2 === 1;
}

function getPreviousToken(value, start) {
  let index = start - 1;
  while (index >= 0 && /\s/.test(value[index])) index -= 1;
  const end = index + 1;
  while (index >= 0 && !TOKEN_STOP_RE.test(value[index])) index -= 1;
  const tokenStart = index + 1;
  const token = value.slice(tokenStart, end);
  if (!token || token.includes("$")) {
    return { start, end: start, token: "" };
  }
  return { start: tokenStart, end, token };
}

function wrapInlineMath(latex) {
  return `$${latex}$`;
}

function replaceRange(value, start, end, replacement) {
  return value.slice(0, start) + replacement + value.slice(end);
}

function insertLatex(element, currentValue, onChange, latex, caretInLatex = null) {
  const start = element?.selectionStart ?? currentValue.length;
  const end = element?.selectionEnd ?? currentValue.length;
  const insideMath = isInsideInlineMath(currentValue, start);
  const inserted = insideMath ? latex : wrapInlineMath(latex);
  const nextValue = replaceRange(currentValue, start, end, inserted);
  onChange(nextValue);
  const offset = insideMath ? 0 : 1;
  const caret =
    caretInLatex == null ? start + inserted.length : start + offset + caretInLatex;
  setFieldSelection(element, caret);
}

function insertTemplate(element, currentValue, onChange, buildLatex, fallback, caretOffset) {
  const start = element?.selectionStart ?? currentValue.length;
  const end = element?.selectionEnd ?? currentValue.length;
  const selected = currentValue.slice(start, end);
  const previous = selected ? null : getPreviousToken(currentValue, start);
  const base = selected || previous?.token || fallback;
  const rangeStart = selected ? start : previous.start;
  const rangeEnd = selected ? end : previous.end;
  const latex = buildLatex(base);
  const replacement = wrapInlineMath(latex);
  const nextValue = replaceRange(currentValue, rangeStart, rangeEnd, replacement);
  onChange(nextValue);
  setFieldSelection(element, rangeStart + 1 + caretOffset(base));
}

export function insertMathIntoField(element, currentValue, onChange, snippet) {
  if (!snippet) return;

  if (element?.tagName?.toLowerCase() === "math-field") {
    element.focus();
    element.executeCommand?.(["switchMode", "math"]);
    element.insert(snippet.mathlive || snippet.latex, {
      focus: true,
      insertionMode: "replaceSelection",
      selectionMode: "placeholder",
    });
    onChange?.(element.getValue());
    return;
  }

  if (snippet.action === "power") {
    insertTemplate(
      element,
      currentValue,
      onChange,
      (base) => `${base}^{2}`,
      "x",
      (base) => base.length + 2,
    );
    return;
  }

  if (snippet.action === "sqrt") {
    insertTemplate(
      element,
      currentValue,
      onChange,
      (base) => `\\sqrt{${base}}`,
      "x",
      () => 6,
    );
    return;
  }

  if (snippet.action === "fraction") {
    insertTemplate(
      element,
      currentValue,
      onChange,
      (base) => `\\frac{${base}}{}`,
      "1",
      (base) => base.length + 8,
    );
    return;
  }

  if (snippet.action === "subscript") {
    insertTemplate(
      element,
      currentValue,
      onChange,
      (base) => `${base}_{n}`,
      "a",
      (base) => base.length + 2,
    );
    return;
  }

  if (snippet.action === "parentheses") {
    insertTemplate(
      element,
      currentValue,
      onChange,
      (base) => `\\left(${base}\\right)`,
      "x",
      () => 6,
    );
    return;
  }

  insertLatex(element, currentValue, onChange, snippet.latex);
}
