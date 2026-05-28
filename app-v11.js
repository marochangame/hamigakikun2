const germs = document.getElementById('germs');
const finish = document.getElementById('finish');
const startBtn = document.getElementById('startBtn');

let total = 10;
let cleared = 0;

function makeGerm(){
  const g = document.createElement('div');
  g.className = 'germ';
  g.innerHTML = '🦠';
  g.style.left = Math.random()*75 + '%';
  g.style.top = Math.random()*70 + '%';

  g.onclick = ()=>{
    g.style.transform='scale(1.8)';
    g.style.opacity='0';
    setTimeout(()=>g.remove(),150);
    cleared++;
    if(cleared >= total){
      finish.style.display='flex';
    }
  };
  germs.appendChild(g);
}

startBtn.onclick = ()=>{
  startBtn.style.display='none';
  for(let i=0;i<total;i++){
    makeGerm();
  }
};
