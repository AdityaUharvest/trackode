import connectDB from "@/lib/util";
import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import User from "@/app/model/User";


export async function POST(request: NextRequest) {
    await connectDB();

    const {
        name,
        instructions,
        startDate,
        endDate,
        startTime,
        endTime,
        totalMarks,
        totalQuestions,
        shuffleOptions,
        email,
        publicc,
        duration
    } = await request.json();
    
    console.log(duration)
    const start= `${startTime.hours}:${startTime.minutes}`
    const end= `${endTime.hours}:${endTime.minutes}`
    
    try {
        const foundUser = await User.findOne({email});
        
        if (!foundUser) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }


        const quiz = new Quiz({
            name,
            startDate,
            endDate,
            startTime:start,
            endTime:end,
            totalMarks,
            totalQuestions,
            shuffleOptions: shuffleOptions || false,
            createdBy: foundUser._id,
            active: false,
            instructions,
            public: publicc || false,
            duration: duration || 0
           
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
