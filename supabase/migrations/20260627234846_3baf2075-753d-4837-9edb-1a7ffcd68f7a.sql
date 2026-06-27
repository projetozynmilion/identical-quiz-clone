
-- READ (authenticated) + WRITE (admin only) for the new media buckets
CREATE POLICY "auth read admin media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id IN ('prompt-videos','bonus-banners','site-media'));

CREATE POLICY "admin insert admin media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('prompt-videos','bonus-banners','site-media') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "admin update admin media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('prompt-videos','bonus-banners','site-media') AND public.has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id IN ('prompt-videos','bonus-banners','site-media') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "admin delete admin media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('prompt-videos','bonus-banners','site-media') AND public.has_role(auth.uid(),'admin'));
