"use client";

import { useState } from "react";
import { generateExamQuestions } from "@/ai/flows/generate-exam-questions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Library, PlusCircle, BrainCircuit, Loader2, CheckCircle, Save, PenSquare } from "lucide-react";
import type { Question, QuestionBank } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createQuestionBank } from "@/lib/database";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SoalPage() {
  const [topic, setTopic] = useState("Sejarah Kemerdekaan Indonesia");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  // State for manual question creation
  const [manualQuestion, setManualQuestion] = useState("");
  const [manualOptions, setManualOptions] = useState(["", "", "", ""]);
  const [manualCorrectAnswerIndex, setManualCorrectAnswerIndex] = useState<number | null>(null);


  const handleGenerate = async () => {
    setLoading(true);
    // Keep existing manual questions if any
    try {
      const questions = await generateExamQuestions({ topic, numQuestions });
      setGeneratedQuestions(prev => [...prev, ...questions]);
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
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...manualOptions];
    newOptions[index] = value;
    setManualOptions(newOptions);
  };

  const handleAddManualQuestion = () => {
    if (!manualQuestion || manualOptions.some(opt => opt.trim() === "") || manualCorrectAnswerIndex === null) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Harap isi semua kolom pertanyaan, opsi, dan pilih jawaban yang benar.",
        variant: "destructive"
      });
      return;
    }

    const newQuestion: Question = {
      question: manualQuestion,
      options: manualOptions,
      correctAnswerIndex: manualCorrectAnswerIndex,
    };

    setGeneratedQuestions(prev => [...prev, newQuestion]);
    
    // Reset form
    setManualQuestion("");
    setManualOptions(["", "", "", ""]);
    setManualCorrectAnswerIndex(null);

    toast({
      title: "Soal Ditambahkan",
      description: "Soal manual berhasil ditambahkan ke daftar."
    });
  };


  const handleSaveQuestions = async () => {
    if (generatedQuestions.length === 0) {
      toast({
        title: "Tidak ada soal",
        description: "Buat soal terlebih dahulu sebelum menyimpan.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await createQuestionBank(topic, generatedQuestions);
      
      if (error) {
        toast({
          title: "Gagal Menyimpan",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Bank Soal Disimpan",
        description: `Bank soal untuk topik "${topic}" berhasil disimpan.`,
      });
      
      setGeneratedQuestions([]);
      setTopic("");
    } catch (error) {
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal menyimpan bank soal. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Library className="w-8 h-8 text-primary" />
          Bank Soal
        </h1>
        <p className="text-gray-600">Buat soal ujian secara otomatis menggunakan AI atau secara manual.</p>
      </div>
      
      <div className="space-y-2 mb-6">
        <Label htmlFor="topic">Topik Ujian</Label>
        <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Masukkan topik ujian secara keseluruhan" className="bg-white" />
        <p className="text-sm text-gray-500">Topik ini akan digunakan untuk bank soal yang akan disimpan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai"><BrainCircuit className="w-4 h-4 mr-2"/>AI</TabsTrigger>
                <TabsTrigger value="manual"><PenSquare className="w-4 h-4 mr-2"/>Manual</TabsTrigger>
            </TabsList>
            <TabsContent value="ai">
               <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Generator Soal AI
                  </CardTitle>
                  <CardDescription>Masukkan jumlah soal yang diinginkan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="numQuestions">Jumlah Soal</Label>
                    <Input id="numQuestions" type="number" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} min="1" max="20" />
                  </div>
                  <Button onClick={handleGenerate} disabled={loading || !topic} className="w-full">
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <PlusCircle className="mr-2 h-4 w-4" />
                    )}
                    Buat Soal
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="manual">
               <Card className="mt-4">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">Input Manual</CardTitle>
                    <CardDescription>Buat pertanyaan Anda sendiri satu per satu.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="manual-question">Pertanyaan</Label>
                        <Textarea id="manual-question" value={manualQuestion} onChange={(e) => setManualQuestion(e.target.value)} placeholder="Tulis pertanyaan di sini..."/>
                    </div>
                    <div className="space-y-2">
                        <Label>Opsi Jawaban & Jawaban Benar</Label>
                         <RadioGroup onValueChange={(v) => setManualCorrectAnswerIndex(Number(v))}>
                            {manualOptions.map((opt, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <RadioGroupItem value={String(i)} id={`opt-${i}`} checked={manualCorrectAnswerIndex === i} />
                                    <Input value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} placeholder={`Opsi ${i + 1}`} />
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    <Button onClick={handleAddManualQuestion} variant="outline" className="w-full">
                       <PlusCircle className="mr-2 h-4 w-4" /> Tambah Soal Ini
                    </Button>
                 </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Soal</CardTitle>
              <CardDescription>
                Berikut adalah soal yang telah dibuat. Total {generatedQuestions.length} soal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedQuestions.length > 0 ? (
                <>
                <Accordion type="single" collapsible className="w-full max-h-[500px] overflow-y-auto pr-3">
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
                <Button onClick={handleSaveQuestions} className="w-full mt-4" disabled={!topic}>
                  <Save className="mr-2 h-4 w-4" /> Simpan Bank Soal
                </Button>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  <p>Soal yang dibuat akan muncul di sini.</p>
                  <p className="text-sm">Gunakan generator AI atau input manual untuk memulai.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
