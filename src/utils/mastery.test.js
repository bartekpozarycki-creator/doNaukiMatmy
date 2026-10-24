import { describe, expect, it } from "vitest";
import {
  calculateMastery,
  getMasteryLabel,
  MASTERY_LABELS,
} from "@/utils/mastery";

function attempt(date, isCorrect) {
  return { date, isCorrect };
}

function localNoon(year, month, day, hour = 12) {
  return new Date(year, month - 1, day, hour, 0, 0).toISOString();
}

describe("calculateMastery", () => {
  it("zwraca null, gdy nie ma prób", () => {
    expect(calculateMastery([])).toBeNull();
    expect(calculateMastery(null)).toBeNull();
    expect(calculateMastery(undefined)).toBeNull();
  });

  it("zwraca 100 dla jednej poprawnej próby", () => {
    expect(calculateMastery([attempt("2026-05-01T10:00:00.000Z", true)])).toBe(100);
  });

  it("zwraca 0 dla jednej błędnej próby", () => {
    expect(calculateMastery([attempt("2026-05-01T10:00:00.000Z", false)])).toBe(0);
  });

  it("zwraca 100 dla samych poprawnych odpowiedzi", () => {
    const attempts = [0, 1, 2, 3].map((day) =>
      attempt(`2026-05-0${day + 1}T10:00:00.000Z`, true),
    );
    expect(calculateMastery(attempts)).toBe(100);
  });

  it("zwraca 0 dla samych błędnych odpowiedzi", () => {
    const attempts = [0, 1, 2, 3].map((day) =>
      attempt(`2026-05-0${day + 1}T10:00:00.000Z`, false),
    );
    expect(calculateMastery(attempts)).toBe(0);
  });

  it("stare błędy i nowe poprawne odpowiedzi dają wynik wyższy niż zwykła skuteczność", () => {
    const attempts = [
      ...[0, 1, 2].map((day) => attempt(`2026-05-0${day + 1}T10:00:00.000Z`, false)),
      ...[3, 4, 5, 6, 7].map((day) => attempt(`2026-05-0${day + 1}T10:00:00.000Z`, true)),
    ];
    const simpleRate = (5 / 8) * 100;
    const mastery = calculateMastery(attempts);
    expect(mastery).toBe(76);
    expect(mastery).toBeGreaterThan(simpleRate);
  });

  it("stare poprawne odpowiedzi i nowe błędy dają wynik niższy niż zwykła skuteczność", () => {
    const attempts = [
      ...[0, 1, 2, 3, 4].map((day) => attempt(`2026-05-0${day + 1}T10:00:00.000Z`, true)),
      ...[5, 6, 7].map((day) => attempt(`2026-05-0${day + 1}T10:00:00.000Z`, false)),
    ];
    const simpleRate = (5 / 8) * 100;
    const mastery = calculateMastery(attempts);
    expect(mastery).toBe(47);
    expect(mastery).toBeLessThan(simpleRate);
  });

  it("po usunięciu próby liczy opanowanie od nowa", () => {
    const attempts = [
      ...[0, 1, 2].map((day) => attempt(`2026-05-0${day + 1}T10:00:00.000Z`, false)),
      ...[3, 4, 5, 6, 7].map((day) => attempt(`2026-05-0${day + 1}T10:00:00.000Z`, true)),
    ];
    const withoutLast = attempts.slice(0, -1);
    expect(calculateMastery(attempts)).toBe(76);
    expect(calculateMastery(withoutLast)).toBe(70);
    expect(calculateMastery(withoutLast)).not.toBe(calculateMastery(attempts));
  });

  it("sortuje historię chronologicznie i przy tym samym czasie zachowuje pierwotną kolejność", () => {
    const shuffled = [
      attempt("2026-05-03T10:00:00.000Z", true),
      attempt("2026-05-01T10:00:00.000Z", false),
      attempt("2026-05-02T10:00:00.000Z", false),
    ];
    const chronological = [
      attempt("2026-05-01T10:00:00.000Z", false),
      attempt("2026-05-02T10:00:00.000Z", false),
      attempt("2026-05-03T10:00:00.000Z", true),
    ];
    expect(calculateMastery(shuffled)).toBe(calculateMastery(chronological));

    const sameTime = [
      attempt("2026-05-01T10:00:00.000Z", false),
      attempt("2026-05-01T10:00:00.000Z", true),
    ];
    expect(calculateMastery(sameTime)).toBe(54);
    expect(
      calculateMastery([
        attempt("2026-05-01T10:00:00.000Z", true),
        attempt("2026-05-01T10:00:00.000Z", false),
      ]),
    ).toBe(46);
  });

  it("nie mutuje oryginalnej historii", () => {
    const attempts = [
      attempt("2026-05-02T10:00:00.000Z", true),
      attempt("2026-05-01T10:00:00.000Z", false),
    ];
    const snapshot = structuredClone(attempts);
    calculateMastery(attempts);
    expect(attempts).toEqual(snapshot);
    expect(attempts[0].isCorrect).toBe(true);
  });
});

describe("getMasteryLabel", () => {
  it("nie pokazuje etykiety bez prób", () => {
    expect(getMasteryLabel(null, [])).toBeNull();
    expect(getMasteryLabel(100, [])).toBeNull();
  });

  it("jedna poprawna próba nie dostaje etykiety bardzo dobrze opanowane", () => {
    const attempts = [attempt(localNoon(2026, 5, 1), true)];
    expect(calculateMastery(attempts)).toBe(100);
    expect(getMasteryLabel(100, attempts)).toBe(MASTERY_LABELS.learning);
    expect(getMasteryLabel(100, attempts)).not.toBe(MASTERY_LABELS.veryWellMastered);
  });

  it("wysokie opanowanie i wystarczająca historia dają etykietę bardzo dobrze opanowane", () => {
    const attempts = [
      attempt(localNoon(2026, 5, 1, 12), true),
      attempt(localNoon(2026, 5, 1, 18), true),
      attempt(localNoon(2026, 5, 3, 12), true),
    ];
    expect(calculateMastery(attempts)).toBe(100);
    expect(getMasteryLabel(100, attempts)).toBe(MASTERY_LABELS.veryWellMastered);
  });

  it("trzy poprawne próby z jednego dnia zostają przy etykiecie w trakcie nauki", () => {
    const attempts = [
      attempt(localNoon(2026, 5, 1, 9), true),
      attempt(localNoon(2026, 5, 1, 12), true),
      attempt(localNoon(2026, 5, 1, 18), true),
    ];
    expect(getMasteryLabel(100, attempts)).toBe(MASTERY_LABELS.learning);
  });
});
