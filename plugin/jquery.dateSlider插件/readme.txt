页面中对应内容：
<div class="slider-container" id="dateSlider">
            <div class="date-box" id="slider-ldate-box">
                <input type="text" data-ball="l" class="inactive_input"/><!--<span style="position: absolute;left: 25px;">日</span>-->
                <div class="lm-btngroup">
                    <div class="slider-add-date" data-ball="l">
                        <span class="glyphicon glyphicon-plus" style="color: white;"></span>
                    </div>
                    <div class="slider-sub-date" data-ball="l">
                        <span class="glyphicon glyphicon-minus" style="color: white;"></span>
                    </div>
                </div>
            </div>
            <div class="date-box" id="slider-rdate-box">
                <input type="text" data-ball="r"  class="inactive_input"/><!--<span style="position: absolute;left: 25px;">日</span>-->
                <div class="lm-btngroup">
                    <div class="slider-add-date" data-ball="r">
                        <span class="glyphicon glyphicon-plus" style="color: white;"></span>
                    </div>
                    <div class="slider-sub-date" data-ball="r">
                        <span class="glyphicon glyphicon-minus" style="color: white;"></span>
                    </div>
                </div>
            </div>
            <div class="slider-ball-left" data-slider="l"></div>
            <div class="slider-bar"></div>
            <div class="slider-range" data-slider="range"></div>
            <div class="slider-ball-right" data-slider="r"></div>
            <div class="slider-degree-div">
                
            </div>
        </div>

调用参数options:
		1、step:1,
		2、months:24,  滚动条上可选的时间为24个月，开始时间为今天往前推24个月
		3、startYear:2013,
		4、startMonth:12,
		5、endYear:2014,
		6、endMonth:3,
		7、changePeriod:null,  callback回调函数，在切换了月份或者选择完日期按回车的时候回调该方法，传入选择的起始日期和结束如期
		8、isBorderBox:false    是否设置了 border-box属性，若设置了，isBorderBox：true

return：一个实例
				可以利用该实例刷新控件，参数同上一致，具体如下调用方式所示

调用方式：var slider = $("#dateSlider").dateSlider({
            startYear: 2013,
            startMonth: 2,
            endYear: 2014,
            endMonth: 1,
            changePeriod:function(startTime,endTime) {
                console.log(startTime.year + " " + startTime.month+" "+startTime.date);
                console.log(endTime.year + " " + endTime.month + " " + endTime.date);
            },
            isBorderBox:true
        });
		slider.refreshSlider({startYear:2013,startMonth:3,endYear:2013,endMonth:9});
         

		

依赖文件：jquery.dateSlider.css
          jquery.dateSlider.js
		  jquery
		  