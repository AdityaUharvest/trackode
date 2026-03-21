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

  const name = user?.name || 'Trackode User';
  const description = user?.bio ? `${name}'s professional profile and coding journey on Trackode. ${user.bio.substring(0, 100)}...` : `Check out ${name}'s coding progress, achievements, and technical expertise on Trackode.`;
  const profileUrl = `https://trackode.in/profile/${identifier}`;

  return {
    title: `${name} | Trackode Developer Profile`,
    description,
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      title: `${name} - Developer Profile`,
      description,
      url: profileUrl,
      siteName: 'Trackode',
      images: [
        {
          url: user?.image || 'https://trackode.in/og-image.png',
          width: 800,
          height: 800,
          alt: `${name}'s Profile Image`,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${name}'s Coding Profile`,
      description,
      images: [user?.image || 'https://trackode.in/og-image.png'],
    },
    robots: {
      index: user?.public !== false,
      follow: true,
    }
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