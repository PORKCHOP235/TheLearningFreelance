const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.append(progress);
let pending = false;

function drawScroll() {
  pending = false;
  const distance = document.documentElement.scrollHeight - innerHeight;
  progress.style.setProperty('--scroll-progress', distance > 0 ? scrollY / distance : 0);
  const hero = document.querySelector('.photo-hero');
  if (!hero) return;
  const offset = motionPreference.matches || innerWidth <= 740
    ? 0 : Math.min(hero.offsetHeight, Math.max(0, -hero.getBoundingClientRect().top));
  hero.style.setProperty('--hero-y', offset * .12 + 'px');
  hero.style.setProperty('--copy-y', offset * -.045 + 'px');
}

function queueScroll() {
  if (!pending) {
    pending = true;
    requestAnimationFrame(drawScroll);
  }
}

addEventListener('scroll', queueScroll, { passive: true });
addEventListener('resize', queueScroll);
motionPreference.addEventListener('change', queueScroll);
drawScroll();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (!motionPreference.matches) entry.target.classList.add('scroll-arrival');
    }
  }, { threshold: .1 });
  document.querySelectorAll('.service-columns article, .page-intro h1, .portfolio-hero h1, .resource-intro h1, .workflow-step, .library-group, .evidence-grid figure')
    .forEach(element => observer.observe(element));
}
