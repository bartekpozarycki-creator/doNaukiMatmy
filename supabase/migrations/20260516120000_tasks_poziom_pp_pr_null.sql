ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_poziom_check;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public'
      AND t.relname = 'tasks'
      AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) LIKE '%poziom%'
      AND c.conname IS DISTINCT FROM 'tasks_poziom_check'
  ) LOOP
    EXECUTE format('ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE public.tasks ALTER COLUMN poziom DROP NOT NULL;

ALTER TABLE public.tasks ADD CONSTRAINT tasks_poziom_check CHECK (
  poziom IS NULL
  OR poziom IN (
    'pp',
    'pr',
    'podstawowy',
    'rozszerzony',
    'ósmoklasisty'
  )
);
