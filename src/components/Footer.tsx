"use client";
import { useTheme } from "./ThemeContext";
import Link from "next/link";

export default function Footer() {
  const { theme } = useTheme();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`pt-5 ${
      theme === "dark" 
        ? "bg-gradient-to-b from-gray-900 to-black text-gray-200" 
        : "bg-gradient-to-b from-gray-50 to-gray-100 text-gray-700"
    }`}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-6">
        <div className="grid  md:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* Company Info Column */}
          <div className="flex flex-col">
            <div className=" flex flex-col items-center md:items-start">
              <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            {theme === "light" ? (
              <img
              
                
                src="/logo.png"
                className="h-14 rounded-full"
              
                
                alt="Trackode Logo"
              />
            ) : ( 
              <>
              <img className="h-14  rounded-full"
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
              
             
            </div>
            <div className="mt-2 flex space-x-4 justify-center md:justify-start">
              <a 
                href="https://github.com/iamadityaupadhyay" 
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors duration-300 ${
                  theme === "dark" 
                    ? "bg-gray-800 hover:bg-gray-700" 
                    : "bg-white hover:bg-gray-200"
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z" />
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/iamadityaupadhyay/" 
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors duration-300 ${
                  theme === "dark" 
                    ? "bg-gray-800 hover:bg-gray-700" 
                    : "bg-white hover:bg-gray-200"
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
                </svg>
              </a>
              <a 
                href="https://twitter.com/iam_adiupadhyay"
                target="_blank" 
                className={`p-2 rounded-full transition-colors duration-300 ${
                  theme === "dark" 
                    ? "bg-gray-800 hover:bg-gray-700" 
                    : "bg-white hover:bg-gray-200"
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/iam_adityaupadhyay"
                target="_blank" 
                className={`p-2 rounded-full transition-colors duration-300 ${
                  theme === "dark" 
                    ? "bg-gray-800 hover:bg-gray-700" 
                    : "bg-white hover:bg-gray-200"
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                </svg>
              </a>
            </div>
            <div className="mt-6 flex justify-center md:justify-start">
              <a 
                href="https://buymeacoffee.com/iamadityaupadhyay" 
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  theme === "dark" 
                    ? "bg-[#FFDD00] text-black hover:bg-[#FFE345]" 
                    : "bg-[#FFDD00] text-black hover:bg-[#FFE345]"
                }`}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20,3H4A1,1 0 0,0 3,4V10A1,1 0 0,0 4,11H20A1,1 0 0,0 21,10V4A1,1 0 0,0 20,3M20,13H4A1,1 0 0,0 3,14V20A1,1 0 0,0 4,21H20A1,1 0 0,0 21,20V14A1,1 0 0,0 20,13M8,18H6V16H8V18M11.5,18H9.5V16H11.5V18M15,18H13V16H15V18Z" />
                </svg>
                Buy me a coffee
              </a>
            </div>
          </div>
          
          {/* Quick Links Column */}
          <div>
            <h3 className={`text-lg font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}>Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-sm hover:underline transition-all flex items-center"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-sm hover:underline transition-all flex items-center"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin-dashboard" 
                  className="text-sm hover:underline transition-all flex items-center"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/programming-quizzes" 
                  className="text-sm hover:underline transition-all flex items-center"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/premium-mock-tests" 
                  className="text-sm hover:underline transition-all flex items-center"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                  TCS Mock Tests
                </Link>
              </li>
              {/* <li>
                <Link 
                  href="/pricing" 
                  className="text-sm hover:underline transition-all flex items-center"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                  Pricing
                </Link>
              </li> */}
            </ul>
          </div>
          
          {/* Resources Column */}
          <div>
            <h3 className={`text-lg font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}>Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="https://www.devblogger.in" 
                  className="text-sm hover:underline transition-all flex items-center"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="https://www.youtube.com/@iamadityaupadhyay" 
                  className="text-sm hover:underline transition-all flex items-center"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                  Tutorials
                </Link>
              </li>
              <li>
                <Link 
                  href="/programming-quizzes" 
                  className="text-sm hover:underline transition-all flex items-center"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                  Live Quizzes
                </Link>
              </li>
              <li>
                <Link 
                  href="/#faq" 
                  className="text-sm hover:underline transition-all flex items-center"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                  FAQ
                </Link>
              </li>
              {/* <li>
                <Link 
                  href="/forum" 
                  className="text-sm hover:underline transition-all flex items-center"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                  Community Forum
                </Link>
              </li> */}
              
            </ul>
          </div>
          
          {/* Newsletter Column */}
         
        </div>
        
        {/* Secondary Footer */}
        <div className={`mt-5 pt-2 border-t ${
          theme === "dark" ? "border-gray-800" : "border-gray-200"
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-2 md:mb-0">
              <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                <li>
                  <Link href="/terms" className="text-xs hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-xs hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                {/* <li>
                  <Link href="/cookies" className="text-xs hover:underline">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/license" className="text-xs hover:underline">
                    License
                  </Link>
                </li> */}
                {/* <li>
                  <Link href="/sitemap" className="text-xs hover:underline">
                    Sitemap
                  </Link>
                </li> */}
                <li>
                  <Link href="/contact" className="text-xs hover:underline">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <div className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                <p className="text-center md:text-right">
                  &copy; {currentYear} Trackode. All rights reserved.
                </p>
                <p className="mt-1 text-center md:text-right">
                  Designed with <span className="text-red-500">❤</span> by Aditya Upadhyay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className={`mt-4 py-4 ${
        theme === "dark" ? "bg-black" : "bg-gray-100"
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs opacity-75 mb-2 md:mb-0">
              Using this site means you consent to our use of cookies.
            </p>
            
          </div>
        </div>
      </div>
    </footer>
  );
}