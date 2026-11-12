// ---------- map checker: one set of living-map checks for every map (built-in, generated or player-made) ----------
// mapCheck(def,opt) takes a playable level def (toDef(map) for builder maps) and returns a list of {lv,t}:
//   lv 'bad'  = breaks a hard rule (water floats, start or exit broken, won by doing nothing)
//   lv 'warn' = worth a look (props in mid-air, too easy, long flat floors, single height)
// Checks never block a human designer. Generated and built-in maps must come back with no 'bad' lines.
// opt: {quick:1} skips the play simulations; {race:'goblin'}; {style:'mechanical'} relaxes the flat-floor line.
function mapCheck(def,opt={}){const out=[],add=(lv,t)=>out.push({lv,t}),race=opt.race||def.race||'goblin',sd=[{race,clan:0},{race:'goblin',clan:1}];
 const mk=(diff)=>{setSides(sd);return new World(def,{quiet:true,sides:sd,diff});};let w;try{w=mk(1);}catch(e){add('bad','This map cannot be built: '+e.message);return out;}
 const T=w.T,W=T.w,H=T.h,S=(x,y)=>x<0||x>=W||y>=H||(y>=0&&T.m[(y|0)*W+(x|0)]>0);
 // 1 water and lava sit in sealed containers
 for(const h of w.hz){const y0=h.y,y1=h.y1===undefined?H-1:h.y1;if(h.x0<=1&&h.x1>=W-2)continue;let holes=0,l=0,r=0;for(let x=h.x0;x<h.x1;x++)if(!S(x,y1)&&!S(x,y1+1))holes++;for(let y=y0;y<=Math.min(y1,y0+40);y++){if(!S(h.x0-1,y))l++;if(!S(h.x1,y))r++;}
  if(holes||l||r)add('bad','Water at x '+h.x0+' floats or leaks: '+[holes?'no floor under it':'',l?'left end open':'',r?'right end open':''].filter(Boolean).join(', ')+'.');}
 // 2 start and exit
 for(const h of w.hatches){if(h.ghost)continue;if(S(h.x,h.y)&&S(h.x,h.y-6))add('bad','The hatch at x '+h.x+' is inside solid ground.');let d=0;while(d<H&&!S(h.x,h.y+d))d++;if(h.y+d>=H-1&&!S(h.x,H-1))add('bad','Nothing under the hatch at x '+h.x+': troops fall out of the map.');else if(d>(w.fallMax||112))add('bad','The drop from the hatch at x '+h.x+' is '+d+' px. That fall kills.');}
 const inW=(x,y)=>w.hz.some(h=>x>=h.x0&&x<=h.x1&&y>=h.y&&y<=(h.y1===undefined?H:h.y1)+2);
 for(const h of w.hatches){if(h.ghost)continue;let d=0;while(d<H&&!S(h.x,h.y+d)&&!inW(h.x,h.y+d))d++;if(inW(h.x,h.y+d))add('bad','The hatch at x '+h.x+' drops troops straight into water or lava.');}
 for(const d of w.doors)if(inW(d.x,d.y-3))add('bad','The hut at x '+d.x+' is under water or lava.');
 for(const d of w.doors){let g=0;while(g<30&&!S(d.x,d.y+g))g++;if(g>=8)add('bad','The hut at x '+d.x+' has no ground under it.');let b=0;for(let y=d.y-24;y<d.y-2;y++)if(S(d.x,y))b++;if(b>14)add('warn','The hut at x '+d.x+' is buried in rock.');}
 // 3 props touch what they belong to
 const near=(x,y)=>{for(let d=-3;d<=3;d++)if(S(x,y+d))return true;return false;};let fl=0;for(const e of T.decos){const D=e.k&&DECOR[e.k];if(!D||!e.prop||!D.anc||D.anc==='free'||e.free)continue;const Wd=e.a.w*e.big,Hd=e.a.h*e.big,cx=e.ox+(Wd>>1),q=Math.max(2,Wd>>2),y=D.anc==='floor'?e.oy+Hd:e.oy;if(!(near(cx-q,y)&&near(cx+q,y)))fl++;}
 if(fl)add('warn',fl+(fl>1?' props are':' prop is')+' not touching the ground or roof it belongs on.');
 // 4 shape: flat runs and height tiers (floors under water do not count)
 const wet=(x,y)=>w.hz.some(h=>x>=h.x0&&x<h.x1&&y>=h.y-2&&y<=(h.y1===undefined?H:h.y1)+2);let flat=0;const fy=new Set();
 for(let y=2;y<H-1;y++){let r=0;for(let x=0;x<W;x++){if(S(x,y)&&!S(x,y-1)&&!S(x,y-2)&&!wet(x,y)){r++;if(r>flat)flat=r;}else{if(r>=24)fy.add(y);r=0;}}if(r>=24)fy.add(y);}
 // height tiers: bands of 28 px that each hold at least 30 columns of open walkable floor (slopes count)
 const band={};for(let x=0;x<W;x++)for(let y=14;y<H-1;y++)if(S(x,y)&&!S(x,y-1)&&!S(x,y-12)&&!wet(x,y)){const b=y/28|0;band[b]=(band[b]||0)+1;}const tiers=Object.keys(band).filter(b=>band[b]>=30);
 const lim=opt.style==='mechanical'||def.style==='mechanical'?1e9:(opt.style==='mixed'||def.style==='mixed')?480:160;if(flat>lim)add('warn','Longest flat floor is '+flat+' px. Living maps roll and step.');
 if(tiers.length<2&&H>=200)add('warn','Everything is on one level. Add height: ledges, a drop, a climb.');
 // 5 play checks: doing nothing must lose; random skill spam should not win
 const solo=!def.versus&&!def.free2p&&(!def.goal||def.goal==='home');
 if(!opt.quick&&solo&&w.hatches.length&&w.doors.length){const run=(bot,diff)=>{const v=mk(diff);v.pl[0].bot=bot;let n=0;while(!v.over&&n++<26000)v.step();return v;};
  const idle=run([],0);if(idle.pl[0].saved>=idle.need)add('bad','Doing nothing wins ('+idle.pl[0].saved+' of '+idle.need+' needed). The route must need skills.');
  else{const sk=Object.keys(w.pl[0].skills).filter(k=>w.pl[0].skills[k]>0);if(sk.length){let wins=0;const rnd=rng(W*31+H);for(let t=0;t<3;t++){const bot=[];for(let i=0;i<10;i++)bot.push({x:8+rnd()*(W-16)|0,d:rnd()<.5?1:-1,s:sk[rnd()*sk.length|0],tol:30});const v=run(bot,1);if(v.pl[0].saved>=v.need)wins++;}
   if(wins>=2)add('warn','Random skill use wins '+wins+' times in 3. The map is very easy.');}}}
 setSides();return out;}
