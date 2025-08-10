# AI Question Generation Training System

Sistem pelatihan AI untuk menghasilkan soal ujian yang berkualitas tinggi dan sesuai dengan kurikulum Indonesia.

## 📁 Struktur File

```
src/ai/training/
├── README.md                           # Dokumentasi ini
├── question-generation-prompts.ts      # Prompt dasar dan panduan
├── subject-examples.ts                 # Contoh soal komprehensif
├── training-config.ts                  # Konfigurasi dan manager
├── test-training.ts                    # File testing
└── generate-exam-questions-enhanced.ts # Flow AI yang sudah dilatih
```

## 🚀 Cara Menggunakan

### 1. Menggunakan AI Flow yang Sudah Dilatih

```typescript
import { generateExamQuestionsEnhanced } from '../flows/generate-exam-questions-enhanced';

const config = {
  subject: 'matematika',
  gradeLevel: 'smp',
  difficulty: 'sedang',
  questionCount: 5,
  topic: 'Aljabar Linear'
};

const result = await generateExamQuestionsEnhanced(config);
console.log(result.questions);
```

### 2. Testing Sistem Training

```bash
# Jalankan test untuk memvalidasi sistem
npm run dev
# Kemudian di terminal lain:
npx tsx src/ai/training/test-training.ts
```

### 3. Menambah Data Training Baru

Edit file `subject-examples.ts` untuk menambah contoh soal:

```typescript
export const COMPREHENSIVE_TRAINING_DATA = {
  // Tambahkan mata pelajaran baru
  "mata-pelajaran-baru": {
    sd: [
      {
        question: "Pertanyaan untuk SD...",
        options: ["A. Pilihan 1", "B. Pilihan 2", "C. Pilihan 3", "D. Pilihan 4"],
        correct_answer: "A",
        explanation: "Penjelasan...",
        difficulty: "mudah",
        bloom_taxonomy: "mengingat"
      }
    ]
  }
};
```

## 🎯 Fitur Utama

### 1. Prompt Engineering yang Canggih
- **System Prompt**: Panduan dasar untuk AI
- **Subject-Specific Prompts**: Panduan khusus per mata pelajaran
- **Grade Level Adjustments**: Penyesuaian tingkat kelas
- **Difficulty Guidelines**: Panduan tingkat kesulitan

### 2. Comprehensive Training Data
- **9 Mata Pelajaran**: Matematika, Fisika, Kimia, Biologi, Bahasa Indonesia, Bahasa Inggris, Sejarah, Geografi, PKN
- **3 Tingkat Pendidikan**: SD, SMP, SMA
- **3 Level Kesulitan**: Mudah, Sedang, Sulit
- **Taksonomi Bloom**: 6 level kognitif

### 3. Quality Validation
- **Format Validation**: Memastikan format soal benar
- **Content Quality**: Validasi kualitas konten
- **Auto-Fix**: Perbaikan otomatis untuk kesalahan umum
- **Fallback System**: Sistem cadangan jika AI gagal

### 4. Intelligent Configuration
- **Dynamic Prompts**: Prompt yang disesuaikan dengan konfigurasi
- **Context-Aware**: Mempertimbangkan konteks budaya Indonesia
- **Curriculum Aligned**: Sesuai kurikulum Indonesia

## 📊 Mata Pelajaran yang Didukung

| Mata Pelajaran | Key | Tingkat | Status |
|----------------|-----|---------|--------|
| Matematika | `matematika` | SD, SMP, SMA | ✅ |
| Fisika | `fisika` | SMP, SMA | ✅ |
| Kimia | `kimia` | SMP, SMA | ✅ |
| Biologi | `biologi` | SMP, SMA | ✅ |
| Bahasa Indonesia | `bahasa-indonesia` | SD, SMP, SMA | ✅ |
| Bahasa Inggris | `bahasa-inggris` | SMP, SMA | ✅ |
| Sejarah | `sejarah` | SMP, SMA | ✅ |
| Geografi | `geografi` | SMP, SMA | ✅ |
| PKN | `pkn` | SMP, SMA | ✅ |

