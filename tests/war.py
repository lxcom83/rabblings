import asyncio,json,sys
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
JS='''()=>{const G=__GS,o=[];G.WAR_LEVELS.forEach(l=>{for(const race of ['goblin','swamp','imp'])for(const bot of [1,0]){G.setSides([{race,clan:0},{race:'goblin',clan:1}]);const w=new G.World(l,{quiet:true,sides:[{race,clan:0},{race:'goblin',clan:1}]});if(bot)w.pl[0].bot=l.plan;let n=0;while(!w.over&&n++<20000)w.step();const g=l.goal||'home',pass=g==='home'?w.pl[0].saved>=l.need:!!w.won;o.push({l:l.name,race,bot,pass,saved:w.pl[0].saved,lost:w.pl[0].lost,nests:w.nests.filter(a=>!a.dead).length,foes:w.mobs.filter(a=>!a.dead).length,sec:n/25|0,left:Object.values(w.pl[0].skills).join(',')});}});return o}'''
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(600)
        print('errs',errs[:3])
        for r in await pg.evaluate(JS):print(r)
        await b.close()
asyncio.run(main())
