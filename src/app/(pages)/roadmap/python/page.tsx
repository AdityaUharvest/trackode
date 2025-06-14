import PythonRoadmap from '@/components/roadmaps/Python';
import React from 'react';

export const metadata = {
    title: 'python Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'python', 'python roadmap', 'python features', 'python updates',
        'python developer roadmap', 'python programming', 'python career roadmap', 'python backend roadmap',
        'python web development', 'python learning path', 'python placement roadmap'
    ],
    description: 'Trackode python Roadmap including python programming language roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode python Roadmap',
        description: 'Stay updated with our python roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/python',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode python Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode python Roadmap',
        description: 'Stay updated with our python roadmap, features, and upcoming updates.',
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
        title: 'Trackode python Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/python',
        languages: {
            'en-US': 'https://trackode.in/roadmap/python',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <PythonRoadmap />
    </div>
  );
}

export default RoadMap;
