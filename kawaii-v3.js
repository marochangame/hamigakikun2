(() => {
'use strict';
const TOTAL = 90;
const song = document.getElementById('song');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const againBtn = document.getElementById('againBtn');
const timer = document.getElementById('timer');
const progress = document.getElementById('progress');
const starRunner = document.getElementById('starRunner');
const app = document.getElementById('app');
const done = document.getElementById('done');
const germsBox = document.getElementById('germs');
const speech = document.getElementById('speech');
const topTeeth = document.getElementById('topTeeth');
const bottomTeeth = document.getElementById('bottomTeeth');
const fairies = ['fairyA','fairyB','fairyC','fairyD'].map(id=>document.getElementById(id));
const germData = [
  [22,48,'#555'],[31,38,'#7e43d8'],[47,45,'#86c934'],[63,38,'#6d3bcf'],[76,47,'#8a4bc8'],
  [36,68,'#6b43c5'],[58,63,'#8250d9'],[70,64,'#9c56d4']
];
let raf = 0;
function makeTeeth(){
  const rotations=[-14,-9,-5,-2,2,5,9,14];
  topTeeth.innerHTML=''; bottomTeeth.innerHTML='';
  for(let i=0;i<8;i++){
    const t=document.createElement('div'); t.className='tooth'; t.style.setProperty('--r', rotations[i]+'deg'); t.style.setProperty('--y', Math.abs(i-3.5)*4+'px'); t.innerHTML='<span class="cheek"></span>'; topTeeth.appendChild(t);
    const b=t.cloneNode(true); b.style.setProperty('--r', (-rotations[i])+'deg'); bottomTeeth.appendChild(b);
  }
}
function makeGerms(){
  germsBox.innerHTML='';
  germData.forEach((g,i)=>{
    const el=document.createElement('div'); el.className='germ'; el.dataset.index=i; el.style.left=g[0]+'%'; el.style.top=g[1]+'%'; el.style.setProperty('--c',g[2]);
    for(let j=0;j<6;j++){const s=document.createElement('span');s.className='spike';s.style.setProperty('--a',(j*60)+'deg');el.appendChild(s)}
    const m=document.createElement('span');m.className='mouthG';el.appendChild(m); germsBox.appendChild(el);
  });
}
function fmt(s){s=Math.max(0,Math.ceil(s)); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
function setTime(t){
  const remain = TOTAL - t; timer.textContent = fmt(remain);
  const pct = Math.min(100, Math.max(0, (t/TOTAL)*100));
  progress.style.width = pct+'%'; starRunner.style.left = `calc(${pct}% - 2px)`;
  const goneCount = Math.floor((t/TOTAL) * (germData.length+1));
  [...germsBox.children].forEach((el,i)=>el.classList.toggle('gone', i < goneCount));
  const fairyCount = Math.min(4, Math.floor(t/20)+1);
  fairies.forEach((f,i)=>f.classList.toggle('active', i < fairyCount));
  speech.textContent = t < 8 ? 'シュッシュッシュ♪' : t < 35 ? 'ピカピカ〜！' : t < 65 ? 'バイ菌ばいばい！' : 'あとすこし♪';
}
function loop(){ setTime(song.currentTime || 0); if(!song.paused) raf=requestAnimationFrame(loop); }
async function start(){
  done.classList.add('hidden'); startBtn.classList.add('hidden'); pauseBtn.classList.remove('hidden'); resetBtn.classList.remove('hidden'); app.classList.add('playing');
  try{ await song.play(); }catch(e){ console.log(e); }
  cancelAnimationFrame(raf); loop();
}
function pause(){
  if(song.paused){ start(); pauseBtn.textContent='ちょっとおやすみ'; }
  else { song.pause(); app.classList.remove('playing'); pauseBtn.textContent='つづき'; cancelAnimationFrame(raf); }
}
function reset(){
  song.pause(); song.currentTime = 0; cancelAnimationFrame(raf); app.classList.remove('playing'); done.classList.add('hidden'); startBtn.classList.remove('hidden'); pauseBtn.classList.add('hidden'); resetBtn.classList.add('hidden'); pauseBtn.textContent='ちょっとおやすみ'; setTime(0);
}
function finish(){
  cancelAnimationFrame(raf); app.classList.remove('playing'); pauseBtn.classList.add('hidden'); resetBtn.classList.add('hidden'); startBtn.classList.add('hidden'); setTime(TOTAL); done.classList.remove('hidden');
}
startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
againBtn.addEventListener('click', reset);
song.addEventListener('ended', finish);
makeTeeth(); makeGerms(); reset();
})();
