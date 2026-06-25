-- Zdjęcia do pytań społeczności (bucket + kolumna image_urls)
-- Uruchom w Supabase → SQL Editor

ALTER TABLE public.community_questions
  ADD COLUMN IF NOT EXISTS image_url text;

ALTER TABLE public.community_questions
  ADD COLUMN IF NOT EXISTS image_urls jsonb NOT NULL DEFAULT '[]'::jsonb;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community_images',
  'community_images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "community_images_public_read" ON storage.objects;
CREATE POLICY "community_images_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'community_images');

DROP POLICY IF EXISTS "community_images_insert_own" ON storage.objects;
CREATE POLICY "community_images_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'community_images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "community_images_delete_own" ON storage.objects;
CREATE POLICY "community_images_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'community_images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
