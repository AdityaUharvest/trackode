"use client"
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from "@/components/ThemeContext";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { duration } from 'moment';



const QuizSetup = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    duration:'',
    totalMarks: '',
    totalQuestions: '',
    instructions: '',
    generatedInstructions: '',
    publicc: false
  });

  const generateInstructions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate clear, concise instructions for a quiz with the following details:
            Quiz Name: ${formData.name}
            Duration: ${formData.duration} minutes
            Total Marks: ${formData.totalMarks}
            Total Questions: ${formData.totalQuestions}
            Format the instructions as a numbered list and include important points about timing, marking scheme, and submission requirements.`
        })
      });
      const data = await response.json();
      let cleanInstructions = data?.instructions?.replace(/\*\*/g, '');
      setFormData(prev => ({
        ...prev,
        instructions: cleanInstructions || '',
        generatedInstructions: cleanInstructions || ''
      }));
    } catch (error) {
      toast.error('Failed to generate instructions');
    }
    setIsGenerating(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmiting(true);
    
    if (!formData.name || !formData.startDate || !formData.endDate || 
        !formData.totalMarks || !formData.totalQuestions || !formData.instructions) {
      toast.error('Please fill all required fields');
      setSubmiting(false);
      return;
    }

    try {
      const response = await fetch('/api/quiz-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          duration: formData.duration,
          email: session?.user?.email
        })
      });

      if (response.ok) {
        toast.success('Quiz created successfully');
        router.push('/admin-dashboard');
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      toast.error('Failed to create quiz');
    } finally {
      setSubmiting(false);
    }
  };

  const steps = [
    {
      title: "Basic Details",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quiz Name *</label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter Quiz Name"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Marks *</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900"
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                placeholder="Enter Total Marks"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Questions *</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900"
                type="number"
                value={formData.totalQuestions}
                onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                placeholder="Enter Total Questions"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Make Public</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button title="More Info" aria-label="More Info"
                  type="button" className="focus:outline-none">
                    <Info className="h-4 w-4 text-gray-500 hover:text-indigo-600" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 text-sm">
                  <p className="mb-2 font-medium">Public Quiz Information:</p>
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
              onClick={() => setFormData({ ...formData, publicc: !formData.publicc })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors text-white ${
                formData.publicc ? 'bg-green-500 ' : 'bg-gray-500'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.publicc ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm ">
              {formData.publicc ? 'Public' : 'Private'}
            </span>
          </div>
        </div>
      )
    },
    {
      title: "Schedule",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date *</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration *</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900"
                type="number"
                placeholder='Enter in minutes'
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>
          </div>
          
        </div>
      )
    },
    {
      title: "Instructions",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Quiz Instructions *</h3>
            <Button
              onClick={generateInstructions}
              disabled={isGenerating}
              className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {isGenerating && <Loader2 className="animate-spin" />}
              Generate with AI ✨
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className={`p-4 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
              <h4 className="text-sm font-medium mb-2">Sample Format</h4>
              <div className="text-sm space-y-2">
                <p>1. Time limit: {formData.duration} Hours</p>
                <p>2. Total marks: {formData.totalMarks}</p>
                <p>3. All questions are mandatory</p>
                <p>4. No negative marking</p>
                <p>5. Submit before the deadline</p>
              </div>
            </Card>
            <Card className={`p-4 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
              <h4 className="text-sm font-medium mb-2">Generated Instructions</h4>
              <div className="text-sm whitespace-pre-line">
                {formData.generatedInstructions || "Click 'Generate' to create instructions"}
              </div>
            </Card>
          </div>
          <textarea
            className={`w-full px-4 py-2 rounded-lg h-32 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Enter or modify instructions here..."
            required
          />
        </div>
      )
    }
  ];

  return (
    <div className={`container min-h-screen  mx-auto p-6  ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className={`flex justify-between items-center mb-4 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
            {steps.map((step, index) => (
              <Button
                key={index}
                onClick={() => setCurrentStep(index + 1)}
                className={`flex-1 text-white mx-2 ${currentStep === index + 1 ? 'bg-indigo-600 text-white'  : 'bg-indigo-500'} hover:bg-indigo-700 hover:text-white `}
              >
                {step.title}
              </Button>
            ))}
          </div>
          <div className="h-2 bg-gray-200 ml-2 mr-2 rounded">
            <div
              className="h-full bg-indigo-600 rounded transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardContent className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            {steps[currentStep - 1].content}

            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className='bg-white text-black hover:bg-gray-100'
                >
                  Previous
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="ml-auto bg-indigo-700 hover:bg-indigo-800 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submiting}
                  className="ml-auto bg-green-600 hover:bg-green-700 text-white"
                >
                  {submiting ? <Loader2 className="animate-spin mr-2" /> : null}
                  {submiting ? "Creating..." : "Create Quiz"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizSetup;