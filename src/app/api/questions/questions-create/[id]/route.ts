import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import Question from "@/app/model/Question";
import connectDB from "@/lib/util";

export async function POST(req: NextRequest, { params }: any) {
  try {

    
    await connectDB();
    const { id } =await params;
    console.log(id);
    const { options, question, correctAnswer } = await req.json();

    
    if (!options || !question || !correctAnswer) {
      return NextResponse.json({
        message: "Missing required fields",
        success: false,
      });
    }

    
    console.log(id);
    const quiz = await Quiz.findById(id);
    
    if (!quiz) {
      return NextResponse.json({
        message: "Quiz not found",
        success: false,
      });
    }

  
    const newQuestion = new Question({
      options,
      question,
      correctAnswer,
      quiz: id
    });

    await newQuestion.save();

    
    await Quiz.findByIdAndUpdate(
      id,
      { $push: { questions: newQuestion._id } },
      { new: true }
    );

    return NextResponse.json({
      message: "Question added successfully",
      success: true,
      questionId: newQuestion._id
    });

  } catch (error: any) {
    console.error("Error adding question:", error);
    return NextResponse.json({
      message: error.message || "Failed to add question",
      success: false
    });
  }
}