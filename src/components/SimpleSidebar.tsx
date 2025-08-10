"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  Library,
  FileText,
  BarChart3,
  BookOpenCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { getCurrentUser, signOut } from "@/lib/database";
import type { User } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";

const teacherNavItems = [
  { href: "/guru", label: "Dashboard", icon: LayoutDashboard },
  { href: "/guru/kelas", label: "Kelola Kelas", icon: Users },
  { href: "/soal", label: "Bank Soal", icon: Library },
  { href: "/guru/ujian", label: "Kelola Ujian", icon: FileText },
  { href: "/guru/hasil", label: "Hasil Siswa", icon: BarChart3 },
];

const studentNavItems = [
  { href: "/siswa", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ujian", label: "Ujian", icon: FileText },
  { href: "/hasil", label: "Hasil Ujian", icon: BarChart3 },
];

export function SimpleSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
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

  if (loading || !user) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold text-primary">Examplify</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-primary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-white">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role === 'teacher' ? 'Guru' : 'Siswa'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}