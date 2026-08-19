import {
  isTaskMasteredDifficulty,
  resolveTaskDifficultyTier,
} from "@/utils/map-db-task";
import { resolveReviewStatusFromAttempts } from "@/utils/review-schedule";

export function resolveUserTaskDifficulty(task, progressEntry) {
  const baseRaw = task?.szacowanaTrudnosc ?? null;
  const baseTier = resolveTaskDifficultyTier(baseRaw) ?? "srednie";

  if (isTaskMasteredDifficulty(baseRaw)) {
    return {
      raw: "opanowane",
      tier: "opanowane",
      isMastered: true,
      isPersonalized: false,
      baseRaw,
    };
  }

  const attempts = Array.isArray(progressEntry?.attempts)
    ? progressEntry.attempts
    : [];

  if (!attempts.length) {
    return {
      raw: baseRaw ?? baseTier,
      tier: baseTier,
      isMastered: false,
      isPersonalized: false,
      baseRaw,
    };
  }

  const reviewStatus =
    progressEntry?.reviewStatus ??
    resolveReviewStatusFromAttempts(
      {
        ...progressEntry,
        baseDifficulty: baseRaw,
      },
      baseRaw,
    );

  if (reviewStatus === "opanowane") {
    return {
      raw: "opanowane",
      tier: "opanowane",
      isMastered: true,
      isPersonalized: true,
      baseRaw,
    };
  }

  const tier = resolveTaskDifficultyTier(reviewStatus) ?? baseTier;

  return {
    raw: tier,
    tier,
    isMastered: false,
    isPersonalized: tier !== baseTier,
    baseRaw,
  };
}
