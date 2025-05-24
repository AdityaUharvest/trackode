import MockTest from '@/app/model/MoockTest'
import connectDB from '@/lib/util';
import { generateShareCode } from "@/app/api/generateShareCode"
import { auth } from '@/auth';
export async function createMockTest(data: {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  public: boolean;
  userPlayed?: number;
  tag: string;
  creator: string;

}) {
  await connectDB();
  const session = await auth();
  const shareCode = generateShareCode();
  const userPlayed = Math.floor(Math.random() * 1001) + 500; 
  const difficulty = Math.random() < 0.33 ? 'Easy' : Math.random() < 0.66 ? 'Medium' : 'Hard';
  const user = session?.user?.name // Fallback if session is not available
  const mockTest =  MockTest.create({
    ...data,
    isPublished: false,
    shareCode,
    createdAt: new Date(),
    createdBy: session?.user?.id,
    userPlayed: userPlayed,
    difficulty: difficulty,
    creator: user || 'Anonymous',
    
  });
  
  
  return mockTest;
}

export async function getMockTest(id: string) {
  await connectDB();
  return MockTest.findById(id);
}

export async function publishMockTest(id: string) {
  await connectDB();
  
  const mockTest = await MockTest.findById(id);
  if (!mockTest) throw new Error('Mock test not found');
  
  mockTest.isPublished = true;
  await mockTest.save();
  
  return {
    shareLink: `${process.env.NEXT_PUBLIC_BASE_URL}/take-test/${mockTest.shareCode}`
  };
}