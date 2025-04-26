"use client";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';;
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeContext";
import { FiMail, FiLock, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import Head from "next/head";

interface ThemeContextType {
  theme: string;
}

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
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
      const response = await axios.post("/api/otp/send-otp", { email, purpose: "password_reset" });

      if (response.data.success) {
        setOtpSent(true);
        startCountdown();
        toast.success("OTP sent successfully! Check your email.");
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An error occurred while sending OTP");
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
      const response = await axios.post("/api/otp/verify-otp", {
        email,
        otp,
        purpose: "password_reset"
      });

      if (response.data.success) {
        setOtpVerified(true);
        toast.success("OTP verified successfully!");
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("An error occurred while verifying OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword
      });

      if (response.data.success) {
        toast.success("Password reset successfully!");
        router.push("/signin");
      } else {
        toast.error(response.data.message || "Password reset failed");
      }
    } catch (error) {
      toast.error("An error occurred while resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password</title>
        <meta name="description" content="Reset your password" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={`min-h-screen flex items-center justify-evenly ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
          <div className={`w-full max-w-md mt-2 mb-2 p-8 space-y-8 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
            <div className="text-center">
              <h1 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Reset your password
              </h1>
              <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Enter your email to receive a reset OTP
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={resetPassword}>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Email address
                  </label>
                  <div className="flex space-x-2 mt-1">
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
                        className={`block w-full pl-10 pr-3 py-2 rounded-md border text-sm ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={otpVerified}
                      />
                    </div>
                    {!otpVerified && (
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={otpLoading || !email || !/^\S+@\S+\.\S+$/.test(email) || countdown > 0}
                        className={`p-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          otpLoading || countdown > 0 ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                      >
                        {otpLoading ? "Sending..." : 
                         countdown > 0 ? `Resend in ${formatTime(countdown)}` : 
                         otpSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    )}
                  </div>
                </div>

                {otpSent && !otpVerified && (
                  <div>
                    <label htmlFor="otp" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Enter 6-digit OTP
                    </label>
                    <div className="flex space-x-2 mt-1">
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        maxLength={6}
                        className={`block flex-grow pl-3 pr-3 py-2 rounded-md border text-sm ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      />
                      <button
                        type="button"
                        onClick={verifyOtp}
                        disabled={otpLoading || otp.length !== 6}
                        className={`py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                          otpLoading ? "opacity-75 cursor-not-allowed" : ""
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

                {otpVerified && (
                  <>
                    <div>
                      <label htmlFor="newPassword" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        New Password
                      </label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                        </div>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          className={`block w-full pl-10 pr-10 py-2 rounded-md border text-sm ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
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
                      {newPassword && newPassword.length < 8 && (
                        <p className="mt-1 text-sm text-red-600">Password must be at least 8 characters</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Confirm Password
                      </label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          className={`block w-full pl-10 pr-10 py-2 rounded-md border text-sm ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                          ) : (
                            <FiEye className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                          )}
                        </button>
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">Passwords don't match</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !otpVerified}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading || !otpVerified ? "opacity-75 cursor-not-allowed" : ""
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
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>

            <div className={`text-sm text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Remember your password?{" "}
              <Link
                href="/signin"
                className={`font-medium ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}