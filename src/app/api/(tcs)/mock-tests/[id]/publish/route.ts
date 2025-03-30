import { NextResponse ,NextRequest} from 'next/server';
import MockTest from '@/app/model/mockTest';
import connectDB from '@/lib/util';
export async function POST(
  request: Request,
  { params }: any 
) {
  try {
    await connectDB();
    const data = await request.json();
    
    const mockTest = await MockTest.findById(params.id);
    
    if (!mockTest) {
      return NextResponse.json(
        { message: 'Mock test not found' },
        { status: 404 }
      );
    }
    
    mockTest.isPublished = data.isPublished;
    await mockTest.save();
    
    return NextResponse.json({
      shareLink: `/playy/${mockTest.shareCode}`
    });
  } catch (error) {
    console.error('Error publishing mock test:', error);
    return NextResponse.json(
      { message: 'Failed to publish mock test' },
      { status: 500 }
    );
  }
}