import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/members
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = 20;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { memberId: { contains: search } },
        { village: { contains: search } },
      ];
    }
    if (role) where.membershipType = role;
    if (status) where.status = status;

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        include: { user: true },
        orderBy: { joiningDate: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.member.count({ where }),
    ]);

    return NextResponse.json({ members, total, page, pageSize });
  } catch (err) {
    console.error('[GET /api/admin/members]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST /api/admin/members — create member directly
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, mobile, email, village, address, education, skills, membershipType, designation } = body;

    if (!fullName || !mobile) {
      return NextResponse.json({ error: 'Full name and mobile are required.' }, { status: 400 });
    }

    const memberCount = await prisma.member.count();
    const year = new Date().getFullYear();
    const memberId = `NPVS-${year}-${String(memberCount + 1).padStart(4, '0')}`;
    const qrToken = `${memberId}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    const user = await prisma.user.create({
      data: { phone: mobile, email: email || null, role: 'MEMBER', status: 'ACTIVE' },
    });

    const member = await prisma.member.create({
      data: {
        userId: user.id,
        memberId,
        fullName,
        village: village || null,
        address: address || null,
        education: education || null,
        skills: skills || null,
        membershipType: membershipType || 'Member',
        designation: designation || 'Member',
        status: 'APPROVED',
        qrToken,
      },
    });

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/members]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
