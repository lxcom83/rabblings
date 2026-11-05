import asyncio,sys,json
from playwright.async_api import async_playwright
SKEL='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>%s</body></html>'
async def main():
    open('run.html','w').write(SKEL%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(900)
        print('errors',errs[:6])
        r=await pg.evaluate('''()=>{const G=__GS,o=[];G.LEVELS.forEach(l=>{o.push(G.simulate(l,false));const n=G.simulate(l,false,[]);o.push({name:'  no help: '+l.name,saved:n.saved,need:l.need});});for(const r of ['swamp','imp'])G.RACE_LEVELS[r].forEach(l=>{o.push(G.simulate(l,false));const n=G.simulate(l,false,[]);o.push({name:'  no help: '+l.name,saved:n.saved,need:l.need});});G.ARENAS.forEach(l=>{o.push(G.simulate(l,true,[0]));o.push(G.simulate(l,true,[0,1]));});return o}''')
        for x in r: print(json.dumps(x))
        await pg.screenshot(path='shot-title.png')
        await b.close()
asyncio.run(main())
