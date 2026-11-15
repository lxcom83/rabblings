// The account page: player name, the attempt-logging switch, logged Free Play attempts, high scores, delete everything.
// The game and this site share one origin, so the game's save (localStorage 'goblin-scramble') can be read here.
(function(){
 var $=function(id){return document.getElementById(id);};
 if(!window.RB||!$('a-in'))return;
 var RACES={goblin:'Goblins',swamp:'Swampfolk',imp:'Imps',fairy:'Fairies',dwarf:'Dwarves',rat:'Ratfolk',bone:'Skeletons',shroom:'Mushroom Folk'};
 var DIFF={easy:'Easy',normal:'Normal',hard:'Hard',wild:'Wild'},DIFFS=Object.keys(DIFF);
 var MAPS={},sb=null,me=null,logOn=null,logReady=false,loaded=null;
 var mapsReady=fetch('freeplay-maps.json').then(function(r){return r.ok?r.json():{};}).then(function(j){MAPS=j||{};}).catch(function(){});
 function say(id,t,bad){var e=$(id);e.textContent=t||'';e.className='msg'+(bad?' bad':'');}
 function save(){try{return JSON.parse(localStorage.getItem('goblin-scramble')||'{}')||{};}catch(e){return {};}}
 function when(t){var d=new Date(t);return isNaN(d)?'':d.toLocaleDateString(undefined,{day:'numeric',month:'short'})+' '+d.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'});}
 function mins(s){s=+s||0;return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
 function td(tr,text,cls){var c=document.createElement('td');c.textContent=text;if(cls)c.className=cls;tr.appendChild(c);return c;}
 function tag(text,cls){var s=document.createElement('span');s.className='tag '+cls;s.textContent=text;return s;}
 function sentKey(){return 'rabblings-log-sent-at:'+me.id;}
 function view(v){$('a-wait').hidden=v!=='wait';$('a-out').hidden=v!=='out';$('a-in').hidden=v!=='in';}
 $('a-signin').addEventListener('click',function(){RB.openSignIn();});

 // ---------- attempts ----------
 function cleanAttempt(a){
  if(!a||!/^[a-z0-9][a-z0-9_-]{0,31}$/.test(a.map)||!RACES[a.race]||DIFFS.indexOf(a.diff)<0||!a.at)return null;
  var n=function(v,max){v=Math.round(+v||0);return Math.max(0,Math.min(max,v));};
  return {map:a.map,race:a.race,clan:n(a.clan,7),diff:a.diff,classic:!!a.classic,pass:!!a.pass,saved:n(a.saved,999),need:n(a.need,999),sec:n(a.sec,86400),played_at:new Date(a.at).toISOString()};}
 function localAttempts(){var L=save().freeLog;return Array.isArray(L)?L:[];}
 function syncAttempts(quiet){
  if(!logOn){if(!quiet)say('a-log-msg','Logging is off, so nothing was sent.',true);return Promise.resolve(0);}
  var since=+RB.read(sentKey())||0,rows=localAttempts().filter(function(a){return (+a.at||0)>since;}).map(cleanAttempt).filter(Boolean);
  if(!rows.length){if(!quiet)say('a-log-msg','Nothing new to send from this device.');return Promise.resolve(0);}
  var top=Math.max.apply(null,localAttempts().map(function(a){return +a.at||0;}));
  return sb.from('mo_free_attempts').upsert(rows,{onConflict:'player_id,played_at,map,race',ignoreDuplicates:true}).then(function(r){
   if(r.error){if(RB.missing(r.error))say('a-log-msg','Attempt logging switches on with the next site update. Your notes stay safe in the game until then.');else say('a-log-msg',RB.friendly(r.error),true);return 0;}
   RB.store(sentKey(),String(top));say('a-log-msg','Sent '+rows.length+' attempt'+(rows.length===1?'':'s')+' from this device.');return rows.length;});}
 function drawAttempts(){
  var body=$('a-tries').tBodies[0],note=$('a-tries-note');
  var local=localAttempts();
  var q=sb?sb.from('mo_free_attempts').select('map,race,clan,diff,classic,pass,saved,need,sec,played_at').order('played_at',{ascending:false}).limit(300):null;
  return (q?q:Promise.resolve({data:[]})).then(function(r){
   var server=r.error?[]:(r.data||[]),missing=r.error&&RB.missing(r.error),seen={};
   server.forEach(function(a){seen[new Date(a.played_at).getTime()+a.map+a.race]=1;});
   var rows=server.map(function(a){return {a:a,at:new Date(a.played_at).getTime(),sent:1};});
   local.forEach(function(a){if(!seen[(+a.at)+a.map+a.race])rows.push({a:a,at:+a.at,sent:0});});
   rows.sort(function(x,y){return y.at-x.at;});
   body.textContent='';
   rows.slice(0,300).forEach(function(o){var a=o.a,tr=document.createElement('tr');
    td(tr,when(o.at));td(tr,MAPS[a.map]?MAPS[a.map]+' ('+a.map+')':a.map);td(tr,RACES[a.race]||a.race);
    td(tr,(DIFF[a.diff]||a.diff)+(a.classic?', classic':''));td(tr,a.saved+' / '+a.need,'num');td(tr,mins(a.sec),'num');
    td(tr,a.pass?'Passed':'Failed',a.pass?'pass':'fail');td(tr,'').appendChild(o.sent?tag('sent','sent'):tag('this device','local'));body.appendChild(tr);});
   if(!rows.length){var tr=document.createElement('tr'),c=td(tr,'No attempts logged yet. Try a Free Play map with a race that is not listed for it (unlock hidden races in Free Play).');c.colSpan=8;c.className='dim';body.appendChild(tr);}
   note.textContent=missing?'Only attempts saved on this device are shown: storing them online switches on with the next site update.':(r.error?'Could not load your stored attempts just now.':'');
  });}

 // ---------- scores ----------
 function levelName(key){
  var base=key.split('/')[0],m;
  if((m=base.match(/^free:([^:]+):([a-z]+)(:x)?$/)))return 'Free Play: '+(MAPS[m[1]]||m[1]);
  if((m=base.match(/^war(\d+)$/)))return 'Combat Trial '+(+m[1]+1);
  if(base.indexOf('map:')===0)return 'Custom: '+base.slice(4);
  if((m=base.match(/^([a-z]*)(\d+)$/)))return (RACES[m[1]||'goblin']||m[1])+' campaign, map '+(+m[2]+1);
  return base;}
 function localScores(){var S=save().scores||{},out=[];Object.keys(S).forEach(function(k){var s=S[k];if(s&&typeof s.score==='number')out.push({key:k,s:s});});out.sort(function(a,b){return b.s.score-a.s.score;});return out;}
 function drawScores(){
  var body=$('a-scores').tBodies[0],list=localScores();
  var q=sb.from('mo_scores').select('level_key,score').eq('player_id',me.id);
  return q.then(function(r){var posted={};(r.data||[]).forEach(function(x){posted[x.level_key]=x.score;});
   body.textContent='';
   list.forEach(function(o){var tr=document.createElement('tr'),s=o.s;
    td(tr,levelName(o.key));td(tr,RACES[s.race]||s.race||'');td(tr,(DIFF[s.diff]||s.diff||'')+(s.classic?', classic':''));td(tr,String(s.score),'num');
    var p=posted[o.key];td(tr,'').appendChild(p==null?tag('not yet','local'):tag(p>=s.score?'posted':'older score','sent'));body.appendChild(tr);});
   if(!list.length){var tr=document.createElement('tr'),c=td(tr,'No scores in this browser yet. Finish a map in the game and come back.');c.colSpan=5;c.className='dim';body.appendChild(tr);}
   $('a-scores-note').textContent=r.error&&RB.missing(r.error)?'Posting scores switches on with the next site update.':'';
   $('a-post').disabled=!list.length||!!(r.error&&RB.missing(r.error));});}
 $('a-post').addEventListener('click',function(){
  var rows=localScores().filter(function(o){return o.key.length<=80&&RACES[o.s.race]&&DIFFS.indexOf(o.s.diff)>=0;}).map(function(o){return {level_key:o.key,score:Math.max(0,Math.min(1e7,Math.round(o.s.score))),race:o.s.race,diff:o.s.diff,classic:!!o.s.classic,set_at:new Date(o.s.at||Date.now()).toISOString()};});
  if(!rows.length){say('a-post-msg','No scores to post.',true);return;}
  say('a-post-msg','Posting…');
  sb.from('mo_scores').upsert(rows,{onConflict:'player_id,level_key'}).then(function(r){
   if(r.error){say('a-post-msg',RB.missing(r.error)?'Posting scores switches on with the next site update.':RB.friendly(r.error),true);return;}
   say('a-post-msg','Posted '+rows.length+' score'+(rows.length===1?'':'s')+'. A lower score never replaces a higher one.');drawScores();});});

 // ---------- logging switch ----------
 function setLog(on){logOn=on;$('a-log').checked=!!on;RB.store(RB.LOG_KEY,on?'1':'0');$('a-sync').disabled=!on;
  $('a-log-label').textContent=on?'Logging is on: attempts are sent when you visit this page':'Logging is off: notes stay on this device. Switch it on to help test which races can beat each map';}
 $('a-log').addEventListener('change',function(){var on=this.checked;say('a-log-msg','Saving…');
  sb.from('profiles').update({log_attempts:on}).eq('id',me.id).then(function(r){
   if(r.error){$('a-log').checked=!on;say('a-log-msg',RB.missing(r.error)?'This switch works after the next site update.':RB.friendly(r.error),true);return;}
   setLog(on);say('a-log-msg',on?'Logging is on. Thank you.':'Logging is off. Nothing more will be sent.');if(on)syncAttempts(true).then(drawAttempts);});});
 $('a-sync').addEventListener('click',function(){syncAttempts(false).then(drawAttempts);});
 $('a-clear').addEventListener('click',function(){if(!confirm('Delete every attempt you have sent? The notes in your game save on this device stay.'))return;
  sb.from('mo_free_attempts').delete().eq('player_id',me.id).then(function(r){
   if(r.error){say('a-log-msg',RB.missing(r.error)?'There is nothing stored online yet.':RB.friendly(r.error),true);return;}
   var top=Math.max(0,Math.max.apply(null,localAttempts().map(function(a){return +a.at||0;})));RB.store(sentKey(),String(top));
   say('a-log-msg','Your logged attempts are deleted. Older notes on this device will not be sent again.');drawAttempts();});});

 // ---------- name, sign out, delete ----------
 $('a-name-form').addEventListener('submit',function(e){e.preventDefault();say('a-name-msg','Saving…');RB.saveName($('a-name').value).then(function(){say('a-name-msg','Saved. This name now shows in every Rabblings game.');}).catch(function(err){say('a-name-msg',err.message,true);});});
 $('a-signout').addEventListener('click',function(){RB.signOut();});
 $('a-del').addEventListener('click',function(){$('a-del-confirm').hidden=false;$('a-del-yes').focus();});
 $('a-del-no').addEventListener('click',function(){$('a-del-confirm').hidden=true;});
 $('a-del-yes').addEventListener('click',function(){say('a-out-msg','Deleting…');RB.deleteAll().then(function(){view('out');var p=document.createElement('p');p.className='msg';p.textContent='Your account and everything linked to it have been deleted.';$('a-out').appendChild(p);}).catch(function(e){say('a-out-msg',e.message,true);});});

 // ---------- start ----------
 function show(u){
  if(!u){me=null;view('out');return;}
  if(me&&me.id===u.id)return;me=u;view('in');$('a-email').textContent=u.email||'';$('a-del-confirm').hidden=true;
  Promise.all([RB.client(),mapsReady]).then(function(v){var c=v[0];sb=c;
   RB.loadName().then(function(n){$('a-name').value=n;}).catch(function(){say('a-name-msg','Could not load your profile. Try again in a moment.',true);});
   return sb.rpc('my_log_attempts');}).then(function(r){
   if(r.error){$('a-log').disabled=true;$('a-sync').disabled=true;$('a-clear').disabled=true;$('a-log-label').textContent='Log my Free Play attempts';say('a-log-msg',RB.missing(r.error)?'Attempt logging switches on with the next site update. Until then nothing is sent.':RB.friendly(r.error),!RB.missing(r.error));return drawAttempts();}
   setLog(!!r.data);return syncAttempts(true).then(drawAttempts);}).then(drawScores).catch(function(e){say('a-log-msg',RB.friendly(e),true);});}
 view('wait');
 RB.onChange(show);
 if(!RB.known())RB.user().then(show).catch(function(){view('out');});
})();
