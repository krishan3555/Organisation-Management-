import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST /api/admin/members/[id]/set-password
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { password } = await req.json();

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const member = await prisma.member.findUnique({ where: { id }, include: { user: true } });
    if (!member) return NextResponse.json({ error: 'Member not found.' }, { status: 404 });

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: member.userId },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('[POST set-password]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
