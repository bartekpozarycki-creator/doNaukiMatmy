import { describe, expect, it } from "vitest";
import {
  addHours,
  addLocalDays,
  computeScheduleAfterAttempt,
  resolvePersonalDifficultyTier,
} from "@/utils/review-schedule";
import { calculateMastery } from "@/utils/mastery";

function applyAttempt(prev, isCorrect, baseDifficulty, date) {
  const schedule = computeScheduleAfterAttempt(
    prev,
    isCorrect,
    baseDifficulty,
    date,
  );
  return {
    baseDifficulty,
    attempts: [
      ...(prev?.attempts || []),
      { date: date.toISOString(), isCorrect },
    ],
    correctStreak: schedule.correctStreak,
    intervalDays: schedule.intervalDays,
    intervalHours: schedule.intervalHours,
    nextReviewAt: schedule.nextReviewAt,
    difficultyScore: schedule.difficultyScore,
    reviewStatus: schedule.reviewStatus,
  };
}

describe("harmonogram powtórek", () => {
  it("po poprawnej odpowiedzi ze średniej trudności wraca za 3 dni od północy", () => {
    const date = new Date(2026, 4, 5, 15, 30, 0);
    const schedule = computeScheduleAfterAttempt(null, true, "srednie", date);

    expect(schedule.reviewStatus).toBe("srednie");
    expect(schedule.intervalDays).toBe(3);
    expect(schedule.intervalHours).toBeNull();
    expect(schedule.nextReviewAt).toBe(addLocalDays(date, 3));
  });

  it("błąd przy średniej trudności skraca termin do 8 godzin i podnosi status harmonogramu", () => {
    const date = new Date(2026, 4, 5, 15, 30, 0);
    const schedule = computeScheduleAfterAttempt(null, false, "srednie", date);

    expect(schedule.reviewStatus).toBe("raczej_trudne");
    expect(schedule.intervalDays).toBe(0);
    expect(schedule.intervalHours).toBe(8);
    expect(schedule.nextReviewAt).toBe(addHours(date, 8));
  });

  it("trzy błędy z rzędu ustawiają bardzo trudne i termin 4 godzin", () => {
    let entry = null;
    const start = new Date(2026, 4, 5, 15, 30, 0);
    const dates = [0, 1, 2].map(
      (offset) => new Date(start.getTime() + offset * 60 * 60 * 1000),
    );

    dates.forEach((date) => {
      entry = applyAttempt(entry, false, "srednie", date);
    });

    expect(entry.reviewStatus).toBe("bardzo_trudne");
    expect(entry.intervalHours).toBe(4);
    expect(entry.nextReviewAt).toBe(addHours(dates[2], 4));
  });

  it("seria poprawnych odpowiedzi nadal kończy się statusem opanowane i odstępem 45 dni", () => {
    let entry = null;
    const dates = [1, 2, 3, 4].map((day) => new Date(2026, 4, day, 12, 0, 0));

    dates.forEach((date) => {
      entry = applyAttempt(entry, true, "latwe", date);
    });

    expect(entry.reviewStatus).toBe("opanowane");
    expect(entry.intervalDays).toBe(45);
    expect(entry.intervalHours).toBeNull();
    expect(entry.nextReviewAt).toBe(addLocalDays(dates[3], 45));
    expect(resolvePersonalDifficultyTier(entry, "latwe")).toBe("latwe");
    expect(resolvePersonalDifficultyTier(entry, "latwe")).not.toBe("opanowane");
  });

  it("wskaźnik opanowania nie zmienia terminu następnej powtórki", () => {
    const date = new Date(2026, 4, 5, 15, 30, 0);
    const prev = {
      baseDifficulty: "trudne",
      attempts: [{ date: "2026-05-01T10:00:00.000Z", isCorrect: false }],
      correctStreak: 0,
      reviewStatus: "bardzo_trudne",
      difficultyScore: 80,
    };
    const plain = computeScheduleAfterAttempt(prev, true, "trudne", date);
    const withMastery = computeScheduleAfterAttempt(
      {
        ...prev,
        mastery: 100,
        masteryLabel: "Bardzo dobrze opanowane",
        personalDifficulty: "bardzo_latwe",
      },
      true,
      "trudne",
      date,
    );

    expect(withMastery).toEqual(plain);
    expect(plain.nextReviewAt).toBe(addLocalDays(date, plain.intervalDays));
    expect(calculateMastery(prev.attempts)).not.toBeNull();
  });

  it("ta sama historia daje ten sam termin przy powtórnym liczeniu", () => {
    const date = new Date(2026, 4, 8, 9, 15, 0);
    let first = null;
    let second = null;
    [false, false, true, true].forEach((isCorrect) => {
      first = applyAttempt(first, isCorrect, "raczej_trudne", date);
      second = applyAttempt(second, isCorrect, "raczej_trudne", date);
    });

    expect(first.nextReviewAt).toBe(second.nextReviewAt);
    expect(first.reviewStatus).toBe(second.reviewStatus);
    expect(first.intervalDays).toBe(second.intervalDays);
    expect(first.intervalHours).toBe(second.intervalHours);
  });
});

