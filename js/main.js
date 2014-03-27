$(function() {
    var winH = $(window).height();
    $("#introduce").css({
        "margin-top": winH - $(".resume").outerHeight()-150
    });
    $(window).bind("scroll", scrollHandler);
});

function scrollHandler(event) {
    console.log($(this).scrollTop());
    $(".resume,#introduce").each(function() {
        var $section = $(this);
        var top = $section.offset().top;
        $section.css({
            marginTop:top-100
        })
    });
}