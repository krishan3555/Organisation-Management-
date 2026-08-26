import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/verify/[token] — public member verification
// Accepts either qrToken or memberId as the [token] param
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { qrToken: token },
          { memberId: token },
        ],
      },
      select: {
        memberId: true,
        fullName: true,
        designation: true,
        membershipType: true,
        village: true,
        joiningDate: true,
        status: true,
        photo: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (err) {
    console.error('[GET /api/verify/[token]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
