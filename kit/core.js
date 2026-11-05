'use strict';
// ---------- screen ----------
const VW=480,VH=270,HUDH=46,VIEWH=VH-HUDH,TPS=25,TAU=Math.PI*2;
const cv=document.getElementById('game'),ctx=cv.getContext('2d',{alpha:false});
ctx.imageSmoothingEnabled=false;
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=false;return [c,x];}
const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t;
function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rgb32=(r,g,b)=>(0xff000000|(clamp(b|0,0,255)<<16)|(clamp(g|0,0,255)<<8)|clamp(r|0,0,255))>>>0;
const mul32=(c,f)=>rgb32((c&255)*f,((c>>8)&255)*f,((c>>16)&255)*f);
const css=a=>`rgb(${a[0]|0},${a[1]|0},${a[2]|0})`;
function hex2(h){const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];}

// tiling fractal noise, shared by terrain and backdrops
const NT=256,NOISE=new Float32Array(NT*NT);
(function(){const r=rng(90210),oct=[[8,.5],[16,.27],[32,.15],[64,.08]];
  for(const[f,a]of oct){const g=new Float32Array(f*f);for(let i=0;i<f*f;i++)g[i]=r();
    for(let y=0;y<NT;y++)for(let x=0;x<NT;x++){const u=x/NT*f,v=y/NT*f,x0=u|0,y0=v|0,fx=u-x0,fy=v-y0,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
      const A=g[y0*f+x0],B=g[y0*f+(x0+1)%f],C=g[(y0+1)%f*f+x0],D=g[(y0+1)%f*f+(x0+1)%f];
      NOISE[y*NT+x]+=a*lerp(lerp(A,B,sx),lerp(C,D,sx),sy);}}
})();
const noise=(x,y)=>NOISE[((y&255)<<8)|(x&255)];
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16);
const bayer=(x,y)=>BAYER[(y&3)*4+(x&3)];

// ---------- bitmap font ----------
const GLYPHS={A:'0E11111F111111',B:'1E11111E11111E',C:'0E11101010110E',D:'1E11111111111E',E:'1F10101E10101F',F:'1F10101E101010',G:'0E111017111 10F'.replace(' ',''),H:'1111111F111111',I:'0E04040404040E',J:'0702020202120C',K:'11121418141211',L:'1010101010101F',M:'111B1515111111',N:'11191513111111',O:'0E11111111110E',P:'1E11111E101010',Q:'0E11111115120D',R:'1E11111E141211',S:'0F10100E01011E',T:'1F040404040404',U:'1111111111110E',V:'11111111110A04',W:'1111111515 1B11'.replace(' ',''),X:'11110A040A1111',Y:'11110A04040404',Z:'1F01020408101F',
'0':'0E11131519110E','1':'040C040404040E','2':'0E11010608101F','3':'1F02040201110E','4':'02060A121F0202','5':'1F101E0101110E','6':'0608101E11110E','7':'1F010204080808','8':'0E11110E11110E','9':'0E11110F01020C',
'.':'0000000000 0C0C'.replace(' ',''),',':'00000000 0C0408'.replace(' ',''),'!':'04040404040004','?':'0E110102040004',':':'000C0C000C0C00','-':'0000001F000000','/':'01010204081010',"'":'04040000000000','+':'0004041F040400','%':'18190204081303','(':'02040808080402',')':'08040202020408','>':'08040201020408','<':'02040810080402','*':'00150E1F0E1500'};
const FCH=Object.keys(GLYPHS),FIDX={};FCH.forEach((c,i)=>FIDX[c]=i);
const fontCache=new Map();
function fontFor(col){let f=fontCache.get(col);if(f)return f;const[c,x]=mk(FCH.length*6,7);x.fillStyle=col;
  FCH.forEach((ch,i)=>{const g=GLYPHS[ch];for(let r=0;r<7;r++){const b=parseInt(g.substr(r*2,2),16);for(let k=0;k<5;k++)if(b&(16>>k))x.fillRect(i*6+k,r,1,1);}});
  fontCache.set(col,c);return c;}
function rawTxt(C,s,x,y,col,sc){const f=fontFor(col);for(let i=0;i<s.length;i++){const k=FIDX[s[i]];if(k!==undefined)C.drawImage(f,k*6,0,5,7,x+i*6*sc,y,5*sc,7*sc);}}
function txt(C,s,x,y,col='#fff',o={}){s=String(s).toUpperCase();const sc=o.s||1,w=s.length*6*sc-sc;x=Math.round(o.c?x-w/2:o.r?x-w:x);
  if(o.sh!==0){rawTxt(C,s,x+sc,y+sc,o.sh||'#0b0812',sc);}rawTxt(C,s,x,y,col,sc);}

