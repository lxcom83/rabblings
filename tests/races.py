import asyncio,json
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
JS='''()=>{const G=__GS,o=[];for(const r of ['fairy','dwarf','rat','shroom','bone'])for(const l of G.RACE_LEVELS[r])for(const bot of [1,0]){G.setSides([{race:r,clan:0},{race:'goblin',clan:1}]);const w=new G.World(l,{quiet:true,sides:[{race:r,clan:0},{race:'goblin',clan:1}]});if(bot)w.pl[0].bot=l.plan;let n=0;while(!w.over&&n++<20000)w.step();const g=l.goal||'home',pass=g==='home'?w.pl[0].saved>=w.need:!!w.won;o.push({l:l.name,bot,pass,saved:w.pl[0].saved,lost:w.pl[0].lost,need:w.need,sec:n/25|0,piles:w.piles.filter(p=>p.live).length,left:JSON.stringify(w.pl[0].skills),nests:w.nests.filter(a=>!a.dead).length,foes:w.mobs.filter(a=>!a.dead).length});}return o}'''
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(600);print('errs',errs[:3])
        for r in await pg.evaluate(JS):print(r)
        print('errs',errs[:3]);await b.close()
asyncio.run(main())
