(() => {
  'use strict';

  const TOTAL = 90;
  const app = document.getElementById('app');
  const song = document.getElementById('song');
  const appleBtn = document.getElementById('appleBtn');
  const germs = [...document.querySelectorAll('.germ-cover')];
  const sparkles = [...document.querySelectorAll('.sp')];

  let raf = null;
  let running = false;
  let started = false;
  let done = false;
  let startAt = 0;
  let elapsedBeforePause = 0;

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function applyVisual(elapsed) {
    const progress = clamp(elapsed / TOTAL, 0, 1);
    const activeGerms = Math.min(germs.length, Math.floor(progress * (germs.length + 0.85)));
    germs.forEach((g, i) => { g.classList.toggle('gone', i < activeGerms); });

    const activeSparkles = Math.min(sparkles.length, Math.floor(progress * (sparkles.length + 0.7)));
    sparkles.forEach((s, i) => { s.classList.toggle('on', i < activeSparkles); });
  }

  function resetVisual() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    running = false;
    started = false;
    done = false;
    startAt = 0;
    elapsedBeforePause = 0;
    app.classList.remove('running', 'paused', 'done');
    germs.forEach(g => g.classList.remove('gone'));
    sparkles.forEach(s => s.classList.remove('on'));
    appleBtn.setAttribute('aria-label', 'はみがきスタート');
    try { song.pause(); song.currentTime = 0; } catch(e) {}
  }

  async function playFromCurrent() {
    running = true;
    started = true;
    done = false;
    app.classList.add('running');
    app.classList.remove('paused', 'done');
    appleBtn.setAttribute('aria-label', 'はみがきストップ');
    startAt = performance.now() - elapsedBeforePause * 1000;
    try {
      song.currentTime = clamp(elapsedBeforePause, 0, Math.max(0, song.duration || TOTAL));
      await song.play();
    } catch(e) {}
    raf = requestAnimationFrame(tick);
  }

  function pause() {
    if (!running) return;
    elapsedBeforePause = clamp((performance.now() - startAt) / 1000, 0, TOTAL);
    running = false;
    app.classList.remove('running');
    app.classList.add('paused');
    appleBtn.setAttribute('aria-label', 'はみがき再開');
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    try { song.pause(); } catch(e) {}
    applyVisual(elapsedBeforePause);
  }

  function tick(now) {
    if (!running) return;
    const elapsed = clamp((now - startAt) / 1000, 0, TOTAL);
    elapsedBeforePause = elapsed;
    applyVisual(elapsed);
    if (elapsed >= TOTAL || song.ended) return finish();
    raf = requestAnimationFrame(tick);
  }

  function finish() {
    running = false;
    started = true;
    done = true;
    elapsedBeforePause = 0;
    app.classList.remove('running', 'paused');
    app.classList.add('done');
    germs.forEach(g => g.classList.add('gone'));
    sparkles.forEach(s => s.classList.add('on'));
    appleBtn.setAttribute('aria-label', 'もう一度はみがきスタート');
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    try { song.pause(); song.currentTime = 0; } catch(e) {}
  }

  function handleApple() {
    if (running) return pause();
    if (done) resetVisual();
    playFromCurrent();
  }

  appleBtn.addEventListener('click', handleApple);
  appleBtn.addEventListener('touchend', (e) => { e.preventDefault(); handleApple(); }, {passive:false});
  song.addEventListener('ended', finish);
  window.addEventListener('pagehide', () => { try { song.pause(); } catch(e){} });

  resetVisual();
})();
