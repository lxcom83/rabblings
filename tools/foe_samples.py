from PIL import Image, ImageDraw, ImageFont
S=6
def new(w=56,h=40): 
    im=Image.new('RGBA',(w,h),(0,0,0,0)); return im,ImageDraw.Draw(im)
def line(d,pts,c,w=1): d.line(pts,fill=c,width=w)
def goblin(d,x,y):
    g='#4f7a3a';d.rectangle([x,y-11,x+5,y-6],fill=g);d.rectangle([x+1,y-6,x+4,y],fill='#6b4a2a');d.point((x+4,y-9),fill='#e8d34a')
INK='#090a0c'
def scales(d,pts,c):
    for x,y in pts: d.point((x,y),fill=c)
def tail(d,pts,b,dk):
    # thick-based tapering tail: stacked polygons shrinking, with dark bands
    for k in range(len(pts)-1):
        (x0,y0,w0),(x1,y1,w1)=pts[k],pts[k+1]
        d.polygon([(x0,y0-w0),(x1,y1-w1),(x1,y1+w1),(x0,y0+w0)],fill=b if k%2==0 else dk)
def stalker():
    im,d=new(66,38);b='#7d6e5b';dk='#4a3f35';lt='#9c8b72';sc='#5c5044';T='#ece6d2'
    tail(d,[(16,22,5),(11,25,4),(7,28,3),(3,30,2),(0,29,1)],b,dk)
    # hunched, heavy-shouldered body: shoulders raised above hips
    d.polygon([(14,19),(22,13),(34,10),(42,13),(46,19),(44,25),(30,27),(16,26),(12,22)],fill=b)
    d.polygon([(18,25),(42,24),(38,27),(20,27)],fill=lt)
    scales(d,[(x,y) for x in range(17,42,3) for y in (16,19,22) if (x+y)%2==0],sc)
    # jagged tall spines, one broken
    for x,hh in [(16,5),(20,7),(24,9),(28,8),(32,10),(36,7),(40,4)]:
        d.polygon([(x,17-hh//3-(x%3)),(x+1,17-hh-5),(x+3,17-hh//3-(x%3))],fill=dk)
    # big wedge head, low, jaw hanging open with fangs
    d.polygon([(44,14),(54,15),(63,19),(62,22),(50,22),(44,22)],fill=b)
    d.polygon([(46,23),(62,24),(58,29),(48,27)],fill=dk)                  # lower jaw
    d.polygon([(47,16),(56,15),(60,19),(47,19)],fill=dk)                  # heavy scowling brow
    d.point((52,18),fill='#ffb020');d.point((53,18),fill='#ffb020');d.point((54,19),fill='#ffb020')
    d.rectangle([48,22,62,23],fill='#2a0e0e')                             # mouth
    for x in (50,53,56,59,62): d.point((x,23),fill=T);d.point((x,22),fill=T) if x%2 else None
    for x in (51,55,59): d.point((x,24),fill=T);d.point((x,25),fill=T)
    d.line([(49,16),(53,21)],fill='#b0a186')                              # scar
    # legs: heavy forelegs, big claws
    d.polygon([(38,24),(44,27),(46,33),(48,37),(43,37),(40,32),(36,28)],fill=dk)
    d.polygon([(44,25),(50,28),(54,33),(57,37),(51,37),(48,33),(43,29)],fill=sc)
    d.polygon([(14,23),(21,24),(19,32),(14,37),(8,37),(10,33),(12,28)],fill=dk)
    d.polygon([(22,26),(28,27),(27,32),(25,37),(19,37),(21,32)],fill=sc)
    for x in (8,10,14,19,21,25,43,45,50,52,55,57): d.point((x,37),fill=T);d.point((x+(1 if x>40 else -1),36),fill=T) if x%2==0 else None
    return im
def stalker_pounce():
    im,d=new(66,38);b='#7d6e5b';dk='#4a3f35';lt='#9c8b72';sc='#5c5044';T='#ece6d2'
    tail(d,[(14,19,5),(9,17,4),(5,14,3),(2,11,2),(0,8,1)],b,dk)
    d.polygon([(14,18),(24,12),(38,11),(48,14),(48,21),(34,24),(20,25),(12,23)],fill=b)
    d.polygon([(18,23),(40,22),(36,25),(20,25)],fill=lt)
    scales(d,[(x,y) for x in range(17,44,3) for y in (15,18,21) if (x+y)%2==0],sc)
    for x,hh in [(16,5),(20,7),(24,9),(28,8),(32,10),(36,7),(40,4)]:
        d.polygon([(x,13-hh//3),(x+1,13-hh-4),(x+3,13-hh//3)],fill=dk)
    # open jaws, fangs out
    d.polygon([(46,12),(58,13),(65,17),(48,19)],fill=b);d.polygon([(46,13),(56,12),(60,16),(46,16)],fill=dk)
    d.point((52,15),fill='#ffb020');d.point((53,15),fill='#ffb020')
    d.polygon([(48,20),(64,19),(60,26),(49,23)],fill=dk);d.polygon([(49,19),(64,18),(62,20),(49,21)],fill='#2a0e0e')
    for x in (51,54,57,60,63): d.point((x,19),fill=T);d.point((x,20),fill=T)
    for x in (52,56,60): d.point((x,21),fill=T);d.point((x,22),fill=T)
    d.polygon([(14,21),(8,26),(2,33),(1,36),(7,36),(12,31),(17,26)],fill=dk)
    d.polygon([(42,19),(50,24),(58,29),(57,33),(50,30),(42,25)],fill=sc)
    for p in [(58,33),(56,34),(60,31),(58,35),(2,37),(0,36),(4,37)]: d.point(p,fill=T)
    return im
def spider():
    im,d=new(56,44);b='#b8a78a';dk='#7a6a52';L='#9b8a6e'
    cx,cy=28,18
    d.ellipse([cx-9,cy-3,cx+9,cy+10],fill=b)
    for x in (cx-5,cx,cx+5): d.line([(x,cy),(x,cy+8)],fill=dk)
    d.ellipse([cx-5,cy-8,cx+5,cy],fill='#c9b99c')
    for p in [(cx-2,cy-5),(cx+1,cy-6),(cx+3,cy-4),(cx-1,cy-3)]: d.point(p,fill=dk)
    # 6 legs
    for sx in (-1,1):
        for (a,bb,c) in [((9,-2),(17,-12),(21,8)),((11,3),(20,2),(25,22)),((8,7),(16,16),(18,26))]:
            pts=[(cx+sx*a[0]//2,cy+a[1]+4),(cx+sx*a[0]-0,cy+a[1]-4+ (0)),(cx+sx*bb[0],cy+bb[1]+6),(cx+sx*c[0],cy+c[1]+12)]
            d.line(pts,fill=L,width=1)
    # hooked arms
    for sx in (-1,1): d.line([(cx+sx*3,cy-6),(cx+sx*6,cy-12),(cx+sx*3,cy-15)],fill=dk,width=2)
    d.rectangle([cx-3,cy-9,cx+3,cy-8],fill='#4a3a2a')
    # silk
    d.line([(cx,0),(cx,cy-9)],fill='#c2a56a',width=2)
    return im
def raptor():
    im,d=new(64,44);f='#7a6c5c';w2='#5d5348';sk='#8f8270'
    # long pair wings spread
    d.polygon([(30,18),(2,8),(8,14),(0,20),(10,20),(8,26),(30,24)],fill=w2)
    d.polygon([(30,18),(58,8),(52,14),(62,20),(52,20),(54,26),(30,24)],fill=w2)
    # short pair behind
    d.polygon([(30,24),(14,34),(22,36),(30,30)],fill=f);d.polygon([(30,24),(46,34),(38,36),(30,30)],fill=f)
    # body
    d.ellipse([26,16,34,30],fill=sk)
    # neck snaking
    line(d,[(30,17),(26,12),(32,8),(28,4)],sk,2)
    # head+bill
    d.rectangle([26,1,30,5],fill=sk);d.polygon([(25,2),(19,5),(23,7),(26,5)],fill='#c9b57a');d.point((28,3),fill='#f0e04a')
    # tail fan
    line(d,[(30,30),(30,38)],f,1);d.polygon([(30,38),(26,43),(34,43)],fill='#cfc7b0')
    # talons
    for x in (28,32): d.line([(x,28),(x,34)],fill='#cfc7b0')
    # feather ticks
    for x in range(6,26,4): d.point((x,14+(x//4)%3),fill='#a8977d')
    for x in range(36,58,4): d.point((x,14+(x//4)%3),fill='#a8977d')
    return im
def lurker():
    im,d=new(56,28);p='#6b6240';p2='#575a35';m='#4f6a3a'
    # plated body segments
    for i,x in enumerate(range(6,40,5)):
        d.ellipse([x,10,x+9,23],fill=p if i%2 else p2)
    for x in range(8,38,5): d.point((x+3,11),fill=m);d.point((x+4,11),fill=m)
    # head wedge
    d.polygon([(38,12),(52,15),(52,22),(38,23)],fill=p)
    d.point((44,13),fill='#d8d070');d.point((48,14),fill='#d8d070')
    # ring mouth
    d.ellipse([47,17,53,24],fill=INK);
    for a in [(48,18),(50,17),(52,18),(52,21),(50,23),(48,22)]: d.point(a,fill='#e6e0cc')
    # feelers
    for y in (16,19,22): d.line([(53,y),(56,y+1)],fill='#9a8a64')
    # paddles
    for x in (14,26): d.rectangle([x,22,x+4,25],fill=p2)
    return im
def lurker_water():
    im,d=new(56,28);d.rectangle([0,16,55,27],fill='#14201e')
    d.line([(0,16),(55,16)],fill='#35504a')
    d.point((30,15),fill='#d8d070');d.point((34,15),fill='#d8d070')
    d.rectangle([29,14,35,14],fill='#575a35')
    for y in (12,10):
        d.line([(36,y+3),(40,y+1)],fill='#9a8a64')
    d.arc([22,17,44,23],0,360,fill='#35504a');d.arc([16,18,50,25],0,360,fill='#26403b')
    return im
def brute():
    import math
    im,d=new(64,56);h='#5b4a45';h2='#3c2f2e';hl='#7a655c'
    q1='#d9d3c0';q2='#a9b5a0';q3='#b5653a';q4='#8f98a8'
    def shard(x,y,ang,L,w,c):
        a=math.radians(ang);dx,dy=math.cos(a),-math.sin(a);px,py=-dy,dx
        d.polygon([(x+px*w,y+py*w),(x+dx*L,y+dy*L),(x-px*w,y-py*w)],fill=c)
    # T frame: wide shoulder bar, narrow torso, long legs
    d.polygon([(6,16),(14,13),(50,13),(58,16),(56,24),(46,22),(18,22),(8,24)],fill=h)   # shoulders
    d.polygon([(18,14),(46,14),(42,24),(22,24)],fill=hl)
    d.polygon([(24,22),(40,22),(37,40),(27,40)],fill=h)                                  # narrow torso
    d.rectangle([27,40,37,42],fill=h2)
    d.polygon([(25,41),(31,41),(29,55),(21,55),(22,48)],fill=h2)                          # legs
    d.polygon([(33,41),(39,41),(43,55),(35,55),(35,48)],fill=h2)
    # arms hanging from shoulder ends, big fists
    d.polygon([(6,22),(13,22),(12,40),(5,40)],fill=h2);d.ellipse([2,38,14,50],fill=h)
    d.polygon([(51,22),(58,22),(59,36),(52,36)],fill=h2);d.ellipse([50,34,62,44],fill=h)
    # small head between shoulders
    d.ellipse([27,5,38,16],fill=h2)
    d.ellipse([29,7,36,14],fill='#c9a0ff');d.point((33,10),fill='#fff');d.point((32,9),fill='#f0e0ff')
    # minerals along shoulders, back, arms and legs at odd angles
    for x,y,a,L,w,c in [(8,17,150,13,2,q1),(14,14,115,14,2,q2),(19,14,100,11,2,q3),(44,13,60,12,2,q1),(51,14,30,13,2,q4),(57,18,5,11,2,q2),
        (41,14,75,9,1,q4),(24,13,125,8,1,q1),(5,26,190,10,2,q3),(58,28,340,9,2,q1),(8,32,215,8,2,q4),(55,30,320,8,2,q3),
        (28,28,160,8,2,q2),(37,30,20,9,2,q1),(24,46,205,7,2,q1),(40,48,330,7,2,q2)]:
        shard(x,y,a,L,w,c)
    return im

# ---- native-size (game pixel) sprites: pest and bow raider ----
def gutter(f=0):
    im,d=new(24,12);a='#7d7466';b='#5e564a';salt='#d8d2c0';dk='#3b352d'
    # whip tail with stiff tufts
    line(d,[(5,6),(2,4),(0,2)],dk,1);d.point((3,3),fill=salt);d.point((1,2),fill=salt)
    # segmented shell plates
    for i,x in enumerate(range(5,17,3)):
        d.rectangle([x,3+(i%2==0)*0,x+2,8],fill=a if i%2==0 else b);d.point((x+1,3),fill=salt)
    d.rectangle([5,4,16,4],fill=a)
    # wedge head, jaw split sideways
    d.polygon([(16,5),(22,6),(22,9),(16,9)],fill='#6b5f4f');d.point((19,6),fill='#d8c24a')
    d.line([(17,8),(23,8)],fill=INK);d.point((22,7),fill='#ece6d2');d.point((20,9),fill='#ece6d2')
    # stubby legs, two-step
    for k,x in enumerate((6,9,12,15)):
        y=9+((k+f)%2);d.rectangle([x,y,x,10+((k+f)%2)],fill=dk)
    return im
def raider(f=0):
    im,d=new(16,18);st='#8c9097';lt='#b4b9c0';beard='#b5653a';lea='#6a4a32';dk='#3c2f2e';wd='#5c432c'
    # legs
    d.rectangle([5,12,7,16-(f==1)],fill=dk);d.rectangle([9,12,11,16-(f==0)],fill=dk)
    d.rectangle([4,16-(f==1),7,17-(f==1)],fill=INK);d.rectangle([9,16-(f==0),12,17-(f==0)],fill=INK)
    # leather body, belt
    d.rectangle([4,6,12,12],fill=lea);d.rectangle([4,10,12,10],fill=dk)
    # helmet with nose guard, beard
    d.rectangle([5,1,11,5],fill=st);d.rectangle([5,1,11,1],fill=lt);d.rectangle([8,3,9,5],fill=lt)
    d.rectangle([5,5,11,8],fill=beard);d.point((10,3),fill='#e6e0cc')
    # crossbow held forward
    d.rectangle([9,8,15,9],fill=wd);d.rectangle([13,5,14,12],fill=dk);d.point((13,4),fill=INK);d.point((13,13),fill=INK)
    d.line([(14,6),(10,8)],fill='#cfc7b0');d.line([(14,11),(10,9)],fill='#cfc7b0')
    return im
