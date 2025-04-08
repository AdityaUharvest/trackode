"use client"
import React from 'react'

import "flowbite";
import { useSession } from "next-auth/react";
import "@/app/globals.css";
import Faq from "../components/Faq";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "../components/ThemeContext";
import SplitText from "../components/SplitText";
import GradientText from "@/components/GradientText";
import Head from "next/head";
import { useRouter } from "next/navigation";
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
      <Head>
        <title>Trackode - Master Coding Skills with Interactive Quizzes & Contests</title>
        <meta name="description" content="Trackode helps developers track their coding journey through interactive quizzes, AI-generated challenges, and coding contests. Improve your programming skills effectively." />
        <link rel="canonical" href="https://trackode.in" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Primary Meta Tags */}
        <meta name="title" content="Trackode - Master Coding Skills with Interactive Quizzes & Contests" />
        <meta name="description" content="Track your coding journey with interactive quizzes, AI challenges, and contests. The most effective way to improve programming skills." />
        <meta name="keywords" content="coding quiz, programming challenges, coding contests, developer skills, coding practice, technical assessments, JavaScript quiz, Python challenges" />
        <meta name="author" content="Trackode Team" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://trackode.in/" />
        <meta property="og:title" content="Trackode - Master Coding Skills with Interactive Quizzes & Contests" />
        <meta property="og:description" content="Track your coding journey with interactive quizzes, AI challenges, and contests. The most effective way to improve programming skills." />
        <meta property="og:image" content="https://trackode.in/trackode-og-image.png" />
        <meta property="og:image:alt" content="Trackode Coding Platform" />
        <meta property="og:site_name" content="Trackode" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme Color */}
        <meta name="theme-color" content={theme === "dark" ? "#1f2937" : "#ffffff"} />
        <meta name="msapplication-TileColor" content="#2b5797" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Trackode",
            "url": "https://trackode.in",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://trackode.in/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Trackode",
            "url": "https://trackode.in",
            "logo": "https://trackode.in/logo.png",
            
          })}
        </script>
      </Head>

      <div className={`overflow-x-hidden  ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        {/* Hero Section */}
        <section
  className={`py-16 sm:py-24 ${theme === "dark" ? "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-blue-50"}`}
  aria-labelledby="hero-heading"
>
  {/* Animated background elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-0 w-full h-full">
      {theme === "dark" ? (
        <>
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-600 opacity-10 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-600 opacity-10 blur-3xl"></div>
        </>
      ) : (
        <>
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-300 opacity-20 blur-3xl"></div>
        </>
      )}
    </div>
  </div>

  <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
      {/* Left side - Content */}
      <div className="w-full lg:w-1/2 space-y-6">
        <div className="flex items-center justify-end lg:mr-20 space-x-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900">
            <span className="animate-pulse h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              Now Live
            </span>
          </div>
        </div>

        <h1
          id="hero-heading"
          className="text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl"
        >
          <div className="flex ml-10 lg:ml-0 items-center mb-2">
            <span className="text-blue-600 mr-2">
              <SplitText
                text="Track"
                className="font-bold"
                delay={150}
                animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                threshold={0.2}
                rootMargin="-50px"
                onLetterAnimationComplete={handleAnimationComplete}
              />
            </span>
            <span className="relative">
              <span className="absolute -left-1 -right-1 h-3 bottom-0 bg-blue-200 dark:bg-blue-800 opacity-50 rounded"></span>
              <SplitText
              onLetterAnimationComplete={handleAnimationComplete}
                text="Code"
                className="font-bold relative z-10"
                delay={250}
                animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                threshold={0.2}
                rootMargin="-50px"
              />
            </span>
            <span className="ml-2">
              <SplitText
              onLetterAnimationComplete={handleAnimationComplete}
                text="Quiz"
                className="font-bold"
                delay={350}
                animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                threshold={0.2}
                rootMargin="-50px"
              />
            </span>
          </div>
          <div className="mt-4">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={15}
              showBorder={false}
              className="text-2xl sm:text-2xl font-bold leading-tight lg:text-3xl"
            >
              Navigate Your Coding Journey
            </GradientText>
          </div>
        </h1>

        <p className="text-sm p-2 leading-relaxed text-gray-600 dark:text-gray-300 max-w-lg backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 rounded-lg">
          Join over 494 developers improving their skills with our interactive
          coding challenges, quizzes designed to accelerate your growth.
        </p>

        <div className="flex  lg:mr-44 justify-evenly pt-4">
          <Link
            href="/admin-dashboard"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all duration-300 transform bg-blue-600 border-2 border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:scale-105"
            role="button"
          >
            Get Started
          </Link>

          <Link
            href="/dashboard"
            className={`inline-flex items-center justify-center px-6 py-3 text-base font-bold transition-all duration-300 transform border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 ${theme === "dark"
              ? "text-white border-gray-400 hover:bg-gray-800 focus:bg-gray-800"
              : "text-black border-gray-400 hover:bg-gray-100 focus:bg-gray-100"
            }`}
            role="button"
          >
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
            Dashboard
          </Link>
        </div>

        <div className="flex items-center ml-5 pt-2 space-x-2">
          <div className="flex -space-x-2">
            {['aditya.png','rohit.png', 'rohitk.png','kaju.png'].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full border-2 ${theme === "dark" ? "border-gray-800" : "border-white"} overflow-hidden`}
              >
                <img
                  alt="User"
                  
                src={`${[_]}`}
