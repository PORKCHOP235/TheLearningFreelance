const stagesEl = document.getElementById('stack-stages');

// The stages and cards are written into tool-stack.html so search engines can read them.
// Here we only swap in a letter when a logo fails to load.
stagesEl.querySelectorAll('.stack-logo img').forEach(img => {
  const fallback = () => { const logo = img.parentNode; logo.classList.add('fallback'); logo.textContent = img.dataset.letter; };
  if (img.complete && !img.naturalWidth) fallback(); else img.addEventListener('error', fallback);
});

const search = document.getElementById('tool-search');
const picksOnly = document.getElementById('picks-only');
const empty = document.getElementById('stack-empty');
function filterTools() {
  const term = search.value.trim().toLowerCase(); let any = false;
  stagesEl.querySelectorAll('.stack-stage').forEach(section => {
    let shown = 0;
    section.querySelectorAll('.stack-tool').forEach(card => {
      const ok = (!term || card.dataset.text.includes(term)) && (!picksOnly.checked || card.dataset.pick === '1');
      card.hidden = !ok; if (ok) shown++;
    });
    section.hidden = !shown; if (shown) any = true;
  });
  empty.hidden = any;
}
// Pop cards in slowly, one stage at a time, as each stage scrolls into view.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  document.body.classList.add('stack-anim');
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-in'); reveal.unobserve(entry.target); }
  }), { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  stagesEl.querySelectorAll('.stack-stage').forEach(section => reveal.observe(section));
  addEventListener('beforeprint', () => stagesEl.querySelectorAll('.stack-stage').forEach(s => s.classList.add('is-in')));
}

search.addEventListener('input', filterTools);
picksOnly.addEventListener('change', filterTools);
