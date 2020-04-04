(function($){
  // !! Teefan: there are two a bit different solutions, the later one looks better or with a more natural scrolling

  // $.fn.isolatedScroll = function( options ){
  //   defaults = {
  //     // only blocks scroll if area is scrollable, set to false to always disable other element scroll
  //     autoscroll: true
  //   }
  //   options = $.extend( defaults, options );
  //
  //   return this.bind( 'touchmove mousewheel DOMMouseScroll', function ( e ) {
  //     if( !options.autoscroll || ($(this).outerHeight() < $(this)[0].scrollHeight) ) {
  //       var e0 = e.originalEvent,
  //           delta = e0.wheelDelta || -e0.detail;
  //
  //       this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
  //       e.preventDefault();
  //     }
  //   });
  // };

  $.fn.isolatedScroll = function() {
    this.bind('touchmove mousewheel DOMMouseScroll', function (e) {
      var delta = e.wheelDelta || (e.originalEvent && e.originalEvent.wheelDelta) || -e.detail,
          bottomOverflow = this.scrollTop + $(this).outerHeight() - this.scrollHeight >= 0,
          topOverflow = this.scrollTop <= 0;

      if ((delta < 0 && bottomOverflow) || (delta > 0 && topOverflow)) {
        e.preventDefault();
      }
    });
    return this;
  };
}(jQuery));
