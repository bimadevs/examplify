-- Examplify Database Schema
-- Copy dan paste script ini ke Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (menggantikan localStorage userRole & userInfo)
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('teacher', 'student')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Question Banks table (menggantikan localStorage questionBanks)
CREATE TABLE question_banks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  questions JSONB NOT NULL, -- Array of Question objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exam Results table (menggantikan localStorage latestExamResult)
CREATE TABLE exam_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_bank_id UUID REFERENCES question_banks(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  questions JSONB NOT NULL, -- Array of questions from the exam
  student_answers JSONB NOT NULL, -- Record<number, number>
  score DECIMAL(5,2) NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table (untuk fitur masa depan)
CREATE TABLE classes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Class enrollments table (untuk fitur masa depan)
CREATE TABLE class_enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Teachers can manage their own question banks
CREATE POLICY "Teachers can manage own question banks" ON question_banks
  FOR ALL USING (auth.uid() = teacher_id);

-- Students can view all question banks (for taking exams)
CREATE POLICY "Students can view question banks" ON question_banks
  FOR SELECT USING (true);

-- Students can manage their own exam results
CREATE POLICY "Students can insert own exam results" ON exam_results
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view own exam results" ON exam_results
  FOR SELECT USING (auth.uid() = student_id);

-- Teachers can view exam results for their question banks
CREATE POLICY "Teachers can view student results for their questions" ON exam_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM question_banks 
      WHERE question_banks.id = exam_results.question_bank_id 
      AND question_banks.teacher_id = auth.uid()
    )
  );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_question_banks_updated_at BEFORE UPDATE ON question_banks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();