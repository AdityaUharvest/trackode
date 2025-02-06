'use client';
import { useTheme } from '@/components/ThemeContext'; // Import ThemeContext
import Quizes from './Quizes';
import Contests from './Contests';
import ProfileLeftCard from './ProfileLeftCard';

export default function ProfileCard() {
  const { theme, toggleTheme } = useTheme(); // Get theme and toggle function

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen ${theme === 'dark' ? 'bg-neutral-900 text-gray-50' : 'bg-amber-50 text-gray-900'}`}>
      {/* Profile Section */}
      <ProfileLeftCard />
      
      {/* Dashboard Section */}
      <div className={`lg:w-2/3 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-white'} mt-5 mr-3 mb-4 rounded-xl p-2 flex flex-col`}>
        <div className="flex justify-between items-center">
          <h1 className="text-xl ml-3 mt-1 font-bold text-center lg:text-left">Dashboard</h1>
          
        </div>
        <div className=' mt-1 p-1'>
          <Quizes />
          {/* <Contests /> */}
        </div>
      </div>
    </div>
  );
}
