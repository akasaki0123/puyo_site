﻿$(function(){NotPcLink()});
function NotPcLink(){var b='\t<p style="font-size:20px;background-color:#ffe4e1;">\n\u73fe\u5728PC\u7248\u306e\u30da\u30fc\u30b8\u3092\u8868\u793a\u3057\u3066\u3044\u307e\u3059\u3002<br />\n'+('\u30b9\u30de\u30db\u3092\u304a\u4f7f\u3044\u306e\u65b9\u306f<a href="http://puyosim.com/smp/'+window.location.href.split("/").pop()+'">\u3053\u3061\u3089\u3078</a>\n');b+="</p>\n";var a=navigator.userAgent;-1==a.search(/iPhone/)&&-1==a.search(/iPad/)&&-1==a.search(/iPod/)&&-1==a.search(/Android/)||$("body").prepend(b)}
;