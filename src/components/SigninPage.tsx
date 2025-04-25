"use client";
import SignInButton from "./Signin";
import Link from "next/link";
import { use, useState,useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTheme } from "./ThemeContext";
import { useSession } from "next-auth/react";
export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const {status} = useSession()
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  })


  
  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all the fields", {
        autoClose: 3000,
        closeOnClick: true,
      });
      return;
    }

    setIsLoading(true);
    toast.info("Signing you in");

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (response?.error) {
        toast.error("Password or email is incorrect");
      }
      if (response?.ok && !response?.error) {
        setTimeout(() => {
          router.push(response.url || "/");
        }, 1500);
      }
    } catch (error) {
      toast.error("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
     
    <main>
    <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`w-full max-w-md mt-2 mb-2 p-8 space-y-8 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
        <div className="text-center">
          <h1 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Welcome back
          </h1>
          <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Sign in to your account to continue
          </p>
        </div>

        <div className="mt-8 space-y-6">
        <div className="flex flex-col items-center">
            <SignInButton />
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}>
                Or continue with
              </span>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={submitHandler}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`mt-1 block w-full px-3 py-2 rounded-md border ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} placeholder-${theme === "dark" ? "gray-400" : "gray-500"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`mt-1 block w-full px-3 py-2 rounded-md border ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} placeholder-${theme === "dark" ? "gray-400" : "gray-500"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={`h-4 w-4 rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} focus:ring-blue-500`}
                />
                <label htmlFor="remember-me" className={`ml-2 block text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className={`font-medium ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}>
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className={`text-sm text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Don't have an account?{" "}
            <Link href="/signup" className={`font-medium ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}>
              Sign up
            </Link>
          </div>

          <div className={`text-xs text-center ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            By continuing, you agree to our{" "}
            <Link href="/terms" className={`hover:underline ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className={`hover:underline ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
              Privacy Policy
            </Link>.
          </div>
        </div>
      </div>
    </div></main></>
  );
}