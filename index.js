canvaswidth = 2000;
canvasheight = 2000;
gamestart = false;
var start = function() {
    gamestart = true;
    score = 0;
    collision = false;
    array.splice(0, array.length);
    myy = window.innerHeight * 4 / 5;
    myx = window.innerWidth / 2;
};
myy = 0;
myx = 0;
myd = 10;
mycol = 0;
collision = false;
score = 0;
var array = [];

leftkey = rightkey = upkey = downkey = shiftkey = false;

var go = function(i) {
    location.href = document.getElementById(i).href;
};

var arrowkey = function(f, e) {
    var linkar = [["anime"], ["dotfiles"], ["labo"], ["paint"], ["link"], 
        ["github"], ["bitbucket", "i"], ["blog"]];
    shiftkey = e.shiftKey;
    switch (e.keyCode) {
        case 39: // right
            rightkey = f;
            return;
        case 37: // left
            leftkey = f;
            return;
        case 38: //up
            upkey = f;
            return;
        case 40: //down
            downkey = f;
            return;
    }
    if (f == true) {
        var c = String.fromCharCode(e.keyCode).toLowerCase();
        if (c == 's') {
            start();
        } else {
            for (i in linkar) {
                if (linkar[i][linkar[i].length == 1 ? 0 : 1].charAt(0) == c) {
                    go(linkar[i][0]);
                    break;
                } 
            }
        }
    }
}

document.onkeydown = function (e) {
    arrowkey(true, e);
};

document.onkeyup = function (e) {
    arrowkey(false, e);
};

window.onload = function () {
    var cs  = document.getElementById('canvas');
    cs.width = 2000;
    cs.height = 2000;
    var ctx = cs.getContext('2d');
    ctx.strokeStyle = "lightgray";
    ctx.fillStyle = "lightgray";
    ctx.lineWidth = 10;
    var w = cs.width;
    var h = cs.height;
    var x = 0;
    var maxcircle = 120;
    var mincircle = 6;
    var count = 0;

    function box(x, yv, ya, r) {
        this.x = x;
        this.yv = yv;
        this.ya = ya;
        this.y = -maxcircle;
        this.r = r;
        this.rm = false;
    }
    box.prototype = {
        next: function() {
            this.yv += this.ya;
            this.y += this.yv;
        }
    };

    setInterval(function () {
        ctx.clearRect(0, 0, w, h);
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = "lightgray";
        ctx.fillStyle = "lightgray";
        r = Math.random();
        if (r<window.innerWidth/300000 || 
            (gamestart && r<window.innerWidth/5000)) {
            array.push(new box(
                Math.random()*window.innerWidth,
                Math.random()*1,
                Math.random()*0.1, 
                Math.max(Math.random()*maxcircle, mincircle)));
            if (gamestart && collision  == false)
                document.getElementById("score").innerText = ++score;
        }
        for(i = 0; i < array.length; i++) {
            array[i].next();
            if (array[i].y > window.innerHeight + maxcircle) {
                array[i].rm = true;
                continue;
            }
            if (gamestart) {
                dr = Math.sqrt(Math.pow(myx - array[i].x, 2) +
                    Math.pow(myy - array[i].y, 2));
                if (dr <= array[i].r + mycol) {
                    collision = true;
                }
            }
            ctx.lineWidth = 1;//array[i].r*2;
            ctx.globalAlpha = 
                -(0.4-0.05)/(maxcircle-mincircle)*array[i].r+0.4+0.05;
            ctx.beginPath();
            ctx.arc(array[i].x, array[i].y, array[i].r, 0, Math.PI*2, true);
            ctx.stroke();
            ctx.fill();
        }

        for (i = 0; count % 100 == 0 && i < array.length; i++) {
            if (array[i].rm == true) {
                array.splice(i, 1);
            }
        }

        // my
        t = shiftkey ? myd / 3 : myd;
        if (rightkey) myx = Math.min(window.innerWidth, myx + t);
        if (leftkey)  myx = Math.max(0, myx - t);
        if (upkey)    myy = Math.max(0, myy - t);
        if (downkey)  myy = Math.min(window.innerHeight, myy + t);
        
        if (collision) {
            ctx.strokeStyle = "darkorange";
            ctx.fillStyle = "darkorange";
        } else {
            ctx.strokeStyle = "lightgray";
            ctx.fillStyle = "lightgray";
        }
        if (gamestart) {
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.moveTo(myx, myy - 10);
            ctx.lineTo(myx - 10, myy + 10);
            ctx.lineTo(myx + 10, myy + 10);
            ctx.closePath();
            ctx.fill();
        }
        count++;
    }, 1000/30);
};

// show hidden elements
ishidden = true;
function toggle() {
    e = document.getElementsByClassName("hidden")
    c = ishidden ? "block" : "none";
    for (var i = 0; i < e.length; i++) {
        e[i].style.display = c;
    }
    ishidden = !ishidden;
}

