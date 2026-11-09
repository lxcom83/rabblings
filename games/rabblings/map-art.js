// ---------- trap and hazard art, shared by play and the builder ----------
const RAT=(function(){const[c,x]=mk(32,10);const body=(ox,f)=>{x.fillStyle='#2f2b2c';x.fillRect(ox+3,3,9,4);x.fillStyle='#3d393a';x.fillRect(ox+4,2,6,2);x.fillRect(ox+11,4,3,2);x.fillStyle='#da8f97';x.fillRect(ox+14,5,1,1);x.fillRect(ox+9,1,2,2);x.fillRect(ox,4,3,1);x.fillStyle='#e81717';x.fillRect(ox+12,4,1,1);x.fillStyle='#191717';x.fillRect(ox+5+(f?1:0),7,2,1);x.fillRect(ox+9-(f?1:0),7,2,1);};body(0,0);body(16,1);outline(c,'#090a0c');return c;})();
function drawRat(C,x,y,dir,t){const f=(t>>1)&1;C.save();C.translate(x,y-9);if(dir<0)C.scale(-1,1);C.drawImage(RAT,f*16,0,16,10,-8,0,16,10);C.restore();}
const CONS_W=64,CONS_H=46,CONS=(function(){const[c,x]=mk(CONS_W*2,CONS_H);const S=.78,BONE='#cbc5aa',MID='#a59f86',SHD='#6f6d64',SKL='#ece6cc',DRK='#2e2c27',STL='#a3acbb',STD='#626b79',WD='#6b4e32',RD='#e81717';
 const px=(a,b,col)=>{x.fillStyle=col;x.fillRect(Math.round(a),Math.round(b),1,1);};
 const ln=(o,x0,y0,x1,y1,col,t)=>{x0=x0*S+o;y0=y0*S;x1=x1*S+o;y1=y1*S;const n=Math.max(1,Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))));for(let i=0;i<=n;i++){const a=x0+(x1-x0)*i/n,b=y0+(y1-y0)*i/n;for(let u=0;u<(t||1);u++)for(let v=0;v<(t||1);v++)px(a+u,b+v,col);}};
 const bz=(o,p0,p1,p2,col,t)=>{let px0=p0[0],py0=p0[1];for(let i=1;i<=16;i++){const u=i/16,a=(1-u)*(1-u)*p0[0]+2*u*(1-u)*p1[0]+u*u*p2[0],b=(1-u)*(1-u)*p0[1]+2*u*(1-u)*p1[1]+u*u*p2[1];ln(o,px0,py0,a,b,col,t);px0=a;py0=b;}};
 const el=(o,cx,cy,rx,ry,col)=>{for(let j=-ry;j<=ry;j++)for(let i=-rx;i<=rx;i++)if(i*i/(rx*rx)+j*j/(ry*ry)<=1)px(cx*S+o+i,cy*S+j,col);};
 for(let f=0;f<2;f++){const o=f*CONS_W,a=f?3:-3,ph=f?-3:3;
  // far legs (dark)
  const leg=(hx,hy,kx,ky,ax_,ay,fx,col,t)=>{ln(o,hx,hy,kx,ky,col,t);ln(o,kx,ky,ax_,ay,col,t);ln(o,ax_,ay,fx,54,col,t);ln(o,fx-4,54,fx+3,54,col,t);};
  leg(17,36,13+ph,45,18+ph,52,20+ph,SHD,2);leg(46,36,50-ph,45,46-ph,52,48-ph,SHD,2);
  // rear far arms
  ln(o,44,26,36,20,SHD,2);ln(o,36,20,29,13,SHD,2);ln(o,29,13,24,9,SHD,1);
  ln(o,24,9,19,19,WD,1);ln(o,20,8,28,8,STD,2);ln(o,20,8,19,13,STD,2);ln(o,24,10,29,9,STD,2);
  ln(o,42,31,35,34,SHD,2);ln(o,35,34,30,38,SHD,2);el(o,28,38,5,7,WD);el(o,28,38,2,3,MID);
  // spine, tail, pelvis
  bz(o,[22,32],[14,31],[8,34],BONE,2);bz(o,[8,34],[2,37],[3,46],MID,1);
  el(o,17,35,6,5,MID);el(o,16,34,4,3,BONE);
  // ribcage interior and ribs
  el(o,38,33,10,9,DRK);
  bz(o,[22,32],[34,25],[48,22],BONE,2);
  for(let i=0;i<7;i++){const sx=27+i*3.6,sy=29-i*.9,len=16-i*1.5;bz(o,[sx,sy],[sx+5,sy+len*.55],[sx+1.5,sy+len],i<3?BONE:MID,1);}
  ln(o,28,44,48,42,MID,1);ln(o,30,46,46,45,SHD,1);
  // near legs
  leg(20,37,15-ph,46,20-ph,53,22-ph,MID,2);leg(48,37,52+ph,46,48+ph,53,50+ph,BONE,2);
  // necks and heads
  const head=(hx,hy,k)=>{bz(o,[47,24],[47+(hx-47)*.2,hy+10],[hx,hy+5],MID,2);el(o,hx,hy,4,3,SKL);el(o,hx+5,hy+1,3,2,SKL);ln(o,hx+2,hy+4,hx+8,hy+4,SHD,1);px(hx*S+o,(hy-1)*S,RD);px(hx*S+o+1,(hy-1)*S,RD);
   bz(o,[hx-2,hy-3],[hx-5,hy-9],[hx-9,hy-6],BONE,1);if(k)bz(o,[hx+1,hy-3],[hx+3,hy-10],[hx+8,hy-10],BONE,1);};
  head(34,16,0);head(44,6,1);head(57,5,1);head(66,16,0);
  // near arms with weapons
  ln(o,48,28,56,26,BONE,2);ln(o,56,26,62,21,BONE,2);ln(o,62,21,66,14,BONE,1);ln(o,64,20,60,14,WD,1);ln(o,66,15,72,3,STL,2);ln(o,64,12,70,16,STD,2);
  ln(o,46,32,54,36,BONE,2);ln(o,54,36,62,38,MID,2);ln(o,60,38,68,39,WD,1);ln(o,68,39,78,38,STL,2);
 }
 outline(c,'#090a0c');return c;})();
