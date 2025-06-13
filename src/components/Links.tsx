import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
// Theme Context (your existing theme provider)
export type Theme = "light" | "dark";





// RotatingText Component


// Main Component
const AlternatingSections = () => {
    const { theme, toggleTheme } = useTheme();
    
    const themeClasses = {
        background: theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' 
            : 'bg-gradient-to-br from-slate-50 via-white to-blue-50',
        text: theme === 'dark' ? 'text-white' : 'text-gray-900',
        textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
        cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        cardBorder: theme === 'dark' ? 'border-gray-700' : 'border-gray-100',
        tagBg: {
            blue: theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700',
            purple: theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700',
            green: theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
        }
    };

    return (
        <div style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }} className={`w-full ${themeClasses.background} transition-colors duration-300`}>
            {/* Theme Toggle Button */}
            

            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="text-center mb-12 md:mb-20">
                    <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 md:mb-6 shadow-lg">
                        <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h2 className={`text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-200 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 md:mb-6 ${theme === 'dark' ? 'from-gray-100 via-blue-400 to-purple-400' : ''}`}>
                        Level Up Your Coding Skills
                    </h2>
                    <p className={`text-base md:text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto leading-relaxed`}>
                        Join thousands of developers mastering programming through interactive learning experiences
                        designed by industry experts
                    </p>
                </div>

                <div className="space-y-16 md:space-y-32">
                    {/* Section 1 - Quizzes */}
                    <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
                        <div className="flex-1 lg:pr-8">
                            <div className={`inline-flex items-center px-3 py-2 md:px-4 md:py-2 ${themeClasses.tagBg.blue} rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6`}>
                                <svg className="w-3 h-3 md:w-4 md:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                Interactive Learning
                            </div>
                            <h3 className={`text-2xl md:text-4xl font-bold ${themeClasses.text} mb-4 md:mb-6 leading-tight`}>
                                Interactive Programming Quizzes
                            </h3>
                            <p className={`text-sm md:text-lg ${themeClasses.textSecondary} mb-6 md:mb-8 leading-relaxed`}>
                                Master programming concepts with our comprehensive quiz collection. Test your
                                knowledge across multiple languages and difficulty levels with real-time feedback
                                and detailed explanations.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-2 md:mr-3"></div>
                                    <span className={`text-sm md:text-base ${themeClasses.text}`}>15+ Programming Languages</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full mr-2 md:mr-3"></div>
                                    <span className={`text-sm md:text-base ${themeClasses.text}`}>500+ Practice Questions</span>
                                </div>
                            </div>
                            <a
                                href="/programming-quizzes"
                                className="group inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-sm md:text-base"
                            >
                                <svg
                                    className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 group-hover:rotate-12 transition-transform duration-300"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M8.18 13.426C6.86 14.392 5 13.448 5 11.811V5.439C5 3.802 6.86 2.858 8.18 3.824L12.54 7.01C13.634 7.809 13.634 9.441 12.54 10.24L8.18 13.426Z"
                                        strokeWidth="2"
                                    />
                                </svg>
                                Explore Quizzes
                                <svg className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                        <div className="flex-1">
                            <div  className="relative group">
                                <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl md:rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div  style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }} className={`relative ${themeClasses.cardBg} rounded-xl md:rounded-2xl p-4 md:p-8 shadow-2xl border ${themeClasses.cardBorder}`}>
                                    <img
                                        src="https://plus.unsplash.com/premium_photo-1690303193720-38d825579eef?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Interactive Programming Quizzes"
                                        className="w-72  md:w-72 lg:w-full  h-40 md:h-64 object-cover rounded-lg md:rounded-xl mb-4 md:mb-6"
                                    />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className={`font-semibold text-sm md:text-base ${themeClasses.text}`}>Quiz Completed</p>
                                                <p className={`text-xs md:text-sm ${themeClasses.textSecondary}`}>Score: 95%</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl md:text-2xl font-bold text-blue-600">A+</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 - Mock Tests */}
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-8 md:gap-16">
                        <div className="flex-1 lg:pl-8">
                            <div className={`inline-flex items-center px-3 py-2 md:px-4 md:py-2 ${themeClasses.tagBg.purple} rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6`}>
                                <svg className="w-3 h-3 md:w-4 md:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                Mock Assessments
                            </div>
                            <h3 className={`text-2xl md:text-4xl font-bold ${themeClasses.text} mb-4 md:mb-6 leading-tight`}>Free Mock Tests</h3>
                            <p className={`text-sm md:text-lg ${themeClasses.textSecondary} mb-6 md:mb-8 leading-relaxed`}>
                                Practice with realistic mock tests designed to simulate real interview scenarios.
                                Get detailed feedback, performance analytics, and personalized improvement
                                recommendations.
                            </p>
                            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-50 to-blue-100'} p-3 md:p-4 rounded-xl`}>
                                    <div className="text-lg md:text-2xl font-bold text-blue-600 mb-1">250+</div>
                                    <div className="text-xs md:text-sm text-blue-700">Mock Tests</div>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-green-900 to-green-800' : 'bg-gradient-to-br from-green-50 to-green-100'} p-3 md:p-4 rounded-xl`}>
                                    <div className="text-lg md:text-2xl font-bold text-green-600 mb-1">20+</div>
                                    <div className="text-xs md:text-sm text-green-700">Exams</div>
                                </div>
                            </div>
                            <a
                                href="/mocks"
                                className="group inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-sm md:text-base"
                            >
                                <svg
                                    className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 group-hover:scale-110 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                    />
                                </svg>
                                Take Mock Tests
                                <svg className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                        <div className="flex-1">
                            <div className="relative group">
                                <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl md:rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className={`relative ${themeClasses.cardBg} rounded-xl md:rounded-2xl p-4 md:p-8 shadow-2xl border ${themeClasses.cardBorder}`}>
                                    <img
                                        src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop&auto=format"
                                        alt="Free Mock Tests"
                                        className="w-72  md:w-72 lg:w-full h-40 md:h-64 object-cover rounded-lg md:rounded-xl mb-4 md:mb-6"
                                    />
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs md:text-sm font-medium ${themeClasses.textSecondary}`}>
                                                Overall Progress
                                            </span>
                                            <span className="text-xs md:text-sm font-bold text-green-600">87%</span>
                                        </div>
                                        <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                                            <div
                                                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                                                style={{width: "87%"}}
                                            ></div>
                                        </div>
                                        <div className={`flex justify-between text-xs ${themeClasses.textSecondary}`}>
                                            <span>Beginner</span>
                                            <span>Advanced</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3 - Roadmaps */}
                    <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
                        <div className="flex-1 lg:pr-8">
                            <div className={`inline-flex items-center px-3 py-2 md:px-4 md:py-2 ${themeClasses.tagBg.green} rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6`}>
                                <svg className="w-3 h-3 md:w-4 md:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                Learning Paths
                            </div>
                            <h3 className={`text-2xl md:text-4xl font-bold ${themeClasses.text} mb-4 md:mb-6 leading-tight`}>
                                Free Learning Roadmaps
                            </h3>
                            <p className={`text-sm md:text-lg ${themeClasses.textSecondary} mb-6 md:mb-8 leading-relaxed`}>
                                Follow structured learning paths designed by industry experts. Get step-by-step
                                guidance to master any technology stack with curated resources and milestone
                                tracking.
                            </p>
                            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                                <div className="flex items-center">
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 md:mr-4">
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className={`text-sm md:text-base ${themeClasses.text}`}>TCS NQT Personalized Roadmap</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className={`text-sm md:text-base ${themeClasses.text}`}>Government Exam Roadmap</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className={`text-sm md:text-base ${themeClasses.text}`}>Coding Roadmaps</span>
                                </div>
                            </div>
                            <a
                                href="/roadmap"
                                className="group inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-sm md:text-base"
                            >
                                <svg
                                    className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 group-hover:rotate-12 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                    />
                                </svg>
                                View Roadmaps
                                <svg className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                        <div className="flex-1">
                            <div className="relative group">
                                <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl md:rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className={`relative ${themeClasses.cardBg} rounded-xl md:rounded-2xl p-4 md:p-8 shadow-2xl border ${themeClasses.cardBorder}`}>
                                    <img
                                        src="https://plus.unsplash.com/premium_photo-1661311950994-d263ea9681a1?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Free Learning Roadmaps"
                                        className="w-72  md:w-72 lg:w-full h-44 md:h-64 object-cover rounded-lg md:rounded-xl mb-4 md:mb-6"
                                    />
                                    <div className="space-y-3 md:space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs md:text-sm font-medium ${themeClasses.textSecondary}`}>
                                                Roadmap Progress
                                            </span>
                                            <span className="text-xs md:text-sm font-bold text-green-600">75%</span>  
                                        </div>
                                        <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                                            <div
                                                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                                                style={{width: "75%"}}
                                            ></div>
                                        </div>
                                        <div className={`flex justify-between text-xs ${themeClasses.textSecondary}`}>
                                            <span>Beginner</span>
                                            <span>Advanced</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
export default AlternatingSections;