// ---------- race homes: each race's own exit building. Same 52x46 canvas and door spot as the goblin hut ----------
const HOME_DOOR=(x,glow,core,frame)=>{const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};P('#2a1208',19,28,14,18);P('#2a1208',20,26,12,2);P(glow,21,30,10,16);P(core,23,34,6,12);if(frame){P(frame,18,28,1,18);P(frame,33,28,1,18);}};
const HOME_FLAG=(x,cl,pole,top)=>{x.fillStyle=pole;x.fillRect(42,0,2,top||24);x.fillStyle=cl.hood;x.fillRect(44,1,8,4);x.fillRect(44,5,6,3);x.fillStyle=cl.hoodD;x.fillRect(44,7,5,1);};
const RACE_HOME={
 // a mud mound shaped like a squatting frog, with reeds either side
 swamp(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#7a8a3a');
  for(const s of [3,47]){P('#5a7a34',s,16,1,30);P('#6a4426',s-1,10,3,8);P('#8a5c34',s-1,10,1,7);}
  const m=[[74,104,58],[100,132,68],[52,78,46]],mud=[[92,70,44],[116,90,56],[70,52,36]];
  for(let y=18;y<46;y++)for(let i=4;i<48;i++){const dx=(i-26)/22,dy=(y-46)/28;if(dx*dx+dy*dy>1)continue;const n=noise(i*5,y*5+cl.seed*40),p=(y+n*8>40?mud:m);x.fillStyle=css(p[n>.58?1:n<.42?2:0]);x.fillRect(i,y,1,1);}
  P('#3a5a30',9,27,34,1);P('#2c4426',12,28,28,1);
  for(const e of [14,38]){for(let y=-6;y<=6;y++)for(let i=-6;i<=6;i++)if(i*i+y*y<=34){x.fillStyle=y<-2?'#9ac45a':'#7aa848';x.fillRect(e+i,19+y,1,1);}for(let y=-4;y<=4;y++)for(let i=-4;i<=4;i++)if(i*i+y*y<=15){x.fillStyle='#f4e888';x.fillRect(e+i,19+y,1,1);}P('#120a18',e-1,16,2,7);P('#fff8d0',e-3,15,2,2);}
  HOME_DOOR(x,'#d8c060','#fff0a0','#3a5a30');},
 // a small basalt volcano with a horned face and lava in its cracks
 imp(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#3a2a2a',34);
  const m=[[56,42,50],[78,56,60],[38,30,40]],hw=y=>6+(y-8)*.52;
  for(let y=8;y<46;y++){const w=hw(y);for(let i=0;i<52;i++){if(Math.abs(i-26)>w)continue;const n=noise(i*6,y*6+cl.seed*30);x.fillStyle=css(m[n>.58?1:n<.42?2:0]);x.fillRect(i,y,1,1);}}
  P('#ffb040',21,6,10,3);P('#ffe28a',23,6,6,1);P('#e8482e',20,9,12,2);P('#8a8088',24,1,3,3);P('#6a6068',28,3,2,2);P('#8a8088',21,3,2,2);
  const crack=[[12,44,3,-3],[39,44,-2,-3],[22,12,-2,3],[31,12,2,3]];
  for(const c of crack){let a=c[0],b=c[1];for(let k=0;k<7;k++){x.fillStyle=k%2?'#ff7a2a':'#ffb040';x.fillRect(a,b,1,3);a+=k%2?c[2]>0?1:-1:0;b+=c[3];}}
  for(const s of [-1,1]){P('#2a2028',26+s*8-1,16,4,3);P('#b8a888',26+s*10-1,13,3,3);P('#d8c8a8',26+s*12-1,10,3,3);P('#f4ecd8',26+s*14-1,7,2,3);P('#fff8e8',26+s*15-1,5,2,2);}
  P('#ffd020',19,19,5,2);P('#ffd020',29,19,5,2);P('#120a18',21,19,1,2);P('#120a18',31,19,1,2);P('#120a18',20,18,5,1);P('#120a18',28,18,5,1);
  HOME_DOOR(x,'#ff6a20','#ffd24a','#7a2a14');},
 // a giant flower bud with a little round door
 fairy(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#6a9a44');
  for(let y=4;y<40;y++)for(let i=5;i<47;i++){const dx=(i-26)/21,dy=(y-27)/23;if(dx*dx+dy*dy>1)continue;const p=(i-5)%14,top=4+Math.abs(p-6.5)*1.5;if(y<top)continue;x.fillStyle=p<1?'#b0487c':p<4?'#e070a8':p<9?'#f498c4':'#ffc0dc';x.fillRect(i,y,1,1);}
  for(let y=34;y<46;y++){const w=8+(y-34)*1.5|0;P(y%3?'#4a8a3c':'#3a7030',26-w-6,y,w,1);P(y%3?'#5a9a44':'#3a7030',32,y,w,1);}
  for(let y=36;y<46;y++){P('#4a8a3c',14,y,24,1);}
  P('#f4d060',18,27,16,1);P('#c89a3c',17,28,1,18);P('#c89a3c',34,28,1,18);
  HOME_DOOR(x,'#ffd88a','#fff8d0','#c89a3c');
  P('#fff',8,18,1,1);P('#fff',40,12,1,1);P('#ffe88a',14,9,1,1);P('#ffe88a',35,24,1,1);P('#fff',22,16,1,1);},
 // a square stone keep with a rune lintel and a gold hammer
 dwarf(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#4a4a52',14);
  for(let k=0;k<5;k++){P('#7a7e8c',5+k*9,9,6,6);P('#a0a4b0',5+k*9,9,6,1);}
  for(let y=14;y<46;y++)for(let i=5;i<47;i++){const row=(y-14)/5|0,off=row%2?5:0,edge=(y-14)%5===4||(i+off)%10===0,n=noise(((i+off)/10|0)*9,row*9+cl.seed*20);x.fillStyle=edge?'#4a4c58':n>.55?'#8a8e9c':n<.42?'#6a6e7c':'#7a7e8c';x.fillRect(i,y,1,1);}
  P('#c89a3c',15,23,22,4);P('#7a5a24',15,26,22,1);P('#fff0a0',15,23,22,1);for(let k=0;k<6;k++)P('#5a3a14',17+k*3+(k>2?1:0),24,1,2);
  P('#ffe088',23,15,6,3);P('#c89a3c',23,17,6,1);P('#a57c2e',25,18,2,5);
  HOME_DOOR(x,'#ff9a30','#ffd86a','#3a3a44');
  for(let k=0;k<3;k++){P('#3a3a44',19,31+k*5,14,1);P('#8a8e9c',19,31+k*5,1,1);P('#8a8e9c',32,31+k*5,1,1);}},
 // a riveted boiler with a big brass gear and a tin chimney
 rat(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#5a4a3a');
  P('#5a5048',11,6,5,12);P('#8a7a64',11,6,1,12);P('#7a6e60',10,4,7,2);P('#9a948a',12,1,3,2);P('#7a746a',15,0,2,2);
  const ramp=[[74,44,30],[116,70,42],[158,96,54],[192,124,70],[158,96,54],[116,70,42],[84,50,34]];
  for(let y=17;y<46;y++)for(let i=7;i<45;i++){const n=noise(i*7,y*7+cl.seed*30),t=(i-7)/38*6.99|0;const c=ramp[t];x.fillStyle=css(n>.68?[c[0]*.72,c[1]*.82,c[2]*.72]:c);x.fillRect(i,y,1,1);}
  for(const r of [17,27,37]){P('#4a2c1c',7,r,38,2);P('#c89a6a',7,r,38,1);for(let k=0;k<7;k++){P('#f0d8a8',9+k*6,r,1,1);}}
  for(let y=-11;y<=11;y++)for(let i=-11;i<=11;i++){const d=Math.hypot(i,y),a=Math.atan2(y,i),t=Math.cos(a*8)>.2;if(d>(t?10.5:8.4))continue;x.fillStyle=d<3?'#5a3a14':d<4.5?'#f0d060':(i-y>4?'#8a6a24':'#c89a3c');x.fillRect(26+i,12+y,1,1);}
  P('#ffd850',35,20,8,1);P('#ffd850',37,19,6,1);P('#ffd850',35,21,8,4);P('#c89a3c',38,22,2,1);P('#c89a3c',36,23,1,1);P('#c89a3c',41,23,1,1);
  P('#55606e',17,26,18,20);P('#98a4b4',17,26,18,1);P('#98a4b4',17,26,1,20);P('#3a4250',34,26,1,20);
  HOME_DOOR(x,'#ffc04a','#fff0a0','#2a3038');
  for(const r of [29,36,43]){P('#d8e0ec',17,r,1,1);P('#d8e0ec',34,r,1,1);}},
 // a little stone crypt with a skull on the gable and a rib arch
 bone(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#3a3a46',16);
  const s=[[86,90,104],[108,112,126],[66,70,84]];
  for(let y=18;y<43;y++)for(let i=8;i<44;i++){const n=noise(i*6,y*6+cl.seed*20);x.fillStyle=css(s[n>.58?1:n<.42?2:0]);x.fillRect(i,y,1,1);}
  for(let y=4;y<18;y++){const hw=(y-4)*1.85+1|0;for(let i=26-hw;i<26+hw;i++){const n=noise(i*5,y*7);x.fillStyle=y===17?'#4a4c5c':css(s[n>.55?1:n<.42?2:0]);x.fillRect(i,y,1,1);}}
  P('#b8bcc8',3,17,46,2);P('#4a4c5c',3,19,46,1);
  for(const p of [9,37]){P('#b0b4c0',p,20,6,23);P('#d0d4dc',p,20,2,23);P('#6a6e80',p+5,20,1,23);P('#d0d4dc',p-1,20,8,1);}
  P('#4a5a3c',8,42,4,1);P('#5a7a44',38,40,3,1);
  P('#7a7e92',5,43,42,1);P('#a0a4b4',3,44,46,2);
  P('#ece4c8',22,8,8,6);P('#ece4c8',23,14,6,2);P('#120a18',23,10,2,2);P('#120a18',27,10,2,2);P('#120a18',26,12,1,1);for(let k=0;k<3;k++)P('#120a18',24+k*2,15,1,1);
  HOME_DOOR(x,'#3ad88a','#b8ffd8');
  for(let k=0;k<4;k++){P('#ece4c8',16,28+k*5,3,2);P('#ece4c8',33,28+k*5,3,2);}P('#ece4c8',18,25,16,2);P('#c8c0a8',18,26,16,1);},
 // a giant toadstool in the clan's own colour with a door in the stalk
 shroom(x,cl){const P=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
  HOME_FLAG(x,cl,'#8a7a6a',12);
  for(let y=24;y<46;y++){const w=11+(y-24)*.18|0;for(let i=26-w;i<26+w;i++){const t=(i-26+w)/(2*w),n=noise(i*4,y*9);x.fillStyle=t<.15?'#b8a888':t>.82?'#a89878':n>.6?'#f4ecd8':'#e4d8bc';x.fillRect(i,y,1,1);}}
  for(let y=4;y<26;y++)for(let i=0;i<52;i++){const dx=(i-26)/26,dy=(y-26)/22;if(dx*dx+dy*dy>1)continue;x.fillStyle=y>22?cl.hoodD:(dy<-.75&&dx<.1?'#ffffff40':cl.hood);x.fillRect(i,y,1,1);}
  for(let y=23;y<26;y++)for(let i=2;i<50;i++){const dx=(i-26)/26,dy=(y-26)/22;if(dx*dx+dy*dy>1)continue;x.fillStyle=cl.hoodD;x.fillRect(i,y,1,1);}
  P('#6a5a4a',8,26,36,1);for(let i=9;i<43;i+=3)P('#8a7a68',i,26,1,2);
  for(const s of [[14,13,4],[27,9,5],[39,15,4],[23,18,3],[7,20,2],[45,21,2]]){for(let y=-s[2];y<=s[2];y++)for(let i=-s[2];i<=s[2];i++)if(i*i+y*y<=s[2]*s[2]+1){x.fillStyle='#fff4e0';x.fillRect(s[0]+i,s[1]+y,1,1);}}
  HOME_DOOR(x,'#6ae0d0','#d8fff4','#8a7a60');}
};
function raceHome(cl,race){const f=RACE_HOME[race];if(!f)return hut(cl);const[c,x]=mk(52,46);f(x,cl);outline(c,'#120a18');return c;}
