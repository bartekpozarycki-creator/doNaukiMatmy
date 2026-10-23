const ALLOWED_TAGS = new Set([
  "B",
  "STRONG",
  "I",
  "EM",
  "U",
  "S",
  "STRIKE",
  "SPAN",
  "BR",
  "P",
  "DIV",
]);

const ALLOWED_COLORS = new Set([
  "#0f172a",
  "#334155",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ffffff",
  "#e2e8f0",
]);

export const NOTE_TEXT_COLORS = [
  { id: "slate", label: "Ciemny", value: "#0f172a" },
  { id: "red", label: "Czerwony", value: "#dc2626" },
  { id: "orange", label: "Pomarańczowy", value: "#ea580c" },
  { id: "yellow", label: "Żółty", value: "#ca8a04" },
  { id: "green", label: "Zielony", value: "#16a34a" },
  { id: "blue", label: "Niebieski", value: "#2563eb" },
  { id: "violet", label: "Fioletowy", value: "#7c3aed" },
  { id: "pink", label: "Różowy", value: "#db2777" },
];

export function looksLikeRichNoteHtml(value) {
  return /<[a-z][\s\S]*>/i.test(String(value ?? ""));
}

function normalizeColor(value) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return "";
  if (/^#[0-9a-f]{6}$/.test(raw)) return raw;
  if (/^#[0-9a-f]{3}$/.test(raw)) {
    const [, r, g, b] = raw;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "";
}

function sanitizeStyle(styleValue) {
  const parts = String(styleValue ?? "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
  const kept = [];
  for (const part of parts) {
    const [prop, ...rest] = part.split(":");
    if (!prop || rest.length === 0) continue;
    const name = prop.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (name === "color") {
      const color = normalizeColor(value);
      if (color && ALLOWED_COLORS.has(color)) {
        kept.push(`color: ${color}`);
      }
    }
  }
  return kept.join("; ");
}

export function sanitizeNoteHtml(html) {
  const input = String(html ?? "");
  if (!input.trim()) return "";

  if (typeof document === "undefined") {
    return input
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/ on\w+="[^"]*"/gi, "")
      .replace(/ on\w+='[^']*'/gi, "");
  }

  const template = document.createElement("template");
  template.innerHTML = input;

  const walk = (node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.TEXT_NODE) continue;
      if (child.nodeType !== Node.ELEMENT_NODE) {
        child.remove();
        continue;
      }

      const tag = child.tagName.toUpperCase();
      if (!ALLOWED_TAGS.has(tag)) {
        const fragment = document.createDocumentFragment();
        while (child.firstChild) {
          fragment.appendChild(child.firstChild);
        }
        child.replaceWith(fragment);
        walk(node);
        return;
      }

      Array.from(child.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name === "style" && tag === "SPAN") {
          const safe = sanitizeStyle(attr.value);
          if (safe) child.setAttribute("style", safe);
          else child.removeAttribute("style");
          return;
        }
        child.removeAttribute(attr.name);
      });

      walk(child);
    }
  };

  walk(template.content);
  return template.innerHTML;
}

export function noteHtmlToPlainText(html) {
  if (typeof document === "undefined") {
    return String(html ?? "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .trim();
  }
  const div = document.createElement("div");
  div.innerHTML = sanitizeNoteHtml(html);
  return (div.innerText || div.textContent || "").trim();
}

export function isBlankNoteHtml(html) {
  return noteHtmlToPlainText(html).length === 0;
}
