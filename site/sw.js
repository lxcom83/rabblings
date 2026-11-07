// offline support: try the network first so players get updates, and fall back to the saved copy
const CACHE='rabblings-__VERSION__',FILES=__FILES__;
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(async c=>{await Promise.all(FILES.map(f=>c.add(f).catch(()=>{})));}));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(L=>Promise.all(L.filter(k=>k.startsWith('rabblings-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;e.respondWith(fetch(r).then(a=>{if(a.ok){const c=a.clone();caches.open(CACHE).then(x=>x.put(r,c));}return a;}).catch(()=>caches.match(r,{ignoreSearch:true}).then(a=>a||(r.mode==='navigate'?caches.match(new URL('play/',self.registration.scope).href):Response.error()))));});