loading='lazy'
                  className={`w-full h-full ${['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500'][i]}`}
                ></img>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">+ 494</span> developers already joined
          </p>
        </div>
      </div>

      {/* Right side - Join form with floating animation */}
      <div className="w-full lg:w-2/5">
        <div
          className="relative p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl transform transition-all duration-700 hover:shadow-2xl"
          style={{
            animation: "float 6s ease-in-out infinite"
          }}
        >
          <div className="absolute -top-3 -right-3">
            <span className="flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500 items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </span>
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Join as a participant
          </h2>

          <div className="mb-5 space-y-4">
            <div className="relative">
              <input
                placeholder="Enter quiz code"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none text-gray-800 dark:text-white dark:bg-gray-700 placeholder-gray-500"
                type="text"
                onChange={(e) => setQuizCode(e.target.value)}
                value={quizCode}

                aria-label="Enter quiz code to join"
              />
            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm transform hover:translate-y-px"
              aria-label="Join the quiz now"
              onClick={() => {
                if (session) {
                  toast.success("Joining the quiz...", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                  });
                  router.push("/playy/" + quizCode); // Replace with actual quiz code
                } else {
                  toast.error("Please log in to join the quiz.", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                  });
                }
              }}
            >
              Join Now
              <span aria-hidden="true" className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <div className="text-center text-sm  text-gray-500 dark:text-gray-400 mt-2">
              No account? <a href="/signup" className="text-blue-600 hover:underline">Sign up for free</a>
            </div>
          </div>

          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs font-medium shadow-sm">
              Quick join • No sign up required
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Add this style tag for the floating and blob animations */}
  
</section>
        {/* image section */}
       {/* Screenshot Section with Floating Animation  */}
<section className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="absolute top-1/3 left-0 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
    <div className="absolute top-1/3 right-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
    
   
    <div className="relative">
      {/* Image container with advanced animation */}
      <div className="lg:max-w-3xl mx-auto mb-16 relative">
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
          
          {/* Interactive overlay elements */}
          <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            Admin Dashboard
          </div>
          
          {/* Code snippet aesthetic overlay */}
          <div className="absolute -bottom-3 -left-3 bg-gray-900 text-green-400 px-4 py-2 rounded-lg text-xs font-mono opacity-90 shadow-lg">
            &gt; trackode --start-quiz
          </div>
        </div>
      </div>
      
      {/* Text content below image */}
     
    </div>
  </div>
  
  {/* Animation styles */}
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

