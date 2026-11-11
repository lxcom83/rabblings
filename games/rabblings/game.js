// ---------- settings ----------
const SAVE={mana:{},spellPick:['sleep','ward'],cleared:{},scan:1,music:1,sfx:1,classic:0,lock:{},diff:1,scores:{},packs:{},author:''};
try{Object.assign(SAVE,JSON.parse(localStorage.getItem('goblin-scramble')||'{}'));}catch(e){}
if(Array.isArray(SAVE.ctl))SAVE.ctl.slice(0,2).forEach((v,i)=>{if(typeof v==='string'&&CTL_NAMES[v])CTL[i]=v;});
const LAYOUTS=[{n:'CLASSIC',h:46},{n:'COMPACT',h:40},{n:'TOUCH',h:66}];
const uiLayout=()=>{const v=SAVE.ui;if(v===0||v===1||v===2)return v;try{return matchMedia('(pointer:coarse)').matches?2:0;}catch(e){return 0;}};
function rrect(C,x,y,w,h,r,fill,stroke){C.beginPath();if(C.roundRect)C.roundRect(x+.5,y+.5,w-1,h-1,r);else C.rect(x+.5,y+.5,w-1,h-1);if(fill){C.fillStyle=fill;C.fill();}if(stroke){C.strokeStyle=stroke;C.lineWidth=1;C.stroke();}}
// rewind keeps copies of the world; plain data is copied, pictures and functions are shared
function dcl(o,seen){if(o===null||typeof o!=='object')return o;if(seen.has(o))return seen.get(o);if(ArrayBuffer.isView(o)){const c=o.slice();seen.set(o,c);return c;}
 if((typeof Node!=='undefined'&&o instanceof Node)||(typeof ImageData!=='undefined'&&o instanceof ImageData)||(typeof ImageBitmap!=='undefined'&&o instanceof ImageBitmap)||(typeof CanvasRenderingContext2D!=='undefined'&&o instanceof CanvasRenderingContext2D))return o;
 if(o instanceof Map){const c=new Map();seen.set(o,c);o.forEach((v,k)=>c.set(k,dcl(v,seen)));return c;}if(o instanceof Set){const c=new Set();seen.set(o,c);o.forEach(v=>c.add(dcl(v,seen)));return c;}
 if(Array.isArray(o)){const c=new Array(o.length);seen.set(o,c);for(let i=0;i<o.length;i++)c[i]=dcl(o[i],seen);return c;}
 const c=Object.create(Object.getPrototypeOf(o));seen.set(o,c);for(const k of Object.keys(o)){const v=o[k];c[k]=typeof v==='function'?v:dcl(v,seen);}return c;}
const CTL_HELP={auto:['WASD  F/H PICK  G USE  T TRICKS + SPELLS','ARROWS  J/L PICK  K USE  I TRICKS + SPELLS'],mk:'MOUSE + WASD  F/H PICK  G USE  T TRICKS',kbA:'WASD  F/H PICK  G USE  T TRICKS + SPELLS',kbB:'ARROWS  J/L PICK  K USE  I TRICKS + SPELLS',touch:'TOUCH YOUR SIDE OF THE SCREEN'};
function ctlHelp(i){const d=CTL[i]||'auto';return 'P'+(i+1)+': '+(d==='auto'?CTL_HELP.auto[i]:/^pad/.test(d)?CTL_NAMES[d]+'  STICK MOVE  A USE  X/B PICK  Y TRICKS':CTL_HELP[d]);}
function persist(){try{localStorage.setItem('goblin-scramble',JSON.stringify(SAVE));}catch(e){}}
if(SAVE.camp!==2){SAVE.cleared={};SAVE.camp=2;persist();}
AU.music=!!SAVE.music;AU.sfx=!!SAVE.sfx;
const scanEl=document.getElementById('scan');function applyScan(){scanEl.hidden=!SAVE.scan;}applyScan();


// ---------- title ----------
const LOGO=(function(){const[c,x]=mk(330,100);
 const word=(s,sc,yy,top,mid,bot)=>{const[t,tx]=mk(330,8*sc);rawTxt(tx,s,(330-(s.length*6*sc-sc))/2|0,0,'#fff',sc);tx.globalCompositeOperation='source-in';const g=tx.createLinearGradient(0,0,0,7*sc);g.addColorStop(0,top);g.addColorStop(.46,mid);g.addColorStop(.5,'#cabd7c');g.addColorStop(.56,bot);g.addColorStop(1,mid);tx.fillStyle=g;tx.fillRect(0,0,330,8*sc);
  tx.globalCompositeOperation='source-over';
  for(let k=0;k<3;k++){const[o,ox]=mk(330,8*sc+8);ox.drawImage(t,0,4);}x.drawImage(t,0,yy);};
 word('RABBLINGS',6,22,'#b9b454','#697344','#414e33');
 outline(c,'#110a0c');outline(c,'#110a0c');const[s,sx]=mk(330,100);sx.fillStyle='rgba(0,0,0,.55)';sx.drawImage(c,3,4);const[f,fx]=mk(330,100);fx.drawImage(c,3,4);fx.globalCompositeOperation='source-in';fx.fillStyle='#0b0c0f';fx.fillRect(0,0,330,100);fx.globalCompositeOperation='source-over';fx.drawImage(c,0,0);
 for(const[dx,len]of[[67,14],[120,9],[199,12],[276,7]]){fx.fillStyle='#697344';fx.fillRect(dx,62,4,len);fx.fillStyle='#9fa452';fx.fillRect(dx,62,1,len-2);fx.fillRect(dx-1,62+len,6,3);fx.fillStyle='#110a0c';fx.fillRect(dx-1,65+len,6,1);}
 return f;})();
// every race and clan marches across the title, in both directions
const titleGobs=[];RK.flatMap(k=>RACES[k].clans).forEach((cl,i)=>titleGobs.push({x:(i*7%16)*33-30,team:i%3===2?1:0,o:i*3,cl}));
const poolMana=r=>SAVE.mana[r]===undefined?2:SAVE.mana[r];
// secret: type ABACABB on the title or main menu to unlock the combat trials
{let buf='';addEventListener('keydown',e=>{if(window.DLG||e.repeat||typeof scene==='undefined'||scene!==TitleScene||!e.key||e.key.length!==1)return;buf=(buf+e.key.toLowerCase()).slice(-7);if(buf==='abacabb'&&!SAVE.war){SAVE.war=1;persist();buf='';sfx('select');if(TitleScene.sub)TitleScene.open(TitleScene.sub);}});}
const TitleScene={t:0,menu:0,sel:0,sub:null,ret:null,enter(){playSong('title');setSides();this.sub=null;if(this.ret){const r=this.ret;this.ret=null;this.open(r);}},
 // the main menu stays short: games, settings and the rest open in their own small menus
 open(sub){this.sub=sub;const it=this.items();this.sel=Math.max(0,it.findIndex(e=>e[1]));},
 update(dt){this.t+=dt;for(const g of titleGobs){g.x+=dt*(g.team?-26:26);if(g.x>VW+24)g.x=-24;if(g.x<-24)g.x=VW+24;}
  if(!this.menu){if(anyStart()){this.menu=1;this.sel=0;auInit();if(!AU.song)playSong('title');sfx('select');}return;}
  if(this.sub&&goBack()){this.open(null);sfx('move');return;}
  const items=this.items();if(!items[this.sel]||!items[this.sel][1])this.sel=Math.max(0,items.findIndex(e=>e[1]));
  const d=menuDir();if(d){let s=this.sel;do{s=(s+d+items.length)%items.length;}while(!items[s][1]);this.sel=s;sfx('move');}if(anyStart()){items[this.sel][1]();sfx('select');}},
 modes(){return[['CAMPAIGN',()=>go(()=>{RaceScene.mode='camp';setScene(RaceScene);})],['COMBAT TRIALS',()=>go(()=>{RaceScene.mode='war';setScene(RaceScene);})],['1 PLAYER SABOTAGE',()=>go(()=>{RaceScene.mode='cpu';setScene(RaceScene);})],['2 PLAYER SABOTAGE',()=>go(()=>{RaceScene.mode='vs';setScene(RaceScene);})],['FREE PLAY',()=>go(()=>{CampaignSet='free';setScene(FreeScene);})]];},
 items(){const back=['BACK',()=>this.open(null)],m=this.modes();
  if(this.sub==='play')return[['MISSIONS'],m[0],m[4]].concat(SAVE.war||Object.keys(SAVE.cleared||{}).some(k=>/^war\d/.test(k))?[m[1]]:[],[['SINGLE GAME'],m[2],m[3],back]);
  if(this.sub==='set')return[['MUSIC '+(SAVE.music?'ON':'OFF'),()=>{SAVE.music=SAVE.music?0:1;AU.music=!!SAVE.music;persist();playSong('title');}],['SOUND FX '+(SAVE.sfx?'ON':'OFF'),()=>{SAVE.sfx=SAVE.sfx?0:1;AU.sfx=!!SAVE.sfx;persist();}],['CRT LINES '+(SAVE.scan?'ON':'OFF'),()=>{SAVE.scan=SAVE.scan?0:1;applyScan();persist();}],['BATTLE LAYOUT: '+LAYOUTS[uiLayout()].n,()=>{SAVE.ui=(uiLayout()+1)%3;persist();}],back];
  return[['NEW GAME',()=>this.open('play')],['MAP BUILDER',()=>go(()=>setScene(MapsScene))],['NEOLEMMIX LEVELS',()=>{if(BUILD==='play')location.href='../builder/#neolemmix';else go(()=>setScene(ImportScene));}],['HOW TO PLAY',()=>go(()=>{HelpScene.page=0;setScene(HelpScene);})],['SETTINGS',()=>this.open('set')]].concat(window.INSTALL?[['INSTALL GAME',()=>{const p=window.INSTALL;window.INSTALL=null;this.sel=0;p.prompt();}]]:[]);},
 draw(){const C=ctx,b=backdrop('bog');drawBackdrop(C,b,0,VW,this.t*14,0,0);
  // foreground ridge
  const gy=x=>236+Math.sin((x+this.t*0)*.02)*3;C.fillStyle='#2d2323';for(let x=0;x<VW;x++){const y=gy(x)|0;C.fillStyle='#565d41';C.fillRect(x,y,1,3);C.fillStyle='#6f7448';C.fillRect(x,y,1,1);C.fillStyle=noise(x,y)>.5?'#2d2323':'#131011';C.fillRect(x,y+3,1,VH);}
  for(const g of titleGobs)sheetSprite(C,clanArt(g.cl).sheet,'walk',(this.t*12|0)+g.o,g.team?-1:1,g.x|0,gy(g.x)|0);
  const by=this.menu?4:Math.round(30+Math.sin(this.t*1.6)*3);C.drawImage(LOGO,(VW-330)/2|0,by);txt(C,'MARCHING ORDERS',VW/2,by+86,'#f0d16b',{c:1,s:this.menu?1:2});
  if(!this.menu){if((this.t*1.2)%1<.72||this.t<.5)txt(C,'PRESS START',VW/2,178,'#fff',{c:1,s:2});txt(C,'ENTER  /  TAP  /  PAD START',VW/2,200,'#f0c36b',{c:1});hits.length=0;hits.push({x:0,y:0,w:VW,h:VH,fn:()=>{this.menu=1;this.sel=0;if(!AU.song)playSong('title');sfx('select');},btn:1});}
  else{hits.length=0;const it=this.items(),h=12,top=this.sub?126:116,pop=!!this.sub;
   if(pop){C.fillStyle='rgba(30,18,44,.92)';C.fillRect(VW/2-98,top-17,196,it.length*h+21);C.fillStyle='#7e5a96';C.fillRect(VW/2-98,top-17,196,1);C.fillRect(VW/2-98,top+it.length*h+3,196,1);C.fillRect(VW/2-98,top-17,1,it.length*h+21);C.fillRect(VW/2+97,top-17,1,it.length*h+21);txt(C,this.sub==='play'?'NEW GAME':'SETTINGS',VW/2,top-13,'#f0d16b',{c:1});}
   else{C.fillStyle='rgba(12,6,20,.72)';C.fillRect(VW/2-98,top-5,196,it.length*h+9);}
   it.forEach((e,i)=>{const y=top+i*h+(pop?2:0);if(!e[1]){txt(C,e[0],VW/2,y,'#c79ad8',{c:1});C.fillStyle='#6a4a80';C.fillRect(VW/2-80,y+4,22,1);C.fillRect(VW/2+58,y+4,22,1);return;}
    const sel=i===this.sel;hits.push({x:VW/2-98,y:y-2,w:196,h,btn:1,fn:()=>{this.sel=i;e[1]();sfx('select');},hover:()=>{this.sel=i;}});txt(C,e[0],VW/2,y,sel?'#f0d16b':'#7b7e8e',{c:1});if(sel){gobSprite(C,0,'walk',this.t*12|0,1,VW/2-92,y+9);}});}}};
