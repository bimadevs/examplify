import { supabase, User, QuestionBank, ExamResult, Question, Class, ClassEnrollment, Exam, StudentExamAttempt } from './supabase'

// ==================== AUTH FUNCTIONS ====================

export async function signUp(email: string, password: string, name: string, role: 'teacher' | 'student') {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    })
    
    if (error) {
      console.error('Supabase auth error:', error)
      return { data: null, error }
    }
    
    // Jika signup berhasil tapi user belum confirmed, masih return success
    if (data.user && !data.user.email_confirmed_at) {
      console.log('User created but email not confirmed yet')
    }
    
    return { data, error: null }
  } catch (err) {
    console.error('Unexpected signup error:', err)
    return { data: null, error: { message: 'Terjadi kesalahan saat mendaftar' } }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('Supabase login error:', error)
      return { data: null, error }
    }
    
    return { data, error: null }
  } catch (err) {
    console.error('Unexpected login error:', err)
    return { data: null, error: { message: 'Terjadi kesalahan saat login' } }
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser(): Promise<{ user: User | null, error: any }> {
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !authUser) {
    return { user: null, error: authError }
  }
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()
    
  return { user, error }
}

// ==================== QUESTION BANK FUNCTIONS ====================

export async function createQuestionBank(topic: string, questions: Question[]) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('question_banks')
    .insert({
      teacher_id: user.id,
      topic,
      questions
    })
    .select()
    .single()
    
  return { data, error }
}

export async function getQuestionBanks(): Promise<{ data: QuestionBank[] | null, error: any }> {
  const { data, error } = await supabase
    .from('question_banks')
    .select('*')
    .order('created_at', { ascending: false })
    
  return { data, error }
}

export async function getQuestionBanksByTeacher(): Promise<{ data: QuestionBank[] | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('question_banks')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })
    
  return { data, error }
}

// ==================== EXAM RESULT FUNCTIONS ====================

export async function saveExamResult(
  questionBankId: string,
  studentName: string,
  topic: string,
  questions: Question[],
  studentAnswers: Record<number, number>,
  score: number
) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('exam_results')
    .insert({
      student_id: user.id,
      question_bank_id: questionBankId,
      student_name: studentName,
      topic,
      questions,
      student_answers: studentAnswers,
      score
    })
    .select()
    .single()
    
  return { data, error }
}

export async function getLatestExamResult(): Promise<{ data: ExamResult | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('exam_results')
    .select('*')
    .eq('student_id', user.id)
    .order('submitted_at', { ascending: false })
    .limit(1)
    
  // If no results found, return null data with no error
  if (!data || data.length === 0) {
    return { data: null, error: null }
  }
    
  return { data: data[0], error }
}

export async function getExamResultsByStudent(): Promise<{ data: ExamResult[] | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('exam_results')
    .select('*')
    .eq('student_id', user.id)
    .order('submitted_at', { ascending: false })
    
  return { data, error }
}

export async function getExamResultsByTeacher(): Promise<{ data: ExamResult[] | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('exam_results')
    .select(`
      *,
      question_banks!inner(teacher_id)
    `)
    .eq('question_banks.teacher_id', user.id)
    .order('submitted_at', { ascending: false })
    
  return { data, error }
}

// ==================== CLASS MANAGEMENT FUNCTIONS ====================

