
import { Metadata } from 'next'
import HomePage from './HomePage'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Trackode - Free Mocks Test and Interactive Quizzes',
  description: 'Trackode helps developers track their knowledge through interactive quizzes, AI-generated challenges.Improve your programming skills effectively.',
}
export default function Home() {
  return (
    <>
    <HomePage/>
    <StructuredData/>
    </>
  )
}