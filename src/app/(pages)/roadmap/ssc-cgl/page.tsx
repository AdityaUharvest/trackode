import SSCCGLMockTests from "@/components/roadmaps/SSCCGLMockTests";
import React from 'react';

export const metadata = {
    title: 'SSC CGL Mock Test',
    keywords: [
        'Trackode', 'mock test', 'ssc cgl', 'ssc cgl mock test', 'ssc cgl practice', 'ssc cgl preparation',
        'ssc cgl online test', 'ssc cgl exam', 'ssc cgl questions', 'ssc cgl test series', 'ssc cgl free mock test'
    ],
    description: 'Trackode SSC CGL Mock Test including practice questions, test series, and exam preparation resources.',
    openGraph: {
        title: 'Trackode SSC CGL Mock Test',
        description: 'Practice with our SSC CGL mock tests, questions, and exam preparation resources.',
        url: 'https://trackode.in/roadmap/ssc-cgl',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode SSC CGL Mock Test',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode SSC CGL Mock Test',
        description: 'Practice with our SSC CGL mock tests, questions, and exam preparation resources.',
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
        title: 'Trackode SSC CGL Mock Test',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/ssc-cgl',
        languages: {
            'en-US': 'https://trackode.in/roadmap/ssc-cgl',
        },
    },
};

function SscCglMockTestPage() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <SSCCGLMockTests />
    </div>
  );
}

export default SscCglMockTestPage;
