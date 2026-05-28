(() => {
  'use strict';

  const TOTAL_MS = 90000;
  const app = document.getElementById('app');
  const startBtn = document.getElementById('startBtn');
  const againBtn = document.getElementById('againBtn');
  const done = document.getElementById('done');
  const song = document.getElementById('song');
  const sparkles = document.getElementById('sparkles');
  const brush = document.getElementById('routeBrush');

  let endTimer = null;
  let sparkleTimer = null;
  let rafId = null;
  let startTime = 0;
  let started = false;

  // CSS keyframesではiPhone Safariで位置が固まることがあるため、JSで確実に動かす。
  // 歯の並びに沿って、見えない楕円コースを1周する。
  const path = [
    { t: 0.00, x: 74, y: 60, r: -10 },
    { t: 0.10, x: 66, y: 73, r: -20 },
    { t: 0.22, x: 50, y: 78, r: -5 },
    { t: 0.34, x: 32, y: 72, r: 18 },
    { t: 0.46, x: 18, y: 56, r: 42 },
    { t: 0.58, x: 22, y: 36, r: 58 },
    { t: 0.70, x: 41, y: 23, r: 18 },
    { t: 0.82, x: 62, y: 25, r: -22 },
    { t: 0.92, x: 75, y: 41, r: -62 },
    { t: 1.00, x: 74, y: 60, r: -10 }
  ];

  function lerp(a, b, n) { return a + (b - a) * n; }
  function easeInOut(n) { return n < 0.5 ? 2 * n * n : 1 - Math.pow(-2 * n + 2, 2) / 2; }

  function getPoint(t) {
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];
      if (t >= a.t && t <= b.t) {
        const local = easeInOut((t - a.t) / (b.t - a.t));
        return {
          x: lerp(a.x, b.x, local),
          y: lerp(a.y, b.y, local),
          r: lerp(a.r, b.r, local)
        };
      }
    }
    return path[path.length - 1];
  }

  function animateBrush(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / TOTAL_MS, 1);
    const p = getPoint(t);
    const scrub = Math.sin(elapsed / 105) * 1.4;
    brush.style.transform = `translate(calc(${p.x}vw - 50%), calc(${p.y}vh - 50% + ${scrub}px)) rotate(${p.r}deg)`;
    if (t < 1 && started) rafId = requestAnimationFrame(animateBrush);
  }

  function clearTimers() {
    if (endTimer) clearTimeout(endTimer);
    if (sparkleTimer) clearInterval(sparkleTimer);
    if (rafId) cancelAnimationFrame(rafId);
    endTimer = null;
    sparkleTimer = null;
    rafId = null;
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
    brush.style.opacity = '0';
    brush.style.transform = 'translate(calc(74vw - 50%), calc(60vh - 50%)) rotate(-10deg)';
    void app.offsetWidth;
  }

  function addSparkle() {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = Math.random() > 0.5 ? '✨' : '⭐';
    s.style.left = `${18 + Math.random() * 64}%`;
    s.style.top = `${22 + Math.random() * 56}%`;
    sparkles.appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }

  async function start() {
    if (started) return;
    reset();
    started = true;
    startBtn.classList.add('hidden');
    app.classList.add('playing');
    brush.style.opacity = '1';
    startTime = performance.now();
    rafId = requestAnimationFrame(animateBrush);

    try {
      song.currentTime = 0;
      await song.play();
    } catch (e) {}

    sparkleTimer = setInterval(addSparkle, 1350);
    endTimer = setTimeout(finish, TOTAL_MS);
  }

  function finish() {
    if (!started) return;
    clearTimers();
    started = false;
    app.classList.remove('playing');
    brush.style.opacity = '0';
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
