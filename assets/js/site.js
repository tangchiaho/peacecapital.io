(function () {
  document.documentElement.classList.add('js-ready');

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  if (toggle && nav) {
    var lastFocus = null;

    function setOpen(open, options) {
      var opts = options || {};
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);

      if (open) {
        lastFocus = document.activeElement;
        var first = nav.querySelector('a');
        if (first) first.focus();
        return;
      }

      if (opts.returnFocus) {
        var target = lastFocus && typeof lastFocus.focus === 'function' ? lastFocus : toggle;
        target.focus();
        lastFocus = null;
      }
    }

    toggle.addEventListener('click', function () {
      var willOpen = toggle.getAttribute('aria-expanded') !== 'true';
      setOpen(willOpen, { returnFocus: !willOpen });
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false, { returnFocus: true });
      }
    });

    window.addEventListener('resize', function () {
      if (window.matchMedia('(min-width: 901px)').matches) {
        setOpen(false);
      }
    });

    // Enable collapsible behaviour only after handlers are wired.
    document.documentElement.classList.add('js-nav');
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var nodes = document.querySelectorAll('.reveal');
  if (!nodes.length || !('IntersectionObserver' in window)) {
    nodes.forEach(function (el) { el.classList.add('is-inview'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-inview');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  nodes.forEach(function (el) { observer.observe(el); });
})();
