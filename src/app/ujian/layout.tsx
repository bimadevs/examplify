import { SimpleSidebar } from '@/components/SimpleSidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ujian Online',
  description: 'Kerjakan ujian online dengan mudah dan aman. Platform ujian digital yang mendukung berbagai jenis soal dengan sistem penilaian otomatis.',
  keywords: [
    'ujian online',
    'tes online',
    'exam online',
    'ujian digital',
    'platform ujian',
    'sistem ujian'
  ],
  openGraph: {
    title: 'Ujian Online - Examplify',
    description: 'Kerjakan ujian online dengan mudah dan aman. Platform ujian digital yang mendukung berbagai jenis soal dengan sistem penilaian otomatis.',
    type: 'website',
  },
};

export default function UjianLayout({
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