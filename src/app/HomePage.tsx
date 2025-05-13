"use client"
import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
import "flowbite";
import { useSession } from "next-auth/react";
import "@/app/globals.css";
import Faq from "../components/Faq";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';;
import { useTheme } from "../components/ThemeContext";
import SplitText from "../components/SplitText";
import GradientText from "@/components/GradientText";
import Head from "next/head";
import { useRouter } from "next/navigation";
import QuizJoinComponent from '@/components/JoinQuiz';
import TechStackQuizSystem from '@/components/TechnologySection';
import InteractiveQuiz from '@/components/DemoQuizzes';
const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};
export default function HomePage() {

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
  const router = useRouter();
  const [quizCode, setQuizCode] = useState("");
  return (
    <>


      <div className={`overflow-x-hidden  ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        {/*Trackode Hero Section */}
        <section
          className={`relative justify-center animate-slide-up flex flex-col ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-white to-blue-50"
            } overflow-hidden min-h-[auto] sm:min-h-screen`} // Changed min-h-screen to auto on mobile
        >
          {/* Background elements */}
          <div className="absolute inset-0 pointer-events-none">
            {theme === "dark" ? (
              <>
                <div
                  className="absolute top-0 left-0 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-blue-900 rounded-full opacity-10 filter blur-xl sm:blur-3xl" // Reduced size on mobile
                ></div>
                <div
                  className="absolute bottom-0 right-0 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-purple-900 rounded-full opacity-10 filter blur-xl sm:blur-3xl"
                ></div>
                <div
                  className="absolute top-1/4 right-1/4 w-24 h-24 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-indigo-900 rounded-full opacity-10 filter blur-xl sm:blur-2xl"
                ></div>
              </>
            ) : (
              <>
                <div
                  className="absolute top-0 left-0 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-blue-200 rounded-full opacity-30 filter blur-xl sm:blur-3xl"
                ></div>
                <div
                  className="absolute bottom-0 right-0 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-indigo-200 rounded-full opacity-30 filter blur-xl sm:blur-3xl"
                ></div>
                <div
                  className="absolute top-1/4 right-1/4 w-24 h-24 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-purple-200 rounded-full opacity-20 filter blur-xl sm:blur-2xl"
                ></div>
              </>
            )}
          </div>
          <div
            className="absolute -left-4 -top-4 w-12 h-16 sm:w-20 sm:h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-20" // Reduced size on mobile
          ></div>
          <div
            className="absolute -right-4 -bottom-4 w-12 h-16 sm:w-20 sm:h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-20"
          ></div>

          {/* Floating code elements - hidden on mobile */}
          <div
            className="absolute hidden lg:block left-4 lg:left-10 top-20 lg:top-40 opacity-20 dark:opacity-10 animate-float-slow"
          >
            <div className="text-gray-600 dark:text-gray-400 font-mono text-xs lg:text-sm">
              {"function code() {"}<br />
              {"  return expertise;"}<br />
              {"}"}
            </div>
          </div>
          <div
            className="absolute hidden lg:block right-4 lg:right-10 bottom-20 lg:bottom-40 opacity-20 dark:opacity-10 animate-float"
          >
            <div className="text-gray-600 dark:text-gray-400 font-mono text-xs lg:text-sm">
              {"const skill = {"}<br />
              {"  learn: true,"}<br />
              {"  practice: true"}<br />
              {"}"}
            </div>
          </div>
          <div className="w-full pt-4 px-4 sm:px-6 z-20 relative">
            <div className="max-w-md mx-auto"> {/* Increased max-width for mobile */}
              <QuizJoinComponent />
            </div>
          </div>

          <div
            className="relative px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 z-10 flex-1 flex flex-col min-h-[auto] sm:min-h-[calc(100vh-80px)]" // Reduced padding and min-h on mobile
          >
            <div className="flex mt-12 flex-col items-center justify-start w-full sm:justify-center"> {/* Changed to justify-start on mobile */}
              {/* Hero content */}
              <div className="text-center max-w-4xl min-w-4xl mb-4 sm:mb-8">
                <h1
                  className="text-3xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight" // Reduced font size on mobile
                >
                  <span
                    className="block mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" // Reduced margin
                  >
                    Level Up Your Skills
                  </span>
                  <span className="block text-gray-900 dark:text-white">
                    With
                    <span>
                      <SplitText
                        text=" Interactive Quizzes"
                        onLetterAnimationComplete={handleAnimationComplete}
                        className="text-blue-500"
                      />
                    </span>
                  </span>
                </h1>
                <p
                  className={`mt-3 sm:mt-6 text-xs sm:text-base max-w-2xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`} // Reduced margin and font size on mobile
                >
                  Test, learn, and master programming concepts with AI-powered challenges.
                  Get instant feedback and track your progress on your coding journey.
                </p>
              </div>

              {/* CTA buttons */}
              <div
                className="mt-2 flex gap-3 justify-center mb-6 sm:mb-12" // Reduced gaps and margins
              >
                <Link
                  href="/dashboard"
                  className="px-6 py-2 sm:py-3 text-sm sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl" // Adjusted padding and font size
                >
                  Get Started
                </Link>
                <Link
                  href="/admin-dashboard"
                  className={`px-6 py-2 sm:py-3 text-sm sm:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg ${theme === "dark"
                    ? "text-white bg-gray-800 hover:bg-gray-700 border border-gray-700"
                    : "text-gray-800 bg-white hover:bg-gray-50 border border-gray-200"
                    }`}
                >
                  Dashboard
                </Link>
              </div>

              {/* Social proof */}
              <div className="w-full mt-10 mb-16 max-w-3xl">
                <div className="items-center justify-center flex gap-6 sm:gap-24"> {/* Reduced gap */}
                  <div className="flex sm:mb-0">
                    <div className="flex -space-x-2">
                      {["aditya.png", "rohit.png", "rohitk.png", "kaju.png"].map(
                        (img, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full border-2 ${theme === "dark" ? "border-gray-800" : "border-white"
                              } overflow-hidden shadow-md transition-transform duration-300 hover:scale-110 hover:z-10 relative`} // Reduced size on mobile
                            style={{ zIndex: 4 - i }}
                          >
                            <img
                              alt={`User ${i + 1}`}
                              src={img}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="flex">
                      <svg
                        className={`w-3 h-3 sm:w-5 sm:h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"
                          }`} // Reduced size
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <p
                        className={`ml-1 text-xs sm:text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                      >
                        Trusted by top developers
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" // Reduced size
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span
                          className={`ml-1 text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                          4.3/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex  mt-3 flex-wrap justify-center  gap-2 sm:gap-3"> {/* Reduced margin */}
                  <div
                    className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-green-500" // Reduced size
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
                      className={`text-xs sm:text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      100% Secure
                    </span>
                  </div>
                  <div
                    className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-blue-500"
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
                      className={`text-xs sm:text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      High Performance
                    </span>
                  </div>
                  <div
                    className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}
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
                      className={`text-xs sm:text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      Global Support
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
    @keyframes float {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    @keyframes float-slow {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-15px);
      }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .animate-float-slow {
      animation: float-slow 8s ease-in-out infinite;
    }
    @media (max-width: 640px) {
      .animate-pulse {
        animation: none;
      }
    }
  `}</style>
        </section>
        {/* level up coding and stats */}
        <section 
  className={`py-2 ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-white to-blue-50"} rounded-2xl`} 
  aria-labelledby="cta-heading"
  data-aos="fade-up"
>
  <div className="px-4 mx-auto  sm:px-6 lg:px-4">
    <div
      className="relative overflow-hidden rounded-lg"
      style={{
        background: `linear-gradient(135deg, ${
          theme === "dark" ? "#4f6fdd, #6b21a8" : "#60a5fa, #a5b4fc"
        })`,
        boxShadow: theme === "dark" 
          ? "0 10px 25px -5px rgba(0, 0, 35, 0.4)" 
          : "0 10px 25px -5px rgba(37, 99, 235, 0.2)"
      }}
    >
      {/* Simplified decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
        <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white opacity-10"></div>
        <div className="absolute top-8 left-1/4 text-white text-2xl opacity-10 animate-float">{`{ }`}</div>
        <div className="absolute bottom-8 right-1/4 text-white text-2xl opacity-10 animate-float-delay">{`</>`}</div>
      </div>

      <div className="relative px-4 py-6 sm:py-12 sm:px-8 z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-3 py-1.5 mb-4 rounded-full bg-white bg-opacity-20 backdrop-blur-sm">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 mr-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-white text-xs sm:text-sm font-medium tracking-wide">JOIN 1000+ DEVELOPERS</span>
            </span>
          </div>

          <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Level Up Your Coding Skills <span className="text-blue-200">Today</span>
          </h2>

          <p className="max-w-xl mx-auto mt-4 text-sm sm:text-base text-blue-100 leading-relaxed">
            Join a community of passionate developers who use Trackode's interactive quizzes to master programming concepts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link
              href="/programming-quizzes"
              className="group relative bg-blue-500 hover:bg-blue-700 text-white overflow-hidden inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-lg shadow-md"
            >
              <span className="relative flex items-center">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 18 18" fill="none" stroke="currentColor">
                  <path d="M8.18 13.426C6.86 14.392 5 13.448 5 11.811V5.439C5 3.802 6.86 2.858 8.18 3.824L12.54 7.01C13.634 7.809 13.634 9.441 12.54 10.24L8.18 13.426Z" strokeWidth="2"/>
                </svg>
                <span>Explore Quizzes</span>
              </span>
            </Link>

            <Link
              href="/mocks"
              className="group relative overflow-hidden inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-lg shadow-md bg-green-600 hover:bg-green-700 text-white"
            >
              <span className="relative flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
                <span>Free Mock Tests</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white border-opacity-20">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mx-auto max-w-3xl">
            {[
              { value: "20+", label: "Mocks" },
              { value: "525", label: "Developers" },
              { value: "120+", label: "Challenges" },
              { value: "30+", label: "Tech Stacks" },
              { value: "100+", label: "Live Blogs" }
            ].map((stat, index) => (
              <div key={index} className="text-center group transform transition-all duration-300 hover:-translate-y-1">
                <div className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-200">{stat.value}</div>
                <div className="mt-0.5 text-blue-200 text-xs sm:text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>

  <style jsx>{`
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .animate-float-delay {
      animation: float 6s ease-in-out infinite 3s;
    }
  `}</style>
</section>
        <section id="technology" className={`py-8 rounded-lg ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`} aria-labelledby="tech-stack-heading">
          <div className="px-4 mx-auto max-w-7xl sm:px-5 lg:px-8">
             
        
            <TechStackQuizSystem />



          </div>

        </section>

<section
  className={` ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}  rounded-lg`}
  aria-labelledby="demo-heading"
>
  <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            
            <h2
              className={`inline-block  font-semibold text-lg  px-4 py-1.5 rounded-lg ${
                theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
              }`}
            >
              Try a free
              <span className={`inline-block ml-2 rounded-lg font-semibold text-lg  px-4 py-1.5   ${
                theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-500 text-white"
              }`}>
Demo Quiz 
              </span>
            </h2>
           
            
            
            
          </motion.div>
        </div>
       
      
  
  <InteractiveQuiz/>
</section>
        <section className={`py-10  feature ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center mb-10">
               <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            
            <h2
              className={`inline-block  font-semibold text-lg  px-4 py-1.5 rounded-lg ${
                theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
              }`}
            >
              Why Choose 
              <span className={`inline-block ml-2 rounded-lg font-semibold text-lg  px-4 py-1.5   ${
                theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-500 text-white"
              }`}>
Trackode
              </span>
            </h2>
           
            
            
            
          </motion.div>
        </div>
        
              
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="absolute -top-5 left-6">
                  <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-900">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                </div>
                <h1 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">AI Powered Quiz Generation</h1>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                  Generate quizzes tailored to your learning needs using our AI-driven platform.
                </p>
              </div>
              {/* Feature 1 */}
              <div className="relative p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="absolute -top-5 left-6">
                  <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                </div>
                <h1 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Interactive Challenges</h1>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                  Hands-on coding exercises with real-time feedback to improve your skills efficiently.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="absolute -top-5 left-6">
                  <div className="rounded-full p-3 bg-green-100 dark:bg-green-900">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                </div>
                <h1 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Progress Tracking</h1>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                  Monitor your growth with detailed analytics and personalized skill assessments.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="absolute -top-5 left-6">
                  <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-900">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                </div>
                <h1 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Detailed Result and Dashboard</h1>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                  Detailed dashboard for student with leaderboard and result analysis, AI based personlaized feedback.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* How it Works Section with Card Hover Effects */}
        <section className={`py-15 mb-0 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`} aria-labelledby="features-heading">
          <div className="px-4 mx-auto max-w-6xl sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-5">

  <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            
            <h2
              className={`inline-block  font-semibold text-lg  px-4 py-1.5 rounded-lg ${
                theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
              }`}
            >
             How Trackode
              <span className={`inline-block ml-2 rounded-lg font-semibold text-lg  px-4 py-1.5   ${
                theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-500 text-white"
              }`}>
Works 
              </span>
            </h2>
           
            
            
            
          </motion.div>
        </div>
    
              

             
            </div>

            <div className="grid pb-9 max-w-6xl gap-8 mx-auto sm:grid-cols-3">
              {/* Card 1 - with enhanced hover effects */}
              <div
                className={`relative overflow-hidden rounded-xl transition-all duration-500 group ${theme === "dark" ? "bg-gray-700" : "bg-white"
                  }`}
                style={{
                  transform: "translateZ(0)",
                  boxShadow: theme === "dark" ? "0 10px 30px -15px rgba(0, 0, 255, 0.3)" : "0 10px 30px -15px rgba(0, 0, 0, 0.1)"
                }}
              >
                {/* Glowing border effect on hover */}
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-500 transition-colors duration-300"></div>

                {/* Card content */}
                <div className="p-8 relative z-10">
                  <div className={`flex items-center justify-center w-14 h-14 mb-6 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-blue-500 group-hover:bg-blue-400" : "bg-blue-100 group-hover:bg-blue-200"
                    }`}>
                    <svg className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${theme === "dark" ? "text-white" : "text-blue-600"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>

                  <div className="relative">
                    <span className={`absolute -left-6 top-1/2 transform -translate-y-1/2 text-5xl font-bold opacity-10 ${theme === "dark" ? "text-blue-300" : "text-blue-600"
                      }`}>1</span>
                    <h3 className={`text-lg font-bold mb-3 transition-all duration-300 group-hover:translate-x-1 ${theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>Create Your Quiz</h3>
                  </div>

                  <p className={`transition-all duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}>
                    Easily prepare your quiz in Trackode with our intuitive interface. Add auto generated questions and answers, and customize settings.
                  </p>


                </div>
              </div>

              {/* Card 2 */}
              <div
                className={`relative overflow-hidden rounded-xl transition-all duration-500 group ${theme === "dark" ? "bg-gray-700" : "bg-white"
                  }`}
                style={{
                  transform: "translateZ(0)",
                  boxShadow: theme === "dark" ? "0 10px 30px -15px rgba(0, 0, 255, 0.3)" : "0 10px 30px -15px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-purple-500 transition-colors duration-300"></div>

                <div className="p-8 relative z-10">
                  <div className={`flex items-center justify-center w-14 h-14 mb-6 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-purple-500 group-hover:bg-purple-400" : "bg-purple-100 group-hover:bg-purple-200"
                    }`}>
                    <svg className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${theme === "dark" ? "text-white" : "text-purple-600"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <div className="relative">
                    <span className={`absolute -left-6 top-1/2 transform -translate-y-1/2 text-5xl font-bold opacity-10 ${theme === "dark" ? "text-purple-300" : "text-purple-600"
                      }`}>2</span>
                    <h3 className={`text-lg font-bold mb-3 transition-all duration-300 group-hover:translate-x-1 ${theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>Host it Live</h3>
                  </div>

                  <p className={`transition-all duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}>
                    Directly publish the quiz and share the link to play , you can Host up to 15 quizzes for free directly on Trackode. Participants join instantly via link or QR code - no downloads needed.
                  </p>


                </div>
              </div>

              {/* Card 3 */}
              <div
                className={`relative overflow-hidden rounded-xl transition-all duration-500 group ${theme === "dark" ? "bg-gray-700" : "bg-white"
                  }`}
                style={{
                  transform: "translateZ(0)",
                  boxShadow: theme === "dark" ? "0 10px 30px -15px rgba(0, 0, 255, 0.3)" : "0 10px 30px -15px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-green-500 transition-colors duration-300"></div>

                <div className="p-8 relative z-10">
                  <div className={`flex items-center justify-center w-14 h-14 mb-6 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-green-500 group-hover:bg-green-400" : "bg-green-100 group-hover:bg-green-200"
                    }`}>
                    <svg className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${theme === "dark" ? "text-white" : "text-green-600"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>

                  <div className="relative">
                    <span className={`absolute -left-6 top-1/2 transform -translate-y-1/2 text-5xl font-bold opacity-10 ${theme === "dark" ? "text-green-300" : "text-green-600"
                      }`}>3</span>
                    <h3 className={`text-lg font-bold mb-3 transition-all duration-300 group-hover:translate-x-1 ${theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>Real-time Leaderboard</h3>
                  </div>

                  <p className={`transition-all duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}>
                    Watch the excitement as participants compete in real-time. Detailed analytics help you track performance and engagement.
                  </p>


                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Technologies Section with Animation */}
<section
  className={`py-16 ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-white to-blue-50"} rounded-2xl`}
  aria-labelledby="testimonials-heading"
>
  <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div className="text-center mb-5">
      <div className="text-center mb-2">
            <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            
            <h2
              className={`inline-block  font-semibold text-lg  px-4 py-1.5 rounded-lg ${
                theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
              }`}
            >
             What Our
              <span className={`inline-block ml-2 rounded-lg font-semibold text-lg  px-4 py-1.5   ${
                theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-500 text-white"
              }`}>
Users says 
              </span>
            </h2>
           
            
            
            
          </motion.div>
        </div>
    
              
        </div>
      
      <p
        className={`mt-4 max-w-2xl mx-auto text-lg ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Hear from developers who have leveled up their skills with Trackode.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {[
        {
          name: "Rohit Kharwar",
          role: "Full-Stack Developer",
          quote:
            "Trackode's quizzes helped me master JavaScript concepts in a fun and interactive way. The real-time feedback is a game-changer!",
          image: "/rohitk.png",
        },
        {
          name: "Rohit Kumar",
          role: "Backend Engineer",
          quote:
            "The AI-powered quizzes are spot-on, and the leaderboard keeps me motivated to improve my ranking.",
          image: "/rohit.png",
        },
        {
          name: "Kajal Kasaudhan",
          role: "Frontend Developer",
          quote:
            "I love the detailed analytics dashboard. It helped me identify my weak areas and focus my learning.",
          image: "/kaju.png",
        },
      ].map((testimonial, index) => (
        <div
          key={index}
          className={`relative p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
            theme === "dark" ? "bg-gray-700" : "bg-white"
          } shadow-md hover:shadow-lg`}
          data-aos="fade-up"
          data-aos-delay={index * 100}
        >
          <div className="flex items-center mb-4">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <h3
                className={`text-lg font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {testimonial.name}
              </h3>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {testimonial.role}
              </p>
            </div>
          </div>
          <p
            className={`text-base ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            "{testimonial.quote}"
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* Final CTA Section */}

        <section id="faq" className={` ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
          <Faq />
        </section>

        {/* Add these keyframe animations to your global styles */}

      </div>
    </>
  );


}
