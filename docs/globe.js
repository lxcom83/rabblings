// The world globe: an ink-map sphere drawn in the browser, the vortex, drifting floating islands and
// clickable homeland markers. Three.js r128 loads from cdnjs only on this page; without WebGL the
// still picture and the list of homelands below it stay as they are.
(function(){
 var stage=document.getElementById('globe');if(!stage)return;
 var still=stage.querySelector('.still'),card=document.getElementById('g-card'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function webgl(){try{var c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')));}catch(e){return false;}}
 if(!webgl()){document.getElementById('g-status').textContent='Your browser cannot draw the 3D globe, so here is a still picture of it.';return;}
 var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.integrity='sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==';s.crossOrigin='anonymous';s.referrerPolicy='no-referrer';
 s.onload=function(){try{build();}catch(e){document.getElementById('g-status').textContent='The globe could not be drawn here, so here is a still picture of it.';}};
 s.onerror=function(){document.getElementById('g-status').textContent='The globe needs a connection to load. Here is a still picture of it.';};
 document.head.appendChild(s);

 // ---------- the world (working shapes from the first concept map, not canon) ----------
 var VORTEX=[17,31],dist=4.1;
 var LANDS=[
  {n:'Northern Expanse',k:'cold',lab:[-20,71],b:[[-60,74,22],[-20,73,24],[22,75,20],[-100,72,13],[55,76,12]]},
  {n:'The Emerald Continent',k:'moss',lab:[-102,40],b:[[-110,44,19],[-92,30,15],[-125,26,11],[-82,52,12],[-135,48,9]]},
  {n:'The Ashen Wastes',k:'ash',lab:[108,45],b:[[102,48,21],[124,35,17],[82,40,13],[116,60,11]]},
  {n:'The Sundering Lands',k:'dust',lab:[-86,-27],b:[[-90,-25,21],[-70,-40,15],[-110,-14,13],[-60,-14,11],[-96,-44,10]]},
  {n:'The Verdant Realms',k:'forest',lab:[78,-31],b:[[76,-30,21],[100,-44,15],[54,-20,13],[96,-15,11],[66,-46,9]]},
  {n:'',k:'rock',b:[[8,6,5.5],[2,13,3.5]]}];
 var SEAS=[['The Shattered Sea',-38,4],['The Eastern Deep',84,3],['The Titan Sea',-12,-70]];
 var HOMES=[
  {k:'goblin',n:'Goblins',home:'Bog and Mines',at:[-100,36]},
  {k:'fairy',n:'Fairies',home:'A dead night garden',at:[-84,53]},
  {k:'swamp',n:'Swampfolk',home:'The Drowned Marsh',at:[92,-40]},
  {k:'shroom',n:'Mushroom Folk',home:'The Glowing Caves',at:[60,-22]},
  {k:'imp',n:'Imps',home:'The Cinder Forge',at:[112,44]},
  {k:'dwarf',n:'Dwarves',home:'The Deep Halls',at:[8,70]},
  {k:'rat',n:'Ratfolk',home:'The Clockwork Sewers',at:[-72,-18]},
  {k:'bone',n:'Skeletons',home:'The Crypts',at:[-98,-42]}];
 var TINT={cold:[196,190,170],moss:[176,170,128],ash:[150,128,104],dust:[204,180,132],forest:[160,162,116],rock:[170,158,136]};

 function rng(s){return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
 function H(x,y,z){var h=(x*374761393+y*668265263+z*1274126177)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}
 function vn(x,y,z){var X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z),fx=x-X,fy=y-Y,fz=z-Z,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),w=fz*fz*(3-2*fz),L=function(a,b,t){return a+(b-a)*t;};
  return L(L(L(H(X,Y,Z),H(X+1,Y,Z),u),L(H(X,Y+1,Z),H(X+1,Y+1,Z),u),v),L(L(H(X,Y,Z+1),H(X+1,Y,Z+1),u),L(H(X,Y+1,Z+1),H(X+1,Y+1,Z+1),u),v),w);}
 function fbm(x,y,z,o){var a=0,f=1,s=.5,t=0;for(var i=0;i<o;i++){a+=vn(x*f+i*17.3,y*f+i*9.1,z*f+i*3.7)*s;t+=s;f*=2.03;s*=.5;}return a/t;}
 var D=Math.PI/180;
 function dir(lon,lat){var p=(lon+180)*D,t=(90-lat)*D;return [-Math.cos(p)*Math.sin(t),Math.cos(t),Math.sin(p)*Math.sin(t)];}

 // ---------- paint the ink map ----------
 function paint(){
  var GW=512,GH=256,N=GW*GH,E=new Float32Array(N),C=new Uint8Array(N),RG=new Float32Array(N),BL=[];
  LANDS.forEach(function(L,ci){L.b.forEach(function(b){var v=dir(b[0],b[1]);BL.push({v:v,r:b[2]*D,ci:ci});});});
  var V=dir(VORTEX[0],VORTEX[1]);
  for(var j=0;j<GH;j++){var th=(j+.5)/GH*Math.PI,st=Math.sin(th),ct=Math.cos(th);
   for(var i=0;i<GW;i++){var ph=(i+.5)/GW*Math.PI*2,x=-Math.cos(ph)*st,y=ct,z=Math.sin(ph)*st,k=i+j*GW;
    var wx=x+(fbm(x*1.7+3,y*1.7,z*1.7,3)-.5)*.5,wy=y+(fbm(x*1.7,y*1.7+8,z*1.7,3)-.5)*.5,wz=z+(fbm(x*1.7,y*1.7,z*1.7+13,3)-.5)*.5,wl=Math.hypot(wx,wy,wz),best=-2,ci=0;
    for(var q=0;q<BL.length;q++){var b=BL[q],d=Math.acos(Math.max(-1,Math.min(1,(wx*b.v[0]+wy*b.v[1]+wz*b.v[2])/wl))),f=1-d/b.r;if(f>best){best=f;ci=b.ci;}}
    var n=fbm(x*3.1+5,y*3.1,z*3.1,4),e=best*.9+(n-.5)*.7;
    var vd=Math.acos(Math.max(-1,Math.min(1,x*V[0]+y*V[1]+z*V[2])));if(vd<.2)e-=(.2-vd)*4;
    if(e<=0&&n>.71)e=.02; // scattered rocky islets
    E[k]=e;C[k]=ci;RG[k]=1-Math.abs(fbm(x*5+11,y*5,z*5,3)-.5)*2;}}
  // a soft land field (blurred mask) gives smooth, organic ripple lines out to sea, like an old chart
  var F=new Float32Array(N),F2=new Float32Array(N);for(k=0;k<N;k++)F[k]=E[k]>0?1:0;
  function blur(src,dst,r){for(var jj=0;jj<GH;jj++){var acc=0;for(var ii=-r;ii<=r;ii++)acc+=src[((ii+GW)%GW)+jj*GW];for(ii=0;ii<GW;ii++){dst[ii+jj*GW]=acc/(2*r+1);acc+=src[((ii+r+1)%GW)+jj*GW]-src[((ii-r+GW)%GW)+jj*GW];}}
   for(ii=0;ii<GW;ii++){acc=0;var col=[];for(jj=0;jj<GH;jj++)col.push(dst[ii+jj*GW]);for(jj=0;jj<GH;jj++){var s2=0,c2=0;for(var o=-r;o<=r;o++){var y2=jj+o;if(y2>=0&&y2<GH){s2+=col[y2];c2++;}}src[ii+jj*GW]=s2/c2;}}}
  for(var pass=0;pass<3;pass++)blur(F,F2,4);
  function bil(A,u,v){u=u*GW-.5;v=Math.max(0,Math.min(GH-1.001,v*GH-.5));var i0=Math.floor(u),j0=v|0,fu=u-i0,fv=v-j0,i1=((i0+1)%GW+GW)%GW;i0=(i0%GW+GW)%GW;
   return (A[i0+j0*GW]*(1-fu)+A[i1+j0*GW]*fu)*(1-fv)+(A[i0+(j0+1)*GW]*(1-fu)+A[i1+(j0+1)*GW]*fu)*fv;}
  var TW=1024,TH=512,cv=document.createElement('canvas');cv.width=TW;cv.height=TH;var x2=cv.getContext('2d'),img=x2.createImageData(TW,TH),a=img.data;
  for(j=0;j<TH;j++)for(i=0;i<TW;i++){var u0=(i+.5)/TW,v0=(j+.5)/TH,e2=bil(E,u0,v0),g=(i>>1)+(j>>1)*GW,p=(i+j*TW)*4,col,gr=(H(i,j,7)-.5)*12;
   if(e2<=0){var f=bil(F,u0,v0),ring=0;[.32,.17,.08,.03].forEach(function(l,n){if(Math.abs(f-l)<.006+n*.0015)ring=1;});
    col=[30+f*26,36+f*30,35+f*22];if(ring)col=[86,80,62];if(e2>-.035)col=[16,12,10];}
   else{var tt=TINT[LANDS[C[g]].k],sh=Math.min(1,e2*1.4);col=[tt[0]-sh*26,tt[1]-sh*26,tt[2]-sh*22];if(e2<.03)col=[58,42,26];}
   a[p]=col[0]+gr;a[p+1]=col[1]+gr;a[p+2]=col[2]+gr;a[p+3]=255;}
  x2.putImageData(img,0,0);
  // ink marks: mountains, woods and the vortex spiral
  var R=rng(11);x2.lineCap='round';
  for(var m=0;m<2600;m++){var u=R(),v=R(),gi=Math.min(GW-1,u*GW|0),gj=Math.min(GH-1,v*GH|0),gk=gi+gj*GW;if(E[gk]<=.08)continue;var X=u*TW,Y=v*TH,kind=LANDS[C[gk]].k;
   if(RG[gk]>.8){x2.strokeStyle='rgba(40,26,14,.85)';x2.lineWidth=1.3;x2.beginPath();x2.moveTo(X-4,Y+3);x2.lineTo(X,Y-3);x2.lineTo(X+4,Y+3);x2.stroke();x2.strokeStyle='rgba(40,26,14,.4)';x2.beginPath();x2.moveTo(X,Y-3);x2.lineTo(X+1.5,Y+3);x2.stroke();}
   else if((kind==='forest'||kind==='moss')&&R()<.5){x2.fillStyle='rgba(44,40,22,.55)';x2.beginPath();x2.arc(X,Y,1.6,0,6.3);x2.fill();}
   else if(kind==='ash'&&R()<.25){x2.fillStyle='rgba(120,40,20,.6)';x2.fillRect(X,Y,2,1);}
   else if(kind==='dust'&&R()<.3){x2.fillStyle='rgba(90,64,36,.45)';x2.fillRect(X,Y,2,1);}}
  var vx=(VORTEX[0]+180)/360*TW,vy=(90-VORTEX[1])/180*TH;x2.strokeStyle='rgba(180,138,208,.85)';x2.lineWidth=1.4;x2.beginPath();
  for(var r=0;r<1;r+=.01){var an=r*22,rad=r*22;x2.lineTo(vx+Math.cos(an)*rad,vy+Math.sin(an)*rad*.9);}x2.stroke();
  return cv;}

 // ---------- three.js scene ----------
 function build(){
  var T=window.THREE,W=stage.clientWidth,Hh=stage.clientHeight;
  if(W<600)dist=3.6;var ren=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:false});ren.setPixelRatio(Math.min(devicePixelRatio||1,1.75));ren.setSize(W,Hh,false);
  var cnv=ren.domElement;cnv.setAttribute('role','img');cnv.setAttribute('aria-label','A turning globe of the Rabblings world, with the vortex and floating islands');stage.insertBefore(cnv,stage.firstChild);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(34,W/Hh,.05,50);cam.position.set(0,0,dist);
  scene.add(new T.AmbientLight(0xb8a888,.62));var sun=new T.DirectionalLight(0xfff0d8,.75);sun.position.set(-3,2,3);scene.add(sun);
  var world=new T.Group();scene.add(world);
  var tex=new T.CanvasTexture(paint());tex.anisotropy=Math.min(4,ren.capabilities.getMaxAnisotropy());
  world.add(new T.Mesh(new T.SphereGeometry(1,96,64),new T.MeshLambertMaterial({map:tex})));
  scene.add(new T.Mesh(new T.SphereGeometry(1.018,64,40),new T.MeshBasicMaterial({color:0x0b0806,side:T.BackSide})));
  // vortex: three twisting funnels of violet
  var V=dir(VORTEX[0],VORTEX[1]),Vv=new T.Vector3(V[0],V[1],V[2]),vg=new T.Group();vg.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),Vv);vg.position.copy(Vv);world.add(vg);
  var funnels=[[.03,.12,.9,.3,.4],[.018,.07,.8,.5,-.7],[.01,.035,.7,.75,1.2]].map(function(f){
   var c=document.createElement('canvas');c.width=64;c.height=64;var x=c.getContext('2d'),gr=x.createLinearGradient(0,0,64,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,'+f[3]+')');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);
   var tx=new T.CanvasTexture(c);tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(3,1);
   var g=new T.CylinderGeometry(f[1],f[0],f[2],32,12,true);g.translate(0,f[2]/2,0);var P=g.attributes.position;for(var i=0;i<P.count;i++){var y=P.getY(i),k=y/f[2]*3,xx=P.getX(i),zz=P.getZ(i);P.setXYZ(i,xx*Math.cos(k)-zz*Math.sin(k),y,xx*Math.sin(k)+zz*Math.cos(k));}
   var m=new T.Mesh(g,new T.MeshBasicMaterial({map:tx,color:0xb48ad0,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));m.userData.sp=f[4];vg.add(m);return m;});
  // floating islands: parchment tops, ink undersides; the ones near the vortex hurry
  var R=rng(91),isl=[],Y=new T.Vector3(0,1,0);
  var T1=new T.Vector3(0,1,0).cross(Vv).normalize(),T2=Vv.clone().cross(T1).normalize();
  var topM=new T.MeshLambertMaterial({color:0xc4b088,flatShading:true}),undM=new T.MeshLambertMaterial({color:0x4a3a2a,flatShading:true}),ink=new T.MeshBasicMaterial({color:0x0b0806,side:T.BackSide});
  function island(sz){var g=new T.ConeGeometry(1,1.6,7,2);g.rotateX(Math.PI);g.translate(0,-.8,0);var P=g.attributes.position;for(var i=0;i<P.count;i++){if(P.getY(i)<-.05){P.setX(i,P.getX(i)*(.8+R()*.4));P.setZ(i,P.getZ(i)*(.8+R()*.4));}}g.computeVertexNormals();
   var grp=new T.Group(),body=new T.Mesh(g,undM),top=new T.Mesh(new T.CylinderGeometry(1,1,.08,7),topM),o=new T.Mesh(g,ink);top.position.y=.02;o.scale.setScalar(1.12);grp.add(o,body,top);grp.scale.setScalar(sz);world.add(grp);return grp;}
  for(var i=0;i<16;i++){var d=.12+R()*.7;isl.push({m:island(i<3?.03:.009+R()*.012),mode:'v',d:d,a:R()*6.28,w:(.05+R()*.1)/(.3+d)*(R()<.5?1:-1),alt:.06+(1-d)*.2+R()*.05,bob:R()*6.28});}
  for(i=0;i<30;i++){var st=new T.Vector3(R()-.5,R()-.5,R()-.5).normalize();if(st.dot(Vv)>.9)continue;isl.push({m:island(i<6?.026+R()*.016:.008+R()*.012),mode:'f',st:st,ax:new T.Vector3(R()-.5,R()-.5,R()-.5).normalize().projectOnPlane(st).normalize(),a:0,w:(.004+R()*.014)*(R()<.5?1:-1),alt:.04+R()*.08,bob:R()*6.28});}
  // stars, sparse and dim
  var sg=new T.BufferGeometry(),sp=[],SR=rng(5);for(i=0;i<500;i++){var v=new T.Vector3(SR()-.5,SR()-.5,SR()-.5).normalize().multiplyScalar(18+SR()*8);sp.push(v.x,v.y,v.z);}sg.setAttribute('position',new T.Float32BufferAttribute(sp,3));scene.add(new T.Points(sg,new T.PointsMaterial({color:0x8a7c66,size:.05})));

  // ---------- markers ----------
  var layer=document.getElementById('g-marks'),marks=[];
  function mark(lon,lat,cls,html,label,onclick){var b=document.createElement(onclick?'button':'span');if(onclick){b.type='button';b.addEventListener('click',onclick);b.setAttribute('aria-expanded','false');}else b.setAttribute('aria-hidden','true');
   b.className='gmark '+cls;b.innerHTML=html;if(label)b.setAttribute('aria-label',label);layer.appendChild(b);var p=dir(lon,lat);marks.push({b:b,v:new T.Vector3(p[0],p[1],p[2]),cls:cls});return b;}
  HOMES.forEach(function(h){var b=mark(h.at[0],h.at[1],'home','<img src="img/home-'+h.k+'-0.png" width="52" height="46" alt=""><span class="t">'+h.n+'</span>','Homeland of the '+h.n,function(){open(b,h.n,['Home: '+h.home+'.','Where the '+h.n+' live on the globe is not settled in the lore yet. This marker is a provisional placement for the website.'],'journal/'+h.k+'.html');});});
  var vb=mark(VORTEX[0],VORTEX[1]-6,'vx','The vortex','The vortex',function(){open(vb,'The vortex',['A vast magical vortex at a fixed point on the globe, reaching high into space. It amplifies magic and fluctuates without warning, with flashes, hums and sudden shifts in the islands.','Nobody is known to have reached its centre and returned.'],'lore.html#vortex');});
  LANDS.forEach(function(L){if(L.n)mark(L.lab[0],L.lab[1],'land name',L.n);});
  SEAS.forEach(function(S){mark(S[1],S[2],'sea name',S[0]);});
  var compact=stage.clientWidth<600,names=false,nb=document.getElementById('g-names');nb.setAttribute('aria-pressed',names);if(compact)stage.classList.add('compact');
  nb.addEventListener('click',function(){names=!names;nb.setAttribute('aria-pressed',names);});

  var cur=null;
  function open(b,title,lines,href){if(cur)cur.setAttribute('aria-expanded','false');cur=b;b.setAttribute('aria-expanded','true');
   card.querySelector('h3').textContent=title;var box=card.querySelector('.g-body');box.textContent='';lines.forEach(function(t){var p=document.createElement('p');p.textContent=t;box.appendChild(p);});
   var a=card.querySelector('a');a.href=href;a.textContent=/journal/.test(href)?'Read the journal entry':'Read more in the lore';card.hidden=false;spin=false;sb.setAttribute('aria-pressed','false');}
  function close(){card.hidden=true;if(cur){cur.setAttribute('aria-expanded','false');cur.focus();cur=null;}}
  card.querySelector('.x').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!card.hidden)close();});

  // ---------- controls: drag to turn, pinch or wheel to zoom ----------
  var yaw=-2.6,pitch=.3,vy=0,vp=0,spin=!reduce,ptr={},drag=null,pinch=null;
  var sb=document.getElementById('g-spin');sb.setAttribute('aria-pressed',spin);sb.addEventListener('click',function(){spin=!spin;sb.setAttribute('aria-pressed',spin);});
  document.getElementById('g-reset').addEventListener('click',function(){yaw=-2.6;pitch=.3;dist=stage.clientWidth<600?3.6:4.1;vy=vp=0;});
  cnv.addEventListener('pointerdown',function(e){ptr[e.pointerId]={x:e.clientX,y:e.clientY};cnv.setPointerCapture(e.pointerId);var k=Object.keys(ptr);if(k.length===1)drag={x:e.clientX,y:e.clientY};if(k.length===2){var a=ptr[k[0]],b=ptr[k[1]];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),dist:dist};drag=null;}spin=false;sb.setAttribute('aria-pressed','false');});
  cnv.addEventListener('pointermove',function(e){if(!ptr[e.pointerId])return;ptr[e.pointerId]={x:e.clientX,y:e.clientY};var k=Object.keys(ptr);
   if(pinch&&k.length===2){var a=ptr[k[0]],b=ptr[k[1]];dist=Math.max(1.8,Math.min(7,pinch.dist*pinch.d/Math.max(20,Math.hypot(a.x-b.x,a.y-b.y))));return;}
   if(drag){var s=2.4/stage.clientWidth*(dist/4.1),dx=(e.clientX-drag.x)*s,dy=(e.clientY-drag.y)*s;yaw+=dx;pitch=Math.max(-1.3,Math.min(1.3,pitch+dy));vy=dx;vp=dy;drag={x:e.clientX,y:e.clientY};}});
  function up(e){delete ptr[e.pointerId];if(Object.keys(ptr).length<2)pinch=null;if(!Object.keys(ptr).length)drag=null;}
  cnv.addEventListener('pointerup',up);cnv.addEventListener('pointercancel',up);
  cnv.addEventListener('wheel',function(e){e.preventDefault();dist=Math.max(1.8,Math.min(7,dist*(1+Math.sign(e.deltaY)*.08)));},{passive:false});

  function resize(){W=stage.clientWidth;Hh=stage.clientHeight;ren.setSize(W,Hh,false);cam.aspect=W/Hh;cam.updateProjectionMatrix();}
  addEventListener('resize',resize);
  var visible=true;if('IntersectionObserver'in window)new IntersectionObserver(function(en){visible=en[0].isIntersecting;}).observe(stage);
  var last=performance.now(),t0=last,tmp=new T.Vector3(),camDir=new T.Vector3(),q=new T.Quaternion();
  function frame(now){requestAnimationFrame(frame);if(!visible||document.hidden){last=now;return;}
   var dt=Math.min(.05,(now-last)/1000),t=(now-t0)/1000;last=now;
   if(spin)yaw+=dt*.08;if(!drag){yaw+=vy;pitch=Math.max(-1.3,Math.min(1.3,pitch+vp));vy*=.92;vp*=.92;}
   world.rotation.set(pitch,yaw,0,'XYZ');cam.position.set(0,0,dist);cam.lookAt(0,0,0);
   funnels.forEach(function(m){m.material.map.offset.x+=dt*m.userData.sp*.3;m.material.opacity=.75+Math.sin(t*2.1)*.15;});
   isl.forEach(function(o){if(!reduce)o.a+=o.w*dt;var dv;if(o.mode==='v'){var c=Math.cos(o.d),s=Math.sin(o.d);dv=Vv.clone().multiplyScalar(c).addScaledVector(T1,Math.cos(o.a)*s).addScaledVector(T2,Math.sin(o.a)*s).normalize();}else dv=o.st.clone().applyAxisAngle(o.ax,o.a);
    o.m.position.copy(dv).multiplyScalar(1+o.alt+Math.sin(t*.7+o.bob)*.006);q.setFromUnitVectors(Y,dv);o.m.quaternion.copy(q);});
   ren.render(scene,cam);
   world.updateMatrixWorld();camDir.copy(cam.position).normalize();
   marks.forEach(function(M){var nm=M.cls.indexOf('name')>=0;tmp.copy(M.v).applyMatrix4(world.matrixWorld);var face=tmp.dot(camDir);tmp.multiplyScalar(1.03).project(cam);
    var x=(tmp.x+1)/2*W,y=(1-tmp.y)/2*Hh,show=face>.2&&(!nm||names);M.b.style.opacity=show?Math.min(1,(face-.2)*4):0;M.b.style.visibility=show?'visible':'hidden';
    M.b.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) translate(-50%,-50%)';});}
  if(still)still.hidden=true;
  document.getElementById('g-status').textContent='Drag to turn the world. Pinch or scroll to zoom. Tap a marker to read about it.';
  requestAnimationFrame(frame);
  window.__globeReady=true;}
})();
