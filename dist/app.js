const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];
const hero = document.querySelector('.hero');
const photo = document.querySelector('.hero-photo');
const pauseButton = document.querySelector('#pause');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let current = 0;
let paused = reducedMotion.matches;
let timer;
let hovered = false;
function showSlide(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => { slide.hidden = i !== current; slide.classList.toggle('active', i === current); });
  dots.forEach((dot, i) => { dot.classList.toggle('active', i === current); if(i === current) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current'); });
  document.querySelector('.slide-counter').textContent = `0${current + 1} / 03`;
  photo.style.backgroundPosition = ['center center', '58% center', '75% center'][current];
}
function resetTimer() {
  clearInterval(timer);
  if (!paused && !hovered && !document.hidden && !hero.contains(document.activeElement)) timer = setInterval(() => showSlide(current + 1), 7000);
}
function updatePause() {
  pauseButton.textContent = paused ? '▷' : 'Ⅱ';
  pauseButton.setAttribute('aria-label', paused ? 'Iniciar rotação automática' : 'Pausar rotação automática');
  pauseButton.setAttribute('aria-pressed', String(paused));
  resetTimer();
}
dots.forEach(dot => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.index)); resetTimer(); }));
document.querySelector('#prev').addEventListener('click', () => { showSlide(current - 1); resetTimer(); });
document.querySelector('#next').addEventListener('click', () => { showSlide(current + 1); resetTimer(); });
pauseButton.addEventListener('click', () => { paused = !paused; updatePause(); });
hero.addEventListener('mouseenter', () => { hovered = true; resetTimer(); });
hero.addEventListener('mouseleave', () => { hovered = false; resetTimer(); });
hero.addEventListener('focusin', resetTimer);
hero.addEventListener('focusout', () => setTimeout(resetTimer, 0));
document.addEventListener('visibilitychange', resetTimer);
reducedMotion.addEventListener('change', event => { paused = event.matches; updatePause(); });
let touchX;
hero.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, {passive: true});
hero.addEventListener('touchend', e => { const delta = e.changedTouches[0].clientX - touchX; if(Math.abs(delta) > 60) { showSlide(current + (delta < 0 ? 1 : -1)); resetTimer(); } }, {passive: true});
updatePause();
const menuButton = document.querySelector('.menu');
const nav = document.querySelector('#nav');
function closeMenu() { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menu'); menuButton.textContent = '☰'; }
menuButton.addEventListener('click', () => { const expanded = menuButton.getAttribute('aria-expanded') === 'true'; if(expanded) closeMenu(); else { nav.classList.add('open'); menuButton.setAttribute('aria-expanded', 'true'); menuButton.setAttribute('aria-label', 'Fechar menu'); menuButton.textContent = '×'; } });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if(event.key === 'Escape') closeMenu(); });
document.querySelector('#calendar').addEventListener('click', () => {
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//CBEV 2027//PT-BR','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:cbev-2027-rio-20270902','DTSTAMP:20261028T000000Z','DTSTART;VALUE=DATE:20270902','DTEND;VALUE=DATE:20270905','SUMMARY:CBEV 2027 - Congresso Brasileiro de Ecografia Vascular','LOCATION:Windsor Marapendi Hotel - Av. Lúcio Costa\\, 5400 - Barra da Tijuca\\, Rio de Janeiro - RJ','DESCRIPTION:Do Diagnóstico à Intervenção. A Ecografia Vascular na prática.','END:VEVENT','END:VCALENDAR',''].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], {type: 'text/calendar;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'CBEV-2027.ics'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
