import ContactForm from '@/components/ContactUs'
import React from 'react'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Contact Us',
  keywords: ['Trackode', 'create ai quiz', 'ai quiz online', 'Admin Dashboard'],
  
description: 'Contact Us | Trackode',
};
export default function 
() {
  return (
    <ContactForm/>
  )
}
