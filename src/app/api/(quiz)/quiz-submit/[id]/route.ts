import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/util";
import Question from "@/app/model/Question";
import Quiz from "@/app/model/Quiz";
import Result from "@/app/model/Attempted";
import Attempted from "@/app/model/Attempted";


export async function POST(req: NextRequest, { params }: any) {
  await connectDB();
  const { id } =await params;

  // Get authenticated user
  
   
  const quiz = await Quiz.findById(id);
  const startTime= quiz.startTime;
  
  if (!quiz) {
    return NextResponse.json(
      { message: "Quiz not found" },
      { status: 404 }
    );
  }

  const { answers,session } = await req.json();
  
  const questions = await Question.find({ _id: { $in: quiz.questions } });
  
  let score = 0;
  const results = [];

  for (const question of questions) {
    const userAnswer = answers[question._id] || "No answer provided";
    const isCorrect = userAnswer === question.correctAnswer;
    
    if (isCorrect) score++;

    results.push({
      question: question.question,
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect
    });
  }
  console.log(quiz.name)
  // answer me question ki id aa rhi hai aur uss question ka user ka answer aa rha hai
  // Store result in database
  const result = await Attempted.create({
    student: session.user.id,
    quiz: id,
    title:quiz.name,
    score,
    totalQuestions: questions.length,
    answers: results,
    attempted: true,
    correctAnswers: score,
    incorrectAnswers: questions.length - score,
    startTime:quiz.startTime,
  });

  return NextResponse.json({
    success:true,
    message: "Quiz submitted successfully",
    resultId: result._id,
    score,
    incorrectAnswers: questions.length - score,
    totalQuestions: questions.length

  });
}