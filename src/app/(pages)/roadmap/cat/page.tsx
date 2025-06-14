import CATPreparation from '@/components/roadmaps/CAT';
import React from 'react';

export const metadata = {
    title: 'CAT Exam Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'cat', 'cat exam', 'cat preparation', 'cat roadmap',
        'cat exam roadmap', 'cat preparation roadmap', 'mba entrance', 'cat learning path',
        'cat exam updates', 'cat exam features'
    ],
    description: 'Trackode CAT Exam Roadmap including preparation strategies, important topics, and updates.',
    openGraph: {
        title: 'Trackode CAT Exam Roadmap',
        description: 'Stay updated with our CAT exam roadmap, preparation strategies, and upcoming updates.',
        url: 'https://trackode.in/roadmap/cat',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode CAT Exam Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode CAT Exam Roadmap',
        description: 'Stay updated with our CAT exam roadmap, preparation strategies, and upcoming updates.',
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
        title: 'Trackode CAT Exam Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/cat',
        languages: {
            'en-US': 'https://trackode.in/roadmap/cat',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <CATPreparation />
    </div>
  );
}

export default RoadMap;
