-- Uruchom w Supabase → SQL Editor (raz na projekt)
-- Umożliwia odczyt zadań w aplikacji (anon + zalogowani)

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tasks_select_anon" ON public.tasks;
CREATE POLICY "tasks_select_anon"
  ON public.tasks
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "tasks_select_authenticated" ON public.tasks;
CREATE POLICY "tasks_select_authenticated"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (true);
