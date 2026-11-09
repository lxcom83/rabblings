// ---------- terrain: 0 air, 1 dirt, 2 iron, 3 plank, 4-6 one-way, 7 bone, 8 ice, 9 thin ice, 10 sand ----------
const boneCol=(x,y)=>{const q=noise(x*3,y*3);return q>.62?rgb32(236,230,206):q>.34?rgb32(204,198,174):rgb32(150,144,126);};
// ---------- material skins: our own looks for imported terrain when the player's art is not used. 0 keeps the theme dirt ----------
// 1 stone, 2 brick, 3 sand, 4 snow, 5 moss, 6 ash, 7 crystal, 8 rust, 9 marble, 10 wood, 11 flesh
const SKIN_NAMES=['','STONE','BRICK','SAND','SNOW','MOSS','ASH','CRYSTAL','RUST','MARBLE','WOOD','FLESH'];
const SKIN_RAMP=[null,
 [[58,60,66],[84,86,92],[108,110,114],[132,132,134],[156,154,150]],
 [[70,32,26],[104,50,38],[132,66,48],[156,86,60],[44,24,22]],
 [[150,122,74],[176,148,92],[198,170,112],[214,190,134],[120,96,58]],
 [[150,168,190],[184,200,218],[214,226,238],[236,242,248],[110,128,156]],
 [[30,48,24],[46,72,34],[64,96,40],[88,118,50],[24,36,22]],
 [[24,22,26],[38,36,40],[54,50,54],[72,64,64],[150,62,30]],
 [[44,34,86],[70,54,128],[104,86,170],[150,134,210],[34,70,96]],
 [[60,38,26],[92,52,30],[128,68,32],[162,88,38],[40,34,34]],
 [[150,148,140],[178,176,166],[204,200,188],[226,222,208],[98,96,94]],
 [[62,40,24],[88,58,32],[112,76,42],[136,94,54],[44,28,18]],
 [[96,34,44],[128,50,58],[158,74,76],[186,100,96],[66,24,34]]];
const SKIN32=SKIN_RAMP.map(r=>r&&r.map(c=>rgb32(c[0],c[1],c[2])));
// ice: slippery, melts near fire. Thin ice is paler and cracks under a crowd or a builder
const ICE32=[[96,140,176],[120,170,205],[150,196,226],[182,220,242],[214,238,252]].map(c=>rgb32(c[0],c[1],c[2])),THIN32=[[130,176,208],[160,204,230],[190,226,244],[218,240,252],[84,120,160]].map(c=>rgb32(c[0],c[1],c[2]));
const SAND32=[[168,128,70],[190,150,86],[212,172,104],[230,194,126],[244,214,150]].map(c=>rgb32(c[0],c[1],c[2]));
function sandCol(x,y){const n=noise(x>>1,y>>1)*.5+noise(x*3,y*3)*.25,r=Math.sin((x*.11)+(y*.7)+noise(x>>3,y>>2)*6)*.5+.5;let q=Math.floor((n*.7+r*.45)*4.4);if(q<0)q=0;if(q>4)q=4;return SAND32[q];}
const VINE32=[[34,72,30],[48,98,40],[66,124,50],[92,150,62],[28,54,28]].map(c=>rgb32(c[0],c[1],c[2])),LEAF32=[[52,124,56],[70,150,66],[96,176,84],[128,200,104],[36,92,44]].map(c=>rgb32(c[0],c[1],c[2])),FLAME32=[[255,214,92],[250,160,40],[226,98,24],[160,52,20]].map(c=>rgb32(c[0],c[1],c[2]));
function vineCol(x,y){const n=noise(x>>1,y>>2),s=Math.sin(x*1.3+Math.sin(y*.09)*2)*.5+.5;let q=Math.floor((n*.5+s*.6)*4.2);q=q<0?0:q>4?4:q;return VINE32[q];}
function leafCol(x,y){const v=Math.abs(((x+y*.5)%9)-4.5)<.7||Math.abs((y%11)-5)<.5,n=noise(x>>1,y>>1);return v?LEAF32[4]:LEAF32[Math.min(3,Math.floor(n*4.4))];}
const RIFT32=[[88,40,150],[120,60,190],[160,90,224],[200,140,246],[60,24,110]].map(c=>rgb32(c[0],c[1],c[2])),CRUMB32=[[96,78,66],[120,98,82],[146,120,98],[172,146,120],[52,40,34]].map(c=>rgb32(c[0],c[1],c[2]));
function riftCol(x,y,ghost){const n=noise(x>>1,y>>1),s=Math.sin(x*.5+y*.35+n*5)*.5+.5;const q=Math.min(3,Math.floor((n*.5+s*.7)*3.4));const c=RIFT32[q];return ghost?(((c&0x00ffffff)|0x58000000)>>>0):c;}
function crumbCol(x,y){const n=noise(x,y)*.5+noise(x*3,y*3)*.25;const cr=Math.abs(((x*7+y*3)%23)-11)<1||Math.abs(((y*5-x*2)%29)-14)<1;return cr?CRUMB32[4]:CRUMB32[Math.min(3,Math.floor(n*4.6))];}
function iceCol(x,y,thin){const R=thin?THIN32:ICE32,n=noise(x,y)*.5+noise(x*3,y*3)*.2;if(thin){const v=Math.abs(Math.sin((x*.9-y*1.3)*.28+noise(x>>3,y>>3)*6));if(v<.05)return R[4];}
 let q=.5+Math.sin((x*.7+y*.4)*.5+noise(x>>2,y>>2)*4)*.22+(n-.35)*.5;if(!thin&&noise(x>>1,(y>>1)+70)>.9)q=.05;const i=clamp(q*R.length+bayer(x,y)*.8-.4,0,R.length-1.01)|0;return R[i];}
