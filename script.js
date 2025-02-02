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
const loadingIndicator = document.createElement('div');

// State Variables
let shuffledQuestionIndices; // Array of shuffled indices
let currentQuestionIndex;
let score;
let timeLeft;
let timerInterval;
let userAnswers; // Array to store user's answers
let originalQuestions = [];
let currentGeneratedQuestion;

// --- Helper Functions ---
function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / shuffledQuestionIndices.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function setStatusClass(element, correct) {
  element.classList.remove('correct', 'wrong');
  element.classList.add(correct ? 'correct' : 'wrong');
}

// --- Theme Handling ---
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// --- Modal handling ---
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

// --- Question Display and Interaction ---
function showQuestion(question, direction = 'next') {
  const currentQuestionNum = document.getElementById('current-question');
  const totalQuestions = document.getElementById('total-questions');

    questionElement.classList.add('slide-out');
    answerButtonsElement.style.opacity = '0';

  setTimeout(() => {
      // Update question counter
      currentQuestionNum.textContent = currentQuestionIndex + 1;
      totalQuestions.textContent = shuffledQuestionIndices.length;

      if (!question || !question.question || !question.answers) {
          console.error("Invalid question format:", question);
          questionElement.innerText = "Failed to load question. Please try again.";
          answerButtonsElement.innerHTML = ''; // Clear any existing buttons
          return;
      }

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
          currentQuestionIndex === shuffledQuestionIndices.length - 1 ||
          !userAnswers[currentQuestionIndex]
      );
    
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

async function fetchNewQuestion() {
  try {
    const response = await fetch('http://127.0.0.1:5001/get_question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_index: shuffledQuestionIndices[currentQuestionIndex] }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    const jsonResponse = await response.json();
    console.log("Received JSON:", jsonResponse);
    if (jsonResponse.error) {
        throw new Error(jsonResponse.error);
    }
        
    return jsonResponse.question;

  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
}



function selectAnswer(e) {
    const selectedButton = e.target.closest('.btn');
    if (!selectedButton) return;

    const selectedIndex = parseInt(selectedButton.dataset.index);
    const correctAnswerIndex = currentGeneratedQuestion.correctAnswerIndex;
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

        if (currentQuestionIndex < shuffledQuestionIndices.length - 1) {
            nextButton.classList.remove('hide');
        } else {
            setTimeout(endTest, 1000);
        }
    }
}

loadingIndicator.classList.add('loading-indicator');
loadingIndicator.innerHTML = '<div class="loader"></div><p>Loading new question, please wait...</p>';
questionContainerElement.appendChild(loadingIndicator);

async function setNextQuestion() {
  if (currentQuestionIndex < shuffledQuestionIndices.length - 1) {
    currentQuestionIndex++;
    
    let retries = 0;
    const maxRetries = Infinity; // Changed to Infinity
      
    const fetchWithRetry = async () => {
        loadingIndicator.style.display = 'flex'; // Show loader
      try {
        currentGeneratedQuestion = await fetchNewQuestion();
          loadingIndicator.style.display = 'none';
        showQuestion(currentGeneratedQuestion);
      } catch (error) {
          loadingIndicator.style.display = 'none';
          console.error("Failed to process the question:", error);
          retries++;
            // Delay increases exponentially with each retry
          const delay = 1000 * Math.pow(2, retries); 
          if (retries <= maxRetries) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(); // Retry fetch
        } else {
            alert("Failed to process question after multiple attempts, please reload.");
        }
    }
  };
  await fetchWithRetry();
  }
}

function setPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentGeneratedQuestion, 'prev');
    }
}

// Add floating animation pause on hover
questionElement.addEventListener('mouseenter', () => {
  questionElement.style.animationPlayState = 'paused';
});

questionElement.addEventListener('mouseleave', () => {
  questionElement.style.animationPlayState = 'running';
});

// --- Timer ---
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

// --- Test Management ---
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
  hideTestElements();

  [analysisContent, resultContent].forEach(el => {
    if (!el.classList.contains('hide')) {
      el.classList.add('hide');
      el.style.display = 'none';
    }
  });

  dynamicContainer.style.display = 'block';
  dynamicContainer.classList.remove('hide');

  contentElement.style.display = 'block';
  contentElement.classList.remove('hide');

    contentElement.offsetHeight;
    contentElement.style.opacity = '1';
}

