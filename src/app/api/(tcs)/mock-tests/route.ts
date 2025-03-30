import { createMockTest } from "@/app/api/mockTests"
import { NextResponse ,NextRequest} from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const mockTest = await createMockTest(data);
    return NextResponse.json({
      id: mockTest._id,
      message: 'Mock test created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create mock test' },
      { status: 500 }
    );
  }
}