import asyncio,sys
from playwright.async_api import async_playwright
# Free Play screens: menu entry, map list, brief with race picker, unlock warning, and a full run for an untested race that logs
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    shots=sys.argv[1] if len(sys.argv)>1 else '/tmp/shots'
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(600)
        await pg.evaluate("()=>{const T=__GS.TitleScene;T.menu=1;T.open('play')}");await pg.wait_for_timeout(300);await pg.screenshot(path=shots+'/f1-menu.png')
        r=await pg.evaluate("()=>{const T=__GS.TitleScene,it=T.items(),i=it.findIndex(e=>e[0]==='FREE PLAY');it[i][1]();return it.map(e=>e[0]).join('|')}");print(r);await pg.wait_for_timeout(900);await pg.screenshot(path=shots+'/f2-list.png')
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(900);await pg.screenshot(path=shots+'/f3-brief.png')
        for _ in range(3):await pg.keyboard.press('r');await pg.wait_for_timeout(150)
        await pg.screenshot(path=shots+'/f4-race.png')
        await pg.keyboard.press('u');await pg.wait_for_timeout(200)
        # step to an untested race (bone on Gap Year)
        for _ in range(8):
            n=await pg.evaluate("()=>[__GS.CampaignRace]")
            if n[0]=='bone':break
            await pg.keyboard.press('r');await pg.wait_for_timeout(120)
        await pg.screenshot(path=shots+'/f5-untested.png')
        print(await pg.evaluate("()=>[__GS.CampaignRace,__GS.CampaignSet]"))
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(900)
        res=await pg.evaluate("()=>{const G=__GS,w=G.Play.world;w.wildOn=false;for(let i=0;i<9000&&!w.over;i++)w.step();return [w.over,w.pl[0].saved,w.pl[0].race]}");print('run',res)
        await pg.evaluate("()=>{const G=__GS,w=G.Play.world;G.Result.show(w,null);G.setScene(G.Result)}");await pg.wait_for_timeout(500);await pg.screenshot(path=shots+'/f6-result.png')
        print('log',await pg.evaluate("()=>JSON.stringify(__GS.SAVE.freeLog)"));print('cleared',await pg.evaluate("()=>JSON.stringify(__GS.SAVE.cleared)"))
        print('errs',errs[:4]);await b.close()
asyncio.run(main())
