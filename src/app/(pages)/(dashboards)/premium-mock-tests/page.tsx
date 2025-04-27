import MockTestDashboard from '@/components/PremiumMockTests'
import React from 'react'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Premium Mock Tests',
  keywords: ['Trackode', 'Mock Tests', 'Mock Tests in nextjs', 'Mock Tests','TCS Mocks', 'Free TCS Mock Tests'],
  description: 'Mock Tests | Trackode',
};
export default function page() {
  return (
    <div>
       <MockTestDashboard/>
    </div>
   
  )
}
