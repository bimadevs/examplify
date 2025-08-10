"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { FileText, ChevronLeft, ChevronRight, Send, ListChecks, Loader2 } from "lucide-react";
import type { QuestionBank, Question } from "@/lib/types";
import { getAvailableExamsForStudent, getExamForStudent, startExamAttempt, submitExamAttempt, getCurrentUser } from "@/lib/database";

type Stage = "select_exam" | "in_progress" | "submitted";

export default function UjianPage() {
  const [stage, setStage] = useState<Stage>("select_exam");
  const [availableExams, setAvailableExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [examAttempt, setExamAttempt] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAvailableExams = async () => {
      try {
        const { data, error } = await getAvailableExamsForStudent();
        if (error) {
          console.error('Error fetching available exams:', error);
          toast({
            title: "Gagal Memuat Data",
            description: "Tidak dapat memuat ujian tersedia. Silakan refresh halaman.",
            variant: "destructive",
          });
        } else {
          setAvailableExams(data || []);
        }
      } catch (error) {
        console.error('Error in fetchAvailableExams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableExams();
  }, [toast]);

  const handleStartExam = async () => {
    if (!selectedExam) {
      toast({ title: "Pilih Ujian", description: "Anda harus memilih ujian untuk memulai.", variant: "destructive" });
      return;
    }

    try {
      // Start exam attempt
      const { data: attempt, error: attemptError } = await startExamAttempt(selectedExam.id);
      if (attemptError) {
        toast({
          title: "Gagal Memulai Ujian",
          description: attemptError.message,
          variant: "destructive",
        });
        return;
      }

      // Get exam details with questions
      const { data: examData, error: examError } = await getExamForStudent(selectedExam.id);
      if (examError || !examData) {
        toast({
          title: "Gagal Memuat Soal",
          description: "Tidak dapat memuat soal ujian.",
          variant: "destructive",
        });
        return;
      }

      setExamAttempt(attempt);
      setSelectedExam(examData);
      setStage("in_progress");
    } catch (error) {
      console.error('Error starting exam:', error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal memulai ujian. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: parseInt(value) }));
  };

  const handleNext = () => {
    if (selectedExam && selectedExam.questions && currentQuestionIndex < selectedExam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedExam || !examAttempt || !selectedExam.questions) return;
    
    setSubmitting(true);
    
    try {
      // Calculate score
      let score = 0;
      selectedExam.questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswerIndex) {
          score++;
        }
      });
      const finalScore = (score / selectedExam.questions.length) * 100;

      // Submit exam attempt
      const { data, error } = await submitExamAttempt(
        examAttempt.id,
        answers,
        finalScore
      );

      if (error) {
        toast({
          title: "Gagal Menyimpan",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({ 
        title: "Ujian Selesai!", 
        description: "Hasil ujian Anda telah disimpan. Mengarahkan ke halaman hasil...",
      });
      
      router.push("/hasil");
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal menyimpan hasil ujian. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const progress = selectedExam && selectedExam.questions ? ((currentQuestionIndex + 1) / selectedExam.questions.length) * 100 : 0;
  const currentQuestion: Question | null = selectedExam && selectedExam.questions ? selectedExam.questions[currentQuestionIndex] : null;

  if (stage === "select_exam") {
    return (
      <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <Card className="w-full max-w-lg bg-white shadow-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                <ListChecks className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Mulai Ujian</CardTitle>
              <CardDescription>Pilih bank soal yang tersedia untuk memulai ujian.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableExams.length > 0 ? (
                <Select onValueChange={(value) => setSelectedExam(availableExams[parseInt(value)])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih ujian..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableExams.map((exam, index) => (
                      <SelectItem key={index} value={String(index)}>
                        {exam.title} - {exam.class_name} ({exam.duration_minutes} menit)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Alert variant="default">
                  <AlertTitle>Tidak Ada Ujian Tersedia</AlertTitle>
                  <AlertDescription>
                    Belum ada ujian yang tersedia untuk kelas Anda. Bergabung dengan kelas terlebih dahulu atau tunggu guru membuat ujian.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartExam} className="w-full" disabled={!selectedExam || availableExams.length === 0}>Mulai Ujian</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          Ujian: {selectedExam?.title}
        </h1>
        <p className="text-gray-600">Jawab setiap pertanyaan dengan teliti.</p>
      </div>
      
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Soal {currentQuestionIndex + 1} dari {selectedExam?.questions?.length || 0}</CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium">{currentQuestion?.question}</p>
          <RadioGroup value={String(answers[currentQuestionIndex] ?? -1)} onValueChange={handleAnswerChange}>
            {currentQuestion?.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-md border has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all">
                <RadioGroupItem value={String(index)} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          {selectedExam && selectedExam.questions && currentQuestionIndex < selectedExam.questions.length - 1 ? (
            <Button onClick={handleNext}>
              Selanjutnya <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Selesai & Kirim
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
