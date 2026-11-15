import asyncio,json
from playwright.async_api import async_playwright
JS='''()=>{const G=__GS,o={};const l=G.LEVELS[0];
 // wildcards fire on Wild difficulty, and terrain and troops react
 {const w=new G.World({...l,foes:[]},{quiet:true,diff:3});const seen={};const orig=w.fire.bind(w);w.fire=a=>{seen[a]=(seen[a]||0)+1;orig(a)};let holes=0;for(let i=0;i<4400&&!w.over;i++)w.step();o.wild={seen,lost:w.pl[0].lost,saved:w.pl[0].saved,need:w.need,time:w.time,mobs:w.mobs.filter(m=>m.kind==='spider').length,crater:w.T.count(0,230,780,40)<780*40};}
 // spider hits and leaves
 {const w=new G.World({...l,foes:[],rate:20},{quiet:true});for(let i=0;i<200;i++)w.step();w.fire('spider');const m=w.mobs.at(-1);let air=0,n=0;for(;n<700&&!m.dead;n++){w.step();if(m.air)air++;}o.spider={jumpTicks:air,ended:n,lost:w.pl[0].lost,clear:w.isClear()};}
 // meteor actually carves and kills
 {const w=new G.World({...l,foes:[]},{quiet:true});for(let i=0;i<150;i++)w.step();const before=w.T.m.reduce((a,b)=>a+(b?1:0),0);w.fire('meteors');for(let i=0;i<260;i++)w.step();o.meteor={carved:before-w.T.m.reduce((a,b)=>a+(b?1:0),0),lost:w.pl[0].lost};}
 // surface and underground maps draw from different wildcard sets, and every new wildcard does its job
 {const set=u=>{const w=new G.World({...l,foes:[],under:u},{quiet:true,diff:3}),seen={},orig=w.fire.bind(w);w.fire=a=>{seen[a]=1;orig(a)};for(let i=0;i<20000&&!w.over;i++){w.step();if(w.over){w.over=0;}if(w.gobs.length>200)break;}return Object.keys(seen).sort();};o.sets={surface:set(0),under:set(1)};
  const one=k=>{const w=new G.World({...l,foes:[],rate:20},{quiet:true});for(let i=0;i<220;i++)w.step();const lost=w.pl[0].lost;w.fire(k);const on=Object.keys(w.rule).filter(q=>w.rule[q]);for(let i=0;i<420;i++)w.step();return{on,off:Object.keys(w.rule).filter(q=>w.rule[q]).length===0,lost:w.pl[0].lost-lost};};
  o.each={};for(const k of ['debris','surge','swoop','gale','cavein','tunnelflood','dark'])o.each[k]=one(k);
  const w=new G.World({...l,foes:[],rules:['lowg']},{quiet:true});w.fire('surge');for(let i=0;i<300;i++)w.step();o.keepsMapRule=!!w.rule.lowg;}
 // difficulty values
 o.diff=G.DIFFS.map((d,i)=>{const w=new G.World(l,{quiet:true,diff:i});return [d.n,w.need,Math.round(w.time/25),w.wildOn];});
 // Skeletons: water, fire, construct on trap
 {const d={...l,foes:[],haz:[{x0:200,x1:320,y:225,y1:240}]};G.setSides([{race:'bone',clan:0},{race:'goblin',clan:1}]);const w=new G.World(d,{quiet:true,sides:[{race:'bone',clan:0},{race:'goblin',clan:1}]});for(let i=0;i<500;i++)w.step();o.water={lost:w.pl[0].lost,past:Math.max(...w.gobs.map(g=>g.x))};const g=w.gobs.find(a=>w.alive(a));w.kill(g,'fire');w.step();o.firePile={piles:w.piles.length};const w2=new G.World(d,{quiet:true,sides:[{race:'bone',clan:0},{race:'goblin',clan:1}]});w2.def.rate=10;for(let i=0;i<200;i++)w2.step();const a=w2.gobs.find(x=>x.s==='walk');w2.pl[0].skills.merge=2;const m=w2.assign(a,'merge',w2.pl[0]);const hp=a.hp,ins=a.inside&&a.inside.length;w2.kill(a,'jaws');o.construct={m,hp,ins,afterHit:[a.hp,a.inside&&a.inside.length,a.s],lost:w2.pl[0].lost};}
 // score
 {const w=new G.World({...l,foes:[]},{quiet:true});w.pl[0].saved=10;w.time=2500;o.score=[G.runScore(w,true),G.runScore(w,false)];}
 return o}'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        print(json.dumps(await pg.evaluate(JS)));print(errs[:3]);await b.close()
asyncio.run(main())
