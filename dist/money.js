// Reveal the leak cards, levers and steps as they scroll into view, side-by-side items one after another.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  document.body.classList.add('m-anim');
  document.querySelectorAll('.leak-grid, .lever-grid, .how-steps, .grow-steps, .rm-steps').forEach(group =>
    [...group.children].forEach((el, i) => el.style.setProperty('--rd', `${i * (group.classList.contains('leak-grid') ? 0.16 : 0.1)}s`)));
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    reveal.unobserve(entry.target);
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  document.querySelectorAll('.m-reveal').forEach(el => reveal.observe(el));
  addEventListener('beforeprint', () => document.querySelectorAll('.m-reveal').forEach(el => el.classList.add('is-in')));
}
