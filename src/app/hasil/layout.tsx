
import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/SidebarNav';

export default function HasilLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SidebarNav />
      <div className="flex-1 md:ml-[--sidebar-width-icon] lg:ml-0">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
