

"use client"
import React, { useEffect, useState } from 'react';
import MockTestsListClient from '@/components/AvailableMocks';
import { useParams } from 'next/navigation'; // Use next/navigation for client-side navigation
// import { useRouter } from 'next/router';
import axios from 'axios';
import { useTheme } from '@/components/ThemeContext'; 
// Adjust the import path based on your file structure
import { useRouter } from 'next/navigation'; // Use next/navigation for client-side navigation
export default function MockTestsList() {
  const [mocks, setMocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams() // Use router.query to access query parameters
  const category = params?.category;
   // Debugging line to check category and theme
  useEffect(() => {
    const fetchMocks = async () => {
      setIsLoading(true);
      try {
       const response = await axios.get(`/api/free-mocks?category=${category}`);
       const data = response.data.data;
       console.log('Fetched mocks:', data); // Debugging line to check fetched data
        setMocks(data);
      } catch (error) {
        console.error('Error fetching mocks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMocks();
  }, [category]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
  <div className={`container mx-auto p-4 mt-5 `}>
    <div className="mb-8 text-center">

    <MockTestsListClient
      initialTests={mocks}
      
      
      
      ></MockTestsListClient>
    </div>
  </div>
  );
};
