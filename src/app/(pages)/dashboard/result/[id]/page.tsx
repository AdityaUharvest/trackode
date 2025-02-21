// app/dashboard/results/[id]/page.tsx (Server Component)
import connectDB from '@/lib/util';
import Attempted from '@/app/model/Attempted';
import { notFound } from 'next/navigation';
import QuizResultClient from './QuizResultClient'; // Client component

export default async function QuizResultPage({ params }: any) {
  await connectDB();
  const { id } = params;

  const result = await Attempted.findById(id)
    .populate('quiz', 'title')
    .populate('student', 'name');

  if (!result) {
    return notFound();
  }

  // Pass data to the client component
  return <QuizResultClient result={JSON.parse(JSON.stringify(result))} />;
}