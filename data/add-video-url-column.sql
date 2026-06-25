-- Link do wytłumaczenia wideo (embed YouTube/Vimeo lub URL watch)
-- Uruchom w Supabase → SQL Editor

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS video_url text;

COMMENT ON COLUMN public.tasks.video_url IS
  'URL embed lub watch do filmu tłumaczącego zadanie, np. https://www.youtube-nocookie.com/embed/VIDEO_ID';
