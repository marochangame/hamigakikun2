(()=>{
'use strict';
const stage=document.getElementById('mouth');
const germsEl=document.getElementById('germs');
const bubblesEl=document.getElementById('bubbles');
const brush=document.getElementById('brush');
const startBtn=document.getElementById('startBtn');
const againBtn=document.getElementById('againBtn');
const finish=document.getElementById('finish');
const topTeeth=document.getElementById('topTeeth');
const bottomTeeth=document.getElementById('bottomTeeth');
const germData=[
 [24,45,'#7e8b92','×'],[38,34,'#9846bd','!'],[51,55,'#a5cf38','!'],[65,43,'#7f41be',''],[73,52,'#9143b8',''],[33,63,'#e25482','×'],[58,36,'#cb517e',''],[18,55,'#934244','!'],[82,45,'#b84198','']
];
let audioCtx=null,noiseNode=null,gainNode=null,started=false,cleaned=0;
function makeTeeth(el,count){el.innerHTML='';for(let i=0;i<count;i++){const t=document.createElement('div');t.className='tooth'+(i%3===1?' wink':'');el.appendChild(t)}}
function makeGerms(){germsEl.innerHTML='';germData.forEach((g,i)=>{const d=document.createElement('div');d.className='germ';d.dataset.hit='0';d.dataset.i=i;d.style.left=g[0]+'%';d.style.top=g[1]+'%';d.style.background=g[2];d.textContent=g[3];germsEl.appendChild(d)})}
function init(){makeTeeth(topTeeth,12);makeTeeth(bottomTeeth,11);makeGerms();bubblesEl.innerHTML='';finish.classList.remove('show');finish.setAttribute('aria-hidden','true');startBtn.style.display='block';started=false;cleaned=0;moveBrush(62,62);stopSound()}
function setupAudio(){if(audioCtx)return;audioCtx=new (window.AudioContext||window.webkitAudioContext)();gainNode=audioCtx.createGain();gainNode.gain.value=0;gainNode.connect(audioCtx.destination)}
function startSound(){setupAudio();audioCtx.resume();const buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*.15,audioCtx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.45;noiseNode=audioCtx.createBufferSource();noiseNode.buffer=buffer;noiseNode.loop=true;const filter=audioCtx.createBiquadFilter();filter.type='bandpass';filter.frequency.value=2200;filter.Q.value=.8;noiseNode.connect(filter);filter.connect(gainNode);gainNode.gain.setTargetAtTime(.07,audioCtx.currentTime,.03);noiseNode.start()}
function stopSound(){if(gainNode&&audioCtx)gainNode.gain.setTargetAtTime(0,audioCtx.currentTime,.05);if(noiseNode){try{noiseNode.stop(audioCtx.currentTime+.1)}catch(e){} noiseNode=null}}
function moveBrush(x,y){brush.style.left=`calc(${x}% - 120px)`;brush.style.top=`calc(${y}% - 54px)`}
function addBubble(x,y,clean=false){const b=document.createElement('div');b.className='bubble'+(clean?' clean':'');const size=60+Math.random()*88;b.style.width=size+'px';b.style.height=size+'px';b.style.left=`calc(${x}% - ${size/2}px)`;b.style.top=`calc(${y}% - ${size/2}px)`;bubblesEl.appendChild(b);setTimeout(()=>b.classList.add('burst'),520);setTimeout(()=>b.remove(),980)}
function hitGerms(x,y){document.querySelectorAll('.germ:not(.dead)').forEach(g=>{const gx=parseFloat(g.style.left),gy=parseFloat(g.style.top);const dist=Math.hypot(gx-x,gy-y);if(dist<10){let h=Number(g.dataset.hit)+1;g.dataset.hit=h;addBubble(gx,gy,true);if(h>=2){g.classList.add('dead');cleaned++;if(cleaned>=germData.length)setTimeout(done,700)}}})}
function done(){started=false;stopSound();finish.classList.add('show');finish.setAttribute('aria-hidden','false')}
function pointToPct(evt){const r=stage.getBoundingClientRect();const t=evt.touches?evt.touches[0]:evt;return {x:((t.clientX-r.left)/r.width)*100,y:((t.clientY-r.top)/r.height)*100}}
function scrub(evt){if(!started)return;evt.preventDefault();const p=pointToPct(evt);p.x=Math.max(13,Math.min(87,p.x));p.y=Math.max(26,Math.min(78,p.y));moveBrush(p.x,p.y);addBubble(p.x-5+Math.random()*10,p.y-4+Math.random()*8,false);hitGerms(p.x,p.y)}
function start(){startBtn.style.display='none';finish.classList.remove('show');started=true;cleaned=0;makeGerms();bubblesEl.innerHTML='';startSound();moveBrush(60,62)}
startBtn.addEventListener('click',start);againBtn.addEventListener('click',init);
stage.addEventListener('pointerdown',e=>{if(started){stage.setPointerCapture(e.pointerId);scrub(e)}});
stage.addEventListener('pointermove',scrub);stage.addEventListener('touchmove',scrub,{passive:false});
init();
})();
