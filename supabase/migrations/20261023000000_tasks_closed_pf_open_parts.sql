ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_closed_has_options;

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_closed_has_options CHECK (
    task_kind IS DISTINCT FROM 'closed'
    OR (
      (
        answers IS NOT NULL
        AND jsonb_typeof(answers) = 'array'
        AND jsonb_array_length(answers) >= 2
      )
      OR (
        open_parts IS NOT NULL
        AND jsonb_typeof(open_parts) = 'array'
        AND jsonb_array_length(open_parts) >= 1
      )
    )
  );

UPDATE public.tasks
SET
  task_kind = 'closed',
  answers = CASE
    WHEN jsonb_typeof(answers) = 'array' AND jsonb_array_length(answers) >= 2 THEN answers
    ELSE '[{"id":"P","text":"P"},{"id":"F","text":"F"}]'::jsonb
  END
WHERE task_kind IS DISTINCT FROM 'stem'
  AND jsonb_typeof(open_parts) = 'array'
  AND jsonb_array_length(open_parts) > 0
  AND (
    question_text ILIKE '%prawdziwość%'
    OR question_text_po_obrazku ILIKE '%prawdziwość%'
    OR COALESCE(correct_answer, '') ~* '^[PF](\s*;\s*[PF])+$'
    OR EXISTS (
      SELECT 1
      FROM jsonb_array_elements(open_parts) p
      WHERE COALESCE(p->>'placeholder', '') ~* 'p\s*lub\s*f'
         OR COALESCE(p->>'expected', p->>'correct', '') ~* '^[PF]$'
    )
  );
