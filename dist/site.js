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
