import { currentConfig } from './config.js';

interface Answer {
    text: string;
}

interface Question {
    question: string;
    answers: Answer[];
    correctAnswerIndex: number;
    category: string;
}

// DOM Elements
const startButton: HTMLElement = document.getElementById('start-button')!;
const nextButton: HTMLElement = document.getElementById('next-button')!;
const prevButton: HTMLElement = document.getElementById('prev-button')!;
const questionContainerElement: HTMLElement = document.getElementById('question-container')!;
const questionElement: HTMLElement = document.getElementById('question')!;
const answerButtonsElement: HTMLElement = document.getElementById('answer-buttons')!;
const dynamicContainer: HTMLElement = document.getElementById('dynamic-container')!;
const analysisContent: HTMLElement = document.getElementById('analysis-content')!;
const resultContent: HTMLElement = document.getElementById('result-content')!;
const iqScoreElement: HTMLElement = document.getElementById('iq-score')!;
const iqLevelElement: HTMLElement = document.getElementById('iq-level')!;
const timerElement: HTMLElement = document.getElementById('time')!;
const progressBar: HTMLElement = document.querySelector('.progress') as HTMLElement;
const loadingIndicator: HTMLDivElement = document.createElement('div');

// State Variables
let shuffledQuestionIndices: number[];
let currentQuestionIndex: number;
let score: { [key: string]: number } = {}; // Changed to object for tracking per category
let timeLeft: number;
let timerInterval: number;
let userAnswers: (number | null)[];
let originalQuestions: Question[] = [];
let currentGeneratedQuestion: Question = { question: "", answers: [], correctAnswerIndex: 0, category: "0" };

// Updated questionCategories to match app.py
const questionCategories: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
// Initialize score for each category:
questionCategories.forEach((category: string) => {
    score[category] = 0;
});

