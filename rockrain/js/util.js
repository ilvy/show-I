(function() {
    var utils = {
        /*
         *@desc:创建图片
         */
        createImg:function(imgPath) {
            var img = new Image();
            img.src = imgPath;
            return img;
        }
    };
    window.utils = utils;
})();