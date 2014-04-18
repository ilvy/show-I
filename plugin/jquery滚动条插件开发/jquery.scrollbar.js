(function (jQuery) {

    var scroll = null;

    jQuery.fn.addScroll = function (options) {

        return this.each(function () {
            scroll = new Scroll(this, options);
        });
    };

    /*
     *@desc:刷新滚动条
     */
    jQuery.refreshScroll = function () {
        if (!scroll) {
            return;
        }
        scroll.renderScroll();
    }

    function Scroll(element, options) {
        this.init(element, options);
    }

    /*
    *@desc:默认属性
    * mode:滚动条位置（left，bottom）;target：移动目标id
    */
    $.fn.addScroll.defaults = {
        mode: "bottom",
        target: "",
        dMarginLeft: 0,
        dMarginTop: 0,
        dMargin: 0,
        isRefresh: false,
        bgColor: "#eeeeee",
        ballColor: "white",
        isHideBg: false
    };

    var defaulWidth = 35;//滚动条默认宽度
    var scrollBall = {
        left: 0,
        top: 0,
        startMove: 0,
        size: 0,
        defaultWidth: 15
    };

    var movingTarget = {
        left: 0,
        top: 0,
        startMove: 0
    };

    var element = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        intimeLeft: 0,
        intimeTop: 0,
        intimeWidth: 0,
        intimeHeight: 0,
        isChanged: function () {

            return (Math.abs(this.left - this.intimeLeft) > 0.01 || Math.abs(this.height - this.intimeHeight) > 0.01 || Math.abs(this.width - this.intimeWidth) > 0.01 || Math.abs(this.top - this.intimeTop) > 0.01);

        }

    }

    var isDrag = false;

    var hasScrollLisener = false;

    $.extend(Scroll.prototype, {
        init: function (element, options) {
            this.options = $.extend({}, $.fn.addScroll.defaults, options);
            this.$element = $(element);         //需要加滚动条的容器
            this.$movingTarget = $(this.options.target);//设置需要移动的目标

            this.$element.append('<div id="scrollbar"><div id="stick"></div><div id="scrollBall"><a><div class="white-ball" id="scrollBallImg"></div></a></div></div>');

            $("#scrollbar").addClass("scrollbar-" + this.options.mode);
            $("#scrollBall").addClass("scrollBall-" + this.options.mode);
            $("#stick").addClass("stick-" + this.options.mode);

            this.renderScroll();
            this.refreshListener();

        },

        /*
         *@desc:根据需要开启刷新滚动条的监听器
         */
        refreshListener: function () {
            //若用户需要刷新
            if (this.options.isRefresh) {
                var _this = this;

                window.setInterval(function () {
                    element.intimeLeft = _this.$element.offset().left;
                    element.intimeTop = _this.$element.offset().top;
                    element.intimeWidth = _this.$element.width();
                    element.intimeHeight = _this.$element.height();
                    if (element.isChanged()) {
                        _this.renderScroll();
                    }

                }, 10);
            }
        },


        /*
        * @desc:渲染滚动条
        * */
        renderScroll: function () {

            var _this = this;

            $("#scrollbar").ready(function () {

                //设置滚动条位置
                _this.setScroll();

                _this.$scrollbar = $("#scrollbar");
                _this.$scrollBall = $("#scrollBall");
                scrollBall.size = $("#scrollBall").width();
                /*
                 *   获取需要移动目标的宽度,并计算超出容器部分，获取滚动条长度
                 */

                _this.getMovingTargetOverRange();
                /*
                 *   滚动条滚动范围设置
                 */
                _this.setDragRange();

                //计算滚动条移动距离与需要移动目标的移动距离对应
                _this.calcMovingRatio();

                _this.addScrollListener();
            });
        },

        /**
        * @desc:添加滚动条并设置滚动条位置
        * */
        setScroll: function () {


            var dMarginTop = this.options.dMarginTop;
            var dMarginLeft = this.options.dMarginLeft;


            var elewidth = this.$element.width();
            var eleOffsettop = this.$element.offset().top;
            var eleHeight = this.$element.height();
            var eleOffsetLeft = this.$element.offset().left;

            //记录element属性，用于实时对比
            element.width = elewidth;
            element.height = eleHeight;
            element.top = eleOffsettop;
            element.left = eleOffsetLeft;

            if (this.options.mode == "right") {
                var _this = this;
                this.$element.find("#scrollbar").css("top", (eleOffsettop + dMarginTop) + "px").css({
                    "left": (dMarginLeft + elewidth) + "px",
                    height: _this.$element.height() + "px"
                });

                //若用户需要设置滚动条宽度，重新设置滚动条中所有样式
                if (this.options.width) {
                    $("#stick").css({
                        left: (this.options.width / 2 - 2.5) + "px"
                    });
                    $("#scrollbar").css({
                        width: this.options.width
                    })
                    $("#scrollBall").css({
                        width: this.options.width / defaulWidth * scrollBall.defaultWidth,
                        height: this.options.width / defaulWidth * scrollBall.defaultWidth,
                        left: this.options.width / 2 - this.options.width / defaulWidth * scrollBall.defaultWidth / 2
                    })

                    $("#scrollBallImg").css({
                        width: this.options.width / defaulWidth * scrollBall.defaultWidth,
                        height: this.options.width / defaulWidth * scrollBall.defaultWidth
                    })
                }


            } else {//bottom也采用绝对定位方式

                this.$element.find("#scrollbar").css({
                    "top": (eleOffsettop + eleHeight + dMarginTop) + "px",
                    "width": elewidth + "px"
                });


            }

            this.modifyScrollStyle();

            this.$element.css({
                "overflow-x": "hidden",
                "overflow-y": "hidden"
            })
        },
        /*
        *@获取移动目标的超出部分，并计算滚动条长度
        */
        getMovingTargetOverRange: function () {
            var width = 0, height = 0;
            if (this.options.mode == "bottom") {
                width = this.$movingTarget.width();
                var outerWidth = this.$element.width();

                this.overLen = width - outerWidth;//超出部分宽度

                this.scrollBarLen = $("#scrollbar").width() - scrollBall.size;
            } else {
                height = this.$movingTarget.height();
                var outerHeight = this.$element.height();
                this.overLen = height - outerHeight; //超出部分高度

                this.scrollBarLen = $("#scrollbar").height() - scrollBall.size;
            }

        },

        /*
        *@desc:获取拖拽的范围
        */
        setDragRange: function () {

            if (this.options.mode == "bottom") {
                this.rangeFrom = $("#scrollbar").offset().left;//外层元素位置
                this.rangeTo = $("#scrollbar").width() + this.rangeFrom;
            } else {
                //                this.rangeFrom = this.$element.offset().top;//外层元素位置
                this.rangeFrom = $("#scrollbar").offset().top;//外层元素位置
                this.rangeTo = $("#scrollbar").height() + this.rangeFrom;
            }
        },

        /*
        *@计算滚动条移动距离与需要移动目标的移动距离对应比例
        */
        calcMovingRatio: function () {

            this.movingRatio = this.overLen / this.scrollBarLen;

        },


        /*
        * @desc:添加鼠标事件监听
        * */

        addScrollListener: function () {
            var _this = this;
            var mode = this.options.mode;
            var movingDistance = 0;
            var elePos = mode == "bottom" ? _this.$element.offset().left : _this.$element.offset().top;   //外层元素位置
            var scrollbarPos = mode == "bottom" ? $("#scrollbar").offset().left : $("#scrollbar").offset().top;   //外层元素位置

            this.removeScrollListener();//先移除监听
            this.$scrollBall.bind("mousedown", function (e) {
                e.preventDefault();
                isDrag = true;
                if (mode == "bottom") {
                    _this.startMousePos = e.clientX;
                    scrollBall.startMove = $(this).offset().left - scrollbarPos;  //滚动条初始位置
                    movingTarget.startMove = _this.$movingTarget.offset().left - elePos;   //移动目标初始位置
                } else {
                    _this.startMousePos = e.clientY;
                    scrollBall.startMove = $(this).offset().top - scrollbarPos;  //滚动条初始位置
                    movingTarget.startMove = _this.$movingTarget.offset().top - elePos;   //移动目标初始位置
                }

            });

            $(document).bind("mousemove", function (evt) {
                evt.preventDefault();
                var offsetMouse = mode == "bottom" ? evt.clientX - elePos : evt.clientY - elePos;   //外层元素位置

                if (!isDrag) {
                    return;
                }

                if (mode == "bottom") {

                    _this.currMousePos = evt.clientX;
                    movingDistance = _this.currMousePos - _this.startMousePos; //鼠标相对位移

                    scrollBall.left = scrollBall.startMove + movingDistance;
                    if (!(scrollBall.left + scrollbarPos >= _this.rangeFrom && ((scrollBall.left + scrollbarPos + scrollBall.size) <= _this.rangeTo))) {
                        if (scrollBall.left + scrollbarPos < _this.rangeFrom) {
                            _this.$scrollBall.css("left", 0 + "px");
                            movingDistance = 0 - scrollBall.startMove;
                            movingTarget.top = movingTarget.startMove - movingDistance * _this.movingRatio;
                            _this.$movingTarget.css("margin-left", movingTarget.top + "px");
                        } else {
                            _this.$scrollBall.css("left", _this.scrollBarLen + "px");
                            movingDistance = _this.scrollBarLen - scrollBall.startMove;
                            movingTarget.top = movingTarget.startMove - movingDistance * _this.movingRatio;
                            _this.$movingTarget.css("margin-left", movingTarget.top + "px");
                        }
                        return;
                    }
                    _this.$scrollBall.css("left", scrollBall.left + "px");


                    movingTarget.left = movingTarget.startMove - movingDistance * _this.movingRatio;
                    _this.$movingTarget.css("margin-left", movingTarget.left + "px");
                    _this.options.callback();
                } else {

                    _this.currMousePos = evt.clientY;
                    movingDistance = _this.currMousePos - _this.startMousePos; //鼠标相对位移

                    scrollBall.top = scrollBall.startMove + movingDistance;
                    if (!(scrollBall.top + scrollbarPos >= _this.rangeFrom && ((scrollBall.top + scrollbarPos + scrollBall.size) <= _this.rangeTo))) {

                        if (scrollBall.top + scrollbarPos < _this.rangeFrom) {   ///滚动条小球置顶
                            _this.$scrollBall.css("top", 0 + "px");
                            movingDistance = 0 - scrollBall.startMove;
                            movingTarget.top = movingTarget.startMove - movingDistance * _this.movingRatio;
                            _this.$movingTarget.css("margin-top", movingTarget.top + "px");
                        } else {       ///滚动条小球置底
                            _this.$scrollBall.css("top", _this.scrollBarLen + "px");
                            movingDistance = _this.scrollBarLen - scrollBall.startMove;
                            movingTarget.top = movingTarget.startMove - movingDistance * _this.movingRatio;
                            _this.$movingTarget.css("margin-top", movingTarget.top + "px");
                        }

                        return;
                    }
                    _this.$scrollBall.css("top", scrollBall.top + "px");


                    movingTarget.top = movingTarget.startMove - movingDistance * _this.movingRatio;
                    _this.$movingTarget.css("margin-top", movingTarget.top + "px");
                }


            });
            /**鼠标松开时，不再监听move事件**/
            $(document).bind("mouseup", function () {
                isDrag = false;
            });
        },
        removeScrollListener: function () {
            this.$scrollBall.unbind("mousedown");
            $(document).unbind("mousemove");
            $(document).unbind("mouseup");
        },
        /**
         * @desc：修改滚动条组件的样式
         *
         */
        modifyScrollStyle: function () {
            if (this.options.isHideBg) {  //
                $("#scrollbar").css("background-color", "rgba(0,0,0,0)");
            }

            if (this.options.ballColor) {
                $("#scrollBallImg").css({
                    "background-color": this.options.ballColor
                })

            }

        }


    });

})(jQuery);