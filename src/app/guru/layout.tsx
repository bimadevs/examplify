
import { SimpleSidebar } from '@/components/SimpleSidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Guru',
  description: 'Dashboard lengkap untuk guru mengelola ujian, bank soal, dan menganalisis performa siswa dengan teknologi AI.',
  keywords: [
    'dashboard guru',
    'manajemen ujian',
    'bank soal',
    'analisis siswa',
    'platform guru',
    'pendidikan digital'
  ],
  openGraph: {
    title: 'Dashboard Guru - Examplify',
    description: 'Dashboard lengkap untuk guru mengelola ujian, bank soal, dan menganalisis performa siswa dengan teknologi AI.',
    type: 'website',
  },
};

export default function GuruLayout({
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
