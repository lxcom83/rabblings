// ---------- skills ----------
const SK=['climb','flap','boom','block','build','bash','pick','dig'],SKN=['SCALE','FLAP','BOOM','BOUNCE','BRIDGE','BASH','PICK','DIG'];
const SKD=['Climbs any wall from now on','Glides down safely from any height','Blows a hole after 5 seconds','Stands firm and turns everyone back','Lays 12 steps of bridge','Smashes straight ahead','Hacks diagonally downward','Digs straight down'];
// spells are rare. Campaign mana stays spent, and 2 player spells cost the same slow-growing magic as tricks
const SPELLS={sleep:{n:'SLEEP',c:1,vc:3,r:56,d:'Enemies in the circle fall asleep',s:'ENEMIES SLEEP',col:'#50739b'},confuse:{n:'CONFUSE',c:1,vc:2,r:56,d:'Enemies stumble back and forth',s:'ENEMIES STUMBLE',col:'#f0d16b'},hypno:{n:'HYPNOSIS',c:2,vc:4,r:44,d:'Monsters fight for you, rivals walk to your hut',s:'ENEMIES ARE CHARMED',col:'#515d9d'},ward:{n:'WARD',c:1,vc:2,r:48,d:'Your troops survive one deadly hit',s:'SURVIVE ONE HIT',col:'#76bd5d'},rally:{n:'RALLY',c:1,r:72,d:'Lifts morale and ends sit-downs',s:'LIFTS MORALE',col:'#777d45'}},SPK=Object.keys(SPELLS),VS_SPELLS=['sleep','confuse','hypno','ward'];
const TR=['boulder','stink','hex','mimic'],TRN=['BOULDER','STINK','HEX','MIMIC'],TRC=[2,1,2,3];
const TRD=['Drops a rock. Crushes troops and bridges','Rivals near it panic and run the wrong way','Steals up to 3 rival troops','Fake door that eats rival troops'];
const SKX={tongue:['TONGUE','Eats rats or zips to a wall'],spear:['SPEARS','Hammers steps up to a wall'],hop:['HOP','One big jump'],firepot:['FIREPOT','Burns wood and rats'],raise:['GRAVE WALK','Raises a troop once from a pile'],merge:['CONSTRUCT','Merges 4 into a big fighter'],bonebr:['BONE BRIDGE','Builds with a nearby pile'],glide:['GLIDE','Rides the air up and forward'],dust:['PIXIE DUST','Sends nearby enemies to sleep'],steam:['STEAM PACK','Blasts straight up'],cannon:['CANNON','Fires troops across the map'],spring:['SPRING BOOTS','Big jump. 1 scrap. Risky'],ratmine:['RAT MINE','Blasts rock. 2 scrap. Risky'],vine:['VINES','Grows a stair upward'],puff:['SPORE PUFF','Calms troops, stuns enemies'],sword:['SWORD','Fights what it meets, 2 hearts'],bow:['BOW','Stops and shoots enemies ahead']};
const DIFFS=[{k:'easy',n:'EASY',t:1.4,need:.85,mood:.7,score:.75},{k:'normal',n:'NORMAL',t:1,need:1,mood:1,score:1},{k:'hard',n:'HARD',t:.8,need:1.15,mood:1.3,score:1.5},{k:'wild',n:'WILD',t:.8,need:1.15,mood:1.3,score:2,wild:1}];
// enemy units. Numbers are starting values to tune in play
const FOES={rat:{n:'RAT',hp:1,sp:2,every:1,cd:0,r:5},skel:{n:'SKELETON',hp:2,sp:1,every:2,cd:24,r:6,patrol:1},spider:{n:'GIANT SPIDER',hp:5,sp:0,every:1,cd:20,r:12,tall:1,jump:1},arch:{n:'ARCHER',hp:1,sp:0,every:1,cd:24,r:6,shoot:1,range:130,rate:45},golem:{n:'GOLEM',hp:6,sp:1,every:3,cd:30,r:10,push:1,tall:1}};
const skName=k=>SK.includes(k)?SKN[SK.indexOf(k)]:SKX[k][0],skDesc=k=>SK.includes(k)?SKD[SK.indexOf(k)]:SKX[k][1];
const FALLMAX=112,TOOLS=['walk','shrug','bash','pick','dig','build'],GONE=['splat','drown','burn','home','dead','held'];

