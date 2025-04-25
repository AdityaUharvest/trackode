import SignUp from '@/components/SignuoPage'
import React from 'react'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Sign Up',
  keywords: ['Trackode', 'create ai quiz', 'ai quiz online', 'Admin Dashboard'],
  description: 'Sign Up | Trackode',
};

function page() {
  return (
    <div>
      <SignUp/>
    </div>
  )
}

export default page