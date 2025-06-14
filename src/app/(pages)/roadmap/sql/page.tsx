import SQLRoadMap from "@/components/roadmaps/SQLRoadmap";
import React from 'react';

export const metadata = {
    title: 'SQL Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'sql', 'sql roadmap', 'sql features', 'sql updates',
        'sql developer roadmap', 'sql programming', 'sql career roadmap', 'sql backend roadmap',
        'sql web development', 'sql learning path', 'sql placement roadmap'
    ],
    description: 'Trackode SQL Roadmap including SQL programming language roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode SQL Roadmap',
        description: 'Stay updated with our SQL roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/sql',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode SQL Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode SQL Roadmap',
        description: 'Stay updated with our SQL roadmap, features, and upcoming updates.',
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
        title: 'Trackode SQL Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/sql',
        languages: {
            'en-US': 'https://trackode.in/roadmap/sql',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <SQLRoadMap />
    </div>
  );
}

export default RoadMap;