export async function createClass(name: string): Promise<{ data: Class | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  // Generate unique class code
  const classCode = `${name.substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  
  const { data, error } = await supabase
    .from('classes')
    .insert({
      teacher_id: user.id,
      name,
      code: classCode
    })
    .select()
    .single()
    
  return { data, error }
}

export async function getClassesByTeacher(): Promise<{ data: Class[] | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })
    
  return { data, error }
}

export async function deleteClass(classId: string): Promise<{ error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: { message: 'User not authenticated' } }
  }
  
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', classId)
    .eq('teacher_id', user.id) // Ensure teacher can only delete their own classes
    
  return { error }
}

export async function getClassById(classId: string): Promise<{ data: Class | null, error: any }> {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', classId)
    .single()
    
  return { data, error }
}

// Get all classes with student counts for a teacher
export async function getClassesWithStudentCountsByTeacher(): Promise<{ data: (Class & { student_count: number })[] | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  // First get all classes
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })
    
  if (classError) return { data: null, error: classError }
  
  if (!classes || classes.length === 0) {
    return { data: [], error: null }
  }
  
  // Then get student counts for each class
  const classesWithCounts = await Promise.all(
    classes.map(async (cls) => {
      const { count, error: countError } = await supabase
        .from('class_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', cls.id)
      
      return {
        ...cls,
        student_count: countError ? 0 : (count || 0)
      }
    })
  )
  
  return { data: classesWithCounts, error: null }
}

// ==================== EXAM MANAGEMENT FUNCTIONS ====================

// Create exam by teacher
export async function createExam(
  classId: string,
  questionBankId: string,
  title: string,
  description?: string,
  startTime?: string,
  endTime?: string,
  durationMinutes: number = 60
): Promise<{ data: Exam | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('exams')
    .insert({
      teacher_id: user.id,
      class_id: classId,
      question_bank_id: questionBankId,
      title,
      description,
      start_time: startTime,
      end_time: endTime,
      duration_minutes: durationMinutes,
      is_active: true
    })
    .select()
    .single()
    
  return { data, error }
}

// Get exams by teacher
export async function getExamsByTeacher(): Promise<{ data: (Exam & { class_name: string, question_bank_topic: string })[] | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('exams')
    .select(`
      *,
      classes!inner(name),
      question_banks!inner(topic)
    `)
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })
    
  if (error) return { data: null, error }
  
  const examsWithDetails = data?.map(exam => ({
    ...exam,
    class_name: exam.classes.name,
    question_bank_topic: exam.question_banks.topic
  })) || []
  
  return { data: examsWithDetails, error: null }
}

// Get available exams for student (based on their class enrollments)
export async function getAvailableExamsForStudent(): Promise<{ data: any[] | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  // First get student's enrolled classes
  const { data: enrollments, error: enrollmentError } = await supabase
    .from('class_enrollments')
    .select('class_id')
    .eq('student_id', user.id)
    
  if (enrollmentError) {
    console.error('Error fetching enrollments:', enrollmentError)
    return { data: null, error: enrollmentError }
  }
  
  if (!enrollments || enrollments.length === 0) {
    return { data: [], error: null }
  }
  
  const classIds = enrollments.map(e => e.class_id)
  
  // Then get exams for those classes
  const { data: exams, error: examError } = await supabase
    .from('exams')
    .select(`
      *,
      classes!inner(name),
      question_banks!inner(topic)
    `)
    .in('class_id', classIds)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    
  if (examError) {
    console.error('Error fetching exams:', examError)
    return { data: null, error: examError }
  }
  
  // Check which exams haven't been attempted yet
  const examIds = exams?.map(e => e.id) || []
  const { data: attempts } = await supabase
    .from('student_exam_attempts')
    .select('exam_id')
    .eq('student_id', user.id)
    .in('exam_id', examIds)
  
  const attemptedExamIds = new Set(attempts?.map(a => a.exam_id) || [])
  
  const availableExams = exams?.filter(exam => !attemptedExamIds.has(exam.id)).map(exam => ({
    ...exam,
    class_name: exam.classes.name,
    question_bank_topic: exam.question_banks.topic
  })) || []
  
  return { data: availableExams, error: null }
}

// Join class with code
export async function joinClassWithCode(classCode: string): Promise<{ data: ClassEnrollment | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  // First, find the class by code
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('id')
    .eq('code', classCode)
    .single()
    
  if (classError || !classData) {
    return { data: null, error: { message: 'Kode kelas tidak ditemukan' } }
  }
  
  // Check if already enrolled
  const { data: existingEnrollment } = await supabase
    .from('class_enrollments')
    .select('id')
    .eq('class_id', classData.id)
    .eq('student_id', user.id)
    .single()
    
  if (existingEnrollment) {
    return { data: null, error: { message: 'Anda sudah terdaftar di kelas ini' } }
  }
  
  // Enroll student
  const { data, error } = await supabase
    .from('class_enrollments')
    .insert({
      class_id: classData.id,
      student_id: user.id
    })
    .select()
    .single()
    
  return { data, error }
}

// Get student's enrolled classes
export async function getStudentEnrolledClasses(): Promise<{ data: (Class & { enrollment_date: string })[] | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('class_enrollments')
    .select(`
      enrolled_at,
      classes!inner(*)
    `)
    .eq('student_id', user.id)
    .order('enrolled_at', { ascending: false })
    
  if (error) return { data: null, error }
  
  const classesWithEnrollment = data?.map(enrollment => ({
    ...enrollment.classes,
    enrollment_date: enrollment.enrolled_at
  })) || []
  
  return { data: classesWithEnrollment, error: null }
}

// Start exam attempt
export async function startExamAttempt(examId: string): Promise<{ data: StudentExamAttempt | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  // Check if already attempted
  const { data: existingAttempt } = await supabase
    .from('student_exam_attempts')
    .select('id')
    .eq('exam_id', examId)
    .eq('student_id', user.id)
    .single()
    
  if (existingAttempt) {
    return { data: null, error: { message: 'Anda sudah mengerjakan ujian ini' } }
  }
  
  const { data, error } = await supabase
    .from('student_exam_attempts')
    .insert({
      exam_id: examId,
      student_id: user.id,
      answers: {},
      is_completed: false
    })
    .select()
    .single()
    
  return { data, error }
}

// Submit exam attempt
export async function submitExamAttempt(
  attemptId: string,
  answers: Record<number, number>,
  score: number
): Promise<{ data: StudentExamAttempt | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('student_exam_attempts')
    .update({
      answers,
      score,
      is_completed: true,
      submitted_at: new Date().toISOString()
    })
    .eq('id', attemptId)
    .eq('student_id', user.id)
    .select()
    .single()
    
  return { data, error }
}

// Get exam with questions for student
export async function getExamForStudent(examId: string): Promise<{ data: any | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  // First check if student is enrolled in the class for this exam
  const { data: examCheck, error: examCheckError } = await supabase
    .from('exams')
    .select('class_id')
    .eq('id', examId)
    .single()
    
  if (examCheckError || !examCheck) {
    return { data: null, error: { message: 'Ujian tidak ditemukan' } }
  }
  
  // Check if student is enrolled in the class
  const { data: enrollment, error: enrollmentError } = await supabase
    .from('class_enrollments')
    .select('id')
    .eq('class_id', examCheck.class_id)
    .eq('student_id', user.id)
    .single()
    
  if (enrollmentError || !enrollment) {
    return { data: null, error: { message: 'Anda tidak memiliki akses ke ujian ini' } }
  }
  
  // Get exam details with question bank
  const { data: examData, error: examError } = await supabase
    .from('exams')
    .select(`
      *,
      question_banks!inner(questions)
    `)
    .eq('id', examId)
    .single()
    
  if (examError || !examData) {
    return { data: null, error: { message: 'Gagal memuat data ujian' } }
  }
  
  const examWithQuestions = {
    ...examData,
    questions: examData.question_banks.questions
  }
  
  return { data: examWithQuestions, error: null }
}

export async function getStudentExamAttempts(): Promise<{ data: any[] | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  const { data, error } = await supabase
    .from('student_exam_attempts')
    .select(`
      *,
      exams!inner(
        title,
        description,
        duration_minutes,
        classes!inner(name),
        question_banks!inner(topic, questions)
      )
    `)
    .eq('student_id', user.id)
    .eq('is_completed', true)
    .order('submitted_at', { ascending: false })
    
  if (error) return { data: null, error }
  
  // Transform data to match the expected format
  const transformedData = data?.map(attempt => ({
    id: attempt.id,
    student_id: attempt.student_id,
    student_name: user.user_metadata?.name || 'Student',
    exam_title: attempt.exams.title,
    topic: attempt.exams.question_banks.topic,
    class_name: attempt.exams.classes.name,
    questions: attempt.exams.question_banks.questions,
    student_answers: attempt.answers,
    score: attempt.score || 0,
    submitted_at: attempt.submitted_at,
    duration_minutes: attempt.exams.duration_minutes
  })) || []
  
  return { data: transformedData, error: null }
}

// Get latest student exam attempt (for results page)
export async function getLatestStudentExamAttempt(): Promise<{ data: any | null, error: any }> {
  const { data: attempts, error } = await getStudentExamAttempts()
  
  if (error) return { data: null, error }
  
  if (!attempts || attempts.length === 0) {
    return { data: null, error: null }
  }
  
  return { data: attempts[0], error: null }
}

// Get student exam attempts for specific exams (used in class detail page)
export async function getStudentExamAttemptsForExams(examIds: string[]): Promise<{ data: any[] | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }
  
  if (examIds.length === 0) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('student_exam_attempts')
    .select('*')
    .eq('student_id', user.id)
    .in('exam_id', examIds)
    .eq('is_completed', true)
    
  return { data: data || [], error }
}