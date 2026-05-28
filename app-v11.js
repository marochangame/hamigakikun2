(() => {
  'use strict';
  const TOTAL = 90;
  const app = document.getElementById('app');
  const song = document.getElementById('song');
  const startBtn = document.getElementById('startBtn');
  const againVisible = document.getElementById('againVisible');
  const germs = [...document.querySelectorAll('.germ-clean')];
  const sparkles = [...document.querySelectorAll('.sp')];
  let raf = null;
  let startAt = 0;
  let running = false;
  let completed = false;
  let firstGuideTried = false;

  const GUIDE_START = 'リンゴを押して歯磨き始めてね';
  const GUIDE_AGAIN = 'もう一度歯磨きするならリンゴを押してね';

  function speak(text) {
    try {
      if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      u.rate = 0.95;
      u.pitch = 1.18;
      u.volume = 1;
      window.speechSynthesis.speak(u);
    } catch(e) {}
  }

  function reset(options = {}) {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    running = false;
    completed = false;
    startAt = 0;
    app.classList.remove('running','done');
    germs.forEach(g => g.classList.remove('gone'));
    sparkles.forEach(s => s.classList.remove('on'));
    try { song.pause(); song.currentTime = 0; } catch(e) {}
    if (options.guide) setTimeout(() => speak(GUIDE_START), 180);
  }

  async function start() {
    if (running) return;
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch(e) {}
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
    setTimeout(() => speak(GUIDE_AGAIN), 650);
  }

  function firstGuide() {
    if (firstGuideTried || running || completed) return;
    firstGuideTried = true;
    setTimeout(() => speak(GUIDE_START), 250);
  }

  startBtn.addEventListener('click', start);
  startBtn.addEventListener('touchend', (e)=>{ e.preventDefault(); start(); }, {passive:false});
  againVisible.addEventListener('click', () => reset({guide:true}));
  againVisible.addEventListener('touchend', (e)=>{ e.preventDefault(); reset({guide:true}); }, {passive:false});
  song.addEventListener('ended', finish);
  window.addEventListener('pagehide', () => { try { song.pause(); } catch(e){} });
  window.addEventListener('pointerdown', firstGuide, {once:true, passive:true});
  window.addEventListener('touchstart', firstGuide, {once:true, passive:true});
  reset();
  setTimeout(firstGuide, 900);
})();
