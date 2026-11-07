// 48px goblin rig (race 'goblin': MUDFOOT, ASHGUT). Same pose() as the 24px rig, doubled; same footprint and ground line as rig48.
// Pre-translate coordinates: body centre 24+bx, feet bottom row 46, then translate(-2,-3) puts feet on logical y=22 like the 24px sprite.
RIG48.goblin=function(x,c,s,f,n){
 const P=(px,py,col,w=1,h=1)=>{x.fillStyle=col;x.fillRect(px|0,py|0,w,h);};
 const R=Math.round,S=Math.sin,C=Math.cos;
 const L=(a,b,e,g,col,th=1)=>{const st=Math.max(Math.abs(e-a),Math.abs(g-b),1);for(let i=0;i<=st;i++)P(R(a+(e-a)*i/st),R(b+(g-b)*i/st),col,th,th);};
 const sh=(h,k)=>{const m=parseInt(h.slice(1),16),r=Math.min(255,((m>>16)&255)*k|0),g=Math.min(255,((m>>8)&255)*k|0),b=Math.min(255,(m&255)*k|0);return'#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1);};
 const ol='#090a0c',dark='#2a0806',tooth='#cabd7c',belt='#382417',buck='#c9a43a',buckD='#7a6a42',wood='#8d6d42',woodD='#5c432c',woodL='#a98650',steel='#818a94',steelL='#c5ccd3',steelD='#515357';
 if(s==='splat'){
  x.save();x.translate(-2,-3);
  const o=f,w=22+o*7,h=Math.max(3,10-o*2.4)|0,cx=24;
  // flattened goblin: squashed tunic, hat beside it, limbs splayed, dead eyes
  for(let r=0;r<h;r++){const y=46-r,ww=w-Math.max(0,r-h+3)*3-r;P(cx-ww/2|0,y,r<2?c.tunD:c.tun,ww,1);}
  P(cx-w/2+1|0,46,c.tunD,w-2,1);
  P(cx-w/2-3|0,43+(o>1?2:0),c.skin,5,3);P(cx-w/2-4|0,44+(o>1?2:0),c.skinD,3,2);
  P(cx+w/2-2|0,43+(o>1?2:0),c.skin,5,3);P(cx+w/2+2|0,44+(o>1?2:0),c.skinL,2,2);
  P(cx-w/2+2|0,46,c.boot,6,1);P(cx+w/2-8|0,46,c.boot,6,1);
  const hy0=46-h-Math.max(1,6-o*1.5)|0;
  P(cx-5,hy0,c.skin,12,Math.max(3,7-o)|0);P(cx-5,hy0,c.skinD,12,1);
  P(cx-6,hy0-2+(o>1?1:0),c.hood,9,3);P(cx-7,hy0-1+(o>1?1:0),c.hoodD,3,2);
  const ey=hy0+2;P(cx-2,ey,dark,2,1);P(cx-1,ey+1,dark,1,1);P(cx+2,ey,dark,2,1);P(cx+3,ey+1,dark,1,1);
  P(cx,hy0+5-(o>2?1:0),dark,5,1);
  if(o<3){P(cx-8,hy0-6+o,'#f0c040',2,2);P(cx+9,hy0-5+o,'#f0c040',2,2);P(cx+1,hy0-8+o,'#fff',2,2);}
  x.restore();return;}
 const p=pose(s,f,n),d2=v=>[v[0]*2,v[1]*2];
 let by=p.by*2,lf=d2(p.lf),lb=d2(p.lb),af=d2(p.af),ab=d2(p.ab),open=p.open,lean=p.lean*2,tool=p.tool&&{k:p.tool.k,a:p.tool.a,l:p.tool.l*2,d:p.tool.d},bx=p.bx*2,hd=p.hd*2;
 if(s==='float'){af=[2,-12];ab=[2,-12];}
 by=Math.max(by,-6);x.save();x.translate(-2,-3);
 if(s==='drown'||s==='swim'){x.beginPath();x.rect(0,0,52,44);x.clip();}
 const cx=24+bx,hy=37+by,sx=cx+lean,sy=hy-8,hood=c.hood,hoodD=c.hoodD,hoodL=sh(c.hood,1.28);
 const off=r=>R(lean*Math.max(0,Math.min(1,(10-r)/10)));
 // cloak flapping behind the back
 const cape=c.cape||hoodD,fl=(f+(s==='walk'?0:1))%2;
 for(let j=0;j<16;j++){const w=2+(j>9?1:0)+(j>12?1:0);P(cx-10+off(j)-(j>9?1:0),hy-10+j,j%4===1?sh(cape,.8):cape,w,1);}
 P(cx-11+lean,hy+5,cape,2,2+fl);P(cx-8+lean,hy+6,cape,2,2);P(cx-12+lean,hy-2,sh(cape,1.3),1,6);
 // back arm (sleeve, forearm, hand)
 const arm=(ax,ay,hx2,hy2,skin,skinHi,sleeve)=>{
  const ex=ax+(hx2-ax)*.5+(hx2>ax?-1:1)*0,ey=ay+(hy2-ay)*.5+2;
  const sx2=ax+(ex-ax)*.55,sy2=ay+(ey-ay)*.55;
  L(ax,ay,ex,ey,skin,3);L(ex,ey,hx2,hy2,skin,3);L(ax,ay,sx2,sy2,sleeve,4);P(sx2-2|0,sy2+2|0,sh(sleeve,.7),4,1);
  P(ex|0,ey|0,sh(skin,.8),2,1);
  P(hx2-1|0,hy2-1|0,skin,5,5);P(hx2|0,hy2|0,skinHi,2,2);P(hx2+3|0,hy2+1|0,sh(skin,.7),1,3);P(hx2-1|0,hy2+4|0,sh(skin,.7),5,1);
 };
 arm(sx-3,sy+3,sx-3+ab[0],sy+3+ab[1],c.skinD,c.skin,c.tunD);
 // legs: trousers/skin, boots
 const leg=(l,col,hi)=>{const fx=cx+l[0]-(bx<=4?bx:2),fy=45+l[1];
  L(cx,hy+2,fx,fy-2,col,4);P(fx-2|0,Math.min(fy-2,43),sh(col,.7),2,1);
  const by0=Math.min(fy-1,45);
  P(fx-2|0,by0,c.boot,9,Math.min(46,fy+1)-by0+1);P(fx-2|0,Math.min(fy,46),c.boot,10,1);
  P(fx-1|0,by0,sh(c.boot,1.7),5,1);P(fx+5|0,Math.min(fy+1,46),sh(c.boot,1.5),3,1);P(fx-2|0,by0,sh(c.boot,.6),1,2);};
 leg(lb,c.tunD,c.tun);leg(lf,c.skinD,c.skin);
 // body: tunic with folds, ragged hem, belt, pouch
 for(let r=0;r<14;r++){const o2=off(r),w=r>11?14:12,xx=cx-6+o2-(r>11?1:0);P(xx,hy-10+r,c.tun,w,1);P(xx,hy-10+r,c.tunD,3,1);P(xx+w-1,hy-10+r,sh(c.tun,1.18),1,1);}
 for(let r=1;r<11;r+=2)P(cx+1+off(r),hy-10+r+1,c.tunD,1,2);
 P(cx-1+off(1),hy-10,c.tunD,5,2);P(cx-1+off(1),hy-9,c.skin,3,1);// neckline
 P(cx-7,hy+3,c.tunD,15,1);P(cx-7,hy+4,c.tunD,3,1);P(cx-2,hy+4,c.tunD,3,1);P(cx+3,hy+4,c.tunD,4,1);// ragged hem
 P(cx-7,hy-2,belt,14,2);P(cx-7,hy-2,sh(belt,1.4),14,1);P(cx+1,hy-2,buck,4,3);P(cx+2,hy-1,buckD,2,1);
 P(cx-6,hy,'#5b4623',4,4);P(cx-6,hy,'#7a5e2e',4,1);P(cx-5,hy+1,belt,1,1);
 for(let r=3;r<10;r+=3)P(cx+4+off(r),hy-10+r,sh(c.tun,1.4),1,1);// stitches
 // head
 const ox=sx-10,oy=sy-14+hd,sk=c.skin,skD=c.skinD,skL=c.skinL,gl=c.glow||'#f0c040';
 const HP=(i,j,col,w=1,h=1)=>P(ox+i,oy+j,col,w,h);
 // back ear, long and pointed
 L(ox+8,oy+10,ox+1,oy+6,sk,3);L(ox+7,oy+11,ox+2,oy+8,skD,1);L(ox+7,oy+9,ox+2,oy+6,skL,1);HP(0,5,skD,2,2);
 // floppy hat, tip drooping behind
 L(ox+6,oy+3,ox+0,oy+2,hood,3);L(ox+1,oy+4,ox-1,oy+7,hoodD,3);HP(0,2,hoodL,2,1);
 HP(7,0,hood,9,1);HP(5,1,hood,13,1);HP(4,2,hood,15,1);HP(3,3,hood,17,3);HP(3,6,hood,19,1);
 HP(8,0,hoodL,5,1);HP(6,1,hoodL,4,1);HP(4,3,hoodL,3,2);HP(16,2,hoodD,3,3);HP(3,6,hoodD,19,1);HP(14,4,hoodD,5,2);
 HP(6,3,hoodD,1,2);HP(10,2,hoodD,1,3);// hat seams
 // face
 HP(6,7,skD,16,1);HP(5,8,sk,17,1);HP(5,9,sk,18,3);HP(6,12,sk,17,1);HP(7,13,sk,14,2);HP(9,15,sk,9,1);
 HP(5,8,skD,2,5);HP(7,14,skD,2,1);HP(9,15,skD,9,1);HP(13,12,skL,2,1);HP(16,10,skL,3,1);
 // eye
 HP(12,9,'#f4efe0',6,4);HP(11,8,'#160b0d',8,1);HP(17,8,'#160b0d',3,1);HP(14,10,gl,3,3);HP(15,10,dark,1,2);HP(12,9,skL,1,1);
 HP(12,13,skD,6,1);
 // big hooked nose
 HP(19,10,sk,4,2);HP(21,11,skD,3,3);HP(20,10,skL,2,1);HP(22,14,skD,1,1);HP(21,13,dark,1,1);
 // mouth, with the underbite teeth
 if(open){HP(12,13,dark,9,3);HP(13,13,tooth,2,2);HP(17,13,tooth,2,2);HP(14,15,'#b8504a',4,1);}
 else{HP(12,14,dark,9,1);HP(15,13,tooth,2,2);HP(19,13,tooth,2,2);HP(13,15,skD,8,1);}
 // front arm and hand
 const fh=[sx+3+af[0],sy+3+af[1]];
 arm(sx+3,sy+3,fh[0],fh[1],c.skin,c.skinL,c.tun);
 if(tool){const T=tool,hx0=fh[0]|0,hy0=fh[1]|0;
  if(T.k==='brolly'){const uy=Math.max(2,hy0-13),ux=hx0-13;L(hx0+1,hy0,hx0+1,uy+8,'#513925',2);P(hx0-1,hy0+3,'#513925',4,2);P(hx0-1,hy0+3,'#513925',2,2);
   [[6,0,19,'#5b313a'],[2,2,27,'#35374b'],[0,4,31,'#35374b'],[0,6,31,'#3e4057']].forEach(([a,b,w,col])=>P(ux+a,uy+b,col,w,2));
   for(let i=0;i<5;i++)P(ux+i*7+2,uy+6,'#1d1f29',3,2);for(let i=0;i<4;i++)P(ux+8+i*5,uy+2,'#4a4d66',1,4);P(ux+14,uy-2,steelD,2,3);P(ux+13,uy,'#5b313a',4,2);}
  else if(T.k==='plank'){const yy=hy0+(T.d?2:-2);P(hx0-2,yy,wood,20,4);P(hx0-2,yy+4,woodD,20,2);P(hx0-2,yy,woodL,20,1);P(hx0+3,yy+1,woodD,6,1);P(hx0+14,yy+2,woodD,4,1);P(hx0+1,yy+1,steelD,1,2);P(hx0+16,yy+1,steelD,1,2);}
  else{const ex=fh[0]+C(T.a)*T.l,ey=fh[1]+S(T.a)*T.l,nx=-S(T.a),ny=C(T.a);
   L(hx0,hy0,ex,ey,'#5c4026',2);L(hx0+1,hy0,ex+1,ey,'#7a5a38',1);
   if(T.k==='club'){L(ex-C(T.a)*8,ey-S(T.a)*8,ex+C(T.a)*4,ey+S(T.a)*4,woodL,7);L(ex-C(T.a)*8,ey-S(T.a)*8,ex+C(T.a)*4,ey+S(T.a)*4,wood,5);L(ex-C(T.a)*6,ey-S(T.a)*6,ex+C(T.a)*3,ey+S(T.a)*3,woodD,2);
    P(ex-1|0,ey-1|0,steel,2,2);P(ex+2|0,ey+2|0,steelL,1,1);P(ex-3|0,ey+1|0,steel,1,1);L(ex-C(T.a)*7,ey-S(T.a)*7,ex-C(T.a)*3,ey-S(T.a)*3,'#4a3622',1);}
   if(T.k==='pick'){L(ex-nx*9,ey-ny*9,ex+nx*9,ey+ny*9,steel,3);L(ex-nx*8,ey-ny*8,ex+nx*8,ey+ny*8,steelL,1);P(ex+nx*9|0,ey+ny*9|0,'#fff',2,2);P(ex-nx*9|0,ey-ny*9|0,steelD,2,2);P(ex-1|0,ey-1|0,steelD,3,3);}
   if(T.k==='shovel'){P(ex-4|0,ey|0,steel,10,7);P(ex-4|0,ey|0,steelL,3,5);P(ex-2|0,ey+7|0,steelD,6,2);P(ex-1|0,ey-3|0,'#5c4026',3,3);P(ex-3|0,ey-4|0,'#5c4026',7,1);}}}
 x.restore();
};
