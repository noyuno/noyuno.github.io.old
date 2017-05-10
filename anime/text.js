"use strict";

var zerofill = function (i) {
    var s = String(i);
    if (s.length == 1) {
        return "0" + s;
    } else {
        return s;
    }
};

var slim = function (s, n) {
    var t = 0;
    var i = 0;
    for ( ; i < s.length && t < n; i++) {
        var c = s.charCodeAt(i);
        if ( (c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            t += 1;
        } else {
            t += 2;
        }
    }
    return s.substr(0, i);
};


var print = function (keyword) {
    $.getJSON("https://noyuno.github.io/data/anime", function (data) {

        $.each(data, function(k, v) {
            $.each(v, function (kk, vv) {
                if (vv["Title"] == undefined) {
                    return
                }
                var matched = false;
                for (var ki = 0; ki < keyword.length; ki++) {
                    if (vv["Title"].indexOf(keyword[ki]) != -1) {
                        // match
                        matched = true;
                        break
                    }
                }
                if (!matched) {
                    return
                }

                var startdt = new Date(vv["StTime"] * 1000);
                var enddt = new Date(vv["EdTime"] * 1000);
                var nowdt = new Date();
                var startstyle = "";
                var startmessage = "";
                var startmessage2 = "";

                if (vv["Warn"] == 1) {
                    startstyle = "#CC6666";
                }

                if (enddt - nowdt < 0) {
                    return
                } else if (startdt > nowdt && 
                    startdt - nowdt.setMinutes(nowdt.getMinutes()-2) < 0) {
                    startstyle = "#B294BB";
                    startmessage = "まもなく"
                } else if (nowdt - startdt > 0) {
                    startstyle = "#F0C674";
                    startmessage2 = "が放送中"
                }
                if (startmessage == "") {
                    var start = zerofill(startdt.getMonth() + 1) + "/" +
                        zerofill(startdt.getDate()) + " " +
                        zerofill(startdt.getHours()) + ":" +
                        zerofill(startdt.getMinutes());
                } else {
                    var start = startmessage + " " +
                        zerofill(startdt.getHours()) + ":" +
                        zerofill(startdt.getMinutes());
                }

                $("#anime-banner").css("color", startstyle).text(
                    start + "から" + vv["ChName"] + "で「" + 
                    slim(vv["Title"], 32) + "」" + startmessage2);
                return false;
            });
        });
    });
};

$.get('https://noyuno.github.io/data/anime-keyword', function (keyword) {
    print($.grep(keyword.split(/\n/), function (e) { return e !== ""; }));
});

