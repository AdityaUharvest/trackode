import TermsOfService from '@/components/Terms'
import React from 'react'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Terms of Service',
  keywords: ['Trackode', 'create ai quiz', 'ai quiz online', 'Admin Dashboard'],
  description: 'Terms of Service | Trackode',
};

export default function page() {
  return (
    <div>
      <TermsOfService/>
    </div>
  )
}
