import connectDB from "@/lib/util";
import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import Attempted from "@/app/model/Attempted";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get user session
    const session = await auth();
    const userId = session?.user?.id ? new mongoose.Types.ObjectId(session.user.id) : null;

    // Find all quizzes
    const quizzes = await Quiz.find({public:true}).lean()
    
    // Get all registration counts in a single query
    const registrationCounts = await Attempted.aggregate([
      {
        $group: {
          _id: "$quiz",
          count: { $sum: 1 }
        }
      }
    ]);

    // Create a map of quizId to registration count
    const registrationMap = new Map(
      registrationCounts.map(item => [item._id.toString(), item.count])
    );

    // Get user's attempted quizzes if logged in
    let userAttempts = new Map();
    if (userId) {
      const attempts = await Attempted.find({ student: userId });
      userAttempts = new Map(
        attempts.map(attempt => [attempt.quiz.toString(), attempt])
      );
    }
    console.log("userAttempts", userAttempts);
    // Map quizzes with all required data
    const quizzesWithData = quizzes.map(quiz => {
      const quizId = quiz?._id.toString();
      return {
        ...quiz,
        totalRegistrations: registrationMap.get(quizId) || 0,
        userPlayed: userId ? userAttempts.has(quizId) : false,
        userScore: userId ? (userAttempts.get(quizId)?.correctAnswers ||0) : 0,
        maxScore: userId ? (userAttempts.get(quizId)?.totalQuestions || 0) : 0
      };
    });

    // Sort by registration count (descending)
    quizzesWithData.sort((a, b) => b.totalRegistrations - a.totalRegistrations);

    return NextResponse.json({
      success: true,
      message: "Quizzes found with registration counts and user status",
      quizes: quizzesWithData
    });

  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch quizzes"
      },
      { status: 500 }
    );
  }
}