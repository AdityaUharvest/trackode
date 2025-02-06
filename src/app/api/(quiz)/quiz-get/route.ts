import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import Question from "@/app/model/Question";
import connectDB from "@/lib/util";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    await connectDB();

    if (req.method === "GET") {
        try {
            const session = await auth();
            console.log(session);
            if (!session?.user?.id) {
                return NextResponse.json({
                    message: "Unauthorized",
                    success: false,
                }
            );
            }

            // Convert string MongoDB ID to ObjectId
            const userId = new mongoose.Types.ObjectId(session.user.id);
            console.log(userId)
            // Find quizzes for this user
            const quizzes = await Quiz.find({ createdBy: userId }).populate('questions');

            console.log('Searching for quizzes with userId:', userId);

            if (!quizzes || quizzes.length === 0) {
                return NextResponse.json({
                    message: "No quizzes found for this user",
                    success: false,
                    debug: {
                        searchedId: userId.toString(),
                        sessionUserId: session.user.id
                    }
                });
            }

            // console.log(`\n\nQuiz ID: ${quizzes}\n\n`);
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
    } else {
        return NextResponse.json({
            message: "Method not allowed",
            success: false,
        }, { status: 405 });
    }
}