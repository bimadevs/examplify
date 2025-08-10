"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Loader2, 
  Trophy,
  TrendingUp,
  FileText,
  Target,
  Award,
  AlertCircle,
  Play,
  BarChart
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser, getStudentExamAttempts, getStudentEnrolledClasses, getAvailableExamsForStudent, joinClassWithCode } from "@/lib/database";
import type { User } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function SiswaDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);
  const [availableExams, setAvailableExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [classCode, setClassCode] = useState("");
  const [joiningClass, setJoiningClass] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { user, error: userError } = await getCurrentUser();
        if (userError) {
          toast({
            title: "Error",
            description: "Gagal memuat data pengguna",
            variant: "destructive",
          });
          return;
        }
        setUser(user);

        // Get enrolled classes
        const { data: classes, error: classesError } = await getStudentEnrolledClasses();
        if (classesError) {
          console.error('Error fetching enrolled classes:', classesError);
        } else {
          setEnrolledClasses(classes || []);
        }

        // Get available exams for student's classes
        const { data: exams, error: examsError } = await getAvailableExamsForStudent();
        if (examsError) {
          console.error('Error fetching available exams:', examsError);
        } else {
          setAvailableExams(exams || []);
        }

        // Get exam results (keep this for statistics)
        const { data: results, error: resultsError } = await getStudentExamAttempts();
        if (resultsError) {
          console.error('Error fetching exam results:', resultsError);
        } else {
          setExamResults(results || []);
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

  const handleJoinClass = async () => {
    if (!classCode.trim()) {
      toast({
        title: "Kode Kelas Diperlukan",
        description: "Silakan masukkan kode kelas",
        variant: "destructive",
      });
      return;
    }

    setJoiningClass(true);
    try {
      const { data, error } = await joinClassWithCode(classCode.trim());
      
      if (error) {
        toast({
          title: "Gagal Bergabung",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        // Refresh enrolled classes
        const { data: updatedClasses } = await getStudentEnrolledClasses();
        setEnrolledClasses(updatedClasses || []);
        
        // Refresh available exams
        const { data: updatedExams } = await getAvailableExamsForStudent();
        setAvailableExams(updatedExams || []);

        setClassCode("");
        toast({
          title: "Berhasil Bergabung",
          description: "Anda berhasil bergabung dengan kelas",
        });
      }
    } catch (error) {
      console.error('Error joining class:', error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal bergabung dengan kelas. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setJoiningClass(false);
    }
  };

  // Calculate statistics
  const averageScore = examResults.length > 0 
    ? examResults.reduce((sum, result) => sum + (result.score || 0), 0) / examResults.length 
    : 0;
  const highestScore = examResults.length > 0 
    ? Math.max(...examResults.map(r => r.score || 0)) 
    : 0;
  const completedExams = examResults.length;
  const passedExams = examResults.filter(r => (r.score || 0) >= 70).length;

  const recentResults = examResults.slice(0, 5);

  if (loading) {
    return (
      <div className="p-6 md:p-8 pt-16 md:pt-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Dashboard Siswa
        </h1>
        <p className="text-gray-600">
          Selamat datang, {user?.name}! Siap untuk belajar dan mengerjakan ujian?
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ujian Selesai</p>
                <p className="text-2xl font-bold text-gray-900">{completedExams}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rata-rata Nilai</p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageScore > 0 ? averageScore.toFixed(1) : '0'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nilai Tertinggi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {highestScore > 0 ? highestScore.toFixed(0) : '0'}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ujian Lulus</p>
                <p className="text-2xl font-bold text-gray-900">{passedExams}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Enrolled Classes */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Kelas Saya ({enrolledClasses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enrolledClasses.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Belum bergabung dengan kelas</p>
                  <p className="text-sm text-gray-500">
                    Masukkan kode kelas dari guru untuk bergabung
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledClasses.map((cls) => (
                    <div key={cls.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{cls.name}</h3>
                          <p className="text-sm text-gray-600">
                            Kode: {cls.code} • Bergabung {new Date(cls.enrollment_date).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/siswa/kelas/${cls.id}`}>
                            Lihat Detail
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Exams */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ujian Tersedia
                </CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/ujian">
                    Lihat Semua
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {availableExams.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Tidak ada ujian tersedia</p>
                  <p className="text-sm text-gray-500">
                    {enrolledClasses.length === 0 
                      ? "Bergabung dengan kelas terlebih dahulu untuk melihat ujian"
                      : "Guru belum membuat ujian untuk kelas Anda"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableExams.slice(0, 3).map((exam) => (
                    <div key={exam.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow border-l-4 border-l-blue-500">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-lg">{exam.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Kelas: {exam.class_name} • Topik: {exam.question_bank_topic}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {exam.duration_minutes} menit
                            </Badge>
                            <Badge variant="default" className="text-xs">
                              Aktif
                            </Badge>
                          </div>
                          {exam.description && (
                            <p className="text-sm text-gray-500">{exam.description}</p>
                          )}
                        </div>
                        <Button asChild size="sm">
                          <Link href="/ujian">
                            <Play className="w-4 h-4 mr-2" />
                            Mulai Ujian
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Hasil Ujian Terbaru
                </CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/hasil">
                    Lihat Semua
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentResults.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Belum ada hasil ujian</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Mulai kerjakan ujian untuk melihat hasil di sini
                  </p>
                  <Button asChild size="sm">
                    <Link href="/ujian">Mulai Ujian Pertama</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentResults.map((result) => (
                    <div key={result.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{result.exam_title}</h3>
                        <Badge variant={result.score >= 70 ? "default" : "destructive"}>
                          {result.score.toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Progress value={result.score} className="h-2" />
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>
                            {new Date(result.submitted_at).toLocaleDateString('id-ID')}
                          </span>
                          <span>
                            {result.questions?.length || 0} soal
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Join Class */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Bergabung dengan Kelas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="classCode" className="text-sm font-medium text-gray-700">
                  Kode Kelas
                </label>
                <input
                  id="classCode"
                  type="text"
                  placeholder="Masukkan kode kelas"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <Button 
                onClick={handleJoinClass} 
                className="w-full" 
                size="sm"
                disabled={joiningClass || !classCode.trim()}
              >
                {joiningClass ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Bergabung...
                  </>
                ) : (
                  "Bergabung dengan Kelas"
                )}
              </Button>
              <p className="text-xs text-gray-500">
                Dapatkan kode kelas dari guru Anda untuk bergabung
              </p>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          {examResults.length > 0 && (
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performa Anda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rata-rata Nilai</span>
                    <span className="font-medium text-gray-900">{averageScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={averageScore} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{passedExams}</p>
                    <p className="text-xs text-gray-600">Lulus</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {completedExams - passedExams}
                    </p>
                    <p className="text-xs text-gray-600">Perlu Perbaikan</p>
                  </div>
                </div>
                {averageScore < 70 && completedExams > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-sm">Tips Belajar</AlertTitle>
                    <AlertDescription className="text-xs">
                      Tingkatkan nilai dengan lebih banyak latihan dan review materi
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" size="sm">
                <Link href="/ujian">
                  <Play className="w-4 h-4 mr-2" />
                  Mulai Ujian
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/hasil">
                  <BarChart className="w-4 h-4 mr-2" />
                  Lihat Hasil
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Motivational Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Terus Semangat!</h3>
              <p className="text-sm text-blue-700">
                {completedExams === 0 
                  ? "Mulai perjalanan belajar Anda dengan mengerjakan ujian pertama"
                  : averageScore >= 80 
                    ? "Performa Anda sangat baik! Pertahankan prestasi ini"
                    : "Setiap ujian adalah kesempatan untuk belajar dan berkembang"
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
