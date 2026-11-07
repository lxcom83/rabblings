// shared map format: version wrapper, IDs, share codes, files and browser storage
// fmt: format version, game: which profile the map belongs to, gen: generator version
// objects carry a uid so one object can point at another with link. A zone's id is its trigger number
const MAP_FORMAT=2;
function ensureIds(m){const seen=new Set();let n=0;for(const o of m.objs)if(Number.isFinite(o.uid))n=Math.max(n,o.uid);for(const o of m.objs){if(!Number.isFinite(o.uid)||seen.has(o.uid))o.uid=++n;seen.add(o.uid);}for(const o of m.objs)if(o.link!==undefined&&!seen.has(o.link))delete o.link;return m;}
function upgradeMap(m){if(!m||!Array.isArray(m.objs))return m;if(!m.fmt||m.fmt<MAP_FORMAT)m.fmt=MAP_FORMAT;if(!m.game)m.game=PROFILE.id;if(!m.gen)m.gen=1;return ensureIds(m);}
// share codes: deflated JSON in URL-safe base64, so maps fit in a chat message
const b64=u=>btoa(String.fromCharCode(...u)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const unb64=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
async function packMap(m){upgradeMap(m);const raw=new TextEncoder().encode(JSON.stringify(m));try{const st=new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw')),b=new Uint8Array(await new Response(st).arrayBuffer());let o='';for(let i=0;i<b.length;i+=8192)o+=String.fromCharCode(...b.subarray(i,i+8192));return'GS1z'+btoa(o).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}catch(e){return'GS1p'+b64(raw);}}
const noImp=x=>{if(x&&typeof x==='object')delete x.imported;return x;};
async function unpackMap(code){code=code.trim().replace(/\s+/g,'');if(!/^GS1[zp]/.test(code))throw new Error('That does not look like a map code. Codes start with GS1.');const kind=code[3],b=unb64(code.slice(4));let raw=b;if(kind==='z'){const st=new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate-raw'));raw=new Uint8Array(await new Response(st).arrayBuffer());}return cleanMap(noImp(JSON.parse(new TextDecoder().decode(raw))));}
const FILE_TAG='goblin-scramble-maps';
function mapsToFile(list){return JSON.stringify({game:FILE_TAG,v:1,maps:list.map(upgradeMap)},null,0);}
async function readMapFile(text){text=text.trim();if(/^GS1[zp]/.test(text)){const m=await unpackMap(text);m.id=null;return[m];}let d;try{d=JSON.parse(text);}catch(e){throw new Error('That file is not a map file.');}const list=Array.isArray(d.maps)?d.maps:d.ops?[d]:null;if(!list||!list.length)throw new Error('No maps were found in that file.');return list.map(x=>cleanMap(noImp(x)));}
async function saveFile(name,text,mime){if(!window.claude){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([text],{type:mime||'application/json'}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),2000);return'saved';}let dl=null;try{dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;}catch(e){}if(!dl)return'none';try{await dl.save({filename:name,data:text});return'saved';}catch(e){return e&&e.code==='declined'?'declined':e&&e.code==='rate_limited'?'busy':'none';}}
const fileName=m=>'rabblings-map-'+(m.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'untitled')+'.json';
// ---------- browser storage ----------
// saved maps and packs live in IndexedDB (hundreds of MB) behind a memory cache, so Store and PackStore stay synchronous.
// boot.js waits for StoreDB.init() once. localStorage is the fallback when IndexedDB is unavailable, and the old copy is migrated.
const PACK_MAX=200,LINK_MAX=2e7;
// unique even when hundreds are made in the same millisecond (the old time+random id could collide and overwrite a map)
let idSeq=0;const newId=()=>Date.now().toString(36)+(++idSeq).toString(36)+(Math.random()*1e3|0).toString(36);
const StoreDB={db:null,ready:null,q:{},timer:0,failed:'',warn:'',
 open(){return new Promise((ok,no)=>{try{const r=indexedDB.open('rabblings-data',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);r.onblocked=()=>no(new Error('blocked'));}catch(e){no(e);}});},
 rd(k){return new Promise((ok,no)=>{const q=this.db.transaction('kv','readonly').objectStore('kv').get(k);q.onsuccess=()=>ok(q.result);q.onerror=()=>no(q.error);});},
 wr(k,v){return new Promise((ok,no)=>{const t=this.db.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=()=>ok();t.onerror=()=>no(t.error);t.onabort=()=>no(t.error||new Error('aborted'));});},
 init(){if(this.ready)return this.ready;return this.ready=(async()=>{
  try{this.db=await this.open();}catch(e){this.db=null;}
  for(const S of [Store,PackStore]){let ls=[];try{const t=localStorage.getItem(S.key);if(t)ls=JSON.parse(t);}catch(e){}if(!Array.isArray(ls))ls=[];
   let arr=null;if(this.db){try{arr=await this.rd(S.key);}catch(e){this.db=null;}}
   if(this.db){arr=Array.isArray(arr)?arr:[];if(ls.length){const mine=new Set(ls.map(o=>o&&o.id));arr=ls.concat(arr.filter(o=>!(o&&mine.has(o.id))));}
    if(ls.length||!Array.isArray(arr)){try{await this.wr(S.key,arr);localStorage.removeItem(S.key);}catch(e){}}else{try{localStorage.removeItem(S.key);}catch(e){}}
    {const cur=S.mem;if(cur&&cur.length){const have=new Set(cur.map(o=>o&&o.id));arr=cur.concat(arr.filter(o=>!(o&&have.has(o.id))));}S.mem=null;S.adopt(arr);}}}
  try{if(this.db&&navigator.storage&&navigator.storage.persist)navigator.storage.persist();}catch(e){}
  this.check();})();},
 put(k,v){if(!this.db){try{localStorage.setItem(k,JSON.stringify(v));this.failed='';return true;}catch(e){this.failed='STORAGE FULL';return false;}}this.q[k]=v;if(!this.timer)this.timer=setTimeout(()=>this.flush(),150);return !this.failed;},
 async flush(){clearTimeout(this.timer);this.timer=0;const q=this.q;this.q={};for(const k of Object.keys(q)){try{await this.wr(k,q[k]);this.failed='';try{localStorage.removeItem(k);}catch(e){}}catch(e){try{localStorage.setItem(k,JSON.stringify(q[k]));this.failed='';}catch(e2){this.failed='STORAGE FULL';}}}this.check();},
 async check(){try{if(this.failed||!navigator.storage||!navigator.storage.estimate)return;const e=await navigator.storage.estimate();if(e&&e.quota){const f=e.usage/e.quota;this.warn=f>.8?'STORAGE '+Math.min(99,Math.round(f*100))+'% FULL':'';}}catch(e){}},
 notice(){return this.failed||this.warn;}};
if(typeof addEventListener==='function'){addEventListener('pagehide',()=>{if(StoreDB.timer)StoreDB.flush();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&StoreDB.timer)StoreDB.flush();});}
const Store={key:'goblin-scramble-maps',mem:null,adopt(a){this.mem=Array.isArray(a)?a:[];this.mem=this.mem.filter(m=>m&&Array.isArray(m.ops)&&Array.isArray(m.objs));this.mem.forEach(upgradeMap);return this.mem;},
 all(){if(this.mem)return this.mem;let a=[];try{a=JSON.parse(localStorage.getItem(this.key)||'[]');}catch(e){}return this.adopt(a);},
 save(){return StoreDB.put(this.key,this.mem||[]);},put(m){upgradeMap(m);const a=this.all();if(!m.id)m.id=newId();const i=a.findIndex(o=>o.id===m.id);if(i>=0)a[i]=JSON.parse(JSON.stringify(m));else a.unshift(JSON.parse(JSON.stringify(m)));return this.save();},del(id){const a=this.all(),i=a.findIndex(o=>o.id===id);if(i>=0)a.splice(i,1);this.save();}};
// ---------- map packs: an ordered list of your own maps, shared as ONE file ----------
const PackStore={key:'rabblings-packs',mem:null,adopt(a){this.mem=Array.isArray(a)?a:[];this.mem=this.mem.filter(p=>p&&p.id&&Array.isArray(p.maps));return this.mem;},
 all(){if(this.mem)return this.mem;let a=[];try{a=JSON.parse(localStorage.getItem(this.key)||'[]');}catch(e){}return this.adopt(a);},
 save(){return StoreDB.put(this.key,this.mem||[]);},
 get(id){return this.all().find(p=>p.id===id)||null;},
 add(name){const p={id:'p'+newId(),name:String(name||'NEW PACK').toUpperCase().slice(0,24),by:(typeof SAVE!=='undefined'&&SAVE.author)||'',desc:'',maps:[]};this.all().unshift(p);this.save();return p;},
 del(id){const a=this.all(),i=a.findIndex(p=>p.id===id);if(i>=0)a.splice(i,1);this.save();},
 maps(p){const own=Store.all();return p.maps.map(id=>own.find(m=>m.id===id)).filter(Boolean);},
 tidy(p){const own=Store.all();p.maps=p.maps.filter((id,i)=>own.some(m=>m.id===id)&&p.maps.indexOf(id)===i);}};
const packFileName=p=>'rabblings-pack-'+(p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'untitled')+'.rabpack';
function packToFile(p){const L=PackStore.maps(p).filter(m=>!m.imported);return JSON.stringify({game:FILE_TAG,v:2,pack:{name:p.name,by:p.by||'',desc:p.desc||''},maps:L.map(upgradeMap)});}
// returns null when the text is not a pack file; otherwise saves the maps and the pack, and says what happened
// pack files: JSON, or GSPK1: + deflated JSON in URL-safe base64 (several times smaller). Both open.
const bytesB64=b=>{let o='';for(let i=0;i<b.length;i+=8192)o+=String.fromCharCode(...b.subarray(i,i+8192));return btoa(o).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');};
async function deflateText(t){const st=new Blob([new TextEncoder().encode(t)]).stream().pipeThrough(new CompressionStream('deflate-raw'));return new Uint8Array(await new Response(st).arrayBuffer());}
async function inflateBytes(b,cap){const rd=new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader(),parts=[];let n=0;for(;;){const r=await rd.read();if(r.done)break;n+=r.value.length;if(n>cap){try{await rd.cancel();}catch(e){}throw new Error('That pack is too big to open.');}parts.push(r.value);}const o=new Uint8Array(n);let k=0;for(const c of parts){o.set(c,k);k+=c.length;}return o;}
async function packToFileZ(p){return'GSPK1:'+bytesB64(await deflateText(packToFile(p)));}
// text -> parsed object, or null when it is not JSON or a compressed pack
async function packData(text){const t=String(text).trim();if(/^GSPK1:/.test(t)){try{return JSON.parse(new TextDecoder().decode(await inflateBytes(unb64(t.slice(6).replace(/\s+/g,'')),8e7)));}catch(e){if(/too big/.test(e.message))throw e;throw new Error('That pack file is damaged.');}}try{return JSON.parse(t);}catch(e){return null;}}
// links: http(s) only, GitHub page links become raw links, nothing fetched is ever run
function normLink(u){u=String(u||'').trim();const h=u.match(/#pack=(.+)$/);if(h){try{u=decodeURIComponent(h[1]);}catch(e){u=h[1];}}let x;try{x=new URL(u);}catch(e){throw new Error('That does not look like a web link.');}if(x.protocol!=='https:'&&x.protocol!=='http:')throw new Error('Only http and https links are allowed.');
 if(x.hostname==='github.com'){const m=x.pathname.match(/^\/([^/]+)\/([^/]+)\/blob\/(.+)$/);if(m)x=new URL('https://raw.githubusercontent.com/'+m[1]+'/'+m[2]+'/'+m[3]);}
 if(x.hostname==='gist.github.com'){const m=x.pathname.match(/^\/([^/]+)\/([0-9a-f]+)\/?$/);if(m)x=new URL('https://gist.githubusercontent.com/'+m[1]+'/'+m[2]+'/raw');}
 return x.href;}
async function fetchLinkText(raw){const url=normLink(raw);let r;try{r=await fetch(url,{credentials:'omit',redirect:'follow',referrerPolicy:'no-referrer',cache:'no-store'});}catch(e){const h=new URL(url).hostname;throw new Error(/drive\.google|dropbox|onedrive|1drv|mega\.|mediafire/.test(h)?'That host does not let the game read files. Download the pack and use OPEN FILE, or host it on GitHub, Cloudflare R2 or Supabase Storage.':'Could not read that link. The host may be offline, or may not allow other sites to read the file. GitHub, Gist, Cloudflare R2 and Supabase Storage work.');}
 if(!r.ok)throw new Error('That link answered '+r.status+', not a file.');if((+r.headers.get('content-length')||0)>LINK_MAX)throw new Error('That file is too big to be a pack.');
 const rd=r.body&&r.body.getReader?r.body.getReader():null;if(!rd){const t=await r.text();if(t.length>LINK_MAX)throw new Error('That file is too big to be a pack.');return t;}
 const parts=[];let n=0;for(;;){const c=await rd.read();if(c.done)break;n+=c.value.length;if(n>LINK_MAX){try{await rd.cancel();}catch(e){}throw new Error('That file is too big to be a pack.');}parts.push(c.value);}
 const o=new Uint8Array(n);let k=0;for(const c of parts){o.set(c,k);k+=c.length;}return new TextDecoder().decode(o);}
const isPackData=d=>!!(d&&d.pack&&Array.isArray(d.maps));
async function importPackFile(text){const d=await packData(text);return isPackData(d)?importPackData(d):null;}
async function importPackData(d){if(!isPackData(d))return null;if(!d.maps.length)throw new Error('That pack has no maps in it.');
 const list=d.maps.slice(0,PACK_MAX).map(x=>cleanMap(noImp(x))),own=Store.all(),ids=[];let fresh=0;
 for(const m of list){const sig=mapSig(m),old=own.find(o=>!o.imported&&o.name===m.name&&mapSig(o)===sig);if(old){ids.push(old.id);continue;}m.id=null;m.imported=0;Store.put(m);ids.push(Store.all()[0].id);fresh++;}
 const name=String(d.pack.name||'PACK').toUpperCase().slice(0,24),by=String(d.pack.by||'').slice(0,24);let p=PackStore.all().find(q=>q.src==='file'&&q.name===name&&q.by===by);
 if(p){p.maps=ids;p.desc=String(d.pack.desc||'').slice(0,120);}else{p={id:'p'+newId(),name,by,desc:String(d.pack.desc||'').slice(0,120),maps:ids,src:'file'};PackStore.all().unshift(p);}
 PackStore.save();return{pack:p,fresh,total:ids.length};}
