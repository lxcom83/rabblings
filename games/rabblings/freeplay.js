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
 {id:'f3-01',style:'organic',tier:3,races:['goblin','swamp','imp','dwarf'],name:'Standing Stones',theme:'bog',w:1100,h:420,n:30,need:22,rate:30,time:330,hint:'Ditch, mountain, pool, step. Four gates, and none of them forgive a wasted skill.',skills:{build:5,bash:2},
  // design: a drowned valley under a ridge of standing stones. The hatch sits high on the right ridge; a meadow ditch, a cave through the mountain's heart, a sealed pool and a raised hut platform stand between the troops and home.
  hatch:[{x:1040,y:70,dir:-1}],doors:[{x:60,y:222}],haz:[{x0:790,x1:830,y:260,y1:300,water:1},{x0:262,x1:338,y:284,y1:340,water:1}],
  build(S){
   fxProf(S,[[0,222],[104,222],[112,262],[140,262],[190,236],[240,250],[300,262],[360,250],[420,206],[470,150],[520,100],[580,88],[640,118],[684,168],[700,232],[740,240],[800,246],[860,232],[920,248],[960,232],[1000,160],[1040,106],[1100,100]],0,3);
   fxBasin(S,262,338,262,22,340);fxBasin(S,790,830,246,14,300);
   fxCrag(S,500,100,26,40,.1);fxCrag(S,610,96,20,30,-.1);
   fxBurrow(S,[[704,246],[650,258],[598,276],[546,296],[490,278],[438,262],[392,258],[360,254]],14,6);S.cutEll(520,290,46,26);S.cutEll(660,254,34,22);S.cutEll(716,244,26,22);S.cutEll(352,248,22,18);
   S.box(594,232,24,70);
   fxDec(S,'bigtree',24,222);fxDec(S,'ruin',160,262);fxDec(S,'reeds',236,252);fxDec(S,'reeds',366,252);fxDec(S,'tree',770,242);fxDec(S,'column',780,244);fxDec(S,'brokencolumn',900,236);fxDec(S,'statue',940,238);fxDec(S,'tree',1020,150);fxDec(S,'tree',540,98);fxDec(S,'rocks',420,206);fxDec(S,'moss',650,258);fxDec(S,'column',70,222);
   fxRough(S,[[240,240,360,360],[590,226,622,304],[780,240,840,310],[96,216,150,270]]);},
  plan:[{x:833,d:-1,s:'build',tol:2,y:246,ytol:14},{x:628,d:-1,s:'bash',tol:4},{x:348,d:-1,s:'build',tol:3,wait:200},{x:300,d:-1,s:'build',tol:3,wait:120},{x:122,d:-1,s:'build',tol:3,y:262,ytol:14}]},
 {id:'f3-02',style:'organic',tier:3,races:['goblin','swamp','imp','dwarf','rat'],name:'Switchback Falls',theme:'mine',w:560,h:640,n:36,need:31,rate:30,time:360,hint:'Down the cliff, ledge by ledge. Each shelf wants a different skill, and the last pool is the narrowest.',skills:{build:5,bash:2},
  // design: a waterfall canyon seen top to bottom. Four rock shelves jut alternately from the two walls; every shelf has its own obstacle (a pool, a standing stone, a pool, a stone) and a flooded cavern with the hut waits at the bottom.
  hatch:[{x:90,y:50,dir:1}],doors:[{x:70,y:488}],haz:[{x0:168,x1:198,y:120,y1:138,water:1},{x0:272,x1:302,y:409,y1:424,water:1},{x0:120,x1:150,y:497,y1:528,water:1}],
  build(S){S.box(0,0,560,640);S.cut(40,0,480,540);
   for(const [x,y,r] of [[36,60,26],[30,200,22],[34,330,28],[28,460,24],[528,120,24],[532,260,28],[530,390,22]])S.cutEll(x<200?x+14:x-14,y,r,r*1.5);
   fxProf(S,[[40,490],[120,486],[200,482],[300,492],[420,488],[524,484]],0,3);
   fxMass(S,[[36,124],[120,126],[220,122],[320,128]],24,14,2);fxMass(S,[[524,220],[440,222],[340,218],[236,224]],24,14,2);
   fxMass(S,[[36,316],[120,318],[220,314],[320,320]],24,14,2);fxMass(S,[[524,412],[440,414],[340,410],[236,416]],24,14,2);
   fxBasin(S,168,198,102,14,138);fxCrag(S,420,196,34,52,0);fxCrag(S,110,292,30,50,0);fxBasin(S,272,302,388,14,424);fxBasin(S,120,150,486,14,528);
   fxDec(S,'torch',60,102);fxDec(S,'tree',250,102);fxDec(S,'rocks',300,102);fxDec(S,'statue',480,198);fxDec(S,'torch',360,198);fxDec(S,'brokencolumn',260,296);fxDec(S,'torch',190,294);fxDec(S,'ruin',480,392);fxDec(S,'torch',380,390);fxDec(S,'bones',300,488);fxDec(S,'column',420,488);fxDec(S,'statue',470,486);fxDec(S,'torch',70,488);fxDec(S,'drip',80,0);
   fxRough(S,[[150,90,210,150],[400,150,440,200],[96,240,130,296],[256,380,316,430],[110,480,180,540]]);},
  plan:[{x:165,d:1,s:'build',tol:2,y:102,ytol:14},{x:398,d:1,s:'bash',tol:3,y:196,ytol:14},{x:134,d:-1,s:'bash',tol:3,y:292,ytol:14},{x:305,d:-1,s:'build',tol:2,y:388,ytol:14},{x:153,d:-1,s:'build',tol:2,y:486,ytol:14}]},
 {id:'f4-01',style:'organic',tier:4,races:['goblin','swamp','imp','dwarf','rat'],name:'Bone Orchard',theme:'crypts',w:600,h:860,n:44,need:39,rate:30,time:480,hint:'Six shelves down a crypt shaft and not one spare skill. Count every BUILD and every BASH before you spend them.',skills:{build:5,bash:4},
  // design: a crypt shaft seen top to bottom. Six rock shelves jut alternately from the walls; each guards the next with a pool or a standing stone, two of them with both. The hut waits behind the last pool.
  hatch:[{x:90,y:48,dir:1}],doors:[{x:70,y:676}],haz:[{x0:220,x1:250,y:115,y1:131,water:1},{x0:250,x1:280,y:313,y1:328,water:1},{x0:275,x1:305,y:411,y1:427,water:1},{x0:348,x1:370,y:594,y1:608,water:1},{x0:120,x1:150,y:695,y1:724,water:1}],
  build(S){S.box(0,0,600,860);S.cut(40,0,520,720);
   for(const [x,y,r] of [[36,60,26],[30,200,22],[34,330,28],[28,460,24],[30,600,24],[564,120,24],[568,260,28],[566,390,22],[564,520,26],[568,650,22]])S.cutEll(x<200?x+14:x-14,y,r,r*1.5);
   fxProf(S,[[40,684],[120,680],[200,676],[300,686],[420,682],[560,678]],0,3);
   fxMass(S,[[36,124],[150,126],[270,122],[390,128]],24,14,2);fxMass(S,[[564,220],[450,222],[330,218],[210,224]],24,14,2);fxMass(S,[[36,316],[150,318],[270,314],[390,320]],24,14,2);fxMass(S,[[564,412],[450,414],[330,410],[210,416]],24,14,2);fxMass(S,[[36,508],[150,510],[270,506],[390,512]],24,14,2);fxMass(S,[[564,604],[450,606],[330,602],[210,608]],24,14,2);
   fxBasin(S,220,250,124,14,131);fxCrag(S,480,196,34,52,0);fxBasin(S,250,280,300,14,328);fxCrag(S,470,388,34,52,0);fxBasin(S,275,305,394,14,427);fxCrag(S,120,484,30,50,0);fxCrag(S,460,580,34,52,0);fxBasin(S,348,370,586,8,608);fxBasin(S,120,150,690,14,724);
   fxDec(S,'torch',60,100);fxDec(S,'tomb',300,100);fxDec(S,'bones',160,100);fxDec(S,'statue',520,198);fxDec(S,'torch',340,198);fxDec(S,'brokencolumn',260,296);fxDec(S,'torch',200,294);fxDec(S,'tomb',500,392);fxDec(S,'torch',330,390);fxDec(S,'bones',250,488);fxDec(S,'torch',60,486);fxDec(S,'column',520,584);fxDec(S,'statue',320,584);fxDec(S,'bones',300,684);fxDec(S,'column',420,682);fxDec(S,'torch',70,684);
   fxRough(S,[[210,110,260,160],[80,300,130,350],[490,400,540,450],[440,590,510,640],[110,680,160,730]]);},
  plan:[{x:217,d:1,s:'build',tol:2,y:106,ytol:14},{x:462,d:1,s:'bash',tol:3,y:196,ytol:14},{x:247,d:1,s:'build',tol:1,y:296,ytol:14},{x:452,d:1,s:'bash',tol:3,y:388,ytol:14},{x:308,d:-1,s:'build',tol:1,y:388,ytol:14},{x:138,d:-1,s:'bash',tol:3,y:484,ytol:14},{x:442,d:1,s:'bash',tol:3,y:580,ytol:14},{x:373,d:-1,s:'build',tol:1,y:580,ytol:14},{x:157,d:-1,s:'build',tol:1,y:680,ytol:16}]},
 {id:'f3-03',style:'organic',tier:3,races:['goblin','swamp','imp','dwarf','rat'],name:'Sunken Stair',theme:'ruins',w:1000,h:480,n:40,need:28,rate:28,time:420,hint:'Four cliffs and a toothed pit stand between you and the temple. A bash at the first cliff leads down a hidden tunnel under the pit.',skills:{build:5,bash:2},
  // design: a drowned ruin climbed from the valley floor to the temple on the ridge. Four low cliffs, a toothed pit, a crusher and a flame jet on the flats.
  hatch:[{x:70,y:372,dir:1}],doors:[{x:930,y:120}],haz:[],
  traps:[{k:'jaws',x:391,y:437,rw:26,rh:10},{k:'press',x:190,y:392,per:240}],
  build(S){
   fxProf(S,[[0,420],[120,420],[146,420],[148,396],[200,392],[260,384],[300,380],[302,356],[340,352],[372,350],[378,440],[404,440],[410,350],[470,330],[520,308],[560,300],[562,276],[610,270],[680,250],[720,226],[722,200],[770,196],[840,170],[880,150],[900,122],[1000,120]],0,3);
   fxStair(S,172,420,250,436,18);fxStair(S,250,436,390,462,18);fxStair(S,390,462,522,308,18);
   fxDec(S,'ruin',40,420);fxDec(S,'column',200,392);fxDec(S,'brokencolumn',330,352);fxDec(S,'tree',620,270);fxDec(S,'statue',800,196);fxDec(S,'column',960,120);
   fxRough(S,[[370,340,440,450]]);},
  alts:[[{x:143,d:1,s:'bash',tol:3,y:420,ytol:14},{x:557,d:1,s:'build',tol:3,y:300,ytol:14},{x:717,d:1,s:'build',tol:3,y:226,ytol:14}]],
  plan:[{x:143,d:1,s:'build',tol:3,y:420,ytol:14},{x:296,d:1,s:'build',tol:3,y:380,ytol:14},{x:368,d:1,s:'build',tol:2,y:351,ytol:14},{x:557,d:1,s:'build',tol:3,y:300,ytol:14},{x:717,d:1,s:'build',tol:3,y:226,ytol:14}]},
 {id:'f3-04',style:'organic',tier:3,races:['goblin','swamp','imp','fairy','dwarf','rat','shroom'],name:'Hollow Mountain',theme:'caves',w:900,h:620,n:40,need:28,rate:28,time:460,hint:'The hatch is at the bottom of the mountain and the way out is at the top. Three lips and a toothed pit say bridge. A soft patch of floor says dig.',skills:{build:5,dig:1,bash:1},
  // design: a cave corridor climbs the mountain in three lips and a pit. A hidden low tunnel runs under all of it and comes out on the last ledge, reached by digging down through the floor of the second flat.
  hatch:[{x:60,y:470,dir:1}],doors:[{x:850,y:370}],haz:[],
  traps:[{k:'jaws',x:349,y:498,rw:26,rh:10},{k:'press',x:262,y:476,per:240}],
  build(S){S.box(0,0,900,620);
   fxRun(S,[[30,500],[110,500],[200,500],[202,476],[300,476],[330,476],[334,500],[364,500],[368,476],[470,461],[520,458],[522,434],[640,424],[700,416],[702,392],[800,384],[870,368]],[110,70,56,56,56,56,56,56,56,56,56,56,56,56,56,56,60]);
   fxTunnel(S,250,620,562);fxStair(S,620,562,704,452,18);fxStair(S,704,452,724,392,18);
   fxHall(S,30,196,500,120,.3,40);
   fxStal(S,40,190,380,24,16);fxStal(S,230,320,420,18,14);fxStal(S,520,640,372,20,14);fxStal(S,720,860,330,22,14);
   fxDec(S,'torch',60,500);fxDec(S,'mushroom',150,500);fxDec(S,'bones',270,476);fxDec(S,'torch',320,476);fxDec(S,'mushroom',420,466);fxDec(S,'torch',560,432);fxDec(S,'mushroom',620,424);fxDec(S,'torch',740,392);fxDec(S,'torch',820,382);fxDec(S,'column',850,370);
   fxRough(S,[[326,490,372,520]]);},
  plan:[{x:190,d:1,s:'build',tol:4,y:500,ytol:14},{x:322,d:1,s:'build',tol:3,y:476,ytol:14},{x:486,d:1,s:'build',tol:6,y:458,ytol:14},{x:692,d:1,s:'build',tol:4,y:416,ytol:14}],
  alts:[[{x:190,d:1,s:'build',tol:4,y:500,ytol:14},{x:260,d:1,s:'dig',tol:2,y:476,ytol:14},{x:692,d:1,s:'build',tol:4,y:416,ytol:14}]]},
 {id:'f3-05',style:'organic',tier:3,races:['goblin','imp','fairy','dwarf','rat','shroom'],name:'Cinder Terraces',theme:'cinder',w:1100,h:640,n:40,need:28,rate:28,time:480,hint:'Three terraces of cinder and two lava pools. A cracked patch of floor by the hatch takes a PICK, and the tunnel under it skips the first pool and two lips.',skills:{build:5,pick:1},
  // design: terraces climbed from the cinder flats to the ridge. Two lava pools and a flame jet guard the three lips; a pick tunnel from the hatch hall runs under the first terrace and comes out on the second.
  hatch:[{x:60,y:490,dir:1}],doors:[{x:1040,y:376}],
  haz:[{x0:270,x1:310,y:508,y1:522,water:1},{x0:600,x1:640,y:464,y1:478,water:1}],
  traps:[{k:'jet',x:860,y:400,per:260}],
  build(S){S.box(0,0,1100,640);
   fxRun(S,[[30,520],[150,520],[152,496],[250,494],[330,490],[430,480],[432,456],[560,450],[660,446],[760,430],[762,406],[900,400],[960,396],[1010,380],[1070,370]],[120,80,70,70,70,70,70,70,70,70,70,70,70,70,70]);
   fxBasin(S,270,310,494,14,522);fxBasin(S,600,640,450,14,478);
   fxTunnel(S,170,360,596);fxStair(S,360,596,432,506,18);fxStair(S,432,506,448,456,18);
   fxHall(S,30,150,520,130,.3,40);
   fxStal(S,60,140,390,26,18);fxStal(S,440,560,386,24,14);fxStal(S,780,1000,330,26,14);
   fxDec(S,'torch',60,520);fxDec(S,'rocks',120,520);fxDec(S,'torch',220,494);fxDec(S,'bones',360,488);fxDec(S,'torch',480,456);fxDec(S,'rocks',520,452);fxDec(S,'torch',700,440);fxDec(S,'bones',820,406);fxDec(S,'torch',940,398);fxDec(S,'column',1040,378);
   fxRough(S,[[266,500,314,530],[596,456,644,486]]);},
  plan:[{x:104,d:1,s:'build',tol:8,y:520,ytol:14},{x:266,d:1,s:'build',tol:3,y:494,ytol:14},{x:384,d:1,s:'build',tol:8,y:482,ytol:14},{x:596,d:1,s:'build',tol:3,y:450,ytol:14},{x:714,d:1,s:'build',tol:8,y:436,ytol:14}],
  alts:[[{x:100,d:1,s:'pick',tol:3,y:520,ytol:14},{x:596,d:1,s:'build',tol:3,y:450,ytol:14},{x:714,d:1,s:'build',tol:8,y:436,ytol:14}]]},
];

