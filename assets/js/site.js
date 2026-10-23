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

  /* Sector explorer: ordinary anchor links and visible panels until enhanced. */
  document.querySelectorAll('[data-sector-explorer]').forEach(function (explorer) {
    var nav = explorer.querySelector('.sector-nav');
    var tabs = Array.prototype.slice.call(explorer.querySelectorAll('.sector-nav-link'));
    var panels = tabs.map(function (tab) {
      return document.getElementById(tab.getAttribute('href').slice(1));
    });
    if (!nav || !tabs.length || panels.some(function (panel) { return !panel; })) return;

    function orientation() {
      nav.setAttribute('aria-orientation', window.matchMedia('(max-width: 900px)').matches ? 'horizontal' : 'vertical');
    }

    function warmImage(index) {
      var img = panels[index].querySelector('img');
      if (img) img.loading = 'eager';
    }

    function select(index, moveFocus) {
      tabs.forEach(function (tab, i) {
        var active = i === index;
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
      });
      warmImage(index);
      if (moveFocus) tabs[index].focus({ preventScroll: true });
      if (nav.getAttribute('aria-orientation') === 'horizontal') {
        var left = tabs[index].getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft;
        var right = left + tabs[index].offsetWidth;
        if (left < nav.scrollLeft) nav.scrollLeft = left;
        else if (right > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = right - nav.clientWidth;
      }
    }

    nav.setAttribute('role', 'tablist');
    orientation();
    tabs.forEach(function (tab, index) {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panels[index].id);
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', tab.id);
      panels[index].tabIndex = 0;
      tab.addEventListener('pointerenter', function () { warmImage(index); });
      tab.addEventListener('focus', function () { warmImage(index); });
      tab.addEventListener('click', function (event) {
        event.preventDefault();
        select(index, false);
      });
      tab.addEventListener('keydown', function (event) {
        var horizontal = nav.getAttribute('aria-orientation') === 'horizontal';
        var forward = horizontal ? 'ArrowRight' : 'ArrowDown';
        var back = horizontal ? 'ArrowLeft' : 'ArrowUp';
        var next = index;
        if (event.key === forward) next = (index + 1) % tabs.length;
        else if (event.key === back) next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else if (event.key === 'Enter' || event.key === ' ') next = index;
        else return;
        event.preventDefault();
        select(next, true);
      });
    });
    explorer.classList.add('is-enhanced');
    var initial = panels.findIndex(function (panel) { return '#' + panel.id === window.location.hash; });
    select(initial < 0 ? 0 : initial, false);
    window.addEventListener('resize', orientation);
    window.addEventListener('hashchange', function () {
      var next = panels.findIndex(function (panel) { return '#' + panel.id === window.location.hash; });
      if (next >= 0) select(next, false);
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
