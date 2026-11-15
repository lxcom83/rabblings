# Design first, skills second: reports the skills each map's solution plan actually uses vs the budget the map declares.
import os,json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page();pg.goto('file://'+os.getcwd()+'/run.html');pg.wait_for_timeout(800)
    r=pg.evaluate("()=>__GS.FREE_MAPS.map(m=>{const need={};for(const s of (m.plan||[]))need[s.s]=(need[s.s]||0)+(s.n||1);return{id:m.id,skills:m.skills,need}})")
    for m in r:
        extra={k:v-(m['need'].get(k,0)) for k,v in m['skills'].items()}
        print(m['id'],'plan needs',m['need'],'| budget',m['skills'],'| spare',extra)
