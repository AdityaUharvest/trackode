"use client"
import React from 'react'

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
        <section className={`relative min-h-screen animate-slide-up flex flex-col ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-white to-blue-50"} overflow-hidden`}>
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {theme === "dark" ? (
          <>
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-900 rounded-full opacity-10 filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900 rounded-full opacity-10 filter blur-3xl"></div>
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-900 rounded-full opacity-10 filter blur-2xl"></div>
          </>
        ) : (
          <>
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full opacity-30 filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full opacity-30 filter blur-3xl"></div>
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-200 rounded-full opacity-20 filter blur-2xl"></div>
          </>
        )}
      </div>
      <div className="absolute -left-10 -top-4 w-20 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-20"></div>
      <div className="absolute -right-4 -bottom-4 w-20 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-20"></div>
      
      {/* Floating code elements */}
      <div className="absolute hidden lg:block left-10 top-40 opacity-20 dark:opacity-10 animate-float-slow">
        <div className="text-gray-600 dark:text-gray-400 font-mono text-sm">
          {"function code() {"}<br />
          {"  return expertise;"}<br />
          {"}"}
        </div>
      </div>
      <div className="absolute hidden lg:block right-10 bottom-40 opacity-20 dark:opacity-10 animate-float">
        <div className="text-gray-600 dark:text-gray-400 font-mono text-sm">
          {"const skill = {"}<br />
          {"  learn: true,"}<br />
          {"  practice: true"}<br />
          {"}"}
        </div>
      </div>

      <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 z-10 flex-1 flex flex-col">
        <div className="flex flex-col items-center justify-center h-full">
          {/* Live indicator */}
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/50 animate-pulse">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-blue-600 dark:bg-blue-400"></span>
              <span className="relative inline-flex w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Live Now • 500+ Active Users
            </span>
          </div>

          {/* Hero content */}
          <div className="text-center max-w-3xl mb-8">
            <h1 className="text-2xl sm:text-2xl lg:text-5xl font-extrabold tracking-tight">
              <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Level Up Your Skills
              </span>
              <span className="block text-gray-900 dark:text-white">
                With
                <span>
                  <SplitText text=" Interactive Quizzes"  onLetterAnimationComplete={handleAnimationComplete}
                   className={` text-blue-500`} />
                  </span> 
              </span>
            </h1>
            <p className={`mt-6 text-base sm:text-sm max-w-2xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Test, learn, and master programming concepts with AI-powered challenges. 
              Get instant feedback and track your progress on your coding journey.
            </p>
          </div>

          {/* Quiz join component */}
          <div className=" max-w-md mb-6">
            <QuizJoinComponent />
          </div>
          
          {/* CTA buttons */}
          <div className="mt-2 justify-evenly flex gap-8 mb-12">
            <Link
              href="/dashboard"
              className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              href="/admin-dashboard"
              className={`px-8 py-3  text-lg font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg ${
                theme === "dark"
                  ? "text-white bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  : "text-gray-800 bg-white hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Dashboard
            </Link>
          </div>
          
          {/* Social proof */}
          {/* Social proof - Improved version */}
          <div className="w-full max-w-3xl">
  {/* Testimonial avatars and trust statement */}
  <div className="flex flex-col md:flex-row items-center justify-between mb-2">
    <div className="flex items-center mb-2 md:mb-0">
      <div className="flex -space-x-3">
        {['aditya.png', 'rohit.png', 'rohitk.png', 'kaju.png'].map((img, i) => (
          <div 
            key={i} 
            className={`w-12 h-12 rounded-full border-2 ${theme === "dark" ? "border-gray-800" : "border-white"} 
            overflow-hidden shadow-lg transition-transform duration-300 hover:scale-110 hover:z-10 relative`}
            style={{ zIndex: 4-i }}
          >
            <img 
              alt={`User ${i+1}`} 
              src={img} 
              loading='lazy' 
              className={`w-full h-full ${['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500'][i]}`} 
            />
          </div>
        ))}
      </div>
      <div className="ml-4">
        <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          Join 500+ developers
        </p>
        <div className="flex items-center mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className={`ml-1 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>4.3/5</span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center">
      <div className="mr-2">
        <svg className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
        Trusted by developers at leading companies
      </p>
    </div>
  </div>
  
  {/* Company logos */}
 
  
  {/* Trust badges */}
  <div className="flex justify-center mt-8 space-x-6">
    <div className={`flex items-center px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
      <span className={`text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>100% Secure</span>
    </div>
    <div className={`flex items-center px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span className={`text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>High Performance</span>
    </div>
    <div className={`flex items-center px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
      <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className={`text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Global Support</span>
    </div>
  </div>
</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </section>
        {/* here the hero section of the trackode ends */}

        {/* Trackode Image Section */}
        <section className={`py-8 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="absolute top-1/3 left-0 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-1/3 right-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>


            <div className="relative">
              {/* Image container with advanced animation */}
              <div className="lg:max-w-3xl mx-auto mb-5 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 blur-lg transform scale-105"></div>
                <div
                  className="relative transform transition-all duration-700"
                  style={{
                    animation: "float 8s ease-in-out infinite"
                  }}
                >
                  <img
                    className="rounded-xl shadow-2xl w-full"
                    src={`${theme === "dark" ? "homepage.png" : "homepagedark.png"}`}
                    alt="Trackode coding quiz dashboard interface showing interactive challenges and progress tracking"
                    loading="lazy"
                    width="800"
                    height="450"
                  />


                  <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    Admin Dashboard
                  </div>


                  <div className="absolute -bottom-3 -left-3 bg-gray-900 text-green-400 px-4 py-2 rounded-lg text-xs font-mono opacity-90 shadow-lg">
                    &gt; trackode --start-quiz
                  </div>
                </div>
              </div>



            </div>
          </div>

          <style jsx>{`
    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(1deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    
    @keyframes blob {
      0% { transform: scale(1); }
      33% { transform: scale(1.1); }
      66% { transform: scale(0.9); }
      100% { transform: scale(1); }
    }
    
    .animate-blob {
      animation: blob 7s infinite;
    }
    
    .animation-delay-2000 {
      animation-delay: 2s;
    }
  `}</style>
        </section>

        <section className={`py-10  feature ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-lg  font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                Why Choose <span className="text-blue-600">Trackode Quizzes</span>
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                Everything you need to host, create and participate in coding quizzes and mock test
              </p>
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
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-5">


              <h2 id="features-heading" className={`text-lg font-bold tracking-tight sm:text-2xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                How Trackode Works
              </h2>
              <span className={`inline-block mt-1 px-4 py-1 rounded-full text-sm font-semibold mb-2 ${theme === "dark" ? "bg-gray-700 text-blue-300" : "bg-blue-100 text-blue-700"}`}>
                Simple Process
              </span>

              <p className={`max-w-2xl mx-auto mt-4 text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Transform your quizzes into engaging, interactive experiences in just a few simple steps.
              </p>
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

        <section 
      className={`py-5 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`} 
      aria-labelledby="cta-heading"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-4">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${theme === "dark" ? "#1e3a8a, #312e81" : "#3b82f6, #6366f1"})`,
            boxShadow: theme === "dark" 
              ? "0 25px 50px -12px rgba(0, 0, 35, 0.7)" 
              : "0 25px 50px -12px rgba(37, 99, 235, 0.3)"
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white opacity-10"></div>
            <div className="absolute -bottom-20 -right-10 w-60 h-60 rounded-full bg-white opacity-10"></div>
            
            {/* Circuit board pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-5" width="100%" height="100%">
              <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 0h100v100H0z" fill="none" />
                <path d="M50 0v25M50 75v25M0 50h25M75 50h25" stroke="white" strokeWidth="2" />
                <circle cx="50" cy="50" r="5" fill="white" />
                <circle cx="50" cy="0" r="3" fill="white" />
                <circle cx="50" cy="100" r="3" fill="white" />
                <circle cx="0" cy="50" r="3" fill="white" />
                <circle cx="100" cy="50" r="3" fill="white" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
            
            {/* Floating code symbols */}
            <div className="absolute top-10 left-1/4 text-white text-3xl opacity-10 animate-float">{`{ }`}</div>
            <div className="absolute bottom-10 right-1/4 text-white text-3xl opacity-10 animate-float-delay">{`</>`}</div>
          </div>

          {/* Content */}
          <div className="relative px-6 py-8 sm:py-20 sm:px-16 z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center px-4 py-2 mb-6 rounded-full bg-white bg-opacity-20 backdrop-blur-sm">
                <span className="flex items-center">
                  <span className="w-2 h-2 mr-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-white text-sm font-medium tracking-wide">JOIN 1000+ DEVELOPERS</span>
                </span>
              </div>

              <h2 id="cta-heading" className="text-3xl font-bold text-white sm:text-4xl md:text-5xl max-w-2xl mx-auto leading-tight">
                Level Up Your Coding Skills <span className="text-blue-200">Today</span>
              </h2>

              <p className="max-w-2xl mx-auto mt-6 text-lg text-blue-100 leading-relaxed">
                Join a community of passionate developers who use Trackode's interactive quizzes to master programming concepts, prepare for interviews, and advance their careers.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-5">
                <div className="flex mt-5 flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/programming-quizzes"
                className={`group relative overflow-hidden inline-flex items-center justify-center px-8 py-4 text-base font-bold transition-all duration-300 rounded-xl shadow-md ${theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-white hover:bg-blue-700 hover:text-white text-gray-800"
                  }`}
                role="button"
                aria-label="Explore available coding quizzes"
              >
                {/* Background animation */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

                {/* Content */}
                <span className="relative flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.18003 13.4261C6.8586 14.3918 5 13.448 5 11.8113V5.43865C5 3.80198 6.8586 2.85821 8.18003 3.82387L12.5403 7.01022C13.6336 7.80916 13.6336 9.44084 12.5403 10.2398L8.18003 13.4261Z"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Explore Live Quizzes</span>
                </span>
              </Link>

              <Link
                href="/mocks"
                className="group relative overflow-hidden inline-flex items-center justify-center px-8 py-4 text-base font-bold transition-all duration-300 rounded-xl shadow-md bg-green-600 hover:bg-green-700 text-white"
                role="button"
                aria-label="Access premium coding mock tests"
              >
                {/* Background animation */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

                {/* Content */}
                <span className="relative flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                  <span>Premium Mock Tests</span>
                </span>
              </Link>
            </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 pt-10 border-t border-white border-opacity-20">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mx-auto max-w-4xl">
                <div className="text-center group transform transition-all duration-300 hover:-translate-y-2">
                  <div className="text-2xl font-bold text-white group-hover:text-blue-200">10+</div>
                  <div className="mt-1 text-blue-200 text-sm uppercase tracking-wider">Active Mocks</div>
                </div>
                <div className="text-center group transform transition-all duration-300 hover:-translate-y-2">
                  <div className="text-2xl font-bold text-white group-hover:text-blue-200">525</div>
                  <div className="mt-1 text-blue-200 text-sm uppercase tracking-wider">Active Developers</div>
                </div>
                <div className="text-center group transform transition-all duration-300 hover:-translate-y-2">
                  <div className="text-2xl font-bold text-white group-hover:text-blue-200">120+</div>
                  <div className="mt-1 text-blue-200 text-sm uppercase tracking-wider">Coding Challenges</div>
                </div>
                <div className="text-center group transform transition-all duration-300 hover:-translate-y-2">
                  <div className="text-2xl font-bold text-white group-hover:text-blue-200">25+</div>
                  <div className="mt-1 text-blue-200 text-sm uppercase tracking-wider">Tech Stacks</div>
                </div>
                <Link href="devblogger.in" className="text-center group transform transition-all duration-300 hover:-translate-y-2">
                  <div className="text-2xl font-bold text-white group-hover:text-blue-200">100+</div>
                  <div className="mt-1 text-blue-200 text-sm uppercase tracking-wider">Blogs</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonial preview */}
        
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 6s ease-in-out infinite 3s;
        }
      `}</style>
    </section>
        {/* Technologies Section with Animation */}
        <section id="technology" className={`py-8 rounded-lg ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`} aria-labelledby="tech-stack-heading">
          <div className="px-4 mx-auto max-w-7xl sm:px-5 lg:px-8">
            <TechStackQuizSystem />


            
          </div>

        </section>
        
        {/* Final CTA Section */}
        <div className="mt-10 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden md:max-w-2xl transform transition-all duration-300 hover:shadow-xl">
          <div className="md:flex">
            <div className="p-8">
              <div className="flex items-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className={`text-base italic ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                "Trackode quizzes is helping me easy learning. The instant feedback and detailed explanations made learning efficient and enjoyable.
                A variety of quizzes kept me engaged and motivated. Highly recommend!"
              </p>
              <div className="mt-4 flex items-center">
                <div className="w-10 h-10 flex-shrink-0 mr-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    <img className='rounded-full ' src='kaju.png'></img>
                  </span>
                </div>
                <div>
                  <div className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                     Kajal 
                  </div>
                  <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Frontend Developer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section id="faq" className={` ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
          <Faq />
        </section>

        {/* Add these keyframe animations to your global styles */}

      </div>
    </>
  );


}
