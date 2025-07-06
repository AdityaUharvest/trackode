"use client";
import SignInButton from "./Signin";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';;
import { useRouter } from "next/navigation";
import { useTheme } from "./ThemeContext";
import { FiUser, FiMail, FiLock, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import Head from "next/head";

interface ThemeContextType {
  theme: string;
}

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const { theme } = useTheme() as ThemeContextType;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(120); // 2 minutes in seconds
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendOtp = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await axios.post("api/otp/send-otp", { email });

      if (response.data.success) {
        setOtpSent(true);
        startCountdown();
        toast.success("OTP sent successfully! Check your email.");
      } else if (response.data.message === "User already exists") {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Email already exists or an error occurred while sending OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await axios.post("api/otp/verify-otp", { email, otp });

      if (response.data.success) {
        setOtpVerified(true);
        toast.success("Email verified!");
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("An error occurred while verifying OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !name) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!otpVerified) {
      toast.error("Please verify your email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("api/user/signup", { email, password, name });

      if (response.data.success) {
        toast.success(response.data.message || "Registration successful!");
        setTimeout(() => router.push("/signin"), 1500);
      } else if (response.data.message === "User is already registered") {
        toast.error(response.data.message || "User already exists");
        router.push("/signin");

      }
      else if (response.data.message === "OTP already sent ! Failed to send OTP") {
        toast.error("OTP already sent! Please check your email.");
      }
      else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Sign up for Trackode" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
          <div className={`w-full max-w-md mt-2 mb-2 p-8 space-y-8 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
            <div className="text-center">
              <h1 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Create your account
              </h1>
              <p className={`mt-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Join Trackode to get started
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex justify-center">
                <SignInButton />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}>
                    Or sign up with email
                  </span>
                </div>
              </div>

              <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                <div className="rounded-md shadow-sm space-y-4">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Full Name
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className={`block w-full pl-10 pr-3 py-2 rounded-md border text-sm ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Email address
                    </label>
                    <div className="flex space-x-2">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className={`block w-full pl-10 pr-3 py-2 rounded-md border text-sm ${theme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${otpVerified ? "border-green-500" : ""
                            }`}
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={otpVerified}
                        />
                        {otpVerified && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <FiCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      {!otpVerified && (
                        <button
                          type="button"
                          onClick={sendOtp}
                          disabled={otpLoading || !email || !/^\S+@\S+\.\S+$/.test(email) || countdown > 0}
                          className={`py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${otpLoading || countdown > 0 ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                        >
                          {otpLoading ? "Sending..." :
                            countdown > 0 ? `⌛${formatTime(countdown)}` :
                              otpSent ? "Resend" : "Verify"}
                        </button>
                      )}
                    </div>

                    {otpSent && !otpVerified && (
                      <div className="mt-2">
                        <label htmlFor="otp" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          Enter 6-digit OTP
                        </label>
                        <div className="flex space-x-2 mt-1">
                          <input
                            id="otp"
                            name="otp"
                            type="text"
                            maxLength={6}
                            className={`block flex-grow pl-3 pr-3 py-2 rounded-md border text-sm ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                          />
                          <button
                            type="button"
                            onClick={verifyOtp}
                            disabled={otpLoading || otp.length !== 6}
                            className={`py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${otpLoading ? "opacity-75 cursor-not-allowed" : ""
                              }`}
                          >
                            {otpLoading ? "Verifying..." : "Verify"}
                          </button>
                        </div>
                        <p className={`mt-1 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          Please enter the 6-digit code sent to your email
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Password
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className={`block w-full pl-10 pr-10 py-2 rounded-md border text-sm ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FiEyeOff className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                        ) : (
                          <FiEye className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                        )}
                      </button>
                    </div>
                    {password && password.length < 8 && (
                      <p className="mt-1 text-sm text-red-600">Password must be at least 8 characters</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className={`h-4 w-4 rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                      } focus:ring-indigo-500`}
                  />
                  <label htmlFor="terms" className={`ml-2 block text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className={`${theme === "dark" ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"}`}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className={`${theme === "dark" ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"}`}
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !otpVerified}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading || !otpVerified ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      "Sign up"
                    )}
                  </button>
                </div>
              </form>

              <div className={`text-sm text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className={`font-medium ${theme === "dark" ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"}`}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}