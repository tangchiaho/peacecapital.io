(() => {
  const buttons = [...document.querySelectorAll('.publication-filter button')];
  const stories = [...document.querySelectorAll('.publication-story')];
  const status = document.querySelector('.publication-filter-status');
  if (!stories.length) return;

  /* Valid URL values — independent of which filter buttons are rendered. */
  const INDUSTRIES = [
    '生技與醫療',
    '人工智慧與軟體',
    '半導體',
    '能源與永續',
    '先進材料',
  ];
  const TYPES = ['產業入門', '專題研究', '企業分析'];

  function tokens(value) {
    return String(value || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }

  function isType(category) {
    return TYPES.includes(category);
  }

  function isIndustry(category) {
    return INDUSTRIES.includes(category);
  }

  function isValidCategory(category) {
    return category === 'all' || isType(category) || isIndustry(category);
  }

  function storyMatches(story, category) {
    if (!category || category === 'all') return true;
    const industry = tokens(story.dataset.industry);
    const type = tokens(story.dataset.type);
    const legacy = tokens(story.dataset.topic);
    return industry.includes(category) || type.includes(category) || legacy.includes(category);
  }

  function applyFilter(category, options) {
    const opts = options || {};
    const selected = isValidCategory(category) ? category : 'all';
    let n = 0;
    const matchingButton = buttons.find((b) => b.dataset.category === selected);

    buttons.forEach((b) => {
      const pressed = matchingButton ? b === matchingButton : false;
      b.setAttribute('aria-pressed', String(pressed));
    });

    stories.forEach((s) => {
      const show = storyMatches(s, selected);
      s.hidden = !show;
      if (show) n += 1;
    });

    if (status) {
      status.textContent = `顯示${selected === 'all' ? '全部' : selected} ${n} 篇文章`;
    }

    if (opts.updateUrl && window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete('topic');
      url.searchParams.delete('type');
      if (selected !== 'all') {
        url.searchParams.set(isType(selected) ? 'type' : 'topic', selected);
      }
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }

    if (opts.scrollToFeed) {
      const feed = document.getElementById('all-stories');
      if (feed) feed.scrollIntoView({ block: 'start' });
    }

    return selected;
  }

  function categoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const topic = params.get('topic');
    if (type) return isValidCategory(type) ? type : 'all';
    if (topic) return isValidCategory(topic) ? topic : 'all';
    return 'all';
  }

  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      applyFilter(button.dataset.category || 'all', { updateUrl: true });
    })
  );

  const initial = categoryFromUrl();
  applyFilter(initial, {
    updateUrl: false,
    scrollToFeed: initial !== 'all',
  });
})();

(() => {
  function reveal(hash) {
    let target;
    try {
      target = document.getElementById(decodeURIComponent((hash || '').replace(/^#/, '')));
    } catch {
      return;
    }
    if (!target) return;
    let changed = false;
    for (let p = target.parentElement; p; p = p.parentElement) {
      if (p.tagName === 'DETAILS' && !p.open) {
        p.open = true;
        changed = true;
      }
    }
    if (changed) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
  addEventListener('hashchange', () => reveal(location.hash));
  document.addEventListener('click', (event) => {
    const a = event.target.closest('a[href^="#"]');
    if (a) reveal(a.getAttribute('href'));
  });
  reveal(location.hash);
})();

/* Reading progress + TOC current chapter */
(() => {
  if (!document.body.classList.contains('article-publication')) return;

  const article =
    document.querySelector('.publication-reading-layout article') ||
    document.querySelector('article.company-content') ||
    document.querySelector('article');
  if (!article) return;

  let bar = document.querySelector('.reading-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', '閱讀進度');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', '0');
    const fill = document.createElement('div');
    fill.className = 'reading-progress-fill';
    bar.appendChild(fill);
    document.body.prepend(bar);
  }
  const fill = bar.querySelector('.reading-progress-fill');

  const tocLinks = [
    ...document.querySelectorAll('.publication-toc a[href^="#"], .publication-mobile-toc a[href^="#"]'),
  ];
  const headings = tocLinks
    .map((a) => {
      try {
        return document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateProgress() {
    const rect = article.getBoundingClientRect();
    const total = article.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
    const pct = total <= 0 ? 100 : Math.round((scrolled / total) * 100);
    fill.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', String(pct));
  }

  function setActiveHeading(id) {
    tocLinks.forEach((a) => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      ticking = false;
    });
  }

  updateProgress();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', updateProgress);

  if (!headings.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0] && visible[0].target.id) setActiveHeading(visible[0].target.id);
    },
    {
      rootMargin: reduceMotion ? '-20% 0px -55% 0px' : '-18% 0px -60% 0px',
      threshold: [0, 0.25, 0.6],
    }
  );
  headings.forEach((h) => io.observe(h));
})();
