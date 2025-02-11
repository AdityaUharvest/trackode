import { NextRequest, NextResponse } from "next/server";
import Attempted from "@/app/model/Attempted";
import connectDB from "@/lib/util";
// now we will make the function 
export async function GET(req:NextRequest){
    await connectDB();
    try {
        const {searchParams }= new URL(req.url);
        console.log(searchParams);
        const id = searchParams.get('id');
        const userId= searchParams.get('userId');
        
        
        const attempted = await Attempted.find({student:userId,quiz:id});
        console.log("attempted",attempted)
        if (!attempted==null){
            return NextResponse.json(
                {
                    success:true,
                    message:"You have already given the quiz"
                }
            )
        }
        
        return NextResponse.json (
            {
                message:"Not Given",
                success:false
            }
        )
    } catch (error) {
        return NextResponse.json (
            {
                message:"Some error occured",
                success:false
            }
        )
    }
}