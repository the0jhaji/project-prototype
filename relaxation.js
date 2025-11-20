// Breathing animation, music player, quotes, and 25-minute timer
(function(){
  // Breathing
  let breathInterval = null;
  const circle = document.getElementById('breathCircle');
  const breathText = document.getElementById('breathText');
  const startBreath = document.getElementById('startBreath');
  const stopBreath = document.getElementById('stopBreath');

  function startBreathing(){
    if(!circle || !breathText) return;
    if(breathInterval) return; // already running
    let step = 0; // 0 in,1 hold,2 out
    const phases = ['Breathe In','Hold','Breathe Out'];
    breathText.textContent = phases[step];
    // initial scale
    circle.style.transform = 'scale(1.15)';
    breathInterval = setInterval(()=>{
      step = (step+1)%3;
      breathText.textContent = phases[step];
      if(step===0) circle.style.transform='scale(1.15)';
      else if(step===1) circle.style.transform='scale(1.25)';
      else circle.style.transform='scale(0.85)';
    }, 4000); // each phase 4s approx
  }
  function stopBreathing(){
    if(breathInterval) clearInterval(breathInterval);
    breathInterval=null;
    if(breathText) breathText.textContent='Ready to breathe';
    if(circle) circle.style.transform='scale(1)';
  }
  if(startBreath) startBreath.addEventListener('click', startBreathing);
  if(stopBreath) stopBreath.addEventListener('click', stopBreathing);

  // Music player
  const audio = document.getElementById('audioPlayer');
  const track1 = document.getElementById('track1');
  const track2 = document.getElementById('track2');
  const audioSource = document.getElementById('audioSource');
  if(track1 && audio && audioSource) track1.addEventListener('click', ()=>{ audioSource.src='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; audio.load(); audio.play().catch(()=>{}); });
  if(track2 && audio && audioSource) track2.addEventListener('click', ()=>{ audioSource.src='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'; audio.load(); audio.play().catch(()=>{}); });

  // Quotes
  const quotes = [
    'Small steps are still progress.',
    'Breathe. You are doing enough for today.',
    'A short break can change your whole afternoon.',
    'Focus on one thing you can finish right now.',
    'Be kind to yourself — you are learning.'
  ];
  const quoteBox = document.getElementById('quoteBox');
  const newQuoteBtn = document.getElementById('newQuote');
  if(newQuoteBtn && quoteBox) newQuoteBtn.addEventListener('click', ()=>{ quoteBox.textContent = quotes[Math.floor(Math.random()*quotes.length)]; });

  // Timer (25-minute Pomodoro)
  const display = document.getElementById('timerDisplay');
  const startTimer = document.getElementById('startTimer');
  const pauseTimer = document.getElementById('pauseTimer');
  const resetTimer = document.getElementById('resetTimer');
  let timer = null; let remaining = 25*60; let running = false;

  function formatTime(s){ const m=Math.floor(s/60); const ss=s%60; return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`; }
  function notifyFinished(){
    // Try Notification API if available and permitted
    try{
      if('Notification' in window){
        if(Notification.permission === 'granted'){ new Notification('CalmNest', {body:'Break finished — time for a short rest.'}); }
        else if(Notification.permission !== 'denied'){ Notification.requestPermission().then(p=>{ if(p==='granted') new Notification('CalmNest', {body:'Break finished — time for a short rest.'}); }); }
        else { alert('Break finished — time for a short rest.'); }
      } else {
        alert('Break finished — time for a short rest.');
      }
    }catch(e){ try{ alert('Break finished — time for a short rest.'); }catch(e){}
    }
  }

  function tick(){
    if(!display) return;
    if(remaining<=0){ clearInterval(timer); timer=null; running=false; display.textContent='00:00'; notifyFinished(); return; }
    remaining--; display.textContent = formatTime(remaining);
  }
  if(startTimer) startTimer.addEventListener('click', ()=>{ if(running) return; running=true; timer=setInterval(tick,1000); });
  if(pauseTimer) pauseTimer.addEventListener('click', ()=>{ if(timer) clearInterval(timer); running=false; timer=null; });
  if(resetTimer) resetTimer.addEventListener('click', ()=>{ if(timer) clearInterval(timer); timer=null; remaining = 25*60; running=false; if(display) display.textContent = formatTime(remaining); });
  if(display) display.textContent = formatTime(remaining);
})();
