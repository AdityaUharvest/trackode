"use client";
import { useTheme } from "@/components/ThemeContext";
import Head from "next/head";

export default function PrivacyPolicy() {
  const { theme } = useTheme();

  return (
    <>
      <Head>
        <title>Trackode - Privacy Policy</title>
        <meta name="description" content="Privacy Policy for Trackode" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`max-w-4xl mx-auto p-8 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <div className="text-center mb-10">
          <h1 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Privacy Policy
          </h1>
          <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className={`prose ${theme === "dark" ? "prose-invert" : ""} max-w-none`}>
          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              1. Information We Collect
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <h3 className={`mt-4 font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
              Personal Data
            </h3>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              While using our Service, we may ask you to provide certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include:
            </p>
            <ul className={`list-disc pl-5 mt-2 space-y-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Cookies and Usage Data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              2. Use of Data
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Trackode uses the collected data for various purposes:
            </p>
            <ul className={`list-disc pl-5 mt-2 space-y-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              3. Data Security
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              4. Cookies
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              We use cookies and similar tracking technologies to track activity on our Service and hold certain information.
            </p>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              5. Service Providers
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
            </p>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              6. Links to Other Sites
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              7. Children's Privacy
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              8. Changes to This Privacy Policy
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              9. Contact Us
            </h2>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              If you have any questions about this Privacy Policy, please contact us at privacy@trackode.com.
            </p>
          </section>
        </div>
      </div>
    </div></main>
    </>
  );
}