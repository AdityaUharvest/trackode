import connectDB from "@/lib/util";
import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";

export async function POST(request: NextRequest) {
    await connectDB();
    const { name, startDate, endDate, endTime, startTime, totalMarks, totalQuestions, user } = await request.json();
    const endTimee = `${endTime.hours}:${endTime.minutes}`;
    const startTimee = `${startTime.hours}:${startTime.minutes}`
    if (request.method === "POST") {
        try {
            const quiz = await new Quiz(
                {
                    name,
                    startDate,
                    endDate,
                    endTime: endTimee,
                    startTime: startTimee,
                    totalMarks,
                    totalQuestions,
                    isActive: false,
                    createdBy: user,
                }
            )
            quiz.save();
            return NextResponse.json(
                {
                    message: "Quiz Created",
                    success: true,
                }
            )
        } catch (error) {
            return NextResponse.json(
                {
                    message: "Error Occured",
                    success: false,
                    error: `${error}`
                }
            )
        }
    }
    else {
        return NextResponse.json(
            {
                message: "Method not allowed",
                success: false
            }
        );
    }
}
