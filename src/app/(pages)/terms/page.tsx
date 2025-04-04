"use client";
import { useTheme } from "@/components/ThemeContext";
import Head from 'next/head'
export default function TermsOfService() {
  const { theme } = useTheme();

  return (
    <>
      <Head>
        <title>Trackode - Terms of Service</title>
        <meta name="description" content="Terms of Service for Trackode" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`max-w-4xl mx-auto p-8 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <div className="text-center mb-10">
          <h1 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Terms of Service
          </h1>
          <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className={`prose ${theme === "dark" ? "prose-invert" : ""} max-w-none`}>
          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              1. Acceptance of Terms
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              By accessing or using Trackode ("the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to all the terms, you may not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              2. Description of Service
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Trackode provides a platform for [describe your service functionality]. 
              The Service may change from time to time without prior notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              3. User Responsibilities
            </h2>
            <ul className={`list-disc pl-5 mt-2 space-y-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree not to use the Service for any illegal purpose</li>
              <li>You must not interfere with or disrupt the Service</li>
              <li>You are responsible for all content posted under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              4. Intellectual Property
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              The Service and its original content, features, and functionality are owned by Trackode and are protected 
              by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              5. Termination
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              We may terminate or suspend your account immediately, without prior notice, for any reason whatsoever, 
              including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              6. Limitation of Liability
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              In no event shall Trackode be liable for any indirect, incidental, special, consequential or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              7. Changes to Terms
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              We reserve the right to modify these terms at any time. We will provide notice of any changes by posting 
              the new Terms on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              8. Contact Us
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              If you have any questions about these Terms, please contact us at legal@trackode.com.
            </p>
          </section>
        </div>
      </div>
    </div>
    </main>
    </>
  );
}