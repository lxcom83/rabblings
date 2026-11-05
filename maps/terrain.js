// ---------- terrain: 0 air, 1 dirt, 2 iron, 3 plank, 4-6 one-way, 7 bone ----------
const boneCol=(x,y)=>{const q=noise(x*3,y*3);return q>.62?rgb32(236,230,206):q>.34?rgb32(204,198,174):rgb32(150,144,126);};
class Terrain{
 constructor(w,h,theme,seed){Object.assign(this,{w,h,theme:THEME[theme],seed});this.m=new Uint8Array(w*h);this.t=new Uint32Array(w*h);this.dirty=[];
  [this.cv,this.cx]=mk(w,h);[this.deco,this.dx]=mk(w,h);this.img=this.cx.createImageData(w,h);this.b=new Uint32Array(this.img.data.buffer);}
 solid(x,y){if(x<0||x>=this.w)return !this.open;if(y<0||y>=this.h)return false;return this.m[y*this.w+x]!==0;}
 iron(x,y){return x>=0&&x<this.w&&y>=0&&y<this.h&&this.m[y*this.w+x]===2;}
 hasIron(x,y,w,h){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(this.iron(i,j))return true;return false;}
 count(x,y,w,h){let n=0;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>=0&&i<this.w&&j>=0&&j<this.h&&this.m[j*this.w+i])n++;return n;}
 clr(i,j){if(i<0||j<0||i>=this.w||j>=this.h)return 0;const k=j*this.w+i,v=this.m[k];if(v===1||v===3||v===7||(v===2&&this.drill)||(v>=4&&v<7&&this.wayOk(v))){this.m[k]=0;if(this.grow)this.grow.push([k,v,this.now||0]);return 1;}return 0;}
 // one-way walls: 4 left, 5 right, 6 down. way is 0 for digging and blasts, +-1 for bashing, +-2 for picking
 wayOk(v){const w=this.way||0;if(!w)return true;return v===4?w<0:v===5?w>0:Math.abs(w)===2;}
 hard(x,y,w,h,way){this.way=way;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>=0&&j>=0&&i<this.w&&j<this.h){const v=this.m[j*this.w+i];if(v===2||(v>=4&&v<7&&!this.wayOk(v))){this.way=0;return true;}}this.way=0;return false;}
 mark(x,y,w,h){this.dirty.push(x,y,w,h);}
 carve(x,y,w,h){let n=0;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)n+=this.clr(i,j);if(n)this.mark(x,y,w,h);return n;}
 carveEll(cx,cy,rx,ry,maxY=1e9){let n=0;const x0=Math.floor(cx-rx),x1=Math.ceil(cx+rx),y0=Math.floor(cy-ry),y1=Math.ceil(cy+ry);
  for(let j=y0;j<=y1&&j<=maxY;j++)for(let i=x0;i<=x1;i++){const a=(i-cx)/rx,b=(j-cy)/ry;if(a*a+b*b<=1)n+=this.clr(i,j);}
  if(n)this.mark(x0,y0,x1-x0+1,y1-y0+1);return n;}
 plank(x,y,w,h,team,bone){const cols=team?[0xff3c6ea0>>>0,0xff2c5078>>>0]:[0xff3c78b4>>>0,0xff2a5480>>>0];let n=0;
  for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){if(i<0||i>=this.w||j<0||j>=this.h)continue;const k=j*this.w+i;if(this.m[k])continue;if(bone==='vine'){this.m[k]=3;this.t[k]=(i+j*3)%5?0xff3c9a4c>>>0:0xff2a6a34>>>0;n++;continue;}if(bone){this.m[k]=7;this.t[k]=boneCol(i,j);n++;continue;}this.m[k]=3;this.t[k]=(i-x===0||i-x===w-1)?cols[1]:cols[j-y?1:0];n++;}
  this.mark(x,y,w,h);return n;}
 shade(i,j){const k=j*this.w+i,mt=this.m[k];if(!mt)return 0;const air=(a,b)=>!this.solid(a,b)&&a>=0&&a<this.w;let c=this.t[k];
  if(air(i,j-1))c=mul32(c,1.36);else if(air(i,j-2))c=mul32(c,1.14);
  if(air(i,j+1))c=mul32(c,.5);else if(air(i,j+2))c=mul32(c,.72);
  if(air(i-1,j))c=mul32(c,1.1);if(air(i+1,j))c=mul32(c,.74);return c;}
 flush(){const d=this.dirty;if(!d.length)return;for(let n=0;n<d.length;n+=4){const x=Math.max(0,d[n]-3),y=Math.max(0,d[n+1]-3),X=Math.min(this.w,d[n]+d[n+2]+3),Y=Math.min(this.h,d[n+1]+d[n+3]+3);
   for(let j=y;j<Y;j++)for(let i=x;i<X;i++)this.b[j*this.w+i]=this.shade(i,j);
   this.cx.putImageData(this.img,0,0,x,y,X-x,Y-y);this.dx.clearRect(x-1,y-12,X-x+2,Y-y+14);}d.length=0;}
 texCols(x0,x1){const{w,h,m,t,theme:T}=this,R=T.r32;
  for(let y=0;y<h;y++)for(let x=x0;x<x1;x++){const k=y*w+x,v=m[k];if(!v)continue;
   if(v===7)t[k]=boneCol(x,y);else if(v===1||v>=4){const n=noise(x,y)*.7+noise(x*3,y*3)*.3,st=Math.sin(y*.16+noise(x>>1,y>>2)*7)*.5+.5;let q=(n-.25)*1.6*.7+st*.3;q=clamp(q*R.length+bayer(x,y)-.5,0,R.length-1)|0;let c=R[q];
    const pb=noise((x>>1)*7+90,(y>>1)*5+40)+noise(x>>2,(y>>2)+60)*.25;if(pb>.92)c=T.p32;else if(pb>.895)c=mul32(T.p32,.62);if(v>=4){const a=x&15,b=y&15,e=v===6?Math.abs(a-8)+(15-b):v===4?Math.abs(b-8)+a:Math.abs(b-8)+(15-a);c=mul32(c,e===8||e===9?1.75:.86);}t[k]=c;}
   else if(v===2)t[k]=this.ironTex(x,y);else{const q=((y>>2)&1)?(x+8)%16:x%16,c=q===0||(y&3)===3?0xff2a5480:0xff3c78b4;t[k]=c>>>0;}}
  for(let x=x0;x<x1;x++){let d=-1;for(let y=0;y<h;y++){const k=y*w+x;if(m[k]===0){d=0;continue;}if(d<0)continue;if(m[k]===1){const lim=T.capD+((noise(x*3,17)*6)|0);if(d<lim){const q=clamp(((d/lim)*T.c32.length+bayer(x,y)*.8)|0,0,T.c32.length-1);t[k]=T.c32[q];}}d++;if(d>30)d=30;}}
  if(this.gfx){const G=this.gfx,px=(i,j)=>i>=0&&j>=0&&i<G.w&&j<G.h?G.d[j*G.w+i]:0;for(let y=0;y<h;y++)for(let x=x0;x<x1;x++){const k=y*w+x,v=m[k];if(!v||v===3||v===7)continue;const a=(x-G.ox)/G.s|0,b=(y-G.oy)/G.s|0;let c=px(a,b)||px(a+1,b)||px(a-1,b)||px(a,b+1)||px(a,b-1);if(!c)continue;if(v>=4){const p=x&15,q=y&15,e=v===6?Math.abs(p-8)+(15-q):v===4?Math.abs(q-8)+p:Math.abs(q-8)+(15-p);c=mul32(c,e===8||e===9?1.75:.86);}t[k]=c;}}
}
 paint(){this.texCols(0,this.w);this.flushAll();if(!this.gfx)this.decorate(rng(this.seed));}
 repaint(x0,x1){x0=clamp(x0-3|0,0,this.w);x1=clamp(x1+3|0,0,this.w);if(x1<=x0)return;this.texCols(x0,x1);for(let j=0;j<this.h;j++)for(let i=x0;i<x1;i++)this.b[j*this.w+i]=this.shade(i,j);this.cx.putImageData(this.img,0,0,x0,0,x1-x0,this.h);}
 ironTex(x,y){const px=x%24,py=y%16,B=this.theme.iron;let f=.82+noise(x*2,y*2)*.4;if(px===0||py===0)f=.42;else if(px===1||py===1)f*=1.32;else if(px===23||py===15)f*=.7;const rv=(px>=2&&px<=4||px>=20&&px<=22)&&(py>=2&&py<=4||py>=12&&py<=13);if(rv)f=1.6;return rgb32(B[0]*f,B[1]*f,B[2]*f);}
 flushAll(){for(let j=0;j<this.h;j++)for(let i=0;i<this.w;i++)this.b[j*this.w+i]=this.shade(i,j);this.cx.putImageData(this.img,0,0);this.dirty.length=0;}
 decorate(r){const{w,h,m,dx:x,theme:T}=this;const name=T.deco||Object.keys(THEME).find(k=>THEME[k]===T);
  for(let i=2;i<w-2;i++)for(let j=1;j<h-1;j++){const s=m[j*w+i],a=m[(j-1)*w+i],b=j<h-2?m[(j+1)*w+i]:1;
   if(s===1&&a===0){const p=r();
    if(name==='bog'){if(p<.34){x.fillStyle=T.cap[(r()*3)|0];x.fillRect(i,j-1-(r()*3|0),1,3);}else if(p<.012+.34){x.fillStyle='#e8e0c0';x.fillRect(i,j-4,2,4);x.fillStyle='#d8402c';x.fillRect(i-2,j-6,6,2);x.fillRect(i-1,j-7,4,1);x.fillStyle='#fff';x.fillRect(i,j-6,1,1);}}
    else if(name==='frost'){if(p<.05){x.fillStyle='#e4f4ff';x.fillRect(i,j-1,2,1);}}
    else if(name==='forge'){if(p<.03){x.fillStyle='#ff7a30';x.fillRect(i,j,1,1);}}
    else if(p<.008){x.fillStyle='#58c8d8';x.fillRect(i,j-5,2,5);x.fillRect(i+2,j-3,2,3);x.fillStyle='#d8fbff';x.fillRect(i,j-5,1,3);}else if(p<.018){x.fillStyle='#d8d4c0';x.fillRect(i,j-2,4,2);x.fillStyle='#8a867a';x.fillRect(i+1,j-1,1,1);}}
   if(s===1&&b===0&&r()<.07){const l=3+r()*9|0;for(let k=0;k<l;k++){x.fillStyle=name==='frost'?(k<l-2?'#b8def4':'#fff'):name==='forge'?(k>l-3?'#ff8a3c':'#42242a'):name==='bog'?'#3e7e42':'#4a3a44';x.fillRect(i,j+1+k,k<l/2?2:1,1);}}}}
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
   case'B':this.box(o[2],o[3],o[4],o[5],o[1]);break;case'E':this.ell(o[2],o[3],o[4],o[5],o[1]);break;case'S':if(STAMPS[o[1]])STAMPS[o[1]].make(this,o[2],o[3]);break;case'G':genTerrain(this,o[1],o[2]);break;case'M':impStamp(this,o);break;}}
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
