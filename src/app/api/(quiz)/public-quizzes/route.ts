// app/api/public-quizzes/route.ts
import connectDB from "@/lib/util";
import { NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import Attempted from "@/app/model/Attempted";
import { getAppSettings } from "@/lib/settings";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    const settings = await getAppSettings();
    const session = await auth();
    const isSuperAdmin = session?.user?.isSuperAdmin;

    // 1. Check Maintenance Mode
    if (settings.maintenanceMode && !isSuperAdmin) {
        return NextResponse.json({ 
            success: false, 
            message: "System is under maintenance. Please try again later.",
            maintenance: true 
        }, { status: 503 });
    }

    // 2. Check if Quizzes are enabled
    if (!settings.quizzesEnabled && !isSuperAdmin) {
        return NextResponse.json({ 
            success: false, 
            message: "Quizzes are currently disabled by the administrator." 
        }, { status: 403 });
    }
    
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
    console.error("Error fetching public quizzes:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch public quizzes" },
      { status: 500 }
    );
  }
}