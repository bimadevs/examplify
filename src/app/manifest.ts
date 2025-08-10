import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Examplify - Platform Ujian Cerdas dengan AI',
    short_name: 'Examplify',
    description: 'Platform ujian online terdepan dengan teknologi AI untuk guru dan siswa. Kelola ujian, analisis performa, dan dapatkan feedback otomatis yang cerdas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4285F4',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['education', 'productivity'],
    lang: 'id',
    orientation: 'portrait-primary',
  }
}