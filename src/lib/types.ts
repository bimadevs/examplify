// Re-export types from supabase.ts for backward compatibility
export type { User, QuestionBank, ExamResult, Question } from './supabase'

// Legacy types for backward compatibility
export interface Teacher {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
}
