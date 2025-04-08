'use client';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useTheme } from "./ThemeContext";
import { Moon, Sun, ChevronDown, Menu, X, User, LogOut, Home, BarChart, Users, MessageSquare, BookOpen } from "lucide-react";
import GradientText from "@/components/GradientText";

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNavOpen, setNavOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  // Add scroll event listener to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle sign-out
  const handleSignOut = async () => {
    toast.success("Signed out successfully", {
      autoClose: 3000,
      closeOnClick: false,
    });
    await signOut({ callbackUrl: '/' });
    localStorage.setItem("isFirstVisit", "true");
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className={`${scrolled ? 'shadow-md' : ''} transition-all duration-300`}>
      <Link href="/premium-mock-tests">
        <div className={`flex py-2 justify-center ${theme === "light" ? "bg-blue-50" : "bg-blue-900 bg-opacity-30"}`}>
          <div className="flex items-center gap-2">
            <div className="relative px-4 py-1 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-teal-400">
              <GradientText
                colors={["#ffffff", "#ffffff"]}
                animationSpeed={50}
                showBorder={false}
                className="text-sm font-bold relative z-10"
              >
                TCS NQT Mock Test is free 🚀 till 31st July✨
              </GradientText>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-blue-600 to-teal-400 opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </Link>
      
      <nav className={`transition-all duration-300 border-b ${theme === "light" ? "bg-white border-gray-100" : "bg-gray-900 border-gray-800"} sticky top-0 z-50`}>
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <img
              src="https://i.ibb.co/jvr3wb6b/trackode.png" 
              className="h-8 rounded-lg"
              alt="Trackode Logo"
            />
            <span className={`self-center text-lg font-extrabold whitespace-nowrap ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Trackode
            </span>
          </Link>

          <div className="flex items-center md:order-2 space-x-4 rtl:space-x-reverse">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-800 hover:bg-gray-700"}`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} className="text-gray-700" /> : <Sun size={18} className="text-yellow-300" />}
            </button>

            {/* Profile button */}
            {status === "authenticated" ? (
              <div className="relative user-dropdown">
                <button
                  type="button"
                  className={`flex items-center text-sm rounded-full focus:ring-2 focus:ring-blue-500 transition-all hover:scale-105 ${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="relative">
                    {session.user?.image ? (
                      <img
                        className="w-9 h-9 rounded-full p-0.5 border-2 border-blue-500"
                        src={session.user.image}
                        alt="User photo"
                      />
                    ) : (
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${theme === "light" ? "bg-blue-100" : "bg-blue-900"}`}>
                        <User size={18} className={theme === "light" ? "text-blue-600" : "text-blue-300"} />
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div
                    className={`z-50 mt-2 text-base list-none divide-y rounded-xl shadow-lg absolute right-0 w-56 origin-top-right transition-all duration-200 ${theme === "light" ? "bg-white text-gray-900 divide-gray-100" : "bg-gray-800 text-white divide-gray-700"}`}
                  >
                    <div className="px-4 py-3 text-center">
                      <span className={`block font-sans font-bold text-base ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                        {session.user?.name}
                      </span>
                      <span className="block text-sm truncate opacity-70">
                        {session.user?.email}
                      </span>
                    </div>
                    <ul className="py-1">
                      <li>
                        <Link
                          href="/admin-dashboard"
                          className={`flex items-center px-4 py-2 text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors ${theme === "light" ? "text-gray-700" : "text-gray-200"}`}
                        >
                          <BarChart size={16} className="mr-2" />
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/profile"
                          className={`flex items-center px-4 py-2 text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors ${theme === "light" ? "text-gray-700" : "text-gray-200"}`}
                        >
                          <User size={16} className="mr-2" />
                          Profile Settings
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          onClick={handleSignOut}
                          className={`flex items-center px-4 py-2 text-sm font-medium hover:bg-red-500 hover:text-white transition-colors ${theme === "light" ? "text-gray-700" : "text-gray-200"}`}
                        >
                          <LogOut size={16} className="mr-2" />
                          Sign out
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/signin"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:translate-y-[-2px] ${theme === "light" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
              >
                <User size={16} className="mr-1" />
                Sign in
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setNavOpen(!isNavOpen)}
              className={`inline-flex items-center p-2 rounded-lg md:hidden focus:outline-none focus:ring-2 transition-colors ${theme === "light" ? "text-gray-700 hover:bg-gray-100 focus:ring-gray-200" : "text-gray-300 hover:bg-gray-700 focus:ring-gray-600"}`}
              aria-expanded={isNavOpen}
            >
              <span className="sr-only">{isNavOpen ? 'Close menu' : 'Open menu'}</span>
              {isNavOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>

          {/* Navigation links */}
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 transition-all duration-300 ${
              isNavOpen ? "block" : "hidden"
            }`}
          >
            <ul className={`flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-1 md:mt-0 md:border-0 ${theme === "light" ? "bg-white md:bg-white" : "bg-gray-900 md:bg-gray-900"}`}>
              <NavItem href="/premium-mock-tests" theme={theme} icon={<BookOpen size={18} />}>
                Mock Test
              </NavItem>
              <NavItem href="/dashboard" theme={theme} icon={<Users size={18} />}>
                Student Section
              </NavItem>
              <NavItem href="/admin-dashboard" theme={theme} icon={<BarChart size={18} />}>
                Dashboard
              </NavItem>
              <NavItem 
                href={status === "authenticated" ? "/quiz-list" : "/signin"} 
                theme={theme} 
                icon={<Home size={18} />}
              >
                Quiz Tracker
              </NavItem>
              <NavItem href="/contact" theme={theme} icon={<MessageSquare size={18} />}>
                Contact
              </NavItem>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

// Helper component for nav items
const NavItem = ({ href, theme, icon, children }:any) => (
  <li>
    <Link
      href={href}
      className={`flex items-center py-2 px-3 md:px-3 rounded-lg font-medium text-sm hover:text-blue-600 transition-colors ${
        theme === "light" 
          ? "text-gray-700 hover:bg-blue-50 md:hover:bg-blue-50" 
          : "text-gray-200 hover:bg-gray-800 md:hover:bg-gray-800"
      }`}
    >
      <span className="mr-2">{icon}</span>
      {children}
    </Link>
  </li>
);

export default Navbar;