
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
  const [role, setRole] = React.useState<"teacher" | "student" | null>(null);

  React.useEffect(() => {
    const userRole = localStorage.getItem("userRole") as "teacher" | "student" | null;
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");
    router.push("/");
  };
  
  const navItems = role === 'teacher' ? teacherNavItems : studentNavItems;

  if (!role) {
    return null; // Or a loading spinner
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
