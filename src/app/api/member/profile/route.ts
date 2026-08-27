import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/member/profile - get logged-in member's profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
      include: { user: true },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member profile not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (err: any) {
    console.error('[GET /api/member/profile]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/member/profile - update logged-in member's profile (including photo)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { photo, fullName, guardianName, village, address, education, skills, occupation } = body;

    const existingMember = await prisma.member.findUnique({
      where: { userId: session.user.id },
    });

    if (!existingMember) {
      return NextResponse.json({ error: 'Member profile not found' }, { status: 404 });
    }

    const updatedMember = await prisma.member.update({
      where: { id: existingMember.id },
      data: {
        ...(photo !== undefined && { photo }),
        ...(fullName && { fullName }),
        ...(guardianName !== undefined && { guardianName }),
        ...(village !== undefined && { village }),
        ...(address !== undefined && { address }),
        ...(education !== undefined && { education }),
        ...(skills !== undefined && { skills }),
        ...(occupation !== undefined && { occupation }),
      },
      include: { user: true },
    });

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (err: any) {
    console.error('[PATCH /api/member/profile]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
