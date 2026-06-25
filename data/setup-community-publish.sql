-- RLS dla społeczności (struktura: community_questions + community_question_likes → auth.users)
-- Uruchom w Supabase → SQL Editor

ALTER TABLE public.community_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_questions_select_all" ON public.community_questions;
CREATE POLICY "community_questions_select_all"
  ON public.community_questions FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "community_questions_insert_own" ON public.community_questions;
CREATE POLICY "community_questions_insert_own"
  ON public.community_questions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "community_questions_update_own" ON public.community_questions;
CREATE POLICY "community_questions_update_own"
  ON public.community_questions FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "community_questions_delete_own" ON public.community_questions;
CREATE POLICY "community_questions_delete_own"
  ON public.community_questions FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

ALTER TABLE public.community_question_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_question_likes_select_all" ON public.community_question_likes;
CREATE POLICY "community_question_likes_select_all"
  ON public.community_question_likes FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "community_question_likes_insert_own" ON public.community_question_likes;
CREATE POLICY "community_question_likes_insert_own"
  ON public.community_question_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "community_question_likes_delete_own" ON public.community_question_likes;
CREATE POLICY "community_question_likes_delete_own"
  ON public.community_question_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.sync_question_votes(
  question_id uuid,
  votes_count integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.community_questions
  SET votes = GREATEST(0, COALESCE(votes_count, 0))
  WHERE id = question_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.sync_question_votes(uuid, integer) TO authenticated;

-- Wyświetlenia (pełna definicja także w community-question-views.sql)
CREATE TABLE IF NOT EXISTS public.community_question_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.community_questions(id) ON DELETE CASCADE,
  viewer_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (question_id, viewer_id)
);

ALTER TABLE public.community_question_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_question_views_select_all" ON public.community_question_views;
CREATE POLICY "community_question_views_select_all"
  ON public.community_question_views FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.bump_community_question_view_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.community_questions
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = NEW.question_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bump_community_question_view_count ON public.community_question_views;
CREATE TRIGGER trg_bump_community_question_view_count
  AFTER INSERT ON public.community_question_views
  FOR EACH ROW
  EXECUTE FUNCTION public.bump_community_question_view_count();

CREATE OR REPLACE FUNCTION public.register_question_view(
  p_question_id uuid,
  p_viewer_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
  current_views integer;
BEGIN
  IF p_question_id IS NULL OR p_viewer_id IS NULL OR length(trim(p_viewer_id)) = 0 THEN
    RETURN jsonb_build_object('incremented', false);
  END IF;

  INSERT INTO public.community_question_views (question_id, viewer_id)
  VALUES (p_question_id, trim(p_viewer_id))
  ON CONFLICT (question_id, viewer_id) DO NOTHING
  RETURNING id INTO new_id;

  SELECT COALESCE(view_count, 0) INTO current_views
  FROM public.community_questions
  WHERE id = p_question_id;

  IF new_id IS NOT NULL THEN
    RETURN jsonb_build_object('incremented', true, 'view_count', current_views);
  END IF;

  RETURN jsonb_build_object('incremented', false, 'view_count', current_views);
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_question_view(uuid, text) TO anon, authenticated;
