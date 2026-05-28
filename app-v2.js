(() => {
  'use strict';
  const TOTAL = 90;
  const positions = [
    {from:0, to:15, x:58, y:32, rot:-10},
    {from:15, to:30, x:58, y:66, rot:8},
    {from:30, to:45, x:36, y:43, rot:-12},
    {from:45, to:60, x:35, y:66, rot:10},
    {from:60, to:75, x:72, y:43, rot:-10},
    {from:75, to:90, x:72, y:66, rot:8},
  ];
  const $ = (id) => document.getElementById(id);
  const song = $('song');
  const timer = $('timer');
  const progressFill = $('progressFill');
  const brush = $('brush');
  const foam = $('foam');
  const speech = $('speech');
  const startPanel = $('startPanel');
  const donePanel = $('donePanel');
  const startBtn = $('startBtn');
  const pauseBtn = $('pauseBtn');
  const resumeBtn = $('resumeBtn');
  const resetBtn = $('resetBtn');
  const againBtn = $('againBtn');
  const topTeeth = $('topTeeth');
  const bottomTeeth = $('bottomTeeth');
  let rafId = null;
  let completed = false;

  function buildTeeth(){
    const sizes = ['small','','big','big','big','big','','small'];
    topTeeth.innerHTML = sizes.map(s => `<div class="tooth ${s}"></div>`).join('');
    bottomTeeth.innerHTML = sizes.map(s => `<div class="tooth ${s}"></div>`).join('');
  }
  function fmt(sec){
    const n = Math.max(0, Math.ceil(sec));
    return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
  }
  function setBrushByTime(t){
    const p = positions.find(item => t >= item.from && t < item.to) || positions[positions.length-1];
    brush.style.left = `${p.x}%`;
    brush.style.top = `${p.y}%`;
    brush.style.transform = `translate(-50%,-50%) rotate(${p.rot}deg)`;
    foam.style.left = `${p.x - 7}%`;
    foam.style.top = `${p.y + 2}%`;
  }
  function render(){
    const t = Math.min(song.currentTime || 0, TOTAL);
    timer.textContent = fmt(TOTAL - t);
    progressFill.style.width = `${(t / TOTAL) * 100}%`;
    setBrushByTime(t);
    if (!song.paused && !completed) rafId = requestAnimationFrame(render);
  }
  function start(){
    completed = false;
    donePanel.classList.add('hidden');
    startPanel.classList.add('hide');
    song.currentTime = 0;
    song.play().then(() => {
      brush.classList.add('brushing');
      brush.classList.remove('paused');
      foam.classList.add('show');
      speech.classList.add('show');
      pauseBtn.disabled = false;
      resumeBtn.disabled = true;
      render();
    }).catch(() => {
      startPanel.classList.remove('hide');
      alert('音を再生できませんでした。もう一度スタートを押してください。');
    });
  }
  function pause(){
    song.pause();
    brush.classList.add('paused');
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
    if (rafId) cancelAnimationFrame(rafId);
  }
  function resume(){
    song.play().then(() => {
      brush.classList.remove('paused');
      pauseBtn.disabled = false;
      resumeBtn.disabled = true;
      render();
    });
  }
  function reset(showStart = true){
    song.pause();
    song.currentTime = 0;
    completed = false;
    if (rafId) cancelAnimationFrame(rafId);
    brush.classList.remove('brushing','paused');
    foam.classList.remove('show');
    speech.classList.remove('show');
    donePanel.classList.add('hidden');
    if (showStart) startPanel.classList.remove('hide');
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    timer.textContent = '1:30';
    progressFill.style.width = '0%';
    setBrushByTime(0);
  }
  function finish(){
    completed = true;
    if (rafId) cancelAnimationFrame(rafId);
    brush.classList.remove('brushing','paused');
    foam.classList.remove('show');
    speech.classList.remove('show');
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    progressFill.style.width = '100%';
    timer.textContent = '0:00';
    donePanel.classList.remove('hidden');
    startPanel.classList.add('hide');
  }
  buildTeeth();
  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);
  resumeBtn.addEventListener('click', resume);
  resetBtn.addEventListener('click', () => reset(true));
  againBtn.addEventListener('click', () => reset(true));
  song.addEventListener('ended', finish);
  song.addEventListener('timeupdate', () => { if ((song.currentTime || 0) >= TOTAL && !completed) finish(); });
  reset(true);
})();
