import { Metadata } from 'next';
import FreeTechQuiz from '@/components/FreeTechQuiz';

interface Props {
  params: { techname: string };
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  
  const techName = params.techname;
  
  return {
    title: `${techName} Quizzes`,
    description: `Explore free ${techName} quizzes for all skill levels. Practice and test your ${techName} knowledge with our interactive quizzes.`,
    keywords: [`${techName} quizzes`, `${techName} tests`, `free ${techName} questions`, `learn ${techName}`],
    openGraph: {
      title: `${techName} Quizzes | QuizApp`,
      description: `Practice ${techName} with our free interactive quizzes`,
      url: `https://trackode.in/programming-quizzes/${techName}`,
      type: 'website',
    },
  };
}

export default function FreeTechQuizPage({ params }:any) {
  return <FreeTechQuiz params={params} />;
}