function startSeries(cpu,sides){go(()=>{PackRun=null;setSides(sides);Series={cpu,i:0,wins:[0,0],draws:0,sides,classic:!!SAVE.classic};setScene(BriefScene);});}
let PackRun=null,Series=null,CampaignIdx=0,CustomDef=null,CampaignRace='goblin',CampaignClan=0,CampaignSet='camp',FreeUnlock=0;
const freeOff=(d,r)=>!d.races.includes(r),campList=()=>CampaignSet==='war'?WAR_LEVELS:CampaignSet==='free'?FREE_MAPS:RACE_LEVELS[CampaignRace],ck=i=>CampaignSet==='war'?'war'+i:CampaignSet==='free'?'free:'+FREE_MAPS[i].id+':'+CampaignRace+(freeOff(FREE_MAPS[i],CampaignRace)?':x':''):CampaignRace==='goblin'?i:CampaignRace+i;
// Classic switches off morale, speech and the comic deaths. A linked campaign keeps the mode it started with
const modeLocked=()=>!!(Series&&!Series.cpu)||(!Series&&!CustomDef&&CampaignSet==='camp');
const isClassic=test=>{if(test)return!!SAVE.classic;if(Series&&!Series.cpu)return!!(Series.classic===undefined?SAVE.classic:Series.classic);if(!Series&&!CustomDef&&CampaignSet==='camp')return SAVE.lock[CampaignRace]==='classic';return!!SAVE.classic;};
const modeName=c=>c?'CLASSIC':'RABBLINGS';
const dTotal=d=>d.n*Math.max(1,d.hatch.length),dNeed=d=>Math.min(Math.ceil(d.need*DIFFS[SAVE.diff].need),dTotal(d));
const goalText=d=>d.goal==='clear'?'CLEAR THE MAP':d.goal==='both'?`CLEAR THE MAP, SAVE ${dNeed(d)}`:`SAVE ${dNeed(d)} OF ${dTotal(d)}`;
// a run's score: rescues, time left, spare skills and morale, scaled by difficulty
function runScore(w,pass){const p=w.pl[0],clearB=w.won?1000:0,sec=pass?Math.floor(w.time/TPS):0,spare=pass?Object.values(p.skills).reduce((a,b)=>a+b,0):0;return Math.round((p.saved*100+clearB+sec*2+spare*15+(pass&&w.moodOn?Math.round(p.mood)*3:0))*w.diff.score);}

// ---------- level select ----------
const LevelScene={sel:0,t:0,enter(){PackRun=null;this.sel=Math.max(0,campList().findIndex((l,i)=>!SAVE.cleared[ck(i)]));Series=null;CustomDef=null;},
 update(dt){this.t+=dt;const d=menuDir(),n=campList().length;if(d){this.sel=(this.sel+d+n)%n;sfx('move');}if(press.ArrowLeft||press.KeyA||press.ArrowRight||press.KeyD){{const j=this.sel%10<5?this.sel+5:this.sel-5;this.sel=Math.min(n-1,Math.max(0,j));}sfx('move');}
  if(anyStart())this.pick(this.sel);if(goBack())go(()=>setScene(RaceScene));},
 pick(i){CampaignIdx=i;sfx('select');go(()=>setScene(BriefScene));},
 draw(){const C=ctx,b=backdrop('mine');drawBackdrop(C,b,0,VW,this.t*6,0,0);C.fillStyle='rgba(10,6,18,.74)';C.fillRect(0,0,VW,VH);hits.length=0;
  txt(C,CampaignSet==='war'?'COMBAT TRIALS':RACES[CampaignRace].n+' CAMPAIGN',VW/2,12,'#f0d16b',{c:1,s:2});const cols=2,cw=228,rowH=34;
  const pg=this.sel/10|0,np=Math.ceil(campList().length/10);if(np>1){txt(C,'PAGE '+(pg+1)+' OF '+np,VW/2,VH-34,'#818594',{c:1});const go2=d=>{this.sel=((pg+d+np)%np)*10;sfx('move');};button(C,VW/2-100,VH-38,20,13,'<',()=>go2(-1));button(C,VW/2+80,VH-38,20,13,'>',()=>go2(1));}campList().forEach((l,i)=>{if((i/10|0)!==pg)return;const k10=i%10,cx=k10<5?10:242,y=38+(k10%5)*rowH,sel=i===this.sel;hits.push({x:cx,y,w:cw,h:rowH-4,btn:1,fn:()=>this.pick(i),hover:()=>{this.sel=i;}});
   C.fillStyle=sel?'#2f313a':'#16161a';C.fillRect(cx,y,cw,rowH-4);C.fillStyle=THEME[l.theme].cap[1];C.fillRect(cx,y,4,rowH-4);
   txt(C,(i+1)+'  '+l.name,cx+10,y+5,sel?'#f0d16b':'#fff');txt(C,goalText(l),cx+10,y+17,'#62646e');{const bk=(CampaignSet==='war'?'war'+i:ck(i))+'/'+DIFFS[SAVE.diff].k+(isClassic()?'/c':''),bs=SAVE.scores[bk];if(bs)txt(C,bs.score,cx+cw-6,y+21,'#f0d16b',{r:1});}if(SAVE.cleared[ck(i)])txt(C,'DONE',cx+cw-6,y+6,'#777d45',{r:1});});
  button(C,VW/2-40,VH-22,80,16,'BACK',()=>go(()=>setScene(RaceScene)));}};


// ---------- free play ----------
// Maps are written in base skills and list the races that have a tested solution. Runs with an untested race are kept apart, and logged for review.
let FreeTier=1;
const freeMaps=t=>FREE_MAPS.map((m,i)=>[m,i]).filter(a=>a[0].tier===t),freeDone=m=>m.races.filter(r=>SAVE.cleared['free:'+m.id+':'+r]).length;
function freeLog(w,pass){const d=w.def,p=w.pl[0];if(!d.id||d.races.includes(p.race))return;const L=SAVE.freeLog||(SAVE.freeLog=[]);L.push({map:d.id,race:p.race,clan:CampaignClan,diff:w.diff.k,classic:w.classic?1:0,pass:pass?1:0,saved:p.saved,need:w.need,sec:Math.round(w.tick/TPS),at:Date.now()});if(L.length>300)L.splice(0,L.length-300);persist();}
const FreeScene={sel:0,t:0,enter(){PackRun=null;Series=null;CustomDef=null;CampaignSet='free';this.sel=Math.min(this.sel,Math.max(0,freeMaps(FreeTier).length-1));},
 tier(s){FreeTier=(FreeTier-1+s+FREE_TIERS.length)%FREE_TIERS.length+1;this.sel=0;sfx('move');},
 pick(i){const d=FREE_MAPS[i],r=d.races.includes(SAVE.freeRace)?SAVE.freeRace:d.races[0];CampaignSet='free';CampaignIdx=i;FreeUnlock=0;CampaignRace=r;CampaignClan=0;setSides([{race:r,clan:0},DEFSIDES[1]]);sfx('select');go(()=>setScene(BriefScene));},
 update(dt){this.t+=dt;const L=freeMaps(FreeTier),n=L.length,d=menuDir();if(d&&n){this.sel=(this.sel+d+n)%n;sfx('move');}
  if(press.ArrowRight||press.KeyD)this.tier(1);if(press.ArrowLeft||press.KeyA)this.tier(-1);
  if(anyStart()&&n)this.pick(L[this.sel][1]);if(goBack())go(()=>{TitleScene.menu=1;setScene(TitleScene);});},
 draw(){const C=ctx,b=backdrop('mine');drawBackdrop(C,b,0,VW,this.t*6,0,0);C.fillStyle='rgba(10,6,18,.74)';C.fillRect(0,0,VW,VH);hits.length=0;
  txt(C,'FREE PLAY',VW/2,10,'#f0d16b',{c:1,s:2});
  const tw=112;FREE_TIERS.forEach((t,i)=>{const on=t.k===FreeTier;button(C,10+i*(tw+4),30,tw,14,t.n+' '+freeMaps(t.k).length,()=>{FreeTier=t.k;this.sel=0;sfx('move');},{on});});
  const L=freeMaps(FreeTier);if(!L.length)txt(C,'COMING SOON',VW/2,110,'#62646e',{c:1,s:2});
  L.forEach(([m,i],k)=>{if(k>=10)return;const cx=k<5?10:242,y=54+(k%5)*32,sel=k===this.sel;hits.push({x:cx,y,w:228,h:28,btn:1,fn:()=>{this.sel=k;this.pick(i);},hover:()=>{this.sel=k;}});
   C.fillStyle=sel?'#2f313a':'#16161a';C.fillRect(cx,y,228,28);C.fillStyle=THEME[m.theme].cap[1];C.fillRect(cx,y,4,28);
   txt(C,(k+1)+'  '+m.name,cx+10,y+5,sel?'#f0d16b':'#fff');txt(C,goalText(m),cx+10,y+17,'#62646e');const dn=freeDone(m);txt(C,dn+' OF '+m.races.length+' RACES',cx+222,y+17,dn?'#777d45':'#62646e',{r:1});});
  txt(C,'EACH MAP LISTS RACES WITH A TESTED SOLUTION. OTHERS CAN BE UNLOCKED.',VW/2,VH-38,'#62646e',{c:1});
  button(C,VW/2-40,VH-22,80,16,'BACK',()=>go(()=>{TitleScene.menu=1;setScene(TitleScene);}));}};

// ---------- help ----------
const HelpScene={page:0,t:0,update(dt){this.t+=dt;if(anyStart()||press.ArrowRight||press.KeyD)this.next();if(goBack())go(()=>{TitleScene.menu=1;setScene(TitleScene);});},
 next(){sfx('select');if(++this.page>3){this.page=3;go(()=>{TitleScene.menu=1;setScene(TitleScene);});}},
 draw(){const C=ctx,b=backdrop('frost');drawBackdrop(C,b,0,VW,this.t*5,0,0);C.fillStyle='rgba(8,8,26,.82)';C.fillRect(0,0,VW,VH);hits.length=0;
  if(this.page===0){txt(C,'THE JOB',VW/2,10,'#f0d16b',{c:1,s:2});const l=['Rabblings march out of the hatch and never stop.','They will walk straight into anything.','Lose too many and the rest sulk, ignore you, then go on strike.','Give them jobs. Get them to the hut.'];l.forEach((s,i)=>txt(C,s,VW/2,34+i*11,'#fff',{c:1}));
   SK.forEach((k,i)=>{const y=74+i*18;C.drawImage(ICON[k],22,y);txt(C,SKN[i],42,y+2,'#f0d16b');txt(C,SKD[i],110,y+2,'#818594');});}
  else if(this.page===1){txt(C,'DIRTY TRICKS',VW/2,10,'#f0d16b',{c:1,s:2});const l=['In 2 player you share one map. Anything you build, they can use.','Anything you build, they can wreck. A Rabbling that walks into','YOUR hut scores for YOU, whoever it belongs to.','Tricks cost magic. You earn it over time and for each one home.'];l.forEach((s,i)=>txt(C,s,VW/2,34+i*11,'#fff',{c:1}));
   TR.forEach((k,i)=>{const y=96+i*24;C.drawImage(ICON[k],22,y);txt(C,TRN[i],42,y+2,'#f0d16b');txt(C,TRC[i]+' MAGIC',110,y+2,'#777d45');txt(C,TRD[i],42,y+12,'#818594');});}
  else if(this.page===2){txt(C,'CONTROLS',VW/2,10,'#f0d16b',{c:1,s:2});const rows=[['','PLAYER 1','PLAYER 2','PAD'],['MOVE CURSOR','W A S D','ARROWS','D-PAD'],['PREV / NEXT','F / H','J / L','LB / RB'],['USE IT','G','K','A'],['CHANGE ROW','T','I','Y'],['PAUSE (1 PLAYER)','ESC','','START'],['QUIT (2 PLAYERS)','HOLD ESC','HOLD ESC','HOLD START'],['NEXT RABBLING','','','LT / RT']];
   rows.forEach((r,i)=>{const y=38+i*15,c=i?'#fff':'#f0d16b';txt(C,r[0],24,y,'#657993');txt(C,r[1],196,y,c);txt(C,r[2],290,y,c);txt(C,r[3],384,y,c);});
   ['1 player: mouse or touch works too. Tap a Rabbling to give it the job,','drag to look around, SPACE fast-forwards, keys 1-8 pick a skill.','2 players on a touch screen: tap inside your own half.','Two pads are picked up automatically. Press a button on each.'].forEach((s,i)=>txt(C,s,VW/2,160+i*10,'#818594',{c:1}));
   txt(C,'CRT LINES AND MUSIC ARE ON THE MAIN MENU',VW/2,204,'#f0c36b',{c:1});}
  else{txt(C,'MAP BUILDER',VW/2,10,'#f0d16b',{c:1,s:2});['PAINT, ERASE, BOX and BLOB shape the land.','STAMP drops in ready-made hills, caves and towers.','PLACE adds hatches, huts, traps, machines, nests and enemies.','MOVE drags things around. Click empty space to look around.','RULES sets the mode, world, troops and skills.','TRIGGERS adds low gravity, floods, timers and death counts.','TEST plays your map at once. Win it to mark it CLEARED.','SHARE gives you a code to send to friends.','','Arrows or WASD move the view. Right-drag also works.','Ctrl+Z undoes. Ctrl+S saves. Delete removes the selected item.'].forEach((t,i)=>txt(C,t,VW/2,38+i*14,i>8?'#f0c36b':'#fff',{c:1}));}
  button(C,VW/2-40,VH-24,80,16,this.page<3?'NEXT':'DONE',()=>this.next());txt(C,(this.page+1)+' OF 4',VW-14,VH-19,'#62646e',{r:1});}};

