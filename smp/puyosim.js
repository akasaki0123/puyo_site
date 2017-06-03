function Point(a, b) {
    this.x = a;
    this.y = b
}
function Route(a, b, c, d, e, f, h, k, g, l, m) {
    this.point = [];
    this.point[0] = new Point(b,c);
    this.point[1] = new Point(d,e);
    this.point[2] = new Point(f,h);
    this.point[3] = new Point(k,g);
    this.point[4] = new Point(l,m);
    this.pointNum = a
}
function Body(a, b, c, d) {
    this.x1 = a;
    this.y1 = b;
    this.x2 = c;
    this.y2 = d
}
var mode = 0, nowchanceNum = -1, puyoBody = new Body(10,10,35,35), dropSpeed = 3.8, dropPuyoList, dropPuyoListNum, atack, subAtack, rensaNum, deletePuyoNum, colorList;
function DropPuyoData(a, b, c, d) {
    this.color = a;
    this.lineX = b;
    this.startLineY = c;
    this.dropY = 0;
    this.endLineY = d;
    this.ending = !1
}
var newField = !1, canvas, ctx, img, hartBoxProb = 100, puyoNum = 5, shuffleNum = 0, field = [[], [], [], [], [], []], nextField = [], copyField = [[], [], [], [], [], []], copyNextField = [], selectNow = !1, selectComplete = !1, mouseCursor = new Point(0,0), selectPuyoPoint = [], selectPuyoNum = 0, selectPuyoMax = 5, selected = !1, rensaPuyoList, rensaPuyoListNum, maxDamage, maxRensaNum, maxRensaToDeletePuyo, maxDeletePuyoNum, maxDeletePuyoToRensa, maxDamagePointNum, maxRensaPointNum, maxDeletePuyoPointNum, simulated = !1, showMaxDeletePuyo, showMaxDamage, showMaxRensa;
$(function() {
    var a = GetParam();
    null != a ? xors.load(a.x, a.y, a.z, a.w) : xors.seed($.now());
    UrlShow();
    GropSelectBox();
    Load();
    EventSetting();
    DataInit();
    SimDataInit();
    GroupSelect(0);
    ChanceListDataRegist()
});
function NotPcJump() {
    var a = navigator.userAgent;
    if (-1 != a.search(/iPhone/) || -1 != a.search(/iPad/) || -1 != a.search(/iPod/) || -1 != a.search(/Android/))
        location.href = "./smp/"
}
function DataInit() {
    dropPuyoList = [];
    dropPuyoListNum = 0;
    newField = !1;
    selectPuyoPoint = [];
    selectPuyoNum = 0;
    selected = selectComplete = selectNow = !1;
    rensaPuyoList = [];
    rensaPuyoListNum = 0;
    colorList = [!1, !1, !1, !1, !1];
    mouseCursor = new Point(0,0);
    DeleteScoreData();
    DeleteScore()
}
function SimDataInit() {
    maxDeletePuyoPointNum = maxRensaPointNum = maxDamagePointNum = maxDeletePuyoToRensa = maxDeletePuyoNum = maxRensaToDeletePuyo = maxRensaNum = maxDamage = 0;
    simulated = showMaxRensa = showMaxDamage = showMaxDeletePuyo = !1;
    $("#simData").css("visibility", "hidden")
}
function EventSetting() {
    function a(a) {
        a.preventDefault()
    }
    function b(a) {
        if (selectNow && !selected)
            if (0 == selectPuyoNum)
                selectNow = !1;
            else {
                var b = a.changedTouches[0]
                  , c = $("#puyo").offset();
                a = b.pageX - c.left;
                b = b.pageY - c.top;
                0 > a || a > canvasWidth || 0 > b || b > canvasHeight || (selectComplete = !0)
            }
    }
    var c = document.getElementById("puyo");
    c.addEventListener("touchstart", a);
    c.addEventListener("touchmove", a);
    c.addEventListener("touchend", a);
    var d = 0;
    c.addEventListener("touchstart", function(a) {
        var b = a.changedTouches[0]
          , c = $("#puyo").offset();
        a = b.pageX - c.left;
        b = b.pageY - c.top;
        d = 0;
        mouseCursor.x = a;
        mouseCursor.y = b;
        if (0 > a || a > canvasWidth || 0 > b || b > canvasHeight)
            return !1;
        selectNow = !0
    });
    c.addEventListener("touchmove", function(a) {
        d++;
        var b = a.changedTouches[0];
        if (selectNow) {
            var c = $("#puyo").offset();
            a = b.pageX - c.left;
            b = b.pageY - c.top;
            if (0 > a || a > canvasWidth || 0 > b || b > canvasHeight)
                selectNow = !1,
                SelectClear();
            mouseCursor.x = a;
            mouseCursor.y = b
        }
    });
    c.addEventListener("touchend", b);
    c.addEventListener("touchcancel", b);
    $("#newField").click(function() {
        UrlShow();
        DataInit();
        SimDataInit();
        FieldInit();
        shuffleNum = 0
    });
    $("#undo").click(function() {
        DataInit();
        Undo()
    });
    $("#simulate").click(function() {
        if (!simulated)
            if (selected)
                $("#simInfo").html("[\u5143\u306b\u623b\u3059]\u3092\u62bc\u3057\u3066\u304b\u3089\u89e3\u6790\u3057\u3066\u304f\u3060\u3055\u3044"),
                $("#simInfo").show();
            else {
                var a = $.now();
                Simulate();
                var b = $.now();
                $("#simInfo").hide();
                $("#simTime").html("\u89e3\u6790\u6642\u9593\uff1a" + (b - a) + "ms");
                $("#simData").css("visibility", "visible")
            }
    });
    $("#maxDamage").click(function() {
        showMaxDamage = showMaxDamage ? !1 : !0
    });
    $("#maxRensa").click(function() {
        showMaxRensa = showMaxRensa ? !1 : !0
    });
    $("#maxDeletePuyo").click(function() {
        showMaxDeletePuyo = showMaxDeletePuyo ? !1 : !0
    });
    var e = ["modeNomal", "modeChance", "modeQuestion"];
    $("#modeSelect").change(function() {
        DataInit();
        SimDataInit();
        shuffleNum = 0;
        $("#" + e[mode]).css("display", "none");
        mode = parseInt($(this).val());
        $("#" + e[mode]).css("display", "inline");
        0 == mode && FieldInit();
        1 == mode && (fieldLoad(chanceField[0].fieldData, chanceField[0].nextData),
        nowchanceNum = 0)
    });
    $("#groupSelect").change(function() {
        SimDataInit();
        var a = parseInt($(this).val());
        GroupSelect(a)
    });
    $("#chanceCreate").click(function() {
        DataInit();
        var a = parseInt($("#chanceSelect").val());
        fieldLoad(chanceField[a].fieldData, chanceField[a].nextData);
        if (nowchanceNum != a)
            shuffleNum = 0,
            SimDataInit();
        else
            for (var b = 0; b < shuffleNum; b++)
                FieldShuffle();
        nowchanceNum = a
    });
    $("#shuffle").click(function() {
        selected || (SimDataInit(),
        FieldShuffle(),
        shuffleNum++,
        5 == shuffleNum && (shuffleNum = 0))
    });
    $("#mail").click(function() {
        $("#mail").html("puyoquerensim@gmail.com")
    })
}
function Undo() {
    for (var a = 0; a < fieldHeight; a++)
        for (var b = 0; b < fieldWidth; b++)
            field[a][b] = copyField[a][b];
    for (b = 0; b < fieldWidth; b++)
        nextField[b] = copyNextField[b]
}
function Load() {
    img = new Image;
    canvas = document.getElementById("puyo");
    if (!canvas || !canvas.getContext)
        return !1;
    ctx = canvas.getContext("2d");
    img.onload = function() {
        FieldInit();
        setInterval(Update, 1E3 / 60)
    }
    ;
    img.src = "../img/puyo.png"
}
function Update() {
    newField && (newField = !1,
    FieldInit());
    SelectPuyo();
    SelectFire();
    UpdateDropPuyo();
    DrawField()
}
function UpdateDropPuyo() {
    0 != dropPuyoListNum && (MoveDropPuyo(),
    PuyoDropCompleteCheck() && (Rensa() ? (DropPuyoCheck(),
    0 == dropPuyoListNum && (DropNextPuyo(),
    0 == dropPuyoListNum && DrawScore())) : (DropNextPuyo(),
    0 == dropPuyoListNum && DrawScore())))
}
function OjamaPuyoDelete(a, b) {
    for (var c = [new Point(0,-1), new Point(1,0), new Point(0,1), new Point(-1,0)], d, e, f = 0; 4 > f; f++)
        d = a + c[f].x,
        e = b + c[f].y,
        OjamaPuyoCheck(d, e) && (field[b + c[f].y][a + c[f].x] = -1,
        deletePuyoNum++)
}
function OjamaPuyoCheck(a, b) {
    if (!(0 <= a && a < fieldWidth && 0 <= b && b < fieldHeight))
        return !1;
    if (field[b][a] == hartBox || field[b][a] == ojamaPuyo || field[b][a] == bomb)
        return !0
}
function MoveDropPuyo() {
    for (var a, b, c = 0; c < dropPuyoListNum; c++)
        a = dropPuyoList[c].startLineY * puyoHeight + nextHeight,
        b = dropPuyoList[c].endLineY * puyoHeight + nextHeight,
        a + dropPuyoList[c].dropY < b ? dropPuyoList[c].dropY += dropSpeed : (dropPuyoList[c].dropY = b - a,
        dropPuyoList[c].ending = !0)
}
function PuyoDropCompleteCheck() {
    for (var a = 0; a < dropPuyoListNum; a++)
        if (!dropPuyoList[a].ending)
            return !1;
    return !0
}
function SelectClear() {
    selectPuyoPoint = [];
    selectPuyoNum = 0
}
function SelectPuyo() {
    if (!(!selectNow || selectPuyoNum >= selectPuyoMax || selected || mouseCursor.y <= nextHeight)) {
        var a = new Point(-1,-1)
          , b = mouseCursor.x
          , c = mouseCursor.y - nextHeight
          , d = new Point(b % puyoWidth,c % puyoHeight);
        if (d.x >= puyoBody.x1 && d.x <= puyoBody.x2 && d.y >= puyoBody.y1 && d.y <= puyoBody.y2 && (a.x = parseInt(b / puyoWidth),
        a.y = parseInt(c / puyoHeight),
        field[a.y][a.x] != blank)) {
            for (b = 0; b < selectPuyoNum; b++)
                if (a.x == selectPuyoPoint[b].x && a.y == selectPuyoPoint[b].y)
                    return;
            0 < selectPuyoNum && !SelectJoinCheck(a) || (selectPuyoPoint[selectPuyoNum] = new Point(a.x,a.y),
            selectPuyoNum++)
        }
    }
}
function SelectFire() {
    if (selectComplete && 0 != selectPuyoNum) {
        for (var a = 0; a < selectPuyoNum; a++)
            field[selectPuyoPoint[a].y][selectPuyoPoint[a].x] = -1;
        deletePuyoNum += selectPuyoNum;
        selectComplete = !1;
        selected = !0;
        SelectClear();
        DropPuyoCheck();
        0 == dropPuyoListNum && DropNextPuyo()
    }
}
function SelectJoinCheck(a) {
    for (var b = [new Point(0,-1), new Point(1,-1), new Point(1,0), new Point(1,1), new Point(0,1), new Point(-1,1), new Point(-1,0), new Point(-1,-1)], c = 0; c < selectPuyoNum; c++)
        for (jn = 0; jn < b.length; jn++)
            if (a.x + b[jn].x == selectPuyoPoint[c].x && a.y + b[jn].y == selectPuyoPoint[c].y)
                return !0;
    return !1
}
function DropPuyoCheck() {
    dropPuyoList = [];
    dropPuyoListNum = 0;
    for (var a, b = 0; b < fieldWidth; b++) {
        a = 0;
        for (var c = fieldHeight - 1; 0 <= c; c--)
            -1 == field[c][b] ? a++ : 0 < a && (dropPuyoList[dropPuyoListNum] = new DropPuyoData(field[c][b],b,c,c + a),
            field[c][b] = -1,
            dropPuyoListNum++)
    }
}
function DropNextPuyo() {
    dropPuyoList = [];
    dropPuyoListNum = 0;
    for (var a, b = 0; b < fieldWidth; b++) {
        a = 0;
        for (var c = fieldHeight - 1; 0 <= c; c--)
            -1 == field[c][b] && a++;
        0 < a && -1 != nextField[b] && (dropPuyoList[dropPuyoListNum] = new DropPuyoData(nextField[b],b,-1,a - 1),
        nextField[b] = -1,
        dropPuyoListNum++)
    }
}
function FieldInit() {
    for (var a, b = 0; b < fieldHeight; b++)
        for (var c = 0; c < fieldWidth; c++)
            field[b][c] = -1;
    for (c = 0; c < fieldWidth; c++)
        nextField[c] = -1;
    for (b = 0; b < fieldHeight; b++)
        for (c = 0; c < fieldWidth; c++)
            a = xors.rand() % (hartBoxProb + 1),
            a != hartBoxProb ? (field[b][c] = a % puyoNum,
            JoinFourPuyoCheckStart(field[b][c], c, b) && c--) : field[b][c] = hartBox,
            copyField[b][c] = field[b][c];
    for (c = 0; c < fieldWidth; c++)
        a = xors.rand() % hartBoxProb,
        nextField[c] = a % puyoNum,
        copyNextField[c] = nextField[c]
}
function DrawField() {
    ctx.strokeStyle = "rgb(200,200,200)";
    ctx.fillStyle = "rgb(200,200,200)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    for (var a = 0; a < fieldHeight; a++)
        for (var b = 0; b < fieldWidth; b++)
            -1 != field[a][b] && DrawPuyo(field[a][b], b, a, 0);
    for (b = 0; b < fieldWidth; b++)
        -1 != nextField[b] && DrawNext(nextField[b], b);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    if (selectNow)
        for (i = 0; i < selectPuyoNum; i++)
            ctx.fillRect(selectPuyoPoint[i].x * puyoWidth, selectPuyoPoint[i].y * puyoHeight + nextHeight, puyoWidth, puyoHeight);
    DrawSimData();
    DrawDropPuyo()
}
function DrawDropPuyo() {
    for (var a = 0; a < dropPuyoListNum; a++)
        DrawPuyo(dropPuyoList[a].color, dropPuyoList[a].lineX, dropPuyoList[a].startLineY, dropPuyoList[a].dropY)
}
function AtackCalc(a, b, c, d) {
    for (var e = [1, 1.4, 1.7, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4], f = group[selectGroupNum].comb ? 1.2 : 1, h = 0; 3 > h; h++)
        for (var k = 0; k < c; k++)
            if (group[selectGroupNum].charData[h].color == b[k]) {
                var g = 1 + .15 * (d - 4);
                g = group[selectGroupNum].charData[h].atack * g * e[a] * f;
                g = group[selectGroupNum].lPassiveSkill(g);
                atack[h] += g
            } else
                group[selectGroupNum].charData[h].subColor == b[k] && (g = 1 + .15 * (d - 4),
                g = group[selectGroupNum].charData[h].atack * g * e[a] * f / 3,
                g = group[selectGroupNum].lPassiveSkill(g),
                subAtack[h] += g)
}
function DrawScore() {
    for (var a = 0, b = group[selectGroupNum], c = 0; 3 > c; c++) {
        var d = b.charData[c];
        atack[c] = group[selectGroupNum].lActiveSkill(atack[c], rensaNum, colorList);
        subAtack[c] = group[selectGroupNum].lActiveSkill(subAtack[c], rensaNum, colorList);
        a += parseInt(atack[c]) + parseInt(subAtack[c]);
        $("#atack" + (c + 1)).html("" + parseInt(atack[c]));
        d.subColor != noneColor ? $("#subAtack" + (c + 1)).html("" + parseInt(subAtack[c])) : $("#subAtack" + (c + 1)).html("\u3000")
    }
    $("#sumAtack").html("\u5408\u8a08\u653b\u6483\u529b\uff1a" + a);
    $("#rensaNum").html("\u9023\u9396\u6570\uff1a" + rensaNum);
    $("#deletePuyoNum").html("\u3077\u3088\u6d88\u3057\u6570\uff1a" + deletePuyoNum)
}
function DeleteScoreData() {
    atack = [0, 0, 0];
    subAtack = [0, 0, 0];
    deletePuyoNum = rensaNum = 0
}
function DeleteScore() {
    $("#rensaNum").html("\u9023\u9396\u6570\uff1a");
    $("#deletePuyoNum").html("\u3077\u3088\u6d88\u3057\u6570\uff1a")
}
function Rensa() {
    for (var a = 0; a < dropPuyoListNum; a++)
        field[dropPuyoList[a].endLineY][dropPuyoList[a].lineX] = dropPuyoList[a].color;
    for (var b = [], c = RensaPuyoCheckStart(b), a = 0; a < c; a++)
        colorList[b[a]] = !0;
    for (a = 0; a < rensaPuyoListNum; a++)
        field[rensaPuyoList[a].y][rensaPuyoList[a].x] = -1,
        OjamaPuyoDelete(rensaPuyoList[a].x, rensaPuyoList[a].y);
    return 0 < rensaPuyoListNum ? (deletePuyoNum += rensaPuyoListNum,
    AtackCalc(rensaNum, b, c, rensaPuyoListNum),
    rensaNum++,
    !0) : !1
}
function RensaPuyoCheckStart(a) {
    var b = [[], [], [], [], [], []];
    rensaPuyoList = [];
    for (var c = rensaPuyoListNum = 0, d = 0; d < fieldHeight; d++)
        for (var e = 0; e < fieldWidth; e++)
            b[d][e] = -1 != field[d][e] ? !1 : !0;
    for (var f = 0; f < dropPuyoListNum; f++)
        if (d = [],
        e = RensaPuyoCheck(d, b, dropPuyoList[f].color, 0, dropPuyoList[f].lineX, dropPuyoList[f].endLineY),
        4 <= e) {
            for (jn = 0; jn < e; jn++)
                rensaPuyoList[jn + rensaPuyoListNum] = new Point(d[jn].x,d[jn].y);
            rensaPuyoListNum += e;
            a[c] = dropPuyoList[f].color;
            c++
        }
    return c
}
function RensaPuyoCheck(a, b, c, d, e, f) {
    b[f][e] = !0;
    a[d] = new Point(e,f);
    d++;
    0 < f && !b[f - 1][e] && field[f - 1][e] == c && (d = RensaPuyoCheck(a, b, c, d, e, f - 1));
    e < fieldWidth - 1 && !b[f][e + 1] && field[f][e + 1] == c && (d = RensaPuyoCheck(a, b, c, d, e + 1, f));
    f < fieldHeight - 1 && !b[f + 1][e] && field[f + 1][e] == c && (d = RensaPuyoCheck(a, b, c, d, e, f + 1));
    0 < e && !b[f][e - 1] && field[f][e - 1] == c && (d = RensaPuyoCheck(a, b, c, d, e - 1, f));
    return d
}
function JoinFourPuyoCheckStart(a, b, c) {
    for (var d = [[], [], [], [], [], [], []], e = 0; e < fieldHeight; e++)
        for (var f = 0; f < fieldWidth; f++)
            d[e][f] = !1;
    return 4 <= JoinPuyoCheck(d, a, 0, b, c) ? !0 : !1
}
function JoinPuyoCheck(a, b, c, d, e) {
    a[e][d] = !0;
    c++;
    0 < e && !a[e - 1][d] && field[e - 1][d] == b && (c = JoinPuyoCheck(a, b, c, d, e - 1));
    d < fieldWidth - 1 && !a[e][d + 1] && field[e][d + 1] == b && (c = JoinPuyoCheck(a, b, c, d + 1, e));
    e < fieldHeight - 1 && !a[e + 1][d] && field[e + 1][d] == b && (c = JoinPuyoCheck(a, b, c, d, e + 1));
    0 < d && !a[e][d - 1] && field[e][d - 1] == b && (c = JoinPuyoCheck(a, b, c, d - 1, e));
    return c
}
function DrawPuyo(a, b, c, d) {
    p = puyoImageRect[a];
    ctx.drawImage(img, p.x, p.y, p.width, p.height, b * puyoWidth, c * puyoHeight + nextHeight + d, puyoWidth, puyoHeight)
}
function DrawNext(a, b) {
    p = puyoImageRect[a + 8];
    ctx.drawImage(img, p.x, p.y, p.width, p.height, b * puyoWidth, 0, nextWidth, nextHeight)
}
function FieldShuffle() {
    for (var a = 0; a < fieldHeight; a++)
        for (var b = 0; b < fieldWidth; b++)
            field[a][b] == blank || 4 < field[a][b] || (field[a][b]++,
            5 == field[a][b] && (field[a][b] = 0))
}
var simField = [[], [], [], [], [], [], []]
  , simNextField = [];
