// race slideshow and the marching rabble. The page reads fine if this does not run
(function(){
 var R=window.RACE_DATA||[],i=0,c=0,$=function(id){return document.getElementById(id);};
 if(!R.length)return;
 try{var h=location.hash.slice(1);R.forEach(function(r,n){if(r.k===h)i=n;});}catch(e){}
 function nice(s){return s.charAt(0)+s.slice(1).toLowerCase();}
 function show(){var r=R[i],cl=r.clans[c];
  $('r-shot').src='img/shot-'+r.k+'.png';$('r-shot').alt='Gameplay screenshot of the '+nice(r.n);
  $('r-name').textContent=r.n;$('r-like').textContent=nice(r.like);
  $('r-good').textContent='+ '+nice(r.good);$('r-bad').textContent='- '+nice(r.bad);$('r-world').textContent='Home: '+nice(r.home);
  var s=$('r-skills');s.textContent='';if(r.skills.length)r.skills.forEach(function(k){var l=document.createElement('li');l.textContent=nice(k.n);l.title=k.d;s.appendChild(l);});else{var l=document.createElement('li');l.textContent='Classic skills, more troops';s.appendChild(l);}
  var b=$('r-clans');b.textContent='';r.clans.forEach(function(k,n){var e=document.createElement('button');e.type='button';e.className='clan';e.textContent=nice(k.name);e.setAttribute('aria-pressed',n===c);e.onclick=function(){c=n;show();};b.appendChild(e);});
  $('r-perk').textContent=nice(cl.perk);
  $('r-sprite').style.backgroundImage='url(img/walk-'+r.k+'-'+c+'.png)';$('r-home').src='img/home-'+r.k+'-'+c+'.png';$('r-home').alt=nice(r.n)+' home building';$('r-stage').style.backgroundImage='url(img/bg-'+r.k+'.png)';
  [].forEach.call($('dots').children,function(d,n){d.setAttribute('aria-current',n===i);});}
 function go(d){i=(i+d+R.length)%R.length;c=0;show();}
 R.forEach(function(r,n){var d=document.createElement('button');d.type='button';d.className='dot';d.style.backgroundImage='url(img/home-'+r.k+'-0.png)';d.setAttribute('aria-label',nice(r.n));d.onclick=function(){i=n;c=0;show();};$('dots').appendChild(d);});
 $('prev').onclick=function(){go(-1);};$('next').onclick=function(){go(1);};
 var sh=$('show');sh.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){go(-1);e.preventDefault();}if(e.key==='ArrowRight'){go(1);e.preventDefault();}});
 var sx=null;sh.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});sh.addEventListener('touchend',function(e){if(sx===null)return;var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)go(d<0?1:-1);sx=null;},{passive:true});
 show();
 // everyone joins the march
 var m=$('march'),n=0;R.forEach(function(r){[0,1].forEach(function(k){var t=document.createElement('div');t.className='trooper';t.style.backgroundImage='url(img/walk-'+r.k+'-'+k+'.png)';var dur=20+(n%5)*2.2;t.style.setProperty('--t',dur+'s');t.style.setProperty('--d',-(n*2.9%dur).toFixed(1)+'s');t.style.setProperty('--i',n);m.appendChild(t);n++;});});
})();
