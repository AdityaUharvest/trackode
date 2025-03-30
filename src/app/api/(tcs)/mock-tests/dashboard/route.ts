import { NextResponse ,NextRequest} from 'next/server';
import MockTest from '@/app/model/mockTest';
import connectDB from '@/lib/util';
import { auth } from '@/auth';
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const creator = searchParams.get('creator');
    const session = await auth();
    const query: any = {};
    if (creator) {
      // In a real app, you'd use the authenticated user's ID
      query.createdBy = session?.user?.id;
    }
    
    const mockTests = await MockTest.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json(mockTests);
  } catch (error) {
    console.error('Error fetching mock tests:', error);
    return NextResponse.json(
      { message: 'Failed to fetch mock tests' },
      { status: 500 }
    );
  }
}