import asyncio,json,sys,base64,collections
from playwright.async_api import async_playwright
import sys
NL=sys.argv[2];PK=sys.argv[1]
JS='''async()=>{const G=__GS,I=__IMP,out={};const get=n=>I.ImpFiles.levels.find(l=>l.name===n&&/LOL|YOLO|OMG|WTF/.test(l.path));
 // hand plan for Dig for Victory
 for(const race of ['goblin','swamp','imp']){const m=await I.impConvert(get('Dig the Victory'),race),d=G.toDef(m);d.plan=[{s:'dig',x:200,tol:3,y:160,ytol:4},{s:'dig',x:280,tol:3,y:250,ytol:4}];
  const w=new G.World(d,{quiet:true,sides:[{race,clan:0},{race:'goblin',clan:1}]});w.pl[0].bot=d.plan;let t=0;while(!w.over&&t++<12000)w.step();out['dig_'+race]={saved:w.pl[0].saved,lost:w.pl[0].lost,need:m.need,ticks:t,time:m.time,skills:w.pl[0].skills};}
 // one-way wall test: floor, then a wall of right-only material
 {const a=new Uint8Array(160*100);for(let y=70;y<100;y++)for(let x=0;x<160;x++)a[y*160+x]=1;for(let y=40;y<70;y++)for(let x=70;x<90;x++)a[y*160+x]=5;
  const run=(dir,hx)=>{const def={name:'t',theme:'bog',w:320,h:200,n:1,need:1,rate:30,time:60,skills:{bash:1},open:1,maxUp:12,fall:126,hatch:[{x:hx,y:120,dir,team:0}],doors:[{x:10,y:0,raw:1}],build(S){S.op(['M',160,100,1,0,0,I.pack(a)]);S.op;}};return def;};
  const res={};for(const [nm,dir,hx] of [['moving right',1,60],['moving left',-1,260]]){const d=run(dir,hx);d.build=S=>{const T=S.T;for(let y=0;y<200;y++)for(let x=0;x<320;x++){if(y>=140)T.m[y*320+x]=1;else if(y>=80&&x>=140&&x<180)T.m[y*320+x]=5;}};const w=new G.World(d,{quiet:true});w.pl[0].skills.bash=1;let t=0,done=0;const g0=[];while(t++<900){w.step();const g=w.gobs[0];if(g&&!done&&g.s==='walk'&&Math.abs(g.x-(dir>0?133:187))<=2){done=w.assign(g,'bash',w.pl[0]);}}const g=w.gobs[0];let holes=0;for(let x=140;x<180;x++)if(!w.T.m[130*320+x])holes++;res[nm]={holes,gx:g.x,dir:g.dir,assigned:done};}out.oneway=res;}
 return out}'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        await pg.evaluate("()=>{const G=__GS;G.setScene(G.ImportScene);__GS.ImportScene.choose()}");await pg.wait_for_timeout(200)
        await pg.set_input_files('#dlg-files',[NL,PK]);await pg.wait_for_function("__GS.ImportScene.view==='packs'",timeout=60000)
        print(json.dumps(await pg.evaluate(JS),indent=0)[:1400])
        # full UI flow
        await pg.evaluate("()=>{const I=__GS.ImportScene,P=__IMP.ImpFiles.packs().find(p=>p.levels&&p.levels.length)||__IMP.ImpFiles.packs()[0];I.pack=P;I.view='levels';I.sel=0;I.race=2}");await pg.wait_for_timeout(300);await pg.screenshot(path='f1.png')
        await pg.evaluate("()=>{const I=__GS.ImportScene;I.run([__IMP.ImpFiles.levels.find(l=>l.name==='Ever fire terrace')])}");await pg.wait_for_function("__GS.ImportScene.view==='done'");await pg.wait_for_timeout(300);await pg.screenshot(path='f2.png')
        await pg.evaluate("()=>{const I=__GS.ImportScene;I.run(I.pack.levels)}");await pg.wait_for_function("__GS.ImportScene.view==='done'",timeout=30000);await pg.wait_for_timeout(300);await pg.screenshot(path='f3.png')
        print('stored',await pg.evaluate("[__GS.Store.all().length,JSON.stringify(__GS.Store.all()).length,__GS.ImportScene.done.saved,__GS.ImportScene.done.warn]"))
        await pg.evaluate("()=>__GS.setScene(__GS.MapsScene)");await pg.wait_for_timeout(400);await pg.screenshot(path='f4.png')
        await pg.evaluate("()=>{const G=__GS,m=G.Store.all().find(a=>/EVER FIRE/.test(a.name));G.MapsScene.play(m,false)}");await pg.wait_for_timeout(900);await pg.screenshot(path='f5.png')
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(5000);await pg.screenshot(path='f6.png')
        print('play',await pg.evaluate("(()=>{const w=__GS.Play.world;return [w.def.name,w.pl[0].race,w.pl[0].panel.join(),w.pl[0].out,w.time]})()"))
        await pg.keyboard.press('Escape');await pg.wait_for_timeout(600)
        print('reload keeps maps',await pg.evaluate("JSON.parse(localStorage.getItem('goblin-scramble-maps')||'[]').length"),'errs',errs[:5]);await b.close()
asyncio.run(main())
