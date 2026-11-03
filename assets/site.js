const button = document.querySelector('.menubtn');
const nav = document.querySelector('.navlinks');
button.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    button.focus();
  }
});
const search = document.querySelector('#tool-search');
if (search) {
  const kind = document.querySelector('#tool-kind');
  const entries = [...document.querySelectorAll('.tool-entry')];
  const count = document.querySelector('.catalog-count');
  document.querySelector('.catalog-controls').hidden = false;
  const update = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    entries.forEach(entry => {
      const matches = entry.dataset.search.toLocaleLowerCase().includes(query)
        && (kind.value === 'all' || entry.dataset.kind === kind.value);
      entry.hidden = !matches;
      if (matches) visible++;
    });
    count.textContent = `${visible} resource${visible === 1 ? '' : 's'}${visible !== entries.length ? ' found' : ''}`;
    document.querySelector('.no-results').hidden = visible !== 0;
  };
  search.addEventListener('input', update);
  kind.addEventListener('change', update);
}

const carousel = document.querySelector('.slideshow');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.lab-slide')];
  const dots = [...carousel.querySelectorAll('[data-slide]')];
  const deck = carousel.querySelector('.slides-deck');
  const toggle = carousel.querySelector('.slide-play');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let playing = !reducedMotion.matches;
  let timer;
  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    carousel.querySelector('.slide-position').textContent = `${current + 1} / ${slides.length}`;
  };
  const schedule = () => {
    clearInterval(timer);
    toggle.textContent = playing ? 'Pause slideshow' : 'Play slideshow';
    deck.setAttribute('aria-live', playing ? 'off' : 'polite');
    if (playing && !document.hidden && slides.length > 1) timer = setInterval(() => show(current + 1), 7000);
  };
  const manual = index => { playing = false; show(index); schedule(); };
  carousel.querySelector('.slideshow-controls').hidden = slides.length < 2;
  toggle.addEventListener('click', () => { playing = !playing; schedule(); });
  carousel.querySelector('.slide-prev').addEventListener('click', () => manual(current - 1));
  carousel.querySelector('.slide-next').addEventListener('click', () => manual(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => manual(i)));
  carousel.addEventListener('focusin', event => { if (event.target !== toggle) { playing = false; schedule(); } });
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', schedule);
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); manual(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) { playing = false; schedule(); } });
  schedule();
}
