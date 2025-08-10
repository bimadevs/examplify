/**
 * Training configuration for AI question generation
 * This file defines how the AI should be trained and configured
 */

import { QUESTION_GENERATION_PROMPTS, TRAINING_EXAMPLES, QUALITY_CRITERIA } from './question-generation-prompts';
import { COMPREHENSIVE_TRAINING_DATA, QUESTION_PATTERNS, QUALITY_INDICATORS } from './subject-examples';

export interface QuestionGenerationConfig {
  subject: string;
  gradeLevel: 'sd' | 'smp' | 'sma';
  difficulty: 'mudah' | 'sedang' | 'sulit';
  questionCount: number;
  topic?: string;
  bloomTaxonomy?: string[];
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
  bloom_taxonomy: string;
  subject: string;
  grade_level: string;
  topic?: string;
}

export class QuestionTrainingManager {
  /**
   * Build complete prompt for question generation
   */
  static buildPrompt(config: QuestionGenerationConfig): string {
    const { subject, gradeLevel, difficulty, questionCount, topic } = config;
    
    let prompt = QUESTION_GENERATION_PROMPTS.SYSTEM_PROMPT + "\n\n";
    
    // Add subject-specific guidance
    if (QUESTION_GENERATION_PROMPTS.SUBJECT_PROMPTS[subject as keyof typeof QUESTION_GENERATION_PROMPTS.SUBJECT_PROMPTS]) {
      prompt += "PANDUAN MATA PELAJARAN:\n";
      prompt += QUESTION_GENERATION_PROMPTS.SUBJECT_PROMPTS[subject as keyof typeof QUESTION_GENERATION_PROMPTS.SUBJECT_PROMPTS] + "\n\n";
    }
    
    // Add grade level guidance
    if (QUESTION_GENERATION_PROMPTS.GRADE_LEVEL_PROMPTS[gradeLevel]) {
      prompt += "PANDUAN TINGKAT KELAS:\n";
      prompt += QUESTION_GENERATION_PROMPTS.GRADE_LEVEL_PROMPTS[gradeLevel] + "\n\n";
    }
    
    // Add difficulty guidance
    if (QUESTION_GENERATION_PROMPTS.DIFFICULTY_GUIDELINES[difficulty]) {
      prompt += "PANDUAN TINGKAT KESULITAN:\n";
      prompt += QUESTION_GENERATION_PROMPTS.DIFFICULTY_GUIDELINES[difficulty] + "\n\n";
    }
    
    // Add specific requirements
    prompt += "PERSYARATAN KHUSUS:\n";
    prompt += `- Mata Pelajaran: ${subject}\n`;
    prompt += `- Tingkat: ${gradeLevel.toUpperCase()}\n`;
    prompt += `- Kesulitan: ${difficulty}\n`;
    prompt += `- Jumlah soal: ${questionCount}\n`;
    
    if (topic) {
      prompt += `- Topik: ${topic}\n`;
    }
    
    prompt += "\n";
    
    // Add examples if available
    const examples = this.getRelevantExamples(subject, gradeLevel);
    if (examples.length > 0) {
      prompt += "CONTOH SOAL YANG BAIK:\n";
      examples.forEach((example, index) => {
        prompt += `\nContoh ${index + 1}:\n`;
        prompt += JSON.stringify(example, null, 2) + "\n";
      });
      prompt += "\n";
    }
    
    // Add quality criteria
    prompt += "KRITERIA KUALITAS:\n";
    Object.entries(QUALITY_CRITERIA).forEach(([key, value]) => {
      prompt += `- ${value}\n`;
    });
    
    prompt += "\nBuatlah soal sesuai dengan panduan di atas. Pastikan setiap soal memenuhi standar kualitas yang ditetapkan.";
    
    return prompt;
  }
  
  /**
   * Get relevant training examples based on subject and grade level
   */
  static getRelevantExamples(subject: string, gradeLevel: string): any[] {
    // First try comprehensive training data
    const comprehensiveExamples = COMPREHENSIVE_TRAINING_DATA[subject as keyof typeof COMPREHENSIVE_TRAINING_DATA];
    if (comprehensiveExamples) {
      const gradeLevelExamples = comprehensiveExamples[gradeLevel as keyof typeof comprehensiveExamples];
      if (gradeLevelExamples && gradeLevelExamples.length > 0) {
        return gradeLevelExamples;
      }
    }
    
    // Fallback to original training examples
    const subjectExamples = TRAINING_EXAMPLES[subject as keyof typeof TRAINING_EXAMPLES];
    if (!subjectExamples) return [];
    
    const gradeLevelExamples = subjectExamples[gradeLevel as keyof typeof subjectExamples];
    return gradeLevelExamples || [];
  }
  
