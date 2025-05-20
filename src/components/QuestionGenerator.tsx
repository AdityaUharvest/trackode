'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import QuestionEditor from './(tcs)/QuestionEditor';
import axios from 'axios';
import { Button } from './ui/button';
import { useTheme } from './ThemeContext';
import { Loader2, ChevronDown } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { to } from '@react-spring/web';

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  section?: string;
  mockTestId?: string;
}

interface Section {
  _id: string;
  value: string;
  label: string;
}

interface Category {
  name: string;
  subcategories: {
    name: string;
    sections: string[];
  }[];
}

interface QuestionGeneratorProps {
  isPublished: boolean;
  mockTest: string;
  shareCode: string;
}

interface EditingQuestion extends Question {
  index: number;
}

export default function QuestionGenerator({ isPublished, mockTest, shareCode }: QuestionGeneratorProps) {
  // State for sections and categories
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [quickFilter, setQuickFilter] = useState('');

  const { theme } = useTheme();
  const params = useParams();
  const mockTestId = params.id as string;

  const [selectedSection, setSelectedSection] = useState('verbal-ability');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<EditingQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPublishedd, setIsPublished] = useState(isPublished);
  const [copied, setCopied] = useState(false);

  // Define categories structure
 const predefinedCategories: Category[] = [
  {
    name: 'Verbal Ability',
    subcategories: [
      {
        name: 'English Language',
        sections: [
          'verbal-ability', 'reading-comprehension', 'para-jumbles',
          'sentence-correction', 'fill-in-the-blanks', 'synonyms',
          'antonyms', 'one-word-substitution', 'idioms-phrases',
          'cloze-test', 'grammar', 'active-passive', 'direct-indirect',
          'error-spotting', 'spellings'
        ]
      }
    ]
  },
  {
    name: 'Reasoning',
    subcategories: [
      {
        name: 'Logical Reasoning',
        sections: [
          'reasoning-ability', 'logical-reasoning', 'analytical-reasoning',
          'blood-relations', 'coding-decoding', 'number-series',
          'letter-series', 'direction-sense', 'statement-conclusion',
          'statement-assumption', 'syllogism', 'data-sufficiency',
          'puzzles', 'odd-one-out', 'venn-diagram', 'calendar', 'clock'
        ]
      }
    ]
  },
  {
    name: 'Quantitative Aptitude',
    subcategories: [
      {
        name: 'Mathematics',
        sections: [
          'numerical-ability', 'advanced-quantitative', 'percentage',
          'profit-loss', 'simple-interest', 'compound-interest',
          'ratio-proportion', 'average', 'time-speed-distance',
          'time-work', 'mixtures-alligation', 'problems-on-ages',
          'partnership', 'number-system', 'lcm-hcf', 'algebra',
          'geometry', 'mensuration', 'trigonometry', 'statistics',
          'data-interpretation', 'probability', 'permutation-combination',
          'quadratic-equations', 'linear-equations', 'surds-indices',
          'logarithm', 'mathematics', 'statistics-advanced'
        ]
      }
    ]
  },
  {
    name: 'Programming',
    subcategories: [
      { 
        name: 'C Programming',
        sections: [
          'c-basics', 'c-arrays', 'c-strings', 'c-pointers',
          'c-structures', 'c-functions', 'c-loops',
          'c-conditional-statements', 'c-storage-classes',
          'c-recursion', 'c-malloc', 'c-file-handling',
          'c-bitwise', 'c-preprocessor', 'c-linked-list',
          'c-data-structures', 'c-mcq', 'c-debugging'
        ]
      },
      {
        name: 'Python',
        sections: [
          'python-basics', 'python-functions', 'python-data-structures',
          'python-oop', 'python-file-handling', 'python-libraries'
        ]
      },
      {
        name: 'Java',
        sections: [
          'java-basics', 'java-oop', 'java-collections', 'java-multithreading'
        ]
      },
      {
        name: 'JavaScript',
        sections: [
          'javascript-basics', 'javascript-dom', 'javascript-es6'
        ]
      },
      {
        name: 'C++',
        sections: [
          'cpp-oop', 'cpp-templates', 'cpp-stl'
        ]
      },
      {
        name: 'SQL',
        sections: [
          'sql-basics', 'sql-joins', 'sql-aggregation'
        ]
      },
      {
        name: 'Web Technologies',
        sections: [
          'html-basics', 'css-basics'
        ]
      },
      {
        name: 'Other Languages',
        sections: [
          'ruby-basics', 'ruby-rails', 'php-basics', 'go-basics',
          'go-concurrency', 'rust-basics', 'rust-ownership',
          'kotlin-basics', 'swift-basics', 'r-basics', 'r-data-analysis',
          'scala-basics', 'haskell-basics'
        ]
      },
      {
        name: 'Computer Science Fundamentals',
        sections: [
          'data-structures', 'algorithms', 'operating-systems',
          'computer-networks', 'database-systems', 'software-engineering'
        ]
      },
      {
        name: 'Advanced Technologies',
        sections: [
          'web-development', 'mobile-development', 'cloud-computing',
          'machine-learning', 'artificial-intelligence', 'data-science',
          'cybersecurity', 'blockchain', 'iot'
        ]
      }
    ]
  },
  {
    name: 'General Knowledge',
    subcategories: [
      {
        name: 'History',
        sections: [
          'indian-history', 'modern-history', 'medieval-history',
          'ancient-history', 'indian-freedom-struggle', 'world-history'
        ]
      },
      {
        name: 'Polity & Economy',
        sections: [
          'indian-polity', 'indian-economy', 'constitution',
          'governance', 'economics', 'public-administration',
          'panchayati-raj', 'governance-reforms'
        ]
      },
      {
        name: 'Geography',
        sections: [
          'geography', 'indian-geography', 'world-geography'
        ]
      },
      {
        name: 'Science',
        sections: [
          'general-science', 'physics', 'chemistry', 'biology',
          'environment', 'science-technology', 'computer-awareness',
          'computers-basics', 'ms-office', 'internet-awareness',
          'space-technology', 'defence-technology', 'nuclear-technology',
          'agriculture', 'science-in-everyday-life', 'astronomy',
          'astrophysics', 'quantum-physics', 'environmental-science'
        ]
      },
      {
        name: 'Current Affairs',
        sections: [
          'current-affairs', 'general-knowledge', 'banking-awareness',
          'financial-awareness', 'budget', 'sports', 'art-culture',
          'awards-honours', 'books-authors', 'important-days',
          'national-international-events', 'government-schemes',
          'social-issues', 'population-demographics',
          'international-relations', 'world-organizations',
          'disaster-management', 'infrastructure', 'international-politics'
        ]
      }
    ]
  },
  {
    name: 'Other Disciplines',
    subcategories: [
      {
        name: 'Social Sciences',
        sections: [
          'philosophy', 'political-science', 'anthropology',
          'linguistics', 'psychology-advanced', 'sociology-advanced'
        ]
      },
      {
        name: 'Humanities',
        sections: [
          'literature', 'history-of-constitution'
        ]
      },
      {
        name: 'Business & Management',
        sections: [
          'business-management', 'finance', 'marketing'
        ]
      },
      {
        name: 'Soft Skills',
        sections: [
          'aptitude', 'logical-thinking', 'decision-making',
          'personality-development', 'psychology', 'sociology',
          'ethics-integrity', 'ethics'
        ]
      },
      {
        name: 'Development',
        sections: [
          'urban-rural-development'
        ]
      }
    ]
  }
];

  // Fetch sections and categorize them
  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await axios.get('/api/fetchSection');
        setSections(res.data.sections);

        // Filter predefined categories to include only available sections
        const availableCategories = predefinedCategories
          .map(category => ({
            ...category,
            subcategories: category.subcategories
              .map(subcategory => ({
                ...subcategory,
                sections: subcategory.sections.filter(sectionValue =>
                  res.data.sections.some((s: Section) => s.value === sectionValue)
                )
              }))
              .filter(subcategory => subcategory.sections.length > 0)
          }))
          .filter(category => category.subcategories.length > 0);

        setCategories(availableCategories);
        // Set initial active tab
        if (availableCategories.length > 0) {
          setActiveTab(availableCategories[0].name);
        }
      } catch (error) {
        console.error('Failed to fetch sections', error);
        setErrorMessage('Failed to fetch sections. Please try again.');
      }
    };
    fetchSection();
  }, []);

  // Fetch questions when selectedSection changes
  useEffect(() => {
    fetchQuestions();
  }, [mockTestId, selectedSection]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/mock-tests/${mockTestId}/questions`, {
        params: { section: selectedSection },
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

  const parseGeneratedQuestions = (generatedQuestions: any): Question[] => {
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
        console.warn('Initial JSON parse failed, trying fallback methods', e);
      }

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

    console.error('Unsupported question format:', generatedQuestions);
    return [];
  };

  const generateQuestions = async () => {
    try {
      setIsGenerating(true);
      setErrorMessage('');

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
      });

      const parsedQuestions = parseGeneratedQuestions(res.data.instructions);

      if (parsedQuestions.length > 0) {
        setQuestions(parsedQuestions.slice(0, 25));
        setSuccessMessage(`Successfully generated ${parsedQuestions.length} questions!`);
        toast.success(`Successfully generated ${parsedQuestions.length} questions!`);
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

      const response = await axios.post(
        `/api/mock-tests/${mockTestId}/questions`,
        {
          section: selectedSection,
          questions: questions.map(q => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
        }
      );

      if (response.data.success) {
        setSuccessMessage(`Successfully saved ${questions.length} questions!`);
        toast.success(`Successfully saved ${questions.length} questions!`);
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

  const handlePublish = async () => {
    try {
      setErrorMessage('');
      const res = await axios.post(`/api/mock-tests/${mockTestId}/publish`, {
        isPublished: !isPublished,
      });
      if (res.data.success) {
        setSuccessMessage('Quiz published successfully!');
        toast.success('Quiz published successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setIsPublished(!isPublished);
      } else {
        throw new Error('Failed to publish quiz');
      }
    } catch (error) {
      console.error('Failed to publish quiz', error);
      setErrorMessage('Failed to publish quiz. Please try again.');
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
      toast.success('Question deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleUpdateQuestion = (updatedQuestion: Question, index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
    setEditingQuestion(null);
    setSuccessMessage('Question updated successfully!');
    toast.success('Question updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

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
    <div className="min-h-screen mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {isPublished && (
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
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
              {copied ? 'Copied!' : 'Share'}
            </button>
          )}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPublished
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}
          >
            {isPublished ? 'Published' : 'Unpublished'}
          </span>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="space-y-4 w-full">
          {/* Category Tabs */}
          <div className="flex overflow-x-auto pb-2 space-x-1">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`px-4 py-2 rounded-t-lg whitespace-nowrap ${
                  activeTab === category.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => {
                  setActiveTab(category.name);
                  setQuickFilter('');
                  // Set the first available section in the category
                  const firstSection = category.subcategories[0]?.sections[0];
                  if (firstSection) {
                    setSelectedSection(firstSection);
                  }
                }}
                aria-selected={activeTab === category.name}
                role="tab"
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Quick Filter */}
          {activeTab && (
            <div className="px-2">
              <input
                type="text"
                placeholder={`Filter ${activeTab} sections...`}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
                disabled={isGenerating || isSubmitting}
                aria-label={`Filter sections in ${activeTab}`}
              />
            </div>
          )}

          {/* Subcategory Sections */}
          {activeTab && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-b-lg rounded-tr-lg p-4">
              {categories
                .find((c) => c.name === activeTab)
                ?.subcategories.map((subcategory) => {
                  const filteredSections = subcategory.sections
                    .map((value) => sections.find((s) => s.value === value))
                    .filter(
                      (section) =>
                        section &&
                        section.label.toLowerCase().includes(quickFilter.toLowerCase())
                    );

                  if (filteredSections.length === 0) return null;

                  return (
                    <div key={subcategory.name} className="mb-6">
                      <h3 className="font-medium text-lg mb-3">{subcategory.name}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {filteredSections.map((section) => (
                          <button
                            key={section!.value}
                            className={`p-2 rounded text-sm text-left ${
                              selectedSection === section!.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => setSelectedSection(section!.value)}
                            disabled={isGenerating || isSubmitting}
                            aria-pressed={selectedSection === section!.value}
                          >
                            {section!.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          <button
            onClick={generateQuestions}
            disabled={isGenerating || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating && <Loader2 className="animate-spin w-5 h-5" />}
            {isGenerating ? 'Generating✨' : 'Generate'}
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
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
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
                className="fixed bottom-6 text-sm right-6 flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                {isSubmitting && <Loader2 className="animate-spin w-5 h-5" />}
                {isSubmitting ? 'Saving...' : 'Save Questions'}
              </button>
              <button
                className="fixed bottom-20 right-6 flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                {questions.length > 24 && (
                  <Link href="/admin-dashboard" className="text-white text-sm">
                    Go to Dashboard
                  </Link>
                )}
              </button>
              <Button
                onClick={() =>
                  navigator.share({
                    title: 'Trackode Quiz',
                    text: `Check out this quiz on Trackode!`,
                    url: `${window.location.origin}/playy/${shareCode}`,
                  }).then(
                    () => {
                      toast.success('Link Copied!');
                    },
                    (error) => {
                      toast.error('Failed to share quiz. Please try again.');
                    }
                  )
                }
                className="fixed bottom-32 right-6 text-sm flex items-center gap-2 px-10 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                Share Quiz
              </Button>
              <Button
                onClick={handlePublish}
                className="fixed bottom-44 right-6 text-sm flex items-center gap-2 px-8 py-2 bg-orange-600 text-white rounded-lg shadow-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                {isPublishedd ? 'Unpublish Quiz' : 'Publish Quiz'}
              </Button>
            </>
          )}
        </>
      )}
      <Toaster />
    </div>
  );
}