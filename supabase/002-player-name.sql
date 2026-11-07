-- Rabblings accounts, step 2: run once in the Supabase SQL Editor after setup.sql.
-- 1. The shared name is now a player name, used in every Rabblings game and on the website.
alter table public.profiles rename column designer_name to display_name;
alter table public.profiles rename constraint designer_name_format to display_name_format;
alter index public.profiles_designer_name_unique rename to profiles_display_name_unique;

-- 2. Lock the table down to what the website needs: anyone can read player names,
--    and each signed-in player can change only their own name.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant update (display_name, updated_at) on public.profiles to authenticated;
