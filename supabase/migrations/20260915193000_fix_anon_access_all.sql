-- =============================================================================
-- Naprawa dostępu dla klucza anon (publikacja)
-- Uruchom CAŁY skrypt w Supabase → SQL Editor (jednym razem).
--
-- Po service_role → anon RLS blokuje odczyt bez polityk (puste listy bez błędu).
-- Ten skrypt ustawia bezpieczny publiczny odczyt treści + prywatne dane użytkownika.
-- =============================================================================

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

-- -----------------------------------------------------------------------------
-- Helper: drop all policies on a table
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._drop_all_policies(target_schema text, target_table text)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = target_schema
      AND tablename = target_table
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      pol.policyname,
      target_schema,
      target_table
    );
  END LOOP;
END;
$$;

-- =============================================================================
-- 1) tasks — publiczny odczyt
-- =============================================================================
DO $$
BEGIN
  IF to_regclass('public.tasks') IS NOT NULL THEN
    ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
    PERFORM public._drop_all_policies('public', 'tasks');

    CREATE POLICY "tasks_select_public"
      ON public.tasks
      FOR SELECT
      TO anon, authenticated
      USING (true);

    GRANT SELECT ON public.tasks TO anon, authenticated;
  END IF;
END $$;

-- =============================================================================
-- 2) app_admins — użytkownik widzi tylko swój wiersz (check admina w appce)
-- =============================================================================
DO $$
BEGIN
  IF to_regclass('public.app_admins') IS NOT NULL THEN
    ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;
    PERFORM public._drop_all_policies('public', 'app_admins');

    CREATE POLICY "app_admins_select_own"
      ON public.app_admins
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());

    GRANT SELECT ON public.app_admins TO authenticated;
  END IF;
END $$;

-- =============================================================================
-- 3) user_progress_sync — tylko własne dane (cloud sync)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_progress_sync (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
);

ALTER TABLE public.user_progress_sync ENABLE ROW LEVEL SECURITY;
SELECT public._drop_all_policies('public', 'user_progress_sync');

CREATE POLICY "user_progress_sync_select_own"
  ON public.user_progress_sync
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_progress_sync_insert_own"
  ON public.user_progress_sync
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_progress_sync_update_own"
  ON public.user_progress_sync
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_progress_sync_delete_own"
  ON public.user_progress_sync
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_progress_sync TO authenticated;

-- =============================================================================
-- 4) community_questions
-- =============================================================================
DO $$
BEGIN
  IF to_regclass('public.community_questions') IS NOT NULL THEN
    ALTER TABLE public.community_questions ENABLE ROW LEVEL SECURITY;
    PERFORM public._drop_all_policies('public', 'community_questions');

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
      USING (author_id = auth.uid() OR public.is_app_admin())
      WITH CHECK (author_id = auth.uid() OR public.is_app_admin());

    CREATE POLICY "community_questions_delete"
      ON public.community_questions
      FOR DELETE
      TO authenticated
      USING (author_id = auth.uid() OR public.is_app_admin());

    GRANT SELECT ON public.community_questions TO anon, authenticated;
    GRANT INSERT, UPDATE, DELETE ON public.community_questions TO authenticated;
  END IF;
END $$;

-- =============================================================================
-- 5) community_answers
-- =============================================================================
DO $$
BEGIN
  IF to_regclass('public.community_answers') IS NOT NULL THEN
    ALTER TABLE public.community_answers ENABLE ROW LEVEL SECURITY;
    PERFORM public._drop_all_policies('public', 'community_answers');

    CREATE POLICY "community_answers_select"
      ON public.community_answers
      FOR SELECT
      TO anon, authenticated
      USING (true);

    CREATE POLICY "community_answers_insert_own"
      ON public.community_answers
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = author_id);

    CREATE POLICY "community_answers_update"
      ON public.community_answers
      FOR UPDATE
      TO authenticated
      USING (
        author_id = auth.uid()
        OR public.is_app_admin()
        OR EXISTS (
          SELECT 1
          FROM public.community_questions q
          WHERE q.id = community_answers.question_id
            AND q.author_id = auth.uid()
        )
      )
      WITH CHECK (
        author_id = auth.uid()
        OR public.is_app_admin()
        OR EXISTS (
          SELECT 1
          FROM public.community_questions q
          WHERE q.id = community_answers.question_id
            AND q.author_id = auth.uid()
        )
      );

    CREATE POLICY "community_answers_delete"
      ON public.community_answers
      FOR DELETE
      TO authenticated
      USING (author_id = auth.uid() OR public.is_app_admin());

    GRANT SELECT ON public.community_answers TO anon, authenticated;
    GRANT INSERT, UPDATE, DELETE ON public.community_answers TO authenticated;
  END IF;
