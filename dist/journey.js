const calmMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Give every task a clear next step ---------- */
(() => {
  const section = document.querySelector('.flow-section');
  if (!section) return;
  const nodes = [...section.querySelectorAll('.flow-node')];
  const links = [...section.querySelectorAll('.flow-link')];
  const state = section.querySelector('#flow-state');
  const msg = section.querySelector('#flow-msg');
  const bar = section.querySelector('#flow-bar');
  const STEPS = [
    ['New', 'A customer asks about catering for 40 guests on the website.'],
    ['Logged', 'Added to the CRM, tagged “catering” and “website”.'],
    ['Assigned', 'Your catering lead owns it, with a quote due today.'],
    ['Scheduled', 'Follow-up reminder set for Friday at 10 AM.'],
  ];
  const DONE = 'Quote sent and follow-up scheduled. Nothing slipped.';

  function show(step) {
    nodes.forEach((n, i) => {
      n.classList.toggle('done', i < step || step === 4);
      n.classList.toggle('active', i === step);
    });
    links.forEach((l, i) => l.classList.toggle('filled', i < step));
    const done = step === 4;
    state.textContent = done ? 'Done' : STEPS[step][0];
    state.classList.toggle('is-done', done);
    msg.textContent = done ? DONE : STEPS[step][1];
    msg.classList.remove('swap'); void msg.offsetWidth; msg.classList.add('swap');
    bar.style.setProperty('--p', (step + 1) / 5);
  }

  if (calmMotion) { show(4); return; }

  // Steps 0–3 move the task along; step 4 holds on "Done" before the loop restarts.
  let step = 0, visible = false;
  const paused = () => section.classList.contains('workflow-paused');
  function tick() {
    if (paused() || !visible) { setTimeout(tick, 300); return; }
    show(step);
    const wait = step === 4 ? 2800 : 1700;
    step = (step + 1) % 5;
    setTimeout(tick, wait);
  }
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .3 }).observe(section);
  show(0);
  tick();
})();

/* ---------- Customer journey: compact stepper ---------- */
(() => {
  const root = document.querySelector('.journey');
  if (!root) return;
  const tabs = [...root.querySelectorAll('.jn-step')];
  const panes = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  const STEP_MS = 5200;
  let current = 0, start = 0, visible = false, paused = false;

  // Number the parts of each preview so they appear in order.
  panes.forEach(p => p.querySelectorAll('.jp-anim, .jp-bubble, .jp-tasks li').forEach((el, k) => el.style.setProperty('--k', k)));

  function show(i, focus) {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      t.style.setProperty('--p', 0);
      panes[k].hidden = !on;
      panes[k].classList.remove('in');
    });
    void panes[i].offsetWidth;
    panes[i].classList.add('in');
    if (focus) tabs[i].focus();
    // On phones the steps are a swipeable row: keep the active one in view without moving the page.
    const row = tabs[i].closest('.jn-steps');
    if (row.scrollWidth > row.clientWidth) row.scrollTo({ left: tabs[i].parentElement.offsetLeft - 16, behavior: 'smooth' });
    current = i;
    start = performance.now();
  }

  // A visitor's click or arrow key picks a step and stops the auto-advance.
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { show(i); paused = true; tabs[i].style.setProperty('--p', 1); });
    t.addEventListener('keydown', e => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      show((current + d + tabs.length) % tabs.length, true);
      paused = true;
    });
  });

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('jn-live');
  show(0);

  // Auto-advance only while the section is on screen.
  function tick(now) {
    if (visible && !paused) {
      const p = Math.min(1, (now - start) / STEP_MS);
      tabs[current].style.setProperty('--p', p);
      if (p >= 1) show((current + 1) % tabs.length);
    } else if (!visible) {
      start = now - (parseFloat(tabs[current].style.getPropertyValue('--p')) || 0) * STEP_MS;
    }
    requestAnimationFrame(tick);
  }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.35 }).observe(root.querySelector('.jn-grid'));
  requestAnimationFrame(tick);
})();
