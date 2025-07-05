import React, { useState } from 'react';
import { ArrowRight, Sparkles, Code, Zap, Target } from 'lucide-react';
import Link from 'next/link';
import RotatingText from '../RotatingText';
import QuizJoinComponent from './QuizJoinComponent';
import { useTheme } from '../ThemeContext';
// Redesigned Hero Section
const HeroSection = () => {
  

  const { theme } = useTheme(); // Assuming useTheme provides the current theme context

  return (
            <section
  className={`relative rounded-br-3xl justify-center animate-slide-up flex flex-col ${
    theme === "dark" 
      ? "bg-gray-900" 
      : "bg-gradient-to-br from-indigo-50 to-white"
  } overflow-hidden min-h-[auto] sm:min-h-screen transition-all duration-500`}
>
  {/* Simple background elements */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {theme === "dark" ? (
      <>
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </>
    ) : (
      <>
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </>
    )}
  </div>

  {/* Subtle corner accents */}
  <div className="absolute -left-4 -top-4 w-12 h-12 bg-indigo-400/20 rounded-full animate-spin-slow"></div>
  <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-indigo-500/20 rounded-full animate-spin-slow"></div>

  {/* Simple floating code elements */}
  <div className="absolute hidden lg:block left-12 top-48 opacity-20 animate-float-slow">
    <div className="text-indigo-500 dark:text-indigo-400 font-mono text-sm">
      {"async trackode() {"}<br />
      {"  await masterSkills();"}<br />
      {"}"}
    </div>
  </div>
  <div className="absolute hidden lg:block right-12 bottom-48 opacity-20 animate-float">
    <div className="text-indigo-500 dark:text-indigo-400 font-mono text-sm">
      {"const dev = {"}<br />
      {"  name: 'Trackode',"}<br />
      {"  expertise: 'AI Quizzes'"}<br />
      {"}"}
    </div>
  </div>

  <div className="w-full pt-6 px-4 sm:px-8 z-20 relative">
    <div className="max-w-lg mx-auto">
      <QuizJoinComponent />
    </div>
  </div>

  <div className="relative px-4 py-8 mx-auto z-10 flex-1 flex flex-col">
    <div className="flex mt-3 flex-col">
      <div className=" flex flex-col items-center lg:justify-center">
        <p className="text-indigo-400 mb-2">✨ Premium Quizzes & Mocks</p>
        <h1
          className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-center"
          style={{ fontFamily: "'Exo 2', sans-serif" }}
        >
          <span className="block mb-2 text-gray-700 dark:text-gray-200 sm:text-left md:text-center lg:text-center">
            PERSONALIZED AI-BASED{" "}
            <span className="text-indigo-500 inline-block">
              <RotatingText
                texts={['QUIZZES', 'MOCKS', 'ROADMAPS', 'FEEDBACKS']}
                mainClassName="px-2 py-1 items-center rounded-xl
                  transition-all duration-300 hover:scale-105 group
                   dark:text-indigo-600
                   overflow-hidden justify-center"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              /></span>
          </span>
          
        </h1>
        <p
          className={`text-center font-bold text-base sm:text-lg max-w-3xl animate-fade-in-up ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Master your journey with personalized roadmaps, mocks, and quizzes. Track your progress & accelerate your learning with
          
         <span className='text-indigo-600'> AI-Based  </span> 
           
           guidance.
        </p>
      </div>
{/* Feature highlights */}
            <div className="grid lg:grid-cols-3 grid-cols-2 gap-2 py-4 my-4">
              <div className="flex items-center  bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-md px-4 py-2 border border-indigo-200/50 dark:border-gray-700/50">
               
                <span className="sm:text-base text-sm font-medium flex gap-4 items-center  text-gray-700 dark:text-gray-300">
                  
                  <img src="/icons/book.gif" alt="" className='w-10 h-10' />
                  Adaptive Learning
                  </span>
              </div>
              <div className="flex items-center  bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-md px-4 py-2 border border-pink-200/50 dark:border-gray-700/50">
                 <span className="sm:text-base text-sm font-medium flex gap-4 items-center  text-gray-700 dark:text-gray-300">
                  
                  <img src="/icons/task-management.gif" alt="" className='w-10 h-10' />
                  Real-time Feedback
                  </span>
               
              </div>
              <div className="flex items-center  bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-md px-4 py-2 border border-purple-200/50 dark:border-gray-700/50">
                <span className="sm:text-base text-sm font-medium flex gap-4 items-center  text-gray-700 dark:text-gray-300">
                  
                  <img src="/icons/coding.gif" alt="" className='w-10 h-10' />
                  AI - Powered
                  </span>
              </div>
              <div className="flex sm:hidden  items-center  bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-md px-4 py-2 border border-purple-200/50 dark:border-gray-700/50">
                <span className="sm:text-base text-sm font-medium flex gap-4 items-center  text-gray-700 dark:text-gray-300">
                  
                  <img src="/icons/goals.gif" alt="" className='w-10 h-10' />
                  Mocks & Quizzes
                  </span>
              </div>
            </div>
      <div className="lg:mt-0 flex lg:gap-5 gap-2 justify-center mb-5">
        <Link
          href="/programming-quizzes"
          className="px-4 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full hover:from-white hover:to-indigo-50 focus:outline-none focus:ring-4 hover:text-indigo-400 border-indigo-400 border-2 focus:ring-indigo-300 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Start Learning Now
          <ArrowRight className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
        <Link
          href="/dashboard"
          className={`px-7 py-3 sm:py-4 text-base font-semibold rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl ${
            theme === "dark" 
              ? "text-white bg-gray-800 hover:bg-gray-700 border border-gray-600" 
              : "text-indigo-500 bg-white hover:bg-indigo-500 hover:text-white border border-indigo-200"
          }`}
        >
          View Dashboard
        </Link>
      </div>

      
    </div>

    <style jsx>{`
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(1deg); }
      }
      @keyframes float-slow {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(-1deg); }
      }
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.2; }
      }
      @keyframes spin-slow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes fade-in-up {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      .animate-float-slow {
        animation: float-slow 8s ease-in-out infinite;
      }
      .animate-pulse-slow {
        animation: pulse-slow 4s ease-in-out infinite;
      }
      .animate-spin-slow {
        animation: spin-slow 30s linear infinite;
      }
      .animate-fade-in-up {
        animation: fade-in-up 1s ease-out forwards;
      }
    `}</style>
  </div>
</section>
  );
};

export default HeroSection;