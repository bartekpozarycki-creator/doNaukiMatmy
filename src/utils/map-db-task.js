import { publicSupabase } from "@/supabase-config.js";
import { parseOpenParts } from "@/utils/open-parts.js";

/** Bucket ze zdjęciami do zadań (ścieżka w kolumnie obrazek, bez leading slash). */
export const TASK_IMAGES_BUCKET = "tasks_images";

export function resolveTaskObrazekUrl(obrazek) {
  const v = typeof obrazek === "string" ? obrazek.trim() : "";
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  const path = v.replace(/^\//, "");
  return publicSupabase.storage.from(TASK_IMAGES_BUCKET).getPublicUrl(path)
    .data.publicUrl;
}

export const TASK_LEVEL_BAR_GRADIENT = {
  podstawowy: "from-blue-400 to-blue-600",
  rozszerzony: "from-purple-400 to-purple-600",
  ósmoklasisty: "from-green-400 to-green-600",
};

export const TASK_LEVEL_BAR_SOLID = {
  podstawowy: "bg-blue-600",
  rozszerzony: "bg-purple-600",
  ósmoklasisty: "bg-green-600",
};

export const TASK_LEVEL_DISPLAY_LABEL = {
  podstawowy: "poziom podstawowy",
  rozszerzony: "poziom rozszerzony",
  ósmoklasisty: "egzamin ósmoklasisty",
};

export const TASK_LEVEL_BADGE_THEME = {
  podstawowy: "border-blue-500 text-blue-700 dark:text-blue-400",
  rozszerzony: "border-purple-500 text-purple-700 dark:text-purple-400",
  ósmoklasisty: "border-green-500 text-green-700 dark:text-green-400",
};

export function taskLevelBadgeClassName(level) {
  return (
    TASK_LEVEL_BADGE_THEME[level] ??
    "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
  );
}

export const TASK_DIFFICULTY_TIER_ORDER = [
  "bardzo_latwe",
  "latwe",
  "raczej_latwe",
  "srednie",
  "raczej_trudne",
  "trudne",
  "bardzo_trudne",
];

const TASK_DIFFICULTY_TIER = {
  bardzo_latwe: {
    label: "Bardzo łatwe",
    className:
      "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300",
  },
  latwe: {
    label: "Łatwe",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  raczej_latwe: {
    label: "Raczej łatwe",
    className:
      "border-green-300 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-950/50 dark:text-green-300",
  },
  srednie: {
    label: "Średnie",
    className:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
  },
  raczej_trudne: {
    label: "Raczej trudne",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
  },
  trudne: {
    label: "Trudne",
    className:
      "border-rose-400 bg-rose-100 text-rose-900 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200",
  },
  bardzo_trudne: {
    label: "Bardzo trudne",
    className:
      "border-red-800/40 bg-gradient-to-r from-red-700 to-rose-900 text-white shadow-sm shadow-red-900/20 dark:border-red-500/40 dark:from-red-800 dark:to-rose-950 dark:text-red-50",
  },
};

const TASK_DIFFICULTY_ALIASES = {
  "1": "latwe",
  "2": "raczej_latwe",
  "3": "srednie",
  "4": "raczej_trudne",
  "5": "trudne",
  "bardzo łatwe": "bardzo_latwe",
  "bardzo latwe": "bardzo_latwe",
  bardzo_latwe: "bardzo_latwe",
  "very easy": "bardzo_latwe",
  łatwe: "latwe",
  latwe: "latwe",
  easy: "latwe",
  "raczej łatwe": "raczej_latwe",
  "raczej latwe": "raczej_latwe",
  raczej_latwe: "raczej_latwe",
  "rather easy": "raczej_latwe",
  średnie: "srednie",
  srednie: "srednie",
  medium: "srednie",
  "raczej trudne": "raczej_trudne",
  "raczej trudne": "raczej_trudne",
  raczej_trudne: "raczej_trudne",
  "rather hard": "raczej_trudne",
  trudne: "trudne",
  hard: "trudne",
  "bardzo trudne": "bardzo_trudne",
  bardzo_trudne: "bardzo_trudne",
  "very hard": "bardzo_trudne",
  opanowane: "opanowane",
  mastered: "opanowane",
};

export function isTaskMasteredDifficulty(raw) {
  const value = String(raw ?? "").trim().toLowerCase();
  return value === "opanowane" || value === "mastered";
}

export const TASK_MASTERED_DIFFICULTY_BADGE_CLASS =
  "border-violet-400/50 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm shadow-violet-500/25 dark:border-violet-400/40 dark:from-violet-600 dark:to-purple-700 dark:text-violet-50";

export function resolveTaskDifficultyTier(raw) {
  if (raw == null || raw === "") return null;
  const value = String(raw).trim().toLowerCase();
  if (!value) return null;
  return TASK_DIFFICULTY_ALIASES[value] ?? null;
}

export function formatTaskDifficultyLabel(raw) {
  if (isTaskMasteredDifficulty(raw)) return "Opanowane";
  const tier = resolveTaskDifficultyTier(raw);
  if (tier) return TASK_DIFFICULTY_TIER[tier].label;
  const value = String(raw ?? "").trim();
  if (!value) return null;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function taskDifficultyBadgeClassName(raw) {
  if (isTaskMasteredDifficulty(raw)) return TASK_MASTERED_DIFFICULTY_BADGE_CLASS;
  const tier = resolveTaskDifficultyTier(raw);
  if (tier) return TASK_DIFFICULTY_TIER[tier].className;
  return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300";
}

export function isMaturalneTask(task) {
  const v = task?.arkusz;
  if (v === null || v === undefined || v === false) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const trimmed = v.trim();
    if (!trimmed) return false;
    const normalized = trimmed.toLowerCase();
    if (
      normalized === "null" ||
      normalized === "undefined" ||
      normalized === "none" ||
      normalized === "brak" ||
      normalized === "-" ||
      normalized === "—"
    ) {
      return false;
    }
    return true;
  }
  return false;
}

export function arkuszLinkedBadgeLabel(level) {
  return level === "ósmoklasisty" ? "arkusze E8" : "Maturalne";
}

function cleanArkuszFilePart(value) {
  if (!value) return "";
  return String(value)
    .replace(/\.[^/.]+$/, "")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatArkuszFilePart(value) {
  const cleaned = cleanArkuszFilePart(value);
  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/** Etykieta arkusza z id pliku (np. 2023-maj-2023-pr-matura). */
export function formatArkuszDisplayLabel(arkuszId) {
  if (!arkuszId || typeof arkuszId !== "string") {
    return arkuszLinkedBadgeLabel("podstawowy");
  }
  const name = arkuszId.replace(/\.[^/.]+$/, "");
  const [year = "", month = "", , levelRaw = ""] = name.split("-");
  const monthLabel = formatArkuszFilePart(month);
  const yearLabel = cleanArkuszFilePart(year);
  const lr = String(levelRaw).toLowerCase();
  let levelPhrase = "";
  if (["pp", "podstawowy", "podstawa"].includes(lr)) {
    levelPhrase = "matura podstawowa";
  } else if (["pr", "rozszerzony", "rozszerzenie"].includes(lr)) {
    levelPhrase = "matura rozszerzona";
  } else if (
    ["null", "brak", "osma", "ósmoklasisty", "osmaklasa"].some((x) =>
      lr.includes(x),
    )
  ) {
    levelPhrase = "egzamin ósmoklasisty";
  }

  const when =
    monthLabel && yearLabel
      ? `${monthLabel} ${yearLabel}`
      : yearLabel || monthLabel || "";

  if (when && levelPhrase) return `${when} - ${levelPhrase}`;
  if (when) return when;
  if (levelPhrase) return levelPhrase;
  return cleanArkuszFilePart(arkuszId) || arkuszId;
}

/** Miesiąc i rok arkusza (np. „maj 2023”) — bez poziomu matury. */
export function formatArkuszMonthYear(arkuszId) {
  if (!arkuszId || typeof arkuszId !== "string") return "";
  const name = arkuszId.replace(/\.[^/.]+$/, "");
  const [year = "", month = ""] = name.split("-");
  const monthLabel = formatArkuszFilePart(month);
  const yearLabel = cleanArkuszFilePart(year);
  if (monthLabel && yearLabel) return `${monthLabel} ${yearLabel}`;
  return monthLabel || yearLabel || "";
}

export function arkuszLinkedBadgeClassName(level) {
  switch (level) {
    case "podstawowy":
      return "border-blue-500 text-blue-700 bg-blue-50/70 dark:border-blue-400 dark:text-blue-300 dark:bg-blue-950/30";
    case "rozszerzony":
      return "border-purple-500 text-purple-700 bg-purple-50/70 dark:border-purple-400 dark:text-purple-300 dark:bg-purple-950/30";
    case "ósmoklasisty":
      return "border-green-500 text-green-700 bg-green-50/70 dark:border-green-400 dark:text-green-300 dark:bg-green-950/30";
    default:
      return "border-slate-400 text-slate-700 bg-slate-50/70 dark:border-slate-500 dark:text-slate-300 dark:bg-slate-900/40";
  }
}

export function parseTaskNr(raw) {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) return Math.floor(n);
  return null;
}

export function parseTaskPunktacja(raw, fallback = 1) {
  if (raw == null || raw === "") return fallback;
  const n = Number(raw);
  if (Number.isFinite(n) && n >= 0) return n;
  return fallback;
}

export function normalizeVideoEmbedUrl(raw) {
  if (raw == null) return null;
  const value = String(raw).trim();
  if (!value) return null;
  if (value.includes("youtube.com/watch")) {
    try {
      const id = new URL(value).searchParams.get("v");
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    } catch {
      return value;
    }
  }
  if (value.includes("youtu.be/")) {
    const id = value.split("youtu.be/")[1]?.split(/[?&]/)[0];
    if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
  }
  return value;
}

function pickVideoUrlFromRow(row) {
  const raw =
    row.video_url ??
    row.video ??
    row.film_url ??
    row.film ??
    row.wytlumaczenie_video ??
    row.wytlumaczenie ??
    null;
  return normalizeVideoEmbedUrl(raw);
}

export function sortTasksByNr(tasks) {
  return [...tasks].sort((a, b) => {
    const an = a.nr ?? Number.POSITIVE_INFINITY;
    const bn = b.nr ?? Number.POSITIVE_INFINITY;
    if (an !== bn) return an - bn;
    return String(a.id).localeCompare(String(b.id));
  });
}

export function normalizeDbPoziom(raw) {
  if (raw == null || (typeof raw === "string" && raw.trim() === "")) {
    return "ósmoklasisty";
  }
  const v = String(raw).trim();
  const lower = v.toLowerCase();
  if (lower === "pp" || lower === "podstawa") return "podstawowy";
  if (lower === "pr" || lower === "rozszerzenie") return "rozszerzony";
  return v;
}

export function mapDbTaskRow(row) {
  if (!row) return null;

  const isClosed = row.task_kind === "closed";
  const rawAnswers = row.answers ?? row.options;
  const arr = Array.isArray(rawAnswers) ? rawAnswers : [];

  let options = [];
  if (isClosed) {
    options = arr
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && item.text != null) {
          return String(item.text);
        }
        return "";
      })
      .filter(Boolean);
  }

  let answer = row.correct_answer != null ? String(row.correct_answer) : "";

  if (isClosed && arr.length) {
    const key = answer.trim();
    if (/^[A-Za-z]$/.test(key)) {
      const letter = key.toUpperCase();
      const hit = arr.find((item) => {
        if (item && typeof item === "object" && item.id != null) {
          return String(item.id).toUpperCase() === letter;
        }
        return false;
      });
      if (hit && typeof hit === "object" && hit.text != null) {
        answer = String(hit.text);
      }
    }
  }

  const rawTopic = row.temat ?? row.topic ?? row.subject ?? null;
  const topic =
    typeof rawTopic === "string" && rawTopic.trim() !== ""
      ? rawTopic.trim()
      : null;

  const rawSubtopic = row.podtemat ?? row.subtopic ?? null;
  const subtopic =
    typeof rawSubtopic === "string" && rawSubtopic.trim() !== ""
      ? rawSubtopic.trim()
      : null;

  const rawEstimatedDifficulty =
    row.szacowana_trudnosc ?? row.trudnosc ?? null;
  const szacowanaTrudnosc =
    rawEstimatedDifficulty == null ||
    String(rawEstimatedDifficulty).trim() === ""
      ? null
      : String(rawEstimatedDifficulty).trim();

  return {
    id: row.id,
    question: row.question_text ?? "",
    answer,
    level: normalizeDbPoziom(row.poziom),
    source: row.pochodzenie ?? "",
    topic: topic ?? "—",
    subtopic: subtopic ?? null,
    szacowanaTrudnosc,
    type: isClosed ? "closed" : "open",
    options: isClosed ? options : undefined,
    arkusz: row.arkusz ?? null,
    nr: parseTaskNr(row.nr),
    keyNr: parseTaskNr(row.key_nr),
    punktacja: parseTaskPunktacja(row.punktacja),
    obrazek: row.obrazek ?? null,
    imageUrl: resolveTaskObrazekUrl(row.obrazek),
    questionTextPoObrazku:
      typeof row.question_text_po_obrazku === "string" &&
      row.question_text_po_obrazku.trim() !== ""
        ? row.question_text_po_obrazku.trim()
        : null,
    openParts: parseOpenParts(row.open_parts),
    videoUrl: pickVideoUrlFromRow(row),
  };
}

