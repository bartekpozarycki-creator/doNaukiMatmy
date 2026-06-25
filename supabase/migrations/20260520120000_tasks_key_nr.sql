ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS key_nr integer;

COMMENT ON COLUMN public.tasks.key_nr IS
  'Numer strony w PDF klucza odpowiedzi (karty zasad oceniania), na której znajduje się odpowiedź do zadania.';
