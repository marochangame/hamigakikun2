(() => {
  'use strict';
  const TOTAL = 90;
  const app = document.getElementById('app');
  const song = document.getElementById('song');
  const appleBtn = document.getElementById('appleBtn');
  const germs = [...document.querySelectorAll('.germ-cover')];
  const sparkles = [...document.querySelectorAll('.sp')];
  let raf = null;
  let startAt = 0;
  let running = false;

  function resetVisual() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    running = false;
    startAt = 0;
    app.classList.remove('running','done');
    germs.forEach(g => g.classList.remove('gone'));
    sparkles.forEach(s => s.classList.remove('on'));
    try { song.pause(); song.currentTime = 0; } catch(e) {}
  }

  async function start() {
    if (running) return;
    resetVisual();
    running = true;
    app.classList.add('running');
    startAt = performance.now();
    try { song.currentTime = 0; await song.play(); } catch(e) {}
    raf = requestAnimationFrame(tick);
  }

  function tick(now) {
    if (!running) return;
    const elapsed = Math.min(TOTAL, (now - startAt) / 1000);
    const progress = elapsed / TOTAL;
    const activeGerms = Math.min(germs.length, Math.floor(progress * (germs.length + 0.85)));
    germs.forEach((g, i) => { if (i < activeGerms) g.classList.add('gone'); });
    const activeSparkles = Math.min(sparkles.length, Math.floor(progress * (sparkles.length + 0.7)));
    sparkles.forEach((s, i) => { if (i < activeSparkles) s.classList.add('on'); });
    if (elapsed >= TOTAL || song.ended) return finish();
    raf = requestAnimationFrame(tick);
  }

  function finish() {
    if (!running) return;
    running = false;
    app.classList.remove('running');
    app.classList.add('done');
    germs.forEach(g => g.classList.add('gone'));
    sparkles.forEach(s => s.classList.add('on'));
    try { song.pause(); song.currentTime = 0; } catch(e) {}
  }

  appleBtn.addEventListener('click', start);
  appleBtn.addEventListener('touchend', (e)=>{ e.preventDefault(); start(); }, {passive:false});
  song.addEventListener('ended', finish);
  window.addEventListener('pagehide', () => { try { song.pause(); } catch(e){} });
  resetVisual();
})();
