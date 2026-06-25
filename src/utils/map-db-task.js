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

export function isMaturalneTask(task) {
  const v = task?.arkusz;
  if (v === null || v === undefined) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.trim() !== "";
  return true;
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

  if (when && levelPhrase) return `${when} — ${levelPhrase}`;
  if (when) return when;
  if (levelPhrase) return levelPhrase;
  return cleanArkuszFilePart(arkuszId) || arkuszId;
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

  return {
    id: row.id,
    question: row.question_text ?? "",
    answer,
    level: normalizeDbPoziom(row.poziom),
    source: row.pochodzenie ?? "",
    topic: topic ?? "—",
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

export function mapDbTaskToWorksheetQuestion(task, worksheetId, fallbackNumber) {
  if (!task) return null;

  const questionNumber = task.nr ?? fallbackNumber ?? 1;
  const isClosed = task.type === "closed";
  let options;
  let correct_answer = task.answer ?? "";

  if (isClosed && task.options?.length) {
    options = task.options.map((text, index) => {
      const letter = WORKSHEET_ANSWER_LETTERS[index] || `${index + 1}`;
      return `${letter}. ${text}`;
    });
    const matchIdx = task.options.findIndex(
      (text) => String(text).trim() === String(task.answer).trim(),
    );
    if (matchIdx >= 0) {
      correct_answer = options[matchIdx];
    }
  }

  return {
    id: String(task.id),
    worksheet_id: worksheetId,
    question_number: questionNumber,
    nr: task.nr ?? null,
    key_nr: task.keyNr ?? null,
    question_type: isClosed ? "single_choice" : "open",
    question_text: task.question,
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