// ---------- briefing ----------
const TRY_SKILLS=[null,'sword','bow','climb','flap','boom','block','build','bash','pick','dig','glide','dust','steam','cannon','spring','ratmine','vine','puff','tongue','spear','hop','firepot'];
const BriefScene={t:0,trial:null,pickTry(d){const i=(TRY_SKILLS.indexOf(this.trial)+d+TRY_SKILLS.length)%TRY_SKILLS.length;this.trial=TRY_SKILLS[i];sfx('move');},hard(){SAVE.diff=(SAVE.diff+1)%DIFFS.length;persist();sfx('move');},flip(){SAVE.classic=SAVE.classic?0:1;persist();sfx('move');},fr(){return CampaignSet==='free'&&!Series&&!CustomDef;},
 freeList(){return FreeUnlock?RK.filter(k=>RACES[k].play):this.def.races;},setRace(r,c){CampaignRace=r;CampaignClan=c|0;SAVE.freeRace=r;persist();setSides([{race:r,clan:CampaignClan},DEFSIDES[1]]);sfx('move');},
 race(d){const L=this.freeList(),i=Math.max(0,L.indexOf(CampaignRace));this.setRace(L[(i+d+L.length)%L.length],0);},clan(){this.setRace(CampaignRace,1-CampaignClan);},
 unlock(){FreeUnlock=FreeUnlock?0:1;if(!FreeUnlock&&freeOff(this.def,CampaignRace))this.setRace(this.def.races[0],0);sfx('select');},
 freeUI(C){const d=this.def,x0=250,off=freeOff(d,CampaignRace),cl=RACES[CampaignRace].clans[CampaignClan];txt(C,'RACE',x0,176,'#f0d16b');button(C,x0+32,173,12,12,'<',()=>this.race(-1));txt(C,RACES[CampaignRace].n,x0+88,176,off?'#eb6f39':'#fff',{c:1});button(C,x0+132,173,12,12,'>',()=>this.race(1));button(C,x0+148,173,76,12,cl.name,()=>this.clan());
  button(C,x0,187,112,12,FreeUnlock?'HIDE UNTESTED':'SHOW ALL RACES',()=>this.unlock(),{col:FreeUnlock?'#eb6f39':'#f0d16b'});if(!FreeUnlock)txt(C,d.races.length+' TESTED RACES',x0+118,189,'#62646e');
  if(off)txt(C,'UNTESTED: MAY BE IMPOSSIBLE',x0,201,'#eb6f39');else txt(C,'R RACE  N CLAN  U UNTESTED',x0,201,'#62646e');},
 enter(){this.t=0;this.def=Series?(Series.custom||ARENAS[Series.i%ARENAS.length]):(CustomDef||campList()[CampaignIdx]);this.trial=null;if(Series&&Series.custom&&!Series.sides){const r=this.def.race||'goblin';setSides([{race:r,clan:0},{race:r,clan:1}]);}this.prev=null;playSong(null);AU.song=null;},
 build(){if(this.prev)return;const d=this.def,w=new World(d,{vs:!!Series,quiet:true});const[c,x]=mk(220,84),im=x.createImageData(220,84),T=w.T,th=THEME[d.theme],r=hex2(th.cap[1]);
  for(let j=0;j<84;j++)for(let i=0;i<220;i++){const k=T.m[(j/84*T.h|0)*T.w+(i/220*T.w|0)],o=(j*220+i)*4;const col=k===2?[120,130,150]:k?r:[24,16,34];im.data.set([...col,255],o);}x.putImageData(im,0,0);
  x.fillStyle='#fff';for(const h of w.hatches){x.fillStyle=CLAN[h.team].ui;x.fillRect(h.x/T.w*220-2,h.y/T.h*84-2,5,3);}for(const h of w.doors){x.fillStyle=CLAN[h.team].ui;x.fillRect(h.x/T.w*220-2,h.y/T.h*84-6,5,6);}this.prev=c;this.w=w;},
 update(dt){this.t+=dt;this.build();if(press.KeyC&&!modeLocked())this.flip();if(press.KeyV&&!Series)this.hard();if(press.KeyT&&!Series)this.pickTry(1);if(this.fr()){if(press.KeyR)this.race(1);if(press.KeyN)this.clan();if(press.KeyU)this.unlock();}if((anyStart()||this.tap)&&this.t>.3){this.tap=0;sfx('select');go(()=>{Play.begin(this.def,Series);setScene(Play);});}if(goBack())go(()=>CustomDef||(Series&&Series.custom)?setScene(PackRun?PackPlay:MapsScene):Series?(TitleScene.menu=1,setScene(TitleScene)):setScene(CampaignSet==='free'?FreeScene:LevelScene));},
 draw(){const C=ctx,d=this.def;drawBackdrop(C,backdrop(d.theme,isUnder(d.theme,d.under)),0,VW,this.t*8,0,0);C.fillStyle='rgba(10,6,18,.7)';C.fillRect(0,0,VW,VH);hits.length=0;hits.push({x:0,y:0,w:VW,h:VH,fn:()=>{this.tap=1;},btn:1});
  if(Series){txt(C,Series.custom?'CUSTOM MATCH':`ROUND ${Series.i+1}  -  FIRST TO 2`,VW/2,12,'#f0d16b',{c:1});txt(C,d.name,VW/2,26,'#fff',{c:1,s:2});txt(C,CLAN[0].name+' '+Series.wins[0],120,50,CLAN[0].ui,{c:1});txt(C,CLAN[1].name+' '+Series.wins[1],360,50,CLAN[1].ui,{c:1});}
  else{txt(C,CustomDef?'CUSTOM MAP':CampaignSet==='free'?'FREE PLAY  -  '+FREE_TIERS[d.tier-1].n:`LEVEL ${CampaignIdx+1}`,VW/2,12,'#f0d16b',{c:1});txt(C,d.name,VW/2,26,'#fff',{c:1,s:2});txt(C,`${d.goal&&d.goal!=='home'?goalText(d):`SAVE ${dNeed(d)} OF ${dTotal(d)} ${RACES[d.race||(CustomDef?'goblin':CampaignRace)].n}`}  -  ${d.noTime?'NO TIME LIMIT':Math.floor(d.time*DIFFS[SAVE.diff].t/60)+':'+String(Math.round(d.time*DIFFS[SAVE.diff].t)%60).padStart(2,'0')}`,VW/2,42,'#777d45',{c:1});}
  txt(C,'MAP BY '+(d.by||(d.custom?'UNKNOWN':'RABBLINGS TEAM')),VW/2,53,'#f0c36b',{c:1});
  if(this.prev){C.fillStyle='#090a0c';C.fillRect(14,66,224,88);C.drawImage(this.prev,16,68);}
  {const x0=250,race=Series?((Series.sides&&Series.sides[0].race)||d.race||'goblin'):(d.race||(CustomDef?'goblin':CampaignRace)),src=d.skills||{},panel=SK.map(k=>(d.swap&&d.swap[k])||RACES[race].swap[k]||k);txt(C,'SKILLS IN THIS MISSION',x0,66,'#f0d16b');const use=[];panel.forEach((k,i)=>{const n=(src[k]!==undefined?src[k]:src[SK[i]])||0;if(n)use.push([k,n]);});const rows=Math.max(1,Math.ceil(use.length/2));use.forEach(([k,n],i)=>{const x=x0+(i%2)*112,y=78+(i>>1)*11;C.drawImage(ICON[k],x,y);txt(C,skName(k)+' X'+n,x+16,y+1,'#fff');});if(!use.length)txt(C,'NONE. USE WHAT YOU FIND.',x0,78,'#62646e');const ty=78+rows*11+4;
   if(!Series){txt(C,'TRY A SKILL',x0,ty+2,'#f0d16b');button(C,x0+70,ty,12,12,'<',()=>this.pickTry(-1));txt(C,this.trial?skName(this.trial)+' X2':'NONE',x0+128,ty+2,this.trial?'#777d45':'#fff',{c:1});button(C,x0+176,ty,12,12,'>',()=>this.pickTry(1));if(this.trial)txt(C,'PRACTICE RUN: NO SCORE OR PROGRESS',x0,ty+13,'#eb6f39');}
   if(Series)txt(C,'SPELLS COST '+RACES[race].mana+' IN 2 PLAYER',x0,ty+26,'#515d9d');else if(isClassic())txt(C,'NO SPELLS IN CLASSIC MODE',x0,ty+26,'#48494e');else if(this.trial)txt(C,'NO SPELLS IN A PRACTICE RUN',x0,ty+26,'#48494e');else{const have=d.custom||CampaignSet==='free'?(d.mana===undefined?2:d.mana):poolMana(race);txt(C,RACES[race].mana+' '+have,x0,ty+22,'#515d9d');txt(C,'PICK 2',x0+150,ty+22,'#62646e',{r:1});if(have)SPK.forEach((k,i)=>{const on=SAVE.spellPick.includes(k),x=x0+i*30;button(C,x,ty+31,28,14,'',()=>{const L=SAVE.spellPick;if(on)L.splice(L.indexOf(k),1);else{if(L.length>=2)L.shift();L.push(k);}persist();sfx('move');},{on});hits[hits.length-1].sp=k;C.globalAlpha=on?1:.55;C.drawImage(ICON[k],x+8,ty+33);C.globalAlpha=1;});const hv=hitAt(pointerX,pointerY);if(hv&&hv.sp)this.tip=SPELLS[hv.sp].n+' '+SPELLS[hv.sp].c+': '+SPELLS[hv.sp].d;}}
  {const t=d.hint.length>58?[d.hint.slice(0,d.hint.lastIndexOf(' ',58)),d.hint.slice(d.hint.lastIndexOf(' ',58)+1)]:[d.hint],hy=Series?160:213;if(d.pre&&d.pre.length&&!Series)d.pre.forEach((s,i)=>txt(C,s,VW/2,hy-2+i*9,'#fff',{c:1}));else t.forEach((s,i)=>txt(C,s,VW/2,hy+i*10,'#fff',{c:1}));
   if(!Series&&this.w){const w=this.w,gd=d.goal,cl=gd==='clear'||gd==='both',L=[],fm={};w.mobs.forEach(m=>{fm[m.kind]=(fm[m.kind]||0)+1;});const fs=Object.keys(fm).map(k=>fm[k]+' '+(FOES[k]?FOES[k].n:k));
    L.push(goalText(d));if(fs.length)L.push((cl?'DEFEAT ':'ENEMIES: ')+fs.join(', '));if(w.nests.length)L.push(cl?'DESTROY '+w.nests.length+' NEST'+(w.nests.length>1?'S':''):w.nests.length+' NEST'+(w.nests.length>1?'S':'')+' KEEP BREEDING ENEMIES');
    const tk=[...new Set(w.traps.map(q=>q.k))];if(tk.length)L.push('TRAPS: '+tk.join(', ').toUpperCase());if(w.hz&&w.hz.length)L.push(w.hz.some(h=>h.lava)?'LAVA ON THE MAP':'WATER ON THE MAP');
    (d.rules||[]).forEach(r=>L.push('RULE: '+(RULES.find(a=>a[0]===r)||['',r])[1]));if(DIFFS[SAVE.diff].n==='WILD')L.push('WILD CARDS: SURPRISE EVENTS');
    if(this.tip){txt(C,this.tip.slice(0,64),VW/2,160,'#515d9d',{c:1});this.tip=null;}else{txt(C,'THE JOB',16,158,'#f0d16b');L.slice(0,5).forEach((s,i)=>txt(C,(i?'- ':'')+s.slice(0,36),16,169+i*9,i?'#c9c9d3':'#fff'));if(L.length>5)txt(C,'+'+(L.length-5)+' MORE',16,169+5*9,'#62646e');}}}
  if(this.fr())this.freeUI(C);
  if(Series&&!Series.cpu){[0,1].forEach(i=>txt(C,ctlHelp(i),VW/2,196+i*12,CLAN[i].ui,{c:1}));}
  if(!Series)button(C,VW/2-152,VH-20,140,15,'DIFFICULTY: '+DIFFS[SAVE.diff].n,()=>this.hard(),{col:SAVE.diff>1?'#e97721':'#f0d16b'});if(modeLocked())txt(C,'MODE: '+modeName(isClassic())+' (LOCKED)',VW/2+82,VH-16,'#62646e',{c:1});else button(C,VW/2+12,VH-20,140,15,'MODE: '+modeName(isClassic()),()=>this.flip(),{col:isClassic()?'#777d45':'#f0d16b'});
  if((this.t*2|0)%2===0)txt(C,'PRESS START',VW/2,232,'#f0d16b',{c:1,s:1});}};

