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

const questions = [
    {
        question: 'RASA SAKIT adalah lawan dari',
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
        question: 'Satu angka dalam urutan angka ini dihilangkan. Angka berapa itu? 100 97 94 ? 88 85 82',
        answers: [
            { text: '90', correct: false },
            { text: '91', correct: true },
            { text: '92', correct: false },
            { text: '93', correct: false },
            { text: '95', correct: false }
        ],
        correctAnswerIndex: 1
    },
    {
        question: 'DERMAWAN adalah lawan kata dari',
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
        question: 'KEMEWAHAN adalah lawan kata dari',
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
        question: 'Dalam kelompok kata berikut, manakah kata yang berbeda dari kata yang lain? 1. mobil 2. sepeda 3. mobil van 4. bus 5. truk',
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
        question: 'Berlambat-lambat adalah lawan kata dari',
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
        question: 'Anggaplah dua pernyataan pertama adalah benar. Pernyataan terakhir: Biola semelodi dengan piano. Piano semelodi dengan harpa. Biola semelodi dengan harpa',
        answers: [
            { text: 'benar', correct: true },
            { text: 'salah', correct: false },
            { text: 'tidak tahu', correct: false }
        ],
        correctAnswerIndex: 0
    },
    {
        question: 'Misalkan Anda menyusun kata berikut sehingga menjadi kalimat lengkap. Jika itu kalimat benar tulislah (B), jika Salah tulislah (S). Bensin kayu adalah batu bara dan untuk digunakan',
        answers: [
            { text: 'B', correct: false },
            { text: 'S', correct: true }
        ],
        correctAnswerIndex: 1
    },
    {
        question: 'FURTHER FARTHER Apakah kata ini:',
        answers: [
            { text: 'memiliki arti yang sama', correct: true },
            { text: 'memiliki arti berlawanan', correct: false },
            { text: 'tidak memiliki arti sama atau berlainan', correct: false }
        ],
        correctAnswerIndex: 0
    },
    {
        question: 'Mobil seseorang menempuh 16 mil dalam 30 menit. Berapa mil per jam, mobil itu melaju?',
        answers: [
            { text: '8', correct: false },
            { text: '16', correct: false },
            { text: '32', correct: true },
            { text: '48', correct: false },
            { text: '64', correct: false }
        ],
        correctAnswerIndex: 2
    },
    {
        question: 'Apakah makna dari kalimat berikut ini: Teman yang setia adalah benteng yang kokoh. Mereka tidak pernah merasakan siapa yang selalu berkorban.',
        answers: [
            { text: 'sama', correct: false },
            { text: 'berlawanan', correct: false },
            { text: 'tidak sama atau berlawanan', correct: true }
        ],
        correctAnswerIndex: 2
    },
    {
        question: 'Seorang dealer membeli sepeda seharga 2.000 dolar. la menjual sepeda itu seharga 2.400 dolar, dan mendapat untung 50 dolar dari setiap sepeda. Berapa banyaknya sepeda yang ia beli?',
        answers: [
            { text: '5', correct: false },
            { text: '8', correct: true },
            { text: '10', correct: false },
            { text: '12', correct: false },
            { text: '20', correct: false }
        ],
        correctAnswerIndex: 1
    },
    {
        question: 'Berapa dari enam pasangan ini yang merupakan duplikasi yang sama? 3421 1243, 21212 21212, 558956 558956, 10120210 10120210, 612986896 612986896, 356471201 356571201',
        answers: [
            { text: '2', correct: false },
            { text: '3', correct: false },
            { text: '4', correct: true },
            { text: '5', correct: false },
            { text: '6', correct: false }
        ],
        correctAnswerIndex: 2
    },
    {
        question: 'Seorang anak berumur 6 tahun, saudarinya dua kali lebih tua darinya. Saat anak itu berumur 10 tahun, berapa umur saudarinya?',
        answers: [
            { text: '12', correct: true },
            { text: '14', correct: false },
            { text: '16', correct: false },
            { text: '18', correct: false },
            { text: '20', correct: false }
        ],
        correctAnswerIndex: 0
    },
    {
        question: 'Dalam rangkaian kata berikut ini, manakah kata yang berbeda dengan yang lainnya? 1. armada 2. band 3. anak-anak 4. satu anak lelaki 5. kerumunan',
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
        question: 'Susunlah kata berikut menjadi pernyataan yang benar. Lalu tulislah huruf terakhir dari kata terakhir. adalah bumi bulat ini',
        answers: [
            { text: 'a', correct: false },
            { text: 'h', correct: false },
            { text: 'i', correct: true },
            { text: 'n', correct: false },
            { text: 's', correct: false }
        ],
        correctAnswerIndex: 2
    },
    {
        question: 'LIBURAN KERJA Apakah kata-kata ini:',
        answers: [
            { text: 'memiliki arti yang sama', correct: false },
            { text: 'memiliki arti berlawanan', correct: true },
            { text: 'tidak memiliki arti yang sama atau berlawanan?', correct: false }
        ],
        correctAnswerIndex: 1
    },
    {
        question: 'Lihatlah baris angka berikut. Angka berapakah yang muncul selanjutnya? 81 27 9 3 1 1/3 ?',
        answers: [
            { text: '1/6', correct: false },
            { text: '1/9', correct: true },
            { text: '1/2', correct: false },
            { text: '2/3', correct: false },
            { text: '1', correct: false }
        ],
        correctAnswerIndex: 1
    },
    {
        question: 'Berapa pasangan dari lima hal dibawah ini yang merupakan duplikasi yang tepat? Paterson, A.J. Patterson, A.J., Smith, A.O Smith, O.A., Bleed, O.M. Bleed, O.M., Peterpan, O.W. Peterson, O.W., Cash, I.O. Cash, I.O.',
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
        question: 'Misalkan anda menyusun kata berikut menjadi kalimat lengkap. Jika kalimat ini merupakan pernyataan yang benar, tulislah (B). Jika salah, tulislah (S) semua adalah Orang Amerika negara-negara dari warga negara',
        answers: [
            { text: 'B', correct: false },
            { text: 'S', correct: true }
        ],
        correctAnswerIndex: 1
    },
    {
        question: 'Anggaplah dua pernyataan pertama adalah benar. Apakah pernyataan terakhir: Semua lelaki berkepala merah menyukai permen. Charles berkepala merah. Charles menyukai permen.',
        answers: [
            { text: 'benar', correct: true },
            { text: 'salah', correct: false },
            { text: 'tidak tahu', correct: false }
        ],
        correctAnswerIndex: 0
    },
    {
        question: 'Dua dari pribahasa berikut ini memiliki makna serupa. Manakah itu? 1. Teman yang menolong dalam kesusahan adalah teman sejati. 2. Ladang memiliki mata dan hutan memiliki telinga 3. Seekor rubah tidak tertangkap dua kali dalam perangkap. 4. Ayam yang mengeram telur tidak pernah gemuk. 5. Sebuah batu berguling tidak mengumpulkan lumut.',
        answers: [
            { text: '1 dan 2', correct: false },
            { text: '1 dan 3', correct: false },
            { text: '1 dan 4', correct: true },
            { text: '2 dan 5', correct: false },
            { text: '3 dan 5', correct: false }
        ],
        correctAnswerIndex: 2
    },
    {
        question: 'Sebuah kotak segi empat, yang terisi penuh, memuat 900 kubik kaki buah limo. Jika satu kotak lebarnya 10 kaki dan panjangnya 10 kaki, berapa kedalaman dalam kotak itu?',
        answers: [
            { text: '7', correct: false },
            { text: '8', correct: false },
            { text: '9', correct: true },
            { text: '10', correct: false },
            { text: '11', correct: false }
        ],
        correctAnswerIndex: 2
    },
    {
        question: 'Sebuah jam terlambat 1 menit 12 detik dalam 24 hari. Berapa detik ia terlambat setiap harinya?',
        answers: [
            { text: '2', correct: false },
            { text: '3', correct: true },
            { text: '4', correct: false },
            { text: '5', correct: false },
            { text: '6', correct: false }
        ],
        correctAnswerIndex: 1
    },
    {
        question: 'Anggaplah dua pernyataan pertama ini benar. Apakah pertanyaan terakhir: Semua pemimpin progresif. Sebagian besar pemimpin adalah wiraswastawan. Orang yang progresif adalah wiraswastawan',
        answers: [
            { text: 'benar', correct: true },
            { text: 'salah', correct: false },
            { text: 'tidak tahu', correct: false }
        ],
        correctAnswerIndex: 0
    },
    {
        question: 'Pulsa telpon harganya 15 rupiah per menit. Berapa menit anda dapat memakai untuk 100 rupiah?',
        answers: [
            { text: '5', correct: false },
            { text: '6', correct: true },
            { text: '7', correct: false },
            { text: '8', correct: false },
            { text: '9', correct: false }
        ],
        correctAnswerIndex: 1
    },
    {
        question: 'Apakah makna kalimat berikut ini: Setiap buah labu dikenal dari akarnya. Anak persis seperti ayahnya',
        answers: [
            { text: 'sama', correct: true },
            { text: 'berarti berlawanan', correct: false },
            { text: 'tidak sama atau berlawanan', correct: false }
        ],
        correctAnswerIndex: 0
    },
    {
        question: 'Bila 2 ½ yard kain harganya 20 dolar, berapa harga 3 ½ yard?',
        answers: [
            { text: '24', correct: false },
            { text: '26', correct: false },
            { text: '28', correct: true },
            { text: '30', correct: false },
            { text: '32', correct: false }
        ],
        correctAnswerIndex: 2
    },
    {
        question: 'Berapa duplikasi dari 5 pasang kata berikut ini? Silverstein, Μ.Ο. Silverstien, Μ.Ο, Harrisberg, L.W. Harrisberg, L.M., Seirs, J.C. Sears, J.C., Wood, A.B. Woods, A.B., Johnson, M.D. Johnson, M.D.',
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
        question: 'Dua orang menangkap 75 ikan. A menangkap 4 kali lebih banyak dari B. Berapa ikan yang B tangkap?',
        answers: [
            { text: '12', correct: false },
            { text: '15', correct: true },
            { text: '18', correct: false },
            { text: '20', correct: false },
            { text: '25', correct: false }
        ],
        correctAnswerIndex: 1
    },
    {
        question: 'Dalam kata berikut ini, manakah kata yang berbeda dari lainnya? 1. kumpulan 2. konvoi 3. sekumpulan 4. seorang teman 5. angkatan',
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
        question: 'Anggaplah dua pernyataan pertama benar. Apakah pernyataan terakhir: Bert memberi salam pada Alice. Alice memberi salam pada Lou. Bert tidak memberi salam pada Lou.',
        answers: [
            { text: 'benar', correct: false },
            { text: 'salah', correct: true },
            { text: 'tidak tahu', correct: false }
        ],
        correctAnswerIndex: 1
    },
    {
        question: 'Apakah angka terkecil dari rangkaian angka ini? 2 1 9 9 .999 .88',
        answers: [
            { text: '2', correct: false },
            { text: '1', correct: false },
            { text: '9', correct: false },
            { text: '.999', correct: false },
            { text: '.88', correct: true }
        ],
        correctAnswerIndex: 4
    },
    {
        question: 'Sepotong daging sapi beratnya 250 pound. Rata-rata konsumsi daging sapi dalam keluarga setiap harinya adalah 1 2/3 pound. Berapa lama daging sapi ini akan dihabiskan keluarga itu?',
        answers: [
            { text: '125 hari', correct: false },
            { text: '135 hari', correct: false },
            { text: '150 hari', correct: true },
            { text: '175 hari', correct: false },
            { text: '200 hari', correct: false }
        ],
        correctAnswerIndex: 2
    },
    {
        question: 'Apakah arti dari kalimat ini: Meski jauh sahabat dapat sejalan. Sahabat merupakan satu jiwa dalam dua badan.',
        answers: [
            { text: 'sama', correct: true },
            { text: 'berlawanan', correct: false },
            { text: 'tidak sama atau berlawanan', correct: false }
        ],
        correctAnswerIndex: 0
    },
    {
        question: 'Berapa banyak yard persegi pada lantai berukuran panjang 9 kaki dan lebar 21 kaki?',
        answers: [
            { text: '7', correct: true },
            { text: '14', correct: false },
            { text: '21', correct: false },
            { text: '63', correct: false },
            { text: '189', correct: false }
        ],
        correctAnswerIndex: 0
    },
    {
        question: 'Satu angka dalam rangkaian ini tidak cocok dengan pola angka ini. Angka berapakah itu? 8 9 12 13 16 17 18 20',
        answers: [
            { text: '9', correct: false },
            { text: '12', correct: false },
            { text: '13', correct: false },
            { text: '18', correct: false },
            { text: '20', correct: true }
        ],
        correctAnswerIndex: 4
    },
    {
        question: '3 dari 5 bentuk ini dapat disatukan untuk membentuk segitiga. Manakah ketiganya itu? (refer to PDF image question 39)',
        answers: [
            { text: '1, 2, 3', correct: true },
            { text: '1, 3, 5', correct: false },
            { text: '2, 3, 4', correct: false },
            { text: '2, 4, 5', correct: false },
            { text: '3, 4, 5', correct: false }
        ],
        correctAnswerIndex: 0
    },
    {
        question: 'Seorang penembak menembak target sebesar 12 ½ per rupiah kali ini. Berapa kali ia harus menembak untuk dapat 10.000?',
        answers: [
            { text: '700', correct: false },
            { text: '750', correct: false },
            { text: '800', correct: true },
            { text: '850', correct: false },
            { text: '900', correct: false }
        ],
        correctAnswerIndex: 2
    },
    {
        question: 'Angka berapa yang terkecil dalam rangkaian ini? 2 1 .8 .888 .99?',
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
        question: 'CENSOR CENSURE Apakah kata ini:',
        answers: [
            { text: 'memiliki arti sama', correct: true },
            { text: 'memiliki arti berlawanan', correct: false },
            { text: 'tidak memiliki arti sama atau berlawanan', correct: false }
        ],
        correctAnswerIndex: 0
    },
    {
        question: 'Apakah makna dari kalimat ini: Sebuah kepingan jatuh dari balok tua. Anak pengemis pamer layaknya teman',
        answers: [
            { text: 'sama', correct: false },
            { text: 'berlawanan', correct: false },
            { text: 'tidak sama atau berlawanan', correct: true }
        ],
        correctAnswerIndex: 2
    },
    {
        question: 'Sebuah jam menunjuk tepat pukul 12 siang pada hari Senin. Pada pukul 8 P.M. hari Selasa, jam itu terlambat 32 detik. Rata-rata, berapa banyak ia terlambat dalam ½ jam?',
        answers: [
            { text: '½ detik', correct: true },
            { text: '1 detik', correct: false },
            { text: '2 detik', correct: false },
            { text: '4 detik', correct: false },
            { text: '8 detik', correct: false }
        ],
        correctAnswerIndex: 0
    },
    {
        question: 'Apakah arti dari kalimat berikut: Orang yang menuntut, tidak memerintah. Orang yang mengabaikan keinginannya masih memakai pendapat sendiri',
        answers: [
            { text: 'sama', correct: false },
            { text: 'berlawanan', correct: false },
            { text: 'tidak sama atau berlawanan', correct: true }
        ],
        correctAnswerIndex: 2
    },
    {
        question: 'Grosir membeli satu kardus buah berisi 12 lusin seharga 2.4 dolar. la tahu 2 lusin akan busuk sebelum ia menjual buah itu. Berapa harga yang harus dijual setiap lusin buah yang bagus, bila ia ingin memperoleh 1/3 dari total pengeluarannya?',
        answers: [
            { text: '$0.24', correct: false },
            { text: '$0.27', correct: false },
            { text: '$0.30', correct: false },
            { text: '$0.32', correct: true },
            { text: '$0.36', correct: false }
        ],
        correctAnswerIndex: 3
    },
    {
        question: 'Apakah arti dari kalimat berikut: Dimana ada keinginan, disitu ada jalan. Raja menjual segala hal untuk kerja keras.',
        answers: [
            { text: 'sama', correct: false },
            { text: 'berlawanan', correct: false },
            { text: 'tidak sama atau berlawanan', correct: true }
        ],
        correctAnswerIndex: 2
    },
    {
        question: 'Jumlah jam pada saat terang dan gelap hampir sama pada bulan:',
        answers: [
            { text: 'Juni', correct: false },
            { text: 'September', correct: true },
            { text: 'Mei', correct: false },
            { text: 'Desember', correct: false }
        ],
        correctAnswerIndex: 1
    },
    {
        question: 'Tiga orang membentuk kemitraan dan setuju membagi keuntungan secara rata. X menginvestasi 5.500 dolar. Y sebesar 3.500 dolar dan Z sebesar 1.000 dolar. Jika keuntungan mencapai 3.000 dolar, lebih kurang berapa yang akan diperoleh X dibanding jika keuntungan dibagi berdasarkan besarnya investasi?',
        answers: [
            { text: 'Tidak ada perbedaan', correct: false },
            { text: '400 dolar lebih sedikit', correct: false },
            { text: '500 dolar lebih sedikit', correct: true },
            { text: '600 dolar lebih sedikit', correct: false },
            { text: '700 dolar lebih sedikit', correct: false }
        ],
        correctAnswerIndex: 2
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