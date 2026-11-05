import asyncio,json
from playwright.async_api import async_playwright
JS='''()=>{const G=__GS,o={};const l=G.WAR_LEVELS[0],mk=(race,dead)=>{const w=new G.World({...l,foes:[],hatch:[{x:70,y:165,dir:1}]},{quiet:true,sides:[{race,clan:0},{race:'goblin',clan:1}]});w.def.rate=4;return w};
 // morale drop per race after a third of the team die
 for(const race of ['goblin','swamp','imp']){const w=mk(race);for(let i=0;i<120;i++)w.step();const p=w.pl[0],g=w.gobs.filter(a=>w.alive(a)).slice(0,5);g.forEach(a=>w.kill(a));w.step();o[race]=[p.total,Math.round(p.mood),p.moodT];}
 // mutiny, sit down, order refused, forced Boom works
 {const w=mk('goblin');for(let i=0;i<120;i++)w.step();const p=w.pl[0];p.skills.boom=5;p.skills.dig=20;p.mood=10;let sit=0,t=0;while(t++<300){w.step();sit=w.gobs.filter(g=>g.s==='sit').length;}let refused=0,tried=0;for(const g of w.gobs.filter(a=>a.s==='walk')){for(let k=0;k<6;k++){if(!w.canAssign(g,'dig',p))continue;tried++;if(!w.assign(g,'dig',p))refused++;else{g.s='walk';p.skills.dig++;}}}
  const s=w.gobs.find(g=>g.s==='sit');o.mutiny={sit,alive:w.gobs.filter(g=>w.alive(g)).length,tried,refused,sitCanDig:s?w.canAssign(s,'dig',p):null,boomed:s?w.assign(s,'boom',p):null};let n=0;const before=w.gobs.filter(g=>w.alive(g)).length;while(n++<160)w.step();o.mutiny.afterBoom=[before,w.gobs.filter(g=>w.alive(g)).length,w.gobs.some(g=>g===s&&g.s==='dead')];p.mood=40;n=0;while(n++<500)w.step();o.recover=[Math.round(p.mood),w.gobs.filter(g=>g.s==='sit').length];}
 return o}'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        print(json.dumps(await pg.evaluate(JS)))
        # visual: real play with deaths, speech and strike
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(250);await pg.keyboard.press('Enter');await pg.wait_for_timeout(100)
        await pg.evaluate("__GS.TitleScene.items()[1][1]()");await pg.wait_for_timeout(800);await pg.keyboard.press('Enter');await pg.wait_for_timeout(800)
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(800);await pg.keyboard.press('Enter');await pg.wait_for_timeout(900)
        await pg.evaluate("""()=>{const w=__GS.Play.world,p=w.pl[0];w.foes=0;window.F=setInterval(()=>{const a=w.gobs.filter(g=>g.s!=='dead')[0];if(a){p.camX=Math.max(0,a.x-200);p.camY=70}},40);for(let i=0;i<260;i++)w.step();p.mood=12;w.traps.push({k:'fire',x:230,y:200,rw:40,rh:32,raw:1,cd:0,live:1,off:0})}""");await pg.wait_for_timeout(2200);await pg.screenshot(path='m0.png')
        await pg.wait_for_timeout(1100);await pg.screenshot(path='m1.png');await pg.wait_for_timeout(1300);await pg.screenshot(path='m2.png')
        print('states',await pg.evaluate("(()=>{const c={};for(const g of __GS.Play.world.gobs)c[g.s]=(c[g.s]||0)+1;return [c,Math.round(__GS.Play.world.pl[0].mood),[...new Set(__GS.Play.world.ents.map(e=>e.k))]]})()"))
        print('errs',errs[:5]);await b.close()
asyncio.run(main())
