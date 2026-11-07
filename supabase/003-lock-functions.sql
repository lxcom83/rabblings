-- Rabblings accounts, step 3: helper functions that run on their own must not be callable from the website.
-- handle_new_user runs when someone signs up; rls_auto_enable is Supabase's automatic RLS helper.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
