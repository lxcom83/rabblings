// decor: art layered on terrain. Each game supplies DECOR art. Maps store small steps, so old maps never change
// ['D',name,x,y,flip,big] places art. ['I',pic,x,y,flip,mat] places a picture from m.pics (mat 0 = paint only)
const decorCache=new Map();
function decorArt(name){let a=decorCache.get(name);if(a)return a;const d=DECOR[name];if(!d)return null;const[c,x]=mk(d.w,d.h);d.art((col,i,j,w=1,h=1)=>{x.fillStyle=col;x.fillRect(i,j,w,h);},d.w,d.h);const im=x.getImageData(0,0,d.w,d.h).data,px=new Uint32Array(d.w*d.h);for(let i=0;i<px.length;i++){const k=i*4;if(im[k+3]>127)px[i]=rgb32(im[k],im[k+1],im[k+2]);}a={w:d.w,h:d.h,d:px,cv:c};decorCache.set(name,a);return a;}
const decorKinds=(theme)=>Object.keys(DECOR).filter(k=>!DECOR[k].in||DECOR[k].in.includes(theme));
// pictures are stored as a palette plus runs of index and length
function picPack(a){const L=[];let i=0;while(i<a.length){let j=i+1;while(j<a.length&&a[j]===a[i])j++;L.push(a[i].toString(36)+'.'+(j-i).toString(36));i=j;}return L.join(';');}
const picCache=new WeakMap();
function picArt(p){let a=picCache.get(p);if(a)return a;const n=p.w*p.h,d=new Uint32Array(n),pal=p.pal.map(h=>{const c=hex2(h);return rgb32(c[0],c[1],c[2]);});let i=0;for(const t of String(p.run).split(';')){const q=t.split('.'),v=parseInt(q[0],36),c=parseInt(q[1],36);if(!(c>0))continue;if(v>0&&pal[v-1])d.fill(pal[v-1],i,Math.min(n,i+c));i+=c;if(i>=n)break;}const[cv,x]=mk(p.w,p.h),im=x.createImageData(p.w,p.h);new Uint32Array(im.data.buffer).set(d);x.putImageData(im,0,0);a={w:p.w,h:p.h,d,cv};picCache.set(p,a);return a;}
function decorEach(a,big,flip,ox,oy,fn){const W=a.w*big,H=a.h*big;for(let j=0;j<H;j++)for(let i=0;i<W;i++){const u=(flip?W-1-i:i)/big|0,c=a.d[(j/big|0)*a.w+u];if(c)fn(ox+i,oy+j,c);}}
Shaper.prototype.placeDecor=function(o){const T=this.T,d=DECOR[o[1]],a=d&&decorArt(o[1]);if(!a)return;const big=o[5]===2?2:1,W=a.w*big,H=a.h*big,ox=(o[2]|0)-(W>>1),oy=d.kind==='paint'?(o[3]|0)-(H>>1):(o[3]|0)-H;if(d.kind==='solid')decorEach(a,big,o[4],ox,oy,(x,y)=>{if(x>=0&&y>=0&&x<T.w&&y<T.h)T.m[y*T.w+x]=d.mat||1;});T.decos.push({a,big,flip:o[4],ox,oy,prop:d.kind==='prop',k:o[1],free:o[6]?1:0});};
Shaper.prototype.placePic=function(o){const T=this.T,p=this.pics&&this.pics[o[1]];if(!p)return;const a=picArt(p),ox=(o[2]|0)-(a.w>>1),oy=(o[3]|0)-a.h,mat=o[5]|0;if(mat)decorEach(a,1,o[4],ox,oy,(x,y)=>{if(x>=0&&y>=0&&x<T.w&&y<T.h)T.m[y*T.w+x]=mat;});T.decos.push({a,big:1,flip:o[4],ox,oy,prop:false});};
Terrain.prototype.applyDecor=function(x0,x1){const{w,h,m,t}=this,put=(x,y,c)=>{if(x<x0||x>=x1||y<0||y>=h)return;const k=y*w+x;if(m[k])t[k]=c;};for(const e of this.decos){const W=e.a.w*e.big;if(e.prop){if(e.done)continue;e.done=1;if(!this.pv)this.pvx=([this.pv]=mk(w,h))[0].getContext('2d');const draw=(ox,fl)=>{const X=this.pvx;X.imageSmoothingEnabled=false;X.save();X.translate(ox+(fl?W:0),e.oy);X.scale(fl?-e.big:e.big,e.big);X.drawImage(e.a.cv,0,0);X.restore();};draw(e.ox,e.flip);if(this.mir)draw(w-e.ox-W,!e.flip);continue;}decorEach(e.a,e.big,e.flip,e.ox,e.oy,put);if(this.mir)decorEach(e.a,e.big,!e.flip,w-e.ox-W,e.oy,put);}};
// ---------- blocks: ready-made pieces. Stored as ['P',id,x,y,rot,flip] (x,y = top left of the finished piece) ----------
// a piece is a mask plus an optional look layer (1 = dark joint, 2 = light edge) so brick, crates and rivets show on any world
const brickOv=(bw,bh)=>(x,y)=>{const r=(y/bh)|0,xx=(x+(r%2?bw>>1:0))%bw,yy=y%bh;return yy===bh-1||xx===bw-1?1:yy===0?2:0;};
const plankOv=(x,y)=>(y%4===3?1:y%4===0?2:((x+((y>>2)%2?7:0))%14===13?1:0));
const aqArch=(w,h,ry)=>(x,y)=>{const a=(x+.5-w/2)/(w*.375),b=(y+.5-h)/ry;return a*a+b*b>=1;};
const PIECE_CATS=[['steel','STEEL','Steel. Most skills cannot dig through it.'],['stone','STONE','Stone and brick. Digs like normal ground.'],['wood','WOOD','Wood. It can be chewed and burnt.'],['aq','AQUEDUCT','Arches and decks. Snap them side by side.'],['pipe','PIPES','Pipes and ledges.']];
const PIECES={
 s24:{n:'BLOCK 24',cat:'steel',mat:2,w:24,h:24},s48:{n:'SLAB 48',cat:'steel',mat:2,w:48,h:24},sbig:{n:'BLOCK 48',cat:'steel',mat:2,w:48,h:48},sbeam:{n:'BEAM 96',cat:'steel',mat:2,w:96,h:8},sbm2:{n:'BEAM 48',cat:'steel',mat:2,w:48,h:8},
 b24:{n:'BRICK 24',cat:'stone',mat:1,w:24,h:24,ov:brickOv(12,6)},bslab:{n:'SLAB 48',cat:'stone',mat:1,w:48,h:12,ov:brickOv(12,6)},bwall:{n:'WALL 24',cat:'stone',mat:1,w:24,h:72,ov:brickOv(12,6)},
 bpil:{n:'PILLAR',cat:'stone',mat:1,w:20,h:64,ov:brickOv(10,6),mask:(x,y)=>y<6||(x>=2&&x<18)},bstep:{n:'STEPS',cat:'stone',mat:1,w:48,h:48,ov:brickOv(12,6),mask:(x,y)=>y>=36-((x/12|0)*12)},
 wcr:{n:'CRATE 24',cat:'wood',mat:3,w:24,h:24,ov:(x,y)=>x<2||y<2||x>21||y>21||Math.abs(x-y)<2||Math.abs(x+y-23)<2?1:0},wpl:{n:'PLANK 48',cat:'wood',mat:3,w:48,h:8,ov:plankOv},wpl2:{n:'PLANK 96',cat:'wood',mat:3,w:96,h:8,ov:plankOv},
 wfr:{n:'FRAME 48',cat:'wood',mat:3,w:48,h:48,ov:plankOv,mask:(x,y)=>x<4||y<4||x>=44||y>=44||Math.abs(x-y)<3||Math.abs(x+y-47)<3},wpo:{n:'POST',cat:'wood',mat:3,w:8,h:48,ov:(x,y)=>x===7||y%12===11?1:0},
 aq:{n:'ARCHES',cat:'aq',mat:1,w:48,h:64,ov:brickOv(8,4),mask:(x,y)=>y<10||aqArch(48,64,54)(x,y)},aqs:{n:'SHORT',cat:'aq',mat:1,w:48,h:40,ov:brickOv(8,4),mask:(x,y)=>y<10||aqArch(48,40,30)(x,y)},aqt:{n:'TALL',cat:'aq',mat:1,w:48,h:96,ov:brickOv(8,4),mask:(x,y)=>y<10||aqArch(48,96,86)(x,y)},
 aqe:{n:'END CAP',cat:'aq',mat:1,w:48,h:64,ov:brickOv(8,4),mask:(x,y)=>x<16||y<10||aqArch(48,64,54)(x,y)},aqd:{n:'DECK 48',cat:'aq',mat:1,w:48,h:10,ov:brickOv(8,5)},
 ppi:{n:'PIPE 72',cat:'pipe',mat:2,w:72,h:12,mask:(x,y)=>{const r=6,cx=x<r?r:x>=72-r?72-r:x;return (x+.5-cx)**2+(y+.5-r)**2<=r*r+1;}},pcv:{n:'CURVE',cat:'pipe',mat:2,w:24,h:24,mask:(x,y)=>{const d=Math.hypot(x+.5-24,y+.5-24);return d>=12&&d<=24;}},
 pld:{n:'LEDGE 48',cat:'pipe',mat:1,w:48,h:10,ov:brickOv(8,5),mask:(x,y)=>y>=4||x<6||x>=42},ptw:{n:'PIPE 48',cat:'pipe',mat:2,w:48,h:12,mask:(x,y)=>{const r=6,cx=x<r?r:x>=48-r?48-r:x;return (x+.5-cx)**2+(y+.5-r)**2<=r*r+1;}}};
