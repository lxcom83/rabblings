-- Rabblings website refresh: attempt logging, high scores, community maps, thumbs-up votes and tester feedback.
-- Applied 15 Nov 2026 (after setup.sql, 002 and 003). Safe to run again: every step checks before it creates.
--
-- Rules followed (see ../README.md):
--   * every table has row level security on, and grants only what the website needs
--   * every row belongs to a profile and is deleted with it (on delete cascade), so
--     public.delete_my_account() removes everything a player ever sent us
--   * helper functions that run on their own cannot be called from the website
--   * Marching Orders tables start with mo_, website tables with site_

-- 0. Attempt logging is opt in: it is off until the player switches it on from the account page.
alter table public.profiles add column if not exists log_attempts boolean not null default false;
grant update (log_attempts) on public.profiles to authenticated;
-- Player names stay public; the logging switch is only for its owner, so hide it from everyone else.
revoke select on public.profiles from anon, authenticated;
grant select (id, display_name, created_at, updated_at) on public.profiles to anon, authenticated;
-- Column grants cannot tell rows apart, so the switch is read through this helper ("is logging on for me?")
-- and nobody can read another player's setting.
create or replace function public.my_log_attempts()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select p.log_attempts from public.profiles p where p.id = auth.uid()), false);
$$;
revoke execute on function public.my_log_attempts() from public, anon;
grant execute on function public.my_log_attempts() to authenticated;

-- A tiny guard used by the insert triggers below: stop one player flooding a table.
create or replace function public.rb_rate_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  lim int := tg_argv[1]::int;
  win interval := tg_argv[2]::interval;
  n int;
begin
  execute format('select count(*) from public.%I where %I = $1 and created_at > now() - $2', tg_table_name, tg_argv[0])
    into n using auth.uid(), win;
  if n >= lim then
    raise exception 'Too many in a short time. Try again later.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
revoke execute on function public.rb_rate_guard() from public, anon, authenticated;


-- 1. Free Play attempt logs (Marching Orders). Private: a player sees only their own rows.
--    Shape follows SAVE.freeLog in games/rabblings/game.js.
create table if not exists public.mo_free_attempts (
  id bigint generated always as identity primary key,
  player_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  map text not null check (map ~ '^[a-z0-9][a-z0-9_-]{0,31}$'),
  race text not null check (race in ('goblin','swamp','imp','fairy','dwarf','rat','bone','shroom')),
  clan smallint not null default 0 check (clan between 0 and 7),
  diff text not null check (diff in ('easy','normal','hard','wild')),
  classic boolean not null default false,
  pass boolean not null,
  saved smallint not null check (saved between 0 and 999),
  need smallint not null check (need between 0 and 999),
  sec integer not null check (sec between 0 and 86400),
  played_at timestamptz not null,
  created_at timestamptz not null default now(),
  -- the same attempt sent twice (from the game and from the account page) is stored once
  constraint mo_free_attempts_once unique (player_id, played_at, map, race)
);
create index if not exists mo_free_attempts_player on public.mo_free_attempts (player_id, played_at desc);
create index if not exists mo_free_attempts_map on public.mo_free_attempts (map, race);

alter table public.mo_free_attempts enable row level security;
drop policy if exists "Players read their own attempts" on public.mo_free_attempts;
create policy "Players read their own attempts" on public.mo_free_attempts
  for select to authenticated using ((select auth.uid()) = player_id);
drop policy if exists "Players log their own attempts while logging is on" on public.mo_free_attempts;
create policy "Players log their own attempts while logging is on" on public.mo_free_attempts
  for insert to authenticated
  with check ((select auth.uid()) = player_id and (select public.my_log_attempts()));
drop policy if exists "Players delete their own attempts" on public.mo_free_attempts;
create policy "Players delete their own attempts" on public.mo_free_attempts
  for delete to authenticated using ((select auth.uid()) = player_id);

revoke all on public.mo_free_attempts from anon, authenticated;
grant select, delete on public.mo_free_attempts to authenticated;
grant insert (player_id, map, race, clan, diff, classic, pass, saved, need, sec, played_at) on public.mo_free_attempts to authenticated;

