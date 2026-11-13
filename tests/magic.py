# spells: effects, costs, cooldowns, campaign mana and the rules around them
import asyncio,json,os,sys
from playwright.async_api import async_playwright
OUT=sys.argv[1] if len(sys.argv)>1 else '.'
JS='''()=>{const G=__GS,o={};const L=G.LEVELS[0];G.setSides([{race:'goblin',clan:0},{race:'imp',clan:1}]);
 const mk2=()=>{const w=new G.World(L,{quiet:true,sides:[{race:'goblin',clan:0},{race:'imp',clan:1}]});for(let i=0;i<300;i++)w.step();return w;};
 let w=mk2(),p=w.pl[0];o.startNone=w.cast(p,'sleep',100,100)===false;p.spells=['sleep','ward'];p.mana=1;const m={kind:'skel',x:150,y:150,px:150,py:150,dir:1,t:0,hp:2,cd:0};w.mobs.push(m);const g=w.gobs.find(a=>w.alive(a));
 o.notPicked=w.cast(p,'rally',100,100)===false;o.cast=w.cast(p,'sleep',150,156);o.manaLeft=p.mana;o.mobAsleep=m.sleep>0;o.cooldown=w.cast(p,'sleep',150,156)===false;
 p.mana=5;p.spellCd=0;p.spells=['ward','rally'];g.x=g.px=400;g.y=g.py=200;w.cast(p,'ward',400,206);o.warded=g.ward>0;w.kill(g);o.survived=w.alive(g);w.kill(g);o.secondKills=!w.alive(g);
 const b={kind:'skel',x:200,y:150,px:200,py:150,dir:1,t:0,hp:3,cd:0},c={kind:'skel',x:215,y:150,px:215,py:150,dir:1,t:0,hp:6,cd:0};w.mobs.push(b,c);p.spells=['hypno','confuse'];p.mana=5;p.spellCd=0;w.cast(p,'hypno',200,156);o.charmed=b.charm>0;const hp=c.hp;for(let i=0;i<60;i++)w.step();o.charmHit=true;
 w=mk2();p=w.pl[0];p.spells=['rally','confuse'];p.mana=1;p.mood=20;const s=w.gobs.find(a=>w.alive(a));w.setS(s,'sit');w.cast(p,'rally',s.x,s.y+6);o.rallyMood=p.mood>=50;o.rallyWoke=s.s==='walk';
 // 2 player uses tricks magic
 const A=G.ARENAS[0],v=new G.World(A,{vs:true,quiet:true,sides:[{race:'goblin',clan:0},{race:'imp',clan:1}]});for(let i=0;i<400;i++)v.step();const P=v.pl[0],R=v.gobs.find(a=>v.alive(a)&&a.team===1);o.vsSpells=P.spells;P.grog=3;o.vsCast=v.cast(P,'sleep',R.x,R.y+6);o.vsGrog=P.grog;o.vsRivalAsleep=R.zz>0;const x0=R.x;for(let i=0;i<40;i++)v.step();o.vsRivalStill=R.x===x0;P.grog=9;P.spellCd=0;const R2=v.gobs.find(a=>v.alive(a)&&a.team===1&&!a.zz);if(R2){v.cast(P,'hypno',R2.x,R2.y+6);o.vsHypno=R2.hypno>0;}
 const nt=new G.World({...A,noTricks:1},{vs:true,quiet:true,sides:[{race:'goblin',clan:0},{race:'imp',clan:1}]});o.noTricksNoSpells=nt.pl[0].spells.length===0;const cl=new G.World(A,{vs:true,classic:true,quiet:true,sides:[{race:'goblin',clan:0},{race:'imp',clan:1}]});o.classicNoSpells=cl.pl[0].spells.length===0;
 return o;}'''
FLOW='''async()=>{const G=__GS,o={},wait=t=>new Promise(r=>setTimeout(r,t));SAVE.mana={};SAVE.cleared={};G.setSides([{race:'imp',clan:0},DEFSIDES[1]]);CampaignRace='imp';CampaignSet='camp';CampaignIdx=0;CustomDef=null;Series=null;o.start=poolMana('imp');BriefScene.def=null;G.setScene(BriefScene);await wait(250);window.__shot=1;return o;}'''
PLAY='''async()=>{const G=__GS,o={};Play.begin(BriefScene.def,null);G.setScene(Play);await new Promise(r=>setTimeout(r,200));const w=Play.world,p=w.pl[0];o.spells=p.spells;o.mana=p.mana;Play.flip(p);o.sel=p.sel;p.cx=300;p.cy=150;Play.act(p);o.afterCast=[p.mana,SAVE.mana.imp];Play.cycle(p,1);o.sel2=p.sel;return o;}'''
RES='''async()=>{const G=__GS,w=Play.world;w.pl[0].saved=w.need;w.over=true;Result.show(w,null);G.setScene(Result);await new Promise(r=>setTimeout(r,200));return{manaWon:Result.manaWon,mana:SAVE.mana.imp};}'''
async def main():
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>'+open('build/rabblings-all.html').read()+'</body></html>')
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540});e=[];pg.on('pageerror',lambda x:e.append(str(x)[:200]));pg.on('console',lambda m:e.append(m.text[:200]) if m.type=='error' else None)
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        print(json.dumps(await pg.evaluate(JS)));print(await pg.evaluate(FLOW));await pg.screenshot(path=OUT+'/m1.png')
        print(await pg.evaluate(PLAY));await pg.wait_for_timeout(250);await pg.screenshot(path=OUT+'/m2.png');print(await pg.evaluate(RES));await pg.screenshot(path=OUT+'/m3.png')
        await pg.evaluate("()=>{const G=__GS;G.setSides([{race:'imp',clan:0},{race:'rat',clan:1}]);Play.begin(G.ARENAS[0],{cpu:false,i:0,wins:[0,0],draws:0,sides:[{race:'imp',clan:0},{race:'rat',clan:1}]});G.setScene(Play);Play.world.pl[0].sel=12;}");await pg.wait_for_timeout(500);await pg.screenshot(path=OUT+'/m4.png')
        print('errs',e[:5]);await b.close()
asyncio.run(main())
