import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import { getSuperAdminSession } from '@/lib/superAdmin';
import MockResult from '@/app/model/MockResult';

export async function POST(request: NextRequest) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const ids = Array.isArray(body?.ids)
      ? body.ids.filter((id: unknown) => typeof id === 'string' && id.trim())
      : [];

    if (ids.length === 0) {
      return NextResponse.json({ success: false, message: 'No result ids provided' }, { status: 400 });
    }

    await connectDB();

    const deletion = await MockResult.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      deletedCount: deletion.deletedCount || 0,
      message: `Deleted ${deletion.deletedCount || 0} mock result(s) successfully`,
    });
  } catch (error) {
    console.error('Failed to bulk delete mock results:', error);
    return NextResponse.json({ success: false, message: 'Failed to bulk delete mock results' }, { status: 500 });
  }
}
