import asyncio,json,sys
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
OUT=sys.argv[1] if len(sys.argv)>1 else '.'
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    ok=True
    def chk(n,c,info=''):
        nonlocal ok
        print(('PASS ' if c else 'FAIL ')+n,info);ok=ok and bool(c)
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':600})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        box=await pg.evaluate("()=>{const r=document.getElementById('game').getBoundingClientRect();return [r.x,r.y,r.width,r.height]}")
        sc=box[2]/480;clip={'x':box[0],'y':box[1],'width':box[2],'height':box[3]}
        ev=lambda e,a=None:pg.evaluate(e,a) if a is not None else pg.evaluate(e)
        async def clk(wx,wy):
            sx,sy=await ev("([a,b])=>[104+(a-__GS.Ed.cx)*__GS.Ed.z,16+(b-__GS.Ed.cy)*__GS.Ed.z]",[wx,wy])
            await pg.mouse.move(box[0]+sx*sc,box[1]+sy*sc);await pg.wait_for_timeout(40);await pg.mouse.down();await pg.wait_for_timeout(20);await pg.mouse.up();await pg.wait_for_timeout(80)
        async def drag(a,b,c,d):
            sx,sy=await ev("([a,b])=>[104+(a-__GS.Ed.cx)*__GS.Ed.z,16+(b-__GS.Ed.cy)*__GS.Ed.z]",[a,b])
            ex,ey=await ev("([a,b])=>[104+(a-__GS.Ed.cx)*__GS.Ed.z,16+(b-__GS.Ed.cy)*__GS.Ed.z]",[c,d])
            await pg.mouse.move(box[0]+sx*sc,box[1]+sy*sc);await pg.wait_for_timeout(40);await pg.mouse.down();await pg.mouse.move(box[0]+(sx+ex)/2*sc,box[1]+(sy+ey)/2*sc,steps=3);await pg.mouse.move(box[0]+ex*sc,box[1]+ey*sc,steps=3);await pg.wait_for_timeout(30);await pg.mouse.up();await pg.wait_for_timeout(80)
        async def key(k,mod):
            await pg.keyboard.down(mod);await pg.wait_for_timeout(50);await pg.keyboard.press(k);await pg.wait_for_timeout(120);await pg.keyboard.up(mod);await pg.wait_for_timeout(60)
        async def shot(n):
            await pg.wait_for_timeout(150);await pg.screenshot(path=OUT+'/'+n,clip=clip)
        await ev("()=>{const G=__GS,m=G.blankMap('puzzle');m.w=800;m.h=300;m.ops=[];G.Ed.open(m);G.setScene(G.Ed);G.Ed.cx=0;G.Ed.cy=60;G.Ed.z=1;}")
        await pg.wait_for_timeout(200)
        ops=lambda:ev("__GS.Ed.map.ops.length")
        mat=lambda x,y:ev(f"__GS.Ed.T.m[{y}*__GS.Ed.T.w+{x}]")
        # 1 snap on: piece lands on the grid
        await ev("()=>{const E=__GS.Ed;E.snapOn=true;E.step=24;E.piece='sbig';E.tool='piece';E.prot=0;E.pflip=0;}")
        await clk(205,97)
        op=await ev("__GS.Ed.map.ops[__GS.Ed.map.ops.length-1]")
        chk('snap on: piece op',op and op[0]=='P' and op[2]%24==0 and op[3]%24==0,op)
        chk('steel stamps iron',await mat(op[2]+10,op[3]+10)==2)
        # 2 snap off: free placement, centred on the cursor
        await ev("()=>{__GS.Ed.snapOn=false;}")
        await clk(301,101)
        op2=await ev("__GS.Ed.map.ops[__GS.Ed.map.ops.length-1]")
        chk('snap off: free coordinates',op2[2]==277 and op2[3]==77,op2)
        # 3 alt flips snap
        await pg.keyboard.down('Alt');await pg.wait_for_timeout(60)
        await clk(301,201)
        await pg.keyboard.up('Alt')
        op3=await ev("__GS.Ed.map.ops[__GS.Ed.map.ops.length-1]")
        chk('alt inverts snap',op3[2]%24==0 and op3[3]%24==0,op3)
        # 4 dirt piece + rotate/flip
        await ev("()=>{const E=__GS.Ed;E.snapOn=true;E.piece='aq';E.tool='piece';E.prot=0;E.pflip=0;}")
        await pg.keyboard.press('r');await pg.wait_for_timeout(90)
        chk('R rotates',await ev("__GS.Ed.prot")==1)
        await ev("()=>{__GS.Ed.prot=0;}")
        await pg.keyboard.press('f');await pg.wait_for_timeout(90);chk('F flips',await ev("__GS.Ed.pflip")==1)
        await ev("()=>{__GS.Ed.pflip=0;}")
        await pg.keyboard.press('g');await pg.wait_for_timeout(90);chk('G toggles snap',await ev("__GS.Ed.snapOn")==False)
        await pg.keyboard.press('g');await pg.wait_for_timeout(90)
        await key('g','Shift');await pg.wait_for_timeout(90);chk('Shift+G changes step',await ev("__GS.Ed.step")!=24)
        for i in range(4):
            await key('g','Shift');await pg.wait_for_timeout(90)
        chk('step cycles back',await ev("__GS.Ed.step")==24)
        n0=await ops();await clk(120,230);op=await ev("__GS.Ed.map.ops[__GS.Ed.map.ops.length-1]")
        chk('aqueduct dirt + arch is open',await mat(op[2]+24,op[3]+5)==1 and await mat(op[2]+24,op[3]+50)==0,op)
        # 5 one way paint
        await ev("()=>{const E=__GS.Ed;E.mat=5;E.size=7;E.tool='paint';}")
        await drag(20,160,80,160)
        chk('one-way paint (type 5)',await mat(50,160)==5)
        await ev("()=>{__GS.Ed.mat=4;}");await drag(20,200,80,200);chk('one-way left (type 4)',await mat(50,200)==4)
        await ev("()=>{__GS.Ed.mat=6;}");await drag(20,240,80,240);chk('one-way down (type 6)',await mat(50,240)==6)
        # 6 box snaps
        await ev("()=>{const E=__GS.Ed;E.mat=1;E.tool='box';E.snapOn=true;}")
        await drag(203,153,275,205)
        op=await ev("__GS.Ed.map.ops[__GS.Ed.map.ops.length-1]")
        chk('box snaps',op[0]=='B' and op[2]%24==0 and op[3]%24==0 and op[4]%24==0 and op[5]%24==0,op)
        # 7 object snap
        await ev("()=>{const E=__GS.Ed;E.tool='place';E.obj='door';}")
        await clk(333,150)
        o=await ev("__GS.Ed.map.objs[__GS.Ed.map.objs.length-1]")
        chk('object snaps x',o['k']=='door' and o['x']%24==0,o)
        await ev("()=>{const E=__GS.Ed;E.snapOn=false;}");await clk(334,150)
        o=await ev("__GS.Ed.map.objs[__GS.Ed.map.objs.length-1]");chk('object free x',o['x']==334,o)
        await ev("()=>{__GS.Ed.snapOn=true;}")
        # 8 region copy / paste / dup
        await ev("()=>{const E=__GS.Ed;E.tool='region';E.sel=null;E.snapOn=true;}")
        await drag(190,70,242,122)
        reg=await ev("__GS.Ed.reg");chk('region selected',reg and reg['w']==48 and reg['h']==48,reg)
        await key('c','Control');await pg.wait_for_timeout(120)
        chk('copied region',await ev("__GS.Ed.clip&&__GS.Ed.clip.t")=='reg')
        await key('v','Control');await pg.wait_for_timeout(120)
        chk('paste tool',await ev("__GS.Ed.tool")=='paste')
        n0=await ops();await clk(300,60)
        op=await ev("__GS.Ed.map.ops[__GS.Ed.map.ops.length-1]")
        chk('paste op',op[0]=='C' and (await ops())==n0+1,op)
        chk('pasted steel copied',await mat(op[5]+10,op[6]+10)==2)
        await ev("()=>{const E=__GS.Ed;E.tool='region';E.reg={x:192,y:72,w:48,h:48};}")
        n0=await ops();await ev("__GS.Ed.dupReg(1,0)");chk('duplicate right',(await ops())==n0+1 and await ev("__GS.Ed.reg.x")==240)
        # 9 undo
        for i in range(3): await ev("__GS.Ed.undo()")
        chk('undo removes ops',(await ops())<n0+1)
        # 10 copy object, nudge, numeric
        await ev("()=>{const E=__GS.Ed;E.tool='move';E.sel=E.map.objs[0];}")
        x0=await ev("__GS.Ed.sel.x");await pg.keyboard.press('ArrowRight');await pg.wait_for_timeout(80)
        x1=await ev("__GS.Ed.sel.x");chk('nudge by grid step',x1-x0==24,[x0,x1])
        await ev("()=>{__GS.Ed.snapOn=false;}");await pg.keyboard.press('ArrowRight');await pg.wait_for_timeout(80)
        chk('nudge by 1px when free',await ev("__GS.Ed.sel.x")-x1==1)
        no=await ev("__GS.Ed.map.objs.length");await key('c','Control');await key('v','Control');await pg.wait_for_timeout(80)
        chk('copy/paste object',await ev("__GS.Ed.map.objs.length")==no+1)
        no=await ev("__GS.Ed.map.objs.length");await ev("__GS.Ed.dupObj(0,1)");chk('duplicate object down',await ev("__GS.Ed.map.objs.length")==no+1)
        # 11 skills
        await ev("__GS.Ed.randSkills(__GS.Ed.map.skills)");chk('randomize skills',await ev("Object.values(__GS.Ed.map.skills).some(v=>v>0)"))
        # 12 save + reload keeps pieces
        r=await ev("(()=>{const m=__GS.Ed.map,c=__GS.cleanMap(JSON.parse(JSON.stringify(m)));return [m.ops.filter(o=>o[0]=='P'||o[0]=='C').length,c.ops.filter(o=>o[0]=='P'||o[0]=='C').length,c.ops.length==m.ops.length]})()")
        chk('cleanMap keeps pieces + copies',r[0]>0 and r[0]==r[1] and r[2],r)
        pr=await ev("(async()=>{const m=__GS.Ed.map,c=await __GS.packMap(m),u=await __GS.unpackMap(c);return [u.ops.length==m.ops.length,JSON.stringify(u.ops)==JSON.stringify(m.ops)]})()")
        chk('share code round trip',pr[0] and pr[1],pr)
        # 13 piece image
        img=await ev("(()=>{const c=pieceCanvas('aq',0,0,'bog');return [c.width,c.height]})()");chk('piece image',img==[48,64])
        # 14 mirror
        await ev("()=>{const G=__GS,m=G.blankMap('battle');m.ops=[];G.Ed.open(m);G.setScene(G.Ed);const E=G.Ed;E.cx=0;E.cy=0;E.snapOn=true;E.piece='s24';E.prot=0;E.pflip=0;}")
        mw=await ev("__GS.Ed.map.w")
        await ev("()=>{__GS.Ed.tool='piece';__GS.Ed.cx=500;}");await clk(mw-120,100)
        op=await ev("__GS.Ed.map.ops[__GS.Ed.map.ops.length-1]");chk('mirror: right half piece stored on the left',op[2]<mw/2,[op,mw])
        chk('mirror: both sides solid',await mat(op[2]+5,op[3]+5)==2 and await mat(mw-1-(op[2]+5),op[3]+5)==2)
        # 15 one-way mirror swaps
        await ev("()=>{const E=__GS.Ed;E.cx=0;E.mat=5;E.tool='box';E.snapOn=true;}");await drag(48,24,96,72)
        chk('mirror: one-way arrows swap',await mat(60,40)==5 and await mat(mw-1-60,40)==4)
        # screenshot scene: aqueduct build
        await ev("()=>{const G=__GS,m=G.blankMap('puzzle');m.w=640;m.h=300;m.theme='mine';m.ops=[['B',1,0,252,640,48]];G.Ed.open(m);G.setScene(G.Ed);const E=G.Ed;E.cx=0;E.cy=76;E.z=1;E.group='pieces';E.pcat='aq';E.piece='aqe';E.tool='piece';E.snapOn=true;E.grid=1;}")
        await pg.wait_for_timeout(150)
        for (pid,fl,x) in [('aqe',0,24),('aq',0,72),('aq',0,120),('aqt',0,168),('aq',0,216),('aqd',0,264),('aqe',1,312)]:
            await ev(f"()=>{{const E=__GS.Ed;E.piece='{pid}';E.pflip={fl};}}")
            b2=await ev(f"(()=>{{const b=buildPiece('{pid}',0,{fl});return [b.w,b.h]}})()")
            await clk(x+b2[0]/2,252-b2[1]/2)
        await ev("()=>{const E=__GS.Ed;E.piece='sbm2';E.pflip=0;}");await clk(60,150)
        await ev("()=>{const E=__GS.Ed;E.piece='wcr';}");await clk(240,100)
        await ev("()=>{const E=__GS.Ed;E.piece='b24';}");await clk(340,228)
        await ev("()=>{const E=__GS.Ed;E.piece='s48';}");await clk(60,228)
        await ev("()=>{const E=__GS.Ed;E.piece='aqs';E.pcat='aq';}")
        await shot('ed2-aqueduct.png')
        await ev("()=>{__GS.Ed.group='terrain';__GS.Ed.tool='paint';}");await shot('ed2-terrain-menu.png')
        await ev("()=>{const E=__GS.Ed;E.group='pieces';E.pcat='steel';E.tool='piece';E.piece='s24';}");await shot('ed2-steel.png')
        chk('no js errors',not errs,errs[:3])
        await b.close()
    print('ALL PASS' if ok else 'SOME FAILED')
asyncio.run(main())
