-- Wyświetlenia: 1 odsłona na konto (auth.users.id) na pytanie
-- Uruchom CAŁY plik w Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS public.community_question_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.community_questions(id) ON DELETE CASCADE,
  viewer_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (question_id, viewer_id)
);

CREATE INDEX IF NOT EXISTS community_question_views_question_id_idx
  ON public.community_question_views (question_id);

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
    RETURN jsonb_build_object('incremented', false, 'view_count', 0);
  END IF;

  INSERT INTO public.community_question_views (question_id, viewer_id)
  VALUES (p_question_id, trim(p_viewer_id))
  ON CONFLICT (question_id, viewer_id) DO NOTHING
  RETURNING id INTO new_id;

  SELECT COALESCE(view_count, 0) INTO current_views
  FROM public.community_questions
  WHERE id = p_question_id;

  RETURN jsonb_build_object(
    'incremented', new_id IS NOT NULL,
    'view_count', COALESCE(current_views, 0)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_question_view(uuid, text) TO anon, authenticated;

-- Zachowaj starą funkcję (bez konta) — aplikacja użyje register_question_view po migracji
CREATE OR REPLACE FUNCTION public.increment_question_view(question_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.community_questions
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = question_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_question_view(uuid) TO anon, authenticated;
