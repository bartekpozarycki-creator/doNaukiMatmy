-- Kolumna open_parts: tablica podpunktów z lukami (etykieta + oczekiwana odpowiedź)
-- Uruchom w Supabase → SQL Editor przed importem zadań z open_parts

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS open_parts jsonb;

COMMENT ON COLUMN public.tasks.open_parts IS
  'Podpunkty z polami do uzupełnienia: [{ "id", "label", "placeholder?", "expected" }]';