// ---- corridor maps: a rising cave route laid out from a list of obstacles, with the bridge plan worked out ----
// seq items: ['belt',w<=34] conveyor that walks goblins backwards (bridge over it), ['f',len] flat, ['s',len,dy] slope, ['lip',h] wall to bridge (build), ['pit',w,depth,jaws] pit to bridge, ['pool',w] water/lava pool to bridge, ['trap',{k,...},dx] trap on the current flat
function corrPath(x0,y0,seq){let x=x0,y=y0;const pts=[[x,y]],plan=[],pools=[],traps=[],flats=[],walls=[];let fx=x;
 const flat=()=>{if(x-fx>=40)flats.push([fx,x,y]);};
 for(const it of seq){const k=it[0];
  if(k==='f'){x+=it[1];pts.push([x,y]);}
  else if(k==='s'){flat();x+=it[1];y+=it[2];pts.push([x,y]);fx=x;}
  else if(k==='lip'){flat();const h=it[1]||24;plan.push({x:x-36,d:1,s:'build',tol:8,y,ytol:14});walls.push(x);pts.push([x,y],[x+2,y-h]);x+=2;y-=h;fx=x;}
  else if(k==='pit'){flat();const w=it[1],dp=it[2]||24;plan.push({x:x-6,d:1,s:'build',tol:4,y,ytol:14});pts.push([x,y],[x+4,y+dp],[x+w,y+dp],[x+w+4,y]);if(it[3])traps.push({k:'jaws',x:x+w/2+2,y:y+dp-2,rw:w-6,rh:10});x+=w+4;fx=x;}
  else if(k==='pool'){const w=it[1];plan.push({x:x+8-5,d:1,s:'build',tol:3,y,ytol:14});pools.push({x0:x+8,x1:x+8+w,y});x+=w+16;pts.push([x,y]);}
  else if(k==='belt'){const w=it[1];plan.push({x:x-8,d:1,s:'build',tol:3,y,ytol:14});traps.push({k:'belt',x,y,w,dir:-1});x+=w;pts.push([x,y]);}
  else if(k==='trap'){traps.push({...it[1],x:Math.round(x+(it[2]||0)),y});}}
 flat();return{pts,plan,pools,traps,flats,walls,x,y};}
