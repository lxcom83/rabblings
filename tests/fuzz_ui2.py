# aimed checks: heavy builder use, result screens, damaged saves and map data, 2 player pause rule, map resizing
import asyncio,json,os
from playwright.async_api import async_playwright
import re
src=open('tests/fuzz_ui.py').read();SETUP=re.search(r"SETUP='''(.*?)'''",src,re.S).group(1)
ED='''(seed)=>new Promise(res=>{let s=seed,n=0;const rnd=()=>{s=(s*1664525+1013904223)|0;return((s>>>8)&0xffffff)/0xffffff;};const m=__GS.genMap({tpl:['march','climb','raid'][seed%3],type:'auto',traps:2,foes:2,mach:2,pool:1,theme:'caves',mode:['solo','mirror','free'][seed%3],w:800,h:300,seed});__GS.Ed.open(m);setScene(__GS.Ed);
 const T=setInterval(()=>{for(let q=0;q<4;q++){if(window.DLG){dlg.close();continue;}if(Ed.ddo===null&&rnd()<.05)Ed.panel=[null,'basics','play','skills','rules','trig','random'][rnd()*7|0];const L=hits.filter(h=>h.fn&&!/^MAPS$|TEST|SHARE/.test(h.l||''));const r=rnd();try{if(r<.6&&L.length){const h=L[rnd()*L.length|0];pointerX=h.x+h.w/2;pointerY=h.y+h.h/2;h.fn();}else if(!Ed.panel&&!Ed.ddo){const x=106+rnd()*370|0,y=18+rnd()*210|0;pointerX=x;pointerY=y;ptrBtn=0;Ed.pdown(1,x,y);Ed.pmove(1,x+rnd()*40-20,y+rnd()*40-20);Ed.pup(1,x+5,y+5);}else if(rnd()<.3&&Ed.ddo===null){press.Escape=1;}if(rnd()<.03)Ed.undo();if(rnd()<.02)Ed.redo();}catch(e){__F.errs.push('ed: '+e.message+' '+String(e.stack).split('\\n')[1]);}if(scene!==Ed)setScene(Ed);}__F.scenes.Ed=(__F.scenes.Ed||0)+4;if(++n>500){clearInterval(T);const P=mapProblems(Ed.map);let ok=1;try{new __GS.World(__GS.toDef(JSON.parse(JSON.stringify(Ed.map))),{quiet:true,vs:Ed.map.mode!=='solo'});}catch(e){ok=e.message;}res({P:P[0],ok,w:Ed.map.w,objs:Ed.map.objs.length,outside:Ed.map.objs.filter(o=>o.x>=Ed.map.w||o.y>=Ed.map.h).length});}},12);})'''
BAD='''async()=>{const G=__GS,out={},junk=[null,1,'x',[],{},{ops:1,objs:2},{ops:[],objs:[]},{ops:[[]],objs:[null,{}]},{ops:[['G','nope',1],['S','nope',1,1],['L',1,'a'],['B',1,NaN,0,1e9,1e9]],objs:[{k:'hatch',x:'a',y:1},{k:'door',x:1e9,y:-5},{k:'nest',x:1,y:1,kind:'zzz',hp:-1},{k:'warp',x:1,y:1,p:99},{k:'__proto__',x:1,y:1}]},{ops:[],objs:[],w:-5,h:1e9,n:0,time:0,skills:{climb:-3},rules:['x'],trig:[{w:'x'},{w:'timer',a:'on:flood',n:'z'}],goal:'x',race:'x',theme:'constructor',swap:{climb:'nuke'}}];
 let okc=0;for(const j of junk){try{const m=G.cleanMap(JSON.parse(JSON.stringify(j)));okc++;mapProblems(m);const d=G.toDef(m);const w=new G.World(d,{quiet:true});for(let i=0;i<30;i++)w.step();}catch(e){if(!/damaged/.test(e.message))(out.fail=out.fail||[]).push(String(e.message).slice(0,120)+' for '+JSON.stringify(j).slice(0,70));}}out.cleaned=okc;
 for(const c of ['','GS1','GS1z','GS1zAAAA','GS1p!!!!','hello']){try{await G.unpackMap(c);(out.code=out.code||[]).push('accepted '+c);}catch(e){}}
 for(const f of ['','{','[]','{"maps":[]}','{"maps":[1,2]}','{"maps":[{"ops":[],"objs":[]}]}']){try{const r=await G.readMapFile(f);(out.file=out.file||[]).push(f+' -> '+r.length);}catch(e){(out.fileErr=out.fileErr||[]).push(e.message.slice(0,40));}}
 return out;}'''
