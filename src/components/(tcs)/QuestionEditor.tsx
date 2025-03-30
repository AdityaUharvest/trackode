import React, { useState } from 'react';

interface Question {
  _id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  section?: string;
  mockTestId?: string;
}

interface QuestionEditorProps {
  question: Question;
  onSave: (editedQuestion: Question) => void;
  onCancel: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onSave, onCancel }) => {
  const [editedQuestion, setEditedQuestion] = useState<Question>({ ...question });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleCorrectAnswerChange = (index: number) => {
    setEditedQuestion(prev => ({
      ...prev,
      correctAnswer: index
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedQuestion);
  };

  return (
    <div className="border p-4 rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-medium mb-4">Edit Question</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Question Text</label>
          <textarea
            name="text"
            value={editedQuestion.text}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows={3}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Options</label>
          {editedQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="mr-2 w-6">{String.fromCharCode(65 + index)}.</span>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
                required
              />
              <input
                type="radio"
                name="correctAnswer"
                checked={editedQuestion.correctAnswer === index}
                onChange={() => handleCorrectAnswerChange(index)}
                className="ml-3"
              />
              <span className="ml-1 text-sm text-gray-600">Correct</span>
            </div>
          ))}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Explanation (Optional)</label>
          <textarea
            name="explanation"
            value={editedQuestion.explanation || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows={2}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionEditor;