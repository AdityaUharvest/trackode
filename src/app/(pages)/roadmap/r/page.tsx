import RRoadMap from "@/components/roadmaps/RRoadmap";
import React from 'react';

export const metadata = {
    title: 'R Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'r', 'r roadmap', 'r features', 'r updates',
        'r developer roadmap', 'r programming', 'r career roadmap', 'r backend roadmap',
        'r web development', 'r learning path', 'r placement roadmap'
    ],
    description: 'Trackode R Roadmap including R programming language roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode R Roadmap',
        description: 'Stay updated with our R roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/r',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode R Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode R Roadmap',
        description: 'Stay updated with our R roadmap, features, and upcoming updates.',
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
        title: 'Trackode R Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/r',
        languages: {
            'en-US': 'https://trackode.in/roadmap/r',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <RRoadMap />
    </div>
  );
}

export default RoadMap;
