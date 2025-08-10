/**
 * Comprehensive training examples for different subjects and grade levels
 * This file contains high-quality question examples to train the AI
 */

export const COMPREHENSIVE_TRAINING_DATA = {
  matematika: {
    sd: [
      {
        question: "Pak Ahmad memiliki 48 buah jeruk. Jeruk tersebut akan dimasukkan ke dalam kotak. Setiap kotak dapat menampung 8 buah jeruk. Berapa kotak yang dibutuhkan Pak Ahmad?",
        options: ["A. 5 kotak", "B. 6 kotak", "C. 7 kotak", "D. 8 kotak"],
        correct_answer: "B",
        explanation: "48 ÷ 8 = 6. Jadi Pak Ahmad membutuhkan 6 kotak untuk menampung semua jeruk.",
        difficulty: "mudah",
        bloom_taxonomy: "menerapkan"
      },
      {
        question: "Luas sebuah persegi adalah 36 cm². Berapa panjang sisi persegi tersebut?",
        options: ["A. 4 cm", "B. 5 cm", "C. 6 cm", "D. 9 cm"],
        correct_answer: "C",
        explanation: "Luas persegi = sisi × sisi. Jika luas = 36 cm², maka sisi = √36 = 6 cm.",
        difficulty: "sedang",
        bloom_taxonomy: "menerapkan"
      }
    ],
    smp: [
      {
        question: "Diketahui fungsi f(x) = 2x + 3. Nilai f(5) adalah...",
        options: ["A. 10", "B. 11", "C. 13", "D. 15"],
        correct_answer: "C",
        explanation: "f(5) = 2(5) + 3 = 10 + 3 = 13",
        difficulty: "mudah",
        bloom_taxonomy: "menerapkan"
      },
      {
        question: "Sebuah segitiga memiliki sisi-sisi dengan panjang 3 cm, 4 cm, dan 5 cm. Jenis segitiga tersebut adalah...",
        options: ["A. Segitiga lancip", "B. Segitiga tumpul", "C. Segitiga siku-siku", "D. Segitiga sama sisi"],
        correct_answer: "C",
        explanation: "Karena 3² + 4² = 9 + 16 = 25 = 5², maka segitiga tersebut memenuhi teorema Pythagoras dan merupakan segitiga siku-siku.",
        difficulty: "sedang",
        bloom_taxonomy: "menganalisis"
      }
    ],
    sma: [
      {
        question: "Limit dari (x² - 4)/(x - 2) ketika x mendekati 2 adalah...",
        options: ["A. 0", "B. 2", "C. 4", "D. Tidak terdefinisi"],
        correct_answer: "C",
        explanation: "Dengan memfaktorkan: (x² - 4)/(x - 2) = (x + 2)(x - 2)/(x - 2) = x + 2. Ketika x → 2, maka limitnya = 2 + 2 = 4.",
        difficulty: "sedang",
        bloom_taxonomy: "menerapkan"
      }
    ]
  },

  fisika: {
    smp: [
      {
        question: "Sebuah mobil bergerak dengan kecepatan 72 km/jam. Kecepatan mobil tersebut dalam satuan m/s adalah...",
        options: ["A. 15 m/s", "B. 20 m/s", "C. 25 m/s", "D. 30 m/s"],
        correct_answer: "B",
        explanation: "72 km/jam = 72 × (1000 m)/(3600 s) = 72 × 5/18 = 20 m/s",
        difficulty: "mudah",
        bloom_taxonomy: "menerapkan"
      },
      {
        question: "Gaya yang diperlukan untuk mengangkat beban 50 N dengan menggunakan katrol tetap adalah...",
        options: ["A. 25 N", "B. 50 N", "C. 75 N", "D. 100 N"],
        correct_answer: "B",
        explanation: "Katrol tetap tidak memberikan keuntungan mekanis, sehingga gaya yang diperlukan sama dengan berat beban, yaitu 50 N.",
        difficulty: "sedang",
        bloom_taxonomy: "memahami"
      }
    ],
    sma: [
      {
        question: "Sebuah benda bermassa 2 kg bergerak dengan kecepatan 10 m/s. Energi kinetik benda tersebut adalah...",
        options: ["A. 50 J", "B. 100 J", "C. 150 J", "D. 200 J"],
        correct_answer: "B",
        explanation: "Energi kinetik = ½mv² = ½ × 2 × 10² = ½ × 2 × 100 = 100 J",
        difficulty: "mudah",
        bloom_taxonomy: "menerapkan"
      }
    ]
  },

  kimia: {
    smp: [
      {
        question: "Rumus kimia untuk air adalah...",
        options: ["A. H₂O", "B. CO₂", "C. NaCl", "D. CaCO₃"],
        correct_answer: "A",
        explanation: "Air terdiri dari 2 atom hidrogen (H) dan 1 atom oksigen (O), sehingga rumus kimianya adalah H₂O.",
        difficulty: "mudah",
        bloom_taxonomy: "mengingat"
      },
      {
        question: "Perubahan wujud dari gas menjadi cair disebut...",
        options: ["A. Penguapan", "B. Kondensasi", "C. Sublimasi", "D. Deposisi"],
        correct_answer: "B",
        explanation: "Kondensasi adalah perubahan wujud dari gas menjadi cair, seperti uap air yang berubah menjadi tetesan air.",
        difficulty: "mudah",
        bloom_taxonomy: "mengingat"
      }
    ],
    sma: [
      {
        question: "Dalam reaksi: 2H₂ + O₂ → 2H₂O, perbandingan mol H₂ : O₂ : H₂O adalah...",
        options: ["A. 1 : 1 : 1", "B. 2 : 1 : 2", "C. 2 : 2 : 2", "D. 1 : 2 : 1"],
        correct_answer: "B",
        explanation: "Dari persamaan reaksi yang sudah setara, koefisien menunjukkan perbandingan mol: 2 mol H₂ : 1 mol O₂ : 2 mol H₂O = 2 : 1 : 2",
        difficulty: "sedang",
        bloom_taxonomy: "menganalisis"
      }
    ]
  },

  biologi: {
    smp: [
      {
        question: "Organ yang berfungsi sebagai alat peredaran darah pada manusia adalah...",
        options: ["A. Paru-paru", "B. Jantung", "C. Ginjal", "D. Hati"],
        correct_answer: "B",
        explanation: "Jantung adalah organ yang memompa darah ke seluruh tubuh melalui pembuluh darah, sehingga berfungsi sebagai alat peredaran darah.",
        difficulty: "mudah",
        bloom_taxonomy: "mengingat"
      },
      {
        question: "Proses fotosintesis pada tumbuhan menghasilkan...",
        options: ["A. Oksigen dan glukosa", "B. Karbon dioksida dan air", "C. Nitrogen dan oksigen", "D. Air dan karbon dioksida"],
        correct_answer: "A",
        explanation: "Fotosintesis adalah proses pembuatan makanan oleh tumbuhan dengan bantuan cahaya matahari, menghasilkan oksigen (O₂) dan glukosa (C₆H₁₂O₆).",
        difficulty: "sedang",
        bloom_taxonomy: "memahami"
      }
    ],
    sma: [
      {
        question: "Tahap pembelahan sel yang ditandai dengan kromosom berjajar di bidang ekuator adalah...",
        options: ["A. Profase", "B. Metafase", "C. Anafase", "D. Telofase"],
        correct_answer: "B",
        explanation: "Metafase adalah tahap dimana kromosom berjajar rapi di bidang ekuator sel, siap untuk dipisahkan ke kutub-kutub sel.",
        difficulty: "sedang",
        bloom_taxonomy: "memahami"
      }
    ]
  },

  "bahasa-indonesia": {
    sd: [
      {
        question: "Kata yang tepat untuk melengkapi kalimat 'Adik ... ke sekolah setiap hari' adalah...",
        options: ["A. pergi", "B. pulang", "C. datang", "D. kembali"],
        correct_answer: "A",
        explanation: "Kata 'pergi' paling tepat karena menunjukkan aktivitas berangkat dari rumah menuju sekolah.",
        difficulty: "mudah",
        bloom_taxonomy: "menerapkan"
      }
    ],
    smp: [
      {
        question: "Bacalah pantun berikut!\n\nBuah mangga masih di pohon\nBelum masak rasanya masam\nJika kita rajin belajar\nCita-cita pasti tercapai\n\nMakna pantun tersebut adalah...",
        options: [
          "A. Buah mangga yang masam tidak enak dimakan",
          "B. Kita harus sabar menunggu buah mangga masak",
          "C. Kerajinan belajar akan mengantarkan pada kesuksesan",
          "D. Cita-cita harus realistis agar mudah tercapai"
        ],
        correct_answer: "C",
        explanation: "Pantun tersebut menggunakan sampiran tentang buah mangga untuk menyampaikan isi bahwa kerajinan belajar akan mengantarkan seseorang meraih cita-citanya.",
        difficulty: "sedang",
        bloom_taxonomy: "memahami"
      }
    ],
    sma: [
      {
        question: "Cermati kalimat berikut!\n\n'Meskipun hujan deras, para siswa tetap semangat mengikuti upacara bendera.'\n\nKonjungsi yang digunakan dalam kalimat tersebut menyatakan hubungan...",
        options: ["A. Sebab-akibat", "B. Pertentangan", "C. Syarat", "D. Tujuan"],
        correct_answer: "B",
        explanation: "Konjungsi 'meskipun' menyatakan hubungan pertentangan, menunjukkan bahwa meski ada halangan (hujan deras), tetapi kegiatan tetap dilakukan.",
        difficulty: "sedang",
        bloom_taxonomy: "menganalisis"
      }
    ]
  },

  "bahasa-inggris": {
    smp: [
      {
        question: "Choose the correct answer to complete the sentence:\n'She ... to school every day.'\n\nPilih jawaban yang tepat untuk melengkapi kalimat tersebut:",
        options: ["A. go", "B. goes", "C. going", "D. gone"],
        correct_answer: "B",
        explanation: "Untuk subjek orang ketiga tunggal (she) dalam simple present tense, kata kerja harus ditambah 's' atau 'es'. Jadi 'go' menjadi 'goes'.",
        difficulty: "mudah",
        bloom_taxonomy: "menerapkan"
      },
      {
        question: "Read the text below!\n\n'My name is Sarah. I am 14 years old. I live in Jakarta with my family. I have one brother and one sister.'\n\nHow many siblings does Sarah have?\n\nBerdasarkan teks di atas, berapa jumlah saudara kandung Sarah?",
        options: ["A. One", "B. Two", "C. Three", "D. Four"],
        correct_answer: "B",
        explanation: "Sarah memiliki satu saudara laki-laki (one brother) dan satu saudara perempuan (one sister), jadi total dua saudara kandung.",
        difficulty: "mudah",
        bloom_taxonomy: "memahami"
      }
    ]
  },

  sejarah: {
    smp: [
      {
        question: "Proklamasi kemerdekaan Indonesia dibacakan pada tanggal...",
        options: ["A. 16 Agustus 1945", "B. 17 Agustus 1945", "C. 18 Agustus 1945", "D. 19 Agustus 1945"],
        correct_answer: "B",
        explanation: "Proklamasi kemerdekaan Indonesia dibacakan oleh Ir. Soekarno pada tanggal 17 Agustus 1945 di Jalan Pegangsaan Timur 56, Jakarta.",
        difficulty: "mudah",
        bloom_taxonomy: "mengingat"
      },
      {
        question: "Faktor utama yang mendorong bangsa Eropa melakukan penjelajahan samudra pada abad ke-15 adalah...",
        options: [
          "A. Mencari daerah jajahan baru",
          "B. Menyebarkan agama Kristen",
          "C. Mencari rempah-rempah dan emas",
          "D. Mengembangkan ilmu pengetahuan"
        ],
        correct_answer: "C",
        explanation: "Faktor utama penjelajahan samudra adalah motif ekonomi, yaitu mencari rempah-rempah yang sangat berharga dan emas (gold, glory, gospel).",
        difficulty: "sedang",
        bloom_taxonomy: "memahami"
      }
    ]
  },

  geografi: {
    smp: [
      {
        question: "Benua yang memiliki luas wilayah terbesar di dunia adalah...",
        options: ["A. Afrika", "B. Amerika", "C. Asia", "D. Eropa"],
        correct_answer: "C",
        explanation: "Benua Asia memiliki luas sekitar 44,6 juta km², menjadikannya benua terluas di dunia, mencakup sekitar 30% dari total luas daratan bumi.",
        difficulty: "mudah",
        bloom_taxonomy: "mengingat"
      },
      {
        question: "Indonesia terletak di antara dua samudra, yaitu...",
        options: [
          "A. Samudra Hindia dan Samudra Pasifik",
          "B. Samudra Atlantik dan Samudra Hindia",
          "C. Samudra Pasifik dan Samudra Atlantik",
          "D. Samudra Arktik dan Samudra Hindia"
        ],
        correct_answer: "A",
        explanation: "Indonesia terletak di antara Samudra Hindia (di sebelah selatan dan barat) dan Samudra Pasifik (di sebelah utara dan timur).",
        difficulty: "mudah",
        bloom_taxonomy: "mengingat"
      }
    ]
  },

  pkn: {
    smp: [
      {
        question: "Pancasila sebagai dasar negara Indonesia terdiri dari ... sila.",
        options: ["A. 3", "B. 4", "C. 5", "D. 6"],
        correct_answer: "C",
        explanation: "Pancasila terdiri dari 5 sila, yaitu: 1) Ketuhanan Yang Maha Esa, 2) Kemanusiaan yang adil dan beradab, 3) Persatuan Indonesia, 4) Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan, 5) Keadilan sosial bagi seluruh rakyat Indonesia.",
        difficulty: "mudah",
        bloom_taxonomy: "mengingat"
      },
      {
        question: "Contoh penerapan sila kedua Pancasila dalam kehidupan sehari-hari adalah...",
        options: [
          "A. Melaksanakan ibadah sesuai agama masing-masing",
          "B. Membantu korban bencana alam tanpa membedakan suku dan agama",
          "C. Mengutamakan kepentingan bangsa di atas kepentingan pribadi",
          "D. Menyelesaikan masalah dengan musyawarah mufakat"
        ],
        correct_answer: "B",
        explanation: "Sila kedua 'Kemanusiaan yang adil dan beradab' diwujudkan dengan sikap memanusiakan manusia, seperti membantu sesama tanpa membedakan latar belakang.",
        difficulty: "sedang",
        bloom_taxonomy: "menerapkan"
      }
    ]
  }
};

