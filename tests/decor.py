# decor stamps and image import
import asyncio,json,os,sys
from playwright.async_api import async_playwright
A,B=sys.argv[1],sys.argv[2];OUT=sys.argv[3]
CK='''async()=>{const G=__GS,E=G.Ed,out={};const m=G.blankMap?G.blankMap('puzzle'):null;m.w=800;m.h=300;m.theme='bog';m.ops=[['B',1,0,220,800,80]];m.objs=[{k:'hatch',x:60,y:150,dir:1},{k:'door',x:760,y:220}];
 const sig0=G.mapSig(m);m.ops.push(['D','rocks',200,260,0,1],['D','tomb',260,220,0,1]);out.paintKeepsProof=sig0===G.mapSig(m);m.ops.push(['D','boulder',320,220,0,1]);out.solidVoidsProof=sig0!==G.mapSig(m);
 const c=await G.packMap(m),b=await G.unpackMap(c);out.codeKeepsDecor=b.ops.filter(o=>o[0]==='D').length;
 const w=new G.World(G.toDef(b),{quiet:true}),T=w.T,k=(x,y)=>y*T.w+x;out.solidAdded=T.solid(320,212);const before=T.t[k(200,260)];T.carveEll(200,260,10,10);T.flush();out.digRemoves=!T.solid(200,260);
 // every stamp in every world builds
 let n=0;for(const th of Object.keys(THEME)){for(const q of decorKinds(th)){const t=new Terrain(240,160,th,7),S=new Shaper(t,7);S.box(0,120,240,40);S.op(['D',q,120,120,n%2,1+n%2]);t.texCols(0,240);t.flushAll();n++;}}out.stampsBuilt=n;
 // mirrored
 const z=JSON.parse(JSON.stringify(m));z.mode='mirror';z.w=960;z.ops=[['B',1,0,220,960,80],['D','bricks',200,260,0,1],['D','pillar',300,220,0,1]];const W=new G.World(G.toDef(z),{quiet:true,vs:true});out.mirrorSolid=W.T.solid(300,200)&&W.T.solid(959-300,200);const a=W.T.t[260*960+200],c2=W.T.t[260*960+959-200];out.mirrorPaint=a===c2;
 return out;}'''
async def main():
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>'+open('build/rabblings-all.html').read()+'</body></html>')
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540});e=[];pg.on('pageerror',lambda x:e.append(str(x)[:200]));pg.on('console',lambda m:e.append(m.text[:200]) if m.type=='error' else None)
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        await pg.evaluate("()=>{window.__GS.blankMap=window.__GS.blankMap||blankMap;}")
        print(json.dumps(await pg.evaluate(CK)))
        # image flow through the real file box
        await pg.evaluate("()=>{const G=__GS,m=G.genMap({tpl:'march',type:'hills',traps:1,foes:0,mach:0,decor:0,pool:1,theme:'bog',mode:'solo',w:800,h:300,seed:5});G.Ed.open(m);G.setScene(G.Ed);G.Ed.group='decor';G.Ed.dk='img';G.Ed.pickImage();}")
        await pg.set_input_files('#dlg-file',A);await pg.wait_for_timeout(600);print('page',await pg.evaluate("[Ed.panel,Ed.imp&&Ed.imp.pic.w,Ed.imp&&Ed.imp.pic.pal.length]"));await pg.screenshot(path=OUT+'/i1.png')
        await pg.evaluate("()=>Ed.impAdd()");await pg.wait_for_timeout(200)
        await pg.evaluate("()=>{const r=Ed.pdown.bind(Ed);Ed.cx=0;Ed.cy=0;pointerX=300;pointerY=160;ptrBtn=0;Ed.pdown(1,300,160);Ed.pup(1,300,160);}");await pg.wait_for_timeout(200)
        print('stamp',await pg.evaluate("[Ed.map.pics.length,Ed.map.ops.filter(o=>o[0]==='I').length,Ed.T.solid(Ed.map.ops.find(o=>o[0]==='I')[2],Ed.map.ops.find(o=>o[0]==='I')[3]-5)]"));await pg.screenshot(path=OUT+'/i2.png')
        print('undo',await pg.evaluate("()=>{Ed.undo();const a=Ed.map.ops.filter(o=>o[0]==='I').length;Ed.redo();return [a,Ed.map.ops.filter(o=>o[0]==='I').length]}"))
        print('save',await pg.evaluate("async()=>{const G=__GS,m=Ed.map,c=await G.packMap(m),u=await G.unpackMap(c),w=new G.World(G.toDef(u),{quiet:true});for(let i=0;i<50;i++)w.step();Store.put(m);return [c.length,u.pics.length,u.ops.filter(o=>o[0]==='I').length]}"))
        # whole map from a black background picture
        await pg.evaluate("()=>{Ed.pickImage();}");await pg.set_input_files('#dlg-file',B);await pg.wait_for_timeout(600)
        await pg.evaluate("()=>{const I=Ed.imp;I.empty='black';I.use='whole';Ed.impMake();}");await pg.wait_for_timeout(200);await pg.evaluate("()=>{Ed.impAdd();Ed.bg=1;Ed.z=.5;Ed.cx=0;Ed.cy=0;}");await pg.wait_for_timeout(300);await pg.screenshot(path=OUT+'/i3.png')
        print('whole',await pg.evaluate("[Ed.map.w,Ed.map.h,Ed.T.solid(300,200),Ed.T.solid(100,50),Ed.map.pics.length]"))
        await pg.evaluate("()=>{Ed.z=1;}")
        # all decor visible
        await pg.evaluate("""()=>{const G=__GS,m=G.genMap({tpl:'march',type:'flat',traps:0,foes:0,mach:0,decor:0,pool:0,theme:'bog',mode:'solo',w:800,h:300,seed:3});let x=30;for(const q of decorKinds('bog')){const d=DECOR[q];m.ops.push(['D',q,x,d.kind==='paint'?232:210,0,1]);x+=33;}G.Ed.open(m);G.setScene(G.Ed);G.Ed.cx=0;G.Ed.cy=50;G.Ed.group='decor';G.Ed.dec='boulder';G.Ed.dk='solid';G.Ed.tool='decor';pointerX=300;pointerY=120;}""");await pg.wait_for_timeout(300);await pg.screenshot(path=OUT+'/d1.png')
        await pg.evaluate("""()=>{const G=__GS,m=G.genMap({tpl:'march',type:'hills',traps:0,foes:0,mach:0,decor:3,pool:0,theme:'forge',mode:'solo',w:800,h:300,seed:3});G.Ed.open(m);G.setScene(G.Ed);}""");await pg.wait_for_timeout(300);await pg.screenshot(path=OUT+'/d2.png')
        print('errs',e[:4]);await b.close()
asyncio.run(main())
