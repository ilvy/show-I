(function (jquery) {
    var flashWord = null;
    jquery.fn.showFlashWord = function(options) {
        return this.each(function () {
            options = jquery.extend(jquery.flashWord.defaults, options, { target: this });
            jquery.flashWord(options);
        });
    };
    jquery.fn.hideFlashWord = function() {
        jquery.flashWord.hide();
    };
    
    jquery.flashWord = function (options) {
        options = jquery.extend(jquery.flashWord.defaults, options);
        if (!flashWord) {
            flashWord = new FlashWord(options);
        }
    };
    jquery.flashWord.show = jquery.showFlashWord = function (options) {//定义显示闪烁的方法
        jquery.flashWord(options);

    };
    jquery.flashWord.hide = function () {//定义隐藏的方法
        window.clearInterval(jquery.flashWord.fps);
        jquery("#flash").remove();
        flashWord = null;//初始化状态
    };
    jquery.flashWord.defaults = { showStr: "发送中...", bigSize: 48, smallSize: 24, color: "#daa520", cssStyle: null, top: "45%", left: "45%", speed: 500, duration: 0, flashMode: 0,marginL:2,fontMargin:2 };

    function FlashWord(options) {
        this.init(options);
        var flashTop = jquery("#flash").css("top");
        flashTop = Number(flashTop.substring(0, flashTop.indexOf("p")));
        window.onscroll = function () {
            var top = document.documentElement.scrollTop || document.body.scrollTop;
            jquery("#flash").css("top", flashTop + top + "px");
        };
    }

    jquery.extend(FlashWord.prototype, {
        words: [],
        wordStr: "",
        strLen: 0,
        i: 0,//记录当前闪动字符下标
        init: function (options) {
            this.flashWords(options);
        },
        flashWords: function (options) { //文字闪动效果
            var showStr = options.showStr;
            this.strLen = showStr.length;
            var flashDiv = jquery("<div id='flash'  class='flash-word'><p class='single-word'>" + this.wordStr + "</p></div>");
            if (!options.target) { //jquery.调用
                jquery("body").append(flashDiv);
                if (options.cssStyle) {
                    jquery("#flash").css(options.cssStyle);//设置自定义css
                }
                jquery("#flash").css({ color: options.color, top: options.top, left: options.left });//设置颜色
                for (var i = 0; i < this.strLen; i++) {
                    this.words[i] = showStr.charAt(i); //将需要显示的字符串存入数组
                    var wordStr = "<p id='word" + i + "' class='single-word'>" + showStr.charAt(i) + "</p>";
                    jquery("#flash").append(wordStr);
                    jquery("#word" + i).css({
                        "left": (i + 1) * 40+i*options.fontMargin + "px",
                        "font-size": options.smallSize + "px",
                        "top": options.smallSize + "px"
                    });//设置每一个字的相对位置
                }
            } else {//jquery().调用
                jquery(options.target).append(flashDiv);
                options.cssStyle = jquery.extend({}, options.cssStyle, { position: "static" });
                jquery("#flash").css(options.cssStyle);
                for (i = 0; i < this.strLen; i++) {
                    this.words[i] = showStr.charAt(i); //将需要显示的字符串存入数组
                    wordStr = "<p id='word" + i + "' class='single-word'>" + showStr.charAt(i) + "</p>";
                    jquery("#flash").append(wordStr);
                    jquery("#word" + i).css({
                        "position":"static",
                        "font-size": options.smallSize + "px",
                        "margin-left": options.fontMargin + "px"
                    });//设置每一个字的相对位置
                }
            }
            
            //this.flash();
            var _this = this;
            jquery.flashWord.fps = window.setInterval(function () {//设置定时器
                if (options.flashMode === 0) {
                    _this.flash_size(options);
                } else {
                    _this.flash_flicker(options);
                }
            }, options.speed + options.duration); //记录帧，方便移除
        },
        flash_size: function (options) {

            jquery("#word" + this.i).animate({ fontSize: options.bigSize + "px", top: 0 - options.smallSize + "px", opacity: "0.2" }, options.speed / 2).animate({ fontSize: options.smallSize + "px", top: options.smallSize + "px", opacity: "1" }, options.speed / 2);
            this.i++;
            if (this.i >= this.strLen) {
                this.i = 0;
            }
        },
        flash_flicker: function (options) {
            jquery("#word" + this.i).animate({ opacity: "0.2" }, options.speed / 2).animate({ opacity: "1" }, options.speed / 2);
            this.i++;
            if (this.i >= this.strLen) {
                this.i = 0;
            }
        }
    });
})(jQuery);
