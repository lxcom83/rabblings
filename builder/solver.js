// ---------- auto solve: works out which skills a GET HOME map needs ----------
// It plays the map with plenty of every skill, watches where the troops die or turn back, tries a skill at that spot,
// keeps the first try that gets further, and repeats until enough get home. Then it drops any step the map can be won without.
// It is a heuristic helper for designers, not a proof: a map it cannot crack may still be solvable by a person.
const SOLVE_SIDES=[{race:'goblin',clan:0},{race:'goblin',clan:1}];
// distance from the hut along open ground (rock counts as slow, so digging routes still score), on a 6 px grid
function solveField(def){setSides(SOLVE_SIDES);const w=new World(def,{quiet:true,sides:SOLVE_SIDES}),T=w.T,G=6,cw=Math.ceil(T.w/G),ch=Math.ceil(T.h/G),F=new Float32Array(cw*ch).fill(1e9);
 const cost=new Uint8Array(cw*ch);for(let j=0;j<ch;j++)for(let i=0;i<cw;i++){let s=0;for(let a=1;a<G;a+=2)for(let b=1;b<G;b+=2)if(T.solid(i*G+a,j*G+b))s++;cost[j*cw+i]=s>=5?8:1;}
 const H=[],push=(d,k)=>{H.push([d,k]);let i=H.length-1;while(i){const p=(i-1)>>1;if(H[p][0]<=H[i][0])break;[H[p],H[i]]=[H[i],H[p]];i=p;}},pop=()=>{const t=H[0],l=H.pop();if(H.length){H[0]=l;let i=0;for(;;){const a=2*i+1,b=a+1;let m=i;if(a<H.length&&H[a][0]<H[m][0])m=a;if(b<H.length&&H[b][0]<H[m][0])m=b;if(m===i)break;[H[m],H[i]]=[H[i],H[m]];i=m;}}return t;};
 for(const d of w.doors.filter(d=>d.team===0)){const k=Math.min(ch-1,Math.max(0,((d.y-6)/G)|0))*cw+Math.min(cw-1,Math.max(0,(d.x/G)|0));F[k]=0;push(0,k);}
 while(H.length){const[d,k]=pop();if(d>F[k])continue;const i=k%cw,j=(k/cw)|0;for(const[di,dj]of[[1,0],[-1,0],[0,1],[0,-1]]){const x=i+di,y=j+dj;if(x<0||y<0||x>=cw||y>=ch)continue;const q=y*cw+x,nd=d+cost[q]*G;if(nd<F[q]){F[q]=nd;push(nd,q);}}}
 return{F,cw,ch,G,at(x,y){const i=Math.min(cw-1,Math.max(0,(x/G)|0)),j=Math.min(ch-1,Math.max(0,((y-6)/G)|0));return F[j*cw+i];}};}
function solveSim(def,plan,maxT,fld,own){
 setSides(SOLVE_SIDES);const all={};SK.forEach(k=>all[k]=40);
 const w=new World({...def,skills:own?def.skills:all,skills2:null},{quiet:true,sides:SOLVE_SIDES});const P=w.pl[0];P.bot=plan.map(s=>({...s}));
 const doors=w.doors.filter(d=>d.team===0),ev=[],seen=new Map();let best=1e9;const mem=new Map();
 const lim=Math.min(maxT,Math.round(def.time*TPS)+50);
 while(!w.over&&w.tick<lim){w.step();
  for(const g of w.gobs){if(g.team!==0)continue;let o=mem.get(g);if(!o){o={a:1,s:g.s,d:g.dir,lw:null};mem.set(g,o);}
   const al=w.alive(g);
   if(al){if(g.s==='walk'&&o.s==='shrug')add('top',g.x,g.y,g.dir);if(g.s==='walk'){if(g.dir!==o.d&&o.lw)add('wall',o.s==='walk'?o.lw[0]:g.x,o.s==='walk'?o.lw[1]:g.y,o.d);o.lw=[g.x,g.y,g.dir];
     if(!o.sx||Math.abs(g.x-o.sx)>6||Math.abs(g.y-o.sy)>6){o.sx=g.x;o.sy=g.y;o.st=w.tick;}else if(w.tick-o.st>100&&!o.stk){o.stk=1;add('wall',g.x+g.dir*8,g.y,g.dir);}}
    const dd=fld?fld.at(g.x,g.y):Math.min(...doors.map(d=>Math.hypot(g.x-d.x,(g.y-d.y)*1.5)));if(dd<best)best=dd;if(o.mf===undefined||dd<o.mf)o.mf=dd;}
   else if(o.a&&g.s!=='home'&&o.lw)add('die',o.lw[0],o.lw[1],o.lw[2]);
   if(!al&&g.s==='home'){best=0;o.mf=0;}
   o.a=al;o.s=g.s;o.d=g.dir;}}
 function add(k,x,y,d){const key=k+(x>>3)+','+(y>>3)+','+d;if(seen.has(key))return;seen.set(key,1);ev.push({k,x:Math.round(x),y:Math.round(y),d,t:w.tick});}
 const used={};plan.forEach((s,i)=>{if(P.planDone[i])used[s.s]=(used[s.s]||0)+P.planDone[i];});
 const n=Object.values(used).reduce((a,b)=>a+b,0);let avg=0,cnt=0;for(const o of mem.values())if(o.mf!==undefined){avg+=Math.min(o.mf,9999);cnt++;}avg=cnt?avg/cnt:9999;
 return{saved:P.saved,lost:P.lost,ev,best,used,n,fired:plan.map((s,i)=>!!P.planDone[i]),win:P.saved>=def.need,score:P.saved>=def.need?1e6+(P.saved-def.need)*15-n*40:P.saved*1000-Math.min(best,9999)/4-avg/4-n*4};}
function solveCands(e){const C=[],st=(s,dx,tol=3)=>C.push({x:e.x-e.d*dx,d:e.d,s,tol,y:e.y,ytol:10,e});
 if(e.k==='top'){[0,-2,-4].forEach(o=>C.push({x:e.x-e.d*o,d:e.d,s:'build',tol:2,y:e.y,ytol:4,e}));return C;}
 if(e.k==='wall'){[6,12,20,28,36,44,52,64,80].forEach(o=>st('build',o,3));st('bash',3);C.push({x:e.x-e.d*24,d:e.d,s:'climb',tol:6,y:e.y,ytol:10,n:60,e});st('pick',3);st('dig',14);st('boom',6);}
 else{[1,3,5,7,10,14].forEach(o=>st('build',o,2));C.push({x:e.x-e.d*8,d:e.d,s:'flap',tol:4,y:e.y,ytol:10,n:60,e});st('block',14,4);st('dig',18);st('bash',6);st('pick',14);st('pick',30);st('dig',8);}
 return C;}
function* solveGen(m,own){return yield* solveDefGen(toDef(m),own);}
function* solveDefGen(def,own){const T0=Date.now(),maxT=Math.round(def.time*TPS)+50,fld=solveField(def);let sims=0;
 const run=p=>{sims++;return solveSim(def,p,maxT,fld,own);};
 let plan=[],cur=run(plan);yield{msg:'Watching the first run...',sims};
 // greedy with a small beam: at each round try every candidate at the earliest few trouble spots of each kept plan, keep the best few plans
 let beam=[{plan,r:cur}],win=cur.win?{plan,r:cur}:null,extra=0;
 for(let it=0;it<30&&beam.length&&extra<3;it++){const next=[];if(win)extra++;
  for(const B of beam){const near=e=>B.plan.some(s=>Math.abs(s.x-e.x)<10&&Math.abs(s.y-e.y)<10&&s.d===e.d);
   const evs=B.r.ev.filter(e=>!near(e)).sort((a,b)=>a.t-b.t).slice(0,6);
   for(const e of evs)for(const c of solveCands(e)){if(Date.now()-T0>120000)break;const p=B.plan.concat([c]),r=run(p);yield{msg:win?`Found a way with ${win.r.n} skills. Looking for a cheaper one...`:`Round ${it+1}: best so far ${B.r.saved} home`,sims};if(!r.fired[r.fired.length-1])continue;
    const nov=r.ev.some(e=>e.k==='top'&&!B.r.ev.some(f=>f.k==='top'&&Math.abs(f.x-e.x)<8&&Math.abs(f.y-e.y)<8));
    if(r.win){if(!win||r.score>win.r.score)win={plan:p,r};}else if((r.score>B.r.score+.5||nov)&&(!win||r.n<win.r.n))next.push({plan:p,r,k:r.score+(nov?40:0)});}
   yield{msg:win?`Found a way with ${win.r.n} skills. Looking for a cheaper one...`:`Round ${it+1}: best so far ${B.r.saved} home`,sims};}
  next.sort((a,b)=>b.k-a.k);const keep=[],sig=new Set();
  for(const n of next){const k=n.r.saved+':'+Math.round(n.r.best/8);if(sig.has(k))continue;sig.add(k);keep.push(n);if(keep.length>=5)break;}
  beam=keep;if(Date.now()-T0>120000)break;}
 if(win){plan=win.plan;cur=win.r;}else{const all=[{plan,r:cur}].concat(beam);all.sort((a,b)=>b.r.score-a.r.score);plan=all[0].plan;cur=all[0].r;}
 // cheaper swaps: try every other way of handling each step's trouble spot, keep any that still wins for less
 if(cur.win)for(let i=0;i<plan.length&&Date.now()-T0<150000;i++){const st=plan[i];if(!st.e)continue;for(const c of solveCands(st.e)){if(Date.now()-T0>150000)break;if(c.s===st.s&&c.x===st.x)continue;const p=plan.slice();p[i]=c;const r=run(p);yield{msg:'Looking for a cheaper way...',sims};if(r.win&&r.score>cur.score){plan=p;cur=r;}}}
 if(cur.win){for(let i=plan.length-1;i>=0;i--){const p=plan.slice(0,i).concat(plan.slice(i+1)),r=run(p);yield{msg:'Checking which steps are really needed...',sims};if(r.win){plan=p;cur=r;}}
  plan=plan.filter((s,i)=>cur.fired[i]);cur=run(plan);}
 return{ok:cur.win,saved:cur.saved,need:def.need,n:def.n,used:cur.used,plan:plan.map(({e,...s})=>s),sims,secs:Math.round((Date.now()-T0)/1000)};}
const Solve={job:null,res:null,msg:'',
 own:0,
 start(m){if(m.mode!=='solo'||(m.goal&&m.goal!=='home')){this.res=null;this.msg='Auto solve only works on one-player GET HOME maps.';return;}
  const P=mapProblems(m);if(P.length){this.res=null;this.msg=P[0];return;}
  this.res=null;this.msg='Starting...';this.job=solveGen(m,this.own);},
 stop(){this.job=null;this.msg='Stopped.';},
 tick(){if(!this.job)return;const t0=performance.now();while(this.job&&performance.now()-t0<40){const r=this.job.next();if(r.done){this.res=r.value;this.job=null;this.msg='';}else this.msg=r.value.msg+'  ('+r.value.sims+' runs)';}}};
