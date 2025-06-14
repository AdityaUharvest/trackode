import GoRoadmap from '@/components/roadmaps/Go';
import React from 'react';

export const metadata = {
    title: 'Go Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'go', 'go roadmap', 'go features', 'go updates',
        'go developer roadmap', 'go programming', 'go career roadmap', 'go backend roadmap',
        'go web development', 'go learning path', 'go placement roadmap'
    ],
    description: 'Trackode Go Roadmap including Go programming language roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode Go Roadmap',
        description: 'Stay updated with our Go roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/go',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode Go Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode Go Roadmap',
        description: 'Stay updated with our Go roadmap, features, and upcoming updates.',
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
        title: 'Trackode Go Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/go',
        languages: {
            'en-US': 'https://trackode.in/roadmap/go',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <GoRoadmap />
    </div>
  );
}

export default RoadMap;
