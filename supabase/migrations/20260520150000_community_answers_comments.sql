-- See data/setup-community-answers-comments.sql for full RLS policies

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
