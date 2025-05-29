'use client';
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from "./ThemeContext";
import { Moon, Sun, ChevronDown, Menu, X, User, LogOut, Home, BarChart, Users, MessageSquare, BookOpen } from "lucide-react";
import GradientText from "@/components/GradientText";

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNavOpen, setNavOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null); // Ref for mobile menu

  // Handle scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle sign-out
  const handleSignOut = async () => {
    toast.success("Signed out successfully");
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutsideNav = (event: MouseEvent) => {
      if (
        isNavOpen &&
        navRef.current &&
        !(event.target as Element).closest('.mobile-menu') &&
        !(event.target as Element).closest('.mobile-menu-toggle')
      ) {
        setNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideNav);
    return () => document.removeEventListener('mousedown', handleClickOutsideNav);
  }, [isNavOpen]);

  return (
    <nav className={`transition-all duration-300 border-b ${theme === "light" ? "bg-white border-gray-100" : "bg-gray-900 border-gray-800"} sticky top-0 z-50`}>
      <div className={`${scrolled ? 'shadow-md' : ''}`}>
        

        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto  px-4 py-4">
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            {theme === "light" ? (
              <img
              
                
                src="/logo.png"
                className="h-12 rounded-full"
              
                
                alt="Trackode Logo"
              />
            ) : ( 
              <>
              <img className="h-12  rounded-full"
                alt="Trackode Logo Dark" src="/icon-192x192.png">
              </img>
              <img
                src="/brandname.png"
                className="h-9 mt-2 mr-2 rounded-full"
                alt="Trackode Logo Dark"
              />
              </>
            )}
            
          </Link>

          <div className="flex items-center md:order-2 space-x-4 rtl:space-x-reverse">
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
                          href={`/profile/${session.user?.email}`}
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
                className={`flex items-center lg:px-4 sm:px-2 px-2 py-2 text-base font-medium rounded-lg transition-all duration-300 relative overflow-hidden group ${theme === "light" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              >
                <User size={16} className="mr-1" />
                <span className="block relative">
                  <span className="block transition-transform duration-300 group-hover:-translate-y-8">{/* current text slides up */}
                    Sign in
                  </span>
                  <span className="block absolute left-0 top-8 w-full transition-transform duration-300 group-hover:-translate-y-8">
                    Sign in
                  </span>
                </span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setNavOpen(!isNavOpen)}
              className={`inline-flex items-center p-2 rounded-lg md:hidden focus:outline-none focus:ring-2 transition-colors mobile-menu-toggle ${theme === "light" ? "text-gray-700 hover:bg-gray-100 focus:ring-gray-200" : "text-gray-300 hover:bg-gray-700 focus:ring-gray-600"}`}
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
            ref={navRef}
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 transition-all duration-300 mobile-menu ${isNavOpen ? "block" : "hidden"}`}
          >
            <ul className={`flex flex-col font-medium p-2 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-1 md:mt-0 md:border-0 ${theme === "light" ? "bg-white md:bg-white" : "bg-gray-900 md:bg-gray-900"}`}>
              <NavItem
                href={status === "authenticated" ? "/programming-quizzes" : "/signin"}
                theme={theme}
                icon={<Home size={18} />}
              >
               Explore Quizzes
              </NavItem>
              <NavItem href="/mocks" theme={theme} icon={<BookOpen size={18} />}>
                Mock Tests
              </NavItem>
              <NavItem href="/dashboard" theme={theme} icon={<Users size={18} />}>
                Student Section
              </NavItem>
              <NavItem href="/admin-dashboard" theme={theme} icon={<BarChart size={18} />}>
                Creator Dashboard
              </NavItem>
              
              <li className="w-full md:w-auto">
                <button
                  onClick={toggleTheme}
                  className={`relative flex items-center justify-start w-full md:w-auto px-3 py-2 rounded-lg transition-all duration-300 group text-sm font-medium ${
                    theme === "light"
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700 md:bg-transparent md:hover:bg-blue-50"
                      : "bg-gray-800 hover:bg-gray-700 text-yellow-300 md:bg-transparent md:hover:bg-gray-800"
                  }`}
                  aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                >
                  <span className="relative w-6 h-6 flex items-center justify-center mr-2">
                    <Moon
                      size={22}
                      className={`absolute transition-opacity duration-300 ${
                        theme === "light" ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <Sun
                      size={22}
                      className={`absolute transition-opacity duration-300 ${
                        theme === "light" ? "opacity-0" : "opacity-100"
                      }`}
                    />
                  </span>
                  <span className="block md:hidden">
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </span>
                  <span
                    className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:block hidden ${
                      theme === "light" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Helper component for nav items
const NavItem = ({ href, theme, icon, children }: any) => (
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