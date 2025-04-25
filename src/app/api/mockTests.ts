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

}) {
  await connectDB();
  const session = await auth();
  const shareCode = generateShareCode();
  
  const mockTest =  MockTest.create({
    ...data,
    isPublished: false,
    shareCode,
    createdAt: new Date(),
    createdBy: session?.user?.id,
    userPlayed:Math.floor(Math.random() * 500) + 203,
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