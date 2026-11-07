// 48px rig for race 'shroom' (Mushroom Folk). Same pose() as the 24px rig, doubled, and the same cell conventions as rig48 in art48.js:
// translate(-2,-3), body centre 24+bx (22 after the shift), feet bottom row 46 (edge 44 after the shift).
// Look: spotted cap with a gill rim, pale stalk body with a ring, shelf fungi on the back, root toes, small glow spores (c.glow only).
function rigShroom(x,c,s,f,n){
 const P=(px,py,col,w=1,h=1)=>{x.fillStyle=col;x.fillRect(px|0,py|0,w,h);};
 const R=Math.round,S=Math.sin,C=Math.cos;
 const L=(a,b,e,g,col,th=1)=>{const st=Math.max(Math.abs(e-a),Math.abs(g-b),1);for(let i=0;i<=st;i++)P(R(a+(e-a)*i/st),R(b+(g-b)*i/st),col,th,th);};
 if(s==='splat'){ // a squashed cap on a stalk puddle, spores puffing up
  const o=f,g=44,w=20+o*4,x0=22-(w>>1);
  P(x0,g-3,c.tunD,w,3);P(x0+2,g-3,c.tun,w-6,2);P(x0+3,g-2,c.skinL,3,1);
  P(x0+2,g-5,c.tun,w-4,2);P(x0+3,g-5,c.skinD,2,1);
  const h=5-Math.min(o,2),cw=14+o*2,cx0=22-(cw>>1);
  P(cx0,g-5-h,c.hood,cw,h);P(cx0+1,g-6-h,c.hood,cw-2,1);P(cx0+cw-4,g-5-h,c.hoodD,4,h);P(cx0,g-6,c.hoodD,cw,1);
  P(cx0+2,g-4-h,c.skinL,2,2);P(cx0+7,g-5-h,c.skinL,2,2);if(o>1)P(cx0+cw-3,g-3-h,c.skinL,2,1);
  P(x0-1,g-3,c.skinD,2,1);P(x0+w-1,g-3,c.skinD,2,1);
  [[-9-o*2,-8-o*2],[8+o,-10-o],[0,-12-o*2],[-4,-9-o]].forEach(([dx,dy],i)=>{if(o>0||i<2)P(22+dx,g+dy,c.glow,1,1);});
  return;}
 const p=pose(s,f,n),t=f/n*Math.PI*2;
 const d2=v=>[v[0]*2,v[1]*2];
 let by=p.by*2,lf=d2(p.lf),lb=d2(p.lb),af=d2(p.af),ab=d2(p.ab),open=p.open,lean=p.lean*2,tool=p.tool&&{k:p.tool.k,a:p.tool.a,l:p.tool.l*2,d:p.tool.d},bx=p.bx*2,hd=p.hd*2;
 if(s==='walk'){lf=[R(6*S(t)),-Math.max(0,R(4*C(t)))];lb=[R(-6*S(t)),-Math.max(0,R(-4*C(t)))];by=-R(Math.abs(S(t))*2);af=[R(-4*S(t))+2,4];ab=[R(4*S(t))-2,4];}
 if(s==='block'){af=[11,-5];ab=[-11,-5];lf=[7,0];lb=[-7,0];open=1;by=2;}
 if(s==='panic'){lf=[R(7*S(t)),-Math.max(0,R(6*C(t)))];lb=[R(-7*S(t)),-Math.max(0,R(-6*C(t)))];af=[8,-15+R(S(t*2)*2)];ab=[-8,-15-R(S(t*2)*2)];open=1;lean=2;}
 if(s==='bash'){const a=f<4?-2.3+f*.15:-2+(f-4)*.75;lean=f<4?-2:3;lf=[6,0];lb=[-6,0];af=[R(C(a)*9),R(S(a)*9)];ab=[af[0]-2,af[1]+2];tool={k:'club',a,l:18};open=f>=4?1:0;}
 if(s==='float'){af=[2,-12];ab=[2,-12];}
 by=Math.max(by,-6);x.save();x.translate(-2,-3);
 if(s==='drown'||s==='swim'){x.beginPath();x.rect(0,0,52,44);x.clip();}
 const ol='#090a0c',cx=24+bx,hy=36+by,sx=cx+lean,sy=hy-6,fl=(f+(s==='walk'?0:1))%2;
 // shelf fungi on the back (stands in for the cloak)
 const shelf=(x0,y0,w,k)=>{P(x0,y0,c.hood,w,1);P(x0+1,y0+1,c.hoodD,w-1,1);P(x0+2,y0+2,c.hoodD,w-4,1);P(x0+1,y0,c.skinL,Math.max(1,w>>2),1);if(k)P(x0+w-3,y0,c.skinD,2,1);};
 shelf(cx-10+lean,hy-12,6,0);shelf(cx-12+lean-fl,hy-7,8,1);shelf(cx-9+lean+fl,hy-2,5,0);
 // back arm
 const bs=[sx-3,sy+3],be=[bs[0]+ab[0]*0.5-1,bs[1]+ab[1]*0.5+2],bh=[sx-3+ab[0],sy+3+ab[1]];
 L(bs[0],bs[1],be[0],be[1],c.skinD,3);L(be[0],be[1],bh[0],bh[1],c.skinD,2);P(be[0]-1|0,be[1]-1|0,c.skin,3,2);P(bh[0]|0,bh[1]|0,c.skinD,4,3);P(bh[0]+3|0,bh[1]+1|0,c.skinD,1,2);
 // legs: stalky, with root toes
 const leg=(l,col,lt)=>{const fx=cx+l[0]-(bx<=4?bx:2),fy=45+l[1],kx=(cx+fx)/2+(l[0]>0?2:-1),ky=(hy+2+fy)/2;
  L(cx,hy+2,kx,ky,col,3);L(kx,ky,fx,fy-1,col,3);P(kx-1|0,ky-1|0,lt,2,2);
  const y=Math.min(fy+1,46);P(fx-2|0,y,c.boot,3,1);P(fx+1|0,y,c.boot,3,1);P(fx+4|0,y,c.boot,2,1);P(fx-1|0,y-1,c.boot,6,1);P(fx|0,y-2,c.boot,3,1);P(fx+2|0,y-1,c.skinD,1,1);};
 leg(lb,c.skinD,c.skin);leg(lf,c.skin,c.skinL);
 // stalk torso: fibres, ring skirt
 for(let j=0;j<9;j++){const w=10+(j>5?2:0),x0=R(cx+lean*(1-j/8))-(w>>1)+1,y=sy+j;
  P(x0,y,c.tun,w,1);P(x0+w-2,y,c.tunD,2,1);P(x0,y,c.skinL,1,1);if(j%3===1)P(x0+3+(j&1)*3,y,c.tunD,1,1);if(j%4===2)P(x0+6,y,c.skinL,1,1);}
 const rx=cx-7+(lean>>1);P(rx,hy-4,c.skinL,15,1);P(rx-1,hy-3,c.tun,16,1);P(rx-1,hy-2,c.tunD,16,1);P(rx+1,hy-1,c.hoodD,13,1);for(let i=0;i<7;i++)P(rx+i*2,hy-2,c.skinD,1,1);
 P(cx-2,hy+1,c.tunD,3,2);P(cx+3,hy,c.skinD,1,3);
 // little cap brackets on the shoulders
 P(sx-8,sy,c.hoodD,4,2);P(sx-7,sy-1,c.hood,3,1);P(sx+5,sy+1,c.hoodD,3,2);P(sx+5,sy,c.hood,2,1);
 // head: face, then the cap over it
 const hx=sx+2,hy2=sy-18+hd,fy0=hy2+8;
 P(hx-6,fy0,c.skin,13,10);P(hx-6,fy0+3,c.skinL,3,3);P(hx+5,fy0+1,c.skinD,2,9);P(hx-6,fy0+9,c.skinD,13,1);P(hx+6,fy0+5,c.skin,2,2);P(hx+6,fy0+7,c.skinD,2,1);
 P(hx-6,fy0+10,c.tunD,12,1);P(hx-5,fy0+11,c.tunD,10,1);
 P(hx-3,fy0+3,c.skinD,3,1);P(hx+2,fy0+3,c.skinD,3,1);
 P(hx-3,fy0+4,c.glow,3,3);P(hx+2,fy0+4,c.glow,3,3);P(hx-2,fy0+4,'#f2f5c0',1,1);P(hx+3,fy0+4,'#f2f5c0',1,1);P(hx-1,fy0+5,'#2a0806',1,2);P(hx+4,fy0+5,'#2a0806',1,2);
 if(open){P(hx,fy0+7,'#160b0d',6,3);P(hx+1,fy0+7,c.skinL,1,1);P(hx+4,fy0+7,c.skinL,1,1);P(hx+1,fy0+9,'#8a3a3a',3,1);}else{P(hx,fy0+7,c.skinD,6,1);P(hx-1,fy0+6,c.skinD,1,1);}
 const hcx=hx-1,CW=[10,16,20,22,24,24,24,24];
 CW.forEach((w,j)=>{const x0=hcx-(w>>1),y=hy2+j;P(x0,y,c.hood,w,1);if(j>1)P(x0+w-3-(j>5?1:0),y,c.hoodD,3+(j>5?1:0),1);if(j>=7)P(x0,y,c.hoodD,w,1);});
 [[-9,3,4,3],[-3,1,3,3],[4,2,4,3],[-6,5,2,2],[8,5,3,2],[1,5,2,2]].forEach(([dx,dy,w,h])=>{const X=hcx+dx,Y=hy2+dy;if(h>2){P(X+1,Y,c.skinL,w-2,1);P(X,Y+1,c.skinL,w,h-2);P(X+1,Y+h-1,c.skinL,w-2,1);}else P(X,Y,c.skinL,w,h);P(X+1,Y+h,c.hoodD,w-1,1);});
 P(hcx-13,hy2+8,c.hoodD,27,1);for(let i=0;i<22;i++)P(hcx-11+i,hy2+9,i%2?c.tunD:c.skinD,1,1);P(hcx-9,hy2+10,c.tunD,18,1);
 // glowing spores drifting near the cap
 P(hcx-14,hy2+6-((f*2)%5),c.glow,1,1);P(hcx+13,hy2+4+((f*3)%4),c.glow,1,1);if(s!=='block')P(hcx+10,hy2-2+(f%3),c.glow,1,1);
 // front arm
 const fs=[sx+3,sy+3],fh=[sx+3+af[0],sy+3+af[1]],fe=[fs[0]+af[0]*0.5+1,fs[1]+af[1]*0.5+2];
 L(fs[0],fs[1],fe[0],fe[1],c.skin,3);L(fe[0],fe[1],fh[0],fh[1],c.skin,2);P(fe[0]-1|0,fe[1]-1|0,c.skinL,3,2);
 P(fh[0]|0,fh[1]|0,c.skinL,4,3);P(fh[0]+3|0,fh[1]+1|0,c.skinD,1,1);P(fh[0]+1|0,fh[1]+3|0,c.skinD,2,1);P(fh[0]+3|0,fh[1]+2|0,c.skinD,1,1);
 if(tool){const T=tool,hx0=fh[0]|0,hy0=fh[1]|0;
  if(T.k==='brolly'){L(hx0,hy0,hx0,hy0-5,'#513925',2);const ux=hx0-14,uy=hy0-9;[[6,0,18,'#6a3a46'],[3,2,24,'#43455c'],[0,4,30,'#35374b'],[0,6,30,'#35374b']].forEach(([a,b,w,col])=>P(ux+a,uy+b,col,w,2));for(let i=0;i<5;i++)P(ux+i*7,uy+6,'#1d1f29',3,2);for(let i=0;i<4;i++)P(ux+5+i*7,uy+2,'#5a5d78',1,4);P(ux+14,uy-1,'#2a2c3a',2,1);}
  else if(T.k==='plank'){P(hx0-2,hy0+(T.d?2:-2),'#9a7a4a',18,4);P(hx0-2,hy0+(T.d?4:0),'#5c432c',18,2);P(hx0+2,hy0+(T.d?2:-2),'#7a5c36',1,3);P(hx0+8,hy0+(T.d?3:-1),'#7a5c36',5,1);P(hx0+15,hy0+(T.d?2:-2),'#c9c9c0',1,1);}
  else{const ex=fh[0]+C(T.a)*T.l,ey=fh[1]+S(T.a)*T.l,nx=-S(T.a),ny=C(T.a);L(hx0,hy0,ex,ey,'#5c4026',2);
   if(T.k==='club'){L(ex-C(T.a)*6,ey-S(T.a)*6,ex+C(T.a)*3,ey+S(T.a)*3,'#7f5d38',6);P(ex-1|0,ey-1|0,'#9a7447',3,3);P(ex+2|0,ey+2|0,'#4a3622',2,2);L(ex-C(T.a)*6,ey-S(T.a)*6,ex-C(T.a)*3,ey-S(T.a)*3,c.tunD,1);P(ex-C(T.a)*4+1|0,ey-S(T.a)*4|0,'#c8d07a',1,1);}
   if(T.k==='pick'){L(ex-nx*8,ey-ny*8,ex+nx*8,ey+ny*8,'#727981',2);P(ex+nx*8|0,ey+ny*8|0,'#e8eef2',2,2);P(ex-nx*8|0,ey-ny*8|0,'#4a5057',2,2);P(ex|0,ey|0,'#515357',3,3);L(hx0,hy0,ex,ey,'#8a6a42',1);}
   if(T.k==='shovel'){P(ex-4|0,ey|0,'#6b7178',10,6);P(ex-4|0,ey|0,'#e8eef2',2,4);P(ex-2|0,ey+6|0,'#515357',6,2);P(ex+3|0,ey+1|0,'#4a5057',2,4);P(ex-1|0,ey-2|0,'#8a6a42',3,2);}}}
 x.restore();
}
RIG48.shroom=rigShroom;
