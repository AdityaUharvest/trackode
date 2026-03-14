import {NextResponse} from 'next/server';
import { NextRequest } from 'next/server';
import User from '@/app/model/User';
import connectDB from '@/lib/util';
export async function PUT(request: NextRequest) {
    await connectDB();
    try{
        const {updatedData,userId} = await request.json();
        const targetUserId = userId || updatedData?.userId;

        if (!targetUserId) {
            return NextResponse.json({message: 'Missing user id'}, {status: 400});
        }

        const user = await User.findById(targetUserId);
        if (!user) {
            return NextResponse.json({message: 'User not found'}, {status: 404});
        }
       
        user.name = updatedData.name;
        user.email = updatedData.email;
        user.phone = updatedData.phone;
        user.bio= updatedData.bio;
        user.college= updatedData.college;
        user.year= updatedData.year;
        user.branch= updatedData.branch;
        user.github= updatedData.github;
        user.linkedin= updatedData.linkedin;
        user.leetcode= updatedData.leetcode;
        user.twitter = updatedData.twitter;
        user.image = updatedData.image;
        user.dob = updatedData.dob || undefined;
        user.languages = updatedData.languages;
        user.interests = updatedData.interests;
        user.public = updatedData.public;
        
        await user.save();

        return NextResponse.json({message: 'Profile updated successfully', data: updatedData}, {status: 200});

    }
    catch (error) { 
        console.error('Error updating profile:', error);
        return NextResponse.json({message: 'Error updating profile'}, {status: 500});
    }

}