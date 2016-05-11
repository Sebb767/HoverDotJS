/**
 * Created by (c) Sebastian Kaim, 2016
 *
 * This file is licensed under the MIT License.
 */
"use strict";

(function ($) {

    // returns whether values are less than (maxDev * 100)% away
    var isNearby = function (one, two, maxDev) {
        return Math.abs(1 - Math.abs(one / two)) < maxDev;
    };

    // dot helper class
    // x,y are assumend to already be relative to align unless el is not undefined
    var dot = function (_x, _y, _text, _align, el) {
        this.x = _x;
        this.y = _y;
        this.text = _text; // dot text
        this.align = _align; // {x, y} to which these coords are relative to
        this.radius = 24; // hover event radius

        if(el != undefined)
        {
            this.x = (this.x * this.align.x) / $(el).width();
            this.y = (this.y * this.align.y) / $(el).height();
        }

        this.relativeX = function (el) {
            return (this.x * $(el).width()) / this.align.x;
        };

        this.relativeY = function (el) {
            return (this.y * $(el).height()) / this.align.y;
        };

        this.render = function (context, el) {
            context.beginPath();
            context.arc(this.relativeX(el), this.relativeY(el), 4, 0, Math.PI * 2, true);
            context.fill();
        };

        // returns whether (x,y) match this point when relative to el or, if
        // el == undefined, they're matching (== diffrence less than maxDeviration)
        this.isMe = function (x, y, el, maxDeviration) {
            maxDeviration = maxDeviration || 0.01;
            if(el != undefined)
            {
                x = (x * this.align.x) / $(el).width();
                y = (y * this.align.y) / $(el).height();
            }
            return isNearby(x, this.x, maxDeviration) && isNearby(y, this.y, maxDeviration);
        };
    };

    // register the plugin
    $.fn.dotHover = function (dots, options) {

        // settings
        var settings = $.extend({
            // defaults

            // this should be a valid image url which will be used as background
            img: "karte.png",

            // whether to allow the user to place dots on click
            setmode: false,

            // a callback for when an event is created
            setcallback: function (dot) {},

            // default text for an unitialized dot
            defaulttext: "Example Text",

            // Whether to force a specific width to height ratio
            // for example, for 16:9 use
            // forceRatio: 1.77777777777778,
            forceRatio: false,

            // Reference width/height to which all coords are relative to.
            // Usually, there's no reason to change this, but if you have
            // old coords which are aligned differently you may want to
            // override this. The default values are pretty high for better
            // precision.
            align: {
                x: 100000, // width
                y: 100000 // height
            }

        }, options );

        // initialize dots
        settings.dots = [];
        $.each(dots, function (i, el) {
            settings.dots.push(new dot(el.x, el.y, el.text, settings.align));
        });

        //
        // create tooltip canvas
        //
        var tooltip = $('<div/>')
            .appendTo('body')
            .addClass('hoverDotTooltip')
            .css({
                backgroundColor: 'white',
                border: '1px solid blue',
                position: 'absolute',
                padding: '5px',
                marginLeft: '-50px'
            })
            .hide();

        var contexts = [];

        var showHideTooltip = function (show) {
            if(show)
            {
                tooltip.show();
                tooltip.get(0).style.marginLeft = ((-tooltip.width() / 2) + 3) + "px";
            }
            else
            {
                tooltip.hide();
            }
        };

        //
        // handle tooltip positioning on mouse move
        //
        var mouseMoveEvent = function(event, img, offsetX, offsetY) {
            var mouseX = parseInt(event.clientX - offsetX + $(window).scrollLeft());
            var mouseY = parseInt(event.clientY - offsetY + $(window).scrollTop());

            var hit = false;
            for (var i = 0; i < settings.dots.length; i++) {
                var dot = settings.dots[i];
                var dx = mouseX - dot.relativeX(img);
                var dy = mouseY - dot.relativeY(img);

                if (dx * dx + dy * dy < dot.radius) {
                    tooltip.get(0).style.top = ((dot.relativeY(img) - 40) + offsetY) + "px"; // -40 to "center" the canvas
                    tooltip.get(0).style.left = (dot.relativeX(img) + offsetX) + "px";

                    tooltip.html(dot.text);
                    hit = true;
                }
            }

            showHideTooltip(hit);
        };

        // re-renders all dots
        var render = function () {
            $.each(contexts, function (i, data) {
                $.each(settings.dots, function (j, dot) {
                    dot.render(data.ctx, data.el);
                });
            });
        };

        //
        // places a new dot
        //
        var placedot = function (event, element) {
            var ndot = new dot(event.clientX - element.offsetLeft,
                event.clientY - element.offsetTop + $(window).scrollTop(),
                settings.defaulttext,
                settings.align,
                element);

            settings.dots.push(ndot);
            render();
            settings.setcallback(ndot);
        };

        //
        // removes a dot
        //
        this.removeDot = function(x, y)
        {
            settings.dots = settings.dots.filter(function(el, index) {
                return dot.x != x && dot.y != y;
            });
        };

        // init mouse move on each element
        this.each(function(i, el) {
            el.style= 'background: url(' + settings.img + ');' +
            'background-repeat: no-repeat; ' +
            'background-size: 100% 100%;' +
            'width: ' + settings.width + '; ';
            //'height: ' + settings.height + '; '

            var jqel = $(el);

            contexts.push( { el: el, ctx: el.getContext('2d') });

            jqel.mousemove (function (event) {
                mouseMoveEvent(event, el, el.offsetLeft, el.offsetTop);
            });

            if(settings.setmode) jqel.click(function (e) {
                placedot(e, el);
            });

            jqel.resize(function (e) {
                if(isNumeric(settings.forceRatio))
                    jqel.height(jqel.width() * settings.forceRatio);
                render();
            });
        });

        // render initial dots
        render();

        return this;
    };

})(jQuery);
