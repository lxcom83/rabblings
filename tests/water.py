# Every water/lava band must sit in a sealed container: solid floor under the whole band, solid walls at both ends.
# usage: water.py [all]  (default: Free Play maps; 'all' also checks campaign levels as a report)
import asyncio,sys,os
from playwright.async_api import async_playwright
JS='''(all)=>{const G=__GS,L=[...G.FREE_MAPS.map(l=>['free',l])];if(all)for(const k in G.RACE_LEVELS)G.RACE_LEVELS[k].forEach((l,i)=>L.push([k+' '+(i+1),l]));const o=[];
 for(const[tag,l]of L){if(!l.haz||!l.haz.length)continue;const s=[{race:'goblin',clan:0},{race:'goblin',clan:1}];G.setSides(s);let w;try{w=new G.World(l,{quiet:true,sides:s});}catch(e){continue;}const T=w.T,S=(x,y)=>x<0||x>=T.w||y>=T.h||(y>=0&&T.m[y*T.w+x]>0);
  for(const h of l.haz){const y0=h.y,y1=h.y1||T.h-1,bad=[];let holes=0;for(let x=h.x0;x<h.x1;x++)if(!S(x,y1+1)&&!S(x,y1))holes++;if(holes)bad.push(holes+'px of floor missing under it');
   let lw=0,rw=0;for(let y=y0;y<=y1;y++){if(!S(h.x0-1,y))lw++;if(!S(h.x1,y))rw++;}if(lw)bad.push('left end open '+lw+'px');if(rw)bad.push('right end open '+rw+'px');
   if(bad.length)o.push(tag+' '+(l.id||'')+' '+l.name+' water '+h.x0+'-'+h.x1+' y'+y0+'-'+y1+': '+bad.join(', '));}}return o}'''
async def main():
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page();await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        r=await pg.evaluate(JS,len(sys.argv)>1)
        for l in r:print('FLOAT',l)
        print('floating water',len(r));await b.close()
        if r and len(sys.argv)<2:sys.exit(1)
asyncio.run(main())
