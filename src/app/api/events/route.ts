import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * GET /api/events
 * Returns upcoming calendar events (timestart > now), ordered by timestart ASC, limit 10.
 * Includes course shortname if courseId exists. No auth required.
 */
export async function GET() {
  try {
    const now = new Date();

    const events = await prisma.calendarEvent.findMany({
      where: {
        timestart: {
          gt: now,
        },
        visible: true,
      },
      include: {
        course: {
          select: { shortname: true },
        },
      },
      orderBy: {
        timestart: 'asc',
      },
      take: 10,
    });

    const result = events.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      eventType: event.eventType,
      courseId: event.courseId,
      courseShortname: event.course?.shortname ?? null,
      timestart: event.timestart,
      timeduration: event.timeduration,
    }));

    return NextResponse.json({ events: result });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events. The database may not be set up yet.' },
      { status: 500 }
    );
  }
}
