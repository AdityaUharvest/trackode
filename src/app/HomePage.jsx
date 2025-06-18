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

import QuizJoinComponent from '@/components/JoinQuiz';
import TechStackQuizSystem from '@/components/TechnologySection';
import InteractiveQuiz from '@/components/DemoQuizzes';

import RoadMap from '@/components/roadmaps/Main';
import RotatingText from '@/components/RotatingText';
import AlternatingSections from '@/components/Links';

import MockExamCard from '@/components/MockExamCard';
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
        <section
          className={`relative rounded-br-3xl justify-center animate-slide-up flex flex-col ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-purple-50 via-white to-blue-100"} overflow-hidden min-h-[auto] sm:min-h-screen transition-all duration-500`}
          style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }}
        >
          {/* Background elements with parallax */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {theme === "dark" ? (
              <>
          <div
            className="absolute top-0 left-0 w-40 h-40 sm:w-72 sm:h-72 lg:w-112 lg:h-112 bg-gradient-to-r from-blue-800 to-cyan-900 rounded-full opacity-15 filter blur-2xl sm:blur-4xl animate-pulse-slow transform hover:scale-110 transition-transform duration-700"
          ></div>
          <div
            className="absolute bottom-0 right-0 w-40 h-40 sm:w-72 sm:h-72 lg:w-112 lg:h-112 bg-gradient-to-r from-purple-800 to-indigo-900 rounded-full opacity-15 filter blur-2xl sm:blur-4xl animate-pulse transform hover:scale-110 transition-transform duration-700"
          ></div>
          <div
            className="absolute top-1/3 right-1/3 w-32 h-32 sm:w-56 sm:h-56 lg:w-80 lg:h-80 bg-gradient-to-r from-indigo-800 to-teal-900 rounded-full opacity-10 filter blur-xl sm:blur-3xl animate-pulse-slow transform hover:scale-110 transition-transform duration-700"
          ></div>
              </>
            ) : (
              <>
          <div
            className="absolute top-0 left-0 w-40 h-40 sm:w-72 sm:h-72 lg:w-112 lg:h-112 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full opacity-20 filter blur-2xl sm:blur-4xl animate-pulse-slow transform hover:scale-110 transition-transform duration-700"
          ></div>
          <div
            className="absolute bottom-0 right-0 w-40 h-40 sm:w-72 sm:h-72 lg:w-112 lg:h-112 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-full opacity-20 filter blur-2xl sm:blur-4xl animate-pulse transform hover:scale-110 transition-transform duration-700"
          ></div>
          <div
            className="absolute top-1/3 right-1/3 w-32 h-32 sm:w-56 sm:h-56 lg:w-80 lg:h-80 bg-gradient-to-r from-indigo-300 to-teal-400 rounded-full opacity-15 filter blur-xl sm:blur-3xl animate-pulse-slow transform hover:scale-110 transition-transform duration-700"
          ></div>
              </>
            )}
            <div className="absolute inset-0 particles-js" id="particles-js"></div>
          </div>
          <div
            className="absolute -left-6 -top-6 w-16 h-20 sm:w-24 sm:h-32 bg-gradient-to-br from-purple-500 to-blue-700 rounded-full opacity-25 animate-spin-slow"
          ></div>
          <div
            className="absolute -right-6 -bottom-6 w-16 h-20 sm:w-24 sm:h-32 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-full opacity-25 animate-spin-slow"
          ></div>

          {/* Floating code elements */}
          <div
            className="absolute hidden lg:block left-6 lg:left-12 top-24 lg:top-48 opacity-25 dark:opacity-15 animate-float-slow hover:animate-pulse"
          >
            <div className="text-purple-400 dark:text-cyan-300 font-mono text-sm lg:text-base transition-all duration-300">
              {"async trackode() {"}<br />
              {"  await masterSkills();"}<br />
              {"}"}
            </div>
          </div>
          <div
            className="absolute hidden lg:block right-6 lg:right-12 bottom-24 lg:bottom-48 opacity-25 dark:opacity-15 animate-float hover:animate-pulse"
          >
            <div className="text-purple-400 dark:text-cyan-300 font-mono text-sm lg:text-base transition-all duration-300">
              {"const dev = {"}<br />
              {"  name: 'Trackode',"}<br />
              {"  expertise: 'AI Quizzes',"}<br />
              {"  skills: 'elite',"}<br />
              {"  passion: true"}<br />
              {"}"}
            </div>
          </div>

          <div className="w-full pt-6 px-4 sm:px-8 z-20 relative">
            <div className="max-w-lg mx-auto">
              <QuizJoinComponent />
            </div>
          </div>

          <div
            className="relative px-4 py-8 mx-auto    z-10 flex-1 flex flex-col  "
          >
            <div className="flex  mt-3 flex-col">
              <div className=" mb-6 flex flex-col items-center lg:justify-center">
          <h1
            className=" text-3xl md:text-4xl lg:text-5xl font-extrabold text-center"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            <span className="block mb-2 text-gray-700 dark:text-gray-200 text-left ">
              Personalized Quizzes, Mocks and <span className="text-violet-500 dark:text-violet-400"> Roadmaps</span>
            </span>
            <span className="block text-gray-800 dark:text-white text-left md:text-center lg:text-center">
              <span className="inline-flex items-center ">
              <span className="text-violet-500 dark:text-violet-300 font-extrabold">
            AI-Based
                </span>
                <RotatingText
            texts={['Quizzes', 'Mocks', 'Roadmaps', 'Feedbacks']}
            mainClassName=" px-3 py-1 items-center rounded-xl
              transition-all duration-300 hover:scale-105 group
               text-gray-700 dark:text-white
             hover:shadow-lg overflow-hidden justify-center"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
                />
              </span>
            </span>
           
          </h1>
          <p
            className={`sm:text-center text-lg text-left sm:mt-4  max-w-xl animate-fade-in-up ${theme === "dark" ? "text-gray-400" : "text-gray-800"}`}
            >
            Master your journey with personalized roadmaps, mocks, and quizzes. Track your progress, & accelerate your learning with AI Based guidance.
          </p>
              </div>

              <div className=" lg:mt-0 flex lg:gap-5 gap-2 sm:justify-center mb-5">
          <Link
            href="/programming-quizzes"
            className="px-4 py-3 sm:py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-cyan-400 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></span>
            Start Learning Now
          </Link>
          <Link
            href="/dashboard"
            className={`px-7 py-3 sm:py-4 text-base  font-semibold rounded-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group ${theme === "dark" ? "text-white bg-gray-700/50/50 hover:bg-gray-700/50 border border-gray-600" : "text-gray-800 bg-white hover:bg-gray-50 border border-gray-300"}`}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></span>
          View Dashboard
          </Link>
              </div>

              <div className="w-full mt-4 mb-10 ">
          <div className="items-center sm:justify-center flex gap-16 md:gap-5 ">
            <div className="flex sm:mb-0">
              <div className="flex -space-x-3">
                {["aditya.png", "rohit.png", "rohitk.png", "kajal.png"].map(
            (img, i) => (
              <div
                key={i}
                className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 ${theme === "dark" ? "border-gray-800" : "border-white"} overflow-hidden shadow-lg transition-transform duration-500 hover:scale-125 hover:z-10 relative`}
                style={{ zIndex: 4 - i }}
              >
                <Image
                  alt={`User ${i + 1}`}
                  src={`/${img}`}
                  width={48}
                  height={48}
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
            className={`w-4 h-4 sm:w-6 sm:h-6 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}
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
            className={`ml-2 text-sm sm:text-base font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
            Trusted by 10K+ developers
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span
              className={`ml-2 text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              4.8/5
            </span>
                </div>
              </div>
            </div>
          </div>
          
              </div>
            </div>

            <style jsx>{`
              @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
              }
              @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-2deg); }
              }
              @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
              }
              @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
              }
              @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
              }
              @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
              }
              .animate-float {
          animation: float 5s ease-in-out infinite;
              }
              .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
              }
              .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
              }
              .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
              }
              .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 6s ease-in-out infinite;
              }
              .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
              }
              @media (max-width: 640px) {
          .animate-pulse {
            animation: none;
          }
          .animate-gradient-flow {
            animation-duration: 8s;
          }
              }
            `}</style>
          </div>
        </section>

        {/* Level Up Coding and Stats */}
        <section
          className={`pb-16 `}
          aria-labelledby="cta-heading"
          data-aos="fade-up"
          style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }}
        >
          

         <AlternatingSections/>
        </section>

        {/* Technology Section */}
        <section
          id="technology"
          className={`pb-16 pt-5 px-2  ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}
          aria-labelledby="tech-stack-hading"
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
                className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Technology We Cover
              </h2>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </motion.div>
          </div>
          
          <TechStackQuizSystem />
         
          
        </section>
         <section 
  className={`pb-16 ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}
  style={{
    backgroundImage: theme === "dark"
      ? "url('/image.png')"
      : "url('/your-light-bg-image.jpg')",
  }}
>
  <div className="px-3 mx-auto max-w-7xl sm:px-4 lg:px-4">
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
                Featured Mock Exams
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
style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }}
          className={`
  pb-16 ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}

        >
          
          <RoadMap/>
        </section>
       
<section 
  className={`pb-16 ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"}`}
  style={{
    backgroundImage: theme === "dark"
      ? "url('/image.png')"
      : "url('/your-light-bg-image.jpg')",
  }}
>
  <div className=" mx-auto  sm:px-4 lg:px-4">
    <div className="text-center mb-12">
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
          Why Trackode is Different
              </h2>
        
        <p className={`mt-4 max-w-2xl mx-auto text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          We're not just another quiz platform - we're a complete learning ecosystem
        </p>
      </motion.div>
    </div>

    <div className="">
      {/* Feature Comparison Table */}
      <div className={`rounded-2xl overflow-hidden shadow-xl ${theme === "dark" ? "bg-gray-700/50" : "bg-white"}`}>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                <th className={`py-4 px-6 text-left ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Feature</th>
                <th className={`py-4 px-6 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Trackode</th>
                <th className={`py-4 px-6 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Other Platforms</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  feature: "AI-Powered Quiz Generation",
                  trackode: true,
                  others: false
                },
                {
                  feature: "Personalized Learning Roadmaps",
                  trackode: true,
                  others: false
                },
                {
                  feature: "Real-time Analytics Dashboard",
                  trackode: true,
                  others: "Limited"
                },
                {
                  feature: "Exam-Specific Mock Tests",
                  trackode: true,
                  others: "Basic"
                },
                {
                  feature: "AI Feedback & Recommendations",
                  trackode: true,
                  others: false
                },
                {
                  feature: "Interactive Coding Challenges",
                  trackode: true,
                  others: true
                },
                {
                  feature: "Progress Tracking Across Skills",
                  trackode: true,
                  others: "Partial"
                },
                {
                  feature: "Free Quiz Hosting",
                  trackode: "15 quizzes/month",
                  others: "1-5 quizzes/month"
                }
              ].map((item, index) => (
                <tr 
                  key={index} 
                  className={`border-b ${theme === "dark" ? "border-gray-700 hover:bg-gray-750" : "border-gray-200 hover:bg-blue-50"}`}
                >
                  <td className={`py-4 px-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{item.feature}</td>
                  <td className="py-4 px-6 text-center">
                    {item.trackode === true ? (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : item.trackode === false ? (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme === "dark" ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
                        {item.trackode}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {item.others === true ? (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : item.others === false ? (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"}`}>
                        {item.others}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Advantages */}
     
    </div>

    
  </div>
</section>
<section

          className={`pb-16 ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}
          style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }}

        >
          
          <div className="px-4 mx-auto   sm:px-6 ">
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
                  Why Choose Trackode
                </h2>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
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
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                  <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          className={`pb-16 ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}
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
                  How Trackode Works
                </h2>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
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
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-500 transition-colors duration-300"></div>
                <div className="p-7 relative z-10">
                  <div className={`flex items-center justify-center w-14 h-14 mb-6 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-blue-500 group-hover:bg-blue-400" : "bg-blue-100 group-hover:bg-blue-200"}`}>
                    <svg className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${theme === "dark" ? "text-white" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="relative">
                    <span className={`absolute -left-6 top-1/2 transform -translate-y-1/2 text-5xl font-bold opacity-10 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`}>1</span>
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
          className={`pb-16  ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}
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
                Try a Free Demo Quiz
              </h2>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </motion.div>
          </div>
          <InteractiveQuiz />
        </section>

        {/* Why Choose Section */}
        

        {/* Testimonials Section */}
        <section
          className={`pb-16 ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"} rounded-lg`}
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
                  What Our Users Say
                </h2>
                
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </motion.div>
              <p
                className={`mt-4 max-w-2xl mx-auto lg:text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
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
          className={`pb-16 ${theme === "dark" ? "bg-gray-700/50/50" : "bg-gray-100"}`}
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
                Frequently Asked Questions
              </h2>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </motion.div>
          </div>
          <Faq />
        </section>
        
      
      </div>
    </>
  );
}