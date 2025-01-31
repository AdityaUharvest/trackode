'use client';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useTheme } from "./ThemeContext"; // Ensure this path is correct
import { Moon, Sun } from "lucide-react";

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNavOpen, setNavOpen] = useState(false);
  const [isLoggedin, setLoggedin] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; image: string } | null>(null);
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  useEffect(() => {
    if (session) {
      setLoggedin(true);
      localStorage.setItem("isFirstVisit", "true");
      setUser({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        image: session?.user?.image || ''
      });
    }
  }, [session]);

  return (
    <nav className={`border-white-200 ${theme === "light" ? "bg-amber-50" : "bg-neutral-900"}`}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="trackode.png"
            className="h-8 rounded-lg"
            alt="Trackode Logo"
          />
          <span className={`self-center text-2xl font-semibold whitespace-nowrap ${theme === "light" ? "text-black" : "text-white"}`}>
            Trackode
          </span>
        </Link>

        <div className="flex items-center md:order-2 space-x-3 rtl:space-x-reverse">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === "light" ? "bg-gray-200" : "bg-gray-700"}`}
          >
            {theme === "light" ? <Moon size={20} className="text-black" /> : <Sun size={20} className="text-white" />}
          </button>

          {/* Profile button */}
          {isLoggedin ? (
            <button
              type="button"
              className={`flex text-sm rounded-full focus:ring-4 ${theme === "light" ? "bg-gray-200" : "bg-gray-700"}`}
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
            >
              <span className="sr-only">Open user menu</span>
              {user?.image ? (
                <img
                  className="w-8 h-8 rounded-full"
                  src={user?.image}
                  alt="user photo"
                  loading="lazy"
                />
              ) : (
                <img className="w-8 h-8 rounded-full" src="trackode.png" alt="user photo" />
              )}
            </button>
          ) : (
            <Link
              href="/signin"
              className={`block p-1 rounded-lg hover:bg-blue-400 md:hover:bg-blue-400 md:hover:text-white md:p-2 ${theme === "light" ? "bg-blue-900 text-white" : "bg-blue-900 text-white"}`}
            >
              Sign in
            </Link>
          )}

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div
              className={`z-50 my-4 text-base list-none divide-y rounded-lg shadow absolute right-4 top-12 ${theme === "light" ? "bg-amber-50 text-black" : "bg-gray-700 text-white"}`}
            >
              <div className="px-4 py-3">
                <span className={`block text-sm ${theme === "light" ? "text-black" : "text-white"}`}>
                  {user?.name}
                </span>
                <span className="block text-sm text-gray-500 truncate">
                  {user?.email}
                </span>
              </div>
              <ul className="py-2">
                <li>
                  <Link
                    href="/admin-dashboard"
                    className={`block px-4 py-2 text-sm hover:bg-blue-400 ${theme === "light" ? "text-black hover:bg-gray-200" : "text-white hover:bg-gray-600"}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`block px-4 py-2 text-sm hover:bg-blue-400 ${theme === "light" ? "text-black hover:bg-gray-200" : "text-white hover:bg-gray-600"}`}
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      toast.success("Signed out successfully", {
                        autoClose: 3000,
                        closeOnClick: false
                      });
                      setLoggedin(false);
                      signOut({ callbackUrl: '/' });
                      localStorage.setItem("isFirstVisit", "true");
                    }}
                    className={`block px-4 py-2 text-sm hover:bg-blue-400 ${theme === "light" ? "text-black hover:bg-gray-200" : "text-white hover:bg-gray-600"}`}
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setNavOpen(!isNavOpen)}
            className={`inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 ${theme === "light" ? "text-gray-500 hover:bg-gray-100 focus:ring-gray-200" : "text-gray-400 hover:bg-gray-700 focus:ring-gray-600"}`}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${theme === "light" ? "bg-amber-50" : "bg-neutral-900"} ${isNavOpen ? "block" : "hidden"}`}
        >
          <ul className={`flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg md:space-x-8 md:flex-row md:mt-0 md:border-0 ${theme === "light" ? "bg-amber-50 text-black" : "bg-neutral-900 text-white"}`}>
            <li>
              <Link
                href="#"
                className={`block py-2 px-3 rounded-sm hover:bg-blue-400 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ${theme === "light" ? "text-black hover:bg-gray-200" : "text-white hover:bg-gray-700"}`}
              >
                Profile Tracker
              </Link>
            </li>
            
            <li>
            {isLoggedin ? (
                 <Link
                 href="admin-dashboard"
                 className={`block py-2 px-3 rounded-sm hover:bg-blue-400 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ${theme === "light" ? "text-black hover:bg-gray-200" : "text-white hover:bg-gray-700"}`}
               >
                 Quiz Tracker
               </Link>
              ):
              (
                <Link
                href="signin"
                className={`block py-2 px-3 rounded-sm hover:bg-blue-400 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ${theme === "light" ? "text-black hover:bg-gray-200" : "text-white hover:bg-gray-700"}`}
              >
                Quiz Tracker
              </Link>
              )
              }
              
            </li>
            <li>
              <Link
                href="#"
                className={`block py-2 px-3 rounded-sm hover:bg-blue-400 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ${theme === "light" ? "text-black hover:bg-gray-200" : "text-white hover:bg-gray-700"}`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;