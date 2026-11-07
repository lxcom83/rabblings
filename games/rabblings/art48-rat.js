// 48px Ratfolk rig (HR=2). Same pose() as the 24px rig, doubled; same cell, ground line and centre as rig48 in art48.js.
// Gadget-keeping rat: big round ears, goggle lens over one eye, long snout with whiskers and buck teeth, patched tunic,
// scrap backpack with a cog, segmented bare tail, clawed hands and feet.
RIG48.rat=function(x,c,s,f,n){
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
 const ol='#090a0c',claw='#e8e0cc',brass=c.hood,brassD=c.hoodD,steel='#8a8f96',steelL='#c4c9cf',leather='#4a3622';
 const cx=24+bx,hy=36+by,sx=cx+lean,sy=hy-5;
 // tail: long bare tail with segment rings and a brass ring near the tip
 {const sw=s==='walk'||s==='panic'?R(S(t*2)*2):0,P0=[cx-5+lean,hy+2],P1=[cx-13,hy+7+sw],P2=[cx-18,hy+2+sw],P3=[cx-20,hy-6-sw];
  let prev=P0;for(let i=1;i<=22;i++){const u=i/22,q=1-u,X=q*q*q*P0[0]+3*q*q*u*P1[0]+3*q*u*u*P2[0]+u*u*u*P3[0],Y=q*q*q*P0[1]+3*q*q*u*P1[1]+3*q*u*u*P2[1]+u*u*u*P3[1];
   L(prev[0],prev[1],X,Y,i%3===0?c.skin:c.skinD,i<14?3:2);prev=[X,Y];if(i===19)P(X-1|0,Y-1|0,brass,4,4),P(X|0,Y|0,brassD,2,2);}
  P(P3[0]-1|0,P3[1]-3|0,c.skinD,2,3);}
 // scrap backpack: small sack, patch, a cog and a copper pipe sticking out
 P(cx-12+lean,hy-8,6,10);P(cx-12+lean,hy-8,c.hoodD,6,10);P(cx-11+lean,hy-9,brass,4,2);P(cx-12+lean,hy-7,c.hood,1,8);P(cx-10+lean,hy-4,c.tun,3,3);
 P(cx-11+lean,hy-12,steel,4,3);P(cx-10+lean,hy-13,steel,2,1);P(cx-10+lean,hy-11,c.hoodD,2,1);P(cx-9+lean,hy-12,steelL,1,1);
 L(cx-8+lean,hy-9,cx-8+lean,hy-13,brass,2);
 // back arm: sleeve, forearm, clawed hand
 const bs=[sx-3,sy+3],be=[bs[0]+ab[0]*0.5-1,bs[1]+ab[1]*0.5+2],bh=[sx-3+ab[0],sy+3+ab[1]];
 L(bs[0],bs[1],be[0],be[1],c.tunD,3);L(be[0],be[1],bh[0],bh[1],c.skinD,2);P(bh[0]|0,bh[1]|0,c.skinD,4,3);P(bh[0]+3|0,bh[1]+1|0,claw,2,1);P(bh[0]+2|0,bh[1]+3|0,claw,1,1);
 // legs: thigh, knee, shin, big clawed foot in a patched boot
 const leg=(l,col,lt)=>{const fx=cx+l[0]-(bx<=4?bx:2),fy=45+l[1],kx=(cx+fx)/2+(l[0]>0?3:-2),ky=(hy+3+fy)/2;
  L(cx,hy+3,kx,ky,col,3);L(kx,ky,fx,fy-1,col,2);P(kx-1|0,ky-1|0,lt,3,2);
  P(fx-2|0,Math.min(fy+1,47),c.boot,9,1);P(fx-2|0,Math.min(fy,46),c.boot,8,1);P(fx-1|0,Math.min(fy-1,45),c.boot,5,1);P(fx|0,Math.min(fy,46),c.hood,2,1);
  P(fx+6|0,Math.min(fy+1,47),claw,1,1);P(fx+4|0,Math.min(fy+1,47),c.skinD,2,1);};
 leg(lb,c.skinD,c.skin);leg(lf,c.skin,c.skinL);
 // hunched torso: patched tunic, belt with cog buckle
 P(sx-6,hy-6,c.tun,12,9);P(sx-6,hy-6,c.tunD,2,9);P(sx-7,hy-4,c.tun,2,5);P(sx-6,hy+2,c.tunD,12,1);
 P(sx+1,hy-5,c.hood,4,4);P(sx+2,hy-4,c.hoodD,2,1);P(sx+1,hy-2,c.hoodD,4,1);// patch with stitches
 P(sx-3,hy-3,c.tunD,1,3);
 P(sx-6,hy-1,leather,12,2);P(sx-1,hy-2,steel,4,4);P(sx,hy-1,leather,2,2);P(sx,hy-2,steelL,1,1);P(sx+3,hy-1,steelL,1,1);
 P(sx-6,hy+3,c.tun,3,3);P(sx-1,hy+3,c.tun,2,2);P(sx+3,hy+3,c.tun,3,1);// ragged hem
 // head: big skull, round ears, long snout, goggle lens, whiskers, buck teeth
 const hx=sx+2,hy2=hy-22+hd;
 P(hx-8,hy2+5,c.skin,12,12);P(hx-7,hy2+4,c.skin,10,1);P(hx-7,hy2+17,c.skinD,10,1);P(hx-9,hy2+7,c.skinD,2,8);P(hx-6,hy2+5,c.skinL,8,2);P(hx-7,hy2+7,c.skinL,3,2);P(hx+2,hy2+8,c.skinD,2,8);
 P(hx+3,hy2+9,c.skin,6,7);P(hx+9,hy2+10,c.skin,3,5);P(hx+3,hy2+9,c.skinL,7,1);P(hx+3,hy2+15,c.skinD,9,1);
 P(hx+12,hy2+10,'#c97b7b',3,3);P(hx+12,hy2+10,'#e8a8a8',1,1);P(hx+14,hy2+11,ol,1,1);
 // ears: outer skin, inner pink
 P(hx-7,hy2,c.skinD,6,6);P(hx-6,hy2-1,c.skinD,4,1);P(hx-6,hy2+1,'#c98f8a',4,4);P(hx-5,hy2+1,'#e1b0aa',2,2);
 P(hx,hy2,c.skinD,6,6);P(hx+1,hy2-1,c.skinD,4,1);P(hx+1,hy2+1,'#c98f8a',4,4);P(hx+2,hy2+1,'#e1b0aa',2,2);
 // goggle strap + lens over the eye
 P(hx-8,hy2+9,brassD,9,2);P(hx+1,hy2+7,brass,7,7);P(hx+2,hy2+6,brass,5,1);P(hx+2,hy2+14,brassD,5,1);P(hx+2,hy2+8,'#a8d6dc',5,5);P(hx+3,hy2+8,'#d8f0f0',1,1);
 P(hx+4,hy2+9,c.glow||'#f0c040',2,3);P(hx+5,hy2+10,ol,1,2);
 // whiskers
 L(hx+9,hy2+13,hx+15,hy2+11,'#b8b2a6',1);L(hx+9,hy2+14,hx+15,hy2+16,'#b8b2a6',1);
 // mouth and teeth
 if(open){P(hx+4,hy2+16,ol,8,4);P(hx+4,hy2+15,c.skinD,8,1);P(hx+5,hy2+17,'#b04a4a',5,2);P(hx+5,hy2+15,'#f4ecd8',2,2);P(hx+9,hy2+15,'#f4ecd8',2,2);P(hx+4,hy2+20,c.skinD,8,2);}
 else{P(hx+5,hy2+16,c.skinD,6,1);P(hx+6,hy2+16,'#f4ecd8',2,3);P(hx+9,hy2+16,'#f4ecd8',2,2);}
 // front arm: sleeve, forearm, clawed hand
 const fs=[sx+3,sy+3],fh=[sx+3+af[0],sy+3+af[1]],fe=[fs[0]+af[0]*0.5+1,fs[1]+af[1]*0.5+2];
 L(fs[0],fs[1],fe[0],fe[1],c.tun,3);L(fe[0],fe[1],fh[0],fh[1],c.skin,2);P(fe[0]-1|0,fe[1]-1|0,c.tunD,3,1);
 P(fh[0]|0,fh[1]|0,c.skinL,4,3);P(fh[0]+3|0,fh[1]+1|0,claw,2,1);P(fh[0]+2|0,fh[1]+3|0,claw,1,1);P(fh[0]+3|0,fh[1]+2|0,claw,1,1);P(fh[0]|0,fh[1]+2|0,c.skinD,3,1);
 if(tool){const T=tool,hx0=fh[0]|0,hy0=fh[1]|0;
  if(T.k==='brolly'){L(hx0,hy0,hx0,hy0-5,'#513925',2);const ux=hx0-14,uy=hy0-9;[[6,0,18,'#5b313a'],[2,2,26,'#35374b'],[0,4,30,'#35374b'],[0,6,30,'#35374b']].forEach(([a,b,w,col])=>P(ux+a,uy+b,col,w,2));for(let i=0;i<4;i++)P(ux+i*10,uy+6,'#1d1f29',4,2);}
  else if(T.k==='plank'){P(hx0-2,hy0+(T.d?2:-2),'#8d6d42',18,4);P(hx0-2,hy0+(T.d?4:0),'#5c432c',18,2);P(hx0+2,hy0+(T.d?2:-2),steel,1,1);P(hx0+10,hy0+(T.d?3:-1),steel,1,1);}
  else{const ex=fh[0]+C(T.a)*T.l,ey=fh[1]+S(T.a)*T.l,nx=-S(T.a),ny=C(T.a);L(hx0,hy0,ex,ey,'#5c4026',2);
   if(T.k==='club'){L(ex-C(T.a)*6,ey-S(T.a)*6,ex+C(T.a)*3,ey+S(T.a)*3,'#7f5d38',6);P(ex|0,ey|0,'#818a94',3,3);P(ex-2|0,ey-1|0,'#aab3bb',2,1);L(ex-C(T.a)*5,ey-S(T.a)*5,ex-C(T.a)*2,ey-S(T.a)*2,'#4a3622',1);}
   if(T.k==='pick'){L(ex-nx*8,ey-ny*8,ex+nx*8,ey+ny*8,'#727981',2);P(ex+nx*8|0,ey+ny*8|0,'#fff',2,2);P(ex|0,ey|0,'#515357',2,2);}
   if(T.k==='shovel'){P(ex-4|0,ey|0,'#6b7178',10,6);P(ex-4|0,ey|0,'#fff',2,4);P(ex-2|0,ey+6|0,'#515357',6,2);}}}
 x.restore();
};
