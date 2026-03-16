import StructuredData from "@/components/StructuredData";
import ClientLayout from "@/app/client-layout/ClientLayout";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";
import { auth } from "@/auth";
import { getAppSettings } from "@/lib/settings";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

import "./globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Trackode",
    default: "Trackode - Free Mock Tests & AI-powered Quizzes",
  },
  icons: {
    icon: "/favicon.ico", // Single favicon reference
    shortcut: "/favicon.ico",
    apple: "/favicon.ico", // Use same favicon for consistency
  },
  manifest: "/manifest.json",
  keywords: [
    "Trackode",
    "Coding",
    "Quizzes",
    "Mock Tests",
    "AI Challenges",
    "Programming",
    "Contests",
    "Knowledge Tracking",
    "Skill Improvement",
    "Interactive Learning",
    "Coding Skills",
    "Developer Tools",
    "Tech Challenges",
    "Online Learning",
    "Coding Platform",
    "Software Development",
    "Programming Contests",
    "AI-Generated Challenges",
  ],
  description:
    "Trackode helps developers track their knowledge through interactive quizzes and AI-generated challenges. Improve your programming skills effectively.",
  metadataBase: new URL("https://trackode.in"),
  alternates: {
    canonical: "https://trackode.in",
  },
  openGraph: {
    title: "Trackode - Free Mock Tests & AI-powered Quizzes",
    description: "Track your coding journey with interactive quizzes, AI challenges, and contests.",
    url: "https://trackode.in/",
    siteName: "Trackode",
    images: [
      {
        url: "https://trackode.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trackode Coding Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trackode - Free Mock Tests & AI-powered Quizzes",
    description:
      "Trackode helps developers track their knowledge through interactive quizzes and AI-generated challenges. Improve your programming skills effectively.",
    images: ["https://trackode.in/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getAppSettings();
  const session = await auth();
  const isSuperAdmin = Boolean(session?.user?.isSuperAdmin);
  const showMaintenance = settings.maintenanceMode && !isSuperAdmin;

  return (
      <html lang="en" className={roboto.className}>
      <body className={inter.className}>
        <SessionProvider>
          <ClientLayout>
            {showMaintenance ? (
              <div className="container mt-20 mx-auto text-center p-8">
                <h1 className="text-3xl font-bold mb-4">Under Maintenance</h1>
                <p className="text-gray-600">The site is currently undergoing scheduled maintenance. Please check back later.</p>
              </div>
            ) : (
              <div className="px-2">{children}</div>
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