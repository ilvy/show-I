(function(jquery) {
    jquery.ds_component = {};//manage the components of the dateSlider
    var dateSlider = null;

    jquery.fn.dateSlider = function(options) {
        var options = jquery.extend({}, jquery.fn.dateSlider.defaults, options);
        //use to refresh it
        jquery.fn.dateSlider.defaults = options;
        return this.each(function() {
            dateSlider = new DateSlider(jquery(this), options);
        });
    };

    $.fn.refreshSlider = function (options) {
        if (!this.hasClass('slider-container')) {
            return;
        }
        //dateSlider = null;
        dateSlider.options = jquery.extend({}, jquery.fn.dateSlider.defaults, options);
        //jquery.fn.dateSlider.defaults = options;
        //dateSlider = new DateSlider(jquery(this), options);
        dateSlider.setSliderBalls();
    };
    
    jquery.fn.dateSlider.defaults = {step:1,months:24,startYear:2013,startMonth:12,endYear:2014,endMonth:3,changePeriod:null,isBorderBox:false};

    function DateSlider(ele,options) {
        this.init(ele, options);
    }

    var ONE_STEP = 50;//步长
    var tickInterval = 0;
    var degreeWidth = 0;//刻度间距
    var min_marginWidth = 15;
    var monthsArray = [];
    var yearsArray = [];
    var year_monthArrays = {};
    var endYear, startYear,endMonth,startMonth;

    var currPos = {
        l: '',
        r: '',
        range:''
    };
    var halfBallWidth;
    var halfDateBoxWidth;

    //记录月份
    var chooseStart = {}, chooseEnd = {};
    var onedayTickInterval = {
        l:'',
        r:''
    };
    jquery.cPos = {
        l:{},
        r:{},
        range:{}
    };
    jquery.mouse = {
        //a flag indicating mouse down or not
        mouseStarted: false,
        startX: 0,
        eDis: 0,
        currentTarget:''//l,r,range
    };
    var that = {};
    
    jquery.extend(DateSlider.prototype, {
        options: {},
        init:function($elem,options) {
            this.options = options;
            jquery.ds_component.elem = $elem;
            this.calcYearsMonths();
            this.setDegrees();
            tickInterval = this.options.step * ONE_STEP;
            onedayTickInterval.l = tickInterval / this.getMonthDayNum(chooseStart.year, chooseStart.month);
            onedayTickInterval.r = tickInterval / this.getMonthDayNum(chooseEnd.year, chooseEnd.month);
            that = this;
            this.addListener();
        },
        setDegrees: function () {
            var months = this.options.months;
            jquery(".slider-degree-div").empty().css('top', jquery(".slider-bar").position().top + jquery(".slider-bar").height());
            var sliderWidth = jquery(".slider-bar").width();
            degreeWidth = Math.floor((sliderWidth - months - 1) / (months + 1));
            if (this.options.isBorderBox) {
                ONE_STEP = degreeWidth ;
            } else {
                ONE_STEP = degreeWidth + 1;
            }
            
            //jquery(".slider-bar").css({
            //    "left": ONE_STEP - ($(".slider-bar").width() - ONE_STEP * months - $(".slider-ball-left").outerWidth()) / 2,
            //    width: $(".slider-bar").width() - (ONE_STEP - ($(".slider-bar").width() - ONE_STEP * months - $(".slider-ball-left").outerWidth()) / 2)
            //});
            jquery(".slider-bar").css({
                "left": ONE_STEP - min_marginWidth,
                width: ONE_STEP * months + 2 * min_marginWidth
            });
            //jquery(".slider-bar").css("width", degreeWidth * (this.options.months));
            //degreeWidth - jquery(".slider-ball-left").outerWidth();
            var leftOfYear = 0;
            var countOfYear = 0;
            for (var i = 0; i < months; i++) {
                leftOfYear += ONE_STEP;
                if (i == 0) {
                    jquery(".slider-degree-div").append('<span class="slider-degree" style="width:' + degreeWidth + 'px;"></span>');
                } else if (i == 1) {
                    jquery(".slider-container").append('<span class="year" style="left:' + (leftOfYear - ONE_STEP) + 'px;">' + yearsArray[countOfYear++] + '</span>')
                }else if (monthsArray[i] == 1) {
                    jquery(".slider-container").append('<span class="year" style="left:' + leftOfYear + 'px;">' + yearsArray[countOfYear++] + '</span>')
                }
                
                jquery(".slider-degree-div").append('<span class="slider-degree" style="width:'+degreeWidth+'px"><span>'+(monthsArray[i])+'</span></span>');
            }

            /*
             *@ TODO:在测试例子中显示正常，但是在项目中所有的slider-degree会与父容器有跟.slider-bar一样的left值，导致无法对齐，尚未找出原因
             */
            if($("div .slider-degree:first-child").position().left){
                $(".slider-degree-div").css("left",-$("div .slider-degree:first-child").position().left);
            }
            //jquery(".slider-ball-left").css("left", ONE_STEP * 5 - jquery(".slider-ball-left").outerWidth() / 2);
            //jquery(".slider-ball-right").css("left", ONE_STEP * 15 - jquery(".slider-ball-left").outerWidth() / 2);
            //jquery(".slider-range").css({
            //    width: ONE_STEP * 10 + "px",
            //    left: ONE_STEP * 5
            //});
            this.setSliderBalls();
        },
        calcYearsMonths:function() {
            var today = new Date();
            endMonth = today.getMonth() + 1;
            endYear = today.getFullYear();
            var startMonthDate = new Date(today.getFullYear(), endMonth - this.options.months, today.getDate());
            startMonth = startMonthDate.getMonth() + 1;
            startYear = startMonthDate.getFullYear();
            for (var i = 0; i < this.options.months; i++) {
                monthsArray.push(startMonth++);
                if (startMonth == 13) {
                    startMonth = 1;
                }
            }
            for (i = startYear; i <= endYear; i++) {
                yearsArray[i - startYear] = i;
            }
            for (i = startYear; i <= endYear; i++) {
                var monthsY = [];
                if (i == startYear) {
                    for (var j = startMonth; j <= 12; j++) {
                        monthsY.push(j);
                    }
                } else if(i == endYear) {
                    for (j = 1; j <= endMonth; j++) {
                        monthsY.push(j);
                    }
                } else {
                    for (j = 1; j <= 12; j++) {
                        monthsY.push(j);
                    }
                }
                year_monthArrays[i] = monthsY;
            }
        },
        setSliderBalls:function() {
            //var sYmonths = year_monthArrays[this.options.startYear];
            //var eYmonths = year_monthArrays[this.options.endYear];
            var leftPos, rightPos;
            if (this.options.startYear == startYear) {
                leftPos = this.options.startMonth - startMonth + 1;
            } else {
                leftPos = 12 - startMonth + (this.options.startYear - startYear - 1) * 12 + this.options.startMonth + 1;
            }
            if (this.options.endYear == startYear) {
                rightPos = this.options.endMonth - startMonth + 1;
            } else{
                rightPos = 12 - startMonth + (this.options.endYear - startYear - 1) * 12 + this.options.endMonth + 1;
            }
            halfBallWidth = jquery(".slider-ball-left").outerWidth() / 2;
            halfDateBoxWidth = jquery("#slider-ldate-box").outerWidth() / 2;
            currPos.l = ONE_STEP * leftPos - halfBallWidth;
            currPos.r = ONE_STEP * rightPos - halfBallWidth;
            currPos.range = ONE_STEP * leftPos;
            jquery(".slider-ball-left").css("left", currPos.l);
            jquery(".slider-ball-right").css("left", currPos.r);
            jquery(".slider-range").css({
                width: ONE_STEP * (rightPos - leftPos) + "px",
                left: currPos.range
            });
            this.initTimeRange();
            this.setDatePicker(leftPos, "left");
            this.setDatePicker(rightPos, "right");
        },
        /**
         @desc:设置一个日期选择框
         */
        setDatePicker:function(posNum,which) {
            
            switch (which) {
                case "left":
                    var $ldate = $("#slider-ldate-box");
                    $ldate.css("left", ONE_STEP * posNum - halfDateBoxWidth);
                    $ldate.find("input").val(1).data('preval', 1);
                    chooseStart.date = 1;
                    break;
                case "right":
                    var $rdate = $("#slider-rdate-box");
                    $rdate.css("left", ONE_STEP * posNum - halfDateBoxWidth);
                    var monthDayNum = this.getMonthDayNum(chooseEnd.year, chooseEnd.month);
                    $rdate.find("input").val(monthDayNum).data('preval', monthDayNum);
                    chooseEnd.date = monthDayNum;
                    break;
                default:
                    break;
            }
        },
        updateDatePicker: function (cName) {
            var $dateBox = null,monthDayNum;
            cName == 'r' ? ($dateBox = $("#slider-rdate-box"),
                            monthDayNum = that.getMonthDayNum(chooseEnd.year,chooseEnd.month),
                            $dateBox.find("input").val(monthDayNum)).data('preval', monthDayNum,
                            chooseEnd.date = monthDayNum) :
                                                            ($dateBox = $("#slider-ldate-box"),
                                                            $dateBox.find("input").val(1).data('preval',1),
                                                            chooseStart.date = 1);
            $dateBox.css("left", currPos[cName] - halfDateBoxWidth + halfBallWidth);
            
        },
        /**
         * @desc:init the original the start and the end Date
        */
        initTimeRange:function() {
            chooseStart.year = this.options.startYear;
            chooseStart.month = this.options.startMonth;
            chooseEnd.year = this.options.endYear;
            chooseEnd.month = this.options.endMonth - 1 == 0 ? (chooseEnd.year--, 12) : this.options.endMonth - 1;   //the options.endMonth is exlusive
            chooseStart.monthDayNum = this.getMonthDayNum(chooseStart.year, chooseStart.month);
            chooseEnd.monthDayNum = this.getMonthDayNum(chooseEnd.year, chooseEnd.month);
        },
        addListener:function() {
            var $elem = jquery.ds_component.elem;
            var that = this;
            jquery(function() {
                that._slideStartDate();
                that._slideEndDate();
                that._slideDateBlock();
                var monthDayNum;
                jquery(".slider-add-date").bind("click", function() {
                    var $this = jquery(this);
                    var cName = $this.data("ball");
                    var $ball = jquery('div[data-slider="' + cName + '"]');
                    var $dateBox = $this.parents('.date-box');
                    $dateBox.find('input').focus();
                    //that.movingBallByChooseDay(cName, $dateBox, onedayTickInterval[cName]);
                    var currDate = Number($dateBox.find('input').val());
                    if (cName == 'l') {
                        monthDayNum = chooseStart.monthDayNum;
                        if (currDate < monthDayNum) {
                            $dateBox.find('input').val(currDate + 1);
                            chooseStart.date++;
                        } else {
                            return;
                        }
                    } else if(cName == 'r') {
                        monthDayNum = chooseEnd.monthDayNum;
                        if (currDate < monthDayNum) {
                            $dateBox.find('input').val(currDate + 1);
                            chooseEnd.date++;
                        } else {
                            return;
                        }
                    }
                    $dateBox.find('input').data('preval', currDate + 1);

                    $ball.css({
                        left:$ball.position().left + onedayTickInterval[cName]
                    });
                    $dateBox.css({
                        left: $dateBox.position().left + onedayTickInterval[cName]
                    });
                    that.resetRange(cName, onedayTickInterval[cName], true);
                });
                jquery(".slider-sub-date").bind("click", function() {
                    var $this = jquery(this);
                    var cName = $this.data("ball");
                    var $ball = jquery('div[data-slider="' + cName + '"]');
                    var $dateBox = $this.parents('.date-box');
                    $dateBox.find('input').focus();
                    //that.movingBallByChooseDay(cName, $dateBox, -onedayTickInterval[cName]);
                    var currDate = Number($dateBox.find('input').val());
                    if (cName == 'l') {
                        monthDayNum = chooseStart.monthDayNum;
                        if (currDate > 1) {
                            $dateBox.find('input').val(currDate - 1);
                            chooseStart.date--;
                        } else {
                            return;
                        }
                    } else if (cName == 'r') {
                        monthDayNum = chooseEnd.monthDayNum;
                        if (currDate > 1) {
                            $dateBox.find('input').val(currDate - 1);
                            chooseEnd.date--;
                        } else {
                            return;
                        }
                    }
                    $dateBox.find('input').data('preval', currDate - 1);

                    $ball.css({
                        left: $ball.position().left - onedayTickInterval[cName]
                    });
                    $dateBox.css({
                        left: $dateBox.position().left - onedayTickInterval[cName]
                    });
                    that.resetRange(cName, -onedayTickInterval[cName], true);
                });
                that.inputHandler();
            });
        },
        inputHandler: function () {
            var monthDayNum = '', cName;
            var chooseDateListener = function(event) {
                var $this = $(this);
                cName = $this.data("ball");
                var $ball = jquery('div[data-slider="' + cName + '"]');
                var $dateBox = $this.parents('.date-box');
                var currDate = Number($this.val());
                $this.val(currDate);
                monthDayNum = cName == 'l' ? that.getMonthDayNum(chooseStart.year, chooseStart.month) :
                                                          that.getMonthDayNum(chooseEnd.year, chooseEnd.month);
                if (currDate > monthDayNum || currDate < 1) {
                    alert("当前日期选择不合法");
                    return;
                }
                var moveDis;
                var preDate = Number($this.data('preval'));
                if (cName == 'l') {
                    chooseStart.date = currDate;
                    moveDis = (currDate - preDate) * onedayTickInterval[cName];
                    $ball.css({
                        left: $ball.position().left + moveDis
                    });
                    $dateBox.css({
                        left: $dateBox.position().left + moveDis
                    });
                    that.resetRange(cName, moveDis, true);
                } else {
                    chooseEnd.date = currDate;
                    moveDis = (preDate - currDate) * onedayTickInterval[cName];
                    $ball.css({
                        left: $ball.position().left - moveDis
                    });
                    $dateBox.css({
                        left: $dateBox.position().left - moveDis
                    });
                    that.resetRange(cName, -moveDis, true);
                }
                $this.data('preval', currDate);
                $this.blur();
                //时间选择完毕，触发外部回调
                if (that.options.changePeriod && typeof that.options.changePeriod == "function") {
                    that.func = that.options.changePeriod;
                    that.func(chooseStart, chooseEnd);
                }
            };
            
            $(".slider-container input").bind("keydown", function(event) {
                if (event.keyCode == 13) {
                    chooseDateListener.apply(this,event);
                }
            }).bind('blur',function() {
                jquery(this).addClass("inactive_input").removeClass("active_input");
            }).bind('focus',function() {
                jquery(this).removeClass("inactive_input").addClass("active_input");
            });
            
        },
        _slideStartDate:function() {
            var $elem = jquery.ds_component.elem;
            var that = this;
            jquery(".slider-ball-left").bind("mousedown", that._mouseDown);
            jquery(document).bind("mousemove", that._mouseMove)
                       .bind("mouseup",that._mouseUp);
        },
        _slideEndDate:function() {
            jquery(".slider-ball-right").bind("mousedown", that._mouseDown);
        },
        _slideDateBlock:function() {
            jquery(".slider-range").bind("mousedown", that._mouseDown);
        },
        _mouseDown: function (event) {
            jquery.mouse.mouseStarted = true;
            var $eT = jquery(event.target);
            var cName = $eT.data("slider");
            jquery.cPos[cName].startX = currPos[cName];//$eT.position().left;
            jquery.mouse.startX = event.clientX;
            jquery.mouse.currentTarget = cName;
            if (cName != 'range') {
                
            }else{
                
            }
        },
        _mouseMove: function (event) {
            if (jquery.mouse.mouseStarted) {
                var cName = jquery.mouse.currentTarget;
                var $eT = jquery('div[data-slider="'+cName+'"]');
                var eDis = event.clientX - jquery.mouse.startX;
                if (Math.abs(eDis) > tickInterval / 2) {
                    var onestep = eDis > 0 ? tickInterval : -tickInterval;
                    jquery.cPos[cName].startX += onestep;
                    if (!that.constraintMoving(cName,eDis > 0)) {
                        jquery.cPos[cName].startX -= onestep;
                        return;
                    }
                    $eT.css({
                        "left": jquery.cPos[cName].startX + "px"
                    });
                    that.changePeriod(cName,eDis > 0);
                    if (cName == 'range') {
                        jquery('div[data-slider="r"],div[data-slider="l"]').each(function () {
                            $(this).css({
                                left: $(this).data("slider") == 'l' ? (currPos.l +=onestep) : currPos.r += onestep
                                //left: $(this).position().left + onestep
                            });
                            //var $dateBox = null;
                            //$(this).data("slider") == 'r' ? ($dateBox = $("#slider-rdate-box")) :
                            //                                                               ($dateBox = $("#slider-ldate-box"));
                            //$dateBox.css("left", currPos[cName] );
                            that.updateDatePicker($(this).data("slider"),eDis > 0);
                        });
                        $eT.css("width", Math.abs(jquery('div[data-slider="l"]').position().left - jquery('div[data-slider="r"]').position().left));
                        currPos.range = jquery.cPos[cName].startX;
                    } else {
                        currPos[cName] += onestep;
                        that.resetRange(cName, onestep);
                        var $dateBox = null;
                        //cName == 'r' ? ($dateBox = $("#slider-rdate-box")) :
                        //                                                            ( $dateBox = $("#slider-ldate-box"));
                        //$dateBox.css("left", currPos[cName] );
                        that.updateDatePicker(cName,eDis > 0);
                    }
                    jquery.mouse.startX += onestep;
                }
                
            }
            
        },
        _mouseUp: function (event) {

            if (jquery.mouse.mouseStarted) {
                chooseStart.monthDayNum = that.getMonthDayNum(chooseStart.year, chooseStart.month);
                chooseEnd.monthDayNum = that.getMonthDayNum(chooseEnd.year, chooseEnd.month);
                onedayTickInterval.l = tickInterval / chooseStart.monthDayNum;
                onedayTickInterval.r = tickInterval / chooseEnd.monthDayNum;
            }
            if (jquery.mouse.mouseStarted && that.options.changePeriod && typeof that.options.changePeriod == "function") {
                that.func = that.options.changePeriod;
                that.func(chooseStart, chooseEnd);
            }
            jquery.mouse.mouseStarted = false;
        },
        /**
         *@desc:改变选择时间段
        */
        changePeriod:function(cName,positive) {
            if (cName == 'l') {
                this.updateMonth(chooseStart,positive);
            }else if (cName == 'r') {
                this.updateMonth(chooseEnd, positive);
            }else if (cName == 'range') {
                this.updateMonth(chooseStart, positive);
                this.updateMonth(chooseEnd, positive);
            }
            $(".slider-container").data("slider-start", chooseStart);
            $(".slider-container").data("slider-end", chooseEnd);
            //console.log(chooseStart.year+" "+chooseStart.month);
            //console.log(chooseEnd.year + " " + chooseEnd.month);
//            if (this.options.changePeriod && typeof this.options.changePeriod == "function") {
//                this.func = this.options.changePeriod;
//                this.func(chooseStart, chooseEnd);
//            }
        },
        updateMonth:function(timeObj,positive) {
            if (positive) {
                ++timeObj.month > 12?(timeObj.month = 1,timeObj.year++):(' ');
            } else {
                --timeObj.month <= 0 ? (timeObj.year--,timeObj.month = 12) : (' ');
            }
        },
        isEdgeMonth: function (timeObj) {
            var copyObj = timeObj;
            if (copyObj.year == startYear && copyObj.month == startMonth || copyObj.year == endYear && copyObj.month == endMonth) {
                return true;
            } else {
                return false;
            }
        },
        moveBalls:function() {
            
        },
        /**
         *@desc:1、notAddDay:移动left和right的时候，重置range条，2、AddDay:选择日期的时候，充值range
         */
        resetRange:function(currTarget,step,isAddDay) {
            var originWidth = jquery(".slider-range").width();
            var originLeft = jquery(".slider-range").position().left;
            var $eT = jquery('div[data-slider="' + 'l' + '"]');
            var width, left;
            if (!isAddDay) {
                //width = currPos['r'] - currPos['l'];
                width = Math.abs(jquery('div[data-slider="l"]').position().left - jquery('div[data-slider="r"]').position().left);
                left = currPos['l'];
                currPos['range'] = left + halfBallWidth;
                    //left = $eT.position().left;
                jquery(".slider-range").css({
                    width: width,
                    left: $eT.position().left + halfBallWidth
                    //left:currPos.range
                });
            } else {
                if (currTarget == 'l') {
                    width = originWidth - step;
                } else if(currTarget == 'r') {
                    width = originWidth + step;
                }
                jquery(".slider-range").css({
                    width: width,
                    left: $eT.position().left + halfBallWidth
                });
            }
            
            
        },
        /**
         *@desc:
         *@paras: 
         *  positive:indicate moving direction ，positive>0:positive direction, <0:opposite direction
        */
        constraintMoving: function (currTarget,positive) {
            var $qt = "", $r,$l;
            if (currTarget == 'l') {
                $qt = jquery('div[data-slider="r"]');
                if (jquery.cPos[currTarget].startX >= $qt.position().left || (!positive &&this.isEdgeMonth(chooseStart))) {
                    return false;
                }
            } else if (currTarget == 'r') {
                $qt = jquery('div[data-slider="l"]');
                if (jquery.cPos[currTarget].startX <= $qt.position().left || (positive && this.isEdgeMonth(chooseEnd))) {
                    return false;
                }
            } else if (currTarget == 'range') {
                $r = jquery('div[data-slider="r"]');
                $l = jquery('div[data-slider="l"]');
                var $rWid = $r.outerWidth();
                if (positive && $r.position().left + $rWid / 2 >= tickInterval * (this.options.months + 1)) { //TODO:左右两端超出的情况
                    return false;
                } else if (!positive && $l.position().left + $rWid / 2 <= tickInterval) {
                    return false;
                }
                
            }
            return true;
        },
        /**
         *@desc:获取年份区间
        */
        getYearRegions:function() {
            
        },
        /*
         *@get how many days in the current month 
        */
        getMonthDayNum:function(year,month) {
            //var today = new Date(year,month,0);
            return new Date(year, month, 0).getDate();
        }
    });

    
    jquery.extend(jquery.mouse, {
        
    });
})(jQuery);