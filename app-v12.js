(() => {
  'use strict';
  const TOTAL = 90;
  const segments = [
    { from:0,  zone:'upperOutside', name:'うえの は',   hint:'そとがわを シャカシャカ' },
    { from:15, zone:'lowerOutside', name:'したの は',   hint:'そとがわを シャカシャカ' },
    { from:30, zone:'front',        name:'まえば',      hint:'にこっと まえばを みがこう' },
    { from:45, zone:'upperInside',  name:'うえの うら', hint:'うらがわも わすれずに' },
    { from:60, zone:'lowerInside',  name:'したの うら', hint:'やさしく こちょこちょ' },
    { from:75, zone:'finish',       name:'しあげ',      hint:'さいごは ぴかぴかにしよう' }
  ];
  function $(id){ return document.getElementById(id); }
  const el = {
    stage:$('stage'), done:$('done'), song:$('song'), start:$('startBtn'), pause:$('pauseBtn'), reset:$('resetBtn'), again:$('againBtn'),
    timer:$('timer'), progress:$('progress'), areaName:$('areaName'), areaHint:$('areaHint'), message:$('message'), brush:$('brush'), sparkle:$('sparkle'),
    zones:[...document.querySelectorAll('.zone')]
  };
  let timerId = null;
  let running = false;
  let finished = false;
  let lastIdx = -1;

  function fmt(sec){ const s=Math.max(0,Math.ceil(sec)); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }
  function current(){ return Math.min(el.song.currentTime || 0, TOTAL); }
  function idxAt(t){ return Math.min(segments.length-1, Math.floor(t/15)); }
  function setScreen(screen){
    if(screen === 'done') { el.stage.classList.add('hide'); el.done.classList.add('show'); }
    else { el.done.classList.remove('show'); el.stage.classList.remove('hide'); }
  }
  function sparkle(){ el.sparkle.classList.remove('pop'); void el.sparkle.offsetWidth; el.sparkle.classList.add('pop'); }
  function paint(){
    const t = current();
    const pct = Math.min(100, (t/TOTAL)*100);
    el.timer.textContent = fmt(TOTAL - t);
    el.progress.style.width = pct + '%';
    const idx = idxAt(t);
    const seg = segments[idx];
    if(idx !== lastIdx){
      lastIdx = idx;
      el.areaName.textContent = seg.name;
      el.areaHint.textContent = seg.hint;
      el.message.textContent = idx === 0 ? 'いっしょに みがこう！' : 'つぎの ばしょ！';
      sparkle();
      el.zones.forEach(z => {
        const zidx = segments.findIndex(s => s.zone === z.dataset.zone);
        z.classList.toggle('active', z.dataset.zone === seg.zone);
        z.classList.toggle('done-zone', zidx >= 0 && zidx < idx);
      });
      setTimeout(() => { if(running && !finished) el.message.textContent = 'シャカシャカ♪'; }, 1000);
    }
  }
  function tick(){
    paint();
    if(current() >= TOTAL - 0.05 && !finished) finish();
  }
  function clearTick(){ if(timerId){ clearInterval(timerId); timerId = null; } }
  async function start(){
    if(finished) reset();
    setScreen('stage');
    try{
      await el.song.play();
      running = true; finished = false;
      el.start.textContent = 'さいせい中'; el.start.disabled = true; el.pause.disabled = false;
      el.brush.classList.add('cleaning'); el.message.textContent = 'シャカシャカ♪';
      clearTick(); timerId = setInterval(tick, 120); tick();
    }catch(e){
      el.message.textContent = 'もういちど スタートをおしてね';
      console.error(e);
    }
  }
  function pause(){
    el.song.pause(); running = false; clearTick();
    el.start.textContent = 'つづき'; el.start.disabled = false; el.pause.disabled = true;
    el.brush.classList.remove('cleaning'); el.message.textContent = 'ちょっと おやすみ';
  }
  function reset(){
    clearTick();
    running = false; finished = false; lastIdx = -1;
    el.song.pause();
    try { el.song.currentTime = 0; } catch(e) {}
    setScreen('stage');
    el.start.textContent = 'スタート'; el.start.disabled = false; el.pause.disabled = true;
    el.brush.classList.remove('cleaning');
    el.timer.textContent = '1:30'; el.progress.style.width = '0%';
    el.areaName.textContent = 'じゅんび'; el.areaHint.textContent = 'よこ向きで使ってね'; el.message.textContent = 'スタートをおしてね';
    el.zones.forEach(z => z.classList.remove('active','done-zone'));
  }
  function finish(){
    clearTick(); running = false; finished = true;
    el.song.pause(); el.brush.classList.remove('cleaning');
    el.timer.textContent = '0:00'; el.progress.style.width = '100%';
    el.zones.forEach(z => z.classList.add('done-zone'));
    setScreen('done');
  }
  document.addEventListener('DOMContentLoaded', reset, { once:true });
  window.addEventListener('pageshow', reset);
  el.start.addEventListener('click', start);
  el.pause.addEventListener('click', pause);
  el.reset.addEventListener('click', reset);
  el.again.addEventListener('click', reset);
  el.song.addEventListener('ended', finish);
  reset();
})();
