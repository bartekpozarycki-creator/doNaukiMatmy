export const MATH_SNIPPETS = [
  { label: "ułamek", latex: "\\frac{}{}", caret: 6 },
  { label: "√", latex: "\\sqrt{}", caret: 6 },
  { label: "xⁿ", latex: "^{}", caret: 2 },
  { label: "xₙ", latex: "_{}", caret: 2 },
  { label: "π", latex: "\\pi", caret: null },
  { label: "∞", latex: "\\infty", caret: null },
  { label: "±", latex: "\\pm", caret: null },
  { label: "×", latex: "\\times", caret: null },
  { label: "÷", latex: "\\div", caret: null },
  { label: "≤", latex: "\\leq", caret: null },
  { label: "≥", latex: "\\geq", caret: null },
  { label: "≠", latex: "\\neq", caret: null },
  { label: "Σ", latex: "\\sum_{}^{}", caret: 6 },
  { label: "∫", latex: "\\int_{}^{}", caret: 6 },
  { label: "( )", latex: "\\left( \\right)", caret: 7 },
];

export function insertMathIntoField(element, currentValue, onChange, latex, caretInLatex) {
  const wrapped = `$${latex}$`;
  const start = element?.selectionStart ?? currentValue.length;
  const end = element?.selectionEnd ?? currentValue.length;
  const nextValue =
    currentValue.slice(0, start) + wrapped + currentValue.slice(end);
  onChange(nextValue);

  if (!element) return;

  const focusStart =
    caretInLatex != null ? start + 1 + caretInLatex : start + wrapped.length;

  requestAnimationFrame(() => {
    element.focus();
    element.setSelectionRange(focusStart, focusStart);
  });
}
