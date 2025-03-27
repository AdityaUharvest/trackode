import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/util";
import Attempted from "@/app/model/Attempted";
import Quiz from "@/app/model/Quiz";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const quizResults = await Attempted.find({ student: session.user.id })
            .populate({
                path: 'quiz',
                match: { public: true }, // Only populate if quiz is public
                select: '-questions' // Exclude questions field for security
            })
            .sort({ attemptedAt: -1 });

        // Filter out attempts where quiz is null (not public)
        const filteredResults = quizResults.filter(attempt => attempt.quiz !== null);

        return NextResponse.json(filteredResults);
    }
    catch (error) {
        console.error("Error fetching quiz results:", error);
        return NextResponse.json(
            { error: "Failed to fetch quiz results" },
            { status: 500 }
        );
    }
}