// ---------- play ----------
// the dark is always closing in: dark edges over every play view
let VIG=null;const vignette=()=>{if(VIG)return VIG;const[c,x]=mk(VW,VIEWH),g=x.createRadialGradient(VW/2,VIEWH/2,VIEWH*.42,VW/2,VIEWH/2,VW*.62);g.addColorStop(0,'rgba(8,6,10,0)');g.addColorStop(1,'rgba(8,6,10,.6)');x.fillStyle=g;x.fillRect(0,0,VW,VIEWH);return VIG=c;};
const Play={world:null,paused:false,ff:false,acc:0,test:false,begin(def,ser,o={}){this.lay=ser?0:uiLayout();setHud(LAYOUTS[this.lay].h);const sd=(ser&&ser.sides)||[{race:def.race||(CustomDef||o.test?'goblin':CampaignRace),clan:def.custom?0:CampaignClan},DEFSIDES[1]];if(def.custom&&ser&&!ser.sides){sd[0]={race:def.race||'goblin',clan:0};sd[1]={race:def.race||'goblin',clan:1};}setSides(sd);const w=this.world=new World(def,{vs:!!ser,sides:sd,classic:isClassic(o.test),diff:ser||o.test?1:SAVE.diff,trial:ser||o.test?null:BriefScene.trial});this.ser=ser;this.test=!!o.test;this.rw=!ser&&!o.test&&!w.classic&&!w.trial&&w.diff.k==='easy'&&w.T.m.length<=2.2e6;this.rwLeft=3;this.rwAnim=null;this.snaps=[];this.quitT=0;this.acc=0;this.paused=false;this.ff=false;this.endT=0;this.lastPl=0;
  this.views=ser?(ser.cpu?[{x:0,w:VW},{x:VW,w:0}]:[{x:0,w:239},{x:241,w:239}]):[{x:0,w:VW}];
  w.pl.forEach((p,i)=>{const h=w.hatches.find(a=>a.team===i);p.sel=Math.max(0,p.panel.findIndex(k=>p.skills[k]>0));p.cx=h.x;p.cy=h.y+20;p.camX=clamp(h.x-this.views[i].w/2,0,Math.max(0,w.T.w-this.views[i].w));p.camY=clamp(h.y-70,0,Math.max(0,w.T.h-VIEWH));if(!ser&&i===0&&def.screenX!==undefined&&def.screenY!==undefined){p.cx=def.screenX;p.cy=def.screenY;p.camX=clamp(def.screenX-this.views[0].w/2,0,Math.max(0,w.T.w-this.views[0].w));p.camY=clamp(def.screenY-VIEWH/2,0,Math.max(0,w.T.h-VIEWH));}p.tx=p.cx;p.ty=p.cy;p.lastPlX=p.camX;});
  if(ser&&ser.cpu){const P=w.pl[1];P.bot=def.plan||[];P.cpu=true;P.spells=[];}if(!ser&&!w.classic&&!w.trial){const P=w.pl[0],r=sd[0].race,cust=def.custom||o.test||CampaignSet==='free',n=cust?(def.mana===undefined?2:def.mana):poolMana(r);P.mana=n;P.spells=n?SAVE.spellPick.filter(k=>SPELLS[k]).slice(0,2):[];if(!cust)w.onSpend=p=>{SAVE.mana[r]=p.mana;persist();};}
  this.mini=null;this.mbox=ser?[128,28]:[[128,40],[126,32],[300,26]][this.lay];this.miniT=0;this.acc=0;this.buildMini();if(this.rw)this.snaps.push(this.cap());},
 enter(){playSong(this.world.def.theme==='bog'||this.world.def.theme==='frost'?'title':'dig');},
 miniDims(bw,bh){const T=this.world.T,a=T.w/T.h;let w=bw,h=Math.round(w/a);if(h>bh){h=bh;w=Math.round(h*a);}return[Math.max(16,w),Math.max(10,h)];},
 buildMini(){const T=this.world.T,[mw,mh]=this.miniDims(...this.mbox);if(!this.mini||this.mini.width!==mw||this.mini.height!==mh)[this.mini,this.mx]=mk(mw,mh);const x=this.mx,th=THEME[this.world.def.theme],im=x.createImageData(mw,mh),c=hex2(th.ramp[5]),i2=[150,160,180],k3=[200,150,90];
  for(let j=0;j<mh;j++)for(let i=0;i<mw;i++){const a=(j+.5)/mh*T.h|0,b=(i+.5)/mw*T.w|0,m=T.m[a*T.w+b],o=(j*mw+i)*4;const col=m===2?i2:m===3?k3:m?c:[14,10,22];im.data[o]=col[0];im.data[o+1]=col[1];im.data[o+2]=col[2];im.data[o+3]=255;}x.putImageData(im,0,0);this.md=[mw,mh];},
 target(p){const w=this.world,sk=p.sel<8?p.panel[p.sel]:null;let best=null,bd=1e9;if(!sk)return null;for(const g of w.gobs){if(g.team!==p.id||!w.alive(g))continue;const d=Math.hypot(g.x-p.cx,g.y-7-p.cy);if(d<(p.tapR||14)&&w.canAssign(g,sk,p)){const v=d+(g.s==='walk'?0:2);if(v<bd){bd=v;best=g;}}}return best;},
 act(p){const w=this.world;if(w.over||this.paused)return;if(p.sel>=12){if(!w.cast(p,p.spells[p.sel-12],p.cx|0,p.cy|0))sfx('deny');return;}if(p.sel>=8){if(w.def.noTricks||!w.trick(p,p.sel-8,p.cx|0,p.cy|0))sfx('deny');return;}const sk=p.panel[p.sel];if(p.skills[sk]<=0){sfx('deny');return;}const g=this.target(p);if(g)w.assign(g,sk,p);else sfx('deny');},
 cycle(p,d){const trick=p.sel>=8,lo=p.sel>=12?12:trick?8:0,n=p.sel>=12?Math.max(1,p.spells.length):trick?4:8;p.sel=lo+((p.sel-lo+d+n)%n);sfx('move');},
 jumpGob(p,d){const w=this.world,L=w.gobs.filter(g=>g.team===p.id&&w.alive(g)&&g.s!=='home').sort((a,b)=>a.x-b.x||a.id-b.id);if(!L.length)return;let i=L.findIndex(g=>g.id===p.gi);i=i<0?(d>0?0:L.length-1):(i+d+L.length)%L.length;const g=L[i];p.gi=g.id;p.cx=g.x;p.cy=g.y-7;p.kbd=1;sfx('move');},
 flip(p){if(!this.world.vs){if(!p.spells.length)return;p.sel=p.sel>=12?0:12;sfx('move');return;}p.sel=p.sel>=12||!p.spells.length&&p.sel>=8?0:p.sel>=8?12:8;sfx('move');},
 clampCam(p,v){const T=this.world.T;p.camX=clamp(p.camX,0,Math.max(0,T.w-v.w));p.camY=clamp(p.camY,0,Math.max(0,T.h-VIEWH));},
 update(dt){const w=this.world,two=w.vs;
  if(this.rwAnim){this.rwStep(dt);return;}
  if(this.paused){this.pauseMenu();return;}
  if(this.test&&press.Escape&&!fadeNext){go(()=>{Ed.afterTest(w);setScene(Ed);playSong('title');});return;}
  const liveTwo=two&&!w.pl[1].cpu&&!this.test;
  if(liveTwo){const hold=held.Escape||(PAD[0]&&PAD[0].s.start)||(PAD[1]&&PAD[1].s.start);this.quitT=hold?(this.quitT||0)+dt:0;if(this.quitT>=1.5&&!fadeNext){go(()=>{if(Series&&Series.custom)setScene(PackRun?PackPlay:MapsScene);else{TitleScene.menu=1;setScene(TitleScene);}});return;}}
  else if(press.Escape||press.KeyP||(PAD[0]&&PAD[0].e.start)||(PAD[1]&&PAD[1].e.start)){this.paused=true;this.psel=0;sfx('select');return;}
  if(!two&&press.Space){this.ff=!this.ff;sfx('move');}
  if(!two){for(let i=0;i<8;i++)if(press['Digit'+(i+1)]){w.pl[0].sel=i;sfx('move');}if(press.KeyQ)this.cycle(w.pl[0],-1);if(press.KeyE)this.cycle(w.pl[0],1);if(press.KeyR&&this.rw)this.rewind();}
  w.pl.forEach((p,i)=>{if(p.cpu){p.cx=lerp(p.cx,p.tx,.1);p.cy=lerp(p.cy,p.ty,.1);const v=this.views[i];p.camX=lerp(p.camX,p.cx-v.w/2,.06);p.camY=lerp(p.camY,p.cy-VIEWH/2,.06);this.clampCam(p,v);return;}
   const v=this.views[i],sources=two&&!w.pl[1].cpu?[inp(i,this.dev(i))]:(this.dev(0)==='auto'?[inp(0),inp(1)]:[inp(0,this.dev(0))]);
   for(const I of sources){if(I.hit('act'))this.act(p);if(I.hit('prev'))this.cycle(p,-1);if(I.hit('next'))this.cycle(p,1);if(I.hit('row'))this.flip(p);if(I.hit('jump'))this.jumpGob(p,1);if(I.hit('jumpBack'))this.jumpGob(p,-1);
    const dx=(I.hold('r')?1:0)-(I.hold('l')?1:0),dy=(I.hold('d')?1:0)-(I.hold('u')?1:0);
    if(dx||dy){p.run=Math.min((p.run||0)+dt*5,1);const s=(100+200*p.run)*dt;p.cx+=dx*s;p.cy+=dy*s;p.kbd=1;}else if(I===sources[sources.length-1]&&!sources.some(q=>q.hold('r')||q.hold('l')||q.hold('u')||q.hold('d')))p.run=0;}
   p.cx=clamp(p.cx,0,w.T.w-1);p.cy=clamp(p.cy,0,w.T.h-1);
   if(p.kbd){const m=46;if(p.cx-p.camX<m)p.camX=p.cx-m;if(p.cx-p.camX>v.w-m)p.camX=p.cx-v.w+m;if(p.cy-p.camY<36)p.camY=p.cy-36;if(p.cy-p.camY>VIEWH-36)p.camY=p.cy-VIEWH+36;}
   if(!p.kbd&&p.edge&&pointerX>=0){const lx=pointerX-v.x,s=220*dt;if(lx<12)p.camX-=s;else if(lx>v.w-12)p.camX+=s;if(pointerY<10)p.camY-=s;else if(pointerY>VIEWH-10&&pointerY<VIEWH)p.camY+=s;p.cx=clamp(p.camX+lx,0,w.T.w-1);p.cy=clamp(p.camY+pointerY,0,w.T.h-1);}
   this.clampCam(p,v);});
  const tickLen=1/TPS;this.acc+=dt*(this.ff?4:1)*(w.rule.fast?2:1);let guard=0;w.gobs.forEach(g=>{});
  while(this.acc>=tickLen&&guard++<8){w.step();this.acc-=tickLen;if(this.rw&&!w.over&&w.tick%TPS===0)this.snap();}
  if(AU.song&&w.time<TPS*30)AU.boost=1.14;
  this.updateFx(dt);
  if(w.over){this.endT+=dt;if(this.endT>1.1&&!fadeNext)go(()=>{if(this.test){Ed.afterTest(w);setScene(Ed);playSong('title');}else{Result.show(w,this.ser);setScene(Result);}});}},
 updateFx(dt){const w=this.world;for(let i=w.parts.length-1;i>=0;i--){const p=w.parts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=240*dt*p.g;p.l-=dt*30;if(p.l<=0||w.T.solid(p.x|0,p.y|0)&&p.g===1&&p.vy>0)w.parts.splice(i,1);}
  for(let i=w.floats.length-1;i>=0;i--){const f=w.floats[i];f.y-=dt*16;f.l-=dt*30;if(f.l<=0)w.floats.splice(i,1);}if(w.shake>0)w.shake=Math.max(0,w.shake-dt*30);},
 pauseItems(){const it=[['RESUME',()=>{this.paused=false;}]];if(this.rw)it.push(['REWIND '+this.rwLeft,()=>{this.paused=false;this.rewind();}]);if(!this.ser)it.push(['LAYOUT: '+LAYOUTS[this.lay].n,()=>{this.lay=(this.lay+1)%3;SAVE.ui=this.lay;persist();setHud(LAYOUTS[this.lay].h);this.mbox=[[128,40],[126,32],[300,26]][this.lay];this.buildMini();this.world.pl.forEach((p,i)=>this.clampCam(p,this.views[i]));}]);it.push(['RESTART',()=>{go(()=>{Play.begin(this.world.def,this.ser,{test:this.test});setScene(Play);});}]);
  if(!this.world.over)it.push(['LIGHT ALL FUSES',()=>{this.world.fuseAll();this.paused=false;}]);it.push(this.test?['BACK TO BUILDER',()=>{go(()=>{Ed.afterTest(this.world);setScene(Ed);playSong('title');});}]:['QUIT TO MENU',()=>{go(()=>{if(CustomDef||(Series&&Series.custom))setScene(PackRun?PackPlay:MapsScene);else{TitleScene.menu=1;setScene(TitleScene);}});}]);return it;},
 pauseMenu(){const it=this.pauseItems(),d=menuDir();if(d){this.psel=(this.psel+d+it.length)%it.length;sfx('move');}if(anyStart()){it[this.psel][1]();sfx('select');}if(press.Escape||press.KeyP)this.paused=false;},
 dev(i){return this.test||CustomDef||PackRun?'auto':(CTL[i]||'auto');},
 viewAt(x){return this.world.vs&&this.views[1].w>0?(x<240?0:1):0;},
 pdown(id,x,y,type){if(y>=VIEWH)return;const i=this.viewAt(x),p=this.world.pl[i];if(p.cpu||!ptrOk(this.dev(i),type))return;ptrs.set(id,{i,sx:x,sy:y,lx:x,ly:y,moved:false,type});p.kbd=0;this.lastPl=i;},
 pmove(id,x,y,type){const r=ptrs.get(id);if(r){if(!r.moved&&Math.hypot(x-r.sx,y-r.sy)>6)r.moved=true;if(r.moved){const p=this.world.pl[r.i];p.camX-=x-r.lx;p.camY-=y-r.ly;this.clampCam(p,this.views[r.i]);}r.lx=x;r.ly=y;return;}
  if(type==='mouse'&&y<VIEWH){const i=this.viewAt(x),p=this.world.pl[i];if(p.cpu||!ptrOk(this.dev(i),type))return;p.kbd=0;p.edge=1;const v=this.views[i];p.cx=clamp(p.camX+x-v.x,0,this.world.T.w-1);p.cy=clamp(p.camY+y,0,this.world.T.h-1);this.lastPl=i;}},
 pup(id,x,y){const r=ptrs.get(id);ptrs.delete(id);if(!r||r.moved)return;const p=this.world.pl[r.i],v=this.views[r.i];p.tapR=r.type==='touch'?26:0;p.cx=clamp(p.camX+r.sx-v.x,0,this.world.T.w-1);p.cy=clamp(p.camY+r.sy,0,this.world.T.h-1);p.kbd=0;this.act(p);p.tapR=0;},
 drawView(i){const C=ctx,w=this.world,v=this.views[i],p=w.pl[i]||w.pl[0],T=w.T,th=THEME[w.def.theme],sh=w.shake>0&&!CALM?((Math.random()*w.shake-w.shake/2)|0):0,cx=p.camX|0,cy=p.camY|0,a=clamp(this.acc*TPS,0,1);
  C.save();C.beginPath();C.rect(v.x,0,v.w,VIEWH);C.clip();drawBackdrop(C,backdrop(w.def.theme,w.under),v.x,v.w,cx,cy,Math.max(0,T.h-VIEWH));
  for(let k=0;k<26;k++){const s=k*97.3,t=clock*(.2+(k%5)*.07);let ax=w.def.theme==='dunes'?(s*13+clock*(w.rule.wind?260:60)*(.6+(k%4)*.25))%v.w:(s*13+Math.sin(t+k)*30)%v.w,ay=(s*7+(w.def.theme==='frost'||w.def.theme==='mine'?t*40:-t*40))%VIEWH;if(ay<0)ay+=VIEWH;ctx.fillStyle=th.amb;ctx.globalAlpha=.25+.3*Math.abs(Math.sin(t*3+k));ctx.fillRect(v.x+((ax-cx*.6)%v.w+v.w)%v.w|0,ay|0,1,1);}ctx.globalAlpha=1;
  const ox=cx-v.x-sh,oy=cy;
  for(const d of w.doors){C.drawImage(HUT[d.team],d.x-ox-26,d.y-oy-46);const f=(clock*10|0)%3;C.globalCompositeOperation='lighter';C.drawImage(glow('rgba(255,170,70,.45)'),d.x-ox-32,d.y-oy-46);C.globalCompositeOperation='source-over';}
  for(const h of w.hatches){if(h.ghost)continue;C.fillStyle='#232325';for(let q=h.y-30;q>-40;q-=4)C.fillRect(h.x-ox-1,q-oy,2,2);C.drawImage(HATCH[h.team],h.x-ox-22,h.y-oy-26);if(h.open>0){C.fillStyle='#090a0c';C.fillRect(h.x-ox-14,h.y-oy-6,28,Math.min(h.open,6)|0);}}
  for(const e of w.ents)if(e.k==='mimic'){C.drawImage(MIMIC[e.team],e.x-ox-26,e.y-oy-46+(e.bite>0?(e.bite%2):0));if(e.team!==i&&w.vs){}else if(w.vs)txt(C,'FAKE',e.x-ox,e.y-oy-54,CLAN[e.team].ui,{c:1});}
  T.flush();if(T.pv)C.drawImage(T.pv,cx,cy,v.w,VIEWH,v.x+sh,0,v.w,VIEWH);C.drawImage(T.deco,cx,cy,v.w,VIEWH,v.x+sh,0,v.w,VIEWH);C.drawImage(T.cv,cx,cy,v.w,VIEWH,v.x+sh,0,v.w,VIEWH);if(w.def.open){for(const d of w.doors)C.drawImage(HUT[d.team],d.x-ox-26,d.y-oy-46);for(const h of w.hatches)if(!h.ghost)C.drawImage(HATCH[h.team],h.x-ox-22,h.y-oy-26);}
  for(const h of w.hz)drawHazard(C,h,w.def.theme,v.x,v.w,cx,cy,sh,h.water?'marsh':undefined);
  if(w.floodY<T.h)drawHazard(C,{x0:0,x1:T.w-1,y:w.floodY},THEME[w.def.theme].lavaHaz?'frost':w.def.theme,v.x,v.w,cx,cy,sh);if(w.lavaY<T.h)drawHazard(C,{x0:0,x1:T.w-1,y:w.lavaY},'forge',v.x,v.w,cx,cy,sh);
  for(const t of w.traps)if(t.x-ox>-40&&t.x-ox<v.x+v.w+40)drawTrap(C,t,w.tick/TPS,ox,oy,t.live);
  for(const h of w.holes){C.fillStyle='#090a0c';C.fillRect(h.x-ox-8,h.y-oy,16,3);}for(const n of w.nests)if(!n.dead)drawNest(C,n.x-ox,n.y-oy,n.hp,n.max,w.tick);for(const m of w.mobs)if(!m.dead)drawFoe(C,m.kind,Math.round(lerp(m.px,m.x,a))-ox,Math.round(lerp(m.py,m.y,a))-oy,m.dir,m.t,m.hp);
  for(const g of w.gobs){if(g.s==='dead'||g.s==='held')continue;const x=Math.round(lerp(g.px,g.x,a)),y=Math.round(lerp(g.py,g.y,a)),sx=x-ox,sy=y-oy;if(sx<-20||sx>v.x+v.w+20||sy<-20||sy>VIEWH+24)continue;
   const an=g.panic>0&&g.s==='walk'?'panic':g.s==='fling'?'fall':g.s==='tongue'||g.s==='shoot'||g.s==='sit'||g.s==='grow'?'shrug':g.s==='fight'?'bash':g.s==='burn'?'panic':g.s==='fly'?(g.race==='fairy'?'walk':'fall'):g.s==='float'&&g.race==='fairy'?'walk':g.s==='gun'?'block':g.s,fr=an==='splat'||an==='drown'?Math.min(3,g.t>>2):an==='home'?g.t>>1:Math.floor((w.tick+g.id)*(an==='dig'?1:an==='block'||an==='shrug'||an==='ohno'||an==='float'?.34:an==='bash'||an==='pick'?1:1));if(g.big)drawFoe(C,'construct',sx,sy,g.dir,w.tick,g.hp);else gobSprite(C,g.team,an,fr,g.dir,sx,sy);
   if(g.s==='gun'){const d=g.dir,q=d>0?sx+2:sx-16;C.fillStyle='#090a0c';C.fillRect(q,sy-11,15,7);C.fillStyle='#3b3d40';C.fillRect(q+1,sy-10,13,5);C.fillStyle='#5c432c';C.fillRect(sx-4,sy-4,9,4);}
   if(g.s==='sit'){C.fillStyle='#5c432c';C.fillRect(sx,sy-24,1,14);C.fillStyle='#090a0c';C.fillRect(sx-9,sy-31,19,10);C.fillStyle='#e8dcc0';C.fillRect(sx-8,sy-30,17,8);txt(C,'NO',sx,sy-29,'#953c2e',{c:1});}
   if(g.s==='burn'){for(let q=0;q<3;q++){const f=(w.tick*3+q*5+g.id)%6;C.fillStyle=['#b5a64b','#db9016','#b64c1e'][q];C.fillRect(sx-5+q*4,sy-16-f,3,8+f);}}
   if((g.armed&&!g.big)||g.bow){const d=g.dir,hx=sx+d*5;if(g.armed){const up=g.s==='fight'&&(g.t%14)>7;C.fillStyle='#090a0c';C.fillRect(d>0?hx:hx-7,sy-(up?13:10),8,3);C.fillStyle='#8391a7';C.fillRect(d>0?hx:hx-6,sy-(up?12:9),7,1);}else{C.fillStyle='#5c432c';C.fillRect(hx,sy-16,1,11);C.fillStyle='#a59f86';C.fillRect(hx-d,sy-11,1,1);}}if(g.hp>1&&!g.big){C.fillStyle='#e8321c';C.fillRect(sx-3,sy-20,2,2);C.fillRect(sx+1,sy-20,2,2);}
   if(g.fuse>0&&an!=='ohno')txt(C,String(Math.ceil(g.fuse/TPS)),sx,sy-23,'#f0d16b',{c:1});if(an==='ohno')txt(C,'!',sx,sy-23,'#e8321c',{c:1});if(g.climber||g.flap){C.fillStyle=g.climber?'#f7e5ac':'#505e9b';C.fillRect(sx-5,sy-17,2,1);if(g.climber&&g.flap){C.fillStyle='#505e9b';C.fillRect(sx-5,sy-16,2,1);}}}
  for(const e of w.ents){if(e.k==='hat'){const x=e.x-ox|0,y=e.y-oy|0;C.fillStyle='#090a0c';C.fillRect(x-4,y-3,9,4);C.fillStyle=e.c;C.fillRect(x-3,y-3,7,3);C.fillRect(x-1,y-5,3,2);}else if(e.k==='boots'){const x=e.x-ox|0,y=e.y-oy|0;C.fillStyle='#090a0c';C.fillRect(x-6,y-4,5,4);C.fillRect(x+1,y-4,5,4);C.fillStyle='#442f21';C.fillRect(x-5,y-3,4,3);C.fillRect(x+2,y-3,4,3);}else if(e.k==='ghost'){const x=e.x-ox|0,y=e.y-oy|0;C.globalAlpha=Math.min(1,e.l/30);C.fillStyle='#7693b8';C.fillRect(x-3,y-8,7,8);C.fillRect(x-4,y-5,9,5);C.fillStyle='#090a0c';C.fillRect(x-2,y-6,1,2);C.fillRect(x+2,y-6,1,2);C.fillStyle='#f0d16b';C.fillRect(x-3,y-11,7,1);C.globalAlpha=1;}}
  for(const e of w.ents)if(e.k==='say'){const W=e.s.length*6+7,x=clamp((e.g.x-ox)-(W>>1)|0,v.x+2,v.x+v.w-W-2),y=clamp(e.g.y-oy-(e.g.s==='sit'?47:36)|0,2,VIEWH-16);C.fillStyle='#090a0c';C.fillRect(x-1,y-1,W+2,13);C.fillStyle='#e8dcc0';C.fillRect(x,y,W,11);C.fillRect((e.g.x-ox|0)-1,y+11,3,2);txt(C,e.s,x+4,y+2,'#141519');}
  for(const g of w.gobs){if(!w.alive(g))continue;const c=g.zz>0?'#50739b':g.daze>0?'#f0d16b':g.hypno>0?'#515d9d':g.ward>0?'#76bd5d':null;if(c){C.fillStyle=c;C.fillRect(g.x-ox-1|0,g.y-oy-20+((w.tick>>3)&1)|0,3,3);}}for(const m of w.mobs){if(m.dead)continue;const c=m.sleep>0?'#50739b':m.daze>0?'#f0d16b':m.charm>0?'#515d9d':null;if(c){C.fillStyle=c;C.fillRect(m.x-ox-1|0,m.y-oy-24+((w.tick>>3)&1)|0,3,3);}}
  for(const e of w.ents)if(e.k==='rmine'){const x=e.x-ox|0,y=e.y-oy|0;C.fillStyle='#090a0c';C.fillRect(x-5,y-6,10,6);C.fillStyle=(e.t>>2)&1?'#e72417':'#3b3d40';C.fillRect(x-4,y-5,8,4);}
  for(const e of w.ents)if(e.k==='meteor'&&e.rock){const tx=e.tx-ox|0,ty=e.ty-oy|0;if((w.tick>>2)&1){C.fillStyle='#e72417';C.fillRect(tx-12,ty-1,8,2);C.fillRect(tx+5,ty-1,8,2);C.fillRect(tx-1,ty-13,2,8);}if(!e.wait){const x=e.x-ox|0,y=e.y-oy|0;C.fillStyle='rgba(120,110,100,.35)';for(let q=1;q<5;q++)C.fillRect(x-q*3,y-q*6,3,3);C.fillStyle='#090a0c';C.fillRect(x-8,y-7,16,14);C.fillRect(x-6,y-9,12,18);C.fillStyle='#4a4e38';C.fillRect(x-7,y-8,14,4);C.fillStyle='#5e5852';C.fillRect(x-7,y-4,14,9);C.fillRect(x-5,y+5,10,3);C.fillStyle='#3a3430';C.fillRect(x-1,y-2,6,8);C.fillStyle='#1a1416';C.fillRect(x-4,y-11,1,4);}}
for(const e of w.ents)if(e.k==='meteor'&&!e.rock){const tx=e.tx-ox|0,ty=e.ty-oy|0;if((w.tick>>2)&1){C.fillStyle='#e72417';C.fillRect(tx-12,ty-1,8,2);C.fillRect(tx+5,ty-1,8,2);C.fillRect(tx-1,ty-13,2,8);}if(!e.wait){const x=e.x-ox|0,y=e.y-oy|0;for(let q=1;q<6;q++){C.fillStyle=['#b5a64b','#db9016','#b64c1e','#772921','#392424'][q-1];C.fillRect(x-q*2-4+q,y-q*5,8-q,6);}C.fillStyle='#090a0c';C.fillRect(x-7,y-6,14,13);C.fillStyle='#5d4237';C.fillRect(x-6,y-5,12,11);C.fillStyle='#81624d';C.fillRect(x-4,y-4,5,3);}}
  for(const e of w.ents)if(e.k==='lurker'){const x=e.x-ox|0,y=e.y-oy|0,t=w.tick,r=5+((t>>2)%12),fl=(t>>3)&1;C.fillStyle='rgba(190,205,195,'+(0.5-r/30).toFixed(2)+')';C.fillRect(x-r,y,r*2,1);C.fillRect(x-r+3,y+1,r*2-6,1);
   if(e.eat>0&&FOESPR.lurker[0].complete){const im=FOESPR.lurker[0],w2=im.naturalWidth,h2=im.naturalHeight,lift=Math.round(Math.sin(e.eat/18*Math.PI)*6);C.save();C.translate(x+e.dx*8,y+4-lift);if(e.dx<0)C.scale(-1,1);C.drawImage(im,-(w2>>1),-h2,w2,h2);C.restore();}
   else{C.fillStyle='#090a0c';C.fillRect(x-5,y-2,3,2);C.fillRect(x+3,y-2,3,2);C.fillStyle='#d8d070';C.fillRect(x-4,y-2,1,1);C.fillRect(x+4,y-2,1,1);C.fillStyle='#9a8a64';for(const sx of [-7,-2,3,8]){C.fillRect(x+sx,y-3-fl,1,2);}}}
  for(const e of w.ents)if(e.k==='swoop'&&FOESPR.raptor[0].complete&&FOESPR.raptor[0].naturalWidth){const im=FOESPR.raptor[0],x=e.x-ox|0,y=e.y-oy|0+0,bob=((w.tick>>2)&1)?-1:1;C.save();C.translate(x,y+bob);if(e.d>0)C.scale(-1,1);C.drawImage(im,-(im.naturalWidth>>1),-(im.naturalHeight>>1),im.naturalWidth,im.naturalHeight);C.restore();}
  for(const e of w.ents)if(e.k==='swoop'&&!(FOESPR.raptor[0].complete&&FOESPR.raptor[0].naturalWidth)){const x=e.x-ox|0,y=e.y-oy|0,up=(w.tick>>2)&1,d=e.d,tip=up?-11:6;
   for(const sd of [-1,1])for(let k=0;k<=18;k++){const t=k/18,top=Math.round(y-2+(tip-(-2))*t),bot=Math.round(y+5+(tip+2-5)*t-((k%6)>2?0:1)),cx=x+sd*(3+k);C.fillStyle='#090a0c';C.fillRect(cx,top-1,1,bot-top+3);C.fillStyle=k%6===0?'#8a7276':'#5a4648';C.fillRect(cx,top,1,Math.max(1,bot-top+1));}
   C.fillStyle='#090a0c';C.fillRect(x-4,y-4,9,11);C.fillRect(x+d*5-2,y-5,6,6);C.fillStyle='#5a4648';C.fillRect(x-3,y-3,7,9);C.fillRect(x+d*5-1,y-4,4,4);C.fillStyle='#8a7276';C.fillRect(x-2,y-3,3,2);C.fillStyle='#e8321c';C.fillRect(x+d*6,y-3,1,1);C.fillStyle='#c8c0a4';C.fillRect(x+d*8+(d>0?0:-1),y-1,2,1);
   C.fillStyle='#090a0c';C.fillRect(x-3,y+6,2,3);C.fillRect(x+2,y+6,2,3);
   if(e.c){C.fillStyle='#090a0c';C.fillRect(x-4,y+8,8,11);C.fillStyle=e.c.hood;C.fillRect(x-3,y+9,6,4);C.fillStyle=e.c.skin;C.fillRect(x-3,y+13,6,5);}}
  for(const e of w.ents)if(e.k==='arrow'){const x=e.x-ox|0,y=e.y-oy|0;C.fillStyle=e.team<0?'#eb6f39':'#f7e5ac';C.fillRect(x-4,y,8,1);C.fillStyle='#575c62';C.fillRect(e.vx>0?x+3:x-4,y-1,1,3);}
  for(const e of w.ents){if(e.k==='boulder'){const x=e.x-ox|0,y=e.y-oy|0;C.fillStyle='#090a0c';C.fillRect(x-8,y-6,16,13);C.fillRect(x-6,y-8,12,17);C.fillStyle='#525559';C.fillRect(x-7,y-5,14,11);C.fillRect(x-5,y-7,10,15);C.fillStyle='#6a6f77';C.fillRect(x-5,y-6,6,3);C.fillStyle='#3b3d40';C.fillRect(x-1+Math.round(Math.cos(e.a)*3),y+Math.round(Math.sin(e.a)*3),3,2);C.fillRect(x-4,y+4,8,2);}
   if(e.k==='tongueFx'){C.strokeStyle='#822b39';C.lineWidth=2;C.beginPath();C.moveTo(e.x0-ox,e.y0-oy);C.lineTo(e.x1-ox,e.y1-oy);C.stroke();}if(e.k==='pot'){C.fillStyle='#090a0c';C.fillRect((e.x-ox|0)-3,(e.y-oy|0)-3,6,6);C.fillStyle='#db9016';C.fillRect((e.x-ox|0)-2,(e.y-oy|0)-2,4,4);}
   if(e.k==='tip'){C.strokeStyle='#14181c';C.lineWidth=5;C.beginPath();C.moveTo(e.x-ox,e.y-oy);C.lineTo(e.ex-ox,e.ey-oy);C.stroke();C.strokeStyle='#d8d2b8';C.lineWidth=3;C.beginPath();C.moveTo(e.x-ox,e.y-oy);C.lineTo(e.ex-ox,e.ey-oy);C.stroke();}
   if(e.k==='ring'){C.strokeStyle=e.l>6?'#b5a64b':'#b64c1e';C.lineWidth=2;C.beginPath();C.arc(e.x-ox,e.y-oy,e.r,0,TAU);C.stroke();}}
  for(const q of w.parts){C.fillStyle=q.c;C.fillRect(q.x-ox|0,q.y-oy|0,q.l>10?2:1,q.l>10?2:1);}
  C.globalCompositeOperation='lighter';for(const h of w.hz){if(THEME[w.def.theme].lavaHaz&&!h.water){for(let x=h.x0;x<h.x1;x+=38)C.drawImage(glow(th.glow),x-ox-32,h.y-oy-40,64,64);}}C.globalCompositeOperation='source-over';
  if(w.rule.dark){DKX.globalCompositeOperation='source-over';DKX.clearRect(0,0,VW,VIEWH);DKX.fillStyle='rgba(4,3,10,.97)';DKX.fillRect(0,0,VW,VIEWH);DKX.globalCompositeOperation='destination-out';const L=glow('rgba(255,255,255,1)'),hole=(x,y,r)=>DKX.drawImage(L,x-ox-r,y-oy-r,r*2,r*2);for(const g of w.gobs)if(w.alive(g))hole(g.x,g.y-8,34);for(const d of w.doors)hole(d.x,d.y-20,54);for(const h of w.hatches)hole(h.x,h.y-10,44);for(const t of w.traps)if(t.k==='jet')hole(t.x,t.y-20,40);C.drawImage(DK,v.x,0,v.w,VIEWH,v.x,0,v.w,VIEWH);}
  if(w.surgeT>0){C.fillStyle='rgba(120,60,170,'+(Math.min(1,w.surgeT/40)*(.12+.06*Math.sin(w.tick*.3)))+')';C.fillRect(v.x,0,v.w,VIEWH);}
  C.drawImage(vignette(),v.x,0,v.w,VIEWH);
  for(const f of w.floats)txt(C,f.s,f.x-ox,f.y-oy|0,f.c,{c:1});
  const P=(w.pl[i]);
  if(P&&!P.cpu)this.drawCursor(C,P,ox,oy);if(P&&P.cpu){const col=CLAN[1].ui,x=P.cx-ox|0,y=P.cy-oy|0;C.fillStyle=col;C.fillRect(x-1,y-1,3,3);}
  if(w.vs){const o=w.pl[1-i];if(!o.cpu){const c=CLAN[o.id].ui,x=o.cx-ox|0,y=o.cy-oy|0;C.globalAlpha=.6;C.fillStyle=c;C.fillRect(x-3,y,7,1);C.fillRect(x,y-3,1,7);C.globalAlpha=1;}}
  C.restore();
  if(w.vs){const lab=p.sel<8?skName(p.panel[p.sel])+' x'+p.skills[p.panel[p.sel]]:p.sel>=12?SPELLS[p.spells[p.sel-12]].n+' '+SPELLS[p.spells[p.sel-12]].vc+' '+RACES[p.race].mana:TRN[p.sel-8]+' '+TRC[p.sel-8]+' '+RACES[p.race].mana;txt(C,lab,v.x+5,4,CLAN[i].ui);txt(C,CLAN[i].name,v.x+v.w-5,4,'#fff',{r:1});}},
 drawCursor(C,p,ox,oy){const g=this.target(p),col=CLAN[p.id].ui,trick=p.sel>=8;let x=p.cx-ox|0,y=p.cy-oy|0,r=7;if(g){x=g.x-ox;y=g.y-7-oy;r=9;}
  if(trick){const rad=p.sel>=12?SPELLS[p.spells[p.sel-12]].r:[14,46,32,0][p.sel-8];C.strokeStyle=col;C.globalAlpha=.65;C.lineWidth=1;if(rad){C.beginPath();C.arc(x+.5,y+.5,rad,0,TAU);C.stroke();}C.globalAlpha=1;}
  const L=(a,b,w,h)=>{C.fillStyle='#090a0c';C.fillRect(a-1,b-1,w+2,h+2);};const seg=[[x-r,y-r,4,1],[x-r,y-r,1,4],[x+r-3,y-r,4,1],[x+r,y-r,1,4],[x-r,y+r,4,1],[x-r,y+r-3,1,4],[x+r-3,y+r,4,1],[x+r,y+r-3,1,4]];
  seg.forEach(s=>L(...s));C.fillStyle=g?'#fff':col;seg.forEach(s=>C.fillRect(...s));C.fillStyle=col;C.fillRect(x,y,1,1);},
 skillBtn(C,x,y,w,h,k,n,on,p,idx,dim){const hover=false;hits.push({x,y,w,h,btn:1,fn:()=>{p.sel=idx;sfx('move');this.lastPl=p.id;}});
  C.fillStyle=on?CLAN[p.id].ui:'#090a0c';C.fillRect(x,y,w,h);C.fillStyle=on?'#25252b':'#191a1d';C.fillRect(x+1,y+1,w-2,h-2);C.fillStyle=on?'#2f2629':'#232428';C.fillRect(x+1,y+1,w-2,1);
  C.globalAlpha=dim?.35:1;C.drawImage(ICON[k],x+((w-12)>>1),y+2);C.globalAlpha=1;},
 // ----- rewind (Easy, 1 player only): a copy of the world every second, jump back to the oldest -----
 cap(){const w=this.world,T=w.T,seen=new WeakMap(),st={};for(const k of Object.keys(w)){if(k==='T'||k==='def'||k==='rnd')continue;const v=w[k];st[k]=typeof v==='function'?v:dcl(v,seen);}return{st,rs:w.rnd.get(),m:T.m.slice(),t:T.t.slice(),decos:dcl(T.decos,seen),grow:T.grow?dcl(T.grow,seen):null};},
 snap(){this.snaps.push(this.cap());if(this.snaps.length>(this.world.T.m.length>1.2e6?6:9))this.snaps.shift();},
 canRewind(){const w=this.world;return !!(this.rw&&!this.rwAnim&&this.rwLeft>0&&this.snaps.length&&!w.over&&(this.paused||w.tick-this.snaps[0].st.tick>=TPS));},
 rewind(){if(!this.canRewind()){sfx('deny');return;}const w=this.world;this.rwAnim={ph:0,t:0,t0:w.time,t1:this.snaps[0].st.time,n:3};sfx('select');},
 rwStep(dt){const a=this.rwAnim,w=this.world;a.t+=dt;if(a.ph===0){const k=Math.min(1,a.t/1.3);w.time=Math.round(a.t0+(a.t1-a.t0)*(1-(1-k)*(1-k)));if(a.t>=1.3){this.doRewind();a.ph=1;a.t=0;a.n=3;sfx('select');}}else{const n=3-Math.floor(a.t);if(n>0&&n!==a.n){a.n=n;sfx('select');}if(a.t>=3){this.rwAnim=null;this.acc=0;sfx('assign');}}},
 rwDraw(C){const a=this.rwAnim,tri=(x,y,h,col)=>{C.fillStyle=col;for(const d of[0,h]){C.beginPath();C.moveTo(x+d,y+h/2);C.lineTo(x+d+h,y);C.lineTo(x+d+h,y+h);C.closePath();C.fill();}};
  if(a.ph===0){C.fillStyle='rgba(10,6,18,.3)';C.fillRect(0,0,VW,VIEWH);const f=Math.floor(a.t*18);for(let i=0;i<6;i++){const y=(f*37+i*53)%VIEWH|0,h=2+((f+i)%3)*2;C.fillStyle=i%2?'rgba(255,255,255,.22)':'rgba(120,200,255,.18)';C.fillRect(0,y,VW,h);}tri(14,12,12,'#fff');if((Math.floor(a.t*4)&1)===0)txt(C,'REWIND',46,14,'#fff',{s:2});tri(VW/2-30,VIEWH/2-20,30,'rgba(255,255,255,.85)');}
  else{C.fillStyle='rgba(10,6,18,.5)';C.fillRect(0,0,VW,VIEWH);const n=Math.max(1,3-Math.floor(a.t)),fr=a.t%1;txt(C,String(n),VW/2,VIEWH/2-26,fr<.15?'#fff':'#f0d16b',{c:1,s:7});txt(C,'GET READY',VW/2,VIEWH/2+24,'#fff',{c:1});}},
 doRewind(){const w=this.world,T=w.T,s=this.snaps[0],seen=new WeakMap(),st={};for(const k in s.st){const v=s.st[k];st[k]=typeof v==='function'?v:dcl(v,seen);}
  const pv=w.pl[0],keep={};for(const k of ['camX','camY','cx','cy','tx','ty','sel','kbd','edge','gi','run'])keep[k]=pv[k];Object.assign(w,st);Object.assign(w.pl[0],keep);w.rnd.set(s.rs);T.m.set(s.m);T.t.set(s.t);if(T.sandOn)T.sw=[0,0,T.w,T.h];T.decos=dcl(s.decos,seen);T.grow=s.grow?dcl(s.grow,seen):undefined;T.dirty.length=0;T.flushAll();if(w.onSpend)w.onSpend(w.pl[0]);this.clampCam(w.pl[0],this.views[0]);this.buildMini();
  this.snaps=[s];this.rwLeft--;this.acc=0;},
 rewindBtn(C,x,y,w,h){const ok=this.canRewind(),col=ok?'#f0d16b':'#48494e';hits.push({x,y,w,h,btn:1,fn:()=>this.rewind()});rrect(C,x,y,w,h,3,'#2c2236',col);
  if(h<20){txt(C,'REWIND '+this.rwLeft,x+(w>>1),y+((h-7)>>1),col,{c:1});return;}
  const cx=x+(w>>1)-(h>26?0:5),cy=y+(h>26?7:h>>1);C.fillStyle=col;for(const d of[0,6]){C.beginPath();C.moveTo(cx-6+d,cy);C.lineTo(cx+d,cy-5);C.lineTo(cx+d,cy+5);C.closePath();C.fill();}
  txt(C,this.rwLeft,h>26?x+(w>>1):x+w-8,h>26?y+h-11:y+((h-7)>>1),col,{c:h>26,r:h<=26});},
 // ----- rounded layouts: Compact and Touch -----
 btn2(C,x,y,w,h,label,fn,on){hits.push({x,y,w,h,btn:1,fn:()=>{fn();sfx('move');}});rrect(C,x,y,w,h,3,on?'#4a3560':'#2c2236',on?'#f0d16b':'#7e5a96');txt(C,label,x+(w>>1),y+((h-7)>>1),'#fff',{c:1});},
 skillBtn2(C,x,y,w,h,k,n,on,p,idx,dim,wide,ink){hits.push({x,y,w,h,btn:1,fn:()=>{p.sel=idx;sfx('move');this.lastPl=p.id;}});rrect(C,x,y,w,h,3,on?'#2f2629':'#232428',on?CLAN[p.id].ui:'#3a3b44');
  C.globalAlpha=dim?.35:1;const col=dim?'#48494e':(ink||'#fff');
  if(wide){C.drawImage(ICON[k],x+6,y+((h-12)>>1));txt(C,n,x+w-6,y+((h-14)>>1),col,{r:1,s:2});}else{C.drawImage(ICON[k],x+((w-12)>>1),y+3);txt(C,n,x+(w>>1)-1,y+h-11,col,{c:1});}C.globalAlpha=1;},
 statsOf(w,p){const gd=w.def.goal&&w.def.goal!=='home',clr=gd&&w.def.goal==='clear';return{l1:gd?'NESTS':'OUT',v1:gd?w.nests.filter(n=>!n.dead).length:w.gobs.filter(g=>w.alive(g)).length,l2:clr?'ENEMY':'HOME',v2:clr?w.mobs.filter(m=>!m.dead).length:p.saved+'/'+w.need,ok:!clr&&p.saved>=w.need};},
 topBar(C,w,p,H,big){const sec=Math.ceil(w.time/TPS),clk=w.def.noTime?'--:--':Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'),low=!w.def.noTime&&sec<=30,st=this.statsOf(w,p),ty=2+((H-7)>>1);
  rrect(C,2,2,VW-4,H,4,'rgba(9,10,12,.76)','#3a3b44');txt(C,st.l1,9,ty,'#818594');txt(C,st.v1,48,ty,'#fff',{r:1});txt(C,st.l2,58,ty,'#818594');txt(C,st.v2,118,ty,st.ok?'#9fdc40':'#fff',{r:1});
  if(w.moodOn){txt(C,'MOOD',128,ty,'#818594');C.fillStyle='#141517';C.fillRect(158,ty+1,40,5);C.fillStyle=['#777d45','#f0c36b','#e97721','#e72417'][p.moodT];C.fillRect(158,ty+1,Math.round(40*p.mood/100),5);}
  if(p.race==='rat')txt(C,'SCRAP '+p.scrap,206,ty,'#c6a054');if(w.rule.gust&&w.gustDir)txt(C,w.gustDir>0?'WIND >>':'<< WIND',300,ty,'#fff');
  txt(C,clk,VW/2+8,ty-(big?3:0),low?'#e8321c':'#f0d16b',{c:1,s:big?2:1});
  const bh=H-4;this.btn2(C,VW-64,4,29,bh,this.ff?'>>>':'>>',()=>{this.ff=!this.ff;},this.ff);this.btn2(C,VW-33,4,29,bh,'II',()=>{this.paused=true;this.psel=0;},false);},
 descLine(C,p,y){const sp=p.sel>=12&&SPELLS[p.spells[p.sel-12]],t=(sp?sp.n+' '+sp.c+': '+sp.s:skName(p.panel[p.sel])+': '+skDesc(p.panel[p.sel])).slice(0,64);rrect(C,3,y,Math.min(t.length*6+9,VW-6),11,4,'rgba(9,10,12,.8)');txt(C,t,7,y+2,sp?sp.col:'#c0c4d4');},
 spellGroup(C,w,p,x,y,bw,bh,wide){if(!p.spells.length)return x;const W=p.spells.length*(bw+1)+5;rrect(C,x,y-2,W,bh+4,4,'#181a3a','#515d9d');p.spells.forEach((k,s)=>{const ok=p.mana>=SPELLS[k].c&&p.spellCd<=0;this.skillBtn2(C,x+3+s*(bw+1),y,bw,bh,k,p.mana,p.sel===12+s,p,12+s,!ok,wide,'#9aa8ff');});return x+W+4;},
 hudCompact(C,w,y0){const p=w.pl[0];this.topBar(C,w,p,16,false);this.descLine(C,p,y0-12);
  p.panel.forEach((k,s)=>{const n=p.skills[k];this.skillBtn2(C,3+s*31,y0+4,30,32,k,n,p.sel===s,p,s,!n,false);});
  let x=this.spellGroup(C,w,p,254,y0+5,26,30,false);if(this.rw)this.rewindBtn(C,x,y0+4,32,32);this.drawMini(C,VW-129,y0+4,126,32);},
 hudTouch(C,w,y0){const p=w.pl[0];this.topBar(C,w,p,24,true);this.descLine(C,p,y0-12);
  p.panel.forEach((k,s)=>{const n=p.skills[k];this.skillBtn2(C,3+s*59,y0+3,58,30,k,n,p.sel===s,p,s,!n,true);});
  let x=this.spellGroup(C,w,p,3,y0+38,52,24,true);if(this.rw){this.rewindBtn(C,x,y0+36,54,28);x+=58;}this.drawMini(C,x,y0+36,VW-3-x,28);},
 drawHud(){const C=ctx,w=this.world,y0=VIEWH;C.fillStyle='#090a0c';C.fillRect(0,y0,VW,HUDH);C.fillStyle='#212226';C.fillRect(0,y0+1,VW,HUDH-1);C.fillStyle='#313236';C.fillRect(0,y0+1,VW,1);
  const sec=Math.ceil(w.time/TPS),clk=w.def.noTime?'--:--':Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'),low=!w.def.noTime&&sec<=30;
  if(w.vs){const[a,b]=w.pl;(b.cpu?[a]:[a,b]).forEach((p,i)=>{const ox=i?305:0,bw=22,cl=CLAN[i],cpu=p.cpu;
    p.panel.forEach((k,s)=>{const X=ox+1+s*bw;if(cpu){hits.length=hits.length;}this.skillBtn(C,X,y0+3,bw-1,20,k,p.skills[k],p.sel===s,p,s,!p.skills[k]);const n=p.skills[k];txt(C,n,X+(bw>>1)-1,y0+14,n?'#fff':'#48494e',{c:1});});
    if(p.sel<12)TR.forEach((k,s)=>{const X=ox+1+s*bw;this.skillBtn(C,X,y0+24,bw-1,20,k,0,p.sel===8+s,p,8+s,p.grog<TRC[s]);txt(C,TRC[s],X+(bw>>1)-1,y0+35,p.grog>=TRC[s]?'#777d45':'#48494e',{c:1});});else p.spells.forEach((k,s)=>{const X=ox+1+s*bw,c=SPELLS[k].vc,ok=p.grog>=c&&p.spellCd<=0;this.skillBtn(C,X,y0+24,bw-1,20,k,0,p.sel===12+s,p,12+s,!ok);txt(C,c,X+(bw>>1)-1,y0+35,ok?'#515d9d':'#48494e',{c:1});});
    txt(C,'HOME',ox+92,y0+25,cl.ui);txt(C,p.saved,ox+172,y0+25,'#fff',{r:1});if(w.moodOn){C.fillStyle='#141517';C.fillRect(ox+92,y0+43,84,2);C.fillStyle=['#777d45','#f0c36b','#e97721','#e72417'][p.moodT];C.fillRect(ox+92,y0+43,Math.round(84*p.mood/100),2);}txt(C,RACES[p.race].mana.slice(0,4),ox+92,y0+35,'#777d45');for(let g=0;g<9;g++){C.fillStyle=g<p.grog?'#777d45':'#141517';C.fillRect(ox+120+g*6,y0+35,5,6);}});
   if(b.cpu){txt(C,'CPU',312,y0+6,CLAN[1].ui);txt(C,'HOME',312,y0+18,'#fff');txt(C,b.saved,470,y0+18,'#fff',{r:1});txt(C,RACES[b.race].mana.slice(0,4),312,y0+30,'#777d45');for(let g=0;g<9;g++){C.fillStyle=g<b.grog?'#777d45':'#141517';C.fillRect(341+g*6,y0+30,5,6);}}
   this.drawMini(C,176,y0+4,128,28);txt(C,clk,240,y0+33+3,low?'#e8321c':'#fff',{c:1});}
  else if(this.lay===1)this.hudCompact(C,w,y0);else if(this.lay===2)this.hudTouch(C,w,y0);
  else{const p=w.pl[0],bw=29;p.panel.forEach((k,s)=>{const X=2+s*bw,n=p.skills[k];this.skillBtn(C,X,y0+3,bw-1,26,k,n,p.sel===s,p,s,!n);txt(C,n,X+(bw>>1)-1,y0+17,n?'#fff':'#48494e',{c:1});txt(C,s+1,X+3,y0+3+2,'#48494e',{sh:0});});
   {const sp=p.sel>=12&&SPELLS[p.spells[p.sel-12]],max=p.spells.length?29:39;txt(C,(sp?sp.n+' '+sp.c+': '+sp.s:skName(p.panel[p.sel])+': '+skDesc(p.panel[p.sel])).slice(0,max),4,y0+33,sp?sp.col:'#818594');p.spells.forEach((k,s)=>{const X=182+s*26,ok=p.mana>=SPELLS[k].c&&p.spellCd<=0;this.skillBtn(C,X,y0+30,25,14,k,0,p.sel===12+s,p,12+s,!ok);txt(C,p.mana,X+21,y0+36,ok?'#515d9d':'#48494e',{r:1});});}
   if(p.race==='rat')txt(C,'SCRAP '+p.scrap,240,y0+36,'#c6a054');if(w.rule.gust&&w.gustDir)txt(C,w.gustDir>0?'WIND >>':'<< WIND',VW/2,4,'#ffffff',{c:1});if(w.moodOn){const T2=['#777d45','#f0c36b','#e97721','#e72417'][p.moodT];txt(C,'MOOD',240,y0+25,'#62646e');C.fillStyle='#141517';C.fillRect(268,y0+25,38,6);C.fillStyle=T2;C.fillRect(268,y0+25,Math.round(38*p.mood/100),6);}const sx=240,gd=w.def.goal&&w.def.goal!=='home',nl=w.nests.filter(n=>!n.dead).length,fl=w.mobs.filter(m=>!m.dead).length;txt(C,gd?'NESTS':'OUT',sx,y0+5,'#62646e');txt(C,gd?nl:w.gobs.filter(g=>w.alive(g)).length,sx+66,y0+5,'#fff',{r:1});txt(C,gd&&w.def.goal==='clear'?'ENEMY':'HOME',sx,y0+15,'#62646e');txt(C,gd&&w.def.goal==='clear'?fl:p.saved+'/'+w.need,sx+66,y0+15,p.saved>=w.need?'#777d45':'#fff',{r:1});
   button(C,312,y0+3,30,12,this.ff?'>>>':'>>',()=>{this.ff=!this.ff;},{on:this.ff});button(C,312,y0+17,30,12,'II',()=>{this.paused=true;this.psel=0;});
   txt(C,clk,342,y0+33+3,low?'#e8321c':'#fff',{r:1});this.drawMini(C,348,y0+4,128,40);if(this.rw)this.rewindBtn(C,VW-57,3,54,13);}},
 drawMini(C,bx,by,bw,bh){const w=this.world;if(++this.miniT%20===0)this.buildMini();const[mw,mh]=this.md,x=bx+((bw-mw)>>1),y=by+((bh-mh)>>1);C.fillStyle='#090a0c';C.fillRect(x-1,y-1,mw+2,mh+2);C.drawImage(this.mini,x,y);const T=w.T,sx=mw/T.w,sy=mh/T.h;
  for(const g of w.gobs){if(!w.alive(g))continue;C.fillStyle=CLAN[g.team].ui;C.fillRect(x+g.x*sx|0,y+g.y*sy-1|0,1,2);}for(const d of w.doors){C.fillStyle=CLAN[d.team].ui;C.fillRect(x+d.x*sx-1|0,y+d.y*sy-3|0,3,3);}C.fillStyle='#e81717';for(const m of w.mobs)if(!m.dead)C.fillRect(x+m.x*sx|0,y+m.y*sy-1|0,1,2);for(const n of w.nests)if(!n.dead)C.fillRect(x+n.x*sx-1|0,y+n.y*sy-3|0,3,3);
  w.pl.forEach((p,i)=>{const v=this.views[i];C.strokeStyle=CLAN[i].ui;C.lineWidth=1;C.strokeRect((x+p.camX*sx|0)+.5,(y+p.camY*sy|0)+.5,Math.min(mw-1,v.w*sx|0),Math.min(mh-1,VIEWH*sy|0));});
  hits.push({x,y,w:mw,h:mh,btn:1,fn:()=>{const p=w.pl[this.lastPl];if(p.cpu)return;const[nx,ny]=[(pointerX-x)/sx,(pointerY-y)/sy];const v=this.views[this.lastPl];p.camX=nx-v.w/2;p.camY=ny-VIEWH/2;p.kbd=0;this.clampCam(p,v);}});},
 draw(){const C=ctx,w=this.world;hits.length=0;this.views.forEach((v,i)=>{if(v.w>0)this.drawView(i);});if(w.vs&&this.views[1].w>0){C.fillStyle='#090a0c';C.fillRect(239,0,2,VIEWH);}this.drawHud();
  if(!w.vs&&w.tick<90){const t=w.def.name;txt(C,t,VW/2,14,'#f0d16b',{c:1,s:2});txt(C,w.def.hint,VW/2,32,'#fff',{c:1});}
  if(w.vs&&w.tick<110&&!this.test){txt(C,'SABOTAGE!',VW/2,22,'#f0d16b',{c:1,s:3});}
  if(w.bannerT>0&&!this.paused){const b=w.banner,bw=b.length*12+20;C.fillStyle='rgba(10,6,18,.8)';C.fillRect((VW-bw)/2|0,40,bw,24);txt(C,b,VW/2,45,'#f0d16b',{c:1,s:2});}
  if(this.rwAnim)this.rwDraw(C);
  if(this.test&&!this.paused)txt(C,'TEST PLAY - ESC TO RETURN',VW/2,VIEWH-11,'#f0d16b',{c:1});
  if(this.quitT>.15){const q=clamp(this.quitT/1.5,0,1);C.fillStyle='rgba(10,6,18,.86)';C.fillRect(VW/2-72,62,144,22);txt(C,'KEEP HOLDING TO QUIT',VW/2,66,'#f0d16b',{c:1});C.fillStyle='#e94121';C.fillRect(VW/2-66,77,132*q,3);}
  if(this.paused){C.fillStyle='rgba(10,6,18,.7)';C.fillRect(0,0,VW,VIEWH);hits.length=0;txt(C,'PAUSED',VW/2,44,'#f0d16b',{c:1,s:2});const it=this.pauseItems();it.forEach((e,i)=>{const y=74+i*18;button(C,VW/2-64,y,128,15,e[0],()=>{this.psel=i;e[1]();sfx('select');},{on:i===this.psel,col:i===this.psel?'#f0d16b':'#fff'});});}}};

