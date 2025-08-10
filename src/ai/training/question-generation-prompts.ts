/**
 * Training data and custom prompts for AI question generation
 * This file contains structured prompts and examples to improve question quality
 */

export const QUESTION_GENERATION_PROMPTS = {
  // Base system prompt for question generation
  SYSTEM_PROMPT: `Anda adalah seorang ahli pendidikan yang bertugas membuat soal ujian berkualitas tinggi. 
Tugas Anda adalah membuat soal pilihan ganda yang:
1. Sesuai dengan kurikulum Indonesia
2. Menggunakan Bahasa Indonesia yang baik dan benar
3. Memiliki tingkat kesulitan yang sesuai dengan jenjang pendidikan
4. Menguji pemahaman konsep, bukan hanya hafalan
5. Memiliki pilihan jawaban yang logis dan tidak ambigu

Format output harus dalam JSON dengan struktur:
{
  "question": "Pertanyaan lengkap",
  "options": ["A. Pilihan 1", "B. Pilihan 2", "C. Pilihan 3", "D. Pilihan 4"],
  "correct_answer": "A",
  "explanation": "Penjelasan mengapa jawaban tersebut benar",
  "difficulty": "mudah|sedang|sulit",
  "bloom_taxonomy": "mengingat|memahami|menerapkan|menganalisis|mengevaluasi|mencipta"
}`,

  // Subject-specific prompts
  SUBJECT_PROMPTS: {
    matematika: `Fokus pada konsep matematika yang fundamental. Gunakan contoh nyata dan aplikatif. 
Pastikan perhitungan dapat diselesaikan tanpa kalkulator untuk tingkat dasar.
Sertakan langkah-langkah penyelesaian dalam penjelasan.`,

    fisika: `Tekankan pada pemahaman konsep fisika dan aplikasinya dalam kehidupan sehari-hari.
Gunakan rumus yang sesuai dengan tingkat pendidikan.
Sertakan satuan yang benar dalam soal dan jawaban.`,

    kimia: `Fokus pada konsep dasar kimia, reaksi, dan sifat-sifat zat.
Gunakan notasi kimia yang benar dan standar.
Berikan konteks aplikasi dalam kehidupan sehari-hari.`,

    biologi: `Tekankan pada pemahaman sistem kehidupan dan proses biologis.
Gunakan terminologi ilmiah yang tepat.
Hubungkan dengan fenomena alam yang dapat diamati siswa.`,

    "bahasa-indonesia": `Fokus pada tata bahasa, pemahaman teks, dan keterampilan berbahasa.
Gunakan teks yang sesuai dengan tingkat perkembangan siswa.
Sertakan konteks budaya Indonesia yang relevan.`,

    "bahasa-inggris": `Tekankan pada grammar, vocabulary, dan reading comprehension.
Gunakan konteks yang familiar bagi siswa Indonesia.
Berikan penjelasan dalam Bahasa Indonesia untuk clarity.`,

    sejarah: `Fokus pada peristiwa sejarah Indonesia dan dunia yang penting.
Hubungkan dengan konteks masa kini.
Gunakan kronologi yang jelas dan akurat.`,

    geografi: `Tekankan pada pemahaman fenomena geografi Indonesia dan dunia.
Gunakan contoh lokasi yang familiar bagi siswa.
Sertakan aspek fisik dan sosial geografi.`,

    pkn: `Fokus pada nilai-nilai Pancasila, konstitusi, dan kewarganegaraan.
Gunakan contoh kasus yang relevan dengan kehidupan siswa.
Tekankan pada penerapan nilai-nilai dalam kehidupan sehari-hari.`
  },

  // Grade level adjustments
  GRADE_LEVEL_PROMPTS: {
    sd: `Gunakan bahasa yang sederhana dan mudah dipahami anak SD.
Berikan contoh konkret yang dekat dengan pengalaman anak.
Hindari konsep abstrak yang terlalu kompleks.`,

    smp: `Sesuaikan dengan perkembangan kognitif remaja awal.
Mulai perkenalkan konsep abstrak dengan bantuan contoh konkret.
Gunakan konteks yang relevan dengan kehidupan remaja.`,

    sma: `Gunakan tingkat kompleksitas yang sesuai untuk persiapan perguruan tinggi.
Tekankan pada analisis dan sintesis informasi.
Hubungkan dengan isu-isu kontemporer dan aplikasi praktis.`
  },

  // Difficulty level guidelines
  DIFFICULTY_GUIDELINES: {
    mudah: `Soal tingkat mudah harus:
- Menguji ingatan dan pemahaman dasar
- Menggunakan informasi yang langsung tersedia
- Memiliki satu jawaban yang jelas dan tidak ambigu
- Dapat dijawab dengan pengetahuan faktual`,

    sedang: `Soal tingkat sedang harus:
- Menguji kemampuan aplikasi dan analisis
- Memerlukan pemahaman konsep untuk menjawab
- Menghubungkan beberapa informasi
- Memiliki distractor yang masuk akal`,

    sulit: `Soal tingkat sulit harus:
- Menguji kemampuan evaluasi dan sintesis
- Memerlukan pemikiran kritis dan analisis mendalam
- Menggabungkan multiple konsep
- Memiliki distractor yang sophisticated`
  }
};

