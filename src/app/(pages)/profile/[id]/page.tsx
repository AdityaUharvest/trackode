import { Metadata } from 'next';
import User from '@/app/model/User';
import connectDB from '@/lib/util';
import Profile from '@/components/Profile';
import mongoose from 'mongoose';
import { auth } from '@/auth';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectDB();
  const resolvedParams = await params;
  const identifier = decodeURIComponent(resolvedParams.id || '');
  const query = mongoose.Types.ObjectId.isValid(identifier)
    ? { _id: identifier }
    : { email: identifier };
  const user = await User.findOne(query).lean().exec() as UserType | null;

  return {
    title: `${user?.name || 'User'}'s Profile`,
    description: user?.bio || 'Profile page',
  };
}

export default async function Page({ params }: PageProps) {
  await connectDB();
  const resolvedParams = await params;
  const identifier = decodeURIComponent(resolvedParams.id || '');
  const query = mongoose.Types.ObjectId.isValid(identifier)
    ? { _id: identifier }
    : { email: identifier };
  const user = await User.findOne(query).lean().exec() as UserType | null;
  const session = await auth();

  if (!user) {
    return <div>User not found</div>;
  }

  // Normalize possible BSON/ObjectId instances so only plain serializable data reaches client components.
  const plainUser = JSON.parse(JSON.stringify(user));

  const isOwner = String(session?.user?.id || '') === String(plainUser._id || '');
  const isPrivateProfile = !isOwner && plainUser.public === false;

  const safeUser = isOwner
    ? plainUser
    : {
        _id: plainUser._id,
        name: plainUser.name,
        image: plainUser.image,
        bio: plainUser.bio,
        college: plainUser.college,
        branch: plainUser.branch,
        year: plainUser.year,
        leetcode: plainUser.public ? plainUser.leetcode : '',
        github: plainUser.public ? plainUser.github : '',
        linkedin: plainUser.public ? plainUser.linkedin : '',
        twitter: plainUser.public ? plainUser.twitter : '',
        interests: Array.isArray(plainUser.interests) ? plainUser.interests : [],
        languages: Array.isArray(plainUser.languages) ? plainUser.languages : [],
        skills: Array.isArray((plainUser as any).skills) ? (plainUser as any).skills : [],
        public: plainUser.public,
        followerCount: Array.isArray((plainUser as any).followers) ? (plainUser as any).followers.length : 0,
      };

  return <Profile user={safeUser} isOwner={isOwner} isPrivateProfile={isPrivateProfile} />;
}