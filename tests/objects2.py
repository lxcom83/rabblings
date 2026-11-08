import asyncio,os,sys
from playwright.async_api import async_playwright
# synthetic NeoLemmix style: force fields, updraft, splitter and splat pads become our own objects with working rules
SETUP='''async()=>{const I=__IMP,F=I.ImpFiles;F.styles={};F.levels=[];F.nxmi={};F.plist=null;
 const png=(w,h,fn)=>new Promise(r=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x,w,h);c.toBlob(async b=>r(new Uint8Array(await b.arrayBuffer())),'image/png');});
 const put=(k,b)=>{F.styles[k]=async()=>b;},te=s=>new TextEncoder().encode(s);
 put('t/terrain/floor.png',await png(240,20,(x,w,h)=>{x.fillStyle='#777';x.fillRect(0,0,w,h);}));
 const obj=async(n,fx,w,h)=>{put('t/objects/'+n+'.png',await png(w,h,(x)=>{x.fillStyle='#c33';x.fillRect(0,0,w,h);}));put('t/objects/'+n+'.nxmo',te('EFFECT '+fx+'\\nTRIGGER_X 0\\nTRIGGER_Y 0\\nTRIGGER_WIDTH '+w+'\\nTRIGGER_HEIGHT '+h+'\\n'));};
 await obj('hatch','ENTRANCE',20,12);await obj('exit','EXIT',20,20);
 await obj('fl','FORCELEFT',20,30);await obj('fr','FORCERIGHT',20,30);await obj('ud','UPDRAFT',20,40);await obj('sp','SPLITTER',16,30);await obj('sx','SPLATPAD',20,10);await obj('ns','ANTISPLATPAD',24,10);
 window.__mk=(extra,hy)=>{let s=`TITLE T\\nAUTHOR T\\nTHEME t\\nWIDTH 320\\nHEIGHT 200\\nLEMMINGS 4\\nSAVE_REQUIREMENT 1\\n`;
  for(let i=0;i<2;i++)s+=`$TERRAIN\\n STYLE t\\n PIECE floor\\n X ${i*160}\\n Y 170\\n$END\\n`;
  s+=`$GADGET\\n STYLE t\\n PIECE hatch\\n X 60\\n Y ${hy||130}\\n$END\\n$GADGET\\n STYLE t\\n PIECE exit\\n X 300\\n Y 150\\n$END\\n`+extra;
  return {path:'levels/P/a.nxlv',pack:'P',name:'a',read:async()=>te(s),dir:'levels/P',file:'a.nxlv'};};
 window.__run=async(extra,hy,ticks,fn)=>{const m=await I.impConvert(__mk(extra,hy),'goblin'),d=__GS.toDef(m);const w=new __GS.World(d,{quiet:true,sides:[{race:'goblin',clan:0},{race:'goblin',clan:1}]});
  let t=0;const out=fn?fn(w):null;while(t++<ticks&&!w.over)w.step();return {m,w,lost:w.pl[0].lost,saved:w.pl[0].saved,xs:w.gobs.filter(g=>g.team===0&&w.alive(g)).map(g=>Math.round(g.x))};};
 return 1;}'''
G=lambda p,x,y:f"$GADGET\\n STYLE t\\n PIECE {p}\\n X {x}\\n Y {y}\\n$END\\n"
async def main():
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        await pg.evaluate(SETUP);ok=True
        def chk(n,c,i=''):
            nonlocal ok;print(('PASS ' if c else 'FAIL ')+n+(' '+str(i) if not c else ''));ok=ok and bool(c)
        r=lambda extra,hy,ticks,fn='null':pg.evaluate("async()=>{const r=await __run(\""+extra+"\","+str(hy)+","+str(ticks)+","+fn+");return {rep:r.m.report,lost:r.lost,saved:r.saved,xs:r.xs,objs:r.m.objs.map(o=>o.k)}}")
        a=await r('',130,900);chk('baseline: troops reach home',a['saved']>=3,a)
        a=await r(G('fl',200,140),130,700);chk('force left turns troops back',a['saved']==0 and len(a['xs'])>=3 and 'forcel' in a['objs'] and all(x<460 for x in a['xs']),a)
        a=await r(G('fr',100,140),130,300);chk('force right object imported',any(k=='forcer' for k in a['objs']) and not any('removed' in x for x in a['rep']),a)
        a=await r(G('sp',200,140),130,900);chk('splitter sends some each way',any(k=='splitter' for k in a['objs']) and 0<a['saved']<4,a)
        a=await r(G('sx',200,162),130,900);chk('splat pad kills',a['lost']>=1 and a['saved']==0,a)
        a=await r('',20,900);chk('long fall kills without a pad',a['lost']>=1,a)
        a=await r(G('ns',48,162),20,900);chk('anti-splat pad lets a long fall survive',a['lost']<4 and any(k=='nosplat' for k in a['objs']),a)
        # built-in namida style: no style files at all, her piece and object names still resolve
        T=lambda st,pc,x,y:f"$TERRAIN\\n STYLE {st}\\n PIECE {pc}\\n X {x}\\n Y {y}\\n$END\\n"
        a=await pg.evaluate("""async()=>{__IMP.ImpFiles.styles={};const te=s=>new TextEncoder().encode(s);let s=`TITLE B\\nAUTHOR namida\\nTHEME namida_horror\\nWIDTH 320\\nHEIGHT 200\\nLEMMINGS 4\\nSAVE_REQUIREMENT 1\\n`;
         for(let i=0;i<8;i++)s+=`$TERRAIN\\n STYLE namida_horror\\n PIECE bones_01\\n X ${i*40}\\n Y 170\\n$END\\n`;
         s+=`$GADGET\\n STYLE namida_horror\\n PIECE window\\n X 60\\n Y 120\\n$END\\n$GADGET\\n STYLE namida_horror\\n PIECE exit_01\\n X 280\\n Y 140\\n$END\\n`;
         const m=await __IMP.impConvert({path:'levels/P/b.nxlv',pack:'P',name:'b',read:async()=>te(s),dir:'levels/P',file:'b.nxlv'},'goblin');return {rep:m.report,objs:m.objs.map(o=>o.k),skin:m.ops[0].length}}""")
        chk('namida styles are built in: level imports with no style files',a['objs'].count('hatch')==1 and a['objs'].count('door')==1 and not any('Missing' in x or 'could not be found' in x for x in a['rep']),a)
        print('errs',errs[:3]);await b.close();print('ALL PASS' if ok else 'SOME FAILED')
asyncio.run(main())
