(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid'].forEach((key) => { if (params.get(key)) utm[key] = params.get(key); });
  if (Object.keys(utm).length) localStorage.setItem('doma_utm', JSON.stringify(utm));
  const track = (name, details = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: name, ...details }); };
  $$('[data-track]').forEach((element) => element.addEventListener('click', () => track(element.dataset.track)));
  const menuToggle = $('.menu-toggle');
  const menu = $('.main-nav');
  menuToggle?.addEventListener('click', () => { const open = menu.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); });
  $$('.main-nav a').forEach((link) => link.addEventListener('click', () => menu.classList.remove('open')));
  $$('.filter').forEach((filter) => filter.addEventListener('click', () => { $$('.filter').forEach((item) => item.classList.remove('active')); filter.classList.add('active'); const value = filter.dataset.filter; $$('.project-card').forEach((card) => card.classList.toggle('is-hidden', value !== 'all' && !card.dataset.kind.includes(value))); }));
  const modal = $('#project-modal');
  const modalTitle = $('#modal-title');
  $$('.project-open').forEach((button) => button.addEventListener('click', () => { const project = button.closest('.project-card').dataset.project; modalTitle.textContent = project; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); track('project_open', { project }); }));
  const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }; $('.modal-to-quiz')?.addEventListener('click', closeModal);
  $('.modal-close')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
  const quiz = $('#quiz');
  if (quiz) {
    const total = 6; let step = 1;
    const counter = $('#quiz-counter'); const progress = $('#quiz-progress'); const next = $('#quiz-next'); const back = $('#quiz-back'); const error = $('#quiz-error'); const note = $('#quiz-note');
    const showStep = () => { $$('.quiz-step', quiz).forEach((item) => item.classList.toggle('active', Number(item.dataset.step) === step)); counter.textContent = `${step} / ${total}`; progress.style.width = `${(step / total) * 100}%`; back.style.display = step === 1 ? 'none' : 'inline-flex'; next.textContent = step === total ? 'Подготовить расчёт →' : 'Далее →'; error.textContent = ''; };
    const current = () => $(`.quiz-step[data-step="${step}"]`, quiz);
    next.addEventListener('click', () => { if (step < total && !current().querySelector('input:checked')) { error.textContent = 'Выберите, пожалуйста, один вариант.'; return; } if (step < total) { step += 1; track(step === 2 ? 'calculator_start' : 'calculator_step', { step }); showStep(); return; } const form = $('#quiz-form'); if (!form.reportValidity()) return; note.style.display = 'block'; const answers = Object.fromEntries(new FormData(form).entries()); const body = ['Заявка на расчёт дома с тестового сайта На Уровне MSK', ...Object.entries(answers).filter(([key]) => key !== 'consent').map(([key,value]) => `${key}: ${value}`), `Страница: ${location.href}`, `Метки: ${localStorage.getItem('doma_utm') || 'нет'}`].join('\n'); const subject = 'Расчёт строительства дома — На Уровне MSK'; const mail = `mailto:naurovne.msk@mail.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; note.textContent = 'Откроется почтовое приложение с заполненным обращением. Для отправки нажмите «Отправить» в почте. Если почта не открылась, напишите на naurovne.msk@mail.ru.'; window.location.href = mail; track('calculator_complete', { answers: Object.fromEntries(new FormData(form).entries()), utm: localStorage.getItem('doma_utm') || null }); next.disabled = true; next.textContent = 'Подготовить письмо повторно'; next.disabled = false; });
    back.addEventListener('click', () => { if (step > 1) { step -= 1; showStep(); } }); showStep();
  }
})();
