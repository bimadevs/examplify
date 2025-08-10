
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Library,
  FileText,
  BarChart3,
  BookOpenCheck,
  LogOut,
  BookPlus,
  ClipboardPenLine,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser, signOut } from "@/lib/database";
import type { User } from "@/lib/supabase";

const teacherNavItems = [
  { href: "/guru", label: "Dashboard", icon: LayoutDashboard },
  { href: "/guru/kelas", label: "Kelola Kelas", icon: Users },
  { href: "/soal", label: "Bank Soal", icon: Library },
  { href: "/hasil", label: "Analisis Siswa", icon: BarChart3 },
];

const studentNavItems = [
  { href: "/siswa", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ujian", label: "Ujian", icon: FileText },
  { href: "/hasil", label: "Hasil Ujian", icon: BarChart3 },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Get current user
    getCurrentUser().then(({ user, error }) => {
      if (user) {
        setUser(user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { user } = await getCurrentUser();
          setUser(user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          router.push("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    router.push("/");
  };
  
  const navItems = user?.role === 'teacher' ? teacherNavItems : studentNavItems;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(false)}>
                <BookOpenCheck className="w-6 h-6 text-primary" />
            </Button>
            <h1 className="text-xl font-semibold text-primary font-headline">Examplify</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        <SidebarTrigger/>
      </SidebarFooter>
    </Sidebar>
  );
}
