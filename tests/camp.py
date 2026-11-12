# Campaign level check. usage: camp.py race [from to]   e.g. camp.py goblin 1 8
# For each level: the stored solution on easy, normal and hard, doing nothing on easy, and the shared map checker.
import asyncio,sys,os
from playwright.async_api import async_playwright
JS='''([race,a,b])=>{const G=__GS,L=G.RACE_LEVELS[race],o=[];for(let i=a-1;i<Math.min(b,L.length);i++){const l=L[i],s=[{race,clan:0},{race:'goblin',clan:1}],run=(bot,diff)=>{G.setSides(s);const w=new G.World(l,{quiet:true,sides:s,diff});w.pl[0].bot=bot;let n=0;while(!w.over&&n++<30000)w.step();const gd=l.goal&&l.goal!=='home';return [w.pl[0].saved,w.need,gd?(w.won?1:0):(w.pl[0].saved>=w.need?1:0)];};
 const plan=[0,1,2].map(d=>run((l.plan||[]).map(x=>({...x})),d)),idle=run([],0);let chk=[];try{chk=mapCheck(l,{race});}catch(e){chk=[{lv:'bad',t:'checker error '+e.message}];}o.push({i:i+1,name:l.name,plan,idle,chk});}return o}'''
async def main():
    race=sys.argv[1];a=int(sys.argv[2]) if len(sys.argv)>2 else 1;b=int(sys.argv[3]) if len(sys.argv)>3 else 99
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        br=await p.chromium.launch();pg=await br.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        fail=0
        for m in await pg.evaluate(JS,[race,a,b]):
            ok=all(p[2] for p in m['plan']);bad=[c['t'] for c in m['chk'] if c['lv']=='bad'];warn=[c['t'] for c in m['chk'] if c['lv']=='warn']
            if not ok or bad:fail+=1
            print('%2d %-18s %s  plan e/n/h %s  idle %d/%d%s'%(m['i'],m['name'],'PASS' if ok and not bad else 'FAIL',' '.join('%d/%d'%(p[0],p[1]) for p in m['plan']),m['idle'][0],m['idle'][1],''.join('\n     BAD  '+t for t in bad)+''.join('\n     warn '+t for t in warn)))
        print('errs',errs[:3],'failing',fail);await br.close()
        if fail or errs:sys.exit(1)
asyncio.run(main())
