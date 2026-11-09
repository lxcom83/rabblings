// ---------- clans ----------
const CLAN=[
 {name:'MUDFOOT',skin:'#626a44',skinD:'#3f4833',skinL:'#8e954b',hood:'#af3329',hoodD:'#691d2a',tun:'#91382f',tunD:'#291619',boot:'#442f21',ui:'#e94121'},
 {name:'ASHGUT',skin:'#596a80',skinD:'#3f4752',skinL:'#6d85a3',hood:'#caa21e',hoodD:'#805a1c',tun:'#a27a26',tunD:'#66441a',boot:'#1d1e22',ui:'#e7bd17'}];
// ---------- goblin rig ----------
const ANIM={walk:8,panic:8,fall:4,float:4,climb:6,hoist:4,dig:6,bash:8,pick:8,build:8,block:4,shrug:4,ohno:4,home:6,splat:4,drown:4,swim:4};
const ANKEYS=Object.keys(ANIM),CELL=24,HR=2,SRC=CELL*HR;
const HEAD=['....HHh.....','...HHhhh....','...Hhhhhh...','S..sssSSss..','Ssssllepsn..','.Ssssssssnn.','..ssSStSs...','...ssssss...'];
const HEADOPEN=['....HHh.....','...HHhhh....','...Hhhhhh...','S..sssSSss..','Ssssllepsn..','.Ssssssssnn.','..ssxxxxs...','...ssxxss...'];
function pose(s,f,n){const t=f/n*TAU,S=Math.sin,C=Math.cos,R=Math.round;
 const p={bx:0,by:0,lf:[2,0],lb:[-2,0],af:[3,1],ab:[-3,1],hd:0,lean:0,open:0,tool:null};
 switch(s){
 case'walk':p.lf=[R(3*S(t)),-Math.max(0,R(2*C(t)))];p.lb=[R(-3*S(t)),-Math.max(0,R(-2*C(t)))];p.by=-(R(Math.abs(S(t))));p.af=[R(-2*S(t))+1,2];p.ab=[R(2*S(t))-1,2];break;
 case'panic':p.lf=[R(4*S(t)),-Math.max(0,R(3*C(t)))];p.lb=[R(-4*S(t)),-Math.max(0,R(-3*C(t)))];p.af=[3,-7+R(S(t*2))];p.ab=[-3,-7-R(S(t*2))];p.open=1;p.lean=1;break;
 case'fall':p.af=[4,-6+R(2*S(t))];p.ab=[-4,-6-R(2*S(t))];p.lf=[2,-2];p.lb=[-3,-1];p.open=1;break;
 case'float':p.af=[1,-8];p.ab=[1,-8];p.lf=[1+R(S(t)),-1];p.lb=[-1,-1];p.bx=R(S(t));p.tool={k:'brolly'};break;
 case'climb':p.bx=3;p.lean=0;p.af=[4,-7+R(3*S(t))];p.ab=[3,-3-R(3*S(t))];p.lf=[6,-3+R(2*S(t))];p.lb=[3,-1-R(2*S(t))];break;
 case'hoist':p.bx=3+f;p.by=-4;p.af=[4,1];p.ab=[3,1];p.lf=[5+f,-5];p.lb=[3+f,-3];break;
 case'dig':{const d=R(3*S(t));p.lean=1;p.by=1+(f>2?1:0);p.lf=[3,0];p.lb=[-3,0];p.af=[4,4+d];p.ab=[3,2+d];p.tool={k:'shovel',a:1.25,l:9,fromF:1,dy:d};break;}
 case'bash':{const a=f<4?-2.3+f*.15:-2+(f-4)*.75;p.lean=f<4?-1:2;p.lf=[3,0];p.lb=[-3,0];const h=[R(C(a)*4),R(S(a)*4)];p.af=h;p.ab=[h[0]-1,h[1]+1];p.tool={k:'club',a,l:9};p.open=f>=4?1:0;break;}
 case'pick':{const a=f<4?-2.2+f*.2:-1.6+(f-4)*.7;p.lean=f<4?-1:1;p.by=f>=6?1:0;p.lf=[3,0];p.lb=[-3,0];const h=[R(C(a)*4),R(S(a)*4)];p.af=h;p.ab=[h[0],h[1]+1];p.tool={k:'pick',a,l:9};break;}
 case'build':{const down=f>=4;p.lean=down?2:0;p.by=down?2:0;p.lf=[3,down?0:0];p.lb=[-3,0];p.af=down?[5,4]:[3,0];p.ab=down?[4,4]:[3,1];p.tool={k:'plank',d:down};break;}
 case'block':p.af=[6,-3+R(S(t))];p.ab=[-6,-3-R(S(t))];p.lf=[4,0];p.lb=[-4,0];p.open=f>1?1:0;p.by=1;break;
 case'shrug':p.af=[5,-3];p.ab=[-5,-3];p.hd=f%2;p.lf=[2,0];p.lb=[-2,0];break;
 case'ohno':p.af=[2,-7];p.ab=[-2,-7];p.open=1;p.bx=f%2?1:-1;break;
 case'home':p.by=-Math.abs(R(4*S(t)));p.af=[4,-7];p.ab=[-4,-7];p.open=1;p.lf=[3,-1];p.lb=[-3,-1];break;
 case'swim':p.by=3;p.af=[5,R(S(t)*2)-2];p.ab=[3,-R(S(t)*2)-2];p.lf=[2,0];p.lb=[-2,0];break;
 case'drown':p.by=f*2+1;p.af=[4,-7+f];p.ab=[-4,-7+f];p.open=1;p.lf=[1,3];p.lb=[-1,3];break;}
 return p;}
