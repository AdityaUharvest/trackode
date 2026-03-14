import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import MockQuestion from '@/app/model/MockQuestions';
import MockTest from '@/app/model/MoockTest';
import { getSuperAdminSession } from '@/lib/superAdmin';

export async function GET(_request: NextRequest, { params }: any) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const targetMock = await MockTest.findById(id).select('_id title').lean();
    if (!targetMock) {
      return NextResponse.json({ success: false, message: 'Mock not found' }, { status: 404 });
    }

    const sections = await MockQuestion.aggregate([
      { $match: { mockTestId: targetMock._id } },
      { $group: { _id: '$section', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      success: true,
      sections: sections.map((item) => ({
        name: String(item._id || 'General'),
        count: Number(item.count || 0),
      })),
    });
  } catch (error) {
    console.error('Failed to fetch mock sections:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const section = (request.nextUrl.searchParams.get('section') || '').trim();

    if (!section) {
      return NextResponse.json({ success: false, message: 'Section is required' }, { status: 400 });
    }

    const deleted = await MockQuestion.deleteMany({ mockTestId: id, section });

    return NextResponse.json({
      success: true,
      message: `Removed section "${section}"`,
      deletedCount: deleted.deletedCount || 0,
    });
  } catch (error) {
    console.error('Failed to remove section from mock:', error);
    return NextResponse.json({ success: false, message: 'Failed to remove section' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: any) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const payload = await request.json();

    const sourceMockId = String(payload?.sourceMockId || '').trim();
    const sourceSection = String(payload?.sourceSection || '').trim();
    const replaceExisting = Boolean(payload?.replaceExisting);

    if (!sourceMockId || !sourceSection) {
      return NextResponse.json(
        { success: false, message: 'sourceMockId and sourceSection are required' },
        { status: 400 }
      );
    }

    const [targetMock, sourceMock] = await Promise.all([
      MockTest.findById(id).select('_id').lean(),
      MockTest.findById(sourceMockId).select('_id').lean(),
    ]);

    if (!targetMock) {
      return NextResponse.json({ success: false, message: 'Target mock not found' }, { status: 404 });
    }
    if (!sourceMock) {
      return NextResponse.json({ success: false, message: 'Source mock not found' }, { status: 404 });
    }

    const sourceQuestions = await MockQuestion.find({
      mockTestId: sourceMock._id,
      section: sourceSection,
    }).lean();

    if (sourceQuestions.length === 0) {
      return NextResponse.json({ success: false, message: 'No questions found in source section' }, { status: 404 });
    }

    const existingCount = await MockQuestion.countDocuments({ mockTestId: targetMock._id, section: sourceSection });

    if (existingCount > 0 && !replaceExisting) {
      return NextResponse.json(
        {
          success: false,
          message: `Section "${sourceSection}" already exists in target mock`,
          code: 'SECTION_EXISTS',
        },
        { status: 409 }
      );
    }

    if (replaceExisting) {
      await MockQuestion.deleteMany({ mockTestId: targetMock._id, section: sourceSection });
    }

    const clonedDocs = sourceQuestions.map((question: any) => ({
      mockTestId: targetMock._id,
      section: sourceSection,
      text: question.text,
      options: Array.isArray(question.options) ? question.options : [],
      correctAnswer: question.correctAnswer,
      createdAt: new Date(),
    }));

    await MockQuestion.insertMany(clonedDocs);

    return NextResponse.json({
      success: true,
      message: `Imported ${clonedDocs.length} questions into section "${sourceSection}"`,
      importedCount: clonedDocs.length,
    });
  } catch (error) {
    console.error('Failed to import section into mock:', error);
    return NextResponse.json({ success: false, message: 'Failed to import section' }, { status: 500 });
  }
}
