// app/layout.tsx - Server Component
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StructuredData from "@/components/StructuredData";
import ClientLayout from "@/app/client-layout/ClientLayout";
import { SessionProvider } from "next-auth/react";
import { Metadata } from 'next'
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import "./globals.css";
export const metadata: Metadata = {
  title: {
    template: '%s | Trackode',
    default: 'Trackode - Free Mock Tests & AI-powered Quizzes',
  },
  
// Remove the template if it's causing inconsistency
  icons: {
    icon: '/trackode.png',
    shortcut: '/favicon.ico',
  },
  
  keywords: ['Trackode', 'Coding', 'Quizzes', 'Mock Tests', 'AI Challenges', 'Programming', 'Contests', 'Knowledge Tracking', 'Skill Improvement', 'Interactive Learning', 'Coding Skills', 'Developer Tools', 'Tech Challenges', 'Online Learning', 'Coding Platform', 'Software Development', 'Programming Contests', 'AI-Generated Challenges'],
  description: 'Trackode helps developers track their knowledge through interactive quizzes, AI-generated challenges.Improve your programming skills effectively.',
  metadataBase: new URL('https://trackode.in'),
  alternates: {
    canonical: 'https://trackode.in',
  },
  openGraph: {
    title: 'Trackode - Free Mock Tests & AI-powered Quizzes',
    description: 'Track your coding journey with interactive quizzes, AI challenges, and contests.',
    url: 'https://trackode.in/',
    siteName: 'Trackode',
    images: [
      {
        url: 'https://trackode.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Trackode Coding Platform',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      
<title>Trackode - Free Mock Tests & AI-powered Quizzes</title>
<meta name="title" content="Trackode - Free Mock Tests & AI-powered Quizzes" />
<meta name="description" content="Trackode helps developers track their knowledge through interactive quizzes, AI-generated challenges.Improve your programming skills effectively." />


<meta property="og:type" content="website" />
<meta property="og:url" content="https://trackode.in/" />
<meta property="og:title" content="Trackode - Free Mock Tests & AI-powered Quizzes" />
<meta property="og:description" content="Trackode helps developers track their knowledge through interactive quizzes, AI-generated challenges.Improve your programming skills effectively." />
<meta property="og:image" content="https://metatags.io/images/meta-tags.png" />


<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="https://trackode.in/" />
<meta property="twitter:title" content="Trackode - Free Mock Tests & AI-powered Quizzes" />
<meta property="twitter:description" content="Trackode helps developers track their knowledge through interactive quizzes, AI-generated challenges.Improve your programming skills effectively." />
<meta property="twitter:image" content="https://metatags.io/images/meta-tags.png" />

      </head>

      <body className={inter.className}>
        <SessionProvider>
          <ClientLayout>
            <Analytics />
            <SpeedInsights />
            {children}
            <StructuredData />
          </ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}