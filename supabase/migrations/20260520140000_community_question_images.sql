ALTER TABLE public.community_questions
  ADD COLUMN IF NOT EXISTS image_url text;

ALTER TABLE public.community_questions
  ADD COLUMN IF NOT EXISTS image_urls jsonb NOT NULL DEFAULT '[]'::jsonb;
