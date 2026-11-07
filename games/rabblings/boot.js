// starts the right first screen for this build
if(BUILD==='builder'){setSides();setScene(MapsScene);if(location.hash==='#neolemmix'){try{history.replaceState(null,'',location.pathname);}catch(e){}setScene(ImportScene);}try{const id=localStorage.getItem('rabblings-open');if(id){localStorage.removeItem('rabblings-open');const o=Store.all().find(a=>a.id===id);if(o)MapsScene.edit(o);}}catch(e){}}else setScene(TitleScene);
requestAnimationFrame(frame);
