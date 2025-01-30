import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import connectDB from "@/lib/util";
export async function GET(req: NextRequest) {
    await connectDB();
    if (req.method === "GET") {
        try {
            const quiz = await Quiz.find();
            if(quiz.length===0){
                return NextResponse.json(
                    {
                        message: "No quiz found",
                        success: false,
                    }
                );
            }
            return NextResponse.json(
                {
                    message: "Quiz found",
                    success: true,
                    quiz,
                }
            )

        } catch (error) {
            return NextResponse.json({ message: "Error Occured", success: false, error: `${error}` });
        }
    } else {
        return NextResponse.json({ message: "Method not allowed", success: false });
    }
}
