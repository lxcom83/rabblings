import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(2600);await pg.screenshot(path='p0.png')
        await pg.evaluate("__GS.TitleScene.modes()[0][1]()");await pg.wait_for_timeout(800);await pg.keyboard.press('Enter');await pg.wait_for_timeout(800);await pg.keyboard.press('Enter');await pg.wait_for_timeout(800)
        await pg.keyboard.press('KeyT');await pg.wait_for_timeout(200);await pg.screenshot(path='p1.png')
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(1000)
        print(await pg.evaluate("(()=>{const w=__GS.Play.world,p=w.pl[0];return [w.def.name,w.trial,p.panel.join(),JSON.stringify(p.skills)]})()"))
        await pg.evaluate("()=>{const w=__GS.Play.world;w.pl[0].bot=w.def.plan;let n=0;while(n++<9000&&!w.over)w.step();}");await pg.wait_for_timeout(2600);await pg.screenshot(path='p2.png')
        print('pass',await pg.evaluate("[JSON.parse(localStorage.getItem('goblin-scramble')).cleared,Object.keys(JSON.parse(localStorage.getItem('goblin-scramble')).scores)]"))
        print('errs',errs[:5]);await b.close()
asyncio.run(main())
