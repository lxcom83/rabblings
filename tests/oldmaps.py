# proofs and share codes made by Version 24 must still work. Needs an older one-file build as the first argument
import asyncio,json,sys
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
MK='''async()=>{const G=__GS,out=[];for(const[t,mode]of [['march','solo'],['raid','solo'],['arena','mirror'],['gauntlet','free']]){const m=G.genMap({tpl:t,type:'auto',traps:2,foes:1,mach:2,pool:1,theme:'bog',mode,w:800,h:300,seed:31});m.proof=G.mapSig(m);out.push({m:JSON.parse(JSON.stringify(m)),code:await G.packMap(m)});}return out;}'''
CK='''async L=>{const G=__GS,r=[];for(const{m,code}of L){localStorage.setItem('goblin-scramble-maps',JSON.stringify([m]));G.Store.mem=null;const s=G.Store.all()[0],a=s.proof===G.mapSig(s),u=await G.unpackMap(code),b=m.proof===G.mapSig(u),c=s.objs.every(o=>Number.isFinite(o.uid));r.push([a,b,c,s.fmt]);}return r;}'''
async def main():
    open('old.html','w').write(SK%open(sys.argv[1]).read());open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    import os
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page();await pg.goto('file://'+os.getcwd()+'/old.html');await pg.wait_for_timeout(500);L=await pg.evaluate(MK)
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500);print(json.dumps(await pg.evaluate(CK,L)));await b.close()
    os.remove('old.html')
asyncio.run(main())
