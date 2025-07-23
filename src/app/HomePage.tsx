"use client"
import React from 'react'
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import "@/app/globals.css";
import Faq from "../components/Faq";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "../components/ThemeContext";


import TechStackQuizSystem from '@/components/TechnologySection';
import InteractiveQuiz from '@/components/DemoQuizzes';

import RoadMap from '@/components/HomePage/Roadmap';

import AlternatingSections from '@/components/HomePage/AlternatingSections';

import MockExamCard from '@/components/MockExamCard';

import HeroSection from '@/components/HomePage/HeroSection';
import ProgrammingLanguageQuizzes from '@/components/HomePage/ProgrammingLanguageQuizzes';
// import HeroSection from '@/components/HomePage/HeroSection';
export default function HomePage() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: session, status } = useSession();
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const firstVisit = localStorage.getItem("isFirstVisit");
    if (firstVisit === null) {
      localStorage.setItem("isFirstVisit", "true");
      setIsFirstVisit(true);
    } else {
      setIsFirstVisit(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.removeItem("isFirstVisit");
      setIsFirstVisit(false);
    }
  }, [status]);

  return (
    <>
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 p-3 rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      <div  className={`overflow-x-hidden ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        {/* Trackode Hero Section */}
        <HeroSection/>
        <AlternatingSections/>

        

        {/* Technology Section */}
        <ProgrammingLanguageQuizzes/>
        
         <section 
  className={`py-16 mx-auto ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}
  
>
  <div className="px-3  sm:px-4 lg:px-4">
    <div className="text-center mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative inline-block"
      >
        <h2
                className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Featured <span className='text-indigo-500'>Mock Exams</span> 
              </h2>
        <p className={`mt-2 max-w-2xl mx-auto text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          Prepare for your dream job with our industry-standard mock tests
        </p>
      </motion.div>
    </div>

    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
      {[
        {
          id: 'tcs',
          name: 'TCS Mock Tests',
          image: '/tcs.png',
          description: 'TCS NQT and Ninja preparation'
        },
        {
          id: 'ssc',
          name: 'SSC Mock Tests',
          image: '/ssc.png',
          description: 'SSC CGL, CHSL, and other exams'
        },
        {
          id: 'gate',
          name: 'GATE Mock Tests',
          image: '/gate.png',
          description: 'GATE Computer Science and IT'
        },
        {
          id: 'cat',
          name: 'CAT Mock Tests',
          image: '/cat.png',
          description: 'Common Admission Test preparation'
        },
        {
          id: 'upsc',
          name: 'UPSC Mock Tests',
          image: '/upsc.png',
          description: 'Civil Services preliminary exams'
        },
        {
          id: 'banking',
          name: 'Banking Mocks',
          image: '/banking.png',
          description: 'IBPS, SBI PO and Clerk exams'
        },
        {
          id: 'jee',
          name: 'JEE Mocks',
          image: '/jee.png',
          description: 'Joint Entrance Examination'
        },
        {
          id: 'programming',
          name: 'Programming Tests',
          image: '/programming.png',
          description: 'DSA and coding challenges'
        }
      ].map((exam) => (
        <MockExamCard 
          key={exam.id}
          exam={exam}
          theme={theme}
        />
      ))}
    </div>
  </div>
</section>
        {/* road map */}
        <section

          className={`
   `}

        >
          
          <RoadMap/>
        </section>
       

<section

          className={`pb-16 mx-auto `}
          style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }}

        >
          
          <div className="px-4 mx-auto py-10   sm:px-6 ">
            <div className="text-center mb-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative inline-block"
              >
                <h2
                  className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Why Choose <span className='text-indigo-500'>Trackode</span> 
                </h2>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </motion.div>
              <div className="flex mt-3 flex-wrap justify-center sm:gap-2">
                <div
                  className={`flex items-center px-2 py-1 sm:px-3 sm:py-2 rounded-lg ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <span
                    className={`text-xs sm:text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                  >
                    100% Secure
                  </span>
                </div>
                <div
                  className={`flex items-center px-2 py-1 sm:px-3 sm:py-2 rounded-lg ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span
                    className={`text-xs sm:text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                  >
                    High Performance
                  </span>
                </div>
                <div
                  className={`flex items-center px-2 py-1 sm:px-3 sm:py-2 rounded-lg ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span
                    className={`text-xs sm:text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Global Support
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative p-6 bg-white dark:bg-gray-700/50 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="absolute -top-5 left-6">
                  <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-900">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                </div>
                <h1 className="mt-6 text-base lg:text-lg font-semimedium text-gray-900 dark:text-white">AI Powered Quiz Generation</h1>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  Generate quizzes tailored to your learning needs using our AI-driven platform.
                </p>
              </div>
              <div className="relative p-6 bg-white dark:bg-gray-700/50 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="absolute -top-5 left-6">
                  <div className="rounded-full p-3 bg-indigo-100 dark:bg-indigo-900">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                </div>
                <h1 className="mt-6 lg:text-lg font-semimedium text-gray-900 dark:text-white">Interactive Challenges</h1>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  Hands-on coding exercises with real-time feedback to improve your skills efficiently.
                </p>
              </div>
              <div className="relative p-6 bg-white dark:bg-gray-700/50 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="absolute -top-5 left-6">
                  <div className="rounded-full p-3 bg-green-100 dark:bg-green-900">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                </div>
                <h1 className="mt-6 lg:text-lg font-medium text-gray-900 dark:text-white">Progress Tracking</h1>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  Monitor your growth with detailed analytics and personalized skill assessments.
                </p>
              </div>
              <div className="relative p-6 bg-white dark:bg-gray-700/50 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="absolute -top-5 left-6">
                  <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-900">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                </div>
                <h1 className="mt-6 lg:text-lg font-medium text-gray-900 dark:text-white">Detailed Result and Dashboard</h1>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  Detailed dashboard for student with leaderboard and result analysis, AI based personalized feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section 
          className={`py-16 mx-auto ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gradient-to-r from-indigo-100 to-indigo-100"}`}
          aria-labelledby="features-heading"
style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }}

        >
          <div className="px-4  mx-auto sm:px-6 ">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative inline-block"
              >
                <h2
                  className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  How Trackode <span className='text-indigo-600'>Works</span> 
                </h2>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </motion.div>
            </div>

            <div className="grid  gap-8 mx-auto sm:grid-cols-3">
              <div
                className={`relative overflow-hidden rounded-xl transition-all duration-500 group ${theme === "dark" ? "bg-gray-700/50" : "bg-white"}`}
                style={{
                  transform: "translateZ(0)",
                  boxShadow: theme === "dark" ? "0 10px 30px -15px rgba(0, 0, 255, 0.3)" : "0 10px 30px -15px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-indigo-500 transition-colors duration-300"></div>
                <div className="p-7 relative z-10">
                  <div className={`flex items-center justify-center w-14 h-14 mb-6 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-indigo-500 group-hover:bg-indigo-400" : "bg-indigo-100 group-hover:bg-indigo-200"}`}>
                    <svg className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${theme === "dark" ? "text-white" : "text-indigo-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="relative">
                    <span className={`absolute -left-6 top-1/2 transform -translate-y-1/2 text-5xl font-bold opacity-10 ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`}>1</span>
                    <h3 className={`lg:text-lg font-bold mb-3 transition-all duration-300 group-hover:translate-x-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Create Your Quiz</h3>
                  </div>
                  <p className={`transition-all text-sm duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Easily prepare your quiz in Trackode with our intuitive interface. Add auto generated questions and answers, and customize settings.
                  </p>
                </div>
              </div>

              <div
                className={`relative overflow-hidden rounded-xl transition-all duration-500 group ${theme === "dark" ? "bg-gray-700/50" : "bg-white"}`}
                style={{
                  transform: "translateZ(0)",
                  boxShadow: theme === "dark" ? "0 10px 30px -15px rgba(0, 0, 255, 0.3)" : "0 10px 30px -15px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-purple-500 transition-colors duration-300"></div>
                <div className="p-8 relative z-10">
                  <div className={`flex items-center justify-center w-14 h-14 mb-6 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-purple-500 group-hover:bg-purple-400" : "bg-purple-100 group-hover:bg-purple-200"}`}>
                    <svg className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${theme === "dark" ? "text-white" : "text-purple-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="relative">
                    <span className={`absolute -left-6 top-1/2 transform -translate-y-1/2 text-5xl font-bold opacity-10 ${theme === "dark" ? "text-purple-300" : "text-purple-600"}`}>2</span>
                    <h3 className={`lg:text-lg font-bold mb-3 transition-all duration-300 group-hover:translate-x-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Host it Live</h3>
                  </div>
                  <p className={`transition-all text-sm duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Directly publish the quiz and share the link to play, you can Host up to 15 quizzes for free directly on Trackode. Participants join instantly via link or QR code - no downloads needed.
                  </p>
                </div>
              </div>

              <div
                className={`relative overflow-hidden rounded-xl transition-all duration-500 group ${theme === "dark" ? "bg-gray-700/50" : "bg-white"}`}
                style={{
                  transform: "translateZ(0)",
                  boxShadow: theme === "dark" ? "0 10px 30px -15px rgba(0, 0, 255, 0.3)" : "0 10px 30px -15px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-green-500 transition-colors duration-300"></div>
                <div className="p-8 relative z-10">
                  <div className={`flex items-center justify-center w-14 h-14 mb-6 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-green-500 group-hover:bg-green-400" : "bg-green-100 group-hover:bg-green-200"}`}>
                    <svg className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${theme === "dark" ? "text-white" : "text-green-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="relative">
                    <span className={`absolute -left-6 top-1/2 transform -translate-y-1/2 text-5xl font-bold opacity-10 ${theme === "dark" ? "text-green-300" : "text-green-600"}`}>3</span>
                    <h3 className={`lg:text-lg font-bold mb-3 transition-all duration-300 group-hover:translate-x-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Real-time Leaderboard</h3>
                  </div>
                  <p className={`transition-all text-sm duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Watch the excitement as participants compete in real-time. Detailed analytics help you track performance and engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Demo Quiz Section */}
        <section
          className={`py-16 mx-auto  ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}
          aria-labelledby="demo-heading"
style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }}

        >
          <div className="text-center ">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative inline-block"
            >
              <h2
                className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Try a Free <span className='text-indigo-500'>Demo Quiz</span> 
              </h2>
              
              <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </motion.div>
          </div>
          <InteractiveQuiz />
        </section>

        {/* Why Choose Section */}
        

        {/* Testimonials Section */}
        <section
          className={`py-16  mx-auto `}
          aria-labelledby="testimonials-heading"
          style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }}

        >
          <div className="px-4 mx-auto  sm:px-6 ">
            <div className="text-center mb-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative inline-block"
              >
                <h2
                  className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  What our<span className='text-indigo-500'> Users Says</span> 
                </h2>
                
                <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </motion.div>
              <p
                className={`mt-4 max-w-2xl mx-auto  ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                Hear from developers who have leveled up their skills with Trackode.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Rohit Kharwar",
                  role: "Full-Stack Developer",
                  quote: "Trackode's quizzes helped me master JavaScript concepts in a fun and interactive way. The real-time feedback is a game-changer!",
                  image: "/rohitk.png",
                },
                {
                  name: "Rohit Kumar",
                  role: "Backend Engineer",
                  quote: "The AI-powered quizzes are spot-on, and the leaderboard keeps me motivated to improve my ranking.",
                  image: "/rohit.png",
                },
                {
                  name: "Kajal Kasaudhan",
                  role: "Frontend Developer",
                  quote: "I love the detailed analytics dashboard. It helped me identify my weak areas and focus my learning.",
                  image: "/kajal.png",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className={`relative p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${theme === "dark" ? "bg-gray-700/50" : "bg-white"} shadow-md hover:shadow-lg`}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex items-center mb-4">
                    <Image
                      alt={testimonial.name}
                      src={`${testimonial.image}`}
                      width={48}
                      height={48}
                      loading="lazy"
                      className="w-10 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3
                        className={`lg:text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                      >
                        {testimonial.name}
                      </h3>
                      <p
                        className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {testimonial.quote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className={`py-16 mx-auto ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}
          style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }}

        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative inline-block"
            >
              <h2
                className={`text-3xl sm:text-4xl font-bold tracking-tighter ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Frequently <span className='text-indigo-500'>Asked Questions</span> 
              </h2>
              <p className={`mt-2 max-w-2xl mx-auto text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Find answers to common questions about Trackode
              </p>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </motion.div>
          </div>
          <Faq />
        </section>
        
      
      </div>
    </>
  );
}