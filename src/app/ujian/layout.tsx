import { SimpleSidebar } from '@/components/SimpleSidebar';

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