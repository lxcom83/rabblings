import asyncio,os
from playwright.async_api import async_playwright
ok=True
def chk(n,c):
    global ok;print(('PASS ' if c else 'FAIL ')+n);ok=ok and bool(c)
async def main():
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("window.__pad=null;navigator.getGamepads=()=>[window.__pad];")
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        ev=pg.evaluate
        # device list conflicts
        r=await ev("()=>{const G=__GS;return [G.ctlList('mk','auto'),G.ctlList('kbB','auto'),G.ctlList(null,'auto')]}")
        chk('mk blocks WASD and mk for the other player',all(x not in r[0] for x in ['mk','kbA']) and 'kbB' in r[0])
        chk('arrows taken removes arrows only','kbB' not in r[1] and 'kbA' in r[1])
        chk('no pad listed when none plugged in',not any(x.startswith('pad') for x in r[2]))
        await ev("()=>{window.__pad={index:0,id:'t',connected:true,axes:[0,0],buttons:Array.from({length:17},()=>({pressed:false}))}}")
        await pg.wait_for_timeout(400)
        r=await ev("()=>__GS.ctlList(null,'auto')")
        chk('plugged-in pad is offered','pad0' in r)
        async def start(c0,c1,vs=True):
            await ev("([a,b,vs])=>{const G=__GS;G.CTL[0]=a;G.CTL[1]=b;G.setSides();G.Play.begin(G.ARENAS[0],vs?{cpu:false,i:0,wins:[0,0],draws:0,sides:[{race:'goblin',clan:0},{race:'goblin',clan:1}]}:null,{});G.setScene(G.Play);}",[c0,c1,vs])
            await pg.wait_for_timeout(800)
        pos=lambda i:ev("(i)=>{const p=__GS.Play.world.pl[i];return [p.cx|0,p.cy|0]}",i)
        # P1 arrows only: WASD must not move P1, arrows must
        await start('kbB','auto',False)
        a=await pos(0);await pg.keyboard.down('KeyD');await pg.wait_for_timeout(500);await pg.keyboard.up('KeyD');b1=await pos(0)
        chk('kbB ignores WASD',a==b1)
        await pg.keyboard.down('ArrowRight');await pg.wait_for_timeout(500);await pg.keyboard.up('ArrowRight');b2=await pos(0)
        chk('kbB moves with arrows',b2[0]>b1[0]+10)
        # mouse ignored for kbB
        await pg.mouse.move(300,200);await pg.wait_for_timeout(200);c=await pos(0);
        await pg.mouse.move(700,250);await pg.wait_for_timeout(300);d=await pos(0)
        chk('kbB ignores the mouse',c==d)
        # mk: mouse works, arrows ignored
        await start('mk','auto',False)
        a=await pos(0);await pg.keyboard.down('ArrowRight');await pg.wait_for_timeout(400);await pg.keyboard.up('ArrowRight');b1=await pos(0)
        chk('mk ignores arrows',a==b1)
        await pg.mouse.move(300,200);await pg.wait_for_timeout(100);await pg.mouse.move(500,260);await pg.wait_for_timeout(300);d=await pos(0)
        chk('mk follows the mouse',d!=b1)
        # two players: P1 mouse+keys, P2 pad
        await start('mk','pad0',True)
        a2=await pos(1)
        await ev("()=>{window.__pad.axes=[1,0]}");await pg.wait_for_timeout(600);await ev("()=>{window.__pad.axes=[0,0]}")
        b2=await pos(1);chk('pad drives player 2',b2[0]>a2[0]+10)
        a1=await pos(0);await pg.keyboard.down('ArrowRight');await pg.wait_for_timeout(400);await pg.keyboard.up('ArrowRight');chk('arrows do not move P1 (mk)',await pos(0)==a1)
        a2=await pos(1);await pg.keyboard.down('KeyD');await pg.wait_for_timeout(400);await pg.keyboard.up('KeyD');chk('WASD does not move pad player',await pos(1)==a2)
        # mouse over the right half must not move P2 (pad player)
        a2=await pos(1);await pg.mouse.move(700,200);await pg.wait_for_timeout(100);await pg.mouse.move(760,260);await pg.wait_for_timeout(300);chk('mouse over P2 half ignored',await pos(1)==a2)
        # reset
        await ev("()=>{__GS.CTL[0]='auto';__GS.CTL[1]='auto'}")
        chk('no page errors',not errs)
        print(errs);await b.close()
    os.remove('run.html');print('ALL PASS' if ok else 'SOME FAILED')
asyncio.run(main())
