const COMMUNITY_TOPIC_KEYS = [
  "liczby_rzeczywiste",
  "wyrazenia_algebraiczne",
  "funkcje",
  "ciagi",
  "trygonometria",
  "planimetria",
  "geometria_analityczna",
  "stereometria",
  "kombinatoryka_i_statystyka",
  "optymalizacja_i_rozniczkowy",
  "ogólne",
];

function normalizeTaskTopic(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function toTopicKey(value) {
  return normalizeTaskTopic(value).replace(/\s+/g, "_");
}

const COMMUNITY_TOPIC_LOOKUP = new Map(
  COMMUNITY_TOPIC_KEYS.flatMap((key) => {
    const normalized = normalizeTaskTopic(key);
    return [
      [normalized, key],
      [toTopicKey(key), key],
    ];
  }),
);

const TASK_TOPIC_ALIASES = {
  algebra: "wyrazenia_algebraiczne",
  analiza: "optymalizacja_i_rozniczkowy",
  rozniczkowanie: "optymalizacja_i_rozniczkowy",
  optymalizacja: "optymalizacja_i_rozniczkowy",
  geometria: "planimetria",
  "teoria liczb": "liczby_rzeczywiste",
  teoria_liczb: "liczby_rzeczywiste",
  liczby: "liczby_rzeczywiste",
  arytmetyka: "liczby_rzeczywiste",
  potegi: "liczby_rzeczywiste",
  funkcje: "funkcje",
  ciagi: "ciagi",
  trygonometria: "trygonometria",
  planimetria: "planimetria",
  "geometria analityczna": "geometria_analityczna",
  geometria_analityczna: "geometria_analityczna",
  stereometria: "stereometria",
  kombinatoryka: "kombinatoryka_i_statystyka",
  statystyka: "kombinatoryka_i_statystyka",
  prawdopodobienstwo: "kombinatoryka_i_statystyka",
  ogolne: "ogólne",
};

export function communityTopicFromTaskTopic(taskTopic) {
  if (!taskTopic || taskTopic === "—") return "ogólne";

  const normalized = normalizeTaskTopic(taskTopic);
  const key = toTopicKey(taskTopic);

  return (
    COMMUNITY_TOPIC_LOOKUP.get(key) ||
    COMMUNITY_TOPIC_LOOKUP.get(normalized) ||
    TASK_TOPIC_ALIASES[normalized] ||
    TASK_TOPIC_ALIASES[key] ||
    "ogólne"
  );
}
