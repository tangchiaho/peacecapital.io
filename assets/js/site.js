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

    document.documentElement.classList.add('js-nav');
  }

  var nodes = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!nodes.length) return;

  function showAll() {
    nodes.forEach(function (el) {
      el.classList.add('is-inview');
      el.classList.remove('is-pending');
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showAll();
    return;
  }

  if (!('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  var revealed = 0;

  function markInView(el) {
    if (el.classList.contains('is-inview')) return;
    el.classList.add('is-inview');
    el.classList.remove('is-pending');
    revealed += 1;
    if (revealed >= nodes.length) observer.disconnect();
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      markInView(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

  nodes.forEach(function (el) {
    el.classList.add('is-pending');
    observer.observe(el);
  });

  // Arm hide-until-visible only after observers are attached.
  document.documentElement.classList.add('js-reveal');

  // Immediately reveal anything already in (or near) the viewport.
  requestAnimationFrame(function () {
    nodes.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
        markInView(el);
        observer.unobserve(el);
      }
    });
  });

  // Failsafe: never leave content invisible after fast scroll / stalled IO.
  window.setTimeout(showAll, 900);
})();
