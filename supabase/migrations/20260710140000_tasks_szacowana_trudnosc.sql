ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS szacowana_trudnosc text;

COMMENT ON COLUMN public.tasks.szacowana_trudnosc IS
  'Bazowa szacowana trudność: opanowane, bardzo_latwe, latwe, raczej_latwe, srednie, raczej_trudne, trudne, bardzo_trudne';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tasks'
      AND column_name = 'trudnosc'
  ) THEN
    UPDATE public.tasks
    SET szacowana_trudnosc = trudnosc
    WHERE szacowana_trudnosc IS NULL
      AND trudnosc IS NOT NULL;
  END IF;
END $$;
