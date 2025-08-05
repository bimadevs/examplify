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
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/guru", label: "Data Guru", icon: UserCog },
  { href: "/siswa", label: "Data Siswa", icon: Users },
  { href: "/soal", label: "Bank Soal", icon: Library },
  { href: "/ujian", label: "Ujian", icon: FileText },
  { href: "/hasil", label: "Hasil", icon: BarChart3 },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();

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
              <Link href={item.href} passHref legacyBehavior>
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
        <SidebarTrigger/>
      </SidebarFooter>
    </Sidebar>
  );
}
