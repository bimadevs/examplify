"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Library, 
  Users, 
  ArrowRight, 
  BookOpen, 
  TrendingUp, 
  Clock,
  Plus,
  Eye,
  FileText,
  Award,
  Loader2
} from "lucide-react";
import Link from 'next/link';
import { getCurrentUser, getQuestionBanksByTeacher, getExamResultsByTeacher } from "@/lib/database";
import type { User, QuestionBank, ExamResult } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function GuruDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
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

        // Get question banks
        const { data: banks, error: banksError } = await getQuestionBanksByTeacher();
        if (banksError) {
          console.error('Error fetching question banks:', banksError);
        } else {
          setQuestionBanks(banks || []);
        }

        // Get exam results
        const { data: results, error: resultsError } = await getExamResultsByTeacher();
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

  // Calculate statistics
  const totalStudents = examResults.length > 0 ? new Set(examResults.map(r => r.student_id)).size : 0;
  const averageScore = examResults.length > 0 
    ? examResults.reduce((sum, result) => sum + result.score, 0) / examResults.length 
    : 0;
  const recentExams = examResults.slice(0, 5);

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
          Dashboard Guru
        </h1>
        <p className="text-gray-600">
          Selamat datang kembali, {user?.name}! Kelola aktivitas mengajar Anda di sini.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bank Soal</p>
                <p className="text-2xl font-bold text-gray-900">{questionBanks.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Library className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ujian Dikerjakan</p>
                <p className="text-2xl font-bold text-gray-900">{examResults.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
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
              <div className="p-3 bg-yellow-100 rounded-full">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Akses Cepat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/soal" className="group">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Library className="h-5 w-5 text-blue-600" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Bank Soal</h3>
                    <p className="text-sm text-gray-600">Buat dan kelola bank soal untuk ujian</p>
                  </div>
                </Link>

                <Link href="/guru/hasil" className="group">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BarChart className="h-5 w-5 text-green-600" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hasil Siswa</h3>
                    <p className="text-sm text-gray-600">Lihat nilai, ranking, dan performa siswa</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Question Banks */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Bank Soal Terbaru
                </CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/soal">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Baru
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {questionBanks.length === 0 ? (
                <div className="text-center py-8">
                  <Library className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Belum ada bank soal</p>
                  <Button asChild size="sm">
                    <Link href="/soal">Buat Bank Soal Pertama</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {questionBanks.slice(0, 3).map((bank) => (
                    <div key={bank.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{bank.topic}</h3>
                          <p className="text-sm text-gray-600">
                            {bank.questions.length} soal • Dibuat {new Date(bank.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <Link href="/soal">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
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
          {/* Recent Activity */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentExams.length === 0 ? (
                <div className="text-center py-6">
                  <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Belum ada aktivitas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentExams.map((result) => (
                    <div key={result.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900">{result.student_name}</h4>
                        <Badge variant={result.score >= 70 ? "default" : "secondary"}>
                          {result.score.toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{result.topic}</p>
                      <Progress value={result.score} className="h-2" />
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(result.submitted_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Overview */}
          {examResults.length > 0 && (
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Performa Kelas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rata-rata Kelas</span>
                    <span className="font-medium text-gray-900">{averageScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={averageScore} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {examResults.filter(r => r.score >= 70).length}
                    </p>
                    <p className="text-xs text-gray-600">Lulus</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {examResults.filter(r => r.score < 70).length}
                    </p>
                    <p className="text-xs text-gray-600">Perlu Perbaikan</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href="/guru/hasil">
                    Lihat Detail Analisis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
