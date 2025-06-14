import GATEMockTests from '@/components/roadmaps/GATEMockTests';
import React from 'react';

export const metadata = {
    title: 'GATE IIT Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'GATE', 'GATE IIT', 'GATE roadmap', 'GATE features', 'GATE updates',
        'GATE exam roadmap', 'GATE preparation', 'GATE career roadmap', 'GATE IIT roadmap',
        'GATE learning path', 'GATE placement roadmap'
    ],
    description: 'Trackode GATE IIT Roadmap including exam preparation, features, and updates.',
    openGraph: {
        title: 'Trackode GATE IIT Roadmap',
        description: 'Stay updated with our GATE IIT roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/gate',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode GATE IIT Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode GATE IIT Roadmap',
        description: 'Stay updated with our GATE IIT roadmap, features, and upcoming updates.',
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
        title: 'Trackode GATE IIT Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/gate',
        languages: {
            'en-US': 'https://trackode.in/roadmap/gate',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <GATEMockTests />
    </div>
  );
}

export default RoadMap;
