import StructuredData from "@/components/StructuredData";
import ClientLayout from "@/app/client-layout/ClientLayout";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import "./globals.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = "dark"; // Replace with your theme logic or context
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <ClientLayout>
            
            <div style={{
            backgroundImage: theme === "dark"
              ? "url('/image.png')"
              : "url('/your-light-bg-image.jpg')",
            
            
          }} >
{children}
            </div>
            
            <StructuredData />
          </ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}