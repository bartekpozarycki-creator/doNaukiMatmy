const replacementMap = {
  0: "o",
  1: "i",
  "!": "i",
  3: "e",
  4: "a",
  "@": "a",
  5: "s",
  $: "s",
  7: "t",
};

const replacementPattern = /[01!34@5$7]/g;

export function normalizeText(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(replacementPattern, (char) => replacementMap[char] || char)
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "");
}

export function normalizeTextWords(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(replacementPattern, (char) => replacementMap[char] || char)
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
