(function () {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.id  = 'cursor-dot';
  ring.id = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let tx = 0, ty = 0;
  let rx = 0, ry = 0;
  let started = false;

  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    dot.style.left = tx + 'px';
    dot.style.top  = ty + 'px';
    if (!started) {
      rx = tx; ry = ty;
      dot.style.opacity  = '1';
      ring.style.opacity = '0.6';
      started = true;
    }
  });

  (function animateRing() {
    rx += (tx - rx) * 0.04;
    ry += (ty - ry) * 0.04;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width   = '44px';
      ring.style.height  = '44px';
      ring.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width   = '28px';
      ring.style.height  = '28px';
      ring.style.opacity = '0.6';
    });
  });
})();