  /**
   * Validate generated question quality
   */
  static validateQuestion(question: GeneratedQuestion): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check required fields
    if (!question.question || question.question.trim().length === 0) {
      errors.push("Pertanyaan tidak boleh kosong");
    }
    
    if (!question.options || question.options.length !== 4) {
      errors.push("Harus ada tepat 4 pilihan jawaban");
    }
    
    if (!question.correct_answer || !['A', 'B', 'C', 'D'].includes(question.correct_answer)) {
      errors.push("Jawaban benar harus berupa A, B, C, atau D");
    }
    
    if (!question.explanation || question.explanation.trim().length === 0) {
      errors.push("Penjelasan tidak boleh kosong");
    }
    
    // Check option format
    if (question.options) {
      question.options.forEach((option, index) => {
        const expectedPrefix = ['A. ', 'B. ', 'C. ', 'D. '][index];
        if (!option.startsWith(expectedPrefix)) {
          errors.push(`Pilihan ${index + 1} harus dimulai dengan "${expectedPrefix}"`);
        }
      });
    }
    
    // Check option length balance
    if (question.options) {
      const lengths = question.options.map(opt => opt.length);
      const maxLength = Math.max(...lengths);
      const minLength = Math.min(...lengths);
      
      if (maxLength - minLength > 50) {
        errors.push("Panjang pilihan jawaban tidak seimbang");
      }
    }
    
    // Check for common mistakes
    if (question.options) {
      const optionTexts = question.options.map(opt => opt.substring(3).toLowerCase());
      
      // Check for "semua benar" or "tidak ada yang benar"
      if (optionTexts.some(text => 
        text.includes('semua') && text.includes('benar') ||
        text.includes('tidak ada') && text.includes('benar')
      )) {
        errors.push("Hindari pilihan 'semua benar' atau 'tidak ada yang benar'");
      }
      
      // Check for duplicate options
      const uniqueOptions = new Set(optionTexts);
      if (uniqueOptions.size !== optionTexts.length) {
        errors.push("Pilihan jawaban tidak boleh ada yang sama");
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Get subject list with Indonesian names
   */
  static getSubjectList(): { key: string; name: string }[] {
    return [
      { key: 'matematika', name: 'Matematika' },
      { key: 'fisika', name: 'Fisika' },
      { key: 'kimia', name: 'Kimia' },
      { key: 'biologi', name: 'Biologi' },
      { key: 'bahasa-indonesia', name: 'Bahasa Indonesia' },
      { key: 'bahasa-inggris', name: 'Bahasa Inggris' },
      { key: 'sejarah', name: 'Sejarah' },
      { key: 'geografi', name: 'Geografi' },
      { key: 'pkn', name: 'Pendidikan Kewarganegaraan' }
    ];
  }
  
  /**
   * Get grade level options
   */
  static getGradeLevels(): { key: string; name: string }[] {
    return [
      { key: 'sd', name: 'Sekolah Dasar (SD)' },
      { key: 'smp', name: 'Sekolah Menengah Pertama (SMP)' },
      { key: 'sma', name: 'Sekolah Menengah Atas (SMA)' }
    ];
  }
  
  /**
   * Get difficulty levels
   */
  static getDifficultyLevels(): { key: string; name: string }[] {
    return [
      { key: 'mudah', name: 'Mudah' },
      { key: 'sedang', name: 'Sedang' },
      { key: 'sulit', name: 'Sulit' }
    ];
  }
  
  /**
   * Get Bloom's Taxonomy levels
   */
  static getBloomTaxonomy(): { key: string; name: string }[] {
    return [
      { key: 'mengingat', name: 'Mengingat (C1)' },
      { key: 'memahami', name: 'Memahami (C2)' },
      { key: 'menerapkan', name: 'Menerapkan (C3)' },
      { key: 'menganalisis', name: 'Menganalisis (C4)' },
      { key: 'mengevaluasi', name: 'Mengevaluasi (C5)' },
      { key: 'mencipta', name: 'Mencipta (C6)' }
    ];
  }
}

// Export default configuration
export const DEFAULT_TRAINING_CONFIG = {
  maxRetries: 3,
  validationEnabled: true,
  qualityThreshold: 0.8,
  contextWindow: 4000,
  temperature: 0.7,
  topP: 0.9
};