import StudentDashboard from '@/components/StudentDashboard'
import React from 'react'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Student Dashboard',
  keywords: ['Trackode', 'Mock Tests', 'Mock Tests in nextjs', 'Mock Tests','TCS Mocks', 'Free TCS Mock Tests'],
  description: 'Student Dashboard | Trackode',
};
export default function page() {
  return (
    <div>
      <StudentDashboard/>
    </div>
  )
}