describe("trudność osobista", () => {
  it("bez prób jest równa trudności bazowej, a brak bazy oznacza średnie", () => {
    expect(resolvePersonalDifficultyTier({ attempts: [] }, "trudne")).toBe("trudne");
    expect(resolvePersonalDifficultyTier({ attempts: [] }, null)).toBe("srednie");
    expect(resolvePersonalDifficultyTier({ attempts: [] }, "opanowane")).toBe(
      "srednie",
    );
  });

  it("nie schodzi poniżej bardzo łatwego i nie wychodzi ponad bardzo trudne", () => {
    const easy = {
      attempts: [1, 2, 3, 4, 5, 6].map((day) => ({
        date: `2026-05-0${day}T10:00:00.000Z`,
        isCorrect: true,
      })),
      correctStreak: 6,
      difficultyScore: 0,
    };
    const hard = {
      attempts: [1, 2, 3, 4].map((day) => ({
        date: `2026-05-0${day}T10:00:00.000Z`,
        isCorrect: false,
      })),
      correctStreak: 0,
      difficultyScore: 90,
    };

    expect(resolvePersonalDifficultyTier(easy, "bardzo_latwe")).toBe("bardzo_latwe");
    expect(resolvePersonalDifficultyTier(hard, "bardzo_trudne")).toBe(
      "bardzo_trudne",
    );
  });

  it("przed terminem następnej powtórki poprawna próba nie obniża trudności, a błędna podnosi ją tylko o jeden poziom", () => {
    const first = new Date(2026, 4, 1, 12, 0, 0);
    const soon = new Date(first.getTime() + 15 * 60 * 1000);
    const again = new Date(first.getTime() + 30 * 60 * 1000);
    const later = new Date(first.getTime() + 45 * 60 * 1000);

    const improvedTooSoon = {
      attempts: [first, soon, again].map((date) => ({
        date: date.toISOString(),
        isCorrect: true,
      })),
    };
    expect(resolvePersonalDifficultyTier(improvedTooSoon, "latwe")).toBe("latwe");

    const oneEarlyWrong = {
      attempts: [
        { date: first.toISOString(), isCorrect: true },
        { date: soon.toISOString(), isCorrect: false },
      ],
    };
    expect(resolvePersonalDifficultyTier(oneEarlyWrong, "latwe")).toBe(
      "raczej_latwe",
    );

    const severalEarlyWrongs = {
      attempts: [first, soon, again, later].map((date, index) => ({
        date: date.toISOString(),
        isCorrect: index === 0,
      })),
    };
    expect(resolvePersonalDifficultyTier(severalEarlyWrongs, "latwe")).toBe(
      "raczej_latwe",
    );
    expect(resolvePersonalDifficultyTier(severalEarlyWrongs, "latwe")).not.toBe(
      "bardzo_trudne",
    );
  });

  it("trzy błędy oddzielone trzema dniami nadal ustawiają bardzo trudne", () => {
    const entry = {
      attempts: [1, 4, 7].map((day) => ({
        date: new Date(2026, 4, day, 12, 0, 0).toISOString(),
        isCorrect: false,
      })),
    };

    expect(resolvePersonalDifficultyTier(entry, "latwe")).toBe("bardzo_trudne");
  });

  it("poprawa trudności czeka na termin następnej powtórki", () => {
    const first = new Date(2026, 4, 1, 12, 0, 0);
    const schedule = computeScheduleAfterAttempt(null, true, "latwe", first);
    const due = new Date(schedule.nextReviewAt);
    const before = new Date(due.getTime() - 60 * 60 * 1000);
    const after = new Date(due.getTime() + 60 * 60 * 1000);

    expect(
      resolvePersonalDifficultyTier(
        {
          attempts: [
            { date: first.toISOString(), isCorrect: true },
            { date: before.toISOString(), isCorrect: true },
          ],
        },
        "latwe",
      ),
    ).toBe("latwe");

    expect(
      resolvePersonalDifficultyTier(
        {
          attempts: [
            { date: first.toISOString(), isCorrect: true },
            { date: after.toISOString(), isCorrect: true },
          ],
        },
        "latwe",
      ),
    ).toBe("bardzo_latwe");
  });

  it("przy krótkim terminie godzinowym poprawa też czeka na następną powtórkę", () => {
    const first = new Date(2026, 4, 1, 12, 0, 0);
    const schedule = computeScheduleAfterAttempt(null, false, "raczej_trudne", first);
    const due = new Date(schedule.nextReviewAt);
    const tooSoon = new Date(due.getTime() - 60 * 1000);
    const onTime = new Date(due.getTime() + 60 * 1000);

    expect(schedule.intervalHours).toBe(4);
    expect(
      resolvePersonalDifficultyTier(
        {
          attempts: [
            { date: first.toISOString(), isCorrect: false },
            { date: tooSoon.toISOString(), isCorrect: true },
          ],
        },
        "raczej_trudne",
      ),
    ).toBe("trudne");
    expect(
      resolvePersonalDifficultyTier(
        {
          attempts: [
            { date: first.toISOString(), isCorrect: false },
            { date: onTime.toISOString(), isCorrect: true },
          ],
        },
        "raczej_trudne",
      ),
    ).toBe("raczej_trudne");
  });

  it("wysoka skuteczność przy trudnej bazie nie zamienia zadania w bardzo łatwe", () => {
    const entry = {
      attempts: [1, 4, 7, 10].map((day) => ({
        date: new Date(2026, 4, day, 12, 0, 0).toISOString(),
        isCorrect: true,
      })),
      correctStreak: 4,
      difficultyScore: 0,
      baseDifficulty: "bardzo_trudne",
    };

    const personal = resolvePersonalDifficultyTier(entry, "bardzo_trudne");
    expect(personal).toBe("raczej_trudne");
    expect(personal).not.toBe("opanowane");
    expect(personal).not.toBe("bardzo_latwe");
    expect(calculateMastery(entry.attempts)).toBe(100);
  });
});
