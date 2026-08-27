import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/events/register — Public event participant registration
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      eventId,
      participantName,
      mobile,
      email,
      village,
      age,
      gender,
      numberOfPeople,
      notes,
    } = body;

    if (!eventId || !participantName || !mobile) {
      return NextResponse.json(
        { error: 'Event, participant name, and mobile number are required.' },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        participantName,
        mobile,
        email: email || null,
        village: village || null,
        age: age ? parseInt(String(age), 10) : null,
        gender: gender || null,
        numberOfPeople: numberOfPeople ? Math.max(1, parseInt(String(numberOfPeople), 10)) : 1,
        notes: notes || null,
        status: 'CONFIRMED',
      },
      include: {
        event: true,
      },
    });

    const passCode = `PASS-${registration.id.slice(-6).toUpperCase()}`;

    return NextResponse.json(
      {
        success: true,
        registration: {
          id: registration.id,
          passCode,
          participantName: registration.participantName,
          mobile: registration.mobile,
          numberOfPeople: registration.numberOfPeople,
          eventTitle: registration.event.title,
          eventDate: registration.event.date,
          venue: registration.event.venue,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[POST /api/events/register Error]', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error while registering for event.' },
      { status: 500 }
    );
  }
}

// GET /api/events/register — Fetch event registrations (for Admin or Event view)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    const registrations = await prisma.eventRegistration.findMany({
      where: eventId ? { eventId } : undefined,
      include: {
        event: {
          select: { title: true, date: true, venue: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(registrations);
  } catch (err: any) {
    console.error('[GET /api/events/register Error]', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
