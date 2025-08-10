
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { School, User, BookOpen, ArrowRight, CheckCircle, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getClassById, getStudentExamAttemptsForExams } from "@/lib/database";
import { supabase } from "@/lib/supabase";

export default function DetailKelasPage() {
    const params = useParams();
    const classId = params.id as string;
    const { toast } = useToast();
    
    const [classData, setClassData] = useState<any>(null);
    const [exams, setExams] = useState<any[]>([]);
    const [examAttempts, setExamAttempts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                // Get class details
                const { data: classInfo, error: classError } = await getClassById(classId);
                if (classError) {
                    toast({
                        title: "Error",
                        description: "Gagal memuat data kelas",
                        variant: "destructive",
                    });
                    return;
                }
                setClassData(classInfo);

                // Get teacher info
                if (classInfo?.teacher_id) {
                    const { data: teacherData } = await supabase
                        .from('users')
                        .select('name')
                        .eq('id', classInfo.teacher_id)
                        .single();
                    
                    setClassData(prev => ({
                        ...prev,
                        teacher_name: teacherData?.name || 'Unknown Teacher'
                    }));
                }

                // Get exams for this class
                const { data: examsData, error: examsError } = await supabase
                    .from('exams')
                    .select(`
                        *,
                        question_banks!inner(topic)
                    `)
                    .eq('class_id', classId)
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });

                if (examsError) {
                    console.error('Error fetching exams:', examsError);
                } else {
                    setExams(examsData || []);
                }

                // Get student's exam attempts for this class
                if (examsData && examsData.length > 0) {
                    const examIds = examsData.map(exam => exam.id);
                    const { data: attempts, error: attemptsError } = await getStudentExamAttemptsForExams(examIds);
                    if (attemptsError) {
                        console.error('Error fetching attempts:', attemptsError);
                    } else {
                        setExamAttempts(attempts || []);
                    }
                }

            } catch (error) {
                console.error('Error fetching class data:', error);
                toast({
                    title: "Error",
                    description: "Terjadi kesalahan saat memuat data",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (classId) {
            fetchClassData();
        }
    }, [classId, toast]);

    if (loading) {
        return (
            <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-gray-600">Memuat data kelas...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
                <div className="text-center py-8">
                    <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Kelas tidak ditemukan</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <School className="w-8 h-8 text-primary" />
                    {classData.name}
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                    <User className="w-4 h-4"/> 
                    Pengajar: {classData.teacher_name || 'Loading...'}
                </p>
                <div className="mt-2">
                    <Badge variant="outline">Kode: {classData.code}</Badge>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5"/> 
                            Daftar Ujian ({exams.length})
                        </CardTitle>
                        <CardDescription>
                            Ujian yang tersedia dan telah selesai untuk kelas ini.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {exams.length === 0 ? (
                            <div className="text-center py-8">
                                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2">Belum ada ujian</p>
                                <p className="text-sm text-gray-500">
                                    Guru belum membuat ujian untuk kelas ini
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Judul Ujian</TableHead>
                                        <TableHead>Topik</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Skor</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {exams.map((exam) => {
                                        const attempt = examAttempts.find(a => a.exam_id === exam.id);
                                        const isCompleted = !!attempt;
                                        const score = attempt?.score || 0;
                                        
                                        return (
                                            <TableRow key={exam.id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <p className="font-medium">{exam.title}</p>
                                                        {exam.description && (
                                                            <p className="text-sm text-gray-500">{exam.description}</p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{exam.question_banks.topic}</TableCell>
                                                <TableCell>
                                                    {isCompleted ? (
                                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Selesai
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            Tersedia
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {isCompleted ? (
                                                        <span className={`font-medium ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {score.toFixed(0)}%
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isCompleted ? (
                                                        <Button asChild variant="outline" size="sm">
                                                            <Link href="/hasil">
                                                                Lihat Hasil
                                                                <ArrowRight className="ml-2 w-4 h-4"/>
                                                            </Link>
                                                        </Button>
                                                    ) : (
                                                        <Button asChild size="sm">
                                                            <Link href="/ujian">
                                                                Kerjakan Ujian
                                                                <ArrowRight className="ml-2 w-4 h-4"/>
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
