// ---------- NeoLemmix import: reads the player's own files, ships no levels or tiles ----------
// Classic levels are drawn at half our scale: fall limit, bridge length and dig size all line up at 2x.
const IMP_SCALE=2,IMP_MAXAREA=7e6;
// the player's own terrain colours, if they ask for them: saved on this device only, never in a map, code or file
const ImpArt={mem:new Map(),db:null,
 open(){if(this.db)return this.db;return this.db=new Promise((ok,no)=>{try{const r=indexedDB.open('mythlings-art',1);r.onupgradeneeded=()=>r.result.createObjectStore('art');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);}catch(e){no(e);}});},
 async tx(mode,fn){const d=await this.open();return new Promise((ok,no)=>{const t=d.transaction('art',mode),q=fn(t.objectStore('art'));q.onsuccess=()=>ok(q.result);q.onerror=()=>no(q.error);});},
 async put(key,a){this.mem.set(key,a);try{const[c,x]=mk(a.w,a.h),im=x.createImageData(a.w,a.h);new Uint32Array(im.data.buffer).set(a.d);x.putImageData(im,0,0);const blob=await new Promise(r=>c.toBlob(r,'image/png'));await this.tx('readwrite',s=>s.put({b:blob,w:a.w,h:a.h},key));return true;}catch(e){return false;}},
 async load(key){if(this.mem.has(key))return this.mem.get(key);try{const v=await this.tx('readonly',s=>s.get(key));if(!v)return null;const bmp=await createImageBitmap(v.b),[c,x]=mk(v.w,v.h);x.drawImage(bmp,0,0);const a={w:v.w,h:v.h,d:new Uint32Array(x.getImageData(0,0,v.w,v.h).data.buffer)};this.mem.set(key,a);return a;}catch(e){return null;}},
 del(key){this.mem.delete(key);this.tx('readwrite',s=>s.delete(key)).catch(()=>{});},
 ready(m){const a=m.art&&this.mem.get(m.key);return a?{...a,s:m.ops[0][3],ox:m.ops[0][4],oy:m.ops[0][5]}:null;}};
const IMP_WORLD={fire:'cinder',marble:'halls',pillar:'crypts',dirt:'mine',crystal:'caves',brick:'forge',rock:'mine',snow:'frost',bubble:'marsh',sega:'bog'};
const IMP_SKILL={CLIMBER:'climb',FLOATER:'flap',BOMBER:'boom',BLOCKER:'block',BUILDER:'build',BASHER:'bash',MINER:'pick',DIGGER:'dig'};
const IMP_NEW={SWIMMER:'swim',DISARMER:'disarm',WALKER:'walkr'},IMP_NEW_KEYS=['swim','disarm','walkr'];
const IMP_CLOSE={GLIDER:'flap',TIMEBOMBER:'boom',PLATFORMER:'build',STACKER:'build',FENCER:'bash',LASERER:'bash',SHIMMIER:'climb'};

