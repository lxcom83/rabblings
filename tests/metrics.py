# Map shape metrics (design checks, not puzzle checks). usage: metrics.py [id ...]
#  void%   share of the map that is open air (target 35-60)
#  tiers   distinct walkable floor heights at least 24px wide, merged within 14px (target 3+)
#  flat    longest perfectly level walkable floor run in px (target <= 60 outside puzzle shelves)
#  wall    longest perfectly straight vertical wall run in px (target <= 40)
#  ceil    longest perfectly level ceiling run in px (target <= 40)
import asyncio,sys,os
from playwright.async_api import async_playwright
JS='''(ids)=>{const G=__GS,o=[];for(const l of G.FREE_MAPS){if(ids.length&&!ids.includes(l.id))continue;const s=[{race:'goblin',clan:0},{race:'goblin',clan:1}];G.setSides(s);const w=new G.World(l,{quiet:true,sides:s}),T=w.T,W=T.w,H=T.h,m=T.m,S=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&m[y*W+x]>0,wet=(x,y)=>(l.haz||[]).some(h=>x>=h.x0&&x<h.x1&&y>=h.y-2&&y<=h.y1+2);
 let air=0;for(let i=0;i<W*H;i++)if(!m[i])air++;
 const fl=[];let flat=0,ceil=0,wall=0;
 for(let y=1;y<H;y++){let r=0,c=0;for(let x=0;x<W;x++){if(S(x,y)&&!S(x,y-1)&&!S(x,y-2)&&!wet(x,y)){r++;flat=Math.max(flat,r);}else{if(r>=24)fl.push(y);r=0;}if(!S(x,y)&&S(x,y-1)&&!S(x,y+1)){c++;ceil=Math.max(ceil,c);}else c=0;}if(r>=24)fl.push(y);}
 for(let x=1;x<W;x++){let a=0;for(let y=0;y<H;y++){const e=S(x,y)!==S(x-1,y);if(e){a++;wall=Math.max(wall,a);}else a=0;}}
 const ys=[...new Set(fl)].sort((a,b)=>a-b),t=[];for(const y of ys)if(!t.length||y-t[t.length-1]>14)t.push(y);
 o.push({id:l.id,name:l.name,style:l.style||'',human:!!l.human,void:Math.round(air*100/(W*H)),tiers:t.length,flat,wall,ceil});}return o}'''
async def main():
    ids=sys.argv[1:]
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page();await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        warn=0
        for r in await pg.evaluate(JS,ids):
            # mechanical maps are meant to be straight; mixed maps get some built straight sections; organic maps get none
            k={'mechanical':9,'mixed':3}.get(r['style'],1)
            bad=[n for n,ok in [('void',25<=r['void']<=60),('tiers',r['tiers']>=3),('flat',r['flat']<=60*k),('wall',r['wall']<=40*k),('ceil',r['ceil']<=40*k)] if not ok]
            warn+=len(bad)
            print('%-6s %-10s %-20s void %2d%%  tiers %d  flat %3d  wall %3d  ceil %3d  %s'%(r['id'],r['style'],r['name'],r['void'],r['tiers'],r['flat'],r['wall'],r['ceil'],('CHECK '+','.join(bad)) if bad else 'ok'))
        print('metric warnings',warn);await b.close()
asyncio.run(main())
