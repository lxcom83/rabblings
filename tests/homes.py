import asyncio,json,base64
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
SHEET='''()=>{const G=__GS,R=G.RACES,K=Object.keys(R);const c=document.createElement('canvas');c.width=64*8*4;c.height=64*2*4;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#2a2438';x.fillRect(0,0,c.width,c.height);K.forEach((k,i)=>[0,1].forEach(j=>{const A=clanArt(R[k].clans[j]);x.drawImage(A.hut,0,0,52,46,(i*64+6)*4,(j*64+12)*4,208,184);}));return c.toDataURL();}'''
VINE='''()=>{const G=__GS,out=[];
 for(const [name,walkDir] of [['from behind',-1],['from the front',1]]){G.setSides([{race:'shroom',clan:0},{race:'goblin',clan:1}]);
  const m=blankMap('puzzle');m.objs=[{k:'hatch',x:60,y:150,dir:1},{k:'door',x:600,y:220}];m.n=2;m.rate=99;m.time=300;
  const w=new G.World(G.toDef(m),{quiet:true});let n=0;while(w.gobs.length<2&&n++<2000)w.step();
  const [a,b]=w.gobs;for(const g of [a,b]){g.s='walk';g.y=g.py=220;g.fallen=0;}
  a.x=a.px=200;a.dir=1;const P=w.pl[0];P.skills.vine=9;w.setS(a,'grow');a.vx0=a.x;a.vy0=a.y;a.steps=0;
  for(let i=0;i<260;i++)w.step();
  b.x=b.px=walkDir<0?260:150;b.dir=walkDir;b.y=b.py=220;w.setS(b,'walk');
  const st=[];for(let i=0;i<300;i++){w.step();if(i%50==0)st.push([b.x,b.y,b.dir,b.s]);}
  out.push({name,steps:a.steps,end:[b.x,b.y,b.dir,b.s],st});}
 return out;}'''
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(600)
        d=await pg.evaluate(SHEET);open('homes.png','wb').write(base64.b64decode(d.split(',')[1]))
        print(json.dumps(await pg.evaluate(VINE)));print('errs',errs[:3]);await b.close()
asyncio.run(main())