// Additional training patterns for specific question types
export const QUESTION_PATTERNS = {
  // Pattern for calculation-based questions
  calculation: {
    template: "Sebuah [objek] memiliki [properti1] sebesar [nilai1] dan [properti2] sebesar [nilai2]. [Pertanyaan kalkulasi]?",
    example: "Sebuah persegi panjang memiliki panjang 12 cm dan lebar 8 cm. Berapa keliling persegi panjang tersebut?"
  },
  
  // Pattern for definition questions
  definition: {
    template: "[Konsep/istilah] adalah...",
    example: "Fotosintesis adalah..."
  },
  
  // Pattern for comparison questions
  comparison: {
    template: "Perbedaan antara [konsep1] dan [konsep2] adalah...",
    example: "Perbedaan antara mitosis dan meiosis adalah..."
  },
  
  // Pattern for application questions
  application: {
    template: "Dalam situasi [konteks], penerapan [konsep] yang tepat adalah...",
    example: "Dalam kehidupan sehari-hari, penerapan hukum Archimedes yang tepat adalah..."
  },
  
  // Pattern for analysis questions
  analysis: {
    template: "Berdasarkan [data/informasi], dapat disimpulkan bahwa...",
    example: "Berdasarkan grafik pertumbuhan penduduk, dapat disimpulkan bahwa..."
  }
};

// Quality indicators for good questions
export const QUALITY_INDICATORS = {
  good_practices: [
    "Menggunakan konteks yang familiar bagi siswa Indonesia",
    "Bahasa yang jelas dan tidak ambigu",
    "Pilihan jawaban yang seimbang panjangnya",
    "Distractor yang masuk akal dan menguji pemahaman",
    "Penjelasan yang edukatif dan mudah dipahami",
    "Sesuai dengan tingkat kognitif siswa",
    "Menggunakan satuan dan notasi yang benar"
  ],
  
  avoid: [
    "Pertanyaan yang terlalu panjang dan berbelit-belit",
    "Pilihan jawaban yang memberikan petunjuk gramatikal",
    "Menggunakan 'semua benar' atau 'tidak ada yang benar'",
    "Konteks yang tidak relevan dengan budaya Indonesia",
    "Bahasa yang terlalu formal atau terlalu informal",
    "Soal yang hanya menguji hafalan tanpa pemahaman",
    "Pilihan jawaban yang terlalu mirip satu sama lain"
  ]
};