// a tiny zip reader: reads the index, then only the files it needs, so a large download stays quick
async function zipEntries(file){const size=file.size,tail=Math.min(size,66000),buf=new DataView(await file.slice(size-tail).arrayBuffer());let eo=-1;
 for(let i=tail-22;i>=0;i--)if(buf.getUint32(i,true)===0x06054b50){eo=i;break;}if(eo<0)throw new Error(file.name+' is not a zip file.');
 const n=buf.getUint16(eo+10,true),cs=buf.getUint32(eo+12,true),co=buf.getUint32(eo+16,true);if(co===0xffffffff)throw new Error(file.name+' is too large to read.');
 const d=new DataView(await file.slice(co,co+cs).arrayBuffer()),dec=new TextDecoder(),out=[];let p=0;
 for(let i=0;i<n&&p+46<=d.byteLength;i++){if(d.getUint32(p,true)!==0x02014b50)break;const how=d.getUint16(p+10,true),csz=d.getUint32(p+20,true),nl=d.getUint16(p+28,true),xl=d.getUint16(p+30,true),cl=d.getUint16(p+32,true),off=d.getUint32(p+42,true),name=dec.decode(new Uint8Array(d.buffer,d.byteOffset+p+46,nl));p+=46+nl+xl+cl;
  if(name.endsWith('/'))continue;out.push({path:name,read:async()=>{const h=new DataView(await file.slice(off,off+30).arrayBuffer()),st=off+30+h.getUint16(26,true)+h.getUint16(28,true),b=file.slice(st,st+csz);if(how===0)return new Uint8Array(await b.arrayBuffer());if(how!==8)throw new Error('Unknown zip packing.');return new Uint8Array(await new Response(b.stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());}});}
 return out;}

// everything the player has given us this session, kept in memory only
const ImpFiles={styles:{},levels:[],names:[],nxmi:{},plist:null,
 note(p,read,src){p=p.replace(/\\/g,'/');const s=p.match(/(?:^|\/)styles\/([^\/]+)\/(terrain|objects)\/([^\/]+)\.(png|nxmt|nxmo)$/i);
  if(s){this.styles[(s[1]+'/'+s[2]+'/'+s[3]+'.'+s[4]).toLowerCase()]=read;return;}
  if(/\.nxmi$/i.test(p)){this.nxmi[p.toLowerCase()]=read;return;}
  if(/\.nxlv$/i.test(p)){const seg=p.split('/');seg.pop();const i=seg.findIndex(a=>a.toLowerCase()==='levels'),pi=i>=0&&seg[i+1]?i+1:0,top=seg[pi]||src;this.levels.push({path:p,pack:top,base:seg.slice(0,pi+1).join('/'),dir:seg.join('/'),name:p.split('/').pop().replace(/\.nxlv$/i,''),read});}},
 async add(list){for(const f of list){const n=f.name,rel=f.webkitRelativePath||n;if(/\.zip$/i.test(n)){for(const e of await zipEntries(f))this.note(e.path,e.read,n.replace(/\.zip$/i,''));this.names.push(n);}else this.note(rel,async()=>new Uint8Array(await f.arrayBuffer()),'MY LEVELS');}
  const seen=new Set();this.levels=this.levels.filter(l=>!seen.has(l.pack+'/'+l.path)&&seen.add(l.pack+'/'+l.path));try{await this.order();}catch(e){this.plist=null;}},
 // pack order the way NeoLemmix reads it: levels.nxmi in each folder (LEVEL lines and $GROUP folders, in that order),
 // otherwise alphabetical; info.nxmi gives the pack title and author
 async order(){const lc=x=>String(x).toLowerCase(),text=async k=>{const r=this.nxmi[lc(k)];return r?txtOf(await r()):null;},byBase={};
  for(const l of this.levels)(byBase[l.base]=byBase[l.base]||[]).push(l);
  const out=[];
  for(const base of Object.keys(byBase).sort()){const all=byBase[base],used=new Set(),seq=[],walk=async(dir,rank,depth)=>{if(depth>8)return;
    const here=all.filter(l=>lc(l.dir)===lc(dir)),subs=[...new Set(all.filter(l=>lc(l.dir).startsWith(lc(dir)+'/')).map(l=>l.dir.slice(dir.length+1).split('/')[0]))].sort((a,b)=>lc(a)<lc(b)?-1:1),nx=await text(dir+'/levels.nxmi'),take=l=>{if(used.has(l))return;used.add(l);seq.push({...l,rank});};
    if(nx){const items=impNxmi(nx);for(const it of items){if(it.level){const f=lc(it.level).replace(/\.nxlv$/,''),l=here.find(a=>lc(a.name)===f);if(l)take(l);}else if(it.group){const sub=subs.find(a=>lc(a)===lc(it.group.folder||''));if(sub)await walk(dir+'/'+sub,it.group.name||sub,depth+1);}}}
    for(const l of here.slice().sort((a,b)=>lc(a.path)<lc(b.path)?-1:1))take(l);
    for(const sub of subs)await walk(dir+'/'+sub,sub,depth+1);};
   await walk(base,'',0);
   const info=await text(base+'/info.nxmi'),I=info?nxParse(info):{},nm=all[0].pack;
   out.push({name:String(I.TITLE&&I.TITLE!==true?I.TITLE:nm).slice(0,48),folder:nm,by:I.AUTHOR&&I.AUTHOR!==true?String(I.AUTHOR):'',ver:I.VERSION&&I.VERSION!==true?String(I.VERSION):'',base,levels:seq});}
  this.plist=out.sort((a,b)=>a.name<b.name?-1:1);return this.plist;},
 packs(){if(this.plist)return this.plist;const m={};for(const l of this.levels)(m[l.pack]=m[l.pack]||[]).push(l);return Object.keys(m).sort().map(k=>({name:k,folder:k,by:'',ver:'',levels:m[k].sort((a,b)=>a.path<b.path?-1:1)}));},
 hasStyles(){return Object.keys(this.styles).length>0;}};

// .nxlv and its relatives are plain text: KEY value lines, with $SECTION ... $END blocks
function nxParse(text){const root={},stack=[root];for(let line of text.split(/\r?\n/)){line=line.trim();if(!line||line[0]==='#')continue;
  if(line[0]==='$'){const k=line.slice(1).trim().toUpperCase();if(k==='END'){if(stack.length>1)stack.pop();continue;}const o={};(stack[stack.length-1]['$'+k]=stack[stack.length-1]['$'+k]||[]).push(o);stack.push(o);continue;}
  const sp=line.search(/\s/),k=(sp<0?line:line.slice(0,sp)).toUpperCase(),v=sp<0?true:line.slice(sp+1).trim();const cur=stack[stack.length-1];if(k==='LINE'&&v!==true)(cur.LINES=cur.LINES||[]).push(v);cur[k]=v;}return root;}
const txtOf=u=>new TextDecoder().decode(u);
// levels.nxmi: LEVEL <file> lines and $GROUP blocks (NAME, FOLDER), kept in the order written
function impNxmi(text){const items=[];let g=null;for(let line of text.split(/\r?\n/)){line=line.trim();if(!line||line[0]==='#')continue;const sp=line.search(/\s/),k=(sp<0?line:line.slice(0,sp)).toUpperCase(),v=sp<0?'':line.slice(sp+1).trim();
  if(k==='$GROUP'){g={};continue;}if(k==='$END'){if(g){items.push({group:g});g=null;}continue;}if(g){if(k==='NAME'||k==='FOLDER')g[k.toLowerCase()]=v;continue;}if(k==='LEVEL'&&v)items.push({level:v});}return items;}

// piece shapes are read once from the player's files and only their outline is used
const ImpCache={shape:{},meta:{},steel:{}};
async function pngMask(bytes){const bmp=await createImageBitmap(new Blob([bytes],{type:'image/png'})),[c,x]=mk(bmp.width,bmp.height);x.drawImage(bmp,0,0);const id=x.getImageData(0,0,bmp.width,bmp.height),d=id.data,m=new Uint8Array(bmp.width*bmp.height);for(let i=0;i<m.length;i++)m[i]=d[i*4+3]>=128?1:0;const o={w:bmp.width,h:bmp.height,m,c:new Uint32Array(d.buffer)};bmp.close&&bmp.close();return o;}
// when a style is missing: best guess from the piece name, so the level can still be played (and is flagged as a guess)
function impGuessShape(piece,p){const n=String(piece||'').toLowerCase(),W=+p.WIDTH>0?+p.WIDTH:0,H=+p.HEIGHT>0?+p.HEIGHT:0;let w=24,h=16,kind='rect';
 if(/slope|ramp|diag|wedge|triangle/.test(n)){w=24;h=12;kind='slope';}else if(/pillar|column|pole|post|pipe_v|tower/.test(n)){w=8;h=32;}else if(/floor|ground|slab|plat|bridge|ledge|shelf|beam|plank|walk/.test(n)){w=32;h=8;}else if(/block|brick|tile|cube/.test(n)){w=16;h=16;}else if(/wall/.test(n)){w=8;h=24;}else if(/big|large|huge|mass|island/.test(n)){w=48;h=32;}
 w=Math.min(W||w,2000);h=Math.min(H||h,2000);const m=new Uint8Array(w*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(kind==='rect'||y>=h-1-Math.floor((x+1)*(h-1)/w))m[y*w+x]=1;
 return{w,h,m,c:null,steel:/steel|metal_block|indestruct/.test(n),guess:1};}
function impGuessMeta(piece,g){const n=String(piece||'').toLowerCase();
 if(/locked|exit_l/.test(n)&&/exit|door/.test(n))return{fx:'LOCKEDEXIT',tx:12,ty:20,tw:8,th:8,fw:32,fh:32,guess:1};
 if(/window|entrance|hatch|trapdoor|spawn|start/.test(n))return{fx:'ENTRANCE',tx:20,ty:4,tw:1,th:1,fw:40,fh:24,guess:1};
 if(/exit|door|goal|home|finish/.test(n))return{fx:'EXIT',tx:12,ty:20,tw:8,th:8,fw:32,fh:32,guess:1};
 if(/water|lake|pool|acid|slime|liquid/.test(n))return{fx:'WATER',tx:0,ty:2,tw:64,th:14,fw:64,fh:16,guess:1};
 if(/fire|lava|flame|burn|inferno/.test(n))return{fx:'FIRE',tx:0,ty:4,tw:24,th:12,fw:24,fh:16,guess:1};
 if(/trap|spike|saw|jaw|crush|blade|masher|press|grinder|zapper|laser/.test(n))return{fx:'TRAP',tx:8,ty:8,tw:8,th:12,fw:24,fh:24,guess:1};
 return null;}
// namida's own styles ship with the game as outlines and object rules only, so her levels play without the player's files
const NamidaStyles={d:null,async load(){if(this.d)return this.d;try{this.d=JSON.parse(new TextDecoder().decode(await inflateBytes(unb64(NAMIDA_Z),9e6)));}catch(e){this.d={};}return this.d;},
 has(st){return !!(this.d&&this.d[String(st).toLowerCase()]);},
 async shape(st,pc){const d=(await this.load())[String(st).toLowerCase()],r=d&&d.t[String(pc).toLowerCase()];if(!r)return null;const[w,h,run,steel,nine,avg]=r,m=new Uint8Array(w*h);let i=0,v=0;for(const n of run){if(v)m.fill(1,i,Math.min(i+n,m.length));i+=n;v^=1;}
  const s={w,h,m,c:null,steel:!!steel,avg};if(nine)s.nine={l:nine[0],r:nine[1],t:nine[2],b:nine[3]};return s;},
 async meta(st,pc){const d=(await this.load())[String(st).toLowerCase()],r=d&&d.o[String(pc).toLowerCase()];return r?{fx:r[0],tx:r[1],ty:r[2],tw:r[3],th:r[4],fw:r[5],fh:r[6]}:null;}};
async function impShape(style,piece){const k=(style+'/terrain/'+piece).toLowerCase();if(k in ImpCache.shape)return ImpCache.shape[k];const r=ImpFiles.styles[k+'.png'];if(!r)return ImpCache.shape[k]=await NamidaStyles.shape(style,piece);
 const s=await pngMask(await r());const mt=ImpFiles.styles[k+'.nxmt'];const mx=mt?txtOf(await mt()):'';s.steel=mt?/^\s*STEEL/mi.test(mx):/(^|_)steel/i.test(piece);const ns={};mx.replace(/NINE_SLICE_(LEFT|RIGHT|TOP|BOTTOM)\s+(\d+)/gi,(_,a,b)=>{ns[a.toLowerCase()[0]]=+b;});if(Object.keys(ns).length)s.nine={l:ns.l||0,r:ns.r||0,t:ns.t||0,b:ns.b||0};return ImpCache.shape[k]=s;}
async function impMeta(style,piece){const k=(style+'/objects/'+piece).toLowerCase();if(k in ImpCache.meta)return ImpCache.meta[k];const r=ImpFiles.styles[k+'.nxmo'];if(!r)return ImpCache.meta[k]=await NamidaStyles.meta(style,piece);const p=nxParse(txtOf(await r()));
 const a=(p.$PRIMARY_ANIMATION||[{}])[0],fr=+(a.FRAMES||p.FRAMES||1)||1,horiz=!!(a.HORIZONTAL_STRIP||p.HORIZONTAL_STRIP);let w=+p.TRIGGER_WIDTH||0,h=+p.TRIGGER_HEIGHT||0,fw=0,fh=0;const png=ImpFiles.styles[k+'.png'];if(png){const bmp=await createImageBitmap(new Blob([await png()],{type:'image/png'}));fw=horiz?bmp.width/fr:bmp.width;fh=horiz?bmp.height:bmp.height/fr;bmp.close&&bmp.close();}
 return ImpCache.meta[k]={fx:String(p.EFFECT||'').toUpperCase(),tx:+p.TRIGGER_X||0,ty:+p.TRIGGER_Y||0,tw:w,th:h,fw,fh};}
function impTurn(s,rot,fh,fv){let{w,h}=s,A=[s.m,s.c,s.ow];
 if(rot){A=A.map(a=>{if(!a)return a;const n=new a.constructor(w*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++)n[x*h+(h-1-y)]=a[y*w+x];return n;});[w,h]=[h,w];}
 if(fh||fv)A=A.map(a=>{if(!a)return a;const n=new a.constructor(w*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++)n[y*w+x]=a[(fv?h-1-y:y)*w+(fh?w-1-x:x)];return n;});
 return{w,h,m:A[0],c:A[1],ow:A[2],steel:s.steel,lost:s.lost};}
// resizable pieces (WIDTH/HEIGHT on a placement): only nine-slice pieces can stretch, the corners stay as drawn
function impSize(s,W,H){W=Math.round(+W)||s.w;H=Math.round(+H)||s.h;if(!s.nine||(W===s.w&&H===s.h)||W<1||H<1||W>4096||H>4096)return s;const{l,r,t,b}=s.nine;if(W<l+r||H<t+b||s.w-l-r<1||s.h-t-b<1)return s;
 const sx=d=>d<l?d:d>=W-r?s.w-(W-d):l+Math.floor((d-l)*(s.w-l-r)/(W-l-r)),sy=d=>d<t?d:d>=H-b?s.h-(H-d):t+Math.floor((d-t)*(s.h-t-b)/(H-t-b)),m=new Uint8Array(W*H),c=new Uint32Array(W*H);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=sy(y)*s.w+sx(x);m[y*W+x]=s.m[k];c[y*W+x]=s.c[k];}return{w:W,h:H,m,c,steel:s.steel};}

// material runs, stored inside the map as one text step: A-G is the material, lowercase/digits the run length
function impPack(a){let s='',i=0;const n=a.length,L=[];while(i<n){let j=i+1;while(j<n&&a[j]===a[i])j++;L.push(String.fromCharCode(65+a[i])+(j-i).toString(36));i=j;}return L.join('');}
function impUnpack(s,w,h){const a=new Uint8Array(w*h),re=/([A-G])([0-9a-z]+)/g;let m,i=0;while((m=re.exec(s))){const v=m[1].charCodeAt(0)-65,n=parseInt(m[2],36);if(v)a.fill(v,i,Math.min(i+n,a.length));i+=n;}return a;}
// smooth 2x: keeps slopes as slopes, so the upscaled terrain does not look like stairs
// material skin for a piece: its name first, then the average colour of its own outline pixels (read here, never stored). 0 keeps the theme look
const IMP_SKIN_WORDS=[[10,/wood|plank|log|bark|beam|timber/],[2,/brick|tile|wall|bunker/],[9,/marble|pillar|column|ruin|temple|greek|statue/],[4,/snow|ice|frost|glacier|igloo/],[3,/sand|desert|dune|egypt/],[5,/grass|moss|leaf|tree|jungle|garden|vine|bush|swamp|forest/],[6,/ash|coal|obsidian|lava|cinder|slag|volcan|hell|fire/],[7,/crystal|gem|glass|neon|candy|psychedelic/],[8,/metal|rust|iron|pipe|gear|machine|circuit|scrap|cyber|clockwork|factory|lab/],[11,/flesh|organic|blood|horror|bone|honeycomb|martian/],[1,/stone|rock|cliff|boulder|cobble|cave|crypt|dungeon|basement|mine|space/]];
function impSkinOf(style,piece,sh){const nm=(String(style)+' '+String(piece)).toLowerCase();for(const[k,re]of IMP_SKIN_WORDS)if(re.test(nm))return k;
 if(!sh)return 0;let r=0,g=0,b=0,n=0;if(sh.avg){[r,g,b]=sh.avg;n=9;}else if(sh.c&&sh.m){const st=Math.max(1,(sh.m.length/400)|0);for(let i=0;i<sh.m.length;i+=st){if(!sh.m[i])continue;const c=sh.c[i];r+=c&255;g+=(c>>8)&255;b+=(c>>16)&255;n++;}if(n>=4){r/=n;g/=n;b/=n;}}
 if(n<4)return 0;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),v=mx/255,sat=mx?(mx-mn)/mx:0;let h=0;if(mx>mn){const d=mx-mn;h=mx===r?((g-b)/d+6)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}
 if(v<.22)return 6;if(sat<.14)return v>.8?4:1;if(h<20||h>=345)return sat>.45&&v>.4?2:sat>.45?8:11;if(h<45)return sat>.55?8:0;if(h<68)return sat>.3?3:0;if(h<170)return 5;if(h<260)return sat>.25&&v>.45?7:1;if(h<345)return 7;return 0;}
