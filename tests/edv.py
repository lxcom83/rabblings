import asyncio,json
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':600})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        box=await pg.evaluate("()=>{const r=document.getElementById('game').getBoundingClientRect();return [r.x,r.y,r.width,r.height]}");sc=box[2]/480;clip={'x':box[0],'y':box[1],'width':box[2],'height':box[3]}
        async def mv(x,y):
            await pg.mouse.move(box[0]+x*sc,box[1]+y*sc);await pg.wait_for_timeout(60)
        async def clk(x,y):
            await mv(x,y);await pg.mouse.down();await pg.wait_for_timeout(20);await pg.mouse.up();await pg.wait_for_timeout(90)
        async def lab(l):
            await pg.wait_for_timeout(60);r=await pg.evaluate("l=>{const h=hits.filter(a=>a.l===l).pop();return h?[h.x+h.w/2,h.y+h.h/2]:null}",l)
            if not r: print('NO',l);return None
            await clk(*r);return r
        await pg.evaluate("()=>{const G=__GS;const m=G.genMap({tpl:'march',type:'hills',traps:1,foes:1,mach:1,pool:1,theme:'bog',mode:'solo',w:800,h:300,seed:5});G.Ed.open(m);G.setScene(G.Ed);}")
        res=[];i=0
        await lab('> ENEMIES');await lab('NEST');await mv(300,120);await pg.wait_for_timeout(200);await pg.screenshot(path='v0.png',clip=clip)
        await lab('> START + END');await lab('HUT');await mv(330,130);await pg.wait_for_timeout(200);await pg.screenshot(path='v1.png',clip=clip)
        await lab('> SHAPES');r=await pg.evaluate("()=>{const h=hits.filter(a=>a.prev&&a.prev.startsWith('s:'))[2];return [h.x+10,h.y+5]}");await mv(*r);await pg.wait_for_timeout(700);await pg.screenshot(path='v2.png',clip=clip)
        await lab('BACKGROUND: ON');await lab('> TRAPS');await lab('POOL');await mv(300,120);await pg.wait_for_timeout(200);await pg.screenshot(path='v3.png',clip=clip);bg=await pg.evaluate("__GS.Ed.bg")
        # every object previews without error
        for k in ['> START + END','> TRAPS','> ENEMIES','> MACHINES','> ITEMS + ZONES']:
            await lab(k)
            n=await pg.evaluate("()=>hits.filter(a=>a.prev).length")
            for j in range(n):
                r=await pg.evaluate("j=>{const h=hits.filter(a=>a.prev)[j];return [h.x+5,h.y+5]}",j);await clk(*r);await mv(320,130);await pg.wait_for_timeout(60);i+=1
        await lab('> SHAPES');n=await pg.evaluate("()=>hits.filter(a=>a.prev).length")
        for j in range(n):
            r=await pg.evaluate("j=>{const h=hits.filter(a=>a.prev)[j];return [h.x+5,h.y+5]}",j);await mv(*r);await pg.wait_for_timeout(50);i+=1
        await lab('RANDOM');r=await pg.evaluate("()=>{const h=hits.filter(a=>a.l==='GENERATE')[0];return [h.x+40,h.y+8]}");await mv(*r);await pg.wait_for_timeout(700);await pg.screenshot(path='v4.png',clip=clip)
        print('objs',i,'bg',bg,'errs',errs[:4]);await b.close()
asyncio.run(main())
