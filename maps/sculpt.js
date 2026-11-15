// ---------- living-map sculpt kit: shared by built-in maps, the random generator and the map builder ----------
// Shapes grow out of the void (smoothed ground and roof outlines, tapering attached masses, winding passages) instead of rooms cut from a block.
// Builder maps store these as ['K',kind,...] steps, so a whole curved shape is one short step in a share code.
// ---------- scenery pieces: maps = a small exact puzzle path + a lot of organic scenery around it ----------
// Rule: nothing solid sits on the walking line. Pools and caves are sealed pockets; stalactites, isles, arches and catwalks hang clear of the path.
// props carry an anchor (floor / ceil / free in decor-art.js). Floor props must stand on ground with both feet, ceiling props must hang from rock; otherwise they are skipped.
const fxSolid=(T,x,y)=>x>=0&&y>=0&&x<T.w&&y<T.h&&T.m[y*T.w+x]>0;
const fxSurf=(T,x,y0,dir,rng=44)=>{for(let d=0;d<=rng;d++)for(const s of d?[-1,1]:[0]){const y=y0+s*d;if(dir>0){if(!fxSolid(T,x,y-1)&&!fxSolid(T,x,y-2)&&fxSolid(T,x,y))return y;}else if(fxSolid(T,x,y-1)&&!fxSolid(T,x,y)&&!fxSolid(T,x,y+1))return y;}return -1;};
// ov=1 is the human designer's override: the prop goes exactly where it is told, whatever its anchor says. Generated maps never pass ov, so they always snap.
const fxDec=(S,k,x,y,fl=0,big=1,ov=0)=>{const D=DECOR[k],a=D&&D.kind==='prop'&&D.anc;if(ov||!a||a==='free')return S.placeDecor(['D',k,x,y,fl,big,ov?1:0]);
 const T=S.T,W=D.w*big,H=D.h*big,q=Math.max(2,W>>2),dir=a==='floor'?1:-1;
 for(const o of [0,8,-8,16,-16,24,-24])for(const hy of dir>0?[y]:[y-H,y]){const cx=x+o,c=fxSurf(T,cx,hy,dir);if(c<0)continue;const l=fxSurf(T,cx-q,c,dir,5),r=fxSurf(T,cx+q,c,dir,5);if(l<0||r<0)continue;
  return S.placeDecor(['D',k,cx,dir>0?c+1:c-2+H,fl,big]);}
 fxDec.skipped=(fxDec.skipped||0)+1;};
// fxSpine: Chaikin-smoothed centre line, stamped with ellipses of varying radius = a winding passage of changing width (no rectangles)
const fxSpine=(S,pts,r=10,v=4)=>{let P=pts;for(let it=0;it<3;it++){const Q=[P[0]];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1];Q.push([.75*a[0]+.25*b[0],.75*a[1]+.25*b[1]],[.25*a[0]+.75*b[0],.25*a[1]+.75*b[1]]);}Q.push(P[P.length-1]);P=Q;}
 for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],n=Math.max(1,Math.hypot(b[0]-a[0],b[1]-a[1])/2|0);for(let k=0;k<n;k++){const t=k/n,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t,q=Math.max(4,r+S.n(x+y,.07,21)*v);S.cutEll(x|0,y|0,q*1.2|0,q|0);}}};
// ---- design-first sculpting tools (additive: shapes grow out of the void instead of rooms cut from a block) ----
const fxChaikin=(pts,it=3)=>{let P=pts;for(let k=0;k<it;k++){const Q=[P[0]];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1];Q.push([.75*a[0]+.25*b[0],.75*a[1]+.25*b[1]],[.25*a[0]+.75*b[0],.25*a[1]+.75*b[1]]);}Q.push(P[P.length-1]);P=Q;}return P;};
// fxProf: ground whose top surface follows smoothed control points (x rising), filled down to yb. r = noise roughness in px.
const fxProf=(S,pts,yb,r=2,m=1)=>{const P=fxChaikin(pts,2),B=yb||S.T.h;for(let i=0;i<P.length-1;i++){const[a,b]=P[i],[c,d]=P[i+1];for(let x=Math.ceil(a);x<c;x++){const y=Math.round(b+(d-b)*(x-a)/(c-a)+S.n(x,.05,3)*r*.6+S.n(x,.17,4)*r*.4);S.box(x,y,1,B-y,m);}}};
// fxCeil: cave roof whose underside follows smoothed control points, filled up to the top edge
const fxCeil=(S,pts,r=3,m=1)=>{const P=fxChaikin(pts,2);for(let i=0;i<P.length-1;i++){const[a,b]=P[i],[c,d]=P[i+1];for(let x=Math.ceil(a);x<c;x++){const y=Math.round(b+(d-b)*(x-a)/(c-a)+S.n(x,.06,5)*r*.6+S.n(x,.21,6)*r*.4);S.box(x,0,1,Math.max(0,y),m);}}};
// fxMass: a solid body grown along a smoothed line (roots, tendrils, rock arms, arches). r tapers from r0 to r1.
const fxMass=(S,pts,r0=12,r1=4,v=3,m=1)=>{const P=fxChaikin(pts,3);let L=0;const d=[0];for(let i=1;i<P.length;i++){L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(L);}
 for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],n=Math.max(1,Math.hypot(b[0]-a[0],b[1]-a[1])/2|0);for(let k=0;k<n;k++){const t=k/n,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t,f=(d[i]+(d[i+1]-d[i])*t)/(L||1),q=Math.max(2,r0+(r1-r0)*f+S.n(x+y,.09,22)*v);S.ell(x|0,y|0,q|0,q|0,m);}}};
