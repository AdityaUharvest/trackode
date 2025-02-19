"use client"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import './globals.css';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from '@/components/ThemeContext';
import { SpeedInsights } from "@vercel/speed-insights/next"
export const metadata = {
  title: "Trackode - Enhance Your Coding Skills",
  description: "Trackode is a one-stop platform for coding, quizzes, and contest preparation.",
  icons: {
    icon: "/favicon.ico", 
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};
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
      <head>
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
       
      </head>
      <body>
        
        <SessionProvider>
        <ThemeProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Analytics />
        <SpeedInsights/>
        <Navbar />
        <div className="min-h-screen">{children}</div>
        
        <Footer />
        </ThemeProvider>
        </SessionProvider>
       
        
      </body>
    </html>
  );
}