// ---------- FM-flavoured sound (2-operator voices, square PSG, noise) ----------
const AU={ctx:null,music:true,sfx:true,song:null,step:0,next:0,bpm:120,bus:null,sbus:null,noise:null,timer:0,last:{}};
function auInit(){
  if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return;}
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  try{const a=new C(),m=a.createGain(),comp=a.createDynamicsCompressor();m.gain.value=.75;m.connect(comp);comp.connect(a.destination);
    const bus=a.createGain(),sb=a.createGain();bus.gain.value=.46;sb.gain.value=.8;bus.connect(m);sb.connect(m);
    const n=a.createBuffer(1,a.sampleRate,a.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    Object.assign(AU,{ctx:a,bus,sbus:sb,noise:n});
    AU.timer=setInterval(auPump,40);if(AU.want)playSong(AU.want);}catch(e){AU.ctx=null;}
}
function fm(t,f,dur,o,dest){const a=AU.ctx,c=a.createOscillator(),mo=a.createOscillator(),mg=a.createGain(),g=a.createGain();
  c.type=o.w||'sine';c.frequency.value=f;mo.frequency.value=f*(o.ratio||1);
  const pk=f*(o.idx||1);mg.gain.setValueAtTime(pk,t);mg.gain.exponentialRampToValueAtTime(Math.max(1,pk*(o.sus||.15)),t+(o.dec||.12));
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(o.vol||.2,t+(o.a||.004));g.gain.setTargetAtTime((o.vol||.2)*(o.hold||.5),t+(o.a||.004),(o.dec||.12));
  g.gain.setTargetAtTime(0,t+dur,o.r||.03);
  mo.connect(mg);mg.connect(c.frequency);c.connect(g);g.connect(dest||AU.bus);
  c.start(t);mo.start(t);const e=t+dur+.3;c.stop(e);mo.stop(e);}
