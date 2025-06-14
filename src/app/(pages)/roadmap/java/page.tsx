import JavaRoadmap from '@/components/roadmaps/Java';
import React from 'react'
export const metadata = {
    title: 'Java Roadmap',
    keywords: [
        'Trackode', 'roadmap', 'java', 'java roadmap', 'java features', 'java updates',
        'java developer roadmap', 'java programming', 'java career roadmap', 'java backend roadmap',
        'java web development', 'java learning path', 'java placement roadmap'
    ],
    description: 'Trackode Java Roadmap including Java programming language roadmap, features, and updates.',
    openGraph: {
        title: 'Trackode Java Roadmap',
        description: 'Stay updated with our Java roadmap, features, and upcoming updates.',
        url: 'https://trackode.in/roadmap/java',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode Java Roadmap',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode Java Roadmap',
        description: 'Stay updated with our Java roadmap, features, and upcoming updates.',
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
        title: 'Trackode Java Roadmap',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/java',
        languages: {
            'en-US': 'https://trackode.in/roadmap/java',
        },
    },
};
function RoadMap() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <JavaRoadmap />
    </div>
  )
}

export default RoadMap
