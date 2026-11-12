import asyncio,sys,os
from playwright.async_api import async_playwright
from PIL import Image
# usage: shot.py outdir id [id...] -> one stitched image per map (whole map at 2x, tiles of the play view)
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    out=sys.argv[1]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(600)
        for id in sys.argv[2:]:
            await pg.evaluate("(id)=>{const G=__GS,l=id.includes(':')?G.RACE_LEVELS[id.split(':')[0]][+id.split(':')[1]-1]:G.FREE_MAPS.find(a=>a.id===id);/*RACE:n ids*/G.Play.begin(l,null,{});G.setScene(G.Play);}",id)
            await pg.wait_for_timeout(2600)
            W,H=await pg.evaluate("()=>[__GS.Play.world.T.w,__GS.Play.world.T.h]")
            VH=225
            xs=sorted(set([0]+list(range(480,W-480,480))+[max(0,W-480)]));ys=sorted(set([0]+list(range(VH,H-VH,VH))+[max(0,H-VH)]))
            img=Image.new('RGB',(W*2,H*2))
            for y in ys:
                for x in xs:
                    await pg.evaluate("([x,y])=>{const w=__GS.Play.world;w.pl[0].camX=x;w.pl[0].camY=y}",[x,y]);await pg.wait_for_timeout(120)
                    cx,cy=await pg.evaluate("()=>{const p=__GS.Play.world.pl[0];return [p.camX,p.camY]}");await pg.screenshot(path='/tmp/_t.png');t=Image.open('/tmp/_t.png').crop((0,0,960,450));img.paste(t,(int(cx*2),int(cy*2)))
            img.save('%s/%s.png'%(out,id.replace(':','_')))
        print("errs",errs[:3],"skipped",await pg.evaluate("()=>__GS.fxDec&&__GS.fxDec.skipped"));await b.close()
asyncio.run(main())