END $$;

-- =============================================================================
-- 6) community_comments
-- =============================================================================
DO $$
BEGIN
  IF to_regclass('public.community_comments') IS NOT NULL THEN
    ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
    PERFORM public._drop_all_policies('public', 'community_comments');

    CREATE POLICY "community_comments_select"
      ON public.community_comments
      FOR SELECT
      TO anon, authenticated
      USING (true);

    CREATE POLICY "community_comments_insert_own"
      ON public.community_comments
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = author_id);

    CREATE POLICY "community_comments_update"
      ON public.community_comments
      FOR UPDATE
      TO authenticated
      USING (author_id = auth.uid() OR public.is_app_admin())
      WITH CHECK (author_id = auth.uid() OR public.is_app_admin());

    CREATE POLICY "community_comments_delete"
      ON public.community_comments
      FOR DELETE
      TO authenticated
      USING (author_id = auth.uid() OR public.is_app_admin());

    GRANT SELECT ON public.community_comments TO anon, authenticated;
    GRANT INSERT, UPDATE, DELETE ON public.community_comments TO authenticated;
  END IF;
END $$;

-- =============================================================================
-- 7) community_question_likes
-- =============================================================================
DO $$
BEGIN
  IF to_regclass('public.community_question_likes') IS NOT NULL THEN
    ALTER TABLE public.community_question_likes ENABLE ROW LEVEL SECURITY;
    PERFORM public._drop_all_policies('public', 'community_question_likes');

    CREATE POLICY "community_likes_select"
      ON public.community_question_likes
      FOR SELECT
      TO anon, authenticated
      USING (true);

    CREATE POLICY "community_likes_insert_own"
      ON public.community_question_likes
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "community_likes_delete_own"
      ON public.community_question_likes
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);

    GRANT SELECT ON public.community_question_likes TO anon, authenticated;
    GRANT INSERT, DELETE ON public.community_question_likes TO authenticated;
  END IF;
END $$;

-- =============================================================================
-- 8) Storage — publiczny odczyt / listowanie bucketów aplikacji
-- =============================================================================
-- Upewnij się, że buckety istnieją (jeśli nie — utwórz je w UI Storage).
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('podstawa', 'podstawa', true),
  ('rozszerzenie', 'rozszerzenie', true),
  ('osmaKlasa', 'osmaKlasa', true),
  ('tasks_images', 'tasks_images', true),
  ('karty', 'karty', true),
  ('community_images', 'community_images', true)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

-- Usuń stare polityki storage dla tych bucketów (po nazwie / wzorcu)
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND (
        policyname ILIKE '%podstawa%'
        OR policyname ILIKE '%rozszerzenie%'
        OR policyname ILIKE '%osmaKlasa%'
        OR policyname ILIKE '%tasks_images%'
        OR policyname ILIKE '%karty%'
        OR policyname ILIKE '%community_images%'
        OR policyname ILIKE '%public read storage%'
        OR policyname ILIKE '%mauka_storage%'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "mauka_public_storage_select" ON storage.objects;
DROP POLICY IF EXISTS "mauka_community_images_insert" ON storage.objects;
DROP POLICY IF EXISTS "mauka_community_images_update" ON storage.objects;
DROP POLICY IF EXISTS "mauka_community_images_delete" ON storage.objects;

CREATE POLICY "mauka_public_storage_select"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id IN (
      'podstawa',
      'rozszerzenie',
      'osmaKlasa',
      'tasks_images',
      'karty',
      'community_images'
    )
  );

CREATE POLICY "mauka_community_images_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'community_images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "mauka_community_images_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'community_images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'community_images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "mauka_community_images_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'community_images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- RPC używane przy lajkach (jeśli istnieje)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'sync_question_votes'
  ) THEN
    GRANT EXECUTE ON FUNCTION public.sync_question_votes(uuid, integer) TO authenticated;
  END IF;
EXCEPTION
  WHEN undefined_function THEN
    NULL;
END $$;

DROP FUNCTION IF EXISTS public._drop_all_policies(text, text);

-- Gotowe. Odśwież aplikację (Ctrl+F5) i sprawdź: zadania, arkusze, obrazki, społeczność.
