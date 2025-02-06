import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import connectDB from "@/lib/util";

export async function GET(req: NextRequest) {
    await connectDB();

    try {
        // Fetch quizzes and populate the 'questions' field with full question objects
        const quiz = await Quiz.find().populate('questions');

        if (quiz.length === 0) {
            return NextResponse.json({
                message: "No quiz found",
                success: false,
            });
        }

        return NextResponse.json({
            message: "Quiz found",
            success: true,
            quiz,
        });

    } catch (error) {
        return NextResponse.json({
            message: "Error Occurred",
            success: false,
            error: `${error}`,
        });
    }
}