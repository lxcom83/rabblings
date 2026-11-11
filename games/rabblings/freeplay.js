// ---------- Free Play: maps written in base skills, with the races that have a tested solution ----------
// Every map lists `races`, the races whose solution plan passes in tests/free.py (the test fails if a list goes stale). The picker only offers those, until the player unlocks the rest.
// Maps use the eight base skills. Each race's panel swaps some of them (see RACES[k].swap), so a plan written in base names is renamed per race.
const FREE_TIERS=[{k:1,n:'PUSHOVER'},{k:2,n:'FIDDLY'},{k:3,n:'NASTY'},{k:4,n:'CARNAGE'}];
const FREE_MAPS=[
 {id:'f1-01',tier:1,races:['goblin','swamp','imp','fairy','dwarf','rat','shroom'],name:'Gap Year',theme:'bog',w:800,h:300,n:24,need:12,rate:34,time:240,hint:'Everyone leaves home eventually. Lay a BRIDGE over the gap.',skills:{build:5},
  hatch:[{x:90,y:110,dir:1}],doors:[{x:720,y:146}],haz:[{x0:300,x1:378,y:244}],
  build(S){S.box(0,190,300,110);S.box(300,258,78,42);S.box(378,146,422,154);},
  plan:[{x:280,d:1,s:'build',tol:1},{st:'walk',x:336,tol:8,y:166,ytol:8,d:1,s:'build'}]},
 {id:'f1-02',tier:1,races:['goblin','swamp','imp','dwarf','rat','bone','shroom'],name:'Rock Bottom',theme:'mine',w:760,h:300,n:24,need:12,rate:34,time:240,hint:'The way out is down. Find the thin spot and DIG.',skills:{dig:3},
  hatch:[{x:80,y:70,dir:1}],doors:[{x:690,y:200}],
  build(S){S.box(0,100,760,200);S.cut(16,150,728,50);S.box(0,40,16,60);S.box(744,40,16,60);},
  plan:[{x:300,d:1,s:'dig',tol:2}]},
 {id:'f1-03',tier:1,races:['goblin','swamp','imp','fairy','dwarf','rat','bone','shroom'],name:'Wrong Way Round',theme:'forge',w:720,h:300,n:24,need:12,rate:34,time:240,hint:'The pit is that way and the hut is the other. BOUNCE them back.',skills:{block:2},
  hatch:[{x:360,y:130,dir:1}],doors:[{x:60,y:200}],haz:[{x0:590,x1:720,y:236}],
  build(S){S.box(0,200,590,100);S.box(590,242,130,58);},
  plan:[{x:560,d:1,s:'block',tol:2}]},
 {id:'f1-04',tier:1,races:['goblin','swamp','imp','fairy','dwarf','rat','shroom'],name:'Step Up',theme:'dunes',w:820,h:300,n:24,need:12,rate:34,time:240,hint:'The hut sits on a ledge, and nobody here can climb. BRIDGE up to it.',skills:{build:5},
  hatch:[{x:90,y:130,dir:1}],doors:[{x:740,y:176}],
  build(S){S.box(0,220,420,80);S.box(420,176,400,124);},
  plan:[{x:340,d:1,s:'build',tol:1},{st:'walk',x:386,tol:8,y:198,ytol:8,d:1,s:'build'}]},
 {id:'f1-05',tier:1,races:['goblin','swamp','imp','dwarf','rat','bone'],name:'Thin Walls',theme:'halls',w:840,h:300,n:24,need:12,rate:34,time:240,hint:'Dwarves built it to last. Goblins had other ideas. BASH through.',skills:{bash:3},
  hatch:[{x:90,y:110,dir:1}],doors:[{x:760,y:200}],
  build(S){S.box(0,200,840,100);S.box(400,60,40,140);},
  plan:[{x:391,d:1,s:'bash',tol:2}]},
];
function freePlan(def,race){const sw=RACES[race].swap;if(def.plans&&def.plans[race])return def.plans[race];return def.plan.map(s=>({...s,s:sw[s.s]||s.s}));}
