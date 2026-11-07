// 48px Fairy rig (RIG48.fairy). Same pose() as the 24px rig, doubled. Drawn in a 48x48 cell, then shifted by translate(-2,-3)
// so the body centre and ground line match the 24px sprite. Tiny, flighty trickster: big head with one large glowing eye,
// pointed ear, thistle-tuft antennae, silk dress, veined moth wings behind the back. Cold-blue glow only (eye, antenna tips, wing sheen).
function rigFairy(x,c,s,f,n){
 if(s==='splat'){x.save();x.scale(2,2);drawRig(x,c,s,f,n);x.restore();return;}
 const p=pose(s,f,n),t=f/n*Math.PI*2,S=Math.sin,C=Math.cos,R=Math.round;
 const P=(px,py,col,w=1,h=1)=>{x.fillStyle=col;x.fillRect(px|0,py|0,w,h);};
 const L=(a,b,e,g,col,th=1)=>{const st=Math.max(Math.abs(e-a),Math.abs(g-b),1);for(let i=0;i<=st;i++)P(R(a+(e-a)*i/st),R(b+(g-b)*i/st),col,th,th);};
 const mix=(h1,h2,k)=>{const a=hex2(h1),b=hex2(h2);return'rgb('+a.map((v,i)=>R(v+(b[i]-v)*k)).join(',')+')';};
 // scanline polygon fill with whole pixels (no antialiased fringe)
 const poly=(pts,col)=>{x.fillStyle=col;let lo=1e9,hi=-1e9;for(const q of pts){lo=Math.min(lo,q[1]);hi=Math.max(hi,q[1]);}
  for(let y=Math.floor(lo);y<=Math.ceil(hi);y++){const xs=[],m=y+.5;for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=m&&b[1]>m)||(b[1]<=m&&a[1]>m))xs.push(a[0]+(m-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
   xs.sort((u,v)=>u-v);for(let k=0;k+1<xs.length;k+=2){const x0=R(xs[k]),x1=R(xs[k+1]);if(x1>x0)x.fillRect(x0,y,x1-x0,1);}}};
 const d2=v=>[v[0]*2,v[1]*2];
 let by=p.by*2,lf=d2(p.lf),lb=d2(p.lb),af=d2(p.af),ab=d2(p.ab),open=p.open,lean=p.lean*2,tool=p.tool&&{k:p.tool.k,a:p.tool.a,l:p.tool.l*2,d:p.tool.d},bx=p.bx*2,hd=p.hd*2;
 if(s==='walk'){lf=[R(6*S(t)),-Math.max(0,R(4*C(t)))];lb=[R(-6*S(t)),-Math.max(0,R(-4*C(t)))];by=-R(Math.abs(S(t))*2);af=[R(-4*S(t))+2,4];ab=[R(4*S(t))-2,4];}
 if(s==='block'){af=[12,-6];ab=[-12,-6];lf=[7,0];lb=[-7,0];open=1;by=2;}
 if(s==='panic'){lf=[R(7*S(t)),-Math.max(0,R(6*C(t)))];lb=[R(-7*S(t)),-Math.max(0,R(-6*C(t)))];af=[8,-15+R(S(t*2)*2)];ab=[-8,-15-R(S(t*2)*2)];open=1;lean=2;}
 if(s==='bash'){const a=f<4?-2.3+f*.15:-2+(f-4)*.75;lean=f<4?-2:3;lf=[6,0];lb=[-6,0];af=[R(C(a)*9),R(S(a)*9)];ab=[af[0]-2,af[1]+2];tool={k:'club',a,l:20};open=f>=4?1:0;}
 if(s==='float'){af=[2,-12];ab=[2,-12];}
 by=Math.max(by,-6);x.save();x.translate(-2,-3);
 if(s==='drown'||s==='swim'){x.beginPath();x.rect(0,0,52,44);x.clip();}
 const ol='#090a0c',cx=24+bx,hy=36+by,sx=cx+lean,sy=hy-9;
 // ---- wings: two veined moth wings behind the back; they lift when airborne or startled
 const up=(s==='fall'||s==='panic'||s==='float'||s==='home'||s==='ohno'||s==='climb'||s==='hoist')?1:0;
 const fl=up?R(3*S(t*(s==='float'?2:1)+1)):(s==='walk'?R(S(t)*1.2):0);
 const ax=cx-3+lean,ay=sy+4,lift=up?4:0;
 const wm=mix(c.skinD,c.glow||'#bcd8ff',.28),wl=mix(c.skinL,c.glow||'#bcd8ff',.3),wd=mix(c.skinD,'#000000',.15);
 const up1=[[ax,ay],[ax-2,ay-8],[ax-7,ay-14-lift+fl],[ax-13,ay-15-lift+fl],[ax-14,ay-9-lift+fl],[ax-9,ay-1]];
 const lo1=[[ax,ay+1],[ax-9,ay-1],[ax-15,ay+2+fl*-1],[ax-14,ay+8+fl*-1],[ax-8,ay+8],[ax-2,ay+5]];
 poly(lo1,wd);poly(up1,wm);
 // inner shading and veins
 poly([[ax,ay],[ax-2,ay-8],[ax-5,ay-11-lift+fl],[ax-5,ay-4]],mix(wm,'#ffffff',.14));
 L(ax,ay,ax-12,ay-14-lift+fl,wl,1);L(ax-1,ay-1,ax-13,ay-9-lift+fl,wl,1);L(ax-1,ay-3,ax-8,ay-13-lift+fl,wl,1);L(ax-3,ay-6,ax-12,ay-12-lift+fl,wl,1);
 L(ax-1,ay+1,ax-14,ay+2-fl,wl,1);L(ax-1,ay+3,ax-12,ay+7-fl,wl,1);L(ax-3,ay+3,ax-8,ay+8,wl,1);
 // moth eyespots: dark ring with a cold glimmer
 P(ax-10,ay-11-lift+fl,c.hoodD,3,3);P(ax-9,ay-10-lift+fl,c.glow||'#bcd8ff',1,1);P(ax-11,ay+3-fl,c.hoodD,3,3);P(ax-10,ay+4-fl,c.glow||'#bcd8ff',1,1);
 // ---- back arm (thin)
 const bs=[sx-3,sy+3],be=[bs[0]+ab[0]*0.5-1,bs[1]+ab[1]*0.5+2],bh=[sx-3+ab[0],sy+3+ab[1]];
 L(bs[0],bs[1],be[0],be[1],c.skinD,2);L(be[0],be[1],bh[0],bh[1],c.skinD,2);P(bh[0]|0,bh[1]|0,c.skinD,3,3);P(bh[0]+2|0,bh[1]+1|0,c.skinD,2,1);
 // ---- legs: thin, with pointed silk slippers
 const leg=(l,col,lt)=>{const fx=cx+l[0]-(bx<=4?bx:2),fy=45+l[1],kx=(cx+fx)/2+(l[0]>0?2:-1),ky=(hy+4+fy)/2;
  L(cx,hy+4,kx,ky,col,2);L(kx,ky,fx,fy-1,col,2);P(kx|0,ky|0,lt,1,2);
  P(fx-2|0,Math.min(fy,46),c.boot,6,1);P(fx-2|0,Math.min(fy+1,46),c.boot,7,1);P(fx-1|0,Math.min(fy-1,45),c.boot,4,1);P(fx+4|0,Math.min(fy+1,46),c.boot,2,1);P(fx|0,Math.min(fy,46),c.skinD,2,1);};
 leg(lb,c.skinD,c.skin);leg(lf,c.skin,c.skinL);
 // ---- silk dress: bodice, belt, flared skirt with petal hem
 const top=sy,bot=hy+5;
 for(let y=top;y<=bot;y++){const j=(y-top)/(bot-top),mid=sx+(cx-sx)*j,hw=R(4+Math.max(0,j-.45)*9);
  P(mid-hw,y,c.tun,hw*2,1);P(mid-hw,y,c.tunD,Math.max(2,hw>>1),1);P(mid+hw-1,y,c.hood,1,1);
  if((y-top)%5===3&&j>.55)P(mid-hw+3,y,c.hoodD,hw*2-6,1);}
 for(let i=-8;i<=8;i+=3){const jj=i<0?1:0;P(cx+i-1+((lean*.3)|0),bot,c.tun,3,2+((i/3|0)&1)+jj);P(cx+i-1+((lean*.3)|0),bot+1,c.tunD,3,1);}
 P(sx-4,top+7,c.skin,9,2);P(sx-4,top+7,c.skinD,3,1);P(sx+2,top+7,c.glow||'#bcd8ff',2,2);P(sx+2,top+7,'#ffffff',1,1);
 // shoulder petals (thistle) and fine silk collar
 P(sx-6,top-1,c.hood,4,3);P(sx-6,top-1,c.skinL,4,1);P(sx+3,top-1,c.hood,4,3);P(sx+3,top-1,c.skinL,4,1);P(sx-2,top,c.skin,6,1);
 // ---- head
 const hx=sx+2,y0=sy-11+hd;
 const hl=[-4,-7,-8,-9,-10,-10,-10,-10,-10,-9,-8,-7,-5,-3],hr=[4,6,8,9,10,10,10,11,11,10,9,8,6,4];
 for(let r=0;r<14;r++){P(hx+hl[r],y0+r,c.skin,hr[r]-hl[r],1);P(hx+hl[r],y0+r,c.skinD,r<3?1:3,1);}
 P(hx-2,y0+1,c.skinL,8,2);P(hx-1,y0+3,c.skinL,6,1);P(hx+5,y0+9,c.skinL,3,2); // forehead and cheek light
 P(hx-6,y0+12,c.skinD,10,1);P(hx-3,y0+13,c.skinD,6,1); // jaw shade
 // swept-back hair in the clan colours
 for(let r=0;r<7;r++)P(hx-10+(r<2?3-r:0),y0+r,c.hood,5+(r<2?-1:0)+(r>3?-1:0),1);P(hx-10,y0+4,c.hoodD,3,3);P(hx-9,y0+7,c.hoodD,2,2);
 // thistle tuft antennae with cold-glow tips
 L(hx-3,y0+1,hx-7,y0-3,c.hood,2);P(hx-8,y0-4,c.glow||'#bcd8ff',2,2);L(hx+3,y0+1,hx+7,y0-3,c.hood,2);P(hx+7,y0-4,c.glow||'#bcd8ff',2,2);
 // pointed ear
 L(hx-9,y0+8,hx-16,y0+3,c.skin,2);P(hx-11,y0+6,c.skin,3,4);P(hx-13,y0+5,c.skinD,2,2);P(hx-9,y0+7,c.skinD,1,2);
 // one big glowing eye
 P(hx+2,y0+5,ol,7,1);P(hx+2,y0+6,c.skinL,7,5);P(hx+3,y0+11,c.skinL,5,1);P(hx+1,y0+7,ol,1,3);
 P(hx+4,y0+6,c.glow||'#bcd8ff',4,5);P(hx+5,y0+7,ol,2,3);P(hx+4,y0+6,'#ffffff',1,1);
 P(hx+3,y0+5,c.skinD,1,1);
 // nose and mouth
 P(hx+11,y0+8,c.skinD,2,2);P(hx+10,y0+7,c.skin,1,1);
 if(open){P(hx+3,y0+10,'#2a0806',6,3);P(hx+4,y0+10,c.skinL,4,1);P(hx+5,y0+12,'#7a3a3a',2,1);}else{P(hx+4,y0+11,'#2a0806',5,1);P(hx+3,y0+10,c.skinD,1,1);}
 // ---- front arm (thin) and hand
 const fs=[sx+3,sy+3],fh=[sx+3+af[0],sy+3+af[1]],fe=[fs[0]+af[0]*0.5+1,fs[1]+af[1]*0.5+2];
 L(fs[0],fs[1],fe[0],fe[1],c.skin,2);L(fe[0],fe[1],fh[0],fh[1],c.skin,2);P(fe[0]|0,fe[1]|0,c.skinL,2,1);
 P(fh[0]|0,fh[1]|0,c.skinL,3,3);P(fh[0]+3|0,fh[1]|0,c.skinD,2,1);P(fh[0]+3|0,fh[1]+2|0,c.skinD,2,1);
 if(tool){const T=tool,hx0=fh[0]|0,hy0=fh[1]|0;
  if(T.k==='brolly'){L(hx0,hy0,hx0,hy0-5,'#513925',2);const ux=hx0-14,uy=hy0-9;[[6,0,18,'#5b313a'],[2,2,26,'#35374b'],[0,4,30,'#35374b'],[0,6,30,'#35374b']].forEach(([a,b,w,col])=>P(ux+a,uy+b,col,w,2));for(let i=0;i<4;i++)P(ux+i*10,uy+6,'#1d1f29',4,2);}
  else if(T.k==='plank'){P(hx0-2,hy0+(T.d?2:-2),'#8d6d42',18,4);P(hx0-2,hy0+(T.d?4:0),'#5c432c',18,2);}
  else{const ex=fh[0]+C(T.a)*T.l,ey=fh[1]+S(T.a)*T.l,nx=-S(T.a),ny=C(T.a);L(hx0,hy0,ex,ey,'#5c4026',2);
   if(T.k==='club'){L(ex-C(T.a)*6,ey-S(T.a)*6,ex+C(T.a)*3,ey+S(T.a)*3,'#7f5d38',6);P(ex|0,ey|0,'#818a94',3,3);P(ex-2|0,ey-1|0,'#aab3bb',2,1);L(ex-C(T.a)*5,ey-S(T.a)*5,ex-C(T.a)*2,ey-S(T.a)*2,'#4a3622',1);}
   if(T.k==='pick'){L(ex-nx*8,ey-ny*8,ex+nx*8,ey+ny*8,'#727981',2);P(ex+nx*8|0,ey+ny*8|0,'#fff',2,2);P(ex|0,ey|0,'#515357',2,2);}
   if(T.k==='shovel'){P(ex-4|0,ey|0,'#6b7178',10,6);P(ex-4|0,ey|0,'#fff',2,4);P(ex-2|0,ey+6|0,'#515357',6,2);}}}
 x.restore();
}
RIG48.fairy=rigFairy;
