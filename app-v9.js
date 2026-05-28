(() => {
  'use strict';
  const TOTAL = 90;
  const app = document.getElementById('app');
  const song = document.getElementById('song');
  const startBtn = document.getElementById('startBtn');
  const againBtn = document.getElementById('againBtn');
  const cleans = [...document.querySelectorAll('.clean')];
  let raf = null;
  let startAt = 0;
  let pausedAt = 0;
  let running = false;
  let completed = false;

  function reset() {
    cancelAnimationFrame(raf);
    raf = null;
    running = false;
    completed = false;
    startAt = 0;
    pausedAt = 0;
    app.classList.remove('running','done');
    cleans.forEach(c => c.classList.remove('on','gone'));
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
    const activeCount = Math.min(cleans.length, Math.floor(progress * (cleans.length + 0.6)));
    cleans.forEach((c, i) => {
      if (i < activeCount) c.classList.add('on','gone');
    });
    if (elapsed >= TOTAL || song.ended) return finish();
    raf = requestAnimationFrame(tick);
  }

  function finish() {
    completed = true;
    running = false;
    app.classList.remove('running');
    app.classList.add('done');
    cleans.forEach(c => c.classList.add('on','gone'));
    try { song.pause(); song.currentTime = 0; } catch(e) {}
  }

  startBtn.addEventListener('click', start);
  startBtn.addEventListener('touchend', (e)=>{ e.preventDefault(); start(); }, {passive:false});
  againBtn.addEventListener('click', reset);
  againBtn.addEventListener('touchend', (e)=>{ e.preventDefault(); reset(); }, {passive:false});
  song.addEventListener('ended', finish);
  window.addEventListener('pagehide', () => { try { song.pause(); } catch(e){} });
  reset();
})();