RES='''async()=>{const G=__GS,out=[];const ser=(cpu)=>({cpu,i:0,wins:[0,0],draws:0,sides:[{race:'imp',clan:0},{race:'rat',clan:1}]});
 for(const[tag,def,s]of [['solo',G.LEVELS[0],null],['vs',G.ARENAS[0],ser(false)],['cpu',G.ARENAS[1],ser(true)]]){for(const win of [1,0]){try{G.setSides([{race:'imp',clan:0},{race:'rat',clan:1}]);Play.begin(def,s);G.setScene(Play);const w=Play.world;await new Promise(r=>setTimeout(r,80));w.pl[0].saved=win?(def.need||20):0;if(w.pl[1])w.pl[1].saved=win?0:8;w.won=!!win;w.over=true;Result.show(w,s);G.setScene(Result);await new Promise(r=>setTimeout(r,160));out.push(tag+win);Result.t=2;}catch(e){out.push(tag+win+' ERR '+e.message);}}}
 return out;}'''
PAUSE='''async()=>{const G=__GS;G.setSides();Play.begin(G.ARENAS[0],{cpu:false,i:0,wins:[0,0],draws:0,sides:[{race:'goblin',clan:0},{race:'goblin',clan:1}]});G.setScene(Play);await new Promise(r=>setTimeout(r,150));press.Escape=1;await new Promise(r=>setTimeout(r,150));const a=Play.paused;press.KeyP=1;await new Promise(r=>setTimeout(r,120));const b=Play.paused;Play.paused=false;G.setScene(TitleScene);Play.begin(G.LEVELS[0],null);G.setScene(Play);await new Promise(r=>setTimeout(r,150));press.Escape=1;await new Promise(r=>setTimeout(r,150));const c=Play.paused;Play.paused=false;return{twoPlayerPaused:a||b,soloPaused:c};}'''
async def main():
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>'+open('build/rabblings-all.html').read()+'</body></html>')
    url='file://'+os.getcwd()+'/run.html'
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540});pe=[];pg.on('pageerror',lambda e:pe.append(str(e)[:220]))
        await pg.goto(url);await pg.wait_for_timeout(400);await pg.evaluate(SETUP)
        print('ED',[await pg.evaluate(ED,s) for s in [1,2,3,4,5,6]])
        print('FUZZ',json.dumps(await pg.evaluate("()=>({errs:[...new Set(__F.errs)].slice(0,12),over:Object.keys(__F.over).slice(0,30),off:Object.keys(__F.off).filter(k=>!/^Play|text \"[<>]\"/.test(k)).slice(0,30)})"))[:1800])
        print('BAD',json.dumps(await pg.evaluate(BAD))[:1500])
        print('RES',await pg.evaluate(RES));print('PAUSE',await pg.evaluate(PAUSE))
        print('FUZZ2',json.dumps(await pg.evaluate("()=>({errs:[...new Set(__F.errs)].slice(0,8),over:Object.keys(__F.over).slice(0,30),off:Object.keys(__F.off).filter(k=>!/text \"[<>]\"/.test(k)).slice(0,30)})"))[:1200])
        # damaged saves
        await pg.evaluate("()=>{localStorage.setItem('goblin-scramble','{broken');localStorage.setItem('goblin-scramble-maps','not json');}");await pg.reload();await pg.wait_for_timeout(500)
        print('corrupt saves ok',await pg.evaluate("[scene===TitleScene,Store.all().length]"))
        await pg.evaluate("()=>{localStorage.setItem('goblin-scramble-maps','[1,null,{\"objs\":3},{\"name\":\"x\"}]');}");await pg.reload();await pg.wait_for_timeout(500)
        print('odd maps',await pg.evaluate("()=>{try{setScene(MapsScene);MapsScene.draw();return Store.all().length}catch(e){return 'ERR '+e.message}}"))
        print('pageerrors',pe[:6]);await b.close()
asyncio.run(main())