function nz(t,dur,vol,fq,type,dest){const a=AU.ctx,s=a.createBufferSource(),g=a.createGain(),fl=a.createBiquadFilter();s.buffer=AU.noise;s.loop=true;fl.type=type||'highpass';fl.frequency.value=fq;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(fl);fl.connect(g);g.connect(dest||AU.bus);s.start(t,Math.random()*.5);s.stop(t+dur+.02);}
function kick(t){const a=AU.ctx,o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.09);g.gain.setValueAtTime(.55,t);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(g);g.connect(AU.bus);o.start(t);o.stop(t+.2);}
const VOICE={bass:{ratio:1,idx:2.6,dec:.09,sus:.12,vol:.3,hold:.55},lead:{ratio:2,idx:1.3,dec:.2,sus:.3,vol:.15,hold:.7},brass:{ratio:1,idx:3.4,dec:.14,sus:.3,vol:.1,hold:.6},bell:{ratio:3.5,idx:2.2,dec:.3,sus:.05,vol:.09,hold:.2}};
const NOTE={c:0,'c#':1,d:2,'d#':3,e:4,f:5,'f#':6,g:7,'g#':8,a:9,'a#':10,b:11};
const n2f=m=>440*Math.pow(2,(m-69)/12);
function nm(s){const m=s.match(/^([a-g]#?)(\d)$/);return (+m[2]+1)*12+NOTE[m[1]];}
function mel(s){return s.trim().split(/\s+/).map(t=>t==='.'?null:t==='-'?0:nm(t));}
const SONGS={
 title:{bpm:128,chords:['a2','a2','f2','g2','a2','d2','e2','e2'],kind:[0,0,1,1,0,0,2,2],
  lead:mel(`a4 a4 c5 a4 e5 . d5 c5  b4 b4 d5 b4 e5 . e5 -  f5 e5 d5 c5 a4 . c5 d5  d5 c5 b4 a4 g4 . b4 -
            a4 a4 c5 a4 e5 . a5 g5  f5 f5 a5 f5 d5 . f5 e5  e5 d#5 e5 f5 e5 d5 c5 b4  g#4 b4 e5 g#5 e5 . . .`)},
 dig:{bpm:146,chords:['d2','d2','a#1','c2','d2','g2','a1','a1'],kind:[0,0,1,1,0,0,2,2],
  lead:mel(`d4 . f4 a4 d5 . a4 f4  e4 f4 g4 a4 f4 . d4 .  a#4 . a#4 d5 f5 . d5 a#4  c5 . c5 e5 g5 f5 e5 c5
            d5 d5 f5 d5 a5 . g5 f5  g5 f5 e5 d5 a#4 . d5 -  c#5 e5 a5 e5 c#5 e5 a5 e5  a5 g5 f5 e5 d5 c#5 a4 .`)},
 win:{once:1,bpm:170,chords:['c3','f2','g2','c3'],kind:[1,1,1,1],lead:mel(`c5 e5 g5 c6 a5 f5 c5 a5 g5 b5 d6 g5 c6 . c6 .`)},
 lose:{once:1,bpm:92,chords:['a2','f2','e2','a1'],kind:[0,1,2,0],lead:mel(`e5 d5 c5 a4 c5 a4 f4 - e4 g#4 b4 d5 a4 . . .`)}
};
function playSong(n){AU.want=n;if(!AU.ctx)return;const s=SONGS[n];AU.song=n&&AU.music?s:null;AU.step=0;AU.next=AU.ctx.currentTime+.06;AU.bpm=s?s.bpm:120;AU.boost=1;}
function auPump(){const a=AU.ctx;if(!a||!AU.song)return;const s=AU.song,sp=60/(AU.bpm*(AU.boost||1))/4;
  while(AU.next<a.currentTime+.16){const st=AU.step,t=AU.next,len=s.chords.length*16;
    if(s.once&&st>=len){AU.song=null;return;}
    const bar=(st>>4)%s.chords.length,b=st&15,root=nm(s.chords[bar]);
    const bp=[0,0,12,0,0,0,12,7,0,0,12,0,7,0,12,10];
    if(b%2===0||b===7||b===15)fm(t,n2f(root+bp[b]),sp*1.4,VOICE.bass);
    const third=s.kind[bar]===2?4:s.kind[bar]===1?4:3;
    if(b%4===2)for(const iv of[12,12+third,19])fm(t,n2f(root+iv+12),sp*1.2,VOICE.brass);
    if(b===0||b===8||b===10)kick(t);if(b===4||b===12)nz(t,.11,.2,1800);if(b%2===0)nz(t,.03,.07,7000);
    if(st%2===0){const i=(st>>1)%s.lead.length,m=s.lead[i];if(m){let run=1;while(s.lead[(i+run)%s.lead.length]===0)run++;fm(t,n2f(m),sp*2*run*.92,VOICE.lead);fm(t+sp*1.5,n2f(m+12),sp,{...VOICE.lead,vol:.035});}}
    AU.next+=sp;AU.step++;}
}
// a made-up language: each syllable is a buzzy tone through two moving vowel filters, so nothing is sampled
function voice(text,pitch){if(!AU.ctx||!AU.sfx)return;const now=performance.now();if(AU.vt&&now<AU.vt)return;const a=AU.ctx,t0=a.currentTime+.01,R=Math.random,n=Math.max(2,Math.min(6,Math.ceil(text.replace(/[^a-z]/gi,'').length/2.6))),q=text.endsWith('?'),e=text.endsWith('!');let t=t0;
 for(let i=0;i<n;i++){const d=.07+R()*.05,last=i===n-1,f=pitch*(.92+R()*.4)*(q&&last?1.45:1),o=a.createOscillator(),f1=a.createBiquadFilter(),f2=a.createBiquadFilter(),g=a.createGain(),m=a.createGain();o.type='sawtooth';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*(e&&last?.62:q&&last?1.3:1.08),t+d);f1.type=f2.type='bandpass';f1.Q.value=6;f2.Q.value=8;const v=[[700,1200],[400,2200],[600,1000],[300,2400],[500,1800]][R()*5|0];f1.frequency.value=v[0]*1.35;f2.frequency.value=v[1]*1.25;g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.34,t+.012);g.gain.setValueAtTime(.34,t+d*.6);g.gain.exponentialRampToValueAtTime(.001,t+d);m.gain.value=.5;o.connect(f1);o.connect(f2);f1.connect(g);f2.connect(m);m.connect(g);g.connect(AU.sbus);o.start(t);o.stop(t+d+.02);t+=d+.018;}
 AU.vt=now+(t-t0)*1000+260;}
function sfx(n){if(!AU.ctx||!AU.sfx)return;const a=AU.ctx,t=a.currentTime,now=performance.now();if(AU.last[n]&&now-AU.last[n]<55)return;AU.last[n]=now;const S=AU.sbus;
  const blip=(f,d,v,r)=>fm(t,f,d,{ratio:r||2,idx:1.5,dec:.08,vol:v,hold:.4},S);
  switch(n){
  case'move':blip(660,.03,.07);break;case'select':blip(880,.05,.1);fm(t+.05,1320,.06,{ratio:2,idx:1,dec:.06,vol:.08},S);break;
  case'assign':blip(520,.05,.13,3);fm(t+.04,780,.06,{ratio:3,idx:1,dec:.05,vol:.1},S);break;
  case'deny':blip(120,.1,.14,1.5);break;
  case'dig':nz(t,.06,.1,700,'bandpass',S);break;case'bash':nz(t,.07,.14,380,'bandpass',S);blip(90,.05,.12,1.4);break;case'pick':blip(1900,.03,.05,5);nz(t,.05,.08,1200,'bandpass',S);break;
  case'build':blip(330,.04,.1,5);break;case'clank':blip(2300,.07,.1,3.3);break;
  case'home':blip(990,.05,.09);fm(t+.06,1320,.08,{ratio:2,idx:1,dec:.06,vol:.08},S);break;
  case'splat':nz(t,.09,.18,500,'lowpass',S);break;case'drown':nz(t,.2,.1,900,'bandpass',S);break;
  case'boom':nz(t,.5,.5,600,'lowpass',S);kick(t);break;case'rock':nz(t,.3,.42,260,'lowpass',S);kick(t);break;
  case'stink':nz(t,.4,.13,420,'bandpass',S);blip(70,.3,.1,1.5);break;
  case'hex':for(let i=0;i<5;i++)fm(t+i*.05,600+i*220,.06,{ratio:3.5,idx:2,dec:.05,vol:.08},S);break;
  case'chomp':nz(t,.06,.2,300,'lowpass',S);blip(170,.07,.16,2.5);break;case'door':blip(220,.12,.12,1.5);break;case'tick':blip(1400,.02,.05);break;}
}
