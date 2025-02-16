'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/components/ThemeContext'; // Import ThemeContext
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
    <div className={`w-full lg:mb-64 lg:w-1/3 gap-4  ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col items-center p-2`}>
      <div className="max-w-xs mt-3 w-full">
        <div className={`shadow-xl rounded-lg py-6 px-5 ${theme === 'dark' ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'}`}>
          <div className="photo-wrapper p-2">
            <img
              className="w-24 h-24 rounded-full mx-auto"
              src={user?.image}
              alt="user profile"
              loading="lazy"
            />
          </div>
          <div className="p-2 text-center">
            <h3 className="text-base font-bold">{user?.name}</h3>
            <p className="text-sm ">{user?.email}</p>
          </div>
          <table className="text-xs my-">
            <tbody>
              {/* <tr>
                <td className="px-2 py-2 font-semibold">Linkedin</td>
                <td className="px-2 py-2">---</td>
              </tr> */}
              {/* <tr>
                <td className="px-2 py-2 font-semibold">Github</td>
                <td className="px-2 py-2">---</td>
              </tr>
                <td className="px-2 py-2">---</td>
              </tr>
              <tr>
                <td className="px-2 py-2 font-semibold">Leetcode</td>
                <td className="px-2 py-2">---</td>
              </tr> */}
              {/* <tr>
                <td className="px-2 py-2 font-semibold">Email</td>
                <td className="px-2 py-2">{user?.email}</td>
              </tr> */}
            </tbody>
          </table>
          {/* <div className="text-center my-3">
            <a
              className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
              href="#"
            >
              Edit Functionality will be added soon
            </a>
          </div> */}
        </div>
      </div>
      <Card className='h-40 w-full bg- rounded-lg shadow-xl  flex items-center justify-center'>
        <Button className='text-white bg-blue-700 hover:bg-blue-800'>
          <Link 
          href="/quiz-setup">
           Add Quiz
           </Link>
        <Plus size={16} />
          
        </Button>
      </Card>
      <RunningQuizes/>
      
    </div>
  );
}

export default ProfileLeftCard;
