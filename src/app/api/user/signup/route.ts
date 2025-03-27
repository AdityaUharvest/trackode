
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/model/User";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/util"

export async function POST(req: NextRequest) {
    await connectDB();
    if (req.method === "POST") {
        const { email, name, phone, password } = await req.json(); 
        // req.body is not in the nextrequest type but it is available in nextapirequest
        
        try {
            // Check if the user is already registered
            const isRegistered = await User.findOne({ email });
            if (isRegistered) {
                return NextResponse.json(
                    {   
                        message: "User is already registered",
                        success: false,
                    }
                );
            } else {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = new User({
                    name: name,
                    phone: phone,
                    email: email,
                    password: hashedPassword,
                });

                await user.save(); // Ensure the save is awaited

                return NextResponse.json(
                    {
                        message:"Successfully Created",
                        success: true,
                    },
                
                );
            }
        } catch (error) {
            return NextResponse.json(
                {
                    message: "Unwanted error occurred",
                    success: false,
                    error: `${error}`,
                },
                
            );
        }
    } else {
        return NextResponse.json(
            { message: "Trackode naam sun ke hack kar lega kya fire hai main" },
            { status: 405 } 
        );
    }
}
