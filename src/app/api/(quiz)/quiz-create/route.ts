import connectDB from "@/lib/util";
import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import User from "@/app/model/User";

export async function POST(request: NextRequest) {
    await connectDB();

    const {
        name,
        description,
        startAt,
        endAt,
        totalMarks,
        totalQuestions,
        duration,
        negativeMarking,
        shuffleOptions,
        isPaid,
        price,
        email,
    } = await request.json();

    console.log(`\n\nemail: ${email}\n\n`);

    if (!name || !description || !startAt || !endAt || !totalMarks || !totalQuestions || !email) {
        return NextResponse.json({
            message: "Please provide all the fields",
            success: false
        }, { status: 400 });
    }
    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        if (new Date(startAt) >= new Date(endAt) || new Date(startAt) <= new Date()) {
            return NextResponse.json({
                message: "Start date must be less than end date and greater than current date",
                success: false
            }, { status: 400 });
        }

        const quiz = new Quiz({
            name,
            description,
            // startDate: new Date(startAt) || new Date(),
            // endDate: new Date(endAt) || new Date(),
            // startAt: new Date(),
            // endAt: new Date(),
            totalMarks,
            totalQuestions,
            duration: duration || 0,
            negativeMarking: negativeMarking || false,
            shuffleOptions: shuffleOptions || false,
            isPaid: isPaid || false,
            price: price || 0,
            createdBy: foundUser._id,
            active: false,
            published: false,
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
