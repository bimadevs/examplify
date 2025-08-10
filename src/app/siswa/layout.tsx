
import { SimpleSidebar } from '@/components/SimpleSidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Siswa',
  description: 'Dashboard siswa untuk mengerjakan ujian online, melihat hasil, dan bergabung dengan kelas. Platform belajar yang mudah dan interaktif.',
  keywords: [
    'dashboard siswa',
    'ujian online',
    'hasil ujian',
    'kelas online',
    'belajar online',
    'platform siswa'
  ],
  openGraph: {
    title: 'Dashboard Siswa - Examplify',
    description: 'Dashboard siswa untuk mengerjakan ujian online, melihat hasil, dan bergabung dengan kelas. Platform belajar yang mudah dan interaktif.',
    type: 'website',
  },
};

export default function SiswaLayout({
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
