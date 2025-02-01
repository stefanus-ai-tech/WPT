const startButton = document.getElementById('start-button');
const nextButton = document.getElementById('next-button');
const restartButton = document.getElementById('restart-button');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const timerElement = document.getElementById('time');
const resultContainerElement = document.getElementById('result-container');
const iqScoreElement = document.getElementById('iq-score');
const iqLevelElement = document.getElementById('iq-level');

let shuffledQuestions, currentQuestionIndex;
let score = 0;
let timeLeft = 2700; // 45 minutes in seconds
let timerInterval;

// Array of question objects (excluding geometric questions)
const questions = [
    {
      question: '1. RASA SAKIT adalah lawan dari 1.racun 2. kesedihan 3. kepedihan 4. nyaman 5. hukuman',
      answers: [
        { text: 'racun', correct: false },
        { text: 'kesedihan', correct: false },
        { text: 'kepedihan', correct: false },
        { text: 'nyaman', correct: true },
        { text: 'hukuman', correct: false }
      ],
      correctAnswerIndex: 3
    },
    {
      question: '2. Satu angka dalam urutan angka ini dihilangkan. Angka berapa itu? 100 97 94 ? 88 85 82',
      answers: [
        { text: '91', correct: true },
        { text: '90', correct: false },
        { text: '92', correct: false },
        { text: '89', correct: false },
        { text: '93', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '3. DERMAWAN adalah lawan kata dari 1. ningrat 2. populer 3. ikut perasaan 4. suka berteman 5. pelit',
      answers: [
        { text: 'ningrat', correct: false },
        { text: 'populer', correct: false },
        { text: 'ikut perasaan', correct: false },
        { text: 'suka berteman', correct: false },
        { text: 'pelit', correct: true }
      ],
      correctAnswerIndex: 4
    },
    {
      question: '4. KEMEWAHAN adalah lawan kata dari 1. berlimpah 2. ruah 3. kemiskinan 4. devosi 5. kegagalan',
      answers: [
        { text: 'berlimpah', correct: false },
        { text: 'ruah', correct: false },
        { text: 'kemiskinan', correct: true },
        { text: 'devosi', correct: false },
        { text: 'kegagalan', correct: false }
      ],
      correctAnswerIndex: 2
    },
    {
      question: '5. Dalam kelompok kata berikut, manakah kata yang berbeda dari kata yang lain? 1. mobil 2. sepeda 3. mobil van 4. bus 5. truk',
      answers: [
        { text: 'mobil', correct: false },
        { text: 'sepeda', correct: true },
        { text: 'mobil van', correct: false },
        { text: 'bus', correct: false },
        { text: 'truk', correct: false }
      ],
      correctAnswerIndex: 1
    },
    {
      question: '6. Berlambat-lambat adalah lawan kata dari 1. mempertahankan 2. tergesa 3. menuntut 4. tetap 5. pelan',
      answers: [
        { text: 'mempertahankan', correct: false },
        { text: 'tergesa', correct: true },
        { text: 'menuntut', correct: false },
        { text: 'tetap', correct: false },
        { text: 'pelan', correct: false }
      ],
      correctAnswerIndex: 1
    },
    {
      question: '7. Anggaplah dua pernyataan pertama adalah benar. Pernyataan terakhir: 1. benar 2. salah 3. tidak tahu. Biola semelodi dengan piano. Piano semelodi dengan harpa. Biola semelodi dengan harpa',
      answers: [
        { text: 'benar', correct: true },
        { text: 'salah', correct: false },
        { text: 'tidak tahu', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '8. Misalkan Anda menyusun kata berikut sehingga menjadi kalimat lengkap. Jika itu kalimat benar tulislah (B), jika Salah tulislah (S). Bensin kayu adalah batu bara dan untuk digunakan',
      answers: [
        { text: 'B', correct: false },
        { text: 'S', correct: true }
      ],
      correctAnswerIndex: 1
    },
    {
      question: '9. FURTHER FARTHER Apakah kata ini: 1. memiliki arti yang sama 2. memiliki arti berlawanan 3. tidak memiliki arti sama atau berlainan',
      answers: [
        { text: 'memiliki arti yang sama', correct: true },
        { text: 'memiliki arti berlawanan', correct: false },
        { text: 'tidak memiliki arti sama atau berlainan', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '10. Mobil seseorang menempuh 16 mil dalam 30 menit. Berapa mil per jam, mobil itu melaju?',
      answers: [
        { text: '32', correct: true },
        { text: '30', correct: false },
        { text: '28', correct: false },
        { text: '34', correct: false },
        { text: '36', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '11. Apakah makna dari kalimat berikut ini: 1. sama 2. berlawanan 3. tidak sama atau berlawanan. "Teman yang setia adalah benteng yang kokoh. Mereka tidak pernah merasakan siapa yang selalu berkorban."',
      answers: [
        { text: 'sama', correct: false },
        { text: 'berlawanan', correct: false },
        { text: 'tidak sama atau berlawanan', correct: true }
      ],
      correctAnswerIndex: 2
    },
    {
      question: '12. Seorang dealer membeli sepeda seharga 2.000 dolar. Ia menjual sepeda itu seharga 2.400 dolar, dan mendapat untung 50 dolar dari setiap sepeda. Berapa banyaknya sepeda yang ia beli?',
      answers: [
        { text: '8', correct: true },
        { text: '10', correct: false },
        { text: '12', correct: false },
        { text: '6', correct: false },
        { text: '5', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '13. Berapa dari enam pasangan ini yang merupakan duplikasi yang sama?',
      answers: [
        { text: '1', correct: false },
        { text: '2', correct: false },
        { text: '3', correct: true },
        { text: '4', correct: false },
        { text: '5', correct: false }
      ],
      correctAnswerIndex: 2
    },
    {
      question: '14. Seorang anak berumur 6 tahun, saudarinya dua kali lebih tua darinya. Saat anak itu berumur 10 tahun, berapa umur saudarinya?',
      answers: [
        { text: '14', correct: false },
        { text: '15', correct: false },
        { text: '16', correct: true },
        { text: '17', correct: false },
        { text: '18', correct: false }
      ],
      correctAnswerIndex: 2
    },
    {
      question: '15. Dalam rangkaian kata berikut ini, manakah kata yang berbeda dengan yang lainnya? 1. armada 2. band 3. anak-anak 4. satu anak lelaki 5. kerumunan',
      answers: [
        { text: 'armada', correct: false },
        { text: 'band', correct: false },
        { text: 'anak-anak', correct: false },
        { text: 'satu anak lelaki', correct: true },
        { text: 'kerumunan', correct: false }
      ],
      correctAnswerIndex: 3
    },
    {
      question: '16. Susunlah kata berikut menjadi pernyataan yang benar. Lalu tulislah huruf terakhir dari kata terakhir. "adalah bumi bulat ini"',
      answers: [
        { text: 't', correct: true },
        { text: 'i', correct: false },
        { text: 's', correct: false },
        { text: 'n', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '17. LIBURAN KERJA Apakah kata-kata ini: 1. memiliki arti yang sama 2. memiliki arti yang berlawanan 3. tidak memiliki arti yang sama atau berlawanan?',
      answers: [
        { text: 'memiliki arti yang sama', correct: false },
        { text: 'memiliki arti yang berlawanan', correct: true },
        { text: 'tidak memiliki arti yang sama atau berlawanan', correct: false }
      ],
      correctAnswerIndex: 1
    },
    {
      question: '18. Lihatlah baris angka berikut. Angka berapakah yang muncul selanjutnya? 81 27 9 3 1 1/3 ?',
      answers: [
        { text: '1/9', correct: true },
        { text: '1/27', correct: false },
        { text: '3', correct: false },
        { text: '9', correct: false },
        { text: '1/3', correct: false }
      ],
      correctAnswerIndex: 0
    },
    // Question 19: [Geometric question excluded]
    {
      question: '20. Berapa pasangan dari lima hal dibawah ini yang merupakan duplikasi yang tepat?',
      answers: [
        { text: '1', correct: false },
        { text: '2', correct: true },
        { text: '3', correct: false },
        { text: '4', correct: false },
        { text: '5', correct: false }
      ],
      correctAnswerIndex: 1
    },
    {
      question: '21. Misalkan anda menyusun kata berikut menjadi kalimat lengkap. Jika kalimat ini merupakan pernyataan yang benar, tulislah (B). Jika salah, tulislah (S): "semua adalah Orang Amerika negara-negara dari warga negara"',
      answers: [
        { text: 'B', correct: false },
        { text: 'S', correct: true }
      ],
      correctAnswerIndex: 1
    },
    {
      question: '22. Anggaplah dua pernyataan pertama adalah benar. Apakah pernyataan terakhir: 1. benar 2. salah 3. tidak tahu? "Semua lelaki berkepala merah menyukai permen. Charles berkepala merah. Charles menyukai permen."',
      answers: [
        { text: 'benar', correct: true },
        { text: 'salah', correct: false },
        { text: 'tidak tahu', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '23. Dua dari pribahasa berikut ini memiliki makna serupa. Manakah itu?',
      answers: [
        { text: 'Pribahasa 1 dan 2', correct: true },
        { text: 'Pribahasa 2 dan 3', correct: false },
        { text: 'Pribahasa 3 dan 4', correct: false },
        { text: 'Pribahasa 4 dan 5', correct: false },
        { text: 'Pribahasa 1 dan 5', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '24. Sebuah kotak segi empat, yang terisi penuh, memuat 900 kubik kaki buah limo. Jika satu kotak lebarnya 10 kaki dan panjangnya 10 kaki, berapa kedalaman dalam kotak itu?',
      answers: [
        { text: '9 kaki', correct: true },
        { text: '10 kaki', correct: false },
        { text: '8 kaki', correct: false },
        { text: '7 kaki', correct: false },
        { text: '11 kaki', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '25. Sebuah jam terlambat 1 menit 12 detik dalam 24 hari. Berapa detik ia terlambat setiap harinya?',
      answers: [
        { text: '3 detik', correct: true },
        { text: '4 detik', correct: false },
        { text: '2 detik', correct: false },
        { text: '5 detik', correct: false },
        { text: '6 detik', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '26. Anggaplah dua pernyataan pertama ini benar. Apakah pernyataan terakhir: 1. benar 2. salah 3. tidak tahu? "Semua pemimpin progresif. Sebagian besar pemimpin adalah wiraswastawan. Orang yang progresif adalah wiraswastawan."',
      answers: [
        { text: 'benar', correct: true },
        { text: 'salah', correct: false },
        { text: 'tidak tahu', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '27. Pulsa telpon harganya 15 rupiah per menit. Berapa menit anda dapat memakai untuk 100 rupiah?',
      answers: [
        { text: '6 menit', correct: true },
        { text: '7 menit', correct: false },
        { text: '5 menit', correct: false },
        { text: '8 menit', correct: false },
        { text: '10 menit', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '28. Apakah makna kalimat berikut ini: 1. sama 2. berarti berlawanan 3. tidak sama atau berlainan. "Setiap buah labu dikenal dari akarnya. Anak persis seperti ayahnya."',
      answers: [
        { text: 'sama', correct: false },
        { text: 'berlawanan', correct: false },
        { text: 'tidak sama atau berlainan', correct: true }
      ],
      correctAnswerIndex: 2
    },
    {
      question: '29. Bila 2 ½ yard kain harganya 20 dolar, berapa harga 3 ½ yard?',
      answers: [
        { text: '28 dolar', correct: true },
        { text: '30 dolar', correct: false },
        { text: '26 dolar', correct: false },
        { text: '32 dolar', correct: false },
        { text: '24 dolar', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '30. Berapa duplikasi dari 5 pasang kata berikut ini?',
      answers: [
        { text: '1', correct: false },
        { text: '2', correct: true },
        { text: '3', correct: false },
        { text: '4', correct: false },
        { text: '5', correct: false }
      ],
      correctAnswerIndex: 1
    },
    {
      question: '31. Dua orang menangkap 75 ikan. A menangkap 4 kali lebih banyak dari B. Berapa ikan yang B tangkap?',
      answers: [
        { text: '15', correct: true },
        { text: '20', correct: false },
        { text: '18', correct: false },
        { text: '12', correct: false },
        { text: '10', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '32. Dalam kata berikut ini, manakah kata yang berbeda dari lainnya? 1. kumpulan 2. konvoi 3. sekumpulan 4. seorang teman 5. angkatan',
      answers: [
        { text: 'kumpulan', correct: false },
        { text: 'konvoi', correct: false },
        { text: 'sekumpulan', correct: false },
        { text: 'seorang teman', correct: true },
        { text: 'angkatan', correct: false }
      ],
      correctAnswerIndex: 3
    },
    {
      question: '33. Anggaplah dua pernyataan pertama benar. Apakah pernyataan terakhir: 1. benar 2. salah 3. tidak tahu? "Bert memberi salam pada Alice. Alice memberi salam pada Lou. Bert tidak memberi salam pada Lou."',
      answers: [
        { text: 'benar', correct: false },
        { text: 'salah', correct: true },
        { text: 'tidak tahu', correct: false }
      ],
      correctAnswerIndex: 1
    },
    {
      question: '34. Apakah angka terkecil dari rangkaian angka ini? 2 1 9 .9 .999 .88',
      answers: [
        { text: '2', correct: false },
        { text: '1', correct: false },
        { text: '9', correct: false },
        { text: '.9', correct: false },
        { text: '.88', correct: true }
      ],
      correctAnswerIndex: 4
    },
    {
      question: '35. Sepotong daging sapi beratnya 250 pound. Rata-rata konsumsi daging sapi dalam keluarga setiap harinya adalah 1 2/3 pound. Berapa lama daging sapi ini akan dihabiskan keluarga itu?',
      answers: [
        { text: '150 hari', correct: true },
        { text: '125 hari', correct: false },
        { text: '175 hari', correct: false },
        { text: '200 hari', correct: false },
        { text: '100 hari', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '36. Apakah arti dari kalimat ini : 1. sama 2. berlawanan 3. tidak sama atau berlawanan? "Meski jauh sahabat dapat sejalan. Sahabat merupakan satu jiwa dalam dua badan."',
      answers: [
        { text: 'sama', correct: true },
        { text: 'berlawanan', correct: false },
        { text: 'tidak sama atau berlawanan', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '37. Berapa banyak yard persegi pada lantai berukuran panjang 9 kaki dan lebar 21 kaki?',
      answers: [
        { text: '21', correct: true },
        { text: '189', correct: false },
        { text: '18', correct: false },
        { text: '24', correct: false },
        { text: '27', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '38. Satu angka dalam rangkaian ini tidak cocok dengan pola angka ini. Angka berapakah itu? 8 9 12 13 16 17 18 20',
      answers: [
        { text: '8', correct: false },
        { text: '9', correct: false },
        { text: '12', correct: false },
        { text: '13', correct: false },
        { text: '16', correct: false },
        { text: '17', correct: false },
        { text: '18', correct: true },
        { text: '20', correct: false }
      ],
      correctAnswerIndex: 6
    },
    // Question 39: [Geometric question excluded]
    {
      question: '40. Seorang penembak menembak target sebesar 12 ½ per rupiah kali ini. Berapa kali ia menembak target?',
      answers: [
        { text: '12 ½ kali', correct: true },
        { text: '12 kali', correct: false },
        { text: '13 kali', correct: false },
        { text: '11 ½ kali', correct: false },
        { text: '10 kali', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '41. Angka berapa yang terkecil dalam rangkaian ini? 2 1 .8 .888 .99?',
      answers: [
        { text: '2', correct: false },
        { text: '1', correct: false },
        { text: '.8', correct: true },
        { text: '.888', correct: false },
        { text: '.99', correct: false }
      ],
      correctAnswerIndex: 2
    },
    {
      question: '42. CENSOR CENSURE Apakah kata ini:',
      answers: [
        { text: 'memiliki arti yang sama', correct: false },
        { text: 'memiliki arti berlawanan', correct: false },
        { text: 'tidak memiliki arti sama atau berlainan', correct: true }
      ],
      correctAnswerIndex: 2
    },
    {
      question: '43. Apakah makna dari kalimat ini: 1. sama 2. berlawanan 3. tidak sama atau teman?',
      answers: [
        { text: 'sama', correct: true },
        { text: 'berlawanan', correct: false },
        { text: 'tidak sama atau teman', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '44. Sebuah jam menunjuk tepat pukul 12 siang pada hari Senin. Pada pukul 8 P.M. hari Selasa, jam itu terlambat 32 detik. Rata-rata, berapa banyak ia terlambat dalam ½ jam?',
      answers: [
        { text: '0.8 detik', correct: true },
        { text: '1 detik', correct: false },
        { text: '1.6 detik', correct: false },
        { text: '2 detik', correct: false },
        { text: '0.5 detik', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '45. Apakah arti dari kalimat berikut: 1. sama 2. berlawanan 3. tidak sama atau?',
      answers: [
        { text: 'sama', correct: false },
        { text: 'berlawanan', correct: false },
        { text: 'tidak sama atau', correct: true }
      ],
      correctAnswerIndex: 2
    },
    {
      question: '46. Grosir membeli satu kardus buah berisi 12 lusin seharga 2.4 dolar. Ia tahu 2 lusin ... (lanjutan tidak lengkap)',
      answers: [
        { text: '0.2 dolar per lusin', correct: true },
        { text: '0.3 dolar per lusin', correct: false },
        { text: '0.15 dolar per lusin', correct: false },
        { text: '0.25 dolar per lusin', correct: false },
        { text: '0.5 dolar per lusin', correct: false }
      ],
      correctAnswerIndex: 0
    },
    {
      question: '47. Apakah arti dari kalimat berikut : 1. sama 2. berlawanan 3. tidak sama atau berlawanan?',
      answers: [
        { text: 'sama', correct: false },
        { text: 'berlawanan', correct: true },
        { text: 'tidak sama atau berlawanan', correct: false }
      ],
      correctAnswerIndex: 1
    },
    {
      question: '48. Jumlah jam pada saat terang dan gelap hampir sama pada bulan:',
      answers: [
        { text: 'Maret', correct: false },
        { text: 'Juni', correct: false },
        { text: 'September', correct: true },
        { text: 'Desember', correct: false },
        { text: 'November', correct: false }
      ],
      correctAnswerIndex: 2
    },
    // Question 49: [Geometric question excluded]
    {
      question: '50. Tiga orang membentuk kemitraan dan setuju membagi keuntungan secara rata. X',
      answers: [
        { text: 'Masing-masing mendapat 1/3 keuntungan', correct: true },
        { text: 'Masing-masing mendapat 1/2 keuntungan', correct: false },
        { text: 'Masing-masing mendapat 1/4 keuntungan', correct: false },
        { text: 'Keuntungan dibagi tidak rata', correct: false },
        { text: 'Tidak dapat ditentukan', correct: false }
      ],
      correctAnswerIndex: 0
    }
  ];
  

const iqInterpretation = {
    12: "Umumnya untuk tenaga kerja pabrik atau kuli angkut",
    15: "Tingkat terendah dimana tenaga kerja diminta mempelajari pekerjaan dari manual tertulis",
    18: "Tingkat dimana tenaga kerja mampu bekerja mandiri tanpa supervisi",
    21: "Skor rata-rata tenaga kerja yang bekerja dalam standard sistem alfa-numerik",
    24: "Umumnya para supervisor pertama",
    27: "Umumnya manajemen tenga atau teknisi tingkat yang lebih tinggi",
    30: "Umumnya para profesional dan manajer eksekutif"
};

startButton.addEventListener('click', startTest);
nextButton.addEventListener('click', setNextQuestion);
restartButton.addEventListener('click', restartTest);

function startTest() {
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 2700; // Reset timer to 45 minutes
    resultContainerElement.classList.add('hide');
    questionContainerElement.classList.remove('hide');
    setNextQuestion();
    startTimer();
}

function restartTest() {
    // Hide all containers except test container
    document.getElementById('analysis-container').classList.add('hide');
    resultContainerElement.classList.add('hide');
    document.getElementById('test-container').classList.remove('hide');
    
    // Reset test
    startButton.classList.remove('hide');
    resetState();
    timerElement.innerText = formatTime(2700);
}

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

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        endTest(); // End test if no more questions
    }
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    answerButtonsElement.innerHTML = ''; // Clear previous buttons
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.dataset.index = index; // Store index instead of boolean
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    // answerButtonsElement.innerHTML = ''; // Already cleared in showQuestion for efficiency
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const selectedIndex = parseInt(selectedButton.dataset.index);
    const correctAnswerIndex = shuffledQuestions[currentQuestionIndex].correctAnswerIndex;
    const isCorrect = selectedIndex === correctAnswerIndex;

    if (isCorrect) {
        score++;
    }
    setStatusClass(document.body, isCorrect);
    Array.from(answerButtonsElement.children).forEach(button => {
        const buttonIndex = parseInt(button.dataset.index);
        setStatusClass(button, buttonIndex === correctAnswerIndex);
    });
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        endTest();
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function endTest() {
    clearInterval(timerInterval);
    
    // Hide test container
    document.getElementById('test-container').classList.add('hide');
    
    // Show analysis container
    document.getElementById('analysis-container').classList.remove('hide');
    
    // Start result processing
    processResults();
}

function processResults() {
    const iq = calculateIQ(score);
    iqScoreElement.innerText = `Your Score: ${score} out of ${questions.length}`;

    // Collect user responses for analysis
    const userResponses = shuffledQuestions.map((question, index) => ({
        question: question.question,
        answer: question.answers[question.selectedAnswerIndex]?.text || "Not answered",
        correct: question.selectedAnswerIndex === question.correctAnswerIndex
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
        // Hide analysis container
        document.getElementById('analysis-container').classList.add('hide');
        
        // Show results
        resultContainerElement.classList.remove('hide');
        iqLevelElement.innerHTML = `
            <h3>IQ Level: ${data.iq_level_description}</h3>
            <div class="gemini-feedback">
                ${data.gemini_feedback.replace(/\n/g, '<br>')}
            </div>
        `;
    })
    .catch(error => {
        // Hide analysis container
        document.getElementById('analysis-container').classList.add('hide');
        
        // Show error in results
        resultContainerElement.classList.remove('hide');
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

function getIQLevel(iq) { // This function is now replaced by Flask backend
    if (iq >= 140) {
        return "Very Superior";
    } else if (iq >= 120) {
        return "Superior";
    } else if (iq >= 110) {
        return "High Average";
    } else if (iq >= 90 && iq < 110) {
        return "Average";
    } else if (iq >= 80) {
        return "Low Average";
    } else {
        return "Below Average";
    }
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});