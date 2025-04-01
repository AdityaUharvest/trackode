'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from './ThemeContext'; // Import ThemeContext
import Quizes from './Quizes';
import RunningQuizes from './RunningQuizes';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Card } from './ui/card';
import Link from 'next/link';

function ProfileLeftCard() {
  const { data: session } = useSession();
  const { theme } = useTheme(); // Get the current theme
  const [user, setUser] = useState<{ 
    name: string;
    email: string; 
    image: string;
  } | null>(null);

  useEffect(() => {
    if (session) {
      setUser({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        image: session?.user?.image || ''
      });
    }
  }, [session]);

  return (
    <div className="border-b-2 ml-2">
      <div className="flex gap-2 justify-between text-center">
            <h3 className="text-sm overflow-auto">Welcome {user?.name}</h3>
            <img
              className="w-5 h-5 rounded-full object-cover"
              src={user?.image ||"/trackode.png"}
              alt="profile"
              loading="lazy"
            />
          
      </div>
      <p className="text-xs overflow-auto">{user?.email}</p>
      
    </div>
    
  );
}

export default ProfileLeftCard;
