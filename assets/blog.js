const themeButton = document.querySelector('.theme-toggle');
function syncThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式');
}
syncThemeButton();
themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('fjw-theme', next); } catch {}
  syncThemeButton();
});

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(other => {
      other.classList.toggle('active', other === button);
      other.setAttribute('aria-pressed', String(other === button));
    });
    document.querySelectorAll('.post-row').forEach(row => {
      row.hidden = button.dataset.filter !== '全部' && row.dataset.category !== button.dataset.filter;
    });
  });
});

const dialog = document.querySelector('.search-dialog');
const input = document.querySelector('#search-input');
const results = document.querySelector('#search-results');
const status = document.querySelector('#search-status');
let searchIndex;
let searchPromise;
async function loadIndex() {
  if (!searchPromise) searchPromise = fetch('/search.json').then(response => {
    if (!response.ok) throw new Error('Search unavailable');
    return response.json();
  }).catch(error => { searchPromise = undefined; throw error; });
  searchIndex = await searchPromise;
  return searchIndex;
}
async function renderSearch() {
  const query = input.value.trim().toLocaleLowerCase();
  results.replaceChildren();
  if (!query) { status.textContent = '输入关键词，寻找一篇文章。'; return; }
  status.textContent = '正在查找…';
  try {
    const index = await loadIndex();
    if (input.value.trim().toLocaleLowerCase() !== query) return;
    const matches = index.filter(post => [post.title, post.description, post.category, ...(post.tags || []), post.content].join(' ').toLocaleLowerCase().includes(query));
    status.textContent = matches.length ? `找到 ${matches.length} 篇相关文章` : '没有找到相关文章，试试其他关键词。';
    matches.forEach(post => {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = post.url;
      const category = document.createElement('small');
      category.textContent = post.category;
      const title = document.createElement('strong');
      title.textContent = post.title;
      const description = document.createElement('p');
      description.textContent = post.description;
      link.append(category, title, description);
      results.append(link);
    });
  } catch {
    status.textContent = '搜索暂时不可用，请稍后重试，或前往文章归档浏览。';
  }
}
document.querySelector('[data-search-open]').addEventListener('click', () => {
  dialog.showModal();
  input.focus();
  renderSearch();
});
document.querySelector('[data-search-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
input.addEventListener('input', renderSearch);
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (!dialog.open) dialog.showModal();
    input.focus();
  }
});

const selectedTag = new URLSearchParams(location.search).get('tag');
if (location.pathname.startsWith('/categories/') && selectedTag) {
  const label = document.querySelector('.tag-selection');
  label.hidden = false;
  label.append(document.createTextNode(`当前标签：${selectedTag} · `));
  const clear = document.createElement('a');
  clear.href = '/categories/';
  clear.textContent = '查看全部';
  label.append(clear);
  let visibleCount = 0;
  document.querySelectorAll('.category-section').forEach(section => {
    let sectionCount = 0;
    section.querySelectorAll('.post-row').forEach(row => {
      const match = [...row.querySelectorAll('.post-tags > span:not(.sample)')].some(tag => tag.textContent === `# ${selectedTag}`);
      row.hidden = !match;
      if (match) sectionCount++;
    });
    section.hidden = sectionCount === 0;
    visibleCount += sectionCount;
    section.querySelector('.section-heading .eyebrow').textContent = `${sectionCount} 篇文章`;
  });
  document.querySelector('.tag-empty').hidden = visibleCount !== 0;
}

const progress = document.querySelector('.reading-progress');
if (progress) {
  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${total > 0 ? Math.min(100, scrollY / total * 100) : 100}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();
  const headings = document.querySelectorAll('.prose h2, .prose h3');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.toc a').forEach(link => {
            link.classList.toggle('current', link.hash === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: '-10% 0px -65% 0px' });
    headings.forEach(heading => observer.observe(heading));
  }
}
