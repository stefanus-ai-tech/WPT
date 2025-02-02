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
    correctAnswerIndex: 3,
    category: 1 // 1. Vocabulary/Verbal Reasoning (Antonym)
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
    correctAnswerIndex: 2,
    category: 2 // 2. Numerical Reasoning (Number Series)
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
    correctAnswerIndex: 4,
     category: 1 // 1. Vocabulary/Verbal Reasoning (Antonym)
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
    correctAnswerIndex: 2,
     category: 1 // 1. Vocabulary/Verbal Reasoning (Antonym)
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
    correctAnswerIndex: 4,
    category: 3 // 3. Logical Reasoning (Odd One Out)
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
    correctAnswerIndex: 1,
    category: 1 // 1. Vocabulary/Verbal Reasoning (Antonym)
  },
  {
    question: '7. ANGGAPLAH dua pernyataan pertama BENAR. \nPernyataan terakhir: Biola semelodi dengan piano. Piano semelodi dengan harpa. Biola semelodi dengan harpa.',
    answers: [
      { text: '1. Benar', correct: true },
      { text: '2. Salah', correct: false },
      { text: '3. Tidak tahu', correct: false }
    ],
    correctAnswerIndex: 0,
    category: 4 // 4. Logical Reasoning (Deductive Reasoning)
  },
  {
    question: '8. Misalkan Anda menyusun kata berikut menjadi kalimat lengkap. Jika itu kalimat BENAR tulislah (B), jika SALAH tulislah (S).\n"Bensin kayu adalah batu bara dan untuk digunakan"',
    answers: [
      { text: '(B)', correct: false },
      { text: '(S)', correct: true }
    ],
    correctAnswerIndex: 1,
    category: 5 // 5. Verbal Reasoning (Sentence Logic)
  },
  {
    question: '9. FURTHER FARTHER. Apakah kata-kata ini:',
    answers: [
      { text: '1. Memiliki arti yang sama', correct: true },
      { text: '2. Memiliki arti berlawanan', correct: false },
      { text: '3. Tidak memiliki arti sama atau berlainan', correct: false }
    ],
    correctAnswerIndex: 0,
    category: 1 // 1. Vocabulary/Verbal Reasoning (Synonym)
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
    correctAnswerIndex: 2,
    category: 6 // 6. Numerical Reasoning (Problem Solving)
  },
  {
    question: '11. Apakah MAKNA dari kalimat berikut ini: "Teman yang setia adalah benteng yang kokoh. Mereka tidak pernah merasakan siapa yang selalu berkorban."',
    answers: [
      { text: '1. Sama', correct: false },
      { text: '2. Berlawanan', correct: false },
      { text: '3. Tidak sama atau berlawanan', correct: true }
    ],
    correctAnswerIndex: 2,
     category: 7 // 7. Verbal Reasoning (Meaning interpretation)
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
    correctAnswerIndex: 2,
    category: 6 // 6. Numerical Reasoning (Problem Solving)
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
    correctAnswerIndex: 3,
    category: 8 // 8. Perceptual Speed (Matching)
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
    correctAnswerIndex: 0,
    category: 6 // 6. Numerical Reasoning (Problem Solving)
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
    correctAnswerIndex: 4,
    category: 3 // 3. Logical Reasoning (Odd One Out)
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
    correctAnswerIndex: 4,
    category: 5 // 5. Verbal Reasoning (Sentence Logic)
  },
  {
    question: '17. LIBURAN KERJA. Apakah kata-kata ini:',
    answers: [
      { text: '1. Memiliki arti yang sama', correct: false },
      { text: '2. Memiliki arti berlawanan', correct: true },
      { text: '3. Tidak memiliki arti yang sama atau berlawanan', correct: false }
    ],
    correctAnswerIndex: 1,
     category: 1 // 1. Vocabulary/Verbal Reasoning (Antonym)
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
    correctAnswerIndex: 1,
    category: 2 // 2. Numerical Reasoning (Number Series)
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
    correctAnswerIndex: 2,
     category: 8 // 8. Perceptual Speed (Matching)
  },
    {
    question: '21. Misalkan anda menyusun kata berikut menjadi kalimat lengkap. Jika kalimat ini merupakan pernyataan yang BENAR, tulislah (B). Jika SALAH, tulislah (S).\n"semua adalah Orang Amerika negara-negara dari warga negara"',
    answers: [
      { text: '(B)', correct: false },
      { text: '(S)', correct: true }
    ],
    correctAnswerIndex: 1,
     category: 5 // 5. Verbal Reasoning (Sentence Logic)
  },
    {
    question: '22. ANGGAPLAH dua pernyataan pertama adalah BENAR. Apakah pernyataan terakhir: "Semua lelaki berkepala merah menyukai permen. Charles berkepala merah. Charles menyukai permen."',
    answers: [
      { text: '1. Benar', correct: true },
      { text: '2. Salah', correct: false },
      { text: '3. Tidak tahu', correct: false }
    ],
    correctAnswerIndex: 0,
    category: 4 // 4. Logical Reasoning (Deductive Reasoning)
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
        correctAnswerIndex: 1,
      category: 7 // 7. Verbal Reasoning (Meaning interpretation)
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
    correctAnswerIndex: 2,
    category: 6 // 6. Numerical Reasoning (Problem Solving)
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
    correctAnswerIndex: 2,
    category: 6 // 6. Numerical Reasoning (Problem Solving)
  },
  {
    question: '26. ANGGAPLAH dua pernyataan pertama ini BENAR. Apakah pertanyaan terakhir: "Semua pemimpin progresif. Sebagian besar pemimpin adalah wiraswastawan. Orang yang progresif adalah wiraswastawan"',
    answers: [
      { text: '1. Benar', correct: true },
      { text: '2. Salah', correct: false },
      { text: '3. Tidak tahu', correct: false }
    ],
    correctAnswerIndex: 0,
    category: 4 // 4. Logical Reasoning (Deductive Reasoning)
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
    correctAnswerIndex: 1,
     category: 6 // 6. Numerical Reasoning (Problem Solving)
  },
   {
    question: '28. Apakah MAKNA kalimat berikut ini: "Setiap buah labu dikenal dari akarnya. Anak persis seperti ayahnya"',
    answers: [
      { text: '1. Sama', correct: true },
      { text: '2. Berarti berlawanan', correct: false },
      { text: '3. Tidak sama atau berlawanan', correct: false }
    ],
    correctAnswerIndex: 0,
    category: 7 // 7. Verbal Reasoning (Meaning interpretation)
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
    correctAnswerIndex: 2,
    category: 6 // 6. Numerical Reasoning (Problem Solving)
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
    correctAnswerIndex: 3,
    category: 8 // 8. Perceptual Speed (Matching)
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
    correctAnswerIndex: 2,
      category: 6 // 6. Numerical Reasoning (Problem Solving)
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
    correctAnswerIndex: 3,
    category: 3 // 3. Logical Reasoning (Odd One Out)
  },
  {
    question: '33. ANGGAPLAH dua pernyataan pertama BENAR. Apakah pernyataan terakhir: "Bert memberi salam pada Alice. Alice memberi salam pada Lou. Bert tidak memberi salam pada Lou."',
    answers: [
      { text: '1. Benar', correct: false },
      { text: '2. Salah', correct: true },
      { text: '3. Tidak tahu', correct: false }
    ],
    correctAnswerIndex: 1,
     category: 4 // 4. Logical Reasoning (Deductive Reasoning)
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
    correctAnswerIndex: 3,
    category: 2 // 2. Numerical Reasoning (Number Series)
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
    correctAnswerIndex: 2,
      category: 6 // 6. Numerical Reasoning (Problem Solving)
  },
  {
    question: '36. Apakah ARTI dari kalimat ini: "Meski jauh sahabat dapat sejalan. Sahabat merupakan satu jiwa dalam dua badan."',
    answers: [
      { text: '1. Sama', correct: true },
      { text: '2. Berlawanan', correct: false },
      { text: '3. Tidak sama atau berlawanan', correct: false }
    ],
    correctAnswerIndex: 0,
    category: 7 // 7. Verbal Reasoning (Meaning interpretation)
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
    correctAnswerIndex: 0,
    category: 6 // 6. Numerical Reasoning (Problem Solving)
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
    correctAnswerIndex: 4,
    category: 2 // 2. Numerical Reasoning (Number Series)
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
    correctAnswerIndex: 0,
    category: 6 // 6. Numerical Reasoning (Problem Solving)
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
    correctAnswerIndex: 3,
    category: 2 // 2. Numerical Reasoning (Number Series)
  },
    {
    question: '42. CENSOR CENSURE. Apakah kata-kata ini:',
    answers: [
      { text: '1. Memiliki arti sama', correct: true },
      { text: '2. Memiliki arti berlawanan', correct: false },
      { text: '3. Tidak memiliki arti sama atau berlawanan', correct: false }
    ],
    correctAnswerIndex: 0,
     category: 1 // 1. Vocabulary/Verbal Reasoning (Synonym)
  },
  {
    question: '43. Apakah MAKNA dari kalimat ini: "Sebuah kepingan jatuh dari balok tua. Anak pengemis pamer layaknya teman."',
    answers: [
      { text: '1. Sama', correct: false },
      { text: '2. Berlawanan', correct: false },
      { text: '3. Tidak sama atau berlawanan', correct: true }
    ],
    correctAnswerIndex: 2,
      category: 7 // 7. Verbal Reasoning (Meaning interpretation)
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
    correctAnswerIndex: 1,
    category: 6 // 6. Numerical Reasoning (Problem Solving)
  },
    {
    question: '45. Apakah ARTI dari kalimat berikut: "Orang yang menuntut, tidak memerintah. Orang yang mengabaikan keinginannya masih memakai pendapat sendiri."',
    answers: [
      { text: '1. Sama', correct: false },
      { text: '2. Berlawanan', correct: false },
      { text: '3. Tidak sama atau berlawanan', correct: true }
    ],
    correctAnswerIndex: 2,
     category: 7 // 7. Verbal Reasoning (Meaning interpretation)
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
    correctAnswerIndex: 2,
    category: 6 // 6. Numerical Reasoning (Problem Solving)
  },
  {
    question: '47. Apakah ARTI dari kalimat berikut: "Dimana ada keinginan, disitu ada jalan. Raja menjual segala hal untuk kerja keras."',
    answers: [
      { text: '1. Sama', correct: false },
      { text: '2. Berlawanan', correct: false },
      { text: '3. Tidak sama atau berlawanan', correct: true }
    ],
    correctAnswerIndex: 2,
     category: 7 // 7. Verbal Reasoning (Meaning interpretation)
  },
   {
    question: '48. Jumlah jam pada saat TERANG dan GELAP hampir SAMA pada bulan:',
    answers: [
      { text: '1. Juni', correct: false },
      { text: '2. September', correct: true },
      { text: '3. Mei', correct: false },
      { text: '4. Desember', correct: false }
    ],
    correctAnswerIndex: 1,
     category: 9 // 9. General Knowledge
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
    correctAnswerIndex: 1,
     category: 6 // 6. Numerical Reasoning (Problem Solving)
  }
];

export default questions;