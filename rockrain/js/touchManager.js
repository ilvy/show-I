(function(window) {
    var touchEvent = {
        touchstart: "touchstart",
        touchmove: "touchmove",
        touchend: "touchend",
        currentEvent:"",
        /**
         *@desc:判断是否pc设备
        */
        isPC:function() {
            var userAgentInfo = navigator.userAgent;
            var agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
            for (var v = 0; v < agents.length; v++) {
                if (userAgentInfo.indexOf(agents[v]) > 0) {
                    return false;
                }
            }
            return true;
        },
        init:function() {
            if (this.isPC()) {
                this.touchstart = "mousedown";
                this.touchend = "mouseup";
                this.touchmove = "mousemove";
            }
        }
    };
    touchEvent.init();
    window.touchEvent = touchEvent;
})(window);