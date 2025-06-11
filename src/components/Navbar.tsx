'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from "./ThemeContext";
import { 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ArrowRight,
  User, 
  LogOut,  
  BarChart, 
  Users, 
  BookOpen,
  Settings,
  ChevronDown,
  AudioWaveform,
  Notebook
  
} from "lucide-react";

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNavOpen, setNavOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setScrolled(scrollY > 10);
  }, []);

  useEffect(() => {
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  // Enhanced sign-out with loading state
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      toast.success("Signing out...");
      await signOut({ callbackUrl: '/' });
      localStorage.setItem("isFirstVisit", "true");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced outside click handler
  const useOutsideClick = <T extends HTMLElement>(
    ref: React.RefObject<T>,
    callback: () => void,
    isOpen: boolean
  ) => {
    useEffect(() => {
      if (!isOpen) return;
      
      const handleClick = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          callback();
        }
      };

      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClick);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [ref, callback, isOpen]);
  };

  useOutsideClick(dropdownRef, () => setDropdownOpen(false), isDropdownOpen);
  useOutsideClick(navRef, () => setNavOpen(false), isNavOpen);
  useOutsideClick(notificationRef, () => setNotificationOpen(false), isNotificationOpen);

  // Navigation items configuration
  const navigationItems = useMemo(() => [
    {
      href: status === "authenticated" ? "/programming-quizzes" : "/signin",
      icon:<Notebook size={18} /> ,
      label: "Explore Quizzes",
      requiresAuth: false
    },
    {
      href: "/mocks",
      icon: <BookOpen size={18} />,
      label: "Mock Tests",
      requiresAuth: false
    },
    {
      href: "/roadmap",
      icon:<AudioWaveform size={18} />,
      label: "Roadmaps",
      requiresAuth: true
    },
    {
      href: "/dashboard",

      icon: <BarChart size={18} />,
      label: "Dashboard",
      requiresAuth: true
    },
    
  ], [status]);

  // Theme-based styles
  const themeStyles = useMemo(() => ({
    navbar: theme === "light" 
      ? "bg-white/95 backdrop-blur-md border-gray-200/50" 
      : "bg-gray-900/95 backdrop-blur-md border-gray-700/50",
    text: theme === "light" ? "text-gray-900" : "text-white",
    textSecondary: theme === "light" ? "text-gray-600" : "text-gray-300",
    hover: theme === "light" ? "hover:bg-gray-50" : "hover:bg-gray-800/50",
    dropdown: theme === "light" 
      ? "bg-white/95 backdrop-blur-md border-gray-200 shadow-xl" 
      : "bg-gray-800/95 backdrop-blur-md border-gray-700 shadow-xl",
  }), [theme]);

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b
        ${themeStyles.navbar}
        ${scrolled ? 'shadow-lg backdrop-blur-xl' : 'backdrop-blur-md'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center space-x-3 group transition-transform hover:scale-105"
                aria-label="Trackode Home"
              >
                <div className="relative">
                  {theme === "light" ? (
                    <img
                      src="/logo.png"
                      className="h-12 w-full  transition-shadow"
                      alt="Trackode"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <img 
                        className="h-12 rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                        alt="Trackode" 
                        src="/icon-192x192.png"
                      />
                      <img
                        src="/brandname.png"
                        className="h-8 rounded-lg"
                        alt="Trackode"
                      />
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navigationItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    theme={theme}
                    requiresAuth={item.requiresAuth}
                    isAuthenticated={status === "authenticated"}
                  >
                    {item.label}
                  </NavItem>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              
              {/* Search Button (Desktop) */}
              {/* <button
                className={`
                  hidden md:flex items-center justify-center w-10 h-10 rounded-xl
                  transition-all duration-200 hover:scale-105
                  ${themeStyles.hover} ${themeStyles.textSecondary}
                `}
                aria-label="Search"
              >
                <Search size={18} />
              </button> */}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-xl
                  transition-all duration-300 hover:scale-105 group
                  ${themeStyles.hover}
                `}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                <div className="relative w-5 h-5">
                  <Moon
                    size={18}
                    className={`
                      absolute inset-0 transition-all duration-300 
                      ${theme === "light" ? "opacity-100 rotate-0" : "opacity-0 rotate-180"}
                      ${themeStyles.textSecondary}
                    `}
                  />
                  <Sun
                    size={18}
                    className={`
                      absolute inset-0 transition-all duration-300 text-amber-500
                      ${theme === "light" ? "opacity-0 -rotate-180" : "opacity-100 rotate-0"}
                    `}
                  />
                </div>
                
                {/* Tooltip */}
                <div className={`
                  absolute -bottom-10 left-1/2 transform -translate-x-1/2
                  px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none z-50
                  ${theme === "light" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"}
                `}>
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </div>
              </button>

              {/* Notifications (for authenticated users) */}
              

              {/* User Section */}
              {status === "authenticated" ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className={`
                      flex items-center space-x-2 p-2 rounded-xl transition-all duration-200
                      hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${themeStyles.hover}
                    `}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="relative">
                      {session.user?.image ? (
                        <img
                          className="w-8 h-8 rounded-lg border-2 border-blue-500/20"
                          src={session.user.image}
                          alt="Profile"
                        />
                      ) : (
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${theme === "light" ? "bg-blue-100 text-blue-600" : "bg-blue-900 text-blue-300"}
                        `}>
                          <User size={16} />
                        </div>
                      )}
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`
                        transition-transform duration-200 ${themeStyles.textSecondary}
                        ${isDropdownOpen ? "rotate-180" : ""}
                      `}
                    />
                  </button>

                  {/* User Dropdown */}
                  {isDropdownOpen && (
                    <div className={`
                      absolute right-0 mt-2 w-64 rounded-xl border overflow-hidden
                      transform transition-all duration-200 origin-top-right
                      ${themeStyles.dropdown}
                    `}>
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-200/10">
                        <div className="flex items-center space-x-3">
                          {session.user?.image ? (
                            <img
                              className="w-12 h-12 rounded-xl"
                              src={session.user.image}
                              alt="Profile"
                            />
                          ) : (
                            <div className={`
                              w-12 h-12 rounded-xl flex items-center justify-center
                              ${theme === "light" ? "bg-blue-100 text-blue-600" : "bg-blue-900 text-blue-300"}
                            `}>
                              <User size={20} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold truncate ${themeStyles.text}`}>
                              {session.user?.name}
                            </p>
                            <p className={`text-sm truncate ${themeStyles.textSecondary}`}>
                              {session.user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <DropdownItem
                          href="/admin-dashboard"
                          icon={<BarChart size={16} />}
                          theme={theme}
                        >
                          Dashboard
                        </DropdownItem>
                        <DropdownItem
                          href={`/profile/${session.user?.email}`}
                          icon={<Settings size={16} />}
                          theme={theme}
                        >
                          Profile Settings
                        </DropdownItem>
                        <div className="border-t border-gray-200/10 my-2"></div>
                        <button
                          onClick={handleSignOut}
                          disabled={isLoading}
                          className={`
                            w-full flex items-center px-4 py-2 text-sm font-medium
                            transition-colors hover:bg-red-500 hover:text-white
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${theme === "light" ? "text-gray-700" : "text-gray-200"}
                          `}
                        >
                          <LogOut size={16} className="mr-3" />
                          {isLoading ? "Signing out..." : "Sign out"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/signin"
                  className={`
                    flex items-center px-4 py-2 text-sm font-medium rounded-xl
                    transition-all duration-300 hover:scale-105 group
                    bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                    text-white shadow-md hover:shadow-lg
                  `}
                >
                  <User size={16} className="mr-2" />
                  <span>Sign in</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setNavOpen(!isNavOpen)}
                className={`
                  md:hidden flex items-center justify-center w-10 h-10 rounded-xl
                  transition-all duration-200 hover:scale-105
                  ${themeStyles.hover} ${themeStyles.text}
                `}
                aria-expanded={isNavOpen}
                aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
              >
                {isNavOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            ref={navRef}
            className={`
              md:hidden transition-all duration-300 overflow-hidden
              ${isNavOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <div className="py-4 space-y-2 border-t border-gray-200/20">
              {navigationItems.map((item) => (
                <MobileNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  theme={theme}
                  onClick={() => setNavOpen(false)}
                  requiresAuth={item.requiresAuth}
                  isAuthenticated={status === "authenticated"}
                >
                  {item.label}
                </MobileNavItem>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16"></div>
    </>
  );
};

// Enhanced NavItem Component
const NavItem: React.FC<{
  href: string;
  icon: React.ReactNode;
  theme: string;
  children: React.ReactNode;
  requiresAuth?: boolean;
  isAuthenticated?: boolean;
}> = ({ href, icon, theme, children, requiresAuth = false, isAuthenticated = false }) => {
  const shouldShow = !requiresAuth || isAuthenticated;
  
  if (!shouldShow) return null;

  return (
    <Link
      href={href}
      className={`
        flex items-center px-3 py-2 rounded-xl text-sm font-medium
        transition-all duration-200 hover:scale-105 group
        ${theme === "light" 
          ? "text-gray-700 hover:bg-gray-100 hover:text-blue-600" 
          : "text-gray-300 hover:bg-gray-800/50 hover:text-blue-400"
        }
      `}
    >
      <span className="mr-2 transition-transform group-hover:scale-110">{icon}</span>
      {children}
    </Link>
  );
};

// Mobile NavItem Component
const MobileNavItem: React.FC<{
  href: string;
  icon: React.ReactNode;
  theme: string;
  children: React.ReactNode;
  onClick: () => void;
  requiresAuth?: boolean;
  isAuthenticated?: boolean;
}> = ({ href, icon, theme, children, onClick, requiresAuth = false, isAuthenticated = false }) => {
  const shouldShow = !requiresAuth || isAuthenticated;
  
  if (!shouldShow) return null;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center px-4 py-3 rounded-xl text-base font-medium
        transition-all duration-200 group
        ${theme === "light" 
          ? "text-gray-700 hover:bg-gray-100 hover:text-blue-600" 
          : "text-gray-300 hover:bg-gray-800/50 hover:text-blue-400"
        }
      `}
    >
      <span className="mr-3 transition-transform group-hover:scale-110">{icon}</span>
      {children}
    </Link>
  );
};

// Dropdown Item Component
const DropdownItem: React.FC<{
  href: string;
  icon: React.ReactNode;
  theme: string;
  children: React.ReactNode;
}> = ({ href, icon, theme, children }) => (
  <Link
    href={href}
    className={`
      flex items-center px-4 py-2 text-sm font-medium
      transition-colors hover:bg-blue-500 hover:text-white
      ${theme === "light" ? "text-gray-700" : "text-gray-200"}
    `}
  >
    <span className="mr-3">{icon}</span>
    {children}
  </Link>
);

export default Navbar;