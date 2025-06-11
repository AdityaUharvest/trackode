import RoadMap from '@/components/roadmaps/Main';
import React from 'react';


export const metadata = {
  title: 'Roadmap',
  keywords: [
    'Trackode', 'roadmap', 'features', 'updates',
    'programming language roadmap', 'python roadmap', 'java roadmap', 'javascript roadmap',
    'c++ roadmap', 'typescript roadmap', 'web development roadmap', 'frontend roadmap',
    'backend roadmap', 'devops roadmap', 'data science roadmap', 'machine learning roadmap',
    'TCS NQT roadmap', 'placement roadmap', 'career roadmap', 'developer roadmap'
  ],
  description: 'Trackode Roadmap including programming language roadmaps, TCS NQT roadmap, and more.',
  openGraph: {
    title: 'Trackode Roadmap',
    description: 'Stay updated with our upcoming features, programming language roadmaps, TCS NQT roadmap, and more.',
    url: 'https://trackode.in/roadmap',
    siteName: 'Trackode',
    images: [
      {
        url: 'https://trackode.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Trackode Roadmap',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trackode Roadmap',
    description: 'Stay updated with our upcoming features, programming language roadmaps, TCS NQT roadmap, and more.',
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
    title: 'Trackode Roadmap',
    statusBarStyle: 'default',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  alternates: {
    canonical: 'https://trackode.in/roadmap',
    languages: {
      'en-US': 'https://trackode.in/roadmap',
    },
  },
};

export default function page() {
  return (

    <>
    
    <RoadMap/>
    </>
  )
}

