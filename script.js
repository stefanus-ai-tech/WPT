import questions from './questions.js';

// DOM Elements
const startButton = document.getElementById('start-button');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const dynamicContainer = document.getElementById('dynamic-container');
const analysisContent = document.getElementById('analysis-content');
const resultContent = document.getElementById('result-content');
const iqScoreElement = document.getElementById('iq-score');
const iqLevelElement = document.getElementById('iq-level');
const timerElement = document.getElementById('time');
const progressBar = document.querySelector('.progress');

let shuffledQuestions, currentQuestionIndex, score, timeLeft, timerInterval;
let userAnswers = [];

// Theme handling
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Card animations
function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function showQuestion(question, direction = 'next') {
  const currentQuestionNum = document.getElementById('current-question');
  const totalQuestions = document.getElementById('total-questions');
  
  questionElement.classList.add('slide-out');
  answerButtonsElement.style.opacity = '0';
  
  setTimeout(() => {
    // Update question counter
    currentQuestionNum.textContent = currentQuestionIndex + 1;
    totalQuestions.textContent = shuffledQuestions.length;
    
    questionElement.innerText = question.question;
    answerButtonsElement.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.innerHTML = `
        <span class="material-icons">radio_button_unchecked</span>
        ${answer.text}
      `;
      button.classList.add('btn');
      button.dataset.index = index;
      button.addEventListener('click', selectAnswer);
      answerButtonsElement.appendChild(button);
    });
    
    questionElement.classList.remove('slide-out');
    questionElement.classList.add('slide-in');
    answerButtonsElement.style.opacity = '1';
    
    // Update navigation buttons
    prevButton.classList.toggle('hide', currentQuestionIndex === 0);
    nextButton.classList.toggle('hide', 
      currentQuestionIndex === shuffledQuestions.length - 1 || 
      !userAnswers[currentQuestionIndex]
    );
    
    // Update progress
    updateProgressBar();
    
    // Mark selected answer if exists
    if (userAnswers[currentQuestionIndex] !== null) {
      const buttons = answerButtonsElement.children;
      const selectedIndex = userAnswers[currentQuestionIndex];
      const correctIndex = question.correctAnswerIndex;
      
      Array.from(buttons).forEach((button, index) => {
        if (index === selectedIndex) {
          button.querySelector('.material-icons').textContent = 
            index === correctIndex ? 'check_circle' : 'cancel';
        }
        button.disabled = true;
      });
    }
  }, 300);
}

// Secret keystroke handler
let secretCode = '';
document.addEventListener('keydown', (e) => {
  secretCode += e.key;
  if (secretCode.length > 11) {
    secretCode = secretCode.slice(-11);
  }
  if (secretCode === 'CJPHONEHOME') {
    document.querySelector('.modal-overlay').classList.add('show');
    document.querySelector('.developer-only').classList.add('show');
    secretCode = '';
  }
});

// Handle emulation mode selection
document.querySelectorAll('input[name="iq-emulation"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelector('.modal-overlay').classList.remove('show');
    document.querySelector('.developer-only').classList.remove('show');
    const emulatedAnswers = getEmulatedAnswers();
    if (emulatedAnswers) {
      autoAnswerQuestions(emulatedAnswers);
    }
  });
});

document.querySelector('.modal-overlay').addEventListener('click', () => {
  document.querySelector('.modal-overlay').classList.remove('show');
  document.querySelector('.developer-only').classList.remove('show');
});

function startTest() {
  // Hide all containers first
  document.getElementById('test-container').classList.remove('hide');
  dynamicContainer.classList.add('hide');
  analysisContent.classList.add('hide');
  resultContent.classList.add('hide');
  
  // Initialize test
  startButton.classList.add('hide');
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 2700;
  userAnswers = new Array(questions.length).fill(null);
  
  // Show progress info and question container
  document.getElementById('progress-info').classList.add('show');
  questionContainerElement.classList.add('show');
  questionContainerElement.style.opacity = '0';
  setTimeout(() => {
    questionContainerElement.style.opacity = '1';
    questionElement.classList.add('show');
    const emulatedAnswers = getEmulatedAnswers();
    if (emulatedAnswers) {
      autoAnswerQuestions(emulatedAnswers);
    } else {
      showQuestion(shuffledQuestions[currentQuestionIndex]);
      startTimer();
    }
  }, 100);
}

