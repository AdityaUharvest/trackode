"use client";
import SignInButton from "@/components/Signin";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTheme } from "@/components/ThemeContext"; // Adjust the import path as necessary


export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useTheme(); // Get the current theme

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all the fields", {
        autoClose: 3000,
        closeOnClick: true,
      });
      return;
    }
    toast.info("Signing you in");

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (response?.ok && response?.error) {
        toast.error("Password or email is incorrect");
      }
      if (response?.ok && response?.url) {
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(response?.error || "Sign in failed. Please try again.");
      }
    } catch (error) {
      toast.error("Sign in failed. Please try again.");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } flex justify-center`}
    >
      <div
        className={`max-w-screen-xl sm:m-5 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } sm:rounded-lg flex justify-center flex-1`}
      >
        <div
          className={`lg:w-1/2 xl:w-5/12 mt-2 mb-4 shadow-blue-900 shadow-inner ${
            theme === "dark" ? "bg-gray-900" : "bg-gray-50"
          } rounded-lg p-6 sm:p-6`}
        >
          <div className="flex flex-col items-center">
            <h1
              className={`text-2xl xl:text-3xl font-extrabold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Get Started
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col mb-8 items-center">
                <SignInButton />
                {/* <a
                  href="#"
                  className={`shadow-blue-900 w-full max-w-xs font-bold shadow-sm rounded-lg py-3 hover:bg-blue-700 ${
                    theme === "dark" ? "bg-gray-900" : "bg-gray-50"
                  } ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  } flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5`}
                >
                  <div className="p-1 rounded-full">
                    <svg className="w-6" viewBox="0 0 32 32">
                      <path
                        fillRule="evenodd"
                        d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z"
                      />
                    </svg>
                  </div>
                  <span className="ml-4">Sign In with GitHub</span>
                </a> */}
              </div>

              <div className="mx-auto max-w-xs">
                <form method="post" onSubmit={submitHandler}>
                  <input
                    className={`w-full px-8 py-4 rounded-lg font-medium ${
                      theme === "dark" ? "bg-gray-900" : "bg-gray-50"
                    } border ${
                      theme === "dark" ? "border-gray-600" : "border-gray-400"
                    } ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    } placeholder-${
                      theme === "dark" ? "gray-400" : "gray-600"
                    } text-sm focus:outline-none focus:border-gray-400 ${
                      theme === "dark" ? "focus:bg-gray-950" : "focus:bg-amber-100"
                    }`}
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <input
                    className={`w-full px-8 py-4 rounded-lg font-medium ${
                      theme === "dark" ? "bg-gray-900" : "bg-gray-50"
                    } border ${
                      theme === "dark" ? "border-gray-600" : "border-gray-400"
                    } ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    } placeholder-${
                      theme === "dark" ? "gray-400" : "gray-600"
                    } text-sm focus:outline-none focus:border-gray-400 ${
                      theme === "dark" ? "focus:bg-gray-950" : "focus:bg-amber-100"
                    } mt-5`}
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">Let me in!</span>
                  </button>
                </form>
                <Link
                  href="/signup"
                  className={`ml-16 mt-5 text-xs ${
                    theme === "dark" ?  "text-gray-400" : "text-gray-600"
                  } text-center`}
                >
                  Don't have an account?  <span className=" text-blue-700"> Register</span> 
                </Link>
                <p
                  className={`mt-6 text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } text-center`}
                >
                  I agree to abide by trackode's
                  <a href="#" className="border-b border-gray-500 border-dotted">
                    Terms of Service
                  </a>
                  and its
                  <a href="#" className="border-b border-gray-500 border-dotted">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex-1 ${
            theme === "dark" ? "bg-gray-900" : "bg-gray-50"
          } text-center hidden lg:flex`}
        >
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat bg-designer-life"></div>
        </div>
      </div>
    </div>
  );
}