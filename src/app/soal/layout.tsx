import { SimpleSidebar } from '@/components/SimpleSidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bank Soal',
  description: 'Kelola bank soal dengan mudah menggunakan AI atau input manual. Buat, edit, dan organisir soal ujian untuk berbagai mata pelajaran.',
  keywords: [
    'bank soal',
    'manajemen soal',
    'buat soal',
    'generator soal AI',
    'soal ujian',
    'question bank'
  ],
  openGraph: {
    title: 'Bank Soal - Examplify',
    description: 'Kelola bank soal dengan mudah menggunakan AI atau input manual. Buat, edit, dan organisir soal ujian untuk berbagai mata pelajaran.',
    type: 'website',
  },
};

export default function SoalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleSidebar />
      <main className="md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}