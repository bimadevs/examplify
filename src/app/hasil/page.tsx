"use client";

import { useState, useEffect } from "react";
import { analyzeStudentPerformance, AnalyzeStudentPerformanceOutput } from "@/ai/flows/analyze-student-performance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart3, Loader2, User, BookOpen, ThumbsDown, Target, Brain, CheckCircle, Percent } from "lucide-react";
import type { ExamResult, Question } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function HasilPage() {
  const [result, setResult] = useState<ExamResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeStudentPerformanceOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      setLoading(true);
      setError(null);
      const storedResult = localStorage.getItem("latestExamResult");
      
      if (!storedResult) {
        setError("Tidak ada data hasil ujian yang ditemukan.");
        setLoading(false);
        return;
      }

      const parsedResult: ExamResult = JSON.parse(storedResult);
      setResult(parsedResult);
      
      try {
        const studentAnswers: Record<string, string> = {};
        const correctAnswers: Record<string, string> = {};
        parsedResult.questions.forEach((q, index) => {
          const questionId = `q_${index}`;
          studentAnswers[questionId] = q.options[parsedResult.studentAnswers[index]] || "Tidak dijawab";
          correctAnswers[questionId] = q.options[q.correctAnswerIndex];
        });

        const analysisInput = {
          studentId: parsedResult.studentId,
          examQuestions: parsedResult.questions.map(q => q.question),
          studentAnswers,
          correctAnswers,
          teacherInstructions: "Fokus pada pemahaman konsep dasar dan berikan saran yang membangun.",
        };

        const analysisResult = await analyzeStudentPerformance(analysisInput);
        setAnalysis(analysisResult);
      } catch (e) {
        console.error(e);
        setError("Gagal mendapatkan analisis AI. Menampilkan hasil dasar.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndAnalyze();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold">Menganalisis Hasil Ujian...</h2>
        <p className="text-muted-foreground">AI sedang bekerja untuk memberikan feedback terbaik.</p>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!result) {
     return (
        <div className="p-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Alert>
                <AlertTitle>Belum Ada Hasil</AlertTitle>
                <AlertDescription>
                    Anda belum menyelesaikan ujian. Silakan ke halaman Ujian untuk memulai.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex items-center gap-4">
        <BarChart3 className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hasil Analisis Ujian</h1>
          <p className="text-muted-foreground">Berikut adalah rincian performa Anda di ujian terakhir.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Siswa</CardTitle>
                <User className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{result.studentName}</div>
                <p className="text-xs text-muted-foreground">ID: {result.studentId}</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Topik Ujian</CardTitle>
                <BookOpen className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{result.topic}</div>
                 <p className="text-xs text-muted-foreground">{result.questions.length} soal</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Skor Akhir</CardTitle>
                <CheckCircle className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{result.score.toFixed(1)} <span className="text-base font-normal text-muted-foreground">/ 100</span></div>
                <Badge variant={result.score >= 75 ? "default" : "destructive"} className="mt-1">
                    {result.score >= 75 ? "Lulus" : "Perlu Perbaikan"}
                </Badge>
            </CardContent>
        </Card>
      </div>

      {analysis ? (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5 text-primary"/> Feedback Keseluruhan dari AI</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <p>{analysis.overallFeedback}</p>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ThumbsDown className="w-5 h-5 text-destructive"/> Kesalahan Umum</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {analysis.commonMistakes.map((mistake, i) => <li key={i}>{mistake}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-amber-600"/> Area Kelemahan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {analysis.areasOfWeakness.map((area, i) => <li key={i}>{area}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>
             <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">Saran Perbaikan</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-decimal pl-5 space-y-2 text-foreground">
                        {analysis.suggestionsForImprovement.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                    </ul>
                </CardContent>
            </Card>
        </div>
      ) : (
        <Card>
            <CardHeader><CardTitle>Analisis AI tidak tersedia</CardTitle></CardHeader>
            <CardContent><p>Tidak dapat memuat analisis dari AI. Silakan periksa kembali nanti.</p></CardContent>
        </Card>
      )}
    </div>
  );
}
