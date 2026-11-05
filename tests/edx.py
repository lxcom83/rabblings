import asyncio,json
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
GENT='''()=>{const G=__GS,out=[];let bad=0,total=0,counts={};
 const sizes=[[480,240],[800,300],[1400,420],[2400,600]];
 for(const t of G.TPL)for(const[w,h]of sizes)for(let s=1;s<=12;s++)for(const mode of [t.mode||'solo','free']){if(mode==='free'&&s>3)continue;const m=G.genMap({tpl:t.k,type:'auto',traps:s%4,foes:s%3,pool:s%3,theme:'bog',mode,w,h,seed:s*977});total++;
  const P=mapProblems(m);const T=new Terrain(m.w,m.h,m.theme,7),S=new Shaper(T,7);S.run(m.ops);if(m.mode==='mirror')for(let y=0;y<h;y++)for(let x=0;x<w>>1;x++)T.m[y*w+w-1-x]=T.m[y*w+x];
  const e=[];for(const o of m.objs){if(o.x<0||o.x>=w||o.y<0||o.y>=h)e.push(o.k+' out');if(o.k==='door'&&!(T.solid(o.x,o.y)&&!T.solid(o.x,o.y-6)))e.push('door not on ground');if(['jaws','mine','foe','nest'].includes(o.k)&&!T.solid(o.x,o.y))e.push(o.k+' floats');if(o.k==='hatch'&&T.solid(o.x,o.y))e.push('hatch buried');}
  if(m.objs.filter(o=>o.k==='hatch').length<1)e.push('no hatch');
  if(P.length||e.length){bad++;if(out.length<14)out.push({t:t.k,w,h,s,mode,P:P[0],e:e.slice(0,3)});}
  try{JSON.stringify(cleanMap(JSON.parse(JSON.stringify(m))));new G.World(G.toDef(m),{quiet:true,vs:m.mode!=='solo'});}catch(x){bad++;out.push({t:t.k,err:String(x)});}
  counts[t.k]=(counts[t.k]||0)+m.objs.length;}
 return{total,bad,out,counts};}'''
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(600)
        print('load errs',errs[:3])
        r=await pg.evaluate(GENT);print(json.dumps(r)[:1800]);print('errs',errs[:3]);await b.close()
asyncio.run(main())