function drawRig(x,c,s,f,n){
 const P=(px,py,col,w=1,h=1)=>{x.fillStyle=col;x.fillRect(px|0,py|0,w,h);};
 const L=(a,b,e,g,col,th=2)=>{const st=Math.max(Math.abs(e-a),Math.abs(g-b),1);for(let i=0;i<=st;i++)P(Math.round(lerp(a,e,i/st)),Math.round(lerp(b,g,i/st)),col,th,th);};
 if(s==='splat'){const o=[0,1,2,3][f];x.fillStyle=c.skinD;x.fillRect(5-o,20,14+o*2,2);x.fillStyle=c.skin;x.fillRect(7-o,19,10+o,2);x.fillStyle=c.hood;x.fillRect(9,17+o,6,3-Math.min(o,1));P(5-o,18-o,c.skinL);P(19+o,17-o,c.skinL);return;}
 const p=pose(s,f,n),hx=11+p.bx,hy=17+p.by,sx=hx+p.lean,sy=hy-4;
 if(s==='drown'||s==='swim'){x.save();x.beginPath();x.rect(0,0,24,20);x.clip();}
 if(c.wings){P(hx-9,hy-9,'#645e58',5,5);P(hx-8,hy-8,'#897f70',3,3);P(hx-9,hy-3,'#645e58',4,4);P(hx-8,hy-2,'#897f70',2,2);}
 if(c.tail){L(hx-3,hy,hx-6,hy+2,c.skinD,1);L(hx-6,hy+2,hx-9,hy-2,c.skinD,1);P(hx-10,hy-3,c.hood,2,2);}
 if(!c.wings){const k=c.cape||c.hoodD,bx=hx-3+p.lean,fl=(f+(s==='walk'?0:1))%2;P(bx-1,hy-5,k,1,7);P(bx-2,hy-4,k,1,5+fl);P(bx-3,hy-1,k,1,2+fl);P(bx-1,hy+2,k,1,1);P(bx-3,hy-2,'#120c10',1,1);}
 L(sx-1,sy+1,sx-1+p.ab[0],sy+1+p.ab[1],c.skinD);
 const leg=(l,col)=>{const fx=11+l[0]+(p.bx>2?p.bx-1:0),fy=20+l[1];L(hx,hy+1,fx,fy,col);P(fx,fy+1>21?21:fy+1,c.boot,4,1);P(fx,fy>20?20:fy,c.boot,3,1);};
 leg(p.lb,c.tunD);leg(p.lf,c.skinD);
 x.fillStyle=c.tun;x.fillRect(hx-3+p.lean,hy-5,6,6);x.fillRect(hx-3,hy-1,6,2);x.fillStyle=c.tunD;x.fillRect(hx-3+p.lean,hy-5,1,6);x.fillRect(hx-3,hy+1,6,1);P(hx-3,hy,'#382417',6,1);P(hx,hy,'#7a6a42');
 const hl=[c.hood,c.hoodD,c.skin,c.skinD,c.skinL];const map={H:c.hoodD,h:c.hood,s:c.skin,S:c.skinD,l:c.skinL,n:c.skinD,e:c.glow||'#f0c040',p:'#2a0806',t:'#cabd7c',x:'#160b0d'};
 const tpl=p.open?(c.headO||HEADOPEN):(c.head||HEAD),ox=sx-5+p.lean,oy=sy-7+p.hd;
 tpl.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]!=='.')P(ox+i,oy+j,map[r[i]]);});
 const hand=[sx+1+p.af[0],sy+1+p.af[1]];
 if(p.tool){const T=p.tool;
  if(T.k==='brolly'){L(hand[0],hand[1],hand[0],hand[1]-3,'#513925',1);const bx=hand[0]-7,by=hand[1]-7;
    [[3,0,9],[1,1,13],[0,2,15],[0,3,15]].forEach(([a,b,w],k)=>P(bx+a,by+b,k<1?'#5b313a':'#35374b',w,1));for(let i=0;i<4;i++)P(bx+i*5,by+3,'#1d1f29',2,1);}
  else if(T.k==='plank'){x.fillStyle='#8d6d42';x.fillRect(hand[0]-1,hand[1]+(T.d?1:-1),9,2);x.fillStyle='#5c432c';x.fillRect(hand[0]-1,hand[1]+(T.d?2:0),9,1);}
  else{const ex=hand[0]+Math.cos(T.a)*T.l,ey=hand[1]+Math.sin(T.a)*T.l;L(hand[0],hand[1]+(T.dy?0:0),ex,ey,'#5c4026',1);
   const nx=-Math.sin(T.a),ny=Math.cos(T.a);
   if(T.k==='club'){L(ex-Math.cos(T.a)*3,ey-Math.sin(T.a)*3,ex+Math.cos(T.a)*2,ey+Math.sin(T.a)*2,'#7f5d38',3);P(ex,ey,'#818a94');P(ex-1,ey+1,'#818a94');}
   if(T.k==='pick'){L(ex-nx*4,ey-ny*4,ex+nx*4,ey+ny*4,'#727981',1);P(ex+nx*4,ey+ny*4,'#fff');P(ex,ey,'#515357');}
   if(T.k==='shovel'){x.fillStyle='#6b7178';x.fillRect(ex-2,ey,5,3);x.fillStyle='#fff';x.fillRect(ex-2,ey,1,2);P(ex-1,ey+3,'#515357',3,1);}}}
 L(sx+1,sy+1,hand[0],hand[1],c.skin);P(hand[0],hand[1],c.skinL,2,2);
 if(s==='drown'||s==='swim')x.restore();
}
function outline(cvs,col,th){th=th||1;const x=cvs.getContext('2d'),w=cvs.width,h=cvs.height,rgb=hex2(col);
 for(let r=0;r<th;r++){const d=x.getImageData(0,0,w,h),a=d.data,o=new Uint8ClampedArray(a);
 for(let y=0;y<h;y++)for(let i=0;i<w;i++){const k=(y*w+i)*4;if(a[k+3])continue;const on=(i>0&&a[k-1])||(i<w-1&&a[k+7])||(y>0&&a[k-w*4+3])||(y<h-1&&a[k+w*4+3]);if(on){o[k]=rgb[0];o[k+1]=rgb[1];o[k+2]=rgb[2];o[k+3]=255;}}
 d.data.set(o);x.putImageData(d,0,0);}}
const ROW={};ANKEYS.forEach((k,i)=>ROW[k]=i);
// Sheets hold SRC (=CELL*HR) pixel cells. A clan with hi:1 has a native high-detail rig (rig48); the rest draw the 24px rig at HR times scale, which looks exactly as before.
const RIG48={};// race key -> native 48px rig(x,c,anim,frame,n); registered by art48*.js
function buildSheet(c){const rg=c.hi&&RIG48[c.hi];const[sh,sx]=mk(SRC*8,SRC*ANKEYS.length*2);
 ANKEYS.forEach((s,r)=>{const n=ANIM[s];for(let f=0;f<n;f++){const[t,tx]=mk(SRC,SRC);
  if(rg){rg(tx,c,s,f,n);outline(t,'#090a0c',s==='splat'?HR:1);}else{const[t1,x1]=mk(CELL,CELL);drawRig(x1,c,s,f,n);outline(t1,'#090a0c');tx.drawImage(t1,0,0,SRC,SRC);}
  sx.drawImage(t,f*SRC,r*2*SRC);sx.save();sx.translate(f*SRC+SRC,(r*2+1)*SRC);sx.scale(-1,1);sx.drawImage(t,0,0);sx.restore();}});
 return sh;}
const SHEETS=CLAN.map(buildSheet);
function sheetSprite(C,sheet,anim,frame,dir,x,y){const n=ANIM[anim],f=((frame%n)+n)%n,d=dir>0?0:1;C.drawImage(sheet,f*SRC,(ROW[anim]*2+d)*SRC,SRC,SRC,x-(d?12:11),y-22,CELL,CELL);}
function gobSprite(C,team,anim,frame,dir,x,y){const n=ANIM[anim],f=((frame%n)+n)%n,d=dir>0?0:1;C.drawImage(SHEETS[team],f*SRC,(ROW[anim]*2+d)*SRC,SRC,SRC,x-(d?12:11),y-22,CELL,CELL);}

// ---------- props ----------
function hut(team){const[c,x]=mk(52,46);const cl=typeof team==='object'?team:CLAN[team];team=typeof team==='object'?(cl.seed||0):team;
 const m=[[122,84,52],[148,104,66],[96,66,44]];for(let y=14;y<46;y++)for(let i=4;i<48;i++){const dx=(i-26)/22,dy=(y-46)/32;if(dx*dx+dy*dy>1)continue;const n=noise(i*5,y*5+team*40);x.fillStyle=css(m[n>.58?1:n<.42?2:0]);x.fillRect(i,y,1,1);}
 for(let y=4;y<24;y++){const hw=2+(y-4)*1.15|0;for(let i=26-hw;i<26+hw;i++){const s=(i+y*2)%5;x.fillStyle=s<1?'#5b4623':s<3?'#987838':'#7b612d';x.fillRect(i,y,1,1);}}
 for(let i=0;i<10;i++){x.fillStyle='#5b4623';x.fillRect(4+i*5,24+(i%2),2,3);}
 x.fillStyle='#1f0f09';x.fillRect(19,28,14,18);x.fillRect(20,26,12,2);x.fillStyle='#e89217';x.fillRect(21,30,10,16);x.fillStyle='#f2d378';x.fillRect(23,34,6,12);
 x.fillStyle='#4f301c';for(let k=0;k<3;k++)x.fillRect(18+k*0,28,1,18);x.fillRect(33,28,1,18);
 x.fillStyle='#ded5b3';x.fillRect(23,20,6,5);x.fillStyle='#090a0c';x.fillRect(24,22,1,1);x.fillRect(27,22,1,1);x.fillStyle='#ded5b3';x.fillRect(24,25,4,2);
 x.fillStyle='#442f21';x.fillRect(42,0,2,24);x.fillStyle=cl.hood;x.fillRect(44,1,8,4);x.fillRect(44,5,6,3);x.fillStyle=cl.hoodD;x.fillRect(44,7,5,1);
 outline(c,'#090a0c');return c;}
