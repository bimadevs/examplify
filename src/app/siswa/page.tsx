"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, PlusCircle, Trash2 } from "lucide-react";
import type { Student } from "@/lib/types";

export default function SiswaPage() {
  const [students, setStudents] = useState<Student[]>([
    { id: "S001", name: "Alex Mercer", class: "12-A" },
    { id: "S002", name: "Zara Evergreen", class: "11-B" },
  ]);
  const [newStudent, setNewStudent] = useState({ name: "", class: "" });

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.class) {
      setStudents([
        ...students,
        { id: `S${String(students.length + 1).padStart(3, '0')}`, ...newStudent },
      ]);
      setNewStudent({ name: "", class: "" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex items-center gap-4">
        <Users className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Siswa</h1>
          <p className="text-muted-foreground">Kelola data siswa yang terdaftar di platform Examplify.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Tambah Siswa Baru
              </CardTitle>
               <CardDescription>Masukkan detail siswa untuk ditambahkan ke sistem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Siswa</Label>
                <Input id="name" name="name" placeholder="Contoh: John Doe" value={newStudent.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Kelas</Label>
                <Input id="class" name="class" placeholder="Contoh: 12-A" value={newStudent.class} onChange={handleInputChange} />
              </div>
              <Button onClick={handleAddStudent} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Siswa
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Siswa</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
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
