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

  form.addEventListener('submit', e => {
    e.preventDefault();
    const mode = form.dataset.mode;
    const user = form.username.value.trim() || 'anonymous';

    status.innerHTML = '&gt; connecting to node… <b>' + user + '</b>';

    setTimeout(() => {
      status.innerHTML = mode === 'login'
        ? '&gt; ACCESS <b>GRANTED</b>. welcome back.'
        : '&gt; account <b>CREATED</b>. check your inbox.';
    }, 700);

    console.log('[AUTH]', mode, {
      username: form.username.value,
      email:    form.email ? form.email.value : '',
      password: form.password.value
    });
  });
})();