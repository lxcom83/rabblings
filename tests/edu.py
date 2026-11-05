import asyncio,json
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':600})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        box=await pg.evaluate("()=>{const r=document.getElementById('game').getBoundingClientRect();return [r.x,r.y,r.width,r.height]}")
        sc=box[2]/480;clip={'x':box[0],'y':box[1],'width':box[2],'height':box[3]}
        await pg.evaluate("()=>{const ob=window.button;window.button=function(C,x,y,w,h,l,fn,o){ob(C,x,y,w,h,l,fn,o);hits[hits.length-1].l=String(l);}}")
        async def clk(x,y):
            await pg.mouse.move(box[0]+x*sc,box[1]+y*sc);await pg.wait_for_timeout(50);await pg.mouse.down();await pg.wait_for_timeout(20);await pg.mouse.up();await pg.wait_for_timeout(90)
        async def lab(l,which=-1):
            await pg.wait_for_timeout(50)
            r=await pg.evaluate("([l,w])=>{const h=hits.filter(a=>a.l===l).slice(w)[0];return h?[h.x+h.w/2,h.y+h.h/2]:null}",[l,which])
            if not r: print('NO BUTTON',l);return False
            await clk(*r);return True
        st=lambda e:pg.evaluate(e)
        async def shot(n):
            await pg.wait_for_timeout(120);await pg.screenshot(path=n,clip=clip)
        await pg.evaluate("""()=>{const G=__GS;const m=G.genMap({tpl:'climb',type:'auto',traps:2,foes:1,pool:1,theme:'caves',mode:'solo',w:800,h:420,seed:5});G.Ed.open(m);G.setScene(G.Ed);}""")
        res={}
        # groups
        for g in ['> SHAPES','> TRAPS','> ENEMIES','> MACHINES','> ITEMS + ZONES','> START + END']:
            await lab(g)
        await lab('JET') if False else None
        await lab('> TRAPS');await lab('JAWS');res['tool']=await st("[__GS.Ed.tool,__GS.Ed.obj,__GS.Ed.group]")
        n0=await st("__GS.Ed.map.objs.length");await clk(300,120);res['placed']=(await st("__GS.Ed.map.objs.length"))-n0
        await shot('u1.png')
        await lab('> ENEMIES');await lab('NEST');await clk(350,120);await shot('u2.png')
        await lab('> SHAPES');await shot('u3.png')
        # pages
        for l,f in [('BASICS','u4.png'),('GOAL','u5.png'),('SKILLS','u6.png'),('RULES','u7.png'),('TRIGGERS','u8.png'),('RANDOM','u9.png')]:
            await lab(l);await shot(f)
        # dropdown in basics
        await lab('BASICS',0);await pg.wait_for_timeout(100)
        await pg.evaluate("()=>{}")
        w=await st("(()=>{const h=hits.filter(a=>a.l&&a.l.startsWith('GLOWING'));return h.length?[h[0].x+20,h[0].y+6]:null})()")
        await clk(*w);await shot('u10.png');await lab('THE CRYPTS');res['theme']=await st("__GS.Ed.map.theme")
        # trigger with dropdown action
        await lab('TRIGGERS',0);await lab('+ ADD TRIGGER');w=await st("(()=>{const h=hits.filter(a=>a.l&&a.l.startsWith('FLOOD ST'));return h.length?[h[0].x+20,h[0].y+6]:null})()");await clk(*w);await shot('u11.png');await lab('GIANT SPIDER');res['trig']=await st("__GS.Ed.map.trig[0]")
        # generator toggles
        await lab('RANDOM',0)
        ser="JSON.stringify(__GS.Ed.map.ops)";kinds="(()=>{const c={};for(const o of __GS.Ed.map.objs)c[o.k]=(c[o.k]||0)+1;return c})()"
        res['before']=await st(kinds)
        for k in ['TERRAIN','TRAPS','ENEMIES','MACHINES','POOLS']: await lab(k)
        ops=await st(ser);d0=await st("JSON.stringify(__GS.Ed.map.objs.filter(o=>o.k==='jaws'||o.k==='mine'||o.k==='foe'))");h0=await st("JSON.stringify(__GS.Ed.map.objs.filter(o=>o.k==='hatch'))")
        await lab('GENERATE');res['pts_only_terrain_same']=ops==await st(ser);res['pts_only_traps_same']=d0==await st("JSON.stringify(__GS.Ed.map.objs.filter(o=>o.k==='jaws'||o.k==='mine'||o.k==='foe'))");res['after_pts']=await st(kinds)
        await lab('START + END');await lab('TRAPS');await shot('u12.png');await lab('GENERATE');res['traps_only_terrain_same']=ops==await st(ser);res['after_trp']=await st(kinds)
        await lab('ENTIRE MAP');await shot('u17.png');await lab('GENERATE');res['entire_terrain_changed']=ops!=await st(ser);await shot('u13.png')
        await lab('CLOSE');await lab('UNDO');res['undo_terrain_back']=ops==await st(ser)
        # test play and back
        await lab('> TEST');await pg.wait_for_timeout(900);res['scene_play']=await st("scene===__GS.Play")
        await pg.keyboard.press('Escape');await pg.wait_for_timeout(200);await lab('BACK TO BUILDER');await pg.wait_for_timeout(900);res['back']=await st("scene===__GS.Ed");await shot('u14.png')
        # new map
        await pg.evaluate("()=>{__GS.setScene(__GS.NewMap)}");await pg.wait_for_timeout(200)
        w=await st("(()=>{const h=hits.filter(a=>a.l==='LONG MARCH');return [h[0].x+20,h[0].y+6]})()");await clk(*w);await shot('u15.png');await lab('NEST RAID');await shot('u16.png');await lab('CREATE MAP');await pg.wait_for_timeout(900);res['new']=await st("[scene===__GS.Ed,__GS.Ed.map.name,__GS.Ed.map.goal,JSON.stringify(__GS.Ed.map.swap)]")
        print(json.dumps(res,indent=0));print('errs',errs[:4]);await b.close()
asyncio.run(main())
