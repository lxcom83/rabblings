#!/usr/bin/env python3
"""Packs the outlines and object rules of namida's own NeoLemmix styles into maps/namida-data.js.
Used so her levels play without the player's style files. Only outlines, one average colour per piece, sizes and effect rules are kept.
Usage: python3 tools/namida_styles.py <folder holding the namida_* style folders>
Left out on purpose: namida_special and namida_systemtest (joke and test pieces), and every style by another author."""
import sys, os, re, json, zlib, base64, glob
from PIL import Image
SKIP = {'namida_special', 'namida_systemtest'}
src = sys.argv[1]
out = {}
for sd in sorted(glob.glob(os.path.join(src, 'namida_*'))):
    st = os.path.basename(sd).lower()
    if st in SKIP or not os.path.isdir(sd):
        continue
    ter, obj = {}, {}
    for f in sorted(glob.glob(os.path.join(sd, 'terrain', '*.png'))):
        n = os.path.splitext(os.path.basename(f))[0].lower()
        im = Image.open(f).convert('RGBA'); w, h = im.size
        px = im.load(); run = []; cur = 0; cnt = 0; r = g = b = k = 0
        for y in range(h):
            for x in range(w):
                a = 1 if px[x, y][3] >= 128 else 0
                if a:
                    r += px[x, y][0]; g += px[x, y][1]; b += px[x, y][2]; k += 1
                if a == cur: cnt += 1
                else: run.append(cnt); cur = a; cnt = 1
        run.append(cnt)
        meta = os.path.join(sd, 'terrain', n + '.nxmt')
        txt = open(meta, errors='ignore').read() if os.path.exists(meta) else ''
        steel = 1 if re.search(r'^\s*STEEL', txt, re.M | re.I) else (0 if os.path.exists(meta) else (1 if re.search(r'(^|_)steel', n) else 0))
        ns = {m.group(1).lower()[0]: int(m.group(2)) for m in re.finditer(r'NINE_SLICE_(LEFT|RIGHT|TOP|BOTTOM)\s+(\d+)', txt, re.I)}
        nine = [ns.get('l', 0), ns.get('r', 0), ns.get('t', 0), ns.get('b', 0)] if ns else 0
        avg = [round(r / k), round(g / k), round(b / k)] if k else [0, 0, 0]
        ter[n] = [w, h, run, steel, nine, avg]
    for f in sorted(glob.glob(os.path.join(sd, 'objects', '*.nxmo'))):
        n = os.path.splitext(os.path.basename(f))[0].lower()
        t = open(f, errors='ignore').read()
        g = lambda key: (lambda m: int(m.group(1)) if m else 0)(re.search(r'^\s*' + key + r'\s+(-?\d+)', t, re.M))
        e = re.search(r'^\s*EFFECT\s+(\w+)', t, re.M)
        fr = 1; horiz = 0
        pa = re.search(r'\$PRIMARY_ANIMATION(.*?)\$END', t, re.S)
        blk = pa.group(1) if pa else t
        m = re.search(r'FRAMES\s+(\d+)', blk)
        if m: fr = max(1, int(m.group(1)))
        horiz = 1 if re.search(r'HORIZONTAL_STRIP', blk) else 0
        png = os.path.join(sd, 'objects', n + '.png'); fw = fh = 0
        if os.path.exists(png):
            W, H = Image.open(png).size
            fw = W // fr if horiz else W; fh = H if horiz else H // fr
        obj[n] = [(e.group(1).upper() if e else ''), g('TRIGGER_X'), g('TRIGGER_Y'), g('TRIGGER_WIDTH'), g('TRIGGER_HEIGHT'), fw, fh]
    out[st] = {'t': ter, 'o': obj}
raw = json.dumps(out, separators=(',', ':')).encode()
c = zlib.compressobj(9, zlib.DEFLATED, -15); z = c.compress(raw) + c.flush()
b = base64.b64encode(z).decode()
open('maps/namida-data.js', 'w').write("// namida's own NeoLemmix styles: outlines, one average colour per piece, sizes and object rules. Made by tools/namida_styles.py\nconst NAMIDA_Z='%s';\n" % b)
print(len(out), 'styles', sum(len(v['t']) for v in out.values()), 'terrain pieces', sum(len(v['o']) for v in out.values()), 'objects', len(raw) // 1024, 'KB json', len(b) // 1024, 'KB packed')
