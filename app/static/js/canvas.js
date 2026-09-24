/* Заготовка для canvas поверх всей страницы */
(() => {
  const canvas = document.getElementById('fx');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = Math.floor(innerWidth  * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // если рисуешь сцену — вызови draw() здесь
    // draw();
  }

  window.addEventListener('resize', resize);
  resize();

  // function draw() {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   ...
  // }
})();