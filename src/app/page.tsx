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
import { BookOpenCheck, Loader2 } from "lucide-react";
import { signIn, signUp, getCurrentUser } from "@/lib/database";

type Role = "teacher" | "student";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<Role>("teacher");
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn(loginEmail, loginPassword);

      if (error) {
        toast({
          title: "Login Gagal",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data?.user) {
        // Wait a bit for the user profile to be available
        setTimeout(async () => {
          try {
            const { user: userProfile } = await getCurrentUser();

            if (!userProfile) {
              toast({
                title: "Login Gagal",
                description: "Profil pengguna tidak ditemukan.",
                variant: "destructive",
              });
              return;
            }

            // Validate role matches selected role
            if (userProfile.role !== role) {
              toast({
                title: "Login Gagal",
                description: `Anda terdaftar sebagai ${userProfile.role === 'teacher' ? 'Guru' : 'Siswa'}, bukan ${role === 'teacher' ? 'Guru' : 'Siswa'}.`,
                variant: "destructive",
              });
              return;
            }

            toast({
              title: "Login Berhasil",
              description: `Selamat datang kembali, ${userProfile.name}!`,
            });

            // Redirect based on validated user role
            if (userProfile.role === 'teacher') {
              router.push('/guru');
            } else {
              router.push('/siswa');
            }
          } catch (err) {
            console.error('Error getting user profile:', err);
            toast({
              title: "Terjadi Kesalahan",
              description: "Gagal memuat profil pengguna.",
              variant: "destructive",
            });
          }
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signUp(registerEmail, registerPassword, registerName, role);

      if (error) {
        toast({
          title: "Registrasi Gagal",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data?.user) {
        // Check if email confirmation is required
        if (data.user.email_confirmed_at) {
          // Email already confirmed, can login immediately
          toast({
            title: "Registrasi Berhasil",
            description: "Akun Anda telah dibuat dan siap digunakan!",
          });

          // Auto login after successful registration
          setTimeout(async () => {
            const { data: loginData, error: loginError } = await signIn(registerEmail, registerPassword);
            if (loginData?.user && !loginError) {
              // Get user profile to confirm role
              const { user: userProfile } = await getCurrentUser();
              if (userProfile && userProfile.role === role) {
                if (userProfile.role === 'teacher') {
                  router.push('/guru');
                } else {
                  router.push('/siswa');
                }
              }
            }
          }, 1000);
        } else {
          // Email confirmation required
          toast({
            title: "Registrasi Berhasil",
            description: "Akun Anda telah dibuat. Untuk development, Anda bisa langsung login tanpa verifikasi email.",
          });
        }

        // Clear form
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
      }
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                      <input type="radio" id="teacher" name="role" value="teacher" checked={role === 'teacher'} onChange={() => setRole('teacher')} className="form-radio h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
                      <Label htmlFor="teacher">Guru</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="student" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} className="form-radio h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
                      <Label htmlFor="student">Siswa</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="email@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Password</Label>
                  <Input
                    id="password-login"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Login...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Daftar Sebagai?</Label>
                  <RadioGroup defaultValue="teacher" onValueChange={(v) => setRole(v as Role)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="teacher-reg" name="role-reg" value="teacher" checked={role === 'teacher'} onChange={() => setRole('teacher')} className="form-radio h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
                      <Label htmlFor="teacher-reg">Guru</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="student-reg" name="role-reg" value="student" checked={role === 'student'} onChange={() => setRole('student')} className="form-radio h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
                      <Label htmlFor="student-reg">Siswa</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name-register">Nama Lengkap</Label>
                  <Input
                    id="name-register"
                    type="text"
                    placeholder="Nama Anda"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="email@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Password</Label>
                  <Input
                    id="password-register"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
