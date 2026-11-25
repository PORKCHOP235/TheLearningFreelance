// Tool logos for the "Works with" chips.
document.querySelectorAll('.svc-tools span[data-domain]').forEach(chip => {
  const img = new Image();
  img.alt = ''; img.width = 18; img.height = 18;
  img.src = `https://www.google.com/s2/favicons?domain=${chip.dataset.domain}&sz=128`;
  img.onerror = () => img.remove();
  chip.prepend(img);
});

// Reveal cards, steps, and industries as they scroll into view.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  document.body.classList.add('svc-anim');
  document.querySelectorAll('.sv-grid, .sv-proof-grid').forEach(list =>
    [...list.children].forEach((item, i) => item.style.setProperty('--rd', `${i * 0.15}s`)));
  document.querySelectorAll('.svc-steps, .svc-industries').forEach(list =>
    [...list.children].forEach((item, i) => item.style.setProperty('--rd', `${i * 0.12}s`)));

  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    reveal.unobserve(entry.target);
  }), { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

  document.querySelectorAll('.svc-reveal, .svc-steps').forEach(el => reveal.observe(el));
  addEventListener('beforeprint', () => document.querySelectorAll('.svc-reveal, .svc-steps').forEach(el => el.classList.add('is-in')));
}

// Service tabs: click, arrow keys, and links like #marketing open the matching tab.
(() => {
  const tabs = [...document.querySelectorAll('.st-tab')];
  if (!tabs.length) return;
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  function select(i, focus) {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
      panels[k].classList.toggle('in', on);
    });
    if (focus) tabs[i].focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      select((i + d + tabs.length) % tabs.length, true);
    });
  });
  function fromHash() {
    const i = panels.findIndex(p => '#' + p.id === location.hash);
    if (i < 0) return;
    select(i);
    document.querySelector('.st-tabs').scrollIntoView({ block: 'start' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const i = panels.findIndex(p => '#' + p.id === a.getAttribute('href'));
    if (i < 0) return;
    e.preventDefault();
    history.replaceState(null, '', a.getAttribute('href'));
    select(i);
    document.querySelector('.st-tabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  addEventListener('hashchange', fromHash);
  fromHash();
})();

// Count the results up from zero when they scroll into view, then restore the exact text.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const counter = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    counter.unobserve(entry.target);
    const el = entry.target, final = el.textContent, value = Number(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
    let start;
    const step = t => {
      start ??= t;
      const p = Math.min(1, (t - start) / 1400);
      el.textContent = p === 1 ? final : prefix + (value * (1 - (1 - p) ** 3)).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  document.querySelectorAll('.sv-stat b[data-count]').forEach(el => counter.observe(el));
}
