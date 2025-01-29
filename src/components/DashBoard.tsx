'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Quizes from './Quizes';
import Contests from './Contests';
import ProfileLeftCard from './ProfileLeftCard';

export default function ProfileCard() {
  
  return (
    
    <div className="flex flex-col  bg-neutral-900  lg:flex-row ">
      {/* Profile Section */}
      <ProfileLeftCard />
      {/* Dashboard Section */}
      <div className="lg:w-2/3 bg-neutral-800 mt-5 mr-3 mb-4 rounded-xl p-4 flex flex-col">
        <h1 className="text-2xl text-gray-50 font-bold text-center lg:text-left">
          Dashboard
        </h1>
        <div className='mb-10 mt-2 p-2'>
        <Quizes />
        <Contests />
        </div>
      </div>
    
    </div>
    
    
 
  );
}
