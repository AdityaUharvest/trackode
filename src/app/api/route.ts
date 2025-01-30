import { NextResponse,NextRequest } from "next/server";
import connectDB from "@/lib/util";
import Blog from "@/app/model/Blog"

export async function POST(request: NextRequest) {
    // waiting for the db connect 

    await connectDB();
    const {blogTitle ,blogDes}= await request.json();
    // we have the data now we will store it in blog model 
    try {
        const blog = new Blog(
            {
                blogTitle,
                blogDes
            }
        )
        blog.save();
        return NextResponse.json(
            {
              message :"successfully created",
              success:true
            }
        )
    } catch (error) {
        return NextResponse.json(
            {
                message:"error aa gya",
                success:false
            }
        )
    }
    
}