// ---------- world ----------
class World{
 constructor(def,o={}){this.def=def;this.vs=!!o.vs;this.quiet=!!o.quiet;this.classic=!!o.classic;this.diff=DIFFS[this.vs||o.diff===undefined?1:o.diff]||DIFFS[1];const TH=THEME[def.theme];this.hz=(def.haz||[]).map(h=>({...h,lava:h.water?0:(TH.lavaHaz||0)}));const sides=this.sides=o.sides||[{race:def.race||'goblin',clan:0},{race:'goblin',clan:1}];const crew=i=>{const b=def.n;return this.vs&&!def.custom&&sides[i].race==='goblin'?Math.round(b*1.2):b;};
  const T=this.T=new Terrain(def.w,def.h,def.theme,def.seed||7);T.open=!!def.open;T.gfx=def.gfx||null;T.mir=!!def.mirror;this.maxUp=def.maxUp||7;this.fallMax=def.fall||FALLMAX;const S=new Shaper(T,def.seed||7);def.build(S);
  if(def.mirror)for(let y=0;y<T.h;y++)for(let x=0;x<T.w>>1;x++){const v=T.m[y*T.w+x];T.m[y*T.w+T.w-1-x]=v===4?5:v===5?4:v;}
  this.hatches=[];this.doors=[];const mir=(x)=>def.w-1-x;
  def.hatch.forEach(h=>{const tm=def.free2p?h.team||0:0;this.hatches.push({...h,team:tm,left:crew(tm),next:45,open:0});if(this.vs&&!def.free2p)this.hatches.push({x:mir(h.x),y:h.y,dir:-h.dir,team:1,left:crew(1),next:45,open:0});});
  def.doors.forEach(d=>{this.doors.push({...d,team:def.free2p?d.team||0:0});if(this.vs&&!def.free2p)this.doors.push({x:mir(d.x),y:d.y,team:1});});
  this.gates=(def.gates||[]).map(g=>({...g,open:!!g.open}));for(const g of this.gates)if(!g.open)S.box(g.x,g.y,g.w,g.h,2);
  for(const d of this.doors){if(d.raw)continue;let y=d.y;while(y<T.h&&!T.solid(d.x,y))y++;d.y=y;}
  if(!this.quiet)T.paint();
  this.gobs=[];this.parts=[];this.ents=[];this.floats=[];this.tick=0;this.time=Math.round(def.time*TPS*this.diff.t);this.over=false;this.shake=0;this.lazy=0;this.events=[];
  const panelOf=i=>SK.map(k=>(def.swap&&def.swap[k])||RACES[sides[i].race].swap[k]||k),perk=i=>RACES[sides[i].race].clans[sides[i].clan].perk||{};const skills=i=>{const src=(i&&def.skills2?def.skills2:def.skills)||{},s={};panelOf(i).forEach((k,j)=>{s[k]=(src[k]!==undefined?src[k]:src[SK[j]])||0;});const q=perk(i);if(q.skill&&s[q.skill]>0)s[q.skill]++;return s;};
  this.trial=o.trial||null;this.pl=[0,1].slice(0,this.vs?2:1).map(i=>({id:i,race:sides[i].race,perk:perk(i),panel:panelOf(i),skills:skills(i),saved:0,out:0,lost:0,stolen:0,grog:3+(perk(i).mana||0),spells:this.vs&&!this.classic&&!def.noTricks?VS_SPELLS.slice():[],mana:0,spellCd:0,sel:0,bot:null,planDone:[],cx:0,cy:0,tx:0,ty:0,camX:0,camY:0,cool:90}));
  if(this.trial&&!this.vs){const p=this.pl[0],k=this.trial;if(p.panel.includes(k))p.skills[k]+=2;else{let s=-1;for(let i=7;i>=0;i--)if(!p.skills[p.panel[i]]){s=i;break;}if(s<0)s=7;delete p.skills[p.panel[s]];p.panel[s]=k;p.skills[k]=2;}}
  this.blockers=[];
  this.initExtras();
 }
 initExtras(){const d=this.def,T=this.T;this.rnd=rng((d.seed||7)*31+d.w);this.log=[];this.mobs=[];this.rule={};(d.rules||[]).forEach(r=>this.rule[r]=1);this.banner='';this.bannerT=0;
  this.floodY=T.h+8;this.lavaY=T.h+8;this.holes=(d.holes||[]).map(h=>({...h}));this.zones=d.zones||[];
  this.traps=(d.traps||[]).map(t=>{const o={...t,cd:0,live:1,off:(t.x*7)%40};if(!t.raw){let y=clamp(t.y,0,T.h-1);if(T.solid(t.x,y))while(y>0&&T.solid(t.x,y-1))y--;else while(y<T.h&&!T.solid(t.x,y))y++;o.y=y;}return o;});
  this.trig=(d.trig||[]).map(t=>({...t,hit:0}));
  this.moodOn=d.morale!==0&&!this.classic;this.talkT=0;this.piles=[];this.gustDir=0;for(const p of this.pl)p.scrap=(d.scrap===undefined?6:d.scrap)+(p.perk.scrap||0);if((d.rules||[]).includes('regrow')){T.grow=[];}this.wildOn=!!(d.wild||this.diff.wild);this.under=isUnder(d.theme,d.under);this.tmp={};this.surgeT=0;this.wildNext=300;this.quakeOff=0;for(const p of this.pl)Object.assign(p,{mood:100,moodT:0,lastLost:0,lastSaved:0,total:Math.max(1,this.hatches.filter(h=>h.team===p.id).reduce((a,h)=>a+h.left,0))});this.need=clamp(Math.ceil((d.need||1)*this.diff.need),1,this.pl[0].total);
  this.fightMap=!!((d.nests||[]).length||(d.foes||[]).length);this.nests=(d.nests||[]).map(n=>{let y=clamp(n.y,0,T.h-1);if(T.solid(n.x,y))while(y>0&&T.solid(n.x,y-1))y--;else while(y<T.h&&!T.solid(n.x,y))y++;return{...n,y,hp:n.hp||8,max:n.hp||8,cd:60,dead:0,flip:1};});for(const f of d.foes||[])this.addMob(f.kind||'skel',f.x,f.y,f.dir||-1);
  for(const h of this.holes)if(h.awake)this.spawnRats(h,3);}
 say(s){this.banner=s;this.bannerT=70;}
 talk(g,kind,force){if(this.quiet||this.classic)return;if(!force&&this.tick<this.talkT)return;const r=RACES[g.race],L=CHAT[kind].concat((r.chat&&r.chat[kind])||[]),s=L[Math.random()*L.length|0];this.talkT=this.tick+22;for(let i=this.ents.length-1;i>=0;i--)if(this.ents[i].k==='say'&&this.ents[i].g===g)this.ents.splice(i,1);this.ents.push({k:'say',g,s,l:44});voice(s,r.pitch||200);}
 stepMood(){if(!this.moodOn)return;for(const p of this.pl){const dl=p.lost-p.lastLost,ds=p.saved-p.lastSaved;if(dl||ds){p.mood=clamp(p.mood-dl*120/p.total*(RACES[p.race].loss||1)*this.diff.mood+ds*40/p.total,0,100);p.lastLost=p.lost;p.lastSaved=p.saved;}
   const tier=p.mood>=70?0:p.mood>=40?1:p.mood>=20?2:3,nm=this.vs?CLAN[p.id].name+': ':'';if(tier!==p.moodT){if(tier>p.moodT)this.say(nm+['','THE TROOPS ARE GRUMBLING','THEY ARE IGNORING ORDERS','MUTINY!'][tier]);p.moodT=tier;}
   const walkers=this.gobs.filter(g=>g.team===p.id&&g.s==='walk');if(tier&&this.tick%(tier===1?70:40)===0&&walkers.length)this.talk(walkers[(this.rnd()*walkers.length)|0],tier===3?'strike':'grumble');
   if(tier===3&&this.tick%30===0&&walkers.length){const g=walkers[(this.rnd()*walkers.length)|0];if(this.T.solid(g.x,g.y)){this.setS(g,'sit');this.talk(g,'strike',1);}}
   if(p.mood>=35&&this.tick%20===0){const g=this.gobs.find(a=>a.team===p.id&&a.s==='sit');if(g)this.setS(g,'walk');}
   if(!this.vs&&!p.allSit){const left=this.hatches.reduce((a,h)=>a+h.left,0),live=this.gobs.filter(g=>this.alive(g));if(!left&&live.length&&live.every(g=>g.s==='sit')){p.allSit=1;this.say('STRIKE! PAUSE: LIGHT ALL FUSES');}}}}
 defy(g,pl){if(!this.moodOn||pl.mood>=40)return false;if(this.rnd()<(pl.mood<20?.7:.35)){this.talk(g,'refuse',1);this.snd('deny');return true;}return false;}
 deathFx(g,how){if(this.quiet||this.classic)return;const R=Math.random,hood=CLAN[g.team].hood||'#953c2e';if(how==='boom'||R()<.75)this.ents.push({k:'hat',x:g.x,y:g.y-14,vx:(R()-.5)*3,vy:how==='boom'?-6:-3.5,c:hood,l:70});if(how==='jaws'||how==='boom')this.ents.push({k:'boots',x:g.x,y:g.y,vx:how==='boom'?(R()-.5)*4:0,vy:how==='boom'?-5:0,l:110});if(how==='drown'){this.float(g.x,g.y-16,'GLUB','#6287ae');}if(how==='press')this.float(g.x,g.y-16,'SQUISH','#f0d16b');if(how==='fall'&&R()<.3)this.float(g.x,g.y-16,'SPLOT','#f0d16b');if(R()<.34)this.ents.push({k:'ghost',x:g.x,y:g.y-10,x0:g.x,t:0,l:60});if(R()<.3)this.talk(g,'last');}
 addMob(kind,x,y,dir){const T=this.T;if(!FOES[kind])kind='skel';x=clamp(x,2,T.w-3);let yy=clamp(y,0,T.h-1);if(T.solid(x,yy))while(yy>0&&T.solid(x,yy-1))yy--;else while(yy<T.h&&!T.solid(x,yy))yy++;const m={kind,x,y:yy,px:x,py:yy,dir:dir||1,t:0,dead:0,hp:FOES[kind].hp,aim:30};this.mobs.push(m);return m;}
 stepNests(){const T=this.T;for(const n of this.nests){if(n.dead)continue;if(!T.solid(n.x,n.y)&&!T.solid(n.x-9,n.y)&&!T.solid(n.x+9,n.y)){n.y+=2;if(n.y>T.h+10){n.dead=1;this.say('NEST DESTROYED!');}continue;}if(--n.cd<=0){n.cd=n.per||200;if(this.mobs.filter(m=>!m.dead&&m.nest===n).length<(n.cap||3)){n.flip=-n.flip;const m=this.addMob(n.kind||'skel',n.x+n.flip*16,n.y,n.flip);m.nest=n;}}}}
 isClear(){return this.nests.every(n=>n.dead)&&this.mobs.every(m=>m.dead||m.wild);}
 stepWild(){if(this.quakeOff&&this.tick>=this.quakeOff){this.rule.quake=0;this.quakeOff=0;}
  for(const k in this.tmp)if(this.tick>=this.tmp[k]){delete this.tmp[k];this.rule[k]=0;if(k==='gust')this.gustDir=0;}if(this.surgeT>0)this.surgeT--;
  if(!this.wildOn||this.tick<this.wildNext)return;this.wildNext=this.tick+500+(this.rnd()*400|0);
  const L=this.under?['cavein','bigquake','spider','tunnelflood','dark']:['debris','surge','swoop','gale','bigquake'];this.fire(L[this.rnd()*L.length|0]);}
 // a wildcard rule that switches itself off again. Never touches a rule the map already uses
 tempRule(k,t){if(this.rule[k]&&!this.tmp[k])return false;this.rule[k]=1;this.tmp[k]=this.tick+t;return true;}
 openSky(x,y){const T=this.T;for(let j=y-18;j>0;j-=3)if(T.solid(x,j))return false;return true;}
 leavePile(g){if(g.race!=='bone'||g.raised||this.piles.filter(p=>p.live).length>=14)return;const T=this.T;let x=g.x,y=0,ok=false;for(const o of [0,10,-10,20,-20,30,-30]){const a=g.x+o;if(a<9||a>=T.w-9)continue;let yy=clamp(g.y-8,0,T.h-1),n=0;if(T.solid(a,yy))continue;while(yy<T.h&&!T.solid(a,yy)&&n<56){yy++;n++;}if(yy>=T.h||n>=56||T.m[yy*T.w+a]===7)continue;x=a;y=yy;ok=true;break;}if(!ok)return;const cells=[];for(let j=0;j<7;j++){const hw=8-j;for(let i=-hw;i<=hw;i++){const a=x+i,b=y-1-j;if(a<0||b<0||a>=T.w)continue;const k=b*T.w+a;if(!T.m[k]){T.m[k]=7;T.t[k]=boneCol(a,b);cells.push(k);}}}if(!cells.length)return;T.mark(x-9,y-8,19,9);this.piles.push({x,y,team:g.team,live:1,cells});}
 nearPile(g,r,team){let b=null,bd=r;for(const p of this.piles){if(!p.live||p.team!==team)continue;const d=Math.hypot(p.x-g.x,p.y-g.y);if(d<=bd){bd=d;b=p;}}return b;}
 takePile(p){const T=this.T;p.live=0;for(const k of p.cells)if(T.m[k]===7)T.m[k]=0;T.mark(p.x-9,p.y-8,19,9);}
 shed(g){const a=g.inside&&g.inside.pop();if(a){a.s='walk';a.t=0;a.x=a.px=g.x;a.y=a.py=g.y;a.dir=-g.dir;a.fallen=0;}if(g.inside&&!g.inside.length){g.inside=null;g.big=0;}}
 nestAt(x,y){for(const n of this.nests)if(!n.dead&&Math.abs(x-n.x)<=13&&y>n.y-26&&y<=n.y+4)return n;return null;}
 clearLine(x0,x1,y){const T=this.T,s=x1>x0?4:-4;for(let x=x0;Math.abs(x-x1)>4;x+=s)if(T.solid(x,y))return false;return true;}
 hurtFoe(m,v){m.hp=(m.hp||1)-v;if(m.hp<=0){m.dead=1;this.float(m.x,m.y-16,'DOWN','#f0d16b');for(const p of this.pl)p.mood=Math.min(100,p.mood+3);}else this.float(m.x,m.y-18,'HIT','#fff');this.snd('bash');}
 hurtNest(n,v){if(n.dead)return;n.hp-=v;this.float(n.x,n.y-32,'HIT','#fff');this.snd('bash');if(n.hp<=0){n.dead=1;for(const p of this.pl)p.mood=Math.min(100,p.mood+12);this.say('NEST DESTROYED!');this.boomFx(n.x,n.y-12);this.snd('boom');this.shake=6;}}
 hurtGob(g){if(g.hp>1){g.hp--;if(g.big)this.shed(g);this.float(g.x,g.y-24,'OUCH','#eb6f39');this.talk(g,'hurt');}else this.kill(g);}
 engage(g){const d=g.dir;if(g.bow){let b=null,bd=141;for(const m of this.mobs){if(m.dead)continue;const dx=(m.x-g.x)*d;if(dx>0&&dx<bd&&Math.abs(m.y-g.y)<=14&&this.clearLine(g.x,m.x,g.y-8)){b=m;bd=dx;}}for(const n of this.nests){if(n.dead)continue;const dx=(n.x-g.x)*d;if(dx>0&&dx<bd&&g.y>n.y-24&&g.y<=n.y+4&&this.clearLine(g.x,n.x,g.y-8)){b=n;bd=dx;}}if(b){g.tg=b;this.setS(g,'shoot');return true;}return false;}
  for(const m of this.mobs){if(m.dead)continue;const dx=(m.x-g.x)*d;if(dx>=-2&&dx<=9&&Math.abs(m.y-g.y)<=10){g.tg=m;this.setS(g,'fight');return true;}}for(const n of this.nests){if(n.dead)continue;const dx=(n.x-g.x)*d;if(dx>=0&&dx<=16&&g.y>n.y-26&&g.y<=n.y+4){g.tg=n;this.setS(g,'fight');return true;}}return false;}
 spawnRats(h,n){for(let i=0;i<n;i++){let y=clamp(h.y,0,this.T.h-1);while(y<this.T.h&&!this.T.solid(h.x,y))y++;this.mobs.push({x:h.x+i*4,y,px:h.x,py:y,dir:i%2?1:-1,t:i*5,dead:0});}}
 countDeaths(w){return w===1?this.pl[0].lost:w===2?(this.pl[1]?this.pl[1].lost:0):this.pl.reduce((a,p)=>a+p.lost,0);}
 countHome(w){return w===1?this.pl[0].saved:w===2?(this.pl[1]?this.pl[1].saved:0):this.pl.reduce((a,p)=>a+p.saved,0);}
 inZone(id,who){const zs=this.zones.filter(z=>z.id===id);for(const g of this.gobs)if(this.alive(g)&&(!who||g.team===who-1))for(const z of zs)if(g.x>=z.x&&g.x<z.x+z.w&&g.y-4>=z.y&&g.y-4<z.y+z.h)return true;return false;}
 stepTriggers(){for(const t of this.trig){if(t.hit&&!t.r)continue;let go=false;
   if(t.w==='timer')go=this.tick>=t.n*TPS*(t.hit+1);else if(t.w==='deaths')go=this.countDeaths(t.who)>=t.n;else if(t.w==='home')go=this.countHome(t.who)>=t.n;else if(t.w==='zone')go=this.inZone(t.n,t.who);
   if(go){t.hit++;if(t.w!=='timer')t.r=0;this.fire(t.a);}}}
 fire(a){const[k,v]=a.split(':');const N={lowg:'LOW GRAVITY',highg:'HIGH GRAVITY',flood:'THE FLOOD IS RISING',lava:'LAVA IS RISING',dark:'THE LIGHTS GO OUT',wind:'THE WIND PICKS UP',quake:'EARTHQUAKE',fast:'DOUBLE SPEED'};
  if(k==='on'){this.rule[v]=1;this.say(N[v]+'!');this.snd('door');}else if(k==='off'){this.rule[v]=0;}
  else if(k==='rats'){const hs=this.holes.length?this.holes:this.hatches;for(const h of hs)this.spawnRats(h,4);this.say('RATS!');this.snd('stink');}
  else if(k==='debris'){this.say('ISLAND DEBRIS!');const live=this.gobs.filter(g=>this.alive(g));for(let i=0;i<5;i++){const g=live.length?live[(this.rnd()*live.length)|0]:null,tx=clamp((g?g.x:this.rnd()*this.T.w)+(this.rnd()*160-80|0)|0,8,this.T.w-9);let ty=0;while(ty<this.T.h&&!this.T.solid(tx,ty))ty++;const n=(ty+40)/8;this.ents.push({k:'meteor',rock:1,tx,ty,x:tx-n*1.4,y:-40,wait:30+i*22});}this.snd('rock');}
  else if(k==='surge'){const o=['lowg','highg','fast'].filter(q=>!this.rule[q]);if(!o.length)return;const q=o[this.rnd()*o.length|0];this.tempRule(q,200);this.surgeT=200;this.say('VORTEX SURGE! '+{lowg:'LOW GRAVITY',highg:'HIGH GRAVITY',fast:'DOUBLE SPEED'}[q]);this.shake=4;this.snd('door');}
  else if(k==='gale'){if(!this.tempRule('wind',260))return;this.tempRule('gust',260);this.gustDir=this.rnd()<.5?1:-1;this.say('A GALE BLOWS!');this.snd('door');}
  else if(k==='swoop'){const live=this.gobs.filter(g=>this.alive(g)&&g.s!=='home'&&this.openSky(g.x,g.y)),g=live.length?live[(this.rnd()*live.length)|0]:null,d=this.rnd()<.5?1:-1;this.ents.push({k:'swoop',g,d,x:(g?g.x:this.T.w/2)-d*220,y:-30,ph:0,t:0,c:null});this.say(g?'SOMETHING CIRCLES ABOVE!':'A SHADOW PASSES OVERHEAD');this.snd('stink');}
  else if(k==='cavein'){this.fire('boulders');this.say('CAVE-IN!');this.shake=6;}
  else if(k==='tunnelflood'){if(!this.tempRule('flood',160))return;this.say('THE TUNNEL FLOODS!');this.snd('door');}
  else if(k==='dark'){if(!this.tempRule('dark',300))return;this.say('THE LIGHTS GO OUT!');this.snd('door');}
  else if(k==='meteors'){this.say('METEOR STRIKE!');const live=this.gobs.filter(g=>this.alive(g));for(let i=0;i<5;i++){const g=live.length?live[(this.rnd()*live.length)|0]:null,tx=clamp((g?g.x:this.rnd()*this.T.w)+(this.rnd()*160-80|0)|0,8,this.T.w-9);let ty=0;while(ty<this.T.h&&!this.T.solid(tx,ty))ty++;const n=(ty+40)/8;this.ents.push({k:'meteor',tx,ty,x:tx-n*1.4,y:-40,wait:30+i*22});}this.snd('door');}
  else if(k==='spider'){this.say('GIANT SPIDER!');const live=this.gobs.filter(g=>this.alive(g)),g=live.length?live[(this.rnd()*live.length)|0]:null,x=clamp(g?g.x+(g.dir>0?170:-170):this.T.w>>1,12,this.T.w-13);const m=this.addMob('spider',x,0,g?-g.dir:1);m.wild=1;m.life=620;m.air=0;this.snd('stink');}
  else if(k==='bigquake'){this.say('EARTHQUAKE!');this.rule.quake=1;this.quakeOff=this.tick+150;}
  else if(k==='open'){this.setGates(true);this.say('THE GATES OPEN');}else if(k==='close'){this.setGates(false);this.say('THE GATES SLAM SHUT');}
  else if(k==='boulders'){const lead=this.gobs.filter(g=>this.alive(g));this.say('ROCKS FROM ABOVE!');for(let i=0;i<5;i++){const g=lead.length?lead[(this.rnd()*lead.length)|0]:null,x=g?g.x+(this.rnd()*80-40|0):(this.rnd()*this.T.w)|0;this.ents.push({k:'boulder',x,y:g?g.y-110-i*30:-30,vx:0,vy:1,team:-1,b:0,a:0});}}}
 setGates(open){const T=this.T;for(const g of this.gates){if(g.open===open)continue;g.open=open;for(let j=g.y;j<g.y+g.h;j++)for(let i=g.x;i<g.x+g.w;i++){if(i<0||j<0||i>=T.w||j>=T.h)continue;const k=j*T.w+i;if(open){if(T.m[k]===2)T.m[k]=0;}else if(!T.m[k]){T.m[k]=2;T.t[k]=T.ironTex(i,j);}}T.mark(g.x,g.y,g.w,g.h);}this.shake=3;this.snd('clank');}
 stepRules(){const r=this.rule,T=this.T,every=(this.def.floodRate||10);
  if(r.gust&&this.tick%150===0){this.gustDir=[1,0,-1,0][(this.tick/150|0)%4];}
  if(r.tide){const d=this.def;this.floodY=Math.round(T.h-(d.tideLow||20)-(d.tideH||80)*(.5-.5*Math.cos(this.tick/(d.tideRate||80))));}
  if(T.grow&&r.regrow){T.now=this.tick;if(this.tick%4===0){let n=0;while(T.grow.length&&n<40&&this.tick-T.grow[0][2]>=300){const[k,v]=T.grow.shift(),y=k/T.w|0,x=k%T.w;n++;if(T.m[k])continue;let safe=true;for(const g of this.gobs)if(this.alive(g)&&Math.abs(g.x-x)<=7&&Math.abs(g.y-5-y)<=9){safe=false;break;}if(safe){T.m[k]=v;T.mark(x,y,1,1);}else T.grow.push([k,v,this.tick]);}}}
  if(this.moodOn&&this.tick%25===0)for(const p of this.pl){if(p.race==='dwarf')p.mood=Math.max(0,p.mood-.33/(p.perk.ale||1));if(p.race==='shroom'){const L=this.gobs.filter(g=>g.team===p.id&&this.alive(g));if(L.some(a=>L.filter(b=>Math.abs(a.x-b.x)<=30&&Math.abs(a.y-b.y)<=20).length>=4))p.mood=Math.min(100,p.mood+.6*(p.perk.heal||1));}}
  if(r.flood&&this.tick%every===0&&this.floodY>0)this.floodY--;
  if(r.lava&&this.tick%every===0&&this.lavaY>0){this.lavaY--;for(let i=0;i<T.w;i++){const y=this.lavaY;if(y>=0&&y<T.h&&T.m[y*T.w+i]===3){T.m[y*T.w+i]=0;T.mark(i,y,1,1);}}}
  if(r.quake&&this.tick%50===0){this.shake=6;this.snd('rock');for(let n=0;n<3;n++){const x=(this.rnd()*T.w)|0;let y=0;while(y<T.h&&T.m[y*T.w+x]!==1)y++;if(y<T.h){T.carveEll(x,y,8,6);this.dust(x,y,6);}}}
  if(this.bannerT>0)this.bannerT--;}
 kill(g,how){if(!this.alive(g))return;if(g.ward>0){g.ward=0;this.float(g.x,g.y-18,'WARDED','#76bd5d');this.snd('select');return;}if(g.big&&how!=='fire'){this.hurtGob(g);return;}if(g.inside&&how==='fire'){for(const a of g.inside){a.s='dead';this.pl[g.team].lost++;}g.inside=null;g.big=0;}if(how==='fire'&&!this.classic){g.s='burn';g.t=0;this.pl[g.team].lost++;this.snd('stink');this.talk(g,'last',1);return;}this.splat(g);this.deathFx(g,how);}
 surf(x,gy){let y=1e9,lava=0;for(const h of this.hz)if(x>=h.x0&&x<=h.x1&&h.y<y&&(h.y1===undefined||gy===undefined||gy<=h.y1)){y=h.y;lava=h.lava;}if(this.floodY<this.T.h&&this.floodY<y){y=this.floodY;lava=0;}if(this.lavaY<this.T.h&&this.lavaY<y){y=this.lavaY;lava=1;}return{y,lava};}
 swims(g,lava){return lava?g.race==='imp':g.race==='swamp';}
 doTongue(g){const T=this.T,d=g.dir,y=g.y-9;let hit=0;for(let i=8;i<=96&&!hit;i+=2){const x=g.x+d*i;for(const m of this.mobs)if(!m.dead&&Math.abs(m.x-x)<=4&&Math.abs(m.y-6-y)<=9){m.dead=1;hit=x;this.float(m.x,m.y-14,'GULP','#80a465');this.snd('chomp');break;}
   if(!hit)for(const o of this.gobs)if(this.alive(o)&&o.team!==g.team&&Math.abs(o.x-x)<=4&&Math.abs(o.y-6-y)<=9){o.x=o.px=g.x+d*12;o.y=o.py=g.y;o.dir=-o.dir;o.panic=60;if(TOOLS.includes(o.s)||o.s==='block')this.setS(o,'walk');hit=x;this.float(g.x,g.y-22,'YANK','#80a465');this.snd('hex');break;}
   if(!hit&&T.solid(x,y)){hit=x;let t=y;while(t>y-18&&T.solid(x,t-1))t--;if(t>y-18&&!T.solid(x,t-1)){g.x=x+d*3;g.y=t;while(g.y>0&&T.solid(g.x,g.y-1))g.y--;}else{g.x=x-d*2;g.fallen=0;this.setS(g,'fall');}this.snd('door');}}
  this.ents.push({k:'tongueFx',x0:g.px,y0:y,x1:hit||g.x+d*96,y1:y,l:5});}
 doSpear(g){const T=this.T,d=g.dir;let dist=0;for(let i=3;i<=62;i++)if(T.solid(g.x+d*i,g.y-3)){dist=i;break;}if(!dist){this.setS(g,'shrug');this.snd('deny');return;}const n=Math.min(10,Math.floor((dist-1)/6));if(n<1){this.setS(g,'shrug');return;}const wx=g.x+d*dist;for(let k=1;k<=n;k++){const cx=wx-d*(n-k+1)*6;T.plank(d>0?cx:cx-5,g.y-6*k,6,6*k,g.team);}this.setS(g,'shrug');this.snd('build');this.dust(wx,g.y-20,6);}
 potBurst(e){const T=this.T,x=e.x|0,y=e.y|0;for(let j=y-38;j<=y+38;j++)for(let i=x-42;i<=x+42;i++)if(i>=0&&j>=0&&i<T.w&&j<T.h&&(T.m[j*T.w+i]===3||T.m[j*T.w+i]===7)){T.m[j*T.w+i]=0;}T.mark(x-42,y-38,84,76);this.crush(x,y,20,e.team);this.boomFxSmall(x,y);this.snd('boom');this.shake=4;}
 boomFxSmall(x,y){if(this.quiet)return;const R=Math.random;for(let i=0;i<26;i++){const a=R()*TAU,s=20+R()*110;this.p(x,y,Math.cos(a)*s,Math.sin(a)*s-20,['#b5a64b','#db9016','#b64c1e'][R()*3|0],14+R()*16);}}
 stepTraps(){const T=this.T;for(const t of this.traps){if(t.cd>0)t.cd--;if(!t.live)continue;const ph=(this.tick+t.off)%(t.per||70);
   const each=f=>{for(const g of this.gobs)if(this.alive(g)&&g.s!=='home')f(g);};
   if(t.k==='spring'){if(t.cd>0)continue;let got=0;each(g=>{if((g.s==='walk'||g.s==='fall')&&Math.abs(g.x-t.x)<=7&&Math.abs(g.y-t.y)<=5){g.s='fling';g.t=0;g.fx=g.x;g.fy=g.y-1;g.vx=g.dir*1.6;g.vy=-(t.pow||7);g.fallen=0;got=1;}});if(got){t.cd=5;this.snd('door');}}
   else if(t.k==='belt'){each(g=>{if(g.s==='walk'&&g.x>=t.x&&g.x<t.x+t.w&&Math.abs(g.y-t.y)<=3){const nx=g.x+(t.dir||1);if(!T.solid(nx,g.y-3))g.x=nx;}});}
   else if(t.k==='keg'){let got=null;each(g=>{if(!got&&Math.abs(g.x-t.x)<=6&&Math.abs(g.y-t.y)<=6)got=g;});if(got){t.live=0;for(const p of this.pl)if(p.id===got.team)p.mood=Math.min(100,p.mood+30);this.float(t.x,t.y-18,'ALE!','#f0c36b');this.snd('home');}}
   else if(t.k==='scrap'){let got=null;each(g=>{if(!got&&Math.abs(g.x-t.x)<=6&&Math.abs(g.y-t.y)<=6)got=g;});if(got){t.live=0;this.pl[got.team].scrap+=2;this.float(t.x,t.y-18,'+2 SCRAP','#c6a054');this.snd('tick');}}
   else if(t.k==='fire'){each(g=>{if(g.race!=='imp'&&g.x>=t.x&&g.x<t.x+t.rw&&g.y>=t.y&&g.y<=t.y+t.rh+1)this.kill(g,'fire');});}
   else if(t.k==='jaws'){if(t.cd>0)continue;let got=null;each(g=>{if(!got&&(t.rw?Math.abs(g.x-t.x)<=t.rw/2&&g.y>=t.y-t.rh&&g.y<=t.y+1:Math.abs(g.x-t.x)<=4&&Math.abs(g.y-t.y)<=3))got=g;});if(got){this.kill(got,'jaws');t.cd=50;this.snd('chomp');}}
   else if(t.k==='mine'){let b=false;each(g=>{if(Math.abs(g.x-t.x)<=4&&Math.abs(g.y-t.y)<=3)b=true;});if(b){t.live=0;T.carveEll(t.x,t.y-4,22,18);each(g=>{if(Math.hypot(g.x-t.x,g.y-t.y)<24)this.kill(g,'boom');});this.snd('boom');this.shake=8;this.boomFx(t.x,t.y-6);}}
   else if(t.k==='jet'){if(ph<26){each(g=>{if(g.race!=='imp'&&Math.abs(g.x-t.x)<=5&&g.y<=t.y+1&&g.y>=t.y-46)this.kill(g,'fire');});for(const m of this.mobs)if(!m.dead&&Math.abs(m.x-t.x)<=7&&Math.abs(m.y-t.y)<=6){m.dead=1;this.float(m.x,m.y-12,'ROASTED','#db9016');}if(ph===0)this.snd('stink');}}
   else if(t.k==='press'){if(ph>=30&&ph<42){each(g=>{if(Math.abs(g.x-t.x)<=10&&Math.abs(g.y-t.y)<=4)this.kill(g,'press');});if(ph===30)this.snd('rock');}}
   else if(t.k==='catapult'){if(t.cd>0)continue;let got=0;each(g=>{if((g.s==='walk')&&Math.abs(g.x-t.x)<=4&&Math.abs(g.y-t.y)<=4){g.s='fling';g.t=0;g.fx=g.x;g.fy=g.y-4;g.vx=(t.dir||1)*(t.pow||4.5);g.vy=-(t.pow||4.5)*1.15;g.fallen=0;got=1;}});if(got){t.cd=8;this.snd('door');}}
   else if(t.k==='warp'){if(t.cd>0||t.recv)continue;const to=this.traps.find(o=>o!==t&&o.k==='warp'&&o.p===t.p);if(!to)continue;let got=0;each(g=>{if(g.s==='walk'&&Math.abs(g.x-t.x)<=3&&Math.abs(g.y-t.y)<=4){g.x=g.px=to.x+g.dir*5;g.y=g.py=to.y;got=1;for(let i=0;i<6;i++)this.p(to.x,to.y-8,(Math.random()-.5)*60,-Math.random()*50,'#505e9b',16);}});if(got){t.cd=4;to.cd=20;this.snd('hex');}}}}
 boomFx(x,y){if(this.quiet)return;const R=Math.random;for(let i=0;i<36;i++){const a=R()*TAU,s=30+R()*150;this.p(x,y,Math.cos(a)*s,Math.sin(a)*s-30,['#b5a64b','#db9016','#b64c1e','#534842'][R()*4|0],16+R()*22);}this.ents.push({k:'ring',x,y,r:2,l:12});}
 bite(m,F){if(m.cd)return;for(const g of this.gobs)if(this.alive(g)&&g.s!=='home'&&(g.s!=='block'||F.push)&&Math.abs(g.x-m.x)<=F.r&&Math.abs(g.y-m.y)<=(F.tall?14:8)){this.hurtGob(g);m.cd=F.cd;break;}}
 stepMobs(){const T=this.T;for(const m of this.mobs){if(m.dead)continue;m.px=m.x;m.py=m.y;m.t++;if(m.sleep>0){m.sleep--;continue;}
   if(m.charm>0){m.charm--;if(m.t%20===0){let b=null,bd=36;for(const o of this.mobs){if(o===m||o.dead||o.charm>0)continue;const q=Math.hypot(o.x-m.x,o.y-m.y);if(q<bd){bd=q;b=o;}}if(b){this.hurtFoe(b,1);this.float(b.x,b.y-14,'HIT','#515d9d');}}continue;}
   if(m.daze>0){m.daze--;if(m.daze%25===0)m.dir=-m.dir;const nx=m.x+m.dir;if(!T.solid(nx,m.y-1)&&T.solid(nx,m.y+2))m.x=nx;continue;}
   if(m.kind==='spider'){const F=FOES.spider;if(m.cd>0)m.cd--;if(--m.life<=0){m.dead=1;continue;}if(m.air){m.vy+=.32;if(T.solid((m.x+m.vx*3)|0,(m.y|0)-10))m.vx=-m.vx;m.x=clamp(m.x+m.vx,2,T.w-3);m.y+=m.vy;if(m.y>T.h+20){m.dead=1;continue;}if(m.vy>0&&T.solid(m.x|0,m.y|0)){m.x|=0;m.y|=0;while(m.y>0&&T.solid(m.x,m.y-1))m.y--;m.air=0;m.t=0;this.shake=2;this.snd('rock');}}else if(!T.solid(m.x|0,m.y|0)){m.y+=3;}else if(m.t>=38){let b=null,bd=1e9;for(const g of this.gobs){if(!this.alive(g))continue;const q=Math.abs(g.x-m.x)+Math.abs(g.y-m.y);if(q<bd){bd=q;b=g;}}const dx=b?clamp(b.x-m.x,-160,160):(m.dir*80);m.dir=dx>0?1:-1;m.vx=dx/34;m.vy=-5.6;m.y-=2;m.air=1;}this.bite(m,F);continue;}
   if(!T.solid(m.x,m.y)){m.y+=3;if(m.y>T.h+6)m.dead=1;continue;}
   for(const h of this.hz)if(m.x>=h.x0&&m.x<=h.x1&&m.y>=h.y+3&&(h.y1===undefined||m.y<=h.y1))m.dead=1;if(m.y>=this.floodY+3||m.y>=this.lavaY+3)m.dead=1;
   const F=FOES[m.kind||'rat'];if(m.cd>0)m.cd--;
   if(F.shoot){let b=null,bd=1e9;for(const g of this.gobs){if(!this.alive(g)||g.s==='home'||Math.abs(g.y-m.y)>16)continue;const q=Math.abs(g.x-m.x);if(q<bd){bd=q;b=g;}}if(b&&bd<=F.range){m.dir=b.x>m.x?1:-1;if(--m.aim<=0&&this.clearLine(m.x,b.x,m.y-9)){m.aim=F.rate;this.ents.push({k:'arrow',x:m.x+m.dir*6,y:m.y-9,vx:m.dir*5,team:-1,l:40});this.snd('door');}}}
   else if(m.hold>0)m.hold--;
   else if(m.t%F.every===0)for(let i=0;i<F.sp;i++){m.x+=m.dir;let up=0;while(up<8&&T.solid(m.x,m.y-1-up))up++;if(up>=6){m.x-=m.dir;m.dir=-m.dir;break;}m.y-=up;if(!up){let d=0;while(d<6&&!T.solid(m.x,m.y+d))d++;if(d>=6){if(F.patrol){m.x-=m.dir;m.dir=-m.dir;break;}m.y+=3;break;}m.y+=d;}
    if(!F.push)for(const b of this.blockers)if(Math.abs(m.x-b.x)<=6&&Math.abs(m.y-b.y)<=8){m.dir=b.x>m.x?-1:1;}}
   this.bite(m,F);}}
 snd(n){if(!this.quiet)sfx(n);}
 alive(g){return!GONE.includes(g.s);}
 setS(g,s){g.s=s;g.t=0;}
 p(x,y,vx,vy,c,l=30,g=1){if(this.quiet||this.parts.length>500)return;this.parts.push({x,y,vx,vy,c,l,g});}
 dust(x,y,n,sp=1){if(this.quiet)return;const R=Math.random;for(let i=0;i<n;i++){const px=x+(R()*8-4|0),py=y+(R()*8-4|0),k=clamp(py,0,this.T.h-1)*this.T.w+clamp(px,0,this.T.w-1),c=this.T.theme.ramp[3+(R()*3|0)];this.p(px,py,(R()-.5)*50*sp,-R()*70*sp,c,18+R()*16);}}
 float(x,y,s,c){if(!this.quiet)this.floats.push({x,y,s,c,l:40});}
 spawn(h){const g={x:h.x,y:h.y,px:h.x,py:h.y,team:h.team,dir:h.dir,s:'fall',t:0,fallen:0,climber:0,flap:0,fuse:0,panic:0,bricks:0,dry:0,race:this.pl[h.team].race,id:this.gobs.length};if(g.race==='dwarf')g.hp=2;if(g.race==='fairy')g.flap=1;this.gobs.push(g);this.pl[h.team].out++;this.snd('tick');return g;}
 step(){if(this.over)return;this.tick++;if(this.time>0&&!this.def.noTime)this.time--;
  for(const h of this.hatches){if(h.open<8&&this.tick>20)h.open+=.5;if(h.left>0&&this.tick>=h.next){const g0=this.spawn(h);if(h.cl)g0.climber=1;if(h.fl)g0.flap=1;h.left--;h.next=this.tick+this.def.rate;}}
  this.blockers=this.gobs.filter(g=>g.s==='block');
  for(const p of this.pl)if(p.spellCd>0)p.spellCd--;this.stepTriggers();this.stepRules();this.stepTraps();this.stepMobs();this.stepNests();this.stepMood();this.stepWild();
  for(const g of this.gobs)if(g.s!=='dead')this.tickGob(g);
  for(let i=this.ents.length-1;i>=0;i--)if(this.tickEnt(this.ents[i])===false)this.ents.splice(i,1);
  if(this.vs)for(const p of this.pl)if(this.tick%(p.race==='goblin'?160:200)===0)p.grog=Math.min(9,p.grog+1);
  for(const p of this.pl)if(p.bot){this.runPlan(p);if(this.vs&&p.cpu)this.cpuTrick(p);}
  this.endCheck();}
 endCheck(){const left=this.hatches.reduce((a,h)=>a+h.left,0),live=this.gobs.filter(g=>this.alive(g)),goal=this.def.goal;
  if(goal&&goal!=='home'&&!this.vs&&this.isClear()&&(goal==='clear'||this.pl[0].saved>=this.need)){this.won=1;this.finish();return;}
  if(left===0&&live.length&&live.every(g=>g.s==='block'||g.s==='gun'||g.fuse>0)){if(++this.lazy===60)this.fuseAll();}else this.lazy=0;
  if((left===0&&!live.length)||this.time<=0)this.finish();}
 finish(){if(this.over)return;this.over=true;for(const g of this.gobs)if(this.alive(g)){this.pl[g.team].lost++;}}
 fuseAll(){for(const h of this.hatches)h.left=0;let i=0;for(const g of this.gobs)if(this.alive(g)&&!g.fuse){g.fuse=8+i;i+=3;}}
 tickGob(g){const T=this.T;g.px=g.x;g.py=g.y;g.t++;if(g.panic>0)g.panic--;
  if(g.s==='held')return;if(g.s==='home'){if(g.t>14)g.s='dead';return;}if(g.s==='splat'||g.s==='drown'){if(g.t>22)g.s='dead';return;}
  if(g.s==='burn'){if(g.t>38||g.y>=T.h+6){g.s='dead';if(!this.quiet)for(let i=0;i<8;i++)this.p(g.x,g.y-4,(Math.random()-.5)*40,-Math.random()*50,'#2d2d2f',24);return;}if(g.t%11===10)g.dir=-g.dir;if(!T.solid(g.x,g.y))g.y+=3;else{const nx=g.x+g.dir*2;if(T.solid(nx,g.y-6))g.dir=-g.dir;else{g.x=nx;let u=0;while(u<12&&T.solid(g.x,g.y-1)){g.y--;u++;}}}if(!this.quiet)this.p(g.x,g.y-10,(Math.random()-.5)*20,-30,['#db9016','#b64c1e','#b5a64b'][Math.random()*3|0],14);return;}
  if(g.ward>0)g.ward--;if(g.zz>0){g.zz--;if(T.solid(g.x,g.y)||T.solid(g.x,g.y+1))return;}if(g.daze>0){g.daze--;if(g.daze%25===0&&g.s==='walk')g.dir=-g.dir;}if(g.hypno>0){g.hypno--;if(g.hypno%20===0&&g.s==='walk'){const d=this.doors.find(a=>a.team===g.hypBy);if(d)g.dir=d.x>g.x?1:-1;}}
  if(g.fuse>0&&g.s!=='ohno'){g.fuse--;if(g.fuse===0){if(T.solid(g.x,g.y)||T.solid(g.x,g.y+1))this.setS(g,'ohno');else return this.explode(g);}}
  {const sf=this.surf(g.x,g.y);if((g.y>=sf.y+3&&g.s!=='fling'||g.y>=sf.y+6)&&!(g.race==='bone'&&!sf.lava)){if(this.swims(g,sf.lava)){if(g.s!=='swim'){g.s='swim';g.t=0;this.snd('drown');}}else{const dt=THEME[this.def.theme].haz[0];this.setS(g,'drown');this.pl[g.team].lost++;this.snd('drown');this.deathFx(g,'drown');for(let i=0;i<5;i++)this.p(g.x,sf.y,(Math.random()-.5)*40,-40-Math.random()*50,dt,20);return;}}}
  if(g.race==='swamp'&&THEME[this.def.theme].hot&&g.s!=='swim'){g.dry++;if(g.dry>=750*(this.pl[g.team].perk.dry||1)){this.kill(g);this.float(g.x,g.y-18,'DRIED OUT','#f0d16b');return;}}
  if(g.race==='fairy'&&g.s==='walk'){if(T.iron(g.x,g.y)||T.iron(g.x,g.y+1)){g.dry++;if(g.dry>=120){this.kill(g,'fire');this.float(g.x,g.y-18,'ZAPPED','#f0d16b');return;}}else g.dry=0;}
  if(g.y>=T.h+6){g.s='dead';this.pl[g.team].lost++;return;}
  switch(g.s){
  case'walk':this.walk(g);break;
  case'fall':this.fall(g);break;
  case'swim':{const sf=this.surf(g.x,g.y);if(g.race==='swamp'&&!sf.lava)g.dry=0;if(sf.y>T.h){g.fallen=0;this.setS(g,'fall');break;}g.y=sf.y+3;if(g.t&1)break;const nx=g.x+g.dir;if(T.solid(nx,g.y)){let up=0;while(up<12&&T.solid(nx,g.y-1-up))up++;if(up<11){g.x=nx;g.y-=up+0;if(up>3||T.solid(nx,g.y)&&g.y<sf.y+3)this.setS(g,'walk');}else g.dir=-g.dir;}else{g.x=nx;if(this.surf(nx,g.y).y>T.h){g.fallen=0;this.setS(g,'fall');}}break;}
  case'tongue':if(g.t===5)this.doTongue(g);if(g.t>=12)this.setS(g,'walk');break;
  case'fling':{g.vy+=this.rule.lowg?.16:this.rule.highg?.5:.32;g.fx+=g.vx;g.fy+=g.vy;const nx=Math.round(g.fx),ny=Math.round(g.fy);if(T.solid(nx,ny-6)){g.fallen=0;this.setS(g,'fall');break;}g.x=nx;g.y=ny;if(g.vy>0&&T.solid(g.x,g.y)){while(T.solid(g.x,g.y-1)&&g.y>0)g.y--;this.setS(g,'walk');}if(g.x<2||g.x>T.w-3){g.dir=-g.dir;g.fallen=0;this.setS(g,'fall');}break;}
  case'float':if(T.solid(g.x,g.y)){this.setS(g,'walk');break;}if(g.race==='fairy'&&g.t<46&&!T.solid(g.x+g.dir,g.y-4)){g.x+=g.dir;if(this.gustDir&&!T.solid(g.x+this.gustDir,g.y-4))g.x+=this.gustDir;break;}if(this.gustDir&&!T.solid(g.x+this.gustDir,g.y-4))g.x+=this.gustDir;if(this.rule.wind&&!T.solid(g.x+1,g.y-4))g.x++;for(let i=0;i<(g.t&1?2:1);i++){if(T.solid(g.x,g.y))break;g.y++;}break;
  case'climb':{if(g.t&1)break;if(T.solid(g.x,g.y-16)||g.y<(T.open?2:20)){g.dir=-g.dir;g.x+=g.dir;g.fallen=0;this.setS(g,'fall');break;}g.y--;if(!T.solid(g.x+g.dir,g.y-1)&&!T.solid(g.x+g.dir,g.y)){this.setS(g,'hoist');}break;}
  case'hoist':if(g.t>=6){g.x+=g.dir*3;while(T.solid(g.x,g.y-1)&&g.y>0)g.y--;this.setS(g,T.solid(g.x,g.y)?'walk':'fall');g.fallen=0;}break;
  case'dig':this.dig(g);break;case'bash':this.bash(g);break;case'pick':this.pick(g);break;case'build':this.build(g);break;
  case'block':if(!T.solid(g.x,g.y)&&!T.solid(g.x,g.y+1)&&!T.solid(g.x,g.y+2)){g.fallen=0;this.setS(g,'fall');}break;
  case'shrug':if(g.t>=12)this.setS(g,'walk');break;
  case'fly':{if(g.t>=g.flyT||T.solid(g.x,g.y-16)){g.fallen=0;this.setS(g,'fall');break;}g.y-=g.flyS;if(g.flyX&&!T.solid(g.x+g.flyX,g.y-5))g.x+=g.flyX;if(!this.quiet&&g.flyS>1)this.p(g.x,g.y,(Math.random()-.5)*20,30,'#8393a7',12);break;}
  case'gun':{if(!T.solid(g.x,g.y)&&!T.solid(g.x,g.y+1)&&!T.solid(g.x,g.y+2)){g.fallen=0;this.setS(g,'fall');break;}if(g.cd>0){g.cd--;break;}for(const o of this.gobs)if(o!==g&&o.team===g.team&&o.s==='walk'&&Math.abs(o.x-g.x)<=8&&Math.abs(o.y-g.y)<=8){o.s='fling';o.t=0;o.fx=g.x+g.dir*8;o.fy=g.y-10;o.x=g.x+g.dir*8;o.y=g.y-10;o.dir=g.dir;o.vx=g.dir*5.2;o.vy=-5.4;o.fallen=0;g.cd=8;g.shots++;this.snd('boom');this.shake=1;if(g.shots>=24)this.setS(g,'walk');break;}break;}
  case'grow':{if(g.t%8!==7)break;const d=g.dir,x=g.vx0+d*(5+g.steps*4),y=g.vy0-(g.steps+1)*5;if(T.solid(d>0?x+6:x-6,y-8)||g.steps>=18||y<4){this.setS(g,'walk');break;}T.plank(d>0?x:x-3,y,4,5,g.team,'vine');g.steps++;this.snd('build');break;}
  case'sit':if(!T.solid(g.x,g.y)&&!T.solid(g.x,g.y+1)&&!T.solid(g.x,g.y+2)){g.fallen=0;this.setS(g,'fall');}break;
  case'fight':{const t=g.tg,mob=t&&t.max===undefined;if(!t||t.dead||(mob&&Math.abs(t.x-g.x)>12)||(!T.solid(g.x,g.y)&&!T.solid(g.x,g.y+1)&&!T.solid(g.x,g.y+2))){this.setS(g,'walk');break;}if(mob)t.hold=3;if(g.t%14===7){if(mob)this.hurtFoe(t,g.big?2:1);else this.hurtNest(t,g.big?2:1);if(t.dead)this.talk(g,'hurrah');}break;}
  case'shoot':{const t=g.tg;if(!t||t.dead||Math.abs(t.x-g.x)>150||!this.clearLine(g.x,t.x,g.y-8)||(!T.solid(g.x,g.y)&&!T.solid(g.x,g.y+1)&&!T.solid(g.x,g.y+2))){this.setS(g,'walk');break;}if(g.t%30===10){this.ents.push({k:'arrow',x:g.x+g.dir*6,y:g.y-8,vx:g.dir*5,team:g.team,l:40});this.snd('door');}break;}
  case'ohno':if(g.t>=12)this.explode(g);break;}
  if(g.s==='walk'||g.s==='fall'||g.s==='float'||g.s==='fling'||g.s==='fly')this.touch(g);}
 touch(g){for(const d of this.doors)if(d.rw?Math.abs(g.x-d.x)<=d.rw/2&&g.y>=d.ry&&g.y<=d.ry+d.rh:Math.abs(g.x-d.x)<=3&&g.y>=d.y-10&&g.y<=d.y+1){this.setS(g,'home');g.y=d.y;const P=this.pl[d.team];P.saved++;if(g.inside){P.saved+=g.inside.length;for(const a of g.inside)a.s='dead';g.inside=null;g.big=0;}if(this.vs){P.grog=Math.min(9,P.grog+1);if(g.team!==d.team){P.stolen++;this.float(g.x,g.y-20,'STOLEN!',CLAN[d.team].ui);}else this.float(g.x,g.y-20,'+1',CLAN[d.team].ui);}this.snd('home');return;}
  for(const e of this.ents)if(e.k==='mimic'&&g.team!==e.team&&Math.abs(g.x-e.x)<=5&&Math.abs(g.y-e.y)<=10){e.ate++;e.bite=8;g.s='dead';this.pl[g.team].lost++;this.pl[e.team].grog=Math.min(9,this.pl[e.team].grog+1);this.float(e.x,e.y-30,'CHOMP',CLAN[e.team].ui);this.snd('chomp');return;}}
 walk(g){const T=this.T;let sp=g.panic>0?2:1;if(g.race==='rat')sp=2;if((g.armed||g.bow)&&this.engage(g))return;if(g.big&&(g.t&1))return;if(g.race==='dwarf'&&g.t%4===3)return;if(g.race==='shroom'&&THEME[this.def.theme].hot&&g.t%3===2)return;
  if(g.race==='fairy'&&this.gustDir&&g.t&1&&!(this.pl[g.team].perk.calm&&g.t%10===1)){const nx=g.x+this.gustDir;if(!T.solid(nx,g.y-4)&&nx>1&&nx<T.w-2)g.x=nx;}
  for(let i=0;i<sp;i++){g.x+=g.dir;if(this.nests.length&&this.nestAt(g.x,g.y)){g.x-=g.dir;g.dir=-g.dir;return;}const mu=this.maxUp;let up=0;while(up<mu+1&&T.solid(g.x,g.y-1-up))up++;
   if(up>=mu&&g.race==='rat'&&T.m[(g.y-5)*T.w+g.x]===3){for(let j=g.y-16;j<g.y;j++)for(let i=g.x-1;i<g.x+g.dir*10;i+=g.dir){if(i>=0&&j>=0&&i<T.w&&j<T.h&&T.m[j*T.w+i]===3)T.m[j*T.w+i]=0;}T.mark(Math.min(g.x,g.x+g.dir*10)-2,g.y-17,14,18);this.snd('dig');g.x-=g.dir;return;}
   if(up>=mu){g.x-=g.dir;if(g.climber&&g.y>(T.open?4:24)){this.setS(g,'climb');}else g.dir=-g.dir;return;}
   g.y-=up;
   if(!up){let d=0;while(d<6&&!T.solid(g.x,g.y+d))d++;if(d>=6){if(g.race==='fairy'){g.fallen=0;this.setS(g,'float');return;}g.y+=3;g.fallen=3;this.setS(g,'fall');return;}g.y+=d;}
   for(const b of this.blockers)if(b!==g&&Math.abs(g.x-b.x)<=6&&g.y>b.y-13&&g.y<=b.y+6&&((g.dir>0&&g.x<b.x)||(g.dir<0&&g.x>b.x))){g.dir=-g.dir;break;}}}
 fall(g){const T=this.T,lo=this.rule.lowg,sp=lo?(g.t&1?2:1):this.rule.highg?4:3,lim=lo?1e9:this.rule.highg?70:this.fallMax;if(this.rule.wind&&g.t&1&&!T.solid(g.x+1,g.y-4))g.x++;for(let i=0;i<sp;i++){if(T.solid(g.x,g.y)){if(g.fallen>lim&&!g.flap){this.splat(g);this.deathFx(g,'fall');return;}g.fallen=0;this.setS(g,'walk');return;}g.y++;g.fallen++;}
  if(g.flap&&g.fallen>14)this.setS(g,'float');}
 splat(g){if(g.inside){for(const a of g.inside){a.s='dead';this.pl[g.team].lost++;a.x=g.x+(a.id%5-2)*8;a.y=g.y;this.leavePile(a);}g.inside=null;g.big=0;}this.setS(g,'splat');this.pl[g.team].lost++;this.leavePile(g);if(g.race==='shroom'&&this.traps.filter(t=>t.cap).length<6&&this.T.solid(g.x,g.y)){let y=g.y;while(y>0&&this.T.solid(g.x,y-1))y--;this.traps.push({k:'spring',x:g.x,y,cap:1,pow:6,cd:0,live:1,off:0});}this.snd('splat');const c=CLAN[g.team];for(let i=0;i<8;i++)this.p(g.x,g.y-2,(Math.random()-.5)*70,-Math.random()*70,c.skin,18);}
 ground(g){const T=this.T,um=this.maxUp-3;let u=0;while(u<um&&T.solid(g.x,g.y-1)){g.y--;u++;}if(T.solid(g.x,g.y))return true;let d=0;while(d<5&&!T.solid(g.x,g.y+d))d++;if(d>=5){g.fallen=0;this.setS(g,'fall');return false;}g.y+=d;return true;}
 dig(g){const T=this.T,dw=g.race==='dwarf';if(g.t%6!==3)return;if(!dw&&T.hasIron(g.x-2,g.y,5,3)){this.snd('clank');this.setS(g,'shrug');return;}
  T.drill=dw;T.carve(g.x-6,g.y,13,2);T.drill=false;g.y+=2;this.dust(g.x,g.y-2,3,.8);this.snd('dig');
  if(!T.solid(g.x,g.y)&&!T.solid(g.x,g.y+1)&&!T.solid(g.x,g.y+2)){g.fallen=0;this.setS(g,'fall');}}
 bash(g){const T=this.T,d=g.dir;if(!T.solid(g.x,g.y)&&!T.solid(g.x,g.y+1)&&!T.solid(g.x,g.y+2)){g.fallen=0;return this.setS(g,'fall');}
  if(g.t%8!==5)return;if(g.race!=='dwarf'&&T.hard(d>0?g.x+1:g.x-9,g.y-14,9,13,d)){this.snd('clank');g.dir=-d;return this.setS(g,'walk');}
  const n=T.count(d>0?g.x+1:g.x-18,g.y-14,18,13);if(n<5)return this.setS(g,'walk');
  T.way=d;T.drill=g.race==='dwarf';T.carveEll(g.x+d*4,g.y-7,10,8.5,g.y-1);T.way=0;T.drill=false;this.dust(g.x+d*8,g.y-6,5);this.snd('bash');g.x+=d*3;this.ground(g);}
 pick(g){const T=this.T,d=g.dir;if(g.t%10!==7){if(!T.solid(g.x,g.y)&&!T.solid(g.x,g.y+1)&&!T.solid(g.x,g.y+2)){g.fallen=0;this.setS(g,'fall');}return;}
  if(g.race!=='dwarf'&&T.hard(d>0?g.x+1:g.x-8,g.y-6,8,10,d*2)){this.snd('clank');g.dir=-d;return this.setS(g,'walk');}
  T.way=d*2;T.drill=g.race==='dwarf';T.carveEll(g.x+d*4,g.y-5,9,9,g.y+1);T.way=0;T.drill=false;this.dust(g.x+d*6,g.y,4);this.snd('pick');g.x+=d*3;g.y+=2;
  let dn=0;while(dn<6&&!T.solid(g.x,g.y+dn))dn++;if(dn>=6){g.fallen=0;return this.setS(g,'fall');}g.y+=dn;}
 build(g){const T=this.T,d=g.dir;if(g.t%10!==7)return;
  for(let h=3;h<=13;h++)if(T.solid(g.x+d*5,g.y-h)){g.dir=-d;return this.setS(g,'walk');}
  T.plank(d>0?g.x+1:g.x-9,g.y-2,9,2,g.team,g.boneB);this.snd('build');g.bricks--;g.x+=d*4;g.y-=2;
  if(g.bricks<=3&&g.bricks>0)this.float(g.x,g.y-20,String(g.bricks),'#fff');if(g.bricks<=0)this.setS(g,'shrug');}
 explode(g){const T=this.T,x=g.x,y=g.y-6;T.carveEll(x,y,20,20);this.deathFx(g,'boom');this.leavePile(g);if(g.s!=='home'){this.pl[g.team].lost++;}g.s='dead';this.snd('boom');this.shake=8;
  if(!this.quiet){const R=Math.random;for(let i=0;i<46;i++){const a=R()*TAU,s=30+R()*150;this.p(x,y,Math.cos(a)*s,Math.sin(a)*s-30,['#b5a64b','#db9016','#b64c1e','#534842',T.theme.ramp[4]][R()*5|0],16+R()*22);}this.ents.push({k:'ring',x,y,r:2,l:12});}
  if(this.vs||this.fightMap)this.crush(x,y,17,g.team);if(this.fightMap)for(const n of this.nests)if(!n.dead&&Math.hypot(n.x-x,n.y-10-y)<34)this.hurtNest(n,4);}
 crush(x,y,r,team){for(const m of this.mobs)if(!m.dead&&Math.hypot(m.x-x,m.y-6-y)<r)this.hurtFoe(m,3);for(const o of this.gobs)if(this.alive(o)&&o.team!==team&&Math.hypot(o.x-x,o.y-6-y)<r){this.splat(o);}}
 canAssign(g,sk,pl){if(!this.alive(g)||g.s==='ohno'||g.team!==pl.id||g.big)return false;if(g.s==='sit')return sk==='boom'&&!g.fuse;
  const tool=TOOLS.includes(g.s)&&!g.panic;
  switch(sk){case'climb':return!g.climber;case'flap':return!g.flap;case'boom':return!g.fuse;case'sword':case'bow':return!g.armed&&!g.bow;case'merge':return g.s==='walk';case'raise':return true;case'dust':case'puff':return true;
   case'block':return tool&&this.T.solid(g.x,g.y);default:return tool&&g.s!==sk;}}
 assign(g,sk,pl){if(pl.skills[sk]<=0||!this.canAssign(g,sk,pl))return false;if(g.s!=='sit'&&this.defy(g,pl))return false;
  if(sk==='raise'||sk==='bonebr'){const q=this.nearPile(g,sk==='raise'?36:70,pl.id);if(!q){this.float(g.x,g.y-22,'NO BONES','#f0d16b');this.snd('deny');return false;}this.takePile(q);if(sk==='raise'){pl.lost=Math.max(0,pl.lost-1);this.spawn({x:q.x,y:q.y-10,team:g.team,dir:g.dir}).raised=1;this.float(q.x,q.y-20,'RISE','#96927f');this.snd('hex');}else g.boneB=1;}
  {const cost={spring:1,ratmine:2}[sk];if(cost){if(pl.scrap<cost){this.float(g.x,g.y-22,'NO SCRAP','#f0d16b');this.snd('deny');return false;}pl.scrap-=cost;}}
  if(sk==='merge'){const near=this.gobs.filter(a=>a!==g&&a.team===g.team&&a.s==='walk'&&!a.armed&&!a.bow&&Math.hypot(a.x-g.x,a.y-g.y)<=60).sort((a,b)=>Math.hypot(a.x-g.x,a.y-g.y)-Math.hypot(b.x-g.x,b.y-g.y)).slice(0,3);if(near.length<3){this.float(g.x,g.y-22,'NEED 4','#f0d16b');this.snd('deny');return false;}for(const a of near)a.s='held';g.inside=near;g.big=1;g.armed=1;g.hp=4+(pl.perk.bighp||0);this.float(g.x,g.y-30,'CONSTRUCT!','#96927f');this.snd('hex');}this.log.push({x:g.x,y:g.y,d:g.dir,s:sk,st:g.s,tk:this.tick,team:pl.id});pl.skills[sk]--;
  switch(sk){case'climb':g.climber=1;break;case'flap':g.flap=1;break;case'boom':g.fuse=125;break;case'block':this.setS(g,'block');break;case'build':g.bricks=12;this.setS(g,'build');break;
   case'glide':g.flyT=74;g.flyS=1;g.flyX=g.dir;this.setS(g,'fly');break;case'steam':g.flyT=50;g.flyS=2;g.flyX=g.dir;this.setS(g,'fly');this.snd('stink');break;case'cannon':g.shots=0;g.cd=0;this.setS(g,'gun');break;
   case'spring':{const bad=this.rnd()<1/6;g.s='fling';g.t=0;g.fx=g.x;g.fy=g.y-1;g.vx=(bad?-g.dir:g.dir)*3.4;g.vy=-6.2;g.fallen=0;if(bad)this.float(g.x,g.y-22,'OOPS','#eb6f39');this.snd('door');break;}
   case'ratmine':{const bad=this.rnd()<1/6;this.ents.push({k:'rmine',x:g.x+(bad?0:g.dir*8),y:g.y,t:bad?12:75,team:g.team});if(bad)this.float(g.x,g.y-22,'OOPS','#eb6f39');break;}
   case'dust':case'puff':{const r=sk==='dust'?64:56;for(const m of this.mobs)if(!m.dead&&Math.hypot(m.x-g.x,m.y-g.y)<r)m.sleep=sk==='dust'?250:125;if(sk==='puff'){pl.mood=Math.min(100,pl.mood+10);for(const o of this.gobs)if(o.team===g.team&&o.s==='sit'&&Math.hypot(o.x-g.x,o.y-g.y)<80)this.setS(o,'walk');}this.ents.push({k:'cloud',x:g.x,y:g.y-10,l:30,team:g.team,col:sk});this.setS(g,'shrug');this.snd('hex');break;}
   case'vine':g.vx0=g.x;g.vy0=g.y;g.steps=0;this.setS(g,'grow');break;
   case'raise':break;case'merge':break;case'bonebr':g.bricks=12;this.setS(g,'build');break;case'sword':g.armed=1;g.hp=2;break;case'bow':g.bow=1;break;case'tongue':this.setS(g,'tongue');break;case'spear':this.doSpear(g);break;
   case'hop':{const q=pl.perk.hop||1;g.s='fling';g.t=0;g.fx=g.x;g.fy=g.y-1;g.vx=g.dir*3.2*q;g.vy=-4.2;g.fallen=0;this.snd('door');break;}
   case'firepot':this.ents.push({k:'pot',x:g.x+g.dir*4,y:g.y-10,vx:g.dir*4.4,vy:-1.6,team:g.team});this.setS(g,'shrug');this.snd('door');break;
   default:this.setS(g,sk);}
  this.snd('assign');return true;}
 trick(pl,i,x,y){if(pl.grog<TRC[i])return false;const R=this.pl[1-pl.id].id;
  switch(TR[i]){
  case'boulder':this.ents.push({k:'boulder',x,y:Math.max(-20,y-90),vx:(pl.id?-1:1)*.8,vy:1,team:pl.id,b:2,a:0});this.snd('door');break;
  case'stink':{this.ents.push({k:'cloud',x,y,l:50,team:pl.id});this.snd('stink');let n=0;for(const g of this.gobs)if(this.alive(g)&&g.team===R&&Math.hypot(g.x-x,g.y-6-y)<46){n++;g.panic=110;if(TOOLS.includes(g.s)||g.s==='block'){if(g.s!=='walk')this.setS(g,'walk');g.dir=-g.dir;}else g.dir=-g.dir;}break;}
  case'hex':{const c=this.gobs.filter(g=>this.alive(g)&&g.team===R&&Math.hypot(g.x-x,g.y-6-y)<32).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y)).slice(0,3);if(!c.length)return false;for(const g of c){g.team=pl.id;g.dir=-g.dir;for(let k=0;k<10;k++)this.p(g.x,g.y-8,(Math.random()-.5)*60,-Math.random()*60,'#505e9b',18);this.float(g.x,g.y-22,'HEXED',CLAN[pl.id].ui);}this.snd('hex');break;}
  case'mimic':{let yy=clamp(y,0,this.T.h-1);if(this.T.solid(x,yy))while(yy>0&&this.T.solid(x,yy-1))yy--;else while(yy<this.T.h&&!this.T.solid(x,yy))yy++;if(yy>=this.T.h)return false;this.ents.push({k:'mimic',x,y:yy,team:pl.id,l:300,ate:0,bite:0});this.snd('door');break;}}
  pl.grog-=TRC[i];return true;}
 cast(p,k,x,y){const S=SPELLS[k];if(!S||this.over||p.spellCd>0||!p.spells.includes(k))return false;const vs=this.vs,have=vs?p.grog:p.mana,cost=vs?S.vc:S.c;if(have<cost)return false;const near=o=>Math.hypot(o.x-x,o.y-6-y)<=S.r,foes=this.gobs.filter(g=>this.alive(g)&&g.team!==p.id&&near(g)),mine=this.gobs.filter(g=>this.alive(g)&&g.team===p.id&&near(g)),mobs=this.mobs.filter(m=>!m.dead&&near(m));
  if(k==='sleep'){for(const g of foes)g.zz=200;for(const m of mobs)m.sleep=250;}else if(k==='confuse'){for(const g of foes)g.daze=200;for(const m of mobs)if(m.kind!=='spider')m.daze=200;}else if(k==='hypno'){for(const g of foes){g.hypno=250;g.hypBy=p.id;}for(const m of mobs)if(m.kind!=='spider')m.charm=250;}else if(k==='ward'){for(const g of mine)g.ward=300;}else if(k==='rally'){p.mood=Math.min(100,p.mood+35);for(const g of mine)if(g.s==='sit')this.setS(g,'walk');}
  if(vs)p.grog-=cost;else p.mana-=cost;p.spellCd=vs?500:250;this.ents.push({k:'ring',x,y:y-6,r:8,l:16});this.float(x,y-14,S.n+'!',S.col);this.snd('select');if(this.onSpend)this.onSpend(p);return true;}
 tickEnt(e){const T=this.T;
  if(e.k==='ring'){e.r+=3;return--e.l>0;}
  if(e.k==='tongueFx')return--e.l>0;
  if(e.k==='rmine'){if(--e.t>0)return true;T.carveEll(e.x,e.y-6,26,22,e.y-1);for(const g of this.gobs)if(this.alive(g)&&Math.hypot(g.x-e.x,g.y-6-e.y+6)<20)this.kill(g,'boom');for(const m of this.mobs)if(!m.dead&&Math.hypot(m.x-e.x,m.y-e.y)<30)this.hurtFoe(m,4);for(const n of this.nests)if(!n.dead&&Math.hypot(n.x-e.x,n.y-e.y)<38)this.hurtNest(n,5);this.boomFx(e.x,e.y-6);this.snd('boom');this.shake=7;return false;}
  if(e.k==='meteor'){if(e.wait>0){e.wait--;return true;}e.vy=Math.min((e.vy||3)+.5,9);e.y+=e.vy;e.x+=1.4;if(e.y<e.ty)return true;const x=e.tx,y=e.ty;if(y<T.h){T.carveEll(x,y,24,20);this.dust(x,y,18,1.5);}for(const g of this.gobs)if(this.alive(g)&&Math.hypot(g.x-x,g.y-y)<27)this.kill(g,'boom');for(const m of this.mobs)if(!m.dead&&Math.hypot(m.x-x,m.y-y)<27)this.hurtFoe(m,3);for(const n of this.nests)if(!n.dead&&Math.hypot(n.x-x,n.y-y)<34)this.hurtNest(n,3);this.boomFx(x,y-6);this.snd('boom');this.shake=8;return false;}
  if(e.k==='swoop'){e.t++;const g=e.g;
   if(e.ph===0){e.x+=e.d*3;e.y=Math.min(e.y+.6,20);if(e.t>50){if(g&&this.alive(g)&&g.s!=='home'&&this.openSky(g.x,g.y))e.ph=1;else{e.ph=2;e.g=null;}}return true;}
   if(e.ph===1){if(!this.alive(g)||g.s==='home'){e.ph=2;e.g=null;return true;}const dx=g.x-e.x,dy=g.y-12-e.y,l=Math.hypot(dx,dy);if(l<8){e.ph=2;if(g.ward>0||g.big)this.kill(g,'jaws');else{e.c=CLAN[g.team];this.pl[g.team].lost++;g.s='dead';this.float(g.x,g.y-18,'SNATCHED','#eb6f39');this.snd('splat');}e.g=null;return true;}e.x+=dx/l*6;e.y+=dy/l*6;if(e.t>260)e.ph=2;return true;}
   e.x+=e.d*4;e.y-=3;return e.y>-60;}
  if(e.k==='say'){if(e.g.s==='dead')e.g={...e.g,s:'gone'};return--e.l>0;}
  if(e.k==='ghost'){e.t++;e.y-=.7;e.x=e.x0+Math.sin(e.t*.18)*5;return--e.l>0;}
  if(e.k==='hat'||e.k==='boots'){if(e.vx||e.vy){e.vy+=.28;e.x+=e.vx;e.y+=e.vy;if(e.vy>0&&T.solid(e.x|0,e.y|0)){e.vx=0;e.vy=0;}}return--e.l>0;}
  if(e.k==='arrow'){if(--e.l<=0)return false;for(let i=0;i<2;i++){e.x+=e.vx/2;const x=e.x|0,y=e.y|0;if(T.solid(x,y))return false;if(e.team<0){for(const g of this.gobs)if(this.alive(g)&&g.s!=='home'&&Math.abs(g.x-x)<=4&&y>=g.y-15&&y<=g.y){if(g.s==='block')return false;this.hurtGob(g);return false;}}else{for(const m of this.mobs)if(!m.dead&&Math.abs(m.x-x)<=6&&y>=m.y-(m.kind==='golem'?24:16)&&y<=m.y+1){this.hurtFoe(m,1);return false;}for(const n of this.nests)if(!n.dead&&Math.abs(n.x-x)<=14&&y>=n.y-26&&y<=n.y+1){this.hurtNest(n,1);return false;}}}return true;}
  if(e.k==='pot'){e.vy+=.22;e.x+=e.vx;e.y+=e.vy;this.p(e.x,e.y,0,-10,'#db9016',8,.1);if(T.solid(e.x|0,e.y|0)||e.y>T.h||this.mobs.some(m=>!m.dead&&Math.hypot(m.x-e.x,m.y-5-e.y)<9)){if(e.y<T.h)this.potBurst(e);return false;}return true;}
  if(e.k==='cloud'){if(!this.quiet&&e.l%2===0)for(let i=0;i<2;i++){const a=Math.random()*TAU,r=Math.random()*40;this.p(e.x+Math.cos(a)*r,e.y+Math.sin(a)*r*.6,0,-14,['#777d45','#565a37','#999c50'][i],30,.1);}return--e.l>0;}
  if(e.k==='mimic'){if(e.bite>0)e.bite--;if(e.l%6===0)this.p(e.x,e.y-18,0,-10,'#e82917',14,.1);return--e.l>0&&e.ate<10;}
  if(e.k==='boulder'){e.vy=Math.min(e.vy+.7,7);e.a+=.4;const st=Math.ceil(e.vy);for(let i=0;i<st;i++){e.y+=e.vy/st;e.x+=e.vx/st;
    if(T.solid(e.x|0,(e.y|0)+7)&&e.y>0){const ir=T.iron(e.x|0,(e.y|0)+8);T.carveEll(e.x,e.y+3,13,11);this.crush(e.x,e.y,15,e.team);this.dust(e.x,e.y+6,16,1.4);this.shake=5;this.snd('rock');e.b--;if(e.b<0||ir)return false;e.vy=-3.2;e.vx*=1.3;break;}}
   for(const o of this.gobs)if(this.alive(o)&&o.team!==e.team&&Math.hypot(o.x-e.x,o.y-6-e.y)<9)this.splat(o);return e.y<T.h+30;}
  return true;}
 mx(p,x){return p.id===1&&!this.def.free2p?this.def.w-1-x:x;}
 // scripted player: used by the CPU rival and by the level tests
 runPlan(p){const plan=p.bot;for(let i=0;i<plan.length;i++){const s=plan[i],done=p.planDone[i]||0;if(done>=(s.n||1)||this.tick<(s.wait||0))continue;if(this.def.free2p&&s.team!==undefined&&s.team!==p.id)continue;
   if(s.needs!==undefined&&(p.planDone[s.needs]||0)<1)continue;
   const sx=s.x===undefined?null:this.mx(p,s.x),dr=s.d?(p.id&&!this.def.free2p?-s.d:s.d):0;
   for(const g of this.gobs){if(g.team!==p.id)continue;if(s.st?g.s!==s.st:g.s!=='walk')continue;if(sx!==null&&Math.abs(g.x-sx)>(s.tol===undefined?1:s.tol))continue;if(dr&&g.dir!==dr)continue;if(s.y!==undefined&&Math.abs(g.y-s.y)>(s.ytol||30))continue;if(s.rat&&!this.mobs.some(m=>!m.dead&&!m.sleep&&Math.abs(m.y-g.y)<=12&&(m.x-g.x)*g.dir>s.rat&&(m.x-g.x)*g.dir<(s.reach||88)))continue;
    if(this.assign(g,s.s,p)){p.planDone[i]=done+1;p.tx=g.x;p.ty=g.y;break;}}}}
 cpuTrick(p){if(--p.cool>0)return;p.cool=110+(Math.random()*120|0);const foes=this.gobs.filter(g=>this.alive(g)&&g.team!==p.id&&g.s!=='fall');if(!foes.length)return;
  const g=foes[Math.random()*foes.length|0],c=p.grog>=3&&Math.random()<.35?3:p.grog>=2&&Math.random()<.6?(Math.random()<.5?0:2):1;
  const ahead=g.x+g.dir*26;if(this.trick(p,c,c===3?ahead:g.x,g.y-6)){p.tx=g.x;p.ty=g.y;}}
}
