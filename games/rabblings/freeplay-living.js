// ---------- Free Play: living map prototypes (17 Nov 2026) ----------
// Open void, organic masses, several directions, two routes each, sealed water. Same format as freeplay.js; tests/free.py covers them.
// lvHang: stalactites and root tips grown on the underside of whatever rock is found below y0 at each x (so they never float or block a walkway above)
const lvHang=(S,x0,x1,y0,len,step=15)=>{const T=S.T;for(let x=x0;x<=x1;x+=step){let y=y0;while(y<T.h&&!fxSolid(T,x,y))y++;while(y<T.h&&fxSolid(T,x,y))y++;if(y>=T.h-2)continue;const l=Math.max(5,(len*(.55+Math.abs(S.n(x,.2,5))*.45))|0);S.ell(x,y-2+(l>>1),2+(l>>3),l>>1);}};
// lvUnder: carve the underside of a mass: everything between the profile 'top' (the mass's underside) and 'bot' (the ground below) becomes open air
const lvUnder=(S,top,bot)=>{const at=(P,x)=>{for(let i=0;i<P.length-1;i++){const[a,ya]=P[i],[b,yb]=P[i+1];if(x>=a&&x<=b){const t=(x-a)/Math.max(1,b-a),k=t*t*(3-2*t);return ya+(yb-ya)*k;}}return P[x<P[0][0]?0:P.length-1][1];};
 for(let x=0;x<S.T.w;x++){const y0=(at(top,x)+S.n(x,.06,7)*4)|0,y1=(at(bot,x)+S.n(x+300,.05,7)*3)|0;if(y1>y0)S.cut(x,y0,1,y1-y0);}};
