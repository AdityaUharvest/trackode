'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import QuestionEditor from './(tcs)/QuestionEditor';
import axios from 'axios';
import { Button } from './ui/button';
import { useTheme } from './ThemeContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

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
  mockTest: string;
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

const API_TIMEOUT = 60000; // 60 seconds timeout

export default function QuestionGenerator({ isPublished, mockTest }: QuestionGeneratorProps) {
  const { theme } = useTheme();
  const params = useParams();
  const { data: session } = useSession();

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
        prompt: `You are an expert in creating high-quality TCS NQT exam questions. Generate exactly 25 challenging ${selectedSection} questions. 

Each question must:
- Be conceptually challenging with clear, unambiguous wording
- Have exactly 4 options (labeled options 0-3)
- Have a single correct answer
- Be appropriate for tech/IT assessment
- Be original and not reuse question patterns
- Have realistic distractors that seem plausible

Return a valid JSON array with 25 objects following this exact format:
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
    const shareLink = localStorage.getItem('shareLink');
    navigator.clipboard.writeText(`${window.location.origin}${shareLink}`).then(
      () => {
        setSuccessMessage('Share link copied to clipboard!');
        setCopied(true);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    );
  };

  return (
    <div className={containerClasses}>
      <div className="p-4 flex justify-between items-center">
        {isPublished && (
          <Button 
            className="dark:bg-green-600 bg-white text-blue hover:bg-blue-700 hover:text-white"
            onClick={handleShareLink}
            disabled={isGenerating || isSubmitting || copied}
          >
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
              <path fill="#1976D2" d="M38.1,31.2L19.4,24l18.7-7.2c1.5-0.6,2.3-2.3,1.7-3.9c-0.6-1.5-2.3-2.3-3.9-1.7l-26,10C8.8,21.6,8,22.8,8,24s0.8,2.4,1.9,2.8l26,10c0.4,0.1,0.7,0.2,1.1,0.2c1.2,0,2.3-0.7,2.8-1.9C40.4,33.5,39.6,31.8,38.1,31.2z"></path><path fill="#1E88E5" d="M11 17A7 7 0 1 0 11 31 7 7 0 1 0 11 17zM37 7A7 7 0 1 0 37 21 7 7 0 1 0 37 7zM37 27A7 7 0 1 0 37 41 7 7 0 1 0 37 27z"></path>
            </svg>
            {copied ? 'Copied' : 'Share'}
          </Button>
        )}

        {isPublished ? (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Published
          </span>
        ) : (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            Unpublished
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className={`ml-2 text-sm ${selectClasses}`}
            disabled={isGenerating || isSubmitting}
          >
            {sections.map(section => (
              <option className='text-sm' key={section.value} value={section.value}>
                {section.label}
              </option>
            ))}
          </select>
          <Button
            onClick={generateQuestions}
            disabled={isGenerating || isSubmitting}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Generating...
              </>
            ) : 'Generate Questions'}
          </Button>
        </div>
      </div>

      {errorMessage && (
        toast.error(errorMessage),
        <div className={errorClasses}>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        toast.success(successMessage),
        <div className={successClasses}>
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="animate-spin mx-auto" size={32} />
          <p className="mt-2">Loading questions...</p>
        </div>
      ) : editingQuestion ? (
        <QuestionEditor
          question={editingQuestion}
          onSave={(updatedQuestion) => handleUpdateQuestion(updatedQuestion, editingQuestion.index)}
          onCancel={() => setEditingQuestion(null)}
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 p-3 gap-4">
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
                </div>
              ))
            )}
          </div>
          {questions.length > 0 && (
            <div className="flex mb-2 justify-end">
              <Button
                onClick={saveQuestions}
                disabled={isSubmitting}
                className="bg-green-600 mb-2 mr-2 text-white hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : 'Save Questions'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}