export function openPartAnswerKey(questionId, partId) {
  return `${questionId}__${partId}`;
}

export function parseOpenParts(raw) {
  if (raw == null) return null;
  let arr = raw;
  if (typeof raw === "string") {
    try {
      arr = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(arr) || arr.length === 0) return null;

  const parts = arr
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const id = String(item.id ?? index + 1);
      const label = String(item.label ?? item.prompt ?? "").trim();
      if (!label) return null;
      const expected =
        item.expected != null
          ? String(item.expected)
          : item.correct != null
            ? String(item.correct)
            : "";
      return {
        id,
        label,
        placeholder:
          typeof item.placeholder === "string" && item.placeholder.trim() !== ""
            ? item.placeholder.trim()
            : "np. [-4, 4)",
        expected: expected.trim(),
      };
    })
    .filter(Boolean);

  return parts.length > 0 ? parts : null;
}

export function getOpenPartsList(questionOrTask) {
  return questionOrTask?.open_parts ?? questionOrTask?.openParts ?? null;
}

export function hasOpenParts(questionOrTask) {
  const parts = getOpenPartsList(questionOrTask);
  return Array.isArray(parts) && parts.length > 0;
}

export function getOpenPartValue(answersMap, questionId, partId) {
  if (!answersMap || !questionId || partId == null) return "";
  const raw = answersMap[openPartAnswerKey(questionId, partId)];
  if (raw == null) return "";
  return String(raw);
}

export function normalizeIntervalAnswer(value) {
  if (value == null) return "";
  return String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/−/g, "-")
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .toLowerCase();
}

export function isOpenPartAnswerCorrect(part, userValue) {
  const expected = normalizeIntervalAnswer(part?.expected);
  if (!expected) return true;
  const user = normalizeIntervalAnswer(userValue);
  if (!user) return false;
  return user === expected;
}

export function areAllOpenPartsFilled(question, answersMap) {
  if (!hasOpenParts(question)) return false;
  const parts = getOpenPartsList(question);
  return parts.every((part) => {
    const v = getOpenPartValue(answersMap, question.id, part.id);
    return String(v).trim() !== "";
  });
}

export function isMultiOpenQuestionCorrect(question, answersMap) {
  if (!hasOpenParts(question)) return false;
  const parts = getOpenPartsList(question);
  return parts.every((part) =>
    isOpenPartAnswerCorrect(
      part,
      getOpenPartValue(answersMap, question.id, part.id),
    ),
  );
}

export function countWorksheetAnswered(questions, answersMap) {
  if (!questions?.length || !answersMap) return 0;
  let count = 0;
  for (const q of questions) {
    if (hasOpenParts(q)) {
      for (const part of getOpenPartsList(q)) {
        const v = getOpenPartValue(answersMap, q.id, part.id);
        if (String(v).trim() !== "") count += 1;
      }
    } else if (answersMap[q.id] != null && String(answersMap[q.id]).trim() !== "") {
      count += 1;
    }
  }
  return count;
}

export function clearOpenPartAnswers(prev, questionId, partIds) {
  const next = { ...prev };
  for (const partId of partIds) {
    delete next[openPartAnswerKey(questionId, partId)];
  }
  return next;
}