function corrMap(o){const C=corrPath(o.x0,o.y0,o.seq);const W=o.w,Hh=o.h;
 const hz=C.pools.map(p=>({x0:p.x0,x1:p.x1,y:p.y+14,y1:p.y+28,water:1}));
 const H=C.pts.map((p,i)=>i<2?(o.hall||110):56+((i*37)%5)*9);
 return{id:o.id,style:'organic',tier:o.tier,races:o.races||['goblin'],name:o.name,theme:o.theme,w:W,h:Hh,n:o.n,need:o.need,rate:o.rate||28,time:o.time||480,hint:o.hint,skills:o.skills,design:o.design,
  hatch:[{x:o.x0+30,y:o.y0-30,dir:1}],doors:[{x:C.x-30,y:C.y}],haz:hz,traps:C.traps.concat(o.traps?o.traps(C):[]),
  build(S){S.box(0,0,W,Hh);fxRun(S,C.pts,H);for(const p of C.pools)fxBasin(S,p.x0,p.x1,p.y,14,p.y+28);if(o.hall)fxHall(S,o.x0,o.x0+120,o.y0,o.hall+10,.3,40);
   for(const f of C.flats){const m=(f[0]+f[1])>>1;fxStal(S,f[0]+10,f[1]-10,f[2]-92,18,16);}
   if(o.extra)o.extra(S,C);
   const D=o.decor||['torch','bones','mushroom','rocks'];let i=0;for(const f of C.flats){const n=Math.max(1,Math.floor((f[1]-f[0])/110));for(let j=0;j<n;j++)fxDec(S,D[(i++)%D.length],Math.round(f[0]+(j+.5)*(f[1]-f[0])/n),f[2]);}
   fxDec(S,'column',C.x-30,C.y);},
  plan:C.plan.concat(o.plan2||[]),alts:o.alts?o.alts(C):undefined,_C:C};}

