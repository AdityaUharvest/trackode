// checking if the user has played this or not 
import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/util';
import QuizAttempt from '@/app/model/QuizAttempt';
import { auth } from '@/auth';
import MockTest from '@/app/model/MoockTest';
export async function GET(req: NextRequest, { params }: any) {
    const { shareCode } = await params;
    await connectDB();
    const session = await auth();
    const userId = session?.user?.id;
    const quizId = await MockTest.findOne({ shareCode });
    
    const isAttempted = await QuizAttempt.findOne({ quizId: quizId, userId: userId });
    
    if (isAttempted) {
        return NextResponse.json({
            isAttempted: true,
            
        }
           
        );
    }
    return NextResponse.json(
        false
        
    );
}