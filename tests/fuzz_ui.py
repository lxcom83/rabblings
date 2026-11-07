# random clicks and keys on every screen: looks for crashes, labels too wide for buttons and text off screen
import asyncio,json,os,sys
from playwright.async_api import async_playwright
SETUP='''()=>{window.__F={errs:[],over:{},off:{},scenes:{},clicks:0};addEventListener('error',e=>{__F.errs.push(String(e.message)+' @'+e.lineno);});addEventListener('unhandledrejection',e=>{__F.errs.push('promise '+String(e.reason&&e.reason.message||e.reason));});
 const name=()=>{for(const[k,v]of Object.entries(window.__SC))if(v===scene)return k;return'?';};window.__name=name;
 const ob=window.button;window.button=function(C,x,y,w,h,l,fn,o){ob(C,x,y,w,h,l,fn,o);hits[hits.length-1].l=String(l);if(l!==undefined&&l!==''&&String(l).length*6-1>w)__F.over[name()+': '+l+' in '+w]=1;if(x<-1||y<-1||x+w>VW+1||y+h>VH+1)__F.off[name()+': button '+l+' at '+[x,y,w,h].join(',')]=1;};
 const ot=window.txt;window.txt=function(C,s,x,y,col,o){ot(C,s,x,y,col,o);o=o||{};const sc=o.s||1,W=String(s).length*6*sc-sc,X=o.c?x-W/2:o.r?x-W:x;if(X<-1||X+W>VW+1||y<-2||y+7*sc>VH+2)__F.off[name()+': text "'+String(s).slice(0,44)+'"']=1;};
 window.__SC={Title:TitleScene,Maps:MapsScene,Race:RaceScene,New:NewMap,Ed,Play,Brief:BriefScene,Result,Help:HelpScene,Level:LevelScene,Import:ImportScene};}'''
STEP='''(seed)=>new Promise(res=>{let s=seed,n=0;const rnd=()=>{s=(s*1664525+1013904223)|0;return((s>>>8)&0xffffff)/0xffffff;};const keys=['Enter','Escape','Space','KeyG','KeyT','KeyC','KeyV','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyW','KeyA','KeyS','KeyD','KeyP','KeyF','KeyH','Delete'];
 const T=setInterval(()=>{for(let q=0;q<3;q++){__F.scenes[__name()]=(__F.scenes[__name()]||0)+1;if(window.DLG){dlg.close();continue;}const r=rnd();if(r<.72&&hits.length){const L=hits.filter(h=>h.fn&&!/BACK TO|^QUIT|LIGHT ALL/.test(h.l||'')),h=L[rnd()*L.length|0];if(h){pointerX=h.x+h.w/2;pointerY=h.y+h.h/2;try{h.fn();__F.clicks++;}catch(e){__F.errs.push('click '+(h.l||'')+' in '+__name()+': '+e.message+' '+String(e.stack).split('\\n')[1]);}}}else if(r<.86){const k=keys[rnd()*keys.length|0];press[k]=1;held[k]=1;setTimeout(()=>{held[k]=0;},30);}else if(scene===Ed&&!Ed.panel){const x=104+rnd()*370|0,y=20+rnd()*210|0;try{Ed.pdown(1,x,y);Ed.pmove(1,x+rnd()*30,y+rnd()*30);Ed.pup(1,x+5,y+5);}catch(e){__F.errs.push('map click: '+e.message+' '+String(e.stack).split('\\n')[1]);}}}if(++n>1300){clearInterval(T);res();}},12);})'''
async def main():
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>'+open('build/rabblings-all.html').read()+'</body></html>')
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540});pe=[];pg.on('pageerror',lambda e:pe.append(str(e)[:200]))
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500);await pg.evaluate(SETUP)
        for i,start in enumerate(['setScene(MapsScene)','setScene(TitleScene);TitleScene.menu=1','setScene(NewMap)','__GS.Ed.open(__GS.genMap({tpl:"raid",type:"pillars",traps:2,foes:2,mach:2,pool:1,theme:"forge",mode:"free",w:800,h:300,seed:5}));setScene(__GS.Ed)','RaceScene.mode="vs";setScene(RaceScene)','RaceScene.mode="camp";setScene(RaceScene)']):
            await pg.evaluate('()=>{'+start+'}');await pg.evaluate(STEP,1234+i*77)
        print(json.dumps(await pg.evaluate("()=>({errs:[...new Set(__F.errs)].slice(0,14),clicks:__F.clicks,scenes:__F.scenes,over:Object.keys(__F.over).slice(0,40),off:Object.keys(__F.off).slice(0,40)})"),indent=0)[:4200]);print('pageerrors',pe[:6]);await b.close()
asyncio.run(main())
