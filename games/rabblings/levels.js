// plan steps are the solution used by the level tests and, in versus, by the CPU rival
const LEVELS=[
{name:'Breakfast Run',style:'organic',theme:'bog',w:840,h:300,n:20,need:14,rate:32,time:180,hint:'The catapult is free. The hill in front of breakfast is not. BASH it.',skills:{bash:3},
 hatch:[{x:90,y:110,dir:1}],doors:[{x:770,y:170}],haz:[{x0:300,x1:452,y:246},{x0:96,x1:204,y:252,y1:268,water:1}],
 traps:[{k:'catapult',x:262,y:180,dir:1,pow:6}],
 build(S){fxProf(S,[[0,170],[60,176],[130,190],[200,184],[262,181],[300,186]],0,2);S.box(290,252,170,48);fxProf(S,[[450,188],[520,193],[600,187],[700,191],[770,186],[840,180]],0,2);S.rock(450,146,16,60,2);
  S.rock(636,104,58,100,3);S.ell(665,104,31,14);fxMass(S,[[640,150],[624,170],[618,196]],9,5,1);fxMass(S,[[690,150],[704,172],[708,196]],9,5,1);
  S.cutEll(150,244,60,14);S.cut(96,244,108,24);fxCeil(S,[[560,-40],[640,8],[740,20],[840,14]],4);fxMass(S,[[742,16],[750,44],[744,66]],8,2,2);
  fxDec(S,'bigtree',60,176);fxDec(S,'reeds',200,186);fxDec(S,'reeds',470,190);fxDec(S,'tree',560,190);fxDec(S,'torch',800,184);fxDec(S,'rootdrop',800,20);fxDec(S,'moss',380,280);fxDec(S,'roots',150,220);fxRough(S,[[280,140,470,300],[610,90,720,200],[80,230,220,280]]);},
 plan:[{x:626,d:1,s:'bash',tol:1}]},
{name:'Snapjaw Alley',style:'organic',theme:'mine',w:760,h:300,n:20,need:8,haz:[{x0:470,x1:610,y:264,y1:282,water:1}],rate:32,time:180,hint:'Those are not rocks. Lay a BRIDGE and step over the teeth.',skills:{build:3},
 hatch:[{x:90,y:130,dir:1}],doors:[{x:650,y:200}],traps:[{k:'jaws',x:292,y:208},{k:'jaws',x:306,y:208},{k:'jaws',x:320,y:208}],
 build(S){fxProf(S,[[0,198],[70,206],[150,212],[240,208]],0,2);S.box(240,208,120,92);fxProf(S,[[360,208],[440,214],[540,204],[640,210],[760,200]],0,2);
  fxCeil(S,[[0,56],[90,78],[200,50],[300,70],[420,46],[540,82],[660,54],[760,70]],4);fxMass(S,[[150,70],[158,98],[150,118]],11,3,2);fxMass(S,[[480,62],[490,96],[478,122]],12,3,2);fxMass(S,[[640,56],[646,84]],9,3,2);
  S.cutEll(540,256,64,14);S.cut(470,256,140,26);
  fxDec(S,'shoring',60,200);fxDec(S,'torch',120,210);fxDec(S,'rubble',200,210);fxDec(S,'torch',420,212);fxDec(S,'shoring',560,206);fxDec(S,'statue',700,206);fxDec(S,'drip',300,70);fxDec(S,'chain',380,56);fxDec(S,'ore',100,260);fxDec(S,'ore',320,270);fxDec(S,'embers',680,270);fxRough(S,[[230,150,370,300],[460,246,620,290]]);},
 plan:[{x:266,s:'build',tol:1}]},
{name:'Hot Foot',style:'mixed',theme:'forge',w:820,h:320,n:20,need:15,haz:[{x0:60,x1:240,y:268,y1:290}],rate:32,time:200,hint:'Nobody crosses the fire jets in one piece. PICK a way under them.',skills:{pick:3},
 hatch:[{x:90,y:80,dir:1}],doors:[{x:740,y:240}],traps:[{k:'jet',x:310,y:130,per:70},{k:'jet',x:370,y:130,per:70},{k:'jet',x:430,y:130,per:70}],
 build(S){S.wavy(0,820,132,3,40,1);S.cut(330,186,500,56);S.cutEll(400,214,70,34);S.cutEll(560,196,60,16);S.cutEll(700,198,70,18);S.iron(478,84,16,56);S.box(0,300,820,20);
  fxCeil(S,[[0,30],[140,44],[300,28],[478,40],[600,24],[820,36]],3);fxMass(S,[[620,30],[628,58],[620,80]],9,3,2);fxMass(S,[[150,40],[156,64]],8,3,2);
  S.cutEll(150,262,80,12);S.cut(60,262,180,28);
  fxDec(S,'banner',60,90);fxDec(S,'chain',240,90);fxDec(S,'chain',560,80);fxDec(S,'gear',700,80);fxDec(S,'torch',150,132);fxDec(S,'statue',560,132);fxDec(S,'brokencolumn',680,132);fxDec(S,'torch',780,132);
  fxDec(S,'shoring',600,242);fxDec(S,'torch',500,242);fxDec(S,'rubble',660,242);fxDec(S,'embers',200,180);fxDec(S,'ore',600,280);fxRough(S,[[200,100,500,250],[50,250,250,296]]);},
 plan:[{x:236,d:1,s:'pick',tol:2}]},
{name:'Wrong Way Warp',style:'mixed',theme:'mine',w:720,h:300,n:20,need:16,rate:30,time:180,hint:'The nearest warp stone leads somewhere hot. BOUNCE them back to the other one.',skills:{block:2},
 hatch:[{x:360,y:130,dir:1}],doors:[{x:40,y:200}],haz:[{x0:646,x1:720,y:236},{x0:280,x1:440,y:270,y1:286,water:1}],
 traps:[{k:'warp',x:530,y:200,p:0},{k:'warp',x:622,y:200,p:0},{k:'warp',x:170,y:200,p:1},{k:'warp',x:70,y:200,p:1}],
 build(S){fxCeil(S,[[0,72],[100,60],[190,86],[300,64],[430,90],[592,60],[720,74]],3);S.wavy(100,600,200,3,50,1);S.box(0,200,110,100);S.box(600,200,46,100);S.box(640,242,80,58);S.iron(102,56,14,148);S.iron(592,56,14,148);
  fxMass(S,[[250,76],[258,104],[250,126]],10,3,2);fxMass(S,[[470,84],[462,112]],9,3,2);S.cutEll(360,262,90,12);S.cut(280,262,160,24);
  fxDec(S,'shoring',220,200);fxDec(S,'torch',300,200);fxDec(S,'rubble',420,200);fxDec(S,'brokencolumn',470,200);fxDec(S,'torch',40,200);fxDec(S,'drip',150,70);fxDec(S,'rootdrop',540,70);fxDec(S,'chain',330,70);fxDec(S,'ore',180,250);fxDec(S,'embers',520,260);fxRough(S,[[90,40,125,210],[585,40,720,300],[270,252,450,292]]);},
 plan:[{x:470,d:1,s:'block',tol:2}]},
{name:'High Tide',style:'organic',theme:'bog',w:700,h:340,n:20,need:13,rate:30,time:180,hint:'The swamp is rising and it will not stop. BRIDGE up the terraces.',skills:{build:5},
 hatch:[{x:70,y:200,dir:1}],doors:[{x:640,y:170}],rules:['flood'],floodRate:24,
 build(S){S.wavy(0,190,272,3,30,1);S.wavy(190,330,244,3,30,2);S.wavy(330,470,216,3,30,3);S.wavy(470,700,188,3,30,4);
  fxCeil(S,[[420,-40],[500,6],[600,22],[700,14]],4);fxMass(S,[[560,18],[566,48],[558,74]],9,2,2);fxMass(S,[[650,16],[644,40]],8,2,2);
  fxDec(S,'tree',40,272);fxDec(S,'reeds',120,272);fxDec(S,'bigtree',250,244);fxDec(S,'reeds',300,244);fxDec(S,'ruin',400,216);fxDec(S,'statue',540,188);fxDec(S,'torch',590,188);fxDec(S,'torch',680,188);fxDec(S,'rootdrop',480,20);fxDec(S,'vines',610,24);fxDec(S,'roots',260,290);fxDec(S,'moss',430,270);fxDec(S,'roots',600,240);},
 plan:[{x:138,d:1,s:'build',tol:2},{x:278,d:1,s:'build',tol:2,wait:60},{x:418,d:1,s:'build',tol:2,wait:60}]},
{name:'Blown Away',style:'organic',theme:'frost',w:780,h:340,n:20,need:10,rate:36,time:200,hint:'Pop a FLAP before the edge. The wind will do the rest.',skills:{flap:14},
 hatch:[{x:90,y:90,dir:1}],doors:[{x:620,y:250}],haz:[{x0:262,x1:336,y:306},{x0:60,x1:180,y:230,y1:248,water:1}],rules:['wind'],
 build(S){S.wavy(0,262,140,4,40,1);S.box(250,312,110,28);S.wavy(330,780,256,5,50,2);
  fxCeil(S,[[440,-40],[520,10],[620,26],[700,16],[780,22]],4);fxMass(S,[[600,22],[606,60],[598,92]],9,2,2);fxMass(S,[[700,14],[694,44]],8,2,2);
  S.cutEll(120,222,70,14);S.cut(60,222,120,26);
  fxDec(S,'statue',40,140);fxDec(S,'rubble',120,140);fxDec(S,'brokencolumn',400,256);fxDec(S,'ruin',480,256);fxDec(S,'torch',560,256);fxDec(S,'torch',700,256);fxDec(S,'drip',540,16);fxDec(S,'bones',500,290);fxDec(S,'rocks',100,180);fxRough(S,[[230,120,360,340],[50,212,190,256]]);},
 plan:[{x:190,s:'flap',n:12}]},
{name:'The Toll Gate',style:'mechanical',kind:'built',theme:'forge',w:740,h:300,n:20,need:13,haz:[{x0:150,x1:440,y:262,y1:284}],rate:36,time:200,hint:'The gate wants three goblins. After that, BOUNCE the rest away.',skills:{block:2},
 hatch:[{x:270,y:140,dir:-1}],doors:[{x:640,y:210}],traps:[{k:'jaws',x:96,y:210}],gates:[{x:480,y:120,w:16,h:90}],trig:[{w:'deaths',n:3,who:0,a:'open',r:0}],
 build(S){S.wavy(0,740,210,2,40,1);fxCeil(S,[[0,66],[160,74],[320,64],[474,66],[600,76],[740,68]],2);S.iron(20,60,16,152);S.iron(474,60,28,62);
  S.cut(150,252,290,32);for(const x of [210,290,370])S.box(x,252,14,16);
  fxDec(S,'banner',200,74);fxDec(S,'banner',360,70);fxDec(S,'banner',600,80);fxDec(S,'chain',270,74);fxDec(S,'chain',560,78);fxDec(S,'column',180,210);fxDec(S,'column',330,210);fxDec(S,'statue',420,210);fxDec(S,'torch',230,210);fxDec(S,'torch',540,210);fxDec(S,'torch',700,210);fxDec(S,'gear',660,130);fxDec(S,'plate',488,100);fxDec(S,'embers',80,260);fxDec(S,'ore',600,262);},
 plan:[{x:132,d:-1,s:'block',tol:2,wait:300}]},
{name:'Lights Out',style:'organic',theme:'mine',w:820,h:300,n:20,need:12,haz:[{x0:580,x1:740,y:264,y1:282,water:1}],rate:32,time:220,hint:'Someone blew out the torches. Follow your goblins, and mind the teeth.',skills:{build:2,bash:2},
 hatch:[{x:80,y:130,dir:1}],doors:[{x:720,y:200}],rules:['dark'],traps:[{k:'jaws',x:330,y:204},{k:'jaws',x:346,y:204}],
 build(S){fxProf(S,[[0,196],[80,206],[180,200],[250,205],[300,204]],0,2);S.box(290,204,90,96);fxProf(S,[[370,204],[440,208],[520,204],[600,200],[700,206],[820,198]],0,2);S.rock(520,70,44,150,3);
  fxCeil(S,[[0,70],[120,92],[240,68],[380,96],[520,74],[564,74],[680,100],[820,76]],4);fxMass(S,[[180,84],[188,112],[180,134]],10,3,2);fxMass(S,[[680,92],[672,120]],9,3,2);fxMass(S,[[512,196],[500,204]],8,5,1);fxMass(S,[[572,196],[584,204]],8,5,1);
  S.cutEll(660,256,74,12);S.cut(580,256,160,26);
  fxDec(S,'shoring',60,200);fxDec(S,'rubble',230,204);fxDec(S,'torch',160,202);fxDec(S,'shoring',430,206);fxDec(S,'rubble',480,204);fxDec(S,'torch',640,202);fxDec(S,'brokencolumn',770,200);fxDec(S,'drip',300,84);fxDec(S,'rootdrop',420,90);fxDec(S,'chain',760,84);fxDec(S,'ore',150,260);fxDec(S,'ore',450,270);fxRough(S,[[280,150,390,300],[500,60,600,215],[570,246,750,292]]);},
 plan:[{x:304,d:1,s:'build',tol:1},{x:506,d:1,s:'bash',tol:3,wait:120}]},
{name:'Rat Pit',style:'organic',theme:'frost',w:860,h:320,n:24,need:12,rate:30,time:220,hint:'The gorgers are hungry and the rocks are early. Chain two BRIDGES over the pit.',skills:{build:6},
 hatch:[{x:90,y:120,dir:1}],doors:[{x:740,y:190}],holes:[{x:340,y:230,awake:1}],trig:[{w:'timer',n:30,who:0,a:'boulders',r:0}],haz:[{x0:66,x1:194,y:258,y1:276,water:1},{x0:566,x1:714,y:264,y1:282,water:1}],
 build(S){S.wavy(0,300,190,4,40,1);S.box(290,250,100,70);S.wavy(380,860,190,4,40,3);
  fxCeil(S,[[540,-40],[620,10],[720,28],[800,16],[860,22]],4);fxMass(S,[[700,24],[708,60],[700,90]],9,2,2);fxMass(S,[[800,14],[794,44]],8,2,2);
  S.cutEll(130,250,70,12);S.cut(66,250,128,26);S.cutEll(640,256,80,12);S.cut(566,256,148,26);
  fxDec(S,'statue',40,190);fxDec(S,'rubble',160,190);fxDec(S,'brokencolumn',470,190);fxDec(S,'ruin',560,190);fxDec(S,'torch',640,190);fxDec(S,'torch',810,190);fxDec(S,'drip',660,20);fxDec(S,'bones',500,240);fxDec(S,'rocks',240,240);fxRough(S,[[270,150,400,320],[56,240,204,286],[556,246,724,292]]);},
 plan:[{x:290,d:1,s:'build',tol:1},{st:'shrug',s:'build',n:1}]},
{name:"Warlord's Keep",style:'mechanical',kind:'built',theme:'forge',w:1200,h:340,n:30,need:11,rate:28,time:360,hint:'Everything you have learned, with the lava coming up behind you.',skills:{climb:2,flap:2,boom:2,block:2,build:5,bash:3,pick:2,dig:3},
 hatch:[{x:90,y:96,dir:1}],doors:[{x:1120,y:230}],haz:[{x0:416,x1:462,y:300},{x0:760,x1:808,y:300}],floodRate:30,
 traps:[{k:'press',x:320,y:250,per:70},{k:'catapult',x:372,y:250,dir:1,pow:5},{k:'jaws',x:700,y:250}],gates:[{x:980,y:150,w:14,h:100}],zones:[{id:1,x:900,y:190,w:40,h:64}],
 trig:[{w:'timer',n:60,who:0,a:'on:lava',r:0},{w:'zone',n:1,who:0,a:'open',r:0}],
 build(S){S.land(0,420,250);S.land(458,764,250);S.land(804,1200,250);S.box(400,306,420,34);S.rock(30,152,330,40,2);S.iron(30,100,14,92);S.iron(344,100,16,92);S.rock(600,60,60,210,3);S.iron(600,60,60,20);S.iron(970,60,34,92);
  fxCeil(S,[[0,34],[200,46],[420,30],[600,62],[660,62],[820,36],[970,62],[1004,62],[1200,44]],3);fxMass(S,[[480,34],[488,64],[480,90]],10,3,2);fxMass(S,[[860,40],[852,70]],9,3,2);fxMass(S,[[1100,46],[1108,76],[1100,100]],10,3,2);
  fxDec(S,'banner',150,60);fxDec(S,'banner',760,60);fxDec(S,'banner',1060,70);fxDec(S,'chain',540,60);fxDec(S,'chain',920,60);fxDec(S,'column',520,250);fxDec(S,'statue',560,250);fxDec(S,'torch',480,250);fxDec(S,'torch',850,250);fxDec(S,'brokencolumn',1040,250);fxDec(S,'torch',1160,250);fxDec(S,'gear',1150,140);fxDec(S,'embers',200,290);fxDec(S,'ore',900,300);},
 plan:[{x:200,s:'dig'},{x:592,d:1,s:'bash',tol:4,wait:100},{x:684,d:1,s:'build',tol:2,wait:100},{x:752,s:'build',tol:2,wait:100}]},
 {name:'Skate Rink',style:'mixed',theme:'frost',w:860,h:300,n:20,need:12,rate:30,time:200,hint:'Ice is slippery. Anything you start on it slides first, and blockers cannot grip.',skills:{build:4,dig:2},
 hatch:[{x:70,y:110,dir:1}],doors:[{x:790,y:190}],haz:[{x0:560,x1:720,y:262,y1:280,water:1},{x0:70,x1:190,y:258,y1:276,water:1}],
 build(S){S.box(0,190,300,110,8);S.box(300,214,150,86,8);S.box(450,190,410,110,8);fxCeil(S,[[0,44],[120,62],[260,40],[400,66],[560,42],[700,64],[860,46]],4);
  fxMass(S,[[200,56],[206,90],[198,112]],9,2,2);fxMass(S,[[640,58],[634,88]],8,2,2);S.cutEll(640,254,84,12);S.cut(560,254,160,26);S.cutEll(130,250,64,12);S.cut(70,250,120,26);
  fxDec(S,'statue',40,190);fxDec(S,'brokencolumn',220,190);fxDec(S,'torch',260,190);fxDec(S,'ruin',560,190);fxDec(S,'torch',700,190);fxDec(S,'torch',830,190);fxDec(S,'drip',340,60);fxDec(S,'drip',500,50);fxDec(S,'bones',400,270);},
 plan:[{x:400,d:1,s:'build',tol:4}]},
 {name:'Thin Ice',style:'organic',theme:'frost',w:860,h:320,n:20,need:7,rate:8,time:200,hint:'Thin ice cracks under a crowd. A lone walker is safe, a queue is not.',skills:{build:5},
 hatch:[{x:70,y:120,dir:1}],doors:[{x:790,y:200}],haz:[{x0:260,x1:520,y:262,y1:300,water:1}],
 build(S){fxProf(S,[[0,190],[70,198],[160,204],[230,200],[260,200]],0,2);S.box(260,200,260,8,9);fxProf(S,[[520,200],[600,204],[700,196],[790,200],[860,194]],0,2);S.box(260,300,260,20);
  fxCeil(S,[[0,44],[140,64],[280,40],[430,60],[600,42],[740,66],[860,48]],4);fxMass(S,[[140,58],[146,90],[138,110]],9,2,2);fxMass(S,[[700,60],[694,92]],8,2,2);
  fxDec(S,'statue',40,196);fxDec(S,'rubble',180,202);fxDec(S,'brokencolumn',600,204);fxDec(S,'ruin',680,198);fxDec(S,'torch',740,198);fxDec(S,'torch',840,196);fxDec(S,'drip',400,54);fxDec(S,'bones',120,250);fxDec(S,'rocks',700,250);fxRough(S,[[240,150,540,320]]);},
 plan:[{x:250,d:1,s:'build',tol:6}]},
 {name:'Sun Baked',style:'mixed',theme:'dunes',w:960,h:300,n:20,need:14,rate:26,time:260,hint:'The sun cooks anyone in the open. Duck under the shade, and BRIDGE the sand wall.',skills:{build:3},rules:['heat'],
 hatch:[{x:70,y:140,dir:1}],doors:[{x:890,y:200}],haz:[{x0:166,x1:334,y:264,y1:282,water:1},{x0:646,x1:794,y:266,y1:284,water:1}],
 build(S){fxProf(S,[[0,194],[80,202],[200,198],[320,204],[400,200],[480,200]],0,2);fxProf(S,[[480,200],[560,204],[680,196],[800,203],[890,200],[960,196]],0,2);S.box(400,200,80,100);
  S.box(150,128,150,10,1);S.box(440,150,34,50,10);S.box(560,128,170,10,1);fxCeil(S,[[0,34],[150,46],[300,34],[440,52],[560,36],[730,48],[960,34]],3);
  fxMass(S,[[226,40],[222,90],[228,130]],8,6,1);fxMass(S,[[646,40],[650,90],[644,130]],8,6,1);fxMass(S,[[860,36],[866,66],[858,90]],9,2,2);
  S.cutEll(250,256,90,12);S.cut(166,256,168,26);S.cutEll(720,258,80,12);S.cut(646,258,148,26);
  fxDec(S,'bigtree',60,196);fxDec(S,'ruin',340,202);fxDec(S,'statue',520,202);fxDec(S,'brokencolumn',760,200);fxDec(S,'torch',820,202);fxDec(S,'torch',930,198);fxDec(S,'rootdrop',380,44);fxDec(S,'bones',560,250);fxDec(S,'rocks',100,250);fxRough(S,[[390,140,490,300],[140,120,310,142],[550,120,740,142],[156,246,344,292],[636,248,804,294]]);},
 plan:[{x:424,d:1,s:'build',tol:4}]},
 {name:'Sandstorm Drop',style:'organic',theme:'dunes',w:780,h:340,n:20,need:9,rate:36,time:200,hint:'The storm blows toward the door. Pop a FLAP before the edge and ride it across.',skills:{flap:14},rules:['wind'],
 hatch:[{x:90,y:90,dir:1}],doors:[{x:620,y:250}],haz:[{x0:262,x1:336,y:306},{x0:60,x1:180,y:232,y1:250,water:1},{x0:500,x1:620,y:306,y1:322,water:1}],
 build(S){S.wavy(0,262,140,4,40,1);S.box(250,312,110,28,1);S.wavy(330,780,256,5,50,2);
  fxCeil(S,[[460,-40],[540,8],[640,24],[720,14],[780,20]],4);fxMass(S,[[640,20],[646,56],[638,84]],9,2,2);S.cutEll(120,224,70,14);S.cut(60,224,120,26);S.cutEll(560,300,70,10);S.cut(500,300,120,22);
  fxDec(S,'bigtree',50,140);fxDec(S,'rubble',150,140);fxDec(S,'ruin',420,256);fxDec(S,'statue',500,256);fxDec(S,'torch',560,256);fxDec(S,'torch',720,256);fxDec(S,'rootdrop',700,18);fxDec(S,'bones',420,290);fxRough(S,[[230,120,360,340],[50,214,190,258],[490,292,630,330]]);},
 plan:[{x:190,s:'flap',n:12}]},
 {name:'Vine Wall',style:'organic',theme:'canopy',w:900,h:320,n:20,need:12,rate:30,time:220,hint:'Vines can be climbed without a skill. Then BRIDGE the gap in the canopy.',skills:{build:3},
 hatch:[{x:70,y:170,dir:1}],doors:[{x:820,y:130}],haz:[{x0:526,x1:556,y:270,y1:296,water:1},{x0:326,x1:474,y:224,y1:242,water:1},{x0:636,x1:804,y:230,y1:248,water:1}],
 build(S){fxProf(S,[[0,224],[80,234],[180,228],[260,230]],0,2);fxProf(S,[[276,130],[340,126],[420,134],[500,130],[526,130]],0,2);fxProf(S,[[556,130],[640,126],[740,134],[820,130],[900,126]],0,2);S.box(276,130,6,190);S.box(520,130,6,190);S.box(556,130,6,190);
  S.box(260,130,16,100,11);S.box(526,296,30,24);fxCeil(S,[[0,36],[160,54],[320,32],[480,50],[640,34],[780,52],[900,38]],4);fxMass(S,[[120,48],[128,90],[118,130]],10,3,2);fxMass(S,[[700,46],[706,70]],8,2,2);
  S.cutEll(400,214,80,14);S.cut(326,214,148,28);S.cutEll(720,220,90,14);S.cut(636,220,168,28);
  fxDec(S,'bigtree',60,228);fxDec(S,'reeds',200,230);fxDec(S,'ruin',360,128);fxDec(S,'statue',450,132);fxDec(S,'brokencolumn',620,128);fxDec(S,'torch',700,132);fxDec(S,'torch',870,128);fxDec(S,'vines',400,40);fxDec(S,'vines',600,44);fxDec(S,'rootdrop',240,50);fxDec(S,'roots',100,280);fxDec(S,'moss',800,180);fxRough(S,[[250,120,290,240],[510,120,570,320],[316,204,484,250],[626,210,814,256]]);},
 plan:[{x:512,d:1,s:'build',tol:4}]},
 {name:'Flicker Bridge',style:'organic',theme:'vortex',w:900,h:320,n:20,need:14,rate:30,time:220,hint:'The rift bridge flickers in and out, and it will not hold a crowd. Chain your own BRIDGES over it.',skills:{build:3},haz:[{x0:260,x1:388,y:272,y1:300,water:1}],
 hatch:[{x:70,y:170,dir:1}],doors:[{x:830,y:220}],
 build(S){fxProf(S,[[0,212],[70,222],[160,216],[230,220],[260,220]],0,2);fxProf(S,[[388,220],[460,224],[560,214],[680,222],[800,216],[900,210]],0,2);S.box(254,220,6,100);S.box(388,220,6,100);S.box(260,220,128,10,14);S.box(260,300,128,20);
  fxCeil(S,[[0,36],[150,52],[320,30],[500,48],[660,32],[800,54],[900,38]],4);fxMass(S,[[620,40],[628,80],[618,110]],10,3,2);fxMass(S,[[100,44],[94,76]],8,2,2);S.cutEll(640,270,90,12);S.cut(556,270,168,26);
  fxDec(S,'statue',60,216);fxDec(S,'brokencolumn',180,218);fxDec(S,'ruin',480,222);fxDec(S,'torch',560,216);fxDec(S,'torch',760,218);fxDec(S,'archway',700,220);fxDec(S,'rootdrop',420,40);fxDec(S,'drip',760,50);fxRough(S,[[240,150,400,320],[546,260,734,306]]);},
 plan:[{x:252,d:1,s:'build',tol:2},{st:'shrug',s:'build',n:2}]},
 {name:'Crystal Climb',style:'organic',theme:'vortex',w:900,h:320,n:20,need:10,rate:30,time:220,hint:'Grab the crystals on the way: each one charges a BRIDGE. The wall needs two.',skills:{build:1},rules:['surges'],
 traps:[{k:'crystal',x:200,y:220,sk:'build'}],
 hatch:[{x:70,y:170,dir:1}],doors:[{x:820,y:172}],haz:[{x0:400,x1:482,y:274,y1:300,water:1},{x0:576,x1:744,y:244,y1:262,water:1}],
 build(S){fxProf(S,[[0,214],[80,224],[150,220],[250,220],[330,222],[400,220]],0,2);S.box(394,220,6,100);fxProf(S,[[482,172],[560,176],[660,168],[760,174],[900,166]],0,2);S.box(482,172,6,148);S.box(400,300,82,20);
  fxCeil(S,[[0,36],[140,54],[300,32],[440,40],[600,34],[760,56],[900,36]],4);fxMass(S,[[140,48],[148,84],[138,108]],10,3,2);fxMass(S,[[760,50],[752,84]],9,3,2);S.cutEll(660,236,90,12);S.cut(576,236,168,26);
  fxDec(S,'statue',60,218);fxDec(S,'brokencolumn',300,220);fxDec(S,'ruin',560,174);fxDec(S,'torch',640,170);fxDec(S,'archway',720,172);fxDec(S,'torch',870,168);fxDec(S,'rootdrop',300,40);fxDec(S,'drip',560,40);fxRough(S,[[380,140,500,320],[566,226,754,272]]);},
 plan:[{x:392,d:1,s:'build',tol:4},{x:436,d:1,s:'build',tol:6,wait:40}]},
 {name:'Drifting Shards',style:'organic',theme:'shatter',w:900,h:320,n:20,need:10,rate:30,time:240,hint:'A shard of the old border drifts across the gulf. A few can ride it. Chain BRIDGES over the gulf for the rest.',skills:{build:4},haz:[{x0:300,x1:480,y:270,y1:300,water:1}],
 shards:[{x:300,y:210,w:120,h:14,dx:3,dy:0,n:20,wait:20,hold:30}],
 hatch:[{x:70,y:170,dir:1}],doors:[{x:830,y:210}],
 build(S){fxProf(S,[[0,202],[80,212],[180,206],[260,210],[300,210]],0,2);S.box(294,210,6,110);S.box(300,210,120,14,1);fxProf(S,[[480,210],[560,214],[660,204],[780,212],[900,204]],0,2);S.box(480,210,6,110);S.box(300,300,180,20);
  fxCeil(S,[[0,36],[160,50],[330,30],[520,46],[700,32],[900,44]],4);fxMass(S,[[700,36],[708,70],[698,96]],10,3,2);S.cutEll(700,262,90,12);S.cut(616,262,168,26);
  fxDec(S,'statue',60,206);fxDec(S,'brokencolumn',200,208);fxDec(S,'ruin',560,212);fxDec(S,'torch',640,206);fxDec(S,'torch',860,206);fxDec(S,'rootdrop',140,44);fxDec(S,'drip',560,40);fxRough(S,[[280,150,500,320],[606,252,794,298]]);},
 plan:[{x:292,d:1,s:'build',tol:3},{st:'shrug',s:'build',n:3}]},
 {name:'Broken Road',style:'organic',theme:'shatter',w:900,h:320,n:20,need:9,rate:24,time:200,hint:'The old road crumbles under the first feet and the war still drops rubble. Chain BRIDGES over it.',skills:{build:4},rules:['rubble'],haz:[{x0:200,x1:360,y:272,y1:300,water:1}],
 hatch:[{x:70,y:170,dir:1}],doors:[{x:830,y:210}],
 build(S){fxProf(S,[[0,202],[70,212],[150,208],[200,210]],0,2);S.box(194,210,6,110);S.box(200,210,160,10,16);fxProf(S,[[360,210],[440,214],[560,204],[700,212],[830,208],[900,202]],0,2);S.box(360,210,6,110);S.box(200,300,160,20);
  fxCeil(S,[[0,36],[160,48],[340,30],[520,50],[700,32],[900,46]],4);fxMass(S,[[620,42],[628,76],[618,100]],10,3,2);S.cutEll(600,262,90,12);S.cut(516,262,168,26);
  fxDec(S,'statue',50,206);fxDec(S,'brokencolumn',440,212);fxDec(S,'ruin',520,208);fxDec(S,'torch',700,210);fxDec(S,'torch',870,206);fxDec(S,'rootdrop',440,40);fxDec(S,'rubble',760,210);fxRough(S,[[180,150,380,320],[506,252,694,298]]);},
 plan:[{x:192,d:1,s:'build',tol:2},{st:'shrug',s:'build',n:3}]},
 {name:'Rune Climb',style:'mixed',theme:'ruins',w:800,h:300,n:20,need:14,rate:26,time:240,hint:'A rune seal bars the temple. The glyph plate on the ledge shifts every seal. Build up to it.',skills:{build:3},
 hatch:[{x:70,y:170,dir:1}],doors:[{x:730,y:210}],traps:[{k:'glyph',x:330,y:190},{k:'well',x:352,y:190}],haz:[{x0:516,x1:684,y:270,y1:288,water:1},{x0:86,x1:214,y:270,y1:288,water:1}],
 build(S){S.wavy(0,800,212,3,48,1);S.box(290,190,90,8,1);S.box(420,100,14,114,17);S.box(420,214,14,90,1);
  fxCeil(S,[[0,40],[140,56],[250,62],[300,128],[372,128],[420,104],[434,104],[520,60],[660,44],[800,56]],3);fxMass(S,[[620,48],[628,84],[618,110]],10,3,2);S.cutEll(600,262,90,12);S.cut(516,262,168,26);S.cutEll(150,262,70,12);S.cut(86,262,128,26);
  fxDec(S,'chain',296,186,0,1,1);fxDec(S,'chain',374,186,0,1,1);fxDec(S,'statue',60,212);fxDec(S,'brokencolumn',180,212);fxDec(S,'column',520,212);fxDec(S,'archway',620,212);fxDec(S,'torch',480,212);fxDec(S,'torch',770,212);fxDec(S,'banner',700,50);fxDec(S,'rootdrop',100,50);fxRough(S,[[280,100,440,310],[506,252,694,298],[76,252,224,298]]);},
 plan:[{x:244,d:1,s:'build',tol:3}]},
 {name:'Rune Bridge',style:'mixed',theme:'ruins',w:900,h:320,n:20,need:12,rate:20,time:220,hint:'The bridge is only a memory until someone steps on the glyph. Mind the falling stones.',skills:{build:2},rules:['rubble'],
 hatch:[{x:70,y:170,dir:1}],doors:[{x:830,y:210}],traps:[{k:'glyph',x:250,y:210}],haz:[{x0:160,x1:200,y:272,y1:300,water:1},{x0:300,x1:440,y:272,y1:300,water:1},{x0:576,x1:744,y:270,y1:288,water:1}],
 build(S){fxProf(S,[[0,204],[60,212],[120,210],[160,210]],0,2);S.box(154,210,6,110);S.box(200,210,100,110,1);fxProf(S,[[440,210],[520,214],[640,204],[760,212],[900,204]],0,2);S.box(440,210,6,110);S.box(300,210,140,8,18);S.box(160,300,40,20);S.box(300,300,140,20);
  fxCeil(S,[[0,36],[150,52],[320,32],[500,50],[680,34],[900,46]],4);fxMass(S,[[600,44],[608,80],[598,106]],10,3,2);S.cutEll(660,262,90,12);S.cut(576,262,168,26);
  fxDec(S,'statue',40,208);fxDec(S,'brokencolumn',520,212);fxDec(S,'column',600,208);fxDec(S,'archway',700,210);fxDec(S,'torch',480,212);fxDec(S,'torch',870,206);fxDec(S,'banner',760,40);fxDec(S,'rootdrop',240,44);fxRough(S,[[140,150,460,320],[566,252,754,298]]);},
 plan:[{x:150,d:1,s:'build',tol:3}]},
];
// versus arenas: only the left half is authored; the right half is a mirror, so both sides are fair
const ALLSKILLS={climb:5,flap:5,boom:5,block:4,build:7,bash:5,pick:4,dig:5};
const ARENAS=[
{name:'Bog Bridge',theme:'bog',w:960,h:320,n:30,rate:30,time:210,mirror:1,skills:ALLSKILLS,hint:'Cross the gap, dig down to your hut, then smash the bridge behind you.',
 hatch:[{x:90,y:120,dir:1}],doors:[{x:800,y:240}],haz:[{x0:430,x1:530,y:262}],
 build(S){S.land(0,444,180);S.box(420,268,60,52);S.land(0,480,292);S.cut(0,0,0,0);S.cutEll(158,254,130,38);},
 plan:[{x:432,s:'build',tol:2},{st:'shrug',s:'build',x:480,tol:6},{x:790,d:1,s:'dig',tol:3,y:180,ytol:12}]},
{name:'Rival Mines',theme:'mine',w:980,h:320,n:30,rate:30,time:220,mirror:1,skills:ALLSKILLS,hint:'Smash the centre wall fast. Troops that wander back walk into THEIR hut.',
 hatch:[{x:90,y:96,dir:1}],doors:[{x:880,y:230}],
 build(S){S.land(0,490,256);S.rock(30,150,350,36,2);S.box(0,0,490,44);S.iron(440,44,50,100);S.rock(462,130,28,136,2);},
 plan:[{x:446,d:1,s:'bash',tol:4}]},
{name:'Lava Summit',theme:'forge',w:900,h:320,n:30,rate:30,time:230,mirror:1,skills:ALLSKILLS,hint:'Both huts sit on the summit. Climb, bridge or tunnel your way up first.',
 hatch:[{x:50,y:150,dir:1}],doors:[{x:430,y:100}],haz:[{x0:238,x1:284,y:286},{x0:616,x1:662,y:286}],
 build(S){S.land(0,240,206);S.box(230,292,70,28);S.land(282,450,206);S.box(372,132,78,190);},
 plan:[{x:230,s:'block',tol:2},{x:190,d:1,s:'build',tol:2,wait:90},{st:'shrug',s:'build',n:3}]},
];
// Combat Trials were removed (11 Nov 2026). The empty list keeps old saves and code paths safe.
const WAR_LEVELS=[];

