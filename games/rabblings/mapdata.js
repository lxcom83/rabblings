// Rabblings map rules: blank maps, the proof fingerprint, map checks and what the engine loads
function blankMap(style){const m=JSON.parse(JSON.stringify(MAPDEF));m.style=style||'puzzle';const w=m.w;
 if(style==='battle'){m.mode='mirror';m.w=960;m.time=210;m.n=30;m.ops=[['B',1,0,230,960,70],['S','wall',300,230]];m.objs=[{k:'hatch',x:90,y:150,dir:1},{k:'door',x:420,y:230}];m.skills={climb:5,flap:5,boom:5,block:4,build:7,bash:5,pick:4,dig:5};m.theme='forge';}
 else if(style==='hybrid'){m.ops=[['B',1,0,230,w,70],['B',1,100,130,380,30]];m.objs=[{k:'hatch',x:160,y:60,dir:1},{k:'door',x:700,y:230},{k:'hole',x:600,y:210,awake:1}];m.theme='mine';}
 else{m.w=640;m.ops=[['B',1,0,220,640,80]];m.objs=[{k:'hatch',x:100,y:150,dir:1},{k:'door',x:400,y:220}];}
 return m;}
// a map's stable fingerprint: changing the map clears its proof
function mapSig(m){const k=[m.w,m.h,m.mode,m.n,m.need,m.time,m.rate,m.skills,m.skills2,m.ops.filter(o=>o[0]!=='D'||(DECOR[o[1]]&&DECOR[o[1]].kind==='solid')),m.objs.map(({uid,...o})=>o),m.rules,m.trig,m.floodRate];if((m.goal&&m.goal!=='home')||m.swap||m.morale===0||m.wild)k.push(m.goal,m.swap,m.morale,m.wild);if(m.mana!==undefined&&m.mana!==2)k.push('mana',m.mana);if(m.pics&&m.pics.length)k.push(m.pics.map(p=>p.run));const s=JSON.stringify(k);let h=5381;for(let i=0;i<s.length;i++)h=(h*33+s.charCodeAt(i))|0;return h;}
function mapProblems(m){const P=[],ms=k=>m.objs.filter(o=>o.k===k),H=ms('hatch'),D=ms('door'),far=m.objs.filter(o=>o.x<0||o.y<0||o.x>=m.w||o.y>=m.h).length;if(far)P.push(far+(far>1?' objects are':' object is')+' outside the map.');const two=m.mode==='free';
 const gl=m.mode==='solo'&&m.goal&&m.goal!=='home';if(!H.length)P.push('Add a hatch so troops can enter.');if(!D.length&&m.goal!=='clear')P.push('Add a hut so troops can get home.');if(gl&&!m.objs.some(o=>o.k==='nest'||o.k==='foe'))P.push('Add a nest or an enemy to clear.');
 if(two){if(!H.some(o=>o.team===1))P.push('Player 2 needs a hatch.');if(!D.some(o=>o.team===1))P.push('Player 2 needs a hut.');}
 if(m.mode==='solo'&&m.goal!=='clear'&&m.need>m.n*H.length)P.push('The save target is more than the troops released.');
 const w=ms('warp');if(!m.imported)for(const p of [0,1,2])if(w.filter(o=>o.p===p).length===1)P.push('A warp stone needs its partner.');
 return P;}
function toDef(m){const d={mana:m.mana===undefined?2:m.mana,name:m.name,hint:m.hint||'A custom map.',theme:m.theme,w:m.w,h:m.h,n:m.n,need:m.need,rate:m.rate,time:m.time,seed:(m.w*7+m.ops.length)|0,skills:m.skills,skills2:m.sep?m.skills2:null,mirror:m.mode==='mirror'?1:0,free2p:m.mode==='free',versus:m.mode!=='solo',noTricks:m.noTricks,custom:1,by:m.by||'',morale:m.morale===0?0:1,wild:m.wild?1:0,goal:m.mode==='solo'?m.goal:'home',swap:m.swap,nests:[],foes:[],gfx:ImpArt.ready(m),open:m.imported?1:0,maxUp:m.imported?12:0,fall:m.imported?126:0,
  race:m.race,hatch:[],doors:[],haz:[],traps:[],gates:[],zones:[],holes:[],rules:m.rules.slice(),trig:m.trig.slice(),floodRate:m.floodRate,plan:m.plan||[],build(S){S.pics=m.pics;S.run(m.ops);}};
 const mir=m.mode==='mirror',W=m.w-1;
 for(const o of m.objs)switch(o.k){
  case'hatch':d.hatch.push({x:o.x,y:o.y,dir:o.dir||1,team:o.team||0,ghost:o.ghost});break;
  case'door':d.doors.push({x:o.x,y:o.y,team:o.team||0,raw:o.raw,rw:o.rw,ry:o.ry,rh:o.rh});break;
  case'pool':d.haz.push(o.h?{x0:o.x,x1:o.x+o.w,y:o.y,y1:o.y+o.h}:{x0:o.x,x1:o.x+o.w,y:o.y});if(mir)d.haz.push({x0:W-o.x-o.w,x1:W-o.x,y:o.y});break;
  case'nest':{const n={x:o.x,y:o.y,kind:o.kind,per:o.per,hp:o.hp,cap:o.cap};d.nests.push(n);if(mir)d.nests.push({...n,x:W-o.x});break;}
  case'foe':{const f={x:o.x,y:o.y,kind:o.kind,dir:o.dir};d.foes.push(f);if(mir)d.foes.push({...f,x:W-o.x,dir:-(o.dir||1)});break;}
  case'gate':d.gates.push({x:o.x,y:o.y,w:o.w,h:o.h});if(mir)d.gates.push({x:W-o.x-o.w+1,y:o.y,w:o.w,h:o.h});break;
  case'zone':d.zones.push({id:o.id||1,x:o.x,y:o.y,w:o.w,h:o.h});if(mir)d.zones.push({id:o.id||1,x:W-o.x-o.w+1,y:o.y,w:o.w,h:o.h});break;
  case'hole':d.holes.push({x:o.x,y:o.y,awake:o.awake});if(mir)d.holes.push({x:W-o.x,y:o.y,awake:o.awake});break;
  default:d.traps.push({...o});if(mir)d.traps.push({...o,x:W-o.x,dir:-(o.dir||1)});}
 return d;}
