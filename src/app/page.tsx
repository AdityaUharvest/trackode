
import { Metadata } from 'next'
import HomePage from './HomePage'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Trackode - Master Coding Skills with Interactive Quizzes & Contests',
  description: 'Trackode helps developers track their coding journey through interactive quizzes, AI-generated challenges, and coding contests. Improve your programming skills effectively.',
}
export default function Home() {
  return (
    <>
    <HomePage/>
    <StructuredData/>
    </>
  )
}