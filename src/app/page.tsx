"use client";
// import Image from "next/image";
import "flowbite";
import { useSession } from "next-auth/react";
import "@/app/globals.css";
import Faq from "../components/Faq";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "../components/ThemeContext"; // Assuming you have a ThemeContext
import SplitText from "../components/SplitText";
import GradientText from "@/components/GradientText"
const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};


export default function Home() {
  const { data: session, status } = useSession();
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const { theme, toggleTheme } = useTheme(); // Use the theme context

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
  }, [isFirstVisit, session?.user, status]); // Add session?.user as a dependency

  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.removeItem("isFirstVisit");
      setIsFirstVisit(false);
    }
  }, [status]);

  return (
    <div className={`overflow-x-hidden ${theme === "dark" ? "bg-gray-950 text-white" : "bg-white text-black"}`}>
      <section className={`pt-12 ${theme === "dark" ? "bg-gray-950 text-white" : "bg-white text-black"} sm:pt-16`}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="mt-5 text-4xl font-bold leading-tight sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight font-pj">
              <span>
                <SplitText
                  text="Track"
                  className="text-3xl text-blue-600 font-semibold text-center"
                  delay={150}
                  animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                  easing="easeOutCubic"
                  threshold={0.2}
                  rootMargin="-50px"
                  onLetterAnimationComplete={handleAnimationComplete}
                />
              </span>
              <span>
                <SplitText
                  text="Code Quiz "
                  className="text-3xl  font-semibold text-center"
                  delay={150}
                  animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                  easing="easeOutCubic"
                  threshold={0.2}
                  rootMargin="-50px"
                  onLetterAnimationComplete={handleAnimationComplete}
                />


                <GradientText
                  colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                  animationSpeed={15}
                  showBorder={false}
                  className="text-3xl font-semibold"
                >
                  Trackode Helps You Navigate and Track Your Journey to Success
                </GradientText>
              </span>

            </p>


            <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-5 sm:flex mt-9 p-8">
              {session ? (
                <Link
                  href="/admin-dashboard"
                  title=""
                  className="inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all bg-blue-600 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:text-white-400"
                  role="button"
                >
                  Get Started
                </Link>
              ) : (
                <Link
                  href="/signin"
                  title=""
                  className="inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all bg-blue-600 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:text-blue-400"
                  role="button"
                >
                  Get Started
                </Link>
              )}
              {session ? (
                <Link
                  href="/dashboard"
                  title=""
                  className={`inline-flex items-center justify-center w-full px-6 py-3 mt-4 text-lg font-bold transition-all border-2 sm:w-auto sm:mt-0 rounded-xl font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === "dark"
                    ? "text-white border-gray-400 hover:bg-blue-900 focus:bg-blue-900 focus:text-white focus:border-blue-900"
                    : "text-black border-gray-400 hover:bg-blue-200 focus:bg-blue-200 focus:text-black focus:border-blue-200"
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

              ) : (
                <Link
                  href="/signin" // fix the error
                  title=""
                  className={`inline-flex items-center justify-center w-full px-6 py-3 mt-4 text-lg font-bold transition-all border-2 sm:w-auto sm:mt-0 rounded-xl font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === "dark"
                    ? "text-white border-gray-400 hover:bg-blue-900 focus:bg-blue-900 focus:text-white focus:border-blue-900"
                    : "text-black border-gray-400 hover:bg-blue-200 focus:bg-blue-200 focus:text-black focus:border-blue-200"
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
              )}
            </div>
          </div>
        </div>

        <div className={`pb-12 ${theme === "dark" ? "bg-gray-950" : "bg-white"}`}>
          <div className="relative">
            <div className={`absolute inset-0 h-2/3 ${theme === "dark" ? "bg-gray-950" : "bg-white"}`}></div>
            <div className="relative mx-auto">
              <div className="lg:max-w-3xl mt-7 mb-7 ml-6 mr-6 justify-center flex lg:mx-auto">
                <img
                  className="transform rounded-lg  shadow-lg hover:animate-pulse shadow-blue-800 scale-120"
                  src={`${theme === "dark" ? "homepage.png" : "homepagedark.png"}`}
                  alt="Dashboard image"
                  loading="lazy"
                />

              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col  gap-2 text-center ps-5 pr-5 pb-28">
          <h3 className={`text-2xl animate-pulse   font-semibold sm:text-3xl ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
            Your Favourite Platform
          </h3>
          <p className={`text-center font-[550] sm:text-xl md:text-3xl ${theme === "dark" ? "text-blue-200" : "text-blue-800"}`}>
            Effortless coding & contests with Trackode
          </p>
        </div>
        <div className="lg:max-w-4xl  mb-14 ml-6 mr-6 justify-center flex lg:mx-auto">
          <img
            className="transform rounded-lg  shadow-lg  shadow-blue-800 scale-120"
            src={`${theme === "dark" ? "homepage2.png" : "homepage2dark.png"}`}
            alt="Dashboard image"
            loading="lazy"
          />

        </div>
      </section>
      <Faq />
    </div>
  );
}