// ---------- race homes: each race's own exit building. Same 52x46 canvas and door spot as the goblin hut ----------
const HOME_DOOR=(x,glow,core,frame)=>{const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};P('#1f0f09',19,28,14,18);P('#1f0f09',20,26,12,2);P(glow,21,30,10,16);P(core,23,34,6,12);if(frame){P(frame,18,28,1,18);P(frame,33,28,1,18);}};
const HOME_FLAG=(x,cl,pole,top)=>{x.fillStyle=pole;x.fillRect(42,0,2,top||24);x.fillStyle=cl.hood;x.fillRect(44,1,8,4);x.fillRect(44,5,6,3);x.fillStyle=cl.hoodD;x.fillRect(44,7,5,1);};
const RACE_HOME={
 // a lodge of mud, rotting reeds and woven branches heaped on half-sunk logs, sticks poking out and moss sagging off it, with a lashed lookout perch on the flag pole
 swamp(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#4e4e37');P('#3e3424',36,17,12,2);P('#5a4a30',36,17,12,1);P('#2a2418',38,19,1,4);P('#2a2418',45,19,1,3);
  const top=i=>{const dx=(i-25)/22;return dx*dx>=1?99:46-23*Math.sqrt(1-dx*dx)+noise(i*9,cl.seed*50)*4-2+(i>14&&i<20?-2:0);};
  // sticks poking out of the top of the heap
  for(const [a,b,e,g] of [[12,26,7,10],[21,22,19,4],[29,22,33,6],[36,26,41,12],[17,24,13,9]]){const st=Math.max(Math.abs(e-a),Math.abs(g-b));for(let k=0;k<=st;k++)P(k%3?'#3a2e1e':'#54442c',Math.round(a+(e-a)*k/st),Math.round(b+(g-b)*k/st),1,1);}
  for(let i=3;i<48;i++){const t=top(i)|0;for(let y=Math.max(t,6);y<46;y++){const n=noise(i*5,y*5+cl.seed*40),w=((i+y*2)%7===0)||((i*2-y)%9===0),moss=y<t+3+((i*7)%3)&&n>.45;
   x.fillStyle=moss?(n>.6?'#6a7a42':'#4f5e34'):w?'#2a2016':y>38?(n>.55?'#4a3a26':'#3a2c1c'):(n>.62?'#7a6a40':n<.4?'#4e4228':'#5e5034');x.fillRect(i,y,1,1);}
   if((i*13)%11===0)P('#4f5e34',i,t+3,1,2+(i%3));}
  // half-sunk logs along the foot
  for(const [a,b,w] of [[1,41,18],[33,42,18]]){P('#3e2c1e',a,b,w,4);P('#5a4430',a,b,w,1);P('#2a1e14',a,b+3,w,1);P('#6e5638',a,b,2,4);P('#8a7050',a,b+1,1,2);}
  HOME_DOOR(x,'#8a8a3a','#a8a85a','#2a2016');},
 // an ancestor hall: a lumpy stack of swelling tiers of brick fired with the ashes of the dead, each tier sagging under a drooping eave, buttressed at the foot, on cracked lava rock
 imp(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#2d2323',30);
  const bricks=['#2e2b2d','#3c3639','#4a4448','#55392e','#6a625c'],mort='#161314',N=(a,b)=>noise(a*7,b*7+cl.seed*20);
  // tiers from the foot up: [top, bottom, half-width at the swell, lean]
  const tiers=[[29,43,21,0],[17,30,15,1],[7,18,9,-1]];
  for(const [t0,t1,w,ln] of tiers){for(let y=t0;y<t1;y++){const u=(y-t0)/(t1-t0),hw=w*(.78+.22*Math.sin(u*Math.PI))+N(y,w)*3.2-(y%5===0?1:0),cxx=26+ln*u*2;
    for(let i=0;i<52;i++){const d=i-cxx;if(Math.abs(d)>hw)continue;const sag=Math.round((d*d)/(hw*hw)*2),row=((y+sag-t0)/3)|0,off=row%2?3:0;let col;
     if((y+sag-t0)%3===2||((i+off)%6===0))col=mort;else{const n=noise(((i+off)/6|0)*31+row*17+t0,cl.seed*7);col=bricks[Math.min(4,n*5|0)];if(n>.92)col='#6e3820';}
     x.fillStyle=Math.abs(d)>hw-1.2?'#1e1b1d':col;x.fillRect(i,y,1,1);}}
   // a drooping eave of dark slate over the top of the tier, its ends sagging past the walls
   const ew=w+4;for(let i=-ew;i<=ew;i++){const dr=Math.round((i*i)/(ew*ew)*4),yy=t0-1+dr;P(i%3?'#2a2220':'#3e302c',26+i,yy,1,2);P('#1c1617',26+i,yy+2,1,1);}}
  // buttress lumps at the foot
  for(const [a,w] of [[3,7],[42,7]]){for(let y=34;y<44;y++){const hw=w*(y-33)/10;for(let i=0;i<52;i++)if(Math.abs(i-a-w/2)<hw){x.fillStyle=N(i,y)>.55?'#3c3639':'#2e2b2d';x.fillRect(i,y,1,1);}}}
  // a few bricks still warm, and slit windows glowing with ember light
  for(const [a,b] of [[11,34],[38,37],[16,22],[33,24],[24,12]]){P('#a8481a',a,b,2,1);P('#ff8a20',a,b,1,1);}
  for(const [a,b] of [[18,20],[31,20]]){P('#090a0c',a,b,3,5);P('#c2561a',a+1,b+1,1,3);P('#ffb43a',a+1,b+2,1,1);}
  // a crooked chimney with a spark at the top
  P('#2e2b2d',30,3,5,6);P('#4a4448',31,4,1,5);P('#2e2b2d',29,5,1,3);P('#ff8a20',31,3,3,1);P('#ffd9a0',32,3,1,1);
  // cracked lava rock underfoot
  for(let i=0;i<52;i++){const t=42+(noise(i*7,cl.seed*3)*3|0);for(let y=t;y<46;y++){x.fillStyle=noise(i*9,y*9)>.55?'#2a2426':'#1e1a1c';x.fillRect(i,y,1,1);}}
  for(const [a,b,dd] of [[4,43,1],[46,43,-1],[13,44,1],[40,44,-1]]){let q=a;for(let k=0;k<4;k++){P(k%2?'#d85f15':'#e89217',q,b+(k%2),1,1);q+=dd;}}
  HOME_DOOR(x,'#d15315','#e9b61e','#3a2a2a');},
 // a hollow dead tree, its knothole the door, with silk cocoons and a roosting moth
 fairy(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#3a3432',20);
  const bark=['#4a4240','#5e5652','#3a3432'];
  for(let y=10;y<46;y++){const hw=8+Math.max(0,y-30)*.9+(y<16?-1:0);for(let i=Math.round(26-hw);i<Math.round(26+hw);i++){const g=(i*5+((y*3)>>2))%7;x.fillStyle=g===0?bark[2]:noise(i*7,y*3+cl.seed*20)>.6?bark[1]:bark[0];x.fillRect(i,y,1,1);}}
  for(const[a,b,d]of [[20,12,-1],[31,11,1],[24,10,-1]]){let px=a,py=b;for(let k=0;k<12;k++){P('#3a3432',px,py,2,2);px+=d;py-=k%2;if(k===6){P('#3a3432',px,py-3,1,3);}}}
  for(let k=0;k<5;k++){P('#3a3432',10-k*1.5|0,44-k,3,1);P('#3a3432',40+k*1.5|0,44-k,3,1);}
  for(const[a,b,h]of [[13,6,10],[33,4,8]]){P('#8a8880',a+2,b,1,3);for(let j=0;j<h;j++){const w=Math.round(3*Math.sin((j+1)/(h+1)*Math.PI))+1;P(j%3?'#9a978e':'#7e7b74',a+2-(w>>1),b+3+j,w,1);}}
  P('#8a8880',33,19,5,3);P('#6e6c66',34,22,3,2);P('#8a8880',40,19,5,3);P('#6e6c66',40,22,3,2);P('#2a2226',38,18,2,6);P('#b8c8d8',38,18,1,1);
  P('#1a1618',20,27,12,2);
  HOME_DOOR(x,'#5a7a98','#a8c4dc','#2a2226');},
 // a square stone keep with a rune lintel and a gold hammer
 dwarf(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#303031',14);
  for(let k=0;k<5;k++){P('#4f5153',5+k*9,9,6,6);P('#65676b',5+k*9,9,6,1);}
  for(let y=14;y<46;y++)for(let i=5;i<47;i++){const row=(y-14)/5|0,off=row%2?5:0,edge=(y-14)%5===4||(i+off)%10===0,n=noise(((i+off)/10|0)*9,row*9+cl.seed*20);x.fillStyle=edge?'#313234':n>.55?'#595a5e':n<.42?'#464749':'#4f5153';x.fillRect(i,y,1,1);}
  P('#987838',15,23,22,4);P('#5b4623',15,26,22,1);P('#bdac5d',15,23,22,1);for(let k=0;k<6;k++)P('#432e15',17+k*3+(k>2?1:0),24,1,2);
  P('#f1d176',23,15,6,3);P('#987838',23,17,6,1);P('#7b612d',25,18,2,5);
  HOME_DOOR(x,'#dd7c16','#ebbc36','#262728');
  for(let k=0;k<3;k++){P('#262728',19,31+k*5,14,1);P('#595a5e',19,31+k*5,1,1);P('#595a5e',32,31+k*5,1,1);}},
 // a warren mouth dug into a heap of rubble, rusted scrap and bones, framed by two rib bones lashed with sinew, with a hide bellows worked by bone handles
 rat(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#463b31');
  const top=i=>{const dx=(i-25)/24;return dx*dx>=1?99:46-26*Math.sqrt(1-dx*dx)*(.85+noise(i*6,cl.seed*30)*.3);};
  // scrap and bone spikes jutting from the heap
  for(const [a,b,e,g,col] of [[10,28,6,16,'#6e3e24'],[19,22,17,10,'#d8d0b8'],[30,21,34,8,'#7a7068'],[38,28,42,18,'#d8d0b8'],[25,20,25,12,'#8a5232']]){const st=Math.max(Math.abs(e-a),Math.abs(g-b));for(let k=0;k<=st;k++)P(col,Math.round(a+(e-a)*k/st),Math.round(b+(g-b)*k/st),k<st-1?2:1,1);}
  for(let i=1;i<50;i++){const t=top(i)|0;for(let y=Math.max(t,4);y<46;y++){const n=noise(i*5,y*5+cl.seed*40),m=noise(i*2,y*2+90);
   x.fillStyle=m>.72?(n>.5?'#8a5232':'#6e3e24'):m<.22?(n>.5?'#6a625c':'#5e5650'):n>.6?'#4e4234':n<.38?'#3a3026':'#463a2e';x.fillRect(i,y,1,1);}}
  // bones scattered in the heap
  for(const [a,b,h] of [[8,34,1],[40,36,0],[14,41,0],[34,26,1]]){if(h){P('#d8d0b8',a,b,1,5);P('#d8d0b8',a-1,b,3,1);P('#d8d0b8',a-1,b+4,3,1);}else{P('#d8d0b8',a,b,5,1);P('#d8d0b8',a,b-1,1,3);P('#d8d0b8',a+4,b-1,1,3);}}
  // a hide bellows on the left, squeezed by bone handles
  P('#5a3e2a',3,30,9,8);P('#7a5a40',4,31,7,6);P('#5a3e2a',4,33,7,1);P('#d8d0b8',1,29,4,1);P('#d8d0b8',1,38,4,1);P('#a87c74',11,33,3,2);
  // the warren mouth, framed by two ribs lashed together with sinew at the top
  HOME_DOOR(x,'#c89a3a','#e0c070','#1d1612');
  for(let k=0;k<20;k++){const u=k/19,dx=Math.round(Math.sin(u*Math.PI*.5)*3);P('#d8d0b8',17+dx,45-k,2,1);P('#d8d0b8',33-dx,45-k,2,1);}
  P('#d8d0b8',19,24,14,2);P('#a89c80',19,25,14,1);P('#a87c74',24,23,4,4);P('#6e4a44',25,24,2,2);},
 // a hut framed in bone: rib arches for a roof, rag panels, and a skull over the door
 bone(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#8e8878',16);
  for(let y=20;y<45;y++)for(let i=11;i<42;i++){const n=noise(i*5,y*5+cl.seed*20);x.fillStyle=n>.6?'#2e2a2c':n<.4?'#1d1a1e':'#262225';x.fillRect(i,y,1,1);}
  for(let k=0;k<6;k++){const a=10+k*6;P('#b8b09a',a,20,2,25);P('#8e8878',a+1,20,1,25);for(let j=0;j<4;j++)P('#8e8878',a,24+j*6,2,1);}
  for(let r=0;r<4;r++){const rad=18-r*3;for(let t=0;t<=40;t++){const q=Math.PI*t/40,px=Math.round(26-Math.cos(q)*rad),py=Math.round(21-Math.sin(q)*rad*.75);P(r%2?'#9a9484':'#c8c0a4',px,py,2,2);}}
  P('#c8c0a4',8,19,37,2);P('#8e8878',8,21,37,1);
  for(let i=8;i<45;i+=4){P('#c8c0a4',i,17,3,2);}
  P('#c8c0a4',22,7,9,7);P('#b8b09a',23,14,7,2);P('#090a0c',23,9,2,3);P('#090a0c',28,9,2,3);P('#e8321c',23,10,1,1);P('#e8321c',28,10,1,1);P('#090a0c',26,12,1,2);for(let k=0;k<3;k++)P('#090a0c',24+k*2,15,1,1);
  P('#9a9484',3,43,46,1);P('#b8b09a',3,44,46,2);
  HOME_DOOR(x,'#5a2420','#a8402c','#8e8878');},
 // a giant toadstool in the clan's own colour with a door in the stalk
 shroom(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#6c6257',12);
  for(let y=24;y<46;y++){const w=11+(y-24)*.18|0;for(let i=26-w;i<26+w;i++){const t=(i-26+w)/(2*w),n=noise(i*4,y*9);x.fillStyle=t<.15?'#9a8966':t>.82?'#887a5f':n>.6?'#e8dcc0':'#d6c8a9';x.fillRect(i,y,1,1);}}
  for(let y=4;y<26;y++)for(let i=0;i<52;i++){const dx=(i-26)/26,dy=(y-26)/22;if(dx*dx+dy*dy>1)continue;x.fillStyle=y>22?cl.hoodD:(dy<-.75&&dx<.1?'#ffffff40':cl.hood);x.fillRect(i,y,1,1);}
  for(let y=23;y<26;y++)for(let i=2;i<50;i++){const dx=(i-26)/26,dy=(y-26)/22;if(dx*dx+dy*dy>1)continue;x.fillStyle=cl.hoodD;x.fillRect(i,y,1,1);}
  P('#52483e',8,26,36,1);for(let i=9;i<43;i+=3)P('#6c6156',i,26,1,2);
  for(const s of [[14,13,4],[27,9,5],[39,15,4],[23,18,3],[7,20,2],[45,21,2]]){for(let y=-s[2];y<=s[2];y++)for(let i=-s[2];i<=s[2];i++)if(i*i+y*y<=s[2]*s[2]+1){x.fillStyle='#f9e5c0';x.fillRect(s[0]+i,s[1]+y,1,1);}}
  HOME_DOOR(x,'#516a7c','#8cc878','#6b6150');}
};
function raceHome(cl,race){const f=RACE_HOME[race];if(!f)return hut(cl);const[c,x]=mk(52,46);f(x,cl);outline(c,'#090a0c');return c;}
