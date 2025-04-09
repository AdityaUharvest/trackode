import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/util";
import Quiz from "@/app/model/Quiz";
export async function PUT(req: NextRequest, { params }: any) {
    const { id } = await params;
    await connectDB();
    try {
        const { updatedQuiz } = await req.json();
        console.log(updatedQuiz.name);
        const quiz = await Quiz.findByIdAndUpdate(id,
            { 
                name: updatedQuiz.name,
                instructions: updatedQuiz.instructions,
                startTime: updatedQuiz.startTime,
                endTime: updatedQuiz.endTime,
                totalMarks: updatedQuiz.totalMarks,
                totalQuestions: updatedQuiz.totalQuestions,
                startDate: updatedQuiz.startDate,
                endDate: updatedQuiz.endDate,
                suffleOptions: updatedQuiz.suffleOptions,
                active: !updatedQuiz.active,


            }
        );
        if (!quiz) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Quiz not found"
                }
            )
        }
        return NextResponse.json(
            {
                success: true,
                message: "Quiz updated successfully",
                quiz
            }
        )
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Quiz not found"
            }
        )

    }




}
export async function DELETE(req: NextRequest, { params }: any) {   
    const { id } = await params;
    await connectDB();
    try {
        const quiz = await Quiz.findByIdAndDelete(id);
        if (!quiz) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Quiz not found"
                }
            )
        }
        return NextResponse.json(
            {
                success: true,
                message: "Quiz deleted successfully",
                quiz
            }
        )
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Quiz not found"
            }
        )

    }
}