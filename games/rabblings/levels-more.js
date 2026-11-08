// More campaign maps per race: longer and harder as the numbers climb. Each has a plan the level tests (and the CPU rival) can play.
RACE_LEVELS.swamp.push(
 {race:'swamp',name:'Two Cliffs',theme:'marsh',w:1040,h:300,n:24,need:14,rate:32,time:260,hint:'Two cliffs in a row. SPEARS get you up the first, and you will need them again.',skills:{spear:5},
  hatch:[{x:90,y:110,dir:1}],doors:[{x:980,y:108}],haz:[{x0:240,x1:505,y:206}],
  build(S){S.wavy(0,246,190,4,40,1);S.box(236,262,300,38);S.ramp(430,256,520,190);S.box(520,190,60,110);S.land(574,780,146,2);S.land(780,1040,108,2);},
  plan:[{x:532,d:1,s:'spear',tol:1},{x:732,d:1,s:'spear',tol:1,wait:60}]},
 {race:'swamp',name:'Rat Run Rumble',theme:'marsh',w:1160,h:300,n:28,need:14,rate:26,time:260,hint:'Three rat holes, all awake. Keep the TONGUE busy and the line moving.',skills:{tongue:14},
  hatch:[{x:90,y:110,dir:1}],doors:[{x:1090,y:196}],holes:[{x:330,y:190,awake:1},{x:620,y:190},{x:900,y:190}],
  build(S){S.wavy(0,1160,196,3,40,2);S.box(0,0,1160,40);S.iron(20,40,12,156);},
  plan:[{s:'tongue',rat:6,n:14}]}
);
RACE_LEVELS.bone.push(
 {race:'bone',name:'Two Gaps',theme:'crypts',w:1040,h:300,n:24,need:12,rate:30,time:260,hint:'Two gaps, and only so many bones. BOOM one, bridge it, then do it again.',skills:{boom:3,bonebr:3},
  hatch:[{x:70,y:165,dir:1}],doors:[{x:970,y:230}],
  build(S){S.iron(0,230,320,70);S.iron(366,230,300,70);S.iron(712,230,328,70);},
  plan:[{s:'boom',x:176,tol:1},{s:'bonebr',x:316,tol:2,d:1},{s:'boom',x:520,tol:1,wait:120},{s:'bonebr',x:662,tol:2,d:1,wait:60}]},
 {race:'bone',name:'The Long Dark',theme:'crypts',w:1160,h:300,n:28,need:10,rate:24,time:320,goal:'both',hint:'A long road, a gap and a nest at the end. Bridge it, merge the strong, send the rest home.',skills:{boom:3,bonebr:3,merge:3},
  hatch:[{x:70,y:165,dir:1}],doors:[{x:1090,y:230}],nests:[{x:800,y:230,kind:'skel',per:300,hp:8,cap:1}],
  build(S){S.iron(0,230,420,70);S.iron(466,230,694,70);},
  plan:[{s:'boom',x:280,tol:1},{s:'bonebr',x:416,tol:2,d:1},{s:'merge',x:500,tol:10,n:2}]}
);
RACE_LEVELS.fairy.push(
 {race:'fairy',name:'Iron Garden',theme:'garden',w:1000,h:300,n:24,need:11,rate:32,time:260,hint:'Iron everywhere. BRIDGE over each plate before it zaps them.',skills:{build:8},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:930,y:220}],
  build(S){S.box(0,220,1000,80);S.iron(260,220,140,10);S.iron(560,220,160,10);},plan:[{x:240,d:1,s:'build',tol:1},{st:'walk',x:282,tol:4,y:196,ytol:6,d:1,s:'build'},{x:540,d:1,s:'build',tol:1,wait:60},{st:'walk',x:582,tol:4,y:196,ytol:6,d:1,s:'build'}]},
 {race:'fairy',name:'Twin Gates',theme:'garden',w:1100,h:300,n:22,need:12,rate:32,time:260,rules:['gust'],hint:'Two walls, two gates. GLIDE the first, and the second is a little taller.',skills:{glide:5},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:1030,y:220}],gates:[{x:420,y:190,w:14,h:30},{x:800,y:190,w:14,h:30}],zones:[{id:1,x:444,y:170,w:90,h:52},{id:2,x:824,y:170,w:90,h:52}],trig:[{w:'zone',n:1,who:0,a:'open',r:0},{w:'zone',n:2,who:0,a:'open',r:0}],
  build(S){S.box(0,220,1100,80);S.box(420,150,14,40);S.box(800,150,14,40);},plan:[{x:368,tol:6,d:1,s:'glide',n:2},{x:748,tol:6,d:1,s:'glide',n:2,wait:60}]},
 {race:'fairy',name:'Sleeping Giants',theme:'garden',w:1200,h:300,n:26,need:12,rate:30,time:300,hint:'Two Brutes block the road. PIXIE DUST them both and tiptoe past.',skills:{dust:8},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:1130,y:220}],foes:[{kind:'golem',x:420,y:215,dir:-1},{kind:'golem',x:800,y:215,dir:-1}],
  build(S){S.box(0,220,1200,80);},plan:[{s:'dust',rat:4,reach:50,n:8}]}
);
RACE_LEVELS.dwarf.push(
 {race:'dwarf',name:'Steel Curtain',theme:'halls',w:1000,h:300,n:20,need:12,rate:38,time:260,hint:'Three iron walls and one pickaxe habit. BASH straight through.',skills:{bash:5},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:930,y:230}],
  build(S){S.box(0,230,1000,70);S.iron(300,0,28,230);S.iron(560,0,28,230);S.iron(800,0,28,230);},plan:[{x:288,d:1,s:'bash',tol:2},{x:548,d:1,s:'bash',tol:2,wait:60},{x:788,d:1,s:'bash',tol:2,wait:60}]},
 {race:'dwarf',name:'Keg Alley',theme:'halls',w:1100,h:300,n:20,need:11,rate:38,time:280,hint:'Two pits and a lot of kegs. CANNON the first, then do it again.',skills:{cannon:4},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:1030,y:230}],traps:[{k:'keg',x:200,y:230},{k:'keg',x:620,y:230}],
  build(S){S.box(0,230,290,70);S.box(420,230,300,70);S.box(850,230,250,70);},plan:[{x:250,d:1,s:'cannon',tol:2},{x:680,d:1,s:'cannon',tol:2,wait:120}]},
 {race:'dwarf',name:'The Deep Hold',theme:'halls',w:1200,h:300,n:22,need:10,rate:36,time:320,hint:'Iron, a gate, a press and a pit. A dwarf plans ahead.',skills:{bash:3,steam:3,cannon:2},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:1130,y:230}],gates:[{x:700,y:200,w:18,h:30}],zones:[{id:1,x:726,y:190,w:60,h:42}],trig:[{w:'zone',n:1,who:0,a:'open',r:0}],traps:[{k:'keg',x:200,y:230},{k:'press',x:950,y:230,per:90}],
  build(S){S.box(0,230,500,70);S.iron(300,0,28,230);S.box(630,230,570,70);S.iron(700,150,18,50);},plan:[{x:288,d:1,s:'bash',tol:2},{x:460,d:1,s:'cannon',tol:2,wait:60},{x:682,tol:3,d:1,s:'steam',wait:60}]}
);
RACE_LEVELS.rat.push(
 {race:'rat',name:'Pipe Dream',theme:'sewers',w:1000,h:300,n:22,need:12,rate:24,time:220,scrap:4,hint:'Two gates. SPRING BOOTS clear the first, and your luck needs to hold for the second.',skills:{spring:5},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:930,y:230}],gates:[{x:400,y:196,w:14,h:34},{x:760,y:196,w:14,h:34}],zones:[{id:1,x:424,y:180,w:80,h:52},{id:2,x:784,y:180,w:80,h:52}],trig:[{w:'zone',n:1,who:0,a:'open',r:0},{w:'zone',n:2,who:0,a:'open',r:0}],
  build(S){S.box(0,230,1000,70);S.box(400,170,14,26);S.box(760,170,14,26);},plan:[{x:352,tol:6,d:1,s:'spring',n:3},{x:712,tol:6,d:1,s:'spring',n:3,wait:60}]},
 {race:'rat',name:'Scrap Heap',theme:'sewers',w:1100,h:300,n:22,need:10,rate:24,time:240,scrap:0,hint:'Two walls, and scrap to spare. Collect it, then RAT MINE both.',skills:{ratmine:5},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:1030,y:230}],traps:[{k:'scrap',x:220,y:230},{k:'scrap',x:300,y:230},{k:'scrap',x:360,y:230},{k:'scrap',x:560,y:230}],
  build(S){S.box(0,230,1100,70);S.rock(430,90,20,150,1);S.rock(820,90,20,150,1);},plan:[{x:426,tol:1,d:1,s:'ratmine'},{x:816,tol:1,d:1,s:'ratmine',wait:80}]},
 {race:'rat',name:'High Water',theme:'sewers',w:1200,h:320,n:24,need:9,rate:22,time:300,scrap:6,rules:['tide'],tideLow:10,tideH:62,tideRate:300,hint:'The tide, the belt and two plugs. Time it, and do not stop.',skills:{ratmine:4,spring:2},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:1130,y:216}],traps:[{k:'belt',x:580,y:216,w:100,dir:-1}],
  build(S){S.box(0,216,300,104);S.box(300,262,260,58);S.ramp(262,216,332,262);S.ramp(490,262,560,216);S.box(560,216,640,104);S.rock(420,180,20,90,1);S.rock(900,130,20,90,1);},plan:[{x:415,tol:3,d:1,s:'ratmine',n:1},{x:890,tol:3,d:1,s:'ratmine',n:1,wait:80}],seed:2}
);
RACE_LEVELS.shroom.push(
 {race:'shroom',name:'Overgrown',theme:'caves',w:1000,h:300,n:20,need:12,rate:36,time:280,hint:'Two cliffs, two crops. Plant VINES back from each one and let them grow.',skills:{vine:6},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:930,y:90}],
  build(S){S.box(0,230,1000,70);S.box(420,150,580,150);S.box(720,90,280,210);},plan:[{x:350,d:1,s:'vine',tol:2},{x:650,d:1,s:'vine',tol:2,wait:200}]},
 {race:'shroom',name:'Three Floors Down',theme:'caves',w:900,h:420,n:20,need:8,rate:32,time:400,rules:['regrow'],hint:'Three floors and a cave that heals. DIG down fast and get everyone through.',skills:{dig:10},
  hatch:[{x:90,y:90,dir:1}],doors:[{x:740,y:350}],
  build(S){S.box(0,0,900,20);S.box(0,160,900,30);S.box(0,260,900,30);S.box(0,350,900,70);S.box(0,20,16,330);S.box(884,20,16,330);},plan:[{x:300,tol:3,s:'dig',y:160,ytol:15},{x:300,tol:3,s:'dig',y:160,ytol:15,wait:360},{x:300,tol:10,s:'dig',y:260,ytol:15,wait:450},{x:300,tol:10,s:'dig',y:260,ytol:15,wait:650},{x:300,tol:10,s:'dig',y:260,ytol:15,wait:850},{x:300,tol:10,s:'dig',y:260,ytol:15,wait:1050},{x:300,tol:10,s:'dig',y:260,ytol:15,wait:1250},{x:300,tol:10,s:'dig',y:260,ytol:15,wait:1450}]},
 {race:'shroom',name:'Spore Storm',theme:'caves',w:1100,h:300,n:22,need:9,rate:30,time:300,hint:'Three Ledge Stalkers and one road. SPORE PUFF them, and keep the crowd close.',skills:{puff:10},
  hatch:[{x:90,y:150,dir:1}],doors:[{x:1030,y:230}],foes:[{kind:'skel',x:380,y:225,dir:-1},{kind:'skel',x:640,y:225,dir:-1},{kind:'skel',x:900,y:225,dir:-1}],
  build(S){S.box(0,230,1100,70);},plan:[{s:'puff',rat:6,reach:44,n:10}]}
);
RACE_LEVELS.imp.push(
 {race:'imp',name:'Fire Walls',theme:'forge',w:1000,h:300,n:22,need:12,rate:32,time:260,hint:'Three wooden walls and one very bad idea. FIREPOT them all.',skills:{firepot:8},
  hatch:[{x:90,y:110,dir:1}],doors:[{x:930,y:196}],traps:[{k:'jet',x:220,y:196,per:70}],
  build(S){S.wavy(0,1000,196,3,40,2);S.box(0,0,1000,40);S.box(380,40,20,160,3);S.box(620,40,20,160,3);S.box(820,40,20,160,3);S.box(376,196,28,12,1);S.box(616,196,28,12,1);S.box(816,196,28,12,1);},plan:[{x:340,d:1,s:'firepot',tol:2},{x:580,d:1,s:'firepot',tol:2,wait:120},{x:780,d:1,s:'firepot',tol:2,wait:120}]},
 {race:'imp',name:'Heat Wave',theme:'cinder',w:1200,h:300,n:24,need:12,rate:30,time:300,hint:'Lava, gates and jets. HOP what you must, burn what you can.',skills:{firepot:4,hop:4},
  hatch:[{x:90,y:130,dir:1}],doors:[{x:1130,y:208}],gates:[{x:300,y:186,w:14,h:26}],zones:[{id:1,x:326,y:170,w:60,h:44}],trig:[{w:'zone',n:1,who:0,a:'open',r:0}],traps:[{k:'jet',x:470,y:208,per:70},{k:'jet',x:530,y:208,per:70},{k:'jet',x:900,y:208,per:50}],
  build(S){S.wavy(0,1200,210,2,40,1);S.iron(20,120,12,92);S.box(700,60,20,150,3);},plan:[{x:262,d:1,s:'hop',tol:1},{x:660,d:1,s:'firepot',tol:2,wait:120}]}
);
