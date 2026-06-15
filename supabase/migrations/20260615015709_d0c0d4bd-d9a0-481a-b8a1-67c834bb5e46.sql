
CREATE POLICY "Authenticated can view community media"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'community-media');

CREATE POLICY "Admins can upload community media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'community-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update community media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'community-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete community media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'community-media' AND public.has_role(auth.uid(), 'admin'));
