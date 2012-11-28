(function ($) {
    $.fn.slider = function (options) {
        var content = options.content;
        var interval = options.interval == null ? 7000 : options.interval;
        var target = options.target == null ? "_self" : options.target;
        var offset = options.offset == null ? 400 : options.offset;
        var iconOffset = options.iconOffset == null ? 560 : options.iconOffset;
        var width = $(this).width();
        var height = $(this).height();

        var mouseOn = false;
        var sliderTimer, checkerTimer;

        var checkBeforeRun = function (func) {
            if (mouseOn) {
                checkerTimer = setTimeout(function () {
                    checkBeforeRun(func);
                }, 1000);
            }
            else {
                func();
            }
        };

        var slide = function (obj, index) {
            index = index % content.length;
            var current = content[index];
            var title = current.title;
            var description = current.description;
            var url = current.url;
            var image = current.image;

            //update icons
            $(obj).parent().find(".slider-icons img").removeClass("slider-icon-on").addClass("slider-icon-off");
            $(obj).parent().find(".slider-icons img:eq(" + index + ")").removeClass("slider-icon-off").addClass("slider-icon-on");

            //animation
            //last out
            $(obj).empty();
            var a = $("<a class='slider-a' href='" + url + "' target='" + target + "'></a>");
            $(a).width(width);
            $(a).height(height);
            $(a).hover(function () { mouseOn = true; }, function () { mouseOn = false; });
            $(obj).append(a);

            //start with one simple animation
            //next in
            var text = $("<p class='slider-p'></p>");
            $(text).append("<span class='slider-title'>" + title + "</span>");
            $(text).append("<span class='slider-description'>" + description + "</span>");
            $(text).append("<span class='slider-more'>-&gt; Read More...</span>");
            var img = $("<img src='" + image + "' border='0' class='slider-img' />");

            var left = ($("body").width() - $("#slider").width()) / 2 + $("#slider").width();
            var left = ($("body").width() - $("#slider").width()) / 2 + $("#slider").width();

            $(img).css("left", left);
            $(text).css("left", 0 - left);
            $(a).append(img);
            $(a).append(text);

            $(img).animate({ left: 0 }, interval * 0.4, "swing");
            $(text).animate({ left: offset }, 2000, "swing", function () {
                checkBeforeRun(function () {
                    sliderTimer = setTimeout(function () {
                        $(a).fadeOut("fast", function () {
                            slide(obj, index + 1);
                        });
                    }, interval * 0.6);
                });
            });
        };

        //setup icons for quick access
        var iconsHolder = $("<div class='slider-icons'></div>");
        for (var i = 0; i < content.length; i++) {
            var img = $("<img class='slider-icon-off' title='" + content[i].title + "' data-index='" + i + "' src='" + content[i].icon + "' border='0'></img>");
            $(img).click(function () {
                $(".slider-p").stop(true, true);
                $(".slider-img").stop(true, true);
                clearTimeout(checkerTimer);
                clearTimeout(sliderTimer);
                slide($(".slider-holder"), $(this).data("index"));
            });
            $(iconsHolder).append(img);
        }
        $(iconsHolder).css("left", iconOffset);
        $(this).append(iconsHolder).append("<div class='slider-holder'></div>");
        $(this).css("position", "relative");
        slide($(".slider-holder"), 0);
    }
})(jQuery);