const HUT=[hut(0),hut(1)];
function mimicOf(h){const[k,x]=mk(52,46);x.drawImage(h,0,0);x.fillStyle='#f9ecc0';for(let j=0;j<6;j++){x.fillRect(19+j*3,28,2,3);x.fillRect(19+j*3,42,2,3);}x.fillStyle='#d81515';x.fillRect(21,31,10,1);x.fillRect(24,20,1,2);x.fillRect(27,20,1,2);return k;}
const MIMIC=[mimicOf(HUT[1]),mimicOf(HUT[0])];
function hatch(team){const[c,x]=mk(44,28);const cl=typeof team==='object'?team:CLAN[team];
 for(let y=0;y<20;y++)for(let i=2;i<42;i++){const n=(i%8===0)?.55:.85+.2*noise(i*2,y*7);x.fillStyle=css([120*n,82*n,46*n]);x.fillRect(i,y,1,1);}
 x.fillStyle='#3a3c3f';x.fillRect(2,0,40,2);x.fillRect(2,14,40,2);x.fillStyle='#62666c';x.fillRect(2,0,40,1);x.fillRect(2,14,40,1);
 x.fillStyle=cl.hood;x.fillRect(16,3,12,10);x.fillStyle=cl.hoodD;x.fillRect(16,11,12,2);x.fillStyle='#ded5b3';x.fillRect(19,4,6,5);x.fillRect(20,9,4,2);x.fillStyle='#090a0c';x.fillRect(20,6,1,1);x.fillRect(23,6,1,1);
 x.fillStyle='#090a0c';x.fillRect(8,20,28,3);outline(c,'#090a0c');return c;}
const HATCH=[hatch(0),hatch(1)];
const GLOW={};function glow(col){if(GLOW[col])return GLOW[col];const[c,x]=mk(64,64),g=x.createRadialGradient(32,32,1,32,32,32);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return GLOW[col]=c;}

// ---------- HUD icons ----------
const ICPAL={a:'#f7e5ac',b:'#a37c44',c:'#5d4832',d:'#b83b26',e:'#575c62',f:'#777d45',g:'#505e9b'};
const ICON_SRC={
sleep:['............','..eeee......','....e..fff..','...e.....f..','..eeee..f...','.......fff..','....aa......','.....a......','....a.......','....aa......'],
confuse:['...gggg.....','..g....g....','......g.....','.....g......','.....g......','............','.....g......','..a.....a...','.a.a...a.a..','..a.....a...'],
hypno:['..gggggggg..','.g........g.','.g.gggggg.g.','.g.g....g.g.','.g.g.gg.g.g.','.g.g..g.g.g.','.g.gggg.g.g.','.g......g.g.','.gggggggg.g.','..........g.'],
ward:['.eeeeeeeeee.','.eaaaaaaaae.','.eaaaaaaaae.','.eaaeeeeaae.','.eaaeeeeaae.','.eaaaaaaaae.','..eaaaaaae..','...eaaaae...','....eaae....','.....ee.....'],
rally:['..c.........','..cddddddd..','..cddddddd..','..cdddddd...','..cddddd....','..c.........','..c.........','..c.........','..c.........','.ccc........'],
climb:['eee.........','eee...a.a...','eee..aa.aa..','eeea.aaaaa..','eeeaaaaaaa..','eeeaaaaaa...','eee.aaaaa...','eee..aaa....','eee..bbb....','eee..bbb....'],
flap:['....gggg....','..gggggggg..','.gggggggggg.','gggggggggggg','g..g..g..g..','.....b......','.....b......','.....b......','.....b..b...','......bb....'],
boom:['.......d.a..','......b.d...','.....b......','...eee......','..eeeeee....','.eaaeeeee...','.eaeeeeee...','.eeeeeeee...','..eeeeee....','...eeee.....'],
block:['...dddddd...','..dddddddd..','.dddddddddd.','.dddddddddd.','.daaaaaaaad.','.daaaaaaaad.','.dddddddddd.','.dddddddddd.','..dddddddd..','...dddddd...'],
build:['............','.........bbb','.........ccc','......bbb...','......ccc...','...bbb......','...ccc......','bbb.........','ccc.........','............'],
bash:['.......bbbb.','......bbbbbb','.....bbcbbbb','....bbbbbbb.','...ccbbbb...','..ccc.......','.ccc........','ccc.........','cc..........','............'],
pick:['..eeeeeee...','.eeeaaaaeee.','ee....c...ee','e.....c....e','......c.....','.....cc.....','.....c......','....cc......','....c.......','....c.......'],
dig:['.......bbb..','........b...','........c...','........c...','.......c....','.......c....','......eee...','.....eaaae..','.....eeeee..','......eee...'],
boulder:['....eeee....','..eeaaeeee..','.eeaeeeeeee.','.eeeeeeecee.','eeeeeeecceee','eeeceeeeeeee','.eeccceeeee.','.eeeeeeeee..','..eeeeeee...','............'],
stink:['.....f......','...f...f....','.....ff.....','..fffffff...','.ffffffffff.','fffcffffcfff','ffffffffffff','.ffffccfffff','..ffffffff..','....ffff....'],
hex:['.....gg.....','.....gg.....','..g..gg..g..','...gggggg...','gggggaagggg.','gggggaagggg.','...gggggg...','..g..gg..g..','.....gg.....','.....gg.....'],
mimic:['...bbbbbb...','..bccccccb..','.bcacacacab.','.bcccccccab.','.bccddccccb.','.bcdddcccab.','.bcacacacab.','.bccccccccb.','.bbbbbbbbbb.','............']};
Object.assign(ICON_SRC,{
raise:['...aaaa.....','..aaaaaa....','..a.aa.a....','..aaaaaa....','...a.a......','....aa......','..aaaaaa....','....aa......','...a..a.....','.bbbbbbbb...'],
merge:['.aa....aa...','aaaa..aaaa..','.aa....aa...','...aaaa.....','..aaaaaa....','..a.aa.a....','..aaaaaa....','...aaaa.....','.aa....aa...','aaaa..aaaa..'],
bonebr:['............','........aa.a','.......aaaa.','.....aa.a...','....aaaa....','..aa.a......','.aaaa.......','a.a.........','............','............'],
glide:['............','..g.....g...','.ggg...ggg..','ggggg.ggggg.','gg.gg.gg.gg.','.ggggggggg..','...ggggg....','....ggg.....','.....g......','............'],
dust:['..a....a....','....g.....a.','.a....a.....','...g.....g..','a.....a.....','....a.....a.','..g.....a...','.....g......','.a.....a....','....a.......'],
steam:['...a..a.....','..a..a......','...a..a.....','...eeee.....','..eeeeee....','..eeddee....','..eeeeee....','...eeee.....','...d..d.....','...a..a.....'],
cannon:['..........d.','.........dd.','.......eee..','.....eeeee..','...eeeeeb...','..eeeeebb...','..eee.bbbb..','.....bcccb..','.....bcccb..','......bbb...'],
spring:['....eeee....','...e....e...','....eeee....','...e....e...','....eeee....','...e....e...','....eeee....','..cccccccc..','.cccccccccc.','............'],
ratmine:['.....d......','......a.....','....eeee....','..eeeeeeee..','.eeeddeeeee.','.eeeddeeeee.','.eeeeeeeee..','..eeeeeeee..','....eeee....','............'],
vine:['........eee.','.......eeeee','........c...','....eee.c...','...eeeee....','....c.......','.eee.c......','eeeee.......','.c..........','.c..........'],
puff:['............','...gg.gg....','..gggggggg..','.gggggggggg.','..gggggggg..','...gggggg...','....f.ff....','.....f......','.....f......','............'],
sword:['..........aa','.........aae','........aae.','.......aae..','......aae...','.b...aae....','.bb.aae.....','..bcae......','..cbb.......','.c..b.......'],
bow:['....cc......','...c..a.....','..c....a....','.c......a...','.c...d...a..','bbbbbbbbbaae','.c...d...a..','.c......a...','..c....a....','...cc.a.....'],
tongue:['..f.f.......','.ffffff.....','fafcaff.....','ffffffd.....','..ffddddddd.','..ff.....dd.','..ff.....d..','..f.........','............','............'],
spear:['..........ee','.........eae','........c.e.','.......c....','......c.....','.....c.bbbb.','....c.bbbb..','...c.bbbb...','..c.bbbb....','.c.bbbb.....'],
hop:['............','....dddd....','..dd....dd..','.d........d.','d..........d','a..........a','aa........aa','aaa......aaa','............','............'],
swim:['............','............','....aa......','...aaaa.....','....aa..g...','..bbbbbb.g..','.g.g.g.g.g..','g.g.g.g.g.g.','.g.g.g.g.g..','............'],
disarm:['....eeee....','...eeeeee...','..eeeddeee..','..eedaaddee.','..eedaaddee.','..eeeddeee..','...eeeeee...','....eddd....','....d..d....','............'],
walkr:['............','....aaa.....','....aaa.....','.....a......','....bbb.....','...b.b.b....','....bbb.....','....b.b.....','...bb.bb....','............'],
firepot:['....d..d....','...dda.dd...','....ddad....','...dddddd...','...ccccc....','..cbbbbbc...','..cbbbbbc...','..cbbbbbc...','...ccccc....','............']});
const ICON={};for(const k in ICON_SRC){const[c,x]=mk(12,10);ICON_SRC[k].forEach((r,j)=>{for(let i=0;i<12;i++)if(ICPAL[r[i]]){x.fillStyle=ICPAL[r[i]];x.fillRect(i,j,1,1);}});ICON[k]=c;}

