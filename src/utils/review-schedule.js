import {
  isTaskMasteredDifficulty,
  resolveTaskDifficultyTier,
  TASK_DIFFICULTY_TIER_ORDER,
} from "@/utils/map-db-task";

const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const TASK_REVIEW_STATUS_ORDER = [
  "opanowane",
  "bardzo_latwe",
  "latwe",
  "raczej_latwe",
  "srednie",
  "raczej_trudne",
  "trudne",
  "bardzo_trudne",
];

const STATUS_INTERVALS = {
  opanowane: {
    label: "Opanowane",
    correctDays: [14, 21, 30, 45],
    wrong: { intervalDays: 3 },
  },
  bardzo_latwe: {
    label: "Bardzo łatwe",
    correctDays: [10, 14, 21, 30],
    wrong: { intervalDays: 2 },
  },
  latwe: {
    label: "Łatwe",
    correctDays: [7, 10, 14, 21],
    wrong: { intervalDays: 2 },
  },
  raczej_latwe: {
    label: "Raczej łatwe",
    correctDays: [5, 7, 10, 14],
    wrong: { intervalDays: 1 },
  },
  srednie: {
    label: "Średnie",
    correctDays: [3, 5, 7, 10],
    wrong: { intervalDays: 1 },
  },
  raczej_trudne: {
    label: "Raczej trudne",
    correctDays: [2, 3, 5, 7],
    wrong: { intervalHours: 8, intervalDays: 0 },
  },
  trudne: {
    label: "Trudne",
    correctDays: [1, 2, 3, 5],
    wrong: { intervalHours: 4, intervalDays: 0 },
  },
  bardzo_trudne: {
    label: "Bardzo trudne",
    correctDays: [1, 1, 2, 3],
    wrong: { intervalHours: 4, intervalDays: 0 },
  },
};