function setStatusClass(element, correct) {
  element.classList.remove('correct', 'wrong');
  element.classList.add(correct ? 'correct' : 'wrong');
}

function selectAnswer(e) {
  const selectedButton = e.target.closest('.btn');
  if (!selectedButton) return;
  
  const selectedIndex = parseInt(selectedButton.dataset.index);
  const correctAnswerIndex = shuffledQuestions[currentQuestionIndex].correctAnswerIndex;
  const isCorrect = selectedIndex === correctAnswerIndex;

  // Only proceed if the answer hasn't been selected before
  if (userAnswers[currentQuestionIndex] === null) {
    userAnswers[currentQuestionIndex] = selectedIndex;

    if (isCorrect) {
      score++;
    }

    Array.from(answerButtonsElement.children).forEach(button => {
      const buttonIndex = parseInt(button.dataset.index);
      const icon = button.querySelector('.material-icons');
      
      if (buttonIndex === selectedIndex) {
        icon.textContent = isCorrect ? 'check_circle' : 'cancel';
      } else if (buttonIndex === correctAnswerIndex) {
        icon.textContent = 'check_circle';
      }
      
      button.disabled = true;
      setStatusClass(button, buttonIndex === correctAnswerIndex);
    });

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      nextButton.classList.remove('hide');
    } else {
      setTimeout(endTest, 1000);
    }
  }
}

function setNextQuestion() {
  if (currentQuestionIndex < shuffledQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion(shuffledQuestions[currentQuestionIndex], 'next');
  }
}

function setPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(shuffledQuestions[currentQuestionIndex], 'prev');
  }
}

// Add floating animation pause on hover
questionElement.addEventListener('mouseenter', () => {
  questionElement.style.animationPlayState = 'paused';
});

questionElement.addEventListener('mouseleave', () => {
  questionElement.style.animationPlayState = 'running';
});

// Event Listeners
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
startButton.addEventListener('click', startTest);
nextButton.addEventListener('click', setNextQuestion);
prevButton.addEventListener('click', setPreviousQuestion);
document.getElementById('restart-button').addEventListener('click', restartTest);

// Initialize theme
initializeTheme();

function startTimer() {
  timerElement.innerText = formatTime(timeLeft);
  if (timeLeft <= 0) {
    endTest();
    return;
  }
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.innerText = formatTime(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endTest();
    }
  }, 1000);
}

function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function hideTestElements() {
  const testElements = [
    document.getElementById('test-container'),
    document.getElementById('progress-info'),
    questionContainerElement,
    answerButtonsElement,
    document.querySelector('.navigation-controls'),
    document.querySelector('.progress-bar'),
    questionElement
  ];
  
  // Remove show class from progress elements
  document.getElementById('progress-info').classList.remove('show');
  questionContainerElement.classList.remove('show');
  
  testElements.forEach(el => {
    if (el) {
      el.style.opacity = '0';
      el.classList.add('hide');
      setTimeout(() => {
        el.style.display = 'none';
        el.style.opacity = '';
      }, 300);
    }
  });
}

function showContent(contentElement) {
  // First hide all test elements
  hideTestElements();

  // Hide all dynamic content first
  [analysisContent, resultContent].forEach(el => {
    if (!el.classList.contains('hide')) {
      el.classList.add('hide');
      el.style.display = 'none';
    }
  });
  
  // Show the dynamic container immediately
  dynamicContainer.style.display = 'block';
  dynamicContainer.classList.remove('hide');
  
  // Show the requested content
  contentElement.style.display = 'block';
  contentElement.classList.remove('hide');
  
  // Force a reflow to ensure the transition works
  contentElement.offsetHeight;
  contentElement.style.opacity = '1';
}

function endTest() {
  clearInterval(timerInterval);
  hideTestElements();
  showContent(analysisContent);
  processResults();
}

