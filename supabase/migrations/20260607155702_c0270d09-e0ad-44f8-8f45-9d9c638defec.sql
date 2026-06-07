-- Revoke public execution of security definer functions
revoke execute on function public.has_role(uuid, app_role) from public;
revoke execute on function public.has_role(uuid, app_role) from authenticated;

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from authenticated;

-- Grant execute to service_role (and potentially specific roles if needed)
grant execute on function public.has_role(uuid, app_role) to service_role;
grant execute on function public.handle_new_user() to service_role;