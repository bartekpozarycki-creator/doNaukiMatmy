export const MASTERY_LAMBDA = 0.85;

export const MASTERY_LABELS = {
  needsStudy: "Wymaga nauki",
  learning: "W trakcie nauki",
  wellMastered: "Dobrze opanowane",
  veryWellMastered: "Bardzo dobrze opanowane",
};

function attemptTimestamp(attempt) {
  const timestamp = Date.parse(attempt?.date ?? "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function localCalendarDayKey(value) {
  const date = new Date(value ?? "");
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function masteryBand(mastery) {
  if (mastery <= 39) return "needsStudy";
  if (mastery <= 64) return "learning";
  if (mastery <= 84) return "wellMastered";
  return "veryWellMastered";
}

export function hasDurableMasteryEvidence(attempts) {
  if (!Array.isArray(attempts) || attempts.length < 3) return false;
  const correct = attempts.filter((attempt) => attempt?.isCorrect);
  if (correct.length < 2) return false;
  const days = new Set(
    correct.map((attempt) => localCalendarDayKey(attempt?.date)).filter(Boolean),
  );
  return days.size >= 2;
}

export function calculateMastery(attempts) {
  if (!Array.isArray(attempts) || attempts.length === 0) return null;

  const ordered = attempts
    .map((attempt, index) => ({ attempt, index }))
    .sort((a, b) => {
      const diff = attemptTimestamp(a.attempt) - attemptTimestamp(b.attempt);
      if (diff !== 0) return diff;
      return a.index - b.index;
    });

  const total = ordered.length;
  let weightedSum = 0;
  let weightSum = 0;

  for (let index = 0; index < total; index += 1) {
    const weight = MASTERY_LAMBDA ** (total - 1 - index);
    const result = ordered[index].attempt?.isCorrect ? 1 : 0;
    weightedSum += weight * result;
    weightSum += weight;
  }

  if (weightSum === 0) return null;
  return Math.round((100 * weightedSum) / weightSum);
}

export function getMasteryLabel(mastery, attempts) {
  if (!Array.isArray(attempts) || attempts.length === 0 || mastery == null) {
    return null;
  }

  const band = masteryBand(mastery);
  if (
    (band === "wellMastered" || band === "veryWellMastered") &&
    !hasDurableMasteryEvidence(attempts)
  ) {
    return MASTERY_LABELS.learning;
  }

  return MASTERY_LABELS[band];
}
