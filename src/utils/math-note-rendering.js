const MATH_COMMAND_RE = /\\[a-zA-Z]+/;
const MATH_OPERATOR_RE = /(\^|_|[=<>]|[+\-*/]|\\)/;
const MATH_ONLY_RE = /^[0-9a-zA-Z\\^_{}\s+\-*/=().,≤≥≠∞πθ]+$/;
const POLISH_LETTER_RE = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;

export function formatMathNoteLine(line) {
  const trimmed = String(line ?? "").trim();
  if (!trimmed) return line;
  if (trimmed.includes("$") || trimmed.startsWith("\\(") || trimmed.startsWith("\\[")) {
    return line;
  }
  if (POLISH_LETTER_RE.test(trimmed)) return line;
  if (!MATH_ONLY_RE.test(trimmed)) return line;
  if (!MATH_OPERATOR_RE.test(trimmed) && !MATH_COMMAND_RE.test(trimmed)) return line;
  return `$${trimmed}$`;
}
