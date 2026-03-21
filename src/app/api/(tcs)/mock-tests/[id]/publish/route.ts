import { NextResponse ,NextRequest} from 'next/server';
import MockTest from '@/app/model/MoockTest';
import connectDB from '@/lib/util';
import { slugify } from '@/lib/utils';
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const data = await request.json();
    const {id} = await params
    console.log('Publishing mock test with ID:', id);
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
      shareLink: `/assessment/${mockTest.shareCode}/${slugify(mockTest.title)}`,
      message: message,
      success: true,
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