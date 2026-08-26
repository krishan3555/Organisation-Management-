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

// PATCH /api/admin/members/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { fullName, village, address, education, skills, membershipType, designation, status } = body;

    const member = await prisma.member.update({
      where: { id },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(village !== undefined && { village }),
        ...(address !== undefined && { address }),
        ...(education !== undefined && { education }),
        ...(skills !== undefined && { skills }),
        ...(membershipType !== undefined && { membershipType }),
        ...(designation !== undefined && { designation }),
        ...(status !== undefined && { status }),
      },
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
