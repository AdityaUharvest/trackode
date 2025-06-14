'use client'
import { ReactNode, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider, useTheme } from "@/components/ThemeContext";
import toast, { Toaster } from 'react-hot-toast';

function ClientLayoutContent({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      toast.success("🎉 Welcome to Trackode!");
      localStorage.setItem("hasVisited", "true");
      setIsFirstVisit(true);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[url("/image.png")]' : 'bg-white'}`}>
        {children}
      </div>
      <Footer />
    </>
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Toaster />
      <ClientLayoutContent children={children} />
    </ThemeProvider>
  );
}