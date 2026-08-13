const header = document.querySelector('.site-header');
const progressBar = document.querySelector('.reading-progress span');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const sections = [...document.querySelectorAll('main section[id]')];

menuBtn?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
});

navAnchors.forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuBtn?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const updateScrollUI = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (scrollTop / max) * 100 : 0;
  progressBar.style.width = `${pct}%`;
  header?.classList.toggle('scrolled', scrollTop > 24);

  const marker = scrollTop + window.innerHeight * 0.35;
  let current = '';
  sections.forEach(section => {
    if (section.offsetTop <= marker) current = section.id;
  });
  navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
};

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollUI();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
updateScrollUI();

const parallaxEl = document.querySelector('[data-parallax]');
if (parallaxEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('mousemove', e => {
    if (window.innerWidth < 821) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    parallaxEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
  window.addEventListener('mouseleave', () => {
    parallaxEl.style.transform = 'translate3d(0,0,0)';
  });
}

// Petite interaction supplémentaire : les cartes suivent légèrement le pointeur.
document.querySelectorAll('.trait,.psy-card,.hook-card,.subject-step,.pillar').forEach(card => {
  card.addEventListener('pointermove', e => {
    if (window.innerWidth < 821 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 4;
    const y = ((e.clientY - r.top) / r.height - .5) * -4;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = '');
});
