import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        r=await pg.evaluate("""()=>{const G=__GS,E=G.Ed;const m=G.genMap({style:'puzzle',type:'flat',seed:3,w:800,h:300,mode:'solo',theme:'caves'});m.race='shroom';m.rules=['regrow','gust','tide'];E.open(m);G.setScene(E);E.tool='place';E.objPg=1;for(const[k,x]of[['spring',200],['belt',300],['keg',420],['scrap',480]])E.addPoint(k,x,200);const c=G.cleanMap(JSON.parse(JSON.stringify(m)));return [m.objs.map(o=>o.k).join(),c.objs.length,c.race,c.rules.join()]}""");print(r);await pg.wait_for_timeout(400);await pg.screenshot(path='b0.png')
        await pg.evaluate("()=>{const E=__GS.Ed;E.tool='move';E.sel=E.map.objs.find(o=>o.k==='belt')}");await pg.wait_for_timeout(250);await pg.screenshot(path='b1.png')
        print('errs',errs[:4]);await b.close()
asyncio.run(main())
