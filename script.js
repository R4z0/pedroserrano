// Año dinámico
document.getElementById('year').textContent = new Date().getFullYear();

// Nav con borde al hacer scroll
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Reveal en scroll
const targets = document.querySelectorAll(
  '.section-head, .about-text, .about-side, .metric, .tl-item, .stack-card, .cred-block, .contact-inner, .hero-inner, .hero-card'
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
