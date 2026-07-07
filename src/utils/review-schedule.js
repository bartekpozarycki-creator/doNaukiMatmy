const CORRECT_INTERVALS_DAYS = [3, 7, 14, 21, 30, 45, 60, 90];
const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
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

export function frequencyToIntervalDays(frequency) {
  const value = Math.min(100, Math.max(1, Number(frequency) || 50));
  if (value >= 71) return 1;
  if (value >= 51) return 2;
  if (value >= 41) return 3;
  if (value >= 31) return 7;
  if (value >= 21) return 14;
  if (value >= 11) return 30;
  return 60;
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
  const frequency = clamp(Number(entry.frequency ?? 50), 1, 100);

  let score = 0;
  score += wrongRate * 42;
  score += Math.min(wrongCount, 5) * 7;
  score += frequency * 0.28;
  if (lastAttempt && !lastAttempt.isCorrect) score += 18;
  score -= Math.min(correctStreak, 5) * 8;
  if (total === 1 && lastAttempt?.isCorrect) score -= 10;
  if (total >= 4 && wrongRate <= 0.25) score -= 8;

  return clamp(Math.round(score), 0, 100);
}

export function getMasteryStatus(entry = {}) {
  const attempts = Array.isArray(entry.attempts) ? entry.attempts : [];
  if (!attempts.length) return MASTERY_STATUSES.new;

  const difficultyScore =
    entry.difficultyScore ?? calculateReviewDifficulty(entry);
  const frequency = clamp(Number(entry.frequency ?? 50), 1, 100);
  const correctStreak =
    entry.correctStreak ?? countTrailingCorrectStreak(attempts);
  const lastAttempt = attempts.at(-1);
  const intervalDays = entry.intervalDays ?? frequencyToIntervalDays(frequency);
  const wrongCount = attempts.filter((attempt) => !attempt?.isCorrect).length;

  if (!lastAttempt?.isCorrect || difficultyScore >= 70 || frequency >= 75) {
    return MASTERY_STATUSES.needsWork;
  }
  if (
    correctStreak >= 4 &&
    difficultyScore <= 25 &&
    frequency <= 20 &&
    intervalDays >= 30
  ) {
    return MASTERY_STATUSES.mastered;
  }
  if (
    correctStreak >= 2 &&
    difficultyScore <= 45 &&
    frequency <= 40 &&
    intervalDays >= 14
  ) {
    return MASTERY_STATUSES.almostMastered;
  }
  if (wrongCount > 0 || correctStreak > 0 || attempts.length > 0) {
    return MASTERY_STATUSES.inProgress;
  }

  return MASTERY_STATUSES.new;
}

