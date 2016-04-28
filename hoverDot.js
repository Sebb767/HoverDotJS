/**
 * Created by sebastian.kaim on 26.04.2016.
 */

(function ($) {

    var dot = function (x, y) {
        this.x = x;
        this.y = y;


    };

    // register the plugin
    $.fn.dotHover = function (dots, options) {

        // settings
        var settings = $.extend({
            // defaults
            img: "karte.png", //$('#example.jpg').first(),
            dots: [],
            width: "100px",
            height: "100px",
            setmode: false
        }, options );



        //
        // create tooltip canvas
        //
        var tooltip = $('<canvas/>')
            .appendTo('body')
            .addClass('dotHoverTooltip')
            .hide();



        //
        // handle tooltip positioning on mouse move
        //
        var mouseMoveEvent = function(event, img) {
            mouseX = parseInt(e.clientX - offsetX);
            mouseY = parseInt(e.clientY - offsetY);

            var hit = false;
            for (var i = 0; i < settings.dots.length; i++) {
                var dot = settings.dots[i];
                var dx = mouseX - dot.x;
                var dy = mouseY - dot.y;
                if (dx * dx + dy * dy < dot.rXr) {
                    tipCanvas.style.left = (dot.x) + "px";
                    tipCanvas.style.top = (dot.y - 40) + "px";
                    tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height);
                    //                  tipCtx.rect(0,0,tipCanvas.width,tipCanvas.height);
                    tipCtx.fillText($(dot.tip).val(), 5, 15);
                    tooltip.show();
                }
            }
            if (!hit) tooltip.hide();
        };

        //
        // places a new dot
        //
        var placedot = function (e) {
            
        };

        // init mouse move on each element
        this.each(function(i, el) {
            el.style= 'background: url(' + settings.img + ');' +
            'background-repeat: no-repeat; ' +
            'background-size: contain;' +
            'width: ' + settings.width + '; ';
            //'height: ' + settings.height + '; '


            $(el).mousemove (function (event) {
                mouseMoveEvent(event, el);
            });

            if(settings.setmode) $(el).click(placedot);
        });

        return this;
    };

})(jQuery);
