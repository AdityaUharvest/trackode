import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import connectDB from "@/lib/util";
import { auth } from "@/auth";
import mongoose from "mongoose";
export async function GET(req: NextRequest) {
    await connectDB();

    if (req.method !== "GET") {
        return NextResponse.json({
            message: "Method not allowed",
            success: false,
        }, { status: 405 });
    }

    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({
                message: "Unauthorized",
                success: false,
            }, { status: 401 });
        }

        const createdBy = new mongoose.Types.ObjectId(session.user.id);

        // Fetch all quizzes created by this user
        const quizzes = await Quiz.find({ createdBy }).populate('questions');
        console.log(quizzes)
        if (!quizzes || quizzes.length === 0) {
            return NextResponse.json({
                message: "No quizzes found for this user",
                success: false,
                
            });
        }

        return NextResponse.json({
            message: "Quizzes found",
            success: true,
            quizzes,
        });

    } catch (error) {
        console.error('Error in GET quiz:', error);
        return NextResponse.json({
            message: "Error Occurred",
            success: false,
            error: `${error}`,
        }, { status: 500 });
    }
}
