const form = document.querySelector('#inquiry');
const status = document.querySelector('#form-status');
const submit = form.querySelector('button[type="submit"]');

const hero = document.querySelector('.hero');
const portrait = hero.querySelector('.portrait');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0;
let previousTime = 0;
let position = 0;
let target = 0;

function movePortrait(time) {
  const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16;
  previousTime = time;
  position += (target - position) * (1 - Math.exp(-elapsed / 105));
  if (Math.abs(target - position) < 0.001) position = target;
  portrait.style.transform = `translate3d(-50%, ${position.toFixed(3)}%, 0)`;
  frame = position === target ? 0 : requestAnimationFrame(movePortrait);
  if (!frame) previousTime = 0;
}

function updatePortrait() {
  if (reducedMotion.matches) {
    cancelAnimationFrame(frame);
    frame = previousTime = position = target = 0;
    portrait.style.removeProperty('transform');
    return;
  }
  const { top, height } = hero.getBoundingClientRect();
  target = Math.max(0, Math.min(1, -top / height)) * 38;
  if (!frame && position !== target) frame = requestAnimationFrame(movePortrait);
}

addEventListener('scroll', updatePortrait, { passive: true });
addEventListener('resize', updatePortrait);
reducedMotion.addEventListener('change', updatePortrait);
updatePortrait();

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
    if (!response.ok) throw new Error('Submission failed');
    form.reset();
    status.textContent = 'Thanks for telling me about your business. I’ll email you to coordinate a discovery call.';
  } catch {
    status.textContent = 'Your request could not be sent. Please try again.';
  } finally {
    submit.disabled = false;
  }
});