// ---------- themes ----------
const THEME={
 bog:{ramp:['#131011','#2d2323','#3b2c28','#48372e','#574435','#67503d','#766147'],cap:['#91924a','#6f7448','#565d41','#414937'],capD:6,peb:'#897c6a',iron:[75,82,92],sky:['#16191f','#23262f','#312225','#ab4c3b','#dc8a2a'],haz:['#8b9145','#596140','#3a442e','#222b1d'],amb:'#b0b54a',glow:'rgba(180,240,90,.55)'},
 mine:{ramp:['#131315','#191a1c','#1f2022','#201d1d','#4a3d3e','#5b4b47','#6d5c51'],cap:['#92806e','#6d625b','#544948','#232020'],capD:3,peb:'#50677b',iron:[84,88,98],sky:['#08090a','#0e0e10','#131416','#18191b','#171415'],haz:['#753243','#44475d','#303344','#1f222d'],amb:'#b9b1a1',glow:'rgba(120,230,240,.5)'},
 forge:{ramp:['#0a0808','#0e0b0c','#140f10','#331f23','#422829','#53322f','#643d35'],cap:['#e57a17','#95462e','#5f2b26','#381d1f'],capD:3,peb:'#dd4e16',iron:[67,71,82],sky:['#070405','#10090a','#431516','#7c2a1b','#b5571f'],haz:['#b5a64b','#db9016','#b64c1e','#812818'],amb:'#e89217',glow:'rgba(255,140,40,.6)'},
 frost:{ramp:['#1d2127','#272c33','#323741','#3e444f','#4a525e','#556272','#617389'],cap:['#ffffff','#7493b7','#6883a1','#5a6d84'],capD:5,peb:'#6f91b5',iron:[88,98,110],sky:['#0d0f15','#1a1f28','#262f3a','#39444e','#6c8f61'],haz:['#698fb2','#4e667f','#3a4757','#283240'],amb:'#ffffff',glow:'rgba(150,230,255,.5)'}};
Object.assign(THEME.forge,{hot:1,lavaHaz:1});
Object.assign(THEME,{vortex:{ramp:['#120d1e','#1b1430','#261c42','#33265a','#42317a','#563f98','#6f55b8'],cap:['#d9b8ff','#a77de8','#7a52c0','#4e3388'],capD:4,peb:'#8c6bd0',iron:[84,76,110],sky:['#07040f','#150a2a','#2c1250','#5a2a8c','#b86bd4'],haz:['#c18cff','#8a4fd6','#522a96','#2f1760'],amb:'#e6c8ff',glow:'rgba(200,150,255,.6)'},shatter:{ramp:['#17131a','#221b24','#2e2530','#3b3040','#4a3c50','#5c4b62','#705c76'],cap:['#c8b6a0','#a08c78','#7a6a5c','#4c423a'],capD:4,peb:'#9a8672',iron:[96,88,86],sky:['#14101a','#2a1d2e','#5a3340','#a85a48','#e8a060'],haz:['#e8a04a','#c05a2a','#7a2e1e','#40160f'],amb:'#f0c8a0',glow:'rgba(255,170,110,.5)'}});
Object.assign(THEME,{canopy:{ramp:['#0f1a12','#16261a','#1e3422','#27432b','#325436','#42683f','#587f4b'],cap:['#9fd16a','#6fae4e','#4b8a3d','#2f5f2c'],capD:4,peb:'#7a9f5a',iron:[70,84,78],sky:['#0b1f1c','#14382f','#1f5a45','#4f8a54','#a6c46a'],haz:['#78b14a','#4f7e34','#2f4e24','#1c3016'],amb:'#d4f08a',glow:'rgba(190,255,120,.5)'}});
Object.assign(THEME,{dunes:{ramp:['#2a1d14','#3a281a','#4d3320','#614227','#78532f','#946a3a','#b0864a'],cap:['#f3d58f','#d9b36a','#b58d4d','#8a6a38'],capD:4,peb:'#c79b58',iron:[96,84,72],sky:['#2a3f6b','#5d7fa8','#c9a98a','#f0b868','#fbe3a0'],haz:['#e9a23b','#b8661f','#7e3b14','#4a2210'],amb:'#f5dca0',glow:'rgba(255,200,110,.5)'}});
Object.assign(THEME,{
 marsh:{deco:'bog',ramp:['#121411','#181b17','#21241f','#2b2e28','#353832','#41443b','#4d4f44'],cap:['#9aac64','#697e56','#44573d','#2e3b29'],capD:6,peb:'#94966a',iron:[70,84,81],sky:['#101317','#1b2024','#3c4736','#6b6c54','#a3965d'],haz:['#74a35d','#475e40','#252f36','#171d22'],amb:'#a9c065',glow:'rgba(150,240,170,.5)'},
 cinder:{deco:'forge',hot:1,lavaHaz:1,ramp:['#08090a','#0d0e10','#121317','#171112','#1e1617','#261b1d','#2f2224'],cap:['#e9a223','#c24823','#682a34','#191113'],capD:3,peb:'#e46a17',iron:[61,58,77],sky:['#060709','#0f1015','#1c0f12','#672421','#b65025'],haz:['#b5a64b','#db8516','#b3411f','#762217'],amb:'#e87a17',glow:'rgba(255,120,40,.6)'},
 garden:{deco:'bog',ramp:['#191516','#3b2d2e','#4a3936','#5b493e','#6c5849','#7e6953','#987e58'],cap:['#a5374b','#8e2f40','#56363c','#37272b'],capD:6,peb:'#c0ae65',iron:[105,112,123],sky:['#0c0c0d','#131415','#1b1b1c','#3a2f2d','#5d3d32'],haz:['#7698b8','#5d7d9d','#4e6279','#404c5b'],amb:'#ffffff',glow:'rgba(255,240,200,.5)'},
 halls:{deco:'mine',ramp:['#14100e','#1d1713','#28201a','#342a22','#42352c','#524236','#635042'],cap:['#f2d87d','#b48d33','#68532d','#443624'],capD:3,peb:'#eabc2e',iron:[92,86,77],sky:['#0f0b09','#1b130e','#2c2016','#3b2d1d','#493825'],haz:['#c0b265','#e9bd23','#b07d23','#7b5118'],lavaHaz:1,hot:1,amb:'#f1c170',glow:'rgba(255,200,90,.55)'},
 sewers:{deco:'mine',ramp:['#10100f','#171816','#20201e','#282825','#31312e','#3b3b37','#474641'],cap:['#a8894b','#6b593e','#463c2f','#2d2924'],capD:3,peb:'#757857',iron:[77,85,78],sky:['#0b0c0a','#121410','#1a1d18','#232621','#2b2e28'],haz:['#9ca04f','#636945','#454e36','#2a3222'],amb:'#8d9659',glow:'rgba(150,230,90,.45)'},
 crypts:{deco:'frost',ramp:['#0f0f10','#161618','#1e1f21','#27292c','#323437','#3e4044','#4b4d52'],cap:['#878d9b','#6a6f7a','#4c4e53','#313337'],capD:4,peb:'#a89f78',iron:[84,80,78],sky:['#060607','#0b0b0c','#101111','#181819','#1a1818'],haz:['#586ca9','#484f65','#353c4c','#212630'],amb:'#697fb2',glow:'rgba(170,150,255,.5)'},
 caves:{deco:'mine',ramp:['#0c0d10','#121418','#191b21','#22242b','#2b2e37','#363944','#424551'],cap:['#5483a3','#475c6c','#374451','#262e38'],capD:4,peb:'#4d7896',iron:[77,77,105],sky:['#08090b','#101217','#191c23','#1f232b','#232732'],haz:['#8f3048','#494f73','#393e52','#242837'],amb:'#5483a3',glow:'rgba(100,255,230,.55)'}});
