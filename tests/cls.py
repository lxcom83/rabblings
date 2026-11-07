import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        st="(()=>{const w=__GS.Play.world;return w&&[w.def.name,w.classic,w.moodOn]})()"
        # campaign: pick classic, lock it, cannot flip
        await pg.evaluate("__GS.TitleScene.modes()[0][1]()");await pg.wait_for_timeout(800);await pg.keyboard.press('KeyC');await pg.wait_for_timeout(150);await pg.screenshot(path='c0.png')
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(800);await pg.keyboard.press('Enter');await pg.wait_for_timeout(800);await pg.screenshot(path='c1.png')
        await pg.keyboard.press('KeyC');await pg.wait_for_timeout(100);await pg.keyboard.press('Enter');await pg.wait_for_timeout(900);print('camp',await pg.evaluate(st))
        print('lock',await pg.evaluate("JSON.parse(localStorage.getItem('goblin-scramble')).lock"))
        await pg.keyboard.press('Escape');await pg.wait_for_timeout(300)
        # back on race screen: locked shown, flip refused
        await pg.evaluate("()=>{const G=__GS;G.RaceScene.mode='camp';G.setScene(G.RaceScene)}");await pg.wait_for_timeout(300);await pg.evaluate("()=>{}");await pg.keyboard.press('KeyC');await pg.wait_for_timeout(100);await pg.screenshot(path='c2.png')
        await pg.evaluate("()=>{const G=__GS;localStorage;G.RaceScene.reset();G.RaceScene.reset();G.RaceScene.flip&&0}")
        print('after new campaign',await pg.evaluate("JSON.parse(localStorage.getItem('goblin-scramble')).lock"))
        # single map: flips between rounds. Use Combat Trials
        await pg.evaluate("__GS.TitleScene.modes()[1][1]()");await pg.wait_for_timeout(800);await pg.keyboard.press('Enter');await pg.wait_for_timeout(800);await pg.keyboard.press('Enter');await pg.wait_for_timeout(800);await pg.screenshot(path='c3.png')
        await pg.keyboard.press('KeyC');await pg.wait_for_timeout(150);await pg.keyboard.press('Enter');await pg.wait_for_timeout(900);print('trial A',await pg.evaluate(st))
        # classic world: strip effects
        print(await pg.evaluate("""(()=>{const w=__GS.Play.world,g=w.gobs[0]||null;return 1})()"""))
        print('errs',errs[:5]);await b.close()
asyncio.run(main())
