-- Odpowiedzi i komentarze w społeczności (z załącznikami graficznymi)
-- Uruchom w Supabase → SQL Editor (po setup-community-publish.sql)

CREATE TABLE IF NOT EXISTS public.community_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.community_questions(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_email text,
  author_name text,
  answer_text text NOT NULL,
  image_url text,
  image_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  votes integer NOT NULL DEFAULT 0,
  is_accepted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_answers_question_id_idx
  ON public.community_answers (question_id);

CREATE TABLE IF NOT EXISTS public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.community_questions(id) ON DELETE CASCADE,
  answer_id uuid REFERENCES public.community_answers(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_email text,
  author_name text,
  content text NOT NULL,
  image_url text,
  image_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  votes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_comments_question_id_idx
  ON public.community_comments (question_id);

ALTER TABLE public.community_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_answers_select_all" ON public.community_answers;
CREATE POLICY "community_answers_select_all"
  ON public.community_answers FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "community_answers_insert_own" ON public.community_answers;
CREATE POLICY "community_answers_insert_own"
  ON public.community_answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "community_answers_update_own" ON public.community_answers;
CREATE POLICY "community_answers_update_own"
  ON public.community_answers FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "community_answers_accept_by_author" ON public.community_answers;
CREATE POLICY "community_answers_accept_by_author"
  ON public.community_answers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.community_questions q
      WHERE q.id = community_answers.question_id
        AND q.author_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_questions q
      WHERE q.id = community_answers.question_id
        AND q.author_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "community_comments_select_all" ON public.community_comments;
CREATE POLICY "community_comments_select_all"
  ON public.community_comments FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "community_comments_insert_own" ON public.community_comments;
CREATE POLICY "community_comments_insert_own"
  ON public.community_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE OR REPLACE FUNCTION public.bump_community_answer_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.community_questions
  SET answer_count = COALESCE(answer_count, 0) + 1
  WHERE id = NEW.question_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bump_community_answer_count ON public.community_answers;
CREATE TRIGGER trg_bump_community_answer_count
  AFTER INSERT ON public.community_answers
  FOR EACH ROW
  EXECUTE FUNCTION public.bump_community_answer_count();
