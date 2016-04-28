/**
 * Created by sebastian.kaim on 26.04.2016.
 */
"use strict";

(function ($) {

    // dot helper class
    var dot = function (_x, _y, _text) {
        this.x = _x;
        this.y = _y;
        this.text = _text;
        this.radius = 16; // hover event radius

        this.render = function (context) {
            context.beginPath();
            context.arc(this.x, this.y, 4, 0, Math.PI * 2, true);
            context.fill();
        };
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
            setmode: true
        }, options );



        //
        // create tooltip canvas
        //
        var tooltip = $('<canvas/>')
            .appendTo('body')
            .addClass('dotHoverTooltip')
            .hide();
        var tooltipctx = tooltip.get(0).getContext('2d');

        var contexts = [];

        //
        // handle tooltip positioning on mouse move
        //
        var mouseMoveEvent = function(event, img, offsetX, offsetY) {
            var mouseX = parseInt(event.clientX - offsetX);
            var mouseY = parseInt(event.clientY - offsetY);

            var hit = false;
            for (var i = 0; i < settings.dots.length; i++) {
                var dot = settings.dots[i];
                var dx = mouseX - dot.x;
                var dy = mouseY - dot.y;

                if (dx * dx + dy * dy < dot.radius) {
                    console.log("hit");
                    tooltip.css({top: (dot.y - 40) + "px", left: (dot.x) + "px"});
                    tooltipctx.clearRect(0, 0, tooltip.width, tooltip.height);
                    //                  tipCtx.rect(0,0,tipCanvas.width,tipCanvas.height);
                    tooltipctx.fillText($(dot.tip).val(), 5, 15);
                    tooltip.show();
                    hit = true;
                }
            }
            if (!hit) tooltip.hide();
        };

        // re-renders all dots
        var render = function () {
            $.each(contexts, function (i, ctx) {
                $.each(settings.dots, function (j, dot) {
                    dot.render(ctx);
                });
            });
        };

        //
        // places a new dot
        //
        var placedot = function (e) {
            settings.dots.push(new dot(e.clientX, e.clientY, "Example Text"));
            render();
        };

        // init mouse move on each element
        this.each(function(i, el) {
            el.style= 'background: url(' + settings.img + ');' +
            'background-repeat: no-repeat; ' +
            'background-size: contain;' +
            'width: ' + settings.width + '; ';
            //'height: ' + settings.height + '; '

            contexts.push(el.getContext('2d'));

            $(el).mousemove (function (event) {
                mouseMoveEvent(event, el, el.offsetLeft, el.offsetTop);
            });

            if(settings.setmode) $(el).click(placedot);
        });

        return this;
    };

})(jQuery);
