// 48px rig (HR=2): same pose() as the 24px rig, doubled, with a detailed skeleton body.
// Drawn in a 48x48 cell and shifted so feet land on the same ground line and the body on the same centre as the 24px rig.
function rig48(x,c,s,f,n){
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
 const ol='#090a0c',cx=24+bx,hy=36+by,sx=cx+lean,sy=hy-12;
 // ragged cloak behind: folds + torn hem
 const fl=(f+1)%2;for(let j=0;j<15;j++){const w=3+(j>9?1:0);P(cx-9+lean-(j>9?1:0),hy-14+j,j%4==0?c.tun:c.hoodD,w,1);}
 P(cx-10+lean,hy+1+fl,c.hoodD,3,3);P(cx-8+lean,hy+2,c.hoodD,2,4+fl);P(cx-6+lean,hy+3,c.hoodD,2,3);P(cx-12+lean,hy-6,c.hood,1,6);
 // back arm: humerus, elbow, forearm, hand bones
 const bs=[sx-3,sy+3],be=[bs[0]+ab[0]*0.5-1,bs[1]+ab[1]*0.5+2],bh=[sx-3+ab[0],sy+3+ab[1]];
 L(bs[0],bs[1],be[0],be[1],c.skinD,3);L(be[0],be[1],bh[0],bh[1],c.skinD,2);P(be[0]-1|0,be[1]-1|0,c.skin,3,3);P(bh[0]|0,bh[1]|0,c.skinD,4,3);
 // legs: femur, knee cap, tibia, foot
 const leg=(l,col,lt)=>{const fx=cx+l[0]-(bx<=4?bx:2),fy=45+l[1],kx=(cx+fx)/2+(l[0]>0?3:-2),ky=(hy+3+fy)/2;
  L(cx,hy+3,kx,ky,col,3);L(kx,ky,fx,fy-1,col,2);P(kx-1|0,ky-1|0,lt,4,3);P(kx|0,ky|0,c.skinD,2,1);P(fx-2|0,Math.min(fy+1,47),c.boot,8,1);P(fx-2|0,Math.min(fy,46),c.boot,7,1);P(fx-1|0,Math.min(fy-1,45),c.boot,5,1);P(fx+3|0,Math.min(fy+1,47),c.skinD,3,1);};
 leg(lb,c.skinD,c.skin);leg(lf,c.skin,c.skinL);
 // pelvis + loincloth + belt
 P(cx-6,hy-2,c.skinD,12,4);P(cx-5,hy-2,c.skin,10,1);P(cx-1,hy,ol,2,2);P(cx-7,hy+2,c.tun,14,4);P(cx-7,hy+2,c.hoodD,14,1);
 P(cx-6,hy+6,c.tun,3,3);P(cx-1,hy+6,c.tun,2,2);P(cx+3,hy+6,c.tun,3,1);P(cx-7,hy-1,'#4a3622',14,2);P(cx-1,hy-1,'#c9a43a',3,2);P(cx,hy-1,'#7a6a42',1,2);
 // spine (vertebrae) + ribcage (individual ribs, sternum)
 const sp=sx+((lean*.5)|0);for(let j=0;j<12;j++)P(sp-1,sy+2+j,j%2?c.skinD:c.skin,3,1);
 for(let j=0;j<6;j++){const w=11-Math.abs(j-1)*1,y=sy+3+j*2;P(sp-(w>>1),y,c.skinL,w,1);P(sp-(w>>1),y+1,c.skinD,w,1);P(sp-(w>>1)+1,y,ol,1,1);P(sp+(w>>1)-1,y,ol,1,1);}
 P(sp+1,sy+3,c.skin,1,10);// sternum
 P(sx-6,sy,c.tun,12,3);P(sx-7,sy+1,c.skinL,3,3);P(sx+4,sy+1,c.skinL,3,3);P(sx-5,sy+3,c.skin,3,1);P(sx+3,sy+3,c.skin,3,1); // collar/shoulders
 // neck bones
 P(sx,sy-2,c.skinD,3,3);
 // skull: hood cowl w/ folds, cranium w/ crack + shading, sockets, glow, nose, jaw + teeth
 const hx=sx+2,hy2=sy-14+hd;
 P(hx-8,hy2+3,c.hood,17,13);P(hx-7,hy2+1,c.hood,15,2);P(hx-5,hy2,c.hood,11,1);P(hx-9,hy2+7,c.hood,3,10);P(hx-8,hy2+15,c.hoodD,5,3);P(hx-9,hy2+5,c.hoodD,2,3);
 for(let j=0;j<4;j++)P(hx-7+j*2,hy2+2,c.hoodD,1,2);
 P(hx-5,hy2+3,c.skinL,13,3);P(hx-6,hy2+6,c.skin,14,7);P(hx-5,hy2+5,c.skinL,3,2);P(hx+5,hy2+6,c.skinD,3,6);
 P(hx-1,hy2+3,c.skinD,1,3);P(hx,hy2+5,c.skinD,1,2);P(hx-1,hy2+6,c.skinD,1,1); // crack
 P(hx-4,hy2+8,ol,4,4);P(hx+3,hy2+8,ol,4,4);P(hx-3,hy2+9,c.glow,2,2);P(hx+4,hy2+9,c.glow,2,2);P(hx-3,hy2+9,'#ffb090',1,1);P(hx+4,hy2+9,'#ffb090',1,1);
 P(hx+1,hy2+12,ol,2,2);P(hx,hy2+11,c.skinD,1,1);
 const jy=hy2+13+(open?3:0);P(hx-5,jy,c.skin,12,3);P(hx-5,jy+2,c.skinD,12,1);
 for(let i=0;i<6;i++)P(hx-4+i*2,jy,i%2?c.skinL:ol,1,2);
 if(open){P(hx-4,jy-2,ol,10,2);for(let i=0;i<4;i++)P(hx-3+i*2,jy-3,c.skinL,1,1);}
 // front arm: shoulder -> elbow -> hand with fingers
 const fs=[sx+3,sy+3],fh=[sx+3+af[0],sy+3+af[1]],fe=[fs[0]+af[0]*0.5+1,fs[1]+af[1]*0.5+2];
 L(fs[0],fs[1],fe[0],fe[1],c.skin,3);L(fe[0],fe[1],fh[0],fh[1],c.skin,2);P(fe[0]-1|0,fe[1]-1|0,c.skinL,3,3);
 P(fh[0]|0,fh[1]|0,c.skinL,4,3);P(fh[0]+3|0,fh[1]|0,c.skinD,1,1);P(fh[0]+1|0,fh[1]+3|0,c.skinD,1,1);P(fh[0]+3|0,fh[1]+2|0,c.skinD,1,1);
 if(tool){const T=tool,hx0=fh[0]|0,hy0=fh[1]|0;
  if(T.k==='brolly'){L(hx0,hy0,hx0,hy0-5,'#513925',2);const ux=hx0-14,uy=hy0-9;[[6,0,18,'#5b313a'],[2,2,26,'#35374b'],[0,4,30,'#35374b'],[0,6,30,'#35374b']].forEach(([a,b,w,col])=>P(ux+a,uy+b,col,w,2));for(let i=0;i<4;i++)P(ux+i*10,uy+6,'#1d1f29',4,2);}
  else if(T.k==='plank'){P(hx0-2,hy0+(T.d?2:-2),'#8d6d42',18,4);P(hx0-2,hy0+(T.d?4:0),'#5c432c',18,2);}
  else{const ex=fh[0]+C(T.a)*T.l,ey=fh[1]+S(T.a)*T.l,nx=-S(T.a),ny=C(T.a);L(hx0,hy0,ex,ey,'#5c4026',2);
   if(T.k==='club'){L(ex-C(T.a)*6,ey-S(T.a)*6,ex+C(T.a)*3,ey+S(T.a)*3,'#7f5d38',6);P(ex|0,ey|0,'#818a94',3,3);P(ex-2|0,ey-1|0,'#aab3bb',2,1);L(ex-C(T.a)*5,ey-S(T.a)*5,ex-C(T.a)*2,ey-S(T.a)*2,'#4a3622',1);}
   if(T.k==='pick'){L(ex-nx*8,ey-ny*8,ex+nx*8,ey+ny*8,'#727981',2);P(ex+nx*8|0,ey+ny*8|0,'#fff',2,2);P(ex|0,ey|0,'#515357',2,2);}
   if(T.k==='shovel'){P(ex-4|0,ey|0,'#6b7178',10,6);P(ex-4|0,ey|0,'#fff',2,4);P(ex-2|0,ey+6|0,'#515357',6,2);}}}
 x.restore();
}

RIG48.bone=rig48;
