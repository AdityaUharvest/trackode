"use client"
import Head from "next/head";
import { ReactNode } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import './globals.css';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from '../components/ThemeContext';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { metadata } from "./metadata";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      toast.success("🎉 Welcome to Trackode!", { autoClose: 3000 });
      localStorage.setItem("hasVisited", "true");
      setIsFirstVisit(true);
    }
  }, []);
  return (
    <html lang="en">
      <Head>
        <title>Trackode - Enhance Your Coding Skills</title>
        <meta name="description" content="Trackode is a one-stop platform for coding, quizzes, and contest preparation." />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </Head>
      <body>
      
        <SessionProvider>
        
        <ThemeProvider>
        
        <Analytics />
        <SpeedInsights/>

        <Navbar />
        <ToastContainer position="top-right" autoClose={3000}/>
          <div className="min-h-screen">{children}</div>
        
        
        
        <Footer />
        </ThemeProvider>
        </SessionProvider>
       
        
      </body>
    </html>
  );
}
