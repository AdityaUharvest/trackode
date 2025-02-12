import { NextRequest ,NextResponse} from "next/server";
import connectDB from "@/lib/util";
import Attempted from "@/app/model/Attempted";
import {auth} from "@/auth"
export async function GET(req: NextRequest) {
    await connectDB();
    
    const session= await auth();
    try {
        const quizResults = await Attempted.find({ student: session?.user?.id })
          .populate('quiz')
          .sort({ attemptedAt: -1 })
          
        return NextResponse.json(quizResults);
    }
    catch (error) {
        return NextResponse.json({ error});
    }
}