const WORKSHEET_ANSWER_LETTERS = ["A", "B", "C", "D", "E", "F"];

export const CLOSED_WORKSHEET_QUESTION_INSTRUCTION =
  "Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.";

const WORKSHEET_QUESTION_INSTRUCTIONS = {
  closed: CLOSED_WORKSHEET_QUESTION_INSTRUCTION,
};

export function stripLeadingWorksheetInstruction(text, instruction) {
  if (!text || !instruction) return text ?? "";
  let result = String(text).trim();
  while (result.startsWith(instruction)) {
    result = result.slice(instruction.length).trim();
  }
  return result;
}

function normalizeWorksheetOptionText(text, index) {
  const cleaned = String(text ?? "").trim();
  if (!cleaned) return "";
  const existing = cleaned.match(/^([A-F])\.\s*(.*)$/i);
  if (existing) {
    return `${existing[1].toUpperCase()}. ${existing[2].trim()}`;
  }
  const letter = WORKSHEET_ANSWER_LETTERS[index] || `${index + 1}`;
  return `${letter}. ${cleaned}`;
}

export function mapDbTaskToWorksheetQuestion(task, worksheetId, fallbackNumber) {
  if (!task) return null;

  const questionNumber = task.nr ?? fallbackNumber ?? 1;
  const isClosed = task.type === "closed";
  let options;
  let correct_answer = task.answer ?? "";

  if (isClosed && task.options?.length) {
    options = task.options
      .map((text, index) => normalizeWorksheetOptionText(text, index))
      .filter(Boolean);
    const matchIdx = task.options.findIndex(
      (text) => String(text).trim() === String(task.answer).trim(),
    );
    if (matchIdx >= 0) {
      correct_answer = options[matchIdx];
    }
  }

  const questionText = isClosed
    ? stripLeadingWorksheetInstruction(
        task.question,
        WORKSHEET_QUESTION_INSTRUCTIONS.closed,
      )
    : task.question;

  return {
    id: String(task.id),
    worksheet_id: worksheetId,
    question_number: questionNumber,
    nr: task.nr ?? null,
    key_nr: task.keyNr ?? null,
    question_type: isClosed ? "single_choice" : "open",
    question_text: questionText,
    question_text_po_obrazku: task.questionTextPoObrazku ?? null,
    open_parts: task.openParts ?? null,
    options,
    correct_answer,
    points: task.punktacja ?? 1,
    punktacja: task.punktacja ?? 1,
    image_url: task.imageUrl ?? null,
    video_url: task.videoUrl ?? null,
  };
}
