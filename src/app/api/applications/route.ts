import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function generateMemberId(): Promise<string> {
  const year = new Date().getFullYear();
  const existing = await prisma.member.findMany({ select: { memberId: true } });

  let maxNum = 0;
  for (const m of existing) {
    const parts = m.memberId.split('-');
    const num = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  }

  const nextNum = maxNum + 1;
  return `NPVS-${year}-${String(nextNum).padStart(4, '0')}`;
}

// POST /api/applications — Submit & Auto-Approve Registration instantly (No admin approval required)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      guardianName,
      mobile,
      email,
      village,
      address,
      education,
      skills,
      reason,
      requestedRole,
      gender,
      dateOfBirth,
      photo,
    } = body;

    if (!fullName || !mobile) {
      return NextResponse.json({ error: 'Full name and mobile number are required.' }, { status: 400 });
    }

    const sanitizedMobile = mobile.replace(/\D/g, '').slice(-10);
    if (sanitizedMobile.length < 10) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    // Check if user account already exists with this phone number
    const existingUser = await prisma.user.findUnique({
      where: { phone: sanitizedMobile },
      include: { member: true },
    });

    if (existingUser) {
      if (existingUser.member) {
        return NextResponse.json(
          {
            error: `An account already exists for phone +91 ${sanitizedMobile} (Member ID: ${existingUser.member.memberId}). Please sign in using your password.`,
          },
          { status: 409 }
        );
      }
    }

    // Generate credentials & Member ID
    const plainPassword = `${sanitizedMobile.slice(-4)}@NPVS`;
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    const memberId = await generateMemberId();
    const qrToken = `${memberId}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const dob = dateOfBirth ? new Date(dateOfBirth) : null;

    // Execute instant auto-approval transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create or link User
      const user = existingUser
        ? await tx.user.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword, role: 'MEMBER', status: 'ACTIVE' },
          })
        : await tx.user.create({
            data: {
              phone: sanitizedMobile,
              email: email || null,
              password: hashedPassword,
              role: 'MEMBER',
              status: 'ACTIVE',
            },
          });

      // 2. Create Member Profile (Instantly APPROVED)
      const member = await tx.member.create({
        data: {
          userId: user.id,
          memberId,
          fullName,
          guardianName: guardianName || null,
          dateOfBirth: dob,
          gender: gender || null,
          village: village || null,
          address: address || null,
          photo: photo || null,
          education: education || null,
          skills: skills || null,
          membershipType: requestedRole || 'Member',
          designation: requestedRole || 'Member',
          status: 'APPROVED',
          qrToken,
        },
      });

      // 3. Record Application as APPROVED
      const application = await tx.membershipApplication.create({
        data: {
          fullName,
          guardianName: guardianName || null,
          mobile: sanitizedMobile,
          email: email || null,
          village: village || null,
          address: address || null,
          photo: photo || null,
          education: education || null,
          skills: skills || null,
          reason: reason || null,
          requestedRole: requestedRole || 'Member',
          gender: gender || null,
          dateOfBirth: dob,
          status: 'APPROVED',
          reviewedAt: new Date(),
        },
      });

      return { user, member, application };
    });

    return NextResponse.json(
      {
        success: true,
        autoApproved: true,
        memberId: result.member.memberId,
        phone: sanitizedMobile,
        password: plainPassword,
        fullName: result.member.fullName,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[POST /api/applications Auto-Approve Error]', err);

    if (err?.code === 'P2002') {
      return NextResponse.json(
        { error: 'An account with this phone number or ID already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: err?.message || 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}

// GET /api/applications — List applications for admin review
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