FREE_MAPS.push(corrMap({id:'f4-02',tier:4,races:['goblin','swamp','imp','fairy','dwarf','shroom'],name:'Drowned Ladder',theme:'sewers',w:1560,h:640,x0:40,y0:560,n:50,need:26,time:520,
 hint:'Nine rungs, nine bridges, no spare. Or find the soft patch past the first pool and dig down into the old drain that runs under the lot.',skills:{build:9,dig:1},
 seq:[['f',110],['lip'],['f',80],['pool',40],['f',60],['s',90,-60],['f',60],['lip'],['f',70],['pit',34,28,1],['f',70],['trap',{k:'press',per:210},-20],['f',60],['s',100,-50],['f',60],['lip'],['f',64],['pool',44],['f',60],['lip'],['f',60],['s',90,-40],['f',60],['pit',34,28,1],['f',50],['lip'],['f',90]],
 decor:['torch','reeds','bones','rocks'],
 extra(S,C){fxTunnel(S,280,1280,622);fxStair(S,1280,622,1420,290,18);},
 traps:C=>[{k:'press',x:760,y:622,per:200}],
 alts:C=>[[C.plan[0],C.plan[1],{x:300,d:1,s:'dig',tol:3,y:536,ytol:14}]]}));

FREE_MAPS.push(corrMap({id:'f4-03',tier:4,races:['goblin','imp','fairy','dwarf','rat'],name:'Cinder Gauntlet',theme:'cinder',w:1760,h:760,x0:40,y0:620,n:62,need:26,time:540,
 hint:'Lava, flame jets and a crusher on the way up, and ten bridges to spend. A tunnel behind the first cliff goes round the lot, if you can bash through.',skills:{build:10,bash:1},
 seq:[['f',110],['lip'],['f',70],['pool',44],['f',60],['trap',{k:'jet',per:260},0],['s',80,-40],['f',70],['lip'],['f',60],['pit',34,28,1],['f',80],['pool',40],['f',50],['s',90,-60],['f',60],['lip'],['f',70],['trap',{k:'press',per:220},0],['f',40],['lip'],['f',70],['pool',44],['f',60],['pit',34,28,1],['f',60],['s',100,-60],['f',50],['lip'],['f',100]],
 decor:['torch','rocks','bones','statue'],
 extra(S,C){const wl=C.walls[C.walls.length-1],ex=wl+34,t=700,r0=ex-Math.round((t-C.y)/2.4);fxStair(S,172,C.pts[0][1],270,t,18);fxTunnel(S,270,r0,t);fxStair(S,r0,t,ex,C.y,18);},
 traps:C=>[{k:'press',x:700,y:700,per:230},{k:'press',x:1100,y:700,per:230}],
 alts:C=>[[{x:C.walls[0]-5,d:1,s:'bash',tol:3,y:C.pts[0][1],ytol:14}]]}));
