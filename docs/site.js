// Small things every page shares. Each part checks for its elements, and pages read fine if this never runs.
(function(){
 var $=function(id){return document.getElementById(id);};

 // phone menu
 var top=document.querySelector('.top'),mb=$('menu-btn');
 if(top&&mb){mb.addEventListener('click',function(){var o=top.classList.toggle('open');mb.setAttribute('aria-expanded',o);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&top.classList.contains('open')){top.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.focus();}});}

 // everyone joins the march along the ink line
 var m=$('march'),R=window.RACE_DATA||[];
 if(m&&R.length){var n=0;R.forEach(function(r){[0,1].forEach(function(k){var t=document.createElement('div');t.className='trooper';t.style.backgroundImage='url(img/walk-'+r.k+'-'+k+'.png)';var dur=22+(n%5)*2.4;t.style.setProperty('--t',dur+'s');t.style.setProperty('--d',-(n*3.1%dur).toFixed(1)+'s');t.style.setProperty('--i',n);m.appendChild(t);n++;});});}

 // ink drawings made later fill their plates: build.py lists the files that exist in img/journal/list.json
 (function(){var slots=document.querySelectorAll('[data-art]');if(!slots.length||!window.fetch)return;
  var me=document.querySelector('script[src$="site.js"]'),base=me?new URL('.',me.src).href:'';
  fetch(base+'img/journal/list.json').then(function(r){return r.ok?r.json():[];}).then(function(list){
   slots.forEach(function(s){var f=s.getAttribute('data-art');if(list.indexOf(f)<0)return;var i=new Image();i.alt=s.getAttribute('data-alt')||'';i.decoding='async';
    i.onload=function(){var art=s.querySelector('.art')||s,w=art.querySelector('.await');if(w)w.remove();if(s.classList.contains('banner')){i.className='banner';s.replaceWith(i);}else{art.appendChild(i);s.classList.remove('pending');}};
    i.src=base+'img/journal/'+f;});}).catch(function(){});
 })();

 // install button: shows when the browser can install the game, or a tip on iPhone and iPad
 (function(){var b=$('install'),tip=$('install-tip'),ev=null;if(!b||!tip)return;
  var solo=matchMedia('(display-mode: standalone)').matches||navigator.standalone;if(solo)return;
  addEventListener('beforeinstallprompt',function(e){e.preventDefault();ev=e;b.hidden=false;tip.hidden=false;});
  addEventListener('appinstalled',function(){ev=null;b.hidden=true;tip.textContent='Installed. Rabblings now opens from your desktop or home screen, even offline.';});
  b.addEventListener('click',function(){if(!ev)return;ev.prompt();ev.userChoice.then(function(r){if(r.outcome==='accepted')b.hidden=true;ev=null;});});
  if(/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)){tip.textContent='Play offline: tap Share, then Add to Home Screen.';tip.hidden=false;}
 })();

 // tester feedback: saved to the database when signed in, or a block to copy when signed out
 (function(){var f=$('fb-form');if(!f||!window.RB)return;
  var msg=$('fb-msg'),out=$('fb-out'),copy=$('fb-copy'),who=$('fb-who'),send=$('fb-send');
  function say(t,bad){msg.textContent=t||'';msg.className='msg'+(bad?' bad':'');}
  function kind(){var k=f.querySelector('input[name=fb-kind]:checked');return k?k.value:'other';}
  function device(){return (navigator.userAgent||'').slice(0,280);}
  function block(){return 'Rabblings tester feedback\nType: '+kind()+'\nPage: '+location.pathname+'\nDevice: '+device()+'\nWhen: '+new Date().toISOString().slice(0,16).replace('T',' ')+' UTC\n\n'+$('fb-text').value.trim();}
  RB.onChange(function(u){who.textContent=u?'Your note goes straight to the owner, signed with your player name.':'You are not signed in, so we cannot store your note. Write it here, press the button, and copy the text into an email to support@rabblings.com or the Discord.';send.textContent=u?'Send feedback':'Make copyable text';});
  copy.addEventListener('click',function(){var t=out.textContent;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){copy.textContent='Copied';setTimeout(function(){copy.textContent='Copy text';},1600);}).catch(function(){var r=document.createRange();r.selectNodeContents(out);var s=getSelection();s.removeAllRanges();s.addRange(r);});});
  f.addEventListener('submit',function(e){e.preventDefault();var text=$('fb-text').value.trim();
   if(text.length<5){say('Write a few more words first.',true);return;}
   function offline(note){out.textContent=block();$('fb-copywrap').hidden=false;say(note||'');}
   if(RB.known()&&!RB.current()){offline('Here is your note, ready to copy.');return;}
   send.disabled=true;say('Sending…');
   RB.user().then(function(u){if(!u)return {error:{code:'signed-out'}};return RB.client().then(function(c){return c.from('site_feedback').insert({kind:kind(),message:text.slice(0,4000),page:location.pathname.slice(0,200),device:device()});});}).then(function(r){send.disabled=false;
    if(r.error){if(r.error.code==='signed-out')offline('Here is your note, ready to copy.');else if(RB.missing(r.error))offline('Feedback storage is not switched on yet, so here is your note to copy instead.');else say(RB.friendly(r.error),true);return;}
    f.reset();$('fb-copywrap').hidden=true;say('Thank you. Your note is in the pile, and it will be read.');}).catch(function(err){send.disabled=false;offline(RB.friendly(err)+' Here is your note to copy instead.');});});
 })();

 // home page: the three most liked community maps
 (function(){var box=$('top-maps');if(!box||!window.RB)return;
  RB.rest('site_maps?select=id,title,designer,votes&order=votes.desc,created_at.desc&limit=3').then(function(rows){
   if(!rows||!rows.length)return;var r={data:rows},ul=document.createElement('ul');ul.className='older';ul.style.cssText='list-style:none;padding:0;display:flex;flex-direction:column;gap:6px';
   r.data.forEach(function(m){var li=document.createElement('li'),a=document.createElement('a');a.href='maps.html#m-'+m.id;a.textContent=m.title;li.appendChild(a);li.appendChild(document.createTextNode(' by '+m.designer+' · '+m.votes+' thumbs up'));ul.appendChild(li);});
   box.textContent='';box.appendChild(ul);}).catch(function(){});
 })();
})();
