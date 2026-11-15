// places Rabblings objects on generated terrain, using the routes in the profile
const GEN_DIR=[['auto','MIX IT UP'],['lr','LEFT TO RIGHT'],['rl','RIGHT TO LEFT'],['down','TOP TO BOTTOM'],['up','BOTTOM TO TOP'],['back','THERE AND BACK']],GEN_ANY=[['auto','ANY'],...GEN],GEN_AMT=[[0,'NONE'],[1,'FEW'],[2,'SOME'],[3,'MANY']],GEN_POOL=[[0,'NONE'],[1,'AUTO'],[2,'ALWAYS']];
function genLayout(m,o){const t=TPL.find(a=>a.k===o.tpl)||TPL[0],p=o.parts,r=rng((o.seed|0)+99),pickOf=a=>a[r()*a.length|0],whole=p.ter&&p.pts&&p.ene;if(whole&&t.mode)m.mode=t.mode;
 const W=m.w,H=m.h,mir=m.mode==='mirror',two=m.mode==='free',f=new Terrain(W,H,m.theme,7),S=new Shaper(f,7);let info=null;
 if(p.ter){const type=o.type&&o.type!=='auto'?o.type:pickOf(t.t);m.ops=[['G',type,o.seed]];info=genTerrain(S,type,o.seed);m.kind={cavern:'cave',chasm:'cave',ruins:'cave',caves:'cave',labyrinth:'cave',shafts:'cave',foundry:'built'}[type]||'open';}else{if(typeof ImpArt!=='undefined')f.gfx=ImpArt.ready(m);S.run(m.ops);}
 if(mir)for(let y=0;y<H;y++)for(let x=0;x<W>>1;x++)f.m[y*W+W-1-x]=f.m[y*W+x];
 const lim=mir?(W>>1)-10:W-9,drop=k=>{m.objs=m.objs.filter(a=>!GEN_KINDS[k].includes(a.k));};
 // where water sits decides which ground counts as walkable
 let pool=null;if(p.poo){drop('poo');if(o.pool!==0&&info&&info.pool)pool=info.pool;}else{const e=m.objs.find(a=>a.k==='pool');if(e)pool=e.y;}
 const floor=()=>pool===null?H-6:pool-2,ledges=x=>{const L=[],top=floor();for(let y=14;y<top;y++)if(f.solid(x,y)&&!f.solid(x,y-1)&&!f.solid(x,y-8)&&!f.solid(x,y-14)&&!(info&&info.tanks&&info.tanks.some(t=>x>=t[0]-6&&x<=t[1]+6&&y>=t[2]-8)))L.push(y);return L;},flat=(x,y)=>f.solid(x-8,y+2)&&f.solid(x+8,y+2)&&!f.solid(x-8,y-5)&&!f.solid(x+8,y-5),
  spot=(x,d,how)=>{for(let i=0;i<W;i+=6){const a=clamp(x+d*i,8,lim),L=ledges(a).filter(y=>flat(a,y));if(L.length)return[a,how==='low'?L[L.length-1]:how==='any'?pickOf(L):L[0]];}return null;},
  best=(a,b,sign)=>{let bx=null;for(let x=a;x<=b;x+=12){for(const y of ledges(x))if(flat(x,y)&&(!bx||(y-bx[1])*sign>0))bx=[x,y];}return bx;};
 const air=(x,y)=>{let n=0;while(n<64&&y-n-1>0&&!f.solid(x,y-n-1))n++;return n;},hatchAt=(x,y,dir,team)=>{const h={k:'hatch',x,y:Math.max(12,y-Math.round(clamp(air(x,y)*.6,10,64))),dir};if(team!==undefined)h.team=team;return h;};
 if(p.pts){drop('pts');const x0=Math.round(W*.09),xE=Math.round(W*(mir||two?.44:.9));let a=spot(x0,1,t.from)||[x0,H-30],b=t.to==='top'?spot(xE,-1,'top'):t.to==='low'?spot(xE,-1,'low'):best(Math.round(W*(mir||two?.24:.5)),xE,-1)||spot(xE,-1,'top');let c=b||[xE,H-30];
  // route direction (1 player maps): not every map runs left to right. MIX IT UP rolls one from the seed; tall maps lean to up and down routes
  if(!mir&&!two){let dir=o.dir&&o.dir!=='auto'?o.dir:null;if(!dir){const q=r(),tall=H>=380;dir=tall?(q<.35?'down':q<.65?'up':q<.8?'back':q<.9?'rl':'lr'):(q<.3?'lr':q<.55?'rl':q<.72?'down':q<.88?'up':'back');}
   const xa=Math.round(W*(.14+r()*.72)),far=x=>x<W/2?Math.round(W*(.62+r()*.28)):Math.round(W*(.1+r()*.28));let A=null,C=null;
   if(dir==='rl'){A=spot(xE,-1,t.from);C=t.to==='low'?spot(x0,1,'low'):spot(x0,1,'top');}
   else if(dir==='down'){A=spot(xa,1,'top');C=spot(far(xa),-1,'low');}
   else if(dir==='up'){A=spot(xa,1,'low');C=spot(far(xa),-1,'top');}
   else if(dir==='back'){A=spot(x0,1,'top');C=spot(Math.round(W*.16),1,'low');}
   if(A&&C&&(Math.abs(A[0]-C[0])>=90||Math.abs(A[1]-C[1])>=60)&&(dir==='rl'||Math.abs(A[1]-C[1])>=50)){a=A;c=C;}}
  if(two){m.objs.push(hatchAt(a[0],a[1],1,0),{k:'door',x:c[0],y:c[1],team:0});const a2=spot(W-1-a[0],-1,t.from)||[W-1-a[0],a[1]],c2=spot(W-1-c[0],1,'top')||[W-1-c[0],c[1]];m.objs.push(hatchAt(a2[0],a2[1],-1,1),{k:'door',x:c2[0],y:c2[1],team:1});}
  else m.objs.push(hatchAt(a[0],a[1],c[0]>=a[0]?1:-1),{k:'door',x:c[0],y:c[1]});}
 const hs=m.objs.filter(a=>a.k==='hatch'),ds=m.objs.filter(a=>a.k==='door'),ends=[...hs,...ds],lo=Math.min(...ends.map(a=>a.x),W*.09)+60,hi=Math.max(...ends.filter(a=>!mir||a.x<W>>1).map(a=>a.x),mir?W*.44:W*.9)-50;
 if(p.poo&&o.pool===2&&pool===null){let dip=0;for(let x=8;x<lim;x+=8){const L=ledges(x);if(L.length)dip=Math.max(dip,L[L.length-1]);}const deep=Math.max(...ds.map(a=>a.y),...ends.map(a=>a.y));pool=Math.min(H-8,Math.max(dip-6,deep+6));}
 if(p.poo&&pool!==null)m.objs.push({k:'pool',x:0,y:pool,w:mir?(W>>1)-1:W-1});
 // living types carve sealed tanks: each gets its own bounded pool, never a flood line
 if(p.poo&&o.pool!==0&&info&&info.tanks)for(const t of info.tanks)if(!mir||t[1]<W>>1)m.objs.push({k:'pool',x:t[0],y:t[2],w:t[1]-t[0],h:t[3]-t[2]});
 const clear=(x,gap,kinds)=>!ends.some(a=>Math.abs(a.x-x)<56)&&!m.objs.some(a=>kinds.includes(a.k)&&Math.abs(a.x-x)<gap),span=Math.max(120,hi-lo);
 if(p.trp){drop('trp');const n=[0,Math.max(1,Math.round(W/420)),Math.max(2,Math.round(W/260)),Math.max(3,Math.round(W/170))][o.traps|0];for(let i=0;i<n;i++){const s=spot(Math.round(lo+(i+.2+r()*.6)/n*span),1,'any');if(s&&clear(s[0],30,[...GEN_KINDS.trp,...GEN_KINDS.mch])){const k=pickOf(t.tr),e={k,x:s[0],y:s[1]};if(k==='jet'||k==='press')e.per=70;m.objs.push(e);}}}
 if(p.mch){drop('mch');const n=[0,Math.max(1,Math.round(W/600)),Math.max(2,Math.round(W/380)),Math.max(3,Math.round(W/240))][o.mach|0],both=[...GEN_KINDS.trp,...GEN_KINDS.mch],toward=x=>{const e=ds.find(a=>!a.team)||ds[0];return e&&e.x<x?-1:1;};let pairs=0;
  for(let i=0;i<n;i++){const k=pickOf(t.ma||['spring','catapult','warp']),x0=Math.round(lo+(i+.2+r()*.6)/n*span),s=spot(x0,1,'any');if(!s||!clear(s[0],36,both))continue;
   if(k==='warp'){if(pairs>=3)continue;const q=spot(Math.round(lo+r()*span),1,'any');if(!q||Math.abs(q[0]-s[0])<120||!clear(q[0],36,both))continue;m.objs.push({k:'warp',x:s[0],y:s[1],p:pairs},{k:'warp',x:q[0],y:q[1],p:pairs});pairs++;}
   else if(k==='catapult')m.objs.push({k,x:s[0],y:s[1],dir:toward(s[0]),pow:pickOf([3.75,4.5,5.25])});else if(k==='belt'){const bw=pickOf([40,60]);if(f.solid(s[0]+bw,s[1]+2)&&!f.solid(s[0]+bw,s[1]-5))m.objs.push({k,x:s[0],y:s[1],w:bw,dir:toward(s[0])});}else m.objs.push({k,x:s[0],y:s[1],pow:7});}
  if(n&&(m.race==='dwarf'||m.race==='rat')){const s=spot(Math.round(lo+r()*span),1,'any');if(s&&clear(s[0],36,both))m.objs.push({k:m.race==='dwarf'?'keg':'scrap',x:s[0],y:s[1]});}}
 if(p.ene){drop('ene');const n=[0,Math.max(1,Math.round(W/500)),Math.max(2,Math.round(W/300)),Math.max(3,Math.round(W/190))][Math.max(o.foes|0,0)],toward=x=>(ds[0]&&ds[0].x<x)?1:-1;for(let i=0;i<n;i++){const s=spot(Math.round(lo+(i+.2+r()*.6)/n*span),1,'any');if(s&&clear(s[0],40,GEN_KINDS.ene))m.objs.push({k:'foe',kind:pickOf(t.fo),x:s[0],y:s[1],dir:toward(s[0])});}
  const nests=t.raid?Math.max(1,Math.round(W/700)):(o.foes|0)>=3?1:0;for(let i=0;i<nests&&(o.foes|0)>0;i++){const s=spot(Math.round(hi-i*Math.min(180,span/2)),-1,'top');if(s&&clear(s[0],30,['nest']))m.objs.push({k:'nest',kind:pickOf(t.fo),per:200,hp:8,cap:3,x:s[0],y:s[1]});}}
 if(p.dec){m.ops=m.ops.filter(o=>o[0]!=='D');const a=o.decor|0,K=decorKinds(m.theme),built=m.ops[0]&&m.ops[0][0]==='G'&&(m.ops[0][1]==='ruins'||m.ops[0][1]==='foundry'),paint=K.filter(k=>DECOR[k].kind==='paint'&&(built||(k!=='bricks'&&k!=='plate'))),prop=K.filter(k=>DECOR[k].kind==='prop'&&DECOR[k].anc!=='ceil'&&DECOR[k].anc!=='free'),hang=K.filter(k=>DECOR[k].kind==='prop'&&DECOR[k].anc==='ceil');if(a)for(let i=0,n=[0,Math.round(W/130),Math.round(W/80),Math.round(W/50)][a];i<n;i++){const x=8+r()*(lim-16)|0,L=ledges(x);if(L.length)m.ops.push(['D',pickOf(paint),x,pickOf(L)+14+(r()*60|0),r()<.5?1:0,1]);}if(a)for(let i=0,n=[0,Math.round(W/320),Math.round(W/200),Math.round(W/120)][a];i<n;i++){const s=spot(16+r()*(lim-32)|0,1,'any');if(s&&!ends.some(e=>Math.abs(e.x-s[0])<40)){const k=pickOf(prop),q=Math.max(2,DECOR[k].w>>2);if(f.solid(s[0]-q,s[1]+1)&&f.solid(s[0]+q,s[1]+1))m.ops.push(['D',k,s[0],s[1]+1,r()<.5?1:0,1]);}}
  // ceiling props hang from real rock: find a roof with open air below it
  if(a&&hang.length)for(let i=0,n=[0,Math.round(W/400),Math.round(W/240),Math.round(W/150)][a];i<n;i++){const x=16+r()*(lim-32)|0;for(let y=H-20;y>8;y--)if(f.solid(x,y-1)&&!f.solid(x,y)&&!f.solid(x,y+30)&&f.solid(x-4,y-1)&&f.solid(x+4,y-1)){const k=pickOf(hang);m.ops.push(['D',k,x,y-2+DECOR[k].h,r()<.5?1:0,1]);break;}}}
 if(whole){const fight=t.raid&&m.mode==='solo'&&(o.foes|0)>0;m.style=m.mode!=='solo'||fight?'battle':(o.traps|0)||(o.foes|0)?'hybrid':'puzzle';if(m.mode==='solo'){m.goal=fight?'both':'home';if(fight){m.swap={bash:'sword',pick:'bow'};m.skills={...m.skills,bash:8,pick:4};}else m.swap=null;}}
 m.gen=GEN_VERSION;return ensureIds(m);}
