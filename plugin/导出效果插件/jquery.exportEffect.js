(function (jquery) {
    var exportObj = null;
    var direct = false;//移动方向
    jquery.export = function (options) {
        options = jquery.extend({}, jquery.export.defaults, options);
        new ExportEffect(options);
    };

    function ExportEffect(options) {
        if (options.hide) {
            this.$remove();
            exportObj = null;
            return;
        }
        if (!exportObj) {
            exportObj = {};
            this.init(options);
        }
            
    }

    jquery.extend(ExportEffect.prototype, {
        $arrow: null,
        $fileImg: null,
        init: function (options) {
            this.$arrow = jquery("<div id='export_arrow'></div>");
            this.$fileImg = jquery('<div id="fileImg"><img src="./fileImg.png"/></div>');
            jquery("body").append(this.$arrow);
            jquery("body").append(this.$fileImg);
            this.setPos();
            this.setTimer();
        },
        setPos: function () {
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            this.$fileImg.css({
                left: (windowWidth) / 2,
                top: (windowHeight - $("#fileImg").height()) / 2
            });
            this.$arrow.css({
                left: (windowWidth - $("#export_arrow").width()) / 2,
                top: (windowHeight - $("#export_arrow").height() + 30) / 2
            });
        },
        setTimer: function () {
            var arrowFrom = jquery("#export_arrow").offset().left - 30 + "px";
            var arrowTo = jquery("#export_arrow").offset().left + 30 + "px";
            jquery("#export_arrow").animate({
                left: arrowFrom
            }, 500);
            window.setInterval(function () {
                if (direct = !direct) {
                    jquery("#export_arrow").animate({
                        left: arrowTo
                    }, 1000);
                } else {
                    jquery("#export_arrow").animate({
                        left: arrowFrom
                    }, 50);
                }

            }, 500);
        },
        $remove: function () {
            jquery("#export_arrow").remove();
            jquery("#fileImg").remove();
        }
    });
})(jQuery);