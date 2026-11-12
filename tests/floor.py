# usage: floor.py mapid x:y [x:y ...] -> first floor surface at or below y for each x (for placing doors and plan steps)
import asyncio,sys,os
from playwright.async_api import async_playwright
JS='''([id,q])=>{const G=__GS,l=G.FREE_MAPS.find(a=>a.id===id),s=[{race:'goblin',clan:0},{race:'goblin',clan:1}];G.setSides(s);const w=new G.World(l,{quiet:true,sides:s}),T=w.T,S=(x,y)=>x>=0&&y>=0&&x<T.w&&y<T.h&&T.m[y*T.w+x]>0;
 return q.map(([x,y])=>{let a=-1,c=-1;for(let j=y;j<T.h;j++)if(S(x,j)&&!S(x,j-1)){a=j;break;}for(let j=y;j>0;j--)if(S(x,j-1)&&!S(x,j)){c=j;break;}return x+':'+y+' floor '+a+' ceil '+c+(S(x,y)?' (inside rock)':'');})}'''
async def main():
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'%open('build/rabblings-all.html').read())
    q=[[int(v) for v in a.split(':')] for a in sys.argv[2:]]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page();await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(400)
        for l in await pg.evaluate(JS,[sys.argv[1],q]):print(l)
        await b.close()
asyncio.run(main())
