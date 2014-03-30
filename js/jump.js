(function(jquery) {
    var barH = jquery(".fixed-bar").outerHeight();
    jquery("#categories").delegate("a", "click", function(e) {
        e.preventDefault();
        var $this = $(this);
        var href = $this.attr("href");
        var $obj = $(href);
        $("html,body").animate({
            scrollTop: $obj.offset().top - barH + 30
        }, 600, "swing").animate({
            scrollTop: $obj.offset().top - barH
        },400);
    });
})(jQuery);