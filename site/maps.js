// Community maps: a list of links to map files and packs kept on players' own storage, with thumbs-up votes.
// Public reading uses plain REST calls; the Supabase library only loads for signed-in actions.
(function(){
 var $=function(id){return document.getElementById(id);};
 if(!window.RB||!$('m-list'))return;
 var PAGE=24,offset=0,rows=[],mine={},me=null,off=false,editing=null,timer=null;
 var NO_FETCH=/(^|\.)(drive\.google\.com|docs\.google\.com|dropbox\.com|dropboxusercontent\.com|onedrive\.live\.com|1drv\.ms|sharepoint\.com|mega\.nz|mediafire\.com)$/i;
 function say(id,t,bad){var e=$(id);e.textContent=t||'';e.className='msg'+(bad?' bad':'');}
 function host(u){try{return new URL(u).hostname.replace(/^www\./,'');}catch(e){return '';}}
 function safe(u){try{var x=new URL(u);return x.protocol==='https:'?x.href:null;}catch(e){return null;}}
 function download(u){try{var x=new URL(u);if(/dropbox\.com$/.test(x.hostname)){x.searchParams.set('dl','1');}return x.href;}catch(e){return u;}}
 function opens(m){return m.kind==='pack'&&!NO_FETCH.test(host(m.link));}
 function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
 function setOff(){off=true;$('m-off').hidden=false;$('m-more').hidden=true;$('s-save').disabled=true;}
 var THUMB='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 10h4v11H2zM8 21h9.2a2 2 0 0 0 2-1.6l1.6-7.2A2 2 0 0 0 18.8 10H14l.9-4.3a1.6 1.6 0 0 0-2.9-1.2L8 10z"/></svg>';

 function query(){
  var sort=$('m-sort').value,kind=$('m-kind').value,q=$('m-q').value.replace(/[^\w\s'.-]/g,' ').trim();
  var p='site_maps?select=id,owner_id,kind,title,description,designer,link,votes,created_at&limit='+PAGE+'&offset='+offset;
  p+=sort==='top'?'&order=votes.desc,created_at.desc':'&order=created_at.desc';
  if(kind)p+='&kind=eq.'+kind;
  if(q)p+='&or='+encodeURIComponent('(title.ilike.*'+q+'*,designer.ilike.*'+q+'*)');
  return p;}
 function load(more){
  if(!more){offset=0;rows=[];}
  say('m-msg','Fetching the list…');
  return RB.rest(query()).then(function(data){
   rows=rows.concat(data||[]);offset+=PAGE;$('m-more').hidden=!data||data.length<PAGE;
   say('m-msg',rows.length?'':($('m-q').value||$('m-kind').value?'Nothing matches that.':'No maps shared yet. Be the first.'));draw();
  }).catch(function(e){if(RB.missing(e)){setOff();say('m-msg','');}else say('m-msg','Could not load the list. '+RB.friendly(e),true);});}

 function card(m){
  var c=el('article','mapcard leaf');c.id='m-'+m.id;
  c.appendChild(el('h3',null,m.title));
  c.appendChild(el('p','by','Designed by '+m.designer));
  var meta=el('div','meta');meta.appendChild(el('span','tag',m.kind==='pack'?'pack':'map'));
  var h=host(m.link);if(h)meta.appendChild(el('span',null,'on '+h));
  meta.appendChild(el('span',null,'· '+new Date(m.created_at).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})));c.appendChild(meta);
  if(m.description)c.appendChild(el('p','desc',m.description));
  var link=safe(m.link);
  if(m.kind==='pack'&&!opens(m))c.appendChild(el('p','warn','This host does not let the game read files: download it, then use OPEN FILE in My Maps.'));
  if(m.kind==='map')c.appendChild(el('p','warn','A single map: download it, then use OPEN FILE in My Maps.'));
  var acts=el('div','acts');
  var t=el('button','thumb');t.type='button';t.innerHTML=THUMB;var n=el('span',null,String(m.votes||0));t.appendChild(n);
  var own=me&&me.id===m.owner_id;
  t.setAttribute('aria-pressed',mine[m.id]?'true':'false');t.setAttribute('aria-label',(m.votes||0)+' thumbs up'+(own?', your map':me?'. Give a thumbs up':'. Sign in to vote'));
  if(own)t.disabled=true;
  t.addEventListener('click',function(){vote(m,t,n);});acts.appendChild(t);
  if(link&&opens(m)){var o=el('a','btn small','Open in game');o.href='play/#pack='+encodeURIComponent(link);acts.appendChild(o);}
  if(link){var d=el('a','btn small','Get the file');d.href=download(link);d.rel='nofollow noopener ugc';d.target='_blank';acts.appendChild(d);}
  if(own){var e=el('button','btn small','Edit');e.type='button';e.addEventListener('click',function(){edit(m);});acts.appendChild(e);
   var x=el('button','btn small danger','Remove');x.type='button';x.addEventListener('click',function(){remove(m);});acts.appendChild(x);}
  c.appendChild(acts);return c;}
 function draw(){var L=$('m-list');L.textContent='';rows.forEach(function(m){L.appendChild(card(m));});
  if(location.hash.indexOf('#m-')===0){var t=document.getElementById(location.hash.slice(1));if(t)t.scrollIntoView();}}

 function vote(m,t,n){
  if(off)return;
  if(!me){RB.openSignIn();return;}
  var on=t.getAttribute('aria-pressed')!=='true';t.disabled=true;
  RB.client().then(function(c){return on?c.from('site_map_votes').insert({map_id:m.id}):c.from('site_map_votes').delete().eq('map_id',m.id).eq('voter_id',me.id);}).then(function(r){t.disabled=false;
   if(r.error){say('m-msg',r.error.code==='23505'?'You already voted for that one.':RB.missing(r.error)?'Voting switches on with the next site update.':RB.friendly(r.error),true);return;}
   if(on)mine[m.id]=1;else delete mine[m.id];m.votes=Math.max(0,(m.votes||0)+(on?1:-1));n.textContent=String(m.votes);t.setAttribute('aria-pressed',on?'true':'false');t.setAttribute('aria-label',m.votes+' thumbs up');});}

 // ---------- share, edit, remove ----------
 function kindVal(){var k=document.querySelector('input[name=s-kind]:checked');return k?k.value:'pack';}
 function hint(){var h=host($('s-link').value),k=kindVal(),e=$('s-hint');
  if(!h){e.textContent='Packs on GitHub, Gist, Cloudflare R2 or Supabase Storage open straight in the game. Google Drive, Dropbox and OneDrive work too, but players must download the file and use OPEN FILE.';return;}
  e.textContent=k==='pack'&&!NO_FETCH.test(h)?'Players will get an Open in game button for this pack.':'Players will download this file and use OPEN FILE in the game.';}
 $('s-link').addEventListener('input',hint);document.querySelectorAll('input[name=s-kind]').forEach(function(r){r.addEventListener('change',hint);});
 function edit(m){editing=m;$('s-title').value=m.title;$('s-link').value=m.link;$('s-designer').value=m.designer;$('s-desc').value=m.description||'';
  document.querySelector('input[name=s-kind][value='+m.kind+']').checked=true;$('share-title').textContent='Edit your listing';$('s-save').textContent='Save changes';$('s-cancel').hidden=false;hint();$('share').scrollIntoView();$('s-title').focus();}
 function stopEdit(){editing=null;$('s-form').reset();$('share-title').textContent='Share a map or pack';$('s-save').textContent='Share it';$('s-cancel').hidden=true;fillDesigner();hint();}
 $('s-cancel').addEventListener('click',stopEdit);
 function remove(m){if(!confirm('Remove "'+m.title+'" from the list? The file itself stays where it is.'))return;
  RB.client().then(function(c){return c.from('site_maps').delete().eq('id',m.id);}).then(function(r){if(r.error){say('m-msg',RB.friendly(r.error),true);return;}say('m-msg','Removed.');load();});}
 $('s-form').addEventListener('submit',function(e){e.preventDefault();if(off)return;
  var title=$('s-title').value.trim(),link=$('s-link').value.trim(),designer=$('s-designer').value.trim(),desc=$('s-desc').value.trim();
  if(title.length<3){say('s-msg','Give it a title of at least 3 letters.',true);return;}
  if(!safe(link)){say('s-msg','The link must start with https://',true);return;}
  if(designer.length<2){say('s-msg','Add the designer’s name.',true);return;}
  var row={kind:kindVal(),title:title.slice(0,60),link:link.slice(0,600),designer:designer.slice(0,40),description:desc.slice(0,600)};
  say('s-msg','Saving…');$('s-save').disabled=true;
  RB.client().then(function(c){return editing?c.from('site_maps').update(Object.assign(row,{updated_at:new Date().toISOString()})).eq('id',editing.id):c.from('site_maps').insert(row);}).then(function(r){$('s-save').disabled=false;
   if(r.error){if(RB.missing(r.error)){setOff();say('s-msg','Sharing switches on with the next site update.',true);}else say('s-msg',RB.friendly(r.error),true);return;}
   say('s-msg',editing?'Saved.':'Shared. Thank you.');stopEdit();$('m-sort').value='new';load();}).catch(function(err){$('s-save').disabled=false;say('s-msg',RB.friendly(err),true);});});
 function fillDesigner(){if(!$('s-designer').value)$('s-designer').value=RB.read('rabblings-player-name')||'';}
 $('s-signin').addEventListener('click',function(){RB.openSignIn();});

 RB.onChange(function(u){me=u;mine={};$('s-out').hidden=!!u;$('s-form').hidden=!u;if(u)fillDesigner();
  if(!u){draw();return;}
  RB.client().then(function(c){return c.from('site_map_votes').select('map_id').eq('voter_id',u.id);}).then(function(r){(r.data||[]).forEach(function(v){mine[v.map_id]=1;});draw();}).catch(function(){draw();});});
 ['m-sort','m-kind'].forEach(function(id){$(id).addEventListener('change',function(){load();});});
 $('m-q').addEventListener('input',function(){clearTimeout(timer);timer=setTimeout(function(){load();},350);});
 $('m-more').addEventListener('click',function(){load(true);});
 load();
})();
