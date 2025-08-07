
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { School, User, BookOpen, ArrowRight, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Data - In a real app, you'd fetch this data based on the class ID
const classDetails = {
    id: "C001",
    name: "Fisika Kuantum Lanjutan",
    teacher: "Dr. Elara Vance",
    description: "Menjelajahi prinsip-prinsip mekanika kuantum tingkat lanjut, termasuk superposisi, keterikatan, dan aplikasinya dalam komputasi kuantum.",
    exams: [
        { id: "E01", topic: "Dasar-Dasar Kuantum", status: "Selesai", score: 85 },
        { id: "E02", topic: "Keterikatan Kuantum", status: "Selesai", score: 92 },
        { id: "E03", topic: "Ujian Tengah Semester", status: "Tersedia" },
    ]
};


export default function DetailKelasPage() {
    const params = useParams();
    const classId = params.id;

    // Here you would typically fetch data based on classId
    const data = classDetails;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="space-y-2">
         <div className="flex items-center gap-3">
            <School className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
        </div>
        <p className="text-muted-foreground flex items-center gap-2"><User className="w-4 h-4"/> Pengajar: {data.teacher}</p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Deskripsi Kelas</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{data.description}</p>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5"/> Daftar Ujian
            </CardTitle>
            <CardDescription>Ujian yang tersedia dan telah selesai untuk kelas ini.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Topik Ujian</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Skor</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.exams.map((exam) => (
                        <TableRow key={exam.id}>
                            <TableCell className="font-medium">{exam.topic}</TableCell>
                            <TableCell>
                                {exam.status === "Selesai" ? (
                                    <span className="flex items-center gap-1.5 text-green-600">
                                        <CheckCircle className="w-4 h-4" /> {exam.status}
                                    </span>
                                ) : (
                                     <span className="flex items-center gap-1.5 text-blue-600">
                                        <Clock className="w-4 h-4" /> {exam.status}
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>{exam.score ?? "-"}</TableCell>
                            <TableCell className="text-right">
                                {exam.status === "Tersedia" ? (
                                    <Button asChild size="sm">
                                        <Link href="/ujian">
                                            Kerjakan Ujian <ArrowRight className="ml-2 w-4 h-4"/>
                                        </Link>
                                    </Button>
                                ) : (
                                     <Button asChild variant="outline" size="sm">
                                        <Link href="/hasil">
                                            Lihat Hasil
                                        </Link>
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
       </Card>

    </div>
  );
}