function drawFoeSpr(C,k,x,y,dir,t,hp){const L=FOESPR[k];if(!L)return 0;const fi=L.length>1&&(k==='rat'||k==='arch')?((t>>(k==='rat'?1:3))&1):0,im=L[fi];if(!im||!im.complete||!im.naturalWidth)return 1;const w=im.naturalWidth,h=im.naturalHeight,bob=k==='skel'?((t>>3)&1):k==='golem'?((t>>4)&1):0;C.save();C.translate(x|0,(y|0)+bob);if(dir<0)C.scale(-1,1);const ax=k==='spider'||k==='rat'||k==='arch'?(w>>1):Math.round(w*.62);C.drawImage(im,-ax,-h+(k==='rat'?1:0),w,h);C.restore();if(hp>1){const n=Math.min(hp,8);for(let i=0;i<n;i++){C.fillStyle='#e8321c';C.fillRect((x|0)-n*2+i*4+1,(y|0)-h-6,3,2);}}return 1;}
function drawFoe(C,k,x,y,dir,t,hp){if(k==='construct'){const f=(t>>3)&1,W=CONS_W,H=CONS_H;C.save();C.translate(x|0,y|0);if(dir<0)C.scale(-1,1);const K=.7,dw=Math.round(W*K),dh=Math.round(H*K);C.drawImage(CONS,f*W,0,W,H,-(dw*.45|0),-dh,dw,dh);C.restore();if(hp>1){const n=Math.min(hp,8);for(let i=0;i<n;i++){C.fillStyle='#e8321c';C.fillRect((x|0)-n*2+i*4+1,(y|0)-dh-4,3,2);}}return;}if(!k||k==='rat'){if(drawFoeSpr(C,'rat',x,y,dir,t,0))return;return drawRat(C,x,y,dir,t);}if((k==='skel'||k==='spider'||k==='golem'||k==='arch')&&drawFoeSpr(C,k,x,y,dir,t,hp))return;x|=0;y|=0;const R=(a,b,w,h,c)=>{C.fillStyle=c;C.fillRect(dir>0?x+a:x-a-w,y+b,w,h);},st=(t>>3)&1,bone='#a59f86',bd='#6f6d64',ink='#090a0c';
 if(k==='spider'){const u=(t>>2)&1;C.fillStyle=ink;C.fillRect(x-9,y-16,19,12);for(let i=0;i<4;i++){const q=6+i*3;C.fillRect(x-q-6,y-14+i*2-(u&&i%2?2:0),6,2);C.fillRect(x+q+1,y-14+i*2-(u&&i%2?0:2),6,2);C.fillRect(x-q-7,y-13+i*2,2,13-i*2);C.fillRect(x+q+6,y-13+i*2,2,13-i*2);}C.fillStyle='#24262e';C.fillRect(x-8,y-15,17,10);C.fillStyle='#3b3d48';C.fillRect(x-6,y-14,8,3);R(5,-13,2,2,'#e81717');R(2,-12,2,2,'#e81717');R(6,-10,1,1,'#e81717');}
 else if(k==='golem'){R(-10,-23,20,21,ink);R(-9,-22,18,19,'#47494c');R(-8,-21,8,6,'#5a5d61');R(1,-14,7,7,'#3b3d40');R(-7,-10,6,5,'#525559');R(3,-19,3,2,'#db9016');R(-9,-2,8,2,st?ink:'#3b3d40');R(1,-2,8,2,st?'#3b3d40':ink);R(9,-16,4,10,ink);R(10,-15,3,8,'#525559');}
 else{R(-3,-18,7,7,ink);R(-2,-17,5,5,bone);R(1,-15,2,1,'#e81717');R(-2,-12,2,1,bd);R(-3,-11,7,6,ink);R(-1,-10,3,5,bd);R(-2,-9,5,1,bone);R(-2,-7,5,1,bone);R(-2,-5,2,5,ink);R(1,-5,2,5,ink);R(-2,-5,1,st?5:4,bone);R(2,-5,1,st?4:5,bone);if(k==='arch'){R(5,-16,1,1,'#5c432c');R(6,-15,1,10,'#5c432c');R(5,-5,1,1,'#5c432c');R(3,-10,3,1,bone);}else{R(3,-10,2,1,bone);R(5,-13,1,7,'#79818b');}}
 if(hp>1){const n=Math.min(hp,8);for(let i=0;i<n;i++){C.fillStyle='#e8321c';C.fillRect(x-n*2+i*4+1,y-(k==='construct'?42:k==='golem'||k==='spider'?31:23),3,2);}}}
