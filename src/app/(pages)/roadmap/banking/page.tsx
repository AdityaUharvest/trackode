import React from 'react';
import BankingExamsMockTests from '@/components/roadmaps/BankingExamsMockTests';
export const metadata = {
    title: 'Banking Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'banking', 'banking roadmap', 'banking features', 'banking updates',
        'banking career roadmap', 'banking industry', 'banking learning path', 'banking placement roadmap'
    ],
    description: 'Trackode Banking Roadmap including banking industry roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode Banking Roadmap',
        description: 'Stay updated with our banking roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/banking',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode Banking Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode Banking Roadmap',
        description: 'Stay updated with our banking roadmap, features, and upcoming updates.',
        images: ['https://trackode.in/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
    },
    
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/banking',
        languages: {
            'en-US': 'https://trackode.in/roadmap/banking',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <BankingExamsMockTests />
    </div>
  );
}

export default RoadMap;
