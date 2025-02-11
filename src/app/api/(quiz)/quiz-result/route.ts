import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import User from "@/app/model/User";
import Attempted from "@/app/model/Attempted";
import connectDB from "@/lib/util";
export async function GET(req:NextRequest,{params}:any){
    
    //now will can get all the param like I want quiz id 
    const searchUrl = new URL(req.nextUrl);
    const quizId=searchUrl.searchParams.get("quizId");
    
    // now will will get all the attempted objcts
    await connectDB();
    try {
        const attempted=await Attempted.find({quiz:quizId}).populate("student")
        console.log(attempted.length)
        if(attempted){
            return NextResponse.json(
                {
                    message:"Successfully fetched the data",
                    success:true,
                    attempted
                }
            )
        }
        return NextResponse.json (
            {
                message:"No result found",
                success:false
            }
        )

    } catch (error) {
        return NextResponse.json (
            {
                message:"some error occrured",
                success:false
            }
        )
    }
}