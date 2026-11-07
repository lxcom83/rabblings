// 48px Dwarf rig (HR=2): stocky, riveted helm with nose guard, braided beard over the chest, pauldrons, belt and buckle, studded boots.
// Same conventions as rig48 (art48.js): pose() doubled, drawn in a 48x48 cell, translate(-2,-3), feet bottom edge at 44 of 48 after the shift.
RIG48.dwarf=function(x,c,s,f,n){
 if(s==='splat'){x.save();x.scale(2,2);drawRig(x,c,s,f,n);x.restore();return;}
 const p=pose(s,f,n),t=f/n*Math.PI*2,S=Math.sin,C=Math.cos,R=Math.round;
 const P=(px,py,col,w=1,h=1)=>{x.fillStyle=col;x.fillRect(px|0,py|0,w,h);};
 const L=(a,b,e,g,col,th=1)=>{const st=Math.max(Math.abs(e-a),Math.abs(g-b),1);for(let i=0;i<=st;i++)P(R(a+(e-a)*i/st),R(b+(g-b)*i/st),col,th,th);};
 const d2=v=>[v[0]*2,v[1]*2];
 let by=p.by*2,lf=d2(p.lf),lb=d2(p.lb),af=d2(p.af),ab=d2(p.ab),open=p.open,lean=p.lean*2,tool=p.tool&&{k:p.tool.k,a:p.tool.a,l:p.tool.l*2,d:p.tool.d},bx=p.bx*2,hd=p.hd*2;
 if(s==='walk'){lf=[R(5*S(t)),-Math.max(0,R(3*C(t)))];lb=[R(-5*S(t)),-Math.max(0,R(-3*C(t)))];by=-R(Math.abs(S(t))*1.5);af=[R(-4*S(t))+2,4];ab=[R(4*S(t))-2,4];}
 if(s==='block'){af=[12,-6];ab=[-12,-6];lf=[7,0];lb=[-7,0];open=1;by=2;}
 if(s==='panic'){lf=[R(6*S(t)),-Math.max(0,R(5*C(t)))];lb=[R(-6*S(t)),-Math.max(0,R(-5*C(t)))];af=[8,-15+R(S(t*2)*2)];ab=[-8,-15-R(S(t*2)*2)];open=1;lean=2;}
 if(s==='bash'){const a=f<4?-2.3+f*.15:-2+(f-4)*.75;lean=f<4?-2:3;lf=[6,0];lb=[-6,0];af=[R(C(a)*9),R(S(a)*9)];ab=[af[0]-2,af[1]+2];tool={k:'club',a,l:18};open=f>=4?1:0;}
 if(s==='float'){af=[2,-12];ab=[2,-12];}
 by=Math.max(by,-6);x.save();x.translate(-2,-3);
 if(s==='drown'||s==='swim'){x.beginPath();x.rect(0,0,52,44);x.clip();}
 const ol='#090a0c',IR='#9aa0a6',IRD='#6b7178',IRK='#3b3d40',GOLD='#c9a43a',cx=24+bx,hy=36+by,sx=cx+lean,sy=hy-12;
 // short cloak tail behind
 const fl=(f+1)%2;P(cx-10+lean,hy-9,c.hoodD,3,13+fl);P(cx-9+lean,hy+4,c.hoodD,2,2+fl);P(cx-8+lean,hy-9,c.tunD,1,12);
 // back arm: sleeve to elbow, skin forearm, iron cuff, fist
 const bs=[sx-6,sy+3],bh=[sx-3+ab[0],sy+3+ab[1]],be=[(bs[0]+bh[0])/2-1,(bs[1]+bh[1])/2+2];
 L(bs[0],bs[1],be[0],be[1],c.tunD,4);L(be[0],be[1],bh[0],bh[1],c.skinD,3);L(be[0]+(bh[0]-be[0])*.55,be[1]+(bh[1]-be[1])*.55,bh[0],bh[1],IRD,3);P(bh[0]-1|0,bh[1]-1|0,c.skinD,5,4);P(bh[0]-1|0,bh[1]-1|0,IRD,5,1);
 // legs: trousers, knee guard, heavy boot with iron toe cap and sole
 const leg=(l,col,lt)=>{const fx=cx+l[0]-(bx<=4?bx:2),fy=45+l[1],kx=(cx+fx)/2+(l[0]>0?2:-2),ky=(hy+3+fy)/2;
  L(cx,hy+3,kx,ky,col,5);L(kx,ky,fx,fy-2,col,4);P(kx-2|0,ky-1|0,IRD,5,3);P(kx-2|0,ky-1|0,IR,5,1);
  P(fx-4|0,Math.min(fy-1,45),c.boot,10,2);P(fx-4|0,Math.min(fy+1,46),c.boot,11,2);P(fx-4|0,Math.min(fy+2,47),ol,11,1);P(fx+3|0,Math.min(fy+1,46),IRD,4,2);P(fx+3|0,Math.min(fy+1,46),IR,3,1);P(fx-3|0,Math.min(fy-1,45),lt,6,1);};
 leg(lb,c.tunD,c.tun);leg(lf,c.tun,c.skinL);
 // tunic skirt below the belt, with studs
 P(cx-8,hy+2,c.tun,16,5);P(cx-8,hy+2,c.tunD,16,1);for(let i=0;i<4;i++){P(cx-6+i*4,hy+3,c.tunD,1,4);P(cx-6+i*4,hy+3,IR,1,1);}P(cx-8,hy+6,c.tunD,16,1);
 // torso: tunic with chain-mail collar and shading, belt and buckle
 P(sx-8,sy,c.tun,16,hy-sy+1);P(sx-8,sy,c.tunD,2,hy-sy+1);P(sx+5,sy+1,c.tunD,3,hy-sy);
 for(let j=0;j<5;j++)P(sx-3,sy+1+j*2,c.tunD,8,1);
 P(sx-5,sy-1,IRD,12,2);for(let i=0;i<6;i++)P(sx-5+i*2,sy-1,i%2?IR:IRD,1,1);
 P(cx-8,hy-2,'#4a3622',16,3);P(cx-8,hy-2,'#6a4e30',16,1);P(cx-1,hy-3,GOLD,5,5);P(cx,hy-2,'#7a6a42',3,3);P(cx+1,hy-1,GOLD,1,1);
 // pauldrons (iron plates with rivets)
 P(sx-9,sy-1,IRD,6,5);P(sx-9,sy-1,IR,6,1);P(sx-8,sy+1,IRK,4,1);P(sx-7,sy,IR,1,1);
 P(sx+5,sy-1,IRD,6,5);P(sx+5,sy-1,IR,6,1);P(sx+6,sy+1,IRK,4,1);P(sx+8,sy,IR,1,1);
 // head: helm dome, rivets, brim, nose guard
 const hx=sx+1,hy2=sy-9+hd;
 P(hx-5,hy2,c.hoodD,11,1);P(hx-7,hy2+1,c.hood,15,1);P(hx-8,hy2+2,c.hood,17,4);P(hx-8,hy2+2,c.hoodD,2,4);P(hx+6,hy2+2,c.hoodD,3,4);
 P(hx-1,hy2,c.hoodD,2,6);P(hx-7,hy2+2,IR,3,1);P(hx-7,hy2+5,IRD,17,1);
 for(let i=0;i<4;i++)P(hx-6+i*4,hy2+4,IR,1,1);
 P(hx-9,hy2+6,c.hoodD,19,2);P(hx-9,hy2+6,IR,19,1);P(hx-9,hy2+7,c.hood,19,1);
 // face: brow shadow, eyes, nose, cheeks
 P(hx-6,hy2+8,c.skinD,13,1);P(hx-6,hy2+9,c.skin,13,3);P(hx+4,hy2+9,c.skinL,3,3);P(hx-6,hy2+9,c.skinD,2,3);
 P(hx-3,hy2+8,c.hoodD,5,1);P(hx+3,hy2+8,c.hoodD,5,1);
 P(hx-2,hy2+9,'#f0f0e0',3,2);P(hx+4,hy2+9,'#f0f0e0',3,2);P(hx-1,hy2+9,'#2a0806',2,2);P(hx+5,hy2+9,'#2a0806',2,2);
 P(hx+7,hy2+9,c.skinL,3,4);P(hx+8,hy2+12,c.skinD,2,1);P(hx+7,hy2+9,'#fff',1,1);
 P(hx-1,hy2+6,IRD,3,6);P(hx-1,hy2+6,IR,1,6);// nose guard
 // beard over chest: layered strands, two braids with beads
 const bw=[15,15,15,14,13,12,10,8,6],by0=hy2+12;
 bw.forEach((w,j)=>{const ox=hx-((w/2)|0)-(j>3?0:0);P(ox,by0+j,c.hood,w,1);P(ox,by0+j,c.hoodD,2,1);P(ox+w-2,by0+j,c.hoodD,2,1);if(j%2)for(let i=2;i<w-2;i+=3)P(ox+i,by0+j,c.hoodD,1,1);});
 P(hx-5,by0+3,c.hoodD,11,1);P(hx-5,by0,c.hood,11,1);
 L(hx-4,by0+8,hx-4,by0+13,c.hood,2);L(hx+3,by0+8,hx+3,by0+13,c.hood,2);P(hx-5,by0+13,GOLD,3,2);P(hx+2,by0+13,GOLD,3,2);P(hx-4,by0+11,c.hoodD,1,1);P(hx+3,by0+11,c.hoodD,1,1);
 // moustache and mouth
 P(hx+1,hy2+12,c.hood,10,2);P(hx+1,hy2+12,c.hoodD,10,1);
 if(open){P(hx+2,hy2+14,ol,6,3);P(hx+3,hy2+14,'#f0f0e0',4,1);P(hx+4,hy2+16,'#a33b2d',2,1);}
 // front arm: sleeve, skin forearm, iron cuff, fist
 const fs=[sx+6,sy+3],fh=[sx+3+af[0],sy+3+af[1]],fe=[(fs[0]+fh[0])/2+1,(fs[1]+fh[1])/2+2];
 L(fs[0],fs[1],fe[0],fe[1],c.tun,4);L(fe[0],fe[1],fh[0],fh[1],c.skin,3);L(fe[0]+(fh[0]-fe[0])*.55,fe[1]+(fh[1]-fe[1])*.55,fh[0],fh[1],IR,3);
 P(fh[0]-1|0,fh[1]-1|0,c.skin,5,4);P(fh[0]-1|0,fh[1]-1|0,IR,5,1);P(fh[0]+3|0,fh[1]+1|0,c.skinD,1,2);P(fh[0]+1|0,fh[1]+2|0,c.skinD,2,1);
 if(tool){const T=tool,hx0=fh[0]|0,hy0=fh[1]|0;
  if(T.k==='brolly'){L(hx0,hy0,hx0,hy0-5,'#513925',2);const ux=hx0-14,uy=hy0-9;[[6,0,18,'#5b313a'],[2,2,26,'#35374b'],[0,4,30,'#35374b'],[0,6,30,'#35374b']].forEach(([a,b,w,col])=>P(ux+a,uy+b,col,w,2));for(let i=0;i<4;i++)P(ux+i*10,uy+6,'#1d1f29',4,2);}
  else if(T.k==='plank'){P(hx0-2,hy0+(T.d?2:-2),'#8d6d42',18,4);P(hx0-2,hy0+(T.d?4:0),'#5c432c',18,2);P(hx0,hy0+(T.d?2:-2),IR,1,1);P(hx0+14,hy0+(T.d?2:-2),IR,1,1);}
  else{const ex=fh[0]+C(T.a)*T.l,ey=fh[1]+S(T.a)*T.l,nx=-S(T.a),ny=C(T.a);L(hx0,hy0,ex,ey,'#5c4026',2);
   if(T.k==='club'){L(ex-C(T.a)*6,ey-S(T.a)*6,ex+C(T.a)*3,ey+S(T.a)*3,'#7f5d38',7);L(ex-C(T.a)*1,ey-S(T.a)*1,ex+C(T.a)*1,ey+S(T.a)*1,IRD,7);P(ex-1|0,ey-1|0,IR,3,1);L(ex-C(T.a)*5,ey-S(T.a)*5,ex-C(T.a)*2,ey-S(T.a)*2,'#4a3622',1);}
   if(T.k==='pick'){L(ex-nx*8,ey-ny*8,ex+nx*8,ey+ny*8,IRD,3);P(ex+nx*8|0,ey+ny*8|0,'#fff',2,2);P(ex-nx*8|0,ey-ny*8|0,IR,2,2);P(ex-1|0,ey-1|0,IRK,3,3);}
   if(T.k==='shovel'){P(ex-4|0,ey|0,IRD,10,6);P(ex-4|0,ey|0,'#fff',2,4);P(ex-2|0,ey+6|0,IRK,6,2);P(ex-3|0,ey+1|0,IR,6,1);}}}
 x.restore();
};
