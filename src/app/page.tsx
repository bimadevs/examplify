"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { BookOpenCheck } from "lucide-react";

type Role = "teacher" | "student";

// Mock user data for demonstration
const MOCK_USERS = {
  teacher: { id: "T001", name: "Dr. Elara Vance" },
  student: { id: "S001", name: "Alex Mercer" },
};

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<Role>("teacher");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle authentication with a backend service.
    // For this demo, we'll just store the role and user info in localStorage.
    localStorage.setItem("userRole", role);
    localStorage.setItem("userInfo", JSON.stringify(MOCK_USERS[role]));

    toast({
      title: "Login Berhasil",
      description: `Selamat datang kembali, ${MOCK_USERS[role].name}!`,
    });

    if (role === 'teacher') {
      router.push('/guru');
    } else {
      router.push('/siswa');
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
     toast({
      title: "Registrasi Berhasil",
      description: `Akun Anda telah dibuat. Silakan login.`,
    });
    // In a real app, you'd redirect to login or auto-login.
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/40 p-4">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
            <BookOpenCheck className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
          Selamat Datang di Examplify
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Platform ujian cerdas untuk masa depan pendidikan.
        </p>
      </div>
      <Card className="w-full max-w-md mx-auto ml-10">
        <CardHeader>
          <CardTitle>Akses Akun Anda</CardTitle>
          <CardDescription>Silakan login atau daftar untuk melanjutkan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label>Anda adalah seorang?</Label>
                    <RadioGroup defaultValue="teacher" onValueChange={(v) => setRole(v as Role)} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <input type="radio" id="teacher" name="role" value="teacher" checked={role === 'teacher'} onChange={() => setRole('teacher')} className="form-radio h-4 w-4 text-primary border-gray-300 focus:ring-primary"/>
                            <Label htmlFor="teacher">Guru</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                             <input type="radio" id="student" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} className="form-radio h-4 w-4 text-primary border-gray-300 focus:ring-primary"/>
                            <Label htmlFor="student">Siswa</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input id="email-login" type="email" placeholder="email@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Password</Label>
                  <Input id="password-login" type="password" required />
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 pt-4">
                 <div className="space-y-2">
                    <Label>Daftar Sebagai?</Label>
                     <RadioGroup defaultValue="teacher" onValueChange={(v) => setRole(v as Role)} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <input type="radio" id="teacher-reg" name="role-reg" value="teacher" checked={role === 'teacher'} onChange={() => setRole('teacher')} className="form-radio h-4 w-4 text-primary border-gray-300 focus:ring-primary"/>
                            <Label htmlFor="teacher-reg">Guru</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                             <input type="radio" id="student-reg" name="role-reg" value="student" checked={role === 'student'} onChange={() => setRole('student')} className="form-radio h-4 w-4 text-primary border-gray-300 focus:ring-primary"/>
                            <Label htmlFor="student-reg">Siswa</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name-register">Nama Lengkap</Label>
                  <Input id="name-register" type="text" placeholder="Nama Anda" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input id="email-register" type="email" placeholder="email@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Password</Label>
                  <Input id="password-register" type="password" required />
                </div>
                <Button type="submit" className="w-full">Register</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
