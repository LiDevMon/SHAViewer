// TODO: добавление пользователя при регистрации

/* Таблица-«база данных»: добавление, удаление, редактирование */
(() => {
  const rowsEl     = document.getElementById('rows');
  const rowCount   = document.getElementById('rowCount');
  const insertForm = document.getElementById('insertForm');
  if (!rowsEl) return;

  const newName    = document.getElementById('newName');
  const newRole    = document.getElementById('newRole');
  const newStatus  = document.getElementById('newStatus');

  let nextId = rowsEl.children.length + 1;
  const pad  = n => String(n).padStart(2, '0');
  const updateCount = () => rowCount.textContent = pad(rowsEl.children.length) + ' rows';

  function createRow(id, name, role, statusText) {
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.id = id;
    row.innerHTML = `
      <span class="cell cell--id">${pad(id)}</span>
      <span class="cell" contenteditable="true" spellcheck="false">${name}</span>
      <span class="cell" contenteditable="true" spellcheck="false">${role}</span>
      <span class="cell cell--status" contenteditable="true" spellcheck="false" data-s="${statusText}">${statusText}</span>
      <button type="button" class="row__del" title="Удалить строку">&times;</button>
    `;
    row.querySelector('.row__del').addEventListener('click', () => {
      row.remove(); updateCount();
    });
    return row;
  }

  function addRow(name, role, statusText, scroll = true) {
    const row = createRow(nextId++, name, role, statusText);
    rowsEl.appendChild(row);
    updateCount();
    if (scroll) rowsEl.scrollTop = rowsEl.scrollHeight;
  }

  updateCount();

  insertForm.addEventListener('submit', e => {
    e.preventDefault();
    addRow(
      newName.value.trim() || 'unnamed',
      newRole.value.trim() || 'guest',
      newStatus.value
    );
    newName.value = '';
    newRole.value = '';
    newName.focus();
  });

  rowsEl.addEventListener('input', e => {
    const cell = e.target;
    if (cell.classList.contains('cell--status')) {
      cell.dataset.s = cell.textContent.trim().toUpperCase();
    }
  });
})();