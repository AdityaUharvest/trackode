import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import connectDB from "@/lib/util";
export async function GET(req: NextRequest, { params }: any) {
    await connectDB();
    try {
        const { id } = params;
        console.log(`\n\nQuiz ID: ${id}\n\n`);
        if (req.method === "GET") {
            try {
                const quiz = await Quiz.findOne({ _id: id });
                if (!quiz) {
                    return NextResponse.json({
                        message: "No quiz found",
                        success: false,
                    });
                }
                return NextResponse.json({
                    message: "Quiz found",
                    success: true,
                    quiz,
                });
            } catch (error) {
                return NextResponse.json({ message: "Error Occured", success: false, error: `${error}` });
            }
        } else {
            return NextResponse.json({ message: "Method not allowed", success: false });
        }
    } catch (error) {
        return NextResponse.json(
            {
                message: "Unwanted error occurred",
                success: false,
                error: `${error}`,
            },

        );
    }




}
