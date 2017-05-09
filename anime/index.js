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
        var table = $('<table id="anime-list" />');
        $("<tr style='font-weight: bold; text-align: center' />")
            .append($("<td/>").text("開始"))
            .append($("<td/>").text("チャネル"))
            .append($("<td/>").text("タイトル"))
            .append($("<td/>").text("サブタイトル")).appendTo(table);

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
                var startstyle = "<td />";
                var startmessage = "";

                if (vv["Warn"] == 1) {
                    startstyle = "<td style='color: #CC6666'/>";
                }

                if (enddt - nowdt < 0) {
                    return
                } else if (startdt > nowdt && 
                    startdt - nowdt.setMinutes(nowdt.getMinutes()-2) < 0) {
                    startstyle = "<td style='color: #B294BB' />";
                    startmessage = "SOON"
                } else if (nowdt - startdt > 0) {
                    startstyle = "<td style='color: #F0C674' />";
                    startmessage = "ONAIR"
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

                $('<tr/>')
                    .append($(startstyle).text(start))
                    .append($("<td />").text(vv["ChName"]))
                    .append($("<td/>")
                        .append("<a href='http://cal.syoboi.jp/tid/" + 
                        vv["TID"] + "#" + vv["PID"] + "'" + 
                        "style='color: #81A2BE'>" +
                        slim(vv["Title"], 32) + "</a>"))
                    .append($("<td />").text(vv["SubTitle"]))
                    .appendTo(table);
            });
        });
        $(table).appendTo("#anime");
    });
};

$.get('https://noyuno.github.io/data/anime-keyword', function (keyword) {
    print($.grep(keyword.split(/\n/), function (e) { return e !== ""; }));
});

function search() {
    // Declare variables 
    var input, filter, table, tr, td, i;
    input = $("#search");
    filter = input.val().toLowerCase();
    table = $("#anime-list");
    tr = $("#anime-list tr");
    var c = 0;

    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
            if (td.textContent.toLowerCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                c++;
            } else {
                tr[i].style.display = "none";
            }
        } 
    }
}

window.onload = function () {
    $("#search").focus();
};
