import Question from "@/app/model/MockQuestions"
import connectDB from "@/lib/util";
export async function getQuestionsBySection(mockTestId: string, section: string) {
  await connectDB();
  return Question.find({ mockTestId, section });
}

export async function saveQuestions(mockTestId: string, section: string, questions: any[]) {
  await connectDB();
  
  // Delete existing questions for this section
  await Question.deleteMany({ mockTestId, section });
  
  // Save new questions
  const questionDocs = questions.map(q => ({
    mockTestId,
    section,
    text: q.text,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || '',
    difficulty: q.difficulty || 3,
    createdAt: new Date()
  }));
  
  return Question.insertMany(questionDocs);
}