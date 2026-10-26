(() => {
  const stories = [...document.querySelectorAll('.publication-story')];
  if (!stories.length) return;
  const tools = document.querySelector('.publication-tools');
  const buttons = [...document.querySelectorAll('.publication-filter button')];
  const searchForm = document.querySelector('.publication-search');
  const search = document.getElementById('article-search');
  const typeSelect = document.getElementById('article-type');
  const status = document.querySelector('.publication-filter-status');
  const reset = document.querySelector('.publication-clear');
  const empty = document.querySelector('.publication-empty');
  const industries = ['生技與醫療', '人工智慧與軟體', '半導體', '能源與永續', '先進材料'];
  const types = ['產業入門', '專題研究', '企業分析'];
  const tokens = value => String(value || '').trim().split(/\s+/).filter(Boolean);
  const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase();
  const entries = stories.map(story => ({
    story,
    industry: tokens(story.dataset.industry || story.dataset.topic),
    type: tokens(story.dataset.type),
    text: normalize(story.textContent),
  }));
  let state = { topic: 'all', type: 'all', query: '' };

  function readUrl() {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get('topic');
    const type = params.get('type');
    return {
      topic: industries.includes(topic) ? topic : industries.includes(type) ? type : 'all',
      type: types.includes(type) ? type : types.includes(topic) ? topic : 'all',
      query: (params.get('q') || '').trim().slice(0, 160),
    };
  }

  function render(updateUrl = false) {
    const terms = normalize(state.query).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const entry of entries) {
      const show = (state.topic === 'all' || entry.industry.includes(state.topic)) &&
        (state.type === 'all' || entry.type.includes(state.type)) &&
        terms.every(term => entry.text.includes(term));
      entry.story.hidden = !show;
      if (show) count++;
    }
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.category === state.topic));
    }
    const active = state.topic !== 'all' || state.type !== 'all' || !!state.query;
    const labels = [state.topic !== 'all' && state.topic, state.type !== 'all' && state.type, state.query && `「${state.query}」`].filter(Boolean);
    if (status) status.textContent = `${labels.length ? labels.join(' · ') + ' — ' : ''}${count} 篇文章`;
    if (reset) reset.hidden = !active;
    if (empty) empty.hidden = count !== 0;
    if (updateUrl && window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      for (const key of ['topic', 'type', 'q']) url.searchParams.delete(key);
      if (state.topic !== 'all') url.searchParams.set('topic', state.topic);
      if (state.type !== 'all') url.searchParams.set('type', state.type);
      if (state.query) url.searchParams.set('q', state.query);
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }
  }

  function syncFromUrl(scroll = false) {
    state = readUrl();
    if (search) search.value = state.query;
    if (typeSelect) typeSelect.value = state.type;
    render();
    if (scroll && (state.topic !== 'all' || state.type !== 'all' || state.query)) {
      document.getElementById('all-stories')?.scrollIntoView({ block: 'start' });
    }
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      state.topic = button.dataset.category;
      render(true);
    });
  }
  typeSelect?.addEventListener('change', () => {
    state.type = typeSelect.value;
    render(true);
  });
  search?.addEventListener('input', () => {
    state.query = search.value.trim().slice(0, 160);
    render(true);
  });
  searchForm?.addEventListener('submit', event => event.preventDefault());
  reset?.addEventListener('click', () => {
    state = { topic: 'all', type: 'all', query: '' };
    if (search) search.value = '';
    if (typeSelect) typeSelect.value = 'all';
    render(true);
    search?.focus();
  });
  window.addEventListener('popstate', () => syncFromUrl());
  if (tools) tools.hidden = false;
  syncFromUrl(true);
})();
