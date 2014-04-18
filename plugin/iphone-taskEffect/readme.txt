
<div id="menu">
            <a style="cursor: pointer;" id="first"><img src="./img/1.png" /></a>
            <a style="cursor: pointer;"><img src="./img/2.png" /></a>
            <a style="cursor: pointer;"><img src="./img/3.png" /></a>
            <a style="cursor: pointer;"><img src="./img/4.png" /></a>
            <a style="cursor: pointer;"><img src="./img/5.png" /></a>
            <a style="cursor: pointer;"><img src="./img/6.png" /></a>
        </div>

调用方式：jquery("#menu").iTasklist({smallestSize: null, biggestSize: null, defaultTask: null});
         

调用参数options:
        1、smallestSize：鼠标未悬浮在图片上时，图片的默认大小
		2、biggestSize：鼠标悬浮状态时图片的放大状态
		3、defaultTask：
		   默认某张图片为选中效果

		

依赖文件：jquery.iTasklistEffect.css
          jquery.iTasklistEffect.js
		  