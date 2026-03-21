'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import QuestionEditor from './(tcs)/QuestionEditor';
import axios from 'axios';
import { Loader2, ChevronDown, BookOpen, EyeOff, Eye, ArrowLeft, Pencil, Save, Share2, Trash2, ListChecks, Layers } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
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

interface QuizSectionInfo {
  value: string;
  label: string;
  count: number;
}

export default function QuestionGenerator({ isPublished, mockTest, shareCode }: QuestionGeneratorProps) {
  // State for sections and categories
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [quickFilter, setQuickFilter] = useState('');
  const [customSection, setCustomSection] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [isAddingCustomSection, setIsAddingCustomSection] = useState(false);

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
  const [isPublishedState, setIsPublishedState] = useState(isPublished);
  const [copied, setCopied] = useState(false);
  const [quizSections, setQuizSections] = useState<QuizSectionInfo[]>([]);

  const selectedSectionLabel =
    sections.find((section) => section.value === selectedSection)?.label || selectedSection || 'Not selected';
  const activeCategory = categories.find((category) => category.name === activeTab) || null;
  const activeCategoryTopicCount = activeCategory
    ? activeCategory.subcategories.reduce((sum, subcategory) => sum + subcategory.sections.length, 0)
    : 0;
  const step2Options = (activeCategory?.subcategories || [])
    .flatMap((subcategory) =>
      subcategory.sections.map((value) => {
        const found = sections.find((section) => section.value === value);
        if (!found) {
          return null;
        }
        return {
          value: found.value,
          label: found.label,
          subcategory: subcategory.name,
        };
      })
    )
    .filter((item): item is { value: string; label: string; subcategory: string } => Boolean(item));
  const filteredStep2Options = step2Options.filter((item) =>
    item.label.toLowerCase().includes(quickFilter.toLowerCase())
  );

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

        // Add a "Custom" category for user-defined sections
        const customSections = res.data.sections.filter(
          (section: Section) => !predefinedCategories.some(category =>
            category.subcategories.some(sub => sub.sections.includes(section.value))
          )
        );

        if (customSections.length > 0) {
          availableCategories.push({
            name: 'Custom',
            subcategories: [{
              name: 'User-Defined',
              sections: customSections.map((s: Section) => s.value),
            }],
          });
        }

        setCategories(availableCategories);
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

  useEffect(() => {
    refreshQuizSections();
  }, [mockTestId, sections]);

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

  const refreshQuizSections = async () => {
    try {
      const res = await axios.get(`/api/mock-tests/${mockTestId}/questions`);
      const allQuestions = Array.isArray(res.data) ? res.data : [];

      const counter = allQuestions.reduce((acc: Record<string, number>, question: any) => {
        const sectionKey = String(question?.section || 'general').trim();
        if (!sectionKey) {
          return acc;
        }
        acc[sectionKey] = (acc[sectionKey] || 0) + 1;
        return acc;
      }, {});

      const mapped = Object.entries(counter)
        .map(([value, count]) => {
          const found = sections.find((section) => section.value === value);
          return {
            value,
            label: found?.label || value,
            count,
          };
        })
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

      setQuizSections(mapped);
    } catch (error) {
      console.error('Failed to load quiz section summary', error);
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
    if (questionCount < 1 || questionCount > 50) {
      setErrorMessage('Please enter a number of questions between 1 and 50.');
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage('');

      const res = await axios.post('/api/chat-gpt', {
        prompt: `Generate exactly ${questionCount} medium, hard, and challenging level ${selectedSection} questions. Each question must:
        - Have exactly 4 options (labeled options 0-3)
        - Have a single correct answer
        - Return a valid JSON array with ${questionCount} objects following this exact format:
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
        setQuestions(parsedQuestions.slice(0, questionCount));
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

  const addCustomSection = async () => {
    if (!customSection.trim()) {
      setErrorMessage('Please enter a valid section name.');
      return;
    }

    const sectionValue = customSection
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!sectionValue) {
      setErrorMessage('Invalid section name. Use alphanumeric characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post('/api/mock-tests/addSection', {
        value: sectionValue,
        label: customSection.trim(),
        category: 'Custom',
      });

      const newSection = res.data.section;
      setSections([...sections, newSection]);

      // Update categories to include the new custom section
      const updatedCategories = [...categories];
      const customCategory = updatedCategories.find(c => c.name === 'Custom');
      if (customCategory) {
        customCategory.subcategories[0].sections.push(newSection.value);
      } else {
        updatedCategories.push({
          name: 'Custom',
          subcategories: [{ name: 'User-Defined', sections: [newSection.value] }],
        });
      }
      setCategories(updatedCategories);
      setSelectedSection(newSection.value);
      setCustomSection('');
      setIsAddingCustomSection(false);
      setSuccessMessage('Custom section added successfully!');
      toast.success('Custom section added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to add custom section', error);
      setErrorMessage('Failed to add custom section. Please try again.');
    } finally {
      setIsSubmitting(false);
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
        await refreshQuizSections();
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
        isPublished: !isPublishedState,
      });
      if (res.data.success) {
        setSuccessMessage(`Quiz ${isPublishedState ? 'unpublished' : 'published'} successfully!`);
        toast.success(`Quiz ${isPublishedState ? 'unpublished' : 'published'} successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        setIsPublishedState(!isPublishedState);
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

      setQuizSections((prev) =>
        prev
          .map((section) =>
            section.value === selectedSection
              ? { ...section, count: Math.max(0, section.count - 1) }
              : section
          )
          .filter((section) => section.count > 0)
      );

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
    navigator.clipboard.writeText(`${window.location.origin}/assessment/${shareCode}`).then(
      () => {
        setSuccessMessage('Share link copied to clipboard!');
        setCopied(true);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
  <div className="mx-auto">
    {/* Header Section */}
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Question Builder</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Build and manage questions for <span className="font-semibold">{mockTest}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Share code: {shareCode}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-lg text-xs font-semibold shadow-sm ${
            isPublishedState
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
          }`}
        >
          {isPublishedState ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {isPublishedState && (
          <button
            onClick={handleShareLink}
            disabled={isGenerating || isSubmitting || copied}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-[1.02] ${
              copied
                ? 'bg-emerald-500 text-white shadow-emerald-200 dark:shadow-emerald-900'
                : 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-indigo-900 hover:bg-indigo-700'
            } shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 16c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m-8 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2M6 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m12 4c0-.3 0-.7.1-1H14v2h4.1c-.1-.3-.1-.7-.1-1m-6-2h5.9c-.1-.3-.1-.7-.1-1 0-.3 0-.7.1-1H12v2m-2 0v2H5.9c.1-.3.1-.7.1-1s0-.7-.1-1H10m0-2v2H6.8C7.4 8.3 8.5 8 10 8m0 4H6.8c-.6.7-1.7 1-3.3 1v2c2.1 0 3.8-.4 5.2-1.2l.9 1.8c-1.8 1-4 1.4-6.1 1.4v-2c1.3 0 2.5-.1 3.5-.4-1.6 1.3-3.5 1.4-3.5 1.4v2s2.2-.2 4.1-1.4c1.4 1.3 3.4 1.4 3.9 1.4v-2c-.6 0-2.1-.1-3.5-1.1l.8-1.8c1.1.5 2.7.9 4.7.9v-2c-1.4 0-2.6-.3-3.2-1H10z"/>
            </svg>
            {copied ? 'Link Copied!' : 'Share Quiz'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <ListChecks className="w-4 h-4" />
            Questions Loaded
          </div>
          <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-gray-100">{questions.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <Layers className="w-4 h-4" />
            Current Section
          </div>
          <p className="mt-1 truncate text-sm font-semibold text-gray-800 dark:text-gray-100">{selectedSectionLabel}</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Generate Count</div>
          <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-gray-100">{questionCount}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Sections In This Quiz
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {quizSections.length > 0
            ? `This quiz currently has questions in ${quizSections.length} section(s).`
            : 'No saved sections yet. Generate and save questions to create sections.'}
        </p>
        {quizSections.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {quizSections.map((section) => (
              <button
                key={section.value}
                onClick={() => setSelectedSection(section.value)}
                className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  selectedSection === section.value
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <span className="max-w-[220px] truncate">{section.label}</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    selectedSection === section.value
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {section.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="lg:sticky lg:top-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Controls
          </h2>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            Follow steps: choose category, pick topic, set count, then generate.
          </p>

          <div className="mb-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">Step 1</p>
            <label className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Choose Category</label>
            <select
              value={activeTab || ''}
              onChange={(event) => {
                const categoryName = event.target.value;
                setActiveTab(categoryName);
                setQuickFilter('');
                const firstSection =
                  categories.find((category) => category.name === categoryName)?.subcategories[0]?.sections[0] || '';
                if (firstSection) {
                  setSelectedSection(firstSection);
                }
              }}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {activeCategory
                ? `${activeCategoryTopicCount} topic(s) available in ${activeCategory.name}`
                : 'No category selected'}
            </p>
          </div>

          {activeTab && (
            <div className="mb-5 space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">Step 2</p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">Choose Topic/Section</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search ${activeTab} topics...`}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg  placeholder:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={quickFilter}
                  onChange={(e) => setQuickFilter(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Section Dropdown
                </label>
                <select
                  value={selectedSection}
                  onChange={(event) => setSelectedSection(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  {filteredStep2Options.map((item) => (
                    <option key={`${item.subcategory}-${item.value}`} value={item.value}>
                      {item.label} ({item.subcategory})
                    </option>
                  ))}
                </select>
                {filteredStep2Options.length === 0 && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    No topics match your filter for this category.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mb-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">Step 3</p>
            <label className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Questions</label>
            <div className="relative mt-2">
              <input
                type="number"
                min="1"
                max="50"
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isGenerating || isSubmitting}
              />
              <div className="absolute right-3 top-2 text-xs text-gray-500 dark:text-gray-400">Max: 50</div>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-3">
            <button
              onClick={() => setIsAddingCustomSection(!isAddingCustomSection)}
              className="flex items-center justify-between w-full px-3 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Add Custom Topic</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isAddingCustomSection ? 'rotate-180' : ''}`} />
            </button>

            {isAddingCustomSection && (
              <div className="mt-3 space-y-3 animate-fadeIn">
                <input
                  type="text"
                  placeholder="e.g., Advanced Machine Learning"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={customSection}
                  onChange={(e) => setCustomSection(e.target.value)}
                />
                <button
                  onClick={addCustomSection}
                  disabled={!customSection.trim() || isGenerating || isSubmitting}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Topic
                </button>
              </div>
            )}
          </div>

          <button
            onClick={generateQuestions}
            disabled={isGenerating || isSubmitting || !selectedSection}
            className={`w-full mt-5 py-3 px-4 rounded-lg font-medium text-white transition-all transform hover:scale-[1.02] ${
              isGenerating
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'
            } flex items-center justify-center gap-2`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Generating Questions...</span>
              </>
            ) : (
              `Step 4: Generate ${questionCount} Questions`
            )}
          </button>
        </div>
        </div>
      </div>

      {/* Right Panel - Questions */}
      <div className="lg:col-span-2 space-y-6">
        {/* Status Messages */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg animate-fadeIn">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-lg animate-fadeIn">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700 dark:text-green-300">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {!isLoading && !editingQuestion && questions.length > 0 && (
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 px-6 py-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Showing {questions.length} question(s) for section: <span className="font-semibold">{selectedSectionLabel}</span>
              </p>
            </div>
          )}
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin mx-auto w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Loading questions...
              </p>
            </div>
          ) : editingQuestion ? (
            <QuestionEditor
              question={editingQuestion}
              onSave={(updatedQuestion) =>
                handleUpdateQuestion(updatedQuestion, editingQuestion.index)
              }
              onCancel={() => setEditingQuestion(null)}
            />
          ) : questions.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <div className=" ">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-gray-800 dark:text-gray-100 mb-3">
                        <span className="text-indigo-600 dark:text-indigo-400 mr-2">
                          Q{index + 1}.
                        </span>
                        {q.text}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border transition-colors ${
                              q.correctAnswer === i
                                ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block w-6 h-6 rounded-full mr-2 text-center leading-6 text-sm font-medium ${
                                q.correctAnswer === i
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        title="Edit question"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                No questions available
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Pick a topic from the left panel and generate questions. You can then edit, delete, publish, and save from this page.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons (when questions exist) */}
        {questions.length > 0 && (
          <div className="sticky bottom-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-wrap gap-3 justify-between">
            <div className="flex gap-3">
              <button
                onClick={handlePublish}
                disabled={isSubmitting}
                className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  isPublishedState
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {isPublishedState ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Publish Quiz
                  </>
                )}
              </button>
              
              <button
                onClick={() =>
                  navigator.clipboard.writeText(`${window.location.origin}/assessment/${shareCode}`)
                    .then(() => toast.success('Quiz link copied to clipboard!'))
                    .catch(() => toast.error('Failed to copy link'))
                }
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/admin-dashboard"
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
              
              <button
                onClick={saveQuestions}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Questions
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  
  <Toaster position="bottom-right" />
</div>
  );
}