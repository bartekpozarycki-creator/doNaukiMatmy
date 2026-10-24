import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sampleArticles } from "../src/utils/sample-articles.js";

const root = dirname(fileURLToPath(import.meta.url));

function sqlStr(value) {
  if (value == null || value === "") return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  return `$notesjson$${JSON.stringify(value ?? null)}$notesjson$::jsonb`;
}

function sqlTextArray(values) {
  if (!Array.isArray(values) || values.length === 0) return "'{}'::text[]";
  return `ARRAY[${values.map(sqlStr).join(", ")}]::text[]`;
}

function noteInsert(article, index) {
  return `INSERT INTO public.notes (
  id,
  title,
  description,
  topic,
  subtopic,
  content_modes,
  levels,
  read_minutes,
  unavailable,
  related_tasks,
  legend,
  sections,
  sort_order
) VALUES (
  ${sqlStr(article.id)},
  ${sqlStr(article.title)},
  ${sqlStr(article.description)},
  ${sqlStr(article.topic)},
  ${sqlStr(article.subtopic)},
  ${sqlTextArray(article.contentModes)},
  ${sqlTextArray(article.levels)},
  ${Number.isFinite(article.readMinutes) ? article.readMinutes : "NULL"},
  ${article.unavailable ? "true" : "false"},
  ${sqlJson(article.relatedTasks ?? null)},
  ${sqlJson(article.legend ?? [])},
  ${sqlJson(article.sections ?? [])},
  ${index + 1}
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  topic = EXCLUDED.topic,
  subtopic = EXCLUDED.subtopic,
  content_modes = EXCLUDED.content_modes,
  levels = EXCLUDED.levels,
  read_minutes = EXCLUDED.read_minutes,
  unavailable = EXCLUDED.unavailable,
  related_tasks = EXCLUDED.related_tasks,
  legend = EXCLUDED.legend,
  sections = EXCLUDED.sections,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();`;
}

const body = [
  "-- Notatki: tabela + wstawienie obecnych materiałów.",
  "-- Wklej CAŁY skrypt w Supabase → SQL Editor.",
  "",
  "CREATE TABLE IF NOT EXISTS public.notes (",
  "  id text PRIMARY KEY,",
  "  title text NOT NULL,",
  "  description text,",
  "  topic text,",
  "  subtopic text,",
  "  content_modes text[] NOT NULL DEFAULT ARRAY['podstawa']::text[],",
  "  levels text[] NOT NULL DEFAULT ARRAY['podstawowy']::text[],",
  "  read_minutes integer,",
  "  unavailable boolean NOT NULL DEFAULT false,",
  "  related_tasks jsonb,",
  "  legend jsonb NOT NULL DEFAULT '[]'::jsonb,",
  "  sections jsonb NOT NULL DEFAULT '[]'::jsonb,",
  "  sort_order integer NOT NULL DEFAULT 0,",
  "  created_at timestamptz NOT NULL DEFAULT now(),",
  "  updated_at timestamptz NOT NULL DEFAULT now()",
  ");",
  "",
  "ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;",
  "",
  "DROP POLICY IF EXISTS \"notes_select_public\" ON public.notes;",
  "",
  "CREATE POLICY \"notes_select_public\"",
  "  ON public.notes",
  "  FOR SELECT",
  "  TO anon, authenticated",
  "  USING (true);",
  "",
  "GRANT SELECT ON public.notes TO anon, authenticated;",
  "",
  "CREATE INDEX IF NOT EXISTS notes_topic_idx ON public.notes (topic);",
  "CREATE INDEX IF NOT EXISTS notes_sort_order_idx ON public.notes (sort_order, title);",
  "",
  ...sampleArticles.map((article, index) => noteInsert(article, index)),
  "",
].join("\n");

const out = resolve(root, "../supabase/examples/notes-seed.sql");
writeFileSync(out, body, "utf8");
console.log(`Wrote ${out} (${sampleArticles.length} notes)`);
