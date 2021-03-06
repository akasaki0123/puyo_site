function CharcterData(a, c, b, d) {
    this.name = a;
    this.atack = c;
    this.color = b;
    this.subColor = d
}
function GroupData(a, c, b, d, e, f) {
    this.name = a;
    this.skillAbout = c;
    this.lPassiveSkill = b;
    this.lActiveSkill = d;
    this.charData = e;
    this.comb = f
}
var coolSchezo = new CharcterData("\u30af\u30fc\u30eb\u306a\u30b7\u30a7\u30be",1,purple,noneColor)
  , satan = new CharcterData("\u304d\u3044\u308d\u3044\u30b5\u30bf\u30f3",1944,yellow,green)
  , kuro = new CharcterData("\u304f\u308d\u3044\u30b7\u30b0",2408,blue,red)
  , rega = new CharcterData("\u30ec\u30ac\u30e0\u30f3\u30c8",2286,yellow,purple)
  , vest = new CharcterData("\u30d9\u30b9\u30c8\u30fc\u30eb",2280,yellow,noneColor)
  , kikuru = new CharcterData("<span class='smallName'>\u304d\u3044\u308d\u3044\u3042\u3084\u3057\u3044\u30af\u30eb\u30fc\u30af</span>",3057,yellow,noneColor)
  , maguro = new CharcterData("\u65c5\u306e\u9b54\u6cd5\u4f7f\u3044\u307e\u3050\u308d",2306,blue,yellow)
  , mars = new CharcterData("\u30de\u30eb\u30b9",1914,red,yellow)
  , unya = new CharcterData("\u30a6\u30fc\u30cb\u30e3",1454,yellow,noneColor)
  , remi = new CharcterData("\u30ec\u30df",1460,green,noneColor)
  , monica = new CharcterData("\u30e2\u30cb\u30ab",1466,red,noneColor)
  , vivian = new CharcterData("\u30f4\u30a3\u30f4\u30a3\u30a2\u30f3",1460,blue,noneColor)
  , dina = new CharcterData("\u30c7\u30a3\u30fc\u30ca",1590,yellow,noneColor)
  , sphinx = new CharcterData("\u30b9\u30d5\u30a3\u30f3\u30af\u30b9",1453,yellow,noneColor)
  , grouplistNum = 8
  , group = []
  , selectGroupNum = 0;
