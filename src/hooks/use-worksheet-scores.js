import { useMemo } from "react";
import {
  buildWorksheetQuestionScores,
  getWorksheetScoreRows,
  getWorksheetScoreSummary,
  getWorksheetTotalPoints,
  sumQuestionScoreEntries,
} from "@/utils/worksheet-scores";

export function useWorksheetScores({
  questions = [],
  answers = {},
  checkedQuestionIds = {},
  selfAwardedPoints = {},
  overrideScores = null,
}) {
  const totalMax = useMemo(
    () => getWorksheetTotalPoints(questions),
    [questions],
  );

  const liveScores = useMemo(
    () =>
      buildWorksheetQuestionScores({
        questions,
        answersMap: answers,
        checkedIds: checkedQuestionIds,
        selfPoints: selfAwardedPoints,
      }),
    [questions, answers, checkedQuestionIds, selfAwardedPoints],
  );

  const finalScores = useMemo(
    () =>
      buildWorksheetQuestionScores({
        questions,
        answersMap: answers,
        checkedIds: checkedQuestionIds,
        selfPoints: selfAwardedPoints,
        countUngradedAsZero: true,
      }),
    [questions, answers, checkedQuestionIds, selfAwardedPoints],
  );

  const questionScores = overrideScores ?? liveScores;

  const summary = useMemo(
    () =>
      getWorksheetScoreSummary({
        questions,
        questionScores,
        totalMax,
        onlyGraded: !overrideScores,
      }),
    [questions, questionScores, totalMax, overrideScores],
  );

  const finalSummary = useMemo(
    () =>
      getWorksheetScoreSummary({
        questions,
        questionScores: overrideScores ?? finalScores,
        totalMax,
        onlyGraded: false,
      }),
    [questions, overrideScores, finalScores, totalMax],
  );

  const rows = useMemo(
    () => getWorksheetScoreRows(questions, questionScores),
    [questions, questionScores],
  );

  const buildFinalSnapshot = () => ({
    questionScores: finalScores,
    score: sumQuestionScoreEntries(finalScores).earned,
    total: totalMax,
    summary: finalSummary,
  });

  return {
    questionScores,
    liveScores,
    finalScores,
    summary,
    finalSummary,
    rows,
    totalMax,
    buildFinalSnapshot,
  };
}
