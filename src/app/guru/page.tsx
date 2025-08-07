"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Library, Users, ArrowRight } from "lucide-react";
import Link from 'next/link';

export default function GuruDashboard() {
  const features = [
    {
      title: "Kelola Kelas",
      description: "Buat, lihat, dan kelola kelas Anda.",
      icon: <Users className="w-8 h-8 text-primary" />,
      href: "/guru/kelas",
    },
    {
      title: "Bank Soal",
      description: "Buat dan kelola bank soal untuk ujian.",
      icon: <Library className="w-8 h-8 text-primary" />,
      href: "/soal",
    },
    {
      title: "Analisis Siswa",
      description: "Lihat performa dan analisis siswa.",
      icon: <BarChart className="w-8 h-8 text-primary" />,
      href: "/hasil", // This could lead to an overview page
    },
  ];
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header className="space-y-2">
         <h1 className="text-4xl font-bold tracking-tight text-primary">Dashboard Guru</h1>
         <p className="text-xl text-muted-foreground">Selamat datang kembali! Kelola aktivitas mengajar Anda di sini.</p>
      </header>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
              <CardHeader>
                  <CardTitle>Total Kelas</CardTitle>
                  <CardDescription>Jumlah kelas yang Anda ajar</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="text-4xl font-bold">5</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle>Total Siswa</CardTitle>
                  <CardDescription>Jumlah siswa di semua kelas</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="text-4xl font-bold">120</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle>Bank Soal</CardTitle>
                  <CardDescription>Jumlah bank soal yang telah dibuat</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="text-4xl font-bold">12</p>
              </CardContent>
          </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Akses Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
                <Link href={feature.href} key={feature.title} className="group">
                    <Card className="h-full hover:shadow-xl hover:border-primary/60 transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                            {feature.icon}
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">{feature.description}</p>
                            <div className="flex items-center text-primary font-semibold">
                                <span>Pergi ke Halaman</span>
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