group[0] = new GroupData("\u30af\u30fc\u30eb\u306a\u30b7\u30a7\u30be","\u653b\u6483\u529b3\u500d",NonPassiveSkill,NonActiveSkill,[coolSchezo, coolSchezo, coolSchezo],!1);
group[1] = new GroupData("\u304f\u308d\u3044\u30b7\u30b0","\u653b\u6483\u529b3\u500d",lPS3up,NonActiveSkill,[kuro, satan, coolSchezo],!0);
group[2] = new GroupData("\u30ec\u30ac\u30e0\u30f3\u30c8","\u653b\u6483\u529b1.6\u500d\u30013\u9023\u9396\u3067\u3055\u3089\u306b\u653b\u6483\u529b2.5\u500d",lPS1_6up,ActivRegaSkill,[rega, kuro, coolSchezo],!0);
group[3] = new GroupData("\u304d\u3044\u308d\u3044\u30b5\u30bf\u30f3","\uff14\u8272\u4ee5\u4e0a\u6d88\u3059\u3068\u653b\u6483\u529b4\u500d",NonPassiveSkill,SatanSkill,[satan, kuro, coolSchezo],!0);
group[4] = new GroupData("\u9b54\u7363\uff13\u8272","\u653b\u6483\u529b3.5\u500d",lPS3_5up,NonActiveSkill,[unya, remi, monica],!0);
group[5] = new GroupData("\u9b54\u7363\u5358\u8272","\u653b\u6483\u529b3.5\u500d",lPS3_5up,NonActiveSkill,[unya, dina, sphinx],!0);
group[6] = new GroupData("\u30d9\u30b9\u30c8\u30fc\u30eb\uff13\u8272","\u653b\u6483\u529b4\u500d",lPS3up,NonActiveSkill,[vest, maguro, mars],!0);
group[7] = new GroupData("\u30d9\u30b9\u30c8\u30fc\u30eb\u5358\u8272","\u653b\u6483\u529b4\u500d",lPS4up,NonActiveSkill,[vest, kikuru, rega],!0);
function GropSelectBox() {
    for (var a = 0; a < grouplistNum; a++)
        $("#groupSelect").append('<option value="' + a + '">' + group[a].name + "</option>")
}
function GroupSelect(a) {
    var c = selectGroupNum;
    selectGroupNum = a;
    var b = [];
    b[0] = new Image;
    b[1] = new Image;
    b[2] = new Image;
    b[0].onload = function() {
        $("#charImg1").attr("src", GetCardFileName(group[a].charData[0]))
    }
    ;
    b[1].onload = function() {
        $("#charImg2").attr("src", GetCardFileName(group[a].charData[1]))
    }
    ;
    b[2].onload = function() {
        $("#charImg3").attr("src", GetCardFileName(group[a].charData[2]))
    }
    ;
    b[0].src = GetCardFileName(group[a].charData[0]);
    b[1].src = GetCardFileName(group[a].charData[1]);
    b[2].src = GetCardFileName(group[a].charData[2]);
    c = group[c];
    b = group[selectGroupNum];
    $("#charName1").removeClass(GetColorName(c.charData[0].color));
    $("#charName1").addClass(GetColorName(b.charData[0].color));
    $("#charName1").html(group[a].charData[0].name);
    $("#charName2").removeClass(GetColorName(c.charData[1].color));
    $("#charName2").addClass(GetColorName(b.charData[1].color));
    $("#charName2").html(group[a].charData[1].name);
    $("#charName3").removeClass(GetColorName(c.charData[2].color));
    $("#charName3").addClass(GetColorName(b.charData[2].color));
    $("#charName3").html(group[a].charData[2].name);
    $("#skillAbout").html("\u30ea\u30fc\u30c0\u30fc\u30b9\u30ad\u30eb\uff1a" + group[a].skillAbout);
    $("#atack1").removeClass(GetColorName(c.charData[0].color));
    $("#atack1").addClass(GetColorName(b.charData[0].color));
    c.charData[0].subColor != noneColor && $("#subAtack1").removeClass(GetColorName(c.charData[0].subColor));
    b.charData[0].subColor != noneColor && $("#subAtack1").addClass(GetColorName(b.charData[0].subColor));
    $("#atack2").removeClass(GetColorName(c.charData[1].color));
    $("#atack2").addClass(GetColorName(b.charData[1].color));
    c.charData[1].subColor != noneColor && $("#subAtack2").removeClass(GetColorName(c.charData[1].subColor));
    b.charData[1].subColor != noneColor && $("#subAtack2").addClass(GetColorName(b.charData[1].subColor));
    $("#atack3").removeClass(GetColorName(c.charData[2].color));
    $("#atack3").addClass(GetColorName(b.charData[2].color));
    c.charData[2].subColor != noneColor && $("#subAtack3").removeClass(GetColorName(c.charData[2].subColor));
    b.charData[2].subColor != noneColor && $("#subAtack3").addClass(GetColorName(b.charData[2].subColor))
}
function NonPassiveSkill(a) {
    return a
}
function lPS1_6up(a) {
    return 1.6 * a
}
function lPS3up(a) {
    return 3 * a
}
function lPS3_5up(a) {
    return 3.5 * a
}
function lPS4up(a) {
    return 4 * a
}
function NonActiveSkill(a, c, b) {
    return a
}
function SatanSkill(a, c, b) {
    for (var d = c = 0; 5 > d; d++)
        b[d] && c++;
    return 4 <= c ? 4 * a : a
}
function ActivRegaSkill(a, c, b) {
    return 3 <= c ? 2.5 * a : a
}
function GetCardFileName(a) {
    var c = GetColorName(a.color);
    a = GetColorName(a.subColor);
    return void 0 == a ? "../img/card/" + c + ".png" : "../img/card/" + c + "_" + a + ".png"
}
function GetColorName(a) {
    switch (a) {
    case purple:
        return "purple";
    case yellow:
        return "yellow";
    case red:
        return "red";
    case green:
        return "green";
    case blue:
        return "blue"
    }
}
;