function processResults() {
  const iq = calculateIQ(score);
  const mode = document.querySelector('input[name="iq-emulation"]:checked').value;
  const emulationNote = mode !== 'normal' ? 
    //`<p class="emulation-note">(Emulated ${mode} IQ test results)</p>` : '';
    `<p class="emulation-note">(-)</p>` : '';

  //iqScoreElement.innerText = `Your Score: ${score} out of ${questions.length}`;
  iqScoreElement.innerText = `Your Benchmark Performance Score is ${iq}`;
  iqScoreElement.innerHTML += emulationNote;

  const userResponses = shuffledQuestions.map((question, index) => ({
    question: question.question,
    answer: userAnswers[index] !== null ? question.answers[userAnswers[index]].text : "Not answered",
    correct: userAnswers[index] === question.correctAnswerIndex
  }));

  fetch('http://127.0.0.1:5001/process_iq_test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      score: score,
      user_responses: userResponses
    })
  })
  .then(response => response.json())
  .then(data => {
    showContent(resultContent);
    document.body.classList.add('show-result');
    iqLevelElement.innerHTML = `
      <h3>Recommendation Position: ${data.iq_level_description}</h3>
      <div class="gemini-feedback">
        ${data.gemini_feedback.replace(/\n/g, '<br>')}
      </div>
    `;
  })
  .catch(error => {
    showContent(resultContent);
    document.body.classList.add('show-result');
    console.error('Error sending score to server:', error);
    iqLevelElement.innerHTML = `
      <h3>Error</h3>
      <div class="gemini-feedback error">
        Unable to generate analysis. Please try again later.
      </div>
    `;
  });
}

function calculateIQ(score) {
  const percentageCorrect = (score / questions.length) * 100;
  let iqEstimate = 100;

  if (percentageCorrect >= 90) {
    iqEstimate = 140 + (percentageCorrect - 90) * 2;
  } else if (percentageCorrect >= 80) {
    iqEstimate = 130 + (percentageCorrect - 80);
  } else if (percentageCorrect >= 70) {
    iqEstimate = 120 + (percentageCorrect - 70);
  } else if (percentageCorrect >= 50) {
    iqEstimate = 100 + (percentageCorrect - 50) * 0.8;
  } else if (percentageCorrect >= 30) {
    iqEstimate = 90 - (50 - percentageCorrect) * 0.5;
  } else {
    iqEstimate = 70 - (30 - percentageCorrect) * 0.3;
  }

  return Math.round(iqEstimate);
}

function getEmulatedAnswers() {
  const mode = document.querySelector('input[name="iq-emulation"]:checked').value;
  let correctProbability;
  
  switch(mode) {
    case 'low':
      correctProbability = 0.3;
      break;
    case 'medium':
      correctProbability = 0.5;
      break;
    case 'high':
      correctProbability = 0.85;
      break;
    default:
      return null;
  }
  
  return shuffledQuestions.map(question => {
    const random = Math.random();
    if (random <= correctProbability) {
      return question.correctAnswerIndex;
    } else {
      const wrongAnswers = question.answers
        .map((_, index) => index)
        .filter(index => index !== question.correctAnswerIndex);
      return wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
    }
  });
}

function autoAnswerQuestions(emulatedAnswers) {
  document.getElementById('timer').style.display = 'none';
  
  shuffledQuestions.forEach((question, index) => {
    const selectedAnswerIndex = emulatedAnswers[index];
    userAnswers[index] = selectedAnswerIndex;
    if (selectedAnswerIndex === question.correctAnswerIndex) {
      score++;
    }
  });
  
  endTest();
}

function resetState() {
  // Reset all state variables
  shuffledQuestions = null;
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 2700;
  userAnswers = [];
  
  // Clear any existing intervals
  if (timerInterval) {
    clearInterval(timerInterval);
  }
}

function restartTest() {
  dynamicContainer.classList.add('hide');
  setTimeout(() => {
    analysisContent.classList.add('hide');
    resultContent.classList.add('hide');
    document.getElementById('test-container').classList.remove('hide');
  }, 300);
  document.body.classList.remove('show-result');
  startButton.classList.remove('hide');
  questionElement.classList.remove('show');
  document.getElementById('progress-info').classList.remove('show');
  questionContainerElement.classList.remove('show');
  resetState();
  timerElement.innerText = formatTime(2700);
}
