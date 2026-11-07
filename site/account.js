// Player accounts, shared by the website and every Rabblings game.
// Sign in by email link, choose a player name, sign out or delete the account.
// The Supabase library only loads when it is needed, so the rest of the page never waits for it.
(function(){
 var URL_='https://fstpymozoxfnwfgkzuay.supabase.co',KEY='sb_publishable_gaPE_7-5wvqtwElBBrgdCw_fPjNkZc3',LIB='vendor/supabase-2.118.0.js';
 var NAME_KEY='rabblings-player-name',NAME_RE=/^[A-Za-z0-9][A-Za-z0-9 _.'-]{1,23}$/;
 var $=function(id){return document.getElementById(id);},btn=$('acct-btn'),dlg=$('acct'),sb=null,user=null,loading=null;
 if(!btn||!dlg)return;
 function store(k,v){try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){}}
 function read(k){try{return localStorage.getItem(k);}catch(e){return null;}}
 function hasSession(){try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('sb-')===0&&k.indexOf('-auth-token')>0)return true;}}catch(e){}return false;}
 function view(name){['out','sent','in','wait'].forEach(function(v){$('acct-'+v).hidden=v!==name;});}
 function say(id,text,bad){var e=$(id);e.textContent=text||'';e.className='acct-msg'+(bad?' bad':'');}
 function friendly(e){var m=String(e&&e.message||e||'');if(/rate|limit|seconds/i.test(m))return 'Too many sign-in emails just now. Wait a few minutes and try again.';if(/fetch|network|load/i.test(m))return 'Could not reach the sign-in service. Check your connection and try again.';return m||'Something went wrong. Try again.';}
 function label(){var n=read(NAME_KEY);btn.textContent=user?(n||'My account'):'Sign in';}

 function load(){
  if(sb)return Promise.resolve(sb);
  if(loading)return loading;
  loading=new Promise(function(ok,fail){var s=document.createElement('script');s.src=LIB;s.onload=function(){
    sb=window.supabase.createClient(URL_,KEY,{auth:{flowType:'implicit',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    sb.auth.onAuthStateChange(function(ev,session){user=session?session.user:null;if(ev==='SIGNED_OUT')store(NAME_KEY,null);label();});
    ok(sb);};s.onerror=function(){loading=null;fail(new Error('Could not load the sign-in code. Check your connection and try again.'));};document.head.appendChild(s);});
  return loading;}

 function refresh(){
  view('wait');
  return load().then(function(c){return c.auth.getSession();}).then(function(r){
   user=r.data.session?r.data.session.user:null;label();
   if(!user){view('out');return;}
   $('acct-email').textContent=user.email||'';view('in');say('acct-in-msg','');$('acct-del-confirm').hidden=true;
   return sb.from('profiles').select('display_name').eq('id',user.id).maybeSingle().then(function(p){
    if(p.error){say('acct-in-msg','Could not load your profile. Try again in a moment.',true);return;}
    var n=p.data&&p.data.display_name||'';$('acct-name').value=n;store(NAME_KEY,n||null);label();});
  }).catch(function(e){view('out');say('acct-out-msg',e.message,true);});}

 function open(){if(typeof dlg.showModal==='function'){if(!dlg.open)dlg.showModal();}else dlg.setAttribute('open','');return refresh();}
 btn.addEventListener('click',open);
 $('acct-close').addEventListener('click',function(){dlg.close?dlg.close():dlg.removeAttribute('open');});

 $('acct-send').addEventListener('submit',function(e){
  e.preventDefault();var email=$('acct-addr').value.trim(),b=$('acct-send-btn');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){say('acct-out-msg','That email address does not look right.',true);return;}
  b.disabled=true;say('acct-out-msg','Sending...');
  load().then(function(c){return c.auth.signInWithOtp({email:email,options:{emailRedirectTo:location.origin+'/'}});}).then(function(r){
   b.disabled=false;
   if(r.error){say('acct-out-msg',friendly(r.error),true);return;}
   $('acct-sent-to').textContent=email;view('sent');
  }).catch(function(err){b.disabled=false;say('acct-out-msg',friendly(err),true);});});
 $('acct-again').addEventListener('click',function(){view('out');say('acct-out-msg','');});

 $('acct-save').addEventListener('submit',function(e){
  e.preventDefault();var n=$('acct-name').value.trim().replace(/\s+/g,' ');
  if(!NAME_RE.test(n)){say('acct-in-msg','Use 2 to 24 letters, numbers, spaces or - _ . \' and start with a letter or number.',true);return;}
  say('acct-in-msg','Saving...');
  sb.from('profiles').update({display_name:n,updated_at:new Date().toISOString()}).eq('id',user.id).select('display_name').then(function(r){
   if(r.error){say('acct-in-msg',r.error.code==='23505'?'Somebody already uses that name. Try another.':'Could not save your name. Try again in a moment.',true);return;}
   if(!r.data||!r.data.length){say('acct-in-msg','Could not save your name. Sign out and in again, then try once more.',true);return;}
   store(NAME_KEY,n);label();say('acct-in-msg','Saved. This name now shows in every Rabblings game.');});});

 $('acct-signout').addEventListener('click',function(){sb.auth.signOut().then(function(){user=null;store(NAME_KEY,null);label();view('out');say('acct-out-msg','You are signed out.');});});
 $('acct-del').addEventListener('click',function(){$('acct-del-confirm').hidden=false;});
 $('acct-del-no').addEventListener('click',function(){$('acct-del-confirm').hidden=true;});
 $('acct-del-yes').addEventListener('click',function(){
  say('acct-in-msg','Deleting...');
  sb.rpc('delete_my_account').then(function(r){
   if(r.error){say('acct-in-msg','Could not delete your account. Try again in a moment.',true);return;}
   return sb.auth.signOut({scope:'local'}).then(function(){user=null;store(NAME_KEY,null);label();view('out');say('acct-out-msg','Your account has been deleted.');});});});

 // back from an email link, or signed in before: check quietly so the menu shows the right name
 label();
 var hashErr=(location.hash.match(/error_description=([^&]+)/)||[])[1];
 if(/access_token=|error_description=/.test(location.hash)){load().then(open).then(function(){if(hashErr&&!user)say('acct-out-msg',/expired|invalid/i.test(decodeURIComponent(hashErr.replace(/\+/g,' ')))?'That sign-in link has expired or was already used. Send yourself a new one.':'Sign-in did not work. Send yourself a new link.',true);});}
 else if(hasSession()){load().then(function(c){return c.auth.getSession();}).then(function(r){user=r.data.session?r.data.session.user:null;label();}).catch(function(){});}
})();
