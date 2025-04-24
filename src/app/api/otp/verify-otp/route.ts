import { NextRequest,NextResponse } from "next/server";
import OtpStorage from "@/app/model/OtpStorage";
import connectDB from "@/lib/util";
export async function POST(request: NextRequest) {
    await connectDB();
    try{
        //now getting the data from request
        const {email, otp } = await request.json();
        // we got the email 
        //checking either there is email and otp in the otpStorage or not
        const otpData = await OtpStorage
            .findOne({email})
        if(!otpData){
            return NextResponse.json({success:false,message:"OTP not found"})
        }
        const isOTPCorrect = otpData.otp === otp;
        const isOTPExpired = (Date.now() - otpData.createdAt) > 10 * 60 * 1000; // 10 minutes in milliseconds
        if(isOTPExpired){
            return NextResponse.json({success:false,message:"OTP expired"})
        }
        if(!isOTPCorrect){
            return NextResponse.json({success:false,message:"Incorrect OTP"})
        }
        // If OTP is correct and not expired, delete the OTP data from the database
        await OtpStorage.deleteOne({
            email
        })
        return NextResponse.json({success:true,message:"OTP verified successfully"})
        
        
    }
    catch(error){
        console.log(error)
        return NextResponse.json({success:false,message:"Internal server error"})
    }
    // return NextResponse.json({success:true,message:"OTP verified successfully"})
}