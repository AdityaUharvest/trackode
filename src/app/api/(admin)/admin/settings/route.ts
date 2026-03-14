import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import AppSettings from '@/app/model/AppSettings';
import { getSuperAdminSession } from '@/lib/superAdmin';

const DEFAULT_SETTINGS = {
  maintenanceMode: false,
  quizzesEnabled: true,
  mocksEnabled: true,
  resultsVisible: true,
  allowPublicQuizJoin: true,
  allowMockAttempts: true,
};

export async function GET() {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let settings = await AppSettings.findOne({ key: 'global' }).lean();
    if (!settings) {
      settings = await AppSettings.create({ key: 'global', ...DEFAULT_SETTINGS });
    }

    return NextResponse.json({
      success: true,
      settings: {
        ...DEFAULT_SETTINGS,
        ...settings,
      },
    });
  } catch (error) {
    console.error('Failed to fetch app settings:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { session, isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();

    await connectDB();

    const updated = await AppSettings.findOneAndUpdate(
      { key: 'global' },
      {
        $set: {
          maintenanceMode: Boolean(payload.maintenanceMode),
          quizzesEnabled: Boolean(payload.quizzesEnabled),
          mocksEnabled: Boolean(payload.mocksEnabled),
          resultsVisible: Boolean(payload.resultsVisible),
          allowPublicQuizJoin: Boolean(payload.allowPublicQuizJoin),
          allowMockAttempts: Boolean(payload.allowMockAttempts),
          updatedBy: session?.user?.email || '',
        },
      },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Failed to update app settings:', error);
    return NextResponse.json({ success: false, message: 'Failed to update settings' }, { status: 500 });
  }
}
