(() => {
  const DURATION = 90;
  const startBtn = document.getElementById('startBtn');
  const againBtn = document.getElementById('againVisible');
  const finish = document.getElementById('finish');
  const timer = document.getElementById('timer');
  const barFill = document.getElementById('barFill');
  const hud = document.getElementById('hud');
  const sparkleLayer = document.getElementById('sparkleLayer');
  const cleans = Array.from(document.querySelectorAll('.germ-clean'));
  let intervalId = null;
  let remain = DURATION;
  let startedAt = 0;

  function resetGame(){
    clearInterval(intervalId);
    remain = DURATION;
    startedAt = 0;
    timer.textContent = DURATION;
    barFill.style.width = '0%';
    cleans.forEach(el => el.classList.remove('is-clean'));
    finish.classList.remove('is-show');
    hud.classList.remove('is-show');
    startBtn.classList.remove('is-hidden');
  }

  function popSparkle(x, y){
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = Math.random() > .45 ? '✨' : '✦';
    s.style.left = x + '%';
    s.style.top = y + '%';
    s.style.fontSize = (20 + Math.random()*24) + 'px';
    sparkleLayer.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }

  function finishGame(){
    clearInterval(intervalId);
    cleans.forEach(el => el.classList.add('is-clean'));
    timer.textContent = '0';
    barFill.style.width = '100%';
    for(let i=0;i<18;i++) setTimeout(()=>popSparkle(20+Math.random()*60,18+Math.random()*60), i*90);
    setTimeout(()=>finish.classList.add('is-show'), 900);
  }

  function tick(){
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    remain = Math.max(0, DURATION - elapsed);
    timer.textContent = remain;
    const done = Math.min(1, elapsed / DURATION);
    barFill.style.width = (done * 100) + '%';

    const cleanCount = Math.min(cleans.length, Math.floor(done * cleans.length + 0.0001));
    cleans.forEach((el, i) => {
      if(i < cleanCount && !el.classList.contains('is-clean')){
        el.classList.add('is-clean');
        const r = el.getBoundingClientRect();
        popSparkle(((r.left + r.width/2) / innerWidth) * 100, ((r.top + r.height/2) / innerHeight) * 100);
      }
    });

    if(remain <= 0) finishGame();
  }

  function startGame(){
    resetGame();
    startBtn.classList.add('is-hidden');
    hud.classList.add('is-show');
    startedAt = Date.now();
    tick();
    intervalId = setInterval(tick, 250);
  }

  startBtn.addEventListener('click', startGame);
  againBtn.addEventListener('click', startGame);
  resetGame();
})();
