import React from 'react';
import { useTheme } from '../ThemeContext';
import Link from 'next/link';

const AlternatingSections = () => {
    const { theme } = useTheme();
    
    const isDark = theme === 'dark';
    const bg = isDark ? 'bg-gradient-to-r from-gray-950 via-gray-900 bg-gray-950' : 'bg-indigo-50';
    const text = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-indigo-200' : 'text-gray-600';
    const cardBg = isDark ? 'bg-gray-800' : 'bg-white';

    const sections = [
        {
            id: 'quizzes',
            title: 'Programming Quizzes',
            description: 'Master programming concepts with comprehensive quizzes across multiple languages.',
            image: 'https://plus.unsplash.com/premium_photo-1690303193720-38d825579eef?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            link: '/programming-quizzes',
            stats: ['15+ Languages', '500+ Questions'],
            badge: 'Interactive Learning',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            )
        },
        {
            id: 'mocks',
            title: 'Mock Tests',
            description: 'Practice with realistic mock tests designed to simulate real interview scenarios.',
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop&auto=format',
            link: '/mocks',
            stats: ['250+ Tests', '20+ Exams'],
            badge: 'Mock Assessments',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            )
        },
        {
            id: 'roadmaps',
            title: 'Learning Roadmaps',
            description: 'Follow structured learning paths designed by industry experts with milestone tracking.',
            image: 'https://plus.unsplash.com/premium_photo-1661311950994-d263ea9681a1?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            link: '/roadmap',
            stats: ['TCS NQT', 'Government Exams'],
            badge: 'Learning Paths',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
            )
        }
    ];

    return (
        <div className={`w-full ${bg}  py-16 min-h-screen flex items-center`}>
            <div className="max-w-7xl mx-auto px-3 w-full">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-10 h-10 bg-indigo-500 rounded-sm flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h2 className={`text-2xl md:text-3xl uppercase font-black  ${text} mb-4`}>
                        Level Up Your Technical  <span className='text-indigo-500 border-b-2  shadow-inner shadow-indigo-400 border-indigo-400 p-1'>Skills</span>
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className={`${cardBg} rounded-sm hover:text-indigo-400 shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-in-out`}
                        >
                            {/* Card Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={section.image}
                                    alt={section.title}
                                    className="w-full h-full object-cover"
                                />
                                target
                            </div>

                            {/* Card Content */}
                            <div className="p-6  ">
                                <h3 className={`text-xl  font-bold ${text} mb-3`}>
                                    {section.title}
                                </h3>
                                <p className={` mb-4 text-sm leading-relaxed`}>
                                    {section.description}
                                </p>

                                {/* Stats */}
                                <div className="flex gap-4 mb-6">
                                    {section.stats.map((stat, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-sm mr-2"></div>
                                            <span className={`text-sm ${text}`}>{stat}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <Link
                                    href={section.link}
                                    className="w-full inline-flex items-center justify-center px-6 py-3 hover:bg-indigo-500 hover:text-white text-indigo-500 bg-transparent border-indigo-600 border-2  font-semibold rounded-sm transition-colors duration-200"
                                >
                                    Get Started
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AlternatingSections;