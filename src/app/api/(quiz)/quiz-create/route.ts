import connectDB from "@/lib/util";
import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import User from "@/app/model/User";
import { generateShareCode } from "@/app/api/generateShareCode";

export async function POST(request: NextRequest) {
    await connectDB();
    const shareCode = generateShareCode();
    const {
        name,
        instructions,
        startDate,
        endDate,
        
        totalMarks,
        totalQuestions,
        shuffleOptions,
        email,
        publicc,
        duration,
        
    } = await request.json();
    
    console.log(duration)
    
    
    try {
        const foundUser = await User.findOne({email});
        
        if (!foundUser) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        const shareCode= Math.random().toString(36).substring(2, 9).toUpperCase();
        const quiz = new Quiz({
            name,
            startDate,
            endDate,
            totalMarks,
            totalQuestions,
            shuffleOptions: shuffleOptions || false,
            createdBy: foundUser._id,
            active: false,
            instructions,
            public: publicc || false,
            duration: duration/60 || 0,
            shareCode
        });

        await quiz.save();

        return NextResponse.json({
            message: "Quiz Created Successfully",
            success: true,
            quiz: quiz
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Error Occurred",
            success: false,
            error: (error as any).message || "Unknown error"
        }, { status: 500 });
    }
}
