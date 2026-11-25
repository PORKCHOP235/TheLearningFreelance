const form = document.querySelector('#inquiry');
const status = document.querySelector('#form-status');
const submit = form.querySelector('button[type="submit"]');

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      reveal.unobserve(entry.target);
      if (!reducedMotion.matches) entry.target.classList.add('reveal-in');
    }
  }, { threshold: 0.08 });

  document.querySelectorAll('.section h2, .intro-copy, .case, .service-grid details, .about .lead, #inquiry')
    .forEach((element) => reveal.observe(element));

  const counters = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      counters.unobserve(target);
      if (reducedMotion.matches) continue;
      const finalText = target.textContent;
      const value = Number(target.dataset.count);
      const decimals = target.dataset.count.split('.')[1]?.length ?? 0;
      const prefix = target.dataset.prefix ?? '';
      let start;

      function count(time) {
        start ??= time;
        const progress = Math.min(1, (time - start) / 950);
        if (progress === 1 || reducedMotion.matches) {
          target.textContent = finalText;
          return;
        }
        const eased = 1 - (1 - progress) ** 3;
        target.textContent = prefix + (value * eased).toFixed(decimals) + 'M';
        requestAnimationFrame(count);
      }

      requestAnimationFrame(count);
    }
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach((element) => counters.observe(element));
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const endpoint = form.dataset.endpoint;
  if (!endpoint) {
    status.textContent = 'This preview cannot send requests yet. Your details have not been sent.';
    return;
  }

  submit.disabled = true;
  status.textContent = 'Sending your request…';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });
    // Formspree answers with {"ok": true}, or {"errors": [{"message": ...}]} when a field is invalid.
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.errors) throw new Error((result.errors || []).map(e => e.message).join(' ') || 'Submission failed');
    form.reset();
    status.textContent = 'Thanks for telling me about your business. I’ll email you to schedule your free growth review.';
  } catch (error) {
    const detail = error.message && error.message !== 'Submission failed' && error.message !== 'Failed to fetch' ? ` ${error.message}` : '';
    status.textContent = `Your request could not be sent.${detail} Please try again, or email enadjonel18@gmail.com.`;
  } finally {
    submit.disabled = false;
  }
});


