import { isReviewDue } from "@/utils/review-schedule";

export const REVIEW_RANDOM_QUEUE_KEY = "mm_review_random_queue";

export const REVIEW_FREQUENCY_THRESHOLD = 40;

const BAND_WEIGHTS = {
  due: 0.55,
  needsReview: 0.25,
  moderate: 0.12,
  mastered: 0.08,
};

const FALLBACK_ORDER = {
  due: ["due", "needsReview", "moderate", "mastered"],
  needsReview: ["needsReview", "due", "moderate", "mastered"],
  moderate: ["moderate", "due", "needsReview", "mastered"],
  mastered: ["mastered", "moderate", "due", "needsReview"],
};

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function classifyReviewFrequency(
  frequency,
  threshold = REVIEW_FREQUENCY_THRESHOLD,
) {
  const freq = frequency ?? 50;
  if (freq >= threshold) return "needsReview";
  if (freq >= 20) return "moderate";
  return "mastered";
}

export function classifyReviewItem(item, threshold = REVIEW_FREQUENCY_THRESHOLD) {
  if (item.nextReviewAt && isReviewDue(item.nextReviewAt)) {
    return "due";
  }
  return classifyReviewFrequency(item.frequency, threshold);
}

function groupReviewItemsByBand(reviewItems, threshold) {
  const buckets = {
    due: [],
    needsReview: [],
    moderate: [],
    mastered: [],
  };

  for (const item of reviewItems) {
    buckets[classifyReviewItem(item, threshold)].push(item);
  }

  return buckets;
}

export function filterReviewSessionItems(reviewItems, filters = {}) {
  const {
    topic = "all",
    level = "all",
    mode = "all",
  } = filters;

  return reviewItems.filter((item) => {
    if (topic !== "all" && item.task?.topic !== topic) return false;
    if (level !== "all" && item.task?.level !== level) return false;
    if (mode === "due" && !isReviewDue(item.nextReviewAt)) return false;
    if (mode === "wrong" && item.lastAttempt?.isCorrect) return false;
    if (mode === "needsWork" && item.masteryStatus?.id !== "needsWork") return false;
    return true;
  });
}

function allocateBandCounts(total, weights) {
  const keys = ["due", "needsReview", "moderate", "mastered"];
  const weightSum = keys.reduce((sum, key) => sum + weights[key], 0);
  const normalized = keys.map((key) => (weights[key] / weightSum) * total);
  const counts = normalized.map((value) => Math.floor(value));
  let remainder = total - counts.reduce((sum, count) => sum + count, 0);

  const byFraction = normalized
    .map((value, index) => ({ index, fraction: value - counts[index] }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let i = 0; i < remainder; i += 1) {
    counts[byFraction[i].index] += 1;
  }

  return Object.fromEntries(keys.map((key, index) => [key, counts[index]]));
}

function pickFromBuckets(buckets, band, count, selectedIds) {
  const picked = [];

  for (const sourceBand of FALLBACK_ORDER[band]) {
    if (picked.length >= count) break;

    const need = count - picked.length;
    const available = buckets[sourceBand].filter(
      (item) => !selectedIds.has(item.task.id),
    );
    const take = shuffleArray(available).slice(0, need);

    for (const item of take) {
      picked.push(item);
      selectedIds.add(item.task.id);
    }
  }

  return picked;
}

export function pickRandomReviewTaskIds(
  reviewItems,
  count,
  { reviewThreshold = REVIEW_FREQUENCY_THRESHOLD, filters = null } = {},
) {
  const sourceItems = filters
    ? filterReviewSessionItems(reviewItems, filters)
    : reviewItems;

  if (!sourceItems.length || count <= 0) return [];

  const limit = Math.min(count, sourceItems.length);
  const buckets = groupReviewItemsByBand(sourceItems, reviewThreshold);
  const targets = allocateBandCounts(limit, BAND_WEIGHTS);
  const selectedIds = new Set();
  const selected = [];

  for (const band of ["due", "needsReview", "moderate", "mastered"]) {
    const picked = pickFromBuckets(buckets, band, targets[band], selectedIds);
    selected.push(...picked);
  }

  if (selected.length < limit) {
    const remaining = sourceItems.filter(
      (item) => !selectedIds.has(item.task.id),
    );
    selected.push(...shuffleArray(remaining).slice(0, limit - selected.length));
  }

  return shuffleArray(selected).map((item) => item.task.id);
}

export function startRandomReviewSession(taskIds) {
  if (!taskIds?.length) return;
  sessionStorage.setItem(REVIEW_RANDOM_QUEUE_KEY, JSON.stringify(taskIds));
}

export function getRandomReviewQueue() {
  try {
    const raw = sessionStorage.getItem(REVIEW_RANDOM_QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearRandomReviewQueue() {
  sessionStorage.removeItem(REVIEW_RANDOM_QUEUE_KEY);
}

export function getRandomReviewSessionMeta(currentTaskId) {
  const queue = getRandomReviewQueue();
  if (!queue.length) return null;

  const index = queue.indexOf(currentTaskId);
  if (index === -1) return null;

  const nextId = index < queue.length - 1 ? queue[index + 1] : null;

  return {
    index,
    total: queue.length,
    remaining: queue.length - index - 1,
    nextId,
    isLast: index === queue.length - 1,
  };
}
