# Rabblings

A free, open source, 16-bit style game. Boss around tiny rabbles of goblins, frogs, imps and more. Dig, build and blow your way home, or sabotage a friend.

Everything is hand-made in code: pixel art, FM music and gibberish voices. There are no dependencies to run the game.

## Folders

| Folder | What it holds |
| --- | --- |
| `kit/` | Shared code for any game: screen, font, audio, voices, input, buttons, pop-up box |
| `maps/` | Shared map code: terrain, shapes, terrain generators, map format, share codes, storage, NeoLemmix import |
| `games/rabblings/` | The game: engine, levels, races, art, and `profile.js`, which tells the builder about this game |
| `builder/` | The map builder |
| `site/` | The website home page |
| `docs/` | The built website, served by GitHub Pages. Do not edit this by hand |
| `tests/` | Browser tests that use Playwright |

## Building

Needs Python 3 and nothing else.

```
python3 build.py
```

This writes `docs/play/`, `docs/builder/` and the home page, plus `build/rabblings-all.html`, a single file holding both that the tests use.

To try the website locally, run `python3 -m http.server --directory docs`. The game and builder share saved maps because they live on the same site.

## Tests

Run these from the repo root after `python3 build.py`, for example `python3 tests/races.py`. They need Python Playwright with Chromium. Some reuse the `run.html` that `tests/races.py` writes, so run that one first. `tests/imp3.py` takes your own level pack and NeoLemmix zip as arguments, and `tests/oldmaps.py` needs an older build to compare against.

## Maps

- Each map records its format version (`fmt`), game profile (`game`) and generator version (`gen`).
- Objects have a `uid`, and `link` can point one object at another. The builder has no link tool yet.
- Maps built from `['G', type, seed]` regenerate their terrain, so never change an existing terrain type. Add a new one.
- Older maps and GS1 share codes upgrade automatically, and their proofs stay valid.

## Adding another game

A new game adds a folder under `games/` with its own engine and `profile.js`. The builder still has some Rabblings ties to remove first: its Skills page, the race list, enemy names and Test Play.

## NeoLemmix files

This repo contains no NeoLemmix levels or graphics. Players import from their own download, and imported maps stay on their device.

## Licence

No licence has been chosen yet, so all rights are reserved for now.
