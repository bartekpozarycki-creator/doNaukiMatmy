import { formatArkuszDisplayLabel } from "@/utils/map-db-task";

const cleanFilePart = (value) => {
  if (!value) return "";
  return String(value)
    .replace(/\.[^/.]+$/, "")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const formatFilePart = (value) => {
  const cleaned = cleanFilePart(value);
  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const normalizeLevel = (value, fallbackLevel = "podstawowy") => {
  const cleaned = cleanFilePart(value).toLowerCase();
  if (["pp", "podstawa", "podstawowy", "matura podstawowa"].includes(cleaned)) {
    return "podstawowy";
  }
  if (
    ["pr", "rozszerzenie", "rozszerzony", "matura rozszerzona"].includes(cleaned)
  ) {
    return "rozszerzony";
  }
  if (
    [
      "null",
      "brak",
      "osma klasa",
      "ósma klasa",
      "osmaklasa",
      "ósmoklasisty",
      "egzamin ósmoklasisty",
    ].includes(cleaned)
  ) {
    return "ósmoklasisty";
  }
  return cleaned || fallbackLevel;
};

export function normalizeArkuszWorksheetId(arkuszId) {
  return cleanFilePart(arkuszId);
}

export function parseArkuszWorksheetFilters(arkuszId, fallbackLevel = "podstawowy") {
  const id = normalizeArkuszWorksheetId(arkuszId);
  if (!id) return null;

  const [year = "", month = "", formula = "", level = "", ...typeParts] =
    id.split("-");
  const parsedLevel = normalizeLevel(level, fallbackLevel);

  return {
    id,
    year: cleanFilePart(year),
    month: formatFilePart(month),
    formula: formatFilePart(formula),
    level: parsedLevel,
    type: formatFilePart(typeParts.join("-")),
    searchLabel: formatArkuszDisplayLabel(id),
  };
}
