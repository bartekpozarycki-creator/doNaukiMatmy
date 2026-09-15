-- Publiczny odczyt zadań dla klucza anon (aplikacja React).
-- Uruchom w Supabase → SQL Editor (cały skrypt).
--
-- Bez tej polityki RLS zwraca pustą listę bez błędu — wygląda jakby
-- tabela tasks była pusta.

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tasks_select_public" ON public.tasks;

CREATE POLICY "tasks_select_public"
  ON public.tasks
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.tasks TO anon, authenticated;
