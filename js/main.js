$(function() {
    var winH = $(window).height();
    var $resume = $(".resume");
    $(".resume").css({
        "margin-top":(winH - $resume.height())/2
    });
    $("#introduce").css({
        "margin-top": winH - $(".resume").outerHeight() - $(".resume").offset().top - 50
    });
    //$("#categories").
    $(window).bind("scroll", scrollHandler);
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
            position: "absolute",
            top:$bar.height()
        });
    } else if ($barOriginTop > wheelScrolltop && $bar.css("position") == "fixed") {
        $bar.css({
            position: "static"
        });
        $("#categories").css({
            position: "static",
            "margin-top": $bar.height()
        });
    }
}