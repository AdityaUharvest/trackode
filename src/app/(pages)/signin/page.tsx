import Signin from '@/components/SigninPage'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  keywords: ['Trackode', 'Mock Tests', 'Mock Tests in nextjs', 'Mock Tests','TCS Mocks', 'Free TCS Mock Tests'],
  description: 'Sign In | Trackode',
};

function page() {
  return (
    <div>
      <Signin/>
    </div>
  )
}

export default page