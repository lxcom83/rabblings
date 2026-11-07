import asyncio,json
from playwright.async_api import async_playwright
JS='''()=>{const G=__GS,o=[];const rks=Object.keys(G.RACES);for(const k of rks){const r=G.RACES[k];o.push([k,!!r.play,r.clans.length,(G.RACE_LEVELS[k]||[]).length]);}return o}'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500);print(await pg.evaluate(JS))
        # every race pair in a real 2P start and arena sim, plus visual of the four worlds in play
        r=await pg.evaluate('''()=>{const G=__GS,rk=Object.keys(G.RACES),bad=[];for(const a of rk)for(const b of rk){const s=[{race:a,clan:0},{race:b,clan:1}];G.setSides(s);for(const l of G.ARENAS){const w=new G.World(l,{quiet:true,vs:true,sides:s});w.pl.forEach(p=>p.bot=l.plan);let n=0;try{while(!w.over&&n++<1500)w.step();}catch(e){bad.push([a,b,l.name,String(e)]);}}}return bad.slice(0,5)}''');print('vs errors',r)
        i=0
        for k,lv in [('fairy',0),('dwarf',1),('rat',0),('shroom',0)]:
            await pg.evaluate("__GS.TitleScene.modes()[0][1]()");await pg.wait_for_timeout(700)
            await pg.evaluate("k=>{const G=__GS;G.SAVE.lock={};G.RaceScene.s[0]={i:Object.keys(G.RACES).indexOf(k),c:0}}",k);await pg.keyboard.press('Enter');await pg.wait_for_timeout(800)
            for _ in range(lv):await pg.keyboard.press('ArrowDown');await pg.wait_for_timeout(100)
            await pg.keyboard.press('Enter');await pg.wait_for_timeout(800);await pg.keyboard.press('Enter');await pg.wait_for_timeout(900)
            await pg.evaluate("()=>{const w=__GS.Play.world,p=w.pl[0];w.wildOn=false;p.bot=w.def.plan;for(let i=0;i<620;i++)w.step();const a=w.gobs.filter(g=>w.alive(g)).sort((x,y)=>y.x-x.x)[0];p.camX=Math.max(0,(a?a.x:300)-260);p.camY=40;__GS.Play.paused=false}");await pg.wait_for_timeout(350);await pg.screenshot(path=f'e{i}.png');i+=1
            await pg.keyboard.press('Escape');await pg.wait_for_timeout(250)
            await pg.evaluate("()=>{const G=__GS;G.Play.paused=false;G.go(()=>{G.TitleScene.menu=1;G.setScene(G.TitleScene)})}");await pg.wait_for_timeout(800)
        print('errs',errs[:5]);await b.close()
asyncio.run(main())
