-- Schemat tasks — uruchom PRZED insert-matura-2025-maj-2023-pp-zadania.sql

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS question_text_po_obrazku text;

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS open_parts jsonb;

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS nr integer;

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS obrazek text;

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS punktacja integer;

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS key_nr integer;

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS video_url text;
