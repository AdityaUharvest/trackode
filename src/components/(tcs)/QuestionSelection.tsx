import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionEditor from './QuestionEditor';

interface Question {
  _id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  section?: string;
  mockTestId?: string;
  index?: number; // Added for editing functionality
}

interface QuestionSectionProps {
  mockTestId: string;
  section: string;
  sectionName: string;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({ mockTestId, section, sectionName }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get<Question[]>(`/api/mock-tests/${mockTestId}/questions?section=${section}`);
        setQuestions(response.data);
        setIsLoading(false);
      } catch (err) {
        setError( 'Failed to load questions');
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [mockTestId, section]);

  const generateQuestions = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await axios.post<{ questions: Question[] }>('/api/generate-questions', {
        prompt: `Generate 10 ${sectionName} questions for TCS NQT exam with 4 options each and correct answer marked. Format as JSON.`
      });
      
      setQuestions(response.data.questions);
    } catch (err) {
      setError( 'Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveQuestions = async () => {
    try {
      await axios.post(`/api/mock-tests/${mockTestId}/questions`, {
        section,
        questions
      });
      alert('Questions saved successfully!');
    } catch (err) {
      setError( 'Failed to save questions');
    }
  };

  const handleEdit = (index: number) => {
    setEditingQuestion({ ...questions[index], index });
  };

  const handleUpdate = (updatedQuestion: Question) => {
    if (typeof updatedQuestion.index !== 'number') return;
    
    const updatedQuestions = [...questions];
    updatedQuestions[updatedQuestion.index] = updatedQuestion;
    setQuestions(updatedQuestions);
    setEditingQuestion(null);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  if (isLoading) return <div>Loading questions...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{sectionName} Questions</h2>
        <div className="space-x-2">
          <button
            onClick={generateQuestions}
            disabled={isGenerating}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
          >
            {isGenerating ? 'Generating...' : 'Generate Questions'}
          </button>
          {questions.length > 0 && (
            <button
              onClick={saveQuestions}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Questions
            </button>
          )}
        </div>
      </div>
      
      {editingQuestion ? (
        <QuestionEditor
          question={editingQuestion}
          onSave={handleUpdate}
          onCancel={() => setEditingQuestion(null)}
        />
      ) : (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No questions yet. Click "Generate Questions" to get started.
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mb-3">{question.text}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-2 border rounded ${
                        question.correctAnswer === optIndex ? 'bg-green-50 border-green-300' : ''
                      }`}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </div>
                  ))}
                </div>
                
                {question.explanation && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionSection;