// shared screen input: keyboard, pads, pointer, scenes and buttons
const CALM=matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
// ---------- input ----------
const held={},press={};
const BLOCK=new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Tab']);
addEventListener('keydown',e=>{if(window.DLG)return;if(!e.repeat)press[e.code]=1;held[e.code]=1;auInit();if(BLOCK.has(e.code))e.preventDefault();});
addEventListener('keyup',e=>{held[e.code]=0;});
addEventListener('blur',()=>{for(const k in held)held[k]=0;});
const KEYS=[{u:'KeyW',d:'KeyS',l:'KeyA',r:'KeyD',prev:'KeyF',act:'KeyG',next:'KeyH',row:'KeyT'},{u:'ArrowUp',d:'ArrowDown',l:'ArrowLeft',r:'ArrowRight',prev:'KeyJ',act:'KeyK',next:'KeyL',row:'KeyI'}];
const padPrev=[{},{},{},{}];
function pads(){let g=[];try{g=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean):[];}catch(e){g=[];}const o=[];
 for(let i=0;i<4;i++){const p=g[i];if(!p){o.push(null);continue;}const b=n=>p.buttons[n]&&p.buttons[n].pressed,ax=p.axes||[0,0];
  const s={u:b(12)||ax[1]<-.4,d:b(13)||ax[1]>.4,l:b(14)||ax[0]<-.4,r:b(15)||ax[0]>.4,act:b(0),prev:b(2)||b(4),next:b(1)||b(5),row:b(3),start:b(9),jumpBack:b(6),jump:b(7)};
  const e={};for(const k in s){e[k]=s[k]&&!padPrev[i][k];}padPrev[i]=s;o.push({s,e});}
 return o;}
let PAD=[null,null,null,null];
// per-player control choice: auto (legacy), mk (mouse+WASD), kbA (WASD), kbB (arrows), padN, touch
const CTL=['auto','auto'],CTL_NAMES={auto:'AUTO',mk:'MOUSE + KEYS',kbA:'KEYS: WASD',kbB:'KEYS: ARROWS',pad0:'PAD 1',pad1:'PAD 2',pad2:'PAD 3',pad3:'PAD 4',touch:'TOUCH'};
function ctlRes(d){return d==='mk'?['kbA','mouse']:d==='kbA'?['kbA']:d==='kbB'?['kbB']:/^pad\d$/.test(d)?[d]:[];}
function ctlList(other,cur){const L=['auto','mk','kbA','kbB'];for(let i=0;i<4;i++)if(PAD[i]||cur==='pad'+i)L.push('pad'+i);L.push('touch');const used=other&&other!=='auto'?ctlRes(other):[];return L.filter(d=>d==='auto'||!ctlRes(d).some(r=>used.includes(r)));}
function ptrOk(d,type){return d==='auto'||(d==='mk'&&(type==='mouse'||type==='pen'))||(d==='touch'&&type==='touch');}
function inp(i,d){d=d||'auto';let ks=[],ps=[];if(d==='auto'){ks=[KEYS[i]];ps=[PAD[i]];}else if(d==='mk'||d==='kbA')ks=[KEYS[0]];else if(d==='kbB')ks=[KEYS[1]];else if(/^pad\d$/.test(d))ps=[PAD[+d[3]]];
 const hit=n=>ks.some(k=>!!press[k[n]])||ps.some(p=>!!(p&&p.e[n])),hold=n=>ks.some(k=>!!held[k[n]])||ps.some(p=>!!(p&&p.s[n]));return{hit,hold};}
function anyStart(){return press.Enter||press.Space||press.KeyG||press.KeyK||(PAD[0]&&(PAD[0].e.act||PAD[0].e.start))||(PAD[1]&&(PAD[1].e.act||PAD[1].e.start));}
function menuDir(){const u=press.ArrowUp||press.KeyW||(PAD[0]&&PAD[0].e.u)||(PAD[1]&&PAD[1].e.u),d=press.ArrowDown||press.KeyS||(PAD[0]&&PAD[0].e.d)||(PAD[1]&&PAD[1].e.d);return u?-1:d?1:0;}
function goBack(){return press.Escape||(PAD[0]&&PAD[0].e.next);}
let hits=[];const ptrs=new Map();let pointerX=-1,pointerY=-1,ptrBtn=0;
function toGame(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*VW,(e.clientY-r.top)/r.height*VH];}
function hitAt(x,y){for(let i=hits.length-1;i>=0;i--){const h=hits[i];if(x>=h.x&&y>=h.y&&x<h.x+h.w&&y<h.y+h.h)return h;}return null;}
cv.addEventListener('pointerdown',e=>{auInit();cv.focus({preventScroll:true});const[x,y]=toGame(e);pointerX=x;pointerY=y;ptrBtn=e.button;const h=hitAt(x,y);if(h){h.fn();e.preventDefault();return;}
 if(scene&&scene.pdown)scene.pdown(e.pointerId,x,y,e.pointerType);cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);});
cv.addEventListener('pointermove',e=>{const[x,y]=toGame(e);pointerX=x;pointerY=y;const h=hitAt(x,y);cv.style.cursor=h&&h.btn?'pointer':(scene===Play?'none':'default');if(h&&h.hover)h.hover();if(scene&&scene.pmove)scene.pmove(e.pointerId,x,y,e.pointerType);});
cv.addEventListener('pointerup',e=>{const[x,y]=toGame(e);if(scene&&scene.pup)scene.pup(e.pointerId,x,y,e.pointerType);});
cv.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);});
cv.addEventListener('contextmenu',e=>e.preventDefault());

// ---------- scene plumbing ----------
let scene=null,fade=1,fadeDir=-1,fadeNext=null,clock=0;
function go(fn){if(fadeNext)return;fadeNext=fn;fadeDir=1;}
function setScene(s){scene=s;hits=[];if(s!==Play)setHud(46);if(s.enter)s.enter();}
function button(C,x,y,w,h,label,fn,o={}){const hover=pointerX>=x&&pointerX<x+w&&pointerY>=y&&pointerY<y+h;hits.push({x,y,w,h,fn,btn:1,l:label});
 C.fillStyle='#120a18';C.fillRect(x,y,w,h);C.fillStyle=o.on||hover?'#5a3a70':'#33263f';C.fillRect(x+1,y+1,w-2,h-2);C.fillStyle=o.on||hover?'#7e5a96':'#4a3a58';C.fillRect(x+1,y+1,w-2,1);
 if(label){const F=fitLabel(label,w-4);txt(C,F.s,x+w/2,y+(h-7)/2|0,o.col||'#fff',{c:1,s:F.sc});}}
