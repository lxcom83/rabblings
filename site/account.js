// Player accounts, shared by the website and every Rabblings game.
// Sign in by email link, choose a player name, sign out or delete the account.
// The Supabase library only loads when it is needed, so the rest of the page never waits for it.
// Other scripts use window.RB: RB.client(), RB.user(), RB.onChange(fn), RB.openSignIn(), RB.missing(err).
(function(){
 var URL_='https://fstpymozoxfnwfgkzuay.supabase.co',KEY='sb_publishable_gaPE_7-5wvqtwElBBrgdCw_fPjNkZc3';
 var me=document.currentScript,BASE=me?new URL('.',me.src).href:location.origin+'/',LIB=BASE+'vendor/supabase-2.118.0.js';
 var NAME_KEY='rabblings-player-name',LOG_KEY='rabblings-log-attempts',NAME_RE=/^[A-Za-z0-9][A-Za-z0-9 _.'-]{1,23}$/;
 var sb=null,user=null,loading=null,known=false,subs=[],dlg=null;
 var $=function(id){return document.getElementById(id);};
 function store(k,v){try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){}}
 function read(k){try{return localStorage.getItem(k);}catch(e){return null;}}
 function hasSession(){try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('sb-')===0&&k.indexOf('-auth-token')>0)return true;}}catch(e){}return false;}
 function friendly(e){var m=String(e&&e.message||e||'');if(/rate|limit|seconds|too many/i.test(m))return 'Too many tries just now. Wait a few minutes and try again.';if(/fetch|network|load/i.test(m))return 'Could not reach the server. Check your connection and try again.';return m||'Something went wrong. Try again.';}
 // the database tables for a feature are not there yet (the migration has not been run)
 function missing(e){if(!e)return false;var c=String(e.code||''),m=String(e.message||'');return c==='42P01'||c==='PGRST205'||c==='PGRST202'||c==='42703'||c==='PGRST204'||/does not exist|schema cache|Could not find/i.test(m);}
 function emit(){label();subs.forEach(function(f){try{f(user);}catch(e){}});}
 function label(){var b=$('acct-btn');if(!b)return;var n=read(NAME_KEY);b.textContent=user?(n||'My account'):'Sign in';b.setAttribute('aria-haspopup',user?'false':'dialog');}

 function load(){
  if(sb)return Promise.resolve(sb);
  if(loading)return loading;
  loading=new Promise(function(ok,fail){var s=document.createElement('script');s.src=LIB;s.onload=function(){
    sb=window.supabase.createClient(URL_,KEY,{auth:{flowType:'implicit',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    sb.auth.onAuthStateChange(function(ev,session){var was=user&&user.id;user=session?session.user:null;known=true;if(ev==='SIGNED_OUT'){store(NAME_KEY,null);store(LOG_KEY,null);}if((user&&user.id)!==was)emit();else label();});
    ok(sb);};s.onerror=function(){loading=null;fail(new Error('Could not load the sign-in code. Check your connection and try again.'));};document.head.appendChild(s);});
  return loading;}
 function getUser(){return load().then(function(c){return c.auth.getSession();}).then(function(r){user=r.data.session?r.data.session.user:null;known=true;label();return user;});}

 // shared actions, used by the dialog and the account page
 function loadName(){return sb.from('profiles').select('display_name').eq('id',user.id).maybeSingle().then(function(p){if(p.error)throw p.error;var n=p.data&&p.data.display_name||'';store(NAME_KEY,n||null);label();return n;});}
 function saveName(raw){var n=String(raw||'').trim().replace(/\s+/g,' ');
  if(!NAME_RE.test(n))return Promise.reject(new Error('Use 2 to 24 letters, numbers, spaces or - _ . \' and start with a letter or number.'));
  return sb.from('profiles').update({display_name:n,updated_at:new Date().toISOString()}).eq('id',user.id).select('display_name').then(function(r){
   if(r.error)throw new Error(r.error.code==='23505'?'Somebody already uses that name. Try another.':'Could not save your name. Try again in a moment.');
   if(!r.data||!r.data.length)throw new Error('Could not save your name. Sign out and in again, then try once more.');
   store(NAME_KEY,n);label();return n;});}
 function signOut(){return sb.auth.signOut().then(function(){user=null;store(NAME_KEY,null);store(LOG_KEY,null);emit();});}
 function deleteAll(){return sb.rpc('delete_my_account').then(function(r){if(r.error)throw new Error('Could not delete your account. Try again in a moment.');
   return sb.auth.signOut({scope:'local'}).then(function(){user=null;store(NAME_KEY,null);store(LOG_KEY,null);emit();});});}
 function sendLink(email){
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return Promise.reject(new Error('That email address does not look right.'));
  return load().then(function(c){return c.auth.signInWithOtp({email:email,options:{emailRedirectTo:location.origin+'/'}});}).then(function(r){if(r.error)throw new Error(friendly(r.error));});}

 // ---------- the sign-in dialog, built here so every page shares one copy ----------
 function el(tag,attrs,kids){var e=document.createElement(tag);for(var k in attrs){if(k==='text')e.textContent=attrs[k];else e.setAttribute(k,attrs[k]);}(kids||[]).forEach(function(c){e.appendChild(typeof c==='string'?document.createTextNode(c):c);});return e;}
 function buildDialog(){
  if(dlg)return dlg;
  dlg=el('dialog',{'class':'acct',id:'acct','aria-labelledby':'acct-title'});
  dlg.innerHTML=
  '<div class="leaf"><div class="acct-head"><h2 id="acct-title">Your account</h2><button class="acct-x" id="acct-close" type="button" aria-label="Close">&times;</button></div>'+
  '<div id="acct-wait"><p>One moment&hellip;</p></div>'+
  '<div id="acct-out" hidden class="form"><p>Sign in or make an account with just your email. We send you a link, so there is no password to remember.</p>'+
   '<form id="acct-send" class="form"><div class="field"><label for="acct-addr">Email address</label><input id="acct-addr" type="email" autocomplete="email" required placeholder="you@example.com"></div>'+
   '<button class="btn go" id="acct-send-btn" type="submit">Send my link</button></form><p class="msg" id="acct-out-msg" aria-live="polite"></p></div>'+
  '<div id="acct-sent" hidden class="form"><p>Check your email. We sent a sign-in link to <strong id="acct-sent-to"></strong>.</p>'+
   '<p class="acct-small">Open it on this device to sign in here. It works once. If nothing arrives in a few minutes, check your spam folder.</p>'+
   '<button class="btn small" id="acct-again" type="button">Use another email</button></div>'+
  '<div id="acct-in" hidden class="form"><p>Signed in as <strong id="acct-email"></strong>.</p>'+
   '<form id="acct-save" class="form"><div class="field"><label for="acct-name">Player name</label><input id="acct-name" type="text" maxlength="24" autocomplete="nickname" placeholder="Shown in every Rabblings game"></div>'+
   '<button class="btn" type="submit">Save name</button></form><p class="msg" id="acct-in-msg" aria-live="polite"></p>'+
   '<div class="row"><a class="btn small" href="'+BASE+'account.html">Account page</a><button class="btn small" id="acct-signout" type="button">Sign out</button></div></div>'+
  '<p class="acct-small"><a href="'+BASE+'privacy.html">What we store, and why</a></p></div>';
  document.body.appendChild(dlg);
  function view(name){['out','sent','in','wait'].forEach(function(v){$('acct-'+v).hidden=v!==name;});}
  function say(id,text,bad){var e=$(id);e.textContent=text||'';e.className='msg'+(bad?' bad':'');}
  dlg.view=view;dlg.say=say;
  $('acct-close').addEventListener('click',function(){dlg.close?dlg.close():dlg.removeAttribute('open');});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close();});
  $('acct-send').addEventListener('submit',function(e){e.preventDefault();var email=$('acct-addr').value.trim(),b=$('acct-send-btn');b.disabled=true;say('acct-out-msg','Sending…');
   sendLink(email).then(function(){b.disabled=false;$('acct-sent-to').textContent=email;view('sent');}).catch(function(err){b.disabled=false;say('acct-out-msg',friendly(err),true);});});
  $('acct-again').addEventListener('click',function(){view('out');say('acct-out-msg','');});
  $('acct-save').addEventListener('submit',function(e){e.preventDefault();say('acct-in-msg','Saving…');saveName($('acct-name').value).then(function(){say('acct-in-msg','Saved. This name now shows in every Rabblings game.');}).catch(function(err){say('acct-in-msg',err.message,true);});});
  $('acct-signout').addEventListener('click',function(){signOut().then(function(){view('out');say('acct-out-msg','You are signed out.');});});
  return dlg;}
 function openSignIn(){var d=buildDialog();if(typeof d.showModal==='function'){if(!d.open)d.showModal();}else d.setAttribute('open','');
  d.view('wait');
  return getUser().then(function(u){if(!u){d.view('out');return;}$('acct-email').textContent=u.email||'';d.view('in');d.say('acct-in-msg','');
    return loadName().then(function(n){$('acct-name').value=n;}).catch(function(){d.say('acct-in-msg','Could not load your profile. Try again in a moment.',true);});})
   .catch(function(e){d.view('out');d.say('acct-out-msg',friendly(e),true);});}

 // public reads without loading the library: RB.rest('site_maps?select=id,title&limit=3')
 function rest(q){var c=window.AbortController?new AbortController():null,t=c&&setTimeout(function(){c.abort();},8000);return fetch(URL_+'/rest/v1/'+q,{headers:{apikey:KEY,Accept:'application/json'},signal:c&&c.signal}).then(function(r){return r.text().then(function(x){var j=null;try{j=x?JSON.parse(x):null;}catch(_){}if(!r.ok||j===null&&x){var e=new Error(j&&j.message||'Could not reach the server');e.code=j&&j.code;throw e;}return j;});},function(){throw new Error('Could not reach the server');}).finally(function(){if(t)clearTimeout(t);});}
 window.RB={base:BASE,rest:rest,client:load,user:getUser,current:function(){return user;},known:function(){return known;},onChange:function(f){subs.push(f);if(known)try{f(user);}catch(e){}},
  openSignIn:openSignIn,missing:missing,friendly:friendly,loadName:loadName,saveName:saveName,signOut:signOut,deleteAll:deleteAll,sendLink:sendLink,store:store,read:read,LOG_KEY:LOG_KEY};

 // header button: open the dialog when signed out, go to the account page when signed in
 var btn=$('acct-btn');
 if(btn)btn.addEventListener('click',function(){if(user&&!/account\.html$/.test(location.pathname))location.href=BASE+'account.html';else openSignIn();});

 // back from an email link, or signed in before: check quietly so the menu shows the right name
 label();
 var hashErr=(location.hash.match(/error_description=([^&]+)/)||[])[1];
 if(/access_token=|error_description=/.test(location.hash)){load().then(openSignIn).then(function(){if(hashErr&&!user)dlg.say('acct-out-msg',/expired|invalid/i.test(decodeURIComponent(hashErr.replace(/\+/g,' ')))?'That sign-in link has expired or was already used. Send yourself a new one.':'Sign-in did not work. Send yourself a new link.',true);});}
 else if(hasSession()){getUser().then(function(){emit();}).catch(function(){known=true;emit();});}
 else known=true;
})();
