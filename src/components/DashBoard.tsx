'use client';
import { useTheme } from '@/components/ThemeContext'; // Import ThemeContext
import Quizes from './Quizes';
import Contests from './Contests';
import ProfileLeftCard from './ProfileLeftCard';

export default function DashBoard() {
  const { theme, toggleTheme } = useTheme(); // Get theme and toggle function

  return (
    <div className={`flex mt-0 shadow-inner  flex-col lg:flex-row min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-50' : 'bg-gray-50 text-gray-900'}`}>
      {/* Profile Section */}
      <ProfileLeftCard />
      
      {/* Dashboard Section */}
      <div className={`lg:w-3/4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} sm:mt-5 mr-3 mb-4 rounded-xl p-2 flex flex-col`}>
        <div className="flex justify-between items-center">
          <h1 className="lg:text-xl sm:text-base ml-3 mt-1 font-bold text-center lg:text-left">Dashboard</h1>
          
        </div>
        <div className=' mt-1 p-1'>
          <Quizes />
          {/* <Contests /> */}
        </div>
      </div>
    </div>
  );
}
