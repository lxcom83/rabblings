// starts the right first screen for this build, once saved maps and packs are loaded
const bootGame=()=>{if(BUILD==='builder'){setSides();setScene(MapsScene);if(location.hash==='#neolemmix'){try{history.replaceState(null,'',location.pathname);}catch(e){}setScene(ImportScene);}try{const id=localStorage.getItem('rabblings-open');if(id){localStorage.removeItem('rabblings-open');const o=Store.all().find(a=>a.id===id);if(o)MapsScene.edit(o);}}catch(e){}}else setScene(TitleScene);
{const m=String(location.hash).match(/^#pack=(.+)$/);if(m){try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}setScene(PacksScene);PacksScene.fetchLink('#pack='+m[1]);}}
requestAnimationFrame(frame);};
Promise.race([StoreDB.init(),new Promise(r=>setTimeout(r,4000))]).catch(()=>{}).then(bootGame);
