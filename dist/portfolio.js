const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!calm && 'IntersectionObserver' in window) {
  document.body.classList.add('pf-anim');
  // Stagger items that sit side by side.
  document.querySelectorAll('.pf-picks, .pf2-stats, .pf-roles, .pf-evidence').forEach(group =>
    [...group.children].forEach((item, i) => item.style.setProperty('--rd', `${(i % 4) * 0.1}s`)));

  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    reveal.unobserve(entry.target);
    const counter = entry.target.querySelector('[data-count]');
    if (counter) countUp(counter);
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  document.querySelectorAll('.pf-chips').forEach(list =>
    [...list.children].forEach((item, i) => item.style.setProperty('--rd', `${i * 0.05}s`)));
  document.querySelectorAll('.pf-reveal, .pf-evidence figure, .pf-chips').forEach(el => reveal.observe(el));
  addEventListener('beforeprint', () => document.querySelectorAll('.pf-reveal, .pf-evidence figure, .pf-chips').forEach(el => el.classList.add('is-in')));
}

// Count a stat up from zero, then restore its exact original text.
function countUp(el) {
  const final = el.textContent, value = Number(el.dataset.count);
  const decimals = (el.dataset.count.split('.')[1] || '').length;
  const prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
  let start;
  function step(t) {
    start ??= t;
    const p = Math.min(1, (t - start) / 1100);
    el.textContent = p === 1 ? final : prefix + (value * (1 - (1 - p) ** 3)).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
