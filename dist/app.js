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


// Consulta de categorias e lotes. Valores fornecidos no briefing de novembro/2026.
const registrationCategories = {
  member: {label: 'Sócios SBACV', prices: [800, 950, 1200], firstLotFee: 80, firstLotInstallment: 91.01},
  residentMember: {label: 'Residente sócio SBACV', prices: [400, 425, 600], firstLotFee: 40, firstLotInstallment: 45.51},
  nonMember: {label: 'Não-sócios', prices: [1400, 1500, 1600], firstLotFee: 140, firstLotInstallment: 159.27},
  residentNonMember: {label: 'Residente não sócio', prices: [700, 750, 800], firstLotFee: 70, firstLotInstallment: 79.64}
};
const registrationDeadlines = ['30/04/2027', '31/08/2027', '04/09/2027'];
const registrationEndDays = ['2027-04-30', '2027-08-31', '2027-09-04'];
const registrationDay = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date());
const currentRegistrationLot = registrationEndDays.findIndex(day => registrationDay <= day);
const registrationCurrency = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
const categoryButtons = [...document.querySelectorAll('[data-category]')];
const lotButtons = [...document.querySelectorAll('[data-lot]')];
let selectedRegistrationCategory = 'member';
let selectedRegistrationLot = currentRegistrationLot < 0 ? 2 : currentRegistrationLot;
function updateRegistration() {
  const category = registrationCategories[selectedRegistrationCategory];
  const price = category.prices[selectedRegistrationLot];
  const savings = category.prices[2] - price;
  categoryButtons.forEach(button => {
    const active = button.dataset.category === selectedRegistrationCategory;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  lotButtons.forEach((button, index) => {
    const active = index === selectedRegistrationLot;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
    button.querySelector('.lot-price').textContent = registrationCurrency.format(category.prices[index]);
    button.setAttribute('aria-label', `${index + 1}º lote: ${registrationCurrency.format(category.prices[index])}, até ${registrationDeadlines[index]}`);
    const oldBadge = button.querySelector('.lot-badge');
    if (oldBadge) oldBadge.remove();
    if (index === currentRegistrationLot) {
      const badge = document.createElement('span'); badge.className = 'lot-badge'; badge.textContent = 'VIGENTE';
      button.querySelector('.lot-name').append(badge);
    }
  });
  document.querySelector('#selected-price-label').textContent = `${category.label.toUpperCase()} · ${selectedRegistrationLot + 1}º LOTE`;
  document.querySelector('#selected-price').textContent = registrationCurrency.format(price);
  document.querySelector('#payment-detail').textContent = selectedRegistrationLot === 0
    ? `+ ${registrationCurrency.format(category.firstLotFee)} de taxa · ou 12x de ${registrationCurrency.format(category.firstLotInstallment)}`
    : 'Consulte taxas e condições de parcelamento na Sympla.';
  document.querySelector('#saving-box').classList.toggle('no-saving', savings === 0);
  document.querySelector('#saving-label').textContent = savings > 0 ? 'VOCÊ ECONOMIZA' : '3º LOTE';
  document.querySelector('#saving-amount').textContent = savings > 0 ? registrationCurrency.format(savings) : 'Valor de referência';
  document.querySelector('#saving-detail').textContent = savings > 0 ? 'em relação ao 3º lote' : 'sem economia nesta comparação';
  document.querySelector('#current-lot-label').textContent = currentRegistrationLot < 0
    ? 'Período informado de inscrições encerrado'
    : `${currentRegistrationLot + 1}º lote vigente até ${registrationDeadlines[currentRegistrationLot]}`;
}
categoryButtons.forEach(button => button.addEventListener('click', () => { selectedRegistrationCategory = button.dataset.category; updateRegistration(); }));
lotButtons.forEach(button => button.addEventListener('click', () => { selectedRegistrationLot = Number(button.dataset.lot); updateRegistration(); }));
updateRegistration();
