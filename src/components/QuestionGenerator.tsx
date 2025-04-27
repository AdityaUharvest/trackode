'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import QuestionEditor from './(tcs)/QuestionEditor';
import axios from 'axios';
import { Button } from './ui/button';
import { useTheme } from './ThemeContext';
import { Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Section from "@/app/model/Section"
import Link from 'next/link';
interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  section?: string;
  mockTestId?: string;
}

interface Section {
  _id:string;
  value: string;
  label: string;
}

interface QuestionGeneratorProps {
  isPublished: boolean;
  mockTest: string;
  shareCode: string;
}

interface EditingQuestion extends Question {
  index: number;
}

const API_TIMEOUT = 60000; // 60 seconds timeout

export default function QuestionGenerator({ isPublished, mockTest, shareCode }: QuestionGeneratorProps) {
  //fetching sections from the server
  const [sections, setSections] = useState<Section[]>([]);
  useEffect(
    () => {
      const fetchSection = async () => {
        try {
          const res = await axios.get('/api/fetchSection');

          setSections(res.data.sections);
        } catch (error) {
          console.error('Failed to fetch sections', error);
        }
      };
      fetchSection();
    }, []
  )

  const { theme } = useTheme();
  const params = useParams();
  const { data: session } = useSession();

  const mockTestId = params.id as string;

  const [selectedSection, setSelectedSection] = useState('verbal-ability');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<EditingQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [isPublishedd, setIsPublished] = useState(isPublished);
  // for sections

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
 const handlePublish = async () => {
    try {
      
      setErrorMessage('');
      const res = await axios.post(`/api/mock-tests/${mockTestId}/publish`,{
        isPublished: !isPublished,
      });
      if (res.data.success) {
        setSuccessMessage('Quiz published successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setIsPublished(!isPublished);
      } else {
        throw new Error('Failed to publish quiz');
      }
    } catch (error) {
      console.error('Failed to publish quiz', error);
      setErrorMessage('Failed to publish quiz. Please try again.');
    } finally {
      
    }
  }
  const parseGeneratedQuestions = (generatedQuestions: any): Question[] => {
    // First try to parse as complete JSON
    if (typeof generatedQuestions === 'string') {
      try {
        const cleaned = generatedQuestions.replace(/```(json)?\s*|\s*```/g, '');
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) {
          return parsed.map(q => ({
            text: q.text || q.question || '',
            options: Array.isArray(q.options) ? q.options : [],
            correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          })).filter(q => q.text && q.options.length >= 2);
        }
      } catch (e) {
        console.warn("Initial JSON parse failed, trying fallback methods", e);
      }

      // Fallback for malformed JSON
      const questionBlocks = generatedQuestions.split(/\n\s*\n/);
      return questionBlocks.map(block => {
        const lines = block.split('\n').filter(l => l.trim());
        if (lines.length < 3) return null;

        const text = lines[0].replace(/^\d+\.\s*/, '').trim();
        const options = lines.slice(1, 5)
          .map(l => l.replace(/^[a-dA-D][\.\)]\s*/, '').trim());
        const correctLine = lines.find(l => l.toLowerCase().includes('correct'));
        const correctAnswer = correctLine
          ? options.indexOf(correctLine.replace(/.*correct.*?([a-dA-D])/i, '$1').toUpperCase())
          : 0;

        return {
          text,
          options,
          correctAnswer,
        };
      }).filter(q => q !== null) as Question[];
    }

    if (Array.isArray(generatedQuestions)) {
      return generatedQuestions.map(q => ({
        text: q.text || q.question || '',
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      })).filter(q => q.text && q.options.length >= 2);
    }

    console.error("Unsupported question format:", generatedQuestions);
    return [];
  };

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/mock-tests/${mockTestId}/questions`, {
        params: { section: selectedSection },
        timeout: API_TIMEOUT
      });
      setQuestions(res.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to load questions', error);
      setErrorMessage('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [mockTestId, selectedSection]);


  const generateQuestions = async () => {
    try {
      setIsGenerating(true);
      setErrorMessage('');

      // Generate all 25 questions in a single API call
      const res = await axios.post('/api/chat-gpt', {
        prompt: `Generate exactly 25 medium, hard and challenging level ${selectedSection} questions.Each question must:
        - Have exactly 4 options, accurate dont do any error (labeled options 0-3)
        - Have a single correct answer
        - Return a valid JSON array with 25 objects following this exact format:
        [
          {
          "text": "Question text here",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": 0
          },
        ...
        ]
        The "correctAnswer" field must be the index (0-3) of the correct option. 
        DO NOT include any explanations, markdown formatting, or additional text outside the JSON array. Ensure the JSON is properly formatted and parseable.`
      }, {
        timeout: API_TIMEOUT
      });

      const parsedQuestions = parseGeneratedQuestions(res.data.instructions);

      if (parsedQuestions.length > 0) {
        setQuestions(parsedQuestions.slice(0, 25)); // Limit to 25 questions max
        setSuccessMessage(`Successfully generated ${parsedQuestions.length} questions!`);
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        setErrorMessage('No valid questions could be generated. Please try again.');
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

      // Submit all questions at once
      const response = await axios.post(
        `/api/mock-tests/${mockTestId}/questions`,
        {
          section: selectedSection,
          questions: questions.map(q => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer
            // Explanation will be generated later
          }))
        },
        {
          timeout: API_TIMEOUT
        }
      );

      if (response.data.success) {
        setSuccessMessage(`Successfully saved ${questions.length} questions!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to save questions');
      }
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

  const [copied, setCopied] = useState(false);
  const handleShareLink = async () => {


    navigator.clipboard.writeText(`${window.location.origin}/playy/${shareCode}`).then(
      () => {
        setSuccessMessage('Share link copied to clipboard!');
        setCopied(true);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    );
  };

  return (
<div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              {isPublished && (
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={handleShareLink}
                  disabled={isGenerating || isSubmitting || copied}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 48 48"
                    fill="currentColor"
                  >
                    <path d="M38.1,31.2L19.4,24l18.7-7.2c1.5-0.6,2.3-2.3,1.7-3.9c-0.6-1.5-2.3-2.3-3.9-1.7l-26,10C8.8,21.6,8,22.8,8,24s0.8,2.4,1.9,2.8l26,10c0.4,0.1,0.7,0.2,1.1,0.2c1.2,0,2.3-0.7,2.8-1.9C40.4,33.5,39.6,31.8,38.1,31.2z"></path>
                    <path d="M11 17A7 7 0 1 0 11 31 7 7 0 1 0 11 17zM37 7A7 7 0 1 0 37 21 7 7 0 1 0 37 7zM37 27A7 7 0 1 0 37 41 7 7 0 1 0 37 27z"></path>
                  </svg>
                  {copied ? "Copied!" : "Share"}
                </button>
              )}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isPublished
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {isPublished ? "Published" : "Unpublished"}
              </span>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-6">
            <div className="flex gap-1">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className=" rounded-lg w-48 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isGenerating || isSubmitting}
              >
                {sections.map((section) => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>
              <button
                onClick={generateQuestions}
                disabled={isGenerating || isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating && <Loader2 className="animate-spin w-5 h-5" />}
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Main Content */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto w-8 h-8 text-blue-600 dark:text-blue-400" />
              <p className="mt-3 text-gray-600 dark:text-gray-300">Loading questions...</p>
            </div>
          ) : editingQuestion ? (
            <QuestionEditor
              question={editingQuestion}
              onSave={(updatedQuestion) =>
                handleUpdateQuestion(updatedQuestion, editingQuestion.index)
              }
              onCancel={() => setEditingQuestion(null)}
            />
          ) : (
            <>
              <div className="space-y-6">
                {questions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No questions yet. Click "Generate Questions" to get started.
                  </div>
                ) : (
                  questions.map((q, index) => (
                    <div
                      key={index}
                      className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          Question {index + 1}
                        </h3>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(index)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="mb-4 text-gray-700 dark:text-gray-200">{q.text}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg text-sm ${
                              q.correctAnswer === i
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {questions.length > 0 && (
                <>
                <button
                  onClick={saveQuestions}
                  disabled={isSubmitting}
                  className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                >
                  {isSubmitting && <Loader2 className="animate-spin w-5 h-5" />}
                  {isSubmitting  ? "Saving..." : "Save Questions"}
                  
                </button>
                
                <button
                
                className="fixed bottom-20 right-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                
                {questions.length > 24 && (
                  
                   <Link href="/admin-dashboard" className="text-white text-sm font-semibold">
                   Go to Dashboard
                   </Link> 
                 
                )}
              </button>
              <Button
                onClick={()=>navigator.share({
                  title: 'Trackode Quiz',
                  text: `Check out this quiz on Trackode! ${window.location.origin}/playy/${shareCode}`,
                  url: `${window.location.origin}/playy/${shareCode}`,

                }).then(
                  () => {
                    toast.success('Link Copied!');
                  },
                  (error) => {
                    toast.error('Failed to share quiz. Please try again.');
                  }
                )}
                className="fixed bottom-32 right-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                Share
                
               
              </Button>
              <Button
                onClick={handlePublish}
                className="fixed bottom-44 right-6 flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg shadow-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                {isPublishedd ? 'Unpublish' : 'Publish'}

                
                
               
              </Button>
              </>
                
              )}
              
              
            </>
          )}
        </div>
  );
}