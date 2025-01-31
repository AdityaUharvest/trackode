import { NextRequest,NextResponse } from "next/server";
import connectDB from "@/lib/util";
import Question from "@/app/model/Question";
import Quiz from "@/app/model/Quiz";
export async function PUT(req :NextRequest,{params}:any){
    await connectDB();
    const { id } = await params;
    console.log(id);
    const { options, question, correctAnswer } = await req.json();
    const quiz = await Quiz.findById(id);
    try {
        const questions= await Question.findByIdAndUpdate(id,{
            options:options,
            question:question,
            correctAnswer
        });
        console.log(questions);

        if (!questions) {
            return NextResponse
                .json({ message: "Question not found", success: false });
        }
        // question.options=options;
        // question.question=question;
        // question.correctAnswer=correctAnswer;
        await question.save();
        return NextResponse.json(
            {
                message: "Question updated successfully",
                success: true
            }
        )
    }
    catch (error) {
        return NextResponse.json({
            message: error || "Failed to update question",
            success: false
        });
    }
}