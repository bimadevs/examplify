import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  name: string
  role: 'teacher' | 'student'
  created_at: string
  updated_at: string
}

export interface QuestionBank {
  id: string
  teacher_id: string
  topic: string
  questions: Question[]
  created_at: string
  updated_at: string
}

export interface Question {
  question: string
  options: string[]
  correctAnswerIndex: number
}

export interface ExamResult {
  id: string
  student_id: string
  question_bank_id: string
  student_name: string
  topic: string
  questions: Question[]
  student_answers: Record<number, number>
  score: number
  submitted_at: string
}

export interface Class {
  id: string
  teacher_id: string
  name: string
  code: string
  created_at: string
}

export interface ClassEnrollment {
  id: string
  class_id: string
  student_id: string
  enrolled_at: string
}

export interface Exam {
  id: string
  teacher_id: string
  class_id: string
  question_bank_id: string
  title: string
  description?: string
  start_time?: string
  end_time?: string
  duration_minutes: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StudentExamAttempt {
  id: string
  exam_id: string
  student_id: string
  started_at: string
  submitted_at?: string
  answers: Record<number, number>
  score?: number
  is_completed: boolean
}