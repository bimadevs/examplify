"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCog, PlusCircle, Trash2 } from "lucide-react";
import type { Teacher } from "@/lib/types";

export default function GuruPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: "T001", name: "Dr. Elara Vance", subject: "Fisika Kuantum" },
    { id: "T002", name: "Prof. Kaelen Reed", subject: "Sejarah Kuno" },
  ]);
  const [newTeacher, setNewTeacher] = useState({ name: "", subject: "" });

  const handleAddTeacher = () => {
    if (newTeacher.name && newTeacher.subject) {
      setTeachers([
        ...teachers,
        { id: `T${String(teachers.length + 1).padStart(3, '0')}`, ...newTeacher },
      ]);
      setNewTeacher({ name: "", subject: "" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeacher(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex items-center gap-4">
        <UserCog className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Guru</h1>
          <p className="text-muted-foreground">Kelola data pengajar di platform Examplify.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Tambah Guru Baru
              </CardTitle>
              <CardDescription>Masukkan detail guru untuk ditambahkan ke sistem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Guru</Label>
                <Input id="name" name="name" placeholder="Contoh: Jane Doe" value={newTeacher.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Mata Pelajaran</Label>
                <Input id="subject" name="subject" placeholder="Contoh: Matematika" value={newTeacher.subject} onChange={handleInputChange} />
              </div>
              <Button onClick={handleAddTeacher} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Guru
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Guru</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Guru</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.id}</TableCell>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.subject}</TableCell>
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
