// app/api/public-quizzes/route.ts
import connectDB from "@/lib/util";
import { NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import Attempted from "@/app/model/Attempted";

export async function GET() {
  try {
    await connectDB();
    
    // Get only public quizzes with basic info
    const quizzes = await Quiz.find({ public: true })
        .select('name description startDate endDate active section level')
        .lean() as unknown as Array<{ _id: string, name: string, description: string, startDate: Date, endDate: Date, active: boolean, section: string, level: string }>;
    
    // Get registration counts (public data)
    const registrationCounts = await Attempted.aggregate([
      {
        $match: {
          quiz: { $in: quizzes.map(q => q._id) }
        }
      },
      {
        $group: {
          _id: "$quiz",
          count: { $sum: 1 }
        }
      }
    ]);

    // Combine data without any user-specific info
    const publicQuizzes = quizzes.map(quiz => ({
      ...quiz,
      _id: quiz._id,
      totalRegistrations: registrationCounts.find(rc => 
        rc._id.toString() === quiz._id
      )?.count || 0,
      // Don't include user-specific fields here
    }));

    return NextResponse.json({
      success: true,
      quizes: publicQuizzes
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch public quizzes" },
      { status: 500 }
    );
  }
}