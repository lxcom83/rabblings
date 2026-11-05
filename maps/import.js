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
const ImpFiles={styles:{},levels:[],names:[],
 note(p,read,src){p=p.replace(/\\/g,'/');const s=p.match(/(?:^|\/)styles\/([^\/]+)\/(terrain|objects)\/([^\/]+)\.(png|nxmt|nxmo)$/i);
  if(s){this.styles[(s[1]+'/'+s[2]+'/'+s[3]+'.'+s[4]).toLowerCase()]=read;return;}
  if(/\.nxlv$/i.test(p)){const seg=p.split('/');seg.pop();let i=seg.findIndex(a=>a.toLowerCase()==='levels');const top=i>=0&&seg[i+1]?seg[i+1]:seg[0]||src;this.levels.push({path:p,pack:top,name:p.split('/').pop().replace(/\.nxlv$/i,''),read});}},
 async add(list){for(const f of list){const n=f.name,rel=f.webkitRelativePath||n;if(/\.zip$/i.test(n)){for(const e of await zipEntries(f))this.note(e.path,e.read,n.replace(/\.zip$/i,''));this.names.push(n);}else this.note(rel,async()=>new Uint8Array(await f.arrayBuffer()),'MY LEVELS');}
  const seen=new Set();this.levels=this.levels.filter(l=>!seen.has(l.pack+'/'+l.path)&&seen.add(l.pack+'/'+l.path));},
 packs(){const m={};for(const l of this.levels)(m[l.pack]=m[l.pack]||[]).push(l);return Object.keys(m).sort().map(k=>({name:k,levels:m[k].sort((a,b)=>a.path<b.path?-1:1)}));},
 hasStyles(){return Object.keys(this.styles).length>0;}};

// .nxlv and its relatives are plain text: KEY value lines, with $SECTION ... $END blocks
function nxParse(text){const root={},stack=[root];for(let line of text.split(/\r?\n/)){line=line.trim();if(!line||line[0]==='#')continue;
  if(line[0]==='$'){const k=line.slice(1).trim().toUpperCase();if(k==='END'){if(stack.length>1)stack.pop();continue;}const o={};(stack[stack.length-1]['$'+k]=stack[stack.length-1]['$'+k]||[]).push(o);stack.push(o);continue;}
  const sp=line.search(/\s/),k=(sp<0?line:line.slice(0,sp)).toUpperCase(),v=sp<0?true:line.slice(sp+1).trim();stack[stack.length-1][k]=v;}return root;}
const txtOf=u=>new TextDecoder().decode(u);

// piece shapes are read once from the player's files and only their outline is used
const ImpCache={shape:{},meta:{},steel:{}};
async function pngMask(bytes){const bmp=await createImageBitmap(new Blob([bytes],{type:'image/png'})),[c,x]=mk(bmp.width,bmp.height);x.drawImage(bmp,0,0);const id=x.getImageData(0,0,bmp.width,bmp.height),d=id.data,m=new Uint8Array(bmp.width*bmp.height);for(let i=0;i<m.length;i++)m[i]=d[i*4+3]>=128?1:0;const o={w:bmp.width,h:bmp.height,m,c:new Uint32Array(d.buffer)};bmp.close&&bmp.close();return o;}
async function impShape(style,piece){const k=(style+'/terrain/'+piece).toLowerCase();if(k in ImpCache.shape)return ImpCache.shape[k];const r=ImpFiles.styles[k+'.png'];if(!r)return ImpCache.shape[k]=null;
 const s=await pngMask(await r());const mt=ImpFiles.styles[k+'.nxmt'];s.steel=mt?/^\s*STEEL/mi.test(txtOf(await mt())):/(^|_)steel/i.test(piece);return ImpCache.shape[k]=s;}
async function impMeta(style,piece){const k=(style+'/objects/'+piece).toLowerCase();if(k in ImpCache.meta)return ImpCache.meta[k];const r=ImpFiles.styles[k+'.nxmo'];if(!r)return ImpCache.meta[k]=null;const p=nxParse(txtOf(await r()));
 const a=(p.$PRIMARY_ANIMATION||[{}])[0],fr=+(a.FRAMES||p.FRAMES||1)||1,horiz=!!(a.HORIZONTAL_STRIP||p.HORIZONTAL_STRIP);let w=+p.TRIGGER_WIDTH||0,h=+p.TRIGGER_HEIGHT||0,fw=0,fh=0;const png=ImpFiles.styles[k+'.png'];if(png){const bmp=await createImageBitmap(new Blob([await png()],{type:'image/png'}));fw=horiz?bmp.width/fr:bmp.width;fh=horiz?bmp.height:bmp.height/fr;bmp.close&&bmp.close();}
 return ImpCache.meta[k]={fx:String(p.EFFECT||'').toUpperCase(),tx:+p.TRIGGER_X||0,ty:+p.TRIGGER_Y||0,tw:w,th:h,fw,fh};}
