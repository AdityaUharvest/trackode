import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import { getSuperAdminSession } from '@/lib/superAdmin';
import MockResult from '@/app/model/MockResult';

type EditableSection = {
  sectionName: string;
  correct: number;
};

function sanitizeSectionMarks(
  incoming: EditableSection[] | undefined,
  existingSections: Array<{ sectionName: string; correct: number; total: number; questions?: unknown[] }>
) {
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return existingSections;
  }

  const updates = new Map(
    incoming
      .filter((s) => typeof s?.sectionName === 'string')
      .map((s) => [s.sectionName.trim().toLowerCase(), Number(s.correct)])
  );

  return existingSections.map((section) => {
    const key = String(section.sectionName || '').trim().toLowerCase();
    const candidate = updates.get(key);

    if (typeof candidate !== 'number' || Number.isNaN(candidate)) {
      return section;
    }

    const bounded = Math.max(0, Math.min(section.total || 0, Math.floor(candidate)));
    return {
      ...section,
      correct: bounded,
    };
  });
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing result id' }, { status: 400 });
    }

    await connectDB();

    const result = await MockResult.findById(id)
      .populate('userId', 'name email')
      .populate('quizId', 'title')
      .lean();

    if (!result) {
      return NextResponse.json({ success: false, message: 'Result not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Failed to fetch mock result details:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch result details' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing result id' }, { status: 400 });
    }

    const body = await request.json();
    await connectDB();

    const existing = await MockResult.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Result not found' }, { status: 404 });
    }

    const nextSections = sanitizeSectionMarks(body?.sections, existing.sections || []);
    const totalQuestions = nextSections.reduce((sum: number, section: any) => sum + (section.total || 0), 0);
    const totalScore = nextSections.reduce((sum: number, section: any) => sum + (section.correct || 0), 0);
    const percentage = totalQuestions > 0 ? Number(((totalScore / totalQuestions) * 100).toFixed(2)) : 0;

    existing.sections = nextSections as any;
    existing.totalScore = totalScore;
    existing.totalQuestions = totalQuestions;
    existing.percentage = percentage;

    if (body?.completedAt) {
      const completedAt = new Date(body.completedAt);
      if (!Number.isNaN(completedAt.getTime())) {
        existing.completedAt = completedAt;
      }
    }

    if (typeof body?.quizTitle === 'string' && body.quizTitle.trim()) {
      existing.quizTitle = body.quizTitle.trim();
    }

    await existing.save();

    const updated = await MockResult.findById(id)
      .populate('userId', 'name email')
      .populate('quizId', 'title')
      .lean();

    return NextResponse.json({ success: true, result: updated, message: 'Result updated successfully' });
  } catch (error) {
    console.error('Failed to update mock result:', error);
    return NextResponse.json({ success: false, message: 'Failed to update result' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing result id' }, { status: 400 });
    }

    await connectDB();

    const existing = await MockResult.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Result not found' }, { status: 404 });
    }

    await MockResult.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Failed to delete mock result:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete result' }, { status: 500 });
  }
}
