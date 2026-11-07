-- Rabblings accounts: run once in the Supabase SQL Editor.
-- Safe to run again: every step checks before it creates.

-- 1. One profile per player. The designer name is shown on maps they make.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  designer_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint designer_name_format check (
    designer_name is null or designer_name ~ '^[A-Za-z0-9][A-Za-z0-9 _.''-]{1,23}$'
  )
);

-- No two players can take the same name, whatever the capitals.
create unique index if not exists profiles_designer_name_unique
  on public.profiles (lower(designer_name));

-- 2. Lock it down: nothing is readable or writable unless a rule below allows it.
alter table public.profiles enable row level security;

drop policy if exists "Designer names are public" on public.profiles;
create policy "Designer names are public"
  on public.profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "Players update their own profile" on public.profiles;
create policy "Players update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- New tables are not exposed automatically, so grant only what the website needs.
-- Players may change their designer name and nothing else.
-- The revoke clears any default grants Supabase added when the table was made.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant update (designer_name, updated_at) on public.profiles to authenticated;

-- 3. Make a blank profile whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Let a signed-in player delete their own account (their profile goes with it).
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
