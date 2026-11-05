import asyncio,json
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
JS='''async()=>{const G=__GS,E=G.Ed,out=[];
 const old={v:1,name:'OLD MAP',hint:'x',theme:'bog',style:'puzzle',mode:'solo',w:640,h:300,n:20,need:12,rate:32,time:240,skills:{climb:3,flap:3,boom:3,block:3,build:5,bash:3,pick:3,dig:3},ops:[['B',1,0,220,640,80],['S','hill',200,220]],objs:[{k:'hatch',x:100,y:150,dir:1},{k:'door',x:400,y:220}],rules:[],trig:[]};
 const m0=G.cleanMap(old);G.Store.put(m0);const got=G.Store.all()[0];
 for(const mode of ['solo','mirror','free']){const m=mode==='solo'?JSON.parse(JSON.stringify(got)):G.genMap({tpl:'march',type:'auto',traps:2,foes:1,pool:1,theme:'forge',mode,w:960,h:300,seed:9});E.open(m);G.setScene(E);
  for(const k of ['basics','play','skills','rules','trig','random',null]){E.panel=k;E.draw();}
  for(const g of ['terrain','shapes','points','traps','foes','machines','items',null]){E.group=g;E.draw();}
  for(const t of ['paint','erase','box','blob','stamp','place','move']){E.tool=t;E.draw();}
  for(const o of m.objs){E.tool='move';E.sel=o;E.draw();}E.sel=null;
  for(const part of [['pts'],['trp'],['ene'],['poo'],['ter'],['ter','pts','trp','ene','poo']]){const P={ter:0,pts:0,trp:0,ene:0,poo:0};part.forEach(p=>P[p]=1);E.snap();G.genLayout(m,{tpl:'gauntlet',type:'auto',seed:77,traps:3,foes:2,pool:2,parts:P});E.build();E.draw();const pr=mapProblems(m);if(pr.length)out.push([mode,part.join(),pr[0]]);}
  while(E.hist.length)E.undo();E.draw();const d=G.toDef(m);new G.World(d,{quiet:true,vs:mode!=='solo'});out.push([mode,'ok',m.objs.length]);}
 return out;}'''
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        print(json.dumps(await pg.evaluate(JS)));print('errs',errs[:3]);await b.close()
asyncio.run(main())
