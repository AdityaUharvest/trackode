import { NextRequest,NextResponse } from "next/server";
import connectDB from "@/lib/util";
import MockTest from "@/app/model/MoockTest";
import QuizAttempt from "@/app/model/QuizAttempt";
export async function GET(request: NextRequest) {
    await connectDB();
    const mocks = await MockTest.find({public:true,isPublished:true}).sort({createdAt:-1});
    // filter out those results of these mocks
    const mockIds = mocks.map((mock) => mock._id);
    const quizAttempts = await QuizAttempt.find({ quizId: { $in: mockIds } });
    const quizAttemptMap = quizAttempts.reduce((acc, attempt) => {
        if (!acc[attempt.quizId]) {
            acc[attempt.quizId] = [];
        }
        acc[attempt.quizId].push(attempt);
        return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
        mocks: mocks.map((mock) => ({
            ...mock.toObject(),
            quizAttempts: quizAttemptMap[mock._id] || [],
        })),
    
    });
}