// everything loaded from a code or a file is checked, because it may have been edited by hand
function cleanMap(x){if(!x||!Array.isArray(x.ops)||!Array.isArray(x.objs))throw new Error('That map data is damaged.');const m={...JSON.parse(JSON.stringify(MAPDEF)),...x},num=(v,lo,hi,d)=>clamp(Number.isFinite(+v)?+v:d,lo,hi);
 m.name=String(m.name||'NEW MAP').toUpperCase().slice(0,24);m.hint=String(m.hint||'A custom map.').slice(0,120);if(!THEME[m.theme])m.theme='bog';if(!['puzzle','battle','hybrid'].includes(m.style))m.style='puzzle';if(!['solo','mirror','free'].includes(m.mode))m.mode='solo';
 m.w=num(m.w,480,3200,800);m.h=num(m.h,240,600,300);m.n=num(m.n,5,50,20);m.need=num(m.need,1,50,12);m.rate=num(m.rate,12,80,32);m.time=num(m.time,60,600,240);m.floodRate=num(m.floodRate,2,30,10);m.mana=num(m.mana,0,9,2);
 const sk=o=>{const r={};SK.forEach(k=>r[k]=num(o&&o[k],0,50,0));return r;};m.skills=sk(m.skills);if(m.skills2)m.skills2=sk(m.skills2);
 m.pics=(Array.isArray(m.pics)?m.pics:[]).filter(p=>p&&Number.isInteger(p.w)&&Number.isInteger(p.h)&&p.w>0&&p.h>0&&p.w<=3200&&p.h<=600&&typeof p.run==='string'&&p.run.length<4e6&&Array.isArray(p.pal)&&p.pal.length<=64&&p.pal.every(c=>/^#[0-9a-f]{6}$/i.test(c))).slice(0,8);
 m.ops=m.ops.filter(o=>Array.isArray(o)&&['L','B','E','S','G','D','I'].includes(o[0])&&(o[0]!=='S'||STAMPS[o[1]])&&(o[0]!=='G'||GEN.some(g=>g[0]===o[1]))&&(o[0]!=='D'||DECOR[o[1]])&&(o[0]!=='I'||m.pics[o[1]])&&o.slice(1).every(v=>typeof v==='number'||o[0]==='S'||o[0]==='G'||(o[0]==='D'&&v===o[1])));
 const kinds=OBJ.map(a=>a[0]);m.objs=m.objs.filter(o=>o&&kinds.includes(o.k)&&Number.isFinite(o.x)&&Number.isFinite(o.y));
 m.rules=(Array.isArray(m.rules)?m.rules:[]).filter(r=>RULES.some(a=>a[0]===r));m.trig=(Array.isArray(m.trig)?m.trig:[]).filter(t=>t&&WHEN.some(a=>a[0]===t.w)&&ACTIONS.some(a=>a[0]===t.a)).slice(0,6).map(t=>({...t,n:num(t.n,1,999,1)}));
 m.by=String(m.by||'').toUpperCase().slice(0,24);m.morale=m.morale?1:0;m.wild=m.wild?1:0;if(!GOALS.some(g=>g[0]===m.goal))m.goal='home';if(m.swap&&typeof m.swap==='object'){const q={};for(const k of SK)if(['sword','bow'].includes(m.swap[k]))q[k]=m.swap[k];m.swap=q;}else m.swap=null;for(const o of m.objs)if(o.k==='nest'||o.k==='foe'){if(!FOE_KINDS.includes(o.kind))o.kind='skel';if(o.k==='nest'){o.per=num(o.per,60,600,200);o.hp=num(o.hp,1,30,8);o.cap=num(o.cap,1,6,3);}}
 if(!Array.isArray(m.plan))m.plan=null;if(!RACES[m.race]||!RACES[m.race].play)delete m.race;return upgradeMap(m);}
