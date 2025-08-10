# Project Structure & Organization

## App Router Structure

```
src/app/
├── layout.tsx          # Root layout with fonts and global styles
├── page.tsx           # Landing/home page
├── guru/              # Teacher dashboard and management
│   ├── layout.tsx     # Teacher-specific layout
│   ├── page.tsx       # Teacher dashboard
│   └── kelas/         # Class management
├── siswa/             # Student interface
│   ├── layout.tsx     # Student-specific layout
│   ├── page.tsx       # Student dashboard
│   └── kelas/[id]/    # Dynamic class pages
├── soal/              # Question management
├── ujian/             # Exam interface
└── hasil/             # Results and analysis
```

## Component Organization

- **UI Components**: `src/components/ui/` - shadcn/ui components
- **Custom Components**: `src/components/` - application-specific components
- **Hooks**: `src/hooks/` - custom React hooks
- **Types**: `src/lib/types.ts` - TypeScript interfaces
- **Utils**: `src/lib/utils.ts` - utility functions

## AI Architecture

```
src/ai/
├── genkit.ts          # AI configuration and setup
├── dev.ts             # Development server entry
└── flows/             # AI flow definitions
    ├── analyze-student-performance.ts
    └── generate-exam-questions.ts
```

## Naming Conventions

- **Indonesian Terms**: 
  - `guru` = teacher
  - `siswa` = student  
  - `soal` = questions
  - `ujian` = exam
  - `hasil` = results
- **File Names**: kebab-case for files, PascalCase for components
- **Routes**: Follow role-based structure (`/guru`, `/siswa`)

## Key Patterns

- Each role has its own layout and nested routes
- AI flows use Zod schemas for input/output validation
- Server actions marked with `'use server'`
- Dynamic routes use Next.js bracket notation `[id]`