import { NextRequest ,NextResponse} from "next/server";
import connectDB from "@/lib/util";
// import Attempted from "@/app/model/Attempted";
import Feedback from "@/app/model/MockFeedback";
import {auth} from "@/auth"
export async function POST(request:NextRequest) {
    await connectDB();
    const session = await auth();
    const { quizId, feedback, rating, difficulty } = await request.json();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const feedbackData = {
        quizId,
        feedback,
        rating,
        difficulty,
        userId: session?.user?.id,
        userName: session?.user?.name,
        userEmail: session?.user?.email,

    };
    // Check if the user has already submitted feedback for this quiz
    const existingFeedback = await Feedback.findOne({ quizId, userId: session?.user?.id });
    if (existingFeedback) {
        return NextResponse.json({ message: "Feedback already submitted" });
    }
    // Create a new feedback entry

    const feedbackEntry = new Feedback(feedbackData);
    await feedbackEntry.save();
    return NextResponse.json(feedbackData);
}