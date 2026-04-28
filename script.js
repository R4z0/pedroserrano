// Año dinámico
document.getElementById('year').textContent = new Date().getFullYear();

// Nav con borde al hacer scroll
const nav = document.querySelector('.nav');
const progressBar = document.querySelector('.scroll-progress-bar');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 8);
  if (progressBar) {
    const doc = document.documentElement;
    const total = (doc.scrollHeight - doc.clientHeight) || 1;
    const pct = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
    progressBar.style.width = pct + '%';
  }
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });

// Scrollspy: resalta link de nav segun seccion en viewport
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const spyTargets = navLinks
  .map(a => {
    const id = a.getAttribute('href').slice(1);
    const el = id ? document.getElementById(id) : null;
    return el ? { link: a, el } : null;
  })
  .filter(Boolean);

if (spyTargets.length) {
  const setActive = (id) => {
    spyTargets.forEach(({ link, el }) => {
      link.classList.toggle('is-active', el.id === id);
    });
  };
  const spyIO = new IntersectionObserver((entries) => {
    // Picks the entry closest to the top of the viewport that is intersecting
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible[0]) setActive(visible[0].target.id);
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  spyTargets.forEach(({ el }) => spyIO.observe(el));
}

// Reveal en scroll
const targets = document.querySelectorAll(
  '.section-head, .about-text, .about-side, .metric, .tl-item, .stack-card, .cred-block, .contact-inner, .hero-inner, .hero-card, .case-card, .testimonial, .service-card'
);
targets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

targets.forEach(el => io.observe(el));

// Counter animado en KPIs (Impacto)
const formatNum = (n, decimals, decimalSep) => {
  const fixed = Number(n).toFixed(decimals);
  return decimalSep === ',' ? fixed.replace('.', ',') : fixed;
};

const animateCounter = (el) => {
  const target = parseFloat(el.dataset.num);
  if (Number.isNaN(target)) return;
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const decimalSep = el.dataset.decimalSep || '';
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const value = target * ease(p);
    el.textContent = prefix + formatNum(value, decimals, decimalSep) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + formatNum(target, decimals, decimalSep) + suffix;
  };
  requestAnimationFrame(tick);
};

const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.metric-num[data-num]').forEach(el => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  counterIO.observe(el);
});

// Typewriter en la linea accent del hero
(function () {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const fullText = el.textContent;
  el.textContent = '';
  el.classList.add('typing');
  const caret = document.createElement('span');
  caret.className = 'type-caret';
  el.appendChild(caret);

  let i = 0;
  const speed = 38; // ms por char
  const startDelay = 450;

  const tick = () => {
    if (i < fullText.length) {
      caret.insertAdjacentText('beforebegin', fullText.charAt(i));
      i++;
      setTimeout(tick, speed + (Math.random() * 30 - 10));
    } else {
      caret.classList.add('done');
    }
  };
  setTimeout(tick, startDelay);
})();
