import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generates the next unique member ID by finding the highest existing numeric
 * suffix across ALL existing members (any year) and incrementing it.
 * This avoids collisions when memberCount diverges from the max ID number.
 */
async function generateMemberId(): Promise<string> {
  const year = new Date().getFullYear();

  // Get all existing memberIds so we can find the highest suffix number
  const existing = await prisma.member.findMany({ select: { memberId: true } });

  let maxNum = 0;
  for (const m of existing) {
    // memberId format: NPVS-YYYY-NNNN  (last segment is the number)
    const parts = m.memberId.split('-');
    const num = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  }

  const nextNum = maxNum + 1;
  return `NPVS-${year}-${String(nextNum).padStart(4, '0')}`;
}

// ── GET /api/admin/applications/[id] ────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const application = await prisma.membershipApplication.findUnique({ where: { id } });
    if (!application) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json(application);
  } catch (err) {
    console.error('[GET /api/admin/applications/[id]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// ── PATCH /api/admin/applications/[id] — Approve or Reject ──────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, rejectionReason, password } = body;

    if (!['APPROVED', 'REJECTED'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Use APPROVED or REJECTED.' }, { status: 400 });
    }

    const application = await prisma.membershipApplication.findUnique({ where: { id } });
    if (!application) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });

    if (application.status !== 'PENDING') {
      return NextResponse.json({ error: 'This application has already been processed.' }, { status: 409 });
    }

    // ── REJECT ───────────────────────────────────────────────────────────────
    if (action === 'REJECTED') {
      const updated = await prisma.membershipApplication.update({
        where: { id },
        data: { status: 'REJECTED', rejectionReason: rejectionReason || null, reviewedAt: new Date() },
      });
      return NextResponse.json({ success: true, application: updated });
    }

    // ── APPROVE ──────────────────────────────────────────────────────────────

    // Check if this phone number already has a User account
    const existingUser = await prisma.user.findUnique({ where: { phone: application.mobile } });

    if (existingUser) {
      const existingMember = await prisma.member.findUnique({ where: { userId: existingUser.id } });

      if (existingMember) {
        return NextResponse.json(
          {
            error: `Phone number ${application.mobile} already belongs to existing member "${existingMember.fullName}". ` +
              `Ask the applicant to use a different mobile number, then try again.`,
          },
          { status: 409 }
        );
      }

      // User exists but no Member record → create only the Member
      const memberId = await generateMemberId();
      const qrToken = `${memberId}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

      const member = await prisma.member.create({
        data: {
          userId: existingUser.id,
          memberId,
          fullName: application.fullName,
          guardianName: application.guardianName || null,
          dateOfBirth: application.dateOfBirth || null,
          gender: application.gender || null,
          village: application.village || null,
          address: application.address || null,
          education: application.education || null,
          skills: application.skills || null,
          membershipType: application.requestedRole || 'Member',
          designation: application.requestedRole || 'Member',
          status: 'APPROVED',
          qrToken,
        },
      });

      await prisma.membershipApplication.update({
        where: { id },
        data: { status: 'APPROVED', rejectionReason: null, reviewedAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        member: { id: member.id, memberId: member.memberId, fullName: member.fullName },
        credentials: { phone: application.mobile, note: 'User already had an account. Member profile created.' },
      });
    }

    // No existing user → create both User and Member in a transaction
    const plainPassword =
      password && typeof password === 'string' && password.length >= 6
        ? password
        : `${application.mobile.slice(-4)}@NPVS`;

    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    // Generate a collision-proof member ID BEFORE starting the transaction
    const memberId = await generateMemberId();
    const qrToken = `${memberId}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          phone: application.mobile,
          email: application.email || null,
          password: hashedPassword,
          role: 'MEMBER',
          status: 'ACTIVE',
        },
      });

      const member = await tx.member.create({
        data: {
          userId: user.id,
          memberId,
          fullName: application.fullName,
          guardianName: application.guardianName || null,
          dateOfBirth: application.dateOfBirth || null,
          gender: application.gender || null,
          village: application.village || null,
          address: application.address || null,
          education: application.education || null,
          skills: application.skills || null,
          membershipType: application.requestedRole || 'Member',
          designation: application.requestedRole || 'Member',
          status: 'APPROVED',
          qrToken,
        },
      });

      const updatedApp = await tx.membershipApplication.update({
        where: { id },
        data: { status: 'APPROVED', rejectionReason: null, reviewedAt: new Date() },
      });

      return { user, member, application: updatedApp };
    });

    return NextResponse.json({
      success: true,
      application: result.application,
      member: { id: result.member.id, memberId: result.member.memberId, fullName: result.member.fullName },
      // Show credentials ONCE so admin can share with the new member
      credentials: { phone: application.mobile, password: plainPassword },
    });

  } catch (err: any) {
    console.error('[PATCH /api/admin/applications/[id]]', err);

    // Prisma unique-constraint violation (shouldn't happen now, but just in case)
    if (err?.code === 'P2002') {
      const field = (err?.meta?.target as string[] | undefined)?.[0] || 'field';
      return NextResponse.json(
        { error: `A record with the same ${field} already exists. Please try again.` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: err?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}