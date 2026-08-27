import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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

// POST /api/admin/members — create member directly (supports isAdmin flag)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      mobile,
      email,
      village,
      address,
      education,
      skills,
      membershipType,
      designation,
      isAdmin,       // boolean — if true, creates an ADMIN user
      password,      // optional initial password
      photo,         // optional photo url
    } = body;

    if (!fullName || !mobile) {
      return NextResponse.json({ error: 'Full name and mobile are required.' }, { status: 400 });
    }

    const userRole = isAdmin ? 'ADMIN' : 'MEMBER';

    // Hash password if provided
    let hashedPassword: string | null = null;
    if (password && password.length >= 6) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Generate collision-proof member ID by finding the highest existing number
    const existingMembers = await prisma.member.findMany({ select: { memberId: true } });
    let maxNum = 0;
    for (const m of existingMembers) {
      const parts = m.memberId.split('-');
      const num = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
    const year = new Date().getFullYear();
    const memberId = `NPVS-${year}-${String(maxNum + 1).padStart(4, '0')}`;
    const qrToken = `${memberId}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    const user = await prisma.user.create({
      data: {
        phone: mobile,
        email: email || null,
        role: userRole,
        status: 'ACTIVE',
        password: hashedPassword,
      },
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
        membershipType: membershipType || (isAdmin ? 'Employee' : 'Member'),
        designation: designation || (isAdmin ? 'Admin' : 'Member'),
        status: 'APPROVED',
        qrToken,
        photo: photo || null,
      },
    });

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/members]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
