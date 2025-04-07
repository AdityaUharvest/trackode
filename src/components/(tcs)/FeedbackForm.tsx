'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  quizTitle: string;
  theme: 'light' | 'dark';
}

export function FeedbackForm({ isOpen, onClose, quizId, quizTitle, theme }: FeedbackFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId,
          rating,
          difficulty,
          comments
        }),
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-black/70' : 'bg-black/50'}`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`relative rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <button 
            onClick={onClose}
            className={`absolute top-4 right-4 p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>

          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6"
              >
                <ThumbsUp className="h-7 w-7 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3">Thank You!</h3>
              <p className="mb-6 text-gray-500 dark:text-gray-400">Your feedback helps us improve.</p>
              <Button
                onClick={onClose}
                className={`w-full max-w-xs mx-auto ${theme === 'dark' ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
              >
                View Results
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-1">
                <h2 className="text-2xl font-bold mb-1">How was your experience?</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{quizTitle}</p>
              </div>
              
              <div className="py-6 border-b border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium mb-4 text-center">How would you rate this quiz?</label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-full transition-all ${rating && star <= rating ? 
                        'text-yellow-400 scale-110' : 
                        theme === 'dark' ? 'text-gray-500 hover:text-yellow-300' : 'text-gray-300 hover:text-yellow-500'}`}
                    >
                      <Star className="w-7 h-7 fill-current" />
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-between text-xs mt-3 px-2 text-gray-500 dark:text-gray-400">
                  <span>Needs work</span>
                  <span>Perfect!</span>
                </div>
              </div>
              
              <div className="py-6 border-b border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium mb-4 text-center">How difficult was this quiz?</label>
                <div className="flex justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setDifficulty(1)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${difficulty === 1 ? 
                      (theme === 'dark' ? 'bg-green-800/80 text-green-100' : 'bg-green-100 text-green-800') : 
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Too Easy</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setDifficulty(3)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${difficulty === 3 ? 
                      (theme === 'dark' ? 'bg-blue-800/80 text-blue-100' : 'bg-blue-100 text-blue-800') : 
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <span>Just Right</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setDifficulty(5)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${difficulty === 5 ? 
                      (theme === 'dark' ? 'bg-red-800/80 text-red-100' : 'bg-red-100 text-red-800') : 
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Too Hard</span>
                  </motion.button>
                </div>
              </div>
              
              <div className="py-6">
                <label htmlFor="comments" className="block text-sm font-medium mb-3">
                  Any additional feedback?
                </label>
                <textarea
                  id="comments"
                  rows={4}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-300'}`}
                  placeholder="What did you like or dislike about this quiz?"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  Skip Feedback
                </Button>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting || (!rating && !difficulty && !comments)}
                    className={`w-full h-12 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Submitting...
                      </span>
                    ) : 'Submit Feedback'}
                  </Button>
                </motion.div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}