function skinCol(id,x,y){const R=SKIN32[id];if(!R)return 0;const n=noise(x,y)*.6+noise(x*3,y*3)*.4;let q=n,e=0;
 switch(id){
  case 2:{const row=(y/6)|0,bx=(x+(row&1)*8)%16,my=y%6;if(my===5||bx===0)return R[4];q=n*.7+((row*5+((x+(row&1)*8)/16|0)*3)%7)/14;e=my===0?.2:0;break;}
  case 3:q=.5+Math.sin(y*.5+noise(x>>3,y>>1)*5)*.28+(n-.5)*.4;break;
  case 4:q=.55+(n-.5)*.7+(noise(x>>2,y>>2)>.8?-.25:0);break;
  case 5:q=n*1.05+(noise(x>>1,(y>>1)+40)>.82?.35:0);break;
  case 6:{if(noise(x*2+5,y*2+9)>.965)return R[4];q=n*.9;break;}
  case 7:{const f=((x+y*2)%14)/14;q=.25+f*.45+(n-.5)*.35;if((x+y*2)%14===0)q=1;break;}
  case 8:{if(noise(x*2+11,y*2+3)>.9)return R[3];q=n*.95;break;}
  case 9:{const v=Math.abs(Math.sin((x*.5+y*.9)*.35+noise(x>>2,y>>2)*6));if(v<.06)return R[4];q=.55+(n-.5)*.5;break;}
  case 10:{q=.5+Math.sin(x*1.3+noise(x>>1,y>>3)*6)*.28+(n-.5)*.3;if(y%14===0)return R[4];break;}
  case 11:{const v=Math.abs(Math.sin((x*.7-y*.5)*.4+noise(x>>2,y>>2)*5));if(v<.07)return R[4];q=n*.9;break;}
  default:q=n;}
 const i=clamp(q*R.length*.999+bayer(x,y)*.8-.4,0,R.length-1.01)|0;let c=R[i>3?3:i];return e?mul32(c,1+e):c;}
