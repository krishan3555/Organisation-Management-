import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/applications/[id] — approve or reject an application
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, rejectionReason } = body; // action: 'APPROVED' | 'REJECTED'

    if (!['APPROVED', 'REJECTED'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Use APPROVED or REJECTED.' }, { status: 400 });
    }

    const application = await prisma.membershipApplication.findUnique({ where: { id } });
    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }
    if (application.status !== 'PENDING') {
      return NextResponse.json({ error: 'Application is not pending.' }, { status: 409 });
    }

    const updated = await prisma.membershipApplication.update({
      where: { id },
      data: {
        status: action,
        rejectionReason: action === 'REJECTED' ? (rejectionReason || null) : null,
        reviewedAt: new Date(),
      },
    });

    // If approved, create User + Member records
    if (action === 'APPROVED') {
      // Count members to generate ID
      const memberCount = await prisma.member.count();
      const year = new Date().getFullYear();
      const memberId = `NPVS-${year}-${String(memberCount + 1).padStart(4, '0')}`;
      const qrToken = `${memberId}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

      // Create user (phone-based)
      const user = await prisma.user.create({
        data: {
          phone: application.mobile,
          email: application.email || null,
          role: 'MEMBER',
          status: 'ACTIVE',
        },
      });

      // Create member
      await prisma.member.create({
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
          status: 'APPROVED',
          qrToken,
        },
      });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (err) {
    console.error('[PATCH /api/admin/applications/[id]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// GET /api/admin/applications/[id]
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
