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

CREATE TABLE IF NOT EXISTS public.user_progress_sync (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
);

ALTER TABLE public.user_progress_sync ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own synced progress" ON public.user_progress_sync;
CREATE POLICY "Users can read own synced progress"
ON public.user_progress_sync
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own synced progress" ON public.user_progress_sync;
CREATE POLICY "Users can insert own synced progress"
ON public.user_progress_sync
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own synced progress" ON public.user_progress_sync;
CREATE POLICY "Users can update own synced progress"
ON public.user_progress_sync
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
