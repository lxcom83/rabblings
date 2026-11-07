# random skill play on every level, race and generated map: looks for crashes, bad numbers and missions that never end
import asyncio,json,os
from playwright.async_api import async_playwright
JS='''(cfg)=>{const G=__GS,out={runs:0,bad:[],ticks:0,over:0,started:performance.now()};const R=Object.keys(G.RACES);let seed=cfg.seed;const rnd=()=>{seed=(seed*1664525+1013904223)|0;return((seed>>>8)&0xffffff)/0xffffff;};
 const levels=[];G.LEVELS.forEach(l=>levels.push(['L',l,0]));G.WAR_LEVELS.forEach(l=>levels.push(['W',l,0]));for(const k in G.RACE_LEVELS)G.RACE_LEVELS[k].forEach(l=>levels.push(['R'+k,l,0]));G.ARENAS.forEach(l=>levels.push(['A',l,1]));
 for(const ty of G.GEN.map(g=>g[0]))for(const mode of ['solo','mirror','free']){const m=G.genMap({tpl:G.TPL[rnd()*G.TPL.length|0].k,type:ty,traps:2,foes:2,mach:2,pool:1,theme:'forge',mode,w:800,h:300,seed:seed&65535});levels.push(['G'+ty+mode,G.toDef(m),mode==='solo'?0:1]);}
 const check=(w,tag)=>{for(const g of w.gobs){for(const k of ['x','y'])if(!Number.isFinite(g[k]))return tag+' gob '+k+' '+g[k]+' state '+g.s;}for(const m of w.mobs||[])if(!m.dead&&(!Number.isFinite(m.x)||!Number.isFinite(m.y)))return tag+' mob NaN '+m.k;for(const p of w.pl){if(!Number.isFinite(p.mood))return tag+' mood '+p.mood;for(const k in p.skills)if(p.skills[k]<0)return tag+' negative skill '+k;}return null;};
 for(const[tag,l,vs]of levels)for(let rep=0;rep<cfg.reps;rep++){const a=R[rnd()*R.length|0],b=R[rnd()*R.length|0];G.setSides([{race:a,clan:0},{race:b,clan:b===a?1:0}]);const t=tag+'/'+l.name+'/'+a+'/'+b;try{const w=new G.World(l,{quiet:true,vs:!!vs,diff:rnd()*4|0,classic:rnd()<.2});if(!vs&&!w.classic){w.pl[0].spells=Object.keys(SPELLS);}let n=0;const maxT=l.time*25*1.5+400;while(!w.over&&n<maxT+200){w.step();n++;if(n%7===0)for(const p of w.pl){const L=w.gobs.filter(g=>g.team===p.id&&w.alive(g));if(L.length){const g=L[rnd()*L.length|0],sk=p.panel[rnd()*p.panel.length|0];w.assign(g,sk,p);}if(rnd()<.06&&p.spells.length){p.mana=3;p.grog=9;w.cast(p,p.spells[rnd()*p.spells.length|0],rnd()*l.w|0,rnd()*l.h|0);}if(rnd()<.02&&vs&&w.trick&&!l.noTricks)try{w.trick(p,rnd()*3|0,rnd()*l.w|0,rnd()*l.h|0);}catch(e){throw new Error('trick '+e.message);}}if(n%50===0){const e=check(w,t);if(e){out.bad.push(e);break;}}}out.runs++;out.ticks+=n;if(w.over)out.over++;else out.bad.push(t+' never ended after '+n+' ticks, time left '+w.time);}catch(e){out.bad.push(t+' CRASH '+e.message+' @ '+String(e.stack).split('\\n').slice(1,3).join(' ').slice(0,170));}if(performance.now()-out.started>cfg.ms)return out;}
 return out;}'''
async def main():
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>'+open('build/rabblings-all.html').read()+'</body></html>')
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        for seed in [7,99]:
            r=await pg.evaluate(JS,{'seed':seed,'reps':2,'ms':130000});r['bad']=sorted(set(x.split('/')[0]+' '+x.split(' ',1)[-1][:150] for x in r['bad']))[:14] if r['bad'] else [];print(json.dumps(r)[:1800])
        print('errs',errs[:3]);await b.close()
asyncio.run(main())
