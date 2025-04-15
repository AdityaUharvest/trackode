import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/util";
import Question from "@/app/model/Question";
import Quiz from "@/app/model/Quiz";
import Attempted from "@/app/model/Attempted";

export async function POST(req: NextRequest, { params }: any) {
  await connectDB();
  const { id } = params;

  // Find the quiz
  const quiz = await Quiz.findById(id);
  
  if (!quiz) {
    return NextResponse.json(
      { message: "Quiz not found" },
      { status: 404 }
    );
  }

  // Get the data from the request
  const { 
    answers, 
    userId, 
    quizId, 
    fullScreenViolations, 
    visibilityChanged, 
    submittedAutomatically,
    timeLeft 
  } = await req.json();

  // Get all questions for this quiz
  const questions = await Question.find({ _id: { $in: quiz.questions } });

  // Calculate score and prepare results
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

  // Store result in database
  const result = await Attempted.create({
    student: userId,
    createdBy: quiz.createdBy,
    quiz: id,
    title: quiz.name,
    score,
    totalQuestions: questions.length,
    answers: results,
    attempted: true,
    correctAnswers: score,
    incorrectAnswers: questions.length - score,
    startTime: quiz.startTime,
    // Add new fields from frontend
    fullScreenViolations,
    visibilityChanged,
    submittedAutomatically,
    timeLeft
  });

  return NextResponse.json({
    success: true,
    message: "Quiz submitted successfully",
    resultId: result._id,
    score,
    incorrectAnswers: questions.length - score,
    totalQuestions: questions.length
  });
}