drop trigger if exists mo_free_attempts_rate on public.mo_free_attempts;
create trigger mo_free_attempts_rate before insert on public.mo_free_attempts
  for each row execute function public.rb_rate_guard('player_id', '600', '1 hour');

-- For the owner only (no website grant): which races can actually beat which Free Play maps.
-- Read it in the dashboard with: select * from public.mo_free_attempt_stats;
create or replace view public.mo_free_attempt_stats with (security_invoker = true) as
  select map, race, diff, classic,
         count(*) as attempts,
         count(*) filter (where pass) as passes,
         count(distinct player_id) as players,
         max(saved) as best_saved,
         min(sec) filter (where pass) as fastest_pass_sec
  from public.mo_free_attempts
  group by map, race, diff, classic;
revoke all on public.mo_free_attempt_stats from public, anon, authenticated;


-- 2. High scores (Marching Orders). Public, so the site can show leaderboards with player names.
--    level_key matches the keys in SAVE.scores, for example 'free:f1-01:imp/normal' or '3/hard/c'.
create table if not exists public.mo_scores (
  player_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  level_key text not null check (char_length(level_key) between 1 and 80),
  score integer not null check (score between 0 and 10000000),
  race text not null check (race in ('goblin','swamp','imp','fairy','dwarf','rat','bone','shroom')),
  diff text not null check (diff in ('easy','normal','hard','wild')),
  classic boolean not null default false,
  set_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (player_id, level_key)
);
create index if not exists mo_scores_board on public.mo_scores (level_key, score desc);

alter table public.mo_scores enable row level security;
drop policy if exists "High scores are public" on public.mo_scores;
create policy "High scores are public" on public.mo_scores
  for select to anon, authenticated using (true);
drop policy if exists "Players post their own scores" on public.mo_scores;
create policy "Players post their own scores" on public.mo_scores
  for insert to authenticated with check ((select auth.uid()) = player_id);
drop policy if exists "Players update their own scores" on public.mo_scores;
create policy "Players update their own scores" on public.mo_scores
  for update to authenticated using ((select auth.uid()) = player_id) with check ((select auth.uid()) = player_id);
drop policy if exists "Players delete their own scores" on public.mo_scores;
create policy "Players delete their own scores" on public.mo_scores
  for delete to authenticated using ((select auth.uid()) = player_id);

revoke all on public.mo_scores from anon, authenticated;
grant select on public.mo_scores to anon, authenticated;
grant insert (player_id, level_key, score, race, diff, classic, set_at) on public.mo_scores to authenticated;
grant update (level_key, score, race, diff, classic, set_at) on public.mo_scores to authenticated;
grant delete on public.mo_scores to authenticated;

-- A lower score never replaces a higher one, whoever sends it.
create or replace function public.mo_scores_keep_best()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.score < old.score then
    return old;
  end if;
  return new;
end;
$$;
revoke execute on function public.mo_scores_keep_best() from public, anon, authenticated;
drop trigger if exists mo_scores_keep_best on public.mo_scores;
create trigger mo_scores_keep_best before update on public.mo_scores
  for each row execute function public.mo_scores_keep_best();