function impTurn(s,rot,fh,fv){let{w,h,m,c}=s;if(rot){const n=new Uint8Array(w*h),e=new Uint32Array(w*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const k=x*h+(h-1-y);n[k]=m[y*w+x];e[k]=c[y*w+x];}m=n;c=e;[w,h]=[h,w];}
 if(fh||fv){const n=new Uint8Array(w*h),e=new Uint32Array(w*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const k=(fv?h-1-y:y)*w+(fh?w-1-x:x);n[k]=m[y*w+x];e[k]=c[y*w+x];}m=n;c=e;}return{w,h,m,c};}

// material runs, stored inside the map as one text step: A-G is the material, lowercase/digits the run length
function impPack(a){let s='',i=0;const n=a.length,L=[];while(i<n){let j=i+1;while(j<n&&a[j]===a[i])j++;L.push(String.fromCharCode(65+a[i])+(j-i).toString(36));i=j;}return L.join('');}
function impUnpack(s,w,h){const a=new Uint8Array(w*h),re=/([A-G])([0-9a-z]+)/g;let m,i=0;while((m=re.exec(s))){const v=m[1].charCodeAt(0)-65,n=parseInt(m[2],36);if(v)a.fill(v,i,Math.min(i+n,a.length));i+=n;}return a;}
// smooth 2x: keeps slopes as slopes, so the upscaled terrain does not look like stairs
function impGrow(a,w,h){const W=w*2,o=new Uint8Array(W*h*2);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=a[y*w+x],A=y?a[(y-1)*w+x]:p,D=y<h-1?a[(y+1)*w+x]:p,C=x?a[y*w+x-1]:p,B=x<w-1?a[y*w+x+1]:p;let e=[p,p,p,p];if(C===A&&C!==D&&A!==B)e[0]=A;if(A===B&&A!==C&&B!==D)e[1]=B;if(D===C&&D!==B&&C!==A)e[2]=C;if(B===D&&B!==A&&D!==C)e[3]=D;const k=y*2*W+x*2;o[k]=e[0];o[k+1]=e[1];o[k+W]=e[2];o[k+W+1]=e[3];}return o;}
// used by Shaper for the imported terrain step
function impStamp(S,o){const[,w,h,sc,ox,oy,run]=o,T=S.T;let a=impUnpack(run,w,h),W=w,H=h;if(sc===2){a=impGrow(a,w,h);W*=2;H*=2;}for(let y=0;y<H;y++){const ty=y+oy;if(ty<0||ty>=T.h)continue;for(let x=0;x<W;x++){const tx=x+ox;if(tx>=0&&tx<T.w&&a[y*W+x])T.m[ty*T.w+tx]=a[y*W+x];}}}

