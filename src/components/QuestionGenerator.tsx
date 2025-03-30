'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import QuestionEditor from './(tcs)/QuestionEditor';
import axios from 'axios';
import { Button } from './ui/button';
import { useTheme } from './ThemeContext';

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  section?: string;
  mockTestId?: string;
}

interface Section {
  value: string;
  label: string;
}

interface QuestionGeneratorProps {
  isPublished: boolean;
}

interface EditingQuestion extends Question {
  index: number;
}

const sections: Section[] = [
  { value: 'verbal-ability', label: 'Verbal Ability (English)' },
  { value: 'reasoning-ability', label: 'Reasoning Ability' },
  { value: 'numerical-ability', label: 'Numerical Ability' },
  { value: 'advanced-quantitative', label: 'Advanced Quantitative' },
  { value: 'advanced-reasoning', label: 'Advanced Reasoning' },
  { value: 'advanced-coding', label: 'Advanced Coding' }
];

export default function QuestionGenerator({ isPublished }: QuestionGeneratorProps) {
  const { theme } = useTheme();
  const params = useParams();
  const mockTestId = params.id as string;
  const [selectedSection, setSelectedSection] = useState(sections[0].value);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<EditingQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [shareLink, setShareLink] = useState('');

  // Theme-based classes
  const containerClasses = `space-y-6 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`;
  const selectClasses = `p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`;
  const questionCardClasses = `border p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;
  const optionClasses = (isCorrect: boolean) => 
    `p-2 border rounded ${isCorrect ? 
      (theme === 'dark' ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-300') : 
      (theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200')}`;
  const explanationClasses = `p-3 rounded text-sm ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`;
  const errorClasses = `p-3 rounded ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`;
  const successClasses = `p-3 rounded ${theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'}`;

  const parseGeneratedQuestions = (generatedQuestions: any): Question[] => {
    if (Array.isArray(generatedQuestions) && 
        generatedQuestions.every(q => q.text && Array.isArray(q.options))) {
      return generatedQuestions;
    }

    if (typeof generatedQuestions === 'string') {
      let cleaned = generatedQuestions.trim();
      cleaned = cleaned.replace(/```(json)?\s*|\s*```/g, '');
      
      try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) {
          return parsed.map(q => ({
            text: q.text || q.question || '',
            options: Array.isArray(q.options) ? q.options : [],
            correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
            explanation: q.explanation || ''
          })).filter(q => q.text && q.options.length >= 2);
        }
      } catch (error) {
        console.warn("Initial JSON parse failed, trying fallback methods", error);
      }

      const questionMatches = cleaned.match(/\{[^{}]*\}/g) || [];
      const parsedQuestions: Question[] = [];

      for (const match of questionMatches) {
        try {
          const parsed = JSON.parse(match);
          parsedQuestions.push({
            text: parsed.text || parsed.question || '',
            options: Array.isArray(parsed.options) ? parsed.options : [],
            correctAnswer: typeof parsed.correctAnswer === 'number' ? parsed.correctAnswer : 0,
            explanation: parsed.explanation || ''
          });
        } catch (error) {
          console.warn("Failed to parse question object:", match, error);
        }
      }

      return parsedQuestions.filter(q => q.text && q.options.length >= 2);
    }

    console.error("Unsupported question format:", generatedQuestions);
    return [];
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/mock-tests/${mockTestId}/questions?section=${selectedSection}`);
        const data = await res.json();
        setQuestions(data);
        setErrorMessage('');
      } catch (error) {
        console.error('Failed to load questions', error);
        setErrorMessage('Failed to load questions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [mockTestId, selectedSection]);

  const generateQuestions = async () => {
    try {
      setIsGenerating(true);
      setErrorMessage('');
      
      const res = await axios.post('/api/generate-instructions', { 
        prompt: `Generate 25 ${selectedSection} questions for TCS NQT exam. Format as JSON array with each question having:
        - "text": "question text"
        - "options": ["option1", "option2", "option3", "option4"]
        - "correctAnswer": index (0-3)
        - "explanation": "optional explanation"`
      });
      
      const parsedQuestions = parseGeneratedQuestions(res.data.instructions);
      
      if (parsedQuestions.length > 0) {
        setQuestions(parsedQuestions);
        setSuccessMessage(`Successfully generated ${parsedQuestions.length} questions!`);
      } else {
        setErrorMessage('No valid questions could be parsed from the response');
      }
    } catch (error) {
      console.error('Failed to generate questions', error);
      setErrorMessage('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveQuestions = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      const response = await axios.post(`/api/mock-tests/${mockTestId}/questions`, {
        section: selectedSection,
        questions: questions
      });
      
      setSuccessMessage('Questions saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save questions', error);
      setErrorMessage('Failed to save questions. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingQuestion({ ...questions[index], index });
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
      setSuccessMessage('Question deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleUpdateQuestion = (updatedQuestion: Question, index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
    setEditingQuestion(null);
    setSuccessMessage('Question updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setSuccessMessage('Share link copied to clipboard!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to copy share link');
    }
  };

  const handlePublish = async () => {
    try {
      const res = await fetch(`/api/mock-tests/${params.id}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: !isPublished })
      });
      const data = await res.json();

      const newShareLink = `${window.location.origin}${data.shareLink}`;
      setShareLink(newShareLink);
      await navigator.clipboard.writeText(newShareLink);
      setSuccessMessage(`Mock test ${!isPublished ? 'published' : 'unpublished'} and share link copied to clipboard!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      window.location.reload();
    } catch (error) {
      console.error('Failed to publish mock test', error);
      setErrorMessage('Failed to publish mock test. Please try again.');
    }
  };

  return (
    <div className={containerClasses}>
      <div className="flex gap-4 mb-6">
        <Button 
          className={`mr-2 ${isPublished ? 
            'bg-red-600 hover:bg-red-700' : 
            'bg-green-600 hover:bg-green-700'} text-white`}
          onClick={handlePublish}
        >
          {isPublished ? 'Unpublish' : 'Publish'}
        </Button>
        {isPublished && (
          <Button 
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleShareLink}
          >
            Share Link
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className={selectClasses}
          disabled={isGenerating || isSubmitting}
        >
          {sections.map(section => (
            <option key={section.value} value={section.value}>
              {section.label}
            </option>
          ))}
        </select>
        <Button
          onClick={generateQuestions}
          disabled={isGenerating || isSubmitting}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {isGenerating ? 'Generating...' : 'Generate Questions'}
        </Button>
      </div>

      {errorMessage && (
        <div className={errorClasses}>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className={successClasses}>
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading questions...</div>
      ) : editingQuestion ? (
        <QuestionEditor
          question={editingQuestion}
          onSave={(updatedQuestion) => handleUpdateQuestion(updatedQuestion, editingQuestion.index)}
          onCancel={() => setEditingQuestion(null)}
        />
      ) : (
        <>
          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                No questions yet. Click "Generate Questions" to get started.
              </div>
            ) : (
              questions.map((q, index) => (
                <div key={index} className={questionCardClasses}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">Question {index + 1}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className={`${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mb-3">{q.text}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className={optionClasses(q.correctAnswer === i)}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </div>
                    ))}
                  </div>
                  
                  {q.explanation && (
                    <div className={explanationClasses}>
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {questions.length > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={saveQuestions}
                disabled={isSubmitting}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {isSubmitting ? 'Saving...' : 'Save Questions'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}