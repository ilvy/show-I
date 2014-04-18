
调用方式：1、类级别的调用  
			$.showFlashWord({ showStr: "登录中...", left: "40%", speed: 400, duration: 100, flashMode: 1, bigSize: 96, smallSize: 48,fontMargin:10 });
		  2、对象级别的调用
		    $("#loginBtn").showFlashWord({ showStr: "登录中...", left: "40%", speed: 400, duration: 100, flashMode: 1,smallSize:10 });


调用参数options: 
		1、showStr: "发送中...", 显示的文字信息
		2、bigSize: 48,    用于放大缩小的闪烁效果放大字体字号
		3、smallSize: 24,  用于放大缩小的闪烁效果缩小字体字号
		4、color: "#daa520", 文字颜色
		5、cssStyle: null, 自定义css样式
		6、top: "45%", 
		7、left: "45%", 
		8、speed: 500,  每个文字的渐变速度
		9、duration: 0, 文字间的变化间隔
		10、flashMode: 0,  0：按照放大缩小模式  1：按照透明度变化的闪烁模式
		11、fontMargin:10 每个文字间的间隔
		

依赖文件：
          jquery.flashWords.js
		  