function impName(s){return String(s||'IMPORTED').toUpperCase().replace(/[^A-Z0-9 .,!?'&:+\-]/g,' ').replace(/\s+/g,' ').trim().slice(0,24)||'IMPORTED';}
async function impConvert(lv,race,art){const src=txtOf(await lv.read()),L=nxParse(src),rep=[],num=(k,d)=>{const v=parseInt(L[k],10);return Number.isFinite(v)?v:d;};
 const w=num('WIDTH',320),h=num('HEIGHT',160),style=String(L.THEME||L.STYLE||'').trim(),m=blankMap('puzzle'),gone={};const miss=(t)=>{gone[t]=(gone[t]||0)+1;};
 if(w<1||h<1||w*h>9e6)throw new Error('The level size looks wrong.');
 const mat=new Uint8Array(w*h),one=new Uint8Array(w*h),col=art?new Uint32Array(w*h):null,T=L.$TERRAIN||[],G=L.$GADGET||L.$OBJECT||[];let lost=0;
 for(const p of T){const st=p.STYLE||p.COLLECTION||style,sh=p.PIECE?await impShape(st,p.PIECE):null;if(!sh){lost++;miss('style:'+st);continue;}
  const q=impTurn(sh,p.ROTATE,p.FLIP_HORIZONTAL,p.FLIP_VERTICAL),px=+p.X||0,py=+p.Y||0,er=!!p.ERASE,keep=!!p.NO_OVERWRITE,ow=p.ONE_WAY&&!sh.steel?1:0;
  for(let j=0;j<q.h;j++){const ty=j+py;if(ty<0||ty>=h)continue;for(let i=0;i<q.w;i++){if(!q.m[j*q.w+i])continue;const tx=i+px;if(tx<0||tx>=w)continue;const k=ty*w+tx;if(er){mat[k]=0;one[k]=0;if(col)col[k]=0;}else if(!keep||!mat[k]){mat[k]=sh.steel?2:1;one[k]=ow;if(col)col[k]=q.c[j*q.w+i]|0xff000000;}}}}
 const objs=[],pairs={},extra={};let hatches=0,doors=0,ways=0;const sc=(w*h*IMP_SCALE*IMP_SCALE>IMP_MAXAREA)?1:IMP_SCALE,Wn=Math.max(480,w*sc),Hn=Math.max(240,h*sc),ox=0,oy=Hn-h*sc;const X=v=>Math.round(v*sc)+ox,Y=v=>Math.round(v*sc)+oy;
 if(sc===1)rep.push('Very large level: kept at half size, so it will feel tight.');
 const groundAt=(x,y)=>{x=clamp(x/sc|0,0,w-1);let j=clamp((y-oy)/sc|0,0,h-1);if(mat[j*w+x]){let n=0;while(j>0&&mat[(j-1)*w+x]&&n<16){j--;n++;}if(n>=16)return null;}else{let n=0;while(j<h&&!mat[j*w+x]&&n<16){j++;n++;}if(j>=h||n>=16)return null;}return j;};
 for(const g of G){const st=g.STYLE||g.COLLECTION||style,mt=g.PIECE?await impMeta(st,g.PIECE):null;if(!mt){miss('object:'+g.PIECE);continue;}
  const fh=!!g.FLIP_HORIZONTAL,fv=!!g.FLIP_VERTICAL,gx=+g.X||0,gy=+g.Y||0,gw=g.WIDTH!==undefined?+g.WIDTH:mt.fw,gh=g.HEIGHT!==undefined?+g.HEIGHT:mt.fh;let tw=Math.max(1,mt.tw+(mt.fw?gw-mt.fw:0)),th=Math.max(1,mt.th+(mt.fh?gh-mt.fh:0)),tx=fh&&mt.fw?gw-mt.tx-tw:mt.tx,ty=fv&&mt.fh?gh-mt.ty-th:mt.ty;
  if(g.ROTATE){[tw,th]=[th,tw];}const rx=gx+tx,ry=gy+ty,cx=rx+tw/2;
  switch(mt.fx){
  case'ENTRANCE':case'WINDOW':objs.push({k:'hatch',x:X(rx),y:Math.max(0,Y(ry)),dir:fh?-1:1,raw:1});hatches++;break;
  case'EXIT':case'LOCKEDEXIT':{if(mt.fx==='LOCKEDEXIT')miss('Locked exit left open');const j=groundAt(X(cx),Y(ry+th/2));objs.push({k:'door',x:X(cx),y:j===null?Y(ry+th):Y(j),raw:1,rw:Math.max(8,Math.round(tw*sc)),ry:Y(ry)-2,rh:Math.round(th*sc)+4});doors++;break;}
  case'WATER':objs.push({k:'pool',x:X(rx),y:Y(ry),w:Math.round(tw*sc),h:Math.round(th*sc)});break;
  case'FIRE':objs.push({k:'fire',x:X(rx),y:Y(ry),rw:Math.round(tw*sc),rh:Math.round(th*sc),raw:1});break;
  case'TRAP':case'TRAPONCE':objs.push({k:'jaws',x:X(cx),y:Y(ry+th),rw:Math.round(tw*sc),rh:Math.round(th*sc),raw:1});break;
  case'TELEPORTER':case'RECEIVER':{const id=g.PAIRING!==undefined?+g.PAIRING:(g.S!==undefined?+g.S:(pairs.n=(pairs.n||0)+(mt.fx==='TELEPORTER'?1:0)));(pairs[id]=pairs[id]||{})[mt.fx]={x:X(cx),y:Y(ry+th),dir:fh?-1:1};break;}
  case'ONEWAYLEFT':case'ONEWAYRIGHT':case'ONEWAYDOWN':{const v=mt.fx==='ONEWAYLEFT'?4:mt.fx==='ONEWAYRIGHT'?5:6;for(let j=Math.max(0,ry);j<Math.min(h,ry+th);j++)for(let i=Math.max(0,rx);i<Math.min(w,rx+tw);i++){const k=j*w+i;if(one[k]&&mat[k]){mat[k]=v;ways++;}}break;}
  case'PICKUPSKILL':{const s=IMP_SKILL[String(g.SKILL||'').toUpperCase()];if(s){extra[s]=(extra[s]||0)+(+g.SKILL_COUNT||1);miss('Skill pickups added to the panel');}else miss('Skill pickup removed');break;}
  case'BACKGROUND':case'':case'NONE':case'ONEWAYWALL':break;
  case'UNLOCKBUTTON':break;
  default:miss(mt.fx.charAt(0)+mt.fx.slice(1).toLowerCase()+' object removed');}}
 let p=0;for(const id of Object.keys(pairs)){const q=pairs[id];if(!q||typeof q!=='object')continue;if(q.TELEPORTER&&q.RECEIVER){objs.push({k:'warp',...q.TELEPORTER,p:p+3,raw:1},{k:'warp',...q.RECEIVER,p:p+3,recv:1,raw:1});p++;}else miss('Unpaired teleporter removed');}
 const placed=L.$LEMMING||[];if(!hatches)for(const q of placed){objs.push({k:'hatch',x:X(+q.X||0),y:Y(+q.Y||0),dir:q.FLIP_HORIZONTAL||q.DIRECTION==='left'||q.DIRECTION==='LEFT'?-1:1,ghost:1});hatches++;}
 if(!hatches||!doors){const ms=[...new Set(G.map(g=>g.STYLE||g.COLLECTION||style).concat(T.map(p=>p.STYLE||p.COLLECTION||style)))].filter(s=>!Object.keys(ImpFiles.styles).some(k=>k.startsWith(s.toLowerCase()+'/')));throw new Error(ms.length?'Missing style: '+ms[0]:!hatches?'This level has no hatch that could be read.':'This level has no exit that could be read.');}
 // skills
 const SKS=(L.$SKILLSET||[{}])[0],sk={climb:0,flap:0,boom:0,block:0,build:0,bash:0,pick:0,dig:0};
 for(const k of Object.keys(SKS)){const c=SKS[k]===true?99:(parseInt(SKS[k],10)||0),s=IMP_SKILL[k];if(s)sk[s]+=Math.min(99,c);else if(IMP_CLOSE[k]){sk[IMP_CLOSE[k]]+=Math.min(99,c);rep.push(k.charAt(0)+k.slice(1).toLowerCase()+' became '+skName(IMP_CLOSE[k])+'.');}else rep.push(k.charAt(0)+k.slice(1).toLowerCase()+' skill removed.');}
 m.skills=Object.fromEntries(SK.map(k=>[k,Math.min(99,sk[k]+(extra[k]||0))]));
 const total=clamp(num('LEMMINGS',num('LEMMING_COUNT',20)),1,200),si=L.MAX_SPAWN_INTERVAL!==undefined?num('MAX_SPAWN_INTERVAL',53):(L.RELEASE_RATE!==undefined?53-Math.round(num('RELEASE_RATE',1)/2):53);
 const preset=placed.length,ghosts=objs.some(o=>o.ghost);if(preset&&!ghosts)rep.push(preset+' placed troops now come from the hatch.');if(ghosts)rep.push('Troops start where they were placed, without their special skills.');
 const packed=impPack(mat);
 Object.assign(m,{v:1,imported:1,by:impName(L.AUTHOR||'UNKNOWN'),name:impName(L.TITLE||lv.name),hint:impName(L.AUTHOR?'By '+L.AUTHOR:'Imported').slice(0,24)+'. '+'May not play like the original.',theme:IMP_WORLD[(style.match(/_(.+)$/)||[])[1]]||'bog',style:'puzzle',mode:'solo',race:race==='goblin'?undefined:race,w:Wn,h:Hn,n:objs.some(o=>o.ghost)?1:Math.ceil(total/hatches),need:clamp(num('SAVE_REQUIREMENT',1),1,total),rate:clamp(si*2,12,220),time:L.TIME_LIMIT!==undefined?clamp(Math.round(num('TIME_LIMIT',300)*1.36),30,1800):1800,ops:[['M',w,h,sc,ox,oy,packed]],objs,rules:[],trig:[],plan:[],src:lv.pack,key:lv.path});
 if(lost)rep.push(lost+' terrain pieces could not be found.');
 if(ways)rep.push('One-way walls included.');
 for(const[k,n]of Object.entries(gone)){if(k.startsWith('style:'))rep.push('Missing style: '+k.slice(6));else if(k.startsWith('object:'))rep.push('Unknown object: '+k.slice(7));else if(!rep.includes(k+'.'))rep.push(k+'.');}
 if(art){m.art=1;const ok=await ImpArt.put(lv.path,{w,h,d:col});if(!ok)rep.push('Terrain art could not be saved, so it will last until you close the game.');}
 m.report=rep;m.incomplete=lost>0;return m;}
window.__IMP={ImpFiles,impConvert,nxParse};
