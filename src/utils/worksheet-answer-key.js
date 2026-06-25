import { publicSupabase } from "@/supabase-config.js";

const LEVEL_TO_SOURCE = {
  podstawowy: { bucket: "podstawa", answerKeyPrefix: "odpCke" },
  rozszerzony: { bucket: "rozszerzenie", answerKeyPrefix: "odpCke" },
  ósmoklasisty: { bucket: "osmaKlasa", answerKeyPrefix: "odpCke" },
};

/** np. 2015-maj-2015-pp-matura.pdf → 2015-maj-2015-pp-maturaZasady.pdf */
export function answerKeyFilename(examFilename) {
  const dot = examFilename.lastIndexOf(".");
  if (dot <= 0) return `${examFilename}Zasady.pdf`;
  return `${examFilename.slice(0, dot)}Zasady${examFilename.slice(dot)}`;
}

export function getWorksheetStorageSource(level) {
  return LEVEL_TO_SOURCE[level] ?? LEVEL_TO_SOURCE.podstawowy;
}

async function listPdfsRecursive(bucket, prefix) {
  const { data, error } = await publicSupabase.storage
    .from(bucket)
    .list(prefix, { limit: 100 });
  if (error) {
    console.error("[worksheet-answer-key] list", prefix, error);
    return [];
  }

  let pdfs = [];
  for (const obj of data ?? []) {
    if (!obj.name.includes(".")) {
      const deeper = await listPdfsRecursive(bucket, `${prefix}/${obj.name}`);
      pdfs = pdfs.concat(deeper);
    } else if (obj.name.toLowerCase().endsWith(".pdf")) {
      pdfs.push({ name: obj.name, fullPath: `${prefix}/${obj.name}` });
    }
  }
  return pdfs;
}

export async function resolveWorksheetAnswerKeyUrl(worksheetId, level) {
  if (!worksheetId) return null;

  const src = getWorksheetStorageSource(level);
  const examFilename = worksheetId.toLowerCase().endsWith(".pdf")
    ? worksheetId
    : `${worksheetId}.pdf`;
  const keyFilename = answerKeyFilename(examFilename);

  const keyObjects = await listPdfsRecursive(src.bucket, src.answerKeyPrefix);
  const match = keyObjects.find((o) => o.name === keyFilename);
  if (!match) return null;

  return publicSupabase.storage.from(src.bucket).getPublicUrl(match.fullPath)
    .data.publicUrl;
}

export function answerKeyPdfUrlWithPage(baseUrl, page) {
  if (!baseUrl) return null;
  const base = baseUrl.split("#")[0];
  const pageNum = Math.max(1, Math.floor(Number(page) || 1));
  return `${base}#page=${pageNum}`;
}

export function resolveAnswerKeyPage(question) {
  const keyPage = Number(question?.key_nr ?? question?.keyNr);
  if (Number.isFinite(keyPage) && keyPage > 0) {
    return Math.floor(keyPage);
  }
  const fallback = Number(question?.nr ?? question?.question_number);
  if (Number.isFinite(fallback) && fallback > 0) {
    return Math.floor(fallback);
  }
  return 1;
}
