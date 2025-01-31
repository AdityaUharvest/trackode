import { NextResponse,NextRequest } from "next/server";
import connectDB from "@/lib/util";
import Question from "@/app/model/Question";
import Quiz from "@/app/model/Quiz";
export async function DELETE(req :NextRequest,{params}:any){
    await connectDB();
    const { id } = await params;
    console.log("id",id);
    try {
        const question= await Question.findByIdAndDelete(id);
        console.log("question",question);
        if (!question) {
            return NextResponse
                .json({ message: "Question not found", success: false });
        }
        
        await Quiz.updateMany(
            { questions: id },
            { $pull: { questions: id } }
        );
        return NextResponse.json(
            {
                message: "Question deleted successfully",
                success: true
            }
        )
    }
    catch (error) {
        return NextResponse.json({
            message: error || "Failed to delete question",
            success: false
        });
    }
}