// --- Helper Functions ---
function updateProgressBar(): void {
    const progress: number = ((currentQuestionIndex + 1) / shuffledQuestionIndices.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function formatTime(timeInSeconds: number): string {
    const minutes: number = Math.floor(timeInSeconds / 60);
    const seconds: number = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function setStatusClass(element: HTMLElement, correct: boolean): void {
    element.classList.remove('correct', 'wrong');
    element.classList.add(correct ? 'correct' : 'wrong');
}

// --- Theme Handling ---
function initializeTheme(): void {
    const savedTheme: string | null = localStorage.getItem('theme');
    const prefersDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme: string = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme(): void {
    const currentTheme: string | null = document.documentElement.getAttribute('data-theme');
    const newTheme: string = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// --- Modal handling ---
let secretCode: string = '';
document.addEventListener('keydown', (e: KeyboardEvent): void => {
    secretCode += e.key;
    if (secretCode.length > 11) {
        secretCode = secretCode.slice(-11);
    }
    if (secretCode === 'CJPHONEHOME') {
        (document.querySelector('.modal-overlay') as HTMLElement).classList.add('show');
        (document.querySelector('.developer-only') as HTMLElement).classList.add('show');
        secretCode = '';
    }
});

document.querySelectorAll('input[name="iq-emulation"]').forEach((radio: Element): void => {
    radio.addEventListener('change', (): void => {
        (document.querySelector('.modal-overlay') as HTMLElement).classList.remove('show');
        (document.querySelector('.developer-only') as HTMLElement).classList.remove('show');
        const emulatedAnswers: number[] | null = getEmulatedAnswers();
        if (emulatedAnswers) {
            autoAnswerQuestions(emulatedAnswers);
        }
    });
});

(document.querySelector('.modal-overlay') as HTMLElement).addEventListener('click', (): void => {
    (document.querySelector('.modal-overlay') as HTMLElement).classList.remove('show');
    (document.querySelector('.developer-only') as HTMLElement).classList.remove('show');
});

// --- Question Display and Interaction ---
function showQuestion(question: Question, direction: string = 'next'): void {
    const currentQuestionNum: HTMLElement = document.getElementById('current-question')!;
    const totalQuestions: HTMLElement = document.getElementById('total-questions')!;

    questionElement.classList.add('slide-out');
    answerButtonsElement.style.opacity = '0';

    setTimeout((): void => {
        // Update question counter
        currentQuestionNum.textContent = String(currentQuestionIndex + 1);
        totalQuestions.textContent = String(shuffledQuestionIndices.length);

        if (!question || !question.question || !question.answers) {
            console.error("Invalid question format:", question);
            questionElement.innerText = "Failed to load question. Please try again.";
            answerButtonsElement.innerHTML = ''; // Clear any existing buttons
            return;
        }

        questionElement.innerText = question.question;
        answerButtonsElement.innerHTML = '';

        question.answers.forEach((answer: Answer, index: number): void => {
            const button: HTMLButtonElement = document.createElement('button');
            button.innerHTML = `
          <span class="material-icons">radio_button_unchecked</span>
            ${answer.text}
        `;
            button.classList.add('btn');
            button.dataset.index = String(index);
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
            const buttons: HTMLCollection = answerButtonsElement.children;
            const selectedIndex: number = userAnswers[currentQuestionIndex] as number;
            const correctIndex: number = question.correctAnswerIndex;

            Array.from(buttons).forEach((button: Element, index: number): void => {
                const btn = button as HTMLButtonElement;
                if (index === selectedIndex) {
                    (btn.querySelector('.material-icons') as HTMLElement).textContent =
                        index === correctIndex ? 'check_circle' : 'cancel';
                }
                btn.disabled = true;
            });
        }
    }, 300);
}

const fetchNewQuestion = async (): Promise<Question> => {
    try {
        const response: Response = await fetch(`${currentConfig.baseUrl}/get_question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ question_index: shuffledQuestionIndices[currentQuestionIndex] }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `HTTP error! status: ${response.status}`);
        }
        let jsonResponse;
        try {
            jsonResponse = await response.json();
            console.log("Received JSON:", jsonResponse);
        } catch (e) {
            const textResponse = await response.text();
            console.error("Failed to parse JSON, raw response:", textResponse);
            throw e;
        }
        if (jsonResponse.error) {
            throw new Error(jsonResponse.error);
        }

        return jsonResponse.question;

    } catch (error) {
        console.error("Error fetching question:", error);
        throw error;
    }
};

function selectAnswer(e: Event): void {
  const target = e.target as HTMLElement;
  const selectedButton = target.closest('.btn') as HTMLButtonElement | null;
  if (!selectedButton) return;

  const selectedIndex: number = parseInt(selectedButton.dataset.index!);
  
   // ADD THE CHECK HERE
  if (!currentGeneratedQuestion) {
          console.error("currentGeneratedQuestion is not yet defined!");
          return;
  }

  const correctAnswerIndex: number = currentGeneratedQuestion.correctAnswerIndex;
  const isCorrect: boolean = selectedIndex === correctAnswerIndex;

  // Only proceed if the answer hasn't been selected before
  if (userAnswers[currentQuestionIndex] === null) {
      userAnswers[currentQuestionIndex] = selectedIndex;

      if (isCorrect) {
          score[currentGeneratedQuestion.category]++;
      }

      Array.from(answerButtonsElement.children).forEach((buttonElem: Element): void => {
          const button = buttonElem as HTMLButtonElement;
          const buttonIndex: number = parseInt(button.dataset.index!);
          const icon: HTMLElement = button.querySelector('.material-icons') as HTMLElement;

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

async function setNextQuestion(): Promise<void> {
    if (currentQuestionIndex < shuffledQuestionIndices.length - 1) {
        currentQuestionIndex++;

        let retries: number = 0;
        const maxRetries: number = Infinity;

        const fetchWithRetry = async (): Promise<void> => {
            loadingIndicator.style.display = 'flex';
            try {
                currentGeneratedQuestion = await fetchNewQuestion();
                loadingIndicator.style.display = 'none';
                showQuestion(currentGeneratedQuestion);
            } catch (error) {
                loadingIndicator.style.display = 'none';
                console.error("Failed to process the question:", error);
                retries++;
                const delay: number = 1000 * Math.pow(2, retries);
                if (retries <= maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return fetchWithRetry();
                } else {
                    alert("Failed to process question after multiple attempts, please reload.");
                }
            }
        };
        await fetchWithRetry();
    }
}

function setPreviousQuestion(): void {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentGeneratedQuestion, 'prev');
    }
}

// Add floating animation pause on hover
questionElement.addEventListener('mouseenter', (): void => {
    questionElement.style.animationPlayState = 'paused';
});

questionElement.addEventListener('mouseleave', (): void => {
    questionElement.style.animationPlayState = 'running';
});

// --- Timer ---
function startTimer(): void {
    timerElement.innerText = formatTime(timeLeft);
    if (timeLeft <= 0) {
        endTest();
        return;
    }
    timerInterval = window.setInterval((): void => {
        timeLeft--;
        timerElement.innerText = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endTest();
        }
    }, 1000);
}

// --- Test Management ---
function hideTestElements(): void {
    const testElements: (HTMLElement | null)[] = [
        document.getElementById('test-container'),
        document.getElementById('progress-info'),
        questionContainerElement,
        answerButtonsElement,
        document.querySelector('.navigation-controls'),
        document.querySelector('.progress-bar'),
        questionElement
    ];

    document.getElementById('progress-info')!.classList.remove('show');
    questionContainerElement.classList.remove('show');

    testElements.forEach((el: HTMLElement | null): void => {
        if (el) {
            el.style.opacity = '0';
            el.classList.add('hide');
            setTimeout((): void => {
                el.style.display = 'none';
                el.style.opacity = '';
            }, 300);
        }
    });
}

function showContent(contentElement: HTMLElement): void {
    hideTestElements();

    [analysisContent, resultContent].forEach((el: HTMLElement): void => {
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


function autoAnswerQuestions(emulatedAnswers: number[]): void {
    (document.getElementById('timer') as HTMLElement).style.display = 'none';

    shuffledQuestionIndices.forEach((index: number, arrayIndex: number): void => {
        const selectedAnswerIndex: number = emulatedAnswers[arrayIndex];
        userAnswers[arrayIndex] = selectedAnswerIndex;
        if (selectedAnswerIndex === currentGeneratedQuestion.correctAnswerIndex) {
             score[currentGeneratedQuestion.category]++;
        }
    });

    endTest();
}

async function startTest(): Promise<void> {
    // Initialize UI
    document.getElementById('test-container')!.classList.remove('hide');
    dynamicContainer.classList.add('hide');
    analysisContent.classList.add('hide');
    resultContent.classList.add('hide');
    startButton.classList.add('hide');

    shuffledQuestionIndices = Array.from({ length: 47 }, (_, i: number) => i).sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    questionCategories.forEach((category: string): void => {
      score[category] = 0;
    });
    timeLeft = 2700;
    userAnswers = new Array(shuffledQuestionIndices.length).fill(null);

    document.getElementById('progress-info')!.classList.add('show');
    questionContainerElement.classList.add('show');
    questionContainerElement.style.opacity = '0';
    setTimeout(async (): Promise<void> => {
        questionContainerElement.style.opacity = '1';
        questionElement.classList.add('show');

        const emulatedAnswers: number[] | null = getEmulatedAnswers();
        if (emulatedAnswers) {
            autoAnswerQuestions(emulatedAnswers);
        } else {
            let retries: number = 0;
            const maxRetries: number = Infinity;

            const fetchWithRetry = async (): Promise<void> => {
                loadingIndicator.style.display = 'flex';
                try {
                    currentGeneratedQuestion = await fetchNewQuestion();
                    loadingIndicator.style.display = 'none';
                    showQuestion(currentGeneratedQuestion);
                    startTimer();
                } catch (error) {
                    loadingIndicator.style.display = 'none';
                    console.error("Failed to process the question:", error);
                    retries++;
                    const delay: number = 1000 * Math.pow(2, retries);
                    if (retries <= maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return fetchWithRetry();
                    } else {
                        alert("Failed to process question after multiple attempts, please reload.");
                    }
                }
            };
            await fetchWithRetry();
        }
    }, 100);
}
function endTest(): void {
    clearInterval(timerInterval);
    hideTestElements();
    showContent(analysisContent);
    processResults();
}

function processResults(): void {
    const overallScore: number = Object.values(score).reduce((sum: number, categoryScore: number) => sum + categoryScore, 0);
    const iq: number = calculateIQ(overallScore);
    const mode: string = (document.querySelector('input[name="iq-emulation"]:checked') as HTMLInputElement).value;
    const emulationNote: string = mode !== 'normal' ?
        `<p class="emulation-note">(-)</p>` : '';

    iqScoreElement.innerText = `Your Estimated IQ is ${iq}`;
    iqScoreElement.innerHTML += emulationNote;

    const userResponses = shuffledQuestionIndices.map((index: number, arrayIndex: number) => {
        let answerText = "Not answered";
        if (currentGeneratedQuestion.answers) { // Check if currentGeneratedQuestion.answers exists
          if (userAnswers[arrayIndex] !== null) {
              answerText = currentGeneratedQuestion.answers[userAnswers[arrayIndex] as number]?.text || "Answer not available";
          }
        }
        return {
            question: currentGeneratedQuestion.question,
            answer: answerText,
            correct: userAnswers[arrayIndex] === currentGeneratedQuestion.correctAnswerIndex,
            category: currentGeneratedQuestion.category
        };
    });
  
    const categoryScores: { [key: string]: { score: number; responses: typeof userResponses } } = {};
    questionCategories.forEach((category: string): void => {
         categoryScores[category] = {
           score: score[category],
           responses: userResponses.filter(response => response.category === category)
         };
    });

    fetch(`${currentConfig.baseUrl}/process_iq_test`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            overall_score: overallScore,
            category_scores: categoryScores,
            user_responses: userResponses
        })
    })
        .then(response => response.json())
        .then((data: any): void => {
            showContent(resultContent);
            document.body.classList.add('show-result');
            iqLevelElement.innerHTML = `
          <h3>Recommendation Position: ${data.iq_level_description}</h3>
          <div class="gemini-feedback">
          ${data.gemini_feedback.replace(/\n/g, '<br>')}
          </div>
      `;
        })
        .catch((error: any): void => {
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

function calculateIQ(overallScore: number): number {
    const percentageCorrect: number = (overallScore / shuffledQuestionIndices.length) * 100;
    let iqEstimate: number = 100;

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

function getEmulatedAnswers(): number[] | null {
    const mode: string = (document.querySelector('input[name="iq-emulation"]:checked') as HTMLInputElement).value;
    let correctProbability: number;

    switch (mode) {
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
    if (!shuffledQuestionIndices) return null;

    return shuffledQuestionIndices.map((): number => {
        const random: number = Math.random();
        if (random <= correctProbability) {
            return currentGeneratedQuestion.correctAnswerIndex;
        } else {
            const wrongAnswers: number[] = currentGeneratedQuestion.answers
                .map((_, index: number) => index)
                .filter((index: number) => index !== currentGeneratedQuestion.correctAnswerIndex);
            return wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        }
    });
}

function resetState(): void {
  shuffledQuestionIndices = null as any;
  currentQuestionIndex = 0;
  score = {};
  questionCategories.forEach((category: string): void => {
      score[category] = 0;
  });
  timeLeft = 2700;
  userAnswers = [];
  originalQuestions = [];
  currentGeneratedQuestion = { question: "", answers: [], correctAnswerIndex: 0, category: "0" };  // Initialize to avoid undefined access
  if (timerInterval) {
      clearInterval(timerInterval);
  }
}

function restartTest(): void {
    location.reload();
}

// --- Event Listeners ---
(document.getElementById('theme-toggle') as HTMLElement).addEventListener('click', toggleTheme);
startButton.addEventListener('click', startTest);
nextButton.addEventListener('click', setNextQuestion);
prevButton.addEventListener('click', setPreviousQuestion);
(document.getElementById('restart-button') as HTMLElement).addEventListener('click', restartTest);

// --- Initialization ---
initializeTheme();
export {};
