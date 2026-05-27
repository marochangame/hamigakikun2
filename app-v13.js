(() => {
  const DURATION = 90;
  const startBtn = document.getElementById('startBtn');
  const againBtn = document.getElementById('againVisible');
  const finish = document.getElementById('finish');
  const sparkleLayer = document.getElementById('sparkleLayer');
  const cleans = Array.from(document.querySelectorAll('.germ-clean'));
  let intervalId = null;
  let startedAt = 0;
  let audioCtx = null;
  let musicTimer = null;

  function setupAudio(){
    if(audioCtx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    audioCtx = new AC();
  }

  function beep(freq=660, duration=.08, when=0, gain=.045){
    if(!audioCtx) return;
    const t = audioCtx.currentTime + when;
    const osc = audioCtx.createOscillator();
    const vol = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    vol.gain.setValueAtTime(0.0001, t);
    vol.gain.exponentialRampToValueAtTime(gain, t + .015);
    vol.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(vol).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + duration + .03);
  }

  function startMusic(){
    setupAudio();
    if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    stopMusic();
    const notes = [523,659,784,659,587,740,880,740];
    let i = 0;
    musicTimer = setInterval(() => {
      beep(notes[i % notes.length], .09, 0, .032);
      i++;
    }, 620);
  }

  function stopMusic(){
    if(musicTimer){ clearInterval(musicTimer); musicTimer = null; }
  }

  function finishChime(){
    setupAudio();
    beep(659,.11,0,.055); beep(784,.11,.12,.055); beep(988,.18,.25,.06);
  }

  function resetGame(){
    clearInterval(intervalId);
    stopMusic();
    startedAt = 0;
    cleans.forEach(el => el.classList.remove('is-pop','is-clean'));
    finish.classList.remove('is-show');
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

  function popRing(x, y, size){
    const r = document.createElement('span');
    r.className = 'ring';
    r.style.left = x + '%';
    r.style.top = y + '%';
    r.style.width = size + 'px';
    r.style.height = size + 'px';
    sparkleLayer.appendChild(r);
    setTimeout(() => r.remove(), 520);
  }

  function cleanOne(el){
    el.classList.add('is-pop');
    const r = el.getBoundingClientRect();
    const x = ((r.left + r.width/2) / innerWidth) * 100;
    const y = ((r.top + r.height/2) / innerHeight) * 100;
    popRing(x, y, Math.max(r.width, r.height));
    for(let j=0;j<5;j++) setTimeout(()=>popSparkle(x + (Math.random()*8-4), y + (Math.random()*7-3.5)), j*45);
    beep(880 + Math.random()*260, .07, 0, .045);
    setTimeout(()=>el.classList.add('is-clean'), 420);
  }

  function finishGame(){
    clearInterval(intervalId);
    intervalId = null;
    cleans.forEach(el => { if(!el.classList.contains('is-clean')) cleanOne(el); });
    stopMusic();
    finishChime();
    for(let i=0;i<18;i++) setTimeout(()=>popSparkle(20+Math.random()*60,18+Math.random()*60), i*90);
    setTimeout(()=>finish.classList.add('is-show'), 900);
  }

  function tick(){
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    const done = Math.min(1, elapsed / DURATION);
    const cleanCount = Math.min(cleans.length, Math.floor(done * cleans.length + 0.0001));
    cleans.forEach((el, i) => {
      if(i < cleanCount && !el.classList.contains('is-pop')) cleanOne(el);
    });
    if(done >= 1) finishGame();
  }

  function startGame(){
    resetGame();
    startBtn.classList.add('is-hidden');
    startMusic();
    startedAt = Date.now();
    tick();
    intervalId = setInterval(tick, 250);
  }

  startBtn.addEventListener('click', startGame);
  againBtn.addEventListener('click', startGame);
  resetGame();
})();
