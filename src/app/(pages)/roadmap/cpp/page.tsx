import CRoadmap from '@/components/roadmaps/C';
import CPlusPlusRoadmap from '@/components/roadmaps/Cpp';
import React from 'react'
export const metadata = {
    title: 'c Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'c', 'c roadmap', 'c features', 'c updates',
        'c developer roadmap', 'c programming', 'c career roadmap', 'c backend roadmap',
        'c web development', 'c learning path', 'c placement roadmap'
    ],
    description: 'Trackode c Roadmap including c programming language roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode c Roadmap',
        description: 'Stay updated with our c roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/cpp',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode c Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode c Roadmap',
        description: 'Stay updated with our c roadmap, features, and upcoming updates.',
        images: ['https://trackode.in/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
    },
    themeColor: '#ffffff',
    appleWebApp: {
        capable: true,
        title: 'Trackode c Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/cpp',
        languages: {
            'en-US': 'https://trackode.in/roadmap/cpp',
        },
    },
};
function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <CPlusPlusRoadmap />
    </div>
  )
}

export default RoadMap
