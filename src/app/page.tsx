"use client";
import Image from "next/image";
import 'flowbite';
import { useSession } from 'next-auth/react';
import '@/app/globals.css';
import Faq from "@/components/Faq";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useState } from "react";
export default function Home() {
    const { data: session, status } = useSession();
    const [isFirstVisit, setIsFirstVisit] = useState(false);

    useEffect(() => {
        const firstVisit = localStorage.getItem("isFirstVisit");
    
        if (firstVisit === null) {
          // If it's the user's first visit, show the toast and set it in localStorage
          localStorage.setItem("isFirstVisit", "true");
          setIsFirstVisit(true);
        } else {
          // If it's not the first visit, do not show toast
          setIsFirstVisit(false);
        }
      }, []);
    
      // Show toast on successful sign-in, only once
      useEffect(() => {
        if (status === "authenticated" && isFirstVisit) {
         
          if (session?.user) {
            toast.success(`Welcome ${session.user.name?.split(' ')[0]} enjoy your journey with trackode!`);
          }
        }
      }, [status, isFirstVisit]);
    
      // Reset first visit flag on sign-out
      useEffect(() => {
        if (status === "unauthenticated") {
          localStorage.removeItem("isFirstVisit");
          setIsFirstVisit(false);
        }
      }, [status]);
    return (
        <div className="overflow-x-hidden text-white bg-neutral-950 white:bg-white white:text-black">

            <section className="pt-12 text-white white:text-black bg-neutral-950 white:bg-white sm:pt-16">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center">

                        <p className="mt-5 text-4xl font-bold leading-tight text-white-900 white:text-black sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight font-pj">
                            <span className="text-blue-400 transition-shadow">Track </span>Grow 
                            <span className="relative inline-flex sm:inline">
                                <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                                <span className="relative ml-5">Analyze  </span>
                            </span>
                        </p>
                        <div className="text-center font-[650] text-gray-500 dark:text-darkText-400 md:text-3xl"><p><span className="dark:text-white"> Trac</span><span className="text-blue-900">kode </span>helps you navigate and track your journey to success</p></div>

                        <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-5 sm:flex mt-9 white:text-white text-white p-8">
                            {session?(
                                <Link
                                href="/admin-dashboard"
                                title=""
                                className="inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold white-text-white text-white transition-all  bg-blue-900 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:text-blue-400"
                                role="button"
                            >
                                Get Started
                            </Link>
                            ):
                            (
                                <Link
                                href="/signin"
                                title=""
                                className="inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold white-text-white text-white transition-all  bg-blue-900 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:text-blue-400"
                                role="button"
                            >
                                Get Started

                            </Link> 
                            )
                            }
                            

                            <Link
                                href="#"
                                title=""
                                className="inline-flex items-center justify-center w-full px-6 py-3 mt-4 text-lg font-bold text-white transition-all  border-2 border-gray-400 sm:w-auto sm:mt-0 rounded-xl font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-900 focus:bg-gray-900 hover:text-blue-400 focus:text-white hover:border-gray-900 focus:border-gray-900"
                                role="button"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 18 18" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
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

                        {/* <p className="mt-8 text-base text-gray-500 font-inter">Its better to start late than never !!</p> */}
                    </div>
                </div>

                <div className="pb-12 bg-neutral-950 white:bg-white">
                    <div className="relative">
                        <div className="absolute inset-0 h-2/3 bg-neutral-950 white:bg-white"></div>
                        <div className="relative mx-auto">
                            <div className="lg:max-w-6xl lg:mx-auto">
                                <img className="transform scale-110" src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/2/illustration.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="flex flex-col gap-4 text-center"><h3 className="text-3xl font-semibold text-center sm:text-start md:text-4xl dark:text-white lg:text-5xl">Simplify Your Prep</h3><p className="text-center sm:text-start font-[550] md:text-lg lg:text-xl text-gray text-gray-500 dark:text-darkText-400">Say goodbye to last-minute stress.Track all your questions and notes in one place for easy review and revision.</p><Link className="font-semibold text-center text-btnBlue sm:text-start" href="/question-tracker">Try Question Tracker -&gt;</a></div> */}
                <div className="flex flex-col gap-2 text-center ps-5 pr-5 pb-28"><h3 className="text-3xl font-semibold dark:text-blue-400 sm:text-5xl">Your Favourite Platform</h3><p className="text-center font-[550] text-darkText-400 sm:text-xl md:text-3xl text-blue-200">Effortless coding & contests with Trackode</p></div>
            </section>
            <Faq/>
        </div>
    );
}
