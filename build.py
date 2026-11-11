#!/usr/bin/env python3
"""Builds the game and the map builder from kit/, maps/, games/ and builder/.

docs/play/index.html     the game
docs/builder/index.html  the map builder
docs/index.html          the website home page, copied from site/
build/rabblings-all.html one file holding both, used by tests and previews
"""
import hashlib, json, os, shutil

GAME = 'games/rabblings/'
COMMON = ['kit/core.js', 'kit/input.js', GAME + 'art.js', GAME + 'art48.js', GAME + 'art48-goblin.js',GAME + 'art48-swamp.js',GAME + 'art48-imp.js',GAME + 'art48-fairy.js',GAME + 'art48-dwarf.js',GAME + 'art48-rat.js',GAME + 'art48-shroom.js', 'maps/terrain.js', GAME + 'world.js', GAME + 'levels.js', GAME + 'levels-more.js', GAME + 'freeplay.js',
          GAME + 'profile.js', GAME + 'mapdata.js', 'maps/format.js', 'maps/terrain-gen.js', GAME + 'generate.js',
          GAME + 'foe-art.js', GAME + 'map-art.js', GAME + 'decor-art.js', 'maps/decor.js', 'maps/namida-data.js', 'maps/import.js', GAME + 'homes.js', GAME + 'races.js', GAME + 'game.js',
          'kit/dialog.js', GAME + 'my-maps.js']
BUILDER = ['builder/editor.js', 'builder/import-ui.js']
BOOT = [GAME + 'boot.js']
TARGETS = {'play': COMMON + BOOT, 'builder': COMMON + BUILDER + BOOT, 'all': COMMON + BUILDER + BOOT}
TITLES = {'play': 'Rabblings: Marching Orders', 'builder': 'Rabblings Map Builder', 'all': 'Rabblings: Marching Orders'}
PAGE = open('page.html').read()


def bundle(target):
    js = "const BUILD='%s';\n" % target + '\n'.join(open(f).read() for f in TARGETS[target])
    return '<title>%s</title>\n%s<script>\n%s\n</script>\n' % (TITLES[target], PAGE, js)


def full_page(body):
    return ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
            '<link rel="manifest" href="../manifest.webmanifest"><meta name="theme-color" content="#120a18">'
            '<link rel="icon" href="../img/icon-192.png"><link rel="apple-touch-icon" href="../img/apple-touch-icon.png">'
            '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">'
            '<meta name="apple-mobile-web-app-title" content="Rabblings"></head><body>'
            + body + '</body></html>\n')


def file_list():
    files = ['./', 'play/', 'builder/', 'manifest.webmanifest']
    for root, _, names in os.walk('site'):
        for n in names:
            rel = os.path.relpath(os.path.join(root, n), 'site').replace(os.sep, '/')
            if rel not in ('CNAME', 'index.html', 'sw.js') and 'LICENSE' not in rel and not rel.startswith('vendor/'):
                files.append(rel)
    return sorted(set(files))


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w').write(text)
    print(path, len(text))


write('build/rabblings-all.html', bundle('all'))
write('docs/play/index.html', full_page(bundle('play')))
write('docs/builder/index.html', full_page(bundle('builder')))
shutil.copytree('site', 'docs', dirs_exist_ok=True)
stamp = hashlib.sha1(''.join(open(f).read() for f in ('docs/play/index.html', 'docs/builder/index.html', 'docs/index.html')).encode()).hexdigest()[:10]
write('docs/sw.js', open('site/sw.js').read().replace('__VERSION__', stamp).replace('__FILES__', json.dumps(file_list())))