const pieceCache=new Map();
// the finished piece after rot quarter turns clockwise and an optional left-right flip: {w,h,m (0 or 1 per pixel),ov,mat}
function buildPiece(id,rot=0,flip=0){const key=id+'|'+(rot&3)+'|'+(flip?1:0);let c=pieceCache.get(key);if(c)return c;const P=PIECES[id];if(!P)return null;let w=P.w,h=P.h,m=new Uint8Array(w*h),ov=new Uint8Array(w*h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const s=P.mask?P.mask(x,y):true;m[y*w+x]=s?1:0;ov[y*w+x]=s&&P.ov?P.ov(x,y):0;}
 for(let r=rot&3;r>0;r--){const nw=h,nh=w,nm=new Uint8Array(nw*nh),no=new Uint8Array(nw*nh);for(let y=0;y<nh;y++)for(let x=0;x<nw;x++){const k=(nw-1-x)*w+y;nm[y*nw+x]=m[k];no[y*nw+x]=ov[k];}m=nm;ov=no;w=nw;h=nh;}
 if(flip){for(let y=0;y<h;y++)for(let x=0;x<w>>1;x++){for(const a of[m,ov]){const i=y*w+x,j=y*w+w-1-x,t=a[i];a[i]=a[j];a[j]=t;}}}
 c={w,h,m,ov,mat:P.mat};pieceCache.set(key,c);return c;}