FREE_MAPS.push(corrMap({id:'f4-04',tier:4,races:['goblin','swamp','imp','fairy','dwarf','rat','shroom'],name:'Frostbite Climb',theme:'frost',w:1440,h:760,x0:40,y0:680,n:54,need:36,time:540,
 hint:'The conveyors push you back as fast as you walk, so each one needs a bridge over it. There are ten bridges and ten things in the way. A PICK on the flat past the first conveyor digs a way round the first half.',skills:{build:10,pick:1},
 seq:[['f',100],['belt',32],['f',60],['lip'],['f',70],['pit',34,28,1],['f',60],['belt',30],['f',60],['s',110,-90],['f',60],['lip'],['f',60],['pool',44],['f',50],['s',90,-70],['f',50],['belt',32],['f',70],['lip'],['f',70],['pit',34,28,1],['f',60],['lip'],['f',100]],
 decor:['torch','rocks','bones','reeds'],hall:120,
 extra(S,C){const t=730,ex=C.walls[1]+30,ey=C.pts.find(p=>p[0]>C.walls[1])[1]-24+24,r0=ex-Math.round((t-ey)/2.4);fxTunnel(S,246,r0,t);fxStair(S,r0,t,ex,ey,18);},
 alts:C=>[[C.plan[0],{x:196,d:1,s:'pick',tol:2,y:C.pts[0][1],ytol:14}].concat(C.plan.filter(p=>p.x>C.walls[1]+30))]}));

