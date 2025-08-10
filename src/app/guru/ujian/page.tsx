"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileText, Users, Clock, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  createExam, 
  getExamsByTeacher, 
  getClassesByTeacher, 
  getQuestionBanksByTeacher 
} from "@/lib/database";
import type { Exam, Class, QuestionBank } from "@/lib/supabase";

interface ExamWithDetails extends Exam {
  class_name: string;
  question_bank_topic: string;
}

export default function GuruUjianPage() {
  const { toast } = useToast();
  const [exams, setExams] = useState<ExamWithDetails[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedQuestionBankId, setSelectedQuestionBankId] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all required data
        const [examsResult, classesResult, questionBanksResult] = await Promise.all([
          getExamsByTeacher(),
          getClassesByTeacher(),
          getQuestionBanksByTeacher()
        ]);

        if (examsResult.error) {
          console.error('Error fetching exams:', examsResult.error);
        } else {
          setExams(examsResult.data || []);
        }

        if (classesResult.error) {
          console.error('Error fetching classes:', classesResult.error);
        } else {
          setClasses(classesResult.data || []);
        }

        if (questionBanksResult.error) {
          console.error('Error fetching question banks:', questionBanksResult.error);
        } else {
          setQuestionBanks(questionBanksResult.data || []);
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleCreateExam = async () => {
    if (!title.trim() || !selectedClassId || !selectedQuestionBankId) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Silakan lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await createExam(
        selectedClassId,
        selectedQuestionBankId,
        title.trim(),
        description.trim() || undefined,
        undefined, // start_time
        undefined, // end_time
        durationMinutes
      );

      if (error) {
        toast({
          title: "Gagal Membuat Ujian",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        // Refresh exams list
        const { data: updatedExams } = await getExamsByTeacher();
        setExams(updatedExams || []);

        // Reset form
        setTitle("");
        setDescription("");
        setSelectedClassId("");
        setSelectedQuestionBankId("");
        setDurationMinutes(60);

        toast({
          title: "Ujian Berhasil Dibuat",
          description: `Ujian "${data.title}" berhasil dibuat`,
        });
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal membuat ujian. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Memuat data ujian...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          Kelola Ujian
        </h1>
        <p className="text-gray-600">Buat dan kelola ujian untuk kelas Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Exam Form */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Buat Ujian Baru
              </CardTitle>
              <CardDescription>Buat ujian untuk kelas tertentu dengan bank soal yang sudah ada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Ujian</Label>
                <Input 
                  id="title" 
                  placeholder="Contoh: Ujian Tengah Semester" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Deskripsi ujian..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Pilih Kelas</Label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} ({cls.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pilih Bank Soal</Label>
                <Select value={selectedQuestionBankId} onValueChange={setSelectedQuestionBankId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bank soal..." />
                  </SelectTrigger>
                  <SelectContent>
                    {questionBanks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.topic} ({bank.questions.length} soal)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durasi (Menit)</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  min="1" 
                  max="300"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                />
              </div>

              <Button onClick={handleCreateExam} className="w-full" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Membuat...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Buat Ujian
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Exams List */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Daftar Ujian</CardTitle>
              <CardDescription>
                {exams.length === 0 ? "Belum ada ujian" : `Total ${exams.length} ujian`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exams.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Belum ada ujian</p>
                  <p className="text-sm text-gray-500">Buat ujian pertama Anda untuk memulai</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul Ujian</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Bank Soal</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-medium">{exam.title}</p>
                            {exam.description && (
                              <p className="text-sm text-gray-500">{exam.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{exam.class_name}</TableCell>
                        <TableCell>{exam.question_bank_topic}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {exam.duration_minutes} menit
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={exam.is_active ? "default" : "secondary"}>
                            {exam.is_active ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}