function drawNest(C,x,y,hp,max,t){x|=0;y|=0;const R=(a,b,w,h,c)=>{C.fillStyle=c;C.fillRect(x+a,y+b,w,h);};R(-15,-9,30,9,'#090a0c');R(-13,-17,26,9,'#090a0c');R(-9,-25,18,9,'#090a0c');R(-14,-8,28,8,'#1f181a');R(-12,-16,24,8,'#251d1e');R(-8,-24,16,8,'#2c2325');R(-6,-23,6,2,'#3a2f31');R(-11,-15,5,2,'#33292b');for(const[a,b]of[[-12,-12],[9,-7],[6,-21],[-7,-5]]){R(a,b,3,1,'#a59f86');}R(-5,-13,10,13,'#090a0c');const on=(t>>3)&1;R(-3,-10,2,2,on?'#e8321c':'#772921');R(1,-10,2,2,on?'#e8321c':'#772921');R(-14,-31,28,4,'#090a0c');R(-13,-30,Math.max(0,Math.round(26*hp/max)),2,'#e8321c');}
function drawTrap(C,t,time,ox,oy,on=1){const x=t.x-ox|0,y=t.y-oy|0,R=(a,b,w,h,c)=>{C.fillStyle=c;C.fillRect(x+a,y+b,w,h);},per=t.per||70,ph=Math.floor(time*TPS+(t.off||0))%per;
 switch(t.k){
 case'spring':{const q=t.cd>0?2:0;if(t.cap){R(-9,-6+q,18,4,'#a33b2d');R(-7,-8+q,14,2,'#a33b2d');R(-5,-7+q,3,2,'#f7e5ac');R(2,-6+q,3,2,'#f7e5ac');R(-2,-3,4,3,'#dad1ac');}else{R(-9,-3,18,3,'#090a0c');R(-8,-2,16,2,'#47494c');R(-7,-5+q,14,2,'#8e2f40');R(-5,-7+q,10,2,'#a2364a');R(-1,-4,2,2,'#f0d16b');}break;}
 case'belt':{const W=t.w||60,ph2=(Math.floor(time*12)*(t.dir||1)%8+8)%8;C.fillStyle='#090a0c';C.fillRect(x,y,W,5);C.fillStyle='#3b3d40';C.fillRect(x+1,y+1,W-2,3);C.fillStyle='#f0c36b';for(let i=ph2;i<W-2;i+=8)C.fillRect(x+1+i,y+1,3,1);break;}
 case'keg':if(on){R(-6,-11,12,11,'#090a0c');R(-5,-10,10,9,'#68482b');R(-5,-8,10,1,'#79818b');R(-5,-4,10,1,'#79818b');R(-1,-6,2,2,'#2c1e16');}break;
 case'crystal':if(on){R(-3,-12,6,12,'#6a3fb0');R(-2,-14,4,3,'#a97fe8');R(-6,-7,4,7,'#5a3597');R(2,-9,4,9,'#8657cf');R(-1,-10,2,6,'#e0ccff');}break;case'scrap':if(on){R(-6,-4,12,4,'#090a0c');R(-5,-3,10,3,'#525559');R(-4,-6,5,3,'#8d6d42');R(0,-7,4,4,'#79818b');R(1,-6,2,2,'#090a0c');}break;
 case'nest':drawNest(C,x,y,t.hp||8,t.hp||8,time*TPS|0);break;
 case'foe':drawFoe(C,t.kind||'skel',x,y,t.dir||1,time*TPS|0,0);break;
 case'jaws':{const shut=t.cd>0;R(-8,-2,16,2,'#232325');for(let i=0;i<4;i++){R(-8+i*4,shut?-6:-5,3,shut?4:3,'#818994');R(-8+i*4,shut?-6:-3,1,1,'#fff');}break;}
 case'mine':if(on){R(-6,-4,12,4,'#090a0c');R(-5,-5,10,4,'#2d2d2f');R(-3,-6,6,2,'#414143');R(-1,-7,2,1,(ph%24)<12?'#dd1616':'#481818');}break;
 case'jet':{R(-6,-4,12,4,'#090a0c');R(-5,-3,10,3,'#47494c');R(-3,-5,6,2,'#232325');if(ph<26){const h=46;for(let i=0;i<h;i+=2){const w=5-(i/h*2|0)+((i*7+ph*5)%3-1);R(-w,-6-i,w*2,2,i%6<2?'#b5a64b':i<30?'#db9016':'#b64c1e');}}break;}
 case'press':{const down=ph>=30&&ph<42?1:ph>=42?Math.max(0,1-(ph-42)/24):Math.max(0,(ph-24)/6);const top=-58+Math.round(44*down*(ph>=24?1:0));R(-13,-62,4,62,'#232325');R(9,-62,4,62,'#232325');R(-12,-62,1,62,'#47494c');R(-1,-62,2,top+62,'#47494c');R(-10,top,20,14,'#090a0c');R(-9,top+1,18,12,'#525559');R(-9,top+1,18,2,'#727881');break;}
 case'catapult':{const d=t.dir||1;R(-9,-5,18,5,'#090a0c');R(-8,-4,16,3,'#68482b');R(-7,-1,4,1,'#232325');R(3,-1,4,1,'#232325');C.strokeStyle='#090a0c';C.lineWidth=3;C.beginPath();C.moveTo(x,y-4);C.lineTo(x-d*8,y-13);C.stroke();C.strokeStyle='#8d6d42';C.lineWidth=1;C.beginPath();C.moveTo(x,y-4);C.lineTo(x-d*8,y-13);C.stroke();R(-d*8-2,-15,4,3,'#5c432c');break;}
 case'fire':{const W=t.rw||20,H=Math.min(t.rh||8,24);for(let i=0;i<W;i+=3){const f=(Math.sin(i*1.7+time*11)+Math.sin(i*.6-time*7)+2)/4,tall=H+f*8|0;C.fillStyle='#b64c1e';C.fillRect(x+i,y+H-tall,3,tall);C.fillStyle='#db9016';C.fillRect(x+i,y+H-(tall*.65|0),3,tall*.65|0);C.fillStyle='#b5a64b';C.fillRect(x+i+1,y+H-(tall*.3|0),1,tall*.3|0);}break;}
 case'forcel':case'forcer':{const W=t.rw||20,H=Math.min(t.rh||16,64),d=t.k==='forcer'?1:-1;C.fillStyle='rgba(120,160,230,.12)';C.fillRect(x,y,W,H);C.fillStyle='#090a0c';C.fillRect(x,y,W,1);C.fillRect(x,y+H-1,W,1);C.fillStyle='#8fb3ee';const o=((Math.floor(time*14)*d)%12+12)%12;for(let j=6;j<H-4;j+=10)for(let i=o;i<W-6;i+=12){const ax=d>0?x+i:x+W-i-6;C.fillRect(ax+(d>0?0:2),j,4,1);C.fillRect(ax+(d>0?3:0),j-2,1,5);C.fillRect(ax+(d>0?4:1),j-1,1,3);}break;}
 case'updraft':{const W=t.rw||20,H=Math.min(t.rh||24,120);C.fillStyle='rgba(190,220,230,.10)';C.fillRect(x,y,W,H);C.fillStyle='#cfe6ee';const o=Math.floor(time*16)%10;for(let i=3;i<W-2;i+=6)for(let j=H-o;j>0;j-=10){C.fillRect(x+i+((j>>3)&1)*2,y+j,1,4);}break;}
 case'splat':{const W=t.rw||20,H=Math.min(t.rh||6,16);C.fillStyle='#090a0c';C.fillRect(x,y,W,H);C.fillStyle='#7a2a22';C.fillRect(x+1,y+1,W-2,H-2);C.fillStyle='#c9532f';for(let i=2;i<W-2;i+=5)C.fillRect(x+i,y+1,2,2);break;}
 case'nosplat':{const W=t.rw||20,H=Math.min(t.rh||6,16);C.fillStyle='#090a0c';C.fillRect(x,y,W,H);C.fillStyle='#3d6a3a';C.fillRect(x+1,y+1,W-2,H-2);C.fillStyle='#8fc46a';for(let i=2;i<W-2;i+=5)C.fillRect(x+i,y+1,2,1);break;}
 case'splitter':{const W=t.rw||16,H=Math.min(t.rh||16,40),mx=x+(W>>1);C.fillStyle='#090a0c';C.fillRect(mx-1,y,3,H);C.fillStyle='#8c8f93';C.fillRect(mx,y+1,1,H-2);const f=(t.n|0)?1:0;C.fillStyle=f?'#f0c36b':'#58606a';C.fillRect(mx+2,y+3,4,1);C.fillRect(mx+5,y+2,1,3);C.fillStyle=f?'#58606a':'#f0c36b';C.fillRect(mx-5,y+3,4,1);C.fillRect(mx-5,y+2,1,3);break;}
 case'warp':{R(-7,-16,2,16,'#090a0c');R(5,-16,2,16,'#090a0c');R(-7,-18,14,3,'#090a0c');R(-6,-15,1,15,'#595c5f');R(6,-15,1,15,'#595c5f');R(-6,-17,12,2,'#595c5f');R(-4,-14,8,14,['#3c4259','#505e9b','#4b6681'][(t.p||0)%3]);R(-2,-12+(ph%10),4,2,'#fff');break;}}}
function drawHazard(C,h,theme,vx,vw,camX,camY,sh,kind){const th=(kind?THEME[kind]:THEME[theme]).haz,cx=camX|0,cy=camY|0,x0=Math.max(h.x0-8,cx),x1=Math.min(h.x1+8,cx+vw);
 for(let x=x0;x<x1;x+=2){const yy=h.y+Math.sin(x*.09+clock*2.4)*1.6+Math.sin(x*.03-clock*1.3)*1.4|0,sx=x-cx+vx+sh,sy=yy-cy;C.fillStyle=th[0];C.fillRect(sx,sy,2,1);C.fillStyle=th[1];C.fillRect(sx,sy+1,2,2);C.fillStyle=th[2];C.fillRect(sx,sy+3,2,5);C.fillStyle=th[3];C.fillRect(sx,sy+8,2,h.y1!==undefined?Math.max(0,h.y1-yy-8):VIEWH+40);}
 const span=Math.max(1,h.x1-h.x0+1);for(let i=0;i<5;i++){const bx=h.x0+((i*73+Math.floor(clock*.7+i)*131)%span),ph=(clock*.7+i)%1,by=h.y+6-ph*5;C.fillStyle=th[0];C.fillRect(bx-cx+vx+sh,by-cy,2,2);}}
