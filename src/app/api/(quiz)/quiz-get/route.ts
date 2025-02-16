import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import Question from "@/app/model/Question";
import connectDB from "@/lib/util";
import { auth } from "@/auth";
import mongoose from "mongoose";
import Attempted from "@/app/model/Attempted";

export async function GET(req: NextRequest) {
    await connectDB();

    if (req.method === "GET") {
        try {
            const session = await auth();
            
            if (!session?.user?.id) {
                return NextResponse.json({
                    message: "Unauthorized",
                    success: false,
                }
            );
            }

            // Convert string MongoDB ID to ObjectId
            const userId = new mongoose.Types.ObjectId(session.user.id);
           
            // Find quizzes for this user
            const quizzes = await Quiz.find({ createdBy: userId }).populate('questions');
            
            let participants = await Attempted.find({quiz:{$in:quizzes.map(quiz=>quiz._id)}}).sort({attemptedAt:-1}).populate('student').populate('quiz')
            
            
            const recentParticipants = await Attempted.find({quiz:quizzes[quizzes.length-1]._id})
            if (!quizzes || quizzes.length === 0) {
                return NextResponse.json({
                    message: "No quizzes found",
                    success: false,  
                });
            }
          
           
            return NextResponse.json({
                message: "Quizzes found",
                success: true,
                quizzes,
                participants,
                recentParticipants
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