const fxCave=(S,cx,cy,rx,ry)=>S.cutEll(cx,cy,rx,ry);
const fxStal=(S,x0,x1,y,len,step=13)=>{for(let x=x0;x<=x1;x+=step){const l=Math.max(5,(len*(.55+Math.abs(S.n(x,.2,5))*.45))|0);S.ell(x,y,2+(l>>3),l);}};
const fxIsle=(S,cx,cy,w)=>{S.ell(cx,cy,w,Math.max(3,w>>3));S.ell(cx,cy+(w>>3),(w*.75)|0,w>>2);S.ell(cx,cy+(w>>2)+(w>>3),(w*.4)|0,w>>2);S.ell(cx,cy+(w>>1)+(w>>3),(w*.15+3)|0,w>>3);};
const fxArch=(S,cx,cy,w)=>{S.ell(cx,cy,w,10);S.ell(cx,cy+12,(w*.75)|0,10);S.ell(cx,cy+22,(w*.4)|0,8);};
const fxTun=(S,pts,r=3)=>{for(let k=0;k<pts.length-1;k++){const[a,b]=pts[k],[c,d]=pts[k+1],n=Math.max(Math.abs(c-a),Math.abs(d-b));for(let i=0;i<=n;i++)S.cutEll(a+(c-a)*i/n,b+(d-b)*i/n,r,r);}};
// carved-cave tools: start from solid rock and cut the passages. Floors are the bottoms of cuts, so they come out flat and exact.
const fxHall=(S,x0,x1,floor,h,k=.35,minY=54)=>{S.cut(x0,floor-h,x1-x0,h);for(let x=x0;x<x1;x++){const t=(x-x0)/(x1-x0),ex=Math.sin(Math.PI*t)*h*k+S.n(x,.018,7)*h*.14+S.n(x,.06,8)*4,y=Math.max(minY,Math.round(floor-h-ex));if(y<floor-h)S.cut(x,y,1,floor-h-y);}};
const fxMound=(S,cx,floor,rx,ry)=>S.ell(cx,floor,rx,ry);   // a hill on a hall floor (keep it off puzzle spots)
const fxHang=(S,cx,top,rx,ry)=>{S.box(cx-9,0,18,top+2);S.ell(cx,top+ry-4,rx,ry);fxStal(S,cx-rx+6,cx+rx-6,top+ry-4,10,9);};   // rock mass hanging from the ceiling
const fxPit=(S,x0,x1,floor,depth)=>S.cut(x0,floor,x1-x0,depth);
const fxRamp=(S,x0,y0,x1,y1,r=14)=>{const n=Math.abs(x1-x0);for(let i=0;i<=n;i++){const t=i/n;S.cutEll(x0+(x1-x0)*t,y0+(y1-y0)*t-r,r,r);}};
// fxBurrow: fxTun with a gently rolling floor. The wobble fades to nothing at both ends, so joins to ramps and stairs stay exact.
const fxBurrow=(S,pts,r=10,a=3)=>{let L=0;for(let k=0;k<pts.length-1;k++)L+=Math.abs(pts[k+1][0]-pts[k][0]);let u=0;for(let k=0;k<pts.length-1;k++){const[x0,y0]=pts[k],[x1,y1]=pts[k+1],n=Math.max(1,Math.abs(x1-x0));for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,t=(u+Math.abs(x-x0))/(L||1),w=Math.round(S.n(x,.045,9)*a*Math.sin(Math.PI*t));S.cutEll(x,y0+(y1-y0)*i/n+w,r,r);}u+=Math.abs(x1-x0);}};
// fxStair: a walkable shaft cut column by column. Unlike fxRamp it stays walkable when it is steep (up to about 3 px of rise per px).
const fxStair=(S,x0,y0,x1,y1,h=18)=>{const n=Math.abs(x1-x0),d=x1>x0?1:-1;for(let i=0;i<=n;i++){const y=Math.round(y0+(y1-y0)*i/n);S.cut(x0+d*i,y-h,1,h);}};
// fxLane: a walkable passage cut through solid rock between a smoothed floor line and a smoothed roof line (both ascending in x).
const fxLane=(S,fl,ce)=>{const F=fxChaikin(fl,2),C=fxChaikin(ce,2),at=(P,x)=>{for(let i=0;i<P.length-1;i++)if(x>=P[i][0]&&x<=P[i+1][0]){const[a,b]=P[i],[c,d]=P[i+1];return c===a?b:b+(d-b)*(x-a)/(c-a);}return P[P.length-1][1];};
 const x0=Math.ceil(Math.max(F[0][0],C[0][0])),x1=Math.floor(Math.min(F[F.length-1][0],C[C.length-1][0]));for(let x=x0;x<=x1;x++){const f=Math.round(at(F,x)+S.n(x,.05,3)*1.2),c=Math.round(at(C,x)+S.n(x,.07,5)*3);if(f>c)S.cut(x,c,1,f-c);}};
