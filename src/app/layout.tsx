"use client"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import "./globals.css"; // If you have global Tailwind styles
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // ✅ Import CSS for styling
import './globals.css';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
      <body>
        <SessionProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />
        <div className="min-h-screen">{children}</div>
        <Footer />
        </SessionProvider>
        
      </body>
    </html>
  );
}
