ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS podtemat text;

COMMENT ON COLUMN public.tasks.podtemat IS
  'Podtemat zadania w ramach głównego tematu (kolumna temat).';
