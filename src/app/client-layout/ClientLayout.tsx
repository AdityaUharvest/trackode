'use client'
import { ReactNode, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/ThemeContext"; // Import ThemeProvider

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    
    if (!hasVisited) {
      toast.success("🎉 Welcome to Trackode!", {
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
    <ThemeProvider>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </ThemeProvider>
  );
}