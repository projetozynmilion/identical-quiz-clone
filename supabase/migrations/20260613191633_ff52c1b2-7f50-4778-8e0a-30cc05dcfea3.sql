
-- Grant admin role to adm@gmail.com on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');

  IF new.email IN ('cu@gmail.com', 'adm@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN new;
END;
$function$;

-- Grant admin to existing adm@gmail.com if already registered
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'adm@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Storage policies for banners bucket: public read, admin write
CREATE POLICY "Public read banners"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

CREATE POLICY "Admins upload banners"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'banners' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update banners"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'banners' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete banners"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'banners' AND public.has_role(auth.uid(), 'admin'));
