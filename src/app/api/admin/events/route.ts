import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/events
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = 20;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { category: { contains: search } },
        { venue: { contains: search } },
      ];
    }
    if (status) where.status = status;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({ events, total, page, pageSize });
  } catch (err) {
    console.error('[GET /api/admin/events]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST /api/admin/events — create event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title, description, category, venue, date, startTime, endTime,
      capacity, rules, eligibility, status, image
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category: category || null,
        venue: venue || null,
        date: date ? new Date(date) : null,
        startTime: startTime || null,
        endTime: endTime || null,
        capacity: capacity ? parseInt(capacity) : null,
        rules: rules || null,
        eligibility: eligibility || null,
        status: status || 'DRAFT',
        image: image || null,
      },
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/events]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
