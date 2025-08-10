"use client";

import { useState, useEffect } from "react";
import { analyzeStudentPerformance, AnalyzeStudentPerformanceOutput } from "@/ai/flows/analyze-student-performance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart3, Loader2, User, BookOpen, ThumbsDown, Target, Brain, CheckCircle } from "lucide-react";
import type { ExamResult, Question } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { getLatestStudentExamAttempt } from "@/lib/database";

export default function HasilPage() {
  const [result, setResult] = useState<ExamResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeStudentPerformanceOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get latest exam result from Supabase
        const { data: examResult, error: examError } = await getLatestStudentExamAttempt();

        if (examError) {
          console.error('Error fetching exam result:', examError);
          setError("Terjadi kesalahan saat memuat data. Silakan coba lagi.");
          setLoading(false);
          return;
        }

        if (!examResult) {
          // No error, just no results found - this is normal
          setLoading(false);
          return;
        }

        setResult(examResult);

        // Prepare data for AI analysis
        try {
          const studentAnswers: Record<string, string> = {};
          const correctAnswers: Record<string, string> = {};
          examResult.questions.forEach((q: Question, index: number) => {
            const questionId = `q_${index}`;
            studentAnswers[questionId] = q.options[examResult.student_answers[index]] || "Tidak dijawab";
            correctAnswers[questionId] = q.options[q.correctAnswerIndex];
          });

          const analysisInput = {
            studentId: examResult.student_id,
            examQuestions: examResult.questions.map((q: Question) => q.question),
            studentAnswers,
            correctAnswers,
            teacherInstructions: "Fokus pada pemahaman konsep dasar dan berikan saran yang membangun.",
          };

          const analysisResult = await analyzeStudentPerformance(analysisInput);
          setAnalysis(analysisResult);
        } catch (aiError) {
          console.error('AI analysis error:', aiError);
          // Don't set error for AI failure, just continue without analysis
        }
      } catch (e) {
        console.error('Unexpected error:', e);
        setError("Terjadi kesalahan yang tidak terduga. Silakan refresh halaman.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyze();
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900">Menganalisis Hasil Ujian...</h2>
          <p className="text-gray-600">AI sedang bekerja untuk memberikan feedback terbaik.</p>
        </div>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
        <Alert variant="destructive" className="bg-white">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Hasil Ujian
          </h1>
          <p className="text-gray-600">Lihat hasil dan analisis performa ujian Anda.</p>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="bg-white shadow-sm max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum Ada Hasil Ujian
              </h3>
              <p className="text-gray-600 mb-6">
                Anda belum menyelesaikan ujian apapun. Mulai kerjakan ujian untuk melihat hasil dan analisis performa Anda di sini.
              </p>
              <div className="space-y-3">
                <a 
                  href="/ujian" 
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Mulai Ujian Sekarang
                </a>
                <p className="text-xs text-gray-500">
                  Setelah menyelesaikan ujian, hasil dan analisis AI akan muncul di halaman ini
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          Hasil Analisis Ujian
        </h1>
        <p className="text-gray-600">Berikut adalah rincian performa Anda di ujian terakhir.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Siswa</CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{result.student_name}</div>
            <p className="text-xs text-muted-foreground">ID: {result.student_id}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Topik Ujian</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{result.exam_title}</div>
            <p className="text-xs text-muted-foreground">{result.topic} • {result.questions.length} soal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Skor Akhir</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
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
              <CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5 text-primary" /> Feedback Keseluruhan dari AI</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>{analysis.overallFeedback}</p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ThumbsDown className="w-5 h-5 text-destructive" /> Kesalahan Umum</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {analysis.commonMistakes.map((mistake, i) => <li key={i}>{mistake}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-amber-600" /> Area Kelemahan</CardTitle>
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
