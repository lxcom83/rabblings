# MapView Web: guide for AI assistants and scripts

MapView Web edits OpenXcom / OXCE battlescape map blocks in the browser. This page explains what the files are, the scripting API
(`window.MapViewAPI`), and the rules the route tools follow, so an assistant or a script can help without guessing.

## 1. Files
| File | What it is |
|---|---|
| `MAPS/NAME.MAP` | 3 header bytes (rows y, cols x, levels z) then 4 bytes per tile: floor, west wall, north wall, object. Each byte is a part number (0 = empty) into the terrain's MCD list. Levels are stored top first. |
| `ROUTES/NAME.RMP` | 24 bytes per node: y, x, level (top first), unused, five links of (destination, distance, type), unit type, rank, patrol priority, attack, spawn weight. Destination 254/253/252/251 = exit North/East/South/West, 255 = no link. A route file holds at most 250 nodes. |
| `TERRAIN/NAME.MCD` | 62 bytes per part: sprite frames, loft refs, time-unit cost (255 blocks), flags (doors, ladders, no-floor, big wall), terrain level (-16 stairs up, -12 stairs down). |
| `TERRAIN/NAME.PCK` + `.TAB` | The 32x40 sprites for those parts. |
| `Ruleset/*.rul` | `terrains:` entries list `mapDataSets` (the MCD files, in order) and `mapBlocks` (the map names). MapView reads these to know which MCDs a block uses. |

A part number in a MAP is its position in the terrain's combined MCD list, so the same MAP means different things under a different terrain.

## 2. Scripting API
Open MapView Web, load a mod folder (or add `?demo`), then in the page console or an automation tool such as Playwright:

```js
MapViewAPI.listBlocks()                       // { ok, blocks:[{name, terrain, loaded, dirty, size:[cols,rows,levs], nodes}] }
MapViewAPI.getBlock('B_GRUNGE00')             // size, node count, MCD sets, issue count
MapViewAPI.getTile(name, x, y, z)             // { floor, westWall, northWall, object }  (z 0 = ground, going up)
MapViewAPI.setTile(name, x, y, z, 'floor', 12)         // layers: floor | westWall | northWall | object
MapViewAPI.fillRect(name, x0, y0, x1, y1, z, 'object', 0)
MapViewAPI.listParts(name)                    // part id -> { set, index, type, tu }
MapViewAPI.getRoutes(name) / setRoutes(name, nodes)    // nodes: {x,y,z,links:[{to,dist,type}],unit,rank,patrol,attack,spawn}
MapViewAPI.autoRoute(name, { smart:true, radius:6 })   // builds routes, returns node count and warnings
MapViewAPI.audit(name)                        // [{severity, code, text, at}]
MapViewAPI.duplicateBlock(name, newName) / renameBlock(name, newName)
MapViewAPI.exportFiles()                      // edited files as [{name:'MAPS/X.MAP', base64}]
```
Every call returns `{ ok: true, ... }` or `{ ok: false, error }` and never throws. Tile and route edits go on the undo stack and mark the block as changed. Duplicate, rename and generate create or change blocks and are not undoable.
Coordinates: x is the column, y the row, z the level with 0 at ground. Route nodes use the file's convention instead (level stored top first, game z = levels - 1 - z).
Nothing is uploaded: the API works on files already open in the page.

## 3. Route rules (measured on 422 hand-made blocks)
* **Engine joins across blocks by order, not position.** A node with an exit link (N/E/S/W) is paired with the first node in the neighbouring block that has the opposite exit. Positions do not have to line up, but each side that opens onto walkable ground should have at least one exit node, and an exit node must be able to walk to that opening.
* **Density follows how tight the space is.** About 11 nodes per 100 walkable tiles in corridors and small rooms, 7 in mixed areas, 5 in open buildings, 3 in open ground. Smart spacing uses this curve.
* **Links are short and sparse.** Hand-made routes average 2.3 links per node, usually to the nearest or second-nearest node, and rarely skip over a closer one. The engine ignores the stored distance and link type.
* **Doors:** put a node on each side of a door. Stairs and ladders need nodes at both ends. Roof areas you can only drop from get a one-way link down.
* **Patrol priority and rank** decide who walks to a node: non-scouts only patrol to nodes with priority above 0 or a rank above 0. Spawn weight chooses where units start.
* Bases and ships are tighter than open terrain (more doors, many dead ends), which is why density rises as clearance falls.

## 4. Tile placement rules and the generator
Measured on 430 original-style blocks (184,500 placed parts): floor slot = floor-type parts 99.9%, west/north wall slots = wall-type 99%, object slot = object-type 95% (the rest are floor decals and wall-like blocks the originals use on purpose, so those are only notes). The ground level never has an empty tile. Doors never sit in the floor or object slot. A wall with no floor either side is rare. `audit` reports these as `void-ground`, `door-in-wrong-layer`, `bad-part` (warnings) and `floor-slot-misuse`, `floating-wall`, `wall-slot-mismatch`, `object-slot-oddity`, `object-over-void` (notes).

`MapViewAPI.generateBlock(name, { style:'mixed'|'building'|'open', size:10|20|30, density:0-100, seed, name })` makes a new block from the tile set of block `name`. It learns ground, wall, door and prop parts from the maps already loaded for that terrain, so load the terrain's own maps first. Output is audited and routed automatically.

**Large (2x2) units.** The engine puts a large unit's top-left tile on the node and extends it one tile east and south. A node only allows large units if that whole 2x2 block is standable with no wall between. Auto Route marks other nodes Small, the audit flags `large-node-too-narrow`, spawn mixing never gives large types to such nodes, and the generator makes its first entrance two tiles wide and leaves two-tile gaps in partitions.

## 5. Safe workflow for an assistant
1. `listBlocks()`, then `audit(name)` to see problems before changing anything.
2. Edit with `setTile` / `fillRect`, then `autoRoute` and `audit` again.
3. Prefer `duplicateBlock` to editing an original, then `exportFiles()` and let the user save.
4. Do not invent part numbers: call `listParts(name)` first.