FREE_MAPS.push(
 {id:'f2-06',style:'organic',tier:2,races:['goblin','swamp','imp','fairy','dwarf','rat','bone','shroom'],name:'Rotwood Crown',theme:'canopy',w:760,h:740,n:30,need:26,rate:28,time:220,
  hint:'Born in the crown of a dead giant. Go down through its rotten heart, or hack out through the bark and take the long way round. The pool at its roots takes anyone who falls short.',
  skills:{dig:1,bash:1,pick:1,build:1},
  // design: top to bottom. A hollow dead tree. The troops drop into the fork of its snapped crown, between two broken stubs.
  // Heart route: DIG through the crown cap, ride the fungus shelves down the hollow, BASH out through the bark into a root tunnel that runs under the pool to the hut.
  // Bark route: PICK down through the right stub onto the limbs, cascade down the right side, BRIDGE off the last limb over the pool. Cutting out through the left stub leads to the bog: a trap.
  hatch:[{x:380,y:52,dir:1}],doors:[{x:716,y:650}],haz:[{x0:40,x1:150,y:658,y1:690,water:1},{x0:502,x1:584,y:654,y1:676,water:1}],
  build(S){
   // ground: bog on the left, root flare at the trunk, the pool pit, then a sheer knoll with the hut in a root hollow under it
   fxProf(S,[[0,650],[70,646],[140,656],[210,640],[270,612],[330,598],[430,598],[480,616],[500,646],[586,648],[588,648],[590,568],[640,566],[700,572],[760,566]],0,3);
   // the trunk: a leaning column that swells at the base, and its roots
   fxMass(S,[[384,720],[388,560],[376,400],[386,240],[380,120]],96,74,4);
   fxMass(S,[[330,600],[250,630],[160,660],[80,690]],22,6,3);fxMass(S,[[440,606],[470,650],[520,700]],18,6,2);
   // the crown: a cut bowl walled in by two snapped stubs (sheer inside, ragged outside)
   S.cutEll(380,60,58,38);fxCrag(S,318,98,30,52,-.1);fxCrag(S,444,98,30,56,.1);S.box(314,42,14,60);S.box(432,38,14,64);
   // the hollow heart, winding down the trunk; fungus brackets turn the fall into a zig-zag
   fxSpine(S,[[380,140],[374,240],[388,350],[374,460],[384,560]],34,3);
   S.ell(356,190,36,5);S.ell(408,280,36,5);S.ell(356,370,36,5);S.ell(408,460,36,5);S.ell(358,540,34,5);
   // bark route: limbs and brackets cascading down the right side, each drop short enough to live through
   fxMass(S,[[452,196],[500,178],[580,170],[650,172],[690,166]],16,7,2);
   fxMass(S,[[600,252],[660,246],[730,248]],12,8,2);S.box(726,226,8,26);
   fxMass(S,[[470,340],[560,344],[640,350]],16,7,2);
   fxMass(S,[[522,436],[620,430],[732,434]],12,8,2);S.box(728,412,8,26);
   fxMass(S,[[470,520],[510,522],[548,528]],14,8,2);
   // decoy: left limbs that lead out over the bog
   fxMass(S,[[316,150],[240,176],[160,200],[90,196]],18,6,2);fxMass(S,[[300,330],[200,360],[110,380]],16,5,2);
   // root hollow under the knoll (the hut), its mouth, and the root tunnel under the pool from the trunk
   S.cutEll(690,626,60,30);S.cut(632,626,118,24);S.box(620,650,140,90);fxSpine(S,[[662,556],[670,606]],22,2);
   fxCavern(S,[[466,598],[474,640],[490,722],[604,722],[640,650],[700,650]],{h:20,swell:2,roll:4});
   // sealed pools
   fxBasin(S,40,150,650,6,690);fxBasin(S,502,584,646,6,676);
   fxRough(S,[[300,30,460,140],[330,560,440,620],[580,560,600,660],[440,180,760,540]]);
   fxDec(S,'vines',600,170);fxDec(S,'cocoon',650,360);fxDec(S,'rootdrop',230,200);fxDec(S,'cocoon',150,215);fxDec(S,'vines',520,360);
   fxDec(S,'reeds',170,650);fxDec(S,'reeds',30,650);fxDec(S,'stump',250,620);fxDec(S,'moss',620,300);fxDec(S,'roots',560,700);
   fxDec(S,'torch',650,650);fxDec(S,'skullpost',740,566);fxDec(S,'bones',470,600);fxDec(S,'rootdrop',700,600);},
  plan:[{x:352,d:1,s:'dig',tol:3},{x:404,d:1,s:'bash',tol:4,y:588,ytol:10}],
  // the bark route, tested as the plan for the races whose panel has no BASH
  plans:{shroom:[{x:418,d:1,s:'pick',tol:3},{x:538,d:1,s:'build',tol:3,y:518,ytol:14}],fairy:[{x:418,d:1,s:'pick',tol:3},{x:538,d:1,s:'build',tol:3,y:518,ytol:14}]},
  bark:[{x:418,d:1,s:'pick',tol:3},{x:538,d:1,s:'build',tol:3,y:518,ytol:14}]}
);
FREE_MAPS.push(
 {id:'f3-07',style:'organic',tier:3,races:['goblin','swamp','imp','fairy','dwarf','rat','shroom'],name:'Temple Climb',theme:'ruins',w:640,h:760,n:40,need:31,rate:26,time:280,
  hint:'The hut is on the broken temple roof, a long way up. Bridge the switchbacks, or break into the crag and take the old priests\' stair. Mind the teeth.',
  skills:{build:5,bash:1},
  // design: bottom to top. Rock arms climb the left cliff and a ruined temple in switchbacks; every turn is a bridge back onto the arm above.
  // Long stair: BRIDGE at each of five turns (one of them a gap over the drop to the drowned court).
  // Priests' stair: BASH into the crag from the bottom ramp; a winding stair inside it, guarded by jaws, comes out on the crag top and saves two bridges.
  hatch:[{x:130,y:664,dir:1}],doors:[{x:576,y:208}],haz:[{x0:548,x1:606,y:716,y1:744,water:1}],
  traps:[{k:'press',x:400,y:258,per:220}],
  build(S){
   // left cliff and right wall, organic columns
   fxMass(S,[[20,780],[30,560],[16,360],[28,140],[14,-20]],40,30,6);fxMass(S,[[634,780],[632,520],[638,300],[626,-20]],20,14,4);
   // the floor: a crypt on the left that ramps up to the foot of the crag
   fxProf(S,[[0,712],[90,714],[190,710],[260,694],[340,668],[400,650],[450,646]],0,2);
   // the crag: a swelling column with a flat landing on top
   fxMass(S,[[492,780],[486,650],[496,560],[490,500]],70,56,5);S.box(420,500,30,150);S.cut(400,300,180,174);
   // the drowned court under the gap, between the crag and the right wall
   fxProf(S,[[520,712],[548,712],[610,712],[640,712]],0,2);S.cut(548,690,58,54);S.box(548,744,58,16);S.box(534,690,14,70);
   // switchback arms: each tip sits just below where a bridge from the arm beneath ends
   fxMass(S,[[366,631],[300,606],[210,576],[120,552],[70,546]],7,15,3);
   fxMass(S,[[152,521],[250,504],[340,486],[440,474]],7,14,3);
   fxMass(S,[[576,458],[604,450],[630,446]],7,12,2);
   fxMass(S,[[552,428],[480,398],[400,368],[300,338],[220,318],[190,314]],7,14,3);S.box(184,288,10,30);
   fxMass(S,[[254,296],[340,270],[440,242],[540,216],[610,208]],7,14,3);
   // scenery: roots and rock hanging under the arms, a hanging crag from the roof, a broken colonnade on the crag shoulder
   lvHang(S,90,350,540,12,17);lvHang(S,170,420,470,10,19);lvHang(S,240,540,330,12,21);lvHang(S,280,580,200,10,23);
   fxMass(S,[[200,-10],[214,60],[200,120],[222,170]],26,6,4);fxMass(S,[[420,-10],[400,40],[410,90]],20,5,3);
   fxMass(S,[[60,420],[110,428],[150,440]],12,4,3);fxMass(S,[[560,560],[548,600]],8,3,2);
   S.ell(436,476,10,8);S.ell(548,478,10,8);
   // the temple on top: broken walls and a roof slab for the hut
   S.box(536,208,96,12);fxBlocks(S,600,636,208,5,11);
   // priests' stair inside the crag: from the foot of the crag up to its top
   fxCavern(S,[[424,660],[446,660],[474,600],[500,530],[516,476]],{h:34,swell:6,roll:2});
   fxRough(S,[[400,430,560,660],[180,270,620,470],[528,680,612,760]]);
   fxDec(S,'column',300,668);fxDec(S,'brokencolumn',220,700);fxDec(S,'statue',150,712);fxDec(S,'torch',90,712);fxDec(S,'rubble',380,650);
   fxDec(S,'brokencolumn',260,508);fxDec(S,'ruin',470,474);fxDec(S,'vines',300,250);fxDec(S,'banner',350,330);fxDec(S,'column',548,208);fxDec(S,'statue',460,240);
   fxDec(S,'drip',150,540);fxDec(S,'rootdrop',520,420);fxDec(S,'reeds',570,712);},
  plan:[{x:420,d:-1,s:'build',tol:3,y:646,ytol:10},{x:100,d:1,s:'build',tol:3,y:534,ytol:12},{x:524,d:1,s:'build',tol:3,y:474,ytol:8},{x:600,d:-1,s:'build',tol:3,y:446,ytol:10},{x:204,d:1,s:'build',tol:3,y:302,ytol:10}],
  // the priests' stair, tested as the plan for the Dwarves
  plans:{dwarf:[{x:420,d:1,s:'bash',tol:3,y:646,ytol:10},{x:524,d:1,s:'build',tol:3,y:474,ytol:8},{x:600,d:-1,s:'build',tol:3,y:446,ytol:10},{x:204,d:1,s:'build',tol:3,y:302,ytol:10}]},
  stair:[{x:420,d:1,s:'bash',tol:3,y:646,ytol:10},{x:524,d:1,s:'build',tol:3,y:474,ytol:8},{x:600,d:-1,s:'build',tol:3,y:446,ytol:10},{x:204,d:1,s:'build',tol:3,y:302,ytol:10}]}
);
FREE_MAPS.push(
 {id:'f4-07',style:'organic',tier:4,races:['goblin','swamp','imp','fairy','dwarf','rat','bone','shroom'],name:'Shard Choir',theme:'vortex',w:1000,h:560,n:44,need:38,rate:24,time:260,
  hint:'Shards hang over nothing, and every one of them leads somewhere. The high shards need three bridges. The low shards need one good smash, and quickly.',
  skills:{build:3,bash:1},
  // design: right to left across floating shards over the void. Two huts, high and low.
  // High road: BRIDGE off the first shard, again over each of two gaps, to the high hut.
  // Low road: fall from shard to shard to a long low shard that ends in nothing on the right. BASH the crystal ridge before the first troops turn back and walk off the far end.
  hatch:[{x:940,y:110,dir:-1}],doors:[{x:110,y:290},{x:190,y:470}],haz:[],
    build(S){
   // high road
   fxShard(S,856,990,150,34);fxShard(S,700,830,160,26);fxShard(S,600,720,230,24);fxShard(S,430,572,214,28);fxShard(S,300,440,300,30);fxShard(S,50,272,290,40,0);
   // low road: three shards falling away, the long one with a crystal ridge, and the last shard with the low hut
   fxShard(S,758,900,250,26);fxShard(S,618,780,340,30);fxShard(S,330,642,420,44);fxShard(S,150,356,470,40);
   fxCrag(S,470,422,62,54,.05);S.box(452,370,10,52);
   // walls that turn troops: the high hut's back rock, the low hut's back rock, the first shard's right end
   S.box(50,262,10,30);S.box(150,440,10,32);fxCrag(S,982,150,26,40,.1);
   // scenery: drifting rubble, a broken arch on the high road, a dead tree, crystals
   fxShard(S,560,600,90,14);fxShard(S,250,300,150,16);fxShard(S,880,940,420,20);fxShard(S,40,90,430,16);fxShard(S,690,720,500,12);
   fxArch(S,140,214,40);
   fxDec(S,'crystal',470,368);fxDec(S,'crystal',900,250);fxDec(S,'tree',360,300);fxDec(S,'brokencolumn',520,214);fxDec(S,'pylon',740,160);
   fxDec(S,'rubble',660,340);fxDec(S,'torch',80,290);fxDec(S,'torch',170,470);fxDec(S,'skullpost',620,230);},
  plan:[{x:862,d:-1,s:'build',tol:3,y:150,ytol:8},{x:604,d:-1,s:'build',tol:3,y:230,ytol:8},{x:304,d:-1,s:'build',tol:3,y:300,ytol:8}],
  // the low road, tested as the plan for the Skeletons (whose bone bridges cannot do the high road)
  plans:{bone:[{x:505,d:-1,s:'bash',tol:3,y:420,ytol:8}],rat:[{x:505,d:-1,s:'bash',tol:3,y:420,ytol:8}]},
  low:[{x:505,d:-1,s:'bash',tol:3,y:420,ytol:8}]}
);
// ---------- second batch (17 Nov 2026) ----------
FREE_MAPS.push(
 {id:'f1-06',style:'organic',tier:1,races:['goblin','swamp','imp','dwarf','rat','shroom'],name:'Glacier Tongue',theme:'frost',w:900,h:600,n:24,need:20,rate:30,time:200,
  hint:'The ice is split twice. Bridge the first crack, or let them drop onto the snow bridge inside it and smash through the ice cave. The second crack has no snow bridge.',
  skills:{build:2,bash:1},
  // design: left to right down a glacier. A crevasse splits it, with a snow bridge part way down that catches anyone who falls in.
  // Over: BRIDGE across the crevasse from its near lip. Through: let them fall onto the snow bridge, BASH into the far wall and follow the ice cave up to the surface.
  hatch:[{x:90,y:110,dir:1}],doors:[{x:830,y:368}],haz:[{x0:330,x1:540,y:556,y1:584,water:1}],
  build(S){
   // the glacier: a thick tongue of ice sliding down to the right, with open air and a meltwater lake under it
   fxProf(S,[[0,150],[120,152],[220,176],[330,210],[400,226],[448,236],[560,270],[680,320],[780,360],[900,366]],0,3);
   lvUnder(S,[[0,330],[160,350],[300,372],[420,396],[540,400],[660,420],[760,450],[840,470],[900,476]],[[0,560],[200,548],[330,552],[540,552],[700,540],[900,530]]);
   // the lake under the crevasse, sealed in its rock bowl
   fxBasin(S,330,540,552,4,584);fxCrag(S,250,560,60,60,.1);fxCrag(S,640,548,50,70,-.12);
   // the crevasse right through the ice, with a snow bridge part way down that catches anyone who falls in
   S.cut(400,190,48,230);S.box(398,300,52,8);fxRough(S,[[392,290,456,312]]);
   // the ice cave from the crevasse's far wall up to the surface
   fxCavern(S,[[452,300],[520,306],[600,318],[692,330]],{h:20,swell:6,roll:3});
   // a second crack further down, straight through to the valley: everyone must bridge it
   S.cut(744,300,40,200);fxRough(S,[[736,290,792,380]]);
   // icicles under the tongue, seracs, and an overhanging ice lip, kept off the path
   lvHang(S,20,880,300,16,11);
   fxCrag(S,30,152,40,70,.08);fxCrag(S,880,368,40,90,-.1);fxMass(S,[[560,-10],[620,40],[700,70],[760,64]],22,8,3);lvHang(S,600,770,30,14,13);
   fxDec(S,'boulder',250,180);fxDec(S,'tree',150,152);fxDec(S,'rocks',740,348);fxDec(S,'torch',800,366);fxDec(S,'bones',330,212);fxDec(S,'skullpost',860,366);fxDec(S,'reeds',560,552);fxDec(S,'rocks',120,560);},
  plan:[{x:398,d:1,s:'build',tol:3,y:226,ytol:8},{x:741,d:1,s:'build',tol:3,y:350,ytol:12}],
  // the through route, tested as the plan for the Ratfolk
  plans:{rat:[{x:442,d:1,s:'bash',tol:4,y:300,ytol:8},{x:741,d:1,s:'build',tol:3,y:350,ytol:12}]},
  through:[{x:442,d:1,s:'bash',tol:4,y:300,ytol:8},{x:741,d:1,s:'build',tol:3,y:350,ytol:12}]}
);
// lvRib: a rib bone in side view, a curved band from the spine down to the sand, bowing toward the head
const lvRib=(S,x0,y0,x1,y1,bow,r)=>{for(let t=0;t<=1;t+=.02){const x=x0+(x1-x0)*t-bow*Math.sin(t*Math.PI),y=y0+(y1-y0)*t;S.ell(x,y,r,r+1);}};
FREE_MAPS.push(
 {id:'f3-08',style:'organic',tier:3,races:['goblin','swamp','imp','fairy','dwarf','rat','bone','shroom'],name:'Old Bones',theme:'dunes',w:960,h:460,n:40,need:35,rate:26,time:240,
  hint:'Something enormous died here. Bridge up onto its spine and walk it to the skull, or dig under the sand where the burrowers live. Be quick: the first ones turned back by the ribs walk straight into the quicksand.',
  skills:{build:2,dig:1,bash:1},
  // design: right to left over a half-buried giant skeleton. Inside the ribcage the ribs wall off each bay.
  // Over: BRIDGE from the dune onto the broken tail, walk the spine, BRIDGE the gap where vertebrae are missing, walk down over the skull to the hut.
  // Under: DIG through the sand in the first bay into a burrow, BASH the buried rib, follow the burrow out beside the hut.
  hatch:[{x:880,y:190,dir:-1}],doors:[{x:40,y:346}],haz:[{x0:916,x1:956,y:236,y1:270,water:1}],
  build(S){
   // the sand: a dune on the right, the ribcage floor, the sand in front of the skull
   fxProf(S,[[0,346],[80,344],[200,340],[400,336],[600,334],[720,332],[780,300],[840,250],[900,222],[960,214]],0,3);
   // the spine, broken off at the tail and missing vertebrae near the middle; ribs hang from it down into the sand, each one a wall inside the ribcage
   const SP=[[244,196],[360,184],[500,172],[640,196],[772,262]],sy=x=>{for(let i=0;i<SP.length-1;i++){const[a,ya]=SP[i],[b,yb]=SP[i+1];if(x>=a&&x<=b){const t=(x-a)/(b-a);return ya+(yb-ya)*t*t*(3-2*t);}}return x<244?196:262;};
   for(let x=244;x<=772;x+=13){if(x>436&&x<482)continue;const y=sy(x);S.ell(x,y,8,8);S.ell(x+6,y+2,4,6);}
   for(const x of [700,606,512,418,324])lvRib(S,x,sy(x)+4,x-34,336,26,5);
   // the skull: cranium, snout and jaw, eye socket open to the sky
   S.ell(172,244,82,60);S.ell(124,300,62,30);S.ell(160,330,70,14);S.cutEll(150,236,16,14);S.cutEll(206,252,9,7);
   // quicksand behind the hatch: anyone who wanders back up the dune sinks
   fxBasin(S,916,956,230,6,270);S.box(956,180,4,100);
   // the burrow under the ribcage, with a buried rib across it, coming up in front of the skull
   fxCavern(S,[[46,346],[80,382],[200,404],[500,406],[724,386]],{h:20,swell:4,roll:3});
   lvRib(S,470,350,470,440,0,6);
   // scenery: dune grass, a bone pile, a dead tree on the dune, a sun-bleached horn
   fxDec(S,'bones',560,334);fxDec(S,'tree',940,214);fxDec(S,'rocks',820,268);fxDec(S,'torch',70,346);fxDec(S,'skullpost',20,346);fxDec(S,'reeds',380,336);fxDec(S,'stakes',260,338);},
  plan:[{x:812,d:-1,s:'build',tol:3,y:272,ytol:10},{x:484,d:-1,s:'build',tol:3,y:166,ytol:10}],
  // the under route, tested as the plan for the Skeletons
  plans:{bone:[{x:718,d:-1,s:'dig',tol:3},{x:478,d:-1,s:'bash',tol:4,y:406,ytol:10}],rat:[{x:718,d:-1,s:'dig',tol:3},{x:478,d:-1,s:'bash',tol:4,y:406,ytol:10}]},
  under:[{x:718,d:-1,s:'dig',tol:3},{x:478,d:-1,s:'bash',tol:4,y:406,ytol:10}]}
);
FREE_MAPS.push(
 {id:'f4-08',style:'organic',tier:4,races:['goblin','imp','dwarf','rat','bone','shroom'],name:'Cinder Gorge',theme:'cinder',w:1000,h:680,n:40,need:34,rate:24,time:240,
  hint:'One smash, one dig, one bridge. Over the broken arch or under the gorge through the vents: pick one and do not waste a thing. Anyone who wanders back past the hatch falls into the old chamber.',
  skills:{bash:1,dig:1,build:1},
  // design: left to right across a lava gorge. Every skill is needed by one route or the other, so the first choice decides the map.
  // Over: BASH through the spire, walk up the broken arch, BRIDGE the gap at its crown. Under: DIG into the vents, follow them down under the gorge, BRIDGE the lava pocket, climb out on the far rim.
  hatch:[{x:80,y:180,dir:1}],doors:[{x:950,y:240}],haz:[{x0:420,x1:620,y:506,y1:530,lava:1},{x0:480,x1:520,y:628,y1:650,lava:1},{x0:10,x1:150,y:594,y1:620,lava:1}],
  build(S){
   // the two rims and the gorge between them
   fxProf(S,[[0,220],[290,222],[340,236],[350,300],[380,460],[420,500],[620,500],[660,460],[690,300],[700,250],[740,242],[1000,240]],0,3);
   fxBasin(S,420,620,500,6,530);
   // the spire that walls in the hatch, and the broken arch across the gorge
   fxCrag(S,318,224,48,112,.04);S.box(296,150,10,74);
   {const P=[];for(let t=0;t<=1.001;t+=.05){P.push([350+350*t,252-Math.sin(t*Math.PI)*98+(t>.5?(t-.5)*-12:0)]);}fxMass(S,P,16,15,2);}S.cut(510,90,40,110);
   // the vents: from under the hatch plateau, down under the gorge, up into the far rim; a lava pocket on the way
   fxCavern(S,[[196,284],[262,450],[350,610],[700,616],[860,340],[904,242]],{h:28,swell:8,roll:3});
   S.cutEll(500,592,52,30);S.cut(480,616,40,34);S.box(480,650,40,8);fxRough(S,[[470,600,530,662],[410,494,630,540]]);
   // scenery: hollow chambers in the rims (never reached), a lava fall's dried crust, crags on the rims, embers and bones
   S.cutEll(80,480,92,118);S.cutEll(966,520,62,112);S.cut(36,200,30,180);fxRough(S,[[170,240,340,680],[840,220,920,680],[410,494,630,540],[470,600,530,662],[0,580,160,630]]);lvHang(S,0,170,340,16,13);lvHang(S,910,1000,400,14,13);fxBasin(S,10,150,590,4,620);
   fxCrag(S,20,222,30,80,.1);fxCrag(S,990,242,34,96,-.1);fxMass(S,[[560,-10],[580,30],[566,60]],18,4,3);lvHang(S,540,600,0,18,12);
   fxDec(S,'embers',520,500);fxDec(S,'bones',150,222);fxDec(S,'torch',920,240);fxDec(S,'skullpost',980,240);fxDec(S,'rocks',820,240);fxDec(S,'embers',600,616);fxDec(S,'rubble',240,222);},
  plan:[{x:292,d:1,s:'bash',tol:3,y:222,ytol:8},{x:507,d:1,s:'build',tol:3,y:150,ytol:14}],
  // the under route, tested as the plan for the races whose bridges or bash cannot do the arch
  plans:{bone:[{x:200,d:1,s:'dig',tol:3},{x:476,d:1,s:'bonebr',tol:3,y:616,ytol:10}],shroom:[{x:200,d:1,s:'dig',tol:3},{x:476,d:1,s:'build',tol:3,y:616,ytol:10}],rat:[{x:200,d:1,s:'dig',tol:3},{x:476,d:1,s:'build',tol:3,y:616,ytol:10}]},
  under:[{x:200,d:1,s:'dig',tol:3},{x:476,d:1,s:'build',tol:3,y:616,ytol:10}]}
);
