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
import { FileText, ChevronLeft, ChevronRight, Send, ListChecks } from "lucide-react";
import type { QuestionBank, Question } from "@/lib/types";

type Stage = "select_exam" | "in_progress" | "submitted";

export default function UjianPage() {
  const [stage, setStage] = useState<Stage>("select_exam");
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [selectedBank, setSelectedBank] = useState<QuestionBank | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedBanks = JSON.parse(localStorage.getItem("questionBanks") || "[]");
    setQuestionBanks(storedBanks);
  }, []);

  const handleStartExam = () => {
    if (!selectedBank) {
      toast({ title: "Pilih Ujian", description: "Anda harus memilih bank soal untuk memulai ujian.", variant: "destructive" });
      return;
    }
    setStage("in_progress");
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: parseInt(value) }));
  };

  const handleNext = () => {
    if (selectedBank && currentQuestionIndex < selectedBank.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!selectedBank) return;
    
    // Simple scoring
    let score = 0;
    selectedBank.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswerIndex) {
        score++;
      }
    });
    const finalScore = (score / selectedBank.questions.length) * 100;

    const result = {
      studentId: "S001", // Placeholder student
      studentName: "Alex Mercer",
      topic: selectedBank.topic,
      questions: selectedBank.questions,
      studentAnswers: answers,
      score: finalScore,
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem("latestExamResult", JSON.stringify(result));
    toast({ title: "Ujian Selesai!", description: "Hasil ujian Anda telah disimpan. Mengarahkan ke halaman hasil...", });
    router.push("/hasil");
  };

  const progress = selectedBank ? ((currentQuestionIndex + 1) / selectedBank.questions.length) * 100 : 0;
  const currentQuestion: Question | null = selectedBank ? selectedBank.questions[currentQuestionIndex] : null;

  if (stage === "select_exam") {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <ListChecks className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Mulai Ujian</CardTitle>
            <CardDescription>Pilih bank soal yang tersedia untuk memulai ujian.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {questionBanks.length > 0 ? (
              <Select onValueChange={(value) => setSelectedBank(questionBanks[parseInt(value)])}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bank soal..." />
                </SelectTrigger>
                <SelectContent>
                  {questionBanks.map((bank, index) => (
                    <SelectItem key={index} value={String(index)}>
                      {bank.topic} ({new Date(bank.createdAt).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
             ) : (
                <Alert variant="default">
                    <AlertTitle>Bank Soal Kosong</AlertTitle>
                    <AlertDescription>
                        Belum ada bank soal yang dibuat. Silakan minta guru untuk membuatnya di halaman Bank Soal.
                    </AlertDescription>
                </Alert>
             )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartExam} className="w-full" disabled={!selectedBank || questionBanks.length === 0}>Mulai Ujian</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex items-center gap-4">
        <FileText className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ujian: {selectedBank?.topic}</h1>
          <p className="text-muted-foreground">Jawab setiap pertanyaan dengan teliti.</p>
        </div>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Soal {currentQuestionIndex + 1} dari {selectedBank?.questions.length}</CardTitle>
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
          {selectedBank && currentQuestionIndex < selectedBank.questions.length - 1 ? (
            <Button onClick={handleNext}>
              Selanjutnya <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" /> Selesai & Kirim
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