const MASTERY_STATUSES = {
  new: { id: "new", label: "Nowe" },
  needsWork: { id: "needsWork", label: "Do poprawy" },
  inProgress: { id: "inProgress", label: "W trakcie" },
  almostMastered: { id: "almostMastered", label: "Prawie opanowane" },
  mastered: { id: "mastered", label: "Opanowane" },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function startOfLocalDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addLocalDays(date, days) {
  const d = startOfLocalDay(date);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function addHours(date, hours) {
  return new Date(date.getTime() + hours * MS_PER_HOUR).toISOString();
}

export function countTrailingCorrectStreak(attempts = []) {
  let streak = 0;
  for (let i = attempts.length - 1; i >= 0; i -= 1) {
    if (attempts[i]?.isCorrect) streak += 1;
    else break;
  }
  return streak;
}

export function countTrailingWrongStreak(attempts = []) {
  let streak = 0;
  for (let i = attempts.length - 1; i >= 0; i -= 1) {
    if (!attempts[i]?.isCorrect) streak += 1;
    else break;
  }
  return streak;
}

export function normalizeReviewStatus(raw) {
  if (isTaskMasteredDifficulty(raw)) return "opanowane";
  const tier = resolveTaskDifficultyTier(raw);
  if (tier && STATUS_INTERVALS[tier]) return tier;
  return "srednie";
}

export function getReviewStatusMeta(status) {
  const id = normalizeReviewStatus(status);
  return {
    id,
    label: STATUS_INTERVALS[id]?.label ?? "Średnie",
  };
}

export function statusToPriority(status) {
  const id = normalizeReviewStatus(status);
  const index = TASK_REVIEW_STATUS_ORDER.indexOf(id);
  return index >= 0 ? index : TASK_REVIEW_STATUS_ORDER.indexOf("srednie");
}

function tierIndex(tier) {
  const index = TASK_DIFFICULTY_TIER_ORDER.indexOf(tier);
  return index >= 0 ? index : TASK_DIFFICULTY_TIER_ORDER.indexOf("srednie");
}

function indexToTier(index) {
  const clamped = Math.min(
    TASK_DIFFICULTY_TIER_ORDER.length - 1,
    Math.max(0, index),
  );
  return TASK_DIFFICULTY_TIER_ORDER[clamped];
}

export function resolveReviewStatusFromAttempts(
  entry = {},
  baseDifficulty = null,
) {
  const attempts = Array.isArray(entry.attempts) ? entry.attempts : [];
  if (!attempts.length) {
    if (isTaskMasteredDifficulty(baseDifficulty)) return "opanowane";
    return normalizeReviewStatus(baseDifficulty);
  }

  const difficultyScore =
    entry.difficultyScore ?? calculateReviewDifficulty(entry);
  const correctStreak =
    entry.correctStreak ?? countTrailingCorrectStreak(attempts);
  const wrongStreak = countTrailingWrongStreak(attempts);
  const wrongCount = attempts.filter((attempt) => !attempt?.isCorrect).length;
  const wrongRate = wrongCount / attempts.length;
  const lastAttempt = attempts.at(-1);

  if (
    lastAttempt?.isCorrect &&
    correctStreak >= 4 &&
    difficultyScore <= 25 &&
    wrongRate <= 0.2
  ) {
    return "opanowane";
  }

  let index = tierIndex(
    resolveTaskDifficultyTier(baseDifficulty) ?? "srednie",
  );

  if (wrongStreak >= 3) {
    index = Math.max(index, tierIndex("bardzo_trudne"));
  } else if (wrongStreak === 2) {
    index = Math.min(index + 2, TASK_DIFFICULTY_TIER_ORDER.length - 1);
  } else if (wrongStreak === 1) {
    index = Math.min(index + 1, TASK_DIFFICULTY_TIER_ORDER.length - 1);
  }

  if (wrongRate >= 0.5 && attempts.length >= 4) {
    index = Math.min(index + 1, TASK_DIFFICULTY_TIER_ORDER.length - 1);
  }

  if (wrongStreak === 0 && correctStreak >= 2) {
    index = Math.max(0, index - 1);
  }
  if (wrongStreak === 0 && correctStreak >= 4 && wrongRate <= 0.2) {
    index = Math.max(0, index - 1);
  }

  if (
    lastAttempt?.isCorrect &&
    correctStreak >= 3 &&
    difficultyScore <= 35 &&
    index <= tierIndex("bardzo_latwe")
  ) {
    return "bardzo_latwe";
  }

  return indexToTier(index);
}

export function calculateReviewDifficulty(entry = {}) {
  const attempts = Array.isArray(entry.attempts) ? entry.attempts : [];
  if (!attempts.length) return 0;

  const total = attempts.length;
  const wrongCount = attempts.filter((attempt) => !attempt?.isCorrect).length;
  const wrongRate = wrongCount / total;
  const lastAttempt = attempts.at(-1);
  const correctStreak =
    entry.correctStreak ?? countTrailingCorrectStreak(attempts);
  const statusPriority = statusToPriority(
    entry.reviewStatus ?? entry.status ?? "srednie",
  );

  let score = 0;
  score += wrongRate * 42;
  score += Math.min(wrongCount, 5) * 7;
  score += statusPriority * 6;
  if (lastAttempt && !lastAttempt.isCorrect) score += 18;
  score -= Math.min(correctStreak, 5) * 8;
  if (total === 1 && lastAttempt?.isCorrect) score -= 10;
  if (total >= 4 && wrongRate <= 0.25) score -= 8;

  return clamp(Math.round(score), 0, 100);
}

export function getMasteryStatus(entry = {}) {
  const attempts = Array.isArray(entry.attempts) ? entry.attempts : [];
  if (!attempts.length) return MASTERY_STATUSES.new;

  const reviewStatus =
    entry.reviewStatus ??
    resolveReviewStatusFromAttempts(entry, entry.baseDifficulty);
  if (reviewStatus === "opanowane") return MASTERY_STATUSES.mastered;
  if (reviewStatus === "bardzo_trudne" || reviewStatus === "trudne") {
    return MASTERY_STATUSES.needsWork;
  }
  if (reviewStatus === "bardzo_latwe" || reviewStatus === "latwe") {
    return MASTERY_STATUSES.almostMastered;
  }
  return MASTERY_STATUSES.inProgress;
}

export function getReviewReason(entry = {}, now = new Date()) {
  const attempts = Array.isArray(entry.attempts) ? entry.attempts : [];
  const lastAttempt = attempts.at(-1);
  const reviewStatus = normalizeReviewStatus(
    entry.reviewStatus ??
      resolveReviewStatusFromAttempts(entry, entry.baseDifficulty),
  );
  const statusMeta = getReviewStatusMeta(reviewStatus);
  const nextReviewAt = entry.nextReviewAt;
  const intervalDays = entry.intervalDays;

  if (lastAttempt && !lastAttempt.isCorrect) {
    return "Do powtórki, bo ostatnio był błąd";
  }
  if (reviewStatus === "bardzo_trudne" || reviewStatus === "trudne") {
    return `Status „${statusMeta.label}”: wróć częściej`;
  }
  if (nextReviewAt && isReviewDue(nextReviewAt, now)) {
    if (new Date(nextReviewAt).getTime() > now.getTime()) {
      return "Do powtórki w ciągu 24h";
    }
    if (intervalDays && intervalDays >= 7) {
      return `Do powtórki, bo minęło ${intervalDays} dni`;
    }
    return "Do powtórki, bo termin już nadszedł";
  }
  if (reviewStatus === "opanowane") {
    return "Opanowane: wróć w zaplanowanym terminie";
  }
  if (reviewStatus === "bardzo_latwe" || reviewStatus === "latwe") {
    return `Status „${statusMeta.label}”: dłuższy odstęp między powtórkami`;
  }

  return `Status „${statusMeta.label}”`;
}

export function computeReviewMetrics(entry = {}) {
  const reviewStatus = normalizeReviewStatus(
    entry.reviewStatus ??
      resolveReviewStatusFromAttempts(entry, entry.baseDifficulty),
  );
  const difficultyScore = calculateReviewDifficulty({
    ...entry,
    reviewStatus,
  });
  const masteryStatus = getMasteryStatus({
    ...entry,
    reviewStatus,
    difficultyScore,
  });
  const reviewReason = getReviewReason({
    ...entry,
    reviewStatus,
    difficultyScore,
    masteryStatus,
  });

  return {
    reviewStatus,
    difficultyScore,
    masteryStatus,
    reviewReason,
  };
}

function getIntervalForStatus(status, isCorrect, correctStreak) {
  const config =
    STATUS_INTERVALS[normalizeReviewStatus(status)] ?? STATUS_INTERVALS.srednie;

  if (!isCorrect) {
    return {
      intervalDays: config.wrong.intervalDays ?? 0,
      intervalHours: config.wrong.intervalHours ?? null,
    };
  }

  const daysList = config.correctDays;
  const index = Math.min(
    Math.max((correctStreak || 1) - 1, 0),
    daysList.length - 1,
  );
  return {
    intervalDays: daysList[index],
    intervalHours: null,
  };
}

export function computeScheduleAfterAttempt(
  prevEntry,
  isCorrect,
  baseDifficulty = null,
  baseDate = new Date(),
) {
  const prevStreak = prevEntry?.correctStreak ?? 0;
  const previousAttempts = Array.isArray(prevEntry?.attempts)
    ? prevEntry.attempts
    : [];
  const attempts = [...previousAttempts, { isCorrect }];
  const correctStreak = isCorrect ? prevStreak + 1 : 0;

  const provisionalEntry = {
    ...prevEntry,
    attempts,
    correctStreak,
    baseDifficulty:
      baseDifficulty ?? prevEntry?.baseDifficulty ?? null,
  };
  const reviewStatus = resolveReviewStatusFromAttempts(
    provisionalEntry,
    provisionalEntry.baseDifficulty,
  );
  const difficultyScore = calculateReviewDifficulty({
    ...provisionalEntry,
    reviewStatus,
  });

  const interval = getIntervalForStatus(
    reviewStatus,
    isCorrect,
    correctStreak,
  );
  const intervalDays = interval.intervalDays ?? 0;
  const intervalHours = interval.intervalHours ?? null;

  const nextReviewAt = intervalHours
    ? addHours(baseDate, intervalHours)
    : addLocalDays(baseDate, intervalDays);

  return {
    correctStreak,
    intervalDays,
    intervalHours,
    nextReviewAt,
    difficultyScore,
    reviewStatus,
  };
}

export function scheduleFromStatus(status, correctStreak = 1, baseDate = new Date()) {
  const interval = getIntervalForStatus(status, true, correctStreak);
  return {
    intervalDays: interval.intervalDays,
    intervalHours: interval.intervalHours,
    nextReviewAt: interval.intervalHours
      ? addHours(baseDate, interval.intervalHours)
      : addLocalDays(baseDate, interval.intervalDays ?? 1),
  };
}

export function resolveTaskSchedule(entry) {
  if (!entry?.attempts?.length) return null;

  const reviewStatus = normalizeReviewStatus(
    entry.reviewStatus ??
      resolveReviewStatusFromAttempts(entry, entry.baseDifficulty),
  );

  if (entry.nextReviewAt) {
    const resolved = {
      ...entry,
      reviewStatus,
      correctStreak:
        entry.correctStreak ?? countTrailingCorrectStreak(entry.attempts),
      intervalDays:
        entry.intervalDays ??
        getIntervalForStatus(
          reviewStatus,
          true,
          entry.correctStreak ?? countTrailingCorrectStreak(entry.attempts),
        ).intervalDays,
      intervalHours: entry.intervalHours ?? null,
      nextReviewAt: entry.nextReviewAt,
    };
    const metrics = computeReviewMetrics(resolved);
    return {
      correctStreak: resolved.correctStreak,
      intervalDays: resolved.intervalDays,
      intervalHours: resolved.intervalHours,
      nextReviewAt: resolved.nextReviewAt,
      ...metrics,
    };
  }

  const lastAttempt = entry.attempts.at(-1);
  const correctStreak = countTrailingCorrectStreak(entry.attempts);
  const interval = getIntervalForStatus(
    reviewStatus,
    Boolean(lastAttempt?.isCorrect),
    correctStreak,
  );
  const baseDate = lastAttempt?.date ? new Date(lastAttempt.date) : new Date();
  const nextReviewAt = interval.intervalHours
    ? addHours(baseDate, interval.intervalHours)
    : addLocalDays(baseDate, interval.intervalDays ?? 1);
  const resolved = {
    ...entry,
    reviewStatus,
    correctStreak,
    intervalDays: interval.intervalDays ?? 0,
    intervalHours: interval.intervalHours ?? null,
    nextReviewAt,
  };
  const metrics = computeReviewMetrics(resolved);

  return {
    correctStreak: resolved.correctStreak,
    intervalDays: resolved.intervalDays,
    intervalHours: resolved.intervalHours,
    nextReviewAt: resolved.nextReviewAt,
    ...metrics,
  };
}

export function daysUntilReview(nextReviewAt, now = new Date()) {
  if (!nextReviewAt) return 0;
  const dueDay = startOfLocalDay(nextReviewAt).getTime();
  const today = startOfLocalDay(now).getTime();
  return Math.round((dueDay - today) / MS_PER_DAY);
}

export function isReviewDue(nextReviewAt, now = new Date()) {
  if (!nextReviewAt) return true;
  return new Date(nextReviewAt).getTime() <= now.getTime() + MS_PER_DAY;
}

export function formatReviewScheduleLabel(nextReviewAt, now = new Date()) {
  if (!nextReviewAt) return "Dziś";

  const diffMs = new Date(nextReviewAt).getTime() - now.getTime();
  if (diffMs > 0 && diffMs < MS_PER_DAY) {
    const hours = Math.max(1, Math.ceil(diffMs / MS_PER_HOUR));
    return `Za ${hours} godz.`;
  }

  const days = daysUntilReview(nextReviewAt, now);

  if (days < 0) {
    const overdue = Math.abs(days);
    if (overdue === 1) return "1 dzień po terminie";
    return `${overdue} dni po terminie`;
  }
  if (days === 0) return "Dziś";
  if (days === 1) return "Jutro";
  if (days < 7) return `Za ${days} dni`;
  if (days < 14) return "Za tydzień";
  return "Za dwa tygodnie";
}

export function formatReviewScheduleDetail(nextReviewAt, intervalDays) {
  const label = formatReviewScheduleLabel(nextReviewAt);
  const days = intervalDays ?? 3;
  const diffMs = nextReviewAt
    ? new Date(nextReviewAt).getTime() - Date.now()
    : null;
  const intervalLabel =
    days === 0 && diffMs && diffMs > 0
      ? `co ${Math.max(1, Math.ceil(diffMs / MS_PER_HOUR))} godz.`
      : days === 1
        ? "co 1 dzień"
        : `co ${days} dni`;

  return { label, intervalLabel };
}

export function getScheduleBadgeClass(nextReviewAt, now = new Date()) {
  const days = daysUntilReview(nextReviewAt, now);
  if (days < 0) {
    return "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300";
  }
  if (days === 0) {
    return "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200";
  }
  if (days <= 3) {
    return "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200";
  }
  return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300";
}

export function getReviewStatusBadgeClass(status) {
  const id = normalizeReviewStatus(status);
  switch (id) {
    case "opanowane":
      return "border-violet-400/50 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm shadow-violet-500/25 dark:border-violet-400/40 dark:from-violet-600 dark:to-purple-700 dark:text-violet-50";
    case "bardzo_latwe":
      return "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300";
    case "latwe":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "raczej_latwe":
      return "border-green-300 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-950/50 dark:text-green-300";
    case "srednie":
      return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200";
    case "raczej_trudne":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300";
    case "trudne":
      return "border-rose-400 bg-rose-100 text-rose-900 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200";
    case "bardzo_trudne":
      return "border-red-800/40 bg-gradient-to-r from-red-700 to-rose-900 text-white shadow-sm shadow-red-900/20 dark:border-red-500/40 dark:from-red-800 dark:to-rose-950 dark:text-red-50";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300";
  }
}
