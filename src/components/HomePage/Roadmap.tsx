"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeContext';
// A new component to render the roadmap items with links and images
const RoadmapList = () => {
  const roadmapItems = [
    { name: 'TCS NQT', slug: 'tcs-nqt', icon: '/tcs.png' },
    { name: 'GATE', slug: 'gate', icon: 'https://img.icons8.com/fluency/96/graduation-cap.png' },
    { name: 'SSC CGL', slug: 'ssc-cgl', icon: '/ssc.png' },
    { name: 'SSC CHSL', slug: 'ssc-chsl', icon: '/ssc.png'},
    { name: 'Banking', slug: 'banking', icon: '/banking.png' },
    { name: 'C', slug: 'c', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'C++', slug: 'cpp', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'Go', slug: 'go', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
    { name: 'Java', slug: 'java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'JavaScript', slug: 'javascript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'Kotlin', slug: 'kotlin', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
    { name: 'PHP', slug: 'php', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
    { name: 'Python', slug: 'python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'R', slug: 'r', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg' },
    { name: 'Ruby', slug: 'ruby', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg' },
    { name: 'Rust', slug: 'rust', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg' },
    { name: 'SQL', slug: 'sql', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
];

  return (
    <div className="mx-auto px-4">
      <div className="grid grid-cols-2  md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {roadmapItems.map((item, index) => (
      
          <div
            key={item.slug}
            className="group relative overflow-hidden"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <Link
              href={`/roadmap/${item.slug}`}
              className="block p-4 bg-gray-50 dark:bg-gray-700/50
                         rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
                         border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600
                         transform hover:-translate-y-2 hover:scale-105"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full 
                              bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30
                              group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={item.icon}
                    alt={`${item.name} icon`}
                    className=" h-10 rounded-full   group-hover:brightness-110"
                    width={40}
                    height={40}
                  />
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 
                             group-hover:text-indigo-600 dark:group-hover:text-indigo-400 
                             transition-colors duration-300">
                  {item.name}
                </h3>
                
                {/* Animated arrow */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 
                              translate-y-2 group-hover:translate-y-0">
                  <svg className="w-5 h-5 text-indigo-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                            transition-transform duration-1000 bg-gradient-to-r 
                            from-transparent via-white/20 to-transparent skew-x-12"></div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

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
  
  appleWebApp: {
    capable: true,
    title: 'Trackode Roadmap',
    statusBarStyle: 'default',
  },
  
  alternates: {
    canonical: 'https://trackode.in/roadmap',
    languages: {
      'en-US': 'https://trackode.in/roadmap',
    },
  },
};

function RoadMap() {
  const { theme } = useTheme();
  return (
    <div 
    style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }}
 className=" bg-gradient-to-br from-gray-100 via-white to-indigo-100 
                    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 ">

      {/* Header Section */}
      <div  className="max-w-4xl mx-auto text-center mb-10">
        <div  className="relative">
          <h1 className="text-3xl md:text-4xl font-bold  
                          mb-2 leading-tight">
            Trackode <span className='text-indigo-500'>Roadmap</span>
          </h1>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-indigo-500 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-500 rounded-full  opacity-40"></div>
        </div>
        
        
        {/* Stats or decorative elements */}
        <div className="flex justify-center items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 text-sm bg-green-500 rounded-full animate-pulse"></div>
            <span>17+ Roadmaps</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span>Regular Updates</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Free Access</span>
          </div>
        </div>
      </div>

      {/* Roadmap Grid */}
      <RoadmapList />
      
      {/* Footer note */}
      

      {/* Add CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .group:hover .animate-bounce {
            animation: bounce 1s infinite;
          }
        `
      }} />
    </div>
  );
}

export default RoadMap;