for(const k in THEME){const t=THEME[k];t.r32=t.ramp.map(h=>{const a=hex2(h);return rgb32(a[0],a[1],a[2]);});t.c32=t.cap.map(h=>{const a=hex2(h);return rgb32(a[0],a[1],a[2]);});const p=hex2(t.peb);t.p32=rgb32(p[0],p[1],p[2]);}

// ---------- backdrops ----------
function ditherSky(w,h,stops){const[c,x]=mk(w,h),d=x.createImageData(w,h),b=new Uint32Array(d.data.buffer),st=stops.map(hex2),lv=26;
 for(let y=0;y<h;y++)for(let i=0;i<w;i++){const v=y/h*(st.length-1),q=Math.floor(v*lv+bayer(i,y))/lv,k=Math.min(q|0,st.length-2),f=clamp(q-k,0,1),A=st[k],B=st[k+1];b[y*w+i]=rgb32(lerp(A[0],B[0],f),lerp(A[1],B[1],f),lerp(A[2],B[2],f));}
 x.putImageData(d,0,0);return[c,x];}
const LW=512;
function wave(i,s){const t=i/LW*TAU;return Math.sin(t*2+s)*.5+Math.sin(t*3+s*2.3)*.3+Math.sin(t*7+s*3.1)*.14+Math.sin(t*13+s*.7)*.06;}
function ridge(x,base,amp,s,col,col2){for(let i=0;i<LW;i++){const y=Math.round(base+wave(i,s)*amp);x.fillStyle=col;x.fillRect(i,y,1,270-y);if(col2){x.fillStyle=col2;x.fillRect(i,y,1,2);}}}
function tree(x,a,b,ang,len,w,r,col){const e=a+Math.cos(ang)*len,f=b+Math.sin(ang)*len;x.strokeStyle=col;x.lineWidth=w;x.beginPath();x.moveTo(a,b);x.lineTo(e,f);x.stroke();if(len<5)return;const k=2+(r()>.6?1:0);for(let i=0;i<k;i++)tree(x,e,f,ang+(r()-.5)*1.5,len*(.62+r()*.15),Math.max(1,w*.65),r,col);}
function shroom(x,a,b,h,capw,stem,cap,spot){x.fillStyle=stem;x.fillRect(a-2,b-h,5,h);for(let j=0;j<capw*.55;j++){const w=Math.round(capw*Math.sqrt(1-Math.pow(j/(capw*.55),2)));x.fillStyle=cap;x.fillRect(a-w,b-h-j,w*2+1,1);}if(spot){x.fillStyle=spot;for(let k=0;k<4;k++)x.fillRect(a-capw*.6+k*capw*.4,b-h-2-(k%2)*capw*.2,3,2);}}
function buildBackdrop(name){const T=THEME[name],[sky,sx]=ditherSky(VW,VH,T.sky),L=[];const r=rng(name.length*77);
 const layer=(f,fn)=>{const[c,x]=mk(LW,270);fn(x);L.push({c,f});};
 if(name==='bog'){sx.fillStyle='#f5db98';sx.beginPath();sx.arc(340,120,26,0,TAU);sx.fill();sx.fillStyle='#f0c36b';sx.fillRect(310,126,60,2);sx.fillRect(320,136,44,1);
  layer(.12,x=>ridge(x,170,26,1,'#271a1e'));
  layer(.25,x=>{ridge(x,196,20,2.2,'#1e2028');for(let i=0;i<7;i++)tree(x,r()*LW,205,-1.57,22+r()*12,3,r,'#16181e');});
  layer(.45,x=>{ridge(x,222,16,3.7,'#16181d','#23252c');for(let i=0;i<6;i++){const a=20+i*85+r()*20;shroom(x,a,232,18+r()*20,10+r()*12,'#2a2c32','#2b2d37','#474854');}});
 }else if(name==='mine'){
  layer(.15,x=>{for(let y=0;y<270;y++)for(let i=0;i<LW;i++){const n=noise(i>>1,y>>1);if(n>.46){x.fillStyle=n>.6?'#191a1c':'#141416';x.fillRect(i,y,1,1);}}});
  layer(.3,x=>{for(let i=0;i<5;i++){const a=30+i*102;x.fillStyle='#2d221e';x.fillRect(a,40,9,230);x.fillRect(a+60,40,9,230);x.fillStyle='#3c2f26';x.fillRect(a-6,36,84,9);x.fillRect(a,40,2,230);x.fillRect(a+60,40,2,230);x.fillStyle='#eba336';x.fillRect(a+36,47,5,6);x.fillStyle='#f5e39e';x.fillRect(a+37,48,3,3);}});
  layer(.5,x=>{for(let i=0;i<14;i++){const a=r()*LW|0,b=170+r()*80|0,h=8+r()*20|0;for(let k=0;k<3;k++){const o=k*6-6,hh=h-Math.abs(o);for(let j=0;j<hh;j++){const w=Math.max(1,(hh-j)/4|0);x.fillStyle=j%3?'#313b45':'#4c5f71';x.fillRect(a+o-w,b-j+hh*.2,w*2,1);}}}});
 }else if(name==='forge'){
  layer(.12,x=>ridge(x,180,30,4,'#5a1e17'));
  layer(.28,x=>{ridge(x,206,14,5,'#3a1413');for(let i=0;i<7;i++){const a=r()*LW|0,w=14+r()*14|0,h=50+r()*70|0;x.fillStyle='#2b0e11';x.fillRect(a,206-h,w,h+80);x.fillRect(a-3,206-h,w+6,6);x.fillStyle='#e89217';for(let k=0;k<3;k++)x.fillRect(a+3,206-h+12+k*14,w-6,3);}});
  layer(.5,x=>{ridge(x,232,12,6,'#1c0b0e','#4f1b16');for(let i=0;i<3;i++){const a=70+i*170,b=170;x.fillStyle='#e89217';x.fillRect(a,0,10,b+70);x.fillStyle='#b5a64b';x.fillRect(a+3,0,4,b+70);x.fillStyle='#a54222';x.fillRect(a+9,0,2,b+70);}});
 }else if(name==='vortex'){
  for(let i=0;i<90;i++){sx.globalAlpha=.3+r()*.5;sx.fillStyle='#fff';sx.fillRect(r()*VW,r()*150,1,1);}sx.globalAlpha=1;
  for(let a=0;a<5;a++){sx.strokeStyle=['#7a3fd0','#b86bd4','#e0a8ff','#5a2a8c','#9a5ae0'][a];sx.globalAlpha=.55-a*.07;sx.lineWidth=3-a*.4;sx.beginPath();for(let q=0;q<80;q++){const t2=q/80*5.5+a*.4,rr=8+q*1.3;const px=380+Math.cos(t2)*rr*1.6,py=90+Math.sin(t2)*rr*.7;q?sx.lineTo(px,py):sx.moveTo(px,py);}sx.stroke();}sx.globalAlpha=1;sx.fillStyle='#fff';sx.beginPath();sx.arc(380,90,6,0,TAU);sx.fill();
  layer(.12,x=>ridge(x,196,26,1.1,'#1d1236'));
  layer(.28,x=>{ridge(x,214,16,2.6,'#170e2b','#6f55b8');for(let i=0;i<6;i++){const a=r()*LW|0,h=30+r()*60|0;x.fillStyle='#8c6bd0';x.beginPath();x.moveTo(a,214);x.lineTo(a+5,214-h);x.lineTo(a+10,214);x.fill();x.fillStyle='#e6c8ff';x.fillRect(a+4,214-h+4,2,h*.4);}});
  layer(.5,x=>{ridge(x,238,12,3.8,'#0f0820','#42317a');});
 }else if(name==='shatter'){
  sx.fillStyle='#ffd9a0';sx.beginPath();sx.arc(110,100,28,0,TAU);sx.fill();sx.globalAlpha=.25;sx.beginPath();sx.arc(110,100,46,0,TAU);sx.fill();sx.globalAlpha=1;
  layer(.1,x=>{ridge(x,190,22,1.7,'#3a2a3c');});
  layer(.24,x=>{for(let i=0;i<9;i++){const a=r()*LW|0,y=60+r()*110|0,w=20+r()*40|0,h=8+r()*14|0;x.fillStyle='#4a3a4e';x.beginPath();x.moveTo(a,y);x.lineTo(a+w,y+2);x.lineTo(a+w*.6,y+h*1.6);x.lineTo(a+w*.2,y+h);x.fill();x.fillStyle='#7a6478';x.fillRect(a,y,w,2);}ridge(x,226,14,2.9,'#2a1f2c');});
  layer(.5,x=>{ridge(x,240,12,4.2,'#1c1420','#5a4658');for(let i=0;i<5;i++){const a=30+i*100+r()*30,h=24+r()*30;x.fillStyle='#2c2230';x.fillRect(a,240-h,8,h);x.fillRect(a-6,240-h,22,4);}});
 }else if(name==='canopy'){
  for(let b=0;b<5;b++){sx.globalAlpha=.16;sx.fillStyle='#e8f7a0';sx.beginPath();const a=60+b*90;sx.moveTo(a,0);sx.lineTo(a+30,0);sx.lineTo(a+90,270);sx.lineTo(a+40,270);sx.fill();}sx.globalAlpha=1;
  layer(.1,x=>{for(let i=0;i<9;i++){const a=i*60+r()*20,w=14+r()*10;x.fillStyle='#14281a';x.fillRect(a,0,w,270);x.fillStyle='#1c3a25';x.fillRect(a,0,3,270);}});
  layer(.26,x=>{for(let i=0;i<5;i++){const a=i*110+r()*30,w=26+r()*14;x.fillStyle='#1b3322';x.fillRect(a,0,w,270);x.fillStyle='#27492f';x.fillRect(a,0,4,270);x.fillStyle='#16291c';x.fillRect(a+w-5,0,5,270);for(let k=0;k<4;k++){x.fillStyle='#2f5d36';x.fillRect(a-14,60+k*45,w+28,5);}}ridge(x,246,8,2.2,'#1a3020');});
  layer(.5,x=>{ridge(x,240,10,3.3,'#122217','#3f7a43');for(let i=0;i<10;i++){const a=r()*LW|0,h=14+r()*26|0;x.fillStyle='#2f6a3a';x.beginPath();x.ellipse(a,240-h,9,h/2,0,0,TAU);x.fill();x.fillStyle='#8bd16a';x.fillRect(a-1,240-h,2,h);}});
 }else if(name==='dunes'){
  sx.fillStyle='#fff6cf';sx.beginPath();sx.arc(380,70,34,0,TAU);sx.fill();sx.globalAlpha=.25;sx.beginPath();sx.arc(380,70,52,0,TAU);sx.fill();sx.globalAlpha=1;
  layer(.1,x=>{for(let i=0;i<6;i++){const a=i*92+r()*30,w=36+r()*30,h=34+r()*36;x.fillStyle='#a8745a';x.fillRect(a,200-h,w,h+80);x.fillStyle='#c48b66';x.fillRect(a,200-h,w,4);x.fillStyle='#8a5c48';x.fillRect(a+w*.62,200-h,w*.38,h+80);}ridge(x,214,10,1.3,'#b0805a');});
  layer(.24,x=>ridge(x,208,22,2.4,'#c99a5e','#e8c586'));
  layer(.45,x=>{ridge(x,228,16,4.1,'#a87c45','#d9b36a');for(let i=0;i<4;i++){const a=40+i*130+r()*30,h=18+r()*14;x.fillStyle='#4e6b3a';x.fillRect(a,232-h,5,h);x.fillRect(a-6,232-h*.7,6,3);x.fillRect(a-6,232-h*.7-6,3,6);x.fillRect(a+5,232-h*.5,6,3);x.fillRect(a+8,232-h*.5-6,3,6);}});
 }else if(name==='frost'){
  sx.globalAlpha=.5;for(let i=0;i<70;i++){sx.fillStyle='#fff';sx.fillRect(r()*VW,r()*120,1,1);}sx.globalAlpha=1;
  for(let b=0;b<3;b++)for(let i=0;i<VW;i+=2){const y=30+b*22+Math.sin(i*.012+b*2)*16+Math.sin(i*.03+b)*7,h=14+Math.sin(i*.05+b)*8;for(let j=0;j<h;j++){if(bayer(i,j)>1-j/h)continue;sx.fillStyle=['#619748','#496073','#515d89'][b];sx.fillRect(i,y+j,2,1);}}
  layer(.15,x=>{for(let i=0;i<16;i++){const a=i*34+r()*12,h=60+r()*90,w=10+r()*14;for(let j=0;j<h;j++){const c=w*(1-j/h);x.fillStyle=j<3?'#6883a1':'#363d47';x.fillRect(a-c,230-j,c*2,1);x.fillStyle='#49525f';x.fillRect(a-c,230-j,c*.7,1);}}x.fillStyle='#363d47';x.fillRect(0,230,LW,40);});
  layer(.42,x=>{ridge(x,226,16,7,'#252b34','#7292b6');});
 }
 if(name==='marsh'){sx.fillStyle='#f6e5a5';sx.beginPath();sx.arc(120,150,30,0,TAU);sx.fill();
  layer(.12,x=>ridge(x,186,18,1.4,'#2d3b29'));
  layer(.28,x=>{ridge(x,206,12,2.6,'#1c2226');for(let i=0;i<8;i++){const a=i*64+r()*30|0,h=120+r()*50|0;x.fillStyle='#14191c';x.fillRect(a,210-h,9,h+70);for(let j=0;j<10;j++)x.fillRect(a-j*1.2,210-j,9+j*2.4,1);for(let k=0;k<7;k++){const w=30-k*2+r()*14,y=210-h-6+k*7;x.fillRect(a-w+4,y,w*2,5);}x.fillStyle='#253120';for(let k=0;k<9;k++){const q=a-22+r()*50|0;x.fillRect(q,210-h+4+r()*20,1,10+r()*20);}}});
  layer(.5,x=>{ridge(x,238,6,3.1,'#0f1215','#2f3e2a');for(let i=0;i<90;i++){const a=r()*LW|0,h=8+r()*20|0;x.fillStyle=i%3?'#1e291b':'#939362';x.fillRect(a,236-h,1,h+8);if(i%7===0){x.fillStyle='#503425';x.fillRect(a-1,236-h-5,3,6);}}});}
 else if(name==='cinder'){layer(.1,x=>{for(let i=0;i<LW;i++){const d=Math.abs(i-256),y=Math.round(70+d*.72+Math.sin(i*.09)*4);x.fillStyle='#160d0f';x.fillRect(i,y,1,270-y);}x.fillStyle='#e89217';x.fillRect(236,62,40,8);x.fillStyle='#b5a64b';x.fillRect(246,58,20,6);for(let j=0;j<6;j++){const a=250+(j-3)*5;x.fillStyle='#b3411f';for(let k=0;k<60;k++)x.fillRect(a+Math.sin(k*.2+j)*(4+k*.34),70+k*2,3,2);}});
  layer(.3,x=>{ridge(x,200,16,4.2,'#0f1015');for(let i=0;i<11;i++){const a=r()*LW|0,h=50+r()*80,w=7+r()*9;for(let j=0;j<h;j++){const c=w*(1-j/h);x.fillStyle=j%9<2?'#1d1315':'#111217';x.fillRect(a-c,204-j,c*2,1);}}});
  layer(.5,x=>{ridge(x,234,10,5.1,'#09090b','#5c2727');for(let i=0;i<18;i++){x.fillStyle='#dd5d16';x.fillRect(r()*LW,232+r()*30,3,1);}});}
 else if(name==='garden'){sx.fillStyle='#9a886d';sx.beginPath();sx.arc(380,50,22,0,TAU);sx.fill();for(let i=0;i<7;i++){sx.fillStyle='#1a1b1c';const a=r()*VW,b=20+r()*70;for(let k=0;k<5;k++)sx.fillRect(a+k*9-r()*4,b-(k%2)*5,16,8);}
  layer(.14,x=>ridge(x,190,14,1.9,'#262625'));
  layer(.3,x=>{ridge(x,214,10,2.8,'#1d1d1c');for(let i=0;i<6;i++){const a=30+i*84+r()*20|0,h=90+r()*60|0,cc=['#5c2a31','#51452d','#2c2d30','#5c382c'][i%4];x.fillStyle='#4e5942';x.fillRect(a,214-h,5,h+40);x.fillStyle=cc;for(let k=0;k<8;k++){if((k*5+i)%3===0)continue;const q=k/8*TAU;for(let d=0;d<18;d++)x.fillRect(a+2+Math.cos(q)*d*1.1-2,214-h+Math.sin(q)*d*1.1-2+d*d*.05,4,4);}x.fillStyle='#2d261b';x.fillRect(a-5,214-h-6,15,13);x.fillStyle='#444f39';for(let d=0;d<26;d++)x.fillRect(a+6+d,214-h*.5-Math.sin(d*.12)*12,2,5);}});
  layer(.5,x=>{ridge(x,240,6,3.3,'#444f39','#8b9659');for(let i=0;i<14;i++){const a=r()*LW|0;shroom(x,a,240,10+r()*12,7+r()*6,'#e3d8b9','#c8422d','#fff');}});}
 else if(name==='halls'){layer(.14,x=>{for(let y=0;y<270;y++)for(let i=0;i<LW;i++){const n=noise(i>>1,y>>1);if(n>.5){x.fillStyle='#201812';x.fillRect(i,y,1,1);}}});
  layer(.32,x=>{for(let i=0;i<4;i++){const a=i*128+20;x.fillStyle='#392d21';x.fillRect(a,30,34,240);x.fillStyle='#48392a';x.fillRect(a,30,6,240);x.fillStyle='#231b15';x.fillRect(a+28,30,6,240);x.fillStyle='#544431';x.fillRect(a-8,24,50,10);x.fillRect(a-8,200,50,8);for(let k=0;k<5;k++){x.fillStyle='#b48d33';for(let q=0;q<7;q++)x.fillRect(a+17-q,50+k*28-6+q,q*2+1,1),x.fillRect(a+17-q,50+k*28+8-q,q*2+1,1);x.fillStyle='#392d21';x.fillRect(a+14,51+k*28-1,7,3);}x.strokeStyle='#392d21';x.lineWidth=7;x.beginPath();x.arc(a+81,70,47,Math.PI,0);x.stroke();x.fillStyle='#7d2b23';x.fillRect(a+66,40,30,70);x.fillStyle='#b48d33';x.fillRect(a+66,40,30,3);x.beginPath();x.moveTo(a+66,110);x.lineTo(a+81,122);x.lineTo(a+96,110);x.fillStyle='#7d2b23';x.fill();x.fillStyle='#eabc2e';x.fillRect(a+71,60,20,5);x.fillRect(a+78,60,6,18);x.fillRect(a+74,78,14,5);x.fillRect(a+70,83,22,3);}});
  layer(.5,x=>{ridge(x,240,3,1.2,'#17120e','#b48d33');});}
 else if(name==='sewers'){layer(.14,x=>{for(let y=0;y<270;y+=10)for(let i=0;i<LW;i+=22){const o=(y/10&1)*11;x.fillStyle=noise(i,y)>.5?'#191c18':'#151713';x.fillRect((i+o)%LW,y,21,9);}});
  layer(.3,x=>{for(let i=0;i<3;i++){const a=i*170+85;x.strokeStyle='#31322d';x.lineWidth=16;x.beginPath();x.arc(a,190,76,Math.PI,0);x.stroke();x.fillStyle='#090a08';x.beginPath();x.arc(a,190,68,Math.PI,0);x.fill();x.fillRect(a-68,190,136,80);for(let k=0;k<70;k+=2){const q=Math.sin(k*.09+i)*3;x.fillStyle='#454e36';x.fillRect(a-3+q,190+k,6,2);x.fillStyle='#636945';x.fillRect(a-1+q,190+k,2,2);}}x.fillStyle='#463c2f';x.fillRect(0,40,LW,14);x.fillStyle='#6b593e';x.fillRect(0,40,LW,3);for(let i=0;i<8;i++)x.fillRect(i*64+6,36,8,22);});
  layer(.52,x=>{for(let i=0;i<4;i++){const a=60+i*128,b=90+(i%2)*50,cr=24;x.fillStyle='#463c2f';for(let k=0;k<12;k++){const q=k/12*TAU;x.fillRect(a+Math.cos(q)*cr-3,b+Math.sin(q)*cr-3,7,7);}x.beginPath();x.arc(a,b,cr-1,0,TAU);x.fill();x.fillStyle='#121410';x.beginPath();x.arc(a,b,9,0,TAU);x.fill();}ridge(x,244,4,2,'#0e100d','#636945');});}
 else if(name==='crypts'){sx.fillStyle='#7c796e';sx.beginPath();sx.arc(240,84,44,0,TAU);sx.fill();sx.fillStyle='#1b1d21';sx.fillRect(238,40,4,88);sx.fillRect(196,82,88,4);
  layer(.2,x=>{x.fillStyle='#151619';x.fillRect(0,0,LW,26);for(let i=0;i<6;i++){const a=i*86;x.fillRect(a,0,16,270);x.beginPath();x.arc(a+51,26,36,0,Math.PI);x.lineTo(a+87,0);x.lineTo(a+16,0);x.fill();}});
  layer(.42,x=>{ridge(x,226,6,2,'#121316','#32353a');for(let i=0;i<11;i++){const a=r()*LW|0,h=20+r()*22|0;x.fillStyle='#202225';x.fillRect(a,226-h,16,h+6);x.beginPath();x.arc(a+8,226-h,8,Math.PI,0);x.fill();x.fillStyle='#404348';x.fillRect(a+7,226-h-1,2,12);x.fillRect(a+4,226-h+3,8,2);if(i%3===0){x.fillStyle='#f0c36b';x.fillRect(a+18,216,3,10);x.fillStyle='#c0ae65';x.fillRect(a+18,213,3,3);}}});}
 else if(name==='caves'){layer(.15,x=>{for(let y=0;y<270;y++)for(let i=0;i<LW;i++){const n=noise(i>>1,y>>1);if(n>.5){x.fillStyle=n>.62?'#1b1d25':'#14171c';x.fillRect(i,y,1,1);}}});
  layer(.3,x=>{for(let i=0;i<7;i++){const a=r()*LW|0,h=70+r()*90,w=26+r()*30;shroom(x,a,240,h,w,'#31353e','#374451','#5483a3');}});
  layer(.5,x=>{ridge(x,240,7,3,'#0d0e12','#475c6c');for(let i=0;i<16;i++){const a=r()*LW|0;shroom(x,a,240,8+r()*16,6+r()*8,'#4b505d',['#494f73','#475c6c','#822b3b'][i%3],'#fff');}for(let i=0;i<40;i++){x.fillStyle='#5483a3';x.fillRect(r()*LW,r()*230,1,1);}});}
 if(!UNDER_DEF[name])skyLore(sx,name);
 return{sky,L};}
