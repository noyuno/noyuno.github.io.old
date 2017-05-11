"use strict";

var game;
var leftkey, rightkey, upkey, downkey, shiftkey;
leftkey = rightkey = upkey = downkey = shiftkey = false;

var getDevice = (function(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return "mobile";
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        return "mobile";
    }else{
        return "pc";
    }
})();

var arrowkey = function(f, e) {
    var linkar = [["anime"], ["3d"], ["dotfiles"], ["labo"], ["paint"], ["link"], 
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
            game.startgame();
        } else {
            for (var i in linkar) {
                if (linkar[i][linkar[i].length == 1 ? 0 : 1].charAt(0) == c) {
                    location.href = document.getElementById(linkar[i][0]).href;
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

class Box {
    constructor (x, yv, ya, r, maxcircle) {
        this.x = x;
        this.yv = yv;
        this.ya = ya;
        this.y = -maxcircle;
        this.r = r;
        this.rm = false;
    }
    next() {
        this.yv += this.ya;
        this.y += this.yv;
    }
}

class Game {

    constructor() {
        this.canvaswidth = 2000;
        this.canvasheight = 2000;
        this.gamestart = false;

        this.myy = 0;
        this.myx = 0;
        this.myd = 10;
        this.mycol = 0;
        this.collision = false;
        this.score = 0;
        this.array = [];

        this.cs  = document.getElementById('canvas');
        this.cs.width = 2000;
        this.cs.height = 2000;
        this.ctx = this.cs.getContext('2d');
        this.ctx.strokeStyle = "lightgray";
        this.ctx.fillStyle = "lightgray";
        this.ctx.lineWidth = 10;
        this.w = this.cs.width;
        this.h = this.cs.height;
        this.x = 0;
        this.maxcircle = 120;
        this.mincircle = 6;
        this.count = 0;
        this.timer = null;
    }

    loop() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.globalAlpha = 0.3;
        this.ctx.strokeStyle = "lightgray";
        this.ctx.fillStyle = "lightgray";
        var r = Math.random();
        if (r<window.innerWidth/300000 || 
            (this.gamestart && r < window.innerWidth/5000)) {
            this.array.push(new Box(
                Math.random()*window.innerWidth,
                Math.random()*1,
                Math.random()*0.1, 
                Math.max(Math.random() * this.maxcircle, this.mincircle),
                this.maxcircle));
            if (this.gamestart && this.collision  == false)
                document.getElementById("score").innerText = ++this.score;
        }
        for(var i = 0; i < this.array.length; i++) {
            this.array[i].next();
            if (this.array[i].y > window.innerHeight + this.maxcircle) {
                this.array[i].rm = true;
                continue;
            }
            if (this.gamestart) {
                var dr = Math.sqrt(Math.pow(this.myx - this.array[i].x, 2) +
                    Math.pow(this.myy - this.array[i].y, 2));
                if (dr <= this.array[i].r + this.mycol) {
                    this.collision = true;
                }
            }
            this.ctx.lineWidth = 1;//this.array[i].r*2;
            this.ctx.globalAlpha = 
                -(0.4-0.05)/(this.maxcircle-this.mincircle)*this.array[i].r+0.4+0.05;
            this.ctx.beginPath();
            this.ctx.arc(this.array[i].x, this.array[i].y, this.array[i].r, 0, Math.PI*2, true);
            this.ctx.stroke();
            this.ctx.fill();
        }

        for (var i = 0; this.count % 100 == 0 && i < this.array.length; i++) {
            if (this.array[i].rm == true) {
                this.array.splice(i, 1);
            }
        }

        // my
        var t = shiftkey ? this.myd / 3 : this.myd;
        if (rightkey) this.myx = Math.min(window.innerWidth, this.myx + t);
        if (leftkey)  this.myx = Math.max(0, this.myx - t);
        if (upkey)    this.myy = Math.max(0, this.myy - t);
        if (downkey)  this.myy = Math.min(window.innerHeight, this.myy + t);
        
        if (this.collision) {
            this.ctx.strokeStyle = "darkorange";
            this.ctx.fillStyle = "darkorange";
        } else {
            this.ctx.strokeStyle = "lightgray";
            this.ctx.fillStyle = "lightgray";
        }
        if (this.gamestart) {
            this.ctx.globalAlpha = 0.8;
            this.ctx.beginPath();
            this.ctx.moveTo(this.myx, this.myy - 10);
            this.ctx.lineTo(this.myx - 10, this.myy + 10);
            this.ctx.lineTo(this.myx + 10, this.myy + 10);
            this.ctx.closePath();
            this.ctx.fill();
        }
        this.count++;
    }

    startanimation() {
        var instance = this;
        if (this.timer == null) {
            this.timer = setInterval(function () {
                instance.loop();
            }, 1000/30);
        }
    }
    
    startgame() {
        this.startanimation();
        this.gamestart = true;
        this.score = 0;
        this.collision = false;
        this.array.splice(0, this.array.length);
        this.myy = window.innerHeight * 4 / 5;
        this.myx = window.innerWidth / 2;
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }
}

window.onload = function () {
    game = new Game();
    if (getDevice == "pc") {
        game.startanimation();
    }
    $("#start").click(function () {
        game.startgame();
    });
    $("#stop").click(function () {
        game.stop();
    });
    $("#secret").click(toggle);
};

// show hidden menu
var ishidden = true;
function toggle() {
    var e = document.getElementsByClassName("hidden")
    var c = ishidden ? "block" : "none";
    for (var i = 0; i < e.length; i++) {
        e[i].style.display = c;
    }
    ishidden = !ishidden;
}