-- 3. Community maps: the file stays on the player's own drive; we keep only the link and the words.
create table if not exists public.site_maps (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind text not null default 'pack' check (kind in ('pack','map')),
  title text not null check (char_length(btrim(title)) between 3 and 60),
  description text not null default '' check (char_length(description) <= 600),
  designer text not null check (char_length(btrim(designer)) between 2 and 40),
  link text not null check (char_length(link) <= 600 and link ~* '^https://[^\s/$.?#][^\s]*$'),
  votes integer not null default 0,
  hidden boolean not null default false,  -- the owner can hide a listing from the dashboard
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_maps_new on public.site_maps (created_at desc) where not hidden;
create index if not exists site_maps_top on public.site_maps (votes desc, created_at desc) where not hidden;
create index if not exists site_maps_owner on public.site_maps (owner_id);

alter table public.site_maps enable row level security;
drop policy if exists "Shared maps are public" on public.site_maps;
create policy "Shared maps are public" on public.site_maps
  for select to anon, authenticated using (not hidden or (select auth.uid()) = owner_id);
drop policy if exists "Players share their own maps" on public.site_maps;
create policy "Players share their own maps" on public.site_maps
  for insert to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists "Players edit their own maps" on public.site_maps;
create policy "Players edit their own maps" on public.site_maps
  for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists "Players remove their own maps" on public.site_maps;
create policy "Players remove their own maps" on public.site_maps
  for delete to authenticated using ((select auth.uid()) = owner_id);

revoke all on public.site_maps from anon, authenticated;
grant select on public.site_maps to anon, authenticated;
grant insert (owner_id, kind, title, description, designer, link) on public.site_maps to authenticated;
grant update (kind, title, description, designer, link, updated_at) on public.site_maps to authenticated;
grant delete on public.site_maps to authenticated;

drop trigger if exists site_maps_rate on public.site_maps;
create trigger site_maps_rate before insert on public.site_maps
  for each row execute function public.rb_rate_guard('owner_id', '20', '1 day');


-- 4. Thumbs up. One per player per map, not on your own map. Who voted stays private;
--    the total is kept on site_maps.votes by a trigger.
create table if not exists public.site_map_votes (
  map_id uuid not null references public.site_maps (id) on delete cascade,
  voter_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (map_id, voter_id)
);
create index if not exists site_map_votes_voter on public.site_map_votes (voter_id);

alter table public.site_map_votes enable row level security;
drop policy if exists "Players see their own votes" on public.site_map_votes;
create policy "Players see their own votes" on public.site_map_votes
  for select to authenticated using ((select auth.uid()) = voter_id);
drop policy if exists "Players vote for other players' maps" on public.site_map_votes;
create policy "Players vote for other players' maps" on public.site_map_votes
  for insert to authenticated
  with check ((select auth.uid()) = voter_id
              and not exists (select 1 from public.site_maps m where m.id = map_id and m.owner_id = (select auth.uid())));
drop policy if exists "Players take back their own votes" on public.site_map_votes;
create policy "Players take back their own votes" on public.site_map_votes
  for delete to authenticated using ((select auth.uid()) = voter_id);

revoke all on public.site_map_votes from anon, authenticated;
grant select, delete on public.site_map_votes to authenticated;
grant insert (map_id, voter_id) on public.site_map_votes to authenticated;

create or replace function public.site_map_votes_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.site_maps set votes = votes + 1 where id = new.map_id;
  elsif tg_op = 'DELETE' then
    update public.site_maps set votes = greatest(votes - 1, 0) where id = old.map_id;
  end if;
  return null;
end;
$$;
revoke execute on function public.site_map_votes_count() from public, anon, authenticated;
drop trigger if exists site_map_votes_count on public.site_map_votes;
create trigger site_map_votes_count after insert or delete on public.site_map_votes
  for each row execute function public.site_map_votes_count();


-- 5. Tester feedback. Signed-in players only (signed-out players get a copyable text block instead).
--    Nobody can read feedback from the website except its own sender; the owner reads it in the dashboard.
create table if not exists public.site_feedback (
  id bigint generated always as identity primary key,
  player_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind text not null default 'other' check (kind in ('bug','idea','map','other')),
  message text not null check (char_length(btrim(message)) between 5 and 4000),
  page text check (char_length(page) <= 200),
  device text check (char_length(device) <= 300),
  created_at timestamptz not null default now()
);
create index if not exists site_feedback_new on public.site_feedback (created_at desc);

alter table public.site_feedback enable row level security;
drop policy if exists "Players send feedback" on public.site_feedback;
create policy "Players send feedback" on public.site_feedback
  for insert to authenticated with check ((select auth.uid()) = player_id);
drop policy if exists "Players read their own feedback" on public.site_feedback;
create policy "Players read their own feedback" on public.site_feedback
  for select to authenticated using ((select auth.uid()) = player_id);

revoke all on public.site_feedback from anon, authenticated;
grant select on public.site_feedback to authenticated;
grant insert (player_id, kind, message, page, device) on public.site_feedback to authenticated;

drop trigger if exists site_feedback_rate on public.site_feedback;
create trigger site_feedback_rate before insert on public.site_feedback
  for each row execute function public.rb_rate_guard('player_id', '15', '1 hour');

-- 6. Nothing to change in delete_my_account(): it deletes the auth user, the profile goes with it,
--    and every table above cascades from the profile.