const[DK,DKX]=mk(VW,VH);
// ---------- results ----------
const Result={t:0,show(w,ser){this.w=w;this.ser=ser;this.t=0;
  if(ser){const[a,b]=w.pl;this.win=a.saved>b.saved?0:b.saved>a.saved?1:-1;if(this.win>=0)ser.wins[this.win]++;else ser.draws++;ser.i++;this.done=ser.custom||ser.wins[0]>=2||ser.wins[1]>=2;if(PackRun&&ser.custom&&this.win===0)packClear();playSong('win');}
  else{const p=w.pl[0],gd=w.def.goal;this.pass=gd&&gd!=='home'?!!w.won:p.saved>=w.need;this.practice=!!w.trial;this.score=runScore(w,this.pass);const key=(CustomDef?'map:'+w.def.name:CampaignSet==='war'?'war'+CampaignIdx:ck(CampaignIdx))+'/'+w.diff.k+(w.classic?'/c':'');this.best=(SAVE.scores[key]||{}).score||0;this.isBest=this.pass&&!w.trial&&this.score>this.best;if(this.isBest){SAVE.scores[key]={score:this.score,race:p.race,diff:w.diff.k,classic:w.classic?1:0,at:Date.now()};persist();}this.manaWon=0;if(this.pass&&!CustomDef&&!w.trial){if(!SAVE.cleared[ck(CampaignIdx)]&&!w.classic&&CampaignSet!=='free'){const r=p.race;SAVE.mana[r]=Math.min(9,poolMana(r)+1);this.manaWon=1;}SAVE.cleared[ck(CampaignIdx)]=1;persist();}if(CampaignSet==='free'&&!CustomDef&&!w.trial)freeLog(w,this.pass);if(PackRun&&this.pass&&!this.practice)packClear();playSong(this.pass?'win':'lose');}},
 next(){if(PackRun)return packNext(this);sfx('select');if(this.ser&&this.ser.custom)go(()=>setScene(PackRun?PackPlay:MapsScene));else if(!this.ser&&CustomDef)go(()=>(this.pass&&!this.practice)?setScene(PackRun?PackPlay:MapsScene):setScene(BriefScene));else if(this.ser){if(this.done)go(()=>{TitleScene.menu=1;setScene(TitleScene);});else go(()=>setScene(BriefScene));}else if(!this.ser&&CampaignSet==='free'&&this.pass&&!this.practice)go(()=>setScene(FreeScene));else if((this.pass&&!this.practice)&&CampaignIdx<campList().length-1){CampaignIdx++;go(()=>setScene(BriefScene));}else if((this.pass&&!this.practice))go(()=>setScene(LevelScene));else go(()=>setScene(BriefScene));},
 update(dt){this.t+=dt;if(this.t>1&&anyStart())this.next();if(goBack())go(()=>{if(CustomDef||(this.ser&&this.ser.custom))setScene(PackRun?PackPlay:MapsScene);else if(CampaignSet==='free'&&!this.ser)setScene(FreeScene);else{TitleScene.menu=1;setScene(TitleScene);}});},
 draw(){const C=ctx,w=this.w;drawBackdrop(C,backdrop(w.def.theme,w.under),0,VW,this.t*8,0,0);C.fillStyle='rgba(10,6,18,.72)';C.fillRect(0,0,VW,VH);hits.length=0;const f=this.t*12|0;
  if(this.ser){const[a,b]=w.pl,s=this.ser,txtW=this.win<0?'DEAD HEAT':(this.done&&!s.custom?CLAN[this.win].name+' WIN THE SERIES':CLAN[this.win].name+' TAKE THE ROUND');txt(C,txtW,VW/2,26,this.win<0?'#fff':CLAN[this.win].ui,{c:1,s:2});
   [a,b].forEach((p,i)=>{const x=i?340:140;gobSprite(C,i,this.win===i?'home':this.win<0?'shrug':'splat',this.win===i?f:this.win<0?f:3,i?-1:1,x,110);txt(C,CLAN[i].name,x,120,CLAN[i].ui,{c:1});txt(C,p.saved,x,134,'#fff',{c:1,s:3});txt(C,'HOME',x,160,'#62646e',{c:1});txt(C,`STOLEN ${p.stolen}  LOST ${p.lost}`,x,172,'#62646e',{c:1});});
   txt(C,'SERIES',VW/2,120,'#62646e',{c:1});txt(C,s.wins[0]+' - '+s.wins[1],VW/2,134,'#fff',{c:1,s:2});}
  else{const p=w.pl[0],d=w.def;const R=RACES[w.sides[0].race],say=R.say||RACES.goblin.say;const gd=d.goal&&d.goal!=='home';if(this.manaWon)txt(C,'+1 '+R.mana+' FOR YOUR SPELLS',VW/2,18,'#515d9d',{c:1});txt(C,gd?(this.pass?'MAP CLEARED!':w.isClear()?'NOT ENOUGH '+R.n:'THE ENEMY HOLDS'):this.pass?R.n+' HOME!':'NOT ENOUGH '+R.n,VW/2,30,this.pass?'#777d45':'#e94121',{c:1,s:2});for(let i=0;i<Math.min(p.saved,20);i++)gobSprite(C,0,this.pass?'home':'walk',f+i,1,VW/2-(Math.min(p.saved,20)*8)+i*16+8,96);txt(C,d.goal==='clear'?(this.pass?'THE MAP IS YOURS':'THE NESTS LIVE ON'):`YOU GOT ${p.saved} HOME`,VW/2,114,'#fff',{c:1,s:2});txt(C,gd?`${w.nests.filter(n=>!n.dead).length} NESTS AND ${w.mobs.filter(m=>!m.dead).length} ENEMIES LEFT`:`YOU NEEDED ${w.need} OF ${d.n*Math.max(1,d.hatch.length)}`,VW/2,136,'#62646e',{c:1});txt(C,this.practice?'PRACTICE RUN: NO SCORE':`SCORE ${this.score}`+(this.isBest?'  NEW BEST!':this.best?`  BEST ${this.best}`:''),VW/2,176,this.isBest?'#777d45':'#fff',{c:1});txt(C,w.diff.n+(w.classic?' CLASSIC':''),VW/2,188,'#62646e',{c:1});if(this.pass&&d.post&&d.post.length){const pg=Math.floor(this.t/2.5)%Math.ceil(d.post.length/3);d.post.slice(pg*3,pg*3+3).forEach((q,i)=>txt(C,q,VW/2,148+i*9,'#f0c36b',{c:1}));}else txt(C,this.pass?(p.saved>=d.n*Math.max(1,d.hatch.length)?say[0]:say[1]):say[2],VW/2,156,'#f0c36b',{c:1});}
  const lab=PackRun?((this.ser?this.win===0:this.pass&&!this.practice)?(packLast()?'PACK COMPLETE':'NEXT MAP'):'TRY AGAIN'):CustomDef?(this.pass?'MY MAPS':'TRY AGAIN'):this.ser?(this.done?(this.ser.custom?'MY MAPS':'BACK TO MENU'):'NEXT ROUND'):this.pass&&!this.practice?(CampaignIdx<campList().length-1?(CampaignSet==='free'?'NEXT MAP':'NEXT LEVEL'):(CampaignSet==='free'?'ALL MAPS':'ALL LEVELS')):'TRY AGAIN';button(C,VW/2-56,214,112,18,lab,()=>this.next());}};

