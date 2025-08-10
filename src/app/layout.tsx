import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: {
    default: 'Examplify - Platform Ujian Cerdas dengan AI',
    template: '%s | Examplify'
  },
  description: 'Platform ujian online terdepan dengan teknologi AI untuk guru dan siswa. Kelola ujian, analisis performa, dan dapatkan feedback otomatis yang cerdas.',
  keywords: [
    'ujian online',
    'platform pendidikan',
    'AI education',
    'manajemen ujian',
    'analisis siswa',
    'e-learning Indonesia',
    'sistem ujian',
    'pendidikan digital',
    'guru siswa',
    'teknologi pendidikan'
  ],
  authors: [{ name: 'bimadev' }],
  creator: 'bimadev',
  publisher: 'bimadev',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://examplify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    title: 'Examplify - Platform Ujian Cerdas dengan AI',
    description: 'Platform ujian online terdepan dengan teknologi AI untuk guru dan siswa. Kelola ujian, analisis performa, dan dapatkan feedback otomatis yang cerdas.',
    siteName: 'Examplify',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Examplify - Platform Ujian Cerdas dengan AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Examplify - Platform Ujian Cerdas dengan AI',
    description: 'Platform ujian online terdepan dengan teknologi AI untuk guru dan siswa.',
    images: ['/twitter-image.png'],
    creator: '@examplify',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Examplify",
    "description": "Platform ujian online terdepan dengan teknologi AI untuk guru dan siswa. Kelola ujian, analisis performa, dan dapatkan feedback otomatis yang cerdas.",
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://examplify.app",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IDR"
    },
    "creator": {
      "@type": "Organization",
      "name": "Examplify Team"
    },
    "featureList": [
      "Manajemen ujian online",
      "Analisis performa siswa dengan AI",
      "Feedback otomatis",
      "Dashboard guru dan siswa",
      "Bank soal digital"
    ]
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Code+Pro:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={cn('min-h-screen bg-background font-body antialiased')}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
