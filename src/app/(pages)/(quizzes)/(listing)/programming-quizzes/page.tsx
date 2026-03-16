import React from 'react'
import { Metadata } from 'next'
import ProgrammingLanguageQuizzes from '@/components/ProgrammingLanguageQuizzes';
import { getAppSettings } from "@/lib/settings";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Programming Language Quizzes",
  description:
    "Explore a variety of quizzes and challenges to test your coding skills. Join now and start learning!",
  keywords: ["coding quizzes", "programming challenges", "test your skills", "interactive quizzes"],
  openGraph: {
    title: "Quiz List | Trackode",
    description:
      "Explore a variety of quizzes and challenges to test your coding skills. Join now and start learning!",
    url: "https://trackode.in/programming-quizzes",
    type: "website",
  },
};

export default async function page() {
  const settings = await getAppSettings();
  const session = await auth();
  const isSuperAdmin = session?.user?.isSuperAdmin;

  // 2. Check if Quizzes are enabled
  if (!settings.quizzesEnabled && !isSuperAdmin) {
    return (
      <div className="container mt-20 mx-auto text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Quizzes Disabled</h1>
        <p className="text-gray-600">Quizzes are currently disabled by the administrator.</p>
      </div>
    );
  }

  return (
    <div>
      <ProgrammingLanguageQuizzes/>
    </div>
  )
}
