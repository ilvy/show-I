(function(window) {
    var ctx, winH, winW;
    var bgImg = utils.createImg("images/skybg.png"),
        rockImg = utils.createImg("images/rock.png"),
        goldImg = utils.createImg("images/gold.png"),
        manImg = utils.createImg("images/man.png"),
        leftImgs = [utils.createImg("images/left1.png"),utils.createImg("images/left2.png"),manImg],
        rightImgs = [utils.createImg("images/right1.png"),utils.createImg("images/right2.png"),manImg];

    var rocks = [],golds = [];
    var ftp = "";
    var score = 0;
    var bgPos = {
        x: 0,
        y: 0,
        bgWid:0,
        moveStep: 50,
        init:function() {
            this.bgWid = bgImg.width;
        },
        updatePos:function() {
            if (winW - this.x + this.moveStep >= this.bgWid) {
                this.x = 0;
            } else {
                this.x -= 5;
            }
        }
    };
    function Rockrain(canvas,context) {
        ctx = context;
        winH = canvas.height;
        winW = canvas.width;
        //bgImg = document.getElementById("bg");
        //document.getElementById("body").appendChild(bgImg);
        this.init();
    }

    var _rr;
    Rockrain.prototype = {
        init: function () {
            bgPos.init();
            initRocks(10);
            initGolds(3);
            man.init().addTouchListener();
            _rr = this;
            ftp = setInterval(function() {
                _rr.run();
            },30);
            //ctx.drawImage(manImg,0,0, manImg.width, manImg.height, 100, 100, manImg.width * 0.5, manImg.height * 0.5);
        },
        /**
         *@desc:执行帧
        */
        run:function() {
            this.setBg();
            this.updateMan();
            this.updateRocks();
            this.updateBonus();
            this.updateScore();
            for (var i = 0; i < rocks.length; i++) {
                if (utils.collisionMultiRects(man.rects, rocks[i].rect)) {
                    clearInterval(ftp);
                    setTimeout(function() {
                        window.location.href = "index.html";
                    }, 1000);
                    
                }
            }
            
        },
        setBg: function () {
            ctx.beginPath();
            ctx.fillStyle = "#ffffff";
            ctx.drawImage(bgImg, bgPos.x, bgPos.y, bgImg.width, winH);
            ctx.closePath();
            ctx.stroke();
            bgPos.updatePos();
        },
        updateMan:function() {
            man.draw();
        },
        updateRocks:function() {
            var rockNum = rocks.length;
            var rock;
            for (var i = 0; i < rockNum; i++) {
                rock = rocks[i];
                rock.updateAndDraw();
            }
        },
        updateBonus:function() {
            var goldNum = golds.length;
            var gold;
            for (var i = 0; i < goldNum; i++) {
                gold = golds[i];
                gold.updateAndDraw();
            }
        },
        updateScore: function () {
            ctx.beginPath();
            ctx.font = "bold 10px 幼圆";
            var scoreStr = "当前得分：" + score;
            var met = ctx.measureText(scoreStr);
            ctx.fillStyle = "#000000";
            ctx.fillText(scoreStr, 0, winH - 200, 120);
            ctx.closePath();
            ctx.stroke();
        },
        updateScoreRecord:function() {
            var preRecord = localStorage.getItem("rr_scoreRecord");
            if (preRecord) {
                if (preRecord < score) {
                    localStorage.setItem("rr_scoreRecord", score);
                }
            } else {
                localStorage.setItem("rr_scoreRecord", score);
            }
        }
    };
    
    var man = {
        x: 0,
        y: 0,
        width: 0,
        touchCount:0,
        currImg: '',
        actionCount: 0,
        isRunning: false,
        currDir: "",
        currActions: '',//记录当前动作图像数组
        rects:[],
        init:function() {
            this.x = winW / 2;
            this.y = winH - manImg.height / 2 - 50;
            this.width = manImg.width * 0.5;
            this.height = manImg.height * 0.5;
            this.rects[0] = new Rect(Math.floor(this.x + this.width/ 4), this.y+30, Math.floor(this.width / 2), this.height);
            return this;
        },
        update: function (direction) {
            this.isRunning = true;
            if (direction != this.currDir) {
                this.touchCount = 0;
                this.currDir = direction;
            }
            this.touchCount++;
        },
        move:function(currDir) {
            if (currDir == 1) {
                this.x += 10;
                this.rects[0].x += 10;
            } else {
                this.x -= 10;
                this.rects[0].x -= 10;
            }
            
        },
        draw: function () {
            if (!this.touchCount) {
                //ctx.drawImage(manImg, this.x, this.y);
                ctx.drawImage(manImg, 0, 0, manImg.width, manImg.height, this.x, this.y, manImg.width * 0.5, manImg.height * 0.5);
            } else {
                if (this.currDir == 1) {
                    this.currActions = rightImgs;
                } else {
                    this.currActions = leftImgs;
                }
                if (this.actionCount % 3 == 0) {
                    this.move(this.currDir);
                }
                
                if (this.actionCount / 3 < 1) {
                    //ctx.drawImage(this.currActions[0], this.x, this.y);
                    ctx.drawImage(this.currActions[0], 0, 0, manImg.width, manImg.height, this.x, this.y, manImg.width * 0.5, manImg.height * 0.5);
                    this.actionCount++;
                } else if (this.actionCount / 3 < 2) {
                    //ctx.drawImage(this.currActions[1], this.x, this.y);
                    ctx.drawImage(this.currActions[1], 0, 0, manImg.width, manImg.height, this.x, this.y, manImg.width * 0.5, manImg.height * 0.5);
                    this.actionCount++;
                } else if (this.actionCount / 3 < 3) {
                    if (this.touchCount > 0) {
                        this.touchCount--;
                        this.actionCount = 0;
                    } else {
                        this.isRunning = false;
                        this.move(this.currDir);
                        this.actionCount = 0;
                        this.touchCount = 0;
                    }
                }
            } 
        },
        addTouchListener:function() {
            document.addEventListener(touchEvent.touchstart, this.touchstartHandler,this);
        },
        touchstartHandler:function(event) {
            console.log(event);
            var touchEvent = event;
            var that = man;
            if (touchEvent.originalEvent) {
                console.log(touchEvent.originalEvent);
                touchEvent = touchEvent.originalEvent.targetTouches[0];
            } else if (touchEvent.targetTouches) {
                touchEvent = touchEvent.targetTouches[0];
            }
            var clientX = touchEvent.clientX;
            if (clientX + 10 < that.x) {//man左移
                that.update(-1);
                console.log("left:" + clientX);
                //that.dirArr.push(-1);
            } else if (clientX - 10 > that.x + that.width) {//man右移
                that.update(1);
                console.log("right:" + clientX);
                //that.dirArr.push(1);
            }
        }
    };

    function initRocks(rockNum) {
        for (var i = 0; i < rockNum; i++) {
            rocks.push(new Rock(winW, winH).init());
        }
    }

    function Rock(winW,winH) {
        this.x = 0;
        this.y = 0;
        this.vX = 0;
        this.vY = 0;
        this.w = 0;
        this.h = 0;
        this.isDeath = 0;//判断是否超出屏幕范围
        this.rect = null;
        this.init = function (isStraight) {
            if (isStraight) {
                this.vX = 0;
            } else {
            var positive = Math.random() < 0.5 ? true : false;
            if (positive) {
                    this.vX = Math.random() * 5 + 3;
                } else {
                    this.vX = -Math.random() * 5 + 3;
                }
            }
            this.w = rockImg.width;
            this.h = rockImg.height;
            this.x = Math.floor(winW * Math.random());
            this.y = Math.floor(-300 * Math.random());
            this.vY = Math.random() * 10 + 10;
            
            this.rect = new Rect(this.x, this.y, this.w, this.h);
            return this;
        };
        this.updateAndDraw = function() {
            if (this.checkDeath()) {
                this.init();
            }
            ctx.drawImage(rockImg, this.x, this.y, this.w, this.h);
            this.x += this.vX;
            this.y += this.vY;
            this.rect.x = this.x;
            this.rect.y = this.y;
        };
        this.checkDeath = function() {
            if (this.x >= winW || this.x + rockImg.width <= 0 || this.y >= winH) {//death
                return true;
            } else {
                return false;
            }
        };
        this.init();
        return this;
    }

    function initGolds(goldNum) {
        if (!goldNum) {
            goldNum = 3;
        }
        for (var i = 0; i < goldNum; i++) {
            golds.push(new Gold().init());
        }
    }

    function Gold() {
        this.x = 0;
        this.y = 0;
        this.vX = 0;
        this.vY = 0;
        this.init = function () {
            this.w = goldImg.width;
            this.h = goldImg.height;
            this.x = Math.floor(winW * Math.random());
            this.y = Math.floor(-500 * Math.random());
            this.vY = Math.random() * 20 + 10;
            this.rect = new Rect(this.x, this.y, this.w, this.h);
            return this;
        };
        this.updateAndDraw = function () {
            if (this.checkDeath() || this.isAbsorbed()) {
                this.init();
            }
            ctx.drawImage(goldImg, this.x, this.y, this.w, this.h);
            this.x += this.vX;
            this.y += this.vY;
            this.rect.y = this.y;
        };

        this.isAbsorbed = function() {
            if (utils.collisionMultiRects(this.rect, man.rects)) {
                score += 10;
                //TODO 添加音频文件
                return true;
            }
        };

        this.checkDeath = function () {
            if (this.x >= winW || this.x + goldImg.width <= 0 || this.y >= winH) {//death
                return true;
            } else {
                return false;
            }
        };
        
    }


    function Rect(x0,y0,width,height) {
        this.x = x0;
        this.y = y0;
        this.width = width;
        this.height = height;
    }
    window.Rockrain = Rockrain;
})(window);