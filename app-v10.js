(() => {
  'use strict';
  const TOTAL = 90;
  const app = document.getElementById('app');
  const song = document.getElementById('song');
  const startBtn = document.getElementById('startBtn');
  const againVisible = document.getElementById('againVisible');
  const sparkles = [...document.querySelectorAll('.sparkle')];
  let raf = null;
  let startAt = 0;
  let running = false;
  let completed = false;

  function reset() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    running = false;
    completed = false;
    startAt = 0;
    app.classList.remove('running','done');
    sparkles.forEach(s => s.classList.remove('on'));
    try { song.pause(); song.currentTime = 0; } catch(e) {}
  }

  async function start() {
    if (running) return;
    reset();
    running = true;
    app.classList.add('running');
    startAt = performance.now();
    try { song.currentTime = 0; await song.play(); } catch(e) {}
    raf = requestAnimationFrame(tick);
  }

  function tick(now) {
    if (!running || completed) return;
    const elapsed = Math.min(TOTAL, (now - startAt) / 1000);
    const progress = elapsed / TOTAL;
    const activeCount = Math.min(sparkles.length, Math.floor(progress * (sparkles.length + 0.9)));
    sparkles.forEach((s, i) => {
      if (i < activeCount) s.classList.add('on');
    });
    if (elapsed >= TOTAL || song.ended) return finish();
    raf = requestAnimationFrame(tick);
  }

  function finish() {
    completed = true;
    running = false;
    app.classList.remove('running');
    app.classList.add('done');
    sparkles.forEach(s => s.classList.add('on'));
    try { song.pause(); song.currentTime = 0; } catch(e) {}
  }

  startBtn.addEventListener('click', start);
  startBtn.addEventListener('touchend', (e)=>{ e.preventDefault(); start(); }, {passive:false});
  againVisible.addEventListener('click', reset);
  againVisible.addEventListener('touchend', (e)=>{ e.preventDefault(); reset(); }, {passive:false});
  song.addEventListener('ended', finish);
  window.addEventListener('pagehide', () => { try { song.pause(); } catch(e){} });
  reset();
})();
