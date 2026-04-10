document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('table-container');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const filterContainer = document.getElementById('category-filters');
  const themeToggle = document.getElementById('theme-toggle');
  const viewToggle = document.getElementById('toggle-view');
  
  const logo = document.querySelector('.logo h1');
  logo.style.cursor = 'pointer';
  logo.title = 'Reset to Home';
  logo.addEventListener('click', resetFilters);

  // Modals
  const elModal = document.getElementById('element-modal');
  const closeModal = document.getElementById('close-modal');
  const quizModal = document.getElementById('quiz-modal');
  const closeQuizBtn = document.getElementById('close-quiz');

  // Categories mapping to CSS Variables
  const categoryColors = {
    "alkali-metal": "var(--alkali-metal)",
    "alkaline-earth": "var(--alkaline-earth)",
    "transition-metal": "var(--transition-metal)",
    "post-transition": "var(--post-transition)",
    "metalloid": "var(--metalloid)",
    "nonmetal": "var(--nonmetal)",
    "halogen": "var(--halogen)",
    "noble-gas": "var(--noble-gas)",
    "lanthanide": "var(--lanthanide)",
    "actinide": "var(--actinide)",
    "unknown": "var(--unknown)"
  };

  const displayNames = {
    "alkali-metal": "Alkali Metals",
    "alkaline-earth": "Alkaline Earth",
    "transition-metal": "Transition Metals",
    "post-transition": "Post Transition",
    "metalloid": "Metalloids",
    "nonmetal": "Nonmetals",
    "halogen": "Halogens",
    "noble-gas": "Noble Gases",
    "lanthanide": "Lanthanides",
    "actinide": "Actinides",
    "unknown": "Unknown"
  };

  let current3D = false;
  let activeCategory = null;

  // Render Legend
  Object.keys(categoryColors).forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.innerHTML = `<div class="color-dot" style="color: ${categoryColors[cat]}; background: currentColor;"></div> ${displayNames[cat]}`;
    btn.dataset.category = cat;
    btn.addEventListener('click', () => toggleCategoryFilter(cat, btn));
    filterContainer.appendChild(btn);
  });

  // Render Periodic Table Grid
  elementsData.forEach(el => {
    const card = document.createElement('div');
    card.className = `element-card cat-${el.category}`;
    card.dataset.id = el.symbol;
    card.dataset.num = el.num;
    card.dataset.name = el.name.toLowerCase();
    
    // Set grid positions
    card.style.gridColumn = el.x;
    card.style.gridRow = el.y;
    // Set category generic color for styling bounds
    card.style.setProperty('--cat-color', categoryColors[el.category] || "var(--unknown)");

    card.innerHTML = `
      <span class="el-number">${el.num}</span>
      <span class="el-symbol">${el.symbol}</span>
      <span class="el-mass">${el.mass}</span>
      <span class="el-name">${el.name}</span>
    `;

    card.addEventListener('click', () => openElementModal(el));
    
    // 3D Parallax Hover Effect
    card.addEventListener('mousemove', (e) => {
      if (!current3D) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xOffset = (x - rect.width / 2) / 10;
      const yOffset = (y - rect.height / 2) / 10;
      card.style.transform = `translateZ(50px) scale(1.1) rotateX(${-yOffset}deg) rotateY(${xOffset}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      if (current3D) card.style.transform = `translateZ(0)`;
      else card.style.transform = `none`;
    });

    container.appendChild(card);
  });

  // Toggles
  viewToggle.addEventListener('click', () => {
    current3D = !current3D;
    if (current3D) {
      container.classList.remove('view-2d');
      container.classList.add('view-3d');
      viewToggle.innerText = "2D View";
      viewToggle.classList.add('active');
    } else {
      container.classList.remove('view-3d');
      container.classList.add('view-2d');
      viewToggle.innerText = "3D View";
      viewToggle.classList.remove('active');
      
      // Reset card transforms
      document.querySelectorAll('.element-card').forEach(c => c.style.transform = 'none');
    }
  });

  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    if (html.getAttribute('data-theme') === 'dark') {
      html.setAttribute('data-theme', 'light');
      themeToggle.innerText = '🌙';
    } else {
      html.setAttribute('data-theme', 'dark');
      themeToggle.innerText = '☀️';
    }
  });

  // Search Logic
  const executeSearch = () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      resetFilters();
      return;
    }
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    activeCategory = null;

    document.querySelectorAll('.element-card').forEach(card => {
      card.classList.remove('dimmed', 'highlight-search');
      if (card.dataset.name.includes(query) || card.dataset.id.toLowerCase() === query || card.dataset.num === query) {
        card.classList.add('highlight-search');
      } else {
        card.classList.add('dimmed');
      }
    });
  };

  searchInput.addEventListener('input', executeSearch);
  searchBtn.addEventListener('click', executeSearch);

  function toggleCategoryFilter(cat, btnElement) {
    searchInput.value = ''; // clear search
    if (activeCategory === cat) {
      resetFilters(); // toggle off
    } else {
      activeCategory = cat;
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      btnElement.classList.add('active');
      
      document.querySelectorAll('.element-card').forEach(card => {
        card.classList.remove('highlight-search');
        if (card.classList.contains(`cat-${cat}`)) {
          card.classList.remove('dimmed');
        } else {
          card.classList.add('dimmed');
        }
      });
    }
  }

  function resetFilters() {
    activeCategory = null;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.element-card').forEach(card => card.classList.remove('dimmed', 'highlight-search'));
  }

  // Modal Logic
  function openElementModal(el) {
    document.getElementById('modal-symbol').innerText = el.symbol;
    document.getElementById('modal-symbol').style.color = categoryColors[el.category] || "var(--text-main)";
    document.getElementById('modal-symbol').style.borderColor = categoryColors[el.category] || "var(--text-main)";
    
    document.getElementById('modal-name').innerText = el.name;
    document.getElementById('modal-number').innerText = el.num;
    document.getElementById('modal-mass').innerText = el.mass;
    document.getElementById('modal-category').innerText = displayNames[el.category];
    document.getElementById('modal-category').style.color = categoryColors[el.category];
    
    document.getElementById('modal-config').innerText = el.config;
    document.getElementById('modal-desc').innerText = el.desc;
    
    document.getElementById('modal-wiki').href = `https://en.wikipedia.org/wiki/${el.name}`;
    
    elModal.classList.remove('hidden');
  }

  closeModal.addEventListener('click', () => elModal.classList.add('hidden'));
  document.querySelector('#element-modal .modal-backdrop').addEventListener('click', () => elModal.classList.add('hidden'));


  // ---- QUIZ SYSTEM ----
  const startQuizBtnNav = document.getElementById('start-quiz-btn');
  const beginQuizBtn = document.getElementById('begin-quiz-btn');
  const restartQuizBtn = document.getElementById('restart-quiz-btn');
  const quizSetup = document.getElementById('quiz-setup');
  const quizActive = document.getElementById('quiz-active');
  const quizResult = document.getElementById('quiz-result');
  
  let quizQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;

  startQuizBtnNav.addEventListener('click', () => {
    quizModal.classList.remove('hidden');
    quizSetup.classList.remove('hidden');
    quizActive.classList.add('hidden');
    quizResult.classList.add('hidden');
  });

  closeQuizBtn.addEventListener('click', () => quizModal.classList.add('hidden'));
  document.getElementById('quiz-backdrop').addEventListener('click', () => quizModal.classList.add('hidden'));

  beginQuizBtn.addEventListener('click', startQuiz);
  restartQuizBtn.addEventListener('click', startQuiz);

  function startQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    quizQuestions = generateQuestions(10);
    
    quizSetup.classList.add('hidden');
    quizResult.classList.add('hidden');
    quizActive.classList.remove('hidden');
    
    loadQuestion();
  }

  function generateQuestions(amount) {
    const questions = [];
    const elementsClone = [...elementsData].filter(e => e.category !== 'unknown');
    
    for (let i = 0; i < amount; i++) {
      // Pick random element
      const target = elementsClone[Math.floor(Math.random() * elementsClone.length)];
      
      // Randomize question type
      const type = Math.floor(Math.random() * 3); // 0=symbol, 1=number, 2=category
      let questionText = "";
      let correctAnswer = "";
      let distractors = new Set();
      
      if (type === 0) {
        questionText = `What is the symbol for ${target.name}?`;
        correctAnswer = target.symbol;
        while(distractors.size < 3) {
          const r = elementsClone[Math.floor(Math.random() * elementsClone.length)];
          if (r.symbol !== target.symbol) distractors.add(r.symbol);
        }
      } else if (type === 1) {
        questionText = `What is the atomic number of ${target.name}?`;
        correctAnswer = target.num.toString();
        while(distractors.size < 3) {
          const offset = Math.floor(Math.random() * 15) - 7;
          let r = target.num + offset;
          if (r < 1) r = 1;
          if (r > 118) r = 118;
          if (r !== target.num) distractors.add(r.toString());
        }
      } else {
        questionText = `Which category does ${target.name} belong to?`;
        correctAnswer = displayNames[target.category];
        const cats = Object.values(displayNames).filter(c => c !== 'Unknown');
        while(distractors.size < 3) {
          const r = cats[Math.floor(Math.random() * cats.length)];
          if (r !== correctAnswer) distractors.add(r);
        }
      }

      const options = [correctAnswer, ...Array.from(distractors)];
      // Shuffle options
      options.sort(() => Math.random() - 0.5);

      questions.push({ text: questionText, options, answer: correctAnswer });
    }
    return questions;
  }

  function loadQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    document.getElementById('quiz-progress').innerText = `Question ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    document.getElementById('quiz-score').innerText = `Score: ${score}`;
    document.getElementById('question-text').innerText = q.text;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerText = opt;
      btn.addEventListener('click', () => handleOptionSelection(btn, opt === q.answer));
      optionsContainer.appendChild(btn);
    });
  }

  function handleOptionSelection(btn, isCorrect) {
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => {
      b.disabled = true; // prevent multiple clicks
      if (b.innerText === quizQuestions[currentQuestionIndex].answer) {
        b.classList.add('correct');
      } else if (b === btn && !isCorrect) {
        b.classList.add('wrong');
      }
    });

    if (isCorrect) score++;
    document.getElementById('quiz-score').innerText = `Score: ${score}`;

    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
      } else {
        endQuiz();
      }
    }, 1500);
  }

  function endQuiz() {
    quizActive.classList.add('hidden');
    quizResult.classList.remove('hidden');
    document.getElementById('final-score-val').innerText = score;
    const msg = document.getElementById('quiz-feedback');
    if (score === 10) msg.innerText = "Perfect! You're a true chemist.";
    else if (score >= 7) msg.innerText = "Great job! Very impressive.";
    else if (score >= 4) msg.innerText = "Good effort. Keep studying!";
    else msg.innerText = "You might need to review your elements!";
  }

  // ---- BACKGROUND PARTICLES (Canvas) ----
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }
    draw() {
      ctx.fillStyle = `rgba(0, 243, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animateParticles);
  }
  
  animateParticles();
});