function impSkinPack(a){let s='',i=0;const n=a.length;while(i<n){let j=i+1;while(j<n&&a[j]===a[i])j++;s+=String.fromCharCode(65+a[i])+(j-i).toString(36)+'.';i=j;}return s;}
function impSkinUnpack(s,w,h){const a=new Uint8Array(w*h),re=/([A-P])([0-9a-z]+)\./g;let m,i=0;while((m=re.exec(s))){const v=m[1].charCodeAt(0)-65,n=parseInt(m[2],36);if(v)a.fill(v,i,Math.min(i+n,a.length));i+=n;}return a;}
function impGrow(a,w,h){const W=w*2,o=new Uint8Array(W*h*2);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=a[y*w+x],A=y?a[(y-1)*w+x]:p,D=y<h-1?a[(y+1)*w+x]:p,C=x?a[y*w+x-1]:p,B=x<w-1?a[y*w+x+1]:p;let e=[p,p,p,p];if(C===A&&C!==D&&A!==B)e[0]=A;if(A===B&&A!==C&&B!==D)e[1]=B;if(D===C&&D!==B&&C!==A)e[2]=C;if(B===D&&B!==A&&D!==C)e[3]=D;const k=y*2*W+x*2;o[k]=e[0];o[k+1]=e[1];o[k+W]=e[2];o[k+W+1]=e[3];}return o;}
// used by Shaper for the imported terrain step
function impStamp(S,o){const[,w,h,sc,ox,oy,run,skn]=o,T=S.T;let a=impUnpack(run,w,h),W=w,H=h,sk=typeof skn==='string'&&skn?impSkinUnpack(skn,w,h):null;if(sc===2){a=impGrow(a,w,h);if(sk)sk=impGrow(sk,w,h);W*=2;H*=2;}if(sk&&!T.skin)T.skin=new Uint8Array(T.w*T.h);for(let y=0;y<H;y++){const ty=y+oy;if(ty<0||ty>=T.h)continue;for(let x=0;x<W;x++){const tx=x+ox;if(tx>=0&&tx<T.w&&a[y*W+x]){T.m[ty*T.w+tx]=a[y*W+x];if(sk)T.skin[ty*T.w+tx]=sk[y*W+x];}}}}

