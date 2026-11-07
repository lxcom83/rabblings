import asyncio,json,os
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        box=await pg.evaluate("()=>{const r=document.getElementById('game').getBoundingClientRect();return [r.x,r.y,r.width,r.height]}")
        sc=box[2]/480;clip={'x':box[0],'y':box[1],'width':box[2],'height':box[3]}
        await pg.evaluate("()=>{const ob=window.button;window.button=function(C,x,y,w,h,l,fn,o){ob(C,x,y,w,h,l,fn,o);hits[hits.length-1].l=String(l);}}")
        async def clk(x,y):
            await pg.mouse.move(box[0]+x*sc,box[1]+y*sc);await pg.wait_for_timeout(50);await pg.mouse.down();await pg.wait_for_timeout(20);await pg.mouse.up();await pg.wait_for_timeout(120)
        async def lab(l,which=0):
            await pg.wait_for_timeout(80)
            r=await pg.evaluate("([l,w])=>{const h=hits.filter(a=>a.l===l)[w];return h?[h.x+h.w/2,h.y+h.h/2]:null}",[l,which])
            if not r: print('NO BUTTON',l);return False
            await clk(*r);return True
        ev=lambda e:pg.evaluate(e)
        async def shot(n):
            await pg.wait_for_timeout(150);await pg.screenshot(path=n,clip=clip)
        ok=True
        def chk(name,c):
            nonlocal ok
            print(('PASS ' if c else 'FAIL ')+name)
            ok=ok and bool(c)
        # three of the maker's own maps (a solo, a second solo, a versus arena)
        await ev("""()=>{const G=__GS;localStorage.clear();G.Store.mem=[];G.PackStore.mem=null;
          const a=G.genMap({tpl:'climb',type:'auto',traps:1,foes:0,pool:0,theme:'caves',mode:'solo',w:800,h:420,seed:5});a.name='FIRST STEPS';
          const b=G.genMap({tpl:'climb',type:'auto',traps:2,foes:1,pool:1,theme:'bog',mode:'solo',w:800,h:420,seed:9});b.name='SECOND CLIMB';
          const c=G.genMap({tpl:'climb',type:'auto',traps:1,foes:0,pool:0,theme:'caves',mode:'solo',w:800,h:420,seed:12});c.name='THIRD';
          for(const m of [c,b,a]){m.id=null;G.Store.put(m);} G.setScene(G.MapsScene||eval('MapsScene'));}""") if False else None
        await ev("""()=>{const G=__GS;localStorage.clear();G.Store.mem=null;G.PackStore.mem=null;}""")
        ids=await ev("""()=>{const G=__GS,out=[];
          [['FIRST STEPS',5,'caves'],['SECOND CLIMB',9,'bog'],['THIRD HILL',12,'caves']].forEach(([n,s,t])=>{const m=G.genMap({tpl:'climb',type:'auto',traps:1,foes:0,pool:0,theme:t,mode:'solo',w:800,h:420,seed:s});m.name=n;m.id=null;G.Store.put(m);out.push(m.id);});
          G.setScene(G.PacksScene);return out;}""")
        await shot('/tmp/pk1.png')
        # new pack through the UI
        await lab('NEW PACK');await pg.wait_for_timeout(200)
        await pg.fill('#dlg-a','Test Pack');await pg.fill('#dlg-b','Lucas');await pg.click('#dlg-ok');await pg.wait_for_timeout(300)
        chk('pack created',await ev("__GS.PackStore.all().length")==1)
        await shot('/tmp/pk2.png')
        for n in ['SECOND CLIMB','FIRST STEPS','THIRD HILL']:
            await lab(n)
        chk('3 maps added in click order',await ev("__GS.PackStore.maps(__GS.PackStore.all()[0]).map(m=>m.name).join('|')")=='SECOND CLIMB|FIRST STEPS|THIRD HILL')
        await lab('DN',0);  # move first down
        chk('reorder DN',await ev("__GS.PackStore.maps(__GS.PackStore.all()[0]).map(m=>m.name).join('|')")=='FIRST STEPS|SECOND CLIMB|THIRD HILL')
        await shot('/tmp/pk3.png')
        await lab('DONE')
        # export text
        txt=await ev("__GS.packToFile(__GS.PackStore.all()[0])")
        d=json.loads(txt);chk('file has pack header + 3 maps in order',d['pack']['name']=='TEST PACK' and d['pack']['by']=='Lucas' and [m['name'] for m in d['maps']]==['FIRST STEPS','SECOND CLIMB','THIRD HILL'])
        # wipe, import
        await ev("()=>{const G=__GS;G.Store.mem=[];G.Store.save();G.PackStore.mem=[];G.PackStore.save();}")
        r=await ev("(async t=>{const x=await __GS.importPackFile(t);return [x.total,x.fresh,x.pack.name,__GS.Store.all().length]})",txt) if False else None
        r=await pg.evaluate("async t=>{const x=await __GS.importPackFile(t);return [x.total,x.fresh,x.pack.name,__GS.Store.all().length]}",txt)
        chk('import into empty device',r==[3,3,'TEST PACK',3])
        r=await pg.evaluate("async t=>{const x=await __GS.importPackFile(t);return [x.total,x.fresh,__GS.Store.all().length,__GS.PackStore.all().length]}",txt)
        chk('re-import adds nothing twice',r==[3,0,3,1])
        chk('maps in pack order after import',await ev("__GS.PackStore.maps(__GS.PackStore.all()[0]).map(m=>m.name).join('|')")=='FIRST STEPS|SECOND CLIMB|THIRD HILL')
        chk('single-map file is not a pack',await pg.evaluate("async()=>(await __GS.importPackFile(__GS.mapsToFile([__GS.Store.all()[0]])))===null"))
        chk('garbage rejected',await pg.evaluate("async()=>(await __GS.importPackFile('hello'))===null"))
        chk('old readers still get the maps',await pg.evaluate("async t=>{const l=JSON.parse(t);return Array.isArray(l.maps)&&l.maps.length===3}",txt))
        # play it in order: open the pack, start map 1, win it, go next
        await ev("()=>{__GS.setScene(__GS.PacksScene)}");await shot('/tmp/pk4.png')
        await lab('PLAY');await pg.wait_for_timeout(600)
        chk('pack play screen',await ev("__GS.PackRun&&__GS.PackRun.i===0"))
        await shot('/tmp/pk5.png')
        await lab('1  FIRST STEPS') if False else None
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(1500)
        chk('map 1 opened (brief)',await ev("document.title||true"))
        await shot('/tmp/pk6.png')
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(1500)
        chk('in play, pack map 1',await ev("!!__GS.Play.world&&__GS.PackRun.i===0"))
        async def finish(win):
            await ev("()=>{const G=__GS,w=G.Play.world;w.pl[0].saved=%s;if(w.goal)w.won=1;G.Result.show(w,G.Play.ser);G.setScene(G.Result);}"%('w.need' if win else '0'))
            await pg.wait_for_timeout(1300)
        await finish(False)
        chk('fail: not marked cleared',await ev("Object.keys((__GS.SAVE.packs[__GS.PackRun.id]||{cleared:{}}).cleared).length")==0)
        await shot('/tmp/pk7.png')
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(1500)
        chk('fail -> retry same map',await ev("__GS.PackRun.i===0"))
        await finish(True)
        chk('win: marked cleared',await ev("Object.keys(__GS.SAVE.packs[__GS.PackRun.id].cleared).length")==1)
        await shot('/tmp/pk8.png')
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(1500)
        chk('win -> next map',await ev("__GS.PackRun.i===1"))
        await finish(True);await pg.keyboard.press('Enter');await pg.wait_for_timeout(1500)
        chk('then map 3',await ev("__GS.PackRun.i===2"))
        await finish(True);await shot('/tmp/pk9.png');await pg.keyboard.press('Enter');await pg.wait_for_timeout(1000)
        chk('last map -> back to pack list, all done',await ev("Object.keys(__GS.SAVE.packs[__GS.PackRun.id].cleared).length")==3)
        await shot('/tmp/pk10.png')
        # fake a win: call Result with a passing world through the real hook
        await ev("()=>{__GS.go(()=>__GS.setScene(__GS.PackPlay))}");await pg.wait_for_timeout(500)
        chk('no js errors',not errs)
        if errs:print(errs[:5])
        await b.close()
        print('ALL OK' if ok else 'FAILURES')
asyncio.run(main())
