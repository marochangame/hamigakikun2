(() => {
  'use strict';

  const TOTAL_MS = 90000;
  const app = document.getElementById('app');
  const startBtn = document.getElementById('startBtn');
  const againBtn = document.getElementById('againBtn');
  const done = document.getElementById('done');
  const song = document.getElementById('song');
  const sparkles = document.getElementById('sparkles');

  let endTimer = null;
  let sparkleTimer = null;
  let started = false;

  function clearTimers() {
    if (endTimer) clearTimeout(endTimer);
    if (sparkleTimer) clearInterval(sparkleTimer);
    endTimer = null;
    sparkleTimer = null;
  }

  function reset() {
    clearTimers();
    started = false;
    app.classList.remove('playing');
    startBtn.classList.remove('hidden');
    done.classList.remove('show');
    song.pause();
    song.currentTime = 0;
    sparkles.innerHTML = '';

    // CSS animationsを確実に初期化
    void app.offsetWidth;
  }

  function addSparkle() {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = Math.random() > 0.5 ? '✨' : '⭐';
    const x = 18 + Math.random() * 64;
    const y = 22 + Math.random() * 56;
    s.style.left = `${x}%`;
    s.style.top = `${y}%`;
    sparkles.appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }

  async function start() {
    if (started) return;
    reset();
    started = true;
    startBtn.classList.add('hidden');
    app.classList.add('playing');

    try {
      song.currentTime = 0;
      await song.play();
    } catch (e) {
      // iPhoneで音が許可されない時も、アニメは進める
    }

    sparkleTimer = setInterval(addSparkle, 1350);
    endTimer = setTimeout(finish, TOTAL_MS);
  }

  function finish() {
    clearTimers();
    app.classList.remove('playing');
    song.pause();
    song.currentTime = 0;
    done.classList.add('show');
    for (let i = 0; i < 28; i++) setTimeout(addSparkle, i * 55);
  }

  startBtn.addEventListener('click', start);
  againBtn.addEventListener('click', reset);
  song.addEventListener('ended', finish);

  reset();
})();
