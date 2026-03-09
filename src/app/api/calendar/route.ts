import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/calendar?month=3&year=2026
 * Returns calendar events for the current user:
 * - User's own events
 * - Site-wide events
 * - Events from courses the user is enrolled in
 * Auth required. Accepts query params: month (1-12), year.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = request.nextUrl;

    const now = new Date();
    const month = parseInt(searchParams.get('month') ?? String(now.getMonth() + 1), 10);
    const year = parseInt(searchParams.get('year') ?? String(now.getFullYear()), 10);

    // Calculate the start and end of the requested month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // Get course IDs the user is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        status: 'active',
      },
      select: {
        courseId: true,
      },
    });

    const enrolledCourseIds = enrollments.map((e) => e.courseId);

    // Fetch events: user events + site events + enrolled course events
    const events = await prisma.calendarEvent.findMany({
      where: {
        visible: true,
        timestart: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        OR: [
          { eventType: 'site' },
          { eventType: 'user', userId },
          {
            eventType: 'course',
            courseId: { in: enrolledCourseIds },
          },
        ],
      },
      include: {
        course: {
          select: { shortname: true },
        },
      },
      orderBy: {
        timestart: 'asc',
      },
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
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar events. The database may not be set up yet.' },
      { status: 500 }
    );
  }
}
