import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/members/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await prisma.member.findUnique({ where: { id }, include: { user: true } });
    if (!member) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json(member);
  } catch (err) {
    console.error('[GET /api/admin/members/[id]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// PATCH /api/admin/members/[id] — supports editing memberId, phone, email, name, role, etc.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      memberId,
      fullName,
      phone,
      email,
      village,
      address,
      education,
      skills,
      membershipType,
      designation,
      status,
    } = body;

    const existingMember = await prisma.member.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingMember) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }

    // Update associated user if phone/email/role provided
    if (phone !== undefined || email !== undefined || body.role !== undefined) {
      await prisma.user.update({
        where: { id: existingMember.userId },
        data: {
          ...(phone !== undefined && { phone }),
          ...(email !== undefined && { email }),
          ...(body.role !== undefined && { role: body.role }),
        },
      });
    }

    const member = await prisma.member.update({
      where: { id },
      data: {
        ...(memberId !== undefined && { memberId }),
        ...(fullName !== undefined && { fullName }),
        ...(village !== undefined && { village }),
        ...(address !== undefined && { address }),
        ...(education !== undefined && { education }),
        ...(skills !== undefined && { skills }),
        ...(membershipType !== undefined && { membershipType }),
        ...(designation !== undefined && { designation }),
        ...(status !== undefined && { status }),
      },
      include: { user: true },
    });

    return NextResponse.json({ success: true, member });
  } catch (err) {
    console.error('[PATCH /api/admin/members/[id]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// DELETE /api/admin/members/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.member.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/members/[id]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
