
-- Add is_official flag
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS is_official BOOLEAN NOT NULL DEFAULT false;

-- Replace insert policy: anyone authenticated can post as themselves
DROP POLICY IF EXISTS "Admins can insert posts" ON public.community_posts;
CREATE POLICY "Authenticated can insert own posts"
  ON public.community_posts FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

-- Allow users to delete their own posts (admin already can)
DROP POLICY IF EXISTS "Users can delete own posts" ON public.community_posts;
CREATE POLICY "Users can delete own posts"
  ON public.community_posts FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Allow users to update their own posts (text/etc), admins still can update anything
DROP POLICY IF EXISTS "Users can update own posts" ON public.community_posts;
CREATE POLICY "Users can update own posts"
  ON public.community_posts FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid() AND is_official = false AND is_pinned = false);

-- =========================
-- RATINGS
-- =========================
CREATE TABLE IF NOT EXISTS public.community_post_ratings (
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_post_ratings TO authenticated;
GRANT ALL ON public.community_post_ratings TO service_role;

ALTER TABLE public.community_post_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view ratings"
  ON public.community_post_ratings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can rate as themselves"
  ON public.community_post_ratings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their rating"
  ON public.community_post_ratings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their rating"
  ON public.community_post_ratings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.community_post_ratings;

-- =========================
-- STORAGE: allow any authenticated user to upload to their own folder
-- =========================
DROP POLICY IF EXISTS "Admins can upload community media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update community media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete community media" ON storage.objects;

CREATE POLICY "Users can upload to their folder in community"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'community-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own community media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'community-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users and admins can delete community media"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'community-media'
    AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin'))
  );
