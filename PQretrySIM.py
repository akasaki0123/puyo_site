import random
from random import uniform

Gachanum = 0
Gachamzn = 0
Gachaisi = 0
state = 0
Gachamzntmp = 0

gnum = 0
gmzn = 0
gisi = 0
gstate = 0
gmzntmp = 0
nper_gachahit = 0

###############################確率はここにいれる！######################################
###############################(1回目,2回目,3回目)#######################################
nper_gachahit = [1.5,2.25,3]
#########################################################################################

def gacha(Gachanum, Gachamzn, Gachamzntmp, Gachaisi, state):

    for i1 in range(1, 10, 1):
        
        if random.uniform(1,10000)<nper_gachahit[state] * 100:
            Gachamzntmp = Gachamzntmp + 1
        else:
            pass
        continue

    if state == 0:
        Gachaisi = Gachaisi + 50
    else:
        Gachaisi = Gachaisi + 10

    Gachanum = Gachanum + 1
    Gachamzn = Gachamzntmp + Gachamzn
    return [Gachanum, Gachamzn, Gachamzntmp, Gachaisi, state]


def gacha4kai(gnum, gmzn, gisi):

    #1回目
    gstate = 0
    gmzntmp = 0
    [gnum, gmzn, gmzntmp, gisi, gstate] = gacha(gnum, gmzn, gmzntmp, gisi, gstate)
    if gmzntmp >= 1:
    # 1体以上魔人出た
        pass
    else:
        #2回目
        gstate = 1
        [gnum, gmzn, gmzntmp, gisi, gstate] = gacha(gnum, gmzn, gmzntmp, gisi, gstate)
        if gmzntmp >=1:
            pass
        else:
            #3回目
            gstate = 2
            [gnum, gmzn, gmzntmp, gisi, gstate] = gacha(gnum, gmzn, gmzntmp, gisi, gstate)
            if gmzntmp >=1:
                pass
            else:
                #4回目
                gstate = 2
                [gnum, gmzn, gmzntmp, gisi, gstate] = gacha(gnum, gmzn, gmzntmp, gisi, gstate)

    return [gnum, gmzn, gisi]

#main start

print("ガチャ回数,目玉キャラ数,使用石,Debugstate")

for i in range(1, 10000, 1):
    [gnum, gmzn, gisi] = gacha4kai(gnum, gmzn, gisi)
    continue
print(gnum,gmzn,gisi,gstate)
#gnum = 0
#gmzn = 0
#gisi = 0
gstate = 0

for i in range(1, 10000, 1):
    [gnum, gmzn, gisi] = gacha4kai(gnum, gmzn, gisi)
    continue
print(gnum,gmzn,gisi,gstate)
#gnum = 0
#gmzn = 0
#gisi = 0
gstate = 0

for i in range(1, 10000, 1):
    [gnum, gmzn, gisi] = gacha4kai(gnum, gmzn, gisi)
    continue
print(gnum,gmzn,gisi,gstate)
#gnum = 0
#gmzn = 0
#gisi = 0
gstate = 0

for i in range(1, 10000, 1):
    [gnum, gmzn, gisi] = gacha4kai(gnum, gmzn, gisi)
    continue
print(gnum,gmzn,gisi,gstate)
#gnum = 0
#gmzn = 0
#gisi = 0
gstate = 0

for i in range(1, 10000, 1):
    [gnum, gmzn, gisi] = gacha4kai(gnum, gmzn, gisi)
    continue
print(gnum,gmzn,gisi,gstate)
print('~~~石%d個 per 目玉キャラ~~~' % int(gisi/gmzn))
#gnum = 0
#gmzn = 0
#gisi = 0
gstate = 0
key = input('press any key...')