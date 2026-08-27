import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/events/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json(event);
  } catch (err) {
    console.error('[GET /api/admin/events/[id]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// PATCH /api/admin/events/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      title, description, category, venue, date, startTime, endTime,
      capacity, rules, eligibility, status, image
    } = body;

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(venue !== undefined && { venue }),
        ...(date !== undefined && { date: date ? new Date(date) : null }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(capacity !== undefined && { capacity: capacity ? parseInt(capacity) : null }),
        ...(rules !== undefined && { rules }),
        ...(eligibility !== undefined && { eligibility }),
        ...(status !== undefined && { status }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (err) {
    console.error('[PATCH /api/admin/events/[id]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// DELETE /api/admin/events/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/events/[id]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
