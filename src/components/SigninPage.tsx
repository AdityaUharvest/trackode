"use client";
import SignInButton from "./Signin";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTheme } from "./ThemeContext";
import { useSession } from "next-auth/react";

export default function Signin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const { theme } = useTheme();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    } else if (status === "loading") {
      console.log("Session status is loading...");
    }
  }, [status, router]);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Signing you in");

    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (response?.error) {
        toast.error("Password or email is incorrect");
        toast.dismiss(loadingToast);
        setIsLoading(false);
        return;
      }

      if (response?.ok) {
       
        toast.dismiss(loadingToast);
        setTimeout(() => {
          router.push(response.url || callbackUrl);
        }, 1500);
      }
    } catch (error) {
      toast.error("Sign in failed. Please try again.");
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Toaster />
      <main>
        <div className={`min-h-screen flex items-center justify-center `}>
          <div className={`w-full max-w-md mt-2 mb-2 p-8 space-y-8 rounded-xl ${theme === "dark" ? "bg-gray-700/50" : "bg-white"} shadow-lg`}>
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
                      className={`mt-1 block w-full px-3 py-2 rounded-md border ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} placeholder-${theme === "dark" ? "gray-400" : "gray-500"} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className={`mt-1 block w-full px-3 py-2 rounded-md border ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} placeholder-${theme === "dark" ? "gray-400" : "gray-500"} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className={`absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"} hover:text-gray-600`}
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className={`h-4 w-4 rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} focus:ring-indigo-500`}
                    />
                    <label htmlFor="remember-me" className={`ml-2 block text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/forgot-password" className={`font-medium ${theme === "dark" ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"}`}>
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
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
                <Link href="/signup" className={`font-medium ${theme === "dark" ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"}`}>
                  Sign up
                </Link>
              </div>

              <div className={`text-xs text-center ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                By continuing, you agree to our{" "}
                <Link href="/terms" className={`hover:underline ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className={`hover:underline ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
                  Privacy Policy
                </Link>.
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}