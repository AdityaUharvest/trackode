import PHPRoadMap from "@/components/roadmaps/PHPRoadmap";
import React from 'react';

export const metadata = {
    title: 'PHP Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'php', 'php roadmap', 'php features', 'php updates',
        'php developer roadmap', 'php programming', 'php career roadmap', 'php backend roadmap',
        'php web development', 'php learning path', 'php placement roadmap'
    ],
    description: 'Trackode PHP Roadmap including PHP programming language roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode PHP Roadmap',
        description: 'Stay updated with our PHP roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/php',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode PHP Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode PHP Roadmap',
        description: 'Stay updated with our PHP roadmap, features, and upcoming updates.',
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
        title: 'Trackode PHP Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/php',
        languages: {
            'en-US': 'https://trackode.in/roadmap/php',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <PHPRoadMap />
    </div>
  );
}

export default RoadMap;
