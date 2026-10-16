/* ============================================================
   АНАЛИЗ — карта блоков поверх страницы
   ============================================================ */
  let STEPS = [];

   (() => {
  const overlay  = document.getElementById('analysis');
  const grid     = document.getElementById('analysisGrid');
  const statusEl = document.getElementById('analysisStatus');
  const progEl   = document.getElementById('analysisProgress');
  const totalEl  = document.getElementById('analysisTotal');
  const inputEl  = document.getElementById('hashInput');

  if(inputEl){
    inputEl.addEventListener('change', () => {
      if(!overlay.hidden){
        open(inputEl.value);
      }
    });
  }

  if (!overlay || !grid) return;

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const pad2  = n => String(n).padStart(2, '0');

  async function loadSteps(input = null) {
    const hasInput = input !== null && String(input).trim() !== '';

    const url = hasInput ? '/api/analyze' : '/static/data.json';
    const options = hasInput
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input })
        }
      : { method: 'GET' };

    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      STEPS = data.steps ?? data;
      return true;
    } catch (err) {
      console.error('Не удалось загрузить шаги:', err);
      statusEl.textContent = 'Ошибка загрузки данных';
      return false;
    }
  }

  /* токен запуска: чтобы клик «закрыть» мог отменить анимацию */
  let runToken = 0;

  /* ---------- создание DOM-блока ---------- */
  function buildBlock(step) {
    const el = document.createElement('article');
    el.className = 'block';

    el.innerHTML = `
      <header class="block__head">
        <span class="block__step">STEP ${step.code}</span>
        <span class="block__tag">${step.rows[0][0]}</span>
      </header>
      <h3 class="block__title">${step.title}</h3>
      <dl class="block__rows">
        ${step.rows.map(([k, v]) => `
          <div class="block__row"><dt>${k}</dt><dd>${v}</dd></div>
        `).join('')}
      </dl>
      <div class="block__hash"></div>
      <div class="block__bar"><i></i></div>
    `;
    return el;
  }

  /* ---------- печать хеша «по буквам» ---------- */
  function typeHash(el, full, token) {
    return new Promise(resolve => {
      if (token !== runToken) return resolve();
      el.textContent = full;
      resolve();
    });
}

  /* ---------- сборка «скелета» всех блоков ---------- */
  function buildAll() {
    grid.innerHTML = '';
    totalEl.textContent = pad2(STEPS.length);
    progEl.textContent  = '00';
    statusEl.textContent = 'building blocks…';
    statusEl.classList.remove('ok');

    return STEPS.map(step => {
      const el = buildBlock(step);
      grid.appendChild(el);
      return el;
    });
  }

  /* ---------- сценарий прогона ---------- */
  async function play(blocks, token) {
    for (let i = 0; i < STEPS.length; i++) {
      if (token !== runToken) return;

      const step  = STEPS[i];
      const block = blocks[i];

      block.classList.add('is-on');
      if (token !== runToken) return;

      block.classList.add('is-active');
      statusEl.textContent = `> step ${step.code} — ${step.title.toLowerCase()}…`;

      /* печать хеша */
      await typeHash(block.querySelector('.block__hash'), step.hash, token);
      if (token !== runToken) return;

      /* прогресс-бар */
      block.querySelector('.block__bar > i').style.width = step.prog + '%';
      if (token !== runToken) return;

      block.classList.remove('is-active');
      block.classList.add('is-done');
      progEl.textContent = pad2(i + 1);
    }

    if (token !== runToken) return;
    statusEl.textContent = 'ANALYSIS COMPLETE';
    statusEl.classList.add('ok');
  }

  /* ---------- открытие / закрытие ---------- */
  async function open(input = null) {
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    runToken += 1;
    const token = runToken;

    // Загружаем актуальные данные перед построением
    const ok = await loadSteps(input);
    if (!ok) return;

    const blocks = buildAll();
    play(blocks, token);
  }

  function close() {
    runToken += 1;
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ---------- обработчики ---------- */
  document.querySelectorAll('[data-analyze]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = inputEl ? inputEl.value : null;
    open(val);
    });
  });
  document.querySelectorAll('[data-analyze-close]').forEach(el => {
    el.addEventListener('click', close);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });
})();