// level text, screen start and talismans: kept with the map, never needed to play it
function impExtras(L,X,Y,sc,oy,w,h,Wn,Hn){const o={},pre=briefLines((L.$PRETEXT||[{}])[0].LINES),post=briefLines((L.$POSTTEXT||[{}])[0].LINES);if(pre.length)o.pre=pre;if(post.length)o.post=post;
 if(L.START_X!==undefined&&L.START_Y!==undefined&&Number.isFinite(parseInt(L.START_X,10))&&Number.isFinite(parseInt(L.START_Y,10))){o.screenX=clamp(X(parseInt(L.START_X,10)),0,Wn-1);o.screenY=clamp(Y(parseInt(L.START_Y,10)),0,Hn-1);}
 const tal=[];for(const t of L.$TALISMAN||[]){const e={t:impName(t.TITLE||'TALISMAN'),c:/^(bronze|silver|gold)$/i.test(String(t.COLOR))?String(t.COLOR).toLowerCase():'bronze'},n=parseInt(t.SAVE_REQUIREMENT,10),f=parseInt(t.TIME_LIMIT,10),sl=parseInt(t.SKILL_LIMIT,10);if(n>0)e.need=n;if(f>0)e.time=Math.round(f/17*1.36);if(sl>=0)e.skillLimit=sl;if(t.USE_ONLY_SKILL&&t.USE_ONLY_SKILL!==true)e.only=String(t.USE_ONLY_SKILL).toLowerCase().slice(0,16);tal.push(e);if(tal.length>=8)break;}
 if(tal.length)o.tal=tal;return o;}
