// app/api/public-quizzes/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/util";
import Quiz from "@/app/model/Quiz";

export const dynamic = 'force-static'; // Important for SEO

export async function GET() {
  try {
    await connectDB();
    
    const quizzes = await Quiz.find({ public: true })
      .select('name description startDate endDate active section level totalRegistrations')
      .lean();

    return NextResponse.json(quizzes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}