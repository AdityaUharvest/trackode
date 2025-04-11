"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Profile from '@/components/Profile'

type User = {
  name: string;
  email: string;
  photo: string;
  dob: string;
  github: string;
  linkedin: string;
  codingProfiles: string;
  public: boolean;
};

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const { data: session, status } = useSession()
  
  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name || '',
        email: session.user.email || '',  
        photo: session.user.image || '', 

        dob: '',
        github: '',
        linkedin: '',
        codingProfiles: '',
        public: false,
      })
    }
  }, [session])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>No user data</div>
  }

  return <Profile user={user} />
}
