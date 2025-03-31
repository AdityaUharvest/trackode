import { NextResponse ,NextRequest} from 'next/server';
import MockTest from '@/app/model/MockTest';
import connectDB from '@/lib/util';

export async function GET(
  request: NextRequest,
  { params }:any
) {
  try {
    await connectDB();
    
    const mockTest = await MockTest.findById(params.id);
    
    if (!mockTest) {
      return NextResponse.json(
        { message: 'Mock test not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(mockTest);
  } catch (error) {
    console.error('Error fetching mock test:', error);
    return NextResponse.json(
      { message: 'Failed to fetch mock test' },
      { status: 500 }
    );
  }
}