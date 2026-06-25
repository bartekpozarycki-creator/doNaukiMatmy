const CORRECT_INTERVALS_DAYS = [3, 7, 14, 21, 30, 45, 60, 90];
const WRONG_INTERVAL_DAYS = 1;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

export function computeScheduleAfterAttempt(prevEntry, isCorrect) {
  const prevStreak = prevEntry?.correctStreak ?? 0;
  let correctStreak;
  let intervalDays;

  if (isCorrect) {
    correctStreak = prevStreak + 1;
    const index = Math.min(correctStreak - 1, CORRECT_INTERVALS_DAYS.length - 1);
    intervalDays = CORRECT_INTERVALS_DAYS[index];
  } else {
    correctStreak = 0;
    intervalDays = WRONG_INTERVAL_DAYS;
  }

  const nextReviewAt = addLocalDays(new Date(), intervalDays);

  return {
    correctStreak,
    intervalDays,
    nextReviewAt,
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
    return {
      correctStreak: entry.correctStreak ?? countTrailingCorrectStreak(entry.attempts),
      intervalDays: entry.intervalDays ?? frequencyToIntervalDays(entry.frequency ?? 50),
      nextReviewAt: entry.nextReviewAt,
    };
  }

  const lastAttempt = entry.attempts.at(-1);
  const intervalDays = frequencyToIntervalDays(entry.frequency ?? 50);
  const baseDate = lastAttempt?.date ? new Date(lastAttempt.date) : new Date();

  return {
    correctStreak: countTrailingCorrectStreak(entry.attempts),
    intervalDays,
    nextReviewAt: addLocalDays(baseDate, intervalDays),
  };
}

export function daysUntilReview(nextReviewAt, now = new Date()) {
  if (!nextReviewAt) return 0;
  const dueDay = startOfLocalDay(nextReviewAt).getTime();
  const today = startOfLocalDay(now).getTime();
  return Math.round((dueDay - today) / MS_PER_DAY);
}

export function isReviewDue(nextReviewAt, now = new Date()) {
  return daysUntilReview(nextReviewAt, now) <= 0;
}

export function formatReviewScheduleLabel(nextReviewAt, now = new Date()) {
  if (!nextReviewAt) return "Dziś";

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
  const intervalLabel =
    days === 1 ? "co 1 dzień" : days < 5 ? `co ${days} dni` : `co ${days} dni`;

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
