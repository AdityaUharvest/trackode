'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from './ThemeContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
interface FormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  instructions?: string;
  public: boolean;
  generatedInstructions?: string;
  tag: string;
  autoSendResults: boolean;
}

const MockTestCreator: React.FC = () => {
  const { theme } = useTheme(); // Get current theme
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    durationMinutes: 75,
    public: false,
    tag: 'TCS',
    autoSendResults: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationMinutes' ? parseInt(value) || 0 : value,
      
    }));
    // Debugging line to check form data
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
     // Debugging line to check form data before submission
    try {
      const response = await axios.post<{ id: string }>('/api/mock-tests', formData);
         // Debugging line to check response data
        if(response.data.id) {
          router.push(`mock-tests/${response.data.id}/questions`);
          toast.success('Mock test created successfully!');
          
        }
        
    
      
    } catch (err) {
      setError('Failed to create mock test');
      toast.error('Failed to create mock test');
    } finally {
      setIsLoading(false);
    }
  };

  

  // Theme-based classes
  const containerClasses = `container p-3 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`;
  const formClasses = `max-w-2xl p-3 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`;
  const inputClasses = `w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`;
  const errorClasses = `mb-4 p-3 rounded ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`;
  const labelClasses = ` mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div >
     
    
    <div className={`flex min-h-screen justify-center ${containerClasses}`}>
      
     
      <form onSubmit={handleSubmit} className={formClasses}>
        {error && <div className={errorClasses}>{error}</div>}
        <h2 className={`text-xl text-center font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Create Mock Test</h2>
        <div className="mb-4">
          <label className={labelClasses}>Test Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClasses}>Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className={labelClasses}>Duration (minutes)</label>
          <input
            type="number"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleChange}
            className={inputClasses}
            min="30"
            required
          />
        </div>
        <div className="mb-6">
          <label className={labelClasses}>Tags </label>
          <input
            type="text"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Enter tags separated by commas"
          />
        </div>
        <div className="flex mb-4 items-center gap-3 pt-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Make Public</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="focus:outline-none">
                    <Info className="h-4 w-4 text-gray-500 hover:text-indigo-600" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 text-sm">
                  <p className="mb-2 font-medium">Public Mock Information:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Visible to all platform users of Trackode!</li>
                    <li>Appears in public quiz listings</li>
                    <li>No invitation required</li>
                    <li>Can be taken by anyone</li>
                    <li>Anybody can play this quiz all over the network without invitation</li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
            <button
              type="button"
              
              onClick={() => setFormData({ ...formData, public: !formData.public })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors text-white ${
                formData.public ? 'bg-green-500 ' : 'bg-gray-500'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.public ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm ">
              {formData.public ? 'Public' : 'Private'}
            </span>
          </div>

          <div className="flex mb-4 items-center gap-3 pt-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Auto Send Results</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="focus:outline-none">
                    <Info className="h-4 w-4 text-gray-500 hover:text-indigo-600" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 text-sm">
                  <p className="mb-2 font-medium">Auto Send Results:</p>
                  <p>When enabled, quiz result emails will be automatically sent to participants after they complete the test.</p>
                </PopoverContent>
              </Popover>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, autoSendResults: !formData.autoSendResults })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors text-white ${
                formData.autoSendResults ? 'bg-indigo-500 ' : 'bg-gray-500'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.autoSendResults ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm ">
              {formData.autoSendResults ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 flex mx-auto py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-300 ${
            theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Mock Test'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default MockTestCreator;