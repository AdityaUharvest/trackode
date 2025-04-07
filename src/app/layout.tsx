// app/layout.tsx - Server Component
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StructuredData from "@/components/StructuredData";
import ClientLayout from "@/app/client-layout/ClientLayout";
import { SessionProvider } from "next-auth/react";
import { Metadata } from 'next'

import "./globals.css";
export const metadata: Metadata = {
  title: {
    template: '%s | Trackode',
    default: 'Trackode',
  },
  description: 'Trackode helps developers track their coding journey through interactive quizzes, AI-generated challenges, and coding contests. Improve your programming skills effectively.',
  metadataBase: new URL('https://trackode.in'),
  alternates: {
    canonical: 'https://trackode.in',
  },
  openGraph: {
    title: 'Trackode - Master Coding Skills with Interactive Quizzes & Contests',
    description: 'Track your coding journey with interactive quizzes, AI challenges, and contests.',
    url: 'https://trackode.in/',
    siteName: 'Trackode',
    images: [
      {
        url: 'https://trackode.in/trackode.png',
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
        <title>Trackode - Enhance Your Coding Skills</title>
        <meta name="description" content="Trackode is a one-stop platform for coding, quizzes, and contest preparation." />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body>
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