# checks the play and builder pages, shared saves, upgrades of old maps and proofs
import asyncio,json,os,re,functools,http.server,threading
from playwright.async_api import async_playwright
OLD='''()=>{const G=__GS;const a={v:1,name:'OLD MAP',hint:'x',theme:'bog',style:'puzzle',mode:'solo',w:640,h:300,n:20,need:12,rate:32,time:240,skills:{climb:3,flap:3,boom:3,block:3,build:5,bash:3,pick:3,dig:3},ops:[['B',1,0,220,640,80]],objs:[{k:'hatch',x:100,y:150,dir:1},{k:'door',x:400,y:220},{k:'zone',x:200,y:100,w:40,h:40,id:3},{k:'warp',x:150,y:220,p:0},{k:'warp',x:300,y:220,p:0}],rules:[],trig:[]};
 const before=G.mapSig(JSON.parse(JSON.stringify(a)));const u=G.cleanMap(JSON.parse(JSON.stringify(a)));const after=G.mapSig(u);
 return{fmt:u.fmt,game:u.game,gen:u.gen,uids:u.objs.map(o=>o.uid),zoneTrigger:u.objs.find(o=>o.k==='zone').id,linkKept:(()=>{const c=JSON.parse(JSON.stringify(u));c.objs[0].link=c.objs[1].uid;c.objs[1].link=999;const r=G.cleanMap(c);return[r.objs[0].link,r.objs[1].link];})()};}'''
CODE='''async()=>{const G=__GS;const m=G.genMap({tpl:'march',type:'hills',traps:1,foes:1,mach:1,pool:1,theme:'bog',mode:'solo',w:800,h:300,seed:7});const c=await G.packMap(m),b=await G.unpackMap(c);return{prefix:c.slice(0,4),same:G.mapSig(m)===G.mapSig(b),file:G.cleanMap(JSON.parse(G.mapsToFile([m])).maps[0]).objs.length===m.objs.length};}'''
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
async def main():
    srv=http.server.ThreadingHTTPServer(('127.0.0.1',8931),functools.partial(Q,directory='docs'));threading.Thread(target=srv.serve_forever,daemon=True).start()
    async with async_playwright() as p:
        b=await p.chromium.launch();c=await b.new_context(viewport={'width':960,'height':540});pg=await c.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'favicon' not in m.text and '404' not in m.text else None)
        base='http://127.0.0.1:8931/'
        await pg.goto(base);print('home',await pg.title(),await pg.evaluate("[...document.querySelectorAll('a.b')].map(a=>a.getAttribute('href'))"))
        await pg.goto(base+'builder/');await pg.wait_for_timeout(700)
        print('builder',await pg.title(),await pg.evaluate("[BUILD,scene===__GS.MapsScene]"))
        print(json.dumps(await pg.evaluate(OLD)));print(json.dumps(await pg.evaluate(CODE)))
        await pg.evaluate("()=>{const G=__GS,m=G.genMap({tpl:'march',type:'hills',traps:1,foes:0,mach:1,pool:1,theme:'bog',mode:'solo',w:800,h:300,seed:9});m.name='SHARED TEST';G.Store.put(m);}")
        mid=await pg.evaluate("__GS.Store.all()[0].id")
        await pg.goto(base+'play/');await pg.wait_for_timeout(700)
        print('play',await pg.evaluate("[BUILD,scene===TitleScene,typeof Ed,typeof NewMap,Store.all()[0].name]"))
        # map list in play: edit opens the builder on that map
        await pg.evaluate("()=>{setScene(MapsScene);}");await pg.wait_for_timeout(300)
        await pg.evaluate("()=>{MapsScene.edit(Store.all()[0]);}")
        await pg.wait_for_url('**/builder/');await pg.wait_for_timeout(1200)
        print('edit',await pg.evaluate("[scene===Ed,Ed.map&&Ed.map.name,Ed.map&&Ed.map.objs.every(o=>Number.isFinite(o.uid))]"))
        # test play in the builder page then back
        await pg.evaluate("()=>Ed.test()");await pg.wait_for_timeout(900);print('test',await pg.evaluate("scene===Play"))
        await pg.keyboard.press('Escape');await pg.wait_for_timeout(900);print('back',await pg.evaluate("scene===Ed"))
        await pg.evaluate("()=>{setScene(MapsScene);}");await pg.wait_for_timeout(200);await pg.evaluate("()=>backToTitle()");await pg.wait_for_url('**/play/');print('back to game ok')
        # new map button from play
        await pg.wait_for_timeout(500);await pg.evaluate("()=>{setScene(MapsScene);builderGo(()=>0);}");await pg.wait_for_url('**/builder/');print('new map goes to builder')
        # file save on a normal website
        await pg.wait_for_timeout(500)
        async with pg.expect_download() as dl:
            await pg.evaluate("()=>{saveFile('rabblings-test.json','{}');}")
        print('download',(await dl.value).suggested_filename)
        print('errs',errs[:4]);await b.close()
    srv.shutdown()
asyncio.run(main())
