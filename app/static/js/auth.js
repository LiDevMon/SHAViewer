/* Переключение ВХОД / РЕГИСТРАЦИЯ */
(() => {
  const form        = document.getElementById('authForm');
  const tabs        = document.querySelectorAll('.tab');
  const submitLabel = document.getElementById('submitLabel');
  const status      = document.getElementById('authStatus');
  if (!form) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      form.dataset.mode = mode;
      tabs.forEach(t => t.classList.toggle('is-active', t === tab));
      submitLabel.textContent = mode === 'login' ? 'ВОЙТИ' : 'СОЗДАТЬ АККАУНТ';
      status.textContent = '';
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const mode = form.dataset.mode;
    const username = form.username.value.trim() || 'anonymous';
    const email = form.email ? form.email.value.trim() : '';
    const password = form.password.value;

    if (mode === 'register') {
        status.innerHTML = '> connecting to node… ' + username;

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');

            status.innerHTML = '> account CREATED. check your inbox.';

            // Обновляем таблицу БД: удаляем все строки и заново добавляем из ответа
            const rowsEl = document.getElementById('rows');
            if (rowsEl) {
                rowsEl.innerHTML = '';
                data.users.forEach(u => {
                    window.addRow(u.name, u.role, u.status);
                });
            }

            // Запускаем анализ SHA-3 для введённого пароля
            if (window.analysisOpen) {
                window.analysisOpen(password);
            }

        } catch (err) {
            status.innerHTML = '> error: ' + err.message;
        }

    } else {
        // Режим входа — просто показываем сообщение
        status.innerHTML = '> connecting to node… ' + username;
        setTimeout(() => {
            status.innerHTML = '> ACCESS GRANTED. welcome back.';
        }, 700);
    }

    console.log('[AUTH]', mode, { username, email, password });
  });
})();