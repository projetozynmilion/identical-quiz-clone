
DO $$
DECLARE v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = 'henrysales1989@gmail.com' LIMIT 1;
  IF v_uid IS NOT NULL THEN
    DELETE FROM public.user_roles WHERE user_id = v_uid AND role = 'user';
    INSERT INTO public.user_roles (user_id, role) VALUES (v_uid, 'prompts_only')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
