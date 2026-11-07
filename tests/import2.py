import asyncio,json,os,sys
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
# synthetic NeoLemmix styles and levels, built in the page: no real NeoLemmix files needed
SETUP='''async()=>{const I=__IMP,F=I.ImpFiles;F.styles={};F.levels=[];F.nxmi={};F.plist=null;
 const png=(w,h,fn)=>new Promise(r=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x,w,h);c.toBlob(async b=>r(new Uint8Array(await b.arrayBuffer())),'image/png');});
 const put=(k,b)=>{F.styles[k]=async()=>b;},te=s=>new TextEncoder().encode(s);
 put('t/terrain/block.png',await png(16,16,(x,w,h)=>{x.fillStyle='#8a6';x.fillRect(0,0,w,h);}));
 put('t/terrain/steelblk.png',await png(16,16,(x,w,h)=>{x.fillStyle='#99a';x.fillRect(0,0,w,h);}));put('t/terrain/steelblk.nxmt',te('STEEL\\n'));
 put('t/terrain/nine.png',await png(12,12,(x,w,h)=>{x.fillStyle='#a86';x.fillRect(0,0,w,h);}));put('t/terrain/nine.nxmt',te('NINE_SLICE_LEFT 4\\nNINE_SLICE_RIGHT 4\\nNINE_SLICE_TOP 4\\nNINE_SLICE_BOTTOM 4\\n'));
 put('t/terrain/hole.png',await png(4,4,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);}));
 const obj=async(n,fx,w,h,extra)=>{put('t/objects/'+n+'.png',await png(w,h,(x)=>{x.fillStyle='#c33';x.fillRect(0,0,w,h);}));put('t/objects/'+n+'.nxmo',te('EFFECT '+fx+'\\nTRIGGER_X 0\\nTRIGGER_Y 0\\nTRIGGER_WIDTH '+w+'\\nTRIGGER_HEIGHT '+h+'\\n'+(extra||'')));};
 await obj('hatch','ENTRANCE',20,12);await obj('exit','EXIT',20,20);await obj('pick','PICKUPSKILL',10,10);
 window.__mk=(name,text,pack,dir)=>({path:(dir||('levels/'+(pack||'Pk')))+'/'+name+'.nxlv',pack:pack||'Pk',name,read:async()=>te(text),dir:(dir||('levels/'+(pack||'Pk'))),file:name+'.nxlv'});
 window.__base=(extra)=>`TITLE Test One
AUTHOR Tester
THEME t
WIDTH 320
HEIGHT 160
LEMMINGS 20
SAVE_REQUIREMENT 10
`+(extra||'')+`$TERRAIN
 STYLE t
 PIECE block
 X 0
 Y 120
$END
$TERRAIN
 STYLE t
 PIECE block
 X 16
 Y 120
$END
$GADGET
 STYLE t
 PIECE hatch
 X 20
 Y 40
$END
$GADGET
 STYLE t
 PIECE exit
 X 100
 Y 100
$END
`;
 return 1;}'''
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        await pg.evaluate(SETUP)
        ok=True
        def chk(name,c,info=''):
            nonlocal ok
            print(('PASS ' if c else 'FAIL ')+name+(' '+str(info) if (not c and info!='') else ''))
            ok=ok and bool(c)
        cv=lambda t,extra='':pg.evaluate("async([t,e])=>{const m=await __IMP.impConvert(__mk('a',__base(t)),'goblin');const c=__GS.cleanMap(JSON.parse(JSON.stringify(m)));const d=__GS.toDef(m);return {m:{n:m.n,need:m.need,rate:m.rate,time:m.time,w:m.w,h:m.h,skills:m.skills,noTime:m.noTime,pre:m.pre,post:m.post,sx:m.screenX,sy:m.screenY,tal:m.tal,hint:m.hint,rep:m.report,objs:m.objs.length},c:{n:c.n,need:c.need,rate:c.rate,time:c.time,w:c.w,h:c.h,skills:c.skills,noTime:c.noTime,pre:c.pre,post:c.post,sx:c.screenX,tal:c.tal},d:{noTime:d.noTime,pre:d.pre,sx:d.screenX,sy:d.screenY,time:d.time}}}",[t,extra])
        # 1 infinite skills and infinite time
        r=await cv("TIME_LIMIT INFINITE\n$SKILLSET\n CLIMBER INFINITE\n DIGGER 120\n BUILDER 5\n$END\n")
        chk('INFINITE skill -> 99',r['m']['skills']['climb']==99,r['m']['skills'])
        chk('count over 99 -> 99',r['m']['skills']['dig']==99,r['m']['skills'])
        chk('plain count kept',r['m']['skills']['build']==5)
        chk('INFINITE time -> noTime flag',r['m']['noTime']==1,r['m'])
        chk('noTime reaches the engine def',r['d']['noTime']==1)
        chk('skills survive load/save (cleanMap)',r['c']['skills']['climb']==99 and r['c']['skills']['build']==5,r['c']['skills'])
        chk('noTime survives cleanMap',r['c']['noTime']==1)
        # no TIME_LIMIT at all is also no limit in NeoLemmix
        r=await cv("")
        chk('missing TIME_LIMIT -> noTime',r['m']['noTime']==1)
        # time limit given: scaled seconds, kept by cleanMap
        r=await cv("TIME_LIMIT 900\n")
        chk('TIME_LIMIT 900 kept through cleanMap',r['c']['time']==r['m']['time'] and r['m']['time']>600,r)
        chk('timed map has no noTime',not r['m']['noTime'])
        # spawn
        r=await cv("RELEASE_RATE 50\n");chk('RELEASE_RATE 50 -> interval 53 -> rate 106',r['m']['rate']==106,r['m']['rate'])
        r=await cv("RELEASE_RATE 99\n");chk('RELEASE_RATE 99 -> fast, clamped to 12',r['m']['rate']==12,r['m']['rate'])
        r=await cv("MAX_SPAWN_INTERVAL 40\n");chk('MAX_SPAWN_INTERVAL 40 -> rate 80',r['m']['rate']==80,r['m']['rate'])
        chk('rate survives cleanMap',r['c']['rate']==r['m']['rate'],r['c'])
        r=await cv("MAX_SPAWN_INTERVAL 102\n");chk('slow spawn (102) survives cleanMap',r['c']['rate']==r['m']['rate'] and r['m']['rate']>80,r)
        # limits
        r=await cv("LEMMINGS 200\nSAVE_REQUIREMENT 150\n");chk('200 lemmings, save 150 survive cleanMap',r['c']['n']==r['m']['n']==200 and r['c']['need']==150,r)
        r=await pg.evaluate("async()=>{const t=__base('').replace('WIDTH 320','WIDTH 1000').replace('HEIGHT 160','HEIGHT 400');const m=await __IMP.impConvert(__mk('big',t),'goblin');const c=__GS.cleanMap(JSON.parse(JSON.stringify(m)));return [m.w,m.h,c.w,c.h]}")
        chk('big level size survives cleanMap',r[0]==r[2] and r[1]==r[3],r)
        # my own maps are still clamped as before
        r=await pg.evaluate("()=>{const m=__GS.genMap({tpl:'climb',type:'auto',traps:0,foes:0,pool:0,theme:'caves',mode:'solo',w:800,h:420,seed:5});m.n=999;m.time=9999;m.skills.dig=99;m.w=9000;const c=__GS.cleanMap(JSON.parse(JSON.stringify(m)));return [c.n,c.time,c.skills.dig,c.w]}")
        chk('own maps still clamped',r==[50,600,50,3200],r)
        # pickup SKILLCOUNT
        r=await pg.evaluate("async()=>{const t=__base('').replace('$GADGET\\n STYLE t\\n PIECE exit','$GADGET\\n STYLE t\\n PIECE pick\\n SKILL DIGGER\\n SKILLCOUNT 3\\n X 60\\n Y 90\\n$END\\n$GADGET\\n STYLE t\\n PIECE exit');const m=await __IMP.impConvert(__mk('pk',t),'goblin');return m.skills.dig}")
        chk('pickup SKILLCOUNT 3 counted',r==3,r)
        r=await pg.evaluate("async()=>{const t=__base('').replace('$GADGET\\n STYLE t\\n PIECE exit','$GADGET\\n STYLE t\\n PIECE pick\\n SKILL DIGGER\\n SKILL_COUNT 2\\n X 60\\n Y 90\\n$END\\n$GADGET\\n STYLE t\\n PIECE exit');const m=await __IMP.impConvert(__mk('pk',t),'goblin');return m.skills.dig}")
        chk('pickup SKILL_COUNT spelling also counted',r==2,r)
        # texts, start, talismans
        r=await cv("START_X 150\nSTART_Y 60\n$PRETEXT\n LINE Welcome to the test.\n LINE Mind the gap!\n$END\n$POSTTEXT\n LINE Well done.\n$END\n$TALISMAN\n TITLE Quick\n COLOR GOLD\n SAVE_REQUIREMENT 20\n TIME_LIMIT 1700\n$END\n")
        chk('pretext lines imported',r['m']['pre']==['WELCOME TO THE TEST.','MIND THE GAP!'],r['m']['pre'])
        chk('posttext lines imported',r['m']['post']==['WELL DONE.'],r['m']['post'])
        chk('pretext survives cleanMap and reaches def',r['c']['pre']==r['m']['pre'] and r['d']['pre']==r['m']['pre'])
        chk('screen start imported',r['m']['sx'] is not None and r['d']['sx']==r['m']['sx'] and r['m']['sy']==r['d']['sy'] and r['c']['sx']==r['m']['sx'],(r['m']['sx'],r['m']['sy']))
        chk('talisman stored',r['m']['tal'] and r['m']['tal'][0]['t']=='QUICK' and r['c']['tal']==r['m']['tal'],r['m']['tal'])
        # 8 line / 40 char limit
        r=await pg.evaluate("async()=>{const L=Array.from({length:12},(_,i)=>' LINE '+'x'.repeat(60)).join('\\n');const m=await __IMP.impConvert(__mk('p8',__base('$PRETEXT\\n'+L+'\\n$END\\n')),'goblin');return [m.pre.length,Math.max(...m.pre.map(s=>s.length))]}")
        chk('text capped to 8 lines x 40 chars',r==[8,40],r)
        # terrain groups, steel, resizable
        r=await pg.evaluate("""async()=>{const t=`TITLE G
THEME t
WIDTH 200
HEIGHT 100
LEMMINGS 5
$TERRAINGROUP
 NAME wall
 $TERRAIN
  STYLE t
  PIECE block
  X 0
  Y 0
 $END
 $TERRAIN
  STYLE t
  PIECE block
  X 16
  Y 0
 $END
$END
$TERRAIN
 STYLE *GROUP
 PIECE wall
 X 10
 Y 80
$END
$TERRAIN
 STYLE t
 PIECE steelblk
 X 100
 Y 80
$END
$TERRAIN
 STYLE t
 PIECE nine
 X 150
 Y 60
 WIDTH 24
 HEIGHT 30
$END
$GADGET
 STYLE t
 PIECE hatch
 X 20
 Y 10
$END
$GADGET
 STYLE t
 PIECE exit
 X 120
 Y 60
$END
`;const m=await __IMP.impConvert(__mk('grp',t),'goblin'),T=new __GS.World(__GS.toDef(m),{quiet:true}).T,sc=m.ops[0][3],ox=m.ops[0][4],oy=m.ops[0][5];
 const at=(x,y)=>T.m[Math.round(y*sc+oy)*T.w+Math.round(x*sc+ox)];return {rep:m.report,grp:[at(12,82),at(40,82),at(11,81),at(45,82)],steel:at(105,85),nineTop:at(160,61),nineMid:at(160,75),nineEdge:at(173,89),nineOut:at(176,75),sc}}""")
        chk('terrain group drawn (two block copies side by side)',r['grp'][0]==1 and r['grp'][1]==1 and r['grp'][3]==0,r)
        chk('steel piece becomes iron',r['steel']==2,r)
        chk('resizable (nine-slice) terrain sized to WIDTH/HEIGHT',r['nineMid']==1 and r['nineEdge']==1 and r['nineOut']==0,r)
        chk('no "pieces could not be found" report',not any('could not be found' in s for s in r['rep']),r['rep'])
        # pre-placed lemming states
        r=await pg.evaluate("""async()=>{const t=__base('').replace(/\\$GADGET\\n STYLE t\\n PIECE hatch\\n X 20\\n Y 40\\n\\$END\\n/,'')+'$LEMMING\\n X 30\\n Y 100\\n CLIMBER\\n FLOATER\\n$END\\n';const m=await __IMP.impConvert(__mk('pl',t),'goblin'),d=__GS.toDef(m),w=new __GS.World(d,{quiet:true});for(let i=0;i<120;i++)w.step();const g=w.gobs[0];return {h:m.objs.filter(o=>o.k==='hatch').map(o=>[o.ghost,o.cl,o.fl]),g:g&&[g.climber,g.flap]}}""")
        chk('placed climber/floater carry their skills',r['h'][0][1]==1 and r['h'][0][2]==1 and r['g']==[1,1],r)
        # no-limit really means no limit in the engine
        r=await pg.evaluate("""async()=>{const m=await __IMP.impConvert(__mk('nt',__base('TIME_LIMIT INFINITE\\n')),'goblin'),w=new __GS.World(__GS.toDef(m),{quiet:true});const t0=w.time;for(let i=0;i<300;i++)w.step();return [t0,w.time,w.over]}""")
        chk('noTime: clock does not run down, level not over',r[0]==r[1] and not r[2],r)
        # pack ordering via levels.nxmi / info.nxmi
        r=await pg.evaluate("""async()=>{const F=__IMP.ImpFiles,te=s=>new TextEncoder().encode(s);F.levels=[];F.nxmi={};F.plist=null;
 const lv=(n,dir)=>{const o=__mk(n,__base('TITLE '+n+'\\n'),'Cool Pack',dir);return o;};
 const L=[lv('zeta','x/levels/Cool Pack/Tricky'),lv('alpha','x/levels/Cool Pack/Tricky'),lv('beta','x/levels/Cool Pack/Easy'),lv('gamma','x/levels/Cool Pack/Easy')];
 for(const l of L)F.note(l.path,l.read,'src');
 F.note('x/levels/Cool Pack/levels.nxmi',async()=>te('$GROUP\\n NAME Gentle start\\n FOLDER Easy\\n$END\\n$GROUP\\n NAME Hard bit\\n FOLDER Tricky\\n$END\\n'));
 F.note('x/levels/Cool Pack/Easy/levels.nxmi',async()=>te('LEVEL gamma.nxlv\\nLEVEL beta.nxlv\\n'));
 F.note('x/levels/Cool Pack/info.nxmi',async()=>te('TITLE The Cool Pack\\nAUTHOR Someone\\nVERSION 1.2\\n'));
 await F.order();const P=F.packs();return {n:P.length,title:P[0].title||P[0].name,by:P[0].by,order:P[0].levels.map(l=>l.name),ranks:P[0].levels.map(l=>l.rank)}}""")
        chk('levels.nxmi order + groups honoured',r['order']==['gamma','beta','alpha','zeta'] and r['ranks'][0]=='Gentle start' and r['ranks'][2]=='Hard bit',r)
        chk('info.nxmi title/author',r['title']=='The Cool Pack' and r['by']=='Someone',r)
        # import all makes an ordered, local-only pack
        r=await pg.evaluate("""async()=>{const G=__GS,I=G.ImportScene;localStorage.clear();G.Store.mem=null;G.PackStore.mem=null;const P=__IMP.ImpFiles.packs()[0];I.pack=P;I.races=['goblin'];I.race=0;I.art=0;I.run(P.levels,P);
 for(let i=0;i<200&&I.view!=='done';i++)await new Promise(r=>setTimeout(r,50));
 const ps=G.PackStore.all();const p=ps[0];const names=G.PackStore.maps(p).map(m=>m.name);let ex=null;try{ex=G.packToFile(p)}catch(e){ex='err'}
 return {np:ps.length,name:p&&p.name,imp:p&&p.imported,names,exported:ex&&JSON.parse(ex).maps.length}}""")
        chk('IMPORT ALL creates an ordered pack',r['np']==1 and r['names']==['GAMMA','BETA','ALPHA','ZETA'] and r['imp']==1,r)
        chk('imported pack exports no maps (local only)',r['exported']==0,r)
        r=await pg.evaluate("""async()=>{const G=__GS,I=G.ImportScene;const P=__IMP.ImpFiles.packs()[0];I.run(P.levels,P);for(let i=0;i<200&&I.view!=='done';i++)await new Promise(r=>setTimeout(r,50));
 return [G.PackStore.all().length,G.Store.all().length]}""")
        chk('re-import updates the same pack',r==[1,4],r)
        chk('no page errors',not errs,errs[:4])
        print('ALL PASS' if ok else 'SOME FAILED');await b.close()
asyncio.run(main())
