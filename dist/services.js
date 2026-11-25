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
