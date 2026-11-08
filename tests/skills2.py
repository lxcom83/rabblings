import asyncio,os,sys
from playwright.async_api import async_playwright
# Swimmer, Disarmer and Walker from NeoLemmix levels become our own skills in spare panel slots
SETUP='''async()=>{const I=__IMP,F=I.ImpFiles;F.styles={};F.levels=[];F.nxmi={};F.plist=null;
 const png=(w,h,fn)=>new Promise(r=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x,w,h);c.toBlob(async b=>r(new Uint8Array(await b.arrayBuffer())),'image/png');});
 const put=(k,b)=>{F.styles[k]=async()=>b;},te=s=>new TextEncoder().encode(s);
 put('t/terrain/floor.png',await png(240,20,(x,w,h)=>{x.fillStyle='#777';x.fillRect(0,0,w,h);}));
 const obj=async(n,fx,w,h)=>{put('t/objects/'+n+'.png',await png(w,h,(x)=>{x.fillStyle='#c33';x.fillRect(0,0,w,h);}));put('t/objects/'+n+'.nxmo',te('EFFECT '+fx+'\\nTRIGGER_X 0\\nTRIGGER_Y 0\\nTRIGGER_WIDTH '+w+'\\nTRIGGER_HEIGHT '+h+'\\n'));};
 await obj('hatch','ENTRANCE',20,12);await obj('exit','EXIT',20,20);await obj('wt','WATER',60,20);await obj('tr','TRAP',16,16);
 window.__lv=(skills,extra)=>{let s=`TITLE T\\nAUTHOR T\\nTHEME t\\nWIDTH 320\\nHEIGHT 200\\nLEMMINGS 4\\nSAVE_REQUIREMENT 1\\n$SKILLSET\\n${skills}$END\\n`;
  for(let i=0;i<2;i++)s+=`$TERRAIN\\n STYLE t\\n PIECE floor\\n X ${i*160}\\n Y 170\\n$END\\n`;
  s+=`$GADGET\\n STYLE t\\n PIECE hatch\\n X 40\\n Y 130\\n$END\\n$GADGET\\n STYLE t\\n PIECE exit\\n X 290\\n Y 150\\n$END\\n`+(extra||'');
  return {path:'levels/P/a.nxlv',pack:'P',name:'a',read:async()=>te(s),dir:'levels/P',file:'a.nxlv'};};
 return 1;}'''
async def main():
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        await pg.evaluate(SETUP);ok=True
        def chk(n,c,i=''):
            nonlocal ok;print(('PASS ' if c else 'FAIL ')+n+(' '+str(i) if not c else ''));ok=ok and bool(c)
        a=await pg.evaluate("""async()=>{const m=await __IMP.impConvert(__lv(' CLIMBER 1\\n SWIMMER 2\\n DISARMER 1\\n WALKER 3\\n'),'goblin');const d=__GS.toDef(m);const w=new __GS.World(d,{quiet:true,sides:[{race:'goblin',clan:0}]});
          return {swap:m.swap,skills:m.skills,rep:m.report,panel:w.pl[0].panel,cnt:w.pl[0].skills}}""")
        chk('three new skills take spare slots',a['swap'] and set(a['swap'].values())=={'swim','disarm','walkr'},a)
        chk('panel and counts follow',all(k in a['panel'] for k in ['swim','disarm','walkr']) and a['cnt']['swim']==2 and a['cnt']['disarm']==1 and a['cnt']['walkr']==3,a)
        chk('no skill removed message',not any('removed' in x for x in a['rep']),a['rep'])
        r=await pg.evaluate("""async()=>{const m=await __IMP.impConvert(__lv(' SWIMMER 2\\n DISARMER 2\\n WALKER 2\\n',`$GADGET\\n STYLE t\\n PIECE wt\\n X 140\\n Y 160\\n$END\\n$GADGET\\n STYLE t\\n PIECE tr\\n X 250\\n Y 154\\n$END\\n`),'goblin'),d=__GS.toDef(m);
          const out={};const mk=()=>{const w=new __GS.World(d,{quiet:true,sides:[{race:'goblin',clan:0}]});for(let i=0;i<60;i++)w.step();return w;};
          const pool=m.objs.find(o=>o.k==='pool'),jaw=m.objs.find(o=>o.k==='jaws');out.objs=m.objs.map(o=>o.k);
          // water: swimmer lives, plain walker drowns
          for(const sw of [0,1]){const w=mk(),p=w.pl[0],g=w.gobs.find(q=>w.alive(q));if(sw){p.skills.swim=1;out['assign_swim']=w.assign(g,'swim',p);}const sf=w.surf(pool.x+20,pool.y+4);g.x=pool.x+20;g.y=sf.y+8;g.s='fall';g.fallen=0;for(let i=0;i<30;i++)w.step();out['water_'+sw]=[g.s,w.alive(g)];}
          // jaws: disarmed walker survives
          for(const dis of [0,1]){const w=mk(),p=w.pl[0],g=w.gobs.find(q=>w.alive(q));if(dis){p.skills.disarm=1;out.assign_disarm=w.assign(g,'disarm',p);}g.x=jaw.x;g.y=jaw.y;g.s='walk';for(let i=0;i<20;i++)w.step();out['jaws_'+dis]=[g.s,w.alive(g)];}
          // walker cancels a dig
          {const w=mk(),p=w.pl[0],g=w.gobs.find(q=>w.alive(q));g.s='dig';g.t=0;p.skills.walkr=1;out.assign_walk=w.assign(g,'walkr',p);out.walk=g.s;}
          return out}""")
        chk('swimmer assigned',r['assign_swim']==True,r)
        chk('plain troop drowns, swimmer survives',(not r['water_0'][1]) and r['water_1'][1],r)
        chk('jaws kill a plain troop, not a disarmed one',(not r['jaws_0'][1]) and r['jaws_1'][1],r)
        chk('walker stops a dig',r['assign_walk']==True and r['walk']=='walk',r)
        print('errs',errs[:3]);await b.close();print('ALL PASS' if ok else 'SOME FAILED')
asyncio.run(main())
