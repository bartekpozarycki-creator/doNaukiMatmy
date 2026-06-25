import {
  getOpenPartValue,
  getOpenPartsList,
  hasOpenParts,
  isOpenPartAnswerCorrect,
} from "@/utils/open-parts";

export const isOpenWorksheetQuestion = (question) =>
  question?.question_type === "open";

export const isSimpleOpenQuestion = (question) =>
  isOpenWorksheetQuestion(question) && !hasOpenParts(question);

export const getQuestionMaxPoints = (question) =>
  question?.points ?? question?.punktacja ?? 1;

export const getWorksheetTotalPoints = (questions) =>
  (questions ?? []).reduce((sum, q) => sum + getQuestionMaxPoints(q), 0);

export function getStoredAnswerValue(question, answersMap) {
  if (!question?.id || !answersMap) return "";
  const raw = answersMap[question.id];
  if (raw == null || raw === "") return "";

  const str = String(raw).trim();

  if (question.question_type === "true_false") {
    if (str === "Prawda" || str === "Fałsz") return str;
    const lower = str.toLowerCase();
    if (lower === "prawda" || lower === "true") return "Prawda";
    if (lower === "fałsz" || lower === "falsz" || lower === "false") return "Fałsz";
    return str;
  }

  if (question.options?.includes(str)) return str;

  const letterOnly = str.match(/^([A-F])$/i)?.[1]?.toUpperCase();
  if (letterOnly) {
    const byLetter = question.options?.find(
      (opt) =>
        opt.startsWith(`${letterOnly}.`) || opt.startsWith(`${letterOnly} `),
    );
    if (byLetter) return byLetter;
  }

  const letterPrefix = str.match(/^([A-F])\./i)?.[1]?.toUpperCase();
  if (letterPrefix) {
    const byPrefix = question.options?.find((opt) =>
      opt.toUpperCase().startsWith(`${letterPrefix}.`),
    );
    if (byPrefix) return byPrefix;
  }

  return str;
}

export const isQuestionGraded = (question, checkedIds, selfPoints) => {
  if (!question?.id) return false;
  if (isSimpleOpenQuestion(question)) {
    return Object.prototype.hasOwnProperty.call(selfPoints ?? {}, question.id);
  }
  return Boolean(checkedIds?.[question.id]);
};

export const isQuestionAnswerCorrect = (question, answersMap) => {
  if (hasOpenParts(question)) {
    const parts = getOpenPartsList(question);
    return parts.every((part) =>
      isOpenPartAnswerCorrect(
        part,
        getOpenPartValue(answersMap, question.id, part.id),
      ),
    );
  }
  const userVal = getStoredAnswerValue(question, answersMap);
  const correctVal = getStoredAnswerValue(question, {
    [question.id]: question.correct_answer,
  });
  return Boolean(userVal && correctVal && userVal === correctVal);
};

const computeOpenPartsEarned = (question, answersMap) => {
  const parts = getOpenPartsList(question);
  const max = getQuestionMaxPoints(question);
  if (!parts.length) return 0;
  const perPart = max / parts.length;
  let earned = 0;
  for (const part of parts) {
    if (
      isOpenPartAnswerCorrect(
        part,
        getOpenPartValue(answersMap, question.id, part.id),
      )
    ) {
      earned += perPart;
    }
  }
  return Math.min(max, Math.round(earned * 10) / 10);
};

export const sumQuestionScoreEntries = (scores, { onlyGraded = false } = {}) => {
  let earned = 0;
  let max = 0;
  for (const s of Object.values(scores ?? {})) {
    if (!s) continue;
    if (onlyGraded && !s.graded) continue;
    if (s.earned == null) continue;
    earned += Number(s.earned) || 0;
    max += s.max ?? 0;
  }
  return { earned, max };
};

export function buildWorksheetQuestionScores({
  questions = [],
  answersMap = {},
  checkedIds = {},
  selfPoints = {},
  countUngradedAsZero = false,
}) {
  const scores = {};
  questions.forEach((q) => {
    const max = getQuestionMaxPoints(q);
    const graded =
      countUngradedAsZero || isQuestionGraded(q, checkedIds, selfPoints);

    if (!graded) {
      scores[q.id] = { earned: null, max, correct: null, graded: false };
      return;
    }

    if (isSimpleOpenQuestion(q)) {
      const earned = Math.min(Math.max(0, selfPoints[q.id] ?? 0), max);
      scores[q.id] = {
        earned,
        max,
        correct: earned === max,
        selfGraded: true,
        graded: true,
      };
    } else if (hasOpenParts(q)) {
      const earned = computeOpenPartsEarned(q, answersMap);
      scores[q.id] = {
        earned,
        max,
        correct: earned >= max,
        graded: true,
      };
    } else if (!isOpenWorksheetQuestion(q)) {
      const correct = isQuestionAnswerCorrect(q, answersMap);
      scores[q.id] = {
        earned: correct ? max : 0,
        max,
        correct,
        graded: true,
      };
    } else {
      scores[q.id] = { earned: 0, max, correct: false, graded: true };
    }
  });
  return scores;
}

export function getWorksheetScoreSummary({
  questions = [],
  questionScores = {},
  totalMax,
  onlyGraded = false,
}) {
  const maxPoints = totalMax ?? getWorksheetTotalPoints(questions);
  const { earned, max: gradedMax } = sumQuestionScoreEntries(questionScores, {
    onlyGraded,
  });
  const gradedCount = Object.values(questionScores).filter((s) => s?.graded).length;

  return {
    earned,
    gradedMax,
    totalMax: maxPoints,
    gradedCount,
    totalQuestions: questions.length,
    percentage:
      maxPoints > 0 ? Math.round((earned / maxPoints) * 100) : 0,
    percentageGraded:
      gradedMax > 0 ? Math.round((earned / gradedMax) * 100) : 0,
  };
}

export function getWorksheetScoreRows(questions = [], questionScores = {}) {
  return questions.map((question) => {
    const entry = questionScores[question.id];
    return {
      questionId: question.id,
      number: question.question_number,
      max: entry?.max ?? getQuestionMaxPoints(question),
      earned: entry?.graded ? entry.earned : null,
      graded: Boolean(entry?.graded),
      correct: entry?.correct ?? null,
    };
  });
}