function SimScoreRegist(a) {
    for (var b = 0, c = 0; 3 > c; c++)
        atack[c] = group[selectGroupNum].lActiveSkill(atack[c], rensaNum, colorList),
        subAtack[c] = group[selectGroupNum].lActiveSkill(subAtack[c], rensaNum, colorList),
        b += atack[c],
        b += subAtack[c];
    b > maxDamage && (maxDamage = b,
    maxDamagePointNum = a);
    if (rensaNum > maxRensaNum || rensaNum == maxRensaNum && deletePuyoNum > maxRensaToDeletePuyo)
        maxRensaNum = rensaNum,
        maxRensaToDeletePuyo = deletePuyoNum,
        maxRensaPointNum = a;
    if (deletePuyoNum > maxDeletePuyoNum || deletePuyoNum == maxDeletePuyoNum && rensaNum > maxDeletePuyoToRensa)
        maxDeletePuyoNum = deletePuyoNum,
        maxDeletePuyoToRensa = rensaNum,
        maxDeletePuyoPointNum = a
}
function Simulate() {
    if (!selected && !simulated) {
        simulated = !0;
        for (var a, b = 0; b < simDataNum; b++)
            if (DeleteScoreData(),
            rensaPuyoList = [],
            rensaPuyoListNum = 0,
            dropPuyoList = [],
            rensaNum = dropPuyoListNum = 0,
            colorList = [!1, !1, !1, !1, !1],
            SimFieldCopy(),
            SimSelectFire(b)) {
                for (; ; )
                    if (a = SimRensa()) {
                        if (SimDropPuyoCheck(),
                        0 == dropPuyoListNum && (SimDropNextPuyo(),
                        0 == dropPuyoListNum))
                            break
                    } else if (SimDropNextPuyo(),
                    0 == dropPuyoListNum)
                        break;
                SimScoreRegist(b)
            }
        DeleteScoreData()
    }
}
function SimFieldCopy() {
    for (var a = 0; a < fieldHeight; a++)
        for (var b = 0; b < fieldWidth; b++)
            simField[a][b] = field[a][b];
    for (b = 0; b < fieldWidth; b++)
        simNextField[b] = nextField[b]
}
function SimSelectFire(a) {
    for (var b = 0; b < simData[a].selectNum; b++)
        if (simField[simData[a].selectPoint[b].y][simData[a].selectPoint[b].x] == blank)
            return !1;
    for (b = 0; b < simData[a].selectNum; b++)
        simField[simData[a].selectPoint[b].y][simData[a].selectPoint[b].x] = -1;
    deletePuyoNum += simData[a].selectNum;
    SimDropPuyoCheck();
    0 == dropPuyoListNum && SimDropNextPuyo();
    return !0
}
function SimDropPuyoCheck() {
    dropPuyoList = [];
    dropPuyoListNum = 0;
    for (var a, b = 0; b < fieldWidth; b++) {
        a = 0;
        for (var c = fieldHeight - 1; 0 <= c; c--)
            -1 == simField[c][b] ? a++ : 0 < a && (dropPuyoList[dropPuyoListNum] = new DropPuyoData(simField[c][b],b,c,c + a),
            simField[c][b] = -1,
            dropPuyoListNum++)
    }
}
function SimDropNextPuyo() {
    dropPuyoList = [];
    dropPuyoListNum = 0;
    for (var a, b = 0; b < fieldWidth; b++) {
        a = 0;
        for (var c = fieldHeight - 1; 0 <= c; c--)
            -1 == simField[c][b] && a++;
        0 < a && -1 != simNextField[b] && (dropPuyoList[dropPuyoListNum] = new DropPuyoData(simNextField[b],b,c,a - 1),
        simNextField[b] = -1,
        dropPuyoListNum++)
    }
}
function SimRensa() {
    for (var a = 0; a < dropPuyoListNum; a++)
        simField[dropPuyoList[a].endLineY][dropPuyoList[a].lineX] = dropPuyoList[a].color;
    for (var b = [], c = SimRensaPuyoCheckStart(b), a = 0; a < c; a++)
        colorList[b[a]] = !0;
    for (a = 0; a < rensaPuyoListNum; a++)
        simField[rensaPuyoList[a].y][rensaPuyoList[a].x] = -1,
        SimOjamaPuyoDelete(rensaPuyoList[a].x, rensaPuyoList[a].y);
    return 0 < rensaPuyoListNum ? (deletePuyoNum += rensaPuyoListNum,
    AtackCalc(rensaNum, b, c, rensaPuyoListNum),
    rensaNum++,
    !0) : !1
}
function SimRensaPuyoCheckStart(a) {
    var b = [[], [], [], [], [], [], []];
    rensaPuyoList = [];
    for (var c = rensaPuyoListNum = 0, d = 0; d < fieldHeight; d++)
        for (var e = 0; e < fieldWidth; e++)
            b[d][e] = -1 != simField[d][e] ? !1 : !0;
    for (var f = 0; f < dropPuyoListNum; f++)
        if (d = [],
        e = SimRensaPuyoCheck(d, b, dropPuyoList[f].color, 0, dropPuyoList[f].lineX, dropPuyoList[f].endLineY),
        4 <= e) {
            for (jn = 0; jn < e; jn++)
                rensaPuyoList[jn + rensaPuyoListNum] = new Point(d[jn].x,d[jn].y);
            rensaPuyoListNum += e;
            a[c] = dropPuyoList[f].color;
            c++
        }
    return c
}
function SimRensaPuyoCheck(a, b, c, d, e, f) {
    b[f][e] = !0;
    a[d] = new Point(e,f);
    d++;
    0 < f && !b[f - 1][e] && simField[f - 1][e] == c && (d = SimRensaPuyoCheck(a, b, c, d, e, f - 1));
    e < fieldWidth - 1 && !b[f][e + 1] && simField[f][e + 1] == c && (d = SimRensaPuyoCheck(a, b, c, d, e + 1, f));
    f < fieldHeight - 1 && !b[f + 1][e] && simField[f + 1][e] == c && (d = SimRensaPuyoCheck(a, b, c, d, e, f + 1));
    0 < e && !b[f][e - 1] && simField[f][e - 1] == c && (d = SimRensaPuyoCheck(a, b, c, d, e - 1, f));
    return d
}
function SimOjamaPuyoDelete(a, b) {
    for (var c = [new Point(0,-1), new Point(1,0), new Point(0,1), new Point(-1,0)], d, e, f = 0; 4 > f; f++)
        d = a + c[f].x,
        e = b + c[f].y,
        SimOjamaPuyoCheck(d, e) && (simField[b + c[f].y][a + c[f].x] = -1,
        deletePuyoNum++)
}
function SimOjamaPuyoCheck(a, b) {
    if (!(0 <= a && a < fieldWidth && 0 <= b && b < fieldHeight))
        return !1;
    if (simField[b][a] == hartBox || simField[b][a] == ojamaPuyo || simField[b][a] == bomb)
        return !0
}
function DrawSimData() {
    if (simulated && !selected) {
        ctx.lineWidth = 20;
        ctx.lineCap = "square";
        ctx.globalAlpha = .7;
        if (showMaxDamage) {
            ctx.beginPath();
            ctx.lineCap = "round";
            if (1 == simData[maxDamagePointNum].selectNum)
                ctx.moveTo(simData[maxDamagePointNum].selectPoint[0].x * puyoWidth + puyoWidth / 2, simData[maxDamagePointNum].selectPoint[0].y * puyoHeight + puyoHeight / 2 + nextHeight),
                ctx.lineTo(simData[maxDamagePointNum].selectPoint[0].x * puyoWidth + puyoWidth / 2, simData[maxDamagePointNum].selectPoint[0].y * puyoHeight + puyoHeight / 2 + nextHeight);
            else {
                ctx.moveTo(simData[maxDamagePointNum].selectPoint[0].x * puyoWidth + puyoWidth / 2, simData[maxDamagePointNum].selectPoint[0].y * puyoHeight + puyoHeight / 2 + nextHeight);
                for (var a = 1; a < simData[maxDamagePointNum].selectNum; a++) {
                    var b = simData[maxDamagePointNum].selectPoint[a].x - simData[maxDamagePointNum].selectPoint[a - 1].x;
                    var c = simData[maxDamagePointNum].selectPoint[a].y - simData[maxDamagePointNum].selectPoint[a - 1].y;
                    (2 <= b || -2 >= b || 2 <= c || -2 >= c) && ctx.moveTo(simData[maxDamagePointNum].selectPoint[a - 2].x * puyoWidth + puyoWidth / 2, simData[maxDamagePointNum].selectPoint[a - 2].y * puyoHeight + puyoHeight / 2 + nextHeight);
                    ctx.lineTo(simData[maxDamagePointNum].selectPoint[a].x * puyoWidth + puyoWidth / 2, simData[maxDamagePointNum].selectPoint[a].y * puyoHeight + puyoHeight / 2 + nextHeight)
                }
            }
            ctx.strokeStyle = "#ff0000";
            ctx.stroke()
        }
        if (showMaxRensa) {
            ctx.beginPath();
            ctx.lineCap = "round";
            if (1 == simData[maxRensaPointNum].selectNum)
                ctx.moveTo(simData[maxRensaPointNum].selectPoint[0].x * puyoWidth + puyoWidth / 2, simData[maxRensaPointNum].selectPoint[0].y * puyoHeight + puyoHeight / 2 + nextHeight),
                ctx.lineTo(simData[maxRensaPointNum].selectPoint[0].x * puyoWidth + puyoWidth / 2, simData[maxRensaPointNum].selectPoint[0].y * puyoHeight + puyoHeight / 2 + nextHeight);
            else
                for (ctx.moveTo(simData[maxRensaPointNum].selectPoint[0].x * puyoWidth + puyoWidth / 2, simData[maxRensaPointNum].selectPoint[0].y * puyoHeight + puyoHeight / 2 + nextHeight),
                a = 1; a < simData[maxRensaPointNum].selectNum; a++)
                    b = simData[maxRensaPointNum].selectPoint[a].x - simData[maxRensaPointNum].selectPoint[a - 1].x,
                    c = simData[maxRensaPointNum].selectPoint[a].y - simData[maxRensaPointNum].selectPoint[a - 1].y,
                    (2 <= b || -2 >= b || 2 <= c || -2 >= c) && ctx.moveTo(simData[maxRensaPointNum].selectPoint[a - 2].x * puyoWidth + puyoWidth / 2, simData[maxRensaPointNum].selectPoint[a - 2].y * puyoHeight + puyoHeight / 2 + nextHeight),
                    ctx.lineTo(simData[maxRensaPointNum].selectPoint[a].x * puyoWidth + puyoWidth / 2, simData[maxRensaPointNum].selectPoint[a].y * puyoHeight + puyoHeight / 2 + nextHeight);
            ctx.strokeStyle = "#00ff00";
            ctx.stroke()
        }
        if (showMaxDeletePuyo) {
            ctx.beginPath();
            ctx.lineCap = "round";
            if (1 == simData[maxDeletePuyoPointNum].selectNum)
                ctx.moveTo(simData[maxDeletePuyoPointNum].selectPoint[0].x * puyoWidth + puyoWidth / 2, simData[maxDeletePuyoPointNum].selectPoint[0].y * puyoHeight + puyoHeight / 2 + nextHeight),
                ctx.lineTo(simData[maxDeletePuyoPointNum].selectPoint[0].x * puyoWidth + puyoWidth / 2, simData[maxDeletePuyoPointNum].selectPoint[0].y * puyoHeight + puyoHeight / 2 + nextHeight);
            else
                for (ctx.moveTo(simData[maxDeletePuyoPointNum].selectPoint[0].x * puyoWidth + puyoWidth / 2, simData[maxDeletePuyoPointNum].selectPoint[0].y * puyoHeight + puyoHeight / 2 + nextHeight),
                a = 1; a < simData[maxDeletePuyoPointNum].selectNum; a++)
                    b = simData[maxDeletePuyoPointNum].selectPoint[a].x - simData[maxDeletePuyoPointNum].selectPoint[a - 1].x,
                    c = simData[maxDeletePuyoPointNum].selectPoint[a].y - simData[maxDeletePuyoPointNum].selectPoint[a - 1].y,
                    (2 <= b || -2 >= b || 2 <= c || -2 >= c) && ctx.moveTo(simData[maxDeletePuyoPointNum].selectPoint[a - 2].x * puyoWidth + puyoWidth / 2, simData[maxDeletePuyoPointNum].selectPoint[a - 2].y * puyoHeight + puyoHeight / 2 + nextHeight),
                    ctx.lineTo(simData[maxDeletePuyoPointNum].selectPoint[a].x * puyoWidth + puyoWidth / 2, simData[maxDeletePuyoPointNum].selectPoint[a].y * puyoHeight + puyoHeight / 2 + nextHeight);
            ctx.strokeStyle = "#0000ff";
            ctx.stroke()
        }
        ctx.globalAlpha = 1
    }
}
function GetParam() {
    var a = {}
      , b = location.search.substring(1).split("&");
    if (0 == b.length)
        return null;
    for (var c = 0; c < b.length; c++) {
        var d = b[c].split("=");
        if (2 != d.length)
            return null;
        a[d[0]] = decodeURI(d[1])
    }
    return a
}
function UrlShow() {
    var a = $.param({
        x: xors.x,
        y: xors.y,
        z: xors.z,
        w: xors.w
    })
      , b = location.href.indexOf("?")
      , b = -1 == b ? location.href : location.href.slice(0, b);
    $("#url").val(b + "?" + a)
}
function fieldLoad(a, b) {
    if (selected || a.length != fieldHeight || b.length != fieldWidth)
        return !1;
    for (var c = 0; c < fieldHeight; c++)
        if (a[c].length != fieldWidth)
            return !1;
    for (c = 0; c < fieldHeight; c++)
        for (var d = 0; d < fieldWidth; d++)
            field[c][d] = a[c][d];
    for (d = 0; d < fieldWidth; d++)
        nextField[d] = b[d];
    return !0
}
xors = {
    x: 123456789,
    y: 362436069,
    z: 521288629,
    w: 88675123,
    seed: function(a) {
        xors.w = a
    },
    rand: function() {
        var a = xors.x ^ xors.x << 11;
        xors.x = xors.y;
        xors.y = xors.z;
        xors.z = xors.w;
        xors.w = xors.w ^ xors.w >>> 19 ^ a ^ a >>> 8;
        xors.w >>>= 0;
        return xors.w
    },
    load: function(a, b, c, d) {
        xors.x = a;
        xors.y = b;
        xors.z = c;
        xors.w = d
    }
};
