"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, PlusCircle, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Class {
    id: string;
    name: string;
    studentCount: number;
    classCode: string;
}

export default function KelolaKelasPage() {
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([
    { id: "C001", name: "Fisika Kuantum Lanjutan", studentCount: 25, classCode: "PHY-ADV" },
    { id: "C002", name: "Sejarah Peradaban Kuno", studentCount: 30, classCode: "HIST-ANC" },
    { id: "C003", name: "Matematika Diskret", studentCount: 28, classCode: "MATH-DISC" },
  ]);
  const [newClassName, setNewClassName] = useState("");

  const handleAddClass = () => {
    if (newClassName) {
        const newClass: Class = {
            id: `C${String(classes.length + 1).padStart(3, '0')}`,
            name: newClassName,
            studentCount: 0,
            classCode: `${newClassName.substring(0,4).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        };
      setClasses([...classes, newClass]);
      setNewClassName("");
       toast({
        title: "Kelas Ditambahkan",
        description: `Kelas "${newClassName}" berhasil dibuat.`,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: `Kode kelas "${text}" disalin!` });
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex items-center gap-4">
        <Users className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Kelas</h1>
          <p className="text-muted-foreground">Buat dan kelola kelas untuk siswa Anda.</p>
        </div>
      </header>

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
              <Button onClick={handleAddClass} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Buat Kelas
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kelas</CardTitle>
            </CardHeader>
            <CardContent>
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
                      <TableCell>{c.studentCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                            <span>{c.classCode}</span>
                             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(c.classCode)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