// Example training data for different subjects and levels
export const TRAINING_EXAMPLES = {
  matematika: {
    sd: [
      {
        question: "Ibu membeli 24 buah apel. Apel tersebut akan dibagikan sama rata kepada 6 orang anak. Berapa buah apel yang diterima setiap anak?",
        options: ["A. 3 buah", "B. 4 buah", "C. 5 buah", "D. 6 buah"],
        correct_answer: "B",
        explanation: "24 ÷ 6 = 4. Jadi setiap anak mendapat 4 buah apel.",
        difficulty: "mudah",
        bloom_taxonomy: "menerapkan"
      }
    ],
    smp: [
      {
        question: "Sebuah persegi panjang memiliki panjang (2x + 3) cm dan lebar (x - 1) cm. Jika keliling persegi panjang tersebut adalah 28 cm, maka nilai x adalah...",
        options: ["A. 4", "B. 5", "C. 6", "D. 7"],
        correct_answer: "B",
        explanation: "Keliling = 2(p + l) = 2((2x + 3) + (x - 1)) = 2(3x + 2) = 6x + 4 = 28, maka 6x = 24, sehingga x = 4. Namun perlu dicek: jika x = 4, lebar = 3 cm (positif). Jadi x = 5 memberikan lebar = 4 cm.",
        difficulty: "sedang",
        bloom_taxonomy: "menerapkan"
      }
    ]
  },

  fisika: {
    smp: [
      {
        question: "Sebuah benda bergerak dengan kecepatan tetap 20 m/s. Jarak yang ditempuh benda tersebut dalam waktu 5 sekon adalah...",
        options: ["A. 4 m", "B. 25 m", "C. 100 m", "D. 400 m"],
        correct_answer: "C",
        explanation: "Jarak = kecepatan × waktu = 20 m/s × 5 s = 100 m",
        difficulty: "mudah",
        bloom_taxonomy: "menerapkan"
      }
    ]
  },

  "bahasa-indonesia": {
    smp: [
      {
        question: "Bacalah paragraf berikut!\n\n'Sampah plastik menjadi masalah serius bagi lingkungan. Plastik membutuhkan waktu ratusan tahun untuk terurai. Oleh karena itu, kita harus mengurangi penggunaan plastik sekali pakai.'\n\nIde pokok paragraf tersebut adalah...",
        options: [
          "A. Plastik membutuhkan waktu lama untuk terurai",
          "B. Sampah plastik adalah masalah lingkungan yang serius",
          "C. Kita harus mengurangi penggunaan plastik",
          "D. Plastik sekali pakai berbahaya bagi lingkungan"
        ],
        correct_answer: "B",
        explanation: "Ide pokok terletak pada kalimat pertama yang menyatakan bahwa sampah plastik menjadi masalah serius bagi lingkungan. Kalimat-kalimat selanjutnya adalah penjelas.",
        difficulty: "sedang",
        bloom_taxonomy: "memahami"
      }
    ]
  }
};

// Quality assessment criteria
export const QUALITY_CRITERIA = {
  question_clarity: "Pertanyaan harus jelas, tidak ambigu, dan mudah dipahami",
  option_quality: "Pilihan jawaban harus logis, seimbang panjangnya, dan tidak ada petunjuk gramatikal",
  distractor_effectiveness: "Pilihan salah harus masuk akal dan menguji pemahaman konsep",
  cultural_relevance: "Konteks soal harus relevan dengan budaya dan pengalaman siswa Indonesia",
  curriculum_alignment: "Soal harus sesuai dengan kurikulum yang berlaku di Indonesia",
  language_appropriateness: "Bahasa yang digunakan sesuai dengan tingkat perkembangan siswa"
};

// Common mistakes to avoid
export const COMMON_MISTAKES = [
  "Menggunakan bahasa yang terlalu kompleks untuk tingkat siswa",
  "Membuat pilihan jawaban yang panjangnya tidak seimbang",
  "Menggunakan 'semua jawaban benar' atau 'tidak ada jawaban yang benar'",
  "Membuat soal yang hanya menguji hafalan tanpa pemahaman",
  "Menggunakan konteks yang tidak familiar bagi siswa Indonesia",
  "Membuat pilihan jawaban yang memberikan petunjuk gramatikal",
  "Menggunakan istilah teknis tanpa penjelasan yang memadai"
];