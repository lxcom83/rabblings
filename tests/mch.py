import asyncio,json
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
JS='''()=>{const G=__GS;let total=0,bad=0;const out=[],c={};
 for(const t of G.TPL)for(const[w,h]of [[480,240],[800,300],[1400,420],[3200,600]])for(let s=1;s<=10;s++)for(const mode of ['solo','mirror','free']){if(mode==='free'&&s>3)continue;total++;const m=G.genMap({tpl:t.k,type:'auto',traps:s%4,foes:s%3,mach:1+s%3,pool:s%3,theme:'bog',mode,w,h,seed:s*431});const P=mapProblems(m),T=new Terrain(w,h,m.theme,7),S=new Shaper(T,7);S.run(m.ops);if(m.mode==='mirror')for(let y=0;y<h;y++)for(let x=0;x<w>>1;x++)T.m[y*w+w-1-x]=T.m[y*w+x];const e=[];
  for(const o of m.objs)if(GEN_KINDS.mch.includes(o.k)){c[o.k]=(c[o.k]||0)+1;if(!T.solid(o.x,o.y)||T.solid(o.x,o.y-8))e.push(o.k+' bad ground');}
  if(P.length||e.length){bad++;if(out.length<8)out.push({t:t.k,w,h,mode,s,P:P[0],e:e[0]});}
  try{const W=new G.World(G.toDef(m),{quiet:true,vs:m.mode!=='solo'});for(let i=0;i<500;i++)W.step();}catch(x){bad++;out.push(String(x));}
  const r=G.cleanMap(JSON.parse(JSON.stringify(m)));if(r.objs.length!==m.objs.length){bad++;out.push('clean dropped '+m.objs.length+'>'+r.objs.length);}}
 return{total,bad,c,out};}'''
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        print(json.dumps(await pg.evaluate(JS))[:1200]);print('errs',errs[:3]);await b.close()
asyncio.run(main())
