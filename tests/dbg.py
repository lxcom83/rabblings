import asyncio,sys,os,json
from playwright.async_api import async_playwright
# usage: dbg.py mapid race [seconds-step] ; prints goblin states over time for first race plan
JS='''([id,r,st])=>{const G=__GS,l=G.FREE_MAPS.find(a=>a.id===id);const s=[{race:r,clan:0},{race:'goblin',clan:1}];G.setSides(s);const w=new G.World(l,{quiet:true,sides:s});w.pl[0].bot=G.freePlan(l,r);const out=[];let n=0;while(!w.over&&n++<20000){w.step();if(n%(25*st)==0)out.push((n/25|0)+'s '+w.gobs.filter(g=>g.team===0).map(g=>g.s[0]+(g.x|0)+','+(g.y|0)).join(' ')+' saved '+w.pl[0].saved);}return out.slice(0,14)}'''
async def main():
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page()
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        for l in await pg.evaluate(JS,[sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 4]):print(l[:200])
        await b.close()
asyncio.run(main())