// ---------- loop ----------
function fit(){const a=innerWidth,b=innerHeight,s=Math.min(a/VW,b/VH),w=Math.floor(VW*s),h=Math.floor(VH*s);cv.style.width=w+'px';cv.style.height=h+'px';scanEl.style.width=w+'px';scanEl.style.height=h+'px';document.getElementById('turn').hidden=!(b>a*1.15);}
addEventListener('resize',fit);fit();
let lastT=performance.now();
function frame(now){const dt=Math.min(.05,(now-lastT)/1000);lastT=now;clock+=dt;PAD=pads();
 if(!(fadeNext&&fadeDir>0))scene.update(dt);
 ctx.setTransform(RS,0,0,RS,0,0);ctx.imageSmoothingEnabled=false;scene.draw();
 for(const k in press)delete press[k];
 if(fadeDir){fade=clamp(fade+fadeDir*dt*3.2,0,1);if(fadeDir>0&&fade>=1){const f=fadeNext;fadeNext=null;f();fadeDir=-1;}else if(fadeDir<0&&fade<=0)fadeDir=0;}
 if(fade>0){const lv=Math.ceil(fade*7)/7;ctx.fillStyle=`rgba(0,0,0,${lv})`;ctx.fillRect(0,0,VW,VH);}
 requestAnimationFrame(frame);}
