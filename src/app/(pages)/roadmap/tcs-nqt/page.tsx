import TCSRoadmap from '@/components/roadmaps/TCS';
import React from 'react';

export const metadata = {
    title: 'TCS Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'TCS', 'TCS roadmap', 'TCS features', 'TCS updates',
        'TCS developer roadmap', 'TCS programming', 'TCS career roadmap', 'TCS backend roadmap',
        'TCS web development', 'TCS learning path', 'TCS placement roadmap'
    ],
    description: 'Trackode TCS Roadmap including TCS programming language roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode TCS Roadmap',
        description: 'Stay updated with our TCS roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/tcs-nqt',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode TCS Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode TCS Roadmap',
        description: 'Stay updated with our TCS roadmap, features, and upcoming updates.',
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
        title: 'Trackode TCS Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/TCS',
        languages: {
            'en-US': 'https://trackode.in/roadmap/TCS',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <TCSRoadmap />
    </div>
  );
}

export default RoadMap;
