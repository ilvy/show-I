$(function() {
    var winH = $(window).height();
    var barH = $("#fixed-bar").height();
    var $resume = $(".resume");
    $(".resumeBg").css({
        height: winH
    });
    $(".resume").css({
        "margin-top":(winH - $resume.height())/2
    });
    $("#introduce").css({
        "margin-top": winH - $(".resume").outerHeight() - $(".resume").offset().top - 20
    });
    $("#categories").css({
        "top": barH + $("#fixed-bar").offset().top + 10,
        //"top": barH + $("#fixed-bar").offset().top + 10,
        position: "absolute",
        height:winH - barH
    });
    //$("#categories").
    $("html,body").animate({ scrollTop: 0 }, 500);//操作滚动条到指定位置
    $(window).bind("scroll", scrollHandler).resize(scrollHandler).scrollTop(0);
    $(".resumeBg").parallax("center", 0.5, true,true);
    //$(window).resize();
});

var $barOriginTop,$barOriginWid,$barOriginHeight;
function scrollHandler(event) {
    console.log($(this).scrollTop());
    var wheelScrolltop = $(this).scrollTop();
    var $bar = $("#fixed-bar");
    $barOriginWid = $bar.width();
    $barOriginHeight = $bar.height();
    if ($bar.offset().top <= wheelScrolltop && $bar.css("position") != "fixed") {
        $barOriginTop = $bar.offset().top;
        $bar.css({
            "position": "fixed",
            "top": 0,
            width:$barOriginWid,
            height: $barOriginHeight
        });
        $("#categories").css({
            position:"fixed",
            top: $barOriginHeight + 10
        });
        $("#iSay").css({
            "margin-top": $barOriginHeight
        });
    } else if ($barOriginTop > wheelScrolltop && $bar.css("position") == "fixed") {
        $bar.css({
            position: "static"
        });
        $("#categories").css({
            position: "absolute",
            "top": $bar.height()+$bar.offset().top + 10
        });
        $("#iSay").css({
            "margin-top": 0
        });
    }
}

(function () {
    var content = {
        name: "蒋雪峰",
        engName:"ivly",
        sex:"男",
        company: "第七大道",
        everCompanies: "第七大道",
        workTime:"1年",
        job: "前端工程师",
        hobby: "coding,movie,dancing",
        signal:"not just coding",
        skill:"前端：html,js,css;后端：node.js,java;Android开发",
    };
    var count = 0;
    var contentCount = 0;
    var delay = 0;
    var tickTime = 300;
    //var interval = '';
    function showDynamic() {
        var value = '';
        
        for (var i in content) {
            var interval = '';
            value = content[i].split("");
            count = 0;
            (function (i, value, count, delay) {
                var isFocus = false;
                var range = document.createRange();
                var $obj = $("#" + i + " input");
                setTimeout(function () {
                    var interval = setInterval(function () {
                        if (!isFocus) {
                            $("#" + i + " input").focus();
                            isFocus = true;
                        }
                        $("#" + i + " input").val($obj.val()+value[count++]);
                        setCaretPosition($obj[0], count + 1);
                        if (count == value.length) {
                            clearInterval(interval);
                            $("#" + i + " input").blur();
                        }
                    },tickTime);
                }, tickTime * (delay));
            })(i, value, count, delay);
            if (delay == 0) {
                delay--;
            }
            delay += value.length;
            contentCount++;
        }
       
        
    }
    function setCaretPosition(ctrl, pos) {
        //设置光标位置函数 
        if (ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
        }
        else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }
    showDynamic();
})();
