(() => {
  'use strict';
  const TOTAL = 90;
  const app = document.getElementById('app');
  const song = document.getElementById('song');
  const startBtn = document.getElementById('startBtn');
  const againVisible = document.getElementById('againVisible');
  const rotateHint = document.getElementById('rotateHint');
  const germs = [...document.querySelectorAll('.germ-clean')];
  const sparkles = [...document.querySelectorAll('.sp')];
  let raf = null;
  let startAt = 0;
  let running = false;
  let completed = false;
  let lastRotateVoiceAt = 0;

  function speak(text) {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      u.rate = 0.92;
      u.pitch = 1.15;
      window.speechSynthesis.speak(u);
    } catch(e) {}
  }

  function isPortrait() {
    return window.matchMedia && window.matchMedia('(orientation: portrait)').matches;
  }

  function announceRotateStart() {
    if (!isPortrait()) return;
    const now = Date.now();
    if (now - lastRotateVoiceAt < 4500) return;
    lastRotateVoiceAt = now;
    speak('歯みがきスタートはリンゴを押してね');
  }

  function reset() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    running = false;
    completed = false;
    startAt = 0;
    app.classList.remove('running','done');
    germs.forEach(g => g.classList.remove('gone'));
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
    const activeGerms = Math.min(germs.length, Math.floor(progress * (germs.length + 0.85)));
    germs.forEach((g, i) => { if (i < activeGerms) g.classList.add('gone'); });
    const activeSparkles = Math.min(sparkles.length, Math.floor(progress * (sparkles.length + 0.7)));
    sparkles.forEach((s, i) => { if (i < activeSparkles) s.classList.add('on'); });
    if (elapsed >= TOTAL || song.ended) return finish();
    raf = requestAnimationFrame(tick);
  }

  function finish() {
    if (completed) return;
    completed = true;
    running = false;
    app.classList.remove('running');
    app.classList.add('done');
    germs.forEach(g => g.classList.add('gone'));
    sparkles.forEach(s => s.classList.add('on'));
    try { song.pause(); song.currentTime = 0; } catch(e) {}
    speak('もう一度歯みがきするならリンゴを押してね');
  }

  startBtn.addEventListener('click', start);
  startBtn.addEventListener('touchend', (e)=>{ e.preventDefault(); start(); }, {passive:false});
  againVisible.addEventListener('click', start);
  againVisible.addEventListener('touchend', (e)=>{ e.preventDefault(); start(); }, {passive:false});
  song.addEventListener('ended', finish);
  window.addEventListener('pagehide', () => { try { song.pause(); window.speechSynthesis.cancel(); } catch(e){} });
  window.addEventListener('orientationchange', () => setTimeout(announceRotateStart, 350));
  window.addEventListener('resize', () => setTimeout(announceRotateStart, 250));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(announceRotateStart, 300); });
  if (rotateHint) {
    rotateHint.addEventListener('click', announceRotateStart);
    rotateHint.addEventListener('touchend', (e)=>{ e.preventDefault(); announceRotateStart(); }, {passive:false});
  }
  setTimeout(announceRotateStart, 650);
  reset();
})();
