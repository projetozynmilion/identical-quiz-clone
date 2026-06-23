
-- Grant admin role to CEO
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'the@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Reset password for CEO
UPDATE auth.users
SET encrypted_password = crypt('CEO@2026!', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'the@gmail.com';
