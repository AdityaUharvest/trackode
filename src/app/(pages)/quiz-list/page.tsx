import React from 'react'
import { Metadata } from 'next'
import ProgrammingLanguageQuizzes from '@/components/ProgrammingLanguageQuizzes';
export const metadata: Metadata = {
  title: "Programming Language Quizzes",
  description:
    "Explore a variety of quizzes and challenges to test your coding skills. Join now and start learning!",
  keywords: ["coding quizzes", "programming challenges", "test your skills", "interactive quizzes"],
  openGraph: {
    title: "Quiz List | Trackode",
    description:
      "Explore a variety of quizzes and challenges to test your coding skills. Join now and start learning!",
    url: "https://trackode.in/quiz-list",
    type: "website",
  },
};

export default function page() {
  return (
    <div>
      <ProgrammingLanguageQuizzes/>
    </div>
  )
}
