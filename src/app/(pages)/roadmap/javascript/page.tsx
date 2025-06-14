import JavaScriptRoadmap from '@/components/roadmaps/JavaScript';
import React from 'react';

export const metadata = {
    title: 'JavaScript Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'javascript', 'javascript roadmap', 'javascript features', 'javascript updates',
        'javascript developer roadmap', 'javascript programming', 'javascript career roadmap', 'javascript backend roadmap',
        'javascript web development', 'javascript learning path', 'javascript placement roadmap'
    ],
    description: 'Trackode JavaScript Roadmap including JavaScript programming language roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode JavaScript Roadmap',
        description: 'Stay updated with our JavaScript roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/javascript',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode JavaScript Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode JavaScript Roadmap',
        description: 'Stay updated with our JavaScript roadmap, features, and upcoming updates.',
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
        title: 'Trackode JavaScript Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/javascript',
        languages: {
            'en-US': 'https://trackode.in/roadmap/javascript',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <JavaScriptRoadmap />
    </div>
  );
}

export default RoadMap;
