// Simple rule-based chatbot for Well Core
(() => {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatLog = document.getElementById('chatLog');

  const responses = {
    anxiety: [
      "I hear you — anxiety can feel overwhelming. Try 4-4-4 breathing: breathe in 4s, hold 4s, out 4s.",
      "When anxious thoughts come, name them (" + '"This is anxiety"' + ") and gently return to the present."
    ],
    stress: [
      "Stress often signals too many demands. Can we list the top 2 tasks and shrink them into tiny steps?",
      "Try a short break and a breathing exercise — it can reset focus quickly."
    ],
    exam: [
      "Exam fear is common. Use active recall and spaced intervals rather than last-minute cramming.",
      "Expect nervousness — plan a calming routine the night before, and practice deep breathing before the test."
    ],
    motivation: [
      "Break goals into tiny next steps. Small progress builds motivation.",
      "Remind yourself why this matters to you, and celebrate one small win today."
    ],
    sleep: [
      "Reduce screens before bed, try a wind-down routine, and keep a consistent sleep schedule.",
      "If your mind races, write a quick to-do list for tomorrow — then try a relaxation practice."
    ],
    fallback: [
      "I'm here to listen. Can you say more about what's on your mind?",
      "I'm not a clinician, but I can offer small tools and suggestions. If you're in crisis, please reach out to local services."
    ],
    overthinking: [
      "Overthinking can make you stressed and stuck. 🌿 Try journaling, deep breathing, focusing on small actions, or doing something you enjoy. Talk to someone if it feels overwhelming."
    ],
    perfectionism: [
      "Set realistic goals, focus on progress over perfection, practice self-compassion, and challenge all-or-nothing thinking."
    ],
    loneliness: [
      "Engage in community activities, reach out to friends or family, consider joining clubs or groups with shared interests, and practice self-kindness."
    ],
    timeManagement: [
      "Prioritize tasks using the Eisenhower matrix, break work into focused intervals (Pomodoro technique), eliminate distractions, and set clear boundaries for work and rest."
    ],
    depression: [
      "Establish a daily routine, set small achievable goals, engage in physical activity, and reach out to supportive friends, family, or a mental health professional."
    ],
    anger: [
      "Practice deep breathing, take a timeout when feeling overwhelmed, identify triggers, and use 'I' statements to express feelings calmly."
    ],
    relationships: [
      "Communicate openly and honestly, practice active listening, set healthy boundaries, and seek to understand the other person's perspective."
    ],
    breakup: [
      "Allow yourself to grieve, focus on self-care, seek support from friends or a counselor, and engage in activities that bring you joy. And you should Move on💛.Find someone who really loves you not the fake one."
    ],
    selfEsteem: [
      "Practice positive self-talk, set achievable goals, surround yourself with supportive people, and focus on your strengths and accomplishments."
    ],
    mindfulness: [
      "Engage in daily mindfulness meditation, practice deep breathing exercises, focus on the present moment, and use grounding techniques to stay connected."
    ],
    gratitude: [
      "Keep a gratitude journal, express thanks to others, focus on positive aspects of your life, and practice mindfulness to appreciate the present moment."
    ],
    productivity: [
      "Set clear goals, prioritize tasks, eliminate distractions, use time-blocking techniques, and take regular breaks to maintain focus."
    ],
    creativity: [
      "Engage in free writing or brainstorming sessions, explore new hobbies or interests, seek inspiration from different sources, and allow yourself to take risks without fear of failure."
    ],
    focus: [
      "Use the Pomodoro technique to break work into focused intervals, eliminate distractions, practice mindfulness to stay present, and set clear, achievable goals."
    ],
    procrastination: [
      "Break tasks into smaller, manageable steps, set specific deadlines, eliminate distractions, and use positive reinforcement to reward progress."
    ],
    decisionMaking: [
      "List pros and cons, consider long-term consequences, seek advice from trusted individuals, and trust your intuition."
    ],
    resilience: [
      "Develop a growth mindset, practice self-care, build a strong support network, and focus on problem-solving skills."
    ],
    selfdoubt: [
      "Challenge negative thoughts, focus on past successes, set realistic goals, and seek feedback from trusted individuals."
    ],
    forgiveness: [
      "Acknowledge your feelings, practice empathy, let go of grudges, and focus on personal growth and healing."
    ],
    boundaries: [
      "Clearly communicate your limits, practice saying no, prioritize self-care, and seek support when needed."
    ],
    change: [
      "Embrace a growth mindset, focus on what you can control, seek support from others, and practice self-compassion during transitions."
    ],
    goals: [
      "Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound), break them into smaller steps, track your progress, and celebrate achievements along the way."
    ],
    habits: [
      "Start small with one habit at a time, use triggers to remind you, track your progress, and reward yourself for consistency."
    ],
    learning: [
      "Use active learning techniques (summarizing, questioning), practice spaced repetition, teach others what you've learned, and take regular breaks to enhance retention."
    ],
    communication: [
      "Practice active listening, use 'I' statements to express your feelings, maintain eye contact, and be mindful of non-verbal cues."
    ],
    teamwork: [
      "Communicate openly, respect diverse perspectives, set clear roles and goals, and practice empathy and active listening."
    ],
    leadership: [
      "Lead by example, communicate a clear vision, empower team members, and practice active listening and empathy."
    ],
    introvert: [
      "Honor your need for solitude, set boundaries to protect your energy, engage in deep one-on-one conversations, and practice self-care."
    ],
    peerpresure: [
      "Stay true to your values, practice assertive communication, seek support from like-minded individuals, and develop confidence in your decisions."
    ],
    socialanxiety: [
      "Practice gradual exposure to social situations, use deep breathing techniques, challenge negative thoughts, and focus on the present moment."
    ], selfcare: [
      "Prioritize activities that nourish your body and mind, set boundaries to protect your time, practice mindfulness, and seek support when needed."
    ],ego: [
      "Recognize and challenge ego-driven thoughts, practice humility, focus on personal growth, and cultivate empathy for others."]
  };

  function addMessage(text, who='bot'){
    const el = document.createElement('div');
    el.className = 'chat-bubble ' + (who === 'bot' ? 'bot' : 'user');
    el.textContent = text;
    chatLog.appendChild(el);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function pickResponse(key){
    const arr = responses[key] || responses.fallback;
    return arr[Math.floor(Math.random()*arr.length)];
  }

  function analyze(text){
    const t = text.toLowerCase();
    if(/anxi|panic/.test(t)) return 'anxiety';
    if(/stress|overwhelm/.test(t)) return 'stress';
    if(/exam|test|revision|study fear|studying/.test(t)) return 'exam';
    if(/motiv|motivat|stuck|lazy/.test(t)) return 'motivation';
    if(/sleep|insomnia|tired|wake up/.test(t)) return 'sleep';
    if(/habit|routine/.test(t)) return 'habits';
    if(/overthink|over-thinking/.test(t)) return 'overthinking';
    if(/perfect|perfection/.test(t)) return 'perfectionism';
    if(/lonely|loneliness|alone/.test(t)) return 'loneliness';
    if(/time management|procrastinat|delay|put off/.test(t)) return 'timeManagement';
    if(/depress|down|hopeless|sad/.test(t)) return 'depression';
    if(/anger|angry|frustrat|irritat/.test(t)) return 'anger';
    if(/relationship|partner|friend|family/.test(t)) return 'relationships';
    if(/break[- ]?up|heartbreak|split/.test(t)) return 'breakup';
    if(/self[- ]?esteem|confidence|self[- ]?worth/.test(t)) return 'selfEsteem';
    if(/mindfulness|mindful|meditation/.test(t)) return 'mindfulness';
    if(/gratitude|thankful|appreciation/.test(t)) return 'gratitude';
    if(/productivit|efficient|focus/.test(t)) return 'productivity';
    if(/creativ|inspiration|imaginat/.test(t)) return 'creativity';
    if(/focus|concentrat|attention/.test(t)) return 'focus';
    if(/procrastinat|delay|put off/.test(t)) return 'procrastination';
    if(/decision[- ]?making|decide|choice/.test(t)) return 'decisionMaking';
    if(/resilienc|bounce back|adapt/.test(t)) return 'resilience';
    if(/self[- ]?doubt|insecure|uncertain/.test(t)) return 'selfdoubt';
    if(/forgiveness|forgive|letting go/.test(t)) return 'forgiveness';
    if(/boundar|limits|personal space/.test(t)) return 'boundaries';
    if(/chang|transition|adjustment/.test(t)) return 'change';
    if(/goal[- ]?setting|objectives|aims/.test(t)) return 'goals';
    if(/learning|study|knowledge/.test(t)) return 'learning';
    if(/communicat|conversation|talking/.test(t)) return 'communication';
    if(/teamwork|collaboration|group work/.test(t)) return 'teamwork';
    if(/leadership|lead|manager/.test(t)) return 'leadership';
    if(/introvert|shy|quiet/.test(t)) return 'introvert';
    if(/peer[- ]?pressure|fit in|social pressure/.test(t)) return 'peerpresure';
    if(/social[- ]?anxiety|social fear|nervous around people/.test(t)) return 'socialanxiety';
    if(/self[- ]?care|selfcare|take care of myself/.test(t)) return 'selfcare';

    return null;
  }

  chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const text = chatInput.value.trim();
    if(!text) return;
    addMessage(text,'user');
    chatInput.value = '';

    const key = analyze(text);
    // simulate typing
    const typing = document.createElement('div');
    typing.className = 'chat-bubble bot';
    typing.textContent = '...';
    chatLog.appendChild(typing);
    chatLog.scrollTop = chatLog.scrollHeight;

    setTimeout(()=>{
      chatLog.removeChild(typing);
      const reply = key ? pickResponse(key) : pickResponse('fallback');
      addMessage(reply,'bot');
    }, 700 + Math.random()*900);
  });

  // starter greeting
  window.addEventListener('load', ()=>{
    setTimeout(()=>addMessage('Hi — I am Well Core. You can tell me about anxiety, stress, exam fear, motivation, or sleep.'),400);
  });

})();
