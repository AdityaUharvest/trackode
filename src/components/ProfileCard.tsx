'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Quizes from './Quizes';
import Contests from './Contests';

export default function ProfileCard() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<{ name: string; email: string; image: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  useEffect(() => {
    if (session) {
      setUser({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        image: session?.user?.image || '',
      });
    }
  }, [session]);

  return (
    
    <div className="flex flex-col  bg-neutral-900  lg:flex-row ">
      {/* Profile Section */}
      <div className="w-full lg:mb-32 lg:w-1/3 bg-neutral-900 flex flex-col items-center  p-2">
        <div className="max-w-xs  mt-3 w-full">
          <div className="text-white bg-neutral-800 shadow-xl rounded-lg py-6 px-16">
            <div className="photo-wrapper p-2">
              <img
                className="w-24 h-24 rounded-full mx-auto"
                src={user?.image}
                alt="user profile"
              />
            </div>
            <div className="p-2 text-center">
              <h3 className="text-lg text-gray-100 font-extrabold">{user?.name}</h3>
              <p className="text-sm font-bold text-gray-400">{user?.email}</p>
            </div>
            <table className="text-xs my-3">
              <tbody>
                <tr>
                  <td className="px-2 py-2 text-gray-400 font-semibold">Address</td>
                  <td className="px-2 py-2">Lucknow</td>
                </tr>
                <tr>
                  <td className="px-2 py-2 text-gray-400 font-semibold">Phone</td>
                  <td className="px-2 py-2">+91 8840250583</td>
                </tr>
                <tr>
                  <td className="px-2 py-2 text-gray-400 font-semibold">Email</td>
                  <td className="px-2 py-2">{user?.email}</td>
                </tr>
              </tbody>
            </table>
            <div className="text-center my-3">
              <a
                className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                href="#"
              >
                View Profile
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="ml-4   lg:w-2/3 bg-neutral-800 mt-5 mr-3 mb-4 rounded-xl p-4 flex flex-col">
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
