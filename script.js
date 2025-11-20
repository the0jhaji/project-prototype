// UI script: run after DOMContentLoaded so all elements exist
document.addEventListener('DOMContentLoaded', ()=>{
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if(menuBtn) menuBtn.addEventListener('click', ()=> navLinks.classList.toggle('visible'));

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      if(href.startsWith('#')){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });

  /* Consult form (simplified) */
  const consultForm = document.getElementById('consultForm');
  if(consultForm){
    consultForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(consultForm);
      const nameVal = (fd.get('name')||'').toString().trim();
      const emailVal = (fd.get('email')||'').toString().trim();
      const reasonVal = (fd.get('reason')||'').toString().trim();
      if(!nameVal || !reasonVal){ showToast('Please fill name and reason for consult.'); return; }
      if(emailVal && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailVal)){ showToast('Please enter a valid email or leave blank.'); return; }
      // No local admin storage: simply acknowledge submission (site is static/demo)
      showToast('Consult request submitted. We will reach out if contact information was provided.');
      consultForm.reset();
    });
  }

  /* Toast helpers & undo */
  const toastEl = document.getElementById('toast'); let undoTimeout = null;
  function showToast(msg, timeout=3000){ if(!toastEl) return; toastEl.innerHTML = `<div>${escapeHtml(msg)}</div>`; const btn = document.createElement('button'); btn.textContent='OK'; btn.addEventListener('click', ()=>{ toastEl.classList.add('hidden'); if(undoTimeout) clearTimeout(undoTimeout); }); toastEl.appendChild(btn); toastEl.classList.remove('hidden'); if(undoTimeout) clearTimeout(undoTimeout); undoTimeout = setTimeout(()=>{ toastEl.classList.add('hidden'); }, timeout); }
  function showUndoToast(msg, undoFn, timeout=8000){ if(!toastEl) return; toastEl.innerHTML = `<div>${escapeHtml(msg)}</div>`; const btn = document.createElement('button'); btn.textContent='Undo'; btn.addEventListener('click', ()=>{ if(undoTimeout) clearTimeout(undoTimeout); toastEl.classList.add('hidden'); undoFn(); }); const ok = document.createElement('button'); ok.textContent='OK'; ok.addEventListener('click', ()=>{ if(undoTimeout) clearTimeout(undoTimeout); toastEl.classList.add('hidden'); }); toastEl.appendChild(btn); toastEl.appendChild(ok); toastEl.classList.remove('hidden'); if(undoTimeout) clearTimeout(undoTimeout); undoTimeout = setTimeout(()=>{ toastEl.classList.add('hidden'); }, timeout); }

  window.addEventListener('calmnest:undo', (e)=>{ const d = e.detail || {}; if(d.type === 'mood'){ showUndoToast('Mood entry deleted', ()=>{ try{ window.calMN_undoMood(); showToast('Undo successful'); }catch(e){ console.error(e); } }); } });

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

  // Admin/login functionality removed; consults are no longer stored locally.
  
});
