import { NextResponse ,NextRequest} from 'next/server';
import MockTest from '@/app/model/MoockTest';
import connectDB from '@/lib/util';
export async function POST(
  request: Request,
  { params }: any 
) {
  try {
    await connectDB();
    const data = await request.json();
    const {id} = await params
    console.log(id)
    const mockTest = await MockTest.findById(id);
    
    if (!mockTest) {
      return NextResponse.json(
        { message: 'Mock test not found' },
        { status: 404 }
      );
    } 
    let message = 'Mock test published successfully!';
    if(mockTest.isPublished) {
      message = 'Mock test unpublished successfully!';
    }
    mockTest.isPublished = data.isPublished;
    await mockTest.save();
    
    return NextResponse.json(
      {
      shareLink: `/playy/${mockTest.shareCode}`,
      message: message,
      }
      
    
  );
  } catch (error) {
    console.error('Error publishing mock test:', error);
    return NextResponse.json(
      { message: 'Failed to publish mock test' },
      { status: 500 }
    );
  }
}