// the vortex rising far off and floating islands drifting in every surface sky
const VORTEX_X={bog:70,marsh:390,garden:80,crypts:420};
function skyLore(sx,name){const r=rng(name.length*131+7),vx=VORTEX_X[name]||400,base=168;
 for(let y=0;y<base;y++){const w=3+(base-y)*.075;for(let i=-w|0;i<=w;i++){const t=1-Math.abs(i)/w,band=.6+.4*Math.sin(y*.13+i/w*2.4);if(bayer(vx+i,y)>t*band*.95)continue;sx.fillStyle=t>.72?'#d6b0e6':t>.38?'#9a56ac':'#4e2c5a';sx.fillRect(vx+i,y,1,1);}}
 for(let j=-26;j<8;j++)for(let i=-40;i<=40;i++){const q=1-Math.hypot(i/40,j/26);if(q<=0||bayer(vx+i,base+j)>q*.5)continue;sx.fillStyle='#3a2440';sx.fillRect(vx+i,base+j,1,1);}
 const isl=[];for(let n=0,tries=0;n<6&&tries<60;tries++){const x=20+r()*(VW-40),y=26+r()*92,w=8+r()*20;if(Math.abs(x-vx)<w+16)continue;if(name==='bog'&&Math.hypot(x-340,y-120)<w+34)continue;if(name==='marsh'&&Math.hypot(x-120,y-150)<w+40)continue;if(name==='garden'&&Math.hypot(x-380,y-50)<w+30)continue;if(name==='crypts'&&Math.abs(x-240)<70)continue;if(isl.some(o=>Math.abs(o.x-x)<o.w+w+6&&Math.abs(o.y-y)<20))continue;isl.push({x,y,w});n++;}
 for(const o of isl){const h=o.w*.8+2;for(let j=0;j<h;j++){const hw=o.w/2*Math.pow(1-j/h,.75)+(j%3===1?1:0);sx.fillStyle=j===0?'#3d3644':j<3?'#2e2834':'#231f29';sx.fillRect(Math.round(o.x-hw),Math.round(o.y+j),Math.max(1,Math.round(hw*2)),1);}
  if(o.w>14){sx.fillStyle='#231f29';const tx=Math.round(o.x-o.w/4+r()*o.w/2);sx.fillRect(tx,o.y-5,1,5);sx.fillRect(tx-2,o.y-4,2,1);sx.fillRect(tx+1,o.y-3,2,1);}}}
