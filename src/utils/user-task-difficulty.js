import { calculateMastery, getMasteryLabel } from "@/utils/mastery";
import {
  difficultyTierToLevel,
  resolveBaseDifficultyTier,
  resolvePersonalDifficultyTier,
} from "@/utils/review-schedule";

export function resolveUserTaskDifficulty(task, progressEntry) {
  const baseRaw =
    task?.szacowanaTrudnosc ?? progressEntry?.baseDifficulty ?? null;
  const baseTier = resolveBaseDifficultyTier(baseRaw);
  const attempts = Array.isArray(progressEntry?.attempts)
    ? progressEntry.attempts
    : [];
  const mastery = calculateMastery(attempts);
  const masteryLabel = getMasteryLabel(mastery, attempts);

  if (!attempts.length) {
    return {
      raw: baseTier,
      tier: baseTier,
      level: difficultyTierToLevel(baseTier),
      isMastered: false,
      isPersonalized: false,
      baseRaw,
      baseTier,
      mastery: null,
      masteryLabel: null,
    };
  }

  const tier = resolvePersonalDifficultyTier(
    {
      ...progressEntry,
      baseDifficulty: baseRaw,
    },
    baseRaw,
  );

  return {
    raw: tier,
    tier,
    level: difficultyTierToLevel(tier),
    isMastered: false,
    isPersonalized: tier !== baseTier,
    baseRaw,
    baseTier,
    mastery,
    masteryLabel,
  };
}
