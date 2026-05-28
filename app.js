const btn=document.getElementById('startBtn');
const germs=document.querySelectorAll('.germ');
const sparkles=document.querySelector('.sparkles');
const finish=document.getElementById('finish');

btn.addEventListener('click',()=>{
  btn.style.display='none';

  germs.forEach((g,i)=>{
    setTimeout(()=>{
      g.style.opacity='0';

      for(let n=0;n<4;n++){
        const s=document.createElement('div');
        s.className='spark';
        s.textContent='✨';
        s.style.left=(20+Math.random()*60)+'%';
        s.style.top=(25+Math.random()*50)+'%';
        sparkles.appendChild(s);
        setTimeout(()=>s.remove(),1000);
      }
    },i*1800);
  });

  setTimeout(()=>{
    finish.classList.remove('hidden');
  },9000);
});
