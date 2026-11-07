# Rabblings accounts (Supabase)

One account per player, shared by the website and every Rabblings game.

Run these once, in order, in the Supabase SQL Editor:

1. `setup.sql`: the profiles table, its access rules, the sign-up trigger and account deletion.
2. `002-player-name.sql`: renames the designer name to a player name used in every game, and locks the table's grants down.
3. `003-lock-functions.sql`: stops the website calling the sign-up helper and Supabase's automatic RLS helper directly.

## How data is laid out

- `profiles` is shared: one row per player, with the public player name.
- Each game gets its own tables, named after the game (for example `mo_maps` and `mo_scores` for Marching Orders), each row linked to `profiles.id`.
- Website features (Community Maps, likes, collected journals) get their own tables the same way.
- Every new function that should not be called from the website must revoke `execute` from `public, anon, authenticated`.
- Every new table must enable row level security, grant only what the site needs, and delete its rows when the account is deleted (`on delete cascade` from `profiles`).

Never put the secret key in website or game code. Only the publishable key belongs there.
