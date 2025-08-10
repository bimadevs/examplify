-- Add missing RLS policies for classes table

-- Teachers can manage their own classes
CREATE POLICY "Teachers can manage own classes" ON classes
  FOR ALL USING (auth.uid() = teacher_id);

-- Students can view classes (for joining)
CREATE POLICY "Students can view classes" ON classes
  FOR SELECT USING (true);

-- Students can manage their own enrollments
CREATE POLICY "Students can manage own enrollments" ON class_enrollments
  FOR ALL USING (auth.uid() = student_id);

-- Teachers can view enrollments for their classes
CREATE POLICY "Teachers can view enrollments for their classes" ON class_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.id = class_enrollments.class_id 
      AND classes.teacher_id = auth.uid()
    )
  );