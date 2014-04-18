(function() {
    var utils = {
        /*
         *@desc:创建图片
         */
        createImg:function(imgPath,scaleNum) {
            var img = new Image();
            img.src = imgPath;
            if (scaleNum) {
                img.width = img.width * scaleNum;
                img.height = img.height * scaleNum;
            }
            
            return img;
        },
        collisionSingleRect:function(rect1,rect2) {
            var x1 = rect1.x, y1 = rect1.y, x2 = rect2.x, y2 = rect2.y;
            var width1 = rect1.width, height1 = rect1.height, width2 = rect2.width, height2 = rect2.height;
            if (x1 + width1 <= x2 && x2 >= x1) {
                return false;
            } else if (x1 >= x2 + width2 && x1 >= x2) {
                return false;
            }else if (y1 + height1 <= y2 && y1 <= y2) {
                return false;
            }else if (y1 >= y2 + height2 && y1 >= y2) {
                return false;
            } else {
                return true;
            }
        },
        collisionMultiRects: function (rects1, rects2) {
            var tmpRects1 = [], tmpRects2 = [];
            if (rects1.length) {
                tmpRects1 = rects1.slice();
            } else {
                tmpRects1.push(rects1);
            }
            if (rects2.length) {
                tmpRects2 = rects2.slice();
            } else {
                tmpRects2.push(rects2);
            }
            rects1 = tmpRects1;
            rects2 = tmpRects2;
            for (var i = 0; i < rects1.length; i++) {
                var rect1 = rects1[i];
                for (var j = 0; j < rects2.length; j++) {
                    var rect2 = rects2[j];
                    if (this.collisionSingleRect(rect1, rect2)) {
                        return true;
                    }
                }
            }
        }
    };

    window.utils = utils;
})();