<section className={`py-10 feature ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
  <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Why Choose <span className="text-blue-600">Trackode Quizzes</span>
      </h2>
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
        <h3 className="mt-6 text-xl font-medium text-gray-900 dark:text-white">AI Powered Quiz Generation</h3>
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
        <h3 className="mt-6 text-xl font-medium text-gray-900 dark:text-white">Interactive Challenges</h3>
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
        <h3 className="mt-6 text-xl font-medium text-gray-900 dark:text-white">Progress Tracking</h3>
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
        <h3 className="mt-6 text-xl font-medium text-gray-900 dark:text-white">Detailed Result and Dashboard</h3>
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
    <div className="max-w-3xl mx-auto text-center mb-10">
      
      
      <h2 id="features-heading" className={`text-2xl font-bold tracking-tight sm:text-3xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        How It Works
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
        className={`relative overflow-hidden rounded-xl transition-all duration-500 group ${
          theme === "dark" ? "bg-gray-700" : "bg-white"
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
          <div className={`flex items-center justify-center w-14 h-14 mb-6 rounded-full transition-all duration-300 ${
            theme === "dark" ? "bg-blue-500 group-hover:bg-blue-400" : "bg-blue-100 group-hover:bg-blue-200"
          }`}>
            <svg className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${
              theme === "dark" ? "text-white" : "text-blue-600"
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          
          <div className="relative">
            <span className={`absolute -left-6 top-1/2 transform -translate-y-1/2 text-5xl font-bold opacity-10 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}>1</span>
            <h3 className={`text-xl font-bold mb-3 transition-all duration-300 group-hover:translate-x-1 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>Create Your Quiz</h3>
          </div>
          
          <p className={`transition-all duration-300 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}>
            Easily prepare your quiz in Trackode with our intuitive interface. Add auto generated questions and answers, and customize settings.
          </p>
          
          {/* <div className={`mt-6 pt-4 border-t ${theme === "dark" ? "border-gray-600" : "border-gray-100"}`}>
            <span className={`inline-flex items-center text-sm font-medium transition-all duration-300 group-hover:translate-x-1 ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}>
              Learn more
              <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </span>
          </div> */}
        </div>
      </div>

      {/* Card 2 */}
      <div 
        className={`relative overflow-hidden rounded-xl transition-all duration-500 group ${
          theme === "dark" ? "bg-gray-700" : "bg-white"
        }`}
        style={{ 
          transform: "translateZ(0)",
          boxShadow: theme === "dark" ? "0 10px 30px -15px rgba(0, 0, 255, 0.3)" : "0 10px 30px -15px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-purple-500 transition-colors duration-300"></div>
        
        <div className="p-8 relative z-10">
          <div className={`flex items-center justify-center w-14 h-14 mb-6 rounded-full transition-all duration-300 ${
            theme === "dark" ? "bg-purple-500 group-hover:bg-purple-400" : "bg-purple-100 group-hover:bg-purple-200"
          }`}>
            <svg className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${
              theme === "dark" ? "text-white" : "text-purple-600"
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div className="relative">
            <span className={`absolute -left-6 top-1/2 transform -translate-y-1/2 text-5xl font-bold opacity-10 ${
              theme === "dark" ? "text-purple-300" : "text-purple-600"
            }`}>2</span>
            <h3 className={`text-xl font-bold mb-3 transition-all duration-300 group-hover:translate-x-1 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>Host it Live</h3>
          </div>
          
          <p className={`transition-all duration-300 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}>
            Directly publish the quiz and share the link to play , you can Host up to 15 quizzes for free directly on Trackode. Participants join instantly via link or QR code - no downloads needed.
          </p>
          
          {/* <div className={`mt-6 pt-4 border-t ${theme === "dark" ? "border-gray-600" : "border-gray-100"}`}>
            <span className={`inline-flex items-center text-sm font-medium transition-all duration-300 group-hover:translate-x-1 ${
              theme === "dark" ? "text-purple-400" : "text-purple-600"
            }`}>
              Learn more
              <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </span>
          </div> */}
        </div>
      </div>

      {/* Card 3 */}
      <div 
        className={`relative overflow-hidden rounded-xl transition-all duration-500 group ${
          theme === "dark" ? "bg-gray-700" : "bg-white"
        }`}
        style={{ 
          transform: "translateZ(0)",
          boxShadow: theme === "dark" ? "0 10px 30px -15px rgba(0, 0, 255, 0.3)" : "0 10px 30px -15px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-green-500 transition-colors duration-300"></div>
        
        <div className="p-8 relative z-10">
          <div className={`flex items-center justify-center w-14 h-14 mb-6 rounded-full transition-all duration-300 ${
            theme === "dark" ? "bg-green-500 group-hover:bg-green-400" : "bg-green-100 group-hover:bg-green-200"
          }`}>
            <svg className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${
              theme === "dark" ? "text-white" : "text-green-600"
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          
          <div className="relative">
            <span className={`absolute -left-6 top-1/2 transform -translate-y-1/2 text-5xl font-bold opacity-10 ${
              theme === "dark" ? "text-green-300" : "text-green-600"
            }`}>3</span>
            <h3 className={`text-xl font-bold mb-3 transition-all duration-300 group-hover:translate-x-1 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>Real-time Leaderboard</h3>
          </div>
          
          <p className={`transition-all duration-300 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}>
            Watch the excitement as participants compete in real-time. Detailed analytics help you track performance and engagement.
          </p>
          
          {/* <div className={`mt-6 pt-4 border-t ${theme === "dark" ? "border-gray-600" : "border-gray-100"}`}>
            <span className={`inline-flex items-center text-sm font-medium transition-all duration-300 group-hover:translate-x-1 ${
              theme === "dark" ? "text-green-400" : "text-green-600"
            }`}>
              Learn more
              <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </span>
          </div> */}
        </div>
      </div>
    </div>
  </div>
</section>

{/* Improved CTA Section with Animation */}
<section className={`py-10 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`} aria-labelledby="cta-heading">
  <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div 
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: `linear-gradient(60deg, ${theme === "dark" ? "#1e40af, #1e3a8a" : "#2563eb, #3b82f6"})`,
        boxShadow: theme === "dark" ? "0 20px 40px -20px rgba(0, 0, 100, 0.6)" : "0 20px 40px -20px rgba(37, 99, 235, 0.5)"
      }}
    >
      {/* Background animation elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white opacity-10 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white opacity-5 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>
      
      {/* Content */}
      <div className="relative px-6 py-16 text-center sm:py-20 sm:px-16">
        <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-white bg-opacity-20 text-white text-sm font-medium">
          <span className="w-2 h-2 mr-2 rounded-full bg-green-400 animate-pulse"></span>
          Boost Your Skills
        </div>
        
        <h2 id="cta-heading" className="text-2xl font-bold text-white sm:text-3xl max-w-2xl mx-auto leading-tight">
          Ready to accelerate your coding journey?
        </h2>
        
        <p className="max-w-2xl mx-auto mt-6 text-lg text-blue-100">
          Join thousands of developers who have improved their coding abilities with Trackode's interactive approach.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/dashboard/quiz-list"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-blue-700 transition-all duration-300 bg-white border border-transparent rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:shadow-lg transform hover:scale-105"
            role="button"
            aria-label="Sign up for Trackode"
          >
            Start Learning Today
            <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <Link
            href="/features"
            className="inline-flex items-center justify-center px-6 py-4 text-base font-bold text-white transition-all duration-300 border border-white border-opacity-50 rounded-xl hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            role="button"
          >
            Explore Features
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mx-auto mt-12 lg:grid-cols-5  max-w-3xl">
        <div className="text-center">
            <div className="text-2xl font-bold text-white">4+</div>
            <div className="mt-1 text-blue-200">Active Mocks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">494</div>
            <div className="mt-1 text-blue-200">Active Developers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">120+</div>
            <div className="mt-1 text-blue-200">Coding Challenges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">15+</div>
            <div className="mt-1 text-blue-200">Tech Stacks</div>
          </div>
          <Link href="devblogger.in" className="text-center">
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">100+ blogs</div>
            <div className="mt-1 text-blue-200">Blogs</div>
          </div>
          </Link>
          
        </div>
      </div>
    </div>
  </div>
</section>

{/* Technologies Section with Animation */}
<section className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`} aria-labelledby="tech-stack-heading">
  <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto text-center mb-16">
      <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${theme === "dark" ? "bg-gray-700 text-purple-300" : "bg-purple-100 text-purple-700"}`}>
        Multiple Technologies
      </span>
      
      <h2 id="tech-stack-heading" className={`text-2xl font-bold sm:text-3xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        Technologies We Cover
      </h2>
      
      <p className={`mt-4 text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
        Practice with quizzes and challenges in all major programming languages and frameworks
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-12 sm:grid-cols-3 lg:grid-cols-6">
      {[
        { name: 'JavaScript', color: 'yellow' },
        { name: 'Python', color: 'blue' },
        { name: 'Java', color: 'orange' },
        { name: 'C++', color: 'indigo' },
        { name: 'React', color: 'cyan' },
        { name: 'Node.js', color: 'green' },
        { name: 'TypeScript', color: 'blue' },
        { name: 'SQL', color: 'orange' },
        { name: 'HTML/CSS', color: 'red' },
        { name: 'Git', color: 'orange' },
        { name: 'Docker', color: 'blue' },
        { name: 'AWS', color: 'yellow' }
      ].map((tech) => (
        <div 
          key={tech.name}
          className={`flex items-center justify-center p-5 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
            theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"
          }`}
          style={{
            boxShadow: theme === "dark" ? "0 4px 20px -5px rgba(0, 0, 0, 0.3)" : "0 4px 20px -5px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="flex items-center space-x-2">
            <span 
              className={`inline-block w-3 h-3 rounded-full bg-${tech.color}-${theme === "dark" ? "500" : "400"}`}
            ></span>
            <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {tech.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Final CTA Section */}
<section className={`py-16 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
<div className="text-center max-w-2xl mx-auto">
<div className="flex justify-center mb-12">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      </div>
      <div>
        
      </div>
        <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
          Your Favorite Coding Platform
          <span className="inline-block ml-2 relative">
            <span className="absolute inset-0 bg-blue-200 dark:bg-blue-900 opacity-30 rounded transform -rotate-2"></span>
            <span className="relative">⭐</span>
          </span>
        </h2>

        <p className={`mt-4 text-xl font-medium ${theme === "dark" ? "text-blue-200" : "text-blue-800"}`}>
          Effortless coding practice & contests with Trackode
        </p>
      </div>
  <div className="px-4 mx-auto mt-4 max-w-7xl sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      {/* Before and After Decorative Elements */}
     
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/dashboard/quiz-list"
          className={`group relative overflow-hidden inline-flex items-center justify-center px-8 py-4 text-base font-bold transition-all duration-300 rounded-xl shadow-md ${
            theme === "dark" 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
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
          href="/premium-mock-tests"
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
      
      {/* After Decorative Elements */}
      <div className="flex justify-center mt-12">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      </div>
    </div>
  </div>
</section>
<section className={` ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
  <Faq/>
  </section>

{/* Add these keyframe animations to your global styles */}

      </div>
    </>
  );
  

}
