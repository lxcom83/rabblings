// The world globe, as designed in the "Rabblings World Globe" concept: painted continents and biomes, glowing
// rifts that crack out from the vortex across the seas, the colour-shifting vortex, drifting mist, a haze rim and
// floating islands of every size (faster near the vortex, some sinking and resurfacing). No place names for now.
// Homeland markers use the races' ink field studies. Three.js r128 loads from cdnjs only on this page; without
// WebGL the still picture and the list of homelands below it stay as they are.
(function(){
 var stage=document.getElementById('globe');if(!stage)return;
 var still=stage.querySelector('.still'),card=document.getElementById('g-card'),status=document.getElementById('g-status'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function webgl(){try{var c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')));}catch(e){return false;}}
 if(!webgl()){status.textContent='Your browser cannot draw the 3D globe, so here is a still picture of it.';return;}
 var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.integrity='sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==';s.crossOrigin='anonymous';s.referrerPolicy='no-referrer';
 s.onload=function(){status.textContent='Shaping the world…';setTimeout(function(){try{build();}catch(e){console.error(e);status.textContent='The globe could not be drawn here, so here is a still picture of it.';}},30);};
 s.onerror=function(){status.textContent='The globe needs a connection to load. Here is a still picture of it.';};
 document.head.appendChild(s);

 var HOMES=[
  {k:'goblin',n:'Goblins',home:'Bog and Mines',at:[-100,36]},
  {k:'fairy',n:'Fairies',home:'A dead night garden',at:[-84,53]},
  {k:'swamp',n:'Swampfolk',home:'The Drowned Marsh',at:[92,-40]},
  {k:'shroom',n:'Mushroom Folk',home:'The Glowing Caves',at:[60,-22]},
  {k:'imp',n:'Imps',home:'The Cinder Forge',at:[112,44]},
  {k:'dwarf',n:'Dwarves',home:'The Deep Halls',at:[8,70]},
  {k:'rat',n:'Ratfolk',home:'The Warrens',at:[-72,-18]},
  {k:'bone',n:'Skeletons',home:'The Crypts',at:[-98,-42]}];
 var STUDIES={goblin:1,swamp:1,imp:1,fairy:1,dwarf:1,rat:1,bone:1,shroom:1};

 function build(){
 var THREE=window.THREE;
 // ---------- noise and helpers ----------
 var rng=function(s){return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};};
 var H=function(x,y,z){var h=(x*374761393+y*668265263+z*1274126177)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296;};
 function vnoise(x,y,z){var X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z),fx=x-X,fy=y-Y,fz=z-Z,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),w=fz*fz*(3-2*fz);var L=function(a,b,t){return a+(b-a)*t;};return L(L(L(H(X,Y,Z),H(X+1,Y,Z),u),L(H(X,Y+1,Z),H(X+1,Y+1,Z),u),v),L(L(H(X,Y,Z+1),H(X+1,Y,Z+1),u),L(H(X,Y+1,Z+1),H(X+1,Y+1,Z+1),u),v),w);}
 function fbm(x,y,z,o){o=o||5;var a=0,f=1,s=.5,t=0;for(var i=0;i<o;i++){a+=vnoise(x*f+i*17.3,y*f+i*9.1,z*f+i*3.7)*s;t+=s;f*=2.03;s*=.5;}return a/t;}
 var D2R=Math.PI/180;
 function dirLL(lon,lat){var phi=(lon+180)*D2R,th=(90-lat)*D2R;return new THREE.Vector3(-Math.cos(phi)*Math.sin(th),Math.cos(th),Math.sin(phi)*Math.sin(th));}
 // ---------- the world, following the first concept map ----------
 var LANDS=[
  {kind:'cold',t:-.08,m:.02,blobs:[[-60,74,22],[-20,73,24],[22,75,20],[-100,72,13],[55,76,12]]},
  {kind:'moss',t:0,m:.1,blobs:[[-110,44,19],[-92,30,15],[-125,26,11],[-82,52,12],[-135,48,9]]},
  {kind:'ash',t:0,m:-.07,blobs:[[102,48,21],[124,35,17],[82,40,13],[116,60,11]]},
  {kind:'dust',t:.04,m:-.12,blobs:[[-90,-25,21],[-70,-40,15],[-110,-14,13],[-60,-14,11],[-96,-44,10]]},
  {kind:'forest',t:.03,m:.1,blobs:[[76,-30,21],[100,-44,15],[54,-20,13],[96,-15,11],[66,-46,9]]},
  {kind:'rock',blobs:[[8,6,5.5],[2,13,3.5]]},
  {kind:'isle',blobs:[]}];
 var VORTEX={lon:17,lat:31};
 var R0=rng(7),farV=function(lon,lat){return Math.hypot(lon-VORTEX.lon,lat-VORTEX.lat)>14;},lon,lat,i,k;
 for(i=0;i<110;i++){do{lon=R0()*360-180;lat=R0()*150-75;}while(!farV(lon,lat));LANDS[6].blobs.push([lon,lat,1.6+R0()*2.8]);}
 for(var c=0;c<20;c++){do{lon=R0()*360-180;lat=R0()*140-70;}while(!farV(lon,lat));var hd=R0()*6.28,nn=4+(R0()*6|0);for(k=0;k<nn;k++){lon+=Math.cos(hd)*(2.5+R0()*2)+(R0()-.5)*2;lat+=Math.sin(hd)*(2+R0()*1.5)+(R0()-.5)*2;if(farV(lon,lat))LANDS[6].blobs.push([lon,lat,1.3+R0()*2]);}}
 var BL=[];LANDS.forEach(function(L,ci){L.blobs.forEach(function(b){BL.push({v:dirLL(b[0],b[1]),r:b[2]*D2R,c3:Math.cos(Math.min(Math.PI,b[2]*D2R*3.2)),ci:ci,isle:ci===6});});});
 var VX=dirLL(VORTEX.lon,VORTEX.lat),ROT0=-.55-Math.atan2(VX.x,VX.z);
 function sample(x,y,z){var wx=x+(fbm(x*1.7+3,y*1.7,z*1.7,4)-.5)*.55,wy=y+(fbm(x*1.7,y*1.7+8,z*1.7,4)-.5)*.55,wz=z+(fbm(x*1.7,y*1.7,z*1.7+13,4)-.5)*.55,wl=Math.hypot(wx,wy,wz);
  var best=-9,ci=0,ib=-9;for(var q=0;q<BL.length;q++){var b=BL[q];if(b.isle){var du=x*b.v.x+y*b.v.y+z*b.v.z;if(du>b.c3){var fi=1-Math.acos(Math.min(1,du))/b.r;if(fi>ib)ib=fi;}continue;}var dt=(wx*b.v.x+wy*b.v.y+wz*b.v.z)/wl;if(dt<b.c3){if(best<-2.2)best=-2.2;continue;}var d=Math.acos(Math.max(-1,Math.min(1,dt))),f=1-d/b.r;if(f>best){best=f;ci=b.ci;}}
  var n=fbm(x*3.1+5,y*3.1,z*3.1),n2=fbm(x*7,y*7+3,z*7,4),e=best*.9+(n-.5)*.7+(n2-.5)*.22;if(ib>-9){var ei=ib*.75+(n2-.5)*.5+(n-.5)*.2;if(ei>e&&ei>0){e=ei;ci=6;}}
  var vd=Math.acos(Math.max(-1,Math.min(1,x*VX.x+y*VX.y+z*VX.z)));if(vd<.2)e-=(.2-vd)*4;
  var ridge=1-Math.abs(fbm(x*5+11,y*5,z*5,4)-.5)*2,mtn=e>.12?Math.max(0,(ridge-.72)/.28)*Math.min(1,(e-.12)*4):0;
  var L=LANDS[ci],la=Math.abs(Math.asin(Math.max(-1,Math.min(1,y))))/(Math.PI/2);
  var T=1-la*1.1-Math.max(0,e)*.35+(fbm(x*2+70,y*2,z*2,3)-.5)*.3+(L.t||0),M=fbm(x*2.3+30,y*2.3,z*2.3,4)+(L.m||0),vol=fbm(x*2.6+50,y*2.6,z*2.6,4);
  return {e:e,ci:ci,ridge:ridge,mtn:mtn,n2:n2,vd:vd,T:T,M:M,vol:vol};}
 // biomes, muted for the grimdark look
 var BIO={ice:[166,166,160],tundra:[96,97,84],taiga:[38,50,40],forest:[48,62,36],deepwood:[32,46,30],heath:[88,86,58],swamp:[50,58,40],jungle:[38,60,34],steppe:[112,100,66],desert:[138,116,78],badland:[104,74,54],ash:[56,48,45],rock:[90,84,78]};
 var WOOD={taiga:1,forest:1,deepwood:1,jungle:1};
 function biome(e,mtn,T,M,vol,kind){if(kind==='rock')return'rock';if(kind==='ash'&&vol>.48)return'ash';if(kind!=='ash'&&(T<.12||(mtn>.5&&T<.28)))return'ice';if(mtn>.5)return'rock';
  if(T<.3)return M>.5?'taiga':'tundra';if(e<.12&&M>.58&&T>.38)return'swamp';
  if(T>.6){if(M<.4)return'desert';if(M<.48)return kind==='ash'?'badland':'steppe';return M>.58?'jungle':'forest';}
  if(M<.4)return kind==='ash'?'badland':'steppe';if(M<.48)return'heath';return M>.58?'deepwood':'forest';}
 // ---------- paint the surface (smaller on phones, where the paint is the slow part) ----------
 var small=stage.clientWidth<600||Math.min(screen.width,screen.height)<820||(navigator.hardwareConcurrency||8)<=4,TW=small?1024:2048,TH=TW/2,HGT;
 function* paint(){var cv=document.createElement('canvas');cv.width=TW;cv.height=TH;var x=cv.getContext('2d'),img=x.createImageData(TW,TH),a=img.data;var ec=document.createElement('canvas');ec.width=TW;ec.height=TH;var ex=ec.getContext('2d');ex.fillStyle='#000';ex.fillRect(0,0,TW,TH);var ei=ex.getImageData(0,0,TW,TH),ea=ei.data;
  var LW=TW/2,LH=TH/2,LN=LW*LH,LH_=new Float32Array(LN),LM=new Float32Array(LN),LR=new Float32Array(LN),LQ=new Float32Array(LN),BC=new Float32Array(LN*3),i,j,k;
  for(j=0;j<LH;j++){var th=(j+.5)/LH*Math.PI,st=Math.sin(th),ct=Math.cos(th);for(i=0;i<LW;i++){var ph=(i+.5)/LW*Math.PI*2,s=sample(-Math.cos(ph)*st,ct,Math.sin(ph)*st);k=i+j*LW;LH_[k]=s.e;LR[k]=s.ridge;LM[k]=s.mtn;LQ[k]=s.n2;
   if(s.e>0){var kd=LANDS[s.ci].kind,b=biome(s.e,s.mtn,s.T,s.M,s.vol,kd),col=(kd==='ash'&&WOOD[b])?[70,62,50]:BIO[b],j2=(s.n2-.5)*(WOOD[b]?.5:.25);col=col.map(function(v){return v*(1+j2);});
    if(s.mtn>0&&b!=='ice'){var tgt=kd==='ash'?[46,40,38]:s.T<.28?BIO.ice:BIO.rock,w=Math.min(1,s.mtn*1.3);col=col.map(function(v,q){return v+(tgt[q]-v)*w;});}
    BC[k*3]=col[0];BC[k*3+1]=b==='ash'?-Math.max(1,col[1]):col[1];BC[k*3+2]=col[2];}}if(j%4===3)yield 0;}
  // soften biome borders a little
  var LB=new Float32Array(LN*3);for(j=0;j<LH;j++)for(i=0;i<LW;i++){k=i+j*LW;var r=0,g=0,bb=0,n=0;for(var dj=-1;dj<=1;dj++)for(var di=-1;di<=1;di++){var kk=((i+di+LW)%LW)+Math.max(0,Math.min(LH-1,j+dj))*LW;if(LH_[kk]<=0)continue;r+=BC[kk*3];g+=Math.abs(BC[kk*3+1]);bb+=BC[kk*3+2];n++;}if(n){LB[k*3]=r/n;LB[k*3+1]=(BC[k*3+1]<0?-1:1)*g/n;LB[k*3+2]=bb/n;}}
  // full size: smooth those out and add fine coastline and ground detail
  HGT=new Float32Array(TW*TH);var MT=new Float32Array(TW*TH),RG=new Float32Array(TW*TH),N2=new Float32Array(TW*TH),B2=new Float32Array(TW*TH*3);
  for(j=0;j<TH;j++){var th2=(j+.5)/TH*Math.PI,st2=Math.sin(th2),ct2=Math.cos(th2),fy=Math.max(0,Math.min(LH-1.001,(j+.5)/2-.5)),j0=fy|0,ty=fy-j0;
   for(i=0;i<TW;i++){var ph2=(i+.5)/TW*Math.PI*2,dx=-Math.cos(ph2)*st2,dz=Math.sin(ph2)*st2,fx=(i+.5)/2-.5,i0=Math.floor(fx),tx=fx-i0,ia=(i0+LW)%LW,ib=(i0+1)%LW,k00=ia+j0*LW,k10=ib+j0*LW,k01=ia+(j0+1)*LW,k11=ib+(j0+1)*LW,w00=(1-tx)*(1-ty),w10=tx*(1-ty),w01=(1-tx)*ty,w11=tx*ty;k=i+j*TW;
    var d=(vnoise(dx*48+7,ct2*48,dz*48)-.5)*.6+(vnoise(dx*110,ct2*110+5,dz*110)-.5)*.4;
    HGT[k]=(LH_[k00]*w00+LH_[k10]*w10+LH_[k01]*w01+LH_[k11]*w11)+d*.07;MT[k]=Math.max(0,(LM[k00]*w00+LM[k10]*w10+LM[k01]*w01+LM[k11]*w11)+d*.12);RG[k]=LR[k00]*w00+LR[k10]*w10+LR[k01]*w01+LR[k11]*w11;N2[k]=(LQ[k00]*w00+LQ[k10]*w10+LQ[k01]*w01+LQ[k11]*w11)+d*.12;
    var kn=(tx<.5?(ty<.5?k00:k01):(ty<.5?k10:k11)),r2=0,g2=0,b2=0,n2=0,KS=[k00,k10,k01,k11],WS=[w00,w10,w01,w11];for(var q=0;q<4;q++){var kq=KS[q];if(LB[kq*3]||LB[kq*3+2]){r2+=LB[kq*3]*WS[q];g2+=Math.abs(LB[kq*3+1])*WS[q];b2+=LB[kq*3+2]*WS[q];n2+=WS[q];}}
    if(n2){var m=1+d*.3;B2[k*3]=r2/n2*m;B2[k*3+1]=(LB[kn*3+1]<0?-1:1)*g2/n2*m;B2[k*3+2]=b2/n2*m;}}if(j%16===15)yield 0;}
  var at=function(i,j){return HGT[((i+TW)%TW)+Math.max(0,Math.min(TH-1,j))*TW];};
  for(j=0;j<TH;j++)for(i=0;i<TW;i++){k=i+j*TW;var e=HGT[k],p=k*4,cl;
   if(e<=0){var near=0;for(var rr=1;rr<=12&&!near;rr++)if(at(i+rr,j)>0||at(i-rr,j)>0||at(i,j+rr)>0||at(i,j-rr)>0)near=1-rr/13;var deep=Math.min(1,-e*2.2),wv=(N2[k]-.5)*10;cl=[22+12*near-6*deep+wv,34+14*near-8*deep+wv,40+12*near-8*deep+wv];}
   else{var isAsh=B2[k*3+1]<0;cl=[B2[k*3],Math.abs(B2[k*3+1]),B2[k*3+2]];
    var sh=(at(i-1,j-1)+MT[((i-1+TW)%TW)+Math.max(0,j-1)*TW]*.6-at(i+1,j+1)-MT[((i+1)%TW)+Math.min(TH-1,j+1)*TW]*.6),shade=Math.max(-.6,Math.min(.6,sh*9));cl=[cl[0]*(1+shade*.5),cl[1]*(1+shade*.5),cl[2]*(1+shade*.5)];
    if(isAsh&&Math.abs(RG[k]-.9)<.016&&e>.04&&e<.4){cl=[255,120,32];ea[p]=255;ea[p+1]=110;ea[p+2]=24;}
    if(at(i+1,j)<=0||at(i-1,j)<=0||at(i,j+1)<=0||at(i,j-1)<=0)cl=[18,12,16];}
   a[p]=cl[0];a[p+1]=cl[1];a[p+2]=cl[2];a[p+3]=255;if(i===TW-1&&j%32===31)yield 0;}
  x.putImageData(img,0,0);ex.putImageData(ei,0,0);
  // rifts: cracks of magic that run out from the vortex across the seas and stop where they reach land
  var rc=document.createElement('canvas');rc.width=TW;rc.height=TH;var rx=rc.getContext('2d');rx.fillStyle='#000';rx.fillRect(0,0,TW,TH);rx.globalCompositeOperation='lighten';rx.lineCap='round';rx.lineJoin='round';
  var sc=TW/2048;
  var toPx=function(q){var th=Math.acos(Math.max(-1,Math.min(1,q.y))),ph=Math.atan2(q.z,-q.x);return[((ph<0?ph+Math.PI*2:ph)/(Math.PI*2))*TW,th/Math.PI*TH];};
  var land=function(q){var u=toPx(q);return HGT[(Math.min(TW-1,u[0]|0))+Math.min(TH-1,u[1]|0)*TW]>0;};
  var R=rng(31),STEP=.45*D2R;
  var crack=function(p0,h0,d0,maxA,main){var nrm=new THREE.Vector3().crossVectors(p0,h0).normalize(),amp=main?.022:.014,lat=0,from=0,to=(R()-.5)*amp,seg=3+(R()*6|0),kk=0,d=d0,pts=[[p0.clone(),d]];
   for(var n=1;n*STEP<maxA;n++){var a2=n*STEP;if(++kk>=seg){from=to;to=(R()-.5)*2*amp;seg=3+(R()*7|0);kk=0;}lat=from+(to-from)*(kk/seg);
    var p=p0.clone().multiplyScalar(Math.cos(a2)).addScaledVector(h0,Math.sin(a2)).addScaledVector(nrm,lat).normalize();d=d0+a2;
    if(d>.12&&land(p))break;pts.push([p,d]);
    if(main&&n>20&&R()<.018){var h=new THREE.Vector3().crossVectors(nrm,p).normalize().applyAxisAngle(p,(R()<.5?1:-1)*(.35+R()*.5));crack(p,h,d,(8+R()*22)*D2R,false);}}
   (main?[[6,55],[2.2,255]]:[[4,40],[1.4,170]]).forEach(function(wc){rx.lineWidth=Math.max(1,wc[0]*sc);for(var s2=1;s2<pts.length;s2++){var A=toPx(pts[s2-1][0]),B=toPx(pts[s2][0]);if(Math.abs(A[0]-B[0])>TW/2)continue;rx.strokeStyle='rgb('+wc[1]+','+(Math.min(255,pts[s2][1]/Math.PI*255)|0)+',0)';rx.beginPath();rx.moveTo(A[0],A[1]);rx.lineTo(B[0],B[1]);rx.stroke();}});};
  var up0=Math.abs(VX.y)<.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0),t0=up0.clone().projectOnPlane(VX).normalize();
  for(var ri=0;ri<9;ri++){var hh=t0.clone().applyAxisAngle(VX,(ri+.2+R()*.6)/9*Math.PI*2);crack(VX,hh,0,300*D2R,true);}
  return [cv,ec,rc];}
 function heightAt(v){var s=sample(v.x,v.y,v.z);return s.e>0?.006+Math.min(.5,s.e)*.018+s.mtn*.022:0;}

 // ---------- three.js scene ----------
 var W=stage.clientWidth,Hh=stage.clientHeight,dist=small?4.6:4.2;
 var ren=new THREE.WebGLRenderer({antialias:true});ren.setPixelRatio(Math.min(devicePixelRatio||1,2));ren.setClearColor(0x07060a);ren.setSize(W,Hh,false);
 var cnv=ren.domElement;cnv.setAttribute('role','img');cnv.setAttribute('aria-label','A turning globe of the Rabblings world, with the vortex, glowing rifts and floating islands');stage.insertBefore(cnv,stage.firstChild);
 var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(38,W/Hh,.05,60);cam.position.set(0,0,dist);
 var grad=new THREE.DataTexture(new Uint8Array([90,90,90,255,150,150,150,255,210,210,210,255,255,255,255,255]),4,1,THREE.RGBAFormat);grad.minFilter=grad.magFilter=THREE.NearestFilter;grad.needsUpdate=true;
 scene.add(new THREE.AmbientLight(0x8a8098,.42));var sun=new THREE.DirectionalLight(0xe8dcc8,.95);sun.position.set(-3,2.4,3);scene.add(sun);
 // stars, dim and sparse
 (function(){var g=new THREE.BufferGeometry(),p=[],R=rng(5);for(var i=0;i<900;i++){var v=new THREE.Vector3(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(25+R()*10);p.push(v.x,v.y,v.z);}g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0x8a8494,size:.06,sizeAttenuation:true})));})();
 var world=new THREE.Group();scene.add(world);
 var vLight=new THREE.PointLight(0xb070e0,1.6,1.8);vLight.position.copy(VX).multiplyScalar(1.35);world.add(vLight);
 var ISL=[],vortexParts=null,riftMat=null,Y=new THREE.Vector3(0,1,0),q=new THREE.Quaternion();
 // the vortex is violet, but every so often it shifts to another colour for a while, then drifts back
 var VCOL={base:new THREE.Color(0xc896f0),cur:new THREE.Color(0xc896f0),list:[0xc23812,0x48c8b4,0xe0b448,0x9ad048,0x6a8ce8,0xe8e0f0],from:new THREE.Color(),to:new THREE.Color(0xc896f0),t:1,dur:1,next:8};
 pump(paint(),function(P){try{finish(P);}catch(e){console.error(e);status.textContent='The globe could not be drawn here, so here is a still picture of it.';}});
 function pump(gen,done){(function step(){var t=performance.now(),r;while(!(r=gen.next()).done){if(performance.now()-t>24){setTimeout(step,0);return;}}done(r.value);})();}
 function finish(P){var tex=P[0],emi=P[1],rift=P[2];
 var Tt=new THREE.CanvasTexture(tex),E=new THREE.CanvasTexture(emi);Tt.anisotropy=ren.capabilities.getMaxAnisotropy();
 var g=new THREE.SphereGeometry(1,small?200:320,small?100:160),PA=g.attributes.position,v=new THREE.Vector3();for(i=0;i<PA.count;i++){v.fromBufferAttribute(PA,i).normalize();v.multiplyScalar(1+heightAt(v));PA.setXYZ(i,v.x,v.y,v.z);}g.computeVertexNormals();
 world.add(new THREE.Mesh(g,new THREE.MeshToonMaterial({map:Tt,gradientMap:grad,emissive:0xffffff,emissiveMap:E,emissiveIntensity:.75})));
 // the rifts sit just above the sea; land rises above them, and they pulse slowly outward from the vortex
 var RT=new THREE.CanvasTexture(rift);RT.anisotropy=ren.capabilities.getMaxAnisotropy();
 riftMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{map:{value:RT},time:{value:0},col:{value:new THREE.Color(0xb878e0)}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform sampler2D map;uniform float time;uniform vec3 col;varying vec2 vUv;void main(){vec4 t=texture2D(map,vUv);float w=.5+.5*sin(t.g*22.-time*.9);float br=.7+.3*sin(time*.45);float i=t.r*(.3+.7*w*w)*br;gl_FragColor=vec4(col*i*1.5,1.);}'});
 world.add(new THREE.Mesh(new THREE.SphereGeometry(1.0012,256,128),riftMat));
 // dark outline round the globe
 world.add(new THREE.Mesh(new THREE.SphereGeometry(1.012,96,48),new THREE.MeshBasicMaterial({color:0x050406,side:THREE.BackSide})));
 // haze
 scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.13,64,32),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,depthWrite:false,uniforms:{c:{value:new THREE.Color(0x5e5070)}},vertexShader:'varying vec3 n;varying vec3 vp;void main(){n=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);vp=p.xyz;gl_Position=projectionMatrix*p;}',fragmentShader:'uniform vec3 c;varying vec3 n;varying vec3 vp;void main(){float f=pow(max(0.,dot(normalize(-vp),-n)),2.6);gl_FragColor=vec4(c,f*.55);}'})));
 // drifting mist
 var mist;(function(){var c=document.createElement('canvas');c.width=512;c.height=256;var x=c.getContext('2d'),im=x.createImageData(512,256);for(var j=0;j<256;j++){var th=(j+.5)/256*Math.PI;for(var i=0;i<512;i++){var ph=(i+.5)/512*Math.PI*2,n=fbm(-Math.cos(ph)*Math.sin(th)*3+40,Math.cos(th)*3,Math.sin(ph)*Math.sin(th)*3,5),a=Math.max(0,(n-.5)*3.2),p=(i+j*512)*4;im.data[p]=im.data[p+1]=150;im.data[p+2]=158;im.data[p+3]=Math.min(255,a*170);}}x.putImageData(im,0,0);mist=new THREE.Mesh(new THREE.SphereGeometry(1.045,96,48),new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,opacity:.75}));world.add(mist);})();
 // the vortex
 function swirlTex(stripes,alpha){var c=document.createElement('canvas');c.width=256;c.height=256;var x=c.getContext('2d');for(var i=0;i<stripes;i++){var y=i/stripes*256,gr=x.createLinearGradient(0,y,256,y+256/stripes*2);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,'+alpha+')');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.beginPath();x.moveTo(0,y);x.lineTo(256,y+60);x.lineTo(256,y+60+256/stripes);x.lineTo(0,y+256/stripes);x.fill();}var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
 (function(){var grp=new THREE.Group();grp.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),VX);grp.position.copy(VX);world.add(grp);
  var mk=function(rb,rt,h,a,rep,sp){var t=swirlTex(6,a);t.repeat.set(rep,1);var g=new THREE.CylinderGeometry(rt,rb,h,48,20,true);g.translate(0,h/2,0);var P=g.attributes.position,v=new THREE.Vector3();for(var i=0;i<P.count;i++){v.fromBufferAttribute(P,i);var k=v.y/h,ang=k*3.2,x=v.x*Math.cos(ang)-v.z*Math.sin(ang),z=v.x*Math.sin(ang)+v.z*Math.cos(ang);P.setXYZ(i,x+Math.sin(k*5)*.02,v.y,z);}var m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:t,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.userData.sp=sp;grp.add(m);return m;};
  var parts=[mk(.05,.2,1.15,.35,2,.35),mk(.03,.12,1.0,.55,3,-.6),mk(.015,.05,.85,.8,2,1.1)];parts.forEach(function(m){m.material.color.copy(VCOL.base);});vortexParts={grp:grp,parts:parts,flick:0};})();
 // floating islands
 var ITOP={grass:['#4e5c36','#3c4a2c'],forest:['#2e4026','#3a4c2e'],snow:['#a8a8a2','#8e8e88'],ash:['#3a302c','#2e2622'],desert:['#8a7650','#7a6644'],heath:['#6a6a48','#5a5a3e'],swamp:['#3e4a32','#2e3a2e'],rock:['#5a5446','#4a4038']};
 function islandMesh(R,big,bio){var top=ITOP[bio],g=new THREE.ConeGeometry(1,1.5+R()*.8,big?11:8,4);g.rotateX(Math.PI);g.translate(0,-.75,0);var P=g.attributes.position,col=[],v=new THREE.Vector3();
  for(var i=0;i<P.count;i++){v.fromBufferAttribute(P,i);if(v.y<-.02){v.x*=.85+R()*.35;v.z*=.85+R()*.35;v.y*=.9+R()*.25;}else{v.x*=.95+R()*.12;v.z*=.95+R()*.12;v.y=R()*.08;}P.setXYZ(i,v.x,v.y,v.z);var c=new THREE.Color(v.y>-.05?top[R()<.5?0:1]:(v.y<-1?'#3a3430':(bio==='snow'?'#6a6662':'#5a524c')));col.push(c.r,c.g,c.b);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.computeVertexNormals();
  var m=new THREE.Mesh(g,new THREE.MeshToonMaterial({vertexColors:true,gradientMap:grad,flatShading:true})),o=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0x050406,side:THREE.BackSide}));o.scale.setScalar(1.08);var grp=new THREE.Group();grp.add(m,o);
  if(R()<.3){var cr=new THREE.Mesh(new THREE.OctahedronGeometry(.18,0),new THREE.MeshBasicMaterial({color:0xc090e8}));cr.position.set((R()-.5)*.6,.18,(R()-.5)*.6);cr.scale.y=1.8;grp.add(cr);}
  var trees={forest:[4,0x24331e],grass:[2,0x2e3c22],swamp:[3,0x283224],snow:[2,0x2c3a2c],ash:[2,0x241c18],heath:[1,0x3a3a26]}[bio];
  if(trees&&R()<.75){var n=trees[0]+(big?3:0);for(var t=0;t<n;t++){var tr=new THREE.Mesh(new THREE.ConeGeometry(bio==='ash'?.03:.08,bio==='ash'?.4:.5,4),new THREE.MeshToonMaterial({color:trees[1],gradientMap:grad})),a=R()*6.28,r=R()*.65;tr.position.set(Math.cos(a)*r,.24,Math.sin(a)*r);grp.add(tr);}}
  if(bio==='ash'&&R()<.6){var lv=new THREE.Mesh(new THREE.CircleGeometry(.22,8),new THREE.MeshBasicMaterial({color:0xff7a24}));lv.rotation.x=-Math.PI/2;lv.position.y=.09;grp.add(lv);}
  return grp;}
 var T1=new THREE.Vector3(0,1,0).cross(VX).normalize(),T2=VX.clone().cross(T1).normalize();
 (function(){var R=rng(91);
  var add=function(o){var mesh=islandMesh(R,o.s>.045,o.bio);mesh.scale.setScalar(o.s);world.add(mesh);ISL.push(Object.assign(o,{mesh:mesh}));};
  var pick=function(lat){return Math.abs(lat)>58?(R()<.75?'snow':'rock'):['grass','forest','heath','desert','swamp','ash','rock','forest','grass'][R()*9|0];};
  // round the vortex: faster, higher, more of them
  for(var i=0;i<40;i++){var big=i<5,d=(.12+R()*.9)*(big?.9:1),s=big?.05+R()*.035:.012+R()*.022;add({mode:'v',bio:pick(30),d:d,a:R()*6.28,w:(.06+R()*.12)/(.3+d)*(R()<.12?3:1)*(R()<.5?1:-1),alt:.06+(1-Math.min(1,d))*.25+R()*.08,bob:R()*6.28,s:s,sink:R()<.08,spin:(R()-.5)*.3});}
  // the rest of the world: slow drifters of every size, spread evenly so the far side has big ones too
  var drift=function(st,s,alt){var lat=Math.asin(st.y)/D2R,ax=new THREE.Vector3(R()-.5,R()-.5,R()-.5).normalize().projectOnPlane(st).normalize();add({mode:'f',bio:pick(lat),ax:ax,st:st,a:0,w:(.004+R()*.018)*(R()<.5?1:-1),alt:alt,bob:R()*6.28,s:s,sink:R()<.05,spin:(R()-.5)*.12});};
  var fib=function(i,n){var y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),a=i*2.39996;return new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);};
  var away=function(v){return v.dot(VX)<.93;};
  for(i=0;i<12;i++){var v1=fib(i,12);if(away(v1))drift(v1,.05+R()*.04,.08+R()*.07);}
  for(i=0;i<34;i++){var v2=fib(i,34).applyAxisAngle(Y,1.3);if(away(v2))drift(v2,.026+R()*.02,.05+R()*.08);}
  for(i=0;i<70;i++){var v3=new THREE.Vector3(R()-.5,R()-.5,R()-.5).normalize();if(away(v3))drift(v3,.009+R()*.014,.035+R()*.09);}})();
 function stepIslands(t,dt){for(var i=0;i<ISL.length;i++){var o=ISL[i],dir;if(!reduce)o.a+=o.w*dt;
   if(o.mode==='v'){var c=Math.cos(o.d),s=Math.sin(o.d);dir=VX.clone().multiplyScalar(c).addScaledVector(T1,Math.cos(o.a)*s).addScaledVector(T2,Math.sin(o.a)*s).normalize();}else dir=o.st.clone().applyAxisAngle(o.ax,o.a);
   var alt=o.alt+(reduce?0:Math.sin(t*.7+o.bob)*.008);if(o.sink&&!reduce){var k=(Math.sin(t*.15+o.bob)+1)/2;alt=Math.max(-.02,o.alt*k*k*1.2-.01);}
   o.mesh.position.copy(dir).multiplyScalar(1+alt);q.setFromUnitVectors(Y,dir);o.mesh.quaternion.copy(q);o.mesh.rotateY((reduce?0:t*o.spin)+o.bob);}}

 // ---------- markers and the info card ----------
 var layer=document.getElementById('g-marks'),marks=[],cur=null;
 function mark(lon,lat,cls,html,label,onclick){var b=document.createElement('button');b.type='button';b.addEventListener('click',onclick);b.setAttribute('aria-expanded','false');
  b.className='gmark '+cls;b.innerHTML=html;b.setAttribute('aria-label',label);b.title=label;b.addEventListener('pointerenter',function(){if(spin){spin=false;sb.setAttribute('aria-pressed','false');}});b.addEventListener('focus',function(){if(spin){spin=false;sb.setAttribute('aria-pressed','false');}});layer.appendChild(b);marks.push({b:b,v:dirLL(lon,lat)});return b;}
 HOMES.forEach(function(h){var face=STUDIES[h.k]?'<img src="img/journal/race-'+h.k+'-head.webp" width="160" height="160" alt="">':'<span class="dot"></span>';
  var b=mark(h.at[0],h.at[1],'home',face,'Homeland of the '+h.n,function(){open(b,h.n,['Home: '+h.home+'.','Where the '+h.n+' live on the globe is not settled in the lore yet. This marker is a provisional placement for the website.'],'journal/'+h.k+'.html');});});
 var VINFO=['A vast magical vortex at a fixed point on the globe, reaching high into space. It formed around the time of the Great Disappointment.','It channels and amplifies magic, but is not its only source. It fluctuates without warning, with flashes, hums and sudden shifts in the floating islands.','No one is known to have reached its centre and returned.'];
 var IINFO=['Floating islands vary in size, height and movement. Some drift steadily for years before turning chaotic; others race, sink and resurface, or change course without warning.','They can collide, break apart, fall or merge. Some hold settlements or isolated peoples, and most remain unexplored.'];
 function open(b,title,lines,href){if(cur)cur.setAttribute('aria-expanded','false');cur=b;if(b)b.setAttribute('aria-expanded','true');
  card.querySelector('h3').textContent=title;var box=card.querySelector('.g-body');box.textContent='';lines.forEach(function(t){var p=document.createElement('p');p.textContent=t;box.appendChild(p);});
  var a=card.querySelector('a');a.href=href;a.textContent=/journal/.test(href)?'Read the journal entry':'Read more in the lore';card.hidden=false;spin=false;sb.setAttribute('aria-pressed','false');}
 function close(){card.hidden=true;if(cur){cur.setAttribute('aria-expanded','false');cur.focus();cur=null;}}
 card.querySelector('.x').addEventListener('click',close);
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!card.hidden)close();});

 // ---------- controls: drag to turn, pinch or wheel to zoom, tap an island or the vortex ----------
 var yaw=ROT0,pitch=.21,vy=0,vp=0,spin=!reduce,ptr={},drag=null,pinch=null,down=null;
 var sb=document.getElementById('g-spin');sb.setAttribute('aria-pressed',spin);sb.addEventListener('click',function(){spin=!spin;sb.setAttribute('aria-pressed',spin);});
 document.getElementById('g-reset').addEventListener('click',function(){yaw=ROT0;pitch=.21;dist=stage.clientWidth<600?4.6:4.2;vy=vp=0;if(!card.hidden)close();});
 cnv.addEventListener('pointerdown',function(e){ptr[e.pointerId]={x:e.clientX,y:e.clientY};down=[e.clientX,e.clientY];cnv.setPointerCapture(e.pointerId);var k=Object.keys(ptr);if(k.length===1)drag={x:e.clientX,y:e.clientY};if(k.length===2){var a=ptr[k[0]],b=ptr[k[1]];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),dist:dist};drag=null;}spin=false;sb.setAttribute('aria-pressed','false');});
 cnv.addEventListener('pointermove',function(e){if(!ptr[e.pointerId])return;ptr[e.pointerId]={x:e.clientX,y:e.clientY};var k=Object.keys(ptr);
  if(pinch&&k.length===2){var a=ptr[k[0]],b=ptr[k[1]];dist=Math.max(1.6,Math.min(9,pinch.dist*pinch.d/Math.max(20,Math.hypot(a.x-b.x,a.y-b.y))));return;}
  if(drag){var s=2.4/stage.clientWidth*(dist/4.2),dx=(e.clientX-drag.x)*s,dy=(e.clientY-drag.y)*s;yaw+=dx;pitch=Math.max(-1.3,Math.min(1.3,pitch+dy));vy=dx;vp=dy;drag={x:e.clientX,y:e.clientY};}});
 var ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
 function up(e){var tap=down&&!pinch&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<8;delete ptr[e.pointerId];if(Object.keys(ptr).length<2)pinch=null;if(!Object.keys(ptr).length)drag=null;
  if(tap&&e.type==='pointerup'){var r=cnv.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ndc,cam);
   if(ray.intersectObjects(ISL.map(function(o){return o.mesh;}),true).length){vy=vp=0;open(null,'A floating island',IINFO,'lore.html#islands');return;}
   if(ray.intersectObjects(vortexParts.parts,false).length){vy=vp=0;open(null,'The vortex',VINFO,'lore.html#vortex');}}
  down=null;}
 cnv.addEventListener('pointerup',up);cnv.addEventListener('pointercancel',up);
 cnv.addEventListener('wheel',function(e){e.preventDefault();dist=Math.max(1.6,Math.min(9,dist*(1+Math.sign(e.deltaY)*.08)));},{passive:false});

 function resize(){W=stage.clientWidth;Hh=stage.clientHeight;ren.setSize(W,Hh,false);cam.aspect=W/Hh;cam.updateProjectionMatrix();}
 addEventListener('resize',resize);
 var visible=true;if('IntersectionObserver'in window)new IntersectionObserver(function(en){visible=en[0].isIntersecting;}).observe(stage);
 var last=performance.now(),tS=last,tmp=new THREE.Vector3(),camDir=new THREE.Vector3();
 function frame(now){requestAnimationFrame(frame);if(!visible||document.hidden){last=now;return;}
  var dt=Math.min(.05,(now-last)/1000),t=(now-tS)/1000;last=now;
  if(spin)yaw+=dt*.06;if(!drag){yaw+=vy;pitch=Math.max(-1.3,Math.min(1.3,pitch+vp));vy*=.92;vp*=.92;}
  world.rotation.set(pitch,yaw,0,'XYZ');cam.position.set(0,0,dist);cam.lookAt(0,0,0);
  if(!reduce)mist.rotation.y+=dt*.012;
  var vp_=vortexParts;if(!reduce)vp_.parts.forEach(function(m){m.material.map.offset.x+=dt*m.userData.sp*.25;m.material.map.offset.y-=dt*.08;});
  if(!reduce){VCOL.next-=dt;if(VCOL.next<=0){var away=VCOL.to.equals(VCOL.base);VCOL.from.copy(VCOL.cur);VCOL.to.set(away?VCOL.list[Math.random()*VCOL.list.length|0]:VCOL.base);VCOL.t=0;VCOL.dur=1.5+Math.random()*2;VCOL.next=away?4+Math.random()*5:10+Math.random()*14;vp_.flick=1;}
   if(VCOL.t<1){VCOL.t=Math.min(1,VCOL.t+dt/VCOL.dur);VCOL.cur.copy(VCOL.from).lerp(VCOL.to,VCOL.t*VCOL.t*(3-2*VCOL.t));vp_.parts.forEach(function(m){m.material.color.copy(VCOL.cur);});vLight.color.copy(VCOL.cur);}
   if(Math.random()<dt*.5)vp_.flick=1;}
  vp_.flick*=.9;var f=reduce?1:1+vp_.flick*1.4+Math.sin(t*2.3)*.12;vp_.parts.forEach(function(m){m.material.opacity=Math.min(1,.6*f);});vLight.intensity=1.4*f;
  riftMat.uniforms.time.value=reduce?0:t;
  stepIslands(t,dt);
  ren.render(scene,cam);
  world.updateMatrixWorld();camDir.copy(cam.position).normalize();
  marks.forEach(function(M){tmp.copy(M.v).applyMatrix4(world.matrixWorld);var face=tmp.dot(camDir);tmp.multiplyScalar(1.03).project(cam);
   var x=(tmp.x+1)/2*W,y=(1-tmp.y)/2*Hh,show=face>.25;M.b.style.opacity=show?Math.min(1,(face-.25)*4):0;M.b.style.visibility=show?'visible':'hidden';
   M.b.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) translate(-50%,-50%)';});}
 if(still)still.hidden=true;
 status.textContent='Drag to turn the world. Pinch or scroll to zoom. Tap a portrait, a floating island or the vortex.';
 requestAnimationFrame(frame);
 window.__globeReady=true;}}
})();
