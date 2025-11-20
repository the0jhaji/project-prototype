// Mood tracker using localStorage and a simple bar graph + timestamps + export
(() => {
  const buttons = document.querySelectorAll('.mood-btn');
  const graph = document.getElementById('moodGraph');
  const list = document.getElementById('moodList');
  const lastSaved = document.getElementById('lastSaved');
  const exportBtn = document.getElementById('exportMood');
  const clearBtn = document.getElementById('clearMood');
  const STORAGE_KEY = 'calmnest_moods_v1_entries';
  const moodKeys = ['very_happy','happy','neutral','sad','very_sad'];
  const moodEmoji = {very_happy:'😊',happy:'🙂',neutral:'😐',sad:'☹️',very_sad:'😢'};

  function load(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch(e){ return []; }
  }

  function save(entries){ localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }

  function addMood(key){
    const entries = load();
    entries.push({mood:key, t: Date.now()});
    save(entries);
    render();
  }

  function formatTime(ts){
    try{
      const d = new Date(ts);
      return d.toLocaleString();
    } catch(e){ return ''+ts; }
  }

  function computeCounts(entries){
    const counts = moodKeys.reduce((o,k)=>{o[k]=0;return o},{ });
    entries.forEach(e=>{ if(counts[e.mood] !== undefined) counts[e.mood]++; });
    return counts;
  }

  function render(){
    if(!graph) return;
    const entries = load();
    const counts = computeCounts(entries);
    const total = Math.max(1, Object.values(counts).reduce((s,v)=>s+v,0));

    graph.innerHTML = '';
    moodKeys.forEach(k => {
      const count = counts[k] || 0;
      const bar = document.createElement('div');
      bar.className = 'mood-bar';
      const height = 40 + (count/total)*120; // more variation
      bar.style.height = height + 'px';
      bar.innerHTML = `<div style="text-align:center"><div class="mood-emoji">${moodEmoji[k]}</div><span>${count}</span></div>`;
      graph.appendChild(bar);
    });

    // render list of recent entries (last 10)
    if(list){
      list.innerHTML = '';
      const recent = entries.slice(-10).reverse();
      if(recent.length===0){ list.innerHTML = '<div class="muted">No mood entries yet.</div>'; }
      recent.forEach(en =>{
          const row = document.createElement('div'); row.className='mood-entry';
          row.innerHTML = `<div style="display:flex;gap:8px;align-items:center"><div class="mood-emoji">${moodEmoji[en.mood]||'•'}</div><div><div>${capitalize(en.mood.replace('_',' '))}</div><div class="mood-time">${formatTime(en.t)}</div></div></div>`;
          const actions = document.createElement('div');
          const del = document.createElement('button'); del.textContent='Delete'; del.className='small-btn';
          del.addEventListener('click', ()=>{ deleteMoodEntry(en.t); });
          actions.appendChild(del);
          row.appendChild(actions);
          list.appendChild(row);
      });
    }

    if(lastSaved){
      const last = entries.length? formatTime(entries[entries.length-1].t) : 'No entries yet';
      lastSaved.textContent = last;
    }
  }

  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

  function exportCSV(){
    const entries = load();
    if(entries.length===0){ alert('No entries to export'); return; }
    const rows = [['mood','timestamp','iso']];
    entries.forEach(e=> rows.push([e.mood, e.t, new Date(e.t).toISOString()]));
    const csv = rows.map(r=> r.map(v=> '"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'calmnest_moods.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  function clearData(){ if(!confirm('Clear all stored mood data?')) return; localStorage.removeItem(STORAGE_KEY); render(); }

  /* delete with undo */
  let lastDeleted = null; // {entry, index}
  function deleteMoodEntry(ts){
    const entries = load();
    const idx = entries.findIndex(x=>x.t===ts);
    if(idx===-1) return;
    const [removed] = entries.splice(idx,1); save(entries); render();
    // offer undo
    // use global toast if available
    try{ window.showUndoToast ?? null }catch(e){}
    // communicate via custom event so script.js toast can be used
    const ev = new CustomEvent('calmnest:undo', {detail:{type:'mood',entry:removed,index:idx}});
    window.dispatchEvent(ev);
    lastDeleted = {entry:removed,index:idx};
    // keep a fallback timeout to clear lastDeleted after 8s
    setTimeout(()=>{ lastDeleted = null; }, 8500);
  }

  // external undo (called by script.js when user clicks undo)
  window.calMN_undoMood = function(){ if(!lastDeleted) return; const entries = load(); entries.splice(lastDeleted.index,0,lastDeleted.entry); save(entries); render(); lastDeleted = null; };

  buttons.forEach(btn => btn.addEventListener('click', ()=>{
    const mood = btn.dataset.mood;
    addMood(mood);
    try{ btn.animate([{transform:'scale(1.1)'},{transform:'scale(1)'}],{duration:200}); }catch(e){}
  }));

  if(exportBtn) exportBtn.addEventListener('click', exportCSV);
  if(clearBtn) clearBtn.addEventListener('click', clearData);

  window.addEventListener('load', render);
})();
