DROP POLICY IF EXISTS "Admins can insert modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can update modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can delete modules" ON public.modules;

CREATE POLICY "Admins can insert modules"
ON public.modules
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins can update modules"
ON public.modules
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'::public.app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins can delete modules"
ON public.modules
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'::public.app_role
  )
);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;