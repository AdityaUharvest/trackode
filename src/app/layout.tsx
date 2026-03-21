import StructuredData from "@/components/StructuredData";
import ClientLayout from "@/app/client-layout/ClientLayout";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";
import { auth } from "@/auth";
import { getAppSettings } from "@/lib/settings";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

import "./globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trackode.in"),
  title: {
    template: "%s | Trackode",
    default: "Trackode - Best Platform for Free Mock Tests & AI-powered Coding Quizzes",
  },
  description:
    "Trackode provides high-quality, AI-powered coding quizzes and realistic mock tests for placement preparation. Track your coding progress, join contests, and master new programming languages with our data-driven learning platform.",
  applicationName: "Trackode",
  authors: [{ name: "Trackode Team" }],
  generator: "Next.js",
  keywords: [
    "Trackode", "Coding Quizzes", "Mock Tests", "Programming Challenges", "Placement Prep",
    "AI Quizzes", "Technical Interviews", "Coding Assessment", "Skill Tracking",
    "JavaScript Quizzes", "Python Challenges", "Data Structures", "Algorithms Test",
    "Competitive Coding", "Developer Assessment", "Free Coding Platform"
  ],
  referrer: "origin-when-cross-origin",
  creator: "Trackode",
  publisher: "Trackode",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: "Trackode - Ace Your Tech Interviews with AI-powered Quizzes",
    description: "Prepare for top tech companies with Trackode's curated mock tests and interactive programming challenges. Track your progress in real-time.",
    url: "https://trackode.in/",
    siteName: "Trackode",
    images: [
      {
        url: "https://trackode.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trackode - The Ultimate Coding Prep Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trackode - Prepare for Coding Interviews Online",
    description: "Master coding with AI-generated tests and comprehensive skill tracking. Join thousands of developers on Trackode.",
    site: "@trackode",
    creator: "@trackode",
    images: ["https://trackode.in/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'education',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getAppSettings();
  const session = await auth();
  const isSuperAdmin = Boolean(session?.user?.isSuperAdmin);
  const showMaintenance = settings.maintenanceMode && !isSuperAdmin;

  return (
    <html lang="en" className={roboto.className}>
      <body className={inter.className}>
        <Toaster position="top-center" richColors />
        <SessionProvider>
          <ClientLayout>
            {showMaintenance ? (
              <div className="container mt-20 mx-auto text-center p-8">
                <h1 className="text-3xl font-bold mb-4">Under Maintenance</h1>
                <p className="text-gray-600">The site is currently undergoing scheduled maintenance. Please check back later.</p>
              </div>
            ) : (
              <div>{children}</div>
            )}
            <StructuredData />
            <Analytics />
            <SpeedInsights />
          </ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}