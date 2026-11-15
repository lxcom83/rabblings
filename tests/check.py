# Runs the shared map checker (maps/check.js) over built-in maps. usage: check.py [free|camp|all]  (default free)
# Exit 1 if any Free Play map has a 'bad' line. Campaign lines are a report until those maps are rebuilt.
import asyncio,sys,os
from playwright.async_api import async_playwright
JS='''(which)=>{const G=__GS,L=[];if(which!=='camp')for(const l of G.FREE_MAPS)L.push(['free '+l.id,l,l.races[0]]);if(which!=='free')for(const k in G.RACE_LEVELS)G.RACE_LEVELS[k].forEach((l,i)=>L.push([k+' '+(i+1),l,k]));
 return L.map(([tag,l,race])=>{let r;try{r=mapCheck(l,{race});}catch(e){r=[{lv:'bad',t:'checker error '+e.message}];}return {tag,name:l.name,r};})}'''
async def main():
    which=sys.argv[1] if len(sys.argv)>1 else 'free'
    open('run.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page();await pg.goto('file://'+os.getcwd()+'/run.html');await pg.wait_for_timeout(500)
        bad=warn=0;fb=0
        for m in await pg.evaluate(JS,which):
            for a in m['r']:
                print('%-5s %-10s %-22s %s'%(a['lv'].upper(),m['tag'],m['name'],a['t']))
                if a['lv']=='bad':
                    bad+=1
                    if m['tag'].startswith('free'):fb+=1
                else:warn+=1
        print('bad',bad,'warn',warn);await b.close()
        if fb:sys.exit(1)
asyncio.run(main())
