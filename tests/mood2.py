import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        await pg.evaluate("__GS.TitleScene.modes()[1][1]()");await pg.wait_for_timeout(800);await pg.keyboard.press('Enter');await pg.wait_for_timeout(800)
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(800);await pg.keyboard.press('Enter');await pg.wait_for_timeout(900)
        print(await pg.evaluate("__GS.Play.world.def.name"))
        await pg.evaluate("""()=>{const w=__GS.Play.world,p=w.pl[0];w.mobs.forEach(m=>m.dead=1);w.traps.push({k:'fire',x:210,y:205,rw:30,rh:26,raw:1,cd:0,live:1,off:0},{k:'jaws',x:150,y:230,rw:10,rh:14,raw:1,cd:0,live:1,off:0});p.camX=60;p.camY=50;window.F=setInterval(()=>{p.camX=60;p.camY=70;p.mood=100},30)}""")
        for i in range(4):
            await pg.wait_for_timeout(5000 if i==0 else 1000);await pg.screenshot(path=f'd{i}.png')
        print('ents',await pg.evaluate("[...new Set(__GS.Play.world.ents.map(e=>e.k))]"),await pg.evaluate("(()=>{const c={};for(const g of __GS.Play.world.gobs)c[g.s]=(c[g.s]||0)+1;return c})()"),'errs',errs[:4]);await b.close()
asyncio.run(main())
