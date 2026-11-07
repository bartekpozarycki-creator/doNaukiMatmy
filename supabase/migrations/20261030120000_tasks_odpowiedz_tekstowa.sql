ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS odpowiedz_tekstowa text;

COMMENT ON COLUMN public.tasks.odpowiedz_tekstowa IS
  'Tekstowy schemat oceniania CKE / rozwiązanie (Markdown + LaTeX) pokazywany w arkuszu.';
