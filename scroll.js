(function () {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  let current = window.scrollY;
  let target  = window.scrollY;

  window.addEventListener('wheel', e => {
    e.preventDefault();
    target += e.deltaY * 0.7;
    target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
  }, { passive: false });

  // keyboard scroll support
  window.addEventListener('keydown', e => {
    const h = window.innerHeight;
    const map = {
      ArrowDown: 80, ArrowUp: -80,
      PageDown: h * 0.9, PageUp: h * -0.9,
      ' ': h * 0.9
    };
    if (e.key in map) {
      e.preventDefault();
      target += map[e.key] * (e.shiftKey && e.key === ' ' ? -1 : 1);
      target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
    }
  });

  (function animate() {
    current += (target - current) * 0.04;
    window.scrollTo(0, current);
    requestAnimationFrame(animate);
  })();
})();
