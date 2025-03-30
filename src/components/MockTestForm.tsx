'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTheme } from './ThemeContext';

interface FormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  instructions?: string;
  generatedInstructions?: string;
}

const MockTestCreator: React.FC = () => {
  const { theme } = useTheme(); // Get current theme
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    durationMinutes: 180,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationMinutes' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post<{ id: string }>('/api/mock-tests', formData);
      router.push(`/mock-tests/${response.data.id}/questions`);
    } catch (err) {
      setError('Failed to create mock test');
      toast.error('Failed to create mock test');
    } finally {
      setIsLoading(false);
    }
  };

  const generateInstructions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate clear, concise instructions for a quiz with the following details:
            Quiz Name: ${formData.title}
            Duration: ${formData.durationMinutes} minutes
            Start Time: ${formData.startTime}
            End Time: ${formData.endTime}
            Format the instructions as a numbered list and include important points about timing, marking scheme, and submission requirements.`,
        }),
      });
      const data = await response.json();
      const cleanInstructions = data?.instructions?.replace(/\*\*/g, '');
      setFormData(prev => ({
        ...prev,
        description: cleanInstructions || '',
        generatedInstructions: cleanInstructions || '',
      }));
    } catch (error) {
      toast.error('Failed to generate instructions');
    } finally {
      setIsGenerating(false);
    }
  };

  // Theme-based classes
  const containerClasses = `container mx-auto px-4 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`;
  const formClasses = `max-w-2xl p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`;
  const inputClasses = `w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`;
  const errorClasses = `mb-4 p-3 rounded ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`;
  const labelClasses = `block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className={containerClasses}>
      <h1 className="text-2xl font-bold mb-6">New TCS NQT Mock Test</h1>

      <form onSubmit={handleSubmit} className={formClasses}>
        {error && <div className={errorClasses}>{error}</div>}

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

        <div className="mb-4">
          <label className={labelClasses}>Description</label>
          <Button
            onClick={generateInstructions}
            disabled={isGenerating}
            className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating && <Loader2 className="animate-spin" />}
            Generate with AI ✨
          </Button>
          <textarea
            name="description"
            value={formData?.generatedInstructions || formData.description}
            onChange={handleChange}
            className={`${inputClasses} mt-2`}
            rows={5}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 ${
            theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Mock Test'}
        </button>
      </form>
    </div>
  );
};

export default MockTestCreator;