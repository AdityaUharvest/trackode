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

import StructuredData from "@/components/StructuredData"
export const metadata = {
  title: 'Trackode - Master Coding Skills with Interactive Quizzes & Contests',
  description: 'Trackode helps developers track their coding journey through interactive quizzes, AI-generated challenges, and coding contests. Improve your programming skills effectively.',
  metadataBase: new URL('https://trackode.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Trackode - Master Coding Skills with Interactive Quizzes & Contests',
    description: 'Track your coding journey with interactive quizzes, AI challenges, and contests. The most effective way to improve programming skills.',
    url: 'https://trackode.in/',
    siteName: 'Trackode',
    images: [
      {
        url: 'https://trackode.in/trackode.png',
        width: 1200,
        height: 630,
        alt: 'Trackode Coding Platform',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trackode - Master Coding Skills with Interactive Quizzes & Contests',
    description: 'Track your coding journey with interactive quizzes, AI challenges, and contests.',
    images: ['https://trackode.in/trackode-og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      toast.success("🎉 Welcome to Trackode!",{
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
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
          <StructuredData />
        
        
        <Footer />
        </ThemeProvider>
        </SessionProvider>
       
        
      </body>
    </html>
  );
}
