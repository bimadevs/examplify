"use client";

import { useState } from "react";
import { generateExamQuestions } from "@/ai/flows/generate-exam-questions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Library, PlusCircle, BrainCircuit, Loader2, CheckCircle, Save } from "lucide-react";
import type { Question, QuestionBank } from "@/lib/types";

export default function SoalPage() {
  const [topic, setTopic] = useState("Sejarah Kemerdekaan Indonesia");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedQuestions([]);
    try {
      const questions = await generateExamQuestions({ topic, numQuestions });
      setGeneratedQuestions(questions);
      toast({
        title: "Sukses!",
        description: `${questions.length} soal berhasil dibuat oleh AI.`,
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal membuat soal. Silakan coba lagi.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };
  
  const handleSaveQuestions = () => {
    if (generatedQuestions.length === 0) {
      toast({
        title: "Tidak ada soal",
        description: "Buat soal terlebih dahulu sebelum menyimpan.",
        variant: "destructive",
      });
      return;
    }
    
    const newQuestionBank: QuestionBank = {
      topic,
      questions: generatedQuestions,
      createdAt: new Date().toISOString(),
    };
    
    const existingBanks: QuestionBank[] = JSON.parse(localStorage.getItem("questionBanks") || "[]");
    localStorage.setItem("questionBanks", JSON.stringify([...existingBanks, newQuestionBank]));
    
    toast({
      title: "Bank Soal Disimpan",
      description: `Bank soal untuk topik "${topic}" berhasil disimpan.`,
    });
    setGeneratedQuestions([]);
    setTopic("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex items-center gap-4">
        <Library className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bank Soal</h1>
          <p className="text-muted-foreground">Buat soal ujian secara otomatis menggunakan AI.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5" />
                Generator Soal AI
              </CardTitle>
              <CardDescription>Masukkan topik dan jumlah soal yang diinginkan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topik Ujian</Label>
                <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Contoh: Termodinamika" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numQuestions">Jumlah Soal</Label>
                <Input id="numQuestions" type="number" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} min="1" max="20" />
              </div>
              <Button onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                Buat Soal
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Hasil Soal</CardTitle>
              <CardDescription>
                Berikut adalah soal yang berhasil dibuat. Periksa kembali sebelum disimpan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedQuestions.length > 0 ? (
                <>
                <Accordion type="single" collapsible className="w-full">
                  {generatedQuestions.map((q, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>Soal {index + 1}: {q.question}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {q.options.map((opt, i) => (
                            <li key={i} className={`flex items-center gap-2 p-2 rounded-md ${i === q.correctAnswerIndex ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : ''}`}>
                              {i === q.correctAnswerIndex && <CheckCircle className="w-4 h-4" />}
                              <span>{opt}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <Button onClick={handleSaveQuestions} className="w-full mt-4">
                  <Save className="mr-2 h-4 w-4" /> Simpan Bank Soal
                </Button>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  <p>Soal yang dibuat akan muncul di sini.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

