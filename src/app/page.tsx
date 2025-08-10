"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BookOpenCheck, Loader2, GraduationCap, Users, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { signIn, signUp, getCurrentUser } from "@/lib/database";
import Image from 'next/image';

type Role = "teacher" | "student";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<Role>("teacher");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
          
          <div className="text-center z-10 max-w-md">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                <Image
                src="/logo-color.png" alt="Bimadev Logo" width={100} height={100}
                >
                </Image>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Selamat Datang di
                <span className="block text-yellow-300">Examplify</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                Platform ujian cerdas dengan teknologi AI untuk masa depan pendidikan yang lebih baik
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-blue-100">Manajemen ujian yang mudah</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-blue-100">Analisis performa siswa</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <BookOpenCheck className="w-4 h-4" />
                </div>
                <span className="text-blue-100">Feedback otomatis dengan AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Masuk ke Akun Anda
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Pilih peran Anda dan masuk untuk melanjutkan
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                {/* Role Selection */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Saya adalah seorang:
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        role === 'teacher'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Guru</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        role === 'student'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Users className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Siswa</span>
                    </button>
                  </div>
                </div>

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                    <TabsTrigger value="login" className="data-[state=active]:bg-white">
                      Masuk
                    </TabsTrigger>
                    <TabsTrigger value="register" className="data-[state=active]:bg-white">
                      Daftar
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-login" className="text-sm font-medium text-gray-700">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="email-login"
                            type="email"
                            placeholder="nama@email.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password-login" className="text-sm font-medium text-gray-700">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="password-login"
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl" 
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sedang masuk...
                          </>
                        ) : (
                          "Masuk"
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name-register" className="text-sm font-medium text-gray-700">
                          Nama Lengkap
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="name-register"
                            type="text"
                            placeholder="Nama lengkap Anda"
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-register" className="text-sm font-medium text-gray-700">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="email-register"
                            type="email"
                            placeholder="nama@email.com"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password-register" className="text-sm font-medium text-gray-700">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="password-register"
                            type={showRegisterPassword ? "text" : "password"}
                            placeholder="Buat password yang kuat"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl" 
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sedang mendaftar...
                          </>
                        ) : (
                          "Daftar Sekarang"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
