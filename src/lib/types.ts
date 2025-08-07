export interface Teacher {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuestionBank {
  topic: string;
  questions: Question[];
  createdAt: string;
}

export interface ExamResult {
  studentId: string;
  studentName: string;
  topic: string;
  questions: Question[];
  studentAnswers: Record<number, number>; // questionIndex -> optionIndex
  score: number;
  submittedAt: string;
}
