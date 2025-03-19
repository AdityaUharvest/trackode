'use client';

import { useState } from 'react';
import { useTheme } from '../../../components/ThemeContext';
import { toast } from "react-toastify";
import { useSession } from 'next-auth/react';
export default function ContactForm() {
  const {data:session}= useSession();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
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
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      setStatus('An error occurred. Please try again.');
    }
  };

  return (
    <div className=" dark:bg-gray-900 justify-center flex ">
         <div className="max-w-3xl  h-screen   mx-auto p-6">
      
      <form 
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 
          transition-colors duration-200"
      >
        <div className="space-y-2">
          <label 
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
              focus:border-transparent outline-none transition-colors duration-200"
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
              focus:border-transparent outline-none transition-colors duration-200"
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
              focus:border-transparent outline-none transition-colors duration-200 resize-y"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 
              dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium
              transition-colors duration-200 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500"
          >
            Send Message
          </button>
        </div>

        {status && (
          <p className={`text-center font-medium ${
            status === 'Sending...' ? 'text-yellow-600 dark:text-yellow-400' :
            status.includes('success') ? 'text-green-600 dark:text-green-400' :
            'text-red-600 dark:text-red-400'
          }`}>
            {status}
          </p>
        )}
      </form>
    </div>
    </div>
   
  );
}