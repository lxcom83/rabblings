// starts the right first screen for this build
if(BUILD==='builder'){setSides();setScene(MapsScene);try{const id=localStorage.getItem('rabblings-open');if(id){localStorage.removeItem('rabblings-open');const o=Store.all().find(a=>a.id===id);if(o)MapsScene.edit(o);}}catch(e){}}else setScene(TitleScene);
requestAnimationFrame(frame);
