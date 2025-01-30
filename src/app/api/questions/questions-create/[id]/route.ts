import {NextRequest,NextResponse} from 'next/server';
import Quiz from '@/app/model/Quiz';
import Question from '@/app/model/Question';
import connectDB from '@/lib/util';
export async function POST(
    req: NextRequest,
    {params}: any
)
// 
{
    const {id}= params;
    const {options,question,correctAnswer}=await req.json();
    const quiz = await Quiz.findOne({_id:id});
    // now we got the quiz id 
    if(!quiz){
        return NextResponse.json({
            message: "No quiz found",
            success: false,
        });
    }
    console.log(options);
    console.log(question);
    console.log(correctAnswer);
    // now we have all the data
    const questions = new Question({

    });
    
    // this is the api to add a question

}