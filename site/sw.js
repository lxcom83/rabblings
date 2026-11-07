// offline support: try the network first so players get updates, and fall back to the saved copy
const CACHE='rabblings-__VERSION__',FILES=__FILES__;
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(async c=>{await Promise.all(FILES.map(f=>c.add(f).catch(()=>{})));}));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(L=>Promise.all(L.filter(k=>k.startsWith('rabblings-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// pages give the network 4 seconds, then use the saved copy, so a weak signal never leaves a blank screen
const fromCache=r=>caches.match(r,{ignoreSearch:true}).then(a=>a||(r.mode==='navigate'?caches.match(new URL('play/',self.registration.scope).href):Response.error()));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
 const net=fetch(r).then(a=>{if(a.ok){const c=a.clone();caches.open(CACHE).then(x=>x.put(r,c));}return a;});
 if(r.mode!=='navigate'){e.respondWith(net.catch(()=>fromCache(r)));return;}
 e.respondWith(new Promise(ok=>{let done=false;const finish=v=>{if(!done){done=true;ok(v);}};
  const t=setTimeout(()=>fromCache(r).then(a=>{if(a&&a.ok)finish(a);}),4000);
  net.then(a=>{clearTimeout(t);finish(a);}).catch(()=>{clearTimeout(t);fromCache(r).then(finish);});}));});
