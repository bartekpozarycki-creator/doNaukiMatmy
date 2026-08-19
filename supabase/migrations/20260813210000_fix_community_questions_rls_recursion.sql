-- Naprawa: infinite recursion detected in policy for relation "community_questions"
-- Uruchom w Supabase → SQL Editor (cały skrypt).

CREATE OR REPLACE FUNCTION public.is_app_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.app_admins
    WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_app_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_app_admin() TO anon, authenticated;

ALTER TABLE public.community_questions ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_questions'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.community_questions',
      pol.policyname
    );
  END LOOP;
END
$$;

CREATE POLICY "community_questions_select"
  ON public.community_questions
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'approved'
    OR author_id = auth.uid()
    OR public.is_app_admin()
  );

CREATE POLICY "community_questions_insert_own"
  ON public.community_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "community_questions_update"
  ON public.community_questions
  FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid()
    OR public.is_app_admin()
  )
  WITH CHECK (
    author_id = auth.uid()
    OR public.is_app_admin()
  );

CREATE POLICY "community_questions_delete"
  ON public.community_questions
  FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid()
    OR public.is_app_admin()
  );
