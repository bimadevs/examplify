# Technology Stack & Development

## Core Technologies

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI**: Google Genkit with Gemini 2.0 Flash model
- **Backend**: Firebase (hosting and services)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# AI development with Genkit
npm run genkit:dev
npm run genkit:watch

# Build and deployment
npm run build
npm run start

# Code quality
npm run lint
npm run typecheck
```

## Key Dependencies

- **UI Components**: Radix UI primitives with shadcn/ui styling
- **State Management**: React Hook Form for forms, built-in React state
- **Validation**: Zod schemas for type-safe validation
- **Date Handling**: date-fns library
- **Styling Utilities**: clsx, tailwind-merge, class-variance-authority

## Development Patterns

- Use `'use server'` for server actions and AI flows
- TypeScript interfaces defined in `src/lib/types.ts`
- Utility functions in `src/lib/utils.ts`
- AI flows follow Genkit patterns with input/output schemas
- Components use shadcn/ui conventions with Tailwind classes