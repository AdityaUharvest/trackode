import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import User from '@/app/model/User';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId?: string }> }
) {
  try {
    await connectDB();

    const { certificateId: rawCertificateId } = await params;
    const certificateId = decodeURIComponent(rawCertificateId || '').trim();
    if (!certificateId) {
      return NextResponse.json({ valid: false, message: 'Missing certificate id' }, { status: 400 });
    }

    const user = await User.findOne({
      achievements: {
        $elemMatch: {
          type: 'certificate',
          certificateId,
        },
      },
    })
      .select({ name: 1, achievements: 1 })
      .lean<any>();

    if (!user) {
      return NextResponse.json({ valid: false, message: 'Certificate not found' }, { status: 404 });
    }

    const certificate = (Array.isArray(user.achievements) ? user.achievements : []).find(
      (achievement: any) => achievement?.type === 'certificate' && achievement?.certificateId === certificateId
    );

    if (!certificate) {
      return NextResponse.json({ valid: false, message: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        certificateId,
        holderName: user.name || 'Participant',
        quizTitle: certificate.quizTitle || 'Mock Test',
        rank: Number(certificate.rank || 0),
        positionLabel: certificate.positionLabel || '',
        badgeLabel: certificate.badgeLabel || (Number(certificate.rank || 0) <= 3 ? 'Winner' : 'Participant'),
        score: Number(certificate.score || 0),
        totalQuestions: Number(certificate.totalQuestions || 0),
        percentage: Number(certificate.percentage || 0),
        issuedOn: certificate.date || null,
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json({ valid: false, message: 'Failed to verify certificate' }, { status: 500 });
  }
}
