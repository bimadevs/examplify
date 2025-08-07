"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { BookCopy, CheckCircle, Clock, KeyRound, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Student } from "@/lib/types";

// Mock data
const enrolledClasses = [
    { id: "C001", name: "Fisika Kuantum Lanjutan", teacher: "Dr. Elara Vance", code: "PHY-ADV" },
    { id: "C002", name: "Sejarah Peradaban Kuno", teacher: "Prof. Kaelen Reed", code: "HIST-ANC" },
];

export default function SiswaDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [classCode, setClassCode] = useState("");

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (userInfo) {
        setStudent(userInfo);
    }
  }, []);

  const handleJoinClass = () => {
    // Logic to join a class would go here
    console.log(`Joining class with code: ${classCode}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Dashboard Siswa</h1>
        <p className="text-xl text-muted-foreground">Selamat datang, {student?.name}! Siap untuk belajar?</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Kelas Terdaftar</CardTitle>
                <BookCopy className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{enrolledClasses.length} Kelas</div>
                <p className="text-xs text-muted-foreground">Terus semangat belajar!</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ujian Selesai</CardTitle>
                <CheckCircle className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">3 Ujian</div>
                <p className="text-xs text-muted-foreground">Lihat hasil di halaman hasil.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ujian Mendatang</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1 Ujian</div>
                <p className="text-xs text-muted-foreground">Jadwal: 25 Des 2024</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Kelas Anda</CardTitle>
                    <CardDescription>Berikut adalah daftar kelas yang Anda ikuti.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {enrolledClasses.map(c => (
                        <Card key={c.id} className="hover:bg-muted/50 transition-colors">
                           <CardContent className="p-4 flex justify-between items-center">
                               <div>
                                   <h3 className="font-semibold">{c.name}</h3>
                                   <p className="text-sm text-muted-foreground">Pengajar: {c.teacher}</p>
                               </div>
                               <Button asChild variant="outline" size="sm">
                                   <Link href={`/siswa/kelas/${c.id}`}>
                                       Lihat Kelas <ArrowRight className="ml-2 w-4 h-4" />
                                   </Link>
                               </Button>
                           </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Gabung Kelas Baru</CardTitle>
                    <CardDescription>Masukkan kode kelas dari guru Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Label htmlFor="class-code" className="sr-only">Kode Kelas</Label>
                    <div className="flex gap-2">
                       <Input id="class-code" value={classCode} onChange={e => setClassCode(e.target.value)} placeholder="Contoh: PHY-ADV"/>
                        <Button onClick={handleJoinClass}>
                            <KeyRound className="mr-2 h-4 w-4"/> Gabung
                        </Button>
                    </div>
                </CardContent>
            </Card>
             <Alert className="mt-4">
                <AlertTitle>Ujian Tersedia!</AlertTitle>
                <AlertDescription>
                    Ada ujian baru di kelas Fisika. <Link href="/ujian" className="font-bold text-primary hover:underline">Kerjakan sekarang!</Link>
                </AlertDescription>
            </Alert>
        </div>
      </div>
    </div>
  );
}
