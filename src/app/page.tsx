import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCog, Library, FileText, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'Data Guru',
      description: 'Kelola data pengajar',
      icon: <UserCog className="w-8 h-8 text-primary" />,
      href: '/guru',
    },
    {
      title: 'Data Siswa',
      description: 'Kelola data siswa',
      icon: <Users className="w-8 h-8 text-primary" />,
      href: '/siswa',
    },
    {
      title: 'Bank Soal',
      description: 'Buat & kelola soal ujian',
      icon: <Library className="w-8 h-8 text-primary" />,
      href: '/soal',
    },
    {
      title: 'Mulai Ujian',
      description: 'Kerjakan soal ujian',
      icon: <FileText className="w-8 h-8 text-primary" />,
      href: '/ujian',
    },
    {
      title: 'Hasil Analisis',
      description: 'Lihat analisis hasil ujian',
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      href: '/hasil',
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-10 bg-gradient-to-br from-background to-secondary/40">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight">
          Selamat Datang di Examplify
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Platform ujian cerdas yang didukung oleh AI untuk membantu guru dan siswa mencapai potensi penuh mereka.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title} className="group">
            <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                {feature.icon}
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="flex items-center text-primary font-semibold">
                  <span>Mulai</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