// fxRun: a winding cave corridor cut along a floor polyline; the roof follows the highest floor nearby, H above it. Use a vertical step (two points 2 px apart) for a lip a builder must bridge.
const fxRun=(S,pts,H=56)=>{const F=pts.map(p=>p.slice()),C=F.map((p,i)=>[p[0],Math.min(F[Math.max(0,i-1)][1],p[1],F[Math.min(F.length-1,i+1)][1])-(Array.isArray(H)?H[i]:H)]);fxLane(S,F,C);};
// fxTunnel: a hidden passage with a gently rolling floor (9 px swells every 70 px) so tunnels are not dead flat. y is the mean floor.
const fxTunnel=(S,x0,x1,y,h=18)=>{let px=x0,py=y;for(let x=x0+70;x<x1-30;x+=70){const ny=y+(((x*7)%3)-1)*9;fxStair(S,px,py,x,ny,h);px=x;py=ny;}fxStair(S,px,py,x1,y,h);};
// ---- organic landforms (built to avoid flat floors and floating islands) ----
// fxCrag: a standing crag / rock spire that tapers and leans, rooted into the ground. w = base width, h = height above baseY.
const fxCrag=(S,cx,baseY,w,h,lean=0,m=1)=>{const top=baseY-h;for(let y=top;y<=baseY+24;y++){const t=Math.max(0,Math.min(1,(baseY-y)/h)),hw=Math.max(2,(w/2)*(1-.62*Math.pow(t,1.25))+S.n(y,.09,7)*(w*.07)+(t>.9?-(t-.9)*w*3:0)),c=cx+lean*t*h+S.n(y,.05,8)*(w*.05);S.box(Math.round(c-hw),y,Math.round(hw*2),1,m);}};
// fxArchRock: a natural stone arch standing on baseY: span = clear width, rise = clear height under it, thick = the stone's thickness.
const fxArchRock=(S,cx,baseY,span,rise,thick,m=1)=>{const rx=span/2+thick,ry=rise+thick;S.ell(cx,baseY,rx,ry,m);S.cutEll(cx,baseY+6,span/2,rise+6);S.box(cx-rx-4,baseY,2*rx+8,26,m);};
// fxHill: a rounded hill (bell shaped, slightly lopsided), filled down to yb.
const fxHill=(S,cx,baseY,w,h,skew=0,yb)=>fxProf(S,[[cx-w,baseY],[cx-w*.62,baseY-h*.42],[cx+skew,baseY-h],[cx+w*.6,baseY-h*.5],[cx+w,baseY]],yb,3);
// fxBasin: a closed pool. Water is drawn as a plain rectangle, so the pit is cut to EXACTLY the same width (x0..x1) with straight rock walls,
// and the surface sits `drop` px below the ground so rock stands above the water at both ends. Rounded lips soften the rim. Returns the haz entry.
const fxBasin=(S,x0,x1,groundY,drop,floorY)=>{const top=x=>{for(let y=groundY-40;y<groundY+40;y++)if(fxSolid(S.T,x,y))return y;return groundY;};
 let a=top(x0-3),b=top(x1+3);if(a<=groundY-40)a=b;if(b<=groundY-40)b=a;const gy=Math.max(a,b),hi=Math.min(a,b);S.cut(x0,hi-14,x1-x0,floorY-hi+14);S.box(x0,floorY,x1-x0,8);return{x0,x1,y:gy+drop,y1:floorY,water:1};};
