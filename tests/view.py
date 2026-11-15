import asyncio,sys,os
from playwright.async_api import async_playwright
# usage: view.py id camX camY out.png   (one play-view screenshot, intro text cleared)
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    id,x,y,out=sys.argv[1],int(sys.argv[2]),int(sys.argv[3]),sys.argv[4]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        await pg.evaluate("(id)=>{const G=__GS,l=G.FREE_MAPS.find(a=>a.id===id);G.Play.begin(l,null,{});G.setScene(G.Play);}",id)
        await pg.wait_for_timeout(3200)
        await pg.evaluate("([x,y])=>{const w=__GS.Play.world;w.pl[0].camX=x;w.pl[0].camY=y}",[x,y]);await pg.wait_for_timeout(300)
        await pg.screenshot(path=out);await b.close()
asyncio.run(main())
