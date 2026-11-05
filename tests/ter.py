import asyncio,json,base64
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
TEST='''()=>{const G=__GS,out=[];let total=0,bad=0,time=0,maxT=0;const sizes=[[480,240],[800,300],[1400,420],[2400,600],[3200,600]],NEW=['hills','floating','labyrinth','mountains','canyons','twinpeaks','pillars'];const per={};
 for(const ty of NEW)for(const[w,h]of sizes)for(let s=1;s<=10;s++)for(const mode of ['solo','mirror','free']){total++;const t0=performance.now();const m=G.genMap({tpl:'march',type:ty,traps:s%4,foes:s%3,pool:s%3,theme:'forge',mode,w,h,seed:s*613+ty.length});const dt=performance.now()-t0;time+=dt;maxT=Math.max(maxT,dt);
  const P=mapProblems(m),T=new Terrain(w,h,m.theme,7),S=new Shaper(T,7);S.run(m.ops);if(mode==='mirror')for(let y=0;y<h;y++)for(let x=0;x<w>>1;x++)T.m[y*w+w-1-x]=T.m[y*w+x];const e=[];
  let solid=0;for(let i=0;i<T.m.length;i++)if(T.m[i])solid++;if(solid<w*h*.03)e.push('almost empty '+(solid/(w*h)).toFixed(3));
  for(const o of m.objs){if(o.k==='door'&&!(T.solid(o.x,o.y)&&!T.solid(o.x,o.y-8)))e.push('door buried '+o.x+','+o.y);if(o.k==='hatch'&&(T.solid(o.x,o.y)||T.solid(o.x,o.y-6)))e.push('hatch buried '+o.x+','+o.y);if(['jaws','mine','foe','nest'].includes(o.k)&&!(T.solid(o.x,o.y)&&!T.solid(o.x,o.y-8)))e.push(o.k+' bad');}
  if(mode==='mirror'){for(let y=0;y<h;y+=7)for(let x=0;x<w;x+=11)if(!!T.m[y*w+x]!==!!T.m[y*w+w-1-x]){e.push('not mirrored');y=h;break;}}
  if(P.length||e.length){bad++;per[ty]=(per[ty]||0)+1;if(out.length<12)out.push({ty,w,h,s,mode,P:P[0],e:e.slice(0,2)});}
  try{new G.World(G.toDef(m),{quiet:true,vs:mode!=='solo'});}catch(x){bad++;out.push({ty,err:String(x)});}}
 return{total,bad,per,avg:Math.round(time/total),maxT:Math.round(maxT),out};}'''
SHEET='''()=>{const G=__GS,N=__GS.NewMap,o=N.o;const K=['hills','floating','labyrinth','mountains','canyons','twinpeaks','pillars','terraces'];const c=document.createElement('canvas');c.width=232*4;c.height=170*2;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#120a18';x.fillRect(0,0,c.width,c.height);
 K.forEach((k,i)=>{o.type=k;o.tpl='march';o.foes=0;o.traps=1;o.mode='solo';o.theme='forge';o.wi=1;o.hi=1;o.seed=4242+i*7;N.pc=null;N.preview();x.drawImage(N.pc,(i%4)*232+10,(i>>2)*170+10);});return c.toDataURL();}'''
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file://'+__import__('os').getcwd()+'/run.html');await pg.wait_for_timeout(500)
        d=await pg.evaluate(SHEET);open('ter.png','wb').write(base64.b64decode(d.split(',')[1]))
        print(json.dumps(await pg.evaluate(TEST))[:1700]);print('errs',errs[:3]);await b.close()
asyncio.run(main())
