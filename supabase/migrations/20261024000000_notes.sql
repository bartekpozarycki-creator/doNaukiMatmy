-- Notatki dydaktyczne (treść JSONB). Publiczny odczyt jak przy tasks.

CREATE TABLE IF NOT EXISTS public.notes (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  topic text,
  subtopic text,
  content_modes text[] NOT NULL DEFAULT ARRAY['podstawa']::text[],
  levels text[] NOT NULL DEFAULT ARRAY['podstawowy']::text[],
  read_minutes integer,
  unavailable boolean NOT NULL DEFAULT false,
  related_tasks jsonb,
  legend jsonb NOT NULL DEFAULT '[]'::jsonb,
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notes_select_public" ON public.notes;

CREATE POLICY "notes_select_public"
  ON public.notes
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.notes TO anon, authenticated;

CREATE INDEX IF NOT EXISTS notes_topic_idx ON public.notes (topic);
CREATE INDEX IF NOT EXISTS notes_sort_order_idx ON public.notes (sort_order, title);
