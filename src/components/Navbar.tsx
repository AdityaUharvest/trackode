'use client'
import {useEffect, useState} from "react";
import { useSession } from "next-auth/react";
const Navbar: React.FC = () => {
  const {data: session, status} = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNavOpen, setNavOpen] = useState(false);
  const [isLoggedin, setLoggedin]=useState(false);
  const [user, setUser] = useState<{ name: string; email: string; image: string } | null>(null);
  useEffect(() => {
    if(session){
      setLoggedin(true);
      setUser(
        {
          name: session?.user?.name || '',
          email: session?.user?.email||'',
          image: session?.user?.image||''
        }
      );
    }
  },[session]);
  
  
  return (
    <nav className="bg-black border-white-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="trackode.png"
            className="h-8 bg-black rounded-lg fill-blue-900"
            alt="Trackode Logo"
          
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Trackode
          </span>
        </a>
       
        <div className="flex items-center md:order-2 space-x-3 rtl:space-x-reverse">
          {/* Profile button */}
          {isLoggedin ? (
            <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-black"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src={user?.image}
              alt="user photo"
            />
          </button>
          ):
          (
            <a
                href="/signin"
                className="block p-1 bg-blue-900  text-white rounded-lg hover:bg-blue-400 md:hover:bg-blue-400 md:hover:text-white md:p-2 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:mr-2 sm:mr-1"
              >
                Sign in
            </a>
          )}
          
          
          {/* Dropdown menu */}
          
          {isDropdownOpen && (
            <div
              className="z-50 my-4 text-base list-none bg-black divide-y divide-black rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute right-4 top-12 test-white"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-white dark:text-white">
                 {user?.name}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {user?.email}
                </span>
              </div>
              <ul className="py-2 ">
                <li>
                  <a
                    href="/admin-dashboard"
                    className="block px-4 py-2 text-sm text-white hover:bg-blue-400 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-white hover:bg-blue-400 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-white hover:bg-blue-400 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </a>
                </li>
                
                
              </ul>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setNavOpen(!isNavOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 bg-black ${
            isNavOpen ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-black rounded-lg bg-black md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-black dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded-sm hover:bg-blue-400 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-400"
              >
                Profile Tracker
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded-sm hover:bg-blue-400 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Question Tracker
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded-sm hover:bg-blue-400 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Quiz Tracker
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded-sm hover:bg-blue-400 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