// test hook
window.__GS={FREE_MAPS,FREE_TIERS,freePlan,FreeScene,freeLog,LevelScene,get CampaignSet(){return CampaignSet;},get CampaignRace(){return CampaignRace;},get CampaignClan(){return CampaignClan;},get FreeUnlock(){return FreeUnlock;},get CampaignIdx(){return CampaignIdx;},showBrief(d,race){if(race)CampaignRace=race;CustomDef=d;setScene(BriefScene);},CTL,ctlList,get PAD(){return PAD;},get PackRun(){return PackRun;},StoreDB,PACK_MAX,packToFileZ,packData,importPackData,fetchLinkText,normLink,get Result(){return Result;},get Series(){return Series;},PackStore,importPackFile,packToFile,mapSig,packMap,unpackMap,cleanMap,mapsToFile,genMap,toDef,Store,SAVE,DIFFS,runScore,WAR_LEVELS,ImpArt,toDef,Store,LEVELS,RACE_LEVELS,RACES,ARENAS,World,Play,TitleScene,go,setScene,setSides,simulate(def,vs,botTeams){const w=new World(def,{vs,quiet:true});w.pl.forEach(p=>{if(botTeams===undefined||botTeams.includes(p.id))p.bot=def.plan;});let n=0;while(!w.over&&n++<20000)w.step();return{name:def.name,saved:w.pl.map(p=>p.saved),lost:w.pl.map(p=>p.lost),need:def.need,ticks:n};}};
