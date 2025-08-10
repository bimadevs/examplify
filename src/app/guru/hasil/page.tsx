"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BarChart3, 
  Users, 
  Trophy, 
  TrendingUp, 
  Search,
  Filter,
  Download,
  Eye,
  Loader2,
  Award,
  Target,
  BookOpen,
  X,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { getExamResultsByTeacher } from "@/lib/database";
import type { ExamResult } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface StudentPerformance {
  student_id: string;
  student_name: string;
  total_exams: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  latest_exam: string;
  latest_score: number;
  rank: number;
}

export default function GuruHasilPage() {
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [studentPerformances, setStudentPerformances] = useState<StudentPerformance[]>([]);
  const [filteredResults, setFilteredResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTopic, setFilterTopic] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();

  // Handle export functionality
  const handleExport = () => {
    try {
      // Import xlsx library dynamically
      import('xlsx').then((XLSX) => {
        // Prepare data for Excel
        const worksheetData = [
          // Header row
          ['No', 'Nama Siswa', 'ID Siswa', 'Topik Ujian', 'Nilai (%)', 'Status', 'Jumlah Soal', 'Jawaban Benar', 'Jawaban Salah', 'Tanggal Ujian', 'Waktu Ujian']
        ];

        // Add data rows
        filteredResults.forEach((result, index) => {
          const correctAnswers = result.questions.filter((question, qIndex) => 
            result.student_answers[qIndex] === question.correctAnswerIndex
          ).length;
          const wrongAnswers = result.questions.length - correctAnswers;
          
          worksheetData.push([
            index + 1,
            result.student_name,
            result.student_id,
            result.topic,
            parseFloat(result.score.toFixed(1)),
            result.score >= 70 ? 'LULUS' : 'TIDAK LULUS',
            result.questions.length,
            correctAnswers,
            wrongAnswers,
            new Date(result.submitted_at).toLocaleDateString('id-ID'),
            new Date(result.submitted_at).toLocaleTimeString('id-ID')
          ]);
        });

        // Add summary statistics
        worksheetData.push([]);
        worksheetData.push(['RINGKASAN STATISTIK']);
        worksheetData.push(['Total Siswa', totalStudents]);
        worksheetData.push(['Rata-rata Kelas', parseFloat(overallAverage.toFixed(1)) + '%']);
        worksheetData.push(['Siswa Lulus', passedStudents]);
        worksheetData.push(['Siswa Tidak Lulus', totalStudents - passedStudents]);
        worksheetData.push(['Tingkat Kelulusan', parseFloat(((passedStudents / totalStudents) * 100).toFixed(1)) + '%']);

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Set column widths
        const columnWidths = [
          { wch: 5 },   // No
          { wch: 20 },  // Nama Siswa
          { wch: 15 },  // ID Siswa
          { wch: 25 },  // Topik Ujian
          { wch: 10 },  // Nilai
          { wch: 12 },  // Status
          { wch: 12 },  // Jumlah Soal
          { wch: 12 },  // Jawaban Benar
          { wch: 12 },  // Jawaban Salah
          { wch: 15 },  // Tanggal Ujian
          { wch: 12 }   // Waktu Ujian
        ];
        worksheet['!cols'] = columnWidths;

        // Style the header row
        const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
          if (!worksheet[cellAddress]) continue;
          worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4285F4" } },
            alignment: { horizontal: "center", vertical: "center" }
          };
        }

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Hasil Ujian');

        // Generate filename with current date
        const currentDate = new Date().toISOString().split('T')[0];
        const filename = `Hasil-Ujian-${currentDate}.xlsx`;

        // Save file
        XLSX.writeFile(workbook, filename);

        toast({
          title: "Export Berhasil",
          description: `Data hasil ujian berhasil diexport ke file Excel: ${filename}`,
        });
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat mengexport data ke Excel",
        variant: "destructive",
      });
    }
  };

  // Handle view detail functionality
  const handleViewDetail = (result: ExamResult) => {
    setSelectedResult(result);
    setIsDetailModalOpen(true);
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data: results, error } = await getExamResultsByTeacher();
        if (error) {
          toast({
            title: "Error",
            description: "Gagal memuat data hasil ujian",
            variant: "destructive",
          });
          return;
        }

        setExamResults(results || []);
        
        // Calculate student performances
        const studentMap = new Map<string, {
          student_id: string;
          student_name: string;
          scores: number[];
          topics: string[];
          latest_exam: string;
          latest_score: number;
        }>();

        results?.forEach((result) => {
          const key = result.student_id;
          if (!studentMap.has(key)) {
            studentMap.set(key, {
              student_id: result.student_id,
              student_name: result.student_name,
              scores: [],
              topics: [],
              latest_exam: result.topic,
              latest_score: result.score,
            });
          }
          
          const student = studentMap.get(key)!;
          student.scores.push(result.score);
          student.topics.push(result.topic);
          
          // Update latest exam if this result is more recent
          if (new Date(result.submitted_at) > new Date(student.latest_exam)) {
            student.latest_exam = result.topic;
            student.latest_score = result.score;
          }
        });

        // Convert to performance array and calculate rankings
        const performances: StudentPerformance[] = Array.from(studentMap.values()).map((student) => ({
          student_id: student.student_id,
          student_name: student.student_name,
          total_exams: student.scores.length,
          average_score: student.scores.reduce((sum, score) => sum + score, 0) / student.scores.length,
          highest_score: Math.max(...student.scores),
          lowest_score: Math.min(...student.scores),
          latest_exam: student.latest_exam,
          latest_score: student.latest_score,
          rank: 0, // Will be calculated below
        }));

        // Sort by average score and assign ranks
        performances.sort((a, b) => b.average_score - a.average_score);
        performances.forEach((perf, index) => {
          perf.rank = index + 1;
        });

        setStudentPerformances(performances);
        setFilteredResults(results || []);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [toast]);

  // Filter and search logic
  useEffect(() => {
    let filtered = examResults;

    // Filter by topic
    if (filterTopic !== "all") {
      filtered = filtered.filter(result => result.topic === filterTopic);
    }

    // Search by student name
    if (searchTerm) {
      filtered = filtered.filter(result => 
        result.student_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score_high":
          return b.score - a.score;
        case "score_low":
          return a.score - b.score;
        case "name":
          return a.student_name.localeCompare(b.student_name);
        case "latest":
        default:
          return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
      }
    });

    setFilteredResults(filtered);
  }, [examResults, searchTerm, filterTopic, sortBy]);

  // Get unique topics for filter
  const uniqueTopics = Array.from(new Set(examResults.map(result => result.topic)));

  // Calculate overall statistics
  const totalStudents = studentPerformances.length;
  const overallAverage = studentPerformances.length > 0 
    ? studentPerformances.reduce((sum, perf) => sum + perf.average_score, 0) / studentPerformances.length 
    : 0;
  const passedStudents = studentPerformances.filter(perf => perf.average_score >= 70).length;

  if (loading) {
    return (
      <div className="p-6 md:p-8 pt-16 md:pt-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Memuat data hasil ujian...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          Hasil Ujian Siswa
        </h1>
        <p className="text-gray-600">
          Analisis performa dan ranking siswa berdasarkan hasil ujian
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rata-rata Kelas</p>
                <p className="text-2xl font-bold text-gray-900">{overallAverage.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Siswa Lulus</p>
                <p className="text-2xl font-bold text-gray-900">{passedStudents}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ujian</p>
                <p className="text-2xl font-bold text-gray-900">{examResults.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters and Search */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter & Pencarian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari nama siswa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterTopic} onValueChange={setFilterTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter topik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Topik</SelectItem>
                    {uniqueTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Terbaru</SelectItem>
                    <SelectItem value="score_high">Nilai Tertinggi</SelectItem>
                    <SelectItem value="score_low">Nilai Terendah</SelectItem>
                    <SelectItem value="name">Nama A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results List */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Daftar Hasil Ujian ({filteredResults.length})
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredResults.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Tidak ada hasil ujian ditemukan</p>
                  <p className="text-sm text-gray-500">
                    {searchTerm || filterTopic !== "all" 
                      ? "Coba ubah filter atau kata kunci pencarian"
                      : "Belum ada siswa yang mengerjakan ujian"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredResults.map((result) => (
                    <div key={result.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{result.student_name}</h3>
                            <Badge variant={result.score >= 70 ? "default" : "destructive"}>
                              {result.score.toFixed(0)}%
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {result.topic}
                            </span>
                            <span>{result.questions.length} soal</span>
                            <span>{new Date(result.submitted_at).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-4">
                            <p className="text-2xl font-bold text-gray-900">{result.score.toFixed(0)}</p>
                            <p className="text-xs text-gray-500">dari 100</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetail(result)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Student Rankings */}
        <div className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Ranking Siswa
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studentPerformances.length === 0 ? (
                <div className="text-center py-6">
                  <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Belum ada data ranking</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studentPerformances.slice(0, 10).map((student) => (
                    <div key={student.student_id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${student.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                          student.rank === 2 ? 'bg-gray-100 text-gray-800' :
                          student.rank === 3 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'}
                      `}>
                        {student.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{student.student_name}</p>
                        <p className="text-xs text-gray-500">
                          {student.total_exams} ujian • Rata-rata: {student.average_score.toFixed(1)}
                        </p>
                      </div>
                      <Badge variant={student.average_score >= 70 ? "default" : "secondary"} className="text-xs">
                        {student.average_score.toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Insight Performa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Siswa Terbaik</p>
                <p className="text-xs text-green-600">
                  {studentPerformances.length > 0 
                    ? `${studentPerformances[0]?.student_name} dengan rata-rata ${studentPerformances[0]?.average_score.toFixed(1)}%`
                    : "Belum ada data"
                  }
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Tingkat Kelulusan</p>
                <p className="text-xs text-blue-600">
                  {totalStudents > 0 
                    ? `${((passedStudents / totalStudents) * 100).toFixed(1)}% siswa lulus (≥70%)`
                    : "Belum ada data"
                  }
                </p>
              </div>
              {studentPerformances.length > 0 && studentPerformances.some(s => s.average_score < 70) && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-800">Perlu Perhatian</p>
                  <p className="text-xs text-red-600">
                    {studentPerformances.filter(s => s.average_score < 70).length} siswa perlu bimbingan tambahan
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detail Ujian - {selectedResult?.student_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedResult && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Siswa</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedResult.student_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Topik</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedResult.topic}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Nilai Akhir</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-900">{selectedResult.score.toFixed(1)}%</p>
                    <Badge variant={selectedResult.score >= 70 ? "default" : "destructive"}>
                      {selectedResult.score >= 70 ? "Lulus" : "Tidak Lulus"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Dikerjakan: {new Date(selectedResult.submitted_at).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Total Soal: {selectedResult.questions.length}</span>
                </div>
              </div>

              {/* Questions and Answers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Detail Jawaban</h3>
                {selectedResult.questions.map((question, index) => {
                  const studentAnswerIndex = selectedResult.student_answers[index];
                  const isCorrect = studentAnswerIndex !== undefined && studentAnswerIndex === question.correctAnswerIndex;
                  
                  return (
                    <Card key={index} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                            ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          `}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-3">{question.question}</p>
                            
                            {/* Options */}
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => {
                                const isStudentAnswer = studentAnswerIndex === optionIndex;
                                const isCorrectAnswer = question.correctAnswerIndex === optionIndex;
                                
                                return (
                                  <div
                                    key={optionIndex}
                                    className={`
                                      p-2 rounded-lg border text-sm
                                      ${isCorrectAnswer 
                                        ? 'bg-green-50 border-green-200 text-green-800' 
                                        : isStudentAnswer 
                                        ? 'bg-red-50 border-red-200 text-red-800'
                                        : 'bg-gray-50 border-gray-200 text-gray-700'
                                      }
                                    `}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {String.fromCharCode(65 + optionIndex)}.
                                      </span>
                                      <span>{option}</span>
                                      <div className="ml-auto flex items-center gap-1">
                                        {isCorrectAnswer && (
                                          <CheckCircle className="w-4 h-4 text-green-600" />
                                        )}
                                        {isStudentAnswer && !isCorrectAnswer && (
                                          <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Answer Status */}
                            <div className="mt-3 flex items-center gap-2">
                              {isCorrect ? (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm font-medium">Benar</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-600">
                                  <XCircle className="w-4 h-4" />
                                  <span className="text-sm font-medium">
                                    Salah - Jawaban yang benar: {String.fromCharCode(65 + question.correctAnswerIndex)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Ringkasan Hasil</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">Jawaban Benar</p>
                    <p className="text-lg font-bold text-blue-900">
                      {selectedResult.questions.filter((question, index) => 
                        selectedResult.student_answers[index] === question.correctAnswerIndex
                      ).length} / {selectedResult.questions.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700">Persentase Benar</p>
                    <p className="text-lg font-bold text-blue-900">{selectedResult.score.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Status</p>
                    <Badge variant={selectedResult.score >= 70 ? "default" : "destructive"} className="mt-1">
                      {selectedResult.score >= 70 ? "Lulus" : "Perlu Perbaikan"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}