FREE_MAPS.push(corrMap({id:'f4-05',tier:4,races:['goblin','swamp','imp','rat','shroom'],name:'Crown of Thorns',theme:'vortex',w:2060,h:720,x0:40,y0:560,n:70,need:24,time:700,hall:120,
 hint:'Fourteen things in the way and fourteen bridges. The old miners left two tunnels under the crown: a bash behind the first cliff, and a dig further on.',skills:{build:14,bash:1,dig:1},
 seq:[['f',110],['belt',32],['f',60],['lip'],['f',70],['pool',44],['f',60],['trap',{k:'jet',per:240},0],['s',90,-70],['f',60],['lip'],['f',60],['pit',34,28,1],['f',70],['belt',30],['f',60],['lip'],['f',70],['trap',{k:'press',per:200},0],['f',40],['pool',44],['f',60],['s',100,-90],['f',60],['lip'],['f',60],['pit',34,28,1],['f',60],['belt',32],['f',60],['lip'],['f',70],['pool',44],['f',60],['s',90,-70],['f',50],['lip'],['f',100]],
 decor:['torch','rocks','bones','statue'],
 extra(S,C){const t=660,y0=C.pts[0][1],yAt=w=>C.pts.find(p=>p[0]>w)[1];
  const w1=C.walls[0],ex1=C.walls[3]+30,ey1=yAt(C.walls[3]),r1=ex1-Math.round((t-ey1)/2.4);fxStair(S,w1+22,y0,w1+22+Math.round((t-y0)/1.1),t,18);fxTunnel(S,w1+22+Math.round((t-y0)/1.1),r1,t);fxStair(S,r1,t,ex1,ey1,18);
  const xd=ex1+100,t2=yAt(xd)+95,ex2=C.walls[C.walls.length-1]+34,ey2=C.y,r2=ex2-Math.round((t2-ey2)/2.4);fxTunnel(S,xd-16,r2,t2);fxStair(S,r2,t2,ex2,ey2,18);C.alt={xd,yd:yAt(ex1)};},
 traps:C=>{const yAtT2=C=>C.pts.find(p=>p[0]>C.walls[3]+130)[1]+95;return [{k:'press',x:C.walls[1]+60,y:660,per:210},{k:'press',x:C.walls[4]-60,y:yAtT2(C),per:260}];},
 alts:C=>{const yAt=w=>C.pts.find(p=>p[0]>w)[1];const A=[C.plan[0],{x:C.walls[0]-5,d:1,s:'bash',tol:3,y:C.pts[0][1],ytol:14}].concat(C.plan.filter(p=>p.x>C.walls[3]+30));return[A,[C.plan[0],{x:C.walls[0]-5,d:1,s:'bash',tol:3,y:C.pts[0][1],ytol:14}].concat(C.plan.filter(p=>p.x>C.walls[3]+30&&p.x<C.walls[3]+130),[{x:C.walls[3]+130,d:1,s:'dig',tol:3,y:yAt(C.walls[3]),ytol:14}])];}}));
function freePlan(def,race){const sw=RACES[race].swap;if(def.plans&&def.plans[race])return def.plans[race];return def.plan.map(s=>({...s,s:sw[s.s]||s.s}));}
