(function(window) {
    var ctx,winH,winW;
    function Rockrain(canvas,context) {
        ctx = context;
        winH = canvas.height;
        winW = canvas.width;
        this.init();
    }

    var _rr;
    Rockrain.prototype = {
        init: function () {
            _rr = this;
            setInterval(function() {
                _rr.run();
            },50);
        },
        /**
         *@desc:执行帧
        */
        run:function() {
            this.setBg();
            this.updateMan();
            this.updateRocks();
            this.updateBonus();
        },
        setBg: function () {
            ctx.beginPath();
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, winW, winH);
            ctx.closePath();
            ctx.stroke();
        },
        updateMan:function() {
            
        },
        updateRocks:function() {
            
        },
        updateBonus:function() {
            
        }
    };
    window.Rockrain = Rockrain;
})(window);