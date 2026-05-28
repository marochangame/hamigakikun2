(() => {
  'use strict';
  const TOTAL = 90;
  const song = document.getElementById('song');
  const app = document.getElementById('app');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const retryBtn = document.getElementById('retryBtn');
  const againBtn = document.getElementById('againBtn');
  const timer = document.getElementById('timer');
  const progress = document.getElementById('progress');
  const star = document.getElementById('star');
  const done = document.getElementById('done');
  const germs = [...document.querySelectorAll('.germ')];
  const fairies = [...document.querySelectorAll('.fairy')];
  let raf = 0;
  let started = false;
  let paused = false;

  function format(sec){
    const s = Math.max(0, Math.ceil(sec));
    return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  }
  function resetVisual(){
    timer.textContent = '1:30';
    progress.style.width = '0%';
    star.style.left = '2.4vw';
    germs.forEach(g => g.classList.remove('gone'));
    fairies.forEach(f => f.classList.remove('show'));
    app.classList.remove('running','paused','show-germs');
    done.classList.remove('show');
  }
  function update(){
    const t = Math.min(song.currentTime || 0, TOTAL);
    const p = Math.min(1, t / TOTAL);
    timer.textContent = format(TOTAL - t);
    progress.style.width = `${p * 100}%`;
    star.style.left = `${2.4 + p * 88}vw`;

    if (started) app.classList.add('show-germs');
    germs.forEach((g, i) => {
      const threshold = (i + 1) / (germs.length + 1);
      g.classList.toggle('gone', p > threshold);
    });
    fairies.forEach((f, i) => {
      const threshold = 0.15 + i * 0.2;
      f.classList.toggle('show', p > threshold);
    });

    if (t >= TOTAL || song.ended) return finish();
    raf = requestAnimationFrame(update);
  }
  async function start(){
    done.classList.remove('show');
    started = true;
    paused = false;
    app.classList.add('running');
    app.classList.remove('paused');
    try { await song.play(); } catch(e) { console.warn(e); }
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  }
  function pause(){
    if (!started) return;
    if (paused) {
      paused = false;
      pauseBtn.textContent = 'ちょっとおやすみ';
      app.classList.add('running');
      app.classList.remove('paused');
      song.play().catch(()=>{});
      raf = requestAnimationFrame(update);
    } else {
      paused = true;
      pauseBtn.textContent = 'つづき';
      app.classList.remove('running');
      app.classList.add('paused');
      song.pause();
      cancelAnimationFrame(raf);
    }
  }
  function retry(){
    cancelAnimationFrame(raf);
    song.pause(); song.currentTime = 0;
    started = false; paused = false;
    pauseBtn.textContent = 'ちょっとおやすみ';
    resetVisual();
  }
  function finish(){
    cancelAnimationFrame(raf);
    song.pause();
    app.classList.remove('running','paused');
    progress.style.width = '100%';
    timer.textContent = '0:00';
    fairies.forEach(f => f.classList.add('show'));
    germs.forEach(g => g.classList.add('gone'));
    done.classList.add('show');
    started = false;
  }
  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);
  retryBtn.addEventListener('click', retry);
  againBtn.addEventListener('click', retry);
  song.addEventListener('ended', finish);
  resetVisual();
})();
