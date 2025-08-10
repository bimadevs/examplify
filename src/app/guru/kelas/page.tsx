"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, PlusCircle, Trash2, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClass, getClassesWithStudentCountsByTeacher, deleteClass } from "@/lib/database";
import type { Class } from "@/lib/supabase";

interface ClassWithStudentCount extends Class {
  student_count: number;
}

export default function KelolaKelasPage() {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassWithStudentCount[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data, error } = await getClassesWithStudentCountsByTeacher();
        if (error) {
          toast({
            title: "Error",
            description: "Gagal memuat data kelas",
            variant: "destructive",
          });
          console.error('Error fetching classes:', error);
        } else {
          setClasses(data || []);
        }
      } catch (error) {
        console.error('Error in fetchClasses:', error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [toast]);

  const handleAddClass = async () => {
    if (!newClassName.trim()) {
      toast({
        title: "Nama Kelas Diperlukan",
        description: "Silakan masukkan nama kelas",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await createClass(newClassName.trim());
      
      if (error) {
        toast({
          title: "Gagal Membuat Kelas",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        // Add the new class to the list with student_count of 0
        const newClassWithCount: ClassWithStudentCount = {
          ...data,
          student_count: 0
        };
        setClasses(prev => [newClassWithCount, ...prev]);
        setNewClassName("");
        toast({
          title: "Kelas Berhasil Dibuat",
          description: `Kelas "${data.name}" berhasil dibuat dengan kode ${data.code}`,
        });
      }
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal membuat kelas. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClass = async (classId: string, className: string) => {
    try {
      const { error } = await deleteClass(classId);
      
      if (error) {
        toast({
          title: "Gagal Menghapus Kelas",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Remove the class from the list
      setClasses(prev => prev.filter(c => c.id !== classId));
      toast({
        title: "Kelas Dihapus",
        description: `Kelas "${className}" berhasil dihapus`,
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal menghapus kelas. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: `Kode kelas "${text}" disalin!` });
  };


  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          Kelola Kelas
        </h1>
        <p className="text-gray-600">Buat dan kelola kelas untuk siswa Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Buat Kelas Baru
              </CardTitle>
              <CardDescription>Masukkan nama kelas yang ingin dibuat.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kelas</Label>
                <Input id="name" name="name" placeholder="Contoh: Biologi Sel" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} />
              </div>
              <Button onClick={handleAddClass} className="w-full" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Membuat...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Buat Kelas
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Daftar Kelas</CardTitle>
              <CardDescription>
                {loading ? "Memuat data kelas..." : `Total ${classes.length} kelas`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-gray-600">Memuat data kelas...</span>
                </div>
              ) : classes.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Belum ada kelas</p>
                  <p className="text-sm text-gray-500">Buat kelas pertama Anda untuk memulai</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Kelas</TableHead>
                      <TableHead>Jumlah Siswa</TableHead>
                      <TableHead>Kode Kelas</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.student_count}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {c.code}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7" 
                              onClick={() => copyToClipboard(c.code)}
                              title="Salin kode kelas"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClass(c.id, c.name)}
                            title="Hapus kelas"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