function autoAnswerQuestions(emulatedAnswers) {
  document.getElementById('timer').style.display = 'none';

    shuffledQuestionIndices.forEach((index, arrayIndex) => {
      const selectedAnswerIndex = emulatedAnswers[arrayIndex];
        userAnswers[arrayIndex] = selectedAnswerIndex;
      if (selectedAnswerIndex === currentGeneratedQuestion.correctAnswerIndex) {
            score++;
      }
    });

  endTest();
}

async function startTest() {
  // Initialize UI
    document.getElementById('test-container').classList.remove('hide');
  dynamicContainer.classList.add('hide');
    analysisContent.classList.add('hide');
  resultContent.classList.add('hide');
  startButton.classList.add('hide');
    
    shuffledQuestionIndices = Array.from({ length: 47 }, (_, i) => i).sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 2700;
    userAnswers = new Array(shuffledQuestionIndices.length).fill(null);

    document.getElementById('progress-info').classList.add('show');
    questionContainerElement.classList.add('show');
    questionContainerElement.style.opacity = '0';
    setTimeout(async () => {
        questionContainerElement.style.opacity = '1';
    questionElement.classList.add('show');

        const emulatedAnswers = getEmulatedAnswers();
        if (emulatedAnswers) {
            autoAnswerQuestions(emulatedAnswers);
      } else {
        
         let retries = 0;
        const maxRetries = Infinity; // Changed to Infinity
      
        const fetchWithRetry = async () => {
           loadingIndicator.style.display = 'flex'; // Show loader
            try {
              currentGeneratedQuestion = await fetchNewQuestion();
              loadingIndicator.style.display = 'none';
              showQuestion(currentGeneratedQuestion);
                startTimer();
            } catch (error) {
                loadingIndicator.style.display = 'none';
              console.error("Failed to process the question:", error);
              retries++;
                // Delay increases exponentially with each retry
              const delay = 1000 * Math.pow(2, retries);
              if (retries <= maxRetries) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchWithRetry(); // Retry fetch
              } else {
                  alert("Failed to process question after multiple attempts, please reload.");
              }
          }
        };
        await fetchWithRetry();
      }
    }, 100);
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
    `<p class="emulation-note">(-)</p>` : '';

iqScoreElement.innerText = `Your Estimated IQ is ${iq}`;
  iqScoreElement.innerHTML += emulationNote;

 const userResponses = shuffledQuestionIndices.map((index,arrayIndex) => ({
       question: currentGeneratedQuestion.question,
       answer: userAnswers[arrayIndex] !== null ? currentGeneratedQuestion.answers[userAnswers[arrayIndex]].text : "Not answered",
       correct: userAnswers[arrayIndex] === currentGeneratedQuestion.correctAnswerIndex,
         category: currentGeneratedQuestion.category
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
  const percentageCorrect = (score / shuffledQuestionIndices.length) * 100;
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
      if (!currentGeneratedQuestion) return null;
  
      return shuffledQuestionIndices.map(() => {
        const random = Math.random();
        if (random <= correctProbability) {
          return currentGeneratedQuestion.correctAnswerIndex;
        } else {
          const wrongAnswers = currentGeneratedQuestion.answers
            .map((_, index) => index)
            .filter(index => index !== currentGeneratedQuestion.correctAnswerIndex);
            return wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        }
      });
  }
  
  function resetState() {
    shuffledQuestionIndices = null;
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 2700;
    userAnswers = [];
      originalQuestions = [];
    currentGeneratedQuestion = null;
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  }
  
  function restartTest() {
    location.reload();
  }
  
  // --- Event Listeners ---
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  startButton.addEventListener('click', startTest);
  nextButton.addEventListener('click', setNextQuestion);
  prevButton.addEventListener('click', setPreviousQuestion);
  document.getElementById('restart-button').addEventListener('click', restartTest);
  
  // --- Initialization ---
  initializeTheme();