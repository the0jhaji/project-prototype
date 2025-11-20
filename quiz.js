// Self-assessment quiz: render questions, compute score, show category and suggestions
(function(){
  const quizContainer = document.getElementById('quizContainer');

  const questions = [
    {q:'I feel overwhelmed by my responsibilities.', a:[0,1,2,3]},
    {q:'I find it hard to relax even when I try.', a:[0,1,2,3]},
    {q:'I worry about exams or assignments frequently.', a:[0,1,2,3]},
    {q:'I have trouble sleeping because of stress.', a:[0,1,2,3]},
    {q:'I have little motivation to start tasks.', a:[0,1,2,3]},
    {q:'I find myself overthinking small problems.', a:[0,1,2,3]},
    {q:'I feel irritable or impatient more than usual.', a:[0,1,2,3]},
    {q:'I experience physical symptoms of stress (headache, tight chest).', a:[0,1,2,3]},
    {q:'I have difficulty concentrating on study/work.', a:[0,1,2,3]},
    {q:'I avoid social situations because of worry.', a:[0,1,2,3]}
  ];

  function renderQuiz(){
    const form = document.createElement('form');
    questions.forEach((item,i)=>{
      const qcard = document.createElement('div');
      qcard.className = 'qcard';
      qcard.innerHTML = `<p><strong>${i+1}. ${item.q}</strong></p>`;
      ['Never','Sometimes','Often','Almost always'].forEach((label,idx)=>{
        const id = `q${i}_a${idx}`;
        const input = document.createElement('input');
        input.type = 'radio'; input.name = 'q'+i; input.value = idx; input.id = id;
        const lab = document.createElement('label'); lab.htmlFor = id; lab.textContent = label; lab.style.marginRight='12px';
        qcard.appendChild(input); qcard.appendChild(lab);
      });
      form.appendChild(qcard);
    });
    const submit = document.createElement('button'); submit.type='submit'; submit.textContent='Submit';
    form.appendChild(submit);
    form.addEventListener('submit', onSubmit);
    quizContainer.appendChild(form);
  }

  function onSubmit(e){
    e.preventDefault();
    const form = e.target;
    let score = 0;
    for(let i=0;i<questions.length;i++){
      const val = form['q'+i].value;
      if(val === undefined || val === ''){ alert('Please answer all questions.'); return; }
      score += Number(val);
    }

    const max = (questions.length*3);
    const pct = Math.round((score/max)*100);
    let category = '';
    if(pct <= 33) category = 'Low stress';
    else if(pct <= 66) category = 'Moderate stress';
    else category = 'High stress';

    const suggestions = {
      'Low stress': ['Keep your routines, practice weekly check-ins, and maintain healthy sleep.'],
      'Moderate stress': ['Try short daily grounding practices, schedule breaks, and reach out to peers or tutors.'],
      'High stress': ['Consider talking to a counselor, reduce load where possible, and use immediate grounding techniques.']
    };

    quizContainer.innerHTML = `<div class="card"><h3>Result: ${category}</h3><p>Score: ${score} / ${max} (${pct}%)</p><ul>${suggestions[category].map(s=>`<li>${s}</li>`).join('')}</ul><button id="retake">Retake Quiz</button></div>`;
    document.getElementById('retake').addEventListener('click', ()=>{ quizContainer.innerHTML=''; renderQuiz(); });
  }

  renderQuiz();
})();
