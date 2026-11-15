import asyncio,json
from playwright.async_api import async_playwright
JS='''()=>{const G=__GS,l=G.LEVELS[0],w=new G.World({...l,foes:[]},{classic:true});for(let i=0;i<120;i++)w.step();const g=w.gobs[0];w.kill(g,'fire');w.pl[0].mood=1;for(let i=0;i<400;i++)w.step();return {state:g.s,moodOn:w.moodOn,strikers:w.gobs.filter(a=>a.s==='sit').length,fx:w.ents.filter(e=>['say','hat','ghost','boots'].includes(e.k)).length}}'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(400)
        print(json.dumps(await pg.evaluate(JS)));await b.close()
asyncio.run(main())