// an underground version of a surface world: a cave in that world's own rock
const dimHex=(h,f)=>'#'+hex2(h).map(v=>Math.round(v*f).toString(16).padStart(2,'0')).join('');
function buildCave(name){const T=THEME[name],R=T.ramp.map((h,i)=>dimHex(h,i<2?.75:.62)),[sky]=ditherSky(VW,VH,[R[1],R[1],R[2],R[2],R[1]]),L=[],r=rng(name.length*91+3);
 const layer=(f,fn)=>{const[c,x]=mk(LW,270);fn(x);L.push({c,f});};
 layer(.15,x=>{for(let y=0;y<270;y++)for(let i=0;i<LW;i++){const n=noise(i>>1,y>>1);if(n>.58||n<.36){x.fillStyle=n>.58?R[3]:R[0];x.globalAlpha=.55;x.fillRect(i,y,1,1);}}x.globalAlpha=1;});
 layer(.3,x=>{for(let i=0;i<LW;i+=2){const h=10+Math.abs(wave(i,2.4))*28;x.fillStyle=R[2];x.fillRect(i,0,2,h);}for(let k=0;k<14;k++){const a=r()*LW|0,h=20+r()*50|0;for(let j=0;j<h;j++){const w=Math.max(1,(h-j)/5|0);x.fillStyle=j%5?R[2]:R[3];x.fillRect(a-w,j,w*2,1);}}
  if(name==='crypts'){for(let row=0;row<4;row++)for(let i=0;i<LW;i+=26){if(r()<.45)continue;const y=70+row*38+(r()*6|0),a=i+(r()*8|0),w=14+(r()*6|0);x.fillStyle=R[3];x.fillRect(a,y,w+4,13);x.fillStyle='#09090a';x.fillRect(a+2,y+2,w,9);if(r()<.7){const sx=a+2+(r()*(w-6)|0);x.fillStyle='#5e5a50';x.fillRect(sx,y+5,5,4);x.fillStyle='#09090a';x.fillRect(sx+1,y+6,1,1);x.fillRect(sx+3,y+6,1,1);}if(r()<.5){x.fillStyle='#4a463e';x.fillRect(a+3,y+9,w-2,1);}}}
  else if(name==='bog'||name==='marsh'){for(let k=0;k<26;k++){let a=r()*LW|0;const h=20+r()*70|0;for(let j=0;j<h;j++){x.fillStyle='#2a1f18';x.fillRect(a,24+j,1,1);if(j%6===5)a+=r()<.5?1:-1;}}}
  else if(name==='garden'){for(let k=0;k<10;k++){const a=r()*LW|0,h=30+r()*60|0;x.fillStyle='#55534e';x.fillRect(a,20,1,h);for(let j=0;j<12;j++){const w=j<2||j>9?2:4;x.fillStyle=j%3?'#8a8880':'#6e6c66';x.fillRect(a-w/2,20+h+j,w,1);}}}
  else if(T.hot){for(let k=0;k<12;k++){let a=r()*LW|0,b=40+r()*170|0;for(let q=0;q<18;q++){x.fillStyle=q%3?T.cap[0]:T.cap[1];x.fillRect(a,b,2,2);a+=r()<.5?2:-1;b+=2;}}}
  else{for(let k=0;k<16;k++){const a=r()*LW|0,h=12+r()*30|0;for(let j=0;j<h;j++){const w=Math.max(1,(h-j)/4|0);x.fillStyle=j<2?T.cap[0]:T.cap[2];x.fillRect(a-w,j+18,w*2,1);}}}});
 layer(.5,x=>{ridge(x,238,8,3.3,R[0],T.cap[2]);for(let i=0;i<50;i++){x.fillStyle=T.amb;x.globalAlpha=.6;x.fillRect(r()*LW,r()*230,1,1);}x.globalAlpha=1;});
 return{sky,L};}
