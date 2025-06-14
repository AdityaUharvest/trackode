import SSCCHSLMockTests from "@/components/roadmaps/SSCCHSLMockTests";
import React from 'react';

export const metadata = {
    title: 'SSC CHSL Mock Test',
    keywords: [
        'Trackode', 'mock test', 'ssc chsl', 'ssc chsl mock test', 'ssc chsl practice', 'ssc chsl preparation',
        'ssc chsl online test', 'ssc chsl exam', 'ssc chsl questions', 'ssc chsl test series', 'ssc chsl free mock test'
    ],
    description: 'Trackode SSC chsl Mock Test including practice questions, test series, and exam preparation resources.',
    openGraph: {
        title: 'Trackode SSC chsl Mock Test',
        description: 'Practice with our SSC chsl mock tests, questions, and exam preparation resources.',
        url: 'https://trackode.in/roadmap/ssc-chsl',
        siteName: 'Trackode',
        images: [
            {
                url: 'https://trackode.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Trackode SSC chsl Mock Test',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trackode SSC chsl Mock Test',
        description: 'Practice with our SSC chsl mock tests, questions, and exam preparation resources.',
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
        title: 'Trackode SSC chsl Mock Test',
        statusBarStyle: 'default',
    },
    
    alternates: {
        canonical: 'https://trackode.in/roadmap/ssc-chsl',
        languages: {
            'en-US': 'https://trackode.in/roadmap/ssc-chsl',
        },
    },
};

function SscCglMockTestPage() {
  return (
    <div className="dark:bg-gray-800 bg-white min-h-screen py-12">
      <SSCCHSLMockTests />
    </div>
  );
}

export default SscCglMockTestPage;
