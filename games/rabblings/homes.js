// ---------- race homes: each race's own exit building. Same 52x46 canvas and door spot as the goblin hut ----------
const HOME_DOOR=(x,glow,core,frame)=>{const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};P('#1f0f09',19,28,14,18);P('#1f0f09',20,26,12,2);P(glow,21,30,10,16);P(core,23,34,6,12);if(frame){P(frame,18,28,1,18);P(frame,33,28,1,18);}};
const HOME_FLAG=(x,cl,pole,top)=>{x.fillStyle=pole;x.fillRect(42,0,2,top||24);x.fillStyle=cl.hood;x.fillRect(44,1,8,4);x.fillRect(44,5,6,3);x.fillStyle=cl.hoodD;x.fillRect(44,7,5,1);};
const RACE_HOME={
 // a mud mound shaped like a squatting frog, with reeds either side
 swamp(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#4e4e37');
  for(const s of [3,47]){P('#434531',s,16,1,30);P('#503723',s-1,10,3,8);P('#684a30',s-1,10,1,7);}
  const m=[[74,104,58],[100,132,68],[52,78,46]],mud=[[92,70,44],[116,90,56],[70,52,36]];
  for(let y=18;y<46;y++)for(let i=4;i<48;i++){const dx=(i-26)/22,dy=(y-46)/28;if(dx*dx+dy*dy>1)continue;const n=noise(i*5,y*5+cl.seed*40),p=(y+n*8>40?mud:m);x.fillStyle=css(p[n>.58?1:n<.42?2:0]);x.fillRect(i,y,1,1);}
  P('#323529',9,27,34,1);P('#262820',12,28,28,1);
  for(const e of [14,38]){for(let y=-6;y<=6;y++)for(let i=-6;i<=6;i++)if(i*i+y*y<=34){x.fillStyle=y<-2?'#71754e':'#5b5f44';x.fillRect(e+i,19+y,1,1);}for(let y=-4;y<=4;y++)for(let i=-4;i<=4;i++)if(i*i+y*y<=15){x.fillStyle='#ad9f55';x.fillRect(e+i,19+y,1,1);}P('#090a0c',e-1,16,2,7);P('#c6b874',e-3,15,2,2);}
  HOME_DOOR(x,'#bba23f','#bdac5d','#323529');},
 // a small basalt volcano with a horned face and lava in its cracks
 imp(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#2d2323',34);
  const m=[[56,42,50],[78,56,60],[38,30,40]],hw=y=>6+(y-8)*.52;
  for(let y=8;y<46;y++){const w=hw(y);for(let i=0;i<52;i++){if(Math.abs(i-26)>w)continue;const n=noise(i*6,y*6+cl.seed*30);x.fillStyle=css(m[n>.58?1:n<.42?2:0]);x.fillRect(i,y,1,1);}}
  P('#e89217',21,6,10,3);P('#f2d378',23,6,6,1);P('#b83b26',20,9,12,2);P('#3e3c3c',24,1,3,3);P('#302d2e',28,3,2,2);P('#3e3c3c',21,3,2,2);
  const crack=[[12,44,3,-3],[39,44,-2,-3],[22,12,-2,3],[31,12,2,3]];
  for(const c of crack){let a=c[0],b=c[1];for(let k=0;k<7;k++){x.fillStyle=k%2?'#d85f15':'#e89217';x.fillRect(a,b,1,3);a+=k%2?c[2]>0?1:-1:0;b+=c[3];}}
  for(const s of [-1,1]){P('#121010',26+s*8-1,16,4,3);P('#9a8966',26+s*10-1,13,3,3);P('#c9b998',26+s*12-1,10,3,3);P('#e8dcc0',26+s*14-1,7,2,3);P('#f9eac7',26+s*15-1,5,2,2);}
  P('#d1a915',19,19,5,2);P('#d1a915',29,19,5,2);P('#090a0c',21,19,1,2);P('#090a0c',31,19,1,2);P('#090a0c',20,18,5,1);P('#090a0c',28,18,5,1);
  HOME_DOOR(x,'#d15315','#e9b61e','#5a2617');},
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
 // a riveted boiler with a big brass gear and a tin chimney
 rat(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#463b31');
  P('#47403b',11,6,5,12);P('#6c6153',11,6,1,12);P('#60584f',10,4,7,2);P('#7c776e',12,1,3,2);P('#605d56',15,0,2,2);
  const ramp=[[74,44,30],[116,70,42],[158,96,54],[192,124,70],[158,96,54],[116,70,42],[84,50,34]];
  for(let y=17;y<46;y++)for(let i=7;i<45;i++){const n=noise(i*7,y*7+cl.seed*30),t=(i-7)/38*6.99|0;const c=ramp[t];x.fillStyle=css(n>.68?[c[0]*.72,c[1]*.82,c[2]*.72]:c);x.fillRect(i,y,1,1);}
  for(const r of [17,27,37]){P('#38241a',7,r,38,2);P('#a97b4c',7,r,38,1);for(let k=0;k<7;k++){P('#e3c995',9+k*6,r,1,1);}}
  for(let y=-11;y<=11;y++)for(let i=-11;i<=11;i++){const d=Math.hypot(i,y),a=Math.atan2(y,i),t=Math.cos(a*8)>.2;if(d>(t?10.5:8.4))continue;x.fillStyle=d<3?'#432e15':d<4.5?'#d8b435':(i-y>4?'#675224':'#987838');x.fillRect(26+i,12+y,1,1);}
  P('#e9bd23',35,20,8,1);P('#e9bd23',37,19,6,1);P('#e9bd23',35,21,8,4);P('#987838',38,22,2,1);P('#987838',36,23,1,1);P('#987838',41,23,1,1);
  P('#3a3c3f',17,26,18,20);P('#62666c',17,26,18,1);P('#62666c',17,26,1,20);P('#292a2d',34,26,1,20);
  HOME_DOOR(x,'#e9a21e','#bdac5d','#1d1e20');
  for(const r of [29,36,43]){P('#7f8a99',17,r,1,1);P('#7f8a99',34,r,1,1);}},
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
