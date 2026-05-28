(() => {
  'use strict';
  const TOTAL = 90;
  const app = document.getElementById('app');
  const song = document.getElementById('song');
  const brush = document.getElementById('movingBrush');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const againBtn = document.getElementById('againBtn');
  const done = document.getElementById('done');
  const germs = [...document.querySelectorAll('.germ')];
  const fairies = [...document.querySelectorAll('.fairy')];
  const sparkles = document.getElementById('sparkles');
  let raf = 0;
  let paused = false;
  let lastSparkIndex = -1;

  // 口の中を一周する歯ブラシの軌道。画面比率に対する座標。
  const path = [
    [78,58,-16], [70,52,-20], [60,46,-17], [49,43,-12], [38,43,-8],
    [28,48,0], [22,56,12], [30,64,18], [42,68,12], [55,67,4],
    [67,63,-8], [76,58,-16]
  ];

  function lerp(a,b,t){return a+(b-a)*t;}
  function pointOnPath(p){
    const n = path.length - 1;
    const x = Math.min(n - 0.0001, p * n);
    const i = Math.floor(x);
    const t = x - i;
    const A = path[i], B = path[i+1];
    return [lerp(A[0],B[0],t), lerp(A[1],B[1],t), lerp(A[2],B[2],t)];
  }
  function sparkleAt(x,y){
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = '✨';
    s.style.left = x + '%';
    s.style.top = y + '%';
    sparkles.appendChild(s);
    setTimeout(() => s.remove(), 850);
  }
  function resetVisual(){
    cancelAnimationFrame(raf);
    song.pause();
    song.currentTime = 0;
    paused = false;
    lastSparkIndex = -1;
    app.classList.remove('running','done-state','paused');
    done.classList.remove('show');
    pauseBtn.textContent = 'おやすみ';
    germs.forEach(g => g.classList.remove('gone'));
    fairies.forEach(f => f.classList.remove('show'));
    sparkles.innerHTML = '';
    brush.style.opacity = '0';
    brush.style.left = '76%';
    brush.style.top = '58%';
    brush.style.transform = 'translate(-50%,-50%) rotate(-16deg)';
  }
  function update(){
    const t = Math.min(song.currentTime || 0, TOTAL);
    const p = Math.min(1, t / TOTAL);
    const [x,y,r] = pointOnPath(p);
    brush.style.left = x + '%';
    brush.style.top = y + '%';
    brush.style.transform = `translate(-50%,-50%) rotate(${r}deg)`;

    germs.forEach((g, i) => {
      const threshold = (i + 1) / (germs.length + 1);
      const gone = p > threshold;
      if (gone && !g.classList.contains('gone')) {
        const rect = g.getBoundingClientRect();
        const ar = app.getBoundingClientRect();
        sparkleAt(((rect.left + rect.width/2 - ar.left)/ar.width)*100, ((rect.top + rect.height/2 - ar.top)/ar.height)*100);
      }
      g.classList.toggle('gone', gone);
    });
    fairies.forEach((f, i) => f.classList.toggle('show', p > 0.18 + i * 0.18));

    const sparkIndex = Math.floor(p * 12);
    if (sparkIndex !== lastSparkIndex) {
      lastSparkIndex = sparkIndex;
      sparkleAt(x + (Math.random()*5-2.5), y + (Math.random()*5-2.5));
    }
    if (p >= 1 || song.ended) return finish();
    raf = requestAnimationFrame(update);
  }
  async function start(){
    resetVisual();
    app.classList.add('running');
    brush.style.opacity = '1';
    try { await song.play(); } catch(e) { console.warn(e); }
    raf = requestAnimationFrame(update);
  }
  function togglePause(){
    if (!app.classList.contains('running')) return;
    if (paused) {
      paused = false;
      pauseBtn.textContent = 'おやすみ';
      app.classList.remove('paused');
      song.play().catch(()=>{});
      raf = requestAnimationFrame(update);
    } else {
      paused = true;
      pauseBtn.textContent = 'つづき';
      app.classList.add('paused');
      song.pause();
      cancelAnimationFrame(raf);
    }
  }
  function finish(){
    cancelAnimationFrame(raf);
    song.pause();
    app.classList.remove('running','paused');
    app.classList.add('done-state');
    germs.forEach(g => g.classList.add('gone'));
    fairies.forEach(f => f.classList.add('show'));
    sparkleAt(50,45); sparkleAt(62,56); sparkleAt(38,62);
    done.classList.add('show');
  }
  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', togglePause);
  resetBtn.addEventListener('click', resetVisual);
  againBtn.addEventListener('click', start);
  song.addEventListener('ended', finish);
  resetVisual();
})();
