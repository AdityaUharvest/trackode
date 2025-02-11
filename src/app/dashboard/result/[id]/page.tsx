// app/dashboard/results/[id]/page.tsx
import {auth} from "@/auth";
import connectDB from "@/lib/util";
import Attempted from "@/app/model/Attempted";
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default async function QuizResultPage({ params }:any) {
  await connectDB();
  const session = await auth();
  
  const {id} = await params;
  console.log(id)
  const result = await Attempted.findById(id).populate('quiz', 'title')
    .populate('student', 'name');
  console.log(result)
  if (!result || (result.student as any)._id.toString() !== session?.user?.id) {
  
    return notFound();
  }
  
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-4">
            {(result as any).title} Result
          </h1>
          
          <div className="mb-8">
            <div className="grid grid-cols-2  bg-gray-800 gap-4 mb-4">
              <div className="bg-green-600 p-4 rounded-lg">
                <p className="font-semibold">Score:</p>
                <p className="text-2xl">{result.score}/{result.totalQuestions}</p>
              </div>
              <div className="bg-blue-600 p-4 rounded-lg">
                <p className="font-semibold">Date Attempted:</p>
                <p>{new Date(result.attemptedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {result.answers.map((answer: any, index: number) => (
              <div 
                key={index}
                className={`p-6 rounded-lg  border-l-4 ${
                  answer.isCorrect 
                    ? 'border-green-700 bg-green-100' 
                    : 'border-red-500 bg-red-100'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Question {index + 1}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    answer.isCorrect 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                
                <p className="mb-4 text-gray-900">{answer.question}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                    <p className="p-2 bg-gray-800 rounded border">{answer.userAnswer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Correct Answer:</p>
                    <p className="p-2 bg-gray-800 rounded border">{answer.correctAnswer}</p>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}