// 48px rig for Swampfolk (RIG48.swamp). Same pose() as the 24px rig, doubled, same ground line and footprint as rig48 (art48.js).
// Upright frog people: bulging eyes, ear drum, wide mouth, throat pouch, webbed hands and feet, reed-fringed tunic, rope belt and gourd.
RIG48.swamp=function(x,c,s,f,n){
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
 const ol='#090a0c',gold='#e4c13a',goldD='#a8841e',pup='#1a1308',mouthD='#2a1410',tongue='#b8505e',tongueL='#d88a8c',rope='#4a3622',ropeL='#7a6a42';
 const cx=24+bx,hy=36+by,sx=cx+lean,fl=(f+1)%2;
 const shY=hy-7; // shoulder line
 // ragged back cloth, torn at the hem
 for(let j=0;j<16;j++){const xo=R(lean*(1-j/15)),w=j>11?4:3;P(cx-10+xo-(j>11?1:0),hy-9+j,j%5===0?c.tunD:c.hoodD,w,1);}
 P(cx-11,hy+7+fl,c.hoodD,3,3);P(cx-8,hy+7,c.hoodD,2,3+fl);P(cx-12,hy-1,c.hood,1,5);
 // back arm (shaded): upper arm, forearm, webbed hand
 const hand=(h0,h1,col,lt)=>{P(h0-1|0,h1-1|0,col,4,4);P(h0+3|0,h1-1|0,col,2,1);P(h0+3|0,h1+1|0,col,2,1);P(h0+2|0,h1+3|0,col,2,1);P(h0+3|0,h1|0,c.skinD,1,1);P(h0+3|0,h1+2|0,c.skinD,1,1);P(h0+4|0,h1-1|0,lt,1,1);P(h0+4|0,h1+1|0,lt,1,1);P(h0+3|0,h1+3|0,lt,1,1);};
 const bs=[sx-5,shY],be=[bs[0]+ab[0]*0.5-1,bs[1]+ab[1]*0.5+2],bh=[sx-5+ab[0],shY+ab[1]];
 L(bs[0],bs[1],be[0],be[1],c.skinD,3);L(be[0],be[1],bh[0],bh[1],c.skinD,2);P(be[0]-1|0,be[1]-1|0,c.skin,3,3);hand(bh[0],bh[1],c.skinD,c.skin);
 // legs: thigh, knobbly knee, shin, big webbed foot
 const leg=(l,col,lt,side)=>{const fx=cx+l[0]-(bx<=4?bx:2),fy=45+l[1],hxp=cx+side*3,hyp=hy+4,kx=(hxp+fx)/2+(l[0]>0?3:-3),ky=(hyp+fy)/2+1;
  L(hxp,hyp,kx,ky,col,4);L(kx,ky,fx,fy-1,col,3);P(kx-1|0,ky-1|0,lt,3,3);P(kx|0,ky+2|0,c.skinD,2,1);
  const b1=Math.min(fy+1,47),b0=Math.min(fy,46);
  P(fx-3|0,b1,col,5,1);P(fx-2|0,b0,col,5,1);P(fx-1|0,Math.min(fy-1,45),col,3,1);
  for(let k=0;k<3;k++){P(fx+2+k*3,b1,k===1?lt:col,2,1);if(k<2)P(fx+4+k*3,b1,c.skinD,1,1);}
  P(fx+2|0,b0,c.skinD,6,1);P(fx|0,b0,lt,2,1);P(fx+9|0,b1,lt,1,1);};
 leg(lb,c.skinD,c.skin,-1);leg(lf,c.skin,c.skinL,1);
 // tunic: tapered, folds, reed fringe hem
 for(let j=0;j<16;j++){const xo=R(lean*(1-j/15)),w=6+(j>8?1:0)+(j>12?1:0),y=hy-10+j;
  P(cx-w+xo,y,c.tun,w*2,1);P(cx-w+xo,y,c.tunD,2,1);P(cx+w-2+xo,y,j%3?c.hood:c.skinL,1,1);
  if(j%5===2)P(cx-2+xo,y,c.tunD,1,3);if(j%5===4)P(cx+3+xo,y,c.tunD,1,2);}
 for(let k=0;k<8;k++){const len=2+((k*5)%4),xx=cx-7+k*2+(R(lean*0.2));P(xx,hy+6,k%2?c.tunD:c.tun,2,len);P(xx,hy+5+len,c.hoodD,2,1);}
 P(cx-7+lean,hy-10,c.hoodD,15,1); // collar line
 // diagonal strap and mud splashes
 L(cx-5,hy-9,cx+5,hy-1,c.hoodD,2);L(cx-5,hy-10,cx+4,hy-2,c.tun,1);
 P(cx-5,hy+4,c.boot,2,1);P(cx+2,hy+7,c.boot,1,1);P(cx-2,hy+9,c.boot,2,1);
 // rope belt, knot and hanging gourd
 P(cx-7,hy-1,rope,14,2);P(cx-7,hy-1,ropeL,14,1);for(let k=0;k<7;k++)P(cx-7+k*2,hy,'#2c1d12',1,1);
 P(cx-1,hy-2,'#c9a43a',3,3);P(cx,hy-1,rope,1,1);
 P(cx+4,hy+1,rope,1,3);P(cx+3,hy+4,c.hoodD,4,5);P(cx+4,hy+5,c.hood,2,3);P(cx+3,hy+4,c.skinL,1,1);P(cx+4,hy+3,c.hoodD,2,1);
 // head: eye turrets, round ear drum, wide mouth, throat pouch
 const ty=hy-22+hd,hx0=sx-10,H=(xa,xb,r,col)=>P(hx0+xa,ty+r,col,xb-xa,1);
 const sh=[[4,20],[2,22],[1,23],[0,24],[0,24],[0,24],[1,23],[2,21],[4,18]];
 sh.forEach(([a,b],i)=>{const r=4+i;H(a,b,r,c.skin);});
 // top ridge shading and warts
 H(4,20,4,c.skinD);H(2,22,5,c.skin);for(const q of [[8,5],[13,5],[17,6],[5,7],[20,8],[11,6]])P(hx0+q[0],ty+q[1],c.skinD,1,1);
 for(const q of [[7,6],[15,5],[19,7]])P(hx0+q[0],ty+q[1],c.skinL,1,1);
 // cheek light and throat pouch
 H(12,22,6,c.skinL);H(9,22,7,c.skin);
 const pr=(s==='walk'?f%2:0);H(5,19,11,c.skinL);H(6,18,12,c.skinL);if(pr)H(7,17,13,c.skinL);
 P(hx0+9,ty+11,c.skin,1,2);P(hx0+14,ty+11,c.skin,1,2);
 // ear drum
 for(const[xa,xb,r]of [[3,7,6],[2,8,7],[2,8,8],[3,7,9]])H(xa,xb,r,c.skinD);H(4,6,7,c.skinL);H(4,6,8,c.skin);
 // eye turrets
 const eye=(xe)=>{[[1,5],[0,6],[0,6],[0,6],[0,6],[1,5]].forEach(([a,b],i)=>H(xe+a,xe+b,i,c.skin));H(xe+1,xe+5,0,c.skinL);H(xe+1,xe+5,5,c.skinD);
  P(hx0+xe+1,ty+1,gold,4,3);P(hx0+xe+1,ty+4,goldD,4,1);P(hx0+xe+3,ty+1,pup,2,4);P(hx0+xe+1,ty+1,'#fff3b0',1,1);P(hx0+xe+5,ty+1,c.skinD,1,3);};
 eye(5);eye(14);
 // brow ridge between turrets and body
 H(5,11,5,c.skinD);H(14,20,5,c.skinD);
 // nostrils
 P(hx0+21,ty+5,ol,1,1);P(hx0+23,ty+6,ol,1,1);
 if(open){ // gaping mouth: dark inside, tongue
  for(let r=7;r<=10;r++)H(7,24-(r>9?1:0),r,mouthD);
  H(10,21,10,tongue);H(11,18,9,tongueL);P(hx0+23,ty+7,c.skinL,1,1);
  H(7,24,6,c.skin);H(6,23,11,c.skin);H(7,20,12,c.skinL);
 }else{ // closed: lip crease with a slight upturn, lower lip light
  H(2,24,9,mouthD);P(hx0+0,ty+8,mouthD,2,1);H(4,23,10,c.skinL);P(hx0+2,ty+10,c.skinD,1,1);
 }
 // front arm: skin, elbow, webbed hand
 const fs=[sx+5,shY],fh=[sx+5+af[0],shY+af[1]],fe=[fs[0]+af[0]*0.5+1,fs[1]+af[1]*0.5+2];
 L(fs[0],fs[1],fe[0],fe[1],c.skin,3);L(fe[0],fe[1],fh[0],fh[1],c.skin,2);P(fe[0]-1|0,fe[1]-1|0,c.skinL,3,3);hand(fh[0],fh[1],c.skin,c.skinL);
 if(tool){const T=tool,hx1=fh[0]|0,hy1=fh[1]|0;
  if(T.k==='brolly'){L(hx1,hy1,hx1,hy1-5,'#513925',2);const ux=hx1-14,uy=hy1-9;[[6,0,18,'#5b313a'],[2,2,26,'#35374b'],[0,4,30,'#35374b'],[0,6,30,'#35374b']].forEach(([a,b,w,col])=>P(ux+a,uy+b,col,w,2));for(let i=0;i<4;i++)P(ux+i*10,uy+6,'#1d1f29',4,2);}
  else if(T.k==='plank'){P(hx1-2,hy1+(T.d?2:-2),'#8d6d42',18,4);P(hx1-2,hy1+(T.d?4:0),'#5c432c',18,2);}
  else{const ex=fh[0]+C(T.a)*T.l,ey=fh[1]+S(T.a)*T.l,nx=-S(T.a),ny=C(T.a);L(hx1,hy1,ex,ey,'#5c4026',2);
   if(T.k==='club'){L(ex-C(T.a)*6,ey-S(T.a)*6,ex+C(T.a)*3,ey+S(T.a)*3,'#7f5d38',6);P(ex|0,ey|0,'#818a94',3,3);P(ex-2|0,ey-1|0,'#aab3bb',2,1);L(ex-C(T.a)*5,ey-S(T.a)*5,ex-C(T.a)*2,ey-S(T.a)*2,'#4a3622',1);}
   if(T.k==='pick'){L(ex-nx*8,ey-ny*8,ex+nx*8,ey+ny*8,'#727981',2);P(ex+nx*8|0,ey+ny*8|0,'#fff',2,2);P(ex|0,ey|0,'#515357',2,2);}
   if(T.k==='shovel'){P(ex-4|0,ey|0,'#6b7178',10,6);P(ex-4|0,ey|0,'#fff',2,4);P(ex-2|0,ey+6|0,'#515357',6,2);}}}
 x.restore();
};