class Terrain{
 constructor(w,h,theme,seed){Object.assign(this,{w,h,theme:THEME[theme],seed});this.m=new Uint8Array(w*h);this.t=new Uint32Array(w*h);this.dirty=[];
  [this.cv,this.cx]=mk(w,h);[this.deco,this.dx]=mk(w,h);this.decos=[];this.pcs=[];this.mir=false;this.img=this.cx.createImageData(w,h);this.b=new Uint32Array(this.img.data.buffer);}
 solid(x,y){if(x<0||x>=this.w)return !this.open;if(y<0||y>=this.h)return false;{const v=this.m[y*this.w+x];return v!==0&&v!==15;}}
 iron(x,y){return x>=0&&x<this.w&&y>=0&&y<this.h&&this.m[y*this.w+x]===2;}
 hasIron(x,y,w,h){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(this.iron(i,j))return true;return false;}
 count(x,y,w,h){let n=0;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>=0&&i<this.w&&j>=0&&j<this.h&&this.m[j*this.w+i])n++;return n;}
 clr(i,j){if(i<0||j<0||i>=this.w||j>=this.h)return 0;const k=j*this.w+i,v=this.m[k];if(v===1||v===3||v===7||v===8||v===9||v===10||v===11||v===12||v===14||v===16||(v===2&&this.drill)||(v>=4&&v<7&&this.wayOk(v))){this.m[k]=0;if(this.grow)this.grow.push([k,v,this.now||0]);return 1;}return 0;}
 // one-way walls: 4 left, 5 right, 6 down. way is 0 for digging and blasts, +-1 for bashing, +-2 for picking
 wayOk(v){const w=this.way||0;if(!w)return true;return v===4?w<0:v===5?w>0:Math.abs(w)===2;}
 hard(x,y,w,h,way){this.way=way;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>=0&&j>=0&&i<this.w&&j<this.h){const v=this.m[j*this.w+i];if(v===2||(v>=4&&v<7&&!this.wayOk(v))){this.way=0;return true;}}this.way=0;return false;}
 mark(x,y,w,h){this.dirty.push(x,y,w,h);if(this.sandOn){const q=this.sw;if(q){if(x<q[0])q[0]=x;if(y<q[1])q[1]=y;if(x+w>q[2])q[2]=x+w;if(y+h>q[3])q[3]=y+h;}else this.sw=[x,y,x+w,y+h];}}
 carve(x,y,w,h){let n=0;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)n+=this.clr(i,j);if(n)this.mark(x,y,w,h);return n;}
 carveEll(cx,cy,rx,ry,maxY=1e9){let n=0;const x0=Math.floor(cx-rx),x1=Math.ceil(cx+rx),y0=Math.floor(cy-ry),y1=Math.ceil(cy+ry);
  for(let j=y0;j<=y1&&j<=maxY;j++)for(let i=x0;i<=x1;i++){const a=(i-cx)/rx,b=(j-cy)/ry;if(a*a+b*b<=1)n+=this.clr(i,j);}
  if(n)this.mark(x0,y0,x1-x0+1,y1-y0+1);return n;}
 plank(x,y,w,h,team,bone){const cols=team?[0xff3c6ea0>>>0,0xff2c5078>>>0]:[0xff3c78b4>>>0,0xff2a5480>>>0];let n=0;
  for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){if(i<0||i>=this.w||j<0||j>=this.h)continue;const k=j*this.w+i;if(this.m[k])continue;if(bone==='vine'){this.m[k]=3;const cap=j-y<2;this.t[k]=cap?(((i*7+j*3)%6===0)?0xffcce0e8>>>0:0xff2e3ac2>>>0):((i-x)%2?0xffa0c9d9>>>0:0xff7aa6b8>>>0);n++;continue;}if(bone){this.m[k]=7;this.t[k]=boneCol(i,j);n++;continue;}this.m[k]=3;this.t[k]=(i-x===0||i-x===w-1)?cols[1]:cols[j-y?1:0];n++;}
  this.mark(x,y,w,h);return n;}
 shroomRow(x,y,w,cap,repaint,dir){for(let i=x;i<x+w;i++){if(i<0||i>=this.w||y<0||y>=this.h)continue;const k=y*this.w+i;
   if(repaint){if(this.m[k]!==3)continue;if(i===(dir<0?x:x+w-1)){this.m[k]=0;continue;}}else{if(this.m[k])continue;this.m[k]=3;}
   this.t[k]=cap?(((i*7+y*3)%6===0)?0xffcce0e8>>>0:0xff2e3ac2>>>0):((i-x)%2?0xff7aa6b8>>>0:0xffa0c9d9>>>0);}
  this.mark(x,y,w,1);}
 // spear stairs: still solid steps, painted as spears jabbed into the wall (steel head in the rock, wooden shaft sticking out, dark gaps between)
 spearStairs(wx,gy,n,d,team){const wood=team?[0xff5a8cc0>>>0,0xff2c5078>>>0]:[0xff4a86c4>>>0,0xff2a5480>>>0],steel=[0xffd2d2c8>>>0,0xff7c8088>>>0],gap=0xff14202c>>>0;let c=0;
  for(let o=1;o<=n*6;o++){const x=wx-d*o,k=n-Math.floor((o-1)/6),top=gy-6*k;if(x<0||x>=this.w)continue;
   for(let y=top;y<gy;y++){if(y<0||y>=this.h)continue;const q=this.w*y+x;if(this.m[q])continue;const r=(y-top)%6;this.m[q]=3;this.t[q]=r<2?(o<=3?steel[r]:wood[r]):(o>6*(n-k)+5&&r===5?wood[1]:gap);c++;}}
  this.mark(Math.min(wx-d*n*6,wx-d),gy-6*n,n*6+1,6*n+1);return c;}
 shade(i,j){const k=j*this.w+i,mt=this.m[k];if(!mt)return 0;const air=(a,b)=>!this.solid(a,b)&&a>=0&&a<this.w;let c=this.t[k];
  if(air(i,j-1))c=mul32(c,1.36);else if(air(i,j-2))c=mul32(c,1.14);
  if(air(i,j+1))c=mul32(c,.5);else if(air(i,j+2))c=mul32(c,.72);
  if(air(i-1,j))c=mul32(c,1.1);if(air(i+1,j))c=mul32(c,.74);return c;}
 flush(){const d=this.dirty;if(!d.length)return;for(let n=0;n<d.length;n+=4){const x=Math.max(0,d[n]-3),y=Math.max(0,d[n+1]-3),X=Math.min(this.w,d[n]+d[n+2]+3),Y=Math.min(this.h,d[n+1]+d[n+3]+3);
   for(let j=y;j<Y;j++)for(let i=x;i<X;i++)this.b[j*this.w+i]=this.shade(i,j);
   this.cx.putImageData(this.img,0,0,x,y,X-x,Y-y);this.dx.clearRect(x-1,y-12,X-x+2,Y-y+14);}d.length=0;}
 texCols(x0,x1){const{w,h,m,t,theme:T}=this,R=T.r32;
  for(let y=0;y<h;y++)for(let x=x0;x<x1;x++){const k=y*w+x,v=m[k];if(!v)continue;
   if(v===7)t[k]=boneCol(x,y);else if(v===8||v===9)t[k]=iceCol(x,y,v===9);else if(v===10)t[k]=sandCol(x,y);else if(v===11)t[k]=vineCol(x,y);else if(v===12)t[k]=leafCol(x,y);else if(v===13)t[k]=FLAME32[(x+y)&3];else if(v===14||v===15)t[k]=riftCol(x,y,v===15);else if(v===16)t[k]=crumbCol(x,y);else if(v===1||v>=4){const n=noise(x,y)*.7+noise(x*3,y*3)*.3,st=Math.sin(y*.16+noise(x>>1,y>>2)*7)*.5+.5;let q=(n-.25)*1.6*.7+st*.3;q=clamp(q*R.length+bayer(x,y)-.5,0,R.length-1)|0;let c=R[q];const sk=(this.skin&&!this.gfx)?this.skin[k]:0;if(sk)c=skinCol(sk,x,y);
    const pb=sk?0:noise((x>>1)*7+90,(y>>1)*5+40)+noise(x>>2,(y>>2)+60)*.25;if(pb>.92)c=T.p32;else if(pb>.895)c=mul32(T.p32,.62);if(v>=4){const a=x&15,b=y&15,e=v===6?Math.abs(a-8)+(15-b):v===4?Math.abs(b-8)+a:Math.abs(b-8)+(15-a);c=mul32(c,e===8||e===9?1.75:.86);}t[k]=c;}
   else if(v===2)t[k]=this.ironTex(x,y);else{const q=((y>>2)&1)?(x+8)%16:x%16,c=q===0||(y&3)===3?0xff2a5480:0xff3c78b4;t[k]=c>>>0;}}
  for(let x=x0;x<x1;x++){let d=-1;for(let y=0;y<h;y++){const k=y*w+x;if(m[k]===0){d=0;continue;}if(d<0)continue;if(m[k]===1&&!(this.skin&&!this.gfx&&this.skin[k]&&this.skin[k]!==5)){const lim=T.capD+((noise(x*3,17)*6)|0);if(d<lim){const q=clamp(((d/lim)*T.c32.length+bayer(x,y)*.8)|0,0,T.c32.length-1);t[k]=T.c32[q];}}d++;if(d>30)d=30;}}
  if(this.gfx){const G=this.gfx,px=(i,j)=>i>=0&&j>=0&&i<G.w&&j<G.h?G.d[j*G.w+i]:0;for(let y=0;y<h;y++)for(let x=x0;x<x1;x++){const k=y*w+x,v=m[k];if(!v||v===3||v===7||v>=8)continue;const a=(x-G.ox)/G.s|0,b=(y-G.oy)/G.s|0;let c=px(a,b)||px(a+1,b)||px(a-1,b)||px(a,b+1)||px(a,b-1);if(!c)continue;if(v>=4){const p=x&15,q=y&15,e=v===6?Math.abs(p-8)+(15-q):v===4?Math.abs(q-8)+p:Math.abs(q-8)+(15-p);c=mul32(c,e===8||e===9?1.75:.86);}t[k]=c;}}
  if(this.decos.length)this.applyDecor(x0,x1);if(this.pcs.length)this.applyPieces(x0,x1);}
 paint(){this.texCols(0,this.w);this.flushAll();if(!this.gfx)this.decorate(rng(this.seed));}
 repaint(x0,x1){x0=clamp(x0-3|0,0,this.w);x1=clamp(x1+3|0,0,this.w);if(x1<=x0)return;this.texCols(x0,x1);for(let j=0;j<this.h;j++)for(let i=x0;i<x1;i++)this.b[j*this.w+i]=this.shade(i,j);this.cx.putImageData(this.img,0,0,x0,0,x1-x0,this.h);}
 ironTex(x,y){const px=x%24,py=y%16,B=this.theme.iron;let f=.82+noise(x*2,y*2)*.4;if(px===0||py===0)f=.42;else if(px===1||py===1)f*=1.32;else if(px===23||py===15)f*=.7;const rv=(px>=2&&px<=4||px>=20&&px<=22)&&(py>=2&&py<=4||py>=12&&py<=13);if(rv)f=1.6;return rgb32(B[0]*f,B[1]*f,B[2]*f);}
 flushAll(){for(let j=0;j<this.h;j++)for(let i=0;i<this.w;i++)this.b[j*this.w+i]=this.shade(i,j);this.cx.putImageData(this.img,0,0);this.dirty.length=0;}
 decorate(r){const{w,h,m,dx:x,theme:T}=this;const name=T.deco||Object.keys(THEME).find(k=>THEME[k]===T);
  for(let i=2;i<w-2;i++)for(let j=1;j<h-1;j++){const s=m[j*w+i],a=m[(j-1)*w+i],b=j<h-2?m[(j+1)*w+i]:1;
   if((s===1||s===8)&&a===0){const p=r();
    if(name==='bog'){if(p<.34){x.fillStyle=T.cap[(r()*3)|0];x.fillRect(i,j-1-(r()*3|0),1,3);}else if(p<.012+.34){x.fillStyle='#dad1ac';x.fillRect(i,j-4,2,4);x.fillStyle='#a33b2d';x.fillRect(i-2,j-6,6,2);x.fillRect(i-1,j-7,4,1);x.fillStyle='#fff';x.fillRect(i,j-6,1,1);}}
    else if(name==='frost'){if(p<.05){x.fillStyle='#7493b7';x.fillRect(i,j-1,2,1);}}
    else if(name==='forge'){if(p<.03){x.fillStyle='#dd5d16';x.fillRect(i,j,1,1);}}
    else if(p<.008){x.fillStyle='#4c5f71';x.fillRect(i,j-5,2,5);x.fillRect(i+2,j-3,2,3);x.fillStyle='#6f95b5';x.fillRect(i,j-5,1,3);}else if(p<.018){x.fillStyle='#96927f';x.fillRect(i,j-2,4,2);x.fillStyle='#6d6b63';x.fillRect(i+1,j-1,1,1);}}
   if((s===1||s===8)&&b===0&&r()<.07){const l=3+r()*9|0;for(let k=0;k<l;k++){x.fillStyle=name==='frost'?(k<l-2?'#6883a1':'#fff'):name==='forge'?(k>l-3?'#e56917':'#331f23'):name==='bog'?'#414937':'#201d1d';x.fillRect(i,j+1+k,k<l/2?2:1,1);}}}}
}
class Shaper{constructor(T,seed){this.T=T;this.s=seed;}
 n(x,f=.04,o=0){const v=noise(Math.floor(x*f*8+o*37),o*31&255);return (v-.5)*2.2;}
 box(x,y,w,h,m=1){const T=this.T;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>=0&&j>=0&&i<T.w&&j<T.h)T.m[j*T.w+i]=m;}
 cut(x,y,w,h){this.box(x,y,w,h,0);}
 ell(cx,cy,rx,ry,m=1){for(let j=cy-ry;j<=cy+ry;j++)for(let i=cx-rx;i<=cx+rx;i++){const a=(i-cx)/rx,b=(j-cy)/ry;if(a*a+b*b<=1)this.box(i|0,j|0,1,1,m);}}
 cutEll(cx,cy,rx,ry){this.ell(cx,cy,rx,ry,0);}
 rock(x,y,w,h,r=3){for(let i=x;i<x+w;i++){const a=Math.round(this.n(i,.05,1)*r),b=Math.round(this.n(i,.07,2)*r);this.box(i,y+a,1,h-a+b);}}
 land(x0,x1,y,r=2,yb){const b=yb||this.T.h;for(let i=x0;i<x1;i++){const a=Math.round(this.n(i,.04,3)*r);this.box(i,y+a,1,b-y-a);}}
 ramp(x0,y0,x1,y1){for(let i=x0;i<x1;i++){const y=Math.round(lerp(y0,y1,(i-x0)/(x1-x0)));this.box(i,y,1,this.T.h-y);}}
 wavy(x0,x1,y,amp=8,len=60,ph=0,yb){const B=yb||this.T.h;for(let i=x0;i<x1;i++){const t=y+Math.round(Math.sin(i/len+ph)*amp+Math.sin(i/(len*.37)+ph*2)*amp*.25);this.box(i,t,1,B-t);}}
 iron(x,y,w,h){this.box(x,y,w,h,2);}
 dab(m,x,y,r){const T=this.T,r2=r*r;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r2){const a=x+i,b=y+j;if(a>=0&&b>=0&&a<T.w&&b<T.h)T.m[b*T.w+a]=m;}}
 seg(m,r,x0,y0,x1,y1){const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)/Math.max(1,r/2)));for(let i=0;i<=n;i++)this.dab(m,Math.round(lerp(x0,x1,i/n)),Math.round(lerp(y0,y1,i/n)),r);}
 op(o){switch(o[0]){case'L':{const p=o.slice(3);if(p.length<4)this.dab(o[1],p[0],p[1],o[2]);for(let i=2;i+1<p.length;i+=2)this.seg(o[1],o[2],p[i-2],p[i-1],p[i],p[i+1]);break;}
   case'B':this.box(o[2],o[3],o[4],o[5],o[1]);break;case'E':this.ell(o[2],o[3],o[4],o[5],o[1]);break;case'S':if(STAMPS[o[1]])STAMPS[o[1]].make(this,o[2],o[3]);break;case'G':genTerrain(this,o[1],o[2]);break;case'M':impStamp(this,o);break;case'D':this.placeDecor(o);break;case'I':this.placePic(o);break;case'P':this.placePiece(o);break;case'C':this.copyRegion(o);break;}}
 run(ops){for(const o of ops)this.op(o);}
}
const STAMPS={
 hill:{n:'HILL',make(S,x,y){S.ell(x,y,70,34);}},
 mesa:{n:'MESA',make(S,x,y){S.rock(x-40,y-50,80,70,3);}},
 ledge:{n:'LEDGE',make(S,x,y){S.rock(x-60,y-10,120,20,3);}},
 tower:{n:'TOWER',make(S,x,y){S.rock(x-16,y-90,32,110,2);}},
 wall:{n:'WALL',make(S,x,y){S.rock(x-8,y-70,16,90,2);}},
 cave:{n:'CAVE',make(S,x,y){S.cutEll(x,y,70,28);}},
 pit:{n:'PIT',make(S,x,y){S.cut(x-22,y-20,44,70);}},
 tunnel:{n:'TUNNEL',make(S,x,y){S.cut(x-60,y-10,120,20);}},
 ironbox:{n:'IRON',make(S,x,y){S.iron(x-24,y-8,48,16);}},
 stairs:{n:'STAIRS',make(S,x,y){for(let i=0;i<8;i++)S.box(x-40+i*10,y-i*6,10,14+i*6);}}};