// a picture of a piece for the preview and the ghost, coloured like the current world
const pieceImgCache=new Map();
function pieceCanvas(id,rot,flip,theme){const key=id+'|'+rot+'|'+flip+'|'+theme;let c=pieceImgCache.get(key);if(c)return c;const b=buildPiece(id,rot,flip),[cv,x]=mk(b.w,b.h),im=x.createImageData(b.w,b.h),T=THEME[theme]||THEME.bog,base=b.mat===2?[T.iron[0]*1.05|0,T.iron[1]*1.05|0,T.iron[2]*1.05|0]:b.mat===3?[180,120,60]:hex2(T.ramp[4]);
 for(let i=0;i<b.m.length;i++)if(b.m[i]){const o=i*4,f=b.ov[i]===1?.6:b.ov[i]===2?1.25:1;im.data[o]=Math.min(255,base[0]*f);im.data[o+1]=Math.min(255,base[1]*f);im.data[o+2]=Math.min(255,base[2]*f);im.data[o+3]=255;}x.putImageData(im,0,0);pieceImgCache.set(key,cv);return cv;}
Shaper.prototype.placePiece=function(o){const T=this.T,b=buildPiece(o[1],o[4]|0,o[5]|0);if(!b)return;const ox=o[2]|0,oy=o[3]|0;for(let y=0;y<b.h;y++)for(let x=0;x<b.w;x++){const X=ox+x,Y=oy+y;if(b.m[y*b.w+x]&&X>=0&&Y>=0&&X<T.w&&Y<T.h)T.m[Y*T.w+X]=b.mat;}T.pcs.push({ox,oy,b});};
// ['C',x,y,w,h,dx,dy,flip] copies the ground in a box somewhere else (air in the box is left alone)
Shaper.prototype.copyRegion=function(o){const T=this.T,[,sx,sy,w,h,dx,dy,fl]=o;if(!(w>0&&h>0)||w*h>4e6)return;const buf=new Uint8Array(w*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const X=sx+x,Y=sy+y;if(X>=0&&Y>=0&&X<T.w&&Y<T.h)buf[y*w+x]=T.m[Y*T.w+X];}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const v=buf[y*w+(fl?w-1-x:x)];if(!v)continue;const X=dx+x,Y=dy+y;if(X>=0&&Y>=0&&X<T.w&&Y<T.h)T.m[Y*T.w+X]=v;}};
Terrain.prototype.applyPieces=function(x0,x1){const{w,h,m,t}=this;for(const e of this.pcs){const b=e.b;for(let y=0;y<b.h;y++)for(let x=0;x<b.w;x++){const v=b.ov[y*b.w+x];if(!v)continue;const Y=e.oy+y;if(Y<0||Y>=h)continue;const f=v===1?.62:1.28;for(const X of this.mir?[e.ox+x,w-1-(e.ox+x)]:[e.ox+x]){if(X<x0||X>=x1||X<0||X>=w)continue;const k=Y*w+X;if(m[k]===b.mat)t[k]=mul32(t[k],f);}}}};
