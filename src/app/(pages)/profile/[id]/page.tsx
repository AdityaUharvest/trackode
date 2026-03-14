import { Metadata } from 'next';
import User from '@/app/model/User';
import connectDB from '@/lib/util';
import Profile from '@/components/Profile';
import mongoose from 'mongoose';
import { auth } from '@/auth';

interface PageProps {
  params: {
    id: string;
  };
}

// Define a basic user type based on your model
type UserType = {
  _id?: any;
  name?: string;
  email?: string;
  bio?: string;
  image?: string;
  // Add other fields from your model as needed
  leetcode?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  college?: string;
  branch?: string;
  year?: string;
  interests?: string[];
  languages?: string[];
  public?: boolean;
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  await connectDB();
  const identifier = decodeURIComponent(params.id || '');
  const query = mongoose.Types.ObjectId.isValid(identifier)
    ? { _id: identifier }
    : { email: identifier };
  const user = await User.findOne(query).lean().exec() as UserType | null;

  return {
    title: `${user?.name || 'User'}'s Profile`,
    description: user?.bio || 'Profile page',
  };
}

export default async function Page({ params }: any) {
  await connectDB();
  const identifier = decodeURIComponent(params.id || '');
  const query = mongoose.Types.ObjectId.isValid(identifier)
    ? { _id: identifier }
    : { email: identifier };
  const user = await User.findOne(query).lean().exec() as UserType | null;
  const session = await auth();

  if (!user) {
    return <div>User not found</div>;
  }

  const isOwner = String(session?.user?.id || '') === String(user._id || '');
  const isPrivateProfile = !isOwner && user.public === false;

  const safeUser = isOwner
    ? user
    : {
        _id: user._id,
        name: user.name,
        image: user.image,
        bio: user.bio,
        college: user.college,
        branch: user.branch,
        year: user.year,
        leetcode: user.public ? user.leetcode : '',
        github: user.public ? user.github : '',
        linkedin: user.public ? user.linkedin : '',
        twitter: user.public ? user.twitter : '',
        interests: Array.isArray(user.interests) ? user.interests : [],
        languages: Array.isArray(user.languages) ? user.languages : [],
        skills: Array.isArray((user as any).skills) ? (user as any).skills : [],
        public: user.public,
        followerCount: Array.isArray((user as any).followers) ? (user as any).followers.length : 0,
      };

  return <Profile user={safeUser} isOwner={isOwner} isPrivateProfile={isPrivateProfile} />;
}