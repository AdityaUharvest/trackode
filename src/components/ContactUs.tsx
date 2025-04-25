'use client';

import { useState } from 'react';
import { useTheme } from './ThemeContext';
import { toast } from "react-toastify";
import { useSession } from 'next-auth/react';
import Head from 'next/head';
export default function ContactForm() {
  const {data:session}= useSession();
  const userName = session?.user?.name?session.user.name:'';
  const userEmail = session?.user?.email?session.user.email:'';;
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: `${userName}`,
    email:`${userEmail}`,
    message: 'Hi there, I love this platform!....',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        toast.success('Message sent successfully!',{
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      setStatus('An error occurred. Please try again.');
    }
  };

  return (
    <>
    

    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 min-h-screen sm:flex sm:items-center justify-center p-4">
  <div className="w-full max-w-md">
    <form 
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-600"
    >
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Contact Us</h2>
        
        <div className="mb-5">
          <label 
            htmlFor="name"
            className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1"
          >
            Your Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
                focus:border-transparent transition-all duration-200 pl-10"
              placeholder="John Doe"
            />
            <div className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label 
            htmlFor="email"
            className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
                focus:border-transparent transition-all duration-200 pl-10"
              placeholder="you@example.com"
            />
            <div className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label 
            htmlFor="message"
            className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1"
          >
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
              focus:border-transparent transition-all duration-200 resize-none"
            placeholder="How can we help you?"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
            text-white font-semibold rounded-lg shadow-md transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
            flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
          Send Message
        </button>
      </div>

      {status && (
        <div className={`px-8 pb-6 text-center ${
          status === 'Sending...' ? 'text-amber-600 dark:text-amber-400' :
          status.includes('success') ? 'text-emerald-600 dark:text-emerald-400' :
          'text-rose-600 dark:text-rose-400'
        }`}>
          <p className="font-medium flex items-center justify-center">
            {status === 'Sending...' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-spin" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            ) : status.includes('success') ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {status}
          </p>
        </div>
      )}
    </form>
  </div>
</div>
   
    </>
  );
}