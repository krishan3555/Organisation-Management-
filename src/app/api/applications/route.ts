import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/applications — submit a membership application
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { fullName, guardianName, mobile, email, village, address, education, skills, reason, requestedRole, gender, dateOfBirth } = body;

    if (!fullName || !mobile) {
      return NextResponse.json({ error: 'Full name and mobile number are required.' }, { status: 400 });
    }

    const application = await prisma.membershipApplication.create({
      data: {
        fullName,
        guardianName: guardianName || null,
        mobile,
        email: email || null,
        village: village || null,
        address: address || null,
        education: education || null,
        skills: skills || null,
        reason: reason || null,
        requestedRole: requestedRole || 'Member',
        gender: gender || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, id: application.id }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/applications]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// GET /api/applications — list applications (admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const applications = await prisma.membershipApplication.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(applications);
  } catch (err) {
    console.error('[GET /api/applications]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
