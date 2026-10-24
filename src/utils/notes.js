import { publicSupabase } from "@/supabase-config.js";
import { sampleArticles } from "@/utils/sample-articles";

export function mapDbNoteRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title ?? "",
    description: row.description ?? "",
    topic: row.topic ?? "",
    subtopic: row.subtopic ?? "",
    contentModes: Array.isArray(row.content_modes) && row.content_modes.length > 0
      ? row.content_modes
      : ["podstawa"],
    levels: Array.isArray(row.levels) && row.levels.length > 0
      ? row.levels
      : ["podstawowy"],
    readMinutes: Number.isFinite(Number(row.read_minutes)) ? Number(row.read_minutes) : 0,
    unavailable: Boolean(row.unavailable),
    relatedTasks: row.related_tasks ?? null,
    legend: Array.isArray(row.legend) ? row.legend : [],
    sections: Array.isArray(row.sections) ? row.sections : [],
  };
}

export async function fetchNotes() {
  const { data, error } = await publicSupabase
    .from("notes")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    return { data: sampleArticles, error, fromDatabase: false };
  }

  const mapped = (data || []).map(mapDbNoteRow).filter(Boolean);
  if (mapped.length === 0) {
    return { data: sampleArticles, error: null, fromDatabase: false };
  }

  return { data: mapped, error: null, fromDatabase: true };
}

export async function fetchNoteById(id) {
  if (!id) return { data: null, error: null, fromDatabase: false };

  const { data, error } = await publicSupabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    const fallback = sampleArticles.find((article) => article.id === id) ?? null;
    return { data: fallback, error, fromDatabase: false };
  }

  if (data) {
    return { data: mapDbNoteRow(data), error: null, fromDatabase: true };
  }

  const fallback = sampleArticles.find((article) => article.id === id) ?? null;
  return { data: fallback, error: null, fromDatabase: false };
}
