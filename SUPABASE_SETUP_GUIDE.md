# 🚀 Panduan Setup Supabase untuk Examplify

## 📋 Langkah-langkah Setup

### 1. **Buat Project Supabase**

1. Kunjungi [supabase.com](https://supabase.com)
2. Klik "Start your project" dan sign up
3. Klik "New Project"
4. Isi detail project:
   - **Name**: `examplify-app`
   - **Database Password**: Buat password yang kuat
   - **Region**: Pilih `Southeast Asia (Singapore)` untuk Indonesia
5. Tunggu project selesai dibuat (2-3 menit)

### 2. **Dapatkan API Keys**

1. Di dashboard Supabase, klik **Settings** → **API**
2. Copy dua nilai ini:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. **Setup Environment Variables**

1. Buka file `.env.local` di root project Anda
2. Ganti dengan credentials Supabase Anda:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. **Buat Database Schema**

1. Di dashboard Supabase, klik **SQL Editor**
2. Klik **New Query**
3. Copy seluruh isi file `supabase-schema.sql` dan paste ke editor
4. Klik **Run** untuk menjalankan script

### 5. **Test Koneksi**

1. Jalankan development server:
```bash
npm run dev
```

2. Buka browser ke `http://localhost:9002`
3. Coba register akun baru sebagai teacher atau student
4. Login dengan akun yang baru dibuat

### 6. **Verifikasi Database**

1. Di dashboard Supabase, klik **Table Editor**
2. Anda harus melihat tabel-tabel berikut:
   - `users`
   - `question_banks`
   - `exam_results`
   - `classes`
   - `class_enrollments`

## 🔧 Troubleshooting

### Error: "Invalid API key"
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah benar
- Restart development server setelah mengubah .env.local

### Error: "relation does not exist"
- Pastikan schema SQL sudah dijalankan dengan benar
- Cek di Table Editor apakah tabel sudah terbuat

### Error: "Row Level Security policy violation"
- Pastikan user sudah login
- Cek apakah RLS policies sudah aktif

### User tidak bisa register
- Cek di **Authentication** → **Settings** → **Auth Providers**
- Pastikan **Email** provider sudah enabled
- Untuk development, disable **Email Confirmations**

## 📊 Monitoring

### Melihat Data
1. **Table Editor**: Lihat data di tabel
2. **Authentication**: Lihat user yang terdaftar
3. **Logs**: Monitor error dan aktivitas

### Real-time Updates
- Supabase sudah support real-time updates
- Data akan sync otomatis antar device

## 🎯 Fitur Baru yang Tersedia

### 1. **Multi-device Access**
- User bisa login dari device manapun
- Data tersimpan permanen di cloud

### 2. **Real-time Collaboration**
- Guru bisa melihat hasil ujian siswa secara real-time
- Update data langsung tersinkronisasi

### 3. **Better Security**
- Row Level Security (RLS) melindungi data
- User hanya bisa akses data mereka sendiri

### 4. **Scalability**
- Support unlimited users
- Database auto-scaling

## 🔄 Migration dari localStorage

Semua data yang sebelumnya disimpan di localStorage sekarang disimpan di Supabase:

| localStorage Key | Supabase Table | Keterangan |
|------------------|----------------|------------|
| `userRole` | `users.role` | Role user (teacher/student) |
| `userInfo` | `users` | Informasi user lengkap |
| `questionBanks` | `question_banks` | Bank soal yang dibuat guru |
| `latestExamResult` | `exam_results` | Hasil ujian siswa |

## 📞 Support

Jika mengalami masalah:
1. Cek console browser untuk error messages
2. Cek Supabase logs di dashboard
3. Pastikan semua environment variables sudah benar
4. Restart development server

## 🎉 Selamat!

Aplikasi Examplify Anda sekarang sudah menggunakan Supabase! 
Data akan tersimpan permanen dan bisa diakses dari mana saja.