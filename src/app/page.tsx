"use client";

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

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

export default function Home() {
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
    if (status === "authenticated" && isFirstVisit) {
      if (session?.user) {
        toast.success(
          `Welcome ${session.user.name?.split(" ")[0]}`,
        );
      }
    }
  }, [session?.user]);

  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.removeItem("isFirstVisit");
      setIsFirstVisit(false);
    }
  }, [status]);

  return (
    <>
      <Head>
        <title>Trackode - Master Coding Skills with Interactive Quizzes & Contests</title>
        <meta name="description" content="Trackode helps developers track their coding journey through interactive quizzes, AI-generated challenges, and coding contests. Improve your programming skills effectively." />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="Trackode, Coding Quiz, Programming Challenges, Coding Contests, AI Generated Quizzes, Technical Assessments, Developer Skills, Coding Practice" />
        <meta name="author" content="Trackode" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Trackode - Master Coding Skills with Interactive Quizzes & Contests" />
        <meta property="og:description" content="Track your coding journey with interactive quizzes, challenges, and contests. The most effective way to improve your programming skills." />
        <meta property="og:image" content="https://trackode.in/trackode.png" />
        <meta property="og:url" content="https://trackode.in" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Trackode" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trackode - Master Coding Skills with Interactive Quizzes & Contests" />
        <meta name="twitter:description" content="Track your coding journey with interactive quizzes, challenges, and contests. The most effective way to improve your programming skills." />
        <meta name="twitter:image" content="https://trackode.in/trackode.png" />
        <meta name="twitter:site" content="@Trackode" />
        <meta name="twitter:creator" content="@Trackode" />
        
        {/* Mobile & App Meta Tags */}
        <meta name="theme-color" content={theme === "dark" ? "#1f2937" : "#ffffff"} />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Trackode" />
        <meta name="application-name" content="Trackode" />
        
        {/* Microsoft/IE Meta Tags */}
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="msapplication-TileImage" content="https://trackode.in/trackode.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Verification Tags */}
        <meta name="google-site-verification" content="google1264d9aceb7f9a8a.html" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://trackode.in" />
      </Head>

      <div className={`overflow-x-hidden ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <section className={`pt-12 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"} sm:pt-16`}>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="mt-5 text-4xl font-bold leading-tight sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight">
                <span>
                  <SplitText
                    text="Track"
                    className="text-2xl text-blue-600 font-semibold text-center"
                    delay={150}
                    animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                    animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                    threshold={0.2}
                    rootMargin="-50px"
                    onLetterAnimationComplete={handleAnimationComplete}
                  />
                </span>
                <span>
                  <SplitText
                    text="Code Quiz "
                    className="text-2xl font-semibold text-center"
                    delay={150}
                    animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                    animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                    threshold={0.2}
                    rootMargin="-50px"
                    onLetterAnimationComplete={handleAnimationComplete}
                  />

                  <GradientText
                    colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                    animationSpeed={15}
                    showBorder={false}
                    className="text-lg lg:font-semibold sm:font-bold"
                  >
                    Trackode Helps You Navigate and Track Your Journey to Success
                  </GradientText>
                </span>
              </h1>

              <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-5 sm:flex mt-9 p-8">
                <Link
                  href="/admin-dashboard"
                  className="inline-flex items-center justify-center w-full px-8 py-3 text-sm font-bold text-white transition-all bg-blue-600 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:text-white-400"
                  role="button"
                  aria-label="Get started with Trackode"
                >
                  Get Started
                </Link>

                <Link
                  href="/dashboard"
                  className={`inline-flex items-center justify-center w-full px-6 py-3 mt-4 text-sm font-bold transition-all border-2 sm:w-auto sm:mt-0 rounded-xl font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    theme === "dark"
                      ? "text-white border-gray-400 hover:bg-blue-900 focus:bg-blue-900 focus:text-white focus:border-blue-900"
                      : "text-black border-gray-400 hover:bg-blue-200 focus:bg-blue-200 focus:text-black focus:border-blue-200"
                  }`}
                  role="button"
                  aria-label="Go to dashboard"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
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
            </div>
          </div>

          <div className={`pb-12 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
            <div className="relative">
              <div className={`absolute inset-0 h-2/3 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}></div>
              <div className="relative mx-auto">
                <div className="lg:max-w-3xl mt-7 mb-7 ml-6 mr-6 justify-center flex lg:mx-auto">
                  <img
                    className="transform rounded-lg shadow-lg hover:animate-pulse shadow-blue-800 scale-120"
                    src={`${theme === "dark" ? "homepage.png" : "homepagedark.png"}`}
                    alt="Trackode coding quiz dashboard interface"
                    loading="lazy"
                    width="800"
                    height="450"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-center ps-5 pr-5 pb-12">
            <h2 className={`text-xl animate-pulse font-semibold sm:text-xl ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
              Your Favorite Coding Platform
            </h2>

            <p className={`text-center font-[550] sm:text-sm md:text-xl ${theme === "dark" ? "text-blue-200" : "text-blue-800"}`}>
              Effortless coding practice & contests with Trackode
            </p>
          </div>
          
          <div className="sm:items-center sm:justify-center mb-20 sm:px-0 sm:space-x-5 sm:flex p-4">
            <Link
              href="/dashboard/quiz-list"
              className={`animate-pulse inline-flex items-center justify-center w-full px-6 py-3 mt-4 text-sm font-bold transition-all border-2 sm:w-auto sm:mt-0 rounded-xl font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                theme === "dark"
                  ? "text-white border-gray-400 hover:bg-blue-900 focus:bg-blue-900 focus:text-white focus:border-blue-900 bg-blue-500"
                  : " border-gray-400 hover:bg-blue-800 focus:bg-blue-200 focus:text-black bg-blue-500 text-white focus:border-blue-200"
              }`}
              role="button"
              aria-label="Explore available coding quizzes"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M8.18003 13.4261C6.8586 14.3918 5 13.448 5 11.8113V5.43865C5 3.80198 6.8586 2.85821 8.18003 3.82387L12.5403 7.01022C13.6336 7.80916 13.6336 9.44084 12.5403 10.2398L8.18003 13.4261Z"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Explore Live Quizzes
            </Link>
            
            <Link
              href="/premium-mock-tests"
              className="inline-flex items-center justify-center w-full px-8 py-3 text-sm font-bold text-white transition-all bg-green-600 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:text-white-400"
              role="button"
              aria-label="Access premium coding mock tests"
            >
              Premium Mock Tests
            </Link>
          </div>
        </section>
        
        <section aria-labelledby="faq-section">
          <Faq />
        </section>
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Trackode",
              "url": "https://trackode.in",
              "description": "Track your coding journey with interactive quizzes, challenges, and contests.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://trackode.in/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </div>
    </>
  );
}