// genMap makes a whole map, then checks it. If the check fails it tries the next seeds, so a generated map always has a start and an exit and is never won by doing nothing.
function genCheck(m){if(!m.objs.some(a=>a.k==='hatch')||!m.objs.some(a=>a.k==='door'))return 'no start or exit';try{const b=mapCheck(toDef(m)).find(a=>a.lv==='bad');return b?b.t:'';}catch(e){return '';}}
function genMap(o){let m=null;for(let k=0;k<6;k++){m=genMapOnce(k?{...o,seed:(o.seed|0)+k*7919}:o);if(!genCheck(m))break;}return m;}
function genMapOnce(o){const pick=o.style&&o.style!=='auto'?o.style:null,m=blankMap(pick||'puzzle'),tpl=o.tpl||'march';m.w=o.w;m.h=o.h;m.mode=o.mode;m.theme=o.theme;m.ops=[];m.objs=[];m.name=((TPL.find(a=>a.k===tpl)||TPL[0]).n).slice(0,24);m.time=clamp(Math.round(o.w/800*240/30)*30,120,600);
 const old=!o.tpl&&pick&&pick!=='puzzle'?1:0;genLayout(m,{tpl,type:o.type,dir:o.dir,seed:o.seed,traps:o.traps===undefined?old:o.traps,foes:o.foes===undefined?(o.style==='hybrid'?1:0):o.foes,pool:o.pool===undefined?1:o.pool,mach:o.mach|0,decor:o.decor|0,parts:{ter:1,pts:1,trp:1,mch:1,ene:1,poo:1,dec:1}});
 if(pick)m.style=pick;m.need=clamp(Math.round(m.n*.5),1,50);return m;}
