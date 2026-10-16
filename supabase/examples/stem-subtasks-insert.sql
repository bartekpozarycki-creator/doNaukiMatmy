-- Zadanie 12 — wstęp (stem) + podpunkty 12.1 / 12.2
-- 1) Migracja parent_id + CHECK task_kind (stem)
-- 2) W storage bucket task_images wrzuć plik: zad12maj25pp.png
-- 3) Najpierw stem, potem podpunkty z parent_id

ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_task_kind_check;
ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_task_kind_check
  CHECK (task_kind IS NULL OR task_kind IN ('closed', 'open', 'stem'));

-- Usuń ewentualny wcześniejszy błędny stem z tego arkusza (opcjonalnie)
DELETE FROM public.tasks
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr >= 12
  AND nr < 13;

DO $$
DECLARE
  v_stem_id uuid := gen_random_uuid();
  v_arkusz text := '2025-maj-2023-pp-matura';
BEGIN
  INSERT INTO public.tasks (
    id,
    task_kind,
    question_text,
    answers,
    correct_answer,
    poziom,
    pochodzenie,
    arkusz,
    temat,
    podtemat,
    nr,
    punktacja,
    obrazek,
    question_text_po_obrazku,
    parent_id,
    created_at,
    updated_at
  ) VALUES (
    v_stem_id,
    'stem',
    'W kartezjańskim układzie współrzędnych $(x, y)$ przedstawiono fragment paraboli, która jest wykresem funkcji kwadratowej $f$ (zobacz rysunek). Wierzchołek tej paraboli ma współrzędne $(3, 6)$. Ta parabola przecina oś $Oy$ w punkcie o współrzędnych $(0, 3)$.',
    NULL,
    NULL,
    'pp',
    'arkusz CKE',
    v_arkusz,
    'Funkcje',
    'Funkcja kwadratowa',
    12,
    0,
    'zad12maj25pp.png',
    NULL,
    NULL,
    now(),
    now()
  );

  -- 12.1
  INSERT INTO public.tasks (
    id, task_kind, question_text, answers, correct_answer,
    poziom, pochodzenie, arkusz, temat, podtemat,
    nr, punktacja, parent_id, szacowana_trudnosc, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'open',
    'Wyznacz wzór funkcji $f$ w postaci kanonicznej. Zapisz obliczenia.',
    NULL,
    '$f(x)=-\\dfrac{1}{3}(x-3)^{2}+6$',
    'pp',
    'arkusz CKE',
    v_arkusz,
    'Funkcje',
    'Funkcja kwadratowa',
    12.1,
    2,
    v_stem_id,
    'średnie',
    now(),
    now()
  );

  -- 12.2
  INSERT INTO public.tasks (
    id, task_kind, question_text, answers, correct_answer,
    poziom, pochodzenie, arkusz, temat, podtemat,
    nr, punktacja, parent_id, szacowana_trudnosc, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'closed',
    'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.
Osią symetrii wykresu funkcji $f$ jest prosta o równaniu',
    '[
      {"id":"A","text":"$x = 3$"},
      {"id":"B","text":"$x = -3$"},
      {"id":"C","text":"$y = 6$"},
      {"id":"D","text":"$y = -6$"}
    ]'::jsonb,
    'A',
    'pp',
    'arkusz CKE',
    v_arkusz,
    'Funkcje',
    'Funkcja kwadratowa',
    12.2,
    1,
    v_stem_id,
    'łatwe',
    now(),
    now()
  );

  -- 12.3
  INSERT INTO public.tasks (
    id, task_kind, question_text, answers, correct_answer,
    poziom, pochodzenie, arkusz, temat, podtemat,
    nr, punktacja, parent_id, open_parts, szacowana_trudnosc,
    created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'open',
    'Funkcja $g$ jest określona dla każdej liczby rzeczywistej $x$ wzorem $g(x)=f(x)-3$. Liczby $x_1$ oraz $x_2$ są różnymi miejscami zerowymi funkcji $g$.

Uzupełnij zdanie. Wpisz odpowiednią liczbę w wykropkowanym miejscu, aby zdanie było prawdziwe.

Suma $x_1+x_2$ jest równa ......... .',
    NULL,
    '6',
    'pp',
    'arkusz CKE',
    v_arkusz,
    'Funkcje',
    'Funkcja kwadratowa',
    12.3,
    1,
    v_stem_id,
    '[{"id":"1","label":"Suma $x_1+x_2$","expected":"6","placeholder":"Wpisz liczbę"}]'::jsonb,
    'średnie',
    now(),
    now()
  );

  RAISE NOTICE 'Stem id = %', v_stem_id;
END $$;
