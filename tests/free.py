import asyncio,json,sys
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
# plays each free play map's solution plan as every race and clan; prints which races pass
JS='''(ids)=>{const G=__GS,o=[];for(const l of G.FREE_MAPS){if(ids.length&&!ids.includes(l.id))continue;for(const r of Object.keys(G.RACES)){if(!G.RACES[r].play)continue;const res=[];for(const c of [0,1]){const s=[{race:r,clan:c},{race:'goblin',clan:1}];G.setSides(s);const w=new G.World(l,{quiet:true,sides:s});w.pl[0].bot=G.freePlan(l,r);let n=0;while(!w.over&&n++<20000)w.step();res.push([w.pl[0].saved,w.pl[0].lost,n/25|0]);}o.push({id:l.id,name:l.name,race:r,need:l.need,c0:res[0],c1:res[1]});}}return o}'''
async def main():
    ids=sys.argv[1:]
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(600)
        rows=await pg.evaluate(JS,ids);cur=None;ok={}
        for r in rows:
            good=r['c0'][0]>=r['need'] and r['c1'][0]>=r['need']
            if good:ok.setdefault(r['id'],[]).append(r['race'])
            if r['id']!=cur:cur=r['id'];print('\n'+r['id'],r['name'],'need',r['need'])
            print('  %-8s %s  clan0 saved %s lost %s %ss | clan1 saved %s lost %s %ss'%(r['race'],'PASS' if good else 'fail',*r['c0'],*r['c1']))
        print('\nVALID RACES');[print(' ',k,v) for k,v in ok.items()]
        stale=await pg.evaluate("()=>Object.fromEntries(__GS.FREE_MAPS.map(l=>[l.id,l.races]))")
        bad=0
        for k,v in stale.items():
            if not ids or k in ids:
                if sorted(v)!=sorted(ok.get(k,[])):bad+=1;print('STALE',k,'stored',sorted(v),'actual',sorted(ok.get(k,[])))
        print('errs',errs[:3],'stale',bad);await b.close()
        if bad or errs:sys.exit(1)
asyncio.run(main())
