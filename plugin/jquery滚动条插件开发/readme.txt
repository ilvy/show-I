滚动条分为两种模式：底部滚动条和右边滚动条
<div id="outer" class="outer">                                           <!--需要加滚动条的外部容器-->
            <table id="movingTarget" class="table table-bordered">              <!--移动目标内容-->
                    
            </table>
             
</div>

调用方式：jquery("#outer").addScroll({target:"#movingTarget",mode:"right"（"bottom"）});
         解释说明：滚动条将会添加在outer容器上，且移动目标是movingTarget，显示于右边（底部）

调用参数options:
        1、target：移动目标选择器（如上 #movingTarget）
		2、mode：滚动条位置（bottom，right）
		3、dMarginLeft：
		   参数说明：由于滚动条改用了绝对定位的方式，因此可能与放置滚动条的容器有一定的距离误差，可以设置这个值调整距离误差，
		   当dMarginLeft > 0,向右加大距离
		   当dMarginLeft < 0,向左减小距离
	    4、dMarginTop：
		参数说明：由于滚动条改用了绝对定位的方式，因此可能与放置滚动条的容器有一定的距离误差，可以设置这个值调整距离误差，
		当dMarginTop > 0,向下加大距离
		当dMarginTop < 0,向上减小距离

        5、isRefresh：
		   是否需要刷新滚动条：当添加滚动条的元素宽高存在变化或者位置移动时，需要在变化后刷新滚动条，否则将会有错位问题
		6、bgColor：背景颜色
		7、ballColor：滚动的小球的颜色
		8、isHideBg：是否隐藏滚动条背景
		

依赖文件：jquery.scrollbar.css
          jquery.scrollbar.js
		  