// ---------- Free Play: maps written in base skills, with the races that have a tested solution ----------
// Every map lists `races`, the races whose solution plan passes in tests/free.py (the test fails if a list goes stale). The picker only offers those, until the player unlocks the rest.
// Maps use the eight base skills. Each race's panel swaps some of them (see RACES[k].swap), so a plan written in base names is renamed per race.
const FREE_TIERS=[{k:1,n:'PUSHOVER'},{k:2,n:'FIDDLY'},{k:3,n:'NASTY'},{k:4,n:'CARNAGE'}];

// the sculpt helpers (fxProf, fxCeil, fxMass, fxSpine, fxDec ...) live in maps/sculpt.js
const FREE_MAPS=[
 {id:'f1-01',style:'organic',tier:1,races:['goblin','swamp','imp','dwarf','rat','shroom'],name:'Gap Year',theme:'bog',w:900,h:340,n:24,need:12,rate:34,time:260,hint:'Everyone leaves home eventually. Down the hill, through the old temple, then BRIDGE the gap.',skills:{build:5},
  // design: a sunken bog temple. Mossy hilltop under open sky, a long diagonal slope into a ruined basin, then a cave mouth with hanging roots and a rising ramp to the hut.
  hatch:[{x:80,y:40,dir:1}],doors:[{x:850,y:112}],haz:[{x0:566,x1:606,y:298,y1:318,water:1},{x0:110,x1:232,y:224,y1:242,water:1},{x0:640,x1:768,y:274,y1:292,water:1}],
  build(S){fxProf(S,[[0,78],[70,70],[140,76],[210,100],[270,134],[320,164],[370,186],[430,198],[490,207],[540,201],[566,197],[606,197],[650,193],[700,181],[750,153],[790,127],[840,112],[900,108]],0,3);
   S.cut(566,150,40,168);S.box(566,318,40,22);
   fxCeil(S,[[400,-30],[450,6],[520,24],[620,30],[720,22],[800,14],[900,8]],4);
   fxMass(S,[[522,18],[532,58],[516,92],[528,118]],10,2,2);fxMass(S,[[700,16],[688,48],[704,78]],9,2,2);fxMass(S,[[612,24],[606,44]],7,2,1);
   S.cutEll(170,214,56,20);S.cut(110,214,122,28);S.cutEll(704,264,58,16);S.cut(640,264,128,28);
   fxDec(S,'bigtree',120,76);fxDec(S,'reeds',236,110);fxDec(S,'tree',30,78);fxDec(S,'reeds',330,170);
   fxDec(S,'brokencolumn',400,192);fxDec(S,'archway',462,204);fxDec(S,'statue',512,204);fxDec(S,'torch',548,199);
   fxDec(S,'torch',648,193);fxDec(S,'ruin',728,170);fxDec(S,'torch',812,120);fxDec(S,'torch',884,110);
   fxDec(S,'rootdrop',580,30);fxDec(S,'vines',770,20);fxDec(S,'drip',660,30);fxDec(S,'moss',180,120);fxDec(S,'roots',700,230);
   fxRough(S,[[540,140,630,330],[620,250,790,300],[90,200,250,250]]);},
  plan:[{x:558,d:1,s:'build',tol:1,y:197,ytol:10}]},
 {id:'f1-02',style:'mixed',tier:1,races:['goblin','swamp','imp','dwarf','rat','bone','shroom'],name:'Rock Bottom',theme:'mine',w:900,h:340,n:24,need:12,rate:34,time:240,hint:'The old gallery goes nowhere. The way out is down. DIG.',skills:{dig:3},
  // design: an abandoned mine. A shored gallery winds through the rock with dead ends both sides; under it a huge natural cavern with a flooded sump on the left and the exit lift on the right.
  hatch:[{x:110,y:110,dir:1}],doors:[{x:800,y:300}],haz:[{x0:120,x1:262,y:300,y1:318,water:1}],
  build(S){S.box(0,0,900,340);
   fxSpine(S,[[70,124],[170,132],[270,126],[370,134],[470,128],[540,132]],20,3);
   fxSpine(S,[[300,240],[410,212],[560,246],[700,262],[850,262]],34,6);fxSpine(S,[[80,268],[190,276],[300,256]],26,4);S.cut(120,292,142,26);
   fxSpine(S,[[600,40],[680,30],[780,46],[860,40]],16,4);
   fxDec(S,'shoring',150,150);fxDec(S,'torch',200,152);fxDec(S,'shoring',320,152);fxDec(S,'rubble',260,152);fxDec(S,'torch',440,152);fxDec(S,'shoring',500,152);fxDec(S,'drip',230,110);fxDec(S,'chain',380,112);
   fxDec(S,'brokencolumn',360,296);fxDec(S,'statue',520,296);fxDec(S,'torch',600,296);fxDec(S,'rubble',660,296);fxDec(S,'torch',760,296);fxDec(S,'shoring',840,296);fxDec(S,'rootdrop',470,226);fxDec(S,'drip',700,228);fxDec(S,'rootdrop',180,248);
   fxDec(S,'ore',300,80);fxDec(S,'ore',620,180);fxDec(S,'ore',80,200);fxDec(S,'embers',720,320);fxDec(S,'vines',700,30);fxRough(S);},
  plan:[{x:400,d:1,s:'dig',tol:2,y:150,ytol:20}]},
 {id:'f1-03',style:'mechanical',tier:1,races:['goblin','swamp','imp','fairy','dwarf','rat','bone','shroom'],name:'Wrong Way Round',theme:'forge',w:900,h:340,n:24,need:12,rate:34,time:240,hint:'The foundry floor ends in fire. The hut is the other way. BOUNCE them back.',skills:{block:2},
  // design: the great foundry. A heavy floor slab held up on pillars over a lava lake, broken off at the right; the left climbs in worn steps to the hut. Chains and banners hang from a masonry roof.
  hatch:[{x:420,y:110,dir:1}],doors:[{x:70,y:140}],haz:[{x0:24,x1:876,y:300,y1:316}],
  build(S){S.box(0,0,24,340);S.box(876,0,24,340);S.box(0,316,900,24);
   fxProf(S,[[24,140],[90,140],[130,146],[170,150],[220,156],[300,160],[400,162],[500,160],[600,164],[640,166]],0,2);S.cut(640,100,236,216);
   S.cut(24,218,616,98);fxProf(S,[[24,222],[100,232],[200,226],[300,236],[400,228],[500,236],[640,230]],218,3);S.cut(24,218,616,6);
   for(const x of [70,190,310,430,550])S.box(x,160,24,156);
   fxCeil(S,[[0,40],[120,46],[260,40],[420,52],[560,44],[700,58],[800,50],[900,46]],3);fxMass(S,[[720,56],[740,90],[732,120]],10,3,2);
   fxDec(S,'banner',150,94);fxDec(S,'banner',370,98);fxDec(S,'banner',600,96);fxDec(S,'chain',260,98);fxDec(S,'chain',480,104);fxDec(S,'chain',800,108);fxDec(S,'gear',820,170);
   fxDec(S,'statue',180,152);fxDec(S,'torch',240,158);fxDec(S,'brokencolumn',340,162);fxDec(S,'torch',480,162);fxDec(S,'rubble',560,162);fxDec(S,'torch',620,166);fxDec(S,'torch',40,140);
   fxDec(S,'aqueduct',800,300);fxDec(S,'embers',300,250);fxDec(S,'ore',150,190);fxDec(S,'ore',500,300);fxRough(S,[[560,150,880,240]]);},
  plan:[{x:600,d:1,s:'block',tol:2,y:164,ytol:15}]},
 {id:'f1-04',style:'mixed',tier:1,races:['goblin','swamp','imp','fairy','dwarf','rat','shroom'],name:'Step Up',theme:'dunes',w:900,h:340,n:24,need:12,rate:34,time:240,hint:'The temple sits on a ledge, and nobody here can climb. BRIDGE up to it.',skills:{build:5},
  // design: a buried desert temple. Dunes pour down into a hollow; a sandstone terrace carries a pillared portico and the hut. Under the sand: an oasis pool and a sealed tomb.
  hatch:[{x:90,y:120,dir:1}],doors:[{x:800,y:176}],haz:[{x0:120,x1:250,y:292,y1:314,water:1},{x0:560,x1:720,y:296,y1:318,water:1}],
  build(S){fxCeil(S,[[0,30],[120,40],[240,26],[360,44],[460,30],[560,36],[700,24],[900,30]],4);
   fxProf(S,[[0,142],[60,140],[120,152],[180,182],[240,208],[300,220],[420,220]],0,3);S.box(420,176,452,164);fxProf(S,[[420,176],[700,176],[760,172],[872,170],[900,168]],0,1);S.box(872,0,28,340);
   S.box(450,92,330,14);S.box(470,84,290,8);
   S.cutEll(185,286,60,18);S.cut(120,286,130,28);S.cut(560,262,160,56);S.cut(578,248,124,14);
   fxDec(S,'column',480,176);fxDec(S,'column',560,176);fxDec(S,'brokencolumn',640,176);fxDec(S,'column',740,176);fxDec(S,'statue',700,176);fxDec(S,'torch',600,176);fxDec(S,'torch',840,172);
   fxDec(S,'bigtree',70,141);fxDec(S,'rubble',220,204);fxDec(S,'ruin',300,220);fxDec(S,'rubble',380,220);fxDec(S,'statue',600,296);fxDec(S,'tomb',650,296);fxDec(S,'bones',700,240);fxDec(S,'rocks',200,262);fxDec(S,'rootdrop',300,48);fxRough(S,[[300,150,480,230],[440,80,790,110]]);},
  plan:[{x:340,d:1,s:'build',tol:1},{st:'walk',x:386,tol:8,y:198,ytol:8,d:1,s:'build'}],
  plans:{rat:[{x:336,d:1,s:'build',tol:1},{st:'walk',x:386,tol:8,y:198,ytol:12,d:1,s:'build'}]}},
 {id:'f1-05',style:'mixed',tier:1,races:['goblin','swamp','imp','dwarf','rat','bone'],name:'Thin Walls',theme:'halls',w:900,h:340,n:24,need:12,rate:34,time:240,hint:'A rough cave, then a dwarf wall. Dwarves built it to last. Goblins had other ideas. BASH through.',skills:{bash:3},
  // design: a wild cave breaks into a dwarf hall. Left is all natural rock and roots; a cut masonry gate seals the cave; beyond it a straight pillared hall over a cistern.
  hatch:[{x:90,y:130,dir:1}],doors:[{x:780,y:220}],haz:[{x0:150,x1:320,y:280,y1:300,water:1},{x0:540,x1:760,y:292,y1:320,water:1}],
  build(S){fxCeil(S,[[0,70],[60,92],[140,64],[220,96],[300,72],[400,84]],5);S.box(400,0,500,64);S.box(872,0,28,340);
   fxProf(S,[[0,176],[70,186],[150,206],[230,214],[300,220],[400,220]],0,3);S.box(400,220,500,120);S.box(400,40,40,180);
   fxMass(S,[[160,70],[170,104],[160,128]],10,3,2);fxMass(S,[[300,74],[296,100]],8,3,2);
   S.cutEll(235,272,80,14);S.cut(150,272,170,28);S.cut(540,250,220,70);for(const x of [580,650,720])S.box(x,250,14,42);
   fxDec(S,'rootdrop',120,90);fxDec(S,'vines',240,96);fxDec(S,'drip',340,80);fxDec(S,'rubble',180,210);fxDec(S,'bigtree',60,182);
   fxDec(S,'banner',480,64);fxDec(S,'banner',620,64);fxDec(S,'banner',760,64);fxDec(S,'column',520,220);fxDec(S,'column',600,220);fxDec(S,'column',680,220);fxDec(S,'statue',720,220);fxDec(S,'torch',470,220);fxDec(S,'torch',830,220);
   fxDec(S,'bricks',420,110);fxDec(S,'plate',420,170);fxRough(S,[[380,30,460,225],[400,0,900,70],[530,240,770,330],[130,260,340,310]]);},
  plan:[{x:391,d:1,s:'bash',tol:2}]},
 {id:'f2-01',style:'mixed',tier:2,races:['goblin','imp','dwarf','rat'],name:'Two Steps Forward',theme:'halls',w:900,h:340,n:24,need:18,rate:34,time:260,hint:'Off the ledge, over the sluice, through the gate. BRIDGE then BASH.',skills:{build:2,bash:2},
  // design: a flooded aqueduct. A rock spur juts out of the cave wall; below, an old sluice channel cuts the floor; a masonry sluice gate closes the far hall where the arches stand.
  hatch:[{x:80,y:84,dir:1}],doors:[{x:830,y:190}],haz:[{x0:262,x1:302,y:252,y1:264,water:1},{x0:620,x1:820,y:288,y1:320,water:1},{x0:60,x1:200,y:300,y1:320,water:1}],
  build(S){fxCeil(S,[[0,24],[100,40],[200,30],[300,56],[420,40],[560,60]],5);S.box(560,0,340,60);S.box(872,0,28,340);
   fxProf(S,[[0,104],[70,110],[140,112],[168,118]],0,3);S.cut(168,118,94,82);fxProf(S,[[168,198],[220,200],[262,200]],0,1);fxProf(S,[[302,190],[380,192],[460,186],[520,190],[600,190],[872,190]],0,2);
   S.cut(262,200,40,64);S.box(262,264,40,76);S.box(560,60,40,150);
   S.cutEll(130,296,66,14);S.cut(60,296,140,24);S.cut(620,262,200,58);for(const x of [660,720,780])S.box(x,262,12,30);
   fxMass(S,[[400,52],[412,86],[404,112]],9,2,2);
   fxDec(S,'shoring',60,108);fxDec(S,'torch',120,110);fxDec(S,'rubble',210,200);fxDec(S,'torch',240,200);fxDec(S,'brokencolumn',360,192);fxDec(S,'statue',470,186);fxDec(S,'torch',520,190);
   fxDec(S,'bricks',580,110);fxDec(S,'plate',580,170);fxDec(S,'archway',690,190);fxDec(S,'banner',640,60);fxDec(S,'banner',800,60);fxDec(S,'torch',790,190);fxDec(S,'rootdrop',220,40);fxDec(S,'drip',330,56);fxRough(S,[[240,150,330,270],[540,50,620,200],[560,0,900,66],[600,250,840,330],[40,280,220,330]]);},
  plan:[{x:256,d:1,s:'build',tol:1,y:200,ytol:12},{x:551,d:1,s:'bash',tol:2,y:190,ytol:12}]},
 {id:'f2-02',style:'mixed',tier:2,races:['goblin','swamp','imp','dwarf','rat','bone'],name:'Basement Door',theme:'mine',w:900,h:340,n:24,need:18,rate:34,time:260,hint:'Miners dug the tunnel; masons built the cellar below. DIG down, then BASH across.',skills:{dig:2,bash:2},
  // design: a twisting miners' tunnel above a squared brick cellar. Two worlds stacked: the rough one on top, the built one underneath.
  hatch:[{x:90,y:86,dir:1}],doors:[{x:760,y:226}],haz:[{x0:610,x1:800,y:296,y1:322,water:1}],
  build(S){S.box(0,0,900,340);
   fxSpine(S,[[50,96],[150,104],[250,100],[340,102],[440,96],[540,104],[640,96],[700,90]],18,3);fxSpine(S,[[700,90],[760,60],[820,40]],12,2);
   S.cut(28,178,844,48);S.box(520,170,40,56);S.cut(610,270,190,52);for(const x of [650,710,770])S.box(x,270,12,30);
   fxDec(S,'shoring',120,122);fxDec(S,'torch',180,122);fxDec(S,'shoring',400,120);fxDec(S,'rubble',460,120);fxDec(S,'torch',560,122);fxDec(S,'chain',240,84);fxDec(S,'drip',600,82);
   fxDec(S,'brokencolumn',120,226);fxDec(S,'torch',200,226);fxDec(S,'column',380,226);fxDec(S,'torch',450,226);fxDec(S,'bricks',540,200);fxDec(S,'statue',660,226);fxDec(S,'torch',820,226);
   fxDec(S,'ore',250,40);fxDec(S,'ore',520,300);fxDec(S,'embers',700,40);fxRough(S,[[20,170,880,232],[600,260,810,330]]);},
  plan:[{x:300,d:1,s:'dig',tol:2,y:120,ytol:15},{x:511,d:1,s:'bash',tol:2,y:226,ytol:15}]},
 {id:'f2-03',style:'organic',tier:2,races:['goblin','swamp','imp','fairy','dwarf','rat','shroom'],name:'Bounce Then Bridge',theme:'bog',w:900,h:340,n:24,need:18,rate:34,time:260,hint:'The hut is in the old tree behind you, and the creek is in the way. BOUNCE them round, then BRIDGE.',skills:{block:2,build:2},
  // design: a drowned forest. A giant tree bole carries the hut on the left; a creek cuts the path; the right ends at a broken bank over the marsh.
  hatch:[{x:420,y:110,dir:1}],doors:[{x:60,y:176}],haz:[{x0:230,x1:260,y:252,y1:264,water:1},{x0:640,x1:872,y:242,y1:256,water:1}],
  build(S){fxCeil(S,[[520,-30],[600,16],[700,30],[800,22],[900,14]],4);S.box(872,0,28,340);
   fxProf(S,[[0,176],[120,176],[170,172],[210,176],[230,176]],0,2);fxProf(S,[[260,200],[340,202],[420,198],[520,204],[600,200],[640,200]],0,2);S.box(640,256,232,84);
   S.cut(230,176,30,88);S.box(230,264,30,76);
   fxDec(S,'bigtree',120,176,1,2);
   fxMass(S,[[700,26],[712,60],[700,92]],9,2,2);fxMass(S,[[800,18],[790,48]],8,2,2);
   S.cutEll(420,268,90,16);S.cut(340,268,160,24);
   fxDec(S,'reeds',300,202);fxDec(S,'statue',330,202);fxDec(S,'ruin',470,200);fxDec(S,'reeds',560,204);fxDec(S,'torch',590,200);fxDec(S,'rootdrop',650,30);fxDec(S,'vines',760,26);fxDec(S,'roots',250,230);fxDec(S,'moss',480,240);fxDec(S,'tree',380,200);
   fxRough(S,[[210,170,280,270],[620,190,880,260],[0,160,240,190]]);},
  plan:[{x:610,d:1,s:'block',tol:2,y:200,ytol:15},{x:272,d:-1,s:'build',tol:2,y:200,ytol:12}]},
 {id:'f2-04',style:'organic',tier:2,races:['goblin','swamp','imp','fairy','dwarf','rat','shroom'],name:'Stairway to Hut',theme:'dunes',w:900,h:340,n:24,need:18,rate:34,time:260,hint:'Wind-cut terraces climb to the hut, and nobody here can climb. BRIDGE twice.',skills:{build:3},
  // design: a canyon of wind-eroded mesas. Each terrace is a sandstone shelf with an overhang; a natural arch spans the top; an oasis hides under the rock.
  hatch:[{x:80,y:150,dir:1}],doors:[{x:830,y:182}],haz:[{x0:90,x1:230,y:300,y1:322,water:1},{x0:600,x1:780,y:296,y1:322,water:1}],
  build(S){fxCeil(S,[[0,40],[140,56],[260,34],[380,60],[520,40],[640,64],[760,44],[900,52]],5);S.box(872,0,28,340);
   fxProf(S,[[0,176],[60,180],[120,196],[180,220],[240,230],[300,230]],0,3);fxProf(S,[[300,206],[440,206],[500,204],[560,206]],0,2);fxProf(S,[[560,182],[700,182],[760,180],[872,182]],0,2);
   S.box(300,206,260,134);S.box(560,182,312,158);
   fxMass(S,[[430,50],[440,90],[432,120]],10,3,2);fxMass(S,[[700,60],[690,96]],8,2,2);
   S.cutEll(160,296,66,16);S.cut(90,296,140,26);S.cutEll(690,290,86,16);S.cut(600,290,180,32);
   fxDec(S,'bigtree',60,178);fxDec(S,'rubble',200,224);fxDec(S,'ruin',230,230);fxDec(S,'statue',360,206);fxDec(S,'brokencolumn',450,206);fxDec(S,'torch',620,182);fxDec(S,'statue',700,182);fxDec(S,'torch',790,182);fxDec(S,'bones',650,250);fxDec(S,'rocks',400,260);fxDec(S,'rootdrop',300,60);
   fxRough(S,[[240,180,320,240],[500,160,580,215],[70,280,250,330],[580,270,800,330]]);},
  plan:[{x:262,d:1,s:'build',tol:2},{x:522,d:1,s:'build',tol:2}]},
 {id:'f2-05',style:'organic',tier:2,races:['goblin','swamp','imp','dwarf','bone'],name:'Long Way Down',theme:'frost',w:900,h:340,n:24,need:18,rate:34,time:260,hint:'The glacier ends in a sheer drop. Too far to fall. PICK a way down.',skills:{pick:2},
  // design: a glacier tongue. A great ice cliff overhangs a frozen valley; icicles hang from the cave mouth; a meltwater lake sits sealed under the valley floor.
  hatch:[{x:80,y:70,dir:1}],doors:[{x:800,y:230}],haz:[{x0:420,x1:600,y:296,y1:322,water:1}],
  build(S){fxCeil(S,[[0,20],[100,34],[200,24],[320,40],[460,30],[600,48],[740,34],[900,30]],5);S.box(872,0,28,340);
   fxProf(S,[[0,96],[90,100],[180,98],[250,100],[300,100]],0,2);fxProf(S,[[300,232],[380,236],[460,228],[560,234],[640,226],[740,230],[872,230]],0,2);S.box(28,100,272,240);
   
   S.cutEll(510,290,86,16);S.cut(420,290,180,32);
   fxMass(S,[[500,40],[512,80],[504,110]],9,2,2);fxMass(S,[[680,44],[672,80]],8,2,2);
   fxDec(S,'statue',60,96);fxDec(S,'rubble',150,98);fxDec(S,'ruin',220,100);fxDec(S,'brokencolumn',400,234);fxDec(S,'statue',480,228);fxDec(S,'archway',600,234);fxDec(S,'torch',700,228);fxDec(S,'torch',770,230);fxDec(S,'drip',560,48);fxDec(S,'bones',420,262);
   fxRough(S,[[240,90,340,240],[400,270,620,330]]);},
  plan:[{x:262,d:1,s:'pick',tol:2,y:100,ytol:15}]},
];
function freePlan(def,race){const sw=RACES[race].swap;if(def.plans&&def.plans[race])return def.plans[race];return def.plan.map(s=>({...s,s:sw[s.s]||s.s}));}
