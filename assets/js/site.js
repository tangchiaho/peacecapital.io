(function () {
  document.documentElement.classList.add('js-ready');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.documentElement.classList.add('js-reduced');
  }

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

  /* Brand mark: one-shot line draw, then settle */
  var heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    if (reduceMotion) {
      heroVisual.classList.add('is-drawn');
    } else {
      requestAnimationFrame(function () {
        heroVisual.classList.add('is-drawn');
      });
    }
  }

  /* Focus panel: keyboard + click selection with image crossfade */
  document.querySelectorAll('[data-focus-panel]').forEach(function (panel) {
    var options = Array.prototype.slice.call(panel.querySelectorAll('.focus-panel-option'));
    var images = Array.prototype.slice.call(panel.querySelectorAll('.focus-panel-image'));
    var list = panel.querySelector('.focus-panel-list');
    if (!options.length) return;

    function select(index, focusOption) {
      var i = Math.max(0, Math.min(index, options.length - 1));
      options.forEach(function (opt, idx) {
        var on = idx === i;
        opt.classList.toggle('is-active', on);
        opt.setAttribute('aria-selected', on ? 'true' : 'false');
        opt.tabIndex = on ? 0 : -1;
      });
      var creditText = '';
      images.forEach(function (img) {
        var on = String(img.getAttribute('data-focus-image')) === String(i);
        img.classList.toggle('is-active', on);
        if (on) creditText = img.getAttribute('data-credit') || '';
      });
      var credit = panel.parentElement
        ? panel.parentElement.querySelector('[data-focus-credit]')
        : null;
      if (!credit) credit = document.querySelector('[data-focus-credit]');
      // Prefer credit sibling within the same section container
      var sectionCredit = panel.closest('.container') && panel.closest('.container').querySelector('[data-focus-credit]');
      if (sectionCredit) credit = sectionCredit;
      if (credit && creditText) credit.textContent = creditText;
      if (list) {
        list.setAttribute('aria-activedescendant', options[i].id);
      }
      if (focusOption) options[i].focus();
    }

    select(0, false);

    options.forEach(function (opt, idx) {
      opt.addEventListener('click', function () {
        select(idx, false);
      });

      opt.addEventListener('keydown', function (event) {
        var next = idx;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          event.preventDefault();
          next = (idx + 1) % options.length;
          select(next, true);
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          event.preventDefault();
          next = (idx - 1 + options.length) % options.length;
          select(next, true);
        } else if (event.key === 'Home') {
          event.preventDefault();
          select(0, true);
        } else if (event.key === 'End') {
          event.preventDefault();
          select(options.length - 1, true);
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select(idx, false);
        }
      });
    });
  });

  var nodes = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!nodes.length) return;

  function showAll() {
    nodes.forEach(function (el) {
      el.classList.add('is-inview');
      el.classList.remove('is-pending');
    });
  }

  if (reduceMotion) {
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

  document.documentElement.classList.add('js-reveal');

  requestAnimationFrame(function () {
    nodes.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
        markInView(el);
        observer.unobserve(el);
      }
    });
  });

  window.setTimeout(showAll, 900);
})();
