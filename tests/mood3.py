import asyncio,json
from playwright.async_api import async_playwright
JS='''()=>{const G=__GS,l=G.WAR_LEVELS[0],w=new G.World({...l,foes:[]},{quiet:true});for(let i=0;i<120;i++)w.step();const g=w.gobs[0],x0=g.x;w.kill(g,'fire');const a=[g.s,w.pl[0].lost,w.alive(g),w.canAssign(g,'dig',w.pl[0])];let n=0;while(g.s==='burn'&&n++<100)w.step();return {a,ticks:n,end:g.s,lost:w.pl[0].lost,moved:Math.abs(g.x-x0),mood:Math.round(w.pl[0].mood)}}'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(400)
        print(json.dumps(await pg.evaluate(JS)),errs[:3]);await b.close()
asyncio.run(main())
