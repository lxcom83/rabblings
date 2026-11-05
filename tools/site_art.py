#!/usr/bin/env python3
"""Exports the logo, sprites, homes, backdrops and screenshots the website uses, straight from the game.
Run from the repo root after build.py. Needs Python Playwright with Chromium."""
import asyncio, base64, json
from playwright.async_api import async_playwright
ART = '''()=>{const G=__GS,R=G.RACES,K=Object.keys(R),out={},png=c=>c.toDataURL('image/png');out.logo=png(LOGO);
 const races=[];for(const k of K){const r=R[k],pan=Object.values(r.swap||{});const rows=[];r.clans.forEach((cl,i)=>{const A=clanArt(cl),[c,x]=mk(CELL*8,CELL);x.drawImage(A.sheet,0,ROW.walk*2*CELL,CELL*8,CELL,0,0,CELL*8,CELL);out['walk-'+k+'-'+i]=png(c);out['home-'+k+'-'+i]=png(A.hut);rows.push({name:cl.name,perk:cl.perkT,ui:cl.ui||'#fff'});});
  const [b,bx]=mk(VW,VIEWH);drawBackdrop(bx,backdrop(r.world),0,VW,0,0,0);out['bg-'+k]=png(b);
  races.push({k,n:r.n,like:r.like,good:r.good,bad:r.bad,home:r.home,clans:rows,skills:pan.map(s=>({n:SKX[s][0],d:SKX[s][1]}))});}
 out.races=races;return out;}'''
SHOT = '''async k=>{const G=__GS,d=k==='goblin'?G.LEVELS[0]:G.RACE_LEVELS[k][0];G.setSides([{race:k,clan:0},{race:'goblin',clan:1}]);G.Play.begin(d,null);G.setScene(G.Play);const w=G.Play.world,p=w.pl[0];p.bot=d.plan||[];for(let i=0;i<620&&!w.over;i++)w.step();await new Promise(r=>setTimeout(r,4200));const L=w.gobs.filter(g=>w.alive(g)&&g.s!=='home');if(L.length){const a=L.map(g=>g.x).sort((x,y)=>x-y)[L.length>>1],b=L.map(g=>g.y).sort((x,y)=>x-y)[L.length>>1];p.camX=Math.max(0,a-240);p.cx=a;p.camY=Math.max(0,b-120);p.cy=b;}await new Promise(r=>setTimeout(r,180));return document.getElementById('game').toDataURL('image/png');}'''
def save(name, url):
    open('site/img/' + name + '.png', 'wb').write(base64.b64decode(url.split(',')[1]))
async def main():
    open('run.html', 'w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>' + open('build/rabblings-all.html').read() + '</body></html>')
    import os
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 960, 'height': 540})
        await pg.goto('file://' + os.getcwd() + '/run.html'); await pg.wait_for_timeout(600)
        d = await pg.evaluate(ART); races = d.pop('races')
        for k, v in d.items(): save(k, v)
        open('site/races.js', 'w').write('window.RACE_DATA=' + json.dumps(races, separators=(',', ':')) + ';\n')
        for r in races:
            pg2 = await b.new_page(viewport={'width': 960, 'height': 540})
            await pg2.goto('file://' + os.getcwd() + '/run.html'); await pg2.wait_for_timeout(400)
            save('shot-' + r['k'], await pg2.evaluate(SHOT, r['k'])); await pg2.close(); print(r['k'])
        await b.close()
    os.remove('run.html')
asyncio.run(main())
