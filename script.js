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
const BACKEND_URL = window.ENV?.BACKEND_URL;

let shuffledQuestions, currentQuestionIndex;
let score = 0;
let timeLeft = 2700; // 45 minutes in seconds
let timerInterval;
let isEmulationMode = false;
let emulationMode = 'normal';

const questions = [
    {
         question: '1. LAWAN KATA dari RASA SAKIT adalah?',
         answers: [
           { text: '1. Racun', correct: false },
           { text: '2. Kesedihan', correct: false },
           { text: '3. Kepedihan', correct: false },
           { text: '4. Nyaman', correct: true },
           { text: '5. Hukuman', correct: false }
         ],
         correctAnswerIndex: 3
       },
       {
         question: '2. Angka berapa yang HILANG dalam urutan angka ini: 100 97 94 ? 88 85 82',
         answers: [
           { text: '93', correct: false },
           { text: '92', correct: false },
           { text: '91', correct: true },
           { text: '90', correct: false },
           { text: '89', correct: false }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '3. DERMAWAN adalah lawan kata dari?',
         answers: [
           { text: '1. Ningrat', correct: false },
           { text: '2. Populer', correct: false },
           { text: '3. Ikut perasaan', correct: false },
           { text: '4. Suka berteman', correct: false },
           { text: '5. Pelit', correct: true }
         ],
         correctAnswerIndex: 4
       },
       {
         question: '4. KEMEWAHAN adalah lawan kata dari?',
         answers: [
           { text: '1. Berlimpah', correct: false },
           { text: '2. Ruah', correct: false },
           { text: '3. Kemiskinan', correct: true },
           { text: '4. Devosi', correct: false },
           { text: '5. Kegagalan', correct: false }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '5. Di antara kelompok kata berikut, manakah kata yang BERBEDA dari yang lain?',
         answers: [
           { text: '1. Mobil', correct: false },
           { text: '2. Sepeda', correct: false },
           { text: '3. Mobil van', correct: false },
           { text: '4. Bus', correct: false },
           { text: '5. Truk', correct: true }
         ],
         correctAnswerIndex: 4
       },
       {
         question: '6. Berlambat-lambat adalah lawan kata dari?',
         answers: [
           { text: '1. Mempertahankan', correct: false },
           { text: '2. Tergesa-gesa', correct: true },
           { text: '3. Menuntut', correct: false },
           { text: '4. Tetap', correct: false },
           { text: '5. Pelan', correct: false }
         ],
         correctAnswerIndex: 1
       },
       {
         question: '7. ANGGAPLAH dua pernyataan pertama BENAR. \nPernyataan terakhir: Biola semelodi dengan piano. Piano semelodi dengan harpa. Biola semelodi dengan harpa.',
         answers: [
           { text: '1. Benar', correct: true },
           { text: '2. Salah', correct: false },
           { text: '3. Tidak tahu', correct: false }
         ],
         correctAnswerIndex: 0
       },
       {
         question: '8. Misalkan Anda menyusun kata berikut menjadi kalimat lengkap. Jika itu kalimat BENAR tulislah (B), jika SALAH tulislah (S).\n"Bensin kayu adalah batu bara dan untuk digunakan"',
         answers: [
           { text: '(B)', correct: false },
           { text: '(S)', correct: true }
         ],
         correctAnswerIndex: 1
       },
       {
         question: '9. FURTHER FARTHER. Apakah kata-kata ini:',
         answers: [
           { text: '1. Memiliki arti yang sama', correct: true },
           { text: '2. Memiliki arti berlawanan', correct: false },
           { text: '3. Tidak memiliki arti sama atau berlainan', correct: false }
         ],
         correctAnswerIndex: 0
       },
       {
         question: '10. Mobil seseorang menempuh 16 mil dalam 30 menit. Berapa mil per jam kecepatan mobil itu?',
         answers: [
           { text: '8 mil/jam', correct: false },
           { text: '16 mil/jam', correct: false },
           { text: '32 mil/jam', correct: true },
           { text: '48 mil/jam', correct: false },
           { text: '64 mil/jam', correct: false }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '11. Apakah MAKNA dari kalimat berikut ini: "Teman yang setia adalah benteng yang kokoh. Mereka tidak pernah merasakan siapa yang selalu berkorban."',
         answers: [
           { text: '1. Sama', correct: false },
           { text: '2. Berlawanan', correct: false },
           { text: '3. Tidak sama atau berlawanan', correct: true }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '12. Seorang dealer membeli sepeda seharga 2.000 dolar. Ia menjual sepeda itu seharga 2.400 dolar, dan mendapat untung 50 dolar dari SETIAP sepeda. Berapa BANYAK sepeda yang ia beli?',
         answers: [
           { text: '4', correct: false },
           { text: '6', correct: false },
           { text: '8', correct: true },
           { text: '10', correct: false },
           { text: '12', correct: false }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '13. Berapa banyak dari ENAM pasangan berikut yang merupakan DUPLIKASI yang SAMA?',
         answers: [
           { text: '1', correct: false },
           { text: '2', correct: false },
           { text: '3', correct: false },
           { text: '4', correct: true },
           { text: '5', correct: false }
         ],
         correctAnswerIndex: 3
       },
       {
         question: '14. Seorang anak berumur 6 tahun, saudarinya dua kali lebih tua darinya. Saat anak itu berumur 10 tahun, berapa umur saudarinya?',
         answers: [
           { text: '12 tahun', correct: true },
           { text: '14 tahun', correct: false },
           { text: '16 tahun', correct: false },
           { text: '18 tahun', correct: false },
           { text: '20 tahun', correct: false }
         ],
         correctAnswerIndex: 0
       },
       {
         question: '15. Dalam rangkaian kata berikut ini, manakah kata yang BERBEDA dengan yang lainnya?',
         answers: [
           { text: '1. Armada', correct: false },
           { text: '2. Band', correct: false },
           { text: '3. Anak-anak', correct: false },
           { text: '4. Satu anak lelaki', correct: false },
           { text: '5. Kerumunan', correct: true }
         ],
         correctAnswerIndex: 4
       },
       {
         question: '16. Susunlah kata berikut menjadi pernyataan yang BENAR. Lalu tulislah HURUF TERAKHIR dari kata terakhir: "adalah bumi bulat ini"',
         answers: [
           { text: 'S', correct: false },
           { text: 'I', correct: false },
           { text: 'T', correct: false },
           { text: 'M', correct: false },
           { text: 'N', correct: true }
         ],
         correctAnswerIndex: 4
       },
       {
         question: '17. LIBURAN KERJA. Apakah kata-kata ini:',
         answers: [
           { text: '1. Memiliki arti yang sama', correct: false },
           { text: '2. Memiliki arti berlawanan', correct: true },
           { text: '3. Tidak memiliki arti yang sama atau berlawanan', correct: false }
         ],
         correctAnswerIndex: 1
       },
       {
         question: '18. Lihatlah baris angka berikut. Angka berapakah yang MUNCUL SELANJUTNYA? 81 27 9 3 1 1/3 ?',
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
         question: '20. Berapa pasangan dari LIMA hal di bawah ini yang merupakan DUPLIKASI yang TEPAT?',
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
         question: '21. Misalkan anda menyusun kata berikut menjadi kalimat lengkap. Jika kalimat ini merupakan pernyataan yang BENAR, tulislah (B). Jika SALAH, tulislah (S).\n"semua adalah Orang Amerika negara-negara dari warga negara"',
         answers: [
           { text: '(B)', correct: false },
           { text: '(S)', correct: true }
         ],
         correctAnswerIndex: 1
       },
       {
         question: '22. ANGGAPLAH dua pernyataan pertama adalah BENAR. Apakah pernyataan terakhir: "Semua lelaki berkepala merah menyukai permen. Charles berkepala merah. Charles menyukai permen."',
         answers: [
           { text: '1. Benar', correct: true },
           { text: '2. Salah', correct: false },
           { text: '3. Tidak tahu', correct: false }
         ],
         correctAnswerIndex: 0
       },
       {
         question: '23. Dua dari pribahasa berikut ini memiliki MAKNA SERUPA. Manakah itu?',
         answers: [
           { text: '1 & 2', correct: false },
           { text: '1 & 3', correct: true },
           { text: '1 & 4', correct: false },
           { text: '1 & 5', correct: false },
           { text: '2 & 3', correct: false }
         ],
         correctAnswerIndex: 1
       },
       {
         question: '24. Sebuah kotak segi empat, yang terisi penuh, memuat 900 kubik kaki buah limo. Jika satu kotak LEBARNYA 10 kaki dan PANJANGNYA 10 kaki, berapa KEDALAMAN dalam kotak itu?',
         answers: [
           { text: '7 kaki', correct: false },
           { text: '8 kaki', correct: false },
           { text: '9 kaki', correct: true },
           { text: '10 kaki', correct: false },
           { text: '11 kaki', correct: false }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '25. Sebuah jam TERLAMBAT 1 menit 12 detik dalam 24 hari. Berapa DETIK ia terlambat SETIAP HARINYA?',
         answers: [
           { text: '1 detik', correct: false },
           { text: '2 detik', correct: false },
           { text: '3 detik', correct: true },
           { text: '4 detik', correct: false },
           { text: '5 detik', correct: false }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '26. ANGGAPLAH dua pernyataan pertama ini BENAR. Apakah pertanyaan terakhir: "Semua pemimpin progresif. Sebagian besar pemimpin adalah wiraswastawan. Orang yang progresif adalah wiraswastawan"',
         answers: [
           { text: '1. Benar', correct: true },
           { text: '2. Salah', correct: false },
           { text: '3. Tidak tahu', correct: false }
         ],
         correctAnswerIndex: 0
       },
       {
         question: '27. Pulsa telepon harganya 15 rupiah per menit. Berapa MENIT Anda dapat memakai untuk 100 rupiah?',
         answers: [
           { text: '5 menit', correct: false },
           { text: '6 menit', correct: true },
           { text: '7 menit', correct: false },
           { text: '8 menit', correct: false },
           { text: '9 menit', correct: false }
         ],
         correctAnswerIndex: 1
       },
       {
         question: '28. Apakah MAKNA kalimat berikut ini: "Setiap buah labu dikenal dari akarnya. Anak persis seperti ayahnya"',
         answers: [
           { text: '1. Sama', correct: true },
           { text: '2. Berarti berlawanan', correct: false },
           { text: '3. Tidak sama atau berlawanan', correct: false }
         ],
         correctAnswerIndex: 0
       },
       {
         question: '29. Bila 2 ½ yard kain harganya 20 dolar, berapa harga 3 ½ yard?',
         answers: [
           { text: '24 dolar', correct: false },
           { text: '26 dolar', correct: false },
           { text: '28 dolar', correct: true },
           { text: '30 dolar', correct: false },
           { text: '32 dolar', correct: false }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '30. Berapa DUPLIKASI dari 5 pasang kata berikut ini?',
         answers: [
           { text: '1', correct: false },
           { text: '2', correct: false },
           { text: '3', correct: false },
           { text: '4', correct: true },
           { text: '5', correct: false }
         ],
         correctAnswerIndex: 3
       },
       {
         question: '31. Dua orang menangkap 75 ikan. A menangkap 4 kali LEBIH BANYAK dari B. Berapa ikan yang B tangkap?',
         answers: [
           { text: '10', correct: false },
           { text: '12', correct: false },
           { text: '15', correct: true },
           { text: '18', correct: false },
           { text: '20', correct: false }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '32. Dalam kata berikut ini, manakah kata yang BERBEDA dari lainnya?',
         answers: [
           { text: '1. Kumpulan', correct: false },
           { text: '2. Konvoi', correct: false },
           { text: '3. Sekumpulan', correct: false },
           { text: '4. Seorang teman', correct: true },
           { text: '5. Angkatan', correct: false }
         ],
         correctAnswerIndex: 3
       },
       {
         question: '33. ANGGAPLAH dua pernyataan pertama BENAR. Apakah pernyataan terakhir: "Bert memberi salam pada Alice. Alice memberi salam pada Lou. Bert tidak memberi salam pada Lou."',
         answers: [
           { text: '1. Benar', correct: false },
           { text: '2. Salah', correct: true },
           { text: '3. Tidak tahu', correct: false }
         ],
         correctAnswerIndex: 1
       },
       {
         question: '34. Apakah angka TERKECIL dari rangkaian angka ini? 2 1 9 9 .999 .88',
         answers: [
           { text: '2', correct: false },
           { text: '1', correct: false },
           { text: '9', correct: false },
           { text: '.999', correct: true },
           { text: '.88', correct: false }
         ],
         correctAnswerIndex: 3
       },
       {
         question: '35. Sepotong daging sapi beratnya 250 pound. Rata-rata konsumsi daging sapi dalam keluarga setiap harinya adalah 1 2/3 pound. Berapa LAMA daging sapi ini akan DIHABISKAN keluarga itu?',
         answers: [
           { text: '100 hari', correct: false },
           { text: '125 hari', correct: false },
           { text: '150 hari', correct: true },
           { text: '175 hari', correct: false },
           { text: '200 hari', correct: false }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '36. Apakah ARTI dari kalimat ini: "Meski jauh sahabat dapat sejalan. Sahabat merupakan satu jiwa dalam dua badan."',
         answers: [
           { text: '1. Sama', correct: true },
           { text: '2. Berlawanan', correct: false },
           { text: '3. Tidak sama atau berlawanan', correct: false }
         ],
         correctAnswerIndex: 0
       },
       {
         question: '37. Berapa banyak YARD PERSEGI pada lantai berukuran panjang 9 kaki dan lebar 21 kaki? (Catatan: 1 yard = 3 kaki)',
         answers: [
           { text: '7 yard persegi', correct: true },
           { text: '14 yard persegi', correct: false },
           { text: '21 yard persegi', correct: false },
           { text: '42 yard persegi', correct: false },
           { text: '63 yard persegi', correct: false }
         ],
         correctAnswerIndex: 0
       },
       {
         question: '38. Satu angka dalam rangkaian ini TIDAK COCOK dengan pola angka ini. Angka berapakah itu? 8 9 12 13 16 17 18 20',
         answers: [
           { text: '9', correct: false },
           { text: '12', correct: false },
           { text: '17', correct: false },
           { text: '18', correct: false },
           { text: '20', correct: true }
         ],
         correctAnswerIndex: 4
       },
       {
         question: '40. Seorang penembak menembak target sebesar 12 ½ per rupiah kali ini. Berapa KALI ia harus menembak untuk mendapatkan 10.000 rupiah?',
         answers: [
           { text: '800 kali', correct: true },
           { text: '8000 kali', correct: false },
           { text: '1250 kali', correct: false },
           { text: '125 kali', correct: false },
           { text: '125000 kali', correct: false }
         ],
         correctAnswerIndex: 0
       },
       {
         question: '41. Angka berapa yang TERKECIL dalam rangkaian ini? 2 1 .8 .888 .99?',
         answers: [
           { text: '2', correct: false },
           { text: '1', correct: false },
           { text: '.8', correct: false },
           { text: '.888', correct: true },
           { text: '.99', correct: false }
         ],
         correctAnswerIndex: 3
       },
       {
         question: '42. CENSOR CENSURE. Apakah kata-kata ini:',
         answers: [
           { text: '1. Memiliki arti sama', correct: true },
           { text: '2. Memiliki arti berlawanan', correct: false },
           { text: '3. Tidak memiliki arti sama atau berlawanan', correct: false }
         ],
         correctAnswerIndex: 0
       },
       {
         question: '43. Apakah MAKNA dari kalimat ini: "Sebuah kepingan jatuh dari balok tua. Anak pengemis pamer layaknya teman."',
         answers: [
           { text: '1. Sama', correct: false },
           { text: '2. Berlawanan', correct: false },
           { text: '3. Tidak sama atau berlawanan', correct: true }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '44. Sebuah jam menunjuk tepat pukul 12 siang pada hari Senin. Pada pukul 8 P.M. hari Selasa, jam itu TERLAMBAT 32 detik. Rata-rata, berapa banyak ia terlambat dalam ½ JAM?',
         answers: [
           { text: '0.8 detik', correct: false },
           { text: '1 detik', correct: true },
           { text: '1.6 detik', correct: false },
           { text: '2 detik', correct: false },
           { text: '0.5 detik', correct: false }
         ],
         correctAnswerIndex: 1
       },
       {
         question: '45. Apakah ARTI dari kalimat berikut: "Orang yang menuntut, tidak memerintah. Orang yang mengabaikan keinginannya masih memakai pendapat sendiri."',
         answers: [
           { text: '1. Sama', correct: false },
           { text: '2. Berlawanan', correct: false },
           { text: '3. Tidak sama atau berlawanan', correct: true }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '46. Grosir membeli satu kardus buah berisi 12 lusin seharga 2.4 dolar. Ia tahu 2 lusin akan BUSUK sebelum ia menjual buah itu. Berapa HARGA yang harus dijual setiap lusin buah yang BAGUS, bila ia ingin memperoleh 1/3 dari total pengeluarannya?',
         answers: [
           { text: '$0.24', correct: false },
           { text: '$0.28', correct: false },
           { text: '$0.32', correct: true },
           { text: '$0.36', correct: false },
           { text: '$0.40', correct: false }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '47. Apakah ARTI dari kalimat berikut: "Dimana ada keinginan, disitu ada jalan. Raja menjual segala hal untuk kerja keras."',
         answers: [
           { text: '1. Sama', correct: false },
           { text: '2. Berlawanan', correct: false },
           { text: '3. Tidak sama atau berlawanan', correct: true }
         ],
         correctAnswerIndex: 2
       },
       {
         question: '48. Jumlah jam pada saat TERANG dan GELAP hampir SAMA pada bulan:',
         answers: [
           { text: '1. Juni', correct: false },
           { text: '2. September', correct: true },
           { text: '3. Mei', correct: false },
           { text: '4. Desember', correct: false }
         ],
         correctAnswerIndex: 1
       },
       {
         question: '50. Tiga orang membentuk kemitraan dan setuju membagi keuntungan secara rata. X menginvestasi 5.500 dolar, Y sebesar 3.500 dolar dan Z sebesar 1.000 dolar. Jika keuntungan mencapai 3.000 dolar, LEBIH KURANG berapa yang akan diperoleh X dibandingkan jika keuntungan dibagi berdasarkan besarnya investasi?',
         answers: [
           { text: 'Lebih banyak $500', correct: false },
           { text: 'Lebih sedikit $500', correct: true },
           { text: 'Lebih banyak $1000', correct: false },
           { text: 'Lebih sedikit $1000', correct: false },
           { text: 'Tidak ada perbedaan', correct: false }
         ],
         correctAnswerIndex: 1
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
    timeLeft = 2700;
    resultContainerElement.classList.add('hide');
    questionContainerElement.classList.remove('hide');
    
    // Check if emulation is enabled
    const emulatedAnswers = getEmulatedAnswers();
    if (emulatedAnswers) {
        // Auto-answer all questions
        autoAnswerQuestions(emulatedAnswers);
    } else {
        setNextQuestion();
        startTimer();
    }
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
    const mode = document.querySelector('input[name="iq-emulation"]:checked').value;
    const emulationNote = mode !== 'normal' ? 
        `<p class="emulation-note">(Emulated ${mode} IQ test results)</p>` : '';
    
    iqScoreElement.innerText = `Your Score: ${score} out of ${questions.length}`;
    iqScoreElement.innerHTML += emulationNote;

    // Collect user responses for analysis
    const userResponses = shuffledQuestions.map((question, index) => ({
        question: question.question,
        answer: question.answers[question.selectedAnswerIndex]?.text || "Not answered",
        correct: question.selectedAnswerIndex === question.correctAnswerIndex
    }));

    fetch(`${BACKEND_URL}/process_iq_test`, {
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

function getEmulatedAnswers() {
  const mode = document.querySelector('input[name="iq-emulation"]:checked').value;
  let correctProbability;
  
  switch(mode) {
    case 'low':
      correctProbability = 0.3; // 30% correct answers
      break;
    case 'medium':
      correctProbability = 0.5; // 50% correct answers
      break;
    case 'high':
      correctProbability = 0.85; // 85% correct answers
      break;
    default:
      return null; // Normal mode - no emulation
  }
  
  return shuffledQuestions.map(question => {
    const random = Math.random();
    if (random <= correctProbability) {
      return question.correctAnswerIndex;
    } else {
      // Return a random wrong answer
      const wrongAnswers = question.answers
        .map((_, index) => index)
        .filter(index => index !== question.correctAnswerIndex);
      return wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
    }
  });
}

function autoAnswerQuestions(emulatedAnswers) {
    // Hide timer since we're auto-answering
    document.getElementById('timer').style.display = 'none';
    
    // Process all answers immediately
    shuffledQuestions.forEach((question, index) => {
        const selectedAnswerIndex = emulatedAnswers[index];
        question.selectedAnswerIndex = selectedAnswerIndex;
        if (selectedAnswerIndex === question.correctAnswerIndex) {
            score++;
        }
    });
    
    // Go straight to results
    endTest();
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});