// get the profile of the user
import {NextResponse} from 'next/server';
import { NextRequest } from 'next/server';
import User from '@/app/model/User';
import connectDB from '@/lib/util';
import { auth } from '@/auth';
export async function GET(request: NextRequest ) {
    await connectDB();
    const session = await auth();


    try{

        
         // Extract userId from params
        const user = await User.findOne({email:session?.user?.email});
        console.log(user)
        if (!user) {
            return NextResponse.json({message: 'User not found'}, {status: 404});
        }
        return NextResponse.json({message: 'Profile fetched successfully', data: user}, {status: 200});
    }
    catch (error) { 
        console.error('Error fetching profile:', error);
        return NextResponse.json({message: 'Error fetching profile'}, {status: 500});
    }
}