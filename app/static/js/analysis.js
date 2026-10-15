/* ============================================================
   АНАЛИЗ — карта блоков поверх страницы
   ============================================================ */
(() => {
  const overlay  = document.getElementById('analysis');
  const grid     = document.getElementById('analysisGrid');
  const statusEl = document.getElementById('analysisStatus');
  const progEl   = document.getElementById('analysisProgress');
  const totalEl  = document.getElementById('analysisTotal');
  if (!overlay || !grid) return;

  /* ---------- демо-данные: шаги анализа ---------- */
  const STEPS = [
    {
      code:  '01',
      title: 'INPUT',
      rows:  [['source', 'stdin'], ['length', '14 B'], ['mode', 'raw']],
      hash:  'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3...',
      prog:  12,
    },
    {
      code:  '02',
      title: 'PADDING',
      rows:  [['block', '512 bit'], ['append', '0x80'], ['zeros', '53 B']],
      hash:  'e3b0c44298fc1c149afbf4c8996fb92427ae41e464...',
      prog:  28,
    },
    {
      code:  '03',
      title: 'SCHEDULE',
      rows:  [['words', '64'], ['rounds', '80'], ['rotate', 'rshift']],
      hash:  '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b...',
      prog:  46,
    },
    {
      code:  '04',
      title: 'COMPRESS',
      rows:  [['state', 'H0..H7'], ['k', 'const'], ['mix', 'σ0, σ1']],
      hash:  '7d3c1a9e0b5f4e8a2c6d9b1f3a5e8c0d4a1b6e2f...',
      prog:  68,
    },
    {
      code:  '05',
      title: 'REDUCE',
      rows:  [['Σ', 'mod 2^32'], ['feed', 'forward'], ['acc', 'additive']],
      hash:  '2c26b46b68ffc68ff99b453c1d30413413422d7064...',
      prog:  84,
    },
    {
      code:  '06',
      title: 'DIGEST',
      rows:  [['bits', '256'], ['hex', '64 chars'], ['mode', 'final']],
      hash:  '5d41402abc4b2a76b9719d911017c592ae1f2b3c4d...',
      prog:  100,
    },
  ];

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const pad2  = n => String(n).padStart(2, '0');

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
      el.textContent = '';
      let i = 0;
      const tick = () => {
        if (token !== runToken) return resolve();
        if (i >= full.length) return resolve();
        el.textContent = full.slice(0, ++i);
        setTimeout(tick, 10);
      };
      tick();
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
      await sleep(80);
      if (token !== runToken) return;

      block.classList.add('is-active');
      statusEl.textContent = `> step ${step.code} — ${step.title.toLowerCase()}…`;

      /* печать хеша */
      await typeHash(block.querySelector('.block__hash'), step.hash, token);
      if (token !== runToken) return;

      /* прогресс-бар */
      block.querySelector('.block__bar > i').style.width = step.prog + '%';
      await sleep(180);
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
  function open() {
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    runToken += 1;
    const token = runToken;

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
    btn.addEventListener('click', open);
  });
  document.querySelectorAll('[data-analyze-close]').forEach(el => {
    el.addEventListener('click', close);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });
})();