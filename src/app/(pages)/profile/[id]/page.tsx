import { Metadata } from 'next';
import User from '@/app/model/User';
import connectDB from '@/lib/util';
import Profile from '@/components/Profile';

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
  const userEmail = params.id.replace(/%40/g, '@');
  
  // Type the user document
  const user = await User.findOne({ email: userEmail }).lean().exec() as UserType | null;

  return {
    title: `${user?.name || 'User'}'s Profile`,
    description: user?.bio || 'Profile page',
  };
}

export default async function Page({ params }: any) {
  await connectDB();
  const userEmail = params.id.replace(/%40/g, '@');
  
  // Type the user document
  const user = await User.findOne({ email: userEmail }).lean().exec() as UserType | null;

  if (!user) {
    return <div>User not found</div>;
  }

  return <Profile user={user} />;
}