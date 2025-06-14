import KotlinRoadMap from "@/components/roadmaps/KotlinRoadmap"
import React from 'react';

export const metadata = {
    title: 'Kotlin Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'kotlin', 'kotlin roadmap', 'kotlin features', 'kotlin updates',
        'kotlin developer roadmap', 'kotlin programming', 'kotlin career roadmap', 'kotlin backend roadmap',
        'kotlin web development', 'kotlin learning path', 'kotlin placement roadmap'
    ],
    description: 'Trackode Kotlin Roadmap including Kotlin programming language roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode Kotlin Roadmap',
        description: 'Stay updated with our Kotlin roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/kotlin',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode Kotlin Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode Kotlin Roadmap',
        description: 'Stay updated with our Kotlin roadmap, features, and upcoming updates.',
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
        title: 'Trackode Kotlin Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/kotlin',
        languages: {
            'en-US': 'https://trackode.in/roadmap/kotlin',
        },
    },
};

function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <KotlinRoadMap />
    </div>
  );
}

export default RoadMap;
