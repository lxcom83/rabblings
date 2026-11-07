// 48px rig for the Imps (HR=2): same pose() as the 24px rig, doubled, with horns, pointed ears, fangs, clawed hands and feet and a spade-tipped tail.
// Same conventions as rig48 in art48.js: drawn in a 48x48 cell and shifted so feet land on the same ground line and the body on the same centre as the 24px rig.
function rigImp(x,c,s,f,n){
 if(s==='splat'){x.save();x.scale(2,2);drawRig(x,c,s,f,n);x.restore();return;}
 const p=pose(s,f,n),t=f/n*Math.PI*2,S=Math.sin,C=Math.cos,R=Math.round;
 const P=(px,py,col,w=1,h=1)=>{x.fillStyle=col;x.fillRect(px|0,py|0,w,h);};
 const L=(a,b,e,g,col,th=1)=>{const st=Math.max(Math.abs(e-a),Math.abs(g-b),1);for(let i=0;i<=st;i++)P(R(a+(e-a)*i/st),R(b+(g-b)*i/st),col,th,th);};
 const d2=v=>[v[0]*2,v[1]*2];
 let by=p.by*2,lf=d2(p.lf),lb=d2(p.lb),af=d2(p.af),ab=d2(p.ab),open=p.open,lean=p.lean*2,tool=p.tool&&{k:p.tool.k,a:p.tool.a,l:p.tool.l*2,d:p.tool.d},bx=p.bx*2,hd=p.hd*2;
 if(s==='walk'){lf=[R(6*S(t)),-Math.max(0,R(4*C(t)))];lb=[R(-6*S(t)),-Math.max(0,R(-4*C(t)))];by=-R(Math.abs(S(t))*2);af=[R(-4*S(t))+2,4];ab=[R(4*S(t))-2,4];}
 if(s==='block'){af=[12,-6];ab=[-12,-6];lf=[7,0];lb=[-7,0];open=1;by=2;}
 if(s==='panic'){lf=[R(7*S(t)),-Math.max(0,R(6*C(t)))];lb=[R(-7*S(t)),-Math.max(0,R(-6*C(t)))];af=[8,-15+R(S(t*2)*2)];ab=[-8,-15-R(S(t*2)*2)];open=1;lean=2;}
 if(s==='bash'){const a=f<4?-2.3+f*.15:-2+(f-4)*.75;lean=f<4?-2:3;lf=[6,0];lb=[-6,0];af=[R(C(a)*9),R(S(a)*9)];ab=[af[0]-2,af[1]+2];tool={k:'club',a,l:20};open=f>=4?1:0;}
 if(s==='float'){af=[2,-12];ab=[2,-12];}
 by=Math.max(by,-6);x.save();x.translate(-2,-3);
 if(s==='drown'||s==='swim'){x.beginPath();x.rect(0,0,52,44);x.clip();}
 const ol='#090a0c',leather='#4a3622',gold='#c9a43a',fang='#f4ecd8',claw=c.hood,ember='#ffd9a0';
 const cx=24+bx,hy=37+by,sx=cx+lean,sy=hy-8,hx=sx+2,hy2=sy-16+hd;
 // spade-tipped tail, swishing
 if(c.tail){const w=R(S(t)*2),pts=[[cx-4,hy+1],[cx-9,hy+4],[cx-14,hy+3],[cx-18,hy-1+w],[cx-20,hy-6+w]];
  for(let i=0;i<4;i++)L(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],c.skinD,2);
  for(let i=0;i<4;i++)L(pts[i][0],pts[i][1]-1,pts[i+1][0],pts[i+1][1]-1,c.skin,1);
  const tx=pts[4][0],ty=pts[4][1];P(tx-1,ty-7,c.hood,3,1);P(tx-2,ty-6,c.hood,5,2);P(tx-1,ty-4,c.hood,3,1);P(tx,ty-3,c.hoodD,1,2);P(tx-1,ty-6,ember,1,1);P(tx+2,ty-5,c.hoodD,1,1);}
 // back arm: upper arm, elbow, forearm, clawed hand
 const hand=(h,col,lt)=>{const a=h[0]|0,b=h[1]|0;P(a,b,col,4,3);P(a,b,lt,3,1);P(a+4,b,claw,2,1);P(a+3,b+3,claw,2,1);P(a+4,b+2,claw,2,1);};
 const bs=[sx-3,sy+3],be=[bs[0]+ab[0]*0.5-1,bs[1]+ab[1]*0.5+2],bh=[sx-3+ab[0],sy+3+ab[1]];
 L(bs[0],bs[1],be[0],be[1],c.skinD,3);L(be[0],be[1],bh[0],bh[1],c.skinD,2);P(be[0]-1|0,be[1]-1|0,c.skin,3,3);P(be[0]|0,be[1]|0,leather,2,1);hand(bh,c.skinD,c.skin);
 // legs: thigh, knee, shin, clawed foot
 const leg=(l,col,lt)=>{const fx=cx+l[0]-(bx<=4?bx:2),fy=45+l[1],kx=(cx+fx)/2+(l[0]>0?3:-2),ky=(hy+2+fy)/2,fb=Math.min(fy+1,46);
  L(cx,hy+2,kx,ky,col,4);L(kx,ky,fx,fy-2,col,3);P(kx-1|0,ky-1|0,lt,3,2);
  P(fx-2|0,fb-2,c.boot,9,3);P(fx-2|0,fb-2,c.tunD,5,1);P(fx+1|0,fb-3,c.boot,4,1);P(fx+7|0,fb-1,claw,2,1);P(fx+7|0,fb,claw,2,1);P(fx-2|0,fb,ol,9,1);};
 leg(lb,c.skinD,c.skin);leg(lf,c.skin,c.skinL);
 // tunic: sleeveless, ragged hem, open chest, belt with an ember buckle
 for(let j=0;j<10;j++){const k=j/9,xx=R(sx+(cx-sx)*k),w=j<2?12:j<7?13:14;P(xx-(w>>1),sy+j,c.tun,w,1);P(xx-(w>>1),sy+j,c.tunD,2,1);if(j%4===2)P(xx-(w>>1)+3,sy+j,c.tunD,3,1);}
 for(let i=0;i<7;i++)P(cx-7+i*2,sy+10,i%2?c.tunD:c.tun,2,1+(i%3===1?2:1));
 P(sx-1,sy+1,c.skin,4,7);P(sx-1,sy+1,c.skinL,1,6);P(sx+2,sy+3,c.skinD,1,3);P(sx,sy+5,c.skinD,3,1);P(sx,sy+7,c.skinD,3,1);
 P(cx-7,hy-1,leather,14,2);P(cx-7,hy-1,'#6a4e30',14,1);P(cx-1,hy-1,gold,3,2);P(cx,hy-1,c.glow,1,2);P(cx+4,hy+1,leather,3,3);P(cx+4,hy+1,'#6a4e30',3,1);
 P(sx-6,sy-1,c.tunD,4,3);P(sx+3,sy-1,c.tunD,4,3);P(sx+3,sy-1,c.tun,2,1);P(sx+6,sy-3,claw,1,2);// shoulder pads with a spike
 // head: horns with ridges, pointed ear, brow, glowing eyes, snout, fangs
 const rows=[[-5,5],[-7,7],[-8,8],[-9,9],[-9,10],[-9,10],[-9,11],[-9,11],[-9,11],[-8,11],[-8,10],[-7,9],[-6,8],[-4,5]];
 const horn=(a,b,m,n2,e,g,col,dk)=>{L(a,b,m,n2,col,3);L(m,n2,e,g,col,2);L(a-1,b+1,m-1,n2+1,dk,1);L(m-1,n2+1,e-1,g+1,dk,1);P((a+m)>>1,((b+n2)>>1)+1,dk,3,1);P(e,g,'#fff6dc',1,1);};
 horn(hx-4,hy2+6,hx-7,hy2+3,hx-9,hy2,c.hood,c.hoodD);horn(hx+4,hy2+6,hx+7,hy2+3,hx+8,hy2,c.hood,c.hoodD);
 P(hx-6,hy2+6,c.hoodD,4,1);P(hx+3,hy2+6,c.hoodD,4,1);
 rows.forEach(([l,r],k)=>{const y=hy2+4+k;P(hx+l,y,c.skin,r-l+1,1);P(hx+l,y,c.skinD,2,1);if(k===1||k===2)P(hx-3,y,c.skinL,7,1);if(k>=12)P(hx+l+1,y,c.skinD,r-l-1,1);else if(k>=10)P(hx+l+2,y,c.skinD,2,1);});
 P(hx+9,hy2+11,c.skinL,2,1);// snout highlight
 // near ear, pointing back
 P(hx-10,hy2+10,c.skin,2,4);P(hx-12,hy2+9,c.skin,2,3);P(hx-14,hy2+8,c.skin,2,2);P(hx-15,hy2+7,c.skinD,1,2);P(hx-10,hy2+11,c.skinD,2,2);P(hx-12,hy2+10,c.skinD,1,1);
 // eyes and brows
 P(hx-6,hy2+10,ol,4,3);P(hx-5,hy2+11,c.glow,2,1);P(hx-5,hy2+10,ember,1,1);
 P(hx+2,hy2+9,ol,6,4);P(hx+3,hy2+10,c.glow,4,2);P(hx+3,hy2+10,ember,1,1);P(hx+6,hy2+10,'#2a0806',1,2);
 L(hx+1,hy2+9,hx+9,hy2+7,c.skinD,2);L(hx-7,hy2+9,hx-3,hy2+10,c.skinD,1);
 P(hx+10,hy2+13,ol,1,2);P(hx-3,hy2+14,c.skinD,2,2);P(hx-6,hy2+7,c.skinL,1,1);P(hx+6,hy2+5,c.skinL,1,1);P(hx+1,hy2+13,c.skinL,1,1);
 // mouth
 if(open){P(hx-1,hy2+14,ol,11,4);P(hx,hy2+15,'#5a1410',9,2);P(hx+2,hy2+16,'#c0392b',4,1);P(hx+2,hy2+14,fang,1,2);P(hx+8,hy2+14,fang,1,2);P(hx+4,hy2+17,fang,1,1);P(hx+7,hy2+17,fang,1,1);}
 else{P(hx-1,hy2+15,ol,11,1);P(hx+3,hy2+16,fang,1,2);P(hx+8,hy2+16,fang,1,2);}
 // front arm
 const fs=[sx+3,sy+3],fh=[sx+3+af[0],sy+3+af[1]],fe=[fs[0]+af[0]*0.5+1,fs[1]+af[1]*0.5+2];
 L(fs[0],fs[1],fe[0],fe[1],c.skin,3);L(fe[0],fe[1],fh[0],fh[1],c.skin,2);P(fe[0]-1|0,fe[1]-1|0,c.skinL,3,3);P(fe[0]-1|0,fe[1]+1|0,leather,3,1);hand(fh,c.skinL,c.skinL);
 if(tool){const T=tool,hx0=fh[0]|0,hy0=fh[1]|0;
  if(T.k==='brolly'){L(hx0,hy0,hx0,hy0-5,'#513925',2);const ux=hx0-14,uy=hy0-9;[[6,0,18,'#5b313a'],[2,2,26,'#35374b'],[0,4,30,'#35374b'],[0,6,30,'#35374b']].forEach(([a,b,w,col])=>P(ux+a,uy+b,col,w,2));for(let i=0;i<4;i++)P(ux+i*10,uy+6,'#1d1f29',4,2);for(let i=0;i<5;i++)P(ux+2+i*6,uy+8,'#35374b',3,1);}
  else if(T.k==='plank'){P(hx0-2,hy0+(T.d?2:-2),'#8d6d42',18,4);P(hx0-2,hy0+(T.d?4:0),'#5c432c',18,2);P(hx0+3,hy0+(T.d?2:-2),'#6f5233',1,2);P(hx0+10,hy0+(T.d?3:-1),'#a88458',3,1);}
  else{const ex=fh[0]+C(T.a)*T.l,ey=fh[1]+S(T.a)*T.l,nx=-S(T.a),ny=C(T.a);L(hx0,hy0,ex,ey,'#5c4026',2);
   if(T.k==='club'){L(ex-C(T.a)*6,ey-S(T.a)*6,ex+C(T.a)*3,ey+S(T.a)*3,'#7f5d38',6);L(ex-C(T.a)*6+nx,ey-S(T.a)*6+ny,ex+C(T.a)*3+nx,ey+S(T.a)*3+ny,'#9a7448',1);P(ex|0,ey|0,'#818a94',3,3);P(ex-2|0,ey-1|0,'#aab3bb',2,1);P(ex+nx*3|0,ey+ny*3|0,'#818a94',2,2);P(ex-nx*3|0,ey-ny*3|0,'#818a94',2,2);L(ex-C(T.a)*5,ey-S(T.a)*5,ex-C(T.a)*2,ey-S(T.a)*2,'#4a3622',1);}
   if(T.k==='pick'){L(ex-nx*8,ey-ny*8,ex+nx*8,ey+ny*8,'#727981',2);P(ex+nx*8|0,ey+ny*8|0,'#fff',2,2);P(ex-nx*8|0,ey-ny*8|0,'#fff',2,2);P(ex|0,ey|0,'#515357',2,2);L(ex-nx*6+1,ey-ny*6+1,ex+nx*6+1,ey+ny*6+1,'#515357',1);}
   if(T.k==='shovel'){P(ex-4|0,ey|0,'#6b7178',10,6);P(ex-4|0,ey|0,'#fff',2,4);P(ex-2|0,ey+6|0,'#515357',6,2);P(ex+4|0,ey+1|0,'#515357',1,4);}}}
 x.restore();
}
RIG48.imp=rigImp;