// a surface version of an underground world: the defended way in, under the open sky
function buildEntrance(name){const T=THEME[name],R=T.ramp,[sky,sx]=ditherSky(VW,VH,['#121318','#1e1f27','#2b2226','#6a3328','#a5552c']),L=[],r=rng(name.length*57+11);skyLore(sx,name);
 const layer=(f,fn)=>{const[c,x]=mk(LW,270);fn(x);L.push({c,f});};
 layer(.12,x=>ridge(x,176,24,1.6,'#221a1d'));
 layer(.28,x=>{ridge(x,150,40,2.2,R[2],R[4]);for(let i=0;i<3;i++){const a=60+i*170,b=212;
   if(name==='halls'){x.fillStyle=R[4];x.fillRect(a-30,b-66,60,66);x.fillStyle=R[5];x.fillRect(a-30,b-66,60,4);x.fillStyle='#070708';x.fillRect(a-14,b-44,28,44);x.fillStyle=T.amb;x.globalAlpha=.5;x.fillRect(a-10,b-36,20,36);x.globalAlpha=1;for(const s of [-26,18]){x.fillStyle=R[3];x.fillRect(a+s,b-58,8,58);}}
   else if(name==='sewers'){x.fillStyle=R[4];x.beginPath();x.arc(a,b-20,26,0,TAU);x.fill();x.fillStyle='#070708';x.beginPath();x.arc(a,b-20,19,0,TAU);x.fill();x.fillStyle=T.haz[1];x.fillRect(a-4,b-4,8,20);}
   else{x.fillStyle='#070708';x.beginPath();x.arc(a,b,24,Math.PI,0);x.fill();x.fillRect(a-24,b,48,20);x.fillStyle=T.amb;x.globalAlpha=.35;x.beginPath();x.arc(a,b+6,16,Math.PI,0);x.fill();x.globalAlpha=1;if(name==='mine'){x.fillStyle='#3c2f26';x.fillRect(a-27,b-26,6,40);x.fillRect(a+21,b-26,6,40);x.fillRect(a-30,b-30,60,6);}}}});
 layer(.5,x=>{ridge(x,236,8,4.4,'#141216','#2b2226');for(let i=0;i<LW;i+=5){if((i*7)%23<9)continue;const h=6+(i*13)%7;x.fillStyle='#1d1a1e';x.fillRect(i,236-h,2,h);x.fillRect(i,236-h-1,1,1);}for(let k=0;k<3;k++){const a=40+k*170+r()*40|0;x.fillStyle='#1d1a1e';x.fillRect(a,206,1,30);x.fillStyle='#8e897a';x.fillRect(a-2,202,5,4);x.fillStyle='#070708';x.fillRect(a-1,203,1,1);x.fillRect(a+1,203,1,1);}});
 return{sky,L};}
const BACKDROP={};function backdrop(n,under){const u=isUnder(n,under),nat=!!UNDER_DEF[n],key=n+(u?'_u':'_s');return BACKDROP[key]||(BACKDROP[key]=u===nat?buildBackdrop(n):u?buildCave(n):buildEntrance(n));}
function drawBackdrop(C,b,vx,vw,camX,camY,maxY){C.drawImage(b.sky,0,0,vw,VIEWH,vx,0,vw,VIEWH);
 for(const l of b.L){const off=((camX*l.f)%LW+LW)%LW,oy=Math.round(-camY*l.f*.5+(maxY*l.f*.25));let dx=-Math.round(off);while(dx<vw){C.drawImage(l.c,vx+dx,oy-10);dx+=LW;}}}
