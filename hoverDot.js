/**
 * Created by sebastian.kaim on 26.04.2016.
 */

(function ($) {

    // register the plugin
    $.fn.dotHover = function (options) {

        var settings = $.extend({
            // defaults
            img: $('#example.jpg').first()

        }, options );

        var tooltip = $('<canvas/>', {
            style: ''
        }).appendTo('body');

        return this.each(function() {
            // init each element
        });
    };

})(jQuery);
