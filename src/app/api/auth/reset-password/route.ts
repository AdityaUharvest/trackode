import { NextRequest } from "next/server";
import connectDB from "@/lib/util";
import User from "@/app/model/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function POST(request: NextRequest) {
    await connectDB();
    try{
        const {email ,newPassword} = await request.json();
        if (!email || !newPassword){
            return NextResponse.json({success:false,message:"Email and new password are required"})
        }
        const user = await User.findOne({email});
        if (!user){
            return NextResponse.json({success:false,message:"User not found"})
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return NextResponse.json({success:true,message:"Password reset successfully"})

    }
    catch(error){
        console.log(error)
        return NextResponse.json({success:false,message:"Internal server error"})
    }
}