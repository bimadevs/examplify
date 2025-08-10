-- Fix Exam System - Add proper exam management tables

-- Exams table - untuk ujian yang dibuat guru
CREATE TABLE exams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  question_bank_id UUID REFERENCES question_banks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student exam attempts - untuk tracking attempt siswa
CREATE TABLE student_exam_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  answers JSONB NOT NULL DEFAULT '{}',
  score DECIMAL(5,2),
  is_completed BOOLEAN DEFAULT false,
  UNIQUE(exam_id, student_id)
);

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_exam_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exams
CREATE POLICY "Teachers can manage own exams" ON exams
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view exams for their classes" ON exams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE class_enrollments.class_id = exams.class_id 
      AND class_enrollments.student_id = auth.uid()
    )
  );

-- RLS Policies for student_exam_attempts
CREATE POLICY "Students can manage own attempts" ON student_exam_attempts
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view attempts for their exams" ON student_exam_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exams 
      WHERE exams.id = student_exam_attempts.exam_id 
      AND exams.teacher_id = auth.uid()
    )
  );

-- Add updated_at trigger for exams
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();