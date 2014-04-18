/**
 * @desc:类似iphone任务栏的效果
 * @paras:
 *         defaultTask:默认显示选择的任务
 */
(function (jquery) {
    jquery.fn.iTasklist = jquery.fn.iTasklist || {};

    var currImgListno = -1;
    jquery.fn.extend({
        default: { smallestSize: null, biggestSize: null, defaultTask: null },
        objImgs: [],
        objBiggestSizes: [],
        $ele: null,
        iTasklist: function (options) {
            this.options = $.extend({}, this.default, options);
            var $ele = $(this);
            this.$ele = $ele;
            //var oMenu = jquery("#menu");
            this.objImgs = $ele.find("img");
            this.objBiggestSizes = [];
            var objBiggestSizes = this.objBiggestSizes;
            var that = this;
            var defaultTask = this.options.defaultTask;
            this.objImgs.each(function (i) {
                objBiggestSizes.push(that.options.biggestSize || $(this).width());
                if (defaultTask && ($(this).parents("#" + defaultTask).length != 0 || $(this).attr("id") == defaultTask)) {
                    $(this).data("list_no", i);
                    currImgListno = i;
                    return;
                }
                $(this).data("list_no", i).css("width", parseInt(that.options.smallestSize || $(this).width() / 2));
            });
            this.addListener();
        },
        addListener: function () {
            //鼠标移动事件
            var that = this;
            $(document).bind("mousemove", function (event) {
                var event = event || window.event;
                that.objImgs.each(function (i) {
                    var $this = $(this);
                    var a = event.clientX - $this.offset().left - $this.width() / 2;
                    var b = event.clientY - $this.offset().top - $this.height() / 2;
                    var iScale = 1 - Math.sqrt(a * a + b * b) / 350;
                    if (iScale < 0.5) iScale = 0.5;
                    if (currImgListno != i)
                        $this.css("width", that.objBiggestSizes[i] * iScale);
                });
            });
            this.$ele.delegate('a', "click", function () {
                var $this = $(this);
                currImgListno = $this.find('img').data('list_no');
                $this.find('img').data("clicked", 1).css("width", that.objBiggestSizes[currImgListno]);
            })
        }
    });
})(jQuery);