function impName(s){return String(s||'IMPORTED').toUpperCase().replace(/[^A-Z0-9 .,!?'&:+\-]/g,' ').replace(/\s+/g,' ').trim().slice(0,24)||'IMPORTED';}
async function impConvert(lv,race,art){const src=txtOf(await lv.read()),L=nxParse(src),rep=[],num=(k,d)=>{const v=parseInt(L[k],10);return Number.isFinite(v)?v:d;};
 const w=num('WIDTH',320),h=num('HEIGHT',160),style=String(L.THEME||L.STYLE||'').trim(),m=blankMap('puzzle'),gone={};const miss=(t)=>{gone[t]=(gone[t]||0)+1;};
 if(w<1||h<1||w*h>9e6)throw new Error('The level size looks wrong.');
 const guessed=new Set(),mat=new Uint8Array(w*h),one=new Uint8Array(w*h),skn=new Uint8Array(w*h),col=art?new Uint32Array(w*h):null,T=L.$TERRAIN||[],G=L.$GADGET||L.$OBJECT||[];let lost=0;
 // $TERRAINGROUP: a named bundle of pieces, placed later with STYLE *GROUP. Built once, from the members' own outlines
 const grpDefs={},grpDone={};for(const gd of L.$TERRAINGROUP||[])if(gd.NAME&&gd.NAME!==true)grpDefs[String(gd.NAME).trim().toLowerCase()]=gd;
 const pieceOf=async(st,pc,depth)=>/^\*group$/i.test(String(st))?await impGroup(String(pc||'').trim().toLowerCase(),depth):(pc?await impShape(st,pc):null);
 async function impGroup(key,depth){if(key in grpDone)return grpDone[key];const gd=grpDefs[key];if(!gd||depth>5)return grpDone[key]=null;grpDone[key]=null;
  const ms=[];let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,gl=0,steel=false;
  for(const p of gd.$TERRAIN||[]){const sh=await pieceOf(p.STYLE||p.COLLECTION||style,p.PIECE,depth+1);if(!sh){gl++;continue;}const q=impTurn(impSize(sh,p.WIDTH,p.HEIGHT),p.ROTATE,p.FLIP_HORIZONTAL,p.FLIP_VERTICAL),px=+p.X||0,py=+p.Y||0;gl+=sh.lost||0;if(!p.ERASE&&sh.steel)steel=true;
   x0=Math.min(x0,px);y0=Math.min(y0,py);x1=Math.max(x1,px+q.w);y1=Math.max(y1,py+q.h);ms.push({p,q,px,py});}
  if(!ms.length||x1<=x0||(x1-x0)*(y1-y0)>4e6)return null;const gw=x1-x0,gh=y1-y0,m=new Uint8Array(gw*gh),c=new Uint32Array(gw*gh),ow=new Uint8Array(gw*gh);
  for(const{p,q,px,py}of ms){const er=!!p.ERASE,keep=!!p.NO_OVERWRITE,o1=p.ONE_WAY&&!q.steel?1:0;for(let j=0;j<q.h;j++)for(let i=0;i<q.w;i++){if(!q.m[j*q.w+i])continue;const k=(py-y0+j)*gw+(px-x0+i);if(er){m[k]=0;ow[k]=0;c[k]=0;}else if(!keep||!m[k]){m[k]=1;c[k]=q.c?q.c[j*q.w+i]:0;ow[k]=o1||(q.ow&&q.ow[j*q.w+i]?1:0);}}}
  {const cnt={};for(const{p,q}of ms){const sh0=await pieceOf(p.STYLE||p.COLLECTION||style,p.PIECE,depth+1);if(sh0&&!sh0.steel){const sv=sh0.skin===undefined?(sh0.skin=impSkinOf(p.STYLE||p.COLLECTION||style,p.PIECE,sh0)):sh0.skin;cnt[sv]=(cnt[sv]||0)+q.w*q.h;}}let bs=0,bn=-1;for(const[a,b]of Object.entries(cnt))if(b>bn){bn=b;bs=+a;}return grpDone[key]={w:gw,h:gh,m,c,ow,steel,lost:gl,skin:bs};}}
 for(const p of T){const st=p.STYLE||p.COLLECTION||style;let sh=await pieceOf(st,p.PIECE,0);if(!sh&&!/^\*group$/i.test(String(st))&&p.PIECE){sh=impGuessShape(p.PIECE,p);guessed.add(String(st));}if(!sh){lost++;miss('style:'+st);continue;}lost+=sh.lost||0;
  const q=impTurn(impSize(sh,p.WIDTH,p.HEIGHT),p.ROTATE,p.FLIP_HORIZONTAL,p.FLIP_VERTICAL),px=+p.X||0,py=+p.Y||0,er=!!p.ERASE,keep=!!p.NO_OVERWRITE,ow=p.ONE_WAY&&!sh.steel?1:0;
  for(let j=0;j<q.h;j++){const ty=j+py;if(ty<0||ty>=h)continue;for(let i=0;i<q.w;i++){if(!q.m[j*q.w+i])continue;const tx=i+px;if(tx<0||tx>=w)continue;const k=ty*w+tx;if(er){mat[k]=0;one[k]=0;skn[k]=0;if(col)col[k]=0;}else if(!keep||!mat[k]){mat[k]=sh.steel?2:1;skn[k]=sh.steel?0:(sh.skin===undefined?(sh.skin=impSkinOf(st,p.PIECE,sh)):sh.skin);one[k]=sh.steel?0:(ow||(q.ow&&q.ow[j*q.w+i]?1:0));if(col&&q.c)col[k]=q.c[j*q.w+i]|0xff000000;}}}}
 const objs=[],pairs={},extra={};let hatches=0,doors=0,ways=0;const sc=(w*h*IMP_SCALE*IMP_SCALE>IMP_MAXAREA)?1:IMP_SCALE,Wn=Math.max(480,w*sc),Hn=Math.max(240,h*sc),ox=0,oy=Hn-h*sc;const X=v=>Math.round(v*sc)+ox,Y=v=>Math.round(v*sc)+oy;
 if(sc===1)rep.push('Very large level: kept at half size, so it will feel tight.');
 const groundAt=(x,y)=>{x=clamp(x/sc|0,0,w-1);let j=clamp((y-oy)/sc|0,0,h-1);if(mat[j*w+x]){let n=0;while(j>0&&mat[(j-1)*w+x]&&n<16){j--;n++;}if(n>=16)return null;}else{let n=0;while(j<h&&!mat[j*w+x]&&n<16){j++;n++;}if(j>=h||n>=16)return null;}return j;};
 let parked=0;
 for(const g of G){{const gx=parseInt(g.X,10),gy=parseInt(g.Y,10);if(Number.isFinite(gx)&&Number.isFinite(gy)&&(gx<-96||gy<-96||gx>w+96||gy>h+96)){parked++;continue;}}const st=g.STYLE||g.COLLECTION||style,mt=g.PIECE?(await impMeta(st,g.PIECE)||impGuessMeta(g.PIECE,g)):null;if(!mt){miss('object:'+g.PIECE);continue;}if(mt.guess)guessed.add(String(st));
  const fh=!!g.FLIP_HORIZONTAL,fv=!!g.FLIP_VERTICAL,gx=+g.X||0,gy=+g.Y||0,gw=g.WIDTH!==undefined?+g.WIDTH:mt.fw,gh=g.HEIGHT!==undefined?+g.HEIGHT:mt.fh;let tw=Math.max(1,mt.tw+(mt.fw?gw-mt.fw:0)),th=Math.max(1,mt.th+(mt.fh?gh-mt.fh:0)),tx=fh&&mt.fw?gw-mt.tx-tw:mt.tx,ty=fv&&mt.fh?gh-mt.ty-th:mt.ty;
  if(g.ROTATE){[tw,th]=[th,tw];}const rx=gx+tx,ry=gy+ty,cx=rx+tw/2;
  switch(mt.fx){
  case'ENTRANCE':case'WINDOW':objs.push({k:'hatch',x:X(rx),y:Math.max(0,Y(ry)),dir:fh?-1:1,raw:1});hatches++;break;
  case'EXIT':case'LOCKEDEXIT':{if(mt.fx==='LOCKEDEXIT')miss('Locked exit left open');const j=groundAt(X(cx),Y(ry+th/2));objs.push({k:'door',x:X(cx),y:j===null?Y(ry+th):Y(j),raw:1,rw:Math.max(8,Math.round(tw*sc)),ry:Y(ry)-2,rh:Math.round(th*sc)+4});doors++;break;}
  case'WATER':objs.push({k:'pool',x:X(rx),y:Y(ry),w:Math.round(tw*sc),h:Math.round(th*sc)});break;
  case'FORCELEFT':case'FORCERIGHT':case'UPDRAFT':case'SPLATPAD':case'ANTISPLATPAD':case'SPLITTER':{const kk={FORCELEFT:'forcel',FORCERIGHT:'forcer',UPDRAFT:'updraft',SPLATPAD:'splat',ANTISPLATPAD:'nosplat',SPLITTER:'splitter'}[mt.fx];objs.push({k:kk,x:X(rx),y:Y(ry),rw:Math.max(2,Math.round(tw*sc)),rh:Math.max(2,Math.round(th*sc)),raw:1});break;}
  case'FIRE':objs.push({k:'fire',x:X(rx),y:Y(ry),rw:Math.round(tw*sc),rh:Math.round(th*sc),raw:1});break;
  case'TRAP':case'TRAPONCE':objs.push({k:'jaws',x:X(cx),y:Y(ry+th),rw:Math.round(tw*sc),rh:Math.round(th*sc),raw:1});break;
  case'TELEPORTER':case'RECEIVER':{const id=g.PAIRING!==undefined?+g.PAIRING:(g.S!==undefined?+g.S:(pairs.n=(pairs.n||0)+(mt.fx==='TELEPORTER'?1:0)));(pairs[id]=pairs[id]||{})[mt.fx]={x:X(cx),y:Y(ry+th),dir:fh?-1:1};break;}
  case'ONEWAYLEFT':case'ONEWAYRIGHT':case'ONEWAYDOWN':{const v=mt.fx==='ONEWAYLEFT'?4:mt.fx==='ONEWAYRIGHT'?5:6;for(let j=Math.max(0,ry);j<Math.min(h,ry+th);j++)for(let i=Math.max(0,rx);i<Math.min(w,rx+tw);i++){const k=j*w+i;if(one[k]&&mat[k]){mat[k]=v;ways++;}}break;}
  case'PICKUPSKILL':{const sn=String(g.SKILL||'').toUpperCase(),s=IMP_SKILL[sn]||IMP_NEW[sn];if(s){extra[s]=(extra[s]||0)+(+g.SKILLCOUNT||+g.SKILL_COUNT||1);miss('Skill pickups added to the panel');}else miss('Skill pickup removed');break;}
  case'BACKGROUND':case'':case'NONE':case'ONEWAYWALL':break;
  case'UNLOCKBUTTON':break;
  default:miss(mt.fx.charAt(0)+mt.fx.slice(1).toLowerCase()+' object removed');}}
 let p=0;for(const id of Object.keys(pairs)){const q=pairs[id];if(!q||typeof q!=='object')continue;if(q.TELEPORTER&&q.RECEIVER){objs.push({k:'warp',...q.TELEPORTER,p:p+3,raw:1},{k:'warp',...q.RECEIVER,p:p+3,recv:1,raw:1});p++;}else miss('Unpaired teleporter removed');}
 const placed=L.$LEMMING||[];if(!hatches)for(const q of placed){objs.push({k:'hatch',x:X(+q.X||0),y:Y(+q.Y||0),dir:q.FLIP_HORIZONTAL||q.DIRECTION==='left'||q.DIRECTION==='LEFT'?-1:1,ghost:1,...(q.CLIMBER?{cl:1}:{}),...(q.FLOATER||q.GLIDER?{fl:1}:{})});hatches++;}
 if(!hatches||!doors){const ms=[...new Set(G.map(g=>g.STYLE||g.COLLECTION||style).concat(T.map(p=>p.STYLE||p.COLLECTION||style)))].filter(s=>!/^\*group$/i.test(s)&&!(Object.keys(ImpFiles.styles).some(k=>k.startsWith(s.toLowerCase()+'/'))||NamidaStyles.has(s)));throw new Error(ms.length?'Missing style: '+ms[0]:!hatches?'This level has no hatch that could be read.':'This level has no exit that could be read.');}
 // skills
 const SKS=(L.$SKILLSET||[{}])[0],sk={climb:0,flap:0,boom:0,block:0,build:0,bash:0,pick:0,dig:0};const want={};
 for(const k of Object.keys(SKS)){const raw=SKS[k],c=raw===true||/^inf/i.test(String(raw))?99:(parseInt(raw,10)||0),s=IMP_SKILL[k];if(s)sk[s]+=Math.min(99,c);else if(IMP_NEW[k]){const n=Math.min(99,c);if(n>0)want[IMP_NEW[k]]=(want[IMP_NEW[k]]||0)+n;}else if(IMP_CLOSE[k]){sk[IMP_CLOSE[k]]+=Math.min(99,c);rep.push(k.charAt(0)+k.slice(1).toLowerCase()+' became '+skName(IMP_CLOSE[k])+'.');}else rep.push(k.charAt(0)+k.slice(1).toLowerCase()+' skill removed.');}
 for(const k of Object.keys(extra))if(IMP_NEW_KEYS.includes(k)){want[k]=(want[k]||0)+extra[k];delete extra[k];}
 const swap={};for(const k of IMP_NEW_KEYS){if(!want[k])continue;const slot=['dig','pick','bash','build','block','boom','flap','climb'].find(q=>!sk[q]&&!(extra[q])&&!swap[q]);if(!slot){rep.push((k==='swim'?'Swimmer':k==='disarm'?'Disarmer':'Walker')+' skill removed.');continue;}swap[slot]=k;sk[slot]=Math.min(99,want[k]);rep.push((k==='swim'?'Swimmer':k==='disarm'?'Disarmer':'Walker')+' now uses the '+skName(slot)+' slot.');}
 m.skills=Object.fromEntries(SK.map(k=>[k,Math.min(99,sk[k]+(extra[k]||0))]));if(Object.keys(swap).length)m.swap=swap;
 const total=clamp(num('LEMMINGS',num('LEMMING_COUNT',20)),1,999),si=L.MAX_SPAWN_INTERVAL!==undefined?num('MAX_SPAWN_INTERVAL',53):(L.RELEASE_RATE!==undefined?103-num('RELEASE_RATE',50):53),tl=parseInt(L.TIME_LIMIT,10),noTime=!Number.isFinite(tl)||tl<=0;
 const preset=placed.length,ghosts=objs.some(o=>o.ghost);if(preset&&!ghosts)rep.push(preset+' placed troops now come from the hatch.');if(ghosts){const lost=placed.filter(q=>q.BLOCKER||q.SWIMMER||q.SLIDER||q.DISARMER||q.ZOMBIE||q.NEUTRAL||q.SHIMMIER).length;rep.push(lost?'Troops start where they were placed. Climbers and floaters keep their skill; the other states are dropped.':'Troops start where they were placed.');}
 const packed=impPack(mat);
 Object.assign(m,{v:1,imported:1,by:impName(L.AUTHOR||'UNKNOWN'),name:impName(L.TITLE||lv.name),hint:impName(L.AUTHOR?'By '+L.AUTHOR:'Imported').slice(0,24)+'. '+'May not play like the original.',theme:IMP_WORLD[(style.match(/_(.+)$/)||[])[1]]||'bog',style:'puzzle',mode:'solo',race:race==='goblin'?undefined:race,w:Wn,h:Hn,n:objs.some(o=>o.ghost)?1:Math.ceil(total/hatches),need:clamp(num('SAVE_REQUIREMENT',1),1,total),rate:clamp(si*2,12,220),time:noTime?1800:clamp(Math.round(tl*1.36),30,5999),...(noTime?{noTime:1}:{}),...impExtras(L,X,Y,sc,oy,w,h,Wn,Hn),ops:[['M',w,h,sc,ox,oy,packed,...(skn.some(v=>v)?[impSkinPack(skn)]:[])]],objs,rules:[],trig:[],plan:[],src:lv.pack,key:lv.path});
 {const refd=new Set();for(const p of T)if(p.PIECE)refd.add(String(p.STYLE||p.COLLECTION||style));for(const g of G)if(g.PIECE)refd.add(String(g.STYLE||g.COLLECTION||style));m.found=[...refd].filter(x=>!guessed.has(x)&&!gone['style:'+x]&&!/^\*group$/i.test(x)).slice(0,40);m.guessed=[...guessed].slice(0,40);}
 if(guessed.size)rep.unshift('BEST GUESS: style '+[...guessed].join(', ')+' was not found, so pieces were sized and shaped from their names. This level may not play like the original.');
 if(lost)rep.push(lost+' terrain pieces could not be found.');
 if(ways)rep.push('One-way walls included.');
 if(parked)rep.push('Ignored '+parked+' pieces the level had parked far off the map.');
 for(const[k,n]of Object.entries(gone)){if(k.startsWith('style:'))rep.push('Missing style: '+k.slice(6));else if(k.startsWith('object:'))rep.push('Unknown object: '+k.slice(7));else if(!rep.includes(k+'.'))rep.push(k+'.');}
 if(art){m.art=1;const ok=await ImpArt.put(lv.path,{w,h,d:col});if(!ok)rep.push('Terrain art could not be saved, so it will last until you close the game.');}
 m.report=rep;m.incomplete=lost>0;return m;}
window.__IMP={ImpFiles,impConvert,nxParse};
