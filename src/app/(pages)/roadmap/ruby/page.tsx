import RubyRoadmap from '@/components/roadmaps/Ruby';
import React from 'react';

export const metadata = {
    title: 'ruby Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'ruby', 'ruby roadmap', 'ruby features', 'ruby updates',
        'ruby developer roadmap', 'ruby programming', 'ruby career roadmap', 'ruby backend roadmap',
        'ruby web development', 'ruby learning path', 'ruby placement roadmap'
    ],
    description: 'Trackode ruby Roadmap including ruby programming language roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode ruby Roadmap',
        description: 'Stay updated with our ruby roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/ruby',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode ruby Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode ruby Roadmap',
        description: 'Stay updated with our ruby roadmap, features, and upcoming updates.',
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
        title: 'Trackode ruby Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/ruby',
        languages: {
            'en-US': 'https://trackode.in/roadmap/ruby',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <RubyRoadmap />
    </div>
  );
}

export default RoadMap;
