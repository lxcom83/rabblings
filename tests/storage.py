import asyncio,json,os,sys
from playwright.async_api import async_playwright
SK='<!doctype html><html><head><meta charset="utf-8"></head><body>%s</body></html>'
ok=True
def chk(name,c):
    global ok
    print(('PASS ' if c else 'FAIL ')+name);ok=ok and bool(c)
async def main():
    open('run.html','w').write(SK%open('build/rabblings-all.html').read())
    url='file://'+os.getcwd()+'/run.html'
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':960,'height':540});pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(url);await pg.wait_for_timeout(600)
        ev=pg.evaluate
        # ---- migration from localStorage ----
        await ev("""()=>{const G=__GS;const L=[];for(let i=0;i<3;i++){const m=G.genMap({tpl:'climb',type:'auto',traps:1,foes:0,pool:0,theme:'caves',mode:'solo',w:800,h:420,seed:20+i});m.name='OLD '+i;m.id='old'+i;L.push(m);}
          localStorage.setItem('goblin-scramble-maps',JSON.stringify(L));localStorage.setItem('rabblings-packs',JSON.stringify([{id:'pold',name:'OLD PACK',by:'ME',desc:'',maps:['old0','old1','old2']}]));}""")
        await pg.reload();await pg.wait_for_timeout(700)
        r=await ev("""async()=>{const G=__GS;return {n:G.Store.all().length,np:G.PackStore.all().length,ls:[localStorage.getItem('goblin-scramble-maps'),localStorage.getItem('rabblings-packs')],db:!!G.StoreDB.db,idb:(await G.StoreDB.rd('goblin-scramble-maps')||[]).length,idbp:(await G.StoreDB.rd('rabblings-packs')||[]).length}}""")
        chk('migrated maps and pack into the cache',r['n']==3 and r['np']==1)
        chk('IndexedDB in use and holds the migrated data',r['db'] and r['idb']==3 and r['idbp']==1)
        chk('old localStorage copy removed',r['ls']==[None,None])
        # ---- persistence across reload ----
        await ev("()=>{const G=__GS,m=G.genMap({tpl:'climb',type:'auto',traps:1,foes:0,pool:0,theme:'bog',mode:'solo',w:800,h:420,seed:77});m.name='NEW ONE';m.id=null;G.Store.put(m);}")
        await pg.wait_for_timeout(500)
        await pg.reload();await pg.wait_for_timeout(700)
        r=await ev("()=>({n:__GS.Store.all().length,first:__GS.Store.all()[0].name,np:__GS.PackStore.all().length})")
        chk('saved map survives reload',r['n']==4 and r['first']=='NEW ONE' and r['np']==1)
        # ---- 200 map pack roundtrip, plain and compressed ----
        t=await ev("""async()=>{const G=__GS;G.Store.mem=[];G.PackStore.mem=[];const ids=[];
          for(let i=0;i<200;i++){const m=G.genMap({tpl:'climb',type:'auto',traps:1,foes:0,pool:0,theme:i%2?'bog':'caves',mode:'solo',w:640,h:360,seed:100+i});m.name='MAP '+i;m.id=null;G.Store.put(m);ids.push(G.Store.all()[0].id);}
          const pk=G.PackStore.add('BIG PACK');pk.by='TESTER';pk.maps=ids;G.PackStore.save();
          const plain=G.packToFile(pk),z=await G.packToFileZ(pk);
          return {n:G.Store.all().length,max:G.PACK_MAX,plain:plain.length,z:z.length,zhead:z.slice(0,6),pt:plain,zt:z};}""")
        chk('PACK_MAX is 200',t['max']==200)
        chk('compressed pack starts with GSPK1: and is smaller',t['zhead']=='GSPK1:' and t['z']<t['plain']*0.6)
        print('  plain bytes',t['plain'],'compressed',t['z'])
        for kind,key in (('compressed','zt'),('old plain JSON','pt')):
            r=await pg.evaluate("""async t=>{const G=__GS;G.Store.mem=[];G.PackStore.mem=[];const x=await G.importPackFile(t);return [x.total,x.fresh,x.pack.name,G.Store.all().length,G.PackStore.all()[0].maps.length]}""",t[key])
            print('  ',kind,r)
            chk(kind+' 200-map pack imports',r[0]==200 and r[1]==200 and r[3]==200 and r[4]==200)
        r=await pg.evaluate("""async t=>{const x=await __GS.importPackFile(t);return [x.total,x.fresh,__GS.PackStore.all().length]}""",t['zt'])
        chk('re-import does not duplicate',r[0]==200 and r[1]==0 and r[2]==1)
        chk('garbage still not a pack',await ev("async()=>(await __GS.importPackFile('hello'))===null"))
        chk('damaged compressed pack gives an error',await ev("async()=>{try{await __GS.importPackFile('GSPK1:AAAA');return false}catch(e){return /damaged/.test(e.message)}}"))
        chk('single-map share code is not a pack',await ev("async()=>(await __GS.importPackFile(await __GS.packMap(__GS.Store.all()[0])))===null"))
        await pg.wait_for_timeout(600)
        # ---- links ----
        r=await ev("""()=>{const G=__GS,o={};const t=u=>{try{return G.normLink(u)}catch(e){return 'ERR:'+e.message}};
          return [t('https://github.com/a/b/blob/main/p.rabpack'),t('https://gist.github.com/me/0123abcd'),t('javascript:alert(1)'),t('ftp://x/y'),t('nonsense'),t('https://rabblings.com/play#pack='+encodeURIComponent('https://x.test/p.rabpack'))]}""")
        chk('github page link becomes raw link',r[0]=='https://raw.githubusercontent.com/a/b/main/p.rabpack')
        chk('gist link becomes raw link',r[1]=='https://gist.githubusercontent.com/me/0123abcd/raw')
        chk('javascript:/ftp:/junk refused',all(x.startswith('ERR:') for x in r[2:5]))
        chk('share link with #pack= unwraps',r[5]=='https://x.test/p.rabpack')
        small=await ev("""async()=>{const G=__GS,pk=G.PackStore.all()[0];pk.maps=pk.maps.slice(0,3);return await G.packToFileZ(pk)}""")
        cors={'access-control-allow-origin':'*'}
        await pg.route('https://example.test/pack.rabpack',lambda r:r.fulfill(body=small,headers=cors,content_type='text/plain'))
        await pg.route('https://drive.google.com/**',lambda r:r.abort())
        await pg.route('https://big.test/**',lambda r:r.fulfill(body='x',headers={**cors,'content-length':'30000000'}))
        await pg.route('https://missing.test/**',lambda r:r.fulfill(status=404,body='no',headers=cors))
        await pg.route('https://html.test/**',lambda r:r.fulfill(body='<html>hi</html>',headers=cors))
        r=await ev("async()=>{const t=await __GS.fetchLinkText('https://example.test/pack.rabpack');const d=await __GS.packData(t);return [d.pack.name,d.maps.length]}")
        chk('link fetch + decode',r[1]==3)
        async def err(u):
            return await pg.evaluate("async u=>{try{await __GS.fetchLinkText(u);return 'NOERR'}catch(e){return e.message}}",u)
        m=await err('https://drive.google.com/file/d/abc');chk('Drive link blocked with OPEN FILE advice','OPEN FILE' in m)
        m=await err('https://big.test/p');chk('size limit refused','too big' in m)
        m=await err('https://missing.test/p');chk('404 message','404' in m)
        r=await ev("async()=>{const t=await __GS.fetchLinkText('https://html.test/x');const d=await __GS.packData(t);return d===null}")
        chk('non-pack content is not executed or imported',r)
        # ---- startup #pack= link prompts to import ----
        await ev("()=>{__GS.Store.mem=[];__GS.PackStore.mem=[];__GS.StoreDB.put('goblin-scramble-maps',[]);__GS.StoreDB.put('rabblings-packs',[]);}")
        await pg.wait_for_timeout(500)
        pg2=await ctx.new_page();errs2=[];pg2.on('pageerror',lambda e:errs2.append(str(e)))
        await pg2.route('https://example.test/pack.rabpack',lambda r:r.fulfill(body=small,headers=cors,content_type='text/plain'))
        await pg2.goto(url+'#pack='+'https%3A%2F%2Fexample.test%2Fpack.rabpack');await pg2.wait_for_timeout(1200)
        s=await pg2.evaluate("()=>({dlg:!!window.DLG,title:dlg.title.textContent,txt:dlg.a.value,hash:location.hash,n:__GS.PackStore.all().length})")
        chk('startup link opens confirm dialog',s['dlg'] and s['title']=='Open this pack?' and 'MAPS: 3' in s['txt'])
        chk('hash cleared and nothing imported yet',s['hash']=='' and s['n']==0)
        await pg2.evaluate("()=>dlg.ok.click()");await pg2.wait_for_timeout(600)
        s=await pg2.evaluate("()=>({n:__GS.PackStore.all().length,m:__GS.Store.all().length,np:__GS.PackStore.maps(__GS.PackStore.all()[0]).length})")
        chk('confirm imports the pack',s['n']==1 and s['m']==3 and s['np']==3)
        chk('no page errors on link page',not errs2)
        # ---- IndexedDB unavailable -> localStorage fallback ----
        pg3=await ctx.new_page();errs3=[];pg3.on('pageerror',lambda e:errs3.append(str(e)))
        await pg3.add_init_script("Object.defineProperty(window,'indexedDB',{value:undefined,configurable:true})")
        await pg3.goto(url);await pg3.wait_for_timeout(700)
        await pg3.evaluate("()=>{localStorage.clear();const G=__GS,m=G.genMap({tpl:'climb',type:'auto',traps:1,foes:0,pool:0,theme:'caves',mode:'solo',w:800,h:420,seed:5});m.name='FALLBACK';m.id=null;G.Store.mem=null;G.Store.put(m);}")
        s=await pg3.evaluate("()=>({db:__GS.StoreDB.db,ls:JSON.parse(localStorage.getItem('goblin-scramble-maps')||'[]').map(m=>m.name)})")
        chk('fallback to localStorage',s['db'] is None and s['ls']==['FALLBACK'])
        chk('no errors without IndexedDB',not errs3)
        r=await ev("""()=>{const G=__GS;G.Store.mem=[];const m0=G.genMap({tpl:'climb',type:'auto',traps:1,foes:0,pool:0,theme:'caves',mode:'solo',w:640,h:360,seed:3});for(let i=0;i<400;i++){const m=JSON.parse(JSON.stringify(m0));m.id=null;m.name='T'+i;G.Store.put(m);}return [G.Store.all().length,new Set(G.Store.all().map(m=>m.id)).size]}""")
        chk('400 maps saved in one burst all keep unique ids',r[0]==400 and r[1]==400)
        # ---- quota failure shows a notice, never silent ----
        r=await ev("""async()=>{const G=__GS;G.StoreDB.wr=()=>Promise.reject(new Error('quota'));const ls=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new Error('quota')};
          G.Store.put({...G.genMap({tpl:'climb',type:'auto',traps:1,foes:0,pool:0,theme:'caves',mode:'solo',w:640,h:360,seed:1}),id:null,name:'Q'});await new Promise(r=>setTimeout(r,500));Storage.prototype.setItem=ls;return G.StoreDB.notice()}""")
        chk('failed save sets a visible notice',r=='STORAGE FULL')
        chk('no page errors',not errs)
        await b.close()
    print('ALL PASS' if ok else 'SOME FAILED');sys.exit(0 if ok else 1)
asyncio.run(main())