// fxBlocks: a tumbled stack of dressed stone, rows get narrower and ragged toward the top (ruins). m=2 draws as metal, so use 1.
const fxBlocks=(S,x0,x1,baseY,rows,bh=11,m=1)=>{for(let r=0;r<rows;r++){const y=baseY-(r+1)*bh,a=x0+Math.round(r*(x1-x0)*.07)+((r*37)%9),b=x1-Math.round(r*(x1-x0)*.09)-((r*53)%11);for(let x=a;x<b;x+=1){if(r>1&&((x*7+r*13)%29)<4)continue;S.box(x,y,1,bh,m);}}};
const fxTank=(S,x0,x1,y0,y1)=>S.cut(x0,y0,x1-x0,y1-y0);
// erosion pass: roughens ceilings (hanging fangs and chips) and cave walls with noise. Floors are never touched, and `prot` rects (puzzle walls, pit edges) are left exact.
const fxRough=(S,prot=[])=>{const T=S.T,w=T.w,h=T.h,m=T.m,ok=(x,y)=>!prot.some(r=>x>=r[0]&&x<r[2]&&y>=r[1]&&y<r[3]);
 const run=(x,y,dx,dy,v,max)=>{let n=0;while(n<max){const X=x+dx*n,Y=y+dy*n;if(X<0||Y<0||X>=w||Y>=h||(v?m[Y*w+X]!==1:m[Y*w+X]!==0))break;n++;}return n;};
 const ch=[];
 for(let x=4;x<w-4;x++)for(let y=4;y<h-4;y++){if(m[y*w+x]===1&&m[(y+1)*w+x]===0&&ok(x,y)){const L=run(x,y,0,-1,1,40),f=run(x,y+1,0,1,0,60);if(L<12||f<34)continue;const e=Math.round(S.n(x,.11,11)*5+S.n(x,.31,12)*3+1.2);if(e>0)for(let k=1;k<=e;k++)ch.push([x,y+k,1]);else if(e<-1&&L>=14)for(let k=0;k<Math.min(3,-e);k++)ch.push([x,y-k,0]);}}
 for(let y=4;y<h-4;y++)for(let x=4;x<w-5;x++){const a=m[y*w+x],b=m[y*w+x+1];if(a===1&&b===0&&ok(x,y)){const L=run(x,y,-1,0,1,30),F=run(x+1,y,1,0,0,30);if(L<12||F<24)continue;const sh=Math.round(S.n(y,.09,13)*3.2);if(sh>0)for(let k=1;k<=sh;k++)ch.push([x+k,y,1]);else for(let k=0;k<-sh;k++)ch.push([x-k,y,0]);}
  else if(a===0&&b===1&&ok(x,y)){const F=run(x,y,-1,0,0,30),L=run(x+1,y,1,0,1,30);if(L<12||F<24)continue;const sh=Math.round(S.n(y,.09,14)*3.2);if(sh>0)for(let k=0;k<sh;k++)ch.push([x+1+k,y,0]);else for(let k=1;k<=-sh;k++)ch.push([x+1-k,y,1]);}}
 for(const[x,y,v]of ch)m[y*w+x]=v;};
const fxPlank=(S,x0,x1,y)=>S.box(x0,y,x1-x0,3,3);

// ['K','ground',pts,rough,mat] ['K','roof',pts,rough,mat] ['K','mass',pts,r0,r1,mat] ['K','tunnel',pts,r] ['K','tank',x0,y0,x1,y1] ['K','erode']
const SCULPT_KINDS=[['ground','GROUND LINE'],['roof','ROOF LINE'],['mass','ROOT / ARM'],['tunnel','TUNNEL'],['tank','TANK']];
function sculptOp(S,o){const k=o[1];if(k==='ground')fxProf(S,o[2],0,o[3]===undefined?2:o[3],o[4]||1);else if(k==='roof')fxCeil(S,o[2],o[3]===undefined?3:o[3],o[4]||1);else if(k==='mass')fxMass(S,o[2],o[3]||10,o[4]||3,2,o[5]||1);
 else if(k==='tunnel')fxSpine(S,o[2],o[3]||12,3);else if(k==='tank')S.cut(Math.min(o[2],o[4]),Math.min(o[3],o[5]),Math.abs(o[4]-o[2]),Math.abs(o[5]-o[3]));else if(k==='erode')fxRough(S,o[2]||[]);}
{const _op=Shaper.prototype.op;Shaper.prototype.op=function(o){if(o&&o[0]==='K')return sculptOp(this,o);return _op.call(this,o);};}
