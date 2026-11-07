import asyncio,json
from playwright.async_api import async_playwright
JS='''()=>{const G=__GS,o={};const S=r=>[{race:r,clan:0},{race:'goblin',clan:1}];
 const base={name:'t',theme:'mine',w:760,h:300,n:6,need:1,rate:30,time:60,skills:{},hatch:[{x:90,y:150,dir:1}],doors:[{x:700,y:230}],build(s){s.box(0,230,760,70);}};
 // Fairy: long fall safe, iron zaps
 {const w=new G.World({...base,build(s){s.box(0,270,760,30);},hatch:[{x:90,y:40,dir:1}],doors:[{x:700,y:270}]},{quiet:true,sides:S('fairy')});for(let i=0;i<300;i++)w.step();o.fairyFall=[w.pl[0].lost,w.gobs.filter(g=>w.alive(g)).length];}
 {const w=new G.World({...base,build(s){s.box(0,230,760,70);s.iron(120,230,400,70);}},{quiet:true,sides:S('fairy')});for(let i=0;i<500;i++)w.step();o.fairyIron=w.pl[0].lost;}
 // Dwarf: 2 hearts, slower, ale drains
 {const w=new G.World(base,{quiet:true,sides:S('dwarf')});for(let i=0;i<500;i++)w.step();const g=w.gobs[0];o.dwarf={hp:g.hp,x:g.x,mood:Math.round(w.pl[0].mood)};}
 {const w=new G.World(base,{quiet:true,sides:S('goblin')});for(let i=0;i<500;i++)w.step();o.goblinX=w.gobs[0].x;}
 // Rat: fast, scrap spent, refuses at 0
 {const w=new G.World({...base,scrap:1,skills:{spring:3}},{quiet:true,sides:S('rat')});for(let i=0;i<200;i++)w.step();const p=w.pl[0],g=w.gobs.find(a=>a.s==='walk');o.rat={x:w.gobs[0].x,a:w.assign(g,'spring',p),scrap:p.scrap};const h=w.gobs.find(a=>a.s==='walk');o.rat.b=h?w.assign(h,'spring',p):null;}
 // regrow restores
 {const w=new G.World({...base,rules:['regrow']},{quiet:true,sides:S('goblin')});const T=w.T;const n0=T.m.reduce((a,b)=>a+(b?1:0),0);T.carve(600,230,20,10);const n1=T.m.reduce((a,b)=>a+(b?1:0),0);for(let i=0;i<420;i++)w.step();o.regrow=[n0,n1,T.m.reduce((a,b)=>a+(b?1:0),0)];}
 // gust and tide values, spring and belt
 {const w=new G.World({...base,rules:['gust','tide'],tideRate:80},{quiet:true});const v=[];for(let i=1;i<=620;i++){w.step();if(i%150===0)v.push(w.gustDir);}o.gust=v;o.tideY=w.floodY;}
 {const w=new G.World({...base,traps:[{k:'spring',x:220,y:230},{k:'belt',x:400,y:230,w:200,dir:-1}]},{quiet:true});let air=0;for(let i=0;i<900;i++){w.step();if(w.gobs.some(g=>g.s==='fling'))air++;}o.spring=air;o.beltHeld=Math.max(...w.gobs.map(g=>g.x));}
 // spore puff stands strikers
 {const w=new G.World({...base,skills:{puff:3}},{quiet:true,sides:S('shroom')});for(let i=0;i<200;i++)w.step();const p=w.pl[0];const L=w.gobs.filter(g=>w.alive(g));L.slice(1).forEach(g=>w.setS(g,'sit'));p.mood=60;const r=w.assign(L[0],'puff',p);o.puff={r,sit:w.gobs.filter(g=>g.s==='sit').length,mood:Math.round(p.mood)};}
 return o}'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        print(json.dumps(await pg.evaluate(JS)));print(errs[:3])
        # race cards
        for i,k in enumerate(['fairy','dwarf','rat','shroom']):
            await pg.evaluate("__GS.TitleScene.modes()[0][1]()");await pg.wait_for_timeout(700)
            await pg.evaluate("k=>{const G=__GS;G.RaceScene.s[0]={i:Object.keys(G.RACES).indexOf(k),c:0}}",k);await pg.wait_for_timeout(300);await pg.screenshot(path=f'r{i}.png')
        await b.close()
asyncio.run(main())
