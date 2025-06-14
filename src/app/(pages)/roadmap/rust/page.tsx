import RustRoadMap from "@/components/roadmaps/RustRoadmap";
import React from 'react';

export const metadata = {
    title: 'Rust Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'rust', 'rust roadmap', 'rust features', 'rust updates',
        'rust developer roadmap', 'rust programming', 'rust career roadmap', 'rust backend roadmap',
        'rust web development', 'rust learning path', 'rust placement roadmap'
    ],
    description: 'Trackode Rust Roadmap including Rust programming language roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode Rust Roadmap',
        description: 'Stay updated with our Rust roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/rust',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode Rust Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode Rust Roadmap',
        description: 'Stay updated with our Rust roadmap, features, and upcoming updates.',
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
        title: 'Trackode Rust Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/rust',
        languages: {
            'en-US': 'https://trackode.in/roadmap/rust',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <RustRoadMap />
    </div>
  );
}

export default RoadMap;