// short taster campaigns: each one is built around what that race can do that goblins cannot
const RACE_LEVELS={goblin:LEVELS,
 swamp:[
 {race:'swamp',name:'Paddle Home',theme:'marsh',w:780,h:300,n:20,need:12,rate:32,time:200,hint:'Swampfolk swim. Goblins would be dead by now. SPEARS will get you up the cliff.',skills:{spear:3},
  hatch:[{x:90,y:110,dir:1}],doors:[{x:690,y:146}],haz:[{x0:240,x1:505,y:206}],
  build(S){S.wavy(0,246,190,4,40,1);S.box(236,262,300,38);S.ramp(430,256,520,190);S.box(520,190,60,110);S.land(574,780,146,2);},
  plan:[{x:532,d:1,s:'spear',tol:1}]},
 {race:'swamp',name:'Second Breakfast',theme:'marsh',w:720,h:300,n:20,need:12,rate:34,time:200,hint:'The gorgers think you are lunch. Show them the TONGUE first.',skills:{tongue:6},
  hatch:[{x:90,y:110,dir:1}],doors:[{x:640,y:196}],holes:[{x:430,y:190,awake:1}],
  build(S){S.wavy(0,720,196,3,40,2);S.box(0,0,720,40);S.iron(20,40,12,156);},
  plan:[{s:'tongue',rat:6,n:6}]},
 {race:'swamp',name:'Waiting for the Tide',theme:'marsh',w:660,h:340,n:20,need:13,rate:30,time:180,hint:'Relax. The water lifts you to the ledge. BRIDGE over the jaws when you get there.',skills:{build:3},
  hatch:[{x:120,y:200,dir:1}],doors:[{x:600,y:140}],rules:['flood'],floodRate:5,traps:[{k:'jaws',x:490,y:140},{k:'jaws',x:504,y:140}],trig:[{w:'timer',n:41,who:0,a:'off:flood',r:0}],
  build(S){S.wavy(0,430,292,3,40,1);S.land(424,660,142,2);S.box(0,0,14,340);},
  plan:[{x:466,d:1,s:'build',tol:1}]},
 {race:'swamp',name:'Dry Spell',theme:'cinder',w:1040,h:300,n:20,need:10,rate:30,time:200,hint:'Too hot for frog people. BASH through to the oasis before you dry out.',skills:{bash:4},
  hatch:[{x:90,y:110,dir:1}],doors:[{x:960,y:196}],haz:[{x0:470,x1:581,y:204,water:1}],
  build(S){S.wavy(0,470,196,3,40,1);S.rock(330,100,44,110,3);S.box(460,250,110,50);S.ramp(530,246,590,196);S.ramp(444,196,472,250);S.land(590,1040,196,2);S.rock(780,100,44,110,3);},
  plan:[{x:316,d:1,s:'bash',tol:1},{x:766,d:1,s:'bash',tol:1,wait:120}]}],
 bone:[
 {race:'bone',name:'Mind the Gap',theme:'crypts',w:760,h:300,n:20,need:11,rate:32,time:200,hint:'No bones, no bridge. BOOM a volunteer by the edge, then BONE BRIDGE from the pile.',skills:{boom:2,bonebr:2},
  hatch:[{x:70,y:165,dir:1}],doors:[{x:690,y:230}],
  build(S){S.iron(0,230,320,70);S.iron(366,230,394,70);},
  plan:[{s:'boom',x:176,tol:1},{s:'bonebr',x:316,tol:2,d:1}]},
 {race:'bone',name:'Back From the Grave',theme:'crypts',w:760,h:300,n:15,need:14,rate:34,time:200,hint:'The mines will cost you. Walk past the pile and GRAVE WALK your friends back.',skills:{raise:4},
  hatch:[{x:70,y:165,dir:1}],doors:[{x:690,y:230}],traps:[{k:'mine',x:300,y:230},{k:'mine',x:470,y:230}],
  build(S){S.iron(0,230,760,70);},
  plan:[{s:'raise',x:286,tol:14,n:2},{s:'raise',x:456,tol:14,n:2}]},
 {race:'bone',name:'Bigger Bones',theme:'crypts',w:820,h:300,n:24,need:1,rate:18,time:200,goal:'clear',hint:'Clear the map. CONSTRUCT merges 4 Skeletons into one big bruiser.',skills:{merge:3},
  hatch:[{x:70,y:165,dir:1}],doors:[],foes:[{kind:'golem',x:520,y:225,dir:-1}],nests:[{x:690,y:230,kind:'skel',per:260,hp:12,cap:2}],
  build(S){S.iron(0,230,820,70);},
  plan:[{s:'merge',x:150,tol:8,n:3}]},
 {race:'bone',name:'Graveyard Shift',theme:'crypts',w:900,h:300,n:24,need:6,rate:22,time:240,goal:'both',hint:'Spend one to cross, merge four to fight, and send the rest home.',skills:{boom:2,bonebr:2,merge:2},
  hatch:[{x:70,y:165,dir:1}],doors:[{x:850,y:230}],nests:[{x:690,y:230,kind:'skel',per:300,hp:8,cap:1}],
  build(S){S.iron(0,230,320,70);S.iron(366,230,534,70);},
  plan:[{s:'boom',x:176,tol:1},{s:'bonebr',x:316,tol:2,d:1},{s:'merge',x:430,tol:40,n:2}]}],
 fairy:[
 {race:'fairy',name:'Mind the Breeze',theme:'garden',w:900,h:300,n:20,need:12,rate:34,time:200,rules:['gust'],hint:'Fairies flutter over small gaps. GLIDE over the wall and the gate will open.',skills:{glide:3},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:830,y:220}],gates:[{x:520,y:190,w:14,h:30}],zones:[{id:1,x:544,y:170,w:90,h:52}],trig:[{w:'zone',n:1,who:0,a:'open',r:0}],
  build(S){S.box(0,220,260,80);S.box(300,220,600,80);S.box(520,150,14,40);},plan:[{x:468,tol:6,d:1,s:'glide',n:2}]},
 {race:'fairy',name:'Iron Fence',theme:'garden',w:800,h:300,n:20,need:9,rate:34,time:220,hint:'Iron burns Fairies. BRIDGE above the plate before it zaps them.',skills:{build:4},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:730,y:220}],
  build(S){S.box(0,220,800,80);S.iron(290,220,180,10);},plan:[{x:270,d:1,s:'build',tol:1},{st:'walk',x:312,tol:4,y:196,ytol:6,d:1,s:'build'}]},
 {race:'fairy',name:'Sweet Dreams',theme:'garden',w:800,h:300,n:20,need:10,rate:32,time:200,hint:'Nobody can fight that Golem. PIXIE DUST sends it to sleep, so tiptoe past.',skills:{dust:5},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:730,y:220}],foes:[{kind:'golem',x:380,y:215,dir:-1}],
  build(S){S.box(0,220,800,80);},plan:[{s:'dust',rat:4,reach:50,n:5}]}],
 dwarf:[
 {race:'dwarf',name:'Plate Steel',theme:'halls',w:760,h:300,n:18,need:12,rate:40,time:220,hint:'Iron stops other races. Dwarves BASH right through it.',skills:{bash:2},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:690,y:230}],
  build(S){S.box(0,230,760,70);S.iron(400,0,32,230);},plan:[{x:388,d:1,s:'bash',tol:2}]},
 {race:'dwarf',name:'Human Cannonball',theme:'halls',w:860,h:300,n:18,need:11,rate:40,time:240,hint:'That pit is too wide to walk. Set up a CANNON and load your friends.',skills:{cannon:2},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:790,y:230}],traps:[{k:'keg',x:200,y:230}],
  build(S){S.box(0,230,290,70);S.box(420,230,440,70);},plan:[{x:250,d:1,s:'cannon',tol:2}]},
 {race:'dwarf',name:'Last Call',theme:'halls',w:860,h:300,n:18,need:10,rate:40,time:260,hint:'Morale runs on ale. STEAM PACK over the wall and open the gate before they sober up.',skills:{steam:3},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:790,y:230}],gates:[{x:430,y:200,w:18,h:30}],zones:[{id:1,x:456,y:190,w:60,h:42}],trig:[{w:'zone',n:1,who:0,a:'open',r:0}],traps:[{k:'keg',x:300,y:230},{k:'press',x:640,y:230,per:90}],
  build(S){S.box(0,230,860,70);S.iron(430,150,18,50);},plan:[{x:412,tol:3,d:1,s:'steam'}]}],
 rat:[
 {race:'rat',name:'Chew Toy',theme:'sewers',w:820,h:300,n:20,need:12,rate:26,time:180,scrap:3,hint:'Ratfolk chew through wood for free. SPRING BOOTS clear the gate, if they behave.',skills:{spring:3},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:750,y:230}],gates:[{x:480,y:196,w:14,h:34}],zones:[{id:1,x:504,y:180,w:80,h:52}],trig:[{w:'zone',n:1,who:0,a:'open',r:0}],
  build(S){S.box(0,230,820,70);S.box(250,160,16,70,3);S.box(480,170,14,26);},plan:[{x:432,tol:6,d:1,s:'spring',n:3}]},
 {race:'rat',name:'Scrap Run',theme:'sewers',w:820,h:300,n:20,need:9,rate:26,time:180,scrap:0,hint:'No scrap, no gadgets. Grab it on the way, then RAT MINE the wall. Stand back.',skills:{ratmine:3},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:750,y:230}],traps:[{k:'scrap',x:220,y:230},{k:'scrap',x:300,y:230}],
  build(S){S.box(0,230,820,70);S.rock(430,90,20,150,1);},plan:[{x:420,tol:5,d:1,s:'ratmine'}]},
 {race:'rat',name:'Tidal Clock',theme:'sewers',w:880,h:320,n:20,need:8,rate:24,time:200,scrap:4,rules:['tide'],tideLow:10,tideH:70,tideRate:300,hint:'The tide comes and goes. Run the belt, then RAT MINE the plug at low water.',skills:{ratmine:3},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:810,y:216}],traps:[{k:'belt',x:580,y:216,w:100,dir:-1}],
  build(S){S.box(0,216,300,104);S.box(300,262,260,58);S.ramp(262,216,332,262);S.ramp(490,262,560,216);S.box(560,216,320,104);S.rock(420,180,20,90,1);},plan:[{x:415,tol:3,d:1,s:'ratmine',n:1}]}],
 shroom:[
 {race:'shroom',name:'Slow Growth',theme:'caves',w:800,h:300,n:18,need:12,rate:40,time:240,hint:'Grow a MUSHROOM stair well back from the cliff.',skills:{vine:3},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:720,y:150}],
  build(S){S.box(0,230,800,70);S.box(420,150,380,150);},plan:[{x:295,d:1,s:'vine',tol:2}]},
 {race:'shroom',name:'It Grows Back',theme:'caves',w:760,h:340,n:18,need:8,rate:34,time:220,rules:['regrow'],hint:'This cave heals itself. DIG, and get everyone through before the hole closes.',skills:{dig:4},
  hatch:[{x:90,y:90,dir:1}],doors:[{x:640,y:290}],
  build(S){S.box(0,0,760,20);S.box(0,160,760,50);S.box(0,290,760,50);S.box(0,20,16,270);S.box(744,20,16,270);},plan:[{x:300,d:1,s:'dig',tol:2},{x:300,tol:2,s:'dig',wait:360},{x:300,tol:2,s:'dig',wait:720}]},
 {race:'shroom',name:'Calm Down',theme:'caves',w:820,h:300,n:18,need:9,rate:32,time:220,hint:'SPORE PUFF stuns enemies for a moment. Bunched troops cheer each other up.',skills:{puff:6},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:750,y:230}],foes:[{kind:'skel',x:360,y:225,dir:-1},{kind:'skel',x:520,y:225,dir:-1}],
  build(S){S.box(0,230,820,70);},plan:[{s:'puff',rat:6,reach:44,n:6}]}],
 imp:[
 {race:'imp',name:'Lava Stroll',theme:'cinder',w:800,h:300,n:20,need:12,rate:32,time:200,hint:'Lava is a warm bath for an Imp. Burn the wooden wall with a FIREPOT.',skills:{firepot:3},
  hatch:[{x:90,y:110,dir:1}],doors:[{x:720,y:190}],haz:[{x0:240,x1:505,y:206}],
  build(S){S.wavy(0,246,190,4,40,1);S.box(236,262,300,38);S.ramp(430,256,520,190);S.box(520,190,280,110);S.box(590,80,26,112,3);},
  plan:[{x:540,d:1,s:'firepot',tol:2}]},
 {race:'imp',name:'Over the Top',theme:'cinder',w:760,h:300,n:20,need:14,rate:32,time:180,hint:'One good HOP over the gate, and whoever lands opens it for the rest.',skills:{hop:3},
  hatch:[{x:90,y:130,dir:1}],doors:[{x:660,y:208}],gates:[{x:300,y:186,w:14,h:26}],zones:[{id:1,x:326,y:170,w:60,h:44}],trig:[{w:'zone',n:1,who:0,a:'open',r:0}],traps:[{k:'jet',x:470,y:208,per:70},{k:'jet',x:530,y:208,per:70}],
  build(S){S.wavy(0,760,210,2,40,1);S.iron(20,120,12,92);},
  plan:[{x:262,d:1,s:'hop',tol:1}]},
 {race:'imp',name:'Bonfire Night',theme:'forge',w:800,h:300,n:20,need:10,rate:34,time:200,hint:'Fire jets tickle Imps and roast gorgers. Burn the fences and walk through.',skills:{firepot:6},
  hatch:[{x:90,y:110,dir:1}],doors:[{x:720,y:196}],holes:[{x:470,y:190,awake:1}],traps:[{k:'jet',x:220,y:196,per:70},{k:'jet',x:424,y:196,per:40},{k:'jet',x:540,y:196,per:40}],
  build(S){S.wavy(0,800,196,3,40,2);S.box(0,0,800,40);S.box(380,40,20,160,3);S.box(600,40,20,160,3);S.box(376,196,28,12,1);S.box(596,196,28,12,1);},
  plan:[{x:340,d:1,s:'firepot',tol:2},{x:562,d:1,s:'firepot',tol:2,wait:120}]},
 {race:'imp',name:'Cold Snap',theme:'frost',w:720,h:340,n:20,need:9,rate:30,time:180,hint:'Water is rising and Imps cannot swim. BRIDGE up, quickly.',skills:{build:5,hop:2},
  hatch:[{x:70,y:200,dir:1}],doors:[{x:650,y:172}],rules:['flood'],floodRate:18,
  build(S){S.wavy(0,190,272,3,30,1);S.wavy(190,330,244,3,30,2);S.wavy(330,470,216,3,30,3);S.wavy(470,720,188,3,30,4);},
  plan:[{x:138,d:1,s:'build',tol:2},{x:278,d:1,s:'build',tol:2,wait:60},{x:418,d:1,s:'build',tol:2,wait:60}]}]};
