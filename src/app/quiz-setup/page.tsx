"use client"
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useTheme } from '@/components/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const TimePicker = ({ value, onChange, label }: any) => {
  const hours = [...Array(24).keys()];
  const minutes = [...Array(60).keys()];
  const { theme } = useTheme();

  return (
    <div className="flex flex-col">
      <label className={`text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
        {label}
      </label>
      <div className="flex gap-2">
        <select
          title="Hours"
          className="w-full mt-1 py-2 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500"
          value={value.hours}
          onChange={(e) => onChange({ ...value, hours: e.target.value })}
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour < 10 ? `0${hour}` : hour}
            </option>
          ))}
        </select>
        <span className="self-center">:</span>
        <select
          title="Minutes"
          className="w-full mt-1 py-2 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500"
          value={value.minutes}
          onChange={(e) => onChange({ ...value, minutes: e.target.value })}
        >
          {minutes.map((minute) => (
            <option key={minute} value={minute}>
              {minute < 10 ? `0${minute}` : minute}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const QuizSetup = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    startTime: { hours: 10, minutes: 0 },
    endTime: { hours: 12, minutes: 0 },
    totalMarks: '',
    totalQuestions: '',
    instructions: '',
    generatedInstructions: ''
  });

  const generateInstructions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

          prompt: `Generate clear,  concise instructions for a quiz with the following details:
            Quiz Name: ${formData.name}
            Duration: ${formData.endTime.hours - formData.startTime.hours} hours
            Total Marks: ${formData.totalMarks}
            Total Questions: ${formData.totalQuestions}
            Format the instructions as a numbered list and include important points about timing, marking scheme, and submission requirements. also write a thank you note at the end. and this is an online quiz so make sure to mention that students should not use any external resources. also mention the consequences of cheating. also tell them that it is being monitored by AI.`

        })
      });
      const data = await response.json();

      // Clean up the instructions by removing markdown asterisks
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
    if (!formData.name || !formData.startDate || !formData.endDate || !formData.totalMarks || !formData.totalQuestions || !formData.instructions) {
      toast.error('Please fill all the fields');
      setTimeout(() => {
        toast.dismiss();
        return;
      }, 3000);

    }
    e.preventDefault();
    try {

     
      const response = await fetch('/api/quiz-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          duration: formData.endTime.hours - formData.startTime.hours,
          email: session?.user?.email
        })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Quiz created successfully');
        router.push('/admin-dashboard');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error('Failed to create quiz');
    }
  };

  const steps = [
    {
      title: "Basic Details",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quiz Name</label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter Quiz Name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Marks</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900"
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                placeholder="Enter Total Marks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Questions</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900"
                type="number"
                value={formData.totalQuestions}
                onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                placeholder="Enter Total Questions"
              />
            </div>
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
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TimePicker
              label="Start Time"
              value={formData.startTime}
              onChange={(newTime: any) => setFormData({ ...formData, startTime: newTime })}
            />
            <TimePicker
              label="End Time"
              value={formData.endTime}
              onChange={(newTime: any) => setFormData({ ...formData, endTime: newTime })}
            />
          </div>
        </div>
      )
    },
    {
      title: "Instructions",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Quiz Instructions</h3>
            <Button
              onClick={generateInstructions}
              disabled={isGenerating}
              className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating && <Loader2 className="animate-spin" />}
              Generate with AI ✨
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Sample Format</h4>
              <div className="text-sm space-y-2">
                <p>1. Time limit: {formData.endTime.hours - formData.startTime.hours} Hours</p>
                <p>2. Total marks: {formData.totalMarks}</p>
                <p>3. All questions are mandatory {formData.totalQuestions}</p>
                <p>4. No negative marking</p>
                <p>5. Submit before the deadline</p>
              </div>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Generated Instructions</h4>
              <div className="text-sm">
                {formData.generatedInstructions || "Click 'Generate' to create instructions"}
              </div>
            </Card>
          </div>
          <textarea
            className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900 h-32"
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Enter or modify instructions here..."
          />
        </div>
      )
    }
  ];

  return (
    <div className={`container mx-auto p-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <Button
                key={index}
                onClick={() => setCurrentStep(index + 1)}
                className="flex-1 mx-2 bg-blue-800 hover:bg-blue-700 hover:text-white text-white"
              >
                {step.title}
              </Button>
            ))}
          </div>
          <div className="h-2 bg-gray-200 ml-2 mr-2 rounded">
            <div
              className="h-full bg-blue-600 rounded  transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {steps[currentStep - 1].content}

            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="ml-auto bg-blue-700 hover:bg-blue-800 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="ml-auto bg-green-400 hover:bg-green-500 text-white"
                >
                  Create Quiz
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