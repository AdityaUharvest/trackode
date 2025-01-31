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
      <div className={`lg:w-2/3 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-white'} mt-5 mr-3 mb-4 rounded-xl p-4 flex flex-col`}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-center lg:text-left">Dashboard</h1>
          <button 
            onClick={toggleTheme} 
            className="px-4 py-2 rounded-lg border border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <div className='mb-10 mt-2 p-2'>
          <Quizes />
          {/* <Contests /> */}
        </div>
      </div>
    </div>
  );
}