export function getReviewReason(entry = {}, now = new Date()) {
  const attempts = Array.isArray(entry.attempts) ? entry.attempts : [];
  const lastAttempt = attempts.at(-1);
  const difficultyScore =
    entry.difficultyScore ?? calculateReviewDifficulty(entry);
  const frequency = clamp(Number(entry.frequency ?? 50), 1, 100);
  const nextReviewAt = entry.nextReviewAt;
  const intervalDays = entry.intervalDays;

  if (lastAttempt && !lastAttempt.isCorrect) {
    return "Do powtórki, bo ostatnio był błąd";
  }
  if (difficultyScore >= 70) {
    return "Trudne zadanie: dużo błędnych prób";
  }
  if (frequency >= 70) {
    return `Wysoki priorytet: ${frequency}/100`;
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

  const status = getMasteryStatus(entry);
  if (status.id === "almostMastered") {
    return "Prawie opanowane: utrwal jeszcze raz";
  }
  if (status.id === "mastered") {
    return "Opanowane: wróć w zaplanowanym terminie";
  }

  return "W trakcie nauki";
}

export function computeReviewMetrics(entry = {}) {
  const difficultyScore = calculateReviewDifficulty(entry);
  const masteryStatus = getMasteryStatus({
    ...entry,
    difficultyScore,
  });
  const reviewReason = getReviewReason({
    ...entry,
    difficultyScore,
    masteryStatus,
  });

  return {
    difficultyScore,
    masteryStatus,
    reviewReason,
  };
}

function getWrongAttemptInterval(difficultyScore, previousWrongCount) {
  if (difficultyScore >= 85 || previousWrongCount >= 3) {
    return { intervalHours: 4, intervalDays: 0 };
  }
  if (difficultyScore >= 70 || previousWrongCount >= 2) {
    return { intervalHours: 8, intervalDays: 0 };
  }
  if (difficultyScore >= 45 || previousWrongCount >= 1) {
    return { intervalDays: 1 };
  }
  return { intervalDays: 2 };
}

function getCorrectAttemptInterval(baseIntervalDays, difficultyScore, wrongCount) {
  if (difficultyScore >= 75) return Math.max(2, Math.round(baseIntervalDays * 0.5));
  if (difficultyScore >= 55) return Math.max(2, Math.round(baseIntervalDays * 0.7));
  if (wrongCount >= 2) return Math.max(2, Math.round(baseIntervalDays * 0.85));
  return baseIntervalDays;
}

export function computeScheduleAfterAttempt(
  prevEntry,
  isCorrect,
  frequency,
  baseDate = new Date(),
) {
  const prevStreak = prevEntry?.correctStreak ?? 0;
  const previousAttempts = Array.isArray(prevEntry?.attempts)
    ? prevEntry.attempts
    : [];
  const attempts = [...previousAttempts, { isCorrect }];
  const frequencyAfter = frequency ?? prevEntry?.frequency ?? 50;
  const previousWrongCount = previousAttempts.filter(
    (attempt) => !attempt?.isCorrect,
  ).length;
  let correctStreak;
  let intervalDays = 1;
  let intervalHours = null;

  const difficultyScore = calculateReviewDifficulty({
    attempts,
    correctStreak: isCorrect ? prevStreak + 1 : 0,
    frequency: frequencyAfter,
  });

  if (isCorrect) {
    correctStreak = prevStreak + 1;
    const index = Math.min(correctStreak - 1, CORRECT_INTERVALS_DAYS.length - 1);
    intervalDays = getCorrectAttemptInterval(
      CORRECT_INTERVALS_DAYS[index],
      difficultyScore,
      previousWrongCount,
    );
  } else {
    correctStreak = 0;
    const interval = getWrongAttemptInterval(difficultyScore, previousWrongCount);
    intervalDays = interval.intervalDays ?? 0;
    intervalHours = interval.intervalHours ?? null;
  }

  const nextReviewAt = intervalHours
    ? addHours(baseDate, intervalHours)
    : addLocalDays(baseDate, intervalDays);

  return {
    correctStreak,
    intervalDays,
    intervalHours,
    nextReviewAt,
    difficultyScore,
  };
}

export function scheduleFromFrequency(frequency, baseDate = new Date()) {
  const intervalDays = frequencyToIntervalDays(frequency);
  return {
    intervalDays,
    nextReviewAt: addLocalDays(baseDate, intervalDays),
  };
}

export function resolveTaskSchedule(entry) {
  if (!entry?.attempts?.length) return null;

  if (entry.nextReviewAt) {
    const resolved = {
      ...entry,
      correctStreak: entry.correctStreak ?? countTrailingCorrectStreak(entry.attempts),
      intervalDays: entry.intervalDays ?? frequencyToIntervalDays(entry.frequency ?? 50),
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
  const intervalDays = frequencyToIntervalDays(entry.frequency ?? 50);
  const baseDate = lastAttempt?.date ? new Date(lastAttempt.date) : new Date();
  const resolved = {
    ...entry,
    correctStreak: countTrailingCorrectStreak(entry.attempts),
    intervalDays,
    intervalHours: null,
    nextReviewAt: addLocalDays(baseDate, intervalDays),
  };
  const metrics = computeReviewMetrics(resolved);

  return {
    correctStreak: resolved.correctStreak,
    intervalDays,
    intervalHours: null,
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
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return weeks === 1 ? "Za tydzień" : `Za ${weeks} tyg.`;
  }

  return new Date(nextReviewAt).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatReviewScheduleDetail(nextReviewAt, intervalDays) {
  const label = formatReviewScheduleLabel(nextReviewAt);
  const days = intervalDays ?? frequencyToIntervalDays(50);
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
