(function($) {
  var backdrop = '.dropdown-backdrop';
  var toggle   = '[data-toggle="dropdown"]';
  var stayOpen = '.stay-open';

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = selector && $(selector);

    return $parent && $parent.length ? $parent : $this.parent();
  }

  function clearMenus(e) {
    if (e && e.which === 3) return;

    var shouldStayOpen = false;
    $(stayOpen).each(function () {
      var $parent = $(this);
      if (e && e.type == 'click' && $.contains($parent[0], e.target)) shouldStayOpen = true;
    });

    if (shouldStayOpen) return;

    $(backdrop).remove();
    $(toggle).each(function () {
      var $this         = $(this);
      var $parent       = getParent($this);
      var relatedTarget = { relatedTarget: this };

      if (!$parent.hasClass('open')) return;

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.attr('aria-expanded', 'false');
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
    });
  }

  $.fn.dropdown.Constructor.prototype.toggle = function (e) {
    var $this = $(this);
    if ($this.is('.disabled, :disabled')) return;

    var $parent  = getParent($this);
    var isActive = $parent.hasClass('open');

    clearMenus();

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus);
      }

      var relatedTarget = { relatedTarget: this };
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true');

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget));
    }

    return false;
  };

  $(document).off('click.bs.dropdown.data-api');

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation(); })
    .on('click.bs.dropdown.data-api', toggle, $.fn.dropdown.Constructor.prototype.toggle);
})(jQuery);