## 🔧 Konfigurasi

### QuestionGenerationConfig

```typescript
interface QuestionGenerationConfig {
  subject: string;                    // Mata pelajaran
  gradeLevel: 'sd' | 'smp' | 'sma';  // Tingkat pendidikan
  difficulty: 'mudah' | 'sedang' | 'sulit'; // Kesulitan
  questionCount: number;              // Jumlah soal (1-20)
  topic?: string;                     // Topik spesifik (opsional)
  bloomTaxonomy?: string[];           // Level Bloom (opsional)
}
```

### Contoh Penggunaan

```typescript
// Soal matematika SMP level sedang
const mathConfig = {
  subject: 'matematika',
  gradeLevel: 'smp',
  difficulty: 'sedang',
  questionCount: 3,
  topic: 'Persamaan Linear'
};

// Soal fisika SMA level sulit
const physicsConfig = {
  subject: 'fisika',
  gradeLevel: 'sma',
  difficulty: 'sulit',
  questionCount: 2,
  topic: 'Dinamika Partikel',
  bloomTaxonomy: ['menganalisis', 'mengevaluasi']
};
```

## 📈 Quality Metrics

Sistem menghasilkan metrics kualitas:

```typescript
{
  questions: GeneratedQuestion[],     // Soal yang dihasilkan
  metadata: {
    totalGenerated: number,           // Total soal berhasil dibuat
    qualityScore: number,             // Skor kualitas (0-1)
    processingTime: number,           // Waktu pemrosesan (ms)
    config: QuestionGenerationConfig  // Konfigurasi yang digunakan
  }
}
```

## 🛠️ Pengembangan

### Menambah Mata Pelajaran Baru

1. **Tambah di `SUBJECT_PROMPTS`**:
```typescript
"mata-pelajaran-baru": `Panduan khusus untuk mata pelajaran baru...`
```

2. **Tambah contoh di `COMPREHENSIVE_TRAINING_DATA`**:
```typescript
"mata-pelajaran-baru": {
  smp: [/* contoh soal */],
  sma: [/* contoh soal */]
}
```

3. **Update `getSubjectList()`**:
```typescript
{ key: 'mata-pelajaran-baru', name: 'Mata Pelajaran Baru' }
```

### Meningkatkan Kualitas

1. **Tambah lebih banyak contoh** di `subject-examples.ts`
2. **Perbaiki prompt** di `question-generation-prompts.ts`
3. **Tambah validasi** di `validateQuestion()` method
4. **Update quality criteria** sesuai kebutuhan

## 🧪 Testing

```bash
# Test prompt generation
npm run test:prompts

# Test training examples
npm run test:examples

# Test validation
npm run test:validation

# Test full AI generation (requires AI service)
npm run test:ai
```

## 📝 Best Practices

1. **Selalu validasi** soal yang dihasilkan
2. **Gunakan contoh berkualitas** dalam training data
3. **Sesuaikan dengan kurikulum** Indonesia
4. **Pertimbangkan konteks budaya** siswa Indonesia
5. **Test secara berkala** untuk memastikan kualitas

## 🔍 Troubleshooting

### AI Tidak Menghasilkan Soal
- Pastikan AI service berjalan
- Cek konfigurasi Genkit
- Periksa format prompt

### Kualitas Soal Rendah
- Tambah lebih banyak contoh training
- Perbaiki prompt untuk mata pelajaran spesifik
- Sesuaikan parameter AI (temperature, topP)

### Validasi Gagal
- Periksa format pilihan jawaban
- Pastikan jawaban benar valid (A/B/C/D)
- Cek panjang pilihan jawaban

## 📚 Referensi

- [Taksonomi Bloom](https://en.wikipedia.org/wiki/Bloom%27s_taxonomy)
- [Kurikulum Indonesia](https://kurikulum.kemdikbud.go.id/)
- [Google Genkit Documentation](https://firebase.google.com/docs/genkit)
- [Zod Validation](https://zod.dev/)

---

**Dibuat untuk Examplify - Platform Ujian Berbasis AI** 🎓