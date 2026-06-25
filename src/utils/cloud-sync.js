import { supabase } from "@/supabase-config.js";

export const CLOUD_SYNC_KEYS = {
  TASK_PROGRESS: "task_progress",
  FAVORITES: "favorites",
  FAVORITE_NOTES: "favorite_notes",
  WORKSHEET_PROGRESS: "worksheet_progress",
  USER_LEVEL: "user_level",
  CONTINUE_LEARNING: "continue_learning",
};

function cloudSyncMarkerKey(userId, key) {
  return `mm_cloud_sync_ready_${key}_${userId}`;
}

function parseTimestamp(value) {
  if (!value) return 0;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getAttemptTimestamp(attempt) {
  return parseTimestamp(attempt?.date ?? attempt?.updatedAt ?? attempt?.startedAt);
}

function getProgressTimestamp(entry) {
  if (!entry) return 0;
  const attempts = Array.isArray(entry.attempts) ? entry.attempts : [];
  return attempts.reduce(
    (latest, attempt) => Math.max(latest, getAttemptTimestamp(attempt)),
    parseTimestamp(entry.updatedAt),
  );
}

function normalizeTaskProgress(progress) {
  return progress && typeof progress === "object" && !Array.isArray(progress)
    ? progress
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function readLocalJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeLocalJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function isCloudSyncReady(userId, key) {
  return Boolean(userId) && localStorage.getItem(cloudSyncMarkerKey(userId, key)) === "1";
}

export function markCloudSyncReady(userId, key) {
  if (!userId) return;
  localStorage.setItem(cloudSyncMarkerKey(userId, key), "1");
}

export async function loadCloudData(userId, key) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("user_progress_sync")
    .select("data")
    .eq("user_id", userId)
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return data?.data ?? null;
}

export async function saveCloudData(userId, key, data) {
  if (!userId) return;
  const { error } = await supabase.from("user_progress_sync").upsert(
    {
      user_id: userId,
      key,
      data,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,key" },
  );

  if (error) throw error;
}

export function mergeFavorites(localFavorites, cloudFavorites) {
  return [...new Set([...normalizeArray(localFavorites), ...normalizeArray(cloudFavorites)])];
}

function normalizeNotesObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      ([taskId, note]) => taskId && typeof note === "string" && note.trim(),
    ),
  );
}

export function mergeFavoriteNotes(localNotes, cloudNotes) {
  return {
    ...normalizeNotesObject(cloudNotes),
    ...normalizeNotesObject(localNotes),
  };
}

export function mergeTaskProgress(localProgress, cloudProgress) {
  const local = normalizeTaskProgress(localProgress);
  const cloud = normalizeTaskProgress(cloudProgress);
  const merged = { ...cloud, ...local };

  for (const taskId of new Set([...Object.keys(local), ...Object.keys(cloud)])) {
    const localEntry = local[taskId];
    const cloudEntry = cloud[taskId];
    if (!localEntry || !cloudEntry) {
      merged[taskId] = localEntry || cloudEntry;
      continue;
    }

    const attempts = [
      ...normalizeArray(cloudEntry.attempts),
      ...normalizeArray(localEntry.attempts),
    ];
    const uniqueAttempts = Array.from(
      new Map(
        attempts.map((attempt) => [
          `${attempt?.date ?? ""}:${attempt?.isCorrect ?? ""}:${attempt?.frequencyAfter ?? ""}`,
          attempt,
        ]),
      ).values(),
    ).sort((a, b) => getAttemptTimestamp(a) - getAttemptTimestamp(b));
    const latestEntry =
      getProgressTimestamp(localEntry) >= getProgressTimestamp(cloudEntry)
        ? localEntry
        : cloudEntry;

    merged[taskId] = {
      ...cloudEntry,
      ...localEntry,
      ...latestEntry,
      attempts: uniqueAttempts,
      frequency:
        uniqueAttempts.at(-1)?.frequencyAfter ??
        latestEntry.frequency ??
        localEntry.frequency ??
        cloudEntry.frequency,
      correctStreak:
        latestEntry.correctStreak ??
        uniqueAttempts.at(-1)?.correctStreakAfter ??
        localEntry.correctStreak ??
        cloudEntry.correctStreak,
      intervalDays:
        latestEntry.intervalDays ??
        uniqueAttempts.at(-1)?.intervalDaysAfter ??
        localEntry.intervalDays ??
        cloudEntry.intervalDays,
      nextReviewAt:
        latestEntry.nextReviewAt ??
        uniqueAttempts.at(-1)?.nextReviewAtAfter ??
        localEntry.nextReviewAt ??
        cloudEntry.nextReviewAt,
    };
  }

  return merged;
}

export function mergeWorksheetProgress(localProgress, cloudProgress) {
  const mergedById = new Map();

  for (const attempt of [...normalizeArray(cloudProgress), ...normalizeArray(localProgress)]) {
    if (!attempt?.id) continue;
    const current = mergedById.get(attempt.id);
    const attemptTime = parseTimestamp(
      attempt.updatedAt ?? attempt.date ?? attempt.startedAt,
    );
    const currentTime = parseTimestamp(
      current?.updatedAt ?? current?.date ?? current?.startedAt,
    );

    if (!current || attemptTime >= currentTime) {
      mergedById.set(attempt.id, attempt);
    }
  }

  return [...mergedById.values()];
}

export function mergeUserLevel(localLevel, cloudLevel) {
  if (localLevel && localLevel !== "brak") return localLevel;
  if (typeof cloudLevel === "string" && cloudLevel) return cloudLevel;
  return localLevel || "brak";
}
