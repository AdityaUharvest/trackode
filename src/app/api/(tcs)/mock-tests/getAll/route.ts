import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/util";
import MockTest from "@/app/model/MoockTest";
import QuizAttempt from "@/app/model/QuizAttempt";
import { getAppSettings } from "@/lib/settings";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const settings = await getAppSettings();
        const session = await auth();
        const isSuperAdmin = session?.user?.isSuperAdmin;

        // 1. Check Maintenance Mode
        if (settings.maintenanceMode && !isSuperAdmin) {
            return NextResponse.json({ 
                success: false, 
                message: "System is under maintenance. Please try again later.",
                maintenance: true 
            }, { status: 503 });
        }

        // 2. Check if Mocks are enabled
        if (!settings.mocksEnabled && !isSuperAdmin) {
            return NextResponse.json({ 
                success: false, 
                message: "Mock tests are currently disabled by the administrator." 
            }, { status: 403 });
        }

        const mocks = await MockTest.find({ public: true, isPublished: true }).sort({ createdAt: -1 });
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
    } catch (error) {
        console.error("Error fetching mock tests:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}