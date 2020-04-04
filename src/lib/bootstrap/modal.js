(function($) {
  $.extend($.fn.modal.Constructor.prototype, {
    // we don't want modal to add scrollbar padding
    measureScrollbar: function() {
      return 0;
    }
  });
})(jQuery);
