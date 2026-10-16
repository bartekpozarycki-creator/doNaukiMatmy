-- Stem (wstęp wspólny) + podpunkty 12.1 / 12.2 / …
-- parent_id wskazuje wiersz-pień (task_kind = 'stem').
-- task_kind = 'stem' | 'closed' | 'open' (stem bez odpowiedzi / punktacji).

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS tasks_parent_id_idx ON public.tasks (parent_id);

COMMENT ON COLUMN public.tasks.parent_id IS
  'FK do wiersza-pnia (task_kind=stem) dla podpunktów np. 12.1 → stem nr 12';

ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_task_kind_check;

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_task_kind_check
  CHECK (task_kind IS NULL OR task_